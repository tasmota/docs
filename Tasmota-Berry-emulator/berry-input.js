/**
 * BerryInput - Interactive Berry code input for debugging
 * 
 * Provides a text input field below the console for executing arbitrary Berry code.
 * Features:
 * - Multi-line input with textarea
 * - Double-Enter to execute (single Enter adds newline)
 * - Command history with up/down arrow navigation
 * - Auto-clear after successful execution
 * - Output displayed in console panel
 * 
 * Part of the Berry Animation Framework Browser Simulator.
 * Requirements: 8.5.1
 */

class BerryInput {
    /**
     * Create a new Berry input component
     * @param {Object} options - Configuration options
     * @param {string} options.inputId - ID for the textarea element
     * @param {number} options.maxHistory - Maximum history entries (default 50)
     * @param {Function} options.onExecute - Callback when code is executed
     */
    constructor(options = {}) {
        this.inputId = options.inputId || 'berry-input';
        this.maxHistory = options.maxHistory || 50;
        this.onExecute = options.onExecute || null;
        
        // State
        this.history = [];
        this.historyIndex = -1;
        this.currentInput = '';
        this.lastKeyTime = 0;
        this.lastKeyWasEnter = false;
        
        // DOM elements
        this.textarea = null;
        this.hintEl = null;
        this.runButton = null;
        
        // Initialize
        this._init();
    }
    
    /**
     * Initialize the component
     * @private
     */
    _init() {
        // Get references to existing DOM elements
        this.textarea = document.getElementById(this.inputId);
        
        if (!this.textarea) {
            console.warn('BerryInput: Textarea not found:', this.inputId);
            return;
        }
        
        // Find hint and button elements (siblings of textarea)
        const parent = this.textarea.parentElement;
        if (parent) {
            this.hintEl = parent.querySelector('.berry-input-hint');
            this.runButton = document.getElementById('berry-input-run-btn') || 
                           parent.querySelector('.berry-input-run-btn');
        }
        
        // Set up event listeners
        this._setupEventListeners();
        
        // Load history from localStorage
        this._loadHistory();
    }
    
    /**
     * Set up event listeners
     * @private
     */
    _setupEventListeners() {
        if (!this.textarea) return;
        
        // Key down handler for special keys
        this.textarea.addEventListener('keydown', (e) => this._handleKeyDown(e));
        
        // Input handler for tracking changes
        this.textarea.addEventListener('input', () => {
            // Reset history navigation when user types
            if (this.historyIndex !== -1) {
                this.historyIndex = -1;
            }
        });
        
        // Run button click handler
        if (this.runButton) {
            this.runButton.addEventListener('click', () => this._executeCode());
        }
    }
    
    /**
     * Handle keydown events
     * @private
     * @param {KeyboardEvent} e - Keyboard event
     */
    _handleKeyDown(e) {
        const now = Date.now();
        
        // Handle Enter key for double-Enter execution
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
            // Check if this is a double-Enter (within 500ms)
            if (this.lastKeyWasEnter && (now - this.lastKeyTime) < 500) {
                e.preventDefault();
                this._executeCode();
                this.lastKeyWasEnter = false;
                return;
            }
            
            this.lastKeyWasEnter = true;
            this.lastKeyTime = now;
            // Allow the Enter to create a newline
            return;
        }
        
        // Reset Enter tracking for other keys
        this.lastKeyWasEnter = false;
        
        // Handle Up arrow for history navigation
        if (e.key === 'ArrowUp' && this._isCursorAtStart()) {
            e.preventDefault();
            this._navigateHistory(1);
            return;
        }
        
        // Handle Down arrow for history navigation
        if (e.key === 'ArrowDown' && this._isCursorAtEnd()) {
            e.preventDefault();
            this._navigateHistory(-1);
            return;
        }
        
        // Handle Ctrl+Enter for immediate execution
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            this._executeCode();
            return;
        }
    }
    
    /**
     * Check if cursor is at the start of the textarea
     * @private
     * @returns {boolean}
     */
    _isCursorAtStart() {
        return this.textarea.selectionStart === 0 && this.textarea.selectionEnd === 0;
    }
    
    /**
     * Check if cursor is at the end of the textarea
     * @private
     * @returns {boolean}
     */
    _isCursorAtEnd() {
        const len = this.textarea.value.length;
        return this.textarea.selectionStart === len && this.textarea.selectionEnd === len;
    }
    
    /**
     * Navigate through command history
     * @private
     * @param {number} direction - 1 for older (up arrow), -1 for newer (down arrow)
     */
    _navigateHistory(direction) {
        if (this.history.length === 0) return;
        
        // Save current input if starting navigation
        if (this.historyIndex === -1) {
            this.currentInput = this.textarea.value;
        }
        
        // Calculate new index
        let newIndex = this.historyIndex + direction;
        
        // Clamp to valid range
        if (newIndex < -1) newIndex = -1;
        if (newIndex >= this.history.length) newIndex = this.history.length - 1;
        
        this.historyIndex = newIndex;
        
        // Update textarea
        if (this.historyIndex === -1) {
            // Back to current input
            this.textarea.value = this.currentInput;
        } else {
            // Show history entry (newest first, so reverse index)
            const historyEntry = this.history[this.history.length - 1 - this.historyIndex];
            this.textarea.value = historyEntry;
        }
        
        // Position cursor based on navigation direction:
        // - Up arrow (direction=1, going to older): cursor at beginning
        // - Down arrow (direction=-1, going to newer): cursor at end
        // This allows repeatedly using up/down arrows to navigate
        if (direction > 0) {
            // Up arrow - cursor at beginning
            this.textarea.selectionStart = 0;
            this.textarea.selectionEnd = 0;
        } else {
            // Down arrow - cursor at end
            this.textarea.selectionStart = this.textarea.value.length;
            this.textarea.selectionEnd = this.textarea.value.length;
        }
    }
    
    /**
     * Execute the current code
     * @private
     */
    async _executeCode() {
        const code = this.textarea.value.trim();
        
        if (!code) {
            return;
        }
        
        // Remove trailing newline from double-Enter
        const cleanCode = code.replace(/\n$/, '');
        
        // Log the command being executed
        this._logCommand(cleanCode);
        
        // Add to history
        this._addToHistory(cleanCode);
        
        // Execute the code
        let success = false;
        try {
            success = await this._executeBerryCode(cleanCode);
        } catch (error) {
            this._logError('Execution error: ' + error.message);
        }
        
        // Clear input after execution (both success and error)
        // The command is already in history, so user can retrieve it with up arrow
        this.textarea.value = '';
        this.historyIndex = -1;
        this.currentInput = '';
        
        // Call the onExecute callback if provided
        if (this.onExecute) {
            this.onExecute(cleanCode, success);
        }
    }
    
    /**
     * Execute Berry code using the BerryVM
     * @private
     * @param {string} code - Berry code to execute
     * @returns {Promise<boolean>} True if execution succeeded
     */
    async _executeBerryCode(code) {
        // Check if BerryVM is available
        if (!window.berryVM) {
            this._logError('Berry VM not available');
            return false;
        }
        
        // Wait for VM to be ready
        try {
            await window.berryVM.waitReady();
        } catch (e) {
            this._logError('Berry VM not ready: ' + e.message);
            return false;
        }
        
        // Execute the code and get the result
        const result = await window.berryVM.executeWithResult(code);
        
        if (result.success) {
            // If result is not null/nil, display it
            if (result.result !== null && result.result !== undefined) {
                this._logResult(result.result);
            }
            return true;
        } else {
            // Error message should already be logged by Berry VM
            // But add a fallback just in case
            if (result.error) {
                this._logError(result.error);
            }
            return false;
        }
    }
    
    /**
     * Log a result value to the console
     * @private
     * @param {any} value - Result value to display
     */
    _logResult(value) {
        if (window.consoleManager) {
            // Format the result for display
            let displayValue;
            if (typeof value === 'string') {
                displayValue = value;
            } else if (typeof value === 'object') {
                displayValue = JSON.stringify(value);
            } else {
                displayValue = String(value);
            }
            window.consoleManager.log(displayValue);
        }
    }
    
    /**
     * Log a command to the console
     * @private
     * @param {string} code - Code being executed
     */
    _logCommand(code) {
        if (window.consoleManager) {
            // Show the command with a distinctive prefix
            const lines = code.split('\n');
            if (lines.length === 1) {
                window.consoleManager.log('> ' + code);
            } else {
                window.consoleManager.log('> ' + lines[0]);
                for (let i = 1; i < lines.length; i++) {
                    window.consoleManager.log('. ' + lines[i]);
                }
            }
        }
    }
    
    /**
     * Log an error to the console
     * @private
     * @param {string} message - Error message
     */
    _logError(message) {
        if (window.consoleManager) {
            window.consoleManager.error(message);
        }
    }
    
    /**
     * Add a command to history
     * @private
     * @param {string} code - Code to add
     */
    _addToHistory(code) {
        // Don't add duplicates of the last entry
        if (this.history.length > 0 && this.history[this.history.length - 1] === code) {
            return;
        }
        
        this.history.push(code);
        
        // Trim history if too long
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
        
        // Reset history index
        this.historyIndex = -1;
        this.currentInput = '';
        
        // Save to localStorage
        this._saveHistory();
    }
    
    /**
     * Save history to localStorage
     * @private
     */
    _saveHistory() {
        try {
            localStorage.setItem('berry-input-history', JSON.stringify(this.history));
        } catch (e) {
            // localStorage might not be available
        }
    }
    
    /**
     * Load history from localStorage
     * @private
     */
    _loadHistory() {
        try {
            const saved = localStorage.getItem('berry-input-history');
            if (saved) {
                this.history = JSON.parse(saved);
            }
        } catch (e) {
            // localStorage might not be available or data corrupted
            this.history = [];
        }
    }
    
    /**
     * Clear the input
     */
    clear() {
        if (this.textarea) {
            this.textarea.value = '';
            this.historyIndex = -1;
            this.currentInput = '';
        }
    }
    
    /**
     * Clear the command history
     */
    clearHistory() {
        this.history = [];
        this.historyIndex = -1;
        this.currentInput = '';
        this._saveHistory();
    }
    
    /**
     * Get the current input value
     * @returns {string}
     */
    getValue() {
        return this.textarea ? this.textarea.value : '';
    }
    
    /**
     * Set the input value
     * @param {string} value - Value to set
     */
    setValue(value) {
        if (this.textarea) {
            this.textarea.value = value;
        }
    }
    
    /**
     * Focus the input
     */
    focus() {
        if (this.textarea) {
            this.textarea.focus();
        }
    }
}

// Global berry input instance
window.berryInput = null;

/**
 * Initialize the global Berry input
 * @param {Object} options - Configuration options
 * @returns {BerryInput} The initialized Berry input
 */
window.initBerryInput = function(options = {}) {
    window.berryInput = new BerryInput(options);
    return window.berryInput;
};

// Export for Node.js/CommonJS (for testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BerryInput };
}
