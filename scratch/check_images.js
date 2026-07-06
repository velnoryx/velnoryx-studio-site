import fs from 'fs';

function getPngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  console.log(`${filePath}: ${width}x${height}`);
}

try {
  getPngDimensions('public/logo_text_trimmed.png');
  getPngDimensions('public/logo_text.png');
  getPngDimensions('public/velnoryx_logo.png');
} catch (err) {
  console.error(err);
}
