# Fixing Row Level Security (RLS) Policy Violation

## Problem
The scraping script is failing with the error:
```
Failed to insert event: {'message': 'new row violates row-level security policy for table "Events"', 'code': '42501'}
```

## Root Cause
The `Events` table in Supabase has Row Level Security (RLS) enabled, which prevents unauthorized data insertions. The scraping script is not properly authenticated to bypass these policies.

## QUICK FIX (Recommended)

### Step 1: Apply the Comprehensive RLS Fix
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `apply_rls_fix_for_scraping.sql`
4. Click **Run** to execute the script

This script will:
- Create the Events table if it doesn't exist
- Set up proper RLS policies that allow scraping
- Test that the policies work correctly

### Step 2: Set Up Your Environment
Create a `.env` file in your project root with:

```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_chosen_key_here
```

**Key Options:**

🔓 **SERVICE_ROLE_KEY** (Recommended for scraping):
- Bypasses most RLS policies
- Perfect for system operations like data scraping
- Use this for the scraping script

🔒 **ANON_KEY** (Also works now):
- Subject to RLS policies, but our fix allows anonymous inserts
- Good for testing that RLS works correctly

You can find these keys in your Supabase Dashboard:
- Go to Settings > API
- Copy the `URL` and either `anon` or `service_role` key

### Step 3: Test the Database Connection
First, run the test script to verify everything is working:
```bash
python test_database_connection.py
```

You should see:
- "Database connection successful" message
- "Insert access successful" message
- "All tests passed!" message

### Step 4: Run the Scraping Script
If the test passes, run the actual scraping script:
```bash
python scrape_santacruz_events.py
```

You should see:
- "Database connection successful" message
- "✓ Inserted event: [Event Name]" for each event
- "Database insertion complete!" message

## Alternative Solutions (If Quick Fix Doesn't Work)

### Option A: Temporarily Disable RLS
If you still encounter issues, you can temporarily disable RLS for the Events table:

```sql
ALTER TABLE "Events" DISABLE ROW LEVEL SECURITY;
```

**Warning:** This removes all access restrictions. Re-enable RLS after testing:
```sql
ALTER TABLE "Events" ENABLE ROW LEVEL SECURITY;
```

### Option B: Manual Policy Creation
Use the individual policies from `create_rls_policy.sql` if you prefer more control.

## Verification
After running the script successfully, verify in your Supabase dashboard that:
1. The `Events` table exists with the correct schema
2. Events data has been inserted
3. No RLS policy violations in the logs

## Understanding the Fix
The key improvement is the **"Anonymous can insert events"** policy:
```sql
CREATE POLICY "Anonymous can insert events" ON "Events"
  FOR INSERT WITH CHECK (true);
```

This policy allows the scraping script to insert events regardless of whether it uses ANON_KEY or SERVICE_ROLE_KEY, making the solution more robust and reliable. 