const fs = require('fs');
const contentPath = 'C:\\Users\\HP Omnibook X Flip\\.gemini\\antigravity\\brain\\aa1cd128-3f7c-4581-856e-417035f3d286\\.system_generated\\steps\\790\\content.md';

function test() {
  if (!fs.existsSync(contentPath)) {
    console.error("Content file not found");
    return;
  }

  const html = fs.readFileSync(contentPath, 'utf8');

  // Let's find all script tags that might contain NEXT_DATA or state
  const regex = /<script\s+id="__NEXT_DATA__"\s+type="application\/json">([\s\S]*?)<\/script>/gi;
  const match = regex.exec(html);
  if (match) {
    console.log("Found __NEXT_DATA__ script!");
    const data = JSON.parse(match[1]);
    fs.writeFileSync('C:\\Users\\HP Omnibook X Flip\\.gemini\\antigravity\\brain\\aa1cd128-3f7c-4581-856e-417035f3d286\\next_data.json', JSON.stringify(data, null, 2));
    console.log("Saved __NEXT_DATA__ to next_data.json");
    
    // Look for price inside NEXT_DATA
    console.log("Searching for price keys inside next_data.json...");
    // Let's traverse the json to search for keys containing 'price'
    const results = [];
    function traverse(obj, path = '') {
      if (!obj) return;
      if (typeof obj === 'object') {
        for (const [key, val] of Object.entries(obj)) {
          const newPath = path ? `${path}.${key}` : key;
          if (key.toLowerCase().includes('price')) {
            results.push({ path: newPath, value: val });
          }
          traverse(val, newPath);
        }
      } else if (Array.isArray(obj)) {
        obj.forEach((item, idx) => {
          traverse(item, `${path}[${idx}]`);
        });
      }
    }
    traverse(data);
    console.log(`Found ${results.length} price keys in state:`);
    console.log(JSON.stringify(results.slice(0, 15), null, 2));
  } else {
    console.log("No __NEXT_DATA__ script found");
  }
}

test();
