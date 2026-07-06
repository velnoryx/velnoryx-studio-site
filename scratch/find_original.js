import fs from 'fs';
import readline from 'readline';

async function findOriginalCode() {
  const fileStream = fs.createReadStream('C:/Users/MANOJGNA/.gemini/antigravity-cli/brain/a1aac3e4-ead6-48b6-aa3b-02d284faa859/.system_generated/logs/transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.includes('drawLogoText') && line.includes('function ')) {
      const idx = line.indexOf('function drawLogoText');
      if (idx !== -1) {
        console.log("FOUND:");
        console.log(line.substring(idx, idx + 1000));
        break;
      }
    }
  }
}

findOriginalCode();
