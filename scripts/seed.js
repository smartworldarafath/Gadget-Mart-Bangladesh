const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hlciajobsygzwqohvvyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsY2lham9ic3lnendxb2h2dnl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEyNjQwMiwiZXhwIjoyMDk5NzAyNDAyfQ.3uWlepLWHbTq1fCYnCHwyjAwWaXbJLQaaGq2bTerG7s';

const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
  { name: 'Mobile Phone', slug: 'mobile-phone', icon_url: '📱', is_featured: true, display_order: 1 },
  { name: 'Laptop', slug: 'laptop', icon_url: '💻', is_featured: true, display_order: 2 },
  { name: 'Tablet & Accessories', slug: 'tablet', icon_url: '📟', is_featured: true, display_order: 3 },
  { name: 'Smart Watch', slug: 'smart-watch', icon_url: '⌚', is_featured: true, display_order: 4 },
  { name: 'Headphone', slug: 'headphone', icon_url: '🎧', is_featured: true, display_order: 5 },
  { name: 'AirPods', slug: 'airpods', icon_url: '🎵', is_featured: true, display_order: 6 },
  { name: 'Wireless Headphone', slug: 'wireless-headphone', icon_url: '🎶', is_featured: true, display_order: 7 },
  { name: 'Speakers', slug: 'speakers', icon_url: '🔊', is_featured: true, display_order: 8 },
  { name: 'Home Appliances', slug: 'home-appliances', icon_url: '🏠', is_featured: true, display_order: 9 },
  { name: 'Adapter', slug: 'adapter', icon_url: '🔌', is_featured: true, display_order: 10 },
  { name: 'Cables', slug: 'cable', icon_url: '🔗', is_featured: true, display_order: 11 },
  { name: 'Hubs & Docks', slug: 'hubs-and-docks', icon_url: '🔄', is_featured: true, display_order: 12 },
  { name: 'Wireless Charger', slug: 'wireless-charger', icon_url: '⚡', is_featured: true, display_order: 13 },
  { name: 'Smart Pen', slug: 'smart-pen', icon_url: '✏️', is_featured: true, display_order: 14 },
  { name: 'Gaming', slug: 'gaming', icon_url: '🎮', is_featured: false, display_order: 15 },
  { name: 'Camera', slug: 'camera', icon_url: '📷', is_featured: false, display_order: 16 }
];

const productsData = [];

// Helper to generate slug
function getSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// 1. Bluetooth TWS Earbuds Group (SL 1 - 30)
const earbuds = [
  { sl: 1, name: "QCY T13 TWS Earbuds", brand: "QCY", price: 1350, warranty: "1 Year Official Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.1", "Microphone": "4 Mics with ENC Calling Noise Reduction", "Battery / Playtime": "8 Hours continuous playback (Total 40 Hours with case)", "Charging Port": "Type-C Fast Charging", "Driver Unit": "7.2mm Dynamic Driver" } },
  { sl: 2, name: "QCY T13X TWS Wireless Earbuds", brand: "QCY", price: 1500, warranty: "1 Year Official Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.3", "Microphone": "4 Mics with Wind Noise Cancellation", "Battery / Playtime": "8 Hours single playback (Total 30 Hours with case)", "Low Latency": "60ms Gaming Mode", "Driver Unit": "7.2mm Dynamic Driver" } },
  { sl: 3, name: "QCY T13 ANC 2 TWS Earbuds", brand: "QCY", price: 1750, warranty: "1 Year Official Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.3", "Active Noise Cancellation": "ANC up to 28dB Noise Reduction depth", "Microphone": "4 Mics with AI Call Noise Reduction", "Playback Time": "7 Hours (ANC On) / Total 30 Hours with case", "Low Latency": "68ms Game Mode", "Driver Unit": "10mm Dynamic Bio-diaphragm driver" } },
  { sl: 4, name: "QCY ArcBuds Lite TWS Earbuds", brand: "QCY", price: 1300, warranty: "1 Year Official Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.3", "Microphone": "ENC HD Calling Mic", "Playback Time": "8 Hours playback (Total 32 Hours with case)", "Low Latency": "68ms Low Latency Mode", "Driver Unit": "6mm Dynamic Driver" } },
  { sl: 5, name: "QCY T17 TWS Wireless Earbuds", brand: "QCY", price: 1200, warranty: "1 Year Official Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.1", "Microphone": "ENC Clear Calling Microphone", "Playback Time": "7.5 Hours (Total 26 Hours with case)", "Driver Unit": "6.2mm Dynamic Driver" } },
  { sl: 6, name: "QCY T20 AilyPods TWS Earbuds", brand: "QCY", price: 1600, warranty: "1 Year Official Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.3", "Microphone": "Dual Mics with ENC Technology", "Playback Time": "5.5 Hours playback (Total 20 Hours with case)", "Waterproof Rating": "IPX4 Rated", "Driver Unit": "13mm Space Diaphragm Driver" } },
  { sl: 7, name: "Wavefun Star True Wireless Earbuds", brand: "Wavefun", price: 1190, warranty: "6 Months Brand Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.2", "Microphone": "Dual-Mic ENC Voice Optimization", "Playback Time": "4 Hours single playback (Total 30 Hours with case)", "Driver Unit": "10mm Bass Boosted Moving Coil" } },
  { sl: 8, name: "Wavefun G100 Wireless Gaming Earbuds", brand: "Wavefun", price: 1550, warranty: "6 Months Brand Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.1", "Microphone": "Omnidirectional High-Gain Microphone", "Playback Time": "4 Hours continuous use (Total 20 Hours gaming loop)", "Low Latency": "45ms Super Ultra-Low Latency Mode", "Driver Unit": "9mm Titanium Plated Core Driver" } },
  { sl: 9, name: "Wavefun Star ANC TWS Earbuds", brand: "Wavefun", price: 1450, warranty: "6 Months Brand Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.3", "Noise Cancellation": "ANC up to 30dB Attenuation depth", "Playback Time": "5 Hours (ANC On) / Total 25 Hours with case", "Driver Unit": "10mm Dynamic Moving Coil driver" } },
  { sl: 10, name: "Hoco EW04 Plus True Wireless Earbuds", brand: "Hoco", price: 1050, warranty: "No Official Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.1 Core Protocol", "Microphone": "Integrated High-Sensitivity Calling Mic", "Playback Time": "4 Hours continuous talk/music time", "Smart Interface": "Auto Pop-up Window Connection support", "Driver Unit": "13mm Moving Coil Driver" } },
  { sl: 11, name: "Hoco EW51 True Wireless Bluetooth Earbuds", brand: "Hoco", price: 1390, warranty: "1 Month Retail Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.3", "Control Layout": "Shaft Touch Swipe Volume Control panel", "Playback Time": "5 Hours playback (Total 20 Hours with box pool)", "Special Feature": "Wireless Qi Charging case compatibility", "Driver Unit": "10mm High-Fidelity Array Driver" } },
  { sl: 12, name: "Hoco EW19 My Delight TWS Earbuds", brand: "Hoco", price: 950, warranty: "1 Month Retail Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.3 Core Architecture", "Playback Time": "4 Hours unit playback (Total 20 Hours case pool)", "Driver Unit": "8mm Dynamic Moving Coil Core" } },
  { sl: 13, name: "Awei T13 Pro True Wireless Earbuds", brand: "Awei", price: 1150, warranty: "6 Months Official Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.1 Audio Chip", "Playback Time": "6 Hours playback cycle (Total 24 Hours system pool)", "Power Display": "Digital LED Case Power Gauge", "Waterproof Rating": "IPX6 Heavy Sweat & Rain Proof sealing" } },
  { sl: 14, name: "Awei T29 Pro Bluetooth TWS Earbuds", brand: "Awei", price: 1290, warranty: "6 Months Official Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.1 Core Node", "Playback Time": "5 Hours continuous runtime (Total 21 Hours combined life)", "Visual Elements": "Dynamic Breathing RGB Gaming Case Lights", "Driver Unit": "10mm Vocal Tuning Elements Driver" } },
  { sl: 15, name: "Awei T15 True Wireless Bluetooth Earbuds", brand: "Awei", price: 990, warranty: "6 Months Official Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.0 Core Protocol", "Playback Time": "4 Hours runtime (Total 16 Hours with storage box)", "Driver Unit": "6mm Lossless Codec Driver Unit" } },
  { sl: 16, name: "Imiki T11 True Wireless Earbuds", brand: "Imiki", price: 1450, warranty: "1 Year Brand Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.2 Silicon Core", "Microphone": "Dual-Mic Hardware ENC Clear Reduction", "Playback Time": "5 Hours continuous play (Total 25 Hours system pool)", "Driver Unit": "13mm Wide-Soundstage Moving Coil Driver" } },
  { sl: 17, name: "Imiki T12 Portable TWS Earbuds", brand: "Imiki", price: 1290, warranty: "1 Year Brand Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.3 Low Energy Chip", "Playback Time": "6 Hours single charge runtime (Total 24 Hours matrix run)", "Power Display": "Smart LED Numeric Percentage Battery Display", "Driver Unit": "10mm Balanced High-Mids Driver" } },
  { sl: 18, name: "Imiki MT1 True Wireless Earbuds", brand: "Imiki", price: 1590, warranty: "1 Year Brand Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.3 Ultra Stable Protocol", "Playback Time": "4.5 Hours continuous usage (Total 18 Hours case pool)", "Special Casing": "Premium Retractable Mechanical Sliding Casing Layout", "Driver Unit": "10mm High Fidelity Rich Acoustics Unit" } },
  { sl: 19, name: "Baseus Bowie WM01 TWS Wireless Earphones", brand: "Baseus", price: 1250, warranty: "6 Months Official Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.0 High Stability Link", "Playback Time": "5 Hours bud runtime (Total 25 Hours massive case reservoir)", "Charging Interface": "Type-C High Speed Port Input", "Form Layout": "In-Ear Bean-Shaped Snug Silhouette Layout" } },
  { sl: 20, name: "Baseus Bowie WM02 True Wireless Earbuds", brand: "Baseus", price: 1550, warranty: "6 Months Official Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.3 Upgraded Core", "Playback Time": "5 Hours music playtime (Total 22 Hours capsule vault reserve)", "Flash Charge": "Baseus Rapid Charging Tech (10 Mins Charge = 2 Hours Play)", "Total Net Weight": "3.8g Miniature Light Footprint Everyday Tech Carry" } },
  { sl: 21, name: "Baseus Encok W3 True Wireless Earphones", brand: "Baseus", price: 1390, warranty: "6 Months Official Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.0 Core Protocol", "Microphone Tech": "MEMS Microphones for Clear Voice Isolation Engine", "Playback Time": "4 Hours single usage (Total 18 Hours combined pool reserve)", "Driver Unit": "10mm Moving Coil Premium Sound Unit Engine" } },
  { sl: 22, name: "Foneng BL109 Wireless TWS Earbuds", brand: "Foneng", price: 890, warranty: "No Official Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.1 Wireless Distance Core", "Playback Time": "4 Hours single continuous playback operation", "Control Interface": "One-Touch Sensor for Calls & Audio Media Tracks", "Total Net Weight": "Sub-3.8g Featherweight Comfort Molded Shell Profile" } },
  { sl: 23, name: "Foneng BL122 True Wireless Earbuds", brand: "Foneng", price: 1090, warranty: "3 Months Retail Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.1 Auto Connect Engine", "Playback Time": "4.5 Hours track run operation (Total 18 Hours with base)", "Visual Design": "Sleek Mirror Gloss Premium Reflective Finishing Case" } },
  { sl: 24, name: "Havit TW916 True Wireless Stereo Earbuds", brand: "Havit", price: 990, warranty: "6 Months Brand Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.0 Core Node Interface", "Playback Time": "4 Hours music playback loop (Total 16 Hours with travel case)", "Total Net Weight": "3.5g Ergonomically Molded Light Weighted Buds Frame" } },
  { sl: 25, name: "Havit TW967 Multi-functional TWS Earbuds", brand: "Havit", price: 1150, warranty: "6 Months Brand Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.1 Connectivity Range Module", "Playback Time": "5 Hours continuous music streaming run time", "Driver Unit": "10mm Compound Moving Coil Core Driver Matrix" } },
  { sl: 26, name: "Havit TW935 True Wireless Bluetooth Earbuds", brand: "Havit", price: 890, warranty: "6 Months Brand Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.0 Multi-Device Sync Node", "Playback Time": "3.5 Hours continuous operation runtime cycle", "Driver Unit": "8mm Dynamic Moving Coil Sound Projection Core" } },
  { sl: 27, name: "Choetech BH-T01 True Wireless Earbuds", brand: "Choetech", price: 1350, warranty: "1 Year Repair Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.0 Transmission Grid Layout", "Playback Time": "5 Hours music session run (Total 20 Hours vault capacity)", "Weatherproof Seal": "IPX5 Splash & Workout Sweat Protection Sealing class" } },
  { sl: 28, name: "Oraimo FreePods Lite OTW-330 TWS Earbuds", brand: "Oraimo", price: 1390, warranty: "1 Year Official Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.3 Fast Link Core Module", "Playback Time": "Staggering 40 Hours total shared network playtime pool", "Flash Charge": "AniFast Tech Quick Circuits (10 Mins Charge = 120 Mins Play)", "Driver Unit": "Exclusive HavyBass Premium Sound Core Moving Coil Driver" } },
  { sl: 29, name: "Oraimo Riff Smaller For Comfort TWS Earbuds", brand: "Oraimo", price: 1290, warranty: "1 Year Official Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.0 High Stability Link Core", "Playback Time": "4.5 Hours single track stream (Total 18 Hours system pool)", "Form Blueprint": "Ultra-Compact Case & Tiny Ear Ergonomics Contour Layout" } },
  { sl: 30, name: "Anker Soundcore Life P2i TWS Earbuds", brand: "Anker", price: 1750, warranty: "18 Months Official Brand Warranty", specs: { "Connection Type": "Wireless", "Bluetooth Version": "Bluetooth 5.2 Soundcore Engine Module", "Microphone AI": "2-Mic Array Powered by Vocal AI Clear Enhancement", "Playback Time": "8 Hours single operational run (Total 28 Hours with rapid case)", "Driver Unit": "Dual 10mm Oversized High-Fidelity Dynamic Drivers Unit" } }
];

// Helper to add chargers
const chargerBrands = ["Anker", "Baseus", "Oraimo", "Wiwu", "Ugreen", "Joyroom", "Xiaomi", "Samsung"];
for (let i = 31; i <= 50; i++) {
  const brand = chargerBrands[(i - 31) % chargerBrands.length];
  const watts = (i % 2 === 1) ? 30 : 20;
  const price = 1950 + (i - 31) * 35;
  earbuds.push({
    sl: i,
    name: `${brand} Power Delivery Fast Wall Charger Adapter ${watts}W`,
    brand: brand,
    price: price,
    warranty: brand === "Anker" ? "18 Months Official Warranty" : "6 Months Warranty",
    specs: {
      "Power Output Capacity": `${watts}W Max via USB-C Power Delivery`,
      "Input AC Range": "100-240V Multi-Country Adaptive Alternate Current",
      "Safety Protection": "MultiProtect Automated Voltage Spike Intercept Loop",
      "Chassis Box Layout": "Ultra-Compact Lightweight Polycarbonate Block Outline",
      "Interface Port Type": "Single Dedicated High-Speed USB Type-C Outlet Socket Terminal"
    }
  });
}

// Helper to add premium stations (51 to 70)
for (let i = 51; i <= 70; i++) {
  const brand = chargerBrands[(i - 51) % chargerBrands.length];
  const watts = (i % 2 === 1) ? 100 : 65;
  const price = 9740 + (i - 51) * 140;
  earbuds.push({
    sl: i,
    name: `${brand} Flagship Pro GaN Multi-Port Workspace Power Station ${watts}W`,
    brand: brand,
    price: price,
    warranty: brand === "Anker" ? "18 Months Brand Official Warranty" : "1 Year Warranty",
    specs: {
      "Power Output Capacity": `${watts}W Max Output via Advanced Gallium Nitride Architecture`,
      "Port Configurations": "Multi-Port shared system logic: 2x Type-C + 1x USB-A legacy",
      "Smart Balancing Logic": "Intelligent Automatic Dynamic Cross-Port Current Balancing Circuits",
      "Laptop Compatibility": "Fully calibrated to power MacBook Pro, Dell XPS, and Rigs notebooks",
      "Chassis Shell Type": "V0 Grade Flame Retardant Heavy Impact Protective Hard Case Shell"
    }
  });
}

async function seed() {
  console.log("Seeding categories...");
  const { data: catRows, error: catErr } = await supabase.from('categories').upsert(categories, { onConflict: 'slug' }).select();
  
  if (catErr) {
    console.error("Error seeding categories:", catErr);
    return;
  }
  
  console.log(`Successfully seeded ${catRows.length} categories.`);
  
  const catMap = {};
  catRows.forEach(c => {
    catMap[c.slug] = c.id;
  });

  const productsToInsert = earbuds.map((item, idx) => {
    const slug = getSlug(item.name);
    const categorySlug = item.sl <= 30 ? 'wireless-headphone' : 'adapter';
    const category_id = catMap[categorySlug];
    const originalPrice = Math.round(item.price * 1.25); // 25% discount
    
    // Low stock for items ending in 3 or 7
    const stock = (item.sl % 10 === 3 || item.sl % 10 === 7) ? 3 : Math.floor(Math.random() * 30) + 15;
    
    // Add description text
    const desc = `The brand new ${item.name} brings authentic build quality and solid specifications to consumers in Bangladesh. Meticulously optimized to match standard retail parameters, it delivers great performance within a robust frame contour. Purchase the original ${item.name} directly from authorized gadgets showrooms and premium e-commerce outlets across Bangladesh at the best price.`;
    
    // Setup a few tags/promos
    const isFeatured = item.sl % 5 === 0;
    const isExclusive = item.sl % 7 === 0;
    const isBestDeal = item.sl % 6 === 0;
    const isNew = item.sl % 4 === 0;
    const isTopSelling = item.sl % 8 === 0;

    return {
      name: item.name,
      slug: slug,
      description: desc,
      short_description: `Original ${item.name} with ${item.warranty || 'official brand warranty'}.`,
      category_id: category_id,
      price: item.price,
      original_price: originalPrice,
      stock_quantity: stock,
      sku: `${item.brand.substring(0,3).toUpperCase()}-${item.sl}-${Math.round(item.price)}`,
      brand: item.brand,
      model: item.name.replace(item.brand, '').trim(),
      specifications: item.specs,
      images: [
        `/placeholder-product-${item.sl % 5 + 1}.jpg`
      ],
      thumbnail_url: `/placeholder-product-${item.sl % 5 + 1}.jpg`,
      is_featured: isFeatured,
      is_exclusive_deal: isExclusive,
      is_best_deal: isBestDeal,
      is_new_arrival: isNew,
      is_top_selling: isTopSelling,
      is_active: true,
      meta_title: `${item.name} - Gadget Mart Bangladesh`,
      meta_description: `Buy ${item.name} online in Bangladesh. Best price deals, fast delivery & official warranty.`
    };
  });

  // Filter out items with duplicate slugs
  const uniqueProductsToInsert = [];
  const seenSlugs = new Set();
  productsToInsert.forEach(p => {
    if (!seenSlugs.has(p.slug)) {
      seenSlugs.add(p.slug);
      uniqueProductsToInsert.push(p);
    } else {
      console.log(`Skipping duplicate product slug: ${p.slug}`);
    }
  });

  console.log(`Seeding products (${uniqueProductsToInsert.length} unique)...`);
  const { data: prodRows, error: prodErr } = await supabase.from('products').upsert(uniqueProductsToInsert, { onConflict: 'slug' }).select();
  
  if (prodErr) {
    console.error("Error seeding products:", prodErr);
  } else {
    console.log(`Successfully seeded ${prodRows.length} products.`);
  }

  // Also seed default admin into auth table? 
  // No, we cannot seed auth users directly through Postgres unless we insert into auth.users (which is possible with service role key if we write SQL or call auth signup).
  // But wait! We can insert into `customers` table with a fixed UUID when the user signs up, or we can upsert an admin row in `customers` table!
  // Let's create an admin profile inside the `customers` table:
  console.log("Seeding admin customer metadata...");
  // Note: Since auth.users is handled by Supabase Auth, let's create a placeholder admin customer row that can map to the admin user after sign up,
  // or we can write a script to register the user via Auth API and then mark them admin in the customer table.
  const adminEmail = 'admin@gadgetmartbd.com';
  const adminPassword = 'Admin@GMB2025';

  try {
    // Check if admin user already exists in auth
    const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error("Could not list auth users to verify admin:", listError);
    } else {
      const existingAdmin = authUsers.users.find(u => u.email === adminEmail);
      if (existingAdmin) {
        console.log("Admin user already exists in Auth. Ensuring is_admin is true in customers table...");
        const { error: custErr } = await supabase.from('customers').upsert({
          id: existingAdmin.id,
          full_name: 'GMB Admin Panel',
          email: adminEmail,
          phone: '01712345678',
          is_admin: true
        });
        if (custErr) console.error("Error updates customer profile:", custErr);
        else console.log("Admin profile verified in customers table.");
      } else {
        console.log("Creating new admin user in Supabase Auth...");
        const { data: newAdminUser, error: createError } = await supabase.auth.admin.createUser({
          email: adminEmail,
          password: adminPassword,
          email_confirm: true,
          user_metadata: { full_name: 'GMB Admin Panel' }
        });
        if (createError) {
          console.error("Failed to create admin user:", createError);
        } else if (newAdminUser?.user) {
          console.log("Admin user created in Auth. Creating profile in customers table...");
          const { error: custErr } = await supabase.from('customers').upsert({
            id: newAdminUser.user.id,
            full_name: 'GMB Admin Panel',
            email: adminEmail,
            phone: '01712345678',
            is_admin: true
          });
          if (custErr) console.error("Error updates customer profile:", custErr);
          else console.log("Admin profile successfully created in customers table!");
        }
      }
    }
  } catch (e) {
    console.error("Exception seeding admin:", e);
  }
}

// Run seed if database is connected
supabase.from('categories').select('count', { count: 'exact', head: true }).then(({ error }) => {
  if (error) {
    console.error("Database connection check failed. Tables may be missing:", error.message);
  } else {
    seed();
  }
});
