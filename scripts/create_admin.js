const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hlciajobsygzwqohvvyz.supabase.co';
// Service Role Key is required to manage Auth users programmatically
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsY2lham9ic3lnendxb2h2dnl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEyNjQwMiwiZXhwIjoyMDk5NzAyNDAyfQ.3uWlepLWHbTq1fCYnCHwyjAwWaXbJLQaaGq2bTerG7s';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const ADMIN_EMAIL = 'admin@gadgetmartbd.com';
const ADMIN_PASSWORD = 'Admin@GMB2025';

async function createAdmin() {
  console.log("Creating administrative user inside Supabase Auth...");

  // 1. Create user in Supabase Auth via admin API (bypassing email confirmation)
  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: {
      full_name: 'GMB Admin',
      phone: '01977-123456'
    }
  });

  if (error) {
    if (error.message.includes('already exists') || error.message.includes('already registered')) {
      console.log("Admin user email already registered in Supabase Auth.");
      
      // Attempt to retrieve the user's ID
      const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
      if (!listError && listData) {
        const existingUser = listData.users.find(u => u.email === ADMIN_EMAIL);
        if (existingUser) {
          await syncCustomerRow(existingUser.id);
        }
      }
    } else {
      console.error("Failed to create admin auth user:", error.message);
    }
  } else if (data && data.user) {
    console.log("Successfully created auth user. User ID:", data.user.id);
    await syncCustomerRow(data.user.id);
  }
}

async function syncCustomerRow(userId) {
  console.log("Syncing database customers row with admin permissions...");

  const { error } = await supabase
    .from('customers')
    .upsert({
      id: userId,
      full_name: 'GMB Admin',
      email: ADMIN_EMAIL,
      phone: '01977-123456',
      is_admin: true
    }, { onConflict: 'id' });

  if (error) {
    console.error("Failed to upsert customers table row:", error.message);
    console.log("Please make sure the 'customers' table has been created in your Supabase SQL editor!");
  } else {
    console.log("🎉 SUCCESS: Admin account created and synced in customers table!");
    console.log("You can now login at http://localhost:3000/admin or http://localhost:3000/login");
  }
}

createAdmin();
