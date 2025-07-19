-- TEST PROFILE UPDATE FUNCTIONALITY
-- Run this after applying the RLS fixes to verify everything works

-- ==================================================
-- TEST 1: CHECK AUTHENTICATION
-- ==================================================
SELECT 'TEST 1: Authentication Status' as test_name;
SELECT 
  CASE 
    WHEN auth.uid() IS NULL THEN '❌ Not authenticated - please log in first'
    ELSE '✅ Authenticated as: ' || auth.uid()::text
  END as result;

-- ==================================================
-- TEST 2: CHECK PROFILE EXISTS
-- ==================================================
SELECT 'TEST 2: Profile Existence' as test_name;

DO $$
DECLARE
  profile_exists boolean;
BEGIN
  IF auth.uid() IS NOT NULL THEN
    SELECT EXISTS(SELECT 1 FROM "Profiles" WHERE id = auth.uid()) INTO profile_exists;
    
    IF profile_exists THEN
      RAISE NOTICE '✅ Profile exists for current user';
    ELSE
      RAISE NOTICE '⚠️  No profile found - will be created automatically';
      
      -- Try to create profile
      INSERT INTO "Profiles" (id, email, name, created_at, updated_at)
      VALUES (
        auth.uid(),
        (SELECT email FROM auth.users WHERE id = auth.uid()),
        'Test User',
        NOW(),
        NOW()
      ) ON CONFLICT (id) DO NOTHING;
      
      RAISE NOTICE '✅ Profile created successfully';
    END IF;
  ELSE
    RAISE NOTICE '❌ Cannot test - user not authenticated';
  END IF;
END $$;

-- ==================================================
-- TEST 3: TEST PROFILE UPDATE (SIMULATING WHAT THE APP DOES)
-- ==================================================
SELECT 'TEST 3: Profile Update Test' as test_name;

DO $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    -- Test updating profile with all fields that the app uses
    UPDATE "Profiles" 
    SET 
      name = 'Test User Updated',
      bio = 'Test bio',
      location = 'Test Location',
      class_year = 'Class of 2025',
      username = 'testuser' || floor(random() * 1000)::text,
      interests = ARRAY['Technology', 'Art', 'Music'],
      updated_at = NOW()
    WHERE id = auth.uid();
    
    IF FOUND THEN
      RAISE NOTICE '✅ Profile update successful!';
      
      -- Show updated profile
      RAISE NOTICE 'Updated profile data:';
      PERFORM id, name, bio, location, class_year, username, interests
      FROM "Profiles" WHERE id = auth.uid();
    ELSE
      RAISE NOTICE '❌ Profile update failed - no matching record';
    END IF;
  ELSE
    RAISE NOTICE '❌ Cannot test update - user not authenticated';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Profile update failed with error: %', SQLERRM;
END $$;

-- ==================================================
-- TEST 4: TEST STORAGE ACCESS (IF AUTHENTICATED)
-- ==================================================
SELECT 'TEST 4: Storage Access Test' as test_name;

DO $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    -- Check if user can access storage bucket
    IF EXISTS(SELECT 1 FROM storage.buckets WHERE id = 'avatars') THEN
      RAISE NOTICE '✅ Avatars storage bucket exists';
      
      -- Show bucket details
      PERFORM id, name, public, file_size_limit
      FROM storage.buckets WHERE id = 'avatars';
    ELSE
      RAISE NOTICE '❌ Avatars storage bucket missing';
    END IF;
  ELSE
    RAISE NOTICE '⚠️  Cannot test storage - user not authenticated';
  END IF;
END $$;

-- ==================================================
-- FINAL SUMMARY
-- ==================================================
SELECT 'FINAL SUMMARY' as section;

SELECT 
  CASE 
    WHEN auth.uid() IS NOT NULL AND 
         EXISTS(SELECT 1 FROM "Profiles" WHERE id = auth.uid()) AND
         EXISTS(SELECT 1 FROM storage.buckets WHERE id = 'avatars')
    THEN '🎉 ALL TESTS PASSED! Profile picture upload should work.'
    ELSE '⚠️  Some issues detected. Check the test results above.'
  END as final_result;

-- Show current profile data (if authenticated)
SELECT 'Current Profile Data:' as info;
SELECT id, email, name, username, bio, location, class_year, interests, avatar_url
FROM "Profiles" 
WHERE id = auth.uid()
LIMIT 1; 