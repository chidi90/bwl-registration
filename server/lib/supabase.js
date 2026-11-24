// Load .env variables immediately so this module works regardless of import order
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Fail fast at startup if required Supabase credentials are missing
function validateSupabaseEnv() {
  if (!supabaseUrl || !supabaseUrl.trim()) {
    throw new Error("Missing SUPABASE_URL in server/.env");
  }

  if (!supabaseServiceRoleKey || !supabaseServiceRoleKey.trim()) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in server/.env");
  }
}

validateSupabaseEnv();

// Create and export ONE admin Supabase client with browser session persistence disabled
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});