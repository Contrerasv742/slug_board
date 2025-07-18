-- COMPREHENSIVE RLS DIAGNOSTIC SCRIPT
-- Run this in Supabase SQL Editor to identify the exact RLS issue

-- ==================================================
-- PART 1: CHECK CURRENT USER AUTHENTICATION
-- ==================================================
SELECT 'AUTHENTICATION CHECK:' as section;
SELECT 
  CASE 
    WHEN auth.uid() IS NULL THEN '❌ No authenticated user found'
    ELSE '✅ User authenticated: ' || auth.uid()::text
  END as auth_status;

-- ==================================================
-- PART 2: CHECK PROFILES TABLE STRUCTURE & POLICIES
-- ==================================================
SELECT 'PROFILES TABLE STRUCTURE:' as section;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'Profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'PROFILES TABLE RLS POLICIES:' as section;
SELECT 
  policyname, 
  cmd as operation,
  permissive,
  roles,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'Profiles' AND schemaname = 'public'
ORDER BY cmd, policyname;

-- ==================================================
-- PART 3: CHECK STORAGE BUCKET & POLICIES  
-- ==================================================
SELECT 'STORAGE BUCKETS:' as section;
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
ORDER BY name;

SELECT 'STORAGE RLS POLICIES:' as section;
SELECT 
  policyname,
  cmd as operation, 
  permissive,
  roles,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY cmd, policyname;

-- ==================================================
-- PART 4: TEST PROFILE ACCESS (IF USER IS AUTHENTICATED)
-- ==================================================
SELECT 'PROFILE ACCESS TEST:' as section;

-- Test if current user can SELECT their profile
DO $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    PERFORM * FROM "Profiles" WHERE id = auth.uid();
    RAISE NOTICE '✅ Profile SELECT access: SUCCESS';
  ELSE
    RAISE NOTICE '⚠️  Cannot test profile access - no authenticated user';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Profile SELECT access: FAILED - %', SQLERRM;
END $$;

-- Test if current user can UPDATE their profile
DO $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    -- Try a harmless update
    UPDATE "Profiles" 
    SET updated_at = NOW() 
    WHERE id = auth.uid();
    
    IF FOUND THEN
      RAISE NOTICE '✅ Profile UPDATE access: SUCCESS';
    ELSE
      RAISE NOTICE '⚠️  Profile UPDATE access: No matching profile found';
    END IF;
  ELSE
    RAISE NOTICE '⚠️  Cannot test profile update - no authenticated user';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Profile UPDATE access: FAILED - %', SQLERRM;
END $$;

-- ==================================================
-- PART 5: COMMON RLS ISSUES & SOLUTIONS
-- ==================================================
SELECT 'COMMON RLS ISSUES & SOLUTIONS:' as section;

-- Check if RLS is enabled on Profiles table
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN '✅ RLS is enabled'
    ELSE '❌ RLS is NOT enabled (this could be the issue!)'
  END as rls_status
FROM pg_tables 
WHERE tablename = 'Profiles' AND schemaname = 'public';

-- Check if RLS is enabled on storage.objects
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN '✅ Storage RLS is enabled'
    ELSE '❌ Storage RLS is NOT enabled'
  END as rls_status
FROM pg_tables 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- ==================================================
-- PART 6: RECOMMENDED FIXES
-- ==================================================
SELECT 'RECOMMENDED FIXES:' as section;

-- Check for missing interests column (common issue)
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Profiles' 
      AND column_name = 'interests'
      AND table_schema = 'public'
    ) 
    THEN '✅ interests column exists'
    ELSE '❌ interests column missing - this could cause RLS violations!'
  END as interests_column_status;

-- Final recommendations
SELECT 'If you see any ❌ above, run the appropriate fix below:' as recommendations; 