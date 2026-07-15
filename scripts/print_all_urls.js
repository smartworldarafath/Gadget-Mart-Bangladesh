const fs = require('fs');
const filePath = 'C:\\Users\\HP Omnibook X Flip\\.gemini\\antigravity\\brain\\aa1cd128-3f7c-4581-856e-417035f3d286\\.system_generated\\steps\\573\\content.md';

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Match URLs starting with adminapi and storage/media
  const regex = /https(?:%3A%2F%2F|\/\/)[a-zA-Z0-9\._-]*applegadgetsbd\.com(?:%2F|\/)storage(?:%2F|\/)media(?:%2F|\/)[a-zA-Z0-9_\-\.%]+/gi;
  const matches = content.match(regex) || [];
  const decoded = matches.map(u => {
    try {
      return decodeURIComponent(u);
    } catch {
      return u;
    }
  });
  console.log("Found matches count:", decoded.length);
  console.log("Sample matches:");
  console.log([...new Set(decoded)].slice(0, 30));
} else {
  console.log("File not found");
}
