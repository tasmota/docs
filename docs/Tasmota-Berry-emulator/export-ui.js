/**
 * Export UI - Dialog and controls for exporting animations as APNG
 * 
 * Provides a Tasmota-styled dialog with:
 * - FPS selector (15/30/60 FPS radio buttons)
 * - Duration input (1-30 seconds)
 * - Progress bar during export
 * - Cancel button for in-progress exports
 * 
 * Part of the Berry Animation Framework Browser Simulator.
 * Requirements: 11.1.1, 11.1.2, 11.1.6, 11.1.8, 18.4
 */

/**
 * ExportUI - Manages the APNG export dialog and controls
 */
class ExportUI {
    /**
     * Create export UI
     * @param {Object} options - Configuration options
     * @param {string} options.dialogId - ID for the dialog overlay (default 'export-dialog')
     * @param {string} options.exportBtnId - ID of the export button (default 'btn-export')
     * @param {Function} options.onExport - Callback when export starts (fps, duration) => Promise
     * @param {Function} options.onCancel - Callback when export is cancelled
     * @param {Function} options.getStripSize - Function to get current LED strip size
     */
    constructor(options = {}) {
        this.dialogId = options.dialogId || 'export-dialog';
        this.exportBtnId = options.exportBtnId || 'btn-export';
        this.onExport = options.onExport || null;
        this.onCancel = options.onCancel || null;
        this.getStripSize = options.getStripSize || (() => 30);
        
        // State
        this.isExporting = false;
        this.isCancelled = false;
        this.selectedFPS = 30;
        this.duration = 3;
        
        // DOM elements (will be created)
        this.overlay = null;
        this.dialog = null;
        this.exportBtn = null;
        
        // Create dialog HTML
        this._createDialog();
        
        // Setup event handlers
        this._setupEventHandlers();
    }
    
    /**
     * Create the dialog HTML structure
     * @private
     */
    _createDialog() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.id = this.dialogId;
        this.overlay.className = 'export-dialog-overlay';
        
        // Create dialog content
        this.overlay.innerHTML = `
            <div class="export-dialog">
                <div class="export-dialog-header">
                    <h3 class="export-dialog-title">Export Animation</h3>
                    <button class="export-dialog-close" title="Close">&times;</button>
                </div>
                <div class="export-dialog-body">
                    <!-- FPS Selection -->
                    <div class="export-option-group">
                        <label class="export-option-label"><b>Frame Rate</b></label>
                        <div class="export-fps-options">
                            <label class="export-fps-option">
                                <input type="radio" name="export-fps" value="15">
                                <span>15 FPS</span>
                            </label>
                            <label class="export-fps-option">
                                <input type="radio" name="export-fps" value="30" checked>
                                <span>30 FPS</span>
                            </label>
                            <label class="export-fps-option">
                                <input type="radio" name="export-fps" value="60">
                                <span>60 FPS</span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Duration Input -->
                    <div class="export-option-group">
                        <label class="export-option-label"><b>Duration</b></label>
                        <div class="export-duration-input">
                            <input type="number" id="export-duration" min="1" max="120" value="3">
                            <span>seconds (1-120)</span>
                        </div>
                    </div>
                    
                    <!-- Export Info -->
                    <div class="export-info" id="export-info">
                        <div class="export-info-row">
                            <span class="export-info-label">LED Strip:</span>
                            <span class="export-info-value" id="export-info-leds">30 LEDs</span>
                        </div>
                        <div class="export-info-row">
                            <span class="export-info-label">Total Frames:</span>
                            <span class="export-info-value" id="export-info-frames">90 frames</span>
                        </div>
                    </div>
                    
                    <!-- File Size Warning -->
                    <div class="export-size-warning" id="export-size-warning">
                        Large export. Consider reducing duration or FPS for easier sharing.
                    </div>
                    
                    <!-- Progress Section (hidden by default) -->
                    <div class="export-progress-section" id="export-progress-section">
                        <div class="export-progress-label">
                            <span class="export-progress-text" id="export-progress-text">Capturing frames...</span>
                            <span class="export-progress-percent" id="export-progress-percent">0%</span>
                        </div>
                        <div class="export-progress-bar-container">
                            <div class="export-progress-bar" id="export-progress-bar"></div>
                        </div>
                    </div>
                    
                    <!-- Complete Section (hidden by default) -->
                    <div class="export-complete-section" id="export-complete-section">
                        <span class="export-complete-text">✓ Export complete!</span>
                        <span class="export-complete-size" id="export-complete-size">0 KB</span>
                    </div>
                </div>
                <div class="export-dialog-footer">
                    <button class="export-btn-cancel bred" id="export-btn-cancel" style="display:none;">Cancel</button>
                    <button class="export-btn-start bgrn" id="export-btn-start">Start Export</button>
                </div>
            </div>
        `;
        
        // Append to body
        document.body.appendChild(this.overlay);
        
        // Get references to elements
        this.dialog = this.overlay.querySelector('.export-dialog');
        this.closeBtn = this.overlay.querySelector('.export-dialog-close');
        this.startBtn = this.overlay.querySelector('#export-btn-start');
        this.cancelBtn = this.overlay.querySelector('#export-btn-cancel');
        this.durationInput = this.overlay.querySelector('#export-duration');
        this.fpsRadios = this.overlay.querySelectorAll('input[name="export-fps"]');
        this.progressSection = this.overlay.querySelector('#export-progress-section');
        this.progressBar = this.overlay.querySelector('#export-progress-bar');
        this.progressText = this.overlay.querySelector('#export-progress-text');
        this.progressPercent = this.overlay.querySelector('#export-progress-percent');
        this.completeSection = this.overlay.querySelector('#export-complete-section');
        this.sizeWarning = this.overlay.querySelector('#export-size-warning');
        this.infoLeds = this.overlay.querySelector('#export-info-leds');
        this.infoFrames = this.overlay.querySelector('#export-info-frames');
        this.completeSize = this.overlay.querySelector('#export-complete-size');
    }

    /**
     * Setup event handlers
     * @private
     */
    _setupEventHandlers() {
        // Close button
        this.closeBtn.addEventListener('click', () => this.hide());
        
        // Click outside to close (only when not exporting)
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay && !this.isExporting) {
                this.hide();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible() && !this.isExporting) {
                this.hide();
            }
        });
        
        // Start export button
        this.startBtn.addEventListener('click', () => this._handleStartExport());
        
        // Cancel button
        this.cancelBtn.addEventListener('click', () => this._handleCancel());
        
        // FPS radio change
        this.fpsRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.selectedFPS = parseInt(e.target.value, 10);
                this._updateInfo();
            });
        });
        
        // Duration input change
        this.durationInput.addEventListener('input', (e) => {
            let value = parseInt(e.target.value, 10);
            if (isNaN(value) || value < 1) value = 1;
            if (value > 120) value = 120;
            this.duration = value;
            this._updateInfo();
        });
        
        // Duration input blur - enforce limits
        this.durationInput.addEventListener('blur', (e) => {
            let value = parseInt(e.target.value, 10);
            if (isNaN(value) || value < 1) {
                value = 1;
                e.target.value = 1;
            }
            if (value > 120) {
                value = 120;
                e.target.value = 120;
            }
            this.duration = value;
            this._updateInfo();
        });
        
        // Find and setup the export button in the LED toolbar
        this._setupExportButton();
    }
    
    /**
     * Setup the export button in the LED toolbar
     * @private
     */
    _setupExportButton() {
        this.exportBtn = document.getElementById(this.exportBtnId);
        if (this.exportBtn) {
            this.exportBtn.addEventListener('click', () => this.show());
            // Start disabled until animation runs
            this.setEnabled(false);
        }
    }
    
    /**
     * Enable or disable the export button
     * @param {boolean} enabled - Whether the button should be enabled
     */
    setEnabled(enabled) {
        if (this.exportBtn) {
            this.exportBtn.disabled = !enabled;
            if (enabled) {
                this.exportBtn.title = 'Export animation as APNG';
            } else {
                this.exportBtn.title = 'Run an animation first to enable export';
            }
        }
    }
    
    /**
     * Check if export is enabled
     * @returns {boolean} True if export button is enabled
     */
    isEnabled() {
        return this.exportBtn && !this.exportBtn.disabled;
    }
    
    /**
     * Add export button to the LED toolbar
     * @param {string} containerId - ID of the container to add button to
     */
    addExportButton(containerId) {
        const container = document.querySelector('.led-controls-group') || 
                         document.getElementById(containerId);
        
        if (!container) {
            console.warn('ExportUI: Could not find container for export button');
            return;
        }
        
        if (document.getElementById(this.exportBtnId)) {
            return;
        }
        
        this.exportBtn = document.createElement('button');
        this.exportBtn.id = this.exportBtnId;
        this.exportBtn.className = 'led-btn export-btn';
        this.exportBtn.textContent = 'Export';
        this.exportBtn.title = 'Export animation as APNG';
        this.exportBtn.addEventListener('click', () => this.show());
        container.appendChild(this.exportBtn);
    }
    
    /**
     * Update the info display based on current settings
     * @private
     */
    _updateInfo() {
        const stripSize = this.getStripSize();
        const totalFrames = this.selectedFPS * this.duration;
        
        this.infoLeds.textContent = stripSize + ' LEDs';
        this.infoFrames.textContent = totalFrames + ' frames';
        
        // Show warning for very large exports (5000+ frames)
        // With pako compression, much larger exports are now practical
        const estimatedLarge = totalFrames > 5000;
        this.sizeWarning.classList.toggle('visible', estimatedLarge);
    }
    
    /**
     * Handle start export button click
     * @private
     */
    async _handleStartExport() {
        if (this.isExporting) return;
        
        this.isExporting = true;
        this.isCancelled = false;
        this._setExportingState(true);
        
        const fps = this.selectedFPS;
        const duration = this.duration;
        
        try {
            if (this.onExport) {
                const result = await this.onExport(fps, duration, (progress, phase) => {
                    this._updateProgress(progress, phase);
                    return !this.isCancelled;
                });
                
                if (result && result.blob && !this.isCancelled) {
                    this._showComplete(result.blob.size);
                    this._downloadFile(result.blob, result.filename || 'animation.png');
                } else if (this.isCancelled) {
                    this._resetState();
                }
            } else {
                throw new Error('Export callback not configured');
            }
        } catch (error) {
            console.error('Export error:', error);
            if (window.consoleManager) {
                window.consoleManager.error('Export failed: ' + error.message);
            }
            this._resetState();
        }
        
        this.isExporting = false;
    }
    
    /**
     * Handle cancel button click
     * @private
     */
    _handleCancel() {
        if (!this.isExporting) return;
        
        this.isCancelled = true;
        this.progressText.textContent = 'Cancelling...';
        
        if (this.onCancel) {
            this.onCancel();
        }
    }
    
    /**
     * Set UI state for exporting
     * @private
     */
    _setExportingState(exporting) {
        this.startBtn.style.display = exporting ? 'none' : 'block';
        this.cancelBtn.style.display = exporting ? 'block' : 'none';
        this.progressSection.classList.toggle('visible', exporting);
        this.completeSection.classList.remove('visible');
        
        this.durationInput.disabled = exporting;
        this.fpsRadios.forEach(radio => radio.disabled = exporting);
        
        if (exporting) {
            this.progressBar.style.width = '0%';
            this.progressPercent.textContent = '0%';
            this.progressText.textContent = 'Preparing...';
            this.progressBar.classList.remove('encoding');
        }
    }
    
    /**
     * Update progress display
     * @param {number} progress - Progress percentage (0-100)
     * @param {string} phase - Current phase
     */
    _updateProgress(progress, phase) {
        this.progressBar.style.width = progress + '%';
        this.progressPercent.textContent = Math.round(progress) + '%';
        
        switch (phase) {
            case 'capturing':
                this.progressText.textContent = 'Capturing frames...';
                this.progressBar.classList.remove('encoding');
                break;
            case 'encoding':
                this.progressText.textContent = 'Encoding APNG...';
                this.progressBar.classList.add('encoding');
                break;
            case 'complete':
                this.progressText.textContent = 'Complete!';
                this.progressBar.classList.remove('encoding');
                break;
            default:
                this.progressText.textContent = phase || 'Processing...';
        }
    }
    
    /**
     * Show export complete state
     * @private
     */
    _showComplete(fileSize) {
        this.progressSection.classList.remove('visible');
        this.completeSection.classList.add('visible');
        this.completeSize.textContent = this._formatBytes(fileSize);
        
        this.cancelBtn.style.display = 'none';
        this.startBtn.textContent = 'Export Another';
        this.startBtn.style.display = 'block';
        
        this.durationInput.disabled = false;
        this.fpsRadios.forEach(radio => radio.disabled = false);
    }
    
    /**
     * Reset dialog state
     * @private
     */
    _resetState() {
        this._setExportingState(false);
        this.startBtn.textContent = 'Start Export';
        this.completeSection.classList.remove('visible');
        this._updateInfo();
    }
    
    /**
     * Download the generated file
     * @private
     */
    _downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
        if (window.consoleManager) {
            window.consoleManager.success('Exported: ' + filename + ' (' + this._formatBytes(blob.size) + ')');
        }
    }
    
    /**
     * Format bytes to human readable string
     * @private
     */
    _formatBytes(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
    
    /**
     * Show the export dialog
     */
    show() {
        this._updateInfo();
        if (!this.isExporting) {
            this._resetState();
        }
        this.overlay.classList.add('visible');
        setTimeout(() => this.durationInput.focus(), 100);
    }
    
    /**
     * Hide the export dialog
     */
    hide() {
        if (this.isExporting) return;
        this.overlay.classList.remove('visible');
    }
    
    /**
     * Check if dialog is visible
     */
    isVisible() {
        return this.overlay.classList.contains('visible');
    }
    
    /**
     * Set the export callback
     */
    setOnExport(callback) {
        this.onExport = callback;
    }
    
    /**
     * Set the cancel callback
     */
    setOnCancel(callback) {
        this.onCancel = callback;
    }
    
    /**
     * Set the function to get strip size
     */
    setGetStripSize(fn) {
        this.getStripSize = fn;
    }
    
    /**
     * Get current export settings
     */
    getSettings() {
        return {
            fps: this.selectedFPS,
            duration: this.duration
        };
    }
    
    /**
     * Destroy the dialog and clean up
     */
    destroy() {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        this.overlay = null;
        this.dialog = null;
    }
}

// Global initialization
window.initExportUI = function(options = {}) {
    window.exportUI = new ExportUI(options);
    return window.exportUI;
};

// Legacy alias for compatibility during transition
window.initGIFExportUI = window.initExportUI;
window.GIFExportUI = ExportUI;

if (typeof window !== 'undefined') {
    window.ExportUI = ExportUI;
}
