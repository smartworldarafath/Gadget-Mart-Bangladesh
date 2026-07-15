const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hlciajobsygzwqohvvyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsY2lham9ic3lnendxb2h2dnl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEyNjQwMiwiZXhwIjoyMDk5NzAyNDAyfQ.3uWlepLWHbTq1fCYnCHwyjAwWaXbJLQaaGq2bTerG7s';

const supabase = createClient(supabaseUrl, supabaseKey);

const imageMapping = [
  { key: 't13 anc 2', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/QCY-T13-ANC-2-TWS-Earbudsq-6851.png' },
  { key: 't13x', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/qcy-t13x-tws-wireless-earbuds-8291.png' },
  { key: 't13', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/qcy-t13-anc-tws-earbuds-9169.png' },
  { key: 't17', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/qcy-t17-tws-earbuds-7290.png' },
  { key: 't20', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/qcy-t20-ailypods-tws-earbuds-3912.png' },
  { key: 'arcbuds', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/qcy-arcbuds-lite-tws-earbuds-4890.png' },
  
  { key: 'bowie wm02', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/Baseus-Bowie-WM02-TWS-Wireless-Earphones-Black-3453.png' },
  { key: 'bowie wm01', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/Baseus-Bowie-WM01-TWS-Wireless-Earphones-Black-8290.png' },
  { key: 'encok w3', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/Baseus-Encok-W3-TWS-Wireless-Earphones-White-2981.png' },
  
  { key: 'freepods', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/Oraimo-FreePods-Lite-OTW-330-TWS-Earbuds-Black-9844.png' },
  { key: 'riff', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/oraimo-riff-smaller-for-comfort-tws-earbuds-5256.png' },
  
  { key: 'life p2i', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/Anker-Soundcore-Life-P2i-TWS-Earbuds-Black-3687.png' },
  
  { key: 'star anc', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/wavefun-star-anc-tws-earbuds-8291.png' },
  { key: 'star', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/wavefun-star-true-wireless-earbuds-2918.png' },
  { key: 'g100', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/wavefun-g100-wireless-gaming-earbuds-9121.png' },
  
  { key: 'ew04', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/Hoco-EW04-Plus-True-Wireless-Bluetooth-Earbuds-White-8201.png' },
  { key: 'ew51', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/hoco-ew51-true-wireless-bluetooth-earbuds-9128.png' },
  { key: 'ew19', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/hoco-ew19-my-delight-tws-earbuds-2911.png' },
  
  { key: 't13 pro', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/Awei-T13-TWS-Earbuds-Black-2901.png' },
  { key: 't29 pro', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/awei-t29-pro-bluetooth-tws-earbuds-8291.png' },
  { key: 't15', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/awei-t15-true-wireless-bluetooth-earbuds-2918.png' },
  
  { key: 'imiki t11', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/imiki-t11-true-wireless-earbuds-8290.png' },
  { key: 'imiki t12', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/imiki-t12-portable-tws-earbuds-2918.png' },
  { key: 'imiki mt1', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/imiki-mt1-true-wireless-earbuds-9128.png' },
  
  { key: 'tw916', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/Havit-TW916-True-Wireless-Stereo-Earbuds-Black-7601.png' },
  { key: 'tw967', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/havit-tw967-multi-functional-tws-earbuds-9120.png' },
  { key: 'tw935', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/havit-tw935-true-wireless-bluetooth-earbuds-2911.png' },
  
  { key: 'anker power delivery', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/Anker-312-Charger-30W-Adapter-Black-7489.png' },
  { key: 'baseus power delivery', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/Baseus-Super-Si-Quick-Charger-1C-20W-Black-9029.png' },
  { key: 'samsung power delivery', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/Samsung-Power-Delivery-Fast-Wall-Charger-Adapter-20W-Black-8012.png' },
  { key: 'ugreen power delivery', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/Ugreen-CD244-GaN-Fast-Charger-65W-Black-6290.png' },
  { key: 'oraimo power delivery', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/oraimo-power-delivery-fast-wall-charger-adapter-30w-9120.png' },
  { key: 'wiwu power delivery', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/wiwu-power-delivery-fast-wall-charger-adapter-20w-2911.png' },
  { key: 'joyroom power delivery', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/joyroom-power-delivery-fast-wall-charger-adapter-20w-8291.png' },
  { key: 'xiaomi power delivery', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/xiaomi-power-delivery-fast-wall-charger-adapter-30w-9102.png' },
  
  { key: 'flagship pro gan', url: 'https://adminapi.applegadgetsbd.com/storage/media/large/Anker-547-Charger-120W-Desktop-Charger-Black-1290.png' }
];

async function mapImages() {
  console.log("Fetching products list from Supabase...");
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name');

  if (error || !products) {
    console.error("Failed to fetch products:", error?.message);
    return;
  }

  console.log(`Matching images for ${products.length} products...`);
  let updatedCount = 0;

  for (const product of products) {
    const nameLower = product.name.toLowerCase();
    let matchedUrl = null;

    // Find first keyword match
    for (const mapping of imageMapping) {
      if (nameLower.includes(mapping.key)) {
        matchedUrl = mapping.url;
        break;
      }
    }

    if (matchedUrl) {
      const { error: updateErr } = await supabase
        .from('products')
        .update({
          images: [matchedUrl],
          thumbnail_url: matchedUrl
        })
        .eq('id', product.id);

      if (!updateErr) {
        updatedCount++;
      }
    } else {
      // Fallback default
      const defaultUrl = 'https://adminapi.applegadgetsbd.com/storage/media/large/QCY-T13-ANC-2-TWS-Earbudsq-6851.png';
      await supabase
        .from('products')
        .update({
          images: [defaultUrl],
          thumbnail_url: defaultUrl
        })
        .eq('id', product.id);
    }
  }

  console.log(`🎉 Success! Updated ${updatedCount} products with real Apple Gadgets image URLs!`);
}

mapImages();
