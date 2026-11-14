/**
 * StickyLED - Handles sticky positioning for LED strip visualization
 * 
 * Features:
 * - LED strip floats at top of viewport when scrolled out of view
 * - Smooth transitions between normal and sticky modes
 */
class StickyLED {
    /**
     * Create a new StickyLED controller
     * @param {Object} options - Configuration options
     * @param {string} options.containerId - ID of the LED container element
     * @param {string} options.placeholderId - ID of the placeholder element
     * @param {number} options.stickyThreshold - Pixels scrolled before becoming sticky (default: 0)
     * @param {boolean} options.enabled - Whether sticky mode is enabled (default: true)
     */
    constructor(options = {}) {
        this.containerId = options.containerId || 'led-container';
        this.placeholderId = options.placeholderId || 'led-placeholder';
        this.stickyThreshold = options.stickyThreshold || 0;
        this.enabled = options.enabled !== false;
        
        // State
        this.isSticky = false;
        
        // DOM elements
        this.container = null;
        this.placeholder = null;
        
        // Bound event handlers
        this._onScroll = this._onScroll.bind(this);
        this._onResize = this._onResize.bind(this);
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this._init());
        } else {
            this._init();
        }
    }
    
    /**
     * Initialize the sticky LED controller
     * @private
     */
    _init() {
        // Get DOM elements
        this.container = document.getElementById(this.containerId);
        this.placeholder = document.getElementById(this.placeholderId);
        
        if (!this.container) {
            console.warn('StickyLED: Container element not found:', this.containerId);
            return;
        }
        
        // Store original position info
        this._updateOriginalPosition();
        
        // Add event listeners
        window.addEventListener('scroll', this._onScroll, { passive: true });
        window.addEventListener('resize', this._onResize, { passive: true });
        
        // Initial check
        this._onScroll();
    }
    
    /**
     * Update stored original position of the container
     * @private
     */
    _updateOriginalPosition() {
        if (!this.container || this.isSticky) return;
        
        const rect = this.container.getBoundingClientRect();
        this.originalTop = rect.top + window.scrollY;
        this.originalLeft = rect.left + window.scrollX;
        this.originalWidth = rect.width;
        this.originalHeight = rect.height;
    }
    
    /**
     * Handle scroll events
     * @private
     */
    _onScroll() {
        if (!this.enabled || !this.container) return;
        
        // Get the reference position (either container or placeholder if sticky)
        const referenceEl = this.isSticky ? this.placeholder : this.container;
        const rect = referenceEl.getBoundingClientRect();
        
        // Sticky when scrolled past the top of the container
        const shouldBeSticky = rect.top < this.stickyThreshold;
        
        // Update sticky state if changed
        if (shouldBeSticky !== this.isSticky) {
            if (shouldBeSticky) {
                this._enableSticky();
            } else {
                this._disableSticky();
            }
        }
    }
    
    /**
     * Handle resize events
     * @private
     */
    _onResize() {
        if (!this.container) return;
        
        if (this.isSticky && this.placeholder) {
            // When sticky, get new position from placeholder (which follows page layout)
            var rect = this.placeholder.getBoundingClientRect();
            this.originalLeft = rect.left + window.scrollX;
            // Update container position
            this.container.style.left = this.originalLeft + 'px';
        } else {
            // Update original position if not sticky
            this._updateOriginalPosition();
        }
    }
    
    /**
     * Enable sticky mode
     * @private
     */
    _enableSticky() {
        if (this.isSticky || !this.container) return;
        
        this.isSticky = true;
        
        // Update original position before going sticky
        this._updateOriginalPosition();
        
        // Set placeholder size to maintain layout
        if (this.placeholder) {
            this._updatePlaceholderSize();
            this.placeholder.classList.add('active');
        }
        
        // Apply fixed position at original location
        this.container.style.left = this.originalLeft + 'px';
        this.container.style.width = this.originalWidth + 'px';
        
        // Add sticky class
        this.container.classList.add('sticky-horizontal');
        
        // Dispatch event
        this._dispatchEvent('stickychange', { isSticky: true });
    }
    
    /**
     * Disable sticky mode
     * @private
     */
    _disableSticky() {
        if (!this.isSticky || !this.container) return;
        
        this.isSticky = false;
        
        // Remove sticky class
        this.container.classList.remove('sticky-horizontal');
        
        // Remove fixed positioning styles
        this.container.style.left = '';
        this.container.style.width = '';
        
        // Hide placeholder
        if (this.placeholder) {
            this.placeholder.classList.remove('active');
        }
        
        // Dispatch event
        this._dispatchEvent('stickychange', { isSticky: false });
    }
    
    /**
     * Update placeholder size to match container
     * @private
     */
    _updatePlaceholderSize() {
        if (!this.placeholder) return;
        
        this.placeholder.style.width = this.originalWidth + 'px';
        this.placeholder.style.height = this.originalHeight + 'px';
    }
    
    /**
     * Dispatch a custom event
     * @private
     * @param {string} name - Event name
     * @param {Object} detail - Event detail data
     */
    _dispatchEvent(name, detail) {
        if (this.container) {
            this.container.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
        }
    }
    
    /**
     * Enable sticky functionality
     */
    enable() {
        this.enabled = true;
        this._onScroll();
    }
    
    /**
     * Disable sticky functionality
     */
    disable() {
        this.enabled = false;
        this._disableSticky();
    }
    
    /**
     * Check if currently in sticky mode
     * @returns {boolean}
     */
    isStickyMode() {
        return this.isSticky;
    }
    
    /**
     * Force update (call after canvas resize)
     */
    update() {
        if (!this.isSticky) {
            this._updateOriginalPosition();
        }
        this._onScroll();
    }
    
    /**
     * Destroy the sticky controller and clean up
     */
    destroy() {
        window.removeEventListener('scroll', this._onScroll);
        window.removeEventListener('resize', this._onResize);
        this._disableSticky();
    }
}

/**
 * Initialize the global sticky LED controller
 * @param {Object} options - Configuration options
 * @returns {StickyLED} The initialized controller instance
 */
window.initStickyLED = function(options = {}) {
    window.stickyLED = new StickyLED(options);
    return window.stickyLED;
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StickyLED;
}
