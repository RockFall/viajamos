import { createClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./config";

export function createBrowserClient() {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}

export const supabase = createBrowserClient();
