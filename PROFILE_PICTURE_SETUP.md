# Profile Picture Setup Guide

This guide will help you set up Supabase Storage to enable profile picture uploads for your Slug Board application.

## Overview

The profile picture feature allows users to upload and display custom profile images. Images are stored in Supabase Storage and the URLs are saved in the user's profile.

## Step 1: Set up Supabase Storage Bucket

### 1.1 Create the Storage Bucket
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Storage** in the sidebar
4. Click **"Create a new bucket"**
5. Enter the following details:
   - **Bucket name**: `avatars`
   - **Public bucket**: ✅ Enable (checked)
   - **File size limit**: `5242880` (5MB in bytes)
   - **Allowed MIME types**: `image/*`
6. Click **"Create bucket"**

### 1.2 Set up Storage Policies
After creating the bucket, you need to set up policies for user access:

1. In the Storage section, click on the **"avatars"** bucket
2. Go to the **"Policies"** tab
3. Click **"Add policy"**
4. Create the following policies:

#### Policy 1: Allow authenticated users to upload their own avatars
```sql
CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

#### Policy 2: Allow public read access to avatars
```sql
CREATE POLICY "Public can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
```

#### Policy 3: Allow users to update their own avatars
```sql
CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

#### Policy 4: Allow users to delete their own avatars
```sql
CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 1.3 Alternative: Quick Setup with SQL
If you prefer to set up everything with SQL, go to **SQL Editor** and run:

```sql
-- Insert storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
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
```

## Step 2: Verify Setup

### 2.1 Check Storage Configuration
1. Go to **Storage** > **Settings**
2. Verify that:
   - The `avatars` bucket exists
   - The bucket is marked as **Public**
   - File size limit is set appropriately
   - MIME type restrictions are in place

### 2.2 Test Upload (Optional)
You can test the upload functionality by:
1. Running your application
2. Going to the profile page
3. Clicking the upload button on the profile picture
4. Selecting an image file
5. Verifying the image uploads and displays correctly

## How Profile Pictures Work

### Upload Process
1. User selects an image file
2. File is validated (size, type)
3. File is uploaded to Supabase Storage bucket `avatars`
4. Public URL is generated for the uploaded file
5. Profile record is updated with the new `avatar_url`
6. UI updates to show the new profile picture

### File Organization
- Files are stored in the `avatars` bucket
- Each file is named with user ID + random string for uniqueness
- Example: `550e8400-e29b-41d4-a716-446655440000-0.123456.jpg`

### Security Features
- ✅ **File Size Limit**: Maximum 5MB per image
- ✅ **File Type Validation**: Only image files allowed
- ✅ **User Isolation**: Users can only upload to their own space
- ✅ **Public Read Access**: Profile pictures are publicly viewable
- ✅ **Authentication Required**: Must be logged in to upload

## Troubleshooting

### Common Issues

#### 1. "Failed to upload image" Error
**Possible Causes:**
- Storage bucket doesn't exist
- Storage policies not set up correctly
- File size exceeds limit
- Invalid file type

**Solutions:**
- Follow the setup steps above
- Check bucket policies in Supabase Dashboard
- Ensure file is under 5MB and is an image

#### 2. Image Not Displaying
**Possible Causes:**
- Public access not enabled on bucket
- Invalid avatar URL in database
- Image file corrupted

**Solutions:**
- Verify bucket is public
- Check `avatar_url` field in Profiles table
- Try uploading a different image

#### 3. Storage Policies Error
**Possible Causes:**
- RLS not enabled on storage.objects
- Incorrect policy syntax
- Missing authentication

**Solutions:**
- Enable RLS on storage.objects table
- Verify policy syntax matches examples above
- Ensure user is authenticated

### Check Storage Policies
Run this query in SQL Editor to check existing policies:

```sql
SELECT * FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
```

### Check Bucket Configuration
```sql
SELECT * FROM storage.buckets WHERE id = 'avatars';
```

## Features Implemented

✅ **Profile Picture Upload**: Users can upload custom profile pictures  
✅ **Image Validation**: File size and type validation  
✅ **Progress Indication**: Upload progress feedback  
✅ **Error Handling**: User-friendly error messages  
✅ **Automatic Updates**: Profile updates immediately after upload  
✅ **Fallback Display**: Default avatar if no picture uploaded  
✅ **Responsive Design**: Works on mobile and desktop  

## File Structure
```
slug_board-login 2/
├── src/
│   └── pages/
│       └── profile.jsx          # Profile page with upload functionality
└── PROFILE_PICTURE_SETUP.md     # This setup guide
```

The profile picture feature is now ready to use! Users can upload images through their profile page, and the images will be stored securely in Supabase Storage. 