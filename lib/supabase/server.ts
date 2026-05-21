import { createClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./config";

function getServiceRoleKey(): string {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY) for server-side Supabase client."
    );
  }
  return key;
}

export function createServerClient() {
  return createClient(SUPABASE_URL, getServiceRoleKey());
}

export function createAnonServerClient() {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}
