# Admin Login Setup Guide

## 🔐 Creating Your Admin Account

You need to create an admin user account in Supabase to access the dashboard. Here are two methods:

### Method 1: Create User via Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `bpaxyjmowfsjpzrojmlj`
   - 

2. **Navigate to Authentication**
   - Click on "Authentication" in the left sidebar
   - Click on "Users" tab

3. **Add a New User**
   - Click the "Add user" button (or "Invite user")
   - Enter the following:
     - **Email**: `admin@kamlewa.org` (or your preferred email)
     - **Password**: Create a strong password (minimum 8 characters)
   - Click "Create user"

4. **Login to Dashboard**
   - Go to: `http://localhost:3000/dashboard/login` (or your deployed URL)
   - Enter the email and password you just created
   - Click "Sign In"

### Method 2: Create User via SQL (Alternative)

If you prefer using SQL, you can run this in the Supabase SQL Editor:

```sql
-- Create a new user (this will send a confirmation email)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@kamlewa.org',
  crypt('YourSecurePassword123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Note: The password needs to be hashed. Use Supabase dashboard or auth.signUp() instead.
```

**⚠️ Important**: The SQL method requires password hashing. It's easier to use Method 1.

### Method 3: Self-Registration (Development Only)

For development, you can temporarily allow self-registration:

1. Go to Supabase Dashboard → Authentication → Settings
2. Enable "Enable email signup"
3. Go to `/dashboard/login` and you'll see a "Sign up" option
4. Create your account
5. **Important**: Disable public signup after creating your admin account for security

## 🔑 Default Login Credentials

**Note**: You need to create these credentials first using one of the methods above.

**Recommended Admin Account:**
- **Email**: `admin@kamlewa.org`
- **Password**: (Create a strong password in Supabase)

## 🚀 Quick Start

1. **Create your admin user** using Method 1 above
2. **Start your development server**:
   ```bash
   npm run dev
   ```
3. **Navigate to login page**:
   ```
   http://localhost:3000/dashboard/login
   ```
4. **Enter your credentials** and sign in
5. **You'll be redirected** to `/dashboard` after successful login

## 🔒 Security Best Practices

1. **Use a strong password** (minimum 12 characters, mix of letters, numbers, symbols)
2. **Enable 2FA** in Supabase (if available in your plan)
3. **Limit admin access** - Only create accounts for trusted team members
4. **Disable public signup** after creating your admin account
5. **Regularly review** user access in Supabase dashboard

## 🛠️ Troubleshooting

### "Invalid email or password" error
- Verify the user exists in Supabase Authentication → Users
- Check that the email is confirmed (should be auto-confirmed if created via dashboard)
- Try resetting the password in Supabase dashboard

### "User not found" error
- Make sure you created the user in the correct Supabase project
- Check that your environment variables are correct in `.env.local`

### Can't access dashboard after login
- Check browser console for errors
- Verify Supabase environment variables are set correctly
- Ensure the user session is valid in Supabase dashboard

## 📝 Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bpaxyjmowfsjpzrojmlj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwYXh5am1vd2ZzanB6cm9qbWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzgxNDAsImV4cCI6MjA4MDM1NDE0MH0.Xt_upMt_eve0YMU1bFhxz92U4jlY7Yhr9nP-Jr3BqDs
```

## 🔗 Login URL

- **Local**: `http://localhost:3000/dashboard/login`
- **Production**: `https://yourdomain.com/dashboard/login`

---

**Need Help?** Check the Supabase documentation: https://supabase.com/docs/guides/auth

