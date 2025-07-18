-- Add interests column to Profiles table
-- This allows users to store their interests/hobbies as a JSON array

-- Add interests column to existing Profiles table
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS interests JSONB DEFAULT '[]'::jsonb;

-- Create index on interests for better performance when filtering
CREATE INDEX IF NOT EXISTS profiles_interests_idx ON "Profiles" USING GIN (interests);

-- Show the updated table structure
SELECT 'Updated Profiles table columns:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Sample data to show the format
SELECT 'Sample interests format:' as info;
SELECT '["Technology", "Music", "Sports", "Academic", "Environmental"]'::jsonb as sample_interests_format; 