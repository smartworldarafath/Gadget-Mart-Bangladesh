const fs = require('fs');
const contentPath = 'C:\\Users\\HP Omnibook X Flip\\.gemini\\antigravity\\brain\\aa1cd128-3f7c-4581-856e-417035f3d286\\.system_generated\\steps\\816\\content.md';

function test() {
  if (!fs.existsSync(contentPath)) {
    console.error("Content file not found");
    return;
  }

  const html = fs.readFileSync(contentPath, 'utf8');

  console.log("Searching for BDT / Taka prices in earbuds category page...");
  // Let's find matches for numbers followed by BDT or ৳
  const regex = /([0-9,]+)\s*(?:৳|BDT)/gi;
  let match;
  let count = 0;
  while ((match = regex.exec(html)) !== null && count < 25) {
    count++;
    const idx = match.index;
    console.log(`\nMatch #${count}: ${match[0]}`);
    console.log(`Context: ... ${html.substring(Math.max(0, idx - 80), Math.min(html.length, idx + 120))} ...`);
  }
}

test();
