const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const BASE = 'F:\\Vaishnav Personal\\Jewelry-ecommerce-client-main';
const dir = BASE + '\\public\\assets\\img\\slider\\4';
const LOG = BASE + '\\remove-bg.log';
const files = ['slider-1.png', 'slider-2.png', 'slider-3.png', 'slider-4.png'];

// Threshold: pixels brighter than this (0-255) will be made transparent
const THRESHOLD = 230;

async function removeWhiteBackground(filePath) {
  fs.appendFileSync(LOG, 'Processing: ' + path.basename(filePath) + '\n');

  const image = await Jimp.read(filePath);

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];

    // Pure white / near-white: make fully transparent
    if (r > THRESHOLD && g > THRESHOLD && b > THRESHOLD) {
      this.bitmap.data[idx + 3] = 0;
    } else if (r > 200 && g > 200 && b > 200) {
      // Edge pixels: partial transparency for smooth blending
      const avg = (r + g + b) / 3;
      const alpha = Math.round(((255 - avg) / (255 - 200)) * 255);
      this.bitmap.data[idx + 3] = Math.max(0, Math.min(255, alpha));
    }
  });

  await image.writeAsync(filePath);
  fs.appendFileSync(LOG, '  OK: ' + path.basename(filePath) + '\n');
}

async function main() {
  fs.writeFileSync(LOG, '--- BG Removal Start ---\n');

  for (const file of files) {
    const fp = path.join(dir, file);
    if (fs.existsSync(fp)) {
      await removeWhiteBackground(fp);
    } else {
      fs.appendFileSync(LOG, '  SKIP (not found): ' + file + '\n');
    }
  }

  fs.appendFileSync(LOG, '--- ALL DONE ---\n');
}

main().catch((err) => {
  fs.appendFileSync(LOG, 'ERROR: ' + err.message + '\n' + err.stack + '\n');
});
