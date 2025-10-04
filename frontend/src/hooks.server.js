// src/hooks.server.js


import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '$env/static/private';

const supabaseServer = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function handle({ event, resolve }) {
  const {
    data: { session }
  } = await supabaseServer.auth.getSession();

  console.log("🔑 Session in hooks:", session);

  event.locals.session = session;
  return resolve(event);
}
