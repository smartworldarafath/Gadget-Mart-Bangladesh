const fs = require('fs');
const contentPath = 'C:\\Users\\HP Omnibook X Flip\\.gemini\\antigravity\\brain\\aa1cd128-3f7c-4581-856e-417035f3d286\\.system_generated\\steps\\800\\content.md';

function test() {
  if (!fs.existsSync(contentPath)) {
    console.error("Content file not found");
    return;
  }

  const html = fs.readFileSync(contentPath, 'utf8');

  console.log("Searching for adminapi.applegadgetsbd.com urls...");
  const regex = /https:\/\/adminapi\.applegadgetsbd\.com\/[a-zA-Z0-9_\-\/.]+/gi;
  let match;
  const urls = new Set();
  while ((match = regex.exec(html)) !== null) {
    urls.add(match[0]);
  }

  console.log(`Found ${urls.size} distinct URLs:`);
  urls.forEach(url => console.log(url));
}

test();
