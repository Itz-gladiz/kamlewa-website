# How to Check if Default User Was Created

## 🔍 Where to Check the User

### Option 1: Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `bpaxyjmowfsjpzrojmlj`

2. **Navigate to Authentication**
   - Click on **"Authentication"** in the left sidebar
   - Click on **"Users"** tab

3. **Check for the User**
   - Look for `admin@kamlewa.org` in the users list
   - If you see it, the user was created successfully!
   - If not, you can create it manually (see below)

### Option 2: Browser Console

1. **Open Browser Developer Tools**
   - Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - Go to the **Console** tab

2. **Visit the Login Page**
   - Go to: `http://localhost:3000/dashboard/login`
   - Check the console for messages like:
     - `✅ Default admin user created successfully!`
     - `Default admin user already exists`
     - Any error messages

### Option 3: Login Page

The login page now shows:
- Default credentials displayed on the page
- A "Manually Create Default User" button
- Toast notifications when user is created

## 🛠️ Manual Creation (If Auto-Creation Failed)

### Via Login Page
1. Go to `/dashboard/login`
2. Click the **"Manually Create Default User"** button
3. Check for success/error toast notifications

### Via Supabase Dashboard
1. Go to Supabase Dashboard → Authentication → Users
2. Click **"Add user"** or **"Invite user"**
3. Enter:
   - **Email**: `admin@kamlewa.org`
   - **Password**: `Admin123!@#Kamlewa`
4. Click **"Create user"**

## 🔑 Default Credentials

- **Email**: `admin@kamlewa.org`
- **Password**: `Admin123!@#Kamlewa`

## ⚠️ Troubleshooting

### User Not Created?
1. Check browser console for errors
2. Check Supabase Dashboard → Authentication → Users
3. Try the manual create button on login page
4. Verify Supabase environment variables are set correctly

### Can't Log In?
1. Make sure user exists in Supabase Dashboard
2. Check if email confirmation is required (disable in Supabase settings if needed)
3. Try resetting password in Supabase Dashboard
4. Check browser console for specific error messages

### Email Confirmation Issue?
If Supabase requires email confirmation:
1. Go to Supabase Dashboard → Authentication → Settings
2. Disable **"Enable email confirmations"** (for development)
3. Or manually confirm the user in the Users tab

## 📝 Quick Check Commands

Open browser console on login page and run:
```javascript
// Check current session
const { data } = await supabase.auth.getSession();
console.log('Session:', data);

// Try to create user
const { data, error } = await supabase.auth.signUp({
  email: 'admin@kamlewa.org',
  password: 'Admin123!@#Kamlewa'
});
console.log('Create result:', { data, error });
```

