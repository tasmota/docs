/**
 * BerryAnimationSimulator - Main class for the Berry Animation Framework Browser Simulator
 * 
 * This class orchestrates the entire simulator:
 * - Initializes the Berry WASM module
 * - Manages UI components (editor, controls, renderer, console)
 * - Implements compile and run workflow
 * - Handles errors and displays them to the user
 * 
 * Part of the Berry Animation Framework Browser Simulator.
 * Requirements: 9.4
 */

(function(window) {
    'use strict';

    /**
     * BerryAnimationSimulator - Main application class
     */
    class BerryAnimationSimulator {
        /**
         * Create a new Berry Animation Simulator
         * @param {Object} options - Configuration options
         */
        constructor(options = {}) {
            // State
            this.berryReady = false;
            this.isRunning = false;
            this.isCompiling = false;
            this.lastCompiledCode = '';
            this.lastCompiledLanguage = '';
            
            // Configuration
            this.options = Object.assign({
                ledCanvasId: 'led-canvas',
                ledLength: 30,
                editorContainerId: 'code-editor-container',
                radioGroupName: 'code-lang',
                initialLanguage: 'dsl',
                wasmTimeout: 10000  // 10 seconds timeout for WASM loading
            }, options);
            
            // Component references (set during init)
            this.editor = null;
            this.controls = null;
            this.ledStripAPI = null;  // Consolidated LED Strip API
            this.animationLoop = null;
            this.consoleManager = null;
            
            // Berry execution state
            this.berryEngine = null;
            this.berryCode = '';
        }

        /**
         * Initialize the simulator
         * @returns {Promise<boolean>} True if initialization succeeded
         */
        async init() {
            try {
                this._log('info', 'Initializing Berry Animation Simulator...');
                
                // Wait for Berry WASM module to be ready
                await this._waitForBerry();
                
                // Get references to already-initialized components
                this._initComponentReferences();
                
                // Wire up the compile workflow
                this._setupCompileWorkflow();
                
                // Wire up animation loop to Berry
                this._setupAnimationLoop();
                
                this._log('success', 'Berry Animation Simulator ready');
                return true;
                
            } catch (error) {
                this._log('error', 'Initialization failed: ' + error.message);
                this._showError('Failed to initialize simulator: ' + error.message);
                return false;
            }
        }

        /**
         * Wait for Berry WASM module to be ready
         * @private
         * @returns {Promise<void>}
         */
        _waitForBerry() {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();
                const timeout = this.options.wasmTimeout;
                let lastProgress = 0;
                
                const checkBerry = () => {
                    // Check if Module exists and has been initialized
                    if (typeof Module !== 'undefined' && Module.calledRun) {
                        this.berryReady = true;
                        this._log('info', 'Berry WASM module loaded');
                        
                        // Update progress to 100% and hide loading overlay
                        if (window.updateLoadingProgress) {
                            window.updateLoadingProgress(100);
                        }
                        if (window.hideLoadingOverlay) {
                            window.hideLoadingOverlay();
                        }
                        
                        resolve();
                        return;
                    }
                    
                    // Update progress bar based on elapsed time
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(90, Math.floor((elapsed / timeout) * 90));
                    if (progress > lastProgress) {
                        lastProgress = progress;
                        if (window.updateLoadingProgress) {
                            window.updateLoadingProgress(progress);
                        }
                    }
                    
                    // Check for timeout
                    if (elapsed > timeout) {
                        const errorMsg = 'Timeout waiting for Berry WASM module (took > ' + (timeout / 1000) + 's)';
                        if (window.showLoadingError) {
                            window.showLoadingError(errorMsg);
                        }
                        reject(new Error(errorMsg));
                        return;
                    }
                    
                    // Check again in 100ms
                    setTimeout(checkBerry, 100);
                };
                
                checkBerry();
            });
        }

        /**
         * Get references to already-initialized UI components
         * @private
         */
        _initComponentReferences() {
            // Get references to global components initialized in index.html
            this.editor = window.codeEditor || null;
            this.controls = window.animationControls || null;
            this.ledStripAPI = window.ledStripAPI || null;  // Consolidated LED Strip API
            this.animationLoop = window.animationLoop || null;
            this.consoleManager = window.consoleManager || null;
            
            // Log component status
            if (!this.editor) {
                this._log('warn', 'Code editor not found');
            }
            if (!this.controls) {
                this._log('warn', 'Animation controls not found');
            }
            if (!this.ledStripAPI) {
                this._log('warn', 'LED Strip API not found');
            }
            if (!this.animationLoop) {
                this._log('warn', 'Animation loop not found');
            }
        }

        /**
         * Setup the compile workflow
         * @private
         */
        _setupCompileWorkflow() {
            if (!this.controls) return;
            
            const self = this;
            
            // Override the compile callback
            this.controls.setOnCompile(function() {
                return self.compile();
            });
            
            // Override start callback to ensure code is compiled first
            this.controls.setOnStart(function() {
                self.start();
            });
            
            // Override stop callback
            this.controls.setOnStop(function() {
                self.stop();
            });
        }

        /**
         * Setup animation loop to call Berry update
         * Note: The animation loop is already configured in index.html to call
         * Berry's _fast_loop() function. This method is kept for potential
         * future customization but currently does nothing.
         * @private
         */
        _setupAnimationLoop() {
            // Animation loop is configured in index.html to call Berry's _fast_loop()
            // No additional setup needed here
        }

        /**
         * Compile the current code
         * @returns {Promise<boolean>} True if compilation succeeded
         */
        async compile() {
            if (this.isCompiling) {
                return false;
            }
            
            this.isCompiling = true;
            
            try {
                // Get code from editor - always get DSL code if in DSL mode
                const lang = this.editor ? this.editor.getLanguage() : 'dsl';
                let code;
                
                if (lang === 'dsl') {
                    // Get DSL code (current buffer if in DSL mode)
                    code = this.editor ? this.editor.getDSLCode() : '';
                } else {
                    // Get Berry code directly
                    code = this.editor ? this.editor.getCode() : '';
                }
                
                if (!code || code.trim() === '') {
                    throw new Error('No code to compile');
                }
                
                this._log('info', 'Compiling ' + lang.toUpperCase() + ' code...');
                
                // Clear previous errors
                if (this.editor) {
                    this.editor.clearErrors();
                }
                
                let berryCode = code;
                
                // If DSL, transpile to Berry first
                if (lang === 'dsl') {
                    berryCode = await this._transpileDSL(code);
                    if (!berryCode) {
                        throw new Error('DSL transpilation failed');
                    }
                    this._log('info', 'DSL transpiled to Berry (' + berryCode.length + ' chars)');
                    
                    // Update the Berry buffer with transpiled code
                    if (this.editor) {
                        this.editor.setBerryCode(berryCode, true);  // true = is transpiled
                        this.editor.setLastTranspiledDSL(code);
                        this._log('info', 'Berry code available - click "Berry" to view');
                    }
                }
                
                // Execute the Berry code to set up the animation
                await this._executeBerry(berryCode);
                
                // Store compiled code
                this.lastCompiledCode = code;
                this.lastCompiledLanguage = lang;
                this.berryCode = berryCode;
                
                this._log('success', 'Compilation successful');
                
                if (this.controls) {
                    this.controls.showSuccess('Compiled successfully');
                }
                
                this.isCompiling = false;
                return true;
                
            } catch (error) {
                this.isCompiling = false;
                this._handleCompileError(error);
                return false;
            }
        }

        /**
         * Transpile DSL code to Berry
         * @private
         * @param {string} dslCode - DSL code to transpile
         * @returns {Promise<string>} Transpiled Berry code
         */
        async _transpileDSL(dslCode) {
            // Use the real DSL transpiler
            if (!window.dslTranspiler) {
                throw new Error('DSL transpiler not available');
            }
            
            try {
                const result = await window.dslTranspiler.transpile(dslCode);
                
                if (result.success && result.berryCode) {
                    this._log('info', 'DSL transpiled successfully');
                    return result.berryCode;
                } else {
                    // Transpilation failed - show error in editor
                    const errorMsg = result.error || 'Unknown transpilation error';
                    this._log('error', 'DSL transpilation failed: ' + errorMsg);
                    
                    // Try to extract line number from error message
                    this._showTranspilerError(errorMsg);
                    
                    throw new Error(errorMsg);
                }
            } catch (error) {
                // If transpiler throws, show error and propagate
                this._log('error', 'DSL transpiler error: ' + error.message);
                this._showTranspilerError(error.message);
                throw error;
            }
        }

        /**
         * Show transpiler error in the editor
         * @private
         * @param {string} errorMsg - Error message from transpiler
         */
        _showTranspilerError(errorMsg) {
            if (!this.editor) return;
            
            // Try to extract line number from error message
            // Common patterns: "line 5", "at line 5", "Line 5:", etc.
            const lineMatch = errorMsg.match(/(?:line|Line|at line)\s*:?\s*(\d+)/i);
            
            if (lineMatch) {
                const lineNum = parseInt(lineMatch[1], 10);
                this.editor.showError(lineNum, errorMsg);
            } else {
                // No line number found - just log the error
                // Could highlight first line as a fallback
                this.editor.showError(1, errorMsg);
            }
        }



        /**
         * Execute Berry code
         * @private
         * @param {string} code - Berry code to execute
         * @returns {Promise<void>}
         */
        async _executeBerry(code) {
            // Store the code for potential future use
            this.berryCode = code;
            
            // Execute the Berry code using the Berry VM
            // The animation engine will register its fast_loop closure
            // which will be called by the animation loop
            if (window.berryVM && window.berryVM.ready) {
                const result = await window.berryVM.execute(code);
                if (!result.success) {
                    throw new Error(result.error || 'Berry execution failed');
                }
            }
        }

        /**
         * Handle compile error
         * @private
         * @param {Error} error - The error that occurred
         */
        _handleCompileError(error) {
            const message = error.message || 'Unknown error';
            
            this._log('error', 'Compilation failed: ' + message);
            
            // Try to extract line number from error
            const lineMatch = message.match(/line\s*(\d+)/i);
            if (lineMatch && this.editor) {
                const lineNum = parseInt(lineMatch[1], 10);
                this.editor.showError(lineNum, message);
            }
            
            if (this.controls) {
                this.controls.showError('Compile error: ' + message);
            }
        }

        /**
         * Start the animation
         */
        start() {
            if (this.isRunning) return;
            
            // Auto-compile if code has changed
            const currentCode = this.editor ? this.editor.getCode() : '';
            const currentLang = this.editor ? this.editor.getLanguage() : 'dsl';
            
            if (currentCode !== this.lastCompiledCode || currentLang !== this.lastCompiledLanguage) {
                // Need to compile first
                this.compile().then((success) => {
                    if (success) {
                        this._startAnimation();
                    }
                });
            } else {
                this._startAnimation();
            }
        }

        /**
         * Internal start animation
         * @private
         */
        _startAnimation() {
            this.isRunning = true;
            
            if (this.animationLoop) {
                this.animationLoop.start();
            }
            
            this._log('info', 'Animation started');
        }

        /**
         * Stop the animation
         */
        stop() {
            if (!this.isRunning) return;
            
            this.isRunning = false;
            
            if (this.animationLoop) {
                this.animationLoop.stop();
            }
            
            this._log('info', 'Animation stopped');
        }

        /**
         * Called each animation frame
         * Berry's _fast_loop() handles the actual animation rendering
         * This method is kept for potential future use but does nothing now
         * @private
         */
        _onFrame() {
            // Berry's _fast_loop() handles animation rendering via the animation loop
            // No JavaScript fallback animation - Berry only
        }

        /**
         * Log a message
         * @private
         */
        _log(type, message) {
            if (this.consoleManager) {
                switch (type) {
                    case 'info':
                        this.consoleManager.info(message);
                        break;
                    case 'warn':
                        this.consoleManager.warn(message);
                        break;
                    case 'error':
                        this.consoleManager.error(message);
                        break;
                    case 'success':
                        this.consoleManager.success(message);
                        break;
                    default:
                        this.consoleManager.log(message);
                }
            }
        }

        /**
         * Show error to user
         * @private
         */
        _showError(message) {
            if (this.controls) {
                this.controls.showError(message);
            }
            
            // Also update status display if available
            const statusDisplay = document.getElementById('status-display');
            if (statusDisplay) {
                statusDisplay.textContent = 'Error';
                statusDisplay.className = 'led-status-item status-error';
            }
        }

        /**
         * Check if Berry WASM is ready
         * @returns {boolean}
         */
        isBerryReady() {
            return this.berryReady;
        }

        /**
         * Check if animation is running
         * @returns {boolean}
         */
        isAnimationRunning() {
            return this.isRunning;
        }

        /**
         * Get the code editor instance
         * @returns {CodeEditor|null}
         */
        getEditor() {
            return this.editor;
        }

        /**
         * Get the animation controls instance
         * @returns {AnimationControls|null}
         */
        getControls() {
            return this.controls;
        }

        /**
         * Get the LED Strip API instance
         * @returns {Object|null} The LED Strip API object
         */
        getLEDStripAPI() {
            return this.ledStripAPI;
        }
    }

    // Export to window
    window.BerryAnimationSimulator = BerryAnimationSimulator;

    /**
     * Initialize the global Berry Animation Simulator
     * @param {Object} options - Configuration options
     * @returns {Promise<BerryAnimationSimulator>} The initialized simulator
     */
    window.initBerrySimulator = async function(options = {}) {
        const simulator = new BerryAnimationSimulator(options);
        await simulator.init();
        window.berrySimulator = simulator;
        return simulator;
    };

})(window);
