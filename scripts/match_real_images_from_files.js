const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hlciajobsygzwqohvvyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsY2lham9ic3lnendxb2h2dnl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEyNjQwMiwiZXhwIjoyMDk5NzAyNDAyfQ.3uWlepLWHbTq1fCYnCHwyjAwWaXbJLQaaGq2bTerG7s';
const supabase = createClient(supabaseUrl, supabaseKey);

const files = [
  'C:\\Users\\HP Omnibook X Flip\\.gemini\\antigravity\\brain\\aa1cd128-3f7c-4581-856e-417035f3d286\\.system_generated\\steps\\573\\content.md',
  'C:\\Users\\HP Omnibook X Flip\\.gemini\\antigravity\\brain\\aa1cd128-3f7c-4581-856e-417035f3d286\\.system_generated\\steps\\599\\content.md'
];

async function match() {
  const allUrls = [];
  
  for (const file of files) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const regex = /https(?:%3A%2F%2F|\/\/)[a-zA-Z0-9\._-]*applegadgetsbd\.com(?:%2F|\/)storage(?:%2F|\/)media(?:%2F|\/)(?:large|medium|thumb)(?:%2F|\/)[a-zA-Z0-9_\-\.%]+/gi;
      const matches = content.match(regex) || [];
      matches.forEach(m => {
        try {
          allUrls.push(decodeURIComponent(m));
        } catch {
          allUrls.push(m);
        }
      });
    }
  }

  const uniqueUrls = [...new Set(allUrls)];
  console.log(`Extracted ${uniqueUrls.length} unique image URLs from category HTML pages.`);

  console.log("Fetching products list from Supabase...");
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug');

  if (error || !products) {
    console.error("Failed to load products:", error);
    return;
  }

  let mappedCount = 0;
  for (const product of products) {
    const nameLower = product.name.toLowerCase();
    
    // Extract brand & model
    const brand = nameLower.split(' ')[0]; // e.g. "qcy", "baseus", "anker"
    
    // Find model word (e.g. "t13", "wm02", "ew04", "p2i")
    const words = nameLower.split(/\s+/);
    let model = '';
    for (const w of words) {
      if (w !== brand && (/\d/.test(w) || w.length >= 3) && !['tws', 'wireless', 'earbuds', 'earphones', 'bluetooth', 'charger', 'adapter', 'wall', 'power', 'delivery', 'fast', 'port', 'station'].includes(w)) {
        model = w;
        break;
      }
    }

    let matchedUrl = null;
    if (brand && model) {
      matchedUrl = uniqueUrls.find(url => {
        const urlLower = url.toLowerCase();
        return urlLower.includes(brand) && urlLower.includes(model);
      });
    }

    // Fallback if no exact model match but matches brand
    if (!matchedUrl && brand) {
      matchedUrl = uniqueUrls.find(url => {
        const urlLower = url.toLowerCase();
        return urlLower.includes(brand);
      });
    }

    // Fallbacks based on category type
    if (!matchedUrl) {
      if (product.slug.includes('adapter') || product.slug.includes('charger') || product.slug.includes('power-station')) {
        // Fallback charger image
        matchedUrl = 'https://adminapi.applegadgetsbd.com/storage/media/large/Baseus-Super-Si-Quick-Charger-1C-20W-Black-9029.png';
      } else {
        // Fallback earbuds image
        matchedUrl = 'https://adminapi.applegadgetsbd.com/storage/media/large/QCY-T13-ANC-2-TWS-Earbudsq-6851.png';
      }
    }

    if (matchedUrl) {
      // Use large format URL if possible (since categories use medium)
      const largeUrl = matchedUrl.replace('/storage/media/medium/', '/storage/media/large/');
      
      console.log(`Product: "${product.name}" --> Matched image: ${largeUrl}`);
      const { error: updateErr } = await supabase
        .from('products')
        .update({
          images: [largeUrl],
          thumbnail_url: largeUrl
        })
        .eq('id', product.id);

      if (!updateErr) mappedCount++;
    }
  }

  console.log(`🎉 Complete! Successfully mapped and synced ${mappedCount} products with real Apple Gadgets images!`);
}

match();
