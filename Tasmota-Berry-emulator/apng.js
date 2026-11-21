/**
 * apng.js - JavaScript APNG (Animated PNG) encoder
 * 
 * A high-compression APNG encoder for LED strip animations.
 * Requires fflate library for DEFLATE compression.
 * 
 * Part of the Berry Animation Framework Browser Simulator.
 */

(function(root) {
    'use strict';

    // CRC32 table (lazy initialized)
    var crcTable = null;
    
    function makeCRCTable() {
        var table = new Uint32Array(256);
        for (var n = 0; n < 256; n++) {
            var c = n;
            for (var k = 0; k < 8; k++) {
                c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
            }
            table[n] = c;
        }
        return table;
    }
    
    function crc32(data) {
        if (!crcTable) crcTable = makeCRCTable();
        var crc = 0xFFFFFFFF;
        for (var i = 0; i < data.length; i++) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xFF];
        }
        return (crc ^ 0xFFFFFFFF) >>> 0;
    }

    // Paeth predictor for PNG filtering
    function paethPredictor(a, b, c) {
        var p = a + b - c;
        var pa = Math.abs(p - a);
        var pb = Math.abs(p - b);
        var pc = Math.abs(p - c);
        if (pa <= pb && pa <= pc) return a;
        if (pb <= pc) return b;
        return c;
    }
    
    // Apply PNG filter to a row
    function applyFilter(row, prevRow, filterType, bpp) {
        var len = row.length;
        var filtered = new Uint8Array(len);
        
        for (var i = 0; i < len; i++) {
            var orig = row[i];
            var a = (i >= bpp) ? row[i - bpp] : 0;
            var b = prevRow ? prevRow[i] : 0;
            var c = (prevRow && i >= bpp) ? prevRow[i - bpp] : 0;
            
            switch (filterType) {
                case 0: filtered[i] = orig; break;
                case 1: filtered[i] = (orig - a) & 0xFF; break;
                case 2: filtered[i] = (orig - b) & 0xFF; break;
                case 3: filtered[i] = (orig - Math.floor((a + b) / 2)) & 0xFF; break;
                case 4: filtered[i] = (orig - paethPredictor(a, b, c)) & 0xFF; break;
            }
        }
        return filtered;
    }
    
    // Score filter effectiveness (lower = better compression)
    function filterScore(filtered) {
        var sum = 0;
        for (var i = 0; i < filtered.length; i++) {
            var val = filtered[i];
            sum += (val > 127) ? (256 - val) : val;
        }
        return sum;
    }

    // Apply adaptive filtering - tries all 5 filter types per row
    function filterImageData(rgba, width, height) {
        var bpp = 4;
        var rowBytes = width * bpp;
        var filtered = new Uint8Array(height * (1 + rowBytes));
        var prevRow = null;
        var dstPos = 0;
        
        for (var y = 0; y < height; y++) {
            var currentRow = rgba.slice(y * rowBytes, (y + 1) * rowBytes);
            var bestFilter = 0, bestScore = Infinity, bestFiltered = null;
            
            for (var f = 0; f < 5; f++) {
                var filteredRow = applyFilter(currentRow, prevRow, f, bpp);
                var score = filterScore(filteredRow);
                if (score < bestScore) {
                    bestScore = score;
                    bestFilter = f;
                    bestFiltered = filteredRow;
                }
            }
            
            filtered[dstPos++] = bestFilter;
            for (var i = 0; i < rowBytes; i++) {
                filtered[dstPos++] = bestFiltered[i];
            }
            prevRow = currentRow;
        }
        return filtered;
    }

    // ByteArray helper for building binary data
    function ByteArray() {
        this.data = [];
    }
    ByteArray.prototype.writeByte = function(v) { this.data.push(v & 0xFF); };
    ByteArray.prototype.writeBytes = function(arr) {
        for (var i = 0; i < arr.length; i++) this.data.push(arr[i] & 0xFF);
    };
    ByteArray.prototype.writeUint16BE = function(v) {
        this.data.push((v >> 8) & 0xFF, v & 0xFF);
    };
    ByteArray.prototype.writeUint32BE = function(v) {
        this.data.push((v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF);
    };
    ByteArray.prototype.writeString = function(s) {
        for (var i = 0; i < s.length; i++) this.data.push(s.charCodeAt(i));
    };
    ByteArray.prototype.getData = function() { return new Uint8Array(this.data); };

    // Write PNG chunk
    function writeChunk(out, type, data) {
        var dataLen = data ? data.length : 0;
        out.writeUint32BE(dataLen);
        out.writeString(type);
        if (data && dataLen > 0) out.writeBytes(data);
        
        var crcData = new Uint8Array(4 + dataLen);
        for (var i = 0; i < 4; i++) crcData[i] = type.charCodeAt(i);
        if (data) for (var i = 0; i < dataLen; i++) crcData[4 + i] = data[i];
        out.writeUint32BE(crc32(crcData));
    }

    // APNG Encoder
    function APNG(options) {
        options = options || {};
        this.width = options.width || 320;
        this.height = options.height || 240;
        this.repeat = options.repeat !== undefined ? options.repeat : 0;
        this.frames = [];
        this.sequenceNumber = 0;
        this.onProgress = null;
        this.onFinished = null;
    }
    
    APNG.prototype.addFrame = function(image, options) {
        options = options || {};
        var frame = { delay: options.delay || 100, data: null, width: 0, height: 0 };
        
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
            var imgData = image.getImageData(0, 0, this.width, this.height);
            frame.data = new Uint8Array(imgData.data);
            frame.width = this.width;
            frame.height = this.height;
        } else {
            throw new Error('Invalid image type');
        }
        this.frames.push(frame);
    };
    
    APNG.prototype.on = function(event, callback) {
        if (event === 'finished') this.onFinished = callback;
        else if (event === 'progress') this.onProgress = callback;
        return this;
    };
    
    APNG.prototype.render = function() {
        if (this.frames.length === 0) throw new Error('No frames to encode');
        
        var out = new ByteArray();
        out.writeBytes([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]); // PNG signature
        
        // IHDR
        var ihdr = new ByteArray();
        ihdr.writeUint32BE(this.width);
        ihdr.writeUint32BE(this.height);
        ihdr.writeByte(8);  // Bit depth
        ihdr.writeByte(6);  // Color type (RGBA)
        ihdr.writeByte(0);  // Compression
        ihdr.writeByte(0);  // Filter
        ihdr.writeByte(0);  // Interlace
        writeChunk(out, 'IHDR', ihdr.getData());
        
        // acTL (animation control)
        var actl = new ByteArray();
        actl.writeUint32BE(this.frames.length);
        actl.writeUint32BE(this.repeat);
        writeChunk(out, 'acTL', actl.getData());
        
        // Frames
        for (var i = 0; i < this.frames.length; i++) {
            var frame = this.frames[i];
            
            // fcTL (frame control)
            var fctl = new ByteArray();
            fctl.writeUint32BE(this.sequenceNumber++);
            fctl.writeUint32BE(frame.width);
            fctl.writeUint32BE(frame.height);
            fctl.writeUint32BE(0);  // X offset
            fctl.writeUint32BE(0);  // Y offset
            fctl.writeUint16BE(frame.delay);  // Delay numerator
            fctl.writeUint16BE(1000);         // Delay denominator
            fctl.writeByte(0);  // Dispose op
            fctl.writeByte(0);  // Blend op
            writeChunk(out, 'fcTL', fctl.getData());
            
            // Filter and compress
            var filtered = filterImageData(frame.data, frame.width, frame.height);
            var compressed = fflate.zlibSync(filtered, { level: 9 });
            
            if (i === 0) {
                writeChunk(out, 'IDAT', compressed);
            } else {
                var fdat = new ByteArray();
                fdat.writeUint32BE(this.sequenceNumber++);
                fdat.writeBytes(compressed);
                writeChunk(out, 'fdAT', fdat.getData());
            }
            
            if (this.onProgress) this.onProgress((i + 1) / this.frames.length);
        }
        
        writeChunk(out, 'IEND', null);
        
        var blob = new Blob([out.getData()], { type: 'image/png' });
        if (this.onFinished) this.onFinished(blob);
        return blob;
    };
    
    APNG.prototype.abort = function() {}; // No-op for sync encoder

    root.APNG = APNG;
    console.log('[APNG.js] Module loaded with fflate compression');

})(typeof window !== 'undefined' ? window : this);
