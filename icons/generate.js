#!/usr/bin/env node
/**
 * Simple PNG icon generator for PWA
 * Generates basic gradient icons without external dependencies
 *
 * For better quality icons, open generate-icons.html in a browser
 */

const fs = require('fs');
const zlib = require('zlib');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const maskableSizes = [192, 512];

// Create a simple gradient PNG
function createPNG(width, height, isMaskable = false) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type (RGB)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Generate pixel data with gradient
  const rawData = Buffer.alloc(height * (1 + width * 3));
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = width * (isMaskable ? 0.5 : 0.4);
  const cornerRadius = width * 0.1875;

  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 3);
    rawData[rowStart] = 0; // filter byte

    for (let x = 0; x < width; x++) {
      const pixelStart = rowStart + 1 + x * 3;

      // Gradient calculation (top-left to bottom-right)
      const t = (x + y) / (width + height);

      // Color 1: #667eea (102, 126, 234)
      // Color 2: #764ba2 (118, 75, 162)
      let r = Math.round(102 + (118 - 102) * t);
      let g = Math.round(126 + (75 - 126) * t);
      let b = Math.round(234 + (162 - 234) * t);

      // Check if pixel is inside rounded rectangle (for non-maskable)
      if (!isMaskable) {
        const inRoundedRect = isInsideRoundedRect(x, y, width, height, cornerRadius);
        if (!inRoundedRect) {
          // Transparent areas become white for RGB PNG (no alpha)
          r = g = b = 255;
        }
      }

      rawData[pixelStart] = r;
      rawData[pixelStart + 1] = g;
      rawData[pixelStart + 2] = b;
    }
  }

  // Compress pixel data
  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function isInsideRoundedRect(x, y, width, height, radius) {
  // Check corners
  if (x < radius && y < radius) {
    return Math.pow(x - radius, 2) + Math.pow(y - radius, 2) <= Math.pow(radius, 2);
  }
  if (x >= width - radius && y < radius) {
    return Math.pow(x - (width - radius), 2) + Math.pow(y - radius, 2) <= Math.pow(radius, 2);
  }
  if (x < radius && y >= height - radius) {
    return Math.pow(x - radius, 2) + Math.pow(y - (height - radius), 2) <= Math.pow(radius, 2);
  }
  if (x >= width - radius && y >= height - radius) {
    return Math.pow(x - (width - radius), 2) + Math.pow(y - (height - radius), 2) <= Math.pow(radius, 2);
  }
  return true;
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = crc32(Buffer.concat([typeBuffer, data]));

  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

// CRC32 implementation for PNG
function crc32(data) {
  let crc = 0xFFFFFFFF;
  const table = getCRC32Table();

  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }

  return crc ^ 0xFFFFFFFF;
}

let crcTable = null;
function getCRC32Table() {
  if (crcTable) return crcTable;

  crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xEDB88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    crcTable[n] = c;
  }
  return crcTable;
}

// Generate all icons
console.log('Generating PWA icons...\n');

const iconsDir = __dirname;

sizes.forEach(size => {
  const filename = `icon-${size}.png`;
  const filepath = `${iconsDir}/${filename}`;
  const png = createPNG(size, size, false);
  fs.writeFileSync(filepath, png);
  console.log(`Created ${filename} (${size}x${size})`);
});

maskableSizes.forEach(size => {
  const filename = `icon-maskable-${size}.png`;
  const filepath = `${iconsDir}/${filename}`;
  const png = createPNG(size, size, true);
  fs.writeFileSync(filepath, png);
  console.log(`Created ${filename} (${size}x${size}, maskable)`);
});

console.log('\nAll icons generated!');
console.log('For higher quality icons with the brain design,');
console.log('open generate-icons.html in a browser.');
