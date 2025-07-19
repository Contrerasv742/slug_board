-- Create consolidated Profiles table with all user data
CREATE TABLE IF NOT EXISTS "Profiles" (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  location TEXT,
  class_year TEXT,
  avatar_url TEXT,
  provider TEXT DEFAULT 'email',
  last_sign_in TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE "Profiles" ENABLE ROW LEVEL SECURITY;

-- Create policies for Profiles table
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON "Profiles"
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON "Profiles"
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON "Profiles"
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON "Profiles"(email);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON "Profiles"(username);
CREATE INDEX IF NOT EXISTS profiles_provider_idx ON "Profiles"(provider);
CREATE INDEX IF NOT EXISTS profiles_last_sign_in_idx ON "Profiles"(last_sign_in);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."Profiles" (id, email, name, avatar_url, provider, last_sign_in, created_at)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email'),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE OR REPLACE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON "Profiles"
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();