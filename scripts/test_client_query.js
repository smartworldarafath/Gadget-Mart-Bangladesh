const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hlciajobsygzwqohvvyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsY2lham9ic3lnendxb2h2dnl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxMjY0MDIsImV4cCI6MjA5OTcwMjQwMn0.yodUOkXyWj6v1Xp37g4lnhuYfJSwZzJEkaIwNF2Qj5E'; // Anon Key (mimics client browser)

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  console.log("Attempting client-side login emulation...");
  
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@gadgetmartbd.com',
    password: 'Admin@GMB2025'
  });

  if (authError) {
    console.error("Login failed:", authError.message);
    return;
  }

  console.log("Logged in successfully. User ID:", authData.user.id);

  console.log("Querying customers table with signed-in client session...");
  const { data: customer, error: queryError } = await supabase
    .from('customers')
    .select('is_admin')
    .eq('id', authData.user.id)
    .single();

  if (queryError) {
    console.error("Customers query failed! Error details:", queryError);
  } else {
    console.log("Customers query succeeded! Data:", customer);
  }
}

testQuery();
