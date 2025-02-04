import sharp from 'sharp';
import { resolve } from 'path';

const SOURCE_IMAGE = resolve(__dirname, '../public/images/TOP CONTRACTORS DENVER main logo image 1.jpg');
const OUTPUT_DIR = resolve(__dirname, '../public');

async function generateFavicons() {
  try {
    console.log('Generating favicons...');

    // Create favicon.ico (16x16 and 32x32)
    await sharp(SOURCE_IMAGE)
      .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toFile(resolve(OUTPUT_DIR, 'icon-32x32.png'));

    await sharp(SOURCE_IMAGE)
      .resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toFile(resolve(OUTPUT_DIR, 'icon-16x16.png'));

    // Create apple-touch-icon.png (180x180)
    await sharp(SOURCE_IMAGE)
      .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toFile(resolve(OUTPUT_DIR, 'apple-touch-icon.png'));

    // Create PWA icons
    await sharp(SOURCE_IMAGE)
      .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toFile(resolve(OUTPUT_DIR, 'icon-192x192.png'));

    await sharp(SOURCE_IMAGE)
      .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toFile(resolve(OUTPUT_DIR, 'icon-512x512.png'));

    console.log('✅ Favicons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
