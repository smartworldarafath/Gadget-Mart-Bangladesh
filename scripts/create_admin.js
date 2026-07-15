const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hlciajobsygzwqohvvyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsY2lham9ic3lnendxb2h2dnl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEyNjQwMiwiZXhwIjoyMDk5NzAyNDAyfQ.3uWlepLWHbTq1fCYnCHwyjAwWaXbJLQaaGq2bTerG7s';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const ADMIN_EMAIL = 'admin@gadgetmartbd.com';
const ADMIN_PASSWORD = 'Admin@GMB2025';

async function run() {
  console.log("Checking if admin user already exists...");
  
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error("Failed to list users:", listError.message);
    return;
  }

  const existingUser = listData.users.find(u => u.email === ADMIN_EMAIL);

  if (existingUser) {
    console.log("Admin user found in Supabase Auth. User ID:", existingUser.id);
    await syncCustomerRow(existingUser.id);
  } else {
    console.log("Admin user not found. Creating a new one...");
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: 'GMB Admin',
        phone: '01977-123456'
      }
    });

    if (createError) {
      console.error("Failed to create admin user:", createError.message);
    } else if (createData && createData.user) {
      console.log("Admin user created successfully. User ID:", createData.user.id);
      await syncCustomerRow(createData.user.id);
    }
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
  } else {
    console.log("🎉 SUCCESS: Admin account created and synced in customers table!");
    console.log("You can now login at http://localhost:3000/admin or http://localhost:3000/login");
  }
}

run();
