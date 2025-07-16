# User Database Setup Guide

This guide will help you set up the users table in your Supabase database to properly store authenticated users.

## Overview

The application now automatically stores all authenticated users (both email/password and OAuth) in a `users` table. This ensures that:

- All users have a record in your database
- User data is consistent across the application
- Events can be properly linked to users
- User profiles and preferences can be stored

## Database Setup

### Step 1: Create the Users Table

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to "SQL Editor" in the sidebar
4. Create a new query and paste the following SQL:

```sql
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
```

5. Click "Run" to execute the SQL

### Step 2: Verify the Table Structure

After running the SQL, you should see:

- A new `users` table in your database
- Row Level Security (RLS) enabled
- Proper policies for user data access
- Indexes for performance

## How User Storage Works

### Automatic User Creation

The application automatically creates user records when:

1. **Email/Password Sign Up**: User creates an account with email and password
2. **Email/Password Sign In**: User signs in for the first time
3. **OAuth Sign In**: User signs in with Google, LinkedIn, etc.
4. **Session Restoration**: User returns to the app with an existing session

### User Data Stored

For each user, the following data is stored:

- **id**: UUID from Supabase Auth (primary key)
- **email**: User's email address
- **full_name**: User's full name (from OAuth providers)
- **avatar_url**: User's profile picture URL (from OAuth providers)
- **provider**: Authentication provider ('email', 'google', 'linkedin', etc.)
- **created_at**: When the user record was created
- **updated_at**: When the user record was last updated
- **last_sign_in**: When the user last signed in

### OAuth User Data

When users sign in with OAuth providers (Google, LinkedIn, etc.), additional data is automatically captured:

- **Full Name**: From the OAuth provider's profile
- **Avatar URL**: Profile picture from the OAuth provider
- **Provider**: The OAuth provider name

## Testing User Storage

### Check Browser Console

1. Open your application in the browser
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Sign in with any method (email/password or OAuth)
5. Look for console messages like:
   - "Creating new user in database: [user-id]"
   - "User data stored successfully"
   - "Auth state changed: [event] [user-id]"

### Check Database

1. Go to your Supabase Dashboard
2. Navigate to "Table Editor"
3. Select the "users" table
4. You should see user records being created

## Troubleshooting

### Common Issues

1. **"Users table does not exist"**
   - Run the SQL script above to create the table
   - Check that you're in the correct Supabase project

2. **"Permission denied"**
   - Ensure RLS policies are properly set up
   - Check that the user is authenticated

3. **"Foreign key constraint"**
   - The users table references auth.users(id)
   - Ensure the user exists in Supabase Auth first

4. **"Duplicate key"**
   - The email field has a UNIQUE constraint
   - Each email can only be used once

### Debug Steps

1. **Check Console Logs**: Look for error messages in the browser console
2. **Verify Table Structure**: Ensure the users table has the correct columns
3. **Test Database Connection**: Try a simple query in the SQL editor
4. **Check RLS Policies**: Verify that policies allow the necessary operations

## Security Considerations

### Row Level Security (RLS)

The users table has RLS enabled with policies that:

- Users can only read their own data
- Users can only update their own data
- Users can only insert their own data
- All operations require authentication

### Data Privacy

- User data is only accessible to the user themselves
- No other users can see each other's data
- Admin access would require additional policies

## Migration from Existing Data

If you already have user data in other tables:

1. **Backup existing data** before making changes
2. **Create the users table** using the SQL above
3. **Migrate existing user data** to the new structure
4. **Update foreign key references** in other tables
5. **Test thoroughly** before deploying

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify the database table structure
3. Test with a fresh user account
4. Check Supabase logs in the dashboard

## Next Steps

Once the users table is set up:

1. **Test user creation** by signing in with different methods
2. **Verify user data** is being stored correctly
3. **Check that events** are properly linked to users
4. **Test user profile functionality** if implemented

The application will now automatically handle user storage for all authentication methods! 