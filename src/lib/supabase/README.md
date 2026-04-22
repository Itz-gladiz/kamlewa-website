# Supabase Backend Setup

This project uses Supabase as the backend database and API.

## Database Schema

The following tables have been created:

1. **programs** - Core programs and initiatives
2. **events** - Featured and upcoming events
3. **event_registrations** - Tracks participants who register for events (auto-updates event participants count)
4. **trainings** - Training programs with levels and formats
5. **projects** - Strategic projects with status and progress
6. **contact_info** - Contact information displayed on the website

## Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-cloudinary-upload-preset
```

## Features

- **Row Level Security (RLS)**: Enabled on all tables
- **Public Read Access**: All tables allow public SELECT operations
- **Authenticated Write Access**: Only authenticated users can INSERT/UPDATE/DELETE
- **Auto-updating Timestamps**: `updated_at` is automatically updated on changes
- **Event Participants**: Automatically calculated from registrations

## API Functions

All database operations are available through functions in:
- `src/lib/supabase/programs.ts`
- `src/lib/supabase/events.ts`
- `src/lib/supabase/trainings.ts`
- `src/lib/supabase/projects.ts`
- `src/lib/supabase/contact.ts`

