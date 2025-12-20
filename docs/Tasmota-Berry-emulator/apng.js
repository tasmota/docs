/**
 * apng.js - JavaScript APNG (Animated PNG) encoder
 * 
 * A high-compression APNG encoder for LED strip animations.
 * Provides full 24-bit color support without GIF's 256 color limitation.
 * 
 * Features:
 * - Real DEFLATE compression via pako library
 * - Adaptive PNG filtering (tries all 5 filter types per row)
 * - Optimized for LED strip horizontal patterns
 * 
 * APNG Format:
 * - PNG signature (8 bytes)
 * - IHDR chunk (image header)
 * - acTL chunk (animation control)
 * - For each frame: fcTL + IDAT/fdAT chunks
 * - IEND chunk (end marker)
 * 
 * Part of the Berry Animation Framework Browser Simulator.
 * Requirements: 11.1, 18.1
 */

(function(root) {
    'use strict';

    // ============================================
    // CRC32 Implementation
    // ============================================
    
    // Pre-computed CRC32 table
    var crcTable = null;
    
    function makeCRCTable() {
        var c;
        var table = new Uint32Array(256);
        for (var n = 0; n < 256; n++) {
            c = n;
            for (var k = 0; k < 8; k++) {
                c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
            }
            table[n] = c;
        }
        return table;
    }
    
    function crc32(data) {
        if (!crcTable) {
            crcTable = makeCRCTable();
        }
        var crc = 0xFFFFFFFF;
        for (var i = 0; i < data.length; i++) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xFF];
        }
        return (crc ^ 0xFFFFFFFF) >>> 0;
    }

    // ============================================
    // PNG Filter Implementation (Adaptive)
    // ============================================
    
    /**
     * PNG Filter Types:
     * 0 = None: Filt(x) = Orig(x)
     * 1 = Sub: Filt(x) = Orig(x) - Orig(a)  where a = left pixel
     * 2 = Up: Filt(x) = Orig(x) - Orig(b)  where b = above pixel
     * 3 = Average: Filt(x) = Orig(x) - floor((Orig(a) + Orig(b)) / 2)
     * 4 = Paeth: Filt(x) = Orig(x) - PaethPredictor(a, b, c)
     */
    
    /**
     * Paeth predictor function
     */
    function paethPredictor(a, b, c) {
        var p = a + b - c;
        var pa = Math.abs(p - a);
        var pb = Math.abs(p - b);
        var pc = Math.abs(p - c);
        if (pa <= pb && pa <= pc) return a;
        if (pb <= pc) return b;
        return c;
    }
    
    /**
     * Apply a specific filter to a row
     * @param {Uint8Array} row - Current row data (without filter byte)
     * @param {Uint8Array|null} prevRow - Previous row data (null for first row)
     * @param {number} filterType - Filter type (0-4)
     * @param {number} bpp - Bytes per pixel (4 for RGBA)
     * @returns {Uint8Array} - Filtered row (without filter type byte)
     */
    function applyFilter(row, prevRow, filterType, bpp) {
        var len = row.length;
        var filtered = new Uint8Array(len);
        
        for (var i = 0; i < len; i++) {
            var orig = row[i];
            var a = (i >= bpp) ? row[i - bpp] : 0;           // Left pixel
            var b = prevRow ? prevRow[i] : 0;                 // Above pixel
            var c = (prevRow && i >= bpp) ? prevRow[i - bpp] : 0; // Upper-left
            
            switch (filterType) {
                case 0: // None
                    filtered[i] = orig;
                    break;
                case 1: // Sub
                    filtered[i] = (orig - a) & 0xFF;
                    break;
                case 2: // Up
                    filtered[i] = (orig - b) & 0xFF;
                    break;
                case 3: // Average
                    filtered[i] = (orig - Math.floor((a + b) / 2)) & 0xFF;
                    break;
                case 4: // Paeth
                    filtered[i] = (orig - paethPredictor(a, b, c)) & 0xFF;
                    break;
            }
        }
        
        return filtered;
    }
    
    /**
     * Calculate the sum of absolute values (heuristic for filter effectiveness)
     * Lower is better - indicates more compressible data
     */
    function filterScore(filtered) {
        var sum = 0;
        for (var i = 0; i < filtered.length; i++) {
            // Treat as signed byte for scoring
            var val = filtered[i];
            if (val > 127) val = 256 - val;
            sum += val;
        }
        return sum;
    }

    /**
     * Apply adaptive filtering to image data
     * Tries all 5 filter types for each row and picks the best one
     * 
     * @param {Uint8Array} rgba - RGBA pixel data
     * @param {number} width - Image width
     * @param {number} height - Image height
     * @returns {Uint8Array} - Filtered data ready for compression
     */
    function filterImageDataAdaptive(rgba, width, height) {
        var bpp = 4; // Bytes per pixel (RGBA)
        var rowBytes = width * bpp;
        var filteredSize = height * (1 + rowBytes); // 1 filter byte per row
        var filtered = new Uint8Array(filteredSize);
        
        var prevRow = null;
        var dstPos = 0;
        
        for (var y = 0; y < height; y++) {
            // Extract current row
            var srcStart = y * rowBytes;
            var currentRow = rgba.slice(srcStart, srcStart + rowBytes);
            
            // Try all filter types and pick the best
            var bestFilter = 0;
            var bestScore = Infinity;
            var bestFiltered = null;
            
            for (var filterType = 0; filterType < 5; filterType++) {
                var filteredRow = applyFilter(currentRow, prevRow, filterType, bpp);
                var score = filterScore(filteredRow);
                
                if (score < bestScore) {
                    bestScore = score;
                    bestFilter = filterType;
                    bestFiltered = filteredRow;
                }
            }
            
            // Write filter type byte
            filtered[dstPos++] = bestFilter;
            
            // Write filtered row data
            for (var i = 0; i < rowBytes; i++) {
                filtered[dstPos++] = bestFiltered[i];
            }
            
            // Save current row for next iteration
            prevRow = currentRow;
        }
        
        return filtered;
    }
    
    /**
     * Simple filter (type 0 = None) for fallback
     */
    function filterImageDataSimple(rgba, width, height) {
        var bytesPerPixel = 4;
        var rowBytes = width * bytesPerPixel;
        var filteredSize = height * (1 + rowBytes);
        var filtered = new Uint8Array(filteredSize);
        
        var srcPos = 0;
        var dstPos = 0;
        
        for (var y = 0; y < height; y++) {
            filtered[dstPos++] = 0; // Filter type 0 (None)
            for (var x = 0; x < rowBytes; x++) {
                filtered[dstPos++] = rgba[srcPos++];
            }
        }
        
        return filtered;
    }

    // ============================================
    // Compression (using pako or fallback)
    // ============================================
    
    /**
     * Check if pako is available
     */
    function hasPako() {
        return typeof pako !== 'undefined' && typeof pako.deflate === 'function';
    }
    
    /**
     * Compress data using pako (real DEFLATE) or fallback to store mode
     * @param {Uint8Array} data - Data to compress
     * @returns {Uint8Array} - Compressed data (zlib format)
     */
    function compressData(data) {
        if (hasPako()) {
            // Use pako for real compression
            // Level 9 = maximum compression
            return pako.deflate(data, { level: 9 });
        } else {
            // Fallback to store mode (no compression)
            console.warn('[APNG] pako not available, using uncompressed mode');
            return deflateStore(data);
        }
    }
    
    /**
     * Fallback: Create a deflate stream using store mode (no compression)
     * @param {Uint8Array} data - Raw data
     * @returns {Uint8Array} - Deflate-wrapped data
     */
    function deflateStore(data) {
        var MAX_BLOCK = 65535;
        var numBlocks = Math.ceil(data.length / MAX_BLOCK);
        
        var outputSize = 2; // zlib header
        for (var i = 0; i < numBlocks; i++) {
            var blockLen = Math.min(MAX_BLOCK, data.length - i * MAX_BLOCK);
            outputSize += 5 + blockLen;
        }
        outputSize += 4; // adler32
        
        var output = new Uint8Array(outputSize);
        var pos = 0;
        
        // Zlib header
        output[pos++] = 0x78;
        output[pos++] = 0x01;
        
        // Write blocks
        for (var i = 0; i < numBlocks; i++) {
            var start = i * MAX_BLOCK;
            var blockLen = Math.min(MAX_BLOCK, data.length - start);
            var isFinal = (i === numBlocks - 1) ? 1 : 0;
            
            output[pos++] = isFinal;
            output[pos++] = blockLen & 0xFF;
            output[pos++] = (blockLen >> 8) & 0xFF;
            output[pos++] = (~blockLen) & 0xFF;
            output[pos++] = ((~blockLen) >> 8) & 0xFF;
            
            for (var j = 0; j < blockLen; j++) {
                output[pos++] = data[start + j];
            }
        }
        
        // Adler32 checksum
        var a = 1, b = 0;
        for (var i = 0; i < data.length; i++) {
            a = (a + data[i]) % 65521;
            b = (b + a) % 65521;
        }
        var checksum = ((b << 16) | a) >>> 0;
        output[pos++] = (checksum >> 24) & 0xFF;
        output[pos++] = (checksum >> 16) & 0xFF;
        output[pos++] = (checksum >> 8) & 0xFF;
        output[pos++] = checksum & 0xFF;
        
        return output;
    }

    // ============================================
    // ByteArray Helper
    // ============================================
    
    function ByteArray() {
        this.data = [];
    }
    
    ByteArray.prototype.writeByte = function(val) {
        this.data.push(val & 0xFF);
    };
    
    ByteArray.prototype.writeBytes = function(arr) {
        for (var i = 0; i < arr.length; i++) {
            this.data.push(arr[i] & 0xFF);
        }
    };
    
    ByteArray.prototype.writeUint16BE = function(val) {
        this.data.push((val >> 8) & 0xFF);
        this.data.push(val & 0xFF);
    };
    
    ByteArray.prototype.writeUint32BE = function(val) {
        this.data.push((val >> 24) & 0xFF);
        this.data.push((val >> 16) & 0xFF);
        this.data.push((val >> 8) & 0xFF);
        this.data.push(val & 0xFF);
    };
    
    ByteArray.prototype.writeString = function(str) {
        for (var i = 0; i < str.length; i++) {
            this.data.push(str.charCodeAt(i));
        }
    };
    
    ByteArray.prototype.getData = function() {
        return new Uint8Array(this.data);
    };
    
    ByteArray.prototype.length = function() {
        return this.data.length;
    };

    // ============================================
    // PNG Chunk Writer
    // ============================================
    
    function writeChunk(out, type, data) {
        var dataLen = data ? data.length : 0;
        
        out.writeUint32BE(dataLen);
        out.writeString(type);
        
        if (data && dataLen > 0) {
            out.writeBytes(data);
        }
        
        // CRC (over type + data)
        var crcData = new Uint8Array(4 + dataLen);
        for (var i = 0; i < 4; i++) {
            crcData[i] = type.charCodeAt(i);
        }
        if (data) {
            for (var i = 0; i < dataLen; i++) {
                crcData[4 + i] = data[i];
            }
        }
        out.writeUint32BE(crc32(crcData));
    }


    // ============================================
    // APNG Encoder Class
    // ============================================
    
    /**
     * APNG Encoder - Creates animated PNG files with high compression
     * 
     * @param {Object} options - Configuration options
     * @param {number} options.width - Image width
     * @param {number} options.height - Image height
     * @param {number} options.repeat - Loop count (0 = infinite, default: 0)
     * @param {boolean} options.adaptiveFilter - Use adaptive filtering (default: true)
     */
    function APNG(options) {
        options = options || {};
        
        this.width = options.width || 320;
        this.height = options.height || 240;
        this.repeat = options.repeat !== undefined ? options.repeat : 0;
        this.adaptiveFilter = options.adaptiveFilter !== false; // Default true
        
        this.frames = [];
        this.sequenceNumber = 0;
        
        // Callbacks
        this.onProgress = null;
        this.onFinished = null;
    }
    
    /**
     * Add a frame to the animation
     * 
     * @param {ImageData|HTMLCanvasElement|CanvasRenderingContext2D} image - Frame image
     * @param {Object} options - Frame options
     * @param {number} options.delay - Frame delay in milliseconds (default: 100)
     */
    APNG.prototype.addFrame = function(image, options) {
        options = options || {};
        
        var frame = {
            delay: options.delay || 100,
            data: null,
            width: 0,
            height: 0
        };
        
        // Get image data
        if (image instanceof ImageData) {
            frame.data = new Uint8Array(image.data);
            frame.width = image.width;
            frame.height = image.height;
        } else if (image instanceof HTMLCanvasElement) {
            var ctx = image.getContext('2d');
            var imgData = ctx.getImageData(0, 0, image.width, image.height);
            frame.data = new Uint8Array(imgData.data);
            frame.width = image.width;
            frame.height = image.height;
        } else if (image && typeof image.getImageData === 'function') {
            // CanvasRenderingContext2D
            var imgData = image.getImageData(0, 0, this.width, this.height);
            frame.data = new Uint8Array(imgData.data);
            frame.width = this.width;
            frame.height = this.height;
        } else {
            throw new Error('Invalid image type');
        }
        
        this.frames.push(frame);
    };
    
    /**
     * Set progress callback
     * @param {string} event - Event name ('progress' or 'finished')
     * @param {Function} callback - Callback function
     */
    APNG.prototype.on = function(event, callback) {
        if (event === 'finished') {
            this.onFinished = callback;
        } else if (event === 'progress') {
            this.onProgress = callback;
        }
        return this;
    };
    
    /**
     * Render the APNG
     * @returns {Blob} - APNG blob
     */
    APNG.prototype.render = function() {
        if (this.frames.length === 0) {
            throw new Error('No frames to encode');
        }
        
        var out = new ByteArray();
        
        // PNG Signature
        out.writeBytes([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
        
        // IHDR chunk
        this._writeIHDR(out);
        
        // acTL chunk (animation control)
        this._writeAcTL(out);
        
        // Process frames
        for (var i = 0; i < this.frames.length; i++) {
            this._writeFrame(out, i);
            
            if (this.onProgress) {
                this.onProgress((i + 1) / this.frames.length);
            }
        }
        
        // IEND chunk
        writeChunk(out, 'IEND', null);
        
        // Create blob
        var blob = new Blob([out.getData()], { type: 'image/png' });
        
        if (this.onFinished) {
            this.onFinished(blob);
        }
        
        return blob;
    };
    
    /**
     * Write IHDR chunk (image header)
     * @private
     */
    APNG.prototype._writeIHDR = function(out) {
        var data = new ByteArray();
        data.writeUint32BE(this.width);
        data.writeUint32BE(this.height);
        data.writeByte(8);  // Bit depth
        data.writeByte(6);  // Color type (RGBA)
        data.writeByte(0);  // Compression method
        data.writeByte(0);  // Filter method
        data.writeByte(0);  // Interlace method
        
        writeChunk(out, 'IHDR', data.getData());
    };
    
    /**
     * Write acTL chunk (animation control)
     * @private
     */
    APNG.prototype._writeAcTL = function(out) {
        var data = new ByteArray();
        data.writeUint32BE(this.frames.length);
        data.writeUint32BE(this.repeat);
        
        writeChunk(out, 'acTL', data.getData());
    };
    
    /**
     * Write a single frame (fcTL + IDAT/fdAT)
     * @private
     */
    APNG.prototype._writeFrame = function(out, frameIndex) {
        var frame = this.frames[frameIndex];
        
        // fcTL chunk (frame control)
        this._writeFcTL(out, frame, frameIndex === 0);
        
        // Apply filtering (adaptive or simple)
        var filtered;
        if (this.adaptiveFilter) {
            filtered = filterImageDataAdaptive(frame.data, frame.width, frame.height);
        } else {
            filtered = filterImageDataSimple(frame.data, frame.width, frame.height);
        }
        
        // Compress with pako or fallback
        var compressed = compressData(filtered);
        
        if (frameIndex === 0) {
            // First frame uses IDAT
            writeChunk(out, 'IDAT', compressed);
        } else {
            // Subsequent frames use fdAT
            var fdatData = new ByteArray();
            fdatData.writeUint32BE(this.sequenceNumber++);
            fdatData.writeBytes(compressed);
            writeChunk(out, 'fdAT', fdatData.getData());
        }
    };
    
    /**
     * Write fcTL chunk (frame control)
     * @private
     */
    APNG.prototype._writeFcTL = function(out, frame, isFirst) {
        var data = new ByteArray();
        
        data.writeUint32BE(this.sequenceNumber++);
        data.writeUint32BE(frame.width);
        data.writeUint32BE(frame.height);
        data.writeUint32BE(0);  // X offset
        data.writeUint32BE(0);  // Y offset
        data.writeUint16BE(frame.delay);  // Delay numerator
        data.writeUint16BE(1000);         // Delay denominator
        data.writeByte(0);  // Dispose op
        data.writeByte(0);  // Blend op
        
        writeChunk(out, 'fcTL', data.getData());
    };
    
    /**
     * Abort encoding (for API compatibility)
     */
    APNG.prototype.abort = function() {
        // No-op for synchronous encoder
    };

    // ============================================
    // Global Exports
    // ============================================
    
    root.APNG = APNG;
    
    // Export utilities for testing
    root.apngUtils = {
        crc32: crc32,
        compressData: compressData,
        filterImageDataAdaptive: filterImageDataAdaptive,
        filterImageDataSimple: filterImageDataSimple,
        hasPako: hasPako
    };
    
    // Log status
    if (hasPako()) {
        console.log('[APNG.js] Module loaded with pako compression (high compression)');
    } else {
        console.log('[APNG.js] Module loaded (pako not found - add pako for better compression)');
    }

})(typeof window !== 'undefined' ? window : this);
