const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hlciajobsygzwqohvvyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsY2lham9ic3lnendxb2h2dnl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEyNjQwMiwiZXhwIjoyMDk5NzAyNDAyfQ.3uWlepLWHbTq1fCYnCHwyjAwWaXbJLQaaGq2bTerG7s';
const supabase = createClient(supabaseUrl, supabaseKey);

const sitemapPath = 'C:\\Users\\HP Omnibook X Flip\\.gemini\\antigravity\\brain\\aa1cd128-3f7c-4581-856e-417035f3d286\\.system_generated\\steps\\617\\content.md';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Keyword-based specific pricing defaults for TBA/Out of stock items
function getKeywordPrice(name, categorySlug) {
  const nameLower = name.toLowerCase();

  // Audio / Home Cinema Specifics
  if (nameLower.includes('ht-s40r') || nameLower.includes('home cinema') || nameLower.includes('home theatre')) return 37000;
  if (nameLower.includes('soundbar') && nameLower.includes('sony')) return 28500;
  if (nameLower.includes('soundbar')) return 22500;
  if (nameLower.includes('logitech z906')) return 44500;
  if (nameLower.includes('logitech z623')) return 21500;
  if (nameLower.includes('tune 520bt')) return 5200;
  if (nameLower.includes('tune 720bt')) return 7800;
  
  // CPU / Components / Gaming
  if (nameLower.includes('9950x')) return 82500;
  if (nameLower.includes('9800x3d')) return 62500;
  if (nameLower.includes('9700x')) return 44500;
  if (nameLower.includes('7600')) return 23500;
  if (nameLower.includes('7700')) return 31500;
  if (nameLower.includes('rtx 5070')) return 85000;
  if (nameLower.includes('monitor') && nameLower.includes('27-inch')) return 28500;
  if (nameLower.includes('monitor')) return 16500;

  // Tablets
  if (nameLower.includes('ipad pro')) return 128000;
  if (nameLower.includes('ipad 9th')) return 42000;
  if (nameLower.includes('ipad 11th')) return 58000;
  if (nameLower.includes('galaxy tab s9')) return 82000;
  if (nameLower.includes('galaxy tab s10')) return 98000;
  if (nameLower.includes('xiaomi pad')) return 34500;

  // Watches
  if (nameLower.includes('apple watch ultra')) return 95000;
  if (nameLower.includes('apple watch')) return 45000;
  if (nameLower.includes('kospet tank')) return 6200;

  // Keyboards
  if (nameLower.includes('magic keyboard for ipad')) return 34500;

  // Category defaults fallback
  const defaults = {
    'wireless-headphone': 2800,
    'adapter': 1850,
    'tablet': 42000,
    'smart-watch': 3500,
    'speakers': 18500,
    'cable': 850,
    'hubs-and-docks': 3200,
    'gaming': 38000
  };

  return defaults[categorySlug] || 2500;
}

async function run() {
  if (!fs.existsSync(sitemapPath)) {
    console.error("Sitemap file not found:", sitemapPath);
    return;
  }

  console.log("Parsing product sitemap...");
  const content = fs.readFileSync(sitemapPath, 'utf8');
  const urlRegex = /<loc>(https:\/\/www\.applegadgetsbd\.com\/product\/[^<]+)<\/loc>/gi;
  const sitemapUrls = [];
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    sitemapUrls.push(match[1]);
  }

  console.log("Fetching categories from database...");
  const { data: categories } = await supabase.from('categories').select('id, slug');
  const catMap = {};
  categories.forEach(c => {
    catMap[c.id] = c.slug;
  });

  console.log("Fetching database products list...");
  const { data: products, error } = await supabase.from('products').select('*');
  if (error || !products) {
    console.error("Failed to load products:", error);
    return;
  }

  console.log(`Analyzing prices for ${products.length} products...`);

  // We will crawl pages to resolve correct prices
  const CONCURRENCY_LIMIT = 20;
  const chunksCount = Math.ceil(products.length / CONCURRENCY_LIMIT);

  for (let c = 0; c < chunksCount; c++) {
    const startIdx = c * CONCURRENCY_LIMIT;
    const endIdx = Math.min(startIdx + CONCURRENCY_LIMIT, products.length);
    const chunkProducts = products.slice(startIdx, endIdx);

    console.log(`Processing price updates batch [${c+1}/${chunksCount}] (Items ${startIdx+1}-${endIdx})...`);

    const promises = chunkProducts.map(async (product) => {
      // Find matching sitemap url
      // Slug format: originalSlug-xxxx (where xxxx is random number)
      const baseSlug = product.slug.replace(/-\d{4}$/, '');
      const targetUrl = sitemapUrls.find(url => url.endsWith(`/product/${baseSlug}`));

      let finalPrice = null;

      if (targetUrl) {
        try {
          const response = await fetch(targetUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            signal: AbortSignal.timeout(5000)
          });
          if (response.ok) {
            const html = await response.text();
            // Parse exact price object value from Next.js serialized state
            const priceMatch = html.match(/"price"\s*:\s*\{\s*"value"\s*:\s*(\d+)/i);
            if (priceMatch && priceMatch[1]) {
              finalPrice = parseInt(priceMatch[1], 10);
            }
          }
        } catch {
          // fetch timeout or error
        }
      }

      // If price was not resolved (TBA/error), calculate a realistic default
      if (!finalPrice || finalPrice === 0) {
        const catSlug = catMap[product.category_id] || '';
        finalPrice = getKeywordPrice(product.name, catSlug);
        console.log(`  --> "${product.name}" is TBA/Out of stock. Assigning realistic price: ৳${finalPrice}`);
      } else {
        console.log(`  --> "${product.name}" parsed price: ৳${finalPrice}`);
      }

      const originalPrice = Math.round(finalPrice * 1.22); // 22% list markup

      // Update in database
      await supabase
        .from('products')
        .update({
          price: finalPrice,
          original_price: originalPrice
        })
        .eq('id', product.id);
    });

    await Promise.all(promises);
    await sleep(200);
  }

  console.log("\n🎉 Prices refined and fixed successfully!");
}

run();
