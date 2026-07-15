const fs = require('fs');
const contentPath = 'C:\\Users\\HP Omnibook X Flip\\.gemini\\antigravity\\brain\\aa1cd128-3f7c-4581-856e-417035f3d286\\.system_generated\\steps\\760\\content.md';

function test() {
  if (!fs.existsSync(contentPath)) {
    console.error("Content file not found");
    return;
  }

  const html = fs.readFileSync(contentPath, 'utf8');

  // Let's find all script tags that might contain JSON-LD
  const jsonLdRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  let count = 0;
  while ((match = jsonLdRegex.exec(html)) !== null) {
    count++;
    console.log(`\n--- JSON-LD Script #${count} ---`);
    try {
      const parsed = JSON.parse(match[1].trim());
      console.log(JSON.stringify(parsed, null, 2).substring(0, 1000));
    } catch (e) {
      console.log("Could not parse JSON:", e.message);
      console.log(match[1].substring(0, 500));
    }
  }

  // Let's also look for BDT or ৳ in the text
  console.log("\n--- BDT/৳ occurrences with context ---");
  const bdtRegex = /(.{0,100})([0-9,]+)\s*(?:৳|BDT)(.{0,100})/gi;
  let bdtMatch;
  while ((bdtMatch = bdtRegex.exec(html)) !== null) {
    console.log(`\nMatch: ${bdtMatch[2]} BDT`);
    console.log(`Context: ...${bdtMatch[1]}[MATCH]${bdtMatch[3]}...`);
  }

  // Let's also look for meta tags with price
  console.log("\n--- Price meta tags ---");
  const priceMetaRegex = /<meta\s+[^>]*price[^>]*>/gi;
  let pmMatch;
  while ((pmMatch = priceMetaRegex.exec(html)) !== null) {
    console.log(`Meta: ${pmMatch[0]}`);
  }
}

test();
