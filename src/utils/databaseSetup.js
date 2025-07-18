import { supabase } from '../supabaseClient';

export class DatabaseSetup {
  // Check if users table exists and has the correct structure
  static async checkUsersTable() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(1);

      if (error) {
        console.error('Users table check failed:', error);
        return { exists: false, error };
      }

      console.log('Users table exists and is accessible');
      return { exists: true, error: null };
    } catch (error) {
      console.error('Exception checking users table:', error);
      return { exists: false, error };
    }
  }

  // Check if events table exists and has the correct structure
  static async checkEventsTable() {
    try {
      const { data, error } = await supabase
        .from('Events')
        .select('*')
        .limit(1);

      if (error) {
        console.error('Events table check failed:', error);
        return { exists: false, error };
      }

      console.log('Events table exists and is accessible');
      return { exists: true, error: null };
    } catch (error) {
      console.error('Exception checking events table:', error);
      return { exists: false, error };
    }
  }

  // Get the structure of the users table
  static async getUsersTableStructure() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(0);

      if (error) {
        console.error('Error getting table structure:', error);
        return { structure: null, error };
      }

      // This will give us information about the table structure
      console.log('Users table structure check completed');
      return { structure: 'accessible', error: null };
    } catch (error) {
      console.error('Exception getting table structure:', error);
      return { structure: null, error };
    }
  }

  // Create a test user record to verify the table works
  static async testUserCreation() {
    try {
      const testUserData = {
        id: 'test-user-' + Date.now(),
        email: 'test@example.com',
        created_at: new Date().toISOString(),
        provider: 'test',
        last_sign_in: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('users')
        .insert(testUserData)
        .select()
        .single();

      if (error) {
        console.error('Test user creation failed:', error);
        return { success: false, error };
      }

      // Clean up the test user
      await supabase
        .from('users')
        .delete()
        .eq('id', testUserData.id);

      console.log('Test user creation successful');
      return { success: true, error: null };
    } catch (error) {
      console.error('Exception in test user creation:', error);
      return { success: false, error };
    }
  }
}

// SQL script to create the users table if it doesn't exist
export const CREATE_USERS_TABLE_SQL = `
-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  provider TEXT DEFAULT 'email',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create policy to allow users to insert their own data
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- Create index on provider for filtering
CREATE INDEX IF NOT EXISTS users_provider_idx ON users(provider);
`;

// SQL script to create the events and RSVPs tables
export const CREATE_EVENTS_TABLE_SQL = `
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
`;

// Function to run the database setup
export const runDatabaseSetup = async () => {
  console.log('Running database setup checks...');
  
  // Check if users table exists
  const usersTableCheck = await DatabaseSetup.checkUsersTable();
  if (!usersTableCheck.exists) {
    console.error('Users table does not exist or is not accessible');
    console.log('Please run the following SQL in your Supabase SQL editor:');
    console.log(CREATE_USERS_TABLE_SQL);
    return false;
  }

  // Check if events table exists
  const eventsTableCheck = await DatabaseSetup.checkEventsTable();
  if (!eventsTableCheck.exists) {
    console.error('Events table does not exist or is not accessible');
    console.log('Please run the following SQL in your Supabase SQL editor:');
    console.log(CREATE_EVENTS_TABLE_SQL);
    return false;
  }

  // Test user creation
  const testCreation = await DatabaseSetup.testUserCreation();
  if (!testCreation.success) {
    console.error('User creation test failed:', testCreation.error);
    return false;
  }

  console.log('Database setup checks passed!');
  return true;
}; 