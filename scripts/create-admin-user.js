/**
 * Script to create an admin user in Supabase
 * Run this with: node scripts/create-admin-user.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL is set in .env.local');
  process.exit(1);
}

// Use service role key for admin operations, or anon key as fallback
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  const email = 'admin@kamlewa.org';
  const password = 'Admin123!@#Kamlewa'; // Change this after first login!
  
  console.log('🔐 Creating admin user...');
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}`);
  console.log('');
  
  try {
    // Try to sign up a new user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: 'admin',
        name: 'Admin User'
      }
    });

    if (error) {
      // If user already exists, try to update password
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        console.log('⚠️  User already exists. Attempting to reset password...');
        
        // Try to sign in with password to verify, or use admin API to update
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: 'old_password_placeholder'
        });
        
        if (signInError && signInError.message.includes('Invalid login')) {
          // User exists but we don't know the password, so we'll need to use admin API
          console.log('✅ User exists. Please reset password via Supabase Dashboard:');
          console.log('   1. Go to https://supabase.com/dashboard');
          console.log('   2. Navigate to Authentication → Users');
          console.log('   3. Find the user and click "Reset Password"');
          console.log('');
          console.log('Or use the credentials above if you know the current password.');
          return;
        }
      }
      
      throw error;
    }

    if (data?.user) {
      console.log('✅ Admin user created successfully!');
      console.log('');
      console.log('📋 Login Credentials:');
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
      console.log('');
      console.log('⚠️  IMPORTANT: Change this password after first login!');
      console.log('');
      console.log('🔗 Login URL: http://localhost:3000/dashboard/login');
    }
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    console.log('');
    console.log('💡 Alternative: Create user manually via Supabase Dashboard:');
    console.log('   1. Go to https://supabase.com/dashboard');
    console.log('   2. Navigate to Authentication → Users');
    console.log('   3. Click "Add user"');
    console.log('   4. Enter email and password');
    console.log('   5. Click "Create user"');
  }
}

createAdminUser();

