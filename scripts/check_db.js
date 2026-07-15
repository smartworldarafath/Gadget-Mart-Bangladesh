const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hlciajobsygzwqohvvyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsY2lham9ic3lnendxb2h2dnl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEyNjQwMiwiZXhwIjoyMDk5NzAyNDAyfQ.3uWlepLWHbTq1fCYnCHwyjAwWaXbJLQaaGq2bTerG7s'; // Service Role Key

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking categories table...");
  const { data: catData, error: catError } = await supabase.from('categories').select('*').limit(1);
  if (catError) {
    console.error("Categories table error:", catError);
  } else {
    console.log("Categories table exists. Row count checked:", catData.length);
  }

  console.log("Checking products table...");
  const { data: prodData, error: prodError } = await supabase.from('products').select('*').limit(1);
  if (prodError) {
    console.error("Products table error:", prodError);
  } else {
    console.log("Products table exists. Row count checked:", prodData.length);
  }
}

check();
