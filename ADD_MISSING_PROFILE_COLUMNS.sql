-- Add Missing Profile Columns to Profiles Table
-- This script only touches the Profiles table, no reference to users table

-- First, let's see what columns currently exist in Profiles table
SELECT 'Current Profiles table columns:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add missing profile columns that the profile page needs
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS class_year TEXT;
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS username TEXT;

-- Add unique constraint on username if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Profiles_username_key' 
        AND table_name = 'Profiles'
    ) THEN
        ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_username_key" UNIQUE (username);
    END IF;
EXCEPTION
    WHEN duplicate_table THEN
        -- Constraint already exists, ignore
        NULL;
END $$;

-- Create index on username for better performance
CREATE INDEX IF NOT EXISTS profiles_username_idx ON "Profiles"(username);

-- Show the updated table structure
SELECT 'Updated Profiles table columns:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test query to make sure the profile page can now save data
SELECT 'Test query - this should work without errors:' as info;
SELECT id, email, name, bio, location, class_year, username, created_at, updated_at
FROM "Profiles" 
LIMIT 1; 