/**
 * CodeEditor - Custom syntax highlighting code editor for Berry Simulator
 * Tasmota-themed with DSL and Berry language support
 * 
 * Features:
 * - Token-based syntax highlighting (no external dependencies)
 * - DSL and Berry language modes with separate buffers
 * - Error line highlighting
 * - Resizable via CSS resize: both
 * - Code change callbacks
 * - Dual buffer support: separate DSL and Berry code buffers
 * - Auto-display of transpiled Berry code when switching to Berry mode
 */

(function(window) {
    'use strict';

    /**
     * Token definitions for DSL language
     */
    var DSL_TOKENS = {
        comment: /^#.*/,
        string: /^"(?:[^"\\]|\\.)*"|^'(?:[^'\\]|\\.)*'/,
        number: /^-?\d+(?:\.\d+)?(?:ms|s|%)?/,
        keyword: /^(?:animation|sequence|template|layer|color|palette|gradient|oscillator|provider|import|from|as|if|else|while|for|in|end|def|return|true|false|nil|run)\b/,
        builtin: /^(?:solid|pulse|breathe|fire|comet|sparkle|wave|beacon|rainbow|chase|twinkle|meteor|wipe|fade|blend|cycle|random)\b/,
        property: /^(?:color|colors|speed|brightness|width|decay|density|direction|offset|delay|duration|repeat|blend_mode|start|stop|step|hue|saturation|value|red|green|blue|alpha|position|size|count|interval|probability|range|min|max|default)\b/,
        color: /^(?:red|green|blue|yellow|cyan|magenta|white|black|orange|purple|pink|lime|aqua|navy|maroon|olive|teal|silver|gray|gold)\b/,
        operator: /^(?:->|=>|<=|>=|==|!=|&&|\|\||[+\-*\/%=<>!&|^~])/,
        punctuation: /^[{}()\[\]:,;.]/,
        identifier: /^[a-zA-Z_][a-zA-Z0-9_]*/
    };

    /**
     * Token definitions for Berry language
     */
    var BERRY_TOKENS = {
        comment: /^#.*/,
        string: /^"(?:[^"\\]|\\.)*"|^'(?:[^'\\]|\\.)*'/,
        number: /^-?(?:0x[0-9a-fA-F]+|\d+(?:\.\d+)?(?:e[+-]?\d+)?)/,
        keyword: /^(?:if|elif|else|while|for|break|continue|return|def|end|class|var|import|as|try|except|raise|true|false|nil|self|super|static|do)\b/,
        builtin: /^(?:print|type|classname|classof|str|int|real|number|list|map|range|bytes|size|assert|compile|call|module|input|super|isinstance|issubclass)\b/,
        operator: /^(?:->|=>|<=|>=|==|!=|&&|\|\||<<|>>|[+\-*\/%=<>!&|^~])/,
        punctuation: /^[{}()\[\]:,;.]/,
        identifier: /^[a-zA-Z_][a-zA-Z0-9_]*/
    };


    /**
     * CodeEditor class
     * @param {Object} options - Configuration options
     * @param {string} options.containerId - ID of the container element
     * @param {string} options.initialLanguage - 'dsl' or 'berry'
     * @param {string} options.initialCode - Initial code content
     * @param {Function} options.onChange - Callback when code changes
     */
    function CodeEditor(options) {
        this.options = options || {};
        this.container = document.getElementById(options.containerId);
        this.currentLanguage = options.initialLanguage || 'dsl';
        this.errorLines = [];
        this.onChangeCallback = options.onChange || null;
        this.debounceTimer = null;
        
        // Dual buffer support: separate buffers for DSL and Berry code
        this.buffers = {
            dsl: '',
            berry: ''
        };
        
        // Track if Berry buffer contains transpiled code (read-only indicator)
        this.berryIsTranspiled = false;
        
        // Track the last DSL code that was transpiled
        this.lastTranspiledDSL = '';
        
        if (!this.container) {
            console.error('CodeEditor: Container not found:', options.containerId);
            return;
        }
        
        this.createEditorStructure();
        this.setupEventListeners();
        
        // Set initial code if provided
        if (options.initialCode) {
            this.setCode(options.initialCode);
            // Store in the appropriate buffer
            this.buffers[this.currentLanguage] = options.initialCode;
        }
    }

    /**
     * Create the editor DOM structure
     * Uses overlay technique: transparent textarea over highlighted pre element
     */
    CodeEditor.prototype.createEditorStructure = function() {
        // Clear container
        this.container.innerHTML = '';
        this.container.className = 'code-editor-container';
        
        // Create wrapper for the editor area (for resize)
        this.editorWrapper = document.createElement('div');
        this.editorWrapper.className = 'code-editor-wrapper';
        
        // Create highlighted code display (background)
        this.highlightPre = document.createElement('pre');
        this.highlightPre.className = 'code-editor-highlight';
        this.highlightPre.setAttribute('aria-hidden', 'true');
        
        this.highlightCode = document.createElement('code');
        this.highlightPre.appendChild(this.highlightCode);
        
        // Create textarea for input (foreground, transparent)
        this.textarea = document.createElement('textarea');
        this.textarea.className = 'code-editor-textarea';
        this.textarea.spellcheck = false;
        this.textarea.autocomplete = 'off';
        this.textarea.autocapitalize = 'off';
        this.textarea.setAttribute('wrap', 'off');
        
        // Assemble editor
        this.editorWrapper.appendChild(this.highlightPre);
        this.editorWrapper.appendChild(this.textarea);
        this.container.appendChild(this.editorWrapper);
    };

    /**
     * Setup event listeners for the editor
     */
    CodeEditor.prototype.setupEventListeners = function() {
        var self = this;
        
        // Input event for real-time highlighting
        this.textarea.addEventListener('input', function() {
            self.highlightSyntax();
            self.triggerOnChange();
        });
        
        // Scroll sync between textarea and highlight
        this.textarea.addEventListener('scroll', function() {
            self.highlightPre.scrollTop = self.textarea.scrollTop;
            self.highlightPre.scrollLeft = self.textarea.scrollLeft;
        });
        
        // Tab key handling (insert spaces instead of changing focus)
        this.textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                var start = self.textarea.selectionStart;
                var end = self.textarea.selectionEnd;
                var value = self.textarea.value;
                
                // Insert 2 spaces
                self.textarea.value = value.substring(0, start) + '  ' + value.substring(end);
                self.textarea.selectionStart = self.textarea.selectionEnd = start + 2;
                
                self.highlightSyntax();
                self.triggerOnChange();
            }
        });
        
        // Initial highlight
        this.highlightSyntax();
    };

    /**
     * Trigger onChange callback with debouncing
     */
    CodeEditor.prototype.triggerOnChange = function() {
        var self = this;
        
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        
        this.debounceTimer = setTimeout(function() {
            if (self.onChangeCallback) {
                self.onChangeCallback(self.getCode(), self.currentLanguage);
            }
        }, 150);
    };


    /**
     * Tokenize and highlight code
     */
    CodeEditor.prototype.highlightSyntax = function() {
        var code = this.textarea.value;
        var tokens = this.currentLanguage === 'berry' ? BERRY_TOKENS : DSL_TOKENS;
        var lines = code.split('\n');
        var highlightedLines = [];
        
        for (var lineNum = 0; lineNum < lines.length; lineNum++) {
            var line = lines[lineNum];
            var highlightedLine = this.tokenizeLine(line, tokens);
            
            // Check if this line has an error
            var hasError = this.errorLines.indexOf(lineNum + 1) !== -1;
            
            if (hasError) {
                highlightedLine = '<span class="code-error-line">' + highlightedLine + '</span>';
            }
            
            highlightedLines.push(highlightedLine);
        }
        
        // Add extra newline at end to match textarea behavior
        this.highlightCode.innerHTML = highlightedLines.join('\n') + '\n';
    };

    /**
     * Tokenize a single line of code
     * @param {string} line - Line of code to tokenize
     * @param {Object} tokens - Token definitions
     * @returns {string} HTML with syntax highlighting spans
     */
    CodeEditor.prototype.tokenizeLine = function(line, tokens) {
        var result = '';
        var remaining = line;
        
        while (remaining.length > 0) {
            var matched = false;
            
            // Skip whitespace
            var wsMatch = remaining.match(/^\s+/);
            if (wsMatch) {
                result += this.escapeHtml(wsMatch[0]);
                remaining = remaining.substring(wsMatch[0].length);
                continue;
            }
            
            // Try each token type
            for (var tokenType in tokens) {
                var regex = tokens[tokenType];
                var match = remaining.match(regex);
                
                if (match) {
                    var tokenValue = match[0];
                    result += '<span class="code-' + tokenType + '">' + this.escapeHtml(tokenValue) + '</span>';
                    remaining = remaining.substring(tokenValue.length);
                    matched = true;
                    break;
                }
            }
            
            // If no token matched, output character as-is
            if (!matched) {
                result += this.escapeHtml(remaining[0]);
                remaining = remaining.substring(1);
            }
        }
        
        return result;
    };

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    CodeEditor.prototype.escapeHtml = function(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    /**
     * Get the current code
     * @returns {string} Current code content
     */
    CodeEditor.prototype.getCode = function() {
        return this.textarea.value;
    };

    /**
     * Get the DSL code buffer (always returns DSL code, even if viewing Berry)
     * @returns {string} DSL code content
     */
    CodeEditor.prototype.getDSLCode = function() {
        // If currently in DSL mode, return current textarea value
        if (this.currentLanguage === 'dsl') {
            return this.textarea.value;
        }
        // Otherwise return the stored DSL buffer
        return this.buffers.dsl;
    };

    /**
     * Get the Berry code buffer
     * @returns {string} Berry code content
     */
    CodeEditor.prototype.getBerryCode = function() {
        // If currently in Berry mode, return current textarea value
        if (this.currentLanguage === 'berry') {
            return this.textarea.value;
        }
        // Otherwise return the stored Berry buffer
        return this.buffers.berry;
    };

    /**
     * Set the code content
     * @param {string} code - Code to set
     */
    CodeEditor.prototype.setCode = function(code) {
        this.textarea.value = code || '';
        // Update the current buffer
        this.buffers[this.currentLanguage] = code || '';
        this.clearErrors();
        this.highlightSyntax();
    };

    /**
     * Set the Berry code buffer (used for transpiled code)
     * @param {string} code - Berry code to set
     * @param {boolean} isTranspiled - Whether this is transpiled from DSL
     */
    CodeEditor.prototype.setBerryCode = function(code, isTranspiled) {
        this.buffers.berry = code || '';
        this.berryIsTranspiled = isTranspiled || false;
        
        // If currently viewing Berry, update the display
        if (this.currentLanguage === 'berry') {
            this.textarea.value = code || '';
            this.highlightSyntax();
        }
    };

    /**
     * Set the DSL code buffer
     * @param {string} code - DSL code to set
     */
    CodeEditor.prototype.setDSLCode = function(code) {
        this.buffers.dsl = code || '';
        
        // If currently viewing DSL, update the display
        if (this.currentLanguage === 'dsl') {
            this.textarea.value = code || '';
            this.highlightSyntax();
        }
    };

    /**
     * Get the current language
     * @returns {string} 'dsl' or 'berry'
     */
    CodeEditor.prototype.getLanguage = function() {
        return this.currentLanguage;
    };

    /**
     * Set the language mode and switch buffers
     * @param {string} lang - 'dsl' or 'berry'
     * @param {boolean} skipBufferSwitch - If true, don't switch buffers (used internally)
     */
    CodeEditor.prototype.setLanguage = function(lang, skipBufferSwitch) {
        if (lang !== 'dsl' && lang !== 'berry') return;
        if (lang === this.currentLanguage) return;
        
        if (!skipBufferSwitch) {
            // Save current buffer before switching
            this.buffers[this.currentLanguage] = this.textarea.value;
            
            // Load the new buffer
            this.textarea.value = this.buffers[lang] || '';
        }
        
        this.currentLanguage = lang;
        this.clearErrors();
        this.highlightSyntax();
        
        // Update read-only state for Berry transpiled code
        this._updateReadOnlyState();
    };

    /**
     * Update read-only state based on whether Berry code is transpiled
     * @private
     */
    CodeEditor.prototype._updateReadOnlyState = function() {
        // If viewing transpiled Berry code, make it read-only with visual indicator
        if (this.currentLanguage === 'berry' && this.berryIsTranspiled) {
            this.textarea.classList.add('transpiled-readonly');
            // Don't make it actually readonly - user might want to edit
            // Just add visual indicator
        } else {
            this.textarea.classList.remove('transpiled-readonly');
        }
    };

    /**
     * Check if the Berry buffer contains transpiled code
     * @returns {boolean}
     */
    CodeEditor.prototype.isBerryTranspiled = function() {
        return this.berryIsTranspiled;
    };

    /**
     * Clear the transpiled flag (when user edits Berry code directly)
     */
    CodeEditor.prototype.clearTranspiledFlag = function() {
        this.berryIsTranspiled = false;
        this._updateReadOnlyState();
    };

    /**
     * Get the last DSL code that was transpiled
     * @returns {string}
     */
    CodeEditor.prototype.getLastTranspiledDSL = function() {
        return this.lastTranspiledDSL;
    };

    /**
     * Set the last transpiled DSL code
     * @param {string} dslCode
     */
    CodeEditor.prototype.setLastTranspiledDSL = function(dslCode) {
        this.lastTranspiledDSL = dslCode || '';
    };

    /**
     * Show error on specific lines
     * @param {number|number[]} lines - Line number(s) with errors (1-indexed)
     * @param {string} message - Error message (optional)
     */
    CodeEditor.prototype.showError = function(lines, message) {
        this.errorLines = Array.isArray(lines) ? lines : [lines];
        this.highlightSyntax();
        
        // Scroll to first error line
        if (this.errorLines.length > 0) {
            this.scrollToLine(this.errorLines[0]);
        }
    };

    /**
     * Clear all error highlights
     */
    CodeEditor.prototype.clearErrors = function() {
        this.errorLines = [];
        this.highlightSyntax();
    };

    /**
     * Scroll to a specific line
     * @param {number} lineNum - Line number (1-indexed)
     */
    CodeEditor.prototype.scrollToLine = function(lineNum) {
        var lineHeight = parseInt(getComputedStyle(this.textarea).lineHeight) || 18;
        var scrollTop = (lineNum - 1) * lineHeight;
        this.textarea.scrollTop = scrollTop;
    };

    /**
     * Set the onChange callback
     * @param {Function} callback - Function to call when code changes
     */
    CodeEditor.prototype.setOnChange = function(callback) {
        this.onChangeCallback = callback;
    };

    /**
     * Focus the editor
     */
    CodeEditor.prototype.focus = function() {
        this.textarea.focus();
    };

    /**
     * Get cursor position
     * @returns {Object} {line, column} (1-indexed)
     */
    CodeEditor.prototype.getCursorPosition = function() {
        var pos = this.textarea.selectionStart;
        var text = this.textarea.value.substring(0, pos);
        var lines = text.split('\n');
        return {
            line: lines.length,
            column: lines[lines.length - 1].length + 1
        };
    };


    /**
     * Initialize code editor with language toggle
     * @param {Object} options - Configuration options
     * @param {string} options.containerId - ID of the container element
     * @param {string} options.radioGroupName - Name of the radio button group for language toggle
     * @param {string} options.initialLanguage - 'dsl' or 'berry'
     * @param {string} options.initialCode - Initial code content
     * @param {Function} options.onChange - Callback when code changes
     * @param {Function} options.onLanguageChange - Callback when language changes (lang, editor)
     * @returns {CodeEditor} Editor instance
     */
    function initCodeEditor(options) {
        var editor = new CodeEditor(options);
        
        // Store onLanguageChange callback
        editor.onLanguageChangeCallback = options.onLanguageChange || null;
        
        // Setup language toggle if radio group name provided
        if (options.radioGroupName) {
            var radios = document.querySelectorAll('input[name="' + options.radioGroupName + '"]');
            radios.forEach(function(radio) {
                radio.addEventListener('change', function(e) {
                    if (e.target.checked) {
                        var newLang = e.target.value;
                        var oldLang = editor.getLanguage();
                        
                        // Switch language (this handles buffer switching)
                        editor.setLanguage(newLang);
                        
                        if (window.consoleManager) {
                            window.consoleManager.info('Language mode: ' + newLang.toUpperCase());
                            
                            // Show info about transpiled code
                            if (newLang === 'berry' && editor.isBerryTranspiled()) {
                                window.consoleManager.info('Showing transpiled Berry code from DSL');
                            }
                        }
                        
                        // Call language change callback
                        if (editor.onLanguageChangeCallback) {
                            editor.onLanguageChangeCallback(newLang, editor);
                        }
                    }
                });
                
                // Set initial checked state
                if (radio.value === options.initialLanguage) {
                    radio.checked = true;
                }
            });
        }
        
        return editor;
    }

    // Export to window
    window.CodeEditor = CodeEditor;
    window.initCodeEditor = initCodeEditor;

})(window);
