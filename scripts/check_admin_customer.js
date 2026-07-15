const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hlciajobsygzwqohvvyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsY2lham9ic3lnendxb2h2dnl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEyNjQwMiwiZXhwIjoyMDk5NzAyNDAyfQ.3uWlepLWHbTq1fCYnCHwyjAwWaXbJLQaaGq2bTerG7s';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  console.log("Inspecting 'customers' table contents from server side (service role)...");
  
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*');

  if (error) {
    console.error("Failed to read customers table:", error.message);
  } else {
    console.log("Customers rows in database:", customers);
  }
}

inspect();
