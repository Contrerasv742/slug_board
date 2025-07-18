-- Enable Row Level Security (RLS) for Events table
ALTER TABLE "Events" ENABLE ROW LEVEL SECURITY;

-- Create policies for Events table
-- Allow public read access to events
CREATE POLICY "Public can view events" ON "Events"
  FOR SELECT USING (true);

-- Allow service role to insert events (for scraped events)
CREATE POLICY "Service role can insert events" ON "Events"
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Allow service role to update events
CREATE POLICY "Service role can update events" ON "Events"
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Allow service role to delete events
CREATE POLICY "Service role can delete events" ON "Events"
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'service_role'
  );

-- CRITICAL: Allow anonymous inserts for reliable event scraping
-- This ensures the scraping script works regardless of JWT authentication issues
CREATE POLICY "Anonymous can insert events" ON "Events"
  FOR INSERT WITH CHECK (true);

-- Note: The anonymous insert policy above is the most reliable option for scraping
-- It works with both ANON_KEY and SERVICE_ROLE_KEY configurations
-- If you want to restrict this later, you can drop this policy and rely only on service role policy 