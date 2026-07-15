const fs = require('fs');
const contentPath = 'C:\\Users\\HP Omnibook X Flip\\.gemini\\antigravity\\brain\\aa1cd128-3f7c-4581-856e-417035f3d286\\.system_generated\\steps\\760\\content.md';

function test() {
  if (!fs.existsSync(contentPath)) {
    console.error("Content file not found");
    return;
  }

  const html = fs.readFileSync(contentPath, 'utf8');

  // Search for the word "price" with various combinations
  const regexes = [
    /"price"\s*:\s*([^,}]+)/gi,
    /price\s*:\s*([^,}]+)/gi,
    /regular_price\s*:\s*([^,}]+)/gi,
    /sale_price\s*:\s*([^,}]+)/gi,
    /"regular"\s*:\s*([^,}]+)/gi,
    /"sale"\s*:\s*([^,}]+)/gi
  ];

  regexes.forEach((regex, idx) => {
    console.log(`\n--- Regex #${idx} ---`);
    let match;
    let count = 0;
    while ((match = regex.exec(html)) !== null && count < 20) {
      count++;
      console.log(`Match: ${match[0]} (capture: ${match[1].trim()})`);
    }
  });

  // Let's also print any script blocks containing "price"
  console.log("\n--- Script blocks containing price ---");
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let sMatch;
  let sCount = 0;
  while ((sMatch = scriptRegex.exec(html)) !== null) {
    const code = sMatch[1];
    if (code.includes('"price"') || code.includes('price:')) {
      sCount++;
      console.log(`Script #${sCount} (Length: ${code.length})`);
      // Find where "price" occurs
      const idx = code.indexOf('price');
      console.log("Context: ... " + code.substring(Math.max(0, idx - 100), Math.min(code.length, idx + 100)) + " ...");
    }
  }
}

test();
