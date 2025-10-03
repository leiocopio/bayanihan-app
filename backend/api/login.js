import supabase from "../utils/supabase.js";
import { setAuthCookies } from "../utils/authHelpers.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, pass } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error) return res.status(400).json({ error: error.message });

  setAuthCookies(res, data.session);
  res.status(200).json({ user: data.user });
}
