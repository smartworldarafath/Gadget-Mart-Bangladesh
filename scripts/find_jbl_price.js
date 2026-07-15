const fs = require('fs');
const contentPath = 'C:\\Users\\HP Omnibook X Flip\\.gemini\\antigravity\\brain\\aa1cd128-3f7c-4581-856e-417035f3d286\\.system_generated\\steps\\800\\content.md';

function test() {
  if (!fs.existsSync(contentPath)) {
    console.error("Content file not found");
    return;
  }

  const html = fs.readFileSync(contentPath, 'utf8');

  // Search for "(Cash Price)"
  const key = "(Cash Price)";
  let idx = 0;
  let count = 0;
  while ((idx = html.indexOf(key, idx)) !== -1 && count < 10) {
    count++;
    console.log(`\nMatch #${count} (position ${idx}):`);
    console.log(`Context: ... ${html.substring(Math.max(0, idx - 150), Math.min(html.length, idx + 150))} ...`);
    idx += key.length;
  }
}

test();
