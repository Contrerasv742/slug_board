import { createClient } from "@supabase/supabase-js";

// Load credentials from environment variables (defined via Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail fast so the developer knows to configure the environment
  throw new Error(
    "Missing Supabase environment variables.\n" +
      "Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
