/**
 * DSL Transpiler JavaScript Wrapper
 * 
 * Provides a JavaScript interface to the Berry Animation DSL transpiler.
 * This wrapper loads the DSL transpiler Berry code into the WASM module
 * and provides functions to transpile DSL code to Berry code.
 * 
 * Part of the Berry Animation Framework Browser Simulator.
 * Requirements: 10.1
 */

(function(window) {
    'use strict';

    /**
     * DSLTranspiler - Wrapper for the Berry Animation DSL transpiler
     */
    class DSLTranspiler {
        constructor() {
            this.ready = false;
            this.loaded = false;
            this._readyPromise = null;
            this._loadPromise = null;
        }

        /**
         * Wait for Berry VM to be ready
         * @returns {Promise<void>}
         */
        async waitReady() {
            if (this.ready) return Promise.resolve();
            
            // Wait for berryVM to be ready
            if (window.berryVM) {
                await window.berryVM.waitReady();
                this.ready = true;
                return;
            }
            
            // Fallback: wait for Module
            return new Promise((resolve, reject) => {
                const maxWait = 30000;
                const startTime = Date.now();
                
                const check = () => {
                    if (typeof Module !== 'undefined' && Module.calledRun) {
                        this.ready = true;
                        resolve();
                    } else if (Date.now() - startTime > maxWait) {
                        reject(new Error('Timeout waiting for Berry WASM module'));
                    } else {
                        setTimeout(check, 100);
                    }
                };
                check();
            });
        }

        /**
         * Load the DSL transpiler Berry code into the WASM module
         * This must be called before transpiling DSL code
         * @returns {Promise<{success: boolean, error?: string}>}
         */
        async load() {
            if (this.loaded) {
                return { success: true };
            }
            
            if (this._loadPromise) {
                return this._loadPromise;
            }
            
            this._loadPromise = this._doLoad();
            return this._loadPromise;
        }

        /**
         * Internal load implementation
         * @private
         */
        async _doLoad() {
            try {
                await this.waitReady();
                
                // Both animation and animation_dsl modules should already be loaded
                // at a higher level (e.g., by autoexec.be or during Berry VM initialization)
                // We just mark ourselves as loaded and ready to transpile
                
                this.loaded = true;
                return { success: true };
                
            } catch (error) {
                return { 
                    success: false, 
                    error: error.message || 'Unknown error loading DSL transpiler'
                };
            }
        }

        /**
         * Execute Berry code
         * @private
         */
        async _executeCode(code) {
            if (window.berryVM) {
                return window.berryVM.execute(code);
            }
            
            // Fallback to direct Module.ccall
            try {
                const result = Module.ccall('berry_execute', 'number', ['string'], [code]);
                return {
                    success: result === 0,
                    error: result !== 0 ? `Execution failed with code ${result}` : undefined
                };
            } catch (e) {
                return {
                    success: false,
                    error: e.message || 'Unknown error'
                };
            }
        }

        /**
         * Get a global Berry variable
         * @private
         */
        async _getGlobal(name) {
            if (window.berryVM) {
                return window.berryVM.getGlobal(name);
            }
            
            // Fallback to direct Module.ccall
            try {
                const resultPtr = Module.ccall('berry_get_global', 'number', ['string'], [name]);
                if (resultPtr === 0) return undefined;
                
                const resultJson = Module.UTF8ToString(resultPtr);
                Module._free(resultPtr);
                
                try {
                    const parsed = JSON.parse(resultJson);
                    return parsed;
                } catch (e) {
                    return resultJson;
                }
            } catch (e) {
                return undefined;
            }
        }

        /**
         * Set a global Berry variable
         * @private
         */
        async _setGlobal(name, value) {
            if (window.berryVM) {
                return window.berryVM.setGlobal(name, value);
            }
            
            // Fallback to direct Module.ccall
            try {
                const valueJson = JSON.stringify(value);
                const result = Module.ccall('berry_set_global', 'number', 
                    ['string', 'string'], [name, valueJson]);
                return result === 0;
            } catch (e) {
                return false;
            }
        }

        /**
         * Transpile DSL code to Berry code
         * @param {string} dslCode - DSL source code to transpile
         * @returns {Promise<{success: boolean, berryCode?: string, error?: string}>}
         */
        async transpile(dslCode) {
            try {
                // Ensure transpiler is loaded
                if (!this.loaded) {
                    const loadResult = await this.load();
                    if (!loadResult.success) {
                        return loadResult;
                    }
                }
                
                // Build Berry code that includes the DSL source as a string literal
                // This avoids JSON parsing issues with newlines
                // We escape the DSL code for use in a Berry string literal
                const escapedCode = dslCode
                    .replace(/\\/g, '\\\\')  // Escape backslashes first
                    .replace(/"/g, '\\"')    // Escape double quotes
                    .replace(/\n/g, '\\n')   // Escape newlines
                    .replace(/\r/g, '\\r')   // Escape carriage returns
                    .replace(/\t/g, '\\t');  // Escape tabs
                
                // Call the transpiler
                // The animation_dsl.compile() function takes a string and returns Berry code
                const compileCode = `
try
    global._dsl_transpiler_result = animation_dsl.compile("${escapedCode}")
    global._dsl_transpiler_error = nil
except .. as e, msg
    global._dsl_transpiler_result = nil
    global._dsl_transpiler_error = msg
end
`;
                
                const compileResult = await this._executeCode(compileCode);
                if (!compileResult.success) {
                    return {
                        success: false,
                        error: 'Transpiler execution failed: ' + (compileResult.error || 'unknown error')
                    };
                }
                
                // Check for transpiler error
                const transpilerError = await this._getGlobal('_dsl_transpiler_error');
                if (transpilerError) {
                    return {
                        success: false,
                        error: transpilerError
                    };
                }
                
                // Get the result
                let berryCode = await this._getGlobal('_dsl_transpiler_result');
                
                if (!berryCode || (typeof berryCode === 'string' && berryCode.trim() === '')) {
                    return {
                        success: false,
                        error: 'Transpiler returned empty result'
                    };
                }
                
                // Unescape the Berry code - it contains escape sequences from the transpiler
                if (typeof berryCode === 'string') {
                    // First, strip surrounding quotes if present (JSON string format)
                    if ((berryCode.startsWith('"') && berryCode.endsWith('"')) ||
                        (berryCode.startsWith("'") && berryCode.endsWith("'"))) {
                        berryCode = berryCode.slice(1, -1);
                    }
                    
                    // Then unescape the escape sequences
                    berryCode = berryCode
                        .replace(/\\n/g, '\n')     // Convert \n to newline
                        .replace(/\\r/g, '\r')     // Convert \r to carriage return
                        .replace(/\\t/g, '\t')     // Convert \t to tab
                        .replace(/\\"/g, '"')      // Convert \" to quote
                        .replace(/\\\\/g, '\\');   // Convert \\ to backslash (do last)
                }
                
                return {
                    success: true,
                    berryCode: berryCode
                };
                
            } catch (error) {
                return {
                    success: false,
                    error: error.message || 'Unknown transpilation error'
                };
            }
        }

        /**
         * Escape a string for use in a Berry string literal
         * @private
         */
        _escapeForBerry(str) {
            return str
                .replace(/\\/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r')
                .replace(/\t/g, '\\t');
        }

        /**
         * Check if the transpiler is loaded and ready
         * @returns {boolean}
         */
        isLoaded() {
            return this.loaded;
        }

        /**
         * Check if the Berry VM is ready
         * @returns {boolean}
         */
        isReady() {
            return this.ready;
        }
    }

    // Create and export global instance
    window.dslTranspiler = new DSLTranspiler();

    // Also export the class for custom instances
    window.DSLTranspiler = DSLTranspiler;

})(window);
