/**
 * AnimationLoop - JavaScript class for driving Berry animations
 * 
 * This class manages the animation loop using requestAnimationFrame,
 * calling Berry's _fast_loop() function each frame for smooth
 * 60 FPS animation rendering.
 * 
 * The _fast_loop() function is a global Berry function that calls
 * tasmota.fast_loop(), which in turn calls all registered fast_loop
 * closures (including the animation engine's on_tick() method).
 * 
 * Part of the Berry Animation Framework Browser Simulator.
 * Requirements: 6.1, 6.2, 12.5
 */

/**
 * FPSCounter - Tracks and calculates frames per second
 */
class FPSCounter {
  /**
   * Create a new FPS counter
   */
  constructor() {
    this.frames = 0;
    this.lastTime = performance.now();
    this.fps = 0;
    this.onUpdate = null;  // Callback when FPS is updated
    
    // Performance metrics
    this.frameTimeSum = 0;
    this.frameTimeCount = 0;
    this.avgFrameTime = 0;
    this.maxFrameTime = 0;
    this.minFrameTime = Infinity;
  }
  
  /**
   * Call this each frame to track FPS
   * @param {number} frameTime - Optional frame execution time in ms
   */
  tick(frameTime) {
    this.frames++;
    const now = performance.now();
    const elapsed = now - this.lastTime;
    
    // Track frame time metrics
    if (frameTime !== undefined) {
      this.frameTimeSum += frameTime;
      this.frameTimeCount++;
      if (frameTime > this.maxFrameTime) this.maxFrameTime = frameTime;
      if (frameTime < this.minFrameTime) this.minFrameTime = frameTime;
    }
    
    // Update FPS every second
    if (elapsed >= 1000) {
      this.fps = (this.frames * 1000) / elapsed;
      this.frames = 0;
      this.lastTime = now;
      
      // Calculate average frame time
      if (this.frameTimeCount > 0) {
        this.avgFrameTime = this.frameTimeSum / this.frameTimeCount;
      }
      
      // Call update callback if set
      if (this.onUpdate) {
        this.onUpdate(this.fps, this.getMetrics());
      }
      
      // Reset frame time metrics for next second
      this.frameTimeSum = 0;
      this.frameTimeCount = 0;
      this.maxFrameTime = 0;
      this.minFrameTime = Infinity;
    }
  }
  
  /**
   * Get the current FPS value
   * @returns {number} Current frames per second
   */
  getFPS() {
    return this.fps;
  }
  
  /**
   * Get performance metrics
   * @returns {Object} Object with fps, avgFrameTime, maxFrameTime, minFrameTime
   */
  getMetrics() {
    return {
      fps: this.fps,
      avgFrameTime: this.avgFrameTime,
      maxFrameTime: this.maxFrameTime,
      minFrameTime: this.minFrameTime === Infinity ? 0 : this.minFrameTime
    };
  }
  
  /**
   * Reset the FPS counter
   */
  reset() {
    this.frames = 0;
    this.lastTime = performance.now();
    this.fps = 0;
    this.frameTimeSum = 0;
    this.frameTimeCount = 0;
    this.avgFrameTime = 0;
    this.maxFrameTime = 0;
    this.minFrameTime = Infinity;
  }
  
  /**
   * Set callback for FPS updates
   * @param {Function} callback - Function called with FPS value each second
   */
  setUpdateCallback(callback) {
    this.onUpdate = callback;
  }
}

/**
 * AnimationLoop - Manages the animation loop for Berry animations
 * 
 * Uses requestAnimationFrame for smooth 60 FPS rendering.
 * Calls Berry's _fast_loop() function each frame to drive animations.
 * 
 * The _fast_loop() function is defined in tasmota_core.be when running
 * in browser mode (__JS__ = true). It calls tasmota.fast_loop() which
 * iterates through all registered fast_loop closures.
 */
class AnimationLoop {
  /**
   * Create a new animation loop
   * @param {Object} options - Configuration options
   * @param {Function} options.onFrame - Callback function called each frame (fallback if Berry not ready)
   * @param {Function} options.onFPSUpdate - Callback when FPS is updated (optional)
   * @param {Function} options.onStart - Callback when animation starts (optional)
   * @param {Function} options.onStop - Callback when animation stops (optional)
   * @param {Function} options.onError - Callback when Berry execution error occurs (optional)
   * @param {number} options.targetFPS - Target frames per second (default: 60)
   * @param {boolean} options.useBerryFastLoop - Whether to call Berry's _fast_loop() (default: true)
   */
  constructor(options = {}) {
    this.isRunning = false;
    this.animationFrameId = null;
    this.fpsCounter = new FPSCounter();
    
    // Configuration
    this.targetFPS = options.targetFPS || 60;
    this.targetFrameTime = 1000 / this.targetFPS;  // ~16.67ms for 60 FPS
    this.useBerryFastLoop = options.useBerryFastLoop !== false;  // Default true
    
    // Error tracking
    this.consecutiveErrors = 0;
    this.maxConsecutiveErrors = 10;  // Stop after 10 consecutive errors
    this.lastError = null;
    
    // Callbacks
    this.onFrame = options.onFrame || null;
    this.onStart = options.onStart || null;
    this.onStop = options.onStop || null;
    this.onError = options.onError || null;
    
    // Set FPS update callback
    if (options.onFPSUpdate) {
      this.fpsCounter.setUpdateCallback(options.onFPSUpdate);
    }
    
    // Bind loop method to preserve 'this' context
    this._loop = this._loop.bind(this);
  }
  
  /**
   * Start the animation loop
   * 
   * If already running, this method does nothing.
   * Calls onStart callback if provided.
   */
  start() {
    if (this.isRunning) {
      return;  // Already running
    }
    
    this.isRunning = true;
    this.consecutiveErrors = 0;
    this.lastError = null;
    this.fpsCounter.reset();
    
    // Call start callback
    if (this.onStart) {
      this.onStart();
    }
    
    // Start the loop
    this._loop();
  }
  
  /**
   * Stop the animation loop
   * 
   * If not running, this method does nothing.
   * Calls onStop callback if provided.
   */
  stop() {
    if (!this.isRunning) {
      return;  // Not running
    }
    
    this.isRunning = false;
    
    // Cancel pending animation frame
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // Call stop callback
    if (this.onStop) {
      this.onStop();
    }
  }
  
  /**
   * Toggle the animation loop (start if stopped, stop if running)
   * @returns {boolean} New running state
   */
  toggle() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
    return this.isRunning;
  }
  
  /**
   * Internal loop function called by requestAnimationFrame
   * @private
   */
  _loop() {
    if (!this.isRunning) {
      return;
    }
    
    const frameStart = performance.now();
    
    // Call Berry's _fast_loop() function if available and enabled
    if (this.useBerryFastLoop) {
      this._callBerryFastLoop();
    }
    
    // Also call the JavaScript frame callback (for fallback/demo animations)
    if (this.onFrame) {
      try {
        this.onFrame();
      } catch (e) {
        console.error('AnimationLoop JS frame error:', e);
        // Continue running despite JS errors
      }
    }
    
    const frameEnd = performance.now();
    const frameTime = frameEnd - frameStart;
    
    // Update FPS counter with frame execution time
    this.fpsCounter.tick(frameTime);
    
    // Request next frame
    this.animationFrameId = requestAnimationFrame(this._loop);
  }
  
  /**
   * Call Berry's _fast_loop() function
   * This drives the animation engine by calling tasmota.fast_loop()
   * @private
   */
  _callBerryFastLoop() {
    // Check if Berry VM is ready
    if (!window.berryVM || !window.berryVM.ready) {
      return;  // Berry not ready yet, skip this frame
    }
    
    try {
      // Call the global _fast_loop() function defined in tasmota_core.be
      // This is a synchronous call using Module.ccall
      const result = Module.ccall('berry_call_global', 'number', ['string'], ['_fast_loop']);
      
      if (result === 0) {
        // Success - reset error counter
        this.consecutiveErrors = 0;
      } else {
        // Non-zero result indicates an error
        this._handleBerryError('_fast_loop returned error code: ' + result);
      }
    } catch (e) {
      this._handleBerryError(e.message || 'Unknown Berry execution error');
    }
  }
  
  /**
   * Handle Berry execution error
   * @private
   * @param {string} errorMessage - Error message
   */
  _handleBerryError(errorMessage) {
    this.consecutiveErrors++;
    this.lastError = errorMessage;
    
    // Log error (but not every frame to avoid spam)
    if (this.consecutiveErrors === 1 || this.consecutiveErrors % 60 === 0) {
      console.error('AnimationLoop Berry error:', errorMessage);
    }
    
    // Call error callback if provided
    if (this.onError) {
      this.onError(errorMessage, this.consecutiveErrors);
    }
    
    // Stop if too many consecutive errors
    if (this.consecutiveErrors >= this.maxConsecutiveErrors) {
      console.error('AnimationLoop: Too many consecutive Berry errors, stopping animation');
      this.stop();
      
      // Notify via error callback
      if (this.onError) {
        this.onError('Animation stopped due to repeated errors', this.consecutiveErrors);
      }
    }
  }
  
  /**
   * Check if the animation loop is currently running
   * @returns {boolean} True if running
   */
  getIsRunning() {
    return this.isRunning;
  }
  
  /**
   * Get the current FPS
   * @returns {number} Current frames per second
   */
  getFPS() {
    return this.fpsCounter.getFPS();
  }
  
  /**
   * Get performance metrics
   * @returns {Object} Object with fps, avgFrameTime, maxFrameTime, minFrameTime
   */
  getMetrics() {
    return this.fpsCounter.getMetrics();
  }
  
  /**
   * Get error information
   * @returns {Object} Object with consecutiveErrors and lastError
   */
  getErrorInfo() {
    return {
      consecutiveErrors: this.consecutiveErrors,
      lastError: this.lastError
    };
  }
  
  /**
   * Set the frame callback
   * @param {Function} callback - Function called each frame
   */
  setFrameCallback(callback) {
    this.onFrame = callback;
  }
  
  /**
   * Set the FPS update callback
   * @param {Function} callback - Function called with FPS value each second
   */
  setFPSCallback(callback) {
    this.fpsCounter.setUpdateCallback(callback);
  }
  
  /**
   * Set the error callback
   * @param {Function} callback - Function called when Berry error occurs
   */
  setErrorCallback(callback) {
    this.onError = callback;
  }
  
  /**
   * Set target FPS
   * @param {number} fps - Target frames per second (1-120)
   */
  setTargetFPS(fps) {
    if (fps < 1) fps = 1;
    if (fps > 120) fps = 120;
    this.targetFPS = fps;
    this.targetFrameTime = 1000 / fps;
  }
  
  /**
   * Get target FPS
   * @returns {number} Target frames per second
   */
  getTargetFPS() {
    return this.targetFPS;
  }
  
  /**
   * Enable or disable Berry _fast_loop() calls
   * @param {boolean} enabled - Whether to call Berry's _fast_loop()
   */
  setBerryFastLoopEnabled(enabled) {
    this.useBerryFastLoop = enabled;
  }
  
  /**
   * Check if Berry _fast_loop() calls are enabled
   * @returns {boolean} True if enabled
   */
  isBerryFastLoopEnabled() {
    return this.useBerryFastLoop;
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.AnimationLoop = AnimationLoop;
  window.FPSCounter = FPSCounter;
}

// Export for Node.js/CommonJS (for testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnimationLoop, FPSCounter };
}
