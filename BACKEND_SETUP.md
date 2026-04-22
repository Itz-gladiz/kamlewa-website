# Backend Setup - Supabase

## ✅ Database Schema Created

All database tables have been successfully created with the following structure:

### Tables Created:

1. **programs** - Core programs and initiatives
   - Fields: id, title, description, full_description, image, duration, participants, locations[], category
   - Auto-updating timestamps

2. **events** - Featured and upcoming events
   - Fields: id, title, description, date, location, image, type (featured/upcoming), participants, feedback, hours, summary
   - Participants count is automatically updated from registrations

3. **event_registrations** - Event participant registrations
   - Fields: id, event_id, name, email, phone, status (pending/confirmed/cancelled)
   - Automatically updates event participants count via trigger
   - Unique constraint on (event_id, email)

4. **trainings** - Training programs
   - Fields: id, title, description, duration, level (beginner/intermediate/advanced), image, instructor, price, format (online/in-person/hybrid)

5. **projects** - Strategic projects
   - Fields: id, title, description, status (active/completed/upcoming), image, start_date, end_date, progress (0-100)

6. **contact_info** - Contact information
   - Fields: id, type (email/phone/address/social), label, value, is_primary, display_order

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Public Read Access** - Anyone can view data
- **Authenticated Write Access** - Only authenticated users can modify data
- **Function Security** - All database functions have secure search_path

## 📦 API Functions Created

All database operations are available in:
- `src/lib/supabase/programs.ts`
- `src/lib/supabase/events.ts`
- `src/lib/supabase/trainings.ts`
- `src/lib/supabase/projects.ts`
- `src/lib/supabase/contact.ts`

## 🔑 Environment Variables Required

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bpaxyjmowfsjpzrojmlj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwYXh5am1vd2ZzanB6cm9qbWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzgxNDAsImV4cCI6MjA4MDM1NDE0MH0.Xt_upMt_eve0YMU1bFhxz92U4jlY7Yhr9nP-Jr3BqDs
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-cloudinary-upload-preset
```

**⚠️ Important**: Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env.local` file:
1. Go to Supabase Dashboard → Settings → API
2. Copy the **"service_role"** key (NOT the anon key)
3. Add it to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`
4. **Never commit this key to git** - it has admin privileges!

## 🚀 Next Steps

1. Add environment variables to `.env.local`
2. Update dashboard pages to use Supabase functions instead of local state
3. Set up authentication if needed for dashboard access
4. Test CRUD operations through the dashboard

## 📝 Notes

- Event participants are automatically calculated from registrations
- All tables have `created_at` and `updated_at` timestamps
- UUIDs are used for all primary keys
- Foreign key relationships are properly set up

