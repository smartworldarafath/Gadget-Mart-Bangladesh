const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hlciajobsygzwqohvvyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsY2lham9ic3lnendxb2h2dnl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEyNjQwMiwiZXhwIjoyMDk5NzAyNDAyfQ.3uWlepLWHbTq1fCYnCHwyjAwWaXbJLQaaGq2bTerG7s';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, price, original_price')
    .order('price', { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  console.log(`Found ${products.length} products in DB.`);
  console.log("Sample product prices (First 30 lowest prices):");
  console.log(JSON.stringify(products.slice(0, 30), null, 2));

  console.log("Sample product prices (First 30 highest prices):");
  console.log(JSON.stringify(products.slice(-30), null, 2));
}

check();
