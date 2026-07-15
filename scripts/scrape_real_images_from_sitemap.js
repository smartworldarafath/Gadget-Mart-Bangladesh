const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hlciajobsygzwqohvvyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsY2lham9ic3lnendxb2h2dnl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEyNjQwMiwiZXhwIjoyMDk5NzAyNDAyfQ.3uWlepLWHbTq1fCYnCHwyjAwWaXbJLQaaGq2bTerG7s';
const supabase = createClient(supabaseUrl, supabaseKey);

const sitemapPath = 'C:\\Users\\HP Omnibook X Flip\\.gemini\\antigravity\\brain\\aa1cd128-3f7c-4581-856e-417035f3d286\\.system_generated\\steps\\617\\content.md';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  if (!fs.existsSync(sitemapPath)) {
    console.error("Sitemap file not found:", sitemapPath);
    return;
  }

  console.log("Reading and parsing sitemap...");
  const content = fs.readFileSync(sitemapPath, 'utf8');
  
  // Extract all urls from <loc>
  const urlRegex = /<loc>(https:\/\/www\.applegadgetsbd\.com\/product\/[^<]+)<\/loc>/gi;
  const sitemapUrls = [];
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    sitemapUrls.push(match[1]);
  }
  
  console.log(`Parsed ${sitemapUrls.length} product URLs from sitemap.`);

  console.log("Fetching database products list...");
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug')
    .order('created_at', { ascending: true });

  if (error || !products) {
    console.error("Failed to fetch products:", error);
    return;
  }

  console.log(`Found ${products.length} products to map.`);

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`\n[${i+1}/${products.length}] Product: "${product.name}"`);

    // Clean brand/keywords from name
    const nameLower = product.name.toLowerCase();
    const words = nameLower
      .replace(/tws|wireless|earbuds|earphones|bluetooth|charger|adapter|wall|power|delivery|fast|port|station/g, '')
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 1);

    const brand = words[0]; // e.g. "qcy"
    const model = words[1] || ''; // e.g. "t13"

    // Search sitemap URLs for matches
    let matchedUrls = sitemapUrls.filter(url => {
      const urlLower = url.toLowerCase();
      if (brand && model) {
        return urlLower.includes(brand) && urlLower.includes(model);
      }
      return brand && urlLower.includes(brand);
    });

    // If no brand+model match, fall back to brand match
    if (matchedUrls.length === 0 && brand) {
      matchedUrls = sitemapUrls.filter(url => url.toLowerCase().includes(brand));
    }

    let targetUrl = null;
    if (matchedUrls.length > 0) {
      // Find the URL that is most similar to our name
      // e.g. length of matched parts
      matchedUrls.sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        let aScore = 0;
        let bScore = 0;
        words.forEach(w => {
          if (aLower.includes(w)) aScore++;
          if (bLower.includes(w)) bScore++;
        });
        return bScore - aScore; // Highest score first
      });

      targetUrl = matchedUrls[0];
    }

    if (targetUrl) {
      console.log(`  --> Found matched sitemap URL: ${targetUrl}`);
      try {
        const response = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        if (!response.ok) {
          console.warn(`  --> Fetch page failed: status ${response.status}`);
          continue;
        }

        const html = await response.text();
        const imgMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) || 
                         html.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"/i);

        if (imgMatch && imgMatch[1]) {
          const imageUrl = imgMatch[1];
          console.log(`  --> Extracted Image: ${imageUrl}`);

          const { error: updateErr } = await supabase
            .from('products')
            .update({
              images: [imageUrl],
              thumbnail_url: imageUrl
            })
            .eq('id', product.id);

          if (updateErr) {
            console.error(`  --> Update database failed: ${updateErr.message}`);
          } else {
            console.log(`  --> Success! Synced in DB.`);
          }
        } else {
          console.warn(`  --> Meta image not found on page.`);
        }
      } catch (e) {
        console.error(`  --> Request error: ${e.message}`);
      }
    } else {
      console.warn(`  --> No close match found in sitemap.`);
    }

    // Be polite
    await sleep(200);
  }

  console.log("\n🎉 Sitemap mapping completed!");
}

run();
