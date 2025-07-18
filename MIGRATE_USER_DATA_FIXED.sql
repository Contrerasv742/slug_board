-- Fixed Data Migration Script: users table → Profiles table
-- This uses the correct column names from your actual users table

-- First, let's see what columns exist in your users table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 1: Update existing profiles with data from users table
UPDATE "Profiles" 
SET 
  provider = COALESCE(users.provider, 'email'),
  last_sign_in = COALESCE(users.last_sign_in, users.updated_at, "Profiles".created_at),
  updated_at = NOW()
FROM users 
WHERE "Profiles".id = users.id;

-- Step 2: Insert any users that don't have profiles yet
INSERT INTO "Profiles" (
  id, email, full_name, avatar_url, provider, 
  last_sign_in, created_at, updated_at
)
SELECT 
  u.id, 
  u.email, 
  u.full_name, 
  u.avatar_url, 
  COALESCE(u.provider, 'email'),
  COALESCE(u.last_sign_in, u.updated_at, NOW()),
  COALESCE(u.updated_at, NOW()), -- Use updated_at as created_at since created_at doesn't exist
  NOW()
FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM "Profiles" p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Verify the migration
SELECT 
  'Migration Summary' as status,
  (SELECT COUNT(*) FROM users) as original_users_count,
  (SELECT COUNT(*) FROM "Profiles") as profiles_count,
  (SELECT COUNT(*) FROM "Profiles" WHERE provider IS NOT NULL) as profiles_with_provider;

-- Step 4: Show sample data to verify the migration worked
SELECT 
  id, email, full_name, provider, last_sign_in, created_at, updated_at
FROM "Profiles" 
LIMIT 5;

-- Optional Step 5: After verifying data looks correct, you can drop the old users table
-- IMPORTANT: Only run this after confirming your data migrated correctly!
-- DROP TABLE IF EXISTS users CASCADE; 