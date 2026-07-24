/**
 * LED Strip API for Berry Animation Framework
 * 
 * This module provides JavaScript functions that Berry code can call to interact
 * with the LED strip visualization in the browser. It's designed to be used by
 * both the main simulator (index.html) and test pages.
 * 
 * Functions exposed to Berry via the `js` module:
 * - renderLEDStrip(hexString): Display frame buffer on canvas
 * - getStripSize(): Get the configured LED strip size
 * 
 * Usage:
 *   1. Load this file before berry.js
 *   2. Initialize with: window.ledStripAPI.init(config)
 *   3. Berry code can then call: js.get_strip_size() and js.frame_buffer_display()
 * 
 * Canvas Management:
 *   This module handles ALL canvas sizing and rendering logic:
 *   - setPixelSize(size): Set pixel dimension directly
 *   - setPixelSizeMode(mode): Set mode ('small', 'medium', 'large')
 *   - calculatePixelSize(mode, ledCount): Calculate optimal pixel size
 *   - Responsive canvas sizing with max-width constraints
 */

(function() {
    'use strict';

    // Pixel size mode configurations
    var PIXEL_SIZE_MODES = {
        small: { base: 4, min: 2, max: 8 },
        medium: { base: 10, min: 4, max: 16 },
        large: { base: 16, min: 8, max: 24 }
    };

    // Default max canvas width for responsive sizing
    var DEFAULT_MAX_WIDTH = 700;

    // LED Strip API state
    var ledStripAPI = {
        // Configuration
        stripLength: 30,
        pixelSize: 10,
        pixelSizeMode: 'medium',
        ledSpacing: 2,
        reversed: false,
        maxCanvasWidth: DEFAULT_MAX_WIDTH,
        canvasId: 'ledCanvas',
        backgroundColor: '#000000',  // Pure black, can be overridden with CSS var
        brightness: 100,  // Brightness percentage (0-200, 100 = normal)
        
        // Canvas context (set during init)
        canvas: null,
        ctx: null,
        imageData: null,
        
        // Callback for rendering (can be overridden by host page)
        onRender: null,
        
        // Performance monitoring
        enablePerformanceMonitoring: false,
        onPerformanceUpdate: null,
        _frameCount: 0,
        _lastFPSUpdate: 0,
        _fps: 0,
        _lastFrameTime: 0,
        
        /**
         * Initialize the LED Strip API
         * @param {Object} config - Configuration object
         * @param {number} config.stripLength - Number of LEDs (default: 30)
         * @param {number} config.pixelSize - Size of each pixel in canvas (default: 10)
         * @param {string} config.pixelSizeMode - Size mode: 'small', 'medium', 'large' (default: 'medium')
         * @param {number} config.ledSpacing - Gap between LEDs in pixels (default: 2)
         * @param {boolean} config.reversed - If true, render right-to-left (default: false)
         * @param {number} config.maxCanvasWidth - Maximum canvas width in pixels (default: 700)
         * @param {string} config.canvasId - ID of canvas element (default: 'ledCanvas')
         * @param {string} config.backgroundColor - Background color (default: '#1a1a1a')
         * @param {Function} config.onRender - Optional callback when rendering
         * @param {boolean} config.enablePerformanceMonitoring - Enable FPS tracking (default: false)
         * @param {Function} config.onPerformanceUpdate - Callback for performance metrics
         * @returns {boolean} true on success, false on error
         */
        init: function(config) {
            if (config) {
                if (config.stripLength !== undefined) {
                    this.stripLength = config.stripLength;
                }
                if (config.pixelSize !== undefined) {
                    this.pixelSize = config.pixelSize;
                }
                if (config.pixelSizeMode !== undefined) {
                    this.pixelSizeMode = config.pixelSizeMode;
                }
                if (config.ledSpacing !== undefined) {
                    this.ledSpacing = config.ledSpacing;
                }
                if (config.reversed !== undefined) {
                    this.reversed = config.reversed;
                }
                if (config.maxCanvasWidth !== undefined) {
                    this.maxCanvasWidth = config.maxCanvasWidth;
                }
                if (config.canvasId !== undefined) {
                    this.canvasId = config.canvasId;
                }
                if (config.backgroundColor !== undefined) {
                    this.backgroundColor = config.backgroundColor;
                }
                if (config.onRender !== undefined) {
                    this.onRender = config.onRender;
                }
                if (config.enablePerformanceMonitoring !== undefined) {
                    this.enablePerformanceMonitoring = config.enablePerformanceMonitoring;
                }
                if (config.onPerformanceUpdate !== undefined) {
                    this.onPerformanceUpdate = config.onPerformanceUpdate;
                }
            }
            
            // Reset performance counters
            this._frameCount = 0;
            this._lastFPSUpdate = performance.now();
            this._fps = 0;
            this._lastFrameTime = 0;
            
            // Get canvas element
            this.canvas = document.getElementById(this.canvasId);
            if (!this.canvas) {
                console.error('[LEDStripAPI] Canvas element not found:', this.canvasId);
                return false;
            }
            
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) {
                console.error('[LEDStripAPI] Failed to get canvas context');
                return false;
            }
            
            // Calculate initial pixel size based on mode if not explicitly set
            if (config && config.pixelSizeMode && !config.pixelSize) {
                this.pixelSize = this.calculatePixelSize(this.pixelSizeMode, this.stripLength);
            }
            
            // Update canvas size
            this._updateCanvasSize();
            
            // Create image data for efficient rendering
            this.imageData = this.ctx.createImageData(
                this.canvas.width,
                this.canvas.height
            );
            
            // Clear canvas
            this.clear();
            
            console.log('[LEDStripAPI] Initialized with', this.stripLength, 'LEDs, pixel size:', this.pixelSize + 'px');
            return true;
        },
        
        /**
         * Calculate pixel size based on mode and LED count
         * Adapts pixel size to fit reasonably on screen
         * @param {string} mode - 'small', 'medium', 'large'
         * @param {number} ledCount - Number of LEDs
         * @returns {number} Pixel size in pixels
         */
        calculatePixelSize: function(mode, ledCount) {
            var config = PIXEL_SIZE_MODES[mode] || PIXEL_SIZE_MODES.medium;
            var pixelSize = config.base;
            
            // Adapt based on LED count to keep reasonable canvas width
            var spacing = this.ledSpacing || 2;
            var maxPixelSize = Math.floor((this.maxCanvasWidth / ledCount) - spacing);
            
            // Clamp to mode's min/max range
            pixelSize = Math.min(pixelSize, maxPixelSize);
            pixelSize = Math.max(config.min, Math.min(config.max, pixelSize));
            
            return pixelSize;
        },
        
        /**
         * Update canvas size based on LED count and pixel size
         * @private
         */
        _updateCanvasSize: function() {
            if (!this.canvas) return;
            
            var ledTotalSize = this.pixelSize + this.ledSpacing;
            var calculatedWidth = this.stripLength * ledTotalSize - this.ledSpacing;
            
            // Apply max-width constraint
            this.canvas.width = Math.min(calculatedWidth, this.maxCanvasWidth);
            this.canvas.height = this.pixelSize;
        },
        
        /**
         * Parse CSS color string to RGB components
         * @private
         * @param {string} colorStr - CSS color string (e.g., '#1a1a1a')
         * @returns {Object} Object with r, g, b properties
         */
        _parseColor: function(colorStr) {
            if (colorStr && colorStr.startsWith('#')) {
                var hex = colorStr.slice(1);
                return {
                    r: parseInt(hex.substring(0, 2), 16),
                    g: parseInt(hex.substring(2, 4), 16),
                    b: parseInt(hex.substring(4, 6), 16)
                };
            }
            return { r: 26, g: 26, b: 26 }; // Default dark background
        },
        
        /**
         * Clear the canvas with background color
         */
        clear: function() {
            if (!this.ctx || !this.canvas) return;
            
            this.ctx.fillStyle = this.backgroundColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Reset image data to background
            if (this.imageData) {
                var bgColor = this._parseColor(this.backgroundColor);
                var data = this.imageData.data;
                for (var i = 0; i < data.length; i += 4) {
                    data[i] = bgColor.r;
                    data[i + 1] = bgColor.g;
                    data[i + 2] = bgColor.b;
                    data[i + 3] = 255;
                }
            }
        },

        /**
         * Draw a single LED at the specified position
         * Converts ARGB (0xAARRGGBB) to RGBA for canvas rendering.
         * @private
         * @param {number} x - X position in LED grid (0-based)
         * @param {number} color - 32-bit ARGB color value
         */
        _drawLED: function(x, color) {
            if (!this.imageData || !this.canvas) return;
            
            // Extract ARGB components from 32-bit color
            // Format: 0xAARRGGBB
            var a = (color >>> 24) & 0xFF;  // Use >>> for unsigned shift
            var r = (color >> 16) & 0xFF;
            var g = (color >> 8) & 0xFF;
            var b = color & 0xFF;
            
            // Calculate LED position on canvas
            var ledTotalSize = this.pixelSize + this.ledSpacing;
            var canvasX;
            
            // If reversed, flip the x position
            if (this.reversed) {
                canvasX = (this.stripLength - 1 - x) * ledTotalSize;
            } else {
                canvasX = x * ledTotalSize;
            }
            
            // Draw the LED as a filled rectangle in the image data
            for (var dy = 0; dy < this.pixelSize; dy++) {
                for (var dx = 0; dx < this.pixelSize; dx++) {
                    var px = canvasX + dx;
                    var py = dy;
                    
                    // Bounds check
                    if (px >= 0 && px < this.canvas.width && 
                        py >= 0 && py < this.canvas.height) {
                        var idx = (py * this.canvas.width + px) * 4;
                        
                        // Set RGBA values (canvas uses RGBA, not ARGB)
                        this.imageData.data[idx] = r;
                        this.imageData.data[idx + 1] = g;
                        this.imageData.data[idx + 2] = b;
                        this.imageData.data[idx + 3] = a;
                    }
                }
            }
        },
        
        /**
         * Render LED strip from hex color string
         * Called by Berry: js.frame_buffer_display(hexString)
         * 
         * @param {string} hexString - Hex string with 6 chars per color (RRGGBB format)
         * @return {boolean} true on success, false on error
         */
        renderLEDStrip: function(hexString) {
            if (!this.canvas || !this.ctx) {
                console.error('[LEDStripAPI] Canvas not initialized');
                return false;
            }
            
            // Guard against undefined, null, or non-string input
            if (hexString === undefined || hexString === null) {
                // Silently return - no frame buffer to render
                return true;
            }
            
            // Convert to string if needed (e.g., if passed a number)
            if (typeof hexString !== 'string') {
                hexString = String(hexString);
            }
            
            // Empty string is valid - just clear the canvas
            if (hexString.length === 0) {
                this.clear();
                return true;
            }
            
            try {
                // Clear to background first
                this.clear();
                
                // Parse hex string to colors (6 hex chars = 3 bytes = 1 RGB color)
                // Format: RRGGBBRRGGBB... (no alpha channel)
                var colors = [];
                for (var i = 0; i < hexString.length; i += 6) {
                    var hex = hexString.substring(i, i + 6);
                    if (hex.length === 6) {
                        // Parse RGB and add full alpha (0xFF) to make ARGB
                        var rgb = parseInt(hex, 16);
                        var color = 0xFF000000 | rgb;  // Add alpha = 255
                        colors.push(color);
                    }
                }
                
                // Update strip length if colors array differs
                if (colors.length > 0 && colors.length !== this.stripLength) {
                    // Optionally update strip length from incoming data
                    // This allows dynamic strip size changes
                }
                
                // Calculate how many LEDs we can display
                var ledTotalSize = this.pixelSize + this.ledSpacing;
                var displayCount = Math.min(colors.length, Math.floor(this.canvas.width / ledTotalSize) + 1);
                
                // Render each LED
                for (var j = 0; j < displayCount; j++) {
                    this._drawLED(j, colors[j]);
                }
                
                // Put the image data to canvas
                this.ctx.putImageData(this.imageData, 0, 0);
                
                // Call optional callback
                if (this.onRender) {
                    this.onRender(colors);
                }
                
                // Update performance metrics
                if (this.enablePerformanceMonitoring) {
                    this._updatePerformanceMetrics();
                }
                
                return true;
            } catch (e) {
                console.error('[LEDStripAPI] Error rendering LEDs:', e.message);
                return false;
            }
        },
        
        /**
         * Get the configured LED strip size
         * Called by Berry: js.get_strip_size()
         * 
         * @return {number} Number of LEDs in the strip
         */
        getStripSize: function() {
            return this.stripLength;
        },
        
        /**
         * Set the LED strip size
         * @param {number} length - New strip length
         */
        setStripSize: function(length) {
            if (length < 1) length = 1;
            if (length > 300) length = 300;
            
            this.stripLength = length;
            
            // Recalculate pixel size if using mode-based sizing
            if (this.pixelSizeMode) {
                this.pixelSize = this.calculatePixelSize(this.pixelSizeMode, length);
            }
            
            // Update canvas size
            this._updateCanvasSize();
            
            // Recreate image data for new canvas size
            if (this.ctx && this.canvas) {
                this.imageData = this.ctx.createImageData(
                    this.canvas.width,
                    this.canvas.height
                );
            }
            
            // Clear canvas
            this.clear();
        },
        
        /**
         * Set the pixel size directly
         * @param {number} size - Pixel size in pixels (minimum 1)
         */
        setPixelSize: function(size) {
            if (size < 1) size = 1;
            
            this.pixelSize = size;
            this.pixelSizeMode = null; // Clear mode when setting size directly
            
            // Update canvas size
            this._updateCanvasSize();
            
            // Recreate image data for new canvas size
            if (this.ctx && this.canvas) {
                this.imageData = this.ctx.createImageData(
                    this.canvas.width,
                    this.canvas.height
                );
            }
            
            // Clear canvas
            this.clear();
        },
        
        /**
         * Set the pixel size mode
         * @param {string} mode - 'small', 'medium', or 'large'
         */
        setPixelSizeMode: function(mode) {
            if (!PIXEL_SIZE_MODES[mode]) {
                console.warn('[LEDStripAPI] Invalid pixel size mode:', mode);
                return;
            }
            
            this.pixelSizeMode = mode;
            this.pixelSize = this.calculatePixelSize(mode, this.stripLength);
            
            // Update canvas size
            this._updateCanvasSize();
            
            // Recreate image data for new canvas size
            if (this.ctx && this.canvas) {
                this.imageData = this.ctx.createImageData(
                    this.canvas.width,
                    this.canvas.height
                );
            }
            
            // Clear canvas
            this.clear();
        },
        
        /**
         * Set whether the LED strip is reversed (right-to-left)
         * @param {boolean} reversed - true for right-to-left, false for left-to-right
         */
        setReversed: function(reversed) {
            this.reversed = !!reversed;
            this.clear();
        },
        
        /**
         * Set the maximum canvas width for responsive sizing
         * @param {number} maxWidth - Maximum width in pixels
         */
        setMaxCanvasWidth: function(maxWidth) {
            this.maxCanvasWidth = maxWidth || DEFAULT_MAX_WIDTH;
            
            // Recalculate pixel size if using mode-based sizing
            if (this.pixelSizeMode) {
                this.pixelSize = this.calculatePixelSize(this.pixelSizeMode, this.stripLength);
            }
            
            // Update canvas size
            this._updateCanvasSize();
            
            // Recreate image data for new canvas size
            if (this.ctx && this.canvas) {
                this.imageData = this.ctx.createImageData(
                    this.canvas.width,
                    this.canvas.height
                );
            }
            
            // Clear canvas
            this.clear();
        },
        
        /**
         * Get the current pixel size
         * @returns {number} Current pixel size in pixels
         */
        getPixelSize: function() {
            return this.pixelSize;
        },
        
        /**
         * Get the current pixel size mode
         * @returns {string|null} Current mode ('small', 'medium', 'large') or null if set directly
         */
        getPixelSizeMode: function() {
            return this.pixelSizeMode;
        },
        
        /**
         * Get the canvas dimensions
         * @returns {Object} Object with width and height properties
         */
        getCanvasDimensions: function() {
            return {
                width: this.canvas ? this.canvas.width : 0,
                height: this.canvas ? this.canvas.height : 0
            };
        },
        
        /**
         * Set a single pixel color directly (for testing/debugging)
         * @param {number} index - LED index (0-based)
         * @param {number} color - 32-bit ARGB color value
         */
        setPixelColor: function(index, color) {
            if (index < 0 || index >= this.stripLength) return;
            
            this._drawLED(index, color);
            if (this.ctx && this.imageData) {
                this.ctx.putImageData(this.imageData, 0, 0);
            }
        },
        
        /**
         * Update performance metrics (called after each render)
         * @private
         */
        _updatePerformanceMetrics: function() {
            var now = performance.now();
            this._frameCount++;
            
            // Calculate FPS every second
            var elapsed = now - this._lastFPSUpdate;
            if (elapsed >= 1000) {
                this._fps = (this._frameCount * 1000) / elapsed;
                this._frameCount = 0;
                this._lastFPSUpdate = now;
                
                // Call performance update callback
                if (this.onPerformanceUpdate) {
                    this.onPerformanceUpdate(this.getPerformanceMetrics());
                }
            }
            
            this._lastFrameTime = now;
        },
        
        /**
         * Get current performance metrics
         * @returns {Object} Object with fps and lastFrameTime
         */
        getPerformanceMetrics: function() {
            return {
                fps: this._fps,
                lastFrameTime: this._lastFrameTime
            };
        },
        
        /**
         * Reset performance metrics
         */
        resetPerformanceMetrics: function() {
            this._frameCount = 0;
            this._lastFPSUpdate = performance.now();
            this._fps = 0;
            this._lastFrameTime = 0;
        },
        
        /**
         * Enable or disable performance monitoring
         * @param {boolean} enabled - Whether to enable monitoring
         */
        setPerformanceMonitoring: function(enabled) {
            this.enablePerformanceMonitoring = enabled;
            if (enabled) {
                this.resetPerformanceMetrics();
            }
        },
        
        /**
         * Get current FPS
         * @returns {number} Current frames per second
         */
        getFPS: function() {
            return this._fps;
        },
        
        /**
         * Set the brightness level
         * @param {number} brightness - Brightness percentage (0-200, 100 = normal)
         */
        setBrightness: function(brightness) {
            if (brightness < 0) brightness = 0;
            if (brightness > 200) brightness = 200;
            this.brightness = brightness;
        },
        
        /**
         * Get the current brightness level
         * Called by Berry: js.get_brightness()
         * @returns {number} Brightness percentage (0-200, 100 = normal)
         */
        getBrightness: function() {
            return this.brightness;
        }
    };
    
    // Expose to window
    window.ledStripAPI = ledStripAPI;
    
    // Also expose the individual functions directly to window for Berry's js module
    // These are called by Berry code via: js.frame_buffer_display() and js.get_strip_size()
    window.renderLEDStrip = function(hexString) {
        return ledStripAPI.renderLEDStrip(hexString);
    };
    
    window.getStripSize = function() {
        return ledStripAPI.getStripSize();
    };
    
    window.getBrightness = function() {
        return ledStripAPI.getBrightness();
    };
    
    /**
     * Get a fader value by number (1-8)
     * Called by Berry: js.get_fader(num)
     * @param {number} num - Fader number (1-8)
     * @returns {number} Fader value (0-100)
     */
    window.getFaderValue = function(num) {
        if (window.faderValues && num >= 1 && num <= 8) {
            return window.faderValues[num - 1] || 0;
        }
        return 0;
    };
    
    console.log('[LEDStripAPI] Module loaded');
})();
