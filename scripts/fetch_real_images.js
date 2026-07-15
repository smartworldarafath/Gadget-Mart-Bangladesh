const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hlciajobsygzwqohvvyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsY2lham9ic3lnendxb2h2dnl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEyNjQwMiwiZXhwIjoyMDk5NzAyNDAyfQ.3uWlepLWHbTq1fCYnCHwyjAwWaXbJLQaaGq2bTerG7s';

const supabase = createClient(supabaseUrl, supabaseKey);

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeImages() {
  console.log("Fetching products list from Supabase...");
  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, name')
    .order('created_at', { ascending: true });

  if (error || !products) {
    console.error("Failed to load products from database:", error?.message);
    return;
  }

  console.log(`Found ${products.length} products to update.`);

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    // Strip serial index from the end to get original slug
    const baseSlug = product.slug.replace(/-\d+$/, '');
    const url = `https://www.applegadgetsbd.com/product/${baseSlug}`;

    console.log(`[${i+1}/${products.length}] Fetching image for: ${product.name} (${baseSlug})...`);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`  --> Failed to fetch page. HTTP status: ${response.status}`);
        await sleep(100);
        continue;
      }

      const html = await response.text();
      // Match meta tag for og:image
      const match = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) || 
                    html.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"/i);

      if (match && match[1]) {
        let imageUrl = match[1];
        // Clean URL if it's relative
        if (imageUrl.startsWith('/')) {
          imageUrl = `https://www.applegadgetsbd.com${imageUrl}`;
        }

        console.log(`  --> Found Image URL: ${imageUrl}`);

        // Update database row
        const { error: updateErr } = await supabase
          .from('products')
          .update({
            images: [imageUrl],
            thumbnail_url: imageUrl
          })
          .eq('id', product.id);

        if (updateErr) {
          console.error(`  --> Failed to updates database row: ${updateErr.message}`);
        } else {
          console.log(`  --> Success! Database updated.`);
        }
      } else {
        console.warn("  --> No og:image meta tag found on page.");
      }
    } catch (e) {
      console.error(`  --> Network error: ${e.message}`);
    }

    // Be polite and avoid rate limits
    await sleep(200);
  }

  console.log("🎉 Scrape process complete!");
}

scrapeImages();
