/**
 * AnimationControls - UI component for controlling Berry animations
 * 
 * Provides Start/Stop/Compile buttons, FPS display, status messages,
 * and parameter sliders with Tasmota-style gradient backgrounds.
 * 
 * Part of the Berry Animation Framework Browser Simulator.
 * Requirements: 8.2, 8.4, 9.2
 * Reference: TASMOTA_WEBUI_CODING_GUIDE.md
 */

/**
 * AnimationControls - Manages animation control UI
 */
class AnimationControls {
  /**
   * Create animation controls
   * @param {Object} options - Configuration options
   * @param {string} options.startBtnId - ID of start button (default 'btn-start')
   * @param {string} options.stopBtnId - ID of stop button (default 'btn-stop')
   * @param {string} options.compileBtnId - ID of compile-only button (default 'btn-compile')
   * @param {string} options.compileRunBtnId - ID of compile & run button (default 'btn-compile-run')
   * @param {string} options.fpsDisplayId - ID of FPS display element (default 'fps-display')
   * @param {string} options.statusDisplayId - ID of status display element (default 'status-display')
   * @param {string} options.parametersContainerId - ID of parameters container (optional)
   */
  constructor(options = {}) {
    // Element IDs with defaults
    this.startBtnId = options.startBtnId || 'btn-start';
    this.stopBtnId = options.stopBtnId || 'btn-stop';
    this.compileBtnId = options.compileBtnId || 'btn-compile';
    this.compileRunBtnId = options.compileRunBtnId || 'btn-compile-run';
    this.fpsDisplayId = options.fpsDisplayId || 'fps-display';
    this.statusDisplayId = options.statusDisplayId || 'status-display';
    this.parametersContainerId = options.parametersContainerId || 'parameters-container';
    
    // State
    this.isRunning = false;
    this.isCompiling = false;
    this.codeChanged = true;  // Start as true (no compiled code yet)
    this.hasCompiledOnce = false;  // Track if we've ever compiled
    this.parameters = {};
    
    // Callbacks
    this.onStart = null;
    this.onStop = null;
    this.onCompile = null;
    this.onCompileRun = null;
    this.onParameterChange = null;
    
    // Get DOM elements
    this._initElements();
    
    // Setup event handlers
    this._setupEventHandlers();
    
    // Initialize button states
    this._updateButtonStates();
  }
  
  /**
   * Initialize DOM element references
   * @private
   */
  _initElements() {
    this.startBtn = document.getElementById(this.startBtnId);
    this.stopBtn = document.getElementById(this.stopBtnId);
    this.compileBtn = document.getElementById(this.compileBtnId);
    this.compileRunBtn = document.getElementById(this.compileRunBtnId);
    this.fpsDisplay = document.getElementById(this.fpsDisplayId);
    this.statusDisplay = document.getElementById(this.statusDisplayId);
    this.parametersContainer = document.getElementById(this.parametersContainerId);
    
    // Log warnings for missing elements
    if (!this.startBtn) console.warn('AnimationControls: Start button not found:', this.startBtnId);
    if (!this.stopBtn) console.warn('AnimationControls: Stop button not found:', this.stopBtnId);
    if (!this.compileBtn) console.warn('AnimationControls: Compile button not found:', this.compileBtnId);
    if (!this.compileRunBtn) console.warn('AnimationControls: Compile & Run button not found:', this.compileRunBtnId);
  }

  /**
   * Setup event handlers for buttons
   * @private
   */
  _setupEventHandlers() {
    // Start button
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => {
        this._handleStart();
      });
    }
    
    // Stop button
    if (this.stopBtn) {
      this.stopBtn.addEventListener('click', () => {
        this._handleStop();
      });
    }
    
    // Compile button (compile only)
    if (this.compileBtn) {
      this.compileBtn.addEventListener('click', () => {
        this._handleCompile(false);  // compile only, don't run
      });
    }
    
    // Compile & Run button
    if (this.compileRunBtn) {
      this.compileRunBtn.addEventListener('click', () => {
        this._handleCompile(true);  // compile and run
      });
    }
  }
  
  /**
   * Handle start button click
   * @private
   */
  _handleStart() {
    if (this.isRunning || this.isCompiling) return;
    
    this.isRunning = true;
    this._updateButtonStates();
    this.setStatus('running', 'Running');
    
    if (this.onStart) {
      try {
        const result = this.onStart();
        // Handle async callbacks (e.g., compile then start)
        if (result && typeof result.then === 'function') {
          result.catch((e) => {
            console.error('AnimationControls: Start callback error:', e);
            this.setStatus('error', 'Start failed');
            this.isRunning = false;
            this._updateButtonStates();
          });
        }
      } catch (e) {
        console.error('AnimationControls: Start callback error:', e);
        this.setStatus('error', 'Start failed');
        this.isRunning = false;
        this._updateButtonStates();
      }
    }
  }
  
  /**
   * Handle stop button click
   * @private
   */
  _handleStop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    this._updateButtonStates();
    this.setStatus('stopped', 'Stopped');
    
    if (this.onStop) {
      try {
        this.onStop();
      } catch (e) {
        console.error('AnimationControls: Stop callback error:', e);
      }
    }
  }
  
  /**
   * Handle compile button click
   * @private
   * @param {boolean} runAfter - Whether to start animation after successful compile
   */
  _handleCompile(runAfter = false) {
    if (this.isCompiling) return;
    
    // Stop animation if running
    if (this.isRunning) {
      this._handleStop();
    }
    
    this.isCompiling = true;
    this._updateButtonStates();
    this.setStatus('ready', 'Compiling...');
    
    const callback = runAfter ? (this.onCompileRun || this.onCompile) : this.onCompile;
    
    if (callback) {
      try {
        // callback may be async
        const result = callback();
        if (result && typeof result.then === 'function') {
          result
            .then((success) => {
              this.isCompiling = false;
              if (success !== false) {
                this.markCompiled();  // Enable Resume button
                this.setStatus('ready', 'Compiled');
                // Start animation if runAfter is true and compile succeeded
                if (runAfter) {
                  this._handleStart();
                }
              } else {
                this._updateButtonStates();
              }
            })
            .catch((e) => {
              console.error('AnimationControls: Compile error:', e);
              this.isCompiling = false;
              this._updateButtonStates();
              this.setStatus('error', 'Compile failed');
            });
        } else {
          this.isCompiling = false;
          if (result !== false) {
            this.markCompiled();  // Enable Resume button
            this.setStatus('ready', 'Compiled');
            // Start animation if runAfter is true
            if (runAfter) {
              this._handleStart();
            }
          } else {
            this._updateButtonStates();
          }
        }
      } catch (e) {
        console.error('AnimationControls: Compile callback error:', e);
        this.isCompiling = false;
        this._updateButtonStates();
        this.setStatus('error', 'Compile failed');
      }
    } else {
      this.isCompiling = false;
      this._updateButtonStates();
    }
  }
  
  /**
   * Update button enabled/disabled states based on current state
   * Resume is disabled when:
   * - Animation is already running
   * - Compiling is in progress
   * - Code has changed since last compile (need to use Compile & Run instead)
   * - Never compiled yet
   * @private
   */
  _updateButtonStates() {
    if (this.startBtn) {
      // Resume only works if code hasn't changed and we've compiled at least once
      const canResume = !this.isRunning && !this.isCompiling && !this.codeChanged && this.hasCompiledOnce;
      this.startBtn.disabled = !canResume;
    }
    
    if (this.stopBtn) {
      this.stopBtn.disabled = !this.isRunning;
    }
    
    if (this.compileBtn) {
      this.compileBtn.disabled = this.isCompiling;
    }
    
    if (this.compileRunBtn) {
      this.compileRunBtn.disabled = this.isCompiling;
    }
  }
  
  /**
   * Set the running state (called externally when animation starts/stops)
   * @param {boolean} running - Whether animation is running
   */
  setRunning(running) {
    this.isRunning = running;
    this._updateButtonStates();
    
    if (running) {
      this.setStatus('running', 'Running');
    } else {
      this.setStatus('stopped', 'Paused');
    }
  }
  
  /**
   * Notify that code has changed (disables Resume until recompiled)
   * Called by the code editor when content changes
   */
  notifyCodeChanged() {
    this.codeChanged = true;
    this._updateButtonStates();
  }
  
  /**
   * Mark code as compiled (enables Resume)
   * Called after successful compilation
   */
  markCompiled() {
    this.codeChanged = false;
    this.hasCompiledOnce = true;
    this._updateButtonStates();
  }
  
  /**
   * Update FPS display
   * @param {number} fps - Current frames per second
   */
  updateFPS(fps) {
    if (this.fpsDisplay) {
      this.fpsDisplay.textContent = 'FPS: ' + fps.toFixed(1);
    }
  }
  
  /**
   * Set status display
   * @param {string} state - Status state: 'ready', 'running', 'stopped', 'error'
   * @param {string} message - Status message to display
   */
  setStatus(state, message) {
    if (!this.statusDisplay) return;
    
    // Remove all status classes
    this.statusDisplay.classList.remove(
      'status-ready', 
      'status-running', 
      'status-stopped', 
      'status-error'
    );
    
    // Add appropriate class
    this.statusDisplay.classList.add('status-' + state);
    
    // For error state, only show "Error" in status display
    // Full message goes to error container
    if (state === 'error') {
      this.statusDisplay.textContent = 'Error';
      // Show full error in error container
      if (typeof window.showCodeError === 'function' && message) {
        window.showCodeError(message);
      }
    } else {
      // Clear error container for non-error states
      if (typeof window.clearCodeError === 'function') {
        window.clearCodeError();
      }
      // Capitalize first letter for display
      var displayText = state.charAt(0).toUpperCase() + state.slice(1);
      if (message && message !== state) {
        displayText = message;
      }
      this.statusDisplay.textContent = displayText;
    }
  }
  
  /**
   * Show success message
   * @param {string} message - Success message
   */
  showSuccess(message) {
    this.setStatus('ready', message);
    if (window.consoleManager) {
      window.consoleManager.success(message);
    }
  }
  
  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    // Reset running state when showing error (e.g., compile failed during start)
    this.isRunning = false;
    this._updateButtonStates();
    this.setStatus('error', message);
    if (window.consoleManager) {
      window.consoleManager.error(message);
    }
  }

  
  // ============================================
  // Parameter Sliders with Tasmota Gradient Backgrounds
  // Reference: TASMOTA_WEBUI_CODING_GUIDE.md "Color Control Sliders"
  // ============================================
  
  /**
   * Add a parameter slider with Tasmota-style gradient background
   * @param {Object} config - Slider configuration
   * @param {string} config.id - Unique ID for the slider
   * @param {string} config.label - Label text
   * @param {number} config.min - Minimum value (default 0)
   * @param {number} config.max - Maximum value (default 100)
   * @param {number} config.value - Initial value (default 50)
   * @param {number} config.step - Step increment (default 1)
   * @param {string} config.gradient - Gradient type: 'brightness', 'hue', 'saturation', 'custom'
   * @param {string} config.customGradient - Custom CSS gradient (for 'custom' type)
   * @param {Function} config.onChange - Callback when value changes
   * @returns {HTMLElement} The created slider container element
   */
  addParameterSlider(config) {
    if (!this.parametersContainer) {
      console.warn('AnimationControls: Parameters container not found');
      return null;
    }
    
    const id = config.id || 'param-' + Date.now();
    const label = config.label || 'Parameter';
    const min = config.min !== undefined ? config.min : 0;
    const max = config.max !== undefined ? config.max : 100;
    const value = config.value !== undefined ? config.value : 50;
    const step = config.step !== undefined ? config.step : 1;
    
    // Create container
    const container = document.createElement('div');
    container.className = 'param-slider-container';
    container.style.marginBottom = '10px';
    
    // Create label row
    const labelRow = document.createElement('div');
    labelRow.style.display = 'flex';
    labelRow.style.justifyContent = 'space-between';
    labelRow.style.marginBottom = '2px';
    
    const labelEl = document.createElement('label');
    labelEl.htmlFor = id;
    labelEl.innerHTML = '<b>' + label + '</b>';
    
    const valueDisplay = document.createElement('span');
    valueDisplay.id = id + '-value';
    valueDisplay.style.color = 'var(--c_tab)';
    valueDisplay.textContent = value;
    
    labelRow.appendChild(labelEl);
    labelRow.appendChild(valueDisplay);
    container.appendChild(labelRow);
    
    // Create slider wrapper with gradient background (Tasmota style)
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'r';  // Tasmota rounded container class
    
    // Set gradient based on type
    const gradient = this._getGradient(config.gradient, config.customGradient);
    sliderWrapper.style.backgroundImage = gradient;
    
    // Create range input
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = id;
    slider.min = min;
    slider.max = max;
    slider.value = value;
    slider.step = step;
    
    // Event handler
    slider.addEventListener('input', (e) => {
      const newValue = parseFloat(e.target.value);
      valueDisplay.textContent = newValue;
      
      // Store parameter value
      this.parameters[id] = newValue;
      
      // Call onChange callback
      if (config.onChange) {
        config.onChange(newValue, id);
      }
      
      // Call global parameter change callback
      if (this.onParameterChange) {
        this.onParameterChange(id, newValue);
      }
    });
    
    sliderWrapper.appendChild(slider);
    container.appendChild(sliderWrapper);
    
    // Add to container
    this.parametersContainer.appendChild(container);
    
    // Store initial value
    this.parameters[id] = value;
    
    return container;
  }
  
  /**
   * Get CSS gradient string for slider background
   * @private
   * @param {string} type - Gradient type
   * @param {string} customGradient - Custom gradient CSS
   * @returns {string} CSS gradient string
   */
  _getGradient(type, customGradient) {
    switch (type) {
      case 'brightness':
        // Black to white gradient (Tasmota brightness slider)
        return 'linear-gradient(to right, #000, #fff)';
        
      case 'hue':
        // Rainbow hue gradient (Tasmota hue slider)
        return 'linear-gradient(to right, #800, #f00 5%, #ff0 20%, #0f0 35%, #0ff 50%, #00f 65%, #f0f 80%, #f00 95%, #800)';
        
      case 'saturation':
        // Gray to color gradient (Tasmota saturation slider)
        return 'linear-gradient(to right, #ccc, #6aff00)';
        
      case 'speed':
        // Slow to fast gradient (blue to red)
        return 'linear-gradient(to right, #1fa3ec, #ff5661)';
        
      case 'temperature':
        // Cool to warm gradient
        return 'linear-gradient(to right, #00bfff, #ff8c00)';
        
      case 'custom':
        return customGradient || 'linear-gradient(to right, #000, #fff)';
        
      default:
        // Default brightness gradient
        return 'linear-gradient(to right, #000, #fff)';
    }
  }
  
  /**
   * Get current value of a parameter
   * @param {string} id - Parameter ID
   * @returns {number|undefined} Parameter value or undefined if not found
   */
  getParameter(id) {
    return this.parameters[id];
  }
  
  /**
   * Set value of a parameter slider
   * @param {string} id - Parameter ID
   * @param {number} value - New value
   */
  setParameter(id, value) {
    const slider = document.getElementById(id);
    const valueDisplay = document.getElementById(id + '-value');
    
    if (slider) {
      slider.value = value;
      this.parameters[id] = value;
      
      if (valueDisplay) {
        valueDisplay.textContent = value;
      }
    }
  }
  
  /**
   * Remove a parameter slider
   * @param {string} id - Parameter ID
   */
  removeParameter(id) {
    const slider = document.getElementById(id);
    if (slider) {
      const container = slider.closest('.param-slider-container');
      if (container) {
        container.remove();
      }
    }
    delete this.parameters[id];
  }
  
  /**
   * Clear all parameter sliders
   */
  clearParameters() {
    if (this.parametersContainer) {
      this.parametersContainer.innerHTML = '';
    }
    this.parameters = {};
  }
  
  // ============================================
  // Callback Setters
  // ============================================
  
  /**
   * Set callback for start button
   * @param {Function} callback - Function to call when start is clicked
   */
  setOnStart(callback) {
    this.onStart = callback;
  }
  
  /**
   * Set callback for stop button
   * @param {Function} callback - Function to call when stop is clicked
   */
  setOnStop(callback) {
    this.onStop = callback;
  }
  
  /**
   * Set callback for compile button (compile only)
   * @param {Function} callback - Function to call when compile is clicked
   */
  setOnCompile(callback) {
    this.onCompile = callback;
  }
  
  /**
   * Set callback for compile & run button
   * @param {Function} callback - Function to call when compile & run is clicked
   */
  setOnCompileRun(callback) {
    this.onCompileRun = callback;
  }
  
  /**
   * Set callback for parameter changes
   * @param {Function} callback - Function called with (parameterId, value)
   */
  setOnParameterChange(callback) {
    this.onParameterChange = callback;
  }
}

// ============================================
// Global Initialization Function
// ============================================

/**
 * Initialize the global animation controls
 * @param {Object} options - Configuration options (see AnimationControls constructor)
 * @returns {AnimationControls} The initialized controls instance
 */
window.initAnimationControls = function(options = {}) {
  window.animationControls = new AnimationControls(options);
  return window.animationControls;
};

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.AnimationControls = AnimationControls;
}

// Export for Node.js/CommonJS (for testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnimationControls };
}
