/**
 * AnimationLibrary Component - Tasmota Style
 * 
 * Provides a browsable library of example animations organized by category.
 * Features:
 * - Category organization with nested fieldsets
 * - Search functionality with Tasmota input styling
 * - Example list items styled as Tasmota buttons
 * - Load example code into editor on selection
 * 
 * Requirements: 9.3, 13.1, 8.4
 */

(function(window) {
    'use strict';

    /**
     * AnimationLibrary - UI component for browsing animation examples
     */
    class AnimationLibrary {
        /**
         * Create a new AnimationLibrary
         * @param {Object} options - Configuration options
         * @param {string} options.containerId - ID of container element
         * @param {Function} options.onSelect - Callback when example is selected
         * @param {boolean} options.collapsed - Start collapsed (default: true)
         */
        constructor(options = {}) {
            this.options = Object.assign({
                containerId: 'animation-library-container',
                onSelect: null,
                collapsed: true
            }, options);
            
            this.container = null;
            this.searchInput = null;
            this.categoryContainers = {};
            this.exampleButtons = [];
            this.isExpanded = !this.options.collapsed;
            this.selectedExampleId = null;
            
            this._init();
        }

        /**
         * Initialize the library component
         * @private
         */
        _init() {
            this.container = document.getElementById(this.options.containerId);
            if (!this.container) {
                console.warn('[AnimationLibrary] Container not found:', this.options.containerId);
                return;
            }
            
            this._render();
            this._bindEvents();
        }

        /**
         * Render the library UI
         * @private
         */
        _render() {
            // Get examples from the global animationExamples
            const examples = window.animationExamples ? window.animationExamples.getAll() : [];
            const categories = window.animationExamples ? window.animationExamples.getCategories() : [];
            
            // Build HTML
            let html = '';
            
            // Header with toggle and search (entire row is clickable)
            html += '<div class="library-header">';
            html += '<div class="library-header-row" id="library-header-row">';
            html += '<span class="library-toggle" id="library-toggle">';
            html += this.isExpanded ? '▼' : '▶';
            html += '</span>';
            html += '<span class="library-title"><b>Examples</b></span>';
            html += '<span class="library-count">' + examples.length + ' animations</span>';
            html += '</div>';
            html += '</div>';
            
            // Collapsible content
            html += '<div class="library-content" id="library-content" style="display:' + (this.isExpanded ? 'block' : 'none') + ';">';
            
            // Search input
            html += '<div class="library-search">';
            html += '<input type="text" id="library-search-input" placeholder="Search animations..." autocomplete="off">';
            html += '</div>';
            
            // Categories
            if (categories.length > 0) {
                for (const category of categories) {
                    const categoryExamples = window.animationExamples.getByCategory(category);
                    if (categoryExamples.length === 0) continue;
                    
                    html += '<div class="library-category" data-category="' + this._escapeHtml(category) + '">';
                    html += '<div class="library-category-header">';
                    html += '<span class="library-category-name"><b>' + this._escapeHtml(category) + '</b></span>';
                    html += '<span class="library-category-count">(' + categoryExamples.length + ')</span>';
                    html += '</div>';
                    html += '<div class="library-category-items">';
                    
                    for (const example of categoryExamples) {
                        html += this._renderExampleButton(example);
                    }
                    
                    html += '</div>';
                    html += '</div>';
                }
            } else {
                // No categories - flat list
                html += '<div class="library-items">';
                for (const example of examples) {
                    html += this._renderExampleButton(example);
                }
                html += '</div>';
            }
            
            // No results message (hidden by default)
            html += '<div class="library-no-results" id="library-no-results" style="display:none;">';
            html += 'No animations found';
            html += '</div>';
            
            html += '</div>'; // library-content
            
            this.container.innerHTML = html;
            
            // Store references
            this.searchInput = document.getElementById('library-search-input');
            this.contentDiv = document.getElementById('library-content');
            this.toggleBtn = document.getElementById('library-toggle');
            this.noResultsDiv = document.getElementById('library-no-results');
            
            // Store category containers
            const categoryDivs = this.container.querySelectorAll('.library-category');
            categoryDivs.forEach(div => {
                const category = div.getAttribute('data-category');
                this.categoryContainers[category] = div;
            });
            
            // Store example buttons
            this.exampleButtons = Array.from(this.container.querySelectorAll('.library-example-btn'));
        }

        /**
         * Render a single example button
         * @private
         * @param {Object} example - Example object
         * @returns {string} HTML string
         */
        _renderExampleButton(example) {
            let html = '<button type="button" class="library-example-btn" ';
            html += 'data-example-id="' + this._escapeHtml(example.id) + '" ';
            html += 'title="' + this._escapeHtml(example.description) + '">';
            // Show number before name if available
            if (example.number) {
                html += '<span class="library-example-number">' + this._escapeHtml(example.number) + '</span>';
            }
            html += '<span class="library-example-name">' + this._escapeHtml(example.name) + '</span>';
            html += '<span class="library-example-desc">' + this._escapeHtml(this._truncate(example.description, 50)) + '</span>';
            html += '</button>';
            return html;
        }

        /**
         * Bind event handlers
         * @private
         */
        _bindEvents() {
            const self = this;
            
            // Make entire header row clickable for toggle
            var headerRow = document.getElementById('library-header-row');
            if (headerRow) {
                headerRow.addEventListener('click', function() {
                    self.toggle();
                });
            }
            
            // Search input
            if (this.searchInput) {
                this.searchInput.addEventListener('input', function() {
                    self._onSearch(this.value);
                });
                
                // Clear search on Escape
                this.searchInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') {
                        this.value = '';
                        self._onSearch('');
                    }
                });
            }
            
            // Example button clicks (event delegation)
            this.container.addEventListener('click', function(e) {
                const btn = e.target.closest('.library-example-btn');
                if (btn) {
                    const exampleId = btn.getAttribute('data-example-id');
                    self._onExampleSelect(exampleId, btn);
                }
            });
        }

        /**
         * Handle search input
         * @private
         * @param {string} query - Search query
         */
        _onSearch(query) {
            const q = query.toLowerCase().trim();
            let visibleCount = 0;
            
            // Filter examples
            this.exampleButtons.forEach(btn => {
                const exampleId = btn.getAttribute('data-example-id');
                const example = window.animationExamples ? window.animationExamples.getById(exampleId) : null;
                
                if (!example) {
                    btn.style.display = 'none';
                    return;
                }
                
                const matches = q === '' || 
                    example.name.toLowerCase().includes(q) ||
                    example.description.toLowerCase().includes(q) ||
                    example.category.toLowerCase().includes(q);
                
                btn.style.display = matches ? '' : 'none';
                if (matches) visibleCount++;
            });
            
            // Update category visibility
            Object.keys(this.categoryContainers).forEach(category => {
                const container = this.categoryContainers[category];
                const items = container.querySelectorAll('.library-example-btn');
                const visibleItems = Array.from(items).filter(btn => btn.style.display !== 'none');
                container.style.display = visibleItems.length > 0 ? '' : 'none';
            });
            
            // Show/hide no results message
            if (this.noResultsDiv) {
                this.noResultsDiv.style.display = visibleCount === 0 && q !== '' ? 'block' : 'none';
            }
        }

        /**
         * Handle example selection
         * @private
         * @param {string} exampleId - Example ID
         * @param {HTMLElement} btn - Button element
         */
        _onExampleSelect(exampleId, btn) {
            const example = window.animationExamples ? window.animationExamples.getById(exampleId) : null;
            if (!example) return;
            
            // Update selection state
            this.exampleButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            this.selectedExampleId = exampleId;
            
            // Load into editor
            if (window.codeEditor) {
                // Set DSL code
                window.codeEditor.setDSLCode(example.code);
                // Switch to DSL mode
                window.codeEditor.setLanguage('dsl');
                
                // Log to console
                if (window.consoleManager) {
                    window.consoleManager.info('Loaded example: ' + example.name);
                }
            }
            
            // Call callback
            if (typeof this.options.onSelect === 'function') {
                this.options.onSelect(example);
            }
            
            // Trigger Compile & Run via AnimationControls
            if (window.animationControls) {
                // Small delay to ensure editor is updated
                setTimeout(function() {
                    window.animationControls._handleCompile(true);  // true = run after compile
                }, 50);
            }
        }

        /**
         * Toggle expand/collapse
         */
        toggle() {
            this.isExpanded = !this.isExpanded;
            
            if (this.contentDiv) {
                this.contentDiv.style.display = this.isExpanded ? 'block' : 'none';
            }
            
            if (this.toggleBtn) {
                this.toggleBtn.textContent = this.isExpanded ? '▼' : '▶';
            }
        }

        /**
         * Expand the library
         */
        expand() {
            if (!this.isExpanded) {
                this.toggle();
            }
        }

        /**
         * Collapse the library
         */
        collapse() {
            if (this.isExpanded) {
                this.toggle();
            }
        }

        /**
         * Get currently selected example
         * @returns {Object|null} Selected example or null
         */
        getSelectedExample() {
            if (!this.selectedExampleId) return null;
            return window.animationExamples ? window.animationExamples.getById(this.selectedExampleId) : null;
        }

        /**
         * Select an example by ID
         * @param {string} exampleId - Example ID to select
         */
        selectExample(exampleId) {
            const btn = this.container.querySelector('.library-example-btn[data-example-id="' + exampleId + '"]');
            if (btn) {
                this._onExampleSelect(exampleId, btn);
            }
        }

        /**
         * Refresh the library (reload examples)
         */
        refresh() {
            this._render();
            this._bindEvents();
        }

        /**
         * Escape HTML special characters
         * @private
         * @param {string} str - String to escape
         * @returns {string} Escaped string
         */
        _escapeHtml(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        /**
         * Truncate string to max length
         * @private
         * @param {string} str - String to truncate
         * @param {number} maxLen - Maximum length
         * @returns {string} Truncated string
         */
        _truncate(str, maxLen) {
            if (!str || str.length <= maxLen) return str;
            return str.substring(0, maxLen - 3) + '...';
        }
    }

    // Export to window
    window.AnimationLibrary = AnimationLibrary;

    /**
     * Initialize the animation library
     * @param {Object} options - Configuration options
     * @returns {AnimationLibrary} Library instance
     */
    window.initAnimationLibrary = function(options = {}) {
        const library = new AnimationLibrary(options);
        window.animationLibrary = library;
        return library;
    };

})(window);
