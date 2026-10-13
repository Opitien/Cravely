import { createClient, type SupabaseClient, type User } from 'npm:@supabase/supabase-js@2';

// Service-role client: bypasses RLS. Only ever used server-side.
export const admin: SupabaseClient = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false } },
);

// Resolve the calling user from their JWT, or null.
export async function getUser(req: Request): Promise<User | null> {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const { data, error } = await admin.auth.getUser(token);
  if (error) return null;
  return data.user;
}
