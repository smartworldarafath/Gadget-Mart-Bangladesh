const fs = require('fs');
const contentPath = 'C:\\Users\\HP Omnibook X Flip\\.gemini\\antigravity\\brain\\aa1cd128-3f7c-4581-856e-417035f3d286\\.system_generated\\steps\\760\\content.md';

function test() {
  if (!fs.existsSync(contentPath)) {
    console.error("Content file not found");
    return;
  }

  const html = fs.readFileSync(contentPath, 'utf8');

  // Search for ৳ or BDT
  console.log("Searching for ৳ / BDT symbols...");
  const regex = /(?:৳|BDT)\s*([0-9,]+)/gi;
  let match;
  let count = 0;
  while ((match = regex.exec(html)) !== null && count < 25) {
    count++;
    const idx = match.index;
    console.log(`\nMatch #${count}: ${match[0]}`);
    console.log(`Context: ... ${html.substring(Math.max(0, idx - 100), Math.min(html.length, idx + 150))} ...`);
  }

  // Also try searching for the reverse order (number first, then ৳)
  const regexRev = /([0-9,]+)\s*(?:৳|BDT)/gi;
  let countRev = 0;
  while ((match = regexRev.exec(html)) !== null && countRev < 25) {
    countRev++;
    const idx = match.index;
    console.log(`\nReverse Match #${countRev}: ${match[0]}`);
    console.log(`Context: ... ${html.substring(Math.max(0, idx - 100), Math.min(html.length, idx + 150))} ...`);
  }
}

test();
