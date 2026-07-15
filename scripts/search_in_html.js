const fs = require('fs');
const filePath = 'C:\\Users\\HP Omnibook X Flip\\.gemini\\antigravity\\brain\\aa1cd128-3f7c-4581-856e-417035f3d286\\.system_generated\\steps\\573\\content.md';

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8').toLowerCase();
  console.log("Contains 'qcy':", content.includes('qcy'));
  console.log("Contains 'oraimo':", content.includes('oraimo'));
  console.log("Contains 'baseus':", content.includes('baseus'));
  console.log("Contains 'earbuds':", content.includes('earbuds'));
} else {
  console.log("File not found");
}
