-- Migration script to add missing columns to existing Profiles table
-- Run this FIRST before running supabase-setup.sql

-- Add missing columns to existing Profiles table
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email';
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS last_sign_in TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS profiles_provider_idx ON "Profiles"(provider);
CREATE INDEX IF NOT EXISTS profiles_last_sign_in_idx ON "Profiles"(last_sign_in);

-- Update existing records to have default values
UPDATE "Profiles" 
SET 
  provider = 'email',
  last_sign_in = created_at
WHERE provider IS NULL OR last_sign_in IS NULL;

-- Now you can run the main supabase-setup.sql script 