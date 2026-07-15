const fs = require('fs');
const sitemapPath = 'C:\\Users\\HP Omnibook X Flip\\.gemini\\antigravity\\brain\\aa1cd128-3f7c-4581-856e-417035f3d286\\.system_generated\\steps\\681\\content.md';

function test() {
  if (!fs.existsSync(sitemapPath)) {
    console.error("Sitemap file not found");
    return;
  }

  const content = fs.readFileSync(sitemapPath, 'utf8');
  const urlRegex = /<loc>(https:\/\/www\.applegadgetsbd\.com\/category\/[^<]+)<\/loc>/gi;
  const urls = [];
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }

  console.log(`Found ${urls.length} category URLs.`);
  console.log("Audio categories:");
  console.log(urls.filter(u => u.includes('sound') || u.includes('head') || u.includes('ear') || u.includes('audio') || u.includes('speaker')));

  console.log("\nCharger/Adapter categories:");
  console.log(urls.filter(u => u.includes('charger') || u.includes('adapter') || u.includes('power')));
}

test();
