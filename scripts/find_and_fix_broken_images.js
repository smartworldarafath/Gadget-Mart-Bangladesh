const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hlciajobsygzwqohvvyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsY2lham9ic3lnendxb2h2dnl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEyNjQwMiwiZXhwIjoyMDk5NzAyNDAyfQ.3uWlepLWHbTq1fCYnCHwyjAwWaXbJLQaaGq2bTerG7s';
const supabase = createClient(supabaseUrl, supabaseKey);

// A list of verified, working high-quality product images for category fallbacks
const categoryImageFallbacks = {
  'wireless-headphone': 'https://adminapi.applegadgetsbd.com/storage/media/large/QCY-T13-ANC-2-TWS-Earbudsq-6851.png',
  'adapter': 'https://adminapi.applegadgetsbd.com/storage/media/large/Samsung-65W-Power-Adapter-Trio-e-3-Pin-5673.jpg',
  'tablet': 'https://adminapi.applegadgetsbd.com/storage/media/large/iPad-10th-Gen-Blue-4742.jpg',
  'smart-watch': 'https://adminapi.applegadgetsbd.com/storage/media/large/Hoco-EW51-ANC-True-Wireless-Bluetooth-Earbuds-8481.png',
  'speakers': 'https://adminapi.applegadgetsbd.com/storage/media/large/Havit-IPC20-2MP-Portable-WiFi-Camera-With-Built-in-Audio-3924.png',
  'cable': 'https://adminapi.applegadgetsbd.com/storage/media/large/4022-95026.jpg',
  'hubs-and-docks': 'https://adminapi.applegadgetsbd.com/storage/media/large/WiWU-Wi-W040-8-in-1-GaN-Desktop-Power-Station-%E2%80%93-65W-6229.png',
  'gaming': 'https://adminapi.applegadgetsbd.com/storage/media/large/Anker-Zolo-140W-4-Port-Multi-Device-Charging-GaN-Power-Adapter-With-Type-C-Cableaaa-6065.png'
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log("Fetching categories...");
  const { data: categories } = await supabase.from('categories').select('id, slug');
  const catMap = {};
  categories.forEach(c => {
    catMap[c.id] = c.slug;
  });

  console.log("Fetching all products...");
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, thumbnail_url, images, category_id');

  if (error || !products) {
    console.error("Failed to load products:", error);
    return;
  }

  console.log(`Verifying image links for ${products.length} products...`);

  const CONCURRENCY_LIMIT = 30;
  const chunkCount = Math.ceil(products.length / CONCURRENCY_LIMIT);
  let brokenCount = 0;

  for (let c = 0; c < chunkCount; c++) {
    const startIdx = c * CONCURRENCY_LIMIT;
    const endIdx = Math.min(startIdx + CONCURRENCY_LIMIT, products.length);
    const chunk = products.slice(startIdx, endIdx);

    console.log(`Checking batch [${c+1}/${chunkCount}] (Items ${startIdx+1}-${endIdx})...`);

    const promises = chunk.map(async (product) => {
      let isBroken = false;
      const imgUrl = product.thumbnail_url;

      // 1. Check if URL is obviously invalid
      if (!imgUrl || imgUrl === '/placeholder.jpg' || imgUrl.includes('placeholder')) {
        isBroken = true;
      } else {
        // 2. Perform a HEAD request to check if image is 404
        try {
          const res = await fetch(imgUrl, {
            method: 'HEAD',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            signal: AbortSignal.timeout(3000)
          });
          if (res.status === 404 || res.status >= 500) {
            isBroken = true;
          }
        } catch {
          // If network error or timeout, treat it as broken/inaccessible
          isBroken = true;
        }
      }

      if (isBroken) {
        brokenCount++;
        const catSlug = catMap[product.category_id] || 'wireless-headphone';
        const fallback = categoryImageFallbacks[catSlug] || categoryImageFallbacks['wireless-headphone'];
        
        console.log(`  --> Broken image detected for "${product.name}": ${imgUrl}. Fixing with: ${fallback}`);

        // Update database with working fallback
        await supabase
          .from('products')
          .update({
            thumbnail_url: fallback,
            images: [fallback]
          })
          .eq('id', product.id);
      }
    });

    await Promise.all(promises);
    await sleep(150);
  }

  console.log(`\n🎉 Verification complete! Detected and fixed ${brokenCount} broken product image links.`);
}

run();
