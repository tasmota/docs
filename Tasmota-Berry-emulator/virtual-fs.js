/**
 * Virtual Filesystem Manager for Berry WASM
 * 
 * Provides a JavaScript-side virtual filesystem that Berry can access
 * via the js_read_virtual_file() EM_JS function in be_port.c.
 * 
 * This enables Berry's `import` statement to load modules from JavaScript
 * without requiring actual filesystem access in the browser.
 * 
 * Usage:
 *   window.virtualFS.registerFile('animation.be', 'class Animation ... end');
 *   // Berry can now: import animation
 */

class VirtualFS {
    constructor() {
        // File content dictionary: normalized path -> content string
        this.files = {};
        
        // Debug mode for logging file access
        this.debug = false;
    }
    
    /**
     * Normalize a file path to a canonical form.
     * Handles multiple path formats:
     *   - '/animation.be' -> 'animation.be'
     *   - 'animation.be' -> 'animation.be'
     *   - 'animation' -> 'animation' (will try with .be extension)
     *   - './animation.be' -> 'animation.be'
     *   - 'path/to/file.be' -> 'path/to/file.be'
     * 
     * @param {string} path - The file path to normalize
     * @returns {string} - Normalized path
     */
    normalizePath(path) {
        if (!path) return '';
        
        // Remove leading slashes and ./
        let normalized = path.replace(/^[\/\.]+/, '');
        
        // Remove any double slashes
        normalized = normalized.replace(/\/+/g, '/');
        
        return normalized;
    }
    
    /**
     * Register a file in the virtual filesystem.
     * 
     * @param {string} path - File path (e.g., 'animation.be', '/animation.be')
     * @param {string} content - File content as a string
     */
    registerFile(path, content) {
        const normalized = this.normalizePath(path);
        this.files[normalized] = content;
        
        if (this.debug) {
            console.log(`[VirtualFS] Registered: ${normalized} (${content.length} bytes)`);
        }
    }
    
    /**
     * Register multiple files at once.
     * 
     * @param {Object} fileMap - Object mapping paths to content strings
     */
    registerFiles(fileMap) {
        for (const [path, content] of Object.entries(fileMap)) {
            this.registerFile(path, content);
        }
    }
    
    /**
     * Get a file's content from the virtual filesystem.
     * Called from C via EM_JS js_read_virtual_file().
     * 
     * Tries multiple path variations:
     *   1. Exact normalized path
     *   2. With .be extension added
     *   3. With .bec extension added (compiled Berry)
     * 
     * @param {string} path - File path to retrieve
     * @returns {string|null} - File content, or null if not found
     */
    getFile(path) {
        const normalized = this.normalizePath(path);
        
        // Try exact path first
        if (this.files.hasOwnProperty(normalized)) {
            if (this.debug) {
                console.log(`[VirtualFS] Found: ${normalized}`);
            }
            return this.files[normalized];
        }
        
        // Try with .be extension
        const withBe = normalized + '.be';
        if (this.files.hasOwnProperty(withBe)) {
            if (this.debug) {
                console.log(`[VirtualFS] Found: ${withBe} (added .be)`);
            }
            return this.files[withBe];
        }
        
        // Try with .bec extension (compiled Berry bytecode)
        const withBec = normalized + '.bec';
        if (this.files.hasOwnProperty(withBec)) {
            if (this.debug) {
                console.log(`[VirtualFS] Found: ${withBec} (added .bec)`);
            }
            return this.files[withBec];
        }
        
        if (this.debug) {
            console.log(`[VirtualFS] Not found: ${path} (tried: ${normalized}, ${withBe}, ${withBec})`);
        }
        
        return null;
    }
    
    /**
     * Check if a file exists in the virtual filesystem.
     * 
     * @param {string} path - File path to check
     * @returns {boolean} - True if file exists
     */
    hasFile(path) {
        return this.getFile(path) !== null;
    }
    
    /**
     * Remove a file from the virtual filesystem.
     * 
     * @param {string} path - File path to remove
     * @returns {boolean} - True if file was removed
     */
    removeFile(path) {
        const normalized = this.normalizePath(path);
        if (this.files.hasOwnProperty(normalized)) {
            delete this.files[normalized];
            if (this.debug) {
                console.log(`[VirtualFS] Removed: ${normalized}`);
            }
            return true;
        }
        return false;
    }
    
    /**
     * Clear all files from the virtual filesystem.
     */
    clear() {
        this.files = {};
        if (this.debug) {
            console.log('[VirtualFS] Cleared all files');
        }
    }
    
    /**
     * List all registered files.
     * 
     * @returns {string[]} - Array of registered file paths
     */
    listFiles() {
        return Object.keys(this.files);
    }
    
    /**
     * Get the number of registered files.
     * 
     * @returns {number} - Number of files
     */
    get size() {
        return Object.keys(this.files).length;
    }
    
    /**
     * Enable or disable debug logging.
     * 
     * @param {boolean} enabled - Whether to enable debug mode
     */
    setDebug(enabled) {
        this.debug = enabled;
    }
}

// Create and export global instance
// This is what be_port.c's js_read_virtual_file() expects
window.virtualFS = new VirtualFS();

// Also export the class for testing or creating additional instances
window.VirtualFS = VirtualFS;

// Log initialization
console.log('[VirtualFS] Virtual filesystem initialized');
