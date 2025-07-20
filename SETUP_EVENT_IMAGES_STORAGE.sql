-- Setup storage bucket for event images
-- Run this in your Supabase SQL editor

-- Create the storage bucket for event images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policy to allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload event images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'event-images' 
  AND auth.role() = 'authenticated'
);

-- Create RLS policy to allow public read access to event images
CREATE POLICY "Allow public read access to event images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'event-images'
);

-- Create RLS policy to allow users to update their own uploaded images
CREATE POLICY "Allow users to update their own event images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'event-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create RLS policy to allow users to delete their own uploaded images
CREATE POLICY "Allow users to delete their own event images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'event-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY; 