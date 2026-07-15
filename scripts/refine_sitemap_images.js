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

  console.log("Parsing sitemap...");
  const content = fs.readFileSync(sitemapPath, 'utf8');
  const urlRegex = /<loc>(https:\/\/www\.applegadgetsbd\.com\/product\/[^<]+)<\/loc>/gi;
  const sitemapUrls = [];
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    sitemapUrls.push(match[1]);
  }
  
  console.log(`Parsed ${sitemapUrls.length} product URLs.`);

  console.log("Loading categories from DB...");
  const { data: categories } = await supabase.from('categories').select('id, name, slug');
  const catMap = {};
  categories.forEach(c => {
    catMap[c.id] = c.slug;
  });

  console.log("Fetching database products...");
  const { data: products, error } = await supabase.from('products').select('*');
  if (error || !products) {
    console.error("Failed to load products:", error);
    return;
  }

  console.log(`Matching and refining ${products.length} products...`);

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const categorySlug = catMap[product.category_id] || '';
    
    const nameLower = product.name.toLowerCase();
    const words = nameLower
      .replace(/tws|wireless|earbuds|earphones|bluetooth|charger|adapter|wall|power|delivery|fast|port|station/g, '')
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 1);

    const brand = words[0]; // e.g. "qcy"
    const model = words[1] || ''; // e.g. "t13"

    // 1. Filter URLs by category type to avoid mismatches (e.g. no cables/powerbanks for earbuds)
    let filteredUrls = sitemapUrls;
    if (categorySlug === 'wireless-headphone') {
      const audioKeywords = ['earbuds', 'headphone', 'earphone', 'buds', 'pods', 'wireless', 'sound', 'tws', 'airpods', 'audio', 'stereo'];
      filteredUrls = sitemapUrls.filter(url => {
        const urlLower = url.toLowerCase();
        return audioKeywords.some(keyword => urlLower.includes(keyword));
      });
    } else if (categorySlug === 'adapter') {
      const chargerKeywords = ['charger', 'adapter', 'power', 'gan', 'charging', 'strip', 'port', 'wall', 'station', 'super-si', 'trio', 'desktop'];
      filteredUrls = sitemapUrls.filter(url => {
        const urlLower = url.toLowerCase();
        return chargerKeywords.some(keyword => urlLower.includes(keyword));
      });
    }

    // 2. Match based on brand + model first
    let matchedUrls = filteredUrls.filter(url => {
      const urlLower = url.toLowerCase();
      if (brand && model) {
        return urlLower.includes(brand) && urlLower.includes(model);
      }
      return brand && urlLower.includes(brand);
    });

    // 3. Fallback to brand match in the filtered list
    if (matchedUrls.length === 0 && brand) {
      matchedUrls = filteredUrls.filter(url => url.toLowerCase().includes(brand));
    }

    let targetUrl = null;
    if (matchedUrls.length > 0) {
      // Sort by similarity score
      matchedUrls.sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        let aScore = 0;
        let bScore = 0;
        words.forEach(w => {
          if (aLower.includes(w)) aScore++;
          if (bLower.includes(w)) bScore++;
        });
        return bScore - aScore;
      });
      targetUrl = matchedUrls[0];
    }

    if (targetUrl) {
      console.log(`[${i+1}/${products.length}] "${product.name}" matched: ${targetUrl}`);
      try {
        const response = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        if (!response.ok) continue;

        const html = await response.text();
        const imgMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);

        if (imgMatch && imgMatch[1]) {
          const imageUrl = imgMatch[1];
          await supabase
            .from('products')
            .update({
              images: [imageUrl],
              thumbnail_url: imageUrl
            })
            .eq('id', product.id);
          console.log(`  --> Updated with: ${imageUrl}`);
        }
      } catch (e) {
        console.error(`  --> Error fetching: ${e.message}`);
      }
    } else {
      console.warn(`[${i+1}/${products.length}] No match for: "${product.name}"`);
    }

    await sleep(150);
  }

  console.log("🎉 All product images refined successfully!");
}

run();
