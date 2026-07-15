const fs = require('fs');
const contentPath = 'C:\\Users\\HP Omnibook X Flip\\.gemini\\antigravity\\brain\\aa1cd128-3f7c-4581-856e-417035f3d286\\.system_generated\\steps\\800\\content.md';

function test() {
  if (!fs.existsSync(contentPath)) {
    console.error("Content file not found");
    return;
  }

  const html = fs.readFileSync(contentPath, 'utf8');

  // Search for "1950" and "2000" in the HTML code
  console.log("Searching for QCY T13 ANC 2 price points: 1950 / 2000...");
  const targets = ["1950", "2000", "1,950", "2,000"];
  
  targets.forEach(target => {
    let idx = 0;
    let count = 0;
    while ((idx = html.indexOf(target, idx)) !== -1 && count < 10) {
      count++;
      console.log(`\nFound target "${target}" at position ${idx}:`);
      console.log(`Context: ... ${html.substring(Math.max(0, idx - 100), Math.min(html.length, idx + 150))} ...`);
      idx += target.length;
    }
  });
}

test();
