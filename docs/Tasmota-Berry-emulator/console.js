/**
 * ConsoleManager - Manages the console/log panel with Tasmota styling
 * 
 * Provides console output functionality with:
 * - Auto-scroll capability
 * - Clear functionality
 * - Line count tracking
 * - Message type styling (info, warn, error, success)
 * - Timestamp support
 * 
 * Part of the Berry Animation Framework Browser Simulator.
 * Requirements: 8.5
 */

class ConsoleManager {
  /**
   * Create a new console manager
   * @param {Object} options - Configuration options
   * @param {string} options.outputId - ID of the textarea element for output
   * @param {string} options.clearBtnId - ID of the clear button
   * @param {string} options.autoScrollId - ID of the auto-scroll checkbox
   * @param {string} options.lineCountId - ID of the line count display element
   * @param {number} options.maxLines - Maximum number of lines to keep (default 500)
   * @param {boolean} options.showTimestamps - Whether to show timestamps (default true)
   */
  constructor(options = {}) {
    // Get DOM elements
    this.outputEl = document.getElementById(options.outputId || 'console-output');
    this.clearBtn = document.getElementById(options.clearBtnId || 'btn-clear');
    this.autoScrollCheckbox = document.getElementById(options.autoScrollId || 'console-autoscroll');
    this.lineCountEl = document.getElementById(options.lineCountId || 'console-line-count');
    
    // Configuration
    this.maxLines = options.maxLines || 500;
    this.showTimestamps = options.showTimestamps !== false;
    
    // State
    this.lineCount = 0;
    this.autoScroll = true;
    
    // Initialize
    this._init();
  }
  
  /**
   * Initialize the console manager
   * @private
   */
  _init() {
    // Set up clear button handler
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => this.clear());
    }
    
    // Set up auto-scroll checkbox handler
    if (this.autoScrollCheckbox) {
      this.autoScrollCheckbox.checked = this.autoScroll;
      this.autoScrollCheckbox.addEventListener('change', (e) => {
        this.autoScroll = e.target.checked;
        if (this.autoScroll) {
          this._scrollToBottom();
        }
      });
    }
    
    // Update line count display
    this._updateLineCount();
    
    // Override console methods to capture output
    this._interceptConsole();
  }
  
  /**
   * Intercept console.log, console.warn, console.error to display in panel
   * @private
   */
  _interceptConsole() {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;
    
    const self = this;
    
    console.log = function(...args) {
      originalLog.apply(console, args);
      self.log(args.map(a => self._formatArg(a)).join(' '));
    };
    
    console.warn = function(...args) {
      originalWarn.apply(console, args);
      self.warn(args.map(a => self._formatArg(a)).join(' '));
    };
    
    console.error = function(...args) {
      originalError.apply(console, args);
      self.error(args.map(a => self._formatArg(a)).join(' '));
    };
    
    console.info = function(...args) {
      originalInfo.apply(console, args);
      self.info(args.map(a => self._formatArg(a)).join(' '));
    };
  }
  
  /**
   * Format an argument for display
   * @private
   * @param {*} arg - Argument to format
   * @returns {string} Formatted string
   */
  _formatArg(arg) {
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg, null, 2);
      } catch (e) {
        return String(arg);
      }
    }
    return String(arg);
  }
  
  /**
   * Get current timestamp string
   * @private
   * @returns {string} Formatted timestamp
   */
  _getTimestamp() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${ms}`;
  }
  
  /**
   * Append a message to the console
   * @private
   * @param {string} message - Message to append
   * @param {string} prefix - Optional prefix (e.g., '[INFO]', '[ERROR]')
   */
  _appendMessage(message, prefix = '') {
    if (!this.outputEl) return;
    
    // Build the line
    let line = '';
    if (this.showTimestamps) {
      line += `[${this._getTimestamp()}] `;
    }
    if (prefix) {
      line += `${prefix} `;
    }
    line += message;
    
    // Append to output
    const currentText = this.outputEl.value;
    if (currentText) {
      this.outputEl.value = currentText + '\n' + line;
    } else {
      this.outputEl.value = line;
    }
    
    // Update line count
    this.lineCount++;
    this._updateLineCount();
    
    // Trim if exceeding max lines
    this._trimLines();
    
    // Auto-scroll if enabled
    if (this.autoScroll) {
      this._scrollToBottom();
    }
  }
  
  /**
   * Trim lines if exceeding maximum
   * @private
   */
  _trimLines() {
    if (!this.outputEl || this.lineCount <= this.maxLines) return;
    
    const lines = this.outputEl.value.split('\n');
    if (lines.length > this.maxLines) {
      const trimmed = lines.slice(lines.length - this.maxLines);
      this.outputEl.value = trimmed.join('\n');
      this.lineCount = trimmed.length;
      this._updateLineCount();
    }
  }
  
  /**
   * Scroll to the bottom of the console
   * @private
   */
  _scrollToBottom() {
    if (this.outputEl) {
      this.outputEl.scrollTop = this.outputEl.scrollHeight;
    }
  }
  
  /**
   * Update the line count display
   * @private
   */
  _updateLineCount() {
    if (this.lineCountEl) {
      this.lineCountEl.textContent = `${this.lineCount} line${this.lineCount !== 1 ? 's' : ''}`;
    }
  }
  
  /**
   * Log an info message
   * @param {string} message - Message to log
   */
  log(message) {
    this._appendMessage(message);
  }
  
  /**
   * Log an info message with [INFO] prefix
   * @param {string} message - Message to log
   */
  info(message) {
    this._appendMessage(message, '[INFO]');
  }
  
  /**
   * Log a warning message with [WARN] prefix
   * @param {string} message - Message to log
   */
  warn(message) {
    this._appendMessage(message, '[WARN]');
  }
  
  /**
   * Log an error message with [ERROR] prefix
   * @param {string} message - Message to log
   */
  error(message) {
    this._appendMessage(message, '[ERROR]');
  }
  
  /**
   * Log a success message with [OK] prefix
   * @param {string} message - Message to log
   */
  success(message) {
    this._appendMessage(message, '[OK]');
  }
  
  /**
   * Clear the console
   */
  clear() {
    if (this.outputEl) {
      this.outputEl.value = '';
      this.lineCount = 0;
      this._updateLineCount();
    }
  }
  
  /**
   * Get the current console content
   * @returns {string} Console content
   */
  getContent() {
    return this.outputEl ? this.outputEl.value : '';
  }
  
  /**
   * Set auto-scroll state
   * @param {boolean} enabled - Whether auto-scroll is enabled
   */
  setAutoScroll(enabled) {
    this.autoScroll = enabled;
    if (this.autoScrollCheckbox) {
      this.autoScrollCheckbox.checked = enabled;
    }
    if (enabled) {
      this._scrollToBottom();
    }
  }
  
  /**
   * Get auto-scroll state
   * @returns {boolean} Whether auto-scroll is enabled
   */
  getAutoScroll() {
    return this.autoScroll;
  }
  
  /**
   * Set whether to show timestamps
   * @param {boolean} show - Whether to show timestamps
   */
  setShowTimestamps(show) {
    this.showTimestamps = show;
  }
}

// Global console manager instance
window.consoleManager = null;

/**
 * Initialize the global console manager
 * @param {Object} options - Configuration options
 * @returns {ConsoleManager} The initialized console manager
 */
window.initConsole = function(options = {}) {
  window.consoleManager = new ConsoleManager(options);
  return window.consoleManager;
};

/**
 * Log a message to the console panel
 * @param {string} message - Message to log
 */
window.consoleLog = function(message) {
  if (window.consoleManager) {
    window.consoleManager.log(message);
  }
};

/**
 * Clear the console panel
 */
window.consoleClear = function() {
  if (window.consoleManager) {
    window.consoleManager.clear();
  }
};

/**
 * Required by Berry's print() function - called by _js_writebuffer in be_port.c
 * Receives text output from Berry and displays it in the console panel
 * @param {string} text - Text output from Berry
 */
window.writeOutputText = function(text) {
  if (window.consoleManager) {
    // Remove trailing newline if present (console manager adds its own)
    var cleanText = text.replace(/\n$/, '');
    if (cleanText) {
      window.consoleManager.log(cleanText);
    }
  } else {
    // Fallback to browser console
    console.log('[Berry Output]', text);
  }
};

/**
 * Required by Berry's input() function - called by _js_readbuffer in be_port.c
 * Returns a promise that resolves to user input text
 * For now, returns empty string as we don't support interactive input
 * @returns {Promise<string>} User input (empty string for now)
 */
window.waitLineText = function() {
  // For now, return empty string - interactive input not supported
  // In the future, this could prompt the user for input
  return Promise.resolve('');
};

// Export for Node.js/CommonJS (for testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ConsoleManager };
}
