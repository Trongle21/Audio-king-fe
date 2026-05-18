const path = require('path');

const sharp = require('sharp');

async function generateFavicon() {
  const sourcePath = path.join(__dirname, '../public/logo.png');
  const outputDir = path.join(__dirname, '../public');
  
  // Read the source image
  const image = sharp(sourcePath);
  
  // Generate favicon.ico (multiple sizes embedded)
  // For simplicity, we'll create a 32x32 PNG that browsers can use
  const sizes = [16, 32, 48, 64, 128, 256];
  
  // Create favicon.png (32x32)
  await image
    .resize(32, 32)
    .png()
    .toFile(path.join(outputDir, 'favicon-32.png'));
    
  console.log('Created favicon-32.png');
  
  // Create apple-touch-icon.png (180x180)
  await sharp(sourcePath)
    .resize(180, 180)
    .png()
    .toFile(path.join(outputDir, 'apple-touch-icon.png'));
    
  console.log('Created apple-touch-icon.png');
  
  // Create icons for Android/Windows
  await Promise.all(
    sizes.map(async (size) => {
      await sharp(sourcePath)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`))
      console.log(`Created icon-${size}x${size}.png`)
    }),
  )
  
  console.log('All favicon files generated successfully!');
}

generateFavicon().catch(console.error);
