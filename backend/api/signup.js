import supabase from "../utils/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    email,
    pass,
    first_name,
    last_name,
    address_street,
    address_bgy,
    address_city,
    address_province,
    address_region,
    user_type,
    contact_number,
  } = req.body;

  const { data, error } = await supabase.auth.signUp({ email, password: pass });
  if (error) {
    return res.status(400).json({
      error: error.message.includes("already registered")
        ? "Email already exists"
        : error.message,
    });
  }

  const { error: dbError } = await supabase.from("users").insert({
    id: data.user.id,
    email,
    pass, // ⚠️ remove in prod
    first_name,
    last_name,
    address_street,
    address_bgy,
    address_city,
    address_province,
    address_region,
    user_type,
    contact_number,
  });

  if (dbError) return res.status(400).json({ error: dbError.message });

  res.status(200).json({ user: data.user });
}
