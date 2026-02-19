/**
 * BerryVM JavaScript Wrapper
 * 
 * Provides a JavaScript interface to execute Berry code and call Berry functions
 * from the browser. This wrapper uses Emscripten's ccall to invoke the exported
 * C functions in the Berry WASM module.
 * 
 * Part of the Berry Animation Framework Browser Simulator.
 */

class BerryVM {
    constructor() {
        this.ready = false;
        this._readyPromise = null;
    }
    
    /**
     * Wait for Berry WASM module to be ready
     * @returns {Promise<void>}
     */
    async waitReady() {
        if (this.ready) return Promise.resolve();
        
        if (this._readyPromise) return this._readyPromise;
        
        this._readyPromise = new Promise((resolve, reject) => {
            const maxWait = 30000; // 30 seconds timeout
            const startTime = Date.now();
            
            const check = () => {
                if (typeof Module !== 'undefined' && Module.calledRun) {
                    this.ready = true;
                    this._initializeVM().then(resolve).catch(reject);
                } else if (Date.now() - startTime > maxWait) {
                    reject(new Error('Timeout waiting for Berry WASM module'));
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
        
        return this._readyPromise;
    }
    
    /**
     * Initialize the Berry VM by executing autoexec.be
     * Sets __JS__ global flag to indicate browser environment
     * @private
     * @returns {Promise<void>}
     */
    async _initializeVM() {
        try {
            // Execute: __JS__=true compile("autoexec.be", "file")()
            // The __JS__ flag allows Berry code to detect if it's running in a browser
            // compile() loads the file from virtual filesystem and returns a function
            const initCode = '__JS__=true compile("autoexec.be", "file")()';
            const result = await this.execute(initCode);
            
            if (!result.success) {
                console.warn('[BerryVM] Warning: autoexec.be initialization failed:', result.error);
                // Don't reject - VM is still usable, just without autoexec
            } else {
                console.log('[BerryVM] Successfully initialized with autoexec.be');
            }
        } catch (e) {
            console.warn('[BerryVM] Warning: Error during VM initialization:', e.message);
            // Don't reject - VM is still usable
        }
    }
    
    /**
     * Execute Berry source code
     * @param {string} code - Berry source code to execute
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async execute(code) {
        if (!this.ready) await this.waitReady();
        
        try {
            const result = Module.ccall('berry_execute', 'number', ['string'], [code]);
            return {
                success: result === 0,
                error: result !== 0 ? `Execution failed with code ${result}` : undefined
            };
        } catch (e) {
            return {
                success: false,
                error: e.message || 'Unknown error during execution'
            };
        }
    }
    
    /**
     * Execute Berry source code and return the result
     * @param {string} code - Berry source code to execute
     * @returns {Promise<{success: boolean, result?: any, error?: string}>}
     */
    async executeWithResult(code) {
        if (!this.ready) await this.waitReady();
        
        try {
            const resultPtr = Module.ccall('berry_execute_result', 'number', ['string'], [code]);
            
            if (resultPtr === 0) {
                return { success: false, error: 'Execution failed' };
            }
            
            const resultJson = Module.UTF8ToString(resultPtr);
            Module._free(resultPtr);
            
            try {
                const result = JSON.parse(resultJson);
                return { success: true, result: result };
            } catch (parseError) {
                // If JSON parsing fails, return the raw string
                return { success: true, result: resultJson };
            }
        } catch (e) {
            return {
                success: false,
                error: e.message || 'Unknown error during execution'
            };
        }
    }

    /**
     * Call a global Berry function by name with no arguments
     * @param {string} functionName - Name of the global function
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async callGlobalNoArgs(functionName) {
        if (!this.ready) await this.waitReady();
        
        try {
            const result = Module.ccall('berry_call_global', 'number', ['string'], [functionName]);
            return {
                success: result === 0,
                error: result !== 0 ? `Call failed with code ${result}` : undefined
            };
        } catch (e) {
            return {
                success: false,
                error: e.message || 'Unknown error during call'
            };
        }
    }
    
    /**
     * Call a global Berry function by name with arguments
     * @param {string} functionName - Name of the global function
     * @param {...any} args - Arguments to pass to the function
     * @returns {Promise<{success: boolean, result?: any, error?: string}>}
     */
    async callGlobal(functionName, ...args) {
        if (!this.ready) await this.waitReady();
        
        // If no arguments, use the simpler call
        if (args.length === 0) {
            return this.callGlobalNoArgs(functionName);
        }
        
        try {
            const argsJson = JSON.stringify(args);
            const resultPtr = Module.ccall('berry_call_global_args', 'number', 
                ['string', 'string'], [functionName, argsJson]);
            
            if (resultPtr === 0) {
                return { success: false, error: 'Call failed or returned null' };
            }
            
            const resultJson = Module.UTF8ToString(resultPtr);
            Module._free(resultPtr);
            
            try {
                return { success: true, result: JSON.parse(resultJson) };
            } catch (parseError) {
                // If JSON parsing fails, return the raw string
                return { success: true, result: resultJson };
            }
        } catch (e) {
            return {
                success: false,
                error: e.message || 'Unknown error during call'
            };
        }
    }
    
    /**
     * Get a global Berry variable
     * @param {string} name - Variable name
     * @returns {Promise<any>} - Variable value (undefined if not found)
     */
    async getGlobal(name) {
        if (!this.ready) await this.waitReady();
        
        try {
            const resultPtr = Module.ccall('berry_get_global', 'number', ['string'], [name]);
            
            if (resultPtr === 0) {
                return undefined;
            }
            
            const resultJson = Module.UTF8ToString(resultPtr);
            Module._free(resultPtr);
            
            try {
                return JSON.parse(resultJson);
            } catch (parseError) {
                // If JSON parsing fails, return the raw string
                return resultJson;
            }
        } catch (e) {
            console.error('Error getting global:', e);
            return undefined;
        }
    }
    
    /**
     * Set a global Berry variable
     * @param {string} name - Variable name
     * @param {any} value - Value to set
     * @returns {Promise<boolean>} - True if successful
     */
    async setGlobal(name, value) {
        if (!this.ready) await this.waitReady();
        
        try {
            const valueJson = JSON.stringify(value);
            const result = Module.ccall('berry_set_global', 'number', 
                ['string', 'string'], [name, valueJson]);
            return result === 0;
        } catch (e) {
            console.error('Error setting global:', e);
            return false;
        }
    }
    
    /**
     * Check if the VM is ready
     * @returns {boolean}
     */
    isReady() {
        return this.ready;
    }
    
    /**
     * Get milliseconds since Berry VM initialization
     * Emulates tasmota.millis() for browser-based animation timing
     * Uses JavaScript performance.now() for high-resolution timing
     * @returns {number} - Milliseconds since VM initialization (integer)
     */
    millis() {
        if (!this.ready) {
            console.warn('[BerryVM] millis() called before VM is ready');
            return 0;
        }
        
        try {
            return Module.ccall('tasmota_millis', 'number', [], []);
        } catch (e) {
            console.error('[BerryVM] Error calling tasmota_millis:', e);
            return 0;
        }
    }
}

// Create and export global instance
window.berryVM = new BerryVM();

// Also export tasmota_millis as a global function for direct access
window.tasmota_millis = function() {
    if (window.berryVM && window.berryVM.ready) {
        return window.berryVM.millis();
    }
    return 0;
};

// Also export the class for custom instances
window.BerryVM = BerryVM;
