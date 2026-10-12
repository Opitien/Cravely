// Permanently deletes the calling user's account and personal data.
// Required by the App Store / Play Store for apps that support sign-up.
import { corsHeaders, json } from '../_shared/cors.ts';
import { admin, getUser } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const user = await getUser(req);
  if (!user) return json({ error: 'Not authenticated' }, 401);

  // Profiles, addresses, favorites and orders cascade from auth.users.
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
});
