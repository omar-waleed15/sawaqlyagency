const sharp = require('sharp');
const fs = require('fs');

async function run() {
  const input = 'public/astronaut-phone-clean.png';
  const orig = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = orig.info.width;
  const h = orig.info.height;

  // Gaussian blur using sharp
  const blurred = await sharp(input).blur(20).ensureAlpha().raw().toBuffer();

  const data = Buffer.from(orig.data);
  const blurStartY = 830;
  const blurEndY = 1200;

  for (let y = blurStartY; y < h; y++) {
    const t = (y - blurStartY) / (blurEndY - blurStartY);
    const smoothT = t * t * (3 - 2 * t); // smoothstep 0..1

    // Alpha fade in bottom 100px
    let alphaMult = 1.0;
    if (y > 1080) {
      alphaMult = 1.0 - (y - 1080) / (1200 - 1080);
    }

    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      data[idx] = Math.round(data[idx] * (1 - smoothT) + blurred[idx] * smoothT);
      data[idx + 1] = Math.round(data[idx + 1] * (1 - smoothT) + blurred[idx + 1] * smoothT);
      data[idx + 2] = Math.round(data[idx + 2] * (1 - smoothT) + blurred[idx + 2] * smoothT);
      data[idx + 3] = Math.round((data[idx + 3] * (1 - smoothT) + blurred[idx + 3] * smoothT) * alphaMult);
    }
  }

  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile('public/astronaut-phone-blurred.png');

  console.log('DONE: astronaut-phone-blurred.png created');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
