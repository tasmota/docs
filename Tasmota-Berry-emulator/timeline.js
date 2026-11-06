/**
 * Timeline - 2D time-evolution view of the LED animation
 *
 * Renders the next 30 seconds of the current animation instantly (virtual
 * time) and displays it as an image: one column per LED, aligned with the
 * LED strip above, and one row per engine tick, time going down.
 *
 * - Uses the same virtual time mechanism as the APNG exporter
 *   (window.apngExporterVirtualTime), so rendering does not wait real time.
 * - Captures the raw frames sent by Berry (js.frame_buffer_display) without
 *   drawing them on the LED strip.
 * - Brightness is forced to 100% while rendering, so the Brightness slider
 *   does not affect the timeline.
 * - Pixel size / orientation changes redraw from the stored frames, without
 *   recomputing. Code or strip length changes mark the timeline as outdated.
 * - The time axis is drawn on a separate overlay, so the downloaded PNG only
 *   contains the animation itself.
 *
 * Part of the Berry Animation Framework Browser Simulator.
 */
(function(root) {
    'use strict';

    var DURATION_S = 30;        // rendered duration in seconds
    var ROW_MS = 50;            // one row per engine tick (AnimationEngine.TICK_MS)
    var BATCH_ROWS = 20;        // rows computed between two UI updates

    class Timeline {
        constructor() {
            this.isOpen = false;
            this.isRendering = false;
            this.isCancelled = false;

            // Rendered data
            this.frames = null;         // Uint8Array, rows * leds * 3 (RGB)
            this.rows = 0;
            this.leds = 0;
            this.snapshot = null;       // {code, lang, length} at render time

            this._findElements();
            if (!this.canvas) {
                console.warn('[Timeline] Timeline markup not found, feature disabled');
                return;
            }
            this._bindEvents();
            this._hookCompile();
            this._setStatus('Opens a 30 s view of the animation, time going down.');
        }

        // ============================================
        // Setup
        // ============================================

        _findElements() {
            this.toggleRow = document.getElementById('timeline-toggle-row');
            this.toggleIcon = document.getElementById('timeline-toggle');
            this.summary = document.getElementById('timeline-summary');
            this.content = document.getElementById('timeline-content');
            this.renderBtn = document.getElementById('timeline-render');
            this.downloadBtn = document.getElementById('timeline-download');
            this.statusEl = document.getElementById('timeline-status');
            this.progress = document.getElementById('timeline-progress');
            this.progressBar = this.progress ? this.progress.querySelector('.timeline-progress-bar') : null;
            this.view = document.getElementById('timeline-view');
            this.canvas = document.getElementById('timeline-canvas');
            this.axis = document.getElementById('timeline-axis');
        }

        _bindEvents() {
            var self = this;
            this.toggleRow.addEventListener('click', function() { self.toggle(); });
            this.renderBtn.addEventListener('click', function() {
                if (self.isRendering) {
                    self.isCancelled = true;
                } else {
                    self.render();
                }
            });
            this.downloadBtn.addEventListener('click', function() { self.download(); });

            // Pixel size and orientation: redraw from stored frames
            ['led-pixel-size', 'led-orientation'].forEach(function(id) {
                var el = document.getElementById(id);
                if (el) el.addEventListener('change', function() { self._draw(); });
            });
            // Strip length: frames no longer match the strip
            var lengthEl = document.getElementById('led-length');
            if (lengthEl) lengthEl.addEventListener('change', function() { self._checkOutdated(); });

            // Follow the LED strip's displayed size, and keep the axis crisp
            var onResize = function() { self._syncWidth(); self._drawAxis(); };
            if (typeof ResizeObserver !== 'undefined') {
                var ro = new ResizeObserver(onResize);
                ro.observe(this.canvas);
                var ledCanvas = document.getElementById('led-canvas');
                if (ledCanvas) ro.observe(ledCanvas);
            } else {
                window.addEventListener('resize', onResize);
            }
        }

        // Mark the timeline as outdated after each successful compile with different code.
        // berrySimulator is created asynchronously, so wait for it.
        _hookCompile() {
            var self = this;
            var tries = 0;
            var hook = function() {
                var sim = root.berrySimulator;
                if (sim && typeof sim.compile === 'function') {
                    if (sim._timelineHooked) return;
                    var original = sim.compile.bind(sim);
                    sim.compile = async function() {
                        var ok = await original.apply(null, arguments);
                        // ignore the compiles done by the timeline render itself
                        if (ok && !self.isRendering) self._onCompiled();
                        return ok;
                    };
                    sim._timelineHooked = true;
                    return;
                }
                if (++tries < 100) setTimeout(hook, 100);
            };
            hook();
        }

        // ============================================
        // Section open / close
        // ============================================

        toggle() {
            this.isOpen = !this.isOpen;
            this.content.style.display = this.isOpen ? 'block' : 'none';
            this.toggleIcon.textContent = this.isOpen ? '▼' : '▶';
            if (this.isOpen) {
                if (!this.frames && !this.isRendering) {
                    this.render();      // first opening: render right away
                } else {
                    this._syncWidth();
                    this._drawAxis();
                }
            }
        }

        // ============================================
        // Rendering
        // ============================================

        async render() {
            if (this.isRendering) return;

            var vm = root.berryVM;
            var vt = root.apngExporterVirtualTime;
            if (!vm || !vm.ready) {
                this._setStatus('Berry VM is still loading, try again in a moment.', 'error');
                return;
            }
            if (!vt) {
                this._setStatus('Virtual time support not loaded (apng-exporter.js).', 'error');
                return;
            }
            if (root.apngExporter && root.apngExporter.isInProgress()) {
                this._setStatus('An APNG export is running, try again when it is done.', 'error');
                return;
            }

            this.isRendering = true;
            this.isCancelled = false;
            var startPerf = performance.now();
            var totalRows = Math.round(DURATION_S * 1000 / ROW_MS);

            // Pause the live animation and lock the other controls
            var loop = root.animationLoop;
            var wasRunning = !!(loop && loop.isRunning);
            if (wasRunning) loop.stop();
            var locked = this._lockControls();
            this._setRenderingUI(true);
            this._setProgress(0);
            this._setStatus('Compiling...');

            // Capture frames instead of drawing them, and force brightness to 100%
            var originalRender = root.renderLEDStrip;
            var originalBrightness = root.getBrightness;
            var lastHex = null;
            root.renderLEDStrip = function(hex) {
                if (hex !== undefined && hex !== null) lastHex = String(hex);
                return true;
            };
            root.getBrightness = function() { return 100; };

            var frames = null;
            var leds = 0;
            var rowsDone = 0;
            var error = null;
            var snapshot = this._currentSnapshot();

            try {
                // Fresh start of the animation
                var ok = await this._compile();
                if (!ok) throw new Error('compilation failed, see the console');

                vt.enable(vm.millis());
                this._setStatus('Rendering...');

                while (rowsDone < totalRows) {
                    if (this.isCancelled) break;
                    var batchEnd = Math.min(rowsDone + BATCH_ROWS, totalRows);
                    for (; rowsDone < batchEnd; rowsDone++) {
                        vt.advance(ROW_MS);
                        var res = await vm.callGlobal('_fast_loop');
                        if (res && res.success === false) {
                            throw new Error(res.error || '_fast_loop failed');
                        }
                        if (frames === null) {
                            if (lastHex === null) continue;      // nothing displayed yet
                            leds = Math.floor(lastHex.length / 6);
                            if (leds === 0) throw new Error('animation produced no pixels');
                            frames = new Uint8Array(totalRows * leds * 3);
                            // rows before the first frame stay black
                        }
                        this._storeRow(frames, rowsDone, leds, lastHex);
                    }
                    this._setProgress(rowsDone / totalRows);
                    await new Promise(function(r) { setTimeout(r, 0); });   // let the UI breathe
                }
            } catch (e) {
                error = e;
            } finally {
                vt.disable();
                root.renderLEDStrip = originalRender;
                root.getBrightness = originalBrightness;
            }

            // Restore the normal animation state (fresh start, like after an export)
            await this._compile();
            this._unlockControls(locked);
            if (wasRunning && loop) {
                loop.start();
                // loop.stop() switched the buttons to the paused state, switch them back
                if (root.animationControls && typeof root.animationControls.setRunning === 'function') {
                    root.animationControls.setRunning(true);
                }
            }
            this._setRenderingUI(false);
            this.isRendering = false;

            if (error) {
                console.error('[Timeline] Render failed:', error);
                this._setStatus('Render failed: ' + error.message, 'error');
                this._log('error', 'Timeline render failed: ' + error.message);
                return;
            }
            if (this.isCancelled) {
                this._setStatus(this.frames ? 'Render cancelled, showing the previous timeline.' : 'Render cancelled.');
                return;
            }
            if (!frames) {
                this._setStatus('The animation did not display anything in ' + DURATION_S + ' s.', 'error');
                return;
            }

            this.frames = frames;
            this.rows = totalRows;
            this.leds = leds;
            this.snapshot = snapshot;
            this.downloadBtn.disabled = false;
            this._draw();

            var secs = ((performance.now() - startPerf) / 1000).toFixed(1);
            this.summary.textContent = DURATION_S + ' s · ' + leds + ' LEDs';
            this._setStatus(totalRows + ' frames (' + (1000 / ROW_MS) + ' per second) rendered in ' + secs + ' s.');
        }

        _storeRow(frames, row, leds, hex) {
            var base = row * leds * 3;
            var n = Math.min(leds, Math.floor(hex.length / 6));
            for (var i = 0; i < n; i++) {
                var o = i * 6;
                frames[base + i * 3]     = parseInt(hex.substr(o, 2), 16);
                frames[base + i * 3 + 1] = parseInt(hex.substr(o + 2, 2), 16);
                frames[base + i * 3 + 2] = parseInt(hex.substr(o + 4, 2), 16);
            }
        }

        async _compile() {
            var sim = root.berrySimulator;
            if (sim && typeof sim.compile === 'function') {
                try {
                    return await sim.compile();
                } catch (e) {
                    console.error('[Timeline] Compile error:', e);
                    return false;
                }
            }
            return true;    // no simulator: keep the current animation
        }

        // ============================================
        // Drawing
        // ============================================

        // Same geometry as the LED strip canvas, so columns line up with the LEDs
        _geometry() {
            var api = root.ledStripAPI || {};
            var pixelSize = api.pixelSize || 10;
            var spacing = (api.ledSpacing !== undefined) ? api.ledSpacing : 2;
            var pitch = pixelSize + spacing;
            var maxWidth = api.maxCanvasWidth || 700;
            var width = Math.min(this.leds * pitch - spacing, maxWidth);
            return { pitch: pitch, width: Math.max(1, width), reversed: !!api.reversed };
        }

        _draw() {
            if (!this.frames) return;
            var g = this._geometry();
            var canvas = this.canvas;
            canvas.width = g.width;
            canvas.height = this.rows;
            var ctx = canvas.getContext('2d');
            var img = ctx.createImageData(g.width, this.rows);
            var data = img.data;
            var leds = this.leds;

            // Column -> LED index lookup (each LED covers its pitch, gaps included)
            var colLed = new Int32Array(g.width);
            for (var x = 0; x < g.width; x++) {
                var led = Math.min(leds - 1, Math.floor(x / g.pitch));
                colLed[x] = g.reversed ? (leds - 1 - led) : led;
            }

            var frames = this.frames;
            var p = 0;
            for (var y = 0; y < this.rows; y++) {
                var rowBase = y * leds * 3;
                for (var x2 = 0; x2 < g.width; x2++) {
                    var s = rowBase + colLed[x2] * 3;
                    data[p++] = frames[s];
                    data[p++] = frames[s + 1];
                    data[p++] = frames[s + 2];
                    data[p++] = 255;
                }
            }
            ctx.putImageData(img, 0, 0);
            this.view.classList.add('has-image');
            this._syncWidth();
            this._drawAxis();
        }

        // Display the timeline at the same width as the LED canvas, so that
        // each column sits exactly under its LED (the LED canvas may be scaled
        // down by CSS on narrow screens)
        _syncWidth() {
            if (!this.frames || !this.isOpen) return;
            var led = document.getElementById('led-canvas');
            var w = led ? led.clientWidth : 0;
            if (w > 0 && led.width === this.canvas.width) {
                var h = Math.round(this.rows * w / this.canvas.width);
                if (this.canvas.style.width !== w + 'px') {
                    this.canvas.style.width = w + 'px';
                    this.canvas.style.height = h + 'px';
                }
            } else {
                this.canvas.style.width = '';
                this.canvas.style.height = '';
            }
        }

        // Time axis overlay: ticks every second on both edges, labels every 5 s
        _drawAxis() {
            var axis = this.axis;
            if (!axis || !this.frames || !this.isOpen) return;
            // content box of the canvas (the overlay sits inside its 1px border)
            var rect = { width: this.canvas.clientWidth, height: this.canvas.clientHeight };
            if (rect.width === 0 || rect.height === 0) return;
            var dpr = root.devicePixelRatio || 1;
            axis.width = Math.round(rect.width * dpr);
            axis.height = Math.round(rect.height * dpr);
            var ctx = axis.getContext('2d');
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, rect.width, rect.height);

            var pxPerSecond = rect.height / DURATION_S;
            ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.textBaseline = 'middle';
            for (var s = 0; s <= DURATION_S; s++) {
                var y = Math.round(s * pxPerSecond) + 0.5;
                if (y > rect.height - 0.5) y = rect.height - 0.5;
                var major = (s % 5 === 0);
                var len = major ? 8 : 4;
                // tick with a dark outline so it reads on any color
                ctx.strokeStyle = 'rgba(0,0,0,0.6)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(0, y); ctx.lineTo(len, y);
                ctx.moveTo(rect.width - len, y); ctx.lineTo(rect.width, y);
                ctx.stroke();
                ctx.strokeStyle = 'rgba(255,255,255,0.9)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, y); ctx.lineTo(len, y);
                ctx.moveTo(rect.width - len, y); ctx.lineTo(rect.width, y);
                ctx.stroke();

                if (major) {
                    var label = s + ' s';
                    var tw = ctx.measureText(label).width;
                    var ly = Math.min(Math.max(y, 8), rect.height - 8);
                    ctx.fillStyle = 'rgba(0,0,0,0.6)';
                    ctx.fillRect(len + 2, ly - 7, tw + 6, 14);
                    ctx.fillStyle = '#eaeaea';
                    ctx.fillText(label, len + 5, ly);
                }
            }
        }

        // ============================================
        // Download
        // ============================================

        download() {
            if (!this.frames) return;
            var name = 'animation';
            var lib = root.animationLibrary;
            var ex = lib && typeof lib.getSelectedExample === 'function' ? lib.getSelectedExample() : null;
            if (ex && ex.id) name = String(ex.id).replace(/[^a-zA-Z0-9_-]+/g, '_');
            var filename = name + '-timeline-' + DURATION_S + 's.png';
            var self = this;
            this.canvas.toBlob(function(blob) {
                if (!blob) {
                    self._setStatus('Could not create the PNG.', 'error');
                    return;
                }
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
                self._log('info', 'Timeline saved as ' + filename);
            }, 'image/png');
        }

        // ============================================
        // State helpers
        // ============================================

        _currentSnapshot() {
            var sim = root.berrySimulator;
            var ed = sim && sim.editor;
            var lang = ed ? ed.getLanguage() : '';
            var code = ed ? (lang === 'dsl' ? ed.getDSLCode() : ed.getCode()) : '';
            var api = root.ledStripAPI;
            return { code: code, lang: lang, length: api ? api.getStripSize() : 0 };
        }

        // After a successful compile by the user (Compile & Run, Compile only,
        // selecting an example): re-render automatically if the panel is open
        // and the code or strip length changed, otherwise just flag it outdated.
        _onCompiled() {
            if (!this.isOpen) {
                this._checkOutdated();
                return;
            }
            if (this.frames && !this._isOutdated()) return;     // same code, nothing to do
            // Defer so the caller finishes first (e.g. Compile & Run starts the loop),
            // and coalesce several compiles in a row into one render
            var self = this;
            clearTimeout(this._autoTimer);
            this._autoTimer = setTimeout(function() {
                if (self.isOpen && !self.isRendering) self.render();
            }, 100);
        }

        _isOutdated() {
            if (!this.snapshot) return true;
            var now = this._currentSnapshot();
            return now.code !== this.snapshot.code || now.lang !== this.snapshot.lang ||
                   now.length !== this.snapshot.length;
        }

        _checkOutdated() {
            if (!this.frames || !this.snapshot || this.isRendering) return;
            var now = this._currentSnapshot();
            var changed = [];
            if (now.code !== this.snapshot.code || now.lang !== this.snapshot.lang) changed.push('code');
            if (now.length !== this.snapshot.length) changed.push('strip length');
            if (changed.length) {
                this._setStatus('Outdated: ' + changed.join(' and ') + ' changed since this render. Click Render to update.', 'outdated');
                this.renderBtn.classList.add('timeline-attention');
            }
        }

        _lockControls() {
            var ids = ['btn-compile-run', 'btn-resume', 'btn-pause', 'btn-compile', 'btn-export'];
            var saved = [];
            ids.forEach(function(id) {
                var el = document.getElementById(id);
                if (el) {
                    saved.push([el, el.disabled]);
                    el.disabled = true;
                }
            });
            return saved;
        }

        _unlockControls(saved) {
            saved.forEach(function(item) { item[0].disabled = item[1]; });
        }

        _setRenderingUI(rendering) {
            this.renderBtn.textContent = rendering ? 'Cancel' : 'Render ' + DURATION_S + ' s';
            this.renderBtn.classList.toggle('bgrn', !rendering);
            this.renderBtn.classList.toggle('bred', rendering);
            this.renderBtn.classList.remove('timeline-attention');
            this.downloadBtn.disabled = rendering || !this.frames;
            this.progress.classList.toggle('visible', rendering);
        }

        _setProgress(fraction) {
            if (this.progressBar) this.progressBar.style.width = Math.round(fraction * 100) + '%';
        }

        _setStatus(text, kind) {
            if (!this.statusEl) return;
            this.statusEl.textContent = text;
            this.statusEl.className = 'timeline-status' + (kind ? ' timeline-status-' + kind : '');
        }

        _log(level, message) {
            var c = root.consoleManager;
            if (c && typeof c[level] === 'function') c[level](message);
        }
    }

    root.Timeline = Timeline;
    root.initTimeline = function() {
        root.timeline = new Timeline();
        return root.timeline;
    };

    console.log('[Timeline] Module loaded');

})(typeof window !== 'undefined' ? window : this);
