const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hlciajobsygzwqohvvyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsY2lham9ic3lnendxb2h2dnl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEyNjQwMiwiZXhwIjoyMDk5NzAyNDAyfQ.3uWlepLWHbTq1fCYnCHwyjAwWaXbJLQaaGq2bTerG7s';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const filePath = 'C:\\Users\\HP Omnibook X Flip\\.gemini\\antigravity\\brain\\aa1cd128-3f7c-4581-856e-417035f3d286\\.system_generated\\steps\\573\\content.md';
  if (!fs.existsSync(filePath)) {
    console.error("Content file does not exist:", filePath);
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');

  // Regex for plain URLs
  const plainRegex = /https:\/\/adminapi\.applegadgetsbd\.com\/storage\/media\/large\/[a-zA-Z0-9_\-\.\/]+/gi;
  // Regex for encoded URLs
  const encodedRegex = /https%3A%2F%2Fadminapi\.applegadgetsbd\.com%2Fstorage%2Fmedia%2Flarge%2F[a-zA-Z0-9_\-\.%]+/gi;

  const plainUrls = html.match(plainRegex) || [];
  const encodedUrls = (html.match(encodedRegex) || []).map(u => {
    try {
      return decodeURIComponent(u);
    } catch {
      return null;
    }
  }).filter(Boolean);

  const imageUrls = [...new Set([...plainUrls, ...encodedUrls])];

  console.log(`Found ${imageUrls.length} unique large image URLs:`);
  console.log(imageUrls);

  // Let's fetch all products from database to see if we can match their brand/name keywords with the image filenames.
  const { data: dbProducts, error } = await supabase.from('products').select('id, name, slug');
  if (error || !dbProducts) {
    console.error("Failed to load products:", error);
    return;
  }

  let updateCount = 0;
  for (const product of dbProducts) {
    const nameWords = product.name.toLowerCase().replace(/tws|wireless|earbuds|earphones|bluetooth/g, '').trim().split(/\s+/);
    // Find image that has all of the first 2 name words
    const keyword1 = nameWords[0];
    const keyword2 = nameWords[1] || '';

    const matchedImg = imageUrls.find(imgUrl => {
      const imgLower = imgUrl.toLowerCase();
      return imgLower.includes(keyword1) && (keyword2 === '' || imgLower.includes(keyword2));
    });

    if (matchedImg) {
      console.log(`Matched Product: "${product.name}" --> Image: ${matchedImg}`);
      const { error: updateErr } = await supabase
        .from('products')
        .update({
          images: [matchedImg],
          thumbnail_url: matchedImg
        })
        .eq('id', product.id);
      
      if (!updateErr) updateCount++;
    }
  }

  console.log(`Successfully mapped and updated ${updateCount} products using exact category page image extraction!`);
}

run();
