-- Fix Profiles Table: Add all missing columns
-- Run this to ensure your Profiles table has all required columns

-- First, let's see what columns currently exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add all missing columns one by one
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS class_year TEXT;
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email';
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS last_sign_in TIMESTAMP WITH TIME ZONE DEFAULT NOW();

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
END $$;

-- Create all indexes
CREATE INDEX IF NOT EXISTS profiles_email_idx ON "Profiles"(email);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON "Profiles"(username);
CREATE INDEX IF NOT EXISTS profiles_provider_idx ON "Profiles"(provider);
CREATE INDEX IF NOT EXISTS profiles_last_sign_in_idx ON "Profiles"(last_sign_in);

-- Set default values for existing records
UPDATE "Profiles" 
SET 
  updated_at = COALESCE(updated_at, created_at, NOW()),
  provider = COALESCE(provider, 'email'),
  last_sign_in = COALESCE(last_sign_in, created_at, NOW())
WHERE updated_at IS NULL OR provider IS NULL OR last_sign_in IS NULL;

-- Show the final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'Profiles' AND table_schema = 'public'
ORDER BY ordinal_position; 