/**
 * ConfigPersistence - Save and restore simulator configuration to localStorage
 * 
 * Persists:
 * - Editor code (DSL and Berry buffers)
 * - LED strip settings (length, orientation, pixel size, brightness)
 * - Fader values
 * - UI state (animation library collapsed state)
 */

(function(window) {
    'use strict';

    var STORAGE_KEY = 'berry-simulator-config';
    var DEBOUNCE_DELAY = 500; // ms delay before saving

    /**
     * ConfigPersistence class
     */
    function ConfigPersistence() {
        this.debounceTimer = null;
        this.enabled = true;
        this.lastSavedConfig = null;
    }

    /**
     * Get the default configuration
     * @returns {Object} Default config values
     */
    ConfigPersistence.prototype.getDefaults = function() {
        return {
            version: 1,
            editor: {
                dslCode: '',
                berryCode: '',
                currentLanguage: 'dsl'
            },
            ledStrip: {
                length: 30,
                orientation: 'ltr',
                pixelSizeMode: 'medium',
                brightness: 100
            },
            faders: [50, 50, 50, 50, 50, 50, 50, 50],
            ui: {
                libraryCollapsed: true
            },
            savedAt: null
        };
    };

    /**
     * Load configuration from localStorage
     * @returns {Object} Loaded config or defaults
     */
    ConfigPersistence.prototype.load = function() {
        if (!this.enabled) {
            return this.getDefaults();
        }

        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) {
                return this.getDefaults();
            }

            var config = JSON.parse(stored);
            
            // Merge with defaults to handle missing fields from older versions
            var defaults = this.getDefaults();
            var merged = this.mergeDeep(defaults, config);
            
            this.lastSavedConfig = JSON.stringify(merged);
            return merged;
        } catch (e) {
            console.warn('ConfigPersistence: Failed to load config:', e);
            return this.getDefaults();
        }
    };

    /**
     * Save configuration to localStorage
     * @param {Object} config - Configuration to save
     */
    ConfigPersistence.prototype.save = function(config) {
        if (!this.enabled) return;

        try {
            config.savedAt = new Date().toISOString();
            var json = JSON.stringify(config);
            
            // Only save if changed
            if (json === this.lastSavedConfig) {
                return;
            }
            
            localStorage.setItem(STORAGE_KEY, json);
            this.lastSavedConfig = json;
        } catch (e) {
            console.warn('ConfigPersistence: Failed to save config:', e);
        }
    };

    /**
     * Save configuration with debouncing
     * @param {Object} config - Configuration to save
     */
    ConfigPersistence.prototype.saveDebounced = function(config) {
        var self = this;
        
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        
        this.debounceTimer = setTimeout(function() {
            self.save(config);
        }, DEBOUNCE_DELAY);
    };

    /**
     * Clear saved configuration
     */
    ConfigPersistence.prototype.clear = function() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            this.lastSavedConfig = null;
        } catch (e) {
            console.warn('ConfigPersistence: Failed to clear config:', e);
        }
    };

    /**
     * Deep merge two objects
     * @param {Object} target - Target object
     * @param {Object} source - Source object
     * @returns {Object} Merged object
     */
    ConfigPersistence.prototype.mergeDeep = function(target, source) {
        var result = Object.assign({}, target);
        
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    result[key] = this.mergeDeep(target[key] || {}, source[key]);
                } else {
                    result[key] = source[key];
                }
            }
        }
        
        return result;
    };

    /**
     * Gather current configuration from UI state
     * @returns {Object} Current configuration
     */
    ConfigPersistence.prototype.gatherCurrentConfig = function() {
        var config = this.getDefaults();
        
        // Editor state
        if (window.codeEditor) {
            config.editor.dslCode = window.codeEditor.getDSLCode() || '';
            config.editor.berryCode = window.codeEditor.getBerryCode() || '';
            config.editor.currentLanguage = window.codeEditor.getLanguage() || 'dsl';
        }
        
        // LED strip settings
        var lengthInput = document.getElementById('led-length');
        var orientationSelect = document.getElementById('led-orientation');
        var pixelSizeSelect = document.getElementById('led-pixel-size');
        var brightnessSlider = document.getElementById('led-brightness');
        
        if (lengthInput) {
            config.ledStrip.length = parseInt(lengthInput.value, 10) || 30;
        }
        if (orientationSelect) {
            config.ledStrip.orientation = orientationSelect.value || 'ltr';
        }
        if (pixelSizeSelect) {
            config.ledStrip.pixelSizeMode = pixelSizeSelect.value || 'medium';
        }
        if (brightnessSlider) {
            // Convert slider position (0-100) to brightness value (0-200)
            // Semi-linear: 0-75 slider -> 0-100 brightness, 75-100 slider -> 100-200 brightness
            var sliderValue = parseInt(brightnessSlider.value, 10) || 75;
            if (sliderValue <= 75) {
                config.ledStrip.brightness = Math.round((sliderValue / 75) * 100);
            } else {
                config.ledStrip.brightness = Math.round(100 + ((sliderValue - 75) / 25) * 100);
            }
        }
        
        // Fader values
        if (window.faderValues && Array.isArray(window.faderValues)) {
            config.faders = window.faderValues.slice();
        }
        
        // UI state
        var libraryContainer = document.getElementById('animation-library-container');
        if (libraryContainer) {
            var content = libraryContainer.querySelector('.animation-library-content');
            config.ui.libraryCollapsed = content ? content.classList.contains('collapsed') : true;
        }
        
        return config;
    };

    /**
     * Apply configuration to UI
     * @param {Object} config - Configuration to apply
     */
    ConfigPersistence.prototype.applyConfig = function(config) {
        // Apply LED strip settings first (before editor, as editor might trigger recompile)
        var lengthInput = document.getElementById('led-length');
        var orientationSelect = document.getElementById('led-orientation');
        var pixelSizeSelect = document.getElementById('led-pixel-size');
        var brightnessSlider = document.getElementById('led-brightness');
        var brightnessValue = document.getElementById('brightness-value');
        
        if (lengthInput && config.ledStrip.length) {
            lengthInput.value = config.ledStrip.length;
        }
        if (orientationSelect && config.ledStrip.orientation) {
            orientationSelect.value = config.ledStrip.orientation;
        }
        if (pixelSizeSelect && config.ledStrip.pixelSizeMode) {
            pixelSizeSelect.value = config.ledStrip.pixelSizeMode;
        }
        if (brightnessSlider && config.ledStrip.brightness !== undefined) {
            // Convert brightness value (0-200) to slider position (0-100)
            // Semi-linear: 0-100 brightness -> 0-75 slider, 100-200 brightness -> 75-100 slider
            var brightness = config.ledStrip.brightness;
            var sliderValue;
            if (brightness <= 100) {
                sliderValue = Math.round((brightness / 100) * 75);
            } else {
                sliderValue = Math.round(75 + ((brightness - 100) / 100) * 25);
            }
            brightnessSlider.value = sliderValue;
            if (brightnessValue) {
                brightnessValue.textContent = brightness;
            }
            // Update LED Strip API brightness
            if (window.ledStripAPI) {
                window.ledStripAPI.setBrightness(brightness);
            }
        }
        
        // Trigger LED config update to apply settings
        if (typeof window.updateLEDConfig === 'function') {
            window.updateLEDConfig();
        }
        
        // Apply fader values
        if (config.faders && Array.isArray(config.faders)) {
            window.faderValues = config.faders.slice();
            
            // Update fader UI
            for (var i = 0; i < config.faders.length; i++) {
                var wrapper = document.getElementById('fader-wrapper-' + (i + 1));
                var valueDisplay = document.getElementById('fader-value-' + (i + 1));
                
                if (wrapper) {
                    var height = (config.faders[i] / 100) * 62;
                    wrapper.style.setProperty('--fader-height', height + 'px');
                }
                if (valueDisplay) {
                    valueDisplay.textContent = config.faders[i];
                }
            }
        }
        
        // Apply editor state (do this last as it might be the most complex)
        if (window.codeEditor && config.editor) {
            // Set both buffers
            if (config.editor.dslCode) {
                window.codeEditor.setDSLCode(config.editor.dslCode);
            }
            if (config.editor.berryCode) {
                window.codeEditor.setBerryCode(config.editor.berryCode, false);
            }
            
            // Set current language and update radio buttons
            var lang = config.editor.currentLanguage || 'dsl';
            var radios = document.querySelectorAll('input[name="code-lang"]');
            radios.forEach(function(radio) {
                radio.checked = (radio.value === lang);
            });
            
            // Set the language in editor (this will load the appropriate buffer)
            window.codeEditor.setLanguage(lang);
        }
        
        // Apply UI state
        if (config.ui && window.animationLibrary) {
            if (config.ui.libraryCollapsed) {
                window.animationLibrary.collapse();
            } else {
                window.animationLibrary.expand();
            }
        }
    };

    /**
     * Setup auto-save listeners
     */
    ConfigPersistence.prototype.setupAutoSave = function() {
        var self = this;
        
        // Save on editor change
        if (window.codeEditor) {
            var originalOnChange = window.codeEditor.onChangeCallback;
            window.codeEditor.setOnChange(function(code, lang) {
                // Call original callback if exists
                if (originalOnChange) {
                    originalOnChange(code, lang);
                }
                // Auto-save
                self.saveDebounced(self.gatherCurrentConfig());
            });
        }
        
        // Save on LED config change
        var ledInputs = ['led-length', 'led-orientation', 'led-pixel-size', 'led-brightness'];
        ledInputs.forEach(function(id) {
            var element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', function() {
                    self.saveDebounced(self.gatherCurrentConfig());
                });
                // Also listen to input for sliders
                if (element.type === 'range') {
                    element.addEventListener('input', function() {
                        self.saveDebounced(self.gatherCurrentConfig());
                    });
                }
            }
        });
        
        // Save on fader change - hook into updateFaderValue
        var originalUpdateFaderValue = window.updateFaderValue;
        if (typeof originalUpdateFaderValue === 'function') {
            window.updateFaderValue = function(num, value) {
                originalUpdateFaderValue(num, value);
                self.saveDebounced(self.gatherCurrentConfig());
            };
        }
        
        // Save before page unload (immediate save, no debounce)
        window.addEventListener('beforeunload', function() {
            if (self.debounceTimer) {
                clearTimeout(self.debounceTimer);
            }
            self.save(self.gatherCurrentConfig());
        });
    };

    /**
     * Initialize configuration persistence
     * @param {Object} options - Options
     * @param {boolean} options.enabled - Whether persistence is enabled
     * @param {boolean} options.autoSave - Whether to auto-save on changes
     * @param {boolean} options.restoreOnLoad - Whether to restore config on init
     * @returns {ConfigPersistence} Instance
     */
    function initConfigPersistence(options) {
        options = options || {};
        
        var persistence = new ConfigPersistence();
        persistence.enabled = options.enabled !== false;
        
        // Restore configuration if requested
        if (options.restoreOnLoad !== false) {
            var config = persistence.load();
            
            // Only apply if there's saved data
            if (config.savedAt) {
                persistence.applyConfig(config);
                
                if (window.consoleManager) {
                    var savedDate = new Date(config.savedAt);
                    window.consoleManager.info('Restored settings from ' + savedDate.toLocaleString());
                }
            }
        }
        
        // Setup auto-save if requested
        if (options.autoSave !== false) {
            // Delay setup to ensure all components are initialized
            setTimeout(function() {
                persistence.setupAutoSave();
            }, 100);
        }
        
        return persistence;
    }

    // Export to window
    window.ConfigPersistence = ConfigPersistence;
    window.initConfigPersistence = initConfigPersistence;

})(window);
