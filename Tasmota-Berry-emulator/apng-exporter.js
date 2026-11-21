/**
 * APNG Exporter - Frame capture and APNG encoding system
 * 
 * Provides a clean API for capturing canvas frames and encoding them as APNG.
 * Works with the LED strip visualization canvas.
 * 
 * Uses VIRTUAL TIME during capture to ensure consistent frame timing
 * regardless of browser tab visibility or system load.
 * 
 * APNG provides full 24-bit color support without GIF's 256 color limitation.
 * 
 * Part of the Berry Animation Framework Browser Simulator.
 * Requirements: 15.3, 18.1
 * Task: 18.2 - Create APNGExporter JavaScript class
 */

(function(root) {
    'use strict';

    // ============================================
    // Virtual Time System (shared with GIF exporter)
    // ============================================
    
    /**
     * Virtual time state for APNG export
     * When enabled, tasmota_millis() returns virtual time instead of real time
     * 
     * Note: This is a separate instance from GIF exporter to avoid conflicts
     * if both are loaded. In practice, only one export runs at a time.
     */
    var virtualTimeState = {
        enabled: false,
        virtualMillis: 0,
        realMillisFunction: null  // Store the original tasmota_millis function
    };
    
    /**
     * Enable virtual time mode
     * @param {number} startMillis - Starting virtual time in milliseconds
     */
    function enableVirtualTime(startMillis) {
        if (virtualTimeState.enabled) return;
        
        // Store the original tasmota_millis function
        virtualTimeState.realMillisFunction = window.tasmota_millis;
        virtualTimeState.virtualMillis = startMillis || 0;
        virtualTimeState.enabled = true;
        
        // Override tasmota_millis to return virtual time
        window.tasmota_millis = function() {
            return virtualTimeState.virtualMillis;
        };
        
        console.log('[APNGExporter] Virtual time enabled, starting at', virtualTimeState.virtualMillis, 'ms');
    }
    
    /**
     * Advance virtual time by specified milliseconds
     * @param {number} deltaMs - Milliseconds to advance
     */
    function advanceVirtualTime(deltaMs) {
        if (!virtualTimeState.enabled) return;
        virtualTimeState.virtualMillis += deltaMs;
    }
    
    /**
     * Get current virtual time
     * @returns {number} Current virtual time in milliseconds
     */
    function getVirtualTime() {
        return virtualTimeState.virtualMillis;
    }
    
    /**
     * Disable virtual time mode and restore real time
     */
    function disableVirtualTime() {
        if (!virtualTimeState.enabled) return;
        
        // Restore the original tasmota_millis function
        if (virtualTimeState.realMillisFunction) {
            window.tasmota_millis = virtualTimeState.realMillisFunction;
        }
        
        virtualTimeState.enabled = false;
        virtualTimeState.realMillisFunction = null;
        
        console.log('[APNGExporter] Virtual time disabled, restored real time');
    }
    
    /**
     * Check if virtual time is enabled
     * @returns {boolean} True if virtual time is active
     */
    function isVirtualTimeEnabled() {
        return virtualTimeState.enabled;
    }

    // ============================================
    // APNGExporter Class
    // ============================================

    /**
     * APNGExporter - Captures canvas frames and encodes them as APNG
     * 
     * Follows the same pattern as GIFExporter for consistency.
     */
    class APNGExporter {
        /**
         * Create an APNG exporter
         * @param {Object} options - Configuration options
         * @param {HTMLCanvasElement|string} options.canvas - Canvas element or ID
         * @param {number} options.repeat - Loop count (0 = forever, default: 0)
         */
        constructor(options = {}) {
            // Canvas reference
            if (typeof options.canvas === 'string') {
                this.canvas = document.getElementById(options.canvas);
            } else if (options.canvas instanceof HTMLCanvasElement) {
                this.canvas = options.canvas;
            } else {
                this.canvas = null;
            }
            
            // APNG encoding options
            this.repeat = options.repeat !== undefined ? options.repeat : 0;
            
            // Capture state
            this.isCapturing = false;
            this.isCancelled = false;
            this.capturedFrames = 0;
            this.totalFrames = 0;
            
            // Callbacks
            this.onProgress = null;
            this.onComplete = null;
            this.onError = null;
            
            // Performance tracking
            this.captureStartTime = 0;
            this.captureEndTime = 0;
        }
        
        /**
         * Set the canvas to capture from
         * @param {HTMLCanvasElement|string} canvas - Canvas element or ID
         */
        setCanvas(canvas) {
            if (typeof canvas === 'string') {
                this.canvas = document.getElementById(canvas);
            } else if (canvas instanceof HTMLCanvasElement) {
                this.canvas = canvas;
            }
        }
        
        /**
         * Start capturing frames from the canvas using VIRTUAL TIME
         * 
         * This method uses virtual time to ensure consistent frame capture
         * regardless of browser tab visibility or system load. The workflow is:
         * 1. Stop any running animation
         * 2. Compile & Run the animation (fresh start)
         * 3. Enable virtual time mode (overrides tasmota_millis)
         * 4. For each frame: advances virtual time, calls _fast_loop(), captures canvas
         * 5. Restore real time mode when done
         * 6. Compile & Run again to restore normal animation state
         * 
         * @param {number} fps - Frames per second to capture (15, 30, or 60)
         * @param {number} duration - Duration in seconds (1-120)
         * @returns {Promise<Object>} Promise resolving to {blob, filename, stats} or null if cancelled
         */
        async startCapture(fps, duration) {
            // Validate parameters
            if (!this.canvas) {
                this._handleError('Canvas not set');
                return null;
            }
            
            if (fps < 1 || fps > 60) {
                this._handleError('FPS must be between 1 and 60');
                return null;
            }
            
            if (duration < 1 || duration > 120) {
                this._handleError('Duration must be between 1 and 120 seconds');
                return null;
            }
            
            // Check if APNG encoder is available
            if (typeof APNG === 'undefined') {
                this._handleError('APNG encoder not loaded');
                return null;
            }
            
            // Check if Berry VM and _fast_loop are available
            if (typeof window.berryVM === 'undefined' || !window.berryVM.ready) {
                this._handleError('Berry VM not ready');
                return null;
            }
            
            // Reset state
            this.isCapturing = true;
            this.isCancelled = false;
            this.capturedFrames = 0;
            this.totalFrames = fps * duration;
            this.captureStartTime = performance.now();
            
            // Get canvas context
            const ctx = this.canvas.getContext('2d');
            if (!ctx) {
                this._handleError('Failed to get canvas context');
                return null;
            }
            
            // Frame delay in milliseconds (for APNG timing)
            const frameDelay = Math.round(1000 / fps);
            
            // Create APNG encoder
            const apng = new APNG({
                width: this.canvas.width,
                height: this.canvas.height,
                repeat: this.repeat
            });
            
            // Stop the real animation loop during capture
            const wasRunning = window.animationLoop && window.animationLoop.isRunning;
            if (window.animationLoop && window.animationLoop.isRunning) {
                window.animationLoop.stop();
            }
            
            // Step 1: Compile & Run the animation (fresh start for export)
            // This ensures the animation starts from its initial state
            console.log('[APNGExporter] Compiling animation for export...');
            const compileSuccess = await this._compileAndPrepare();
            if (!compileSuccess) {
                this._handleError('Failed to compile animation for export');
                // Restore animation if it was running
                if (wasRunning && window.animationLoop) {
                    window.animationLoop.start();
                }
                this.isCapturing = false;
                return null;
            }
            
            // Step 2: Enable virtual time mode
            // Get current real time to use as starting point for virtual time
            const startVirtualTime = window.berryVM.millis();
            enableVirtualTime(startVirtualTime);
            
            // Step 3: Render the first frame of the new animation
            // Call _fast_loop() twice to ensure the new animation has fully rendered:
            // - First call: may still show transition/initialization state
            // - Second call: shows the actual first frame of the new animation
            advanceVirtualTime(frameDelay);
            await window.berryVM.callGlobal('_fast_loop');
            advanceVirtualTime(frameDelay);
            await window.berryVM.callGlobal('_fast_loop');
            
            // Return a promise that resolves when capture is complete
            const self = this;
            return new Promise((resolve) => {
                // Use setTimeout batching to allow UI updates during capture
                const captureNextBatch = async () => {
                    // Process frames in batches to allow UI updates
                    const batchSize = 5; // Process 5 frames per batch
                    let framesInBatch = 0;
                    
                    while (framesInBatch < batchSize && self.capturedFrames < self.totalFrames) {
                        // Check for cancellation
                        if (self.isCancelled) {
                            await self._finishCapture(wasRunning);
                            resolve(null);
                            return;
                        }
                        
                        try {
                            // Advance virtual time by frame interval
                            advanceVirtualTime(frameDelay);
                            
                            // Call Berry's _fast_loop() to update the animation
                            // This will use the virtual time from tasmota_millis()
                            window.berryVM.callGlobal('_fast_loop');
                            
                            // Capture the current canvas state
                            apng.addFrame(ctx, { delay: frameDelay });
                            self.capturedFrames++;
                            framesInBatch++;
                            
                        } catch (err) {
                            await self._finishCapture(wasRunning);
                            self._handleError('Frame capture failed: ' + err.message);
                            resolve(null);
                            return;
                        }
                    }
                    
                    // Update progress (80% for capture phase)
                    const captureProgress = (self.capturedFrames / self.totalFrames) * 80;
                    self._updateProgress(captureProgress, 'capturing');
                    
                    // Check if done capturing
                    if (self.capturedFrames >= self.totalFrames) {
                        await self._finishCapture(wasRunning);
                        self.captureEndTime = performance.now();
                        
                        // Encode APNG
                        self._encodeAPNG(apng, fps, duration, resolve);
                    } else {
                        // Schedule next batch (use setTimeout to allow UI updates)
                        setTimeout(captureNextBatch, 0);
                    }
                };
                
                // Start capturing
                captureNextBatch();
            });
        }
        
        /**
         * Compile and prepare the animation for export
         * This does the equivalent of "Compile & Run" to ensure a fresh animation state
         * @private
         * @returns {Promise<boolean>} True if compilation succeeded
         */
        async _compileAndPrepare() {
            try {
                // Use the Berry simulator's compile method if available
                if (window.berrySimulator && typeof window.berrySimulator.compile === 'function') {
                    const success = await window.berrySimulator.compile();
                    if (!success) {
                        console.error('[APNGExporter] Compilation failed via berrySimulator');
                        return false;
                    }
                    console.log('[APNGExporter] Animation compiled successfully');
                    return true;
                }
                
                // Fallback: Try to compile using animation controls
                if (window.animationControls && typeof window.animationControls.compile === 'function') {
                    const success = await window.animationControls.compile();
                    if (!success) {
                        console.error('[APNGExporter] Compilation failed via animationControls');
                        return false;
                    }
                    console.log('[APNGExporter] Animation compiled successfully (via controls)');
                    return true;
                }
                
                // If no compile method available, assume animation is already set up
                console.log('[APNGExporter] No compile method available, using current animation state');
                return true;
                
            } catch (error) {
                console.error('[APNGExporter] Compile error:', error);
                return false;
            }
        }
        
        /**
         * Finish capture and restore state
         * This does another Compile & Run to restore normal animation state
         * @private
         * @param {boolean} wasRunning - Whether animation was running before capture
         */
        async _finishCapture(wasRunning) {
            // Disable virtual time and restore real time
            disableVirtualTime();
            
            // Step: Compile & Run again to restore normal animation state
            // This ensures the animation restarts from its initial state after export
            console.log('[APNGExporter] Restoring animation state after export...');
            const compileSuccess = await this._compileAndPrepare();
            if (!compileSuccess) {
                console.warn('[APNGExporter] Failed to recompile animation after export');
            }
            
            // Restart animation loop if it was running
            if (wasRunning && window.animationLoop) {
                window.animationLoop.start();
            }
            
            this.isCapturing = false;
        }
        
        /**
         * Cancel the current capture
         */
        cancel() {
            if (this.isCapturing) {
                this.isCancelled = true;
                this._updateProgress(0, 'cancelled');
            }
        }
        
        /**
         * Check if currently capturing
         * @returns {boolean} True if capture is in progress
         */
        isInProgress() {
            return this.isCapturing;
        }
        
        /**
         * Get capture statistics
         * @returns {Object} Statistics about the last capture
         */
        getStats() {
            return {
                capturedFrames: this.capturedFrames,
                totalFrames: this.totalFrames,
                captureTime: this.captureEndTime - this.captureStartTime,
                isCapturing: this.isCapturing,
                isCancelled: this.isCancelled
            };
        }
        
        /**
         * Set progress callback
         * @param {Function} callback - Function called with (progress, phase)
         */
        setOnProgress(callback) {
            this.onProgress = callback;
        }
        
        /**
         * Set completion callback
         * @param {Function} callback - Function called with result object
         */
        setOnComplete(callback) {
            this.onComplete = callback;
        }
        
        /**
         * Set error callback
         * @param {Function} callback - Function called with error message
         */
        setOnError(callback) {
            this.onError = callback;
        }
        
        /**
         * Encode the captured frames as APNG
         * @private
         * @param {APNG} apng - APNG encoder instance with frames
         * @param {number} fps - Frames per second
         * @param {number} duration - Duration in seconds
         * @param {Function} resolve - Promise resolve function
         */
        _encodeAPNG(apng, fps, duration, resolve) {
            // Update progress for encoding phase
            this._updateProgress(85, 'encoding');
            
            try {
                // Render APNG (synchronous in our encoder)
                const blob = apng.render();
                
                // Update progress to complete
                this._updateProgress(100, 'complete');
                
                // Build result object
                const result = {
                    blob: blob,
                    filename: this._generateFilename(fps, duration),
                    stats: {
                        frames: this.capturedFrames,
                        fps: fps,
                        duration: duration,
                        fileSize: blob.size,
                        captureTime: this.captureEndTime - this.captureStartTime,
                        width: this.canvas.width,
                        height: this.canvas.height,
                        format: 'apng'
                    }
                };
                
                // Call completion callback
                if (this.onComplete) {
                    this.onComplete(result);
                }
                
                resolve(result);
            } catch (err) {
                this._handleError('APNG encoding failed: ' + err.message);
                resolve(null);
            }
        }
        
        /**
         * Generate a filename for the APNG
         * @private
         * @param {number} fps - Frames per second
         * @param {number} duration - Duration in seconds
         * @returns {string} Generated filename
         */
        _generateFilename(fps, duration) {
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
            return `animation-${fps}fps-${duration}s-${timestamp}.png`;
        }
        
        /**
         * Update progress
         * @private
         * @param {number} progress - Progress percentage (0-100)
         * @param {string} phase - Current phase ('capturing', 'encoding', 'complete', 'cancelled')
         */
        _updateProgress(progress, phase) {
            if (this.onProgress) {
                // Return value indicates whether to continue (false = cancel)
                const shouldContinue = this.onProgress(progress, phase);
                if (shouldContinue === false) {
                    this.isCancelled = true;
                }
            }
        }
        
        /**
         * Handle an error
         * @private
         * @param {string} message - Error message
         */
        _handleError(message) {
            console.error('[APNGExporter]', message);
            if (this.onError) {
                this.onError(message);
            }
        }
    }

    // ============================================
    // Factory Function
    // ============================================
    
    /**
     * Create a new APNG exporter instance
     * @param {Object} options - Configuration options
     * @returns {APNGExporter} New exporter instance
     */
    function createAPNGExporter(options) {
        return new APNGExporter(options);
    }

    // ============================================
    // Global Exports
    // ============================================
    
    // Export class and factory
    root.APNGExporter = APNGExporter;
    root.createAPNGExporter = createAPNGExporter;
    
    // Export virtual time utilities for debugging
    root.apngExporterVirtualTime = {
        enable: enableVirtualTime,
        disable: disableVirtualTime,
        advance: advanceVirtualTime,
        getTime: getVirtualTime,
        isEnabled: isVirtualTimeEnabled
    };
    
    console.log('[APNGExporter] Module loaded (with virtual time support)');
    
})(typeof window !== 'undefined' ? window : this);
