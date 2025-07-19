-- COMPREHENSIVE RLS VIOLATION FIXES
-- Run this script to fix the most common causes of RLS violations

-- ==================================================
-- FIX 1: ADD MISSING INTERESTS COLUMN
-- ==================================================
-- The profile page tries to save 'interests' but the column might be missing
SELECT 'FIX 1: Adding missing interests column...' as status;

ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS interests TEXT[];

-- Add index for interests column
CREATE INDEX IF NOT EXISTS profiles_interests_idx ON "Profiles" USING GIN (interests);

SELECT 'FIX 1 COMPLETE: interests column added' as status;

-- ==================================================  
-- FIX 2: ENSURE ALL REQUIRED PROFILE COLUMNS EXIST
-- ==================================================
SELECT 'FIX 2: Adding any missing profile columns...' as status;

-- Add all columns that the profile page expects
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS class_year TEXT;
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email';
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS last_sign_in TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

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
    WHEN duplicate_table THEN NULL; -- Ignore if already exists
END $$;

SELECT 'FIX 2 COMPLETE: All profile columns ensured' as status;

-- ==================================================
-- FIX 3: RECREATE PROFILES RLS POLICIES (CLEAN SLATE)
-- ==================================================
SELECT 'FIX 3: Recreating Profiles RLS policies...' as status;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON "Profiles";
DROP POLICY IF EXISTS "Users can update own profile" ON "Profiles"; 
DROP POLICY IF EXISTS "Users can insert own profile" ON "Profiles";

-- Ensure RLS is enabled
ALTER TABLE "Profiles" ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies
CREATE POLICY "Users can view own profile" ON "Profiles"
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON "Profiles"
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON "Profiles"
  FOR INSERT WITH CHECK (auth.uid() = id);

SELECT 'FIX 3 COMPLETE: Profiles RLS policies recreated' as status;

-- ==================================================
-- FIX 4: SETUP STORAGE BUCKET & POLICIES
-- ==================================================
SELECT 'FIX 4: Setting up storage for profile pictures...' as status;

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true, 
  5242880,  -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Create storage policies
CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

SELECT 'FIX 4 COMPLETE: Storage setup complete' as status;

-- ==================================================
-- FIX 5: CREATE FALLBACK PROFILE TRIGGER
-- ==================================================
SELECT 'FIX 5: Creating profile auto-creation trigger...' as status;

-- Create function to automatically create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."Profiles" (
    id, 
    email, 
    name, 
    avatar_url, 
    provider, 
    last_sign_in, 
    created_at,
    updated_at
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'name', 
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email'),
    NOW(),
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

SELECT 'FIX 5 COMPLETE: Auto-profile creation enabled' as status;

-- ==================================================
-- VERIFICATION & FINAL STATUS
-- ==================================================
SELECT 'VERIFICATION: Checking final setup...' as status;

-- Check table structure
SELECT 'Final Profiles table columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'Profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check policies
SELECT 'Final Profiles RLS policies:' as info;
SELECT policyname, cmd
FROM pg_policies 
WHERE tablename = 'Profiles' AND schemaname = 'public'
ORDER BY cmd, policyname;

-- Check storage
SELECT 'Storage buckets:' as info;
SELECT id, name, public FROM storage.buckets WHERE id = 'avatars';

SELECT 'Storage policies:' as info;
SELECT policyname, cmd
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname LIKE '%avatar%'
ORDER BY cmd;

SELECT '🎉 ALL FIXES APPLIED! Profile picture upload should now work.' as final_status; 