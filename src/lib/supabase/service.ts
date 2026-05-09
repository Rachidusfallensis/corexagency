import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Service-role Supabase client for admin write operations.
 * Bypasses RLS — use only in server-side code AFTER verifying admin auth.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error('Missing Supabase service-role env vars')
  }
  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
