# Events Database Setup Guide

This guide will help you create the events table in your Supabase database to store and display events.

## Overview

The application needs an `events` table to store event information. This table will be linked to the `users` table to track who created each event.

## Database Setup

### Step 1: Create the Events Table

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to "SQL Editor" in the sidebar
4. Create a new query and paste the following SQL:

```sql
-- Create events table if it doesn't exist
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  category TEXT,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view all events
CREATE POLICY "Users can view all events" ON events
  FOR SELECT USING (true);

-- Create policy to allow users to insert their own events
CREATE POLICY "Users can insert own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own events
CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own events
CREATE POLICY "Users can delete own events" ON events
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS events_user_id_idx ON events(user_id);
CREATE INDEX IF NOT EXISTS events_event_date_idx ON events(event_date);
CREATE INDEX IF NOT EXISTS events_category_idx ON events(category);
CREATE INDEX IF NOT EXISTS events_created_at_idx ON events(created_at);

-- Create RSVPs table for event attendance
CREATE TABLE IF NOT EXISTS "RSVPs" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'going' CHECK (status IN ('going', 'maybe', 'not_going')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Enable Row Level Security for RSVPs
ALTER TABLE "RSVPs" ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view RSVPs for events
CREATE POLICY "Users can view RSVPs" ON "RSVPs"
  FOR SELECT USING (true);

-- Create policy to allow users to insert their own RSVPs
CREATE POLICY "Users can insert own RSVPs" ON "RSVPs"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own RSVPs
CREATE POLICY "Users can update own RSVPs" ON "RSVPs"
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own RSVPs
CREATE POLICY "Users can delete own RSVPs" ON "RSVPs"
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for RSVPs
CREATE INDEX IF NOT EXISTS rsvps_user_id_idx ON "RSVPs"(user_id);
CREATE INDEX IF NOT EXISTS rsvps_event_id_idx ON "RSVPs"(event_id);
CREATE INDEX IF NOT EXISTS rsvps_status_idx ON "RSVPs"(status);
```

5. Click "Run" to execute the SQL

### Step 2: Insert Sample Events (Optional)

If you want to test with some sample events, run this SQL after creating the tables:

```sql
-- Insert sample events (only run this after creating the tables and having some users)
INSERT INTO events (title, description, event_date, location, category, user_id) VALUES
(
  'Campus Photography Workshop',
  'Join us for a hands-on photography workshop! Learn composition, lighting, and editing techniques. All skill levels welcome. Bring your camera or smartphone.',
  NOW() + INTERVAL '7 days',
  'UCSC Campus - Media Center',
  'Workshop',
  (SELECT id FROM users LIMIT 1)
),
(
  'Slug Board Meetup',
  'Monthly meetup for Slug Board users and developers. Share ideas, discuss features, and network with fellow Slugs!',
  NOW() + INTERVAL '3 days',
  'UCSC Library - Study Room 3',
  'Networking',
  (SELECT id FROM users LIMIT 1)
),
(
  'Study Group: Computer Science',
  'Weekly study group for CS students. We''ll be covering algorithms and data structures this week. Bring your questions!',
  NOW() + INTERVAL '1 day',
  'Engineering Building - Room 201',
  'Academic',
  (SELECT id FROM users LIMIT 1)
),
(
  'Environmental Awareness Day',
  'Join us for a day of environmental education and action. Activities include tree planting, waste reduction workshops, and sustainability discussions.',
  NOW() + INTERVAL '14 days',
  'UCSC Arboretum',
  'Environmental',
  (SELECT id FROM users LIMIT 1)
),
(
  'Music Jam Session',
  'Open mic and jam session for musicians of all levels. Bring your instruments or just come to listen and enjoy the music!',
  NOW() + INTERVAL '5 days',
  'Student Center - Music Room',
  'Music',
  (SELECT id FROM users LIMIT 1)
);
```

## Table Structure

### Events Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, auto-generated |
| title | TEXT | Event title (required) |
| description | TEXT | Event description |
| event_date | TIMESTAMP | When the event takes place |
| location | TEXT | Event location |
| category | TEXT | Event category (Workshop, Networking, etc.) |
| user_id | UUID | Foreign key to users table (who created the event) |
| created_at | TIMESTAMP | When the event was created |
| updated_at | TIMESTAMP | When the event was last updated |

### RSVPs Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, auto-generated |
| user_id | UUID | Foreign key to users table |
| event_id | UUID | Foreign key to events table |
| status | TEXT | RSVP status ('going', 'maybe', 'not_going') |
| created_at | TIMESTAMP | When the RSVP was created |

## Security Features

### Row Level Security (RLS)

Both tables have RLS enabled with policies that:

- **Events**: Users can view all events, but only create/update/delete their own
- **RSVPs**: Users can view all RSVPs, but only manage their own

### Data Integrity

- Foreign key constraints ensure data consistency
- Unique constraint on RSVPs prevents duplicate responses
- Check constraint ensures valid RSVP status values

## Testing the Setup

### 1. Check Browser Console

After creating the tables, refresh your application and check the browser console for:

- "Events fetched successfully: [...]"
- No more "relation does not exist" errors

### 2. Verify in Database

1. Go to Supabase Dashboard → Table Editor
2. Check that both `events` and `RSVPs` tables exist
3. Verify the table structure matches the schema above

### 3. Test Event Creation

1. Sign in to your application
2. Try creating a new event
3. Verify the event appears in the database

## Troubleshooting

### Common Issues

1. **"relation does not exist"**
   - Run the SQL script above to create the tables
   - Check that you're in the correct Supabase project

2. **"foreign key constraint"**
   - Ensure the users table exists first
   - Check that user_id references exist in the users table

3. **"permission denied"**
   - Verify RLS policies are properly set up
   - Check that the user is authenticated

4. **"duplicate key"**
   - RSVPs have a unique constraint on (user_id, event_id)
   - Each user can only RSVP once per event

### Debug Steps

1. **Check Table Existence**:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' AND table_name IN ('events', 'RSVPs');
   ```

2. **Check Table Structure**:
   ```sql
   \d events
   \d "RSVPs"
   ```

3. **Test Basic Operations**:
   ```sql
   SELECT COUNT(*) FROM events;
   SELECT COUNT(*) FROM "RSVPs";
   ```

## Next Steps

Once the tables are created:

1. **Test event display** - Events should now appear on the home page
2. **Test event creation** - Users should be able to create new events
3. **Test RSVP functionality** - Users should be able to RSVP to events
4. **Add more features** - Comments, event images, etc.

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify the database table structure
3. Test with sample data
4. Check Supabase logs in the dashboard

The events should now display properly on your home page! 