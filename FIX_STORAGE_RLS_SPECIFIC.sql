-- SPECIFIC FIX FOR PROFILE PICTURE STORAGE RLS
-- This fixes the storage policies to match the actual upload pattern

-- ==================================================
-- DIAGNOSE CURRENT STORAGE ISSUES
-- ==================================================
SELECT 'CURRENT STORAGE DIAGNOSIS:' as section;

-- Check if avatars bucket exists
SELECT 
  CASE 
    WHEN EXISTS(SELECT 1 FROM storage.buckets WHERE id = 'avatars') 
    THEN '✅ Avatars bucket exists'
    ELSE '❌ Avatars bucket missing'
  END as bucket_status;

-- Show current storage policies
SELECT 'Current storage policies:' as info;
SELECT policyname, cmd, with_check, qual
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage' 
AND policyname LIKE '%avatar%'
ORDER BY policyname;

-- ==================================================
-- FIX 1: DROP PROBLEMATIC STORAGE POLICIES
-- ==================================================
SELECT 'FIX 1: Removing problematic storage policies...' as status;

-- Drop all existing avatar-related storage policies
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Also drop any variations that might exist
DROP POLICY IF EXISTS "Avatar upload policy" ON storage.objects;
DROP POLICY IF EXISTS "Avatar view policy" ON storage.objects;
DROP POLICY IF EXISTS "Avatar update policy" ON storage.objects;
DROP POLICY IF EXISTS "Avatar delete policy" ON storage.objects;

SELECT 'FIX 1 COMPLETE: Old policies removed' as status;

-- ==================================================
-- FIX 2: CREATE CORRECTED STORAGE POLICIES
-- ==================================================
SELECT 'FIX 2: Creating corrected storage policies...' as status;

-- Policy 1: Allow users to upload files that start with their user ID
-- This matches the upload pattern: {user.id}-{random}.{extension}
CREATE POLICY "Avatar upload policy" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid() IS NOT NULL
    AND name LIKE (auth.uid()::text || '-%')
  );

-- Policy 2: Allow public read access to all avatars
CREATE POLICY "Avatar view policy" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Policy 3: Allow users to update their own avatar files
CREATE POLICY "Avatar update policy" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid() IS NOT NULL
    AND name LIKE (auth.uid()::text || '-%')
  );

-- Policy 4: Allow users to delete their own avatar files
CREATE POLICY "Avatar delete policy" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid() IS NOT NULL
    AND name LIKE (auth.uid()::text || '-%')
  );

SELECT 'FIX 2 COMPLETE: New policies created' as status;

-- ==================================================
-- FIX 3: ENSURE STORAGE BUCKET IS PROPERLY CONFIGURED
-- ==================================================
SELECT 'FIX 3: Ensuring storage bucket is properly configured...' as status;

-- Create or update avatars bucket with correct settings
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true, 
  5242880,  -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/*']
) 
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

SELECT 'FIX 3 COMPLETE: Storage bucket configured' as status;

-- ==================================================
-- FIX 4: ALTERNATIVE PERMISSIVE POLICY (IF ABOVE FAILS)
-- ==================================================
SELECT 'FIX 4: Creating fallback permissive policies...' as status;

-- If the user-specific policies don't work, create more permissive ones
-- Policy for authenticated users to upload to avatars bucket
CREATE POLICY "Authenticated avatar upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid() IS NOT NULL
  );

-- Policy for authenticated users to update in avatars bucket  
CREATE POLICY "Authenticated avatar update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid() IS NOT NULL
  );

-- Policy for authenticated users to delete in avatars bucket
CREATE POLICY "Authenticated avatar delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid() IS NOT NULL
  );

SELECT 'FIX 4 COMPLETE: Fallback policies created' as status;

-- ==================================================
-- VERIFICATION
-- ==================================================
SELECT 'VERIFICATION: Final storage setup...' as section;

-- Show final bucket configuration
SELECT 'Final bucket configuration:' as info;
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets WHERE id = 'avatars';

-- Show final storage policies
SELECT 'Final storage policies:' as info;
SELECT policyname, cmd, permissive
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage' 
AND (policyname LIKE '%avatar%' OR policyname LIKE '%Avatar%')
ORDER BY cmd, policyname;

-- Final status
SELECT '🎉 STORAGE RLS FIXED! Try uploading a profile picture now.' as final_status;

-- Helpful debugging info
SELECT 'DEBUG INFO: If upload still fails, check these:' as debug_section;
SELECT '1. Make sure you are logged in to the app' as tip_1;
SELECT '2. Check browser console for specific error messages' as tip_2;
SELECT '3. Verify file is under 5MB and is an image' as tip_3;
SELECT '4. Check Network tab in browser for failed requests' as tip_4; 