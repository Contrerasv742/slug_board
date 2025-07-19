# Alternative Profile Picture Upload Approaches

If the storage RLS is still failing after running `FIX_STORAGE_RLS_SPECIFIC.sql`, try these alternative upload methods:

## 🔍 **Root Cause**

The RLS violation is happening because the storage policies don't match the file naming pattern used in your upload code. Your code uploads files like:
```
{user-id}-{random}.{extension}
```

But typical Supabase Storage policies expect folder structures like:
```
{user-id}/filename.{extension}
```

## 🚀 **Solution 1: Run the Storage Fix Script**

**First, try this approach:**

1. Go to **Supabase Dashboard > SQL Editor**
2. Copy and paste the contents of `FIX_STORAGE_RLS_SPECIFIC.sql`
3. Click **Run**

This creates policies that work with your current file naming pattern.

## 🔧 **Solution 2: Alternative Upload Code (if Solution 1 fails)**

If the storage RLS is still failing, replace the `uploadAvatar` function in `profile.jsx` with this version:

```javascript
// Replace the uploadAvatar function with this version
const uploadAvatar = async (file) => {
  try {
    setUploading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    // Basic validation
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Use folder structure: {user-id}/avatar.{extension}
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    console.log('Uploading to path:', filePath);
    console.log('User ID:', user.id);

    // Remove existing avatar first
    await supabase.storage
      .from('avatars')
      .remove([filePath]);

    // Upload new file
    const { data, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Update profile
    const { error: updateError } = await supabase
      .from('Profiles')
      .update({ 
        avatar_url: publicUrl, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    // Update local state
    setAvatarUrl(publicUrl);
    setProfile(prev => ({ ...prev, avatar_url: publicUrl }));

  } catch (error) {
    console.error('Error uploading avatar:', error);
    setError(error.message);
  } finally {
    setUploading(false);
  }
};
```

If you use this folder-based approach, you'll also need to run this SQL:

```sql
-- Storage policies for folder structure
DROP POLICY IF EXISTS "Avatar upload policy" ON storage.objects;
DROP POLICY IF EXISTS "Avatar view policy" ON storage.objects;
DROP POLICY IF EXISTS "Avatar update policy" ON storage.objects;
DROP POLICY IF EXISTS "Avatar delete policy" ON storage.objects;

-- Create policies for folder structure
CREATE POLICY "Users can upload to their folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their folder" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete from their folder" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 🧪 **Solution 3: Super Permissive (Debugging Only)**

If nothing else works, try this super permissive approach temporarily to confirm storage works:

```sql
-- TEMPORARY: Very permissive storage policies (for debugging only)
DROP POLICY IF EXISTS "Avatar upload policy" ON storage.objects;
DROP POLICY IF EXISTS "Avatar view policy" ON storage.objects;
DROP POLICY IF EXISTS "Avatar update policy" ON storage.objects;
DROP POLICY IF EXISTS "Avatar delete policy" ON storage.objects;

-- Allow any authenticated user to upload to avatars bucket
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

CREATE POLICY "Allow public reads" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Allow authenticated updates" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated deletes" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
```

**⚠️ Warning**: Solution 3 is less secure and should only be used for testing. Revert to more restrictive policies after confirming upload works.

## 🔍 **Debugging Steps**

1. **Check browser console** (F12 > Console) for specific error messages
2. **Check Network tab** (F12 > Network) for failed requests
3. **Verify authentication**: Make sure you're logged into the app
4. **Test file**: Use a small (< 1MB) PNG or JPG image
5. **Check Supabase logs**: Go to Supabase Dashboard > Logs for detailed errors

## 📋 **Step-by-Step Debugging**

1. **Try Solution 1** (run `FIX_STORAGE_RLS_SPECIFIC.sql`)
2. **Test upload** - if it works, you're done!
3. **If still fails**, try **Solution 2** (folder-based upload code)
4. **If still fails**, try **Solution 3** (permissive policies) to isolate the issue
5. **Check browser console** for specific error messages

Once you identify which approach works, you can refine the policies to be more secure while maintaining functionality. 