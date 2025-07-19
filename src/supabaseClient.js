// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://xzbgwpckoyvlgzfecnmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Ymd3cGNrb3l2bGd6ZmVjbm1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNzY1OTMsImV4cCI6MjA2Nzc1MjU5M30.MMpYZajKEPfYrDdqG_p-a0ZG7X6P-j9OHp4e2ufXQJ8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Make Supabase available globally for debugging
if (typeof window !== 'undefined') {
  window.supabase = supabase;
}