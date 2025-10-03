const express = require("express");
const router = express.Router();



module.exports = (supabase, setAuthCookies) => {
  router.post("/signup", async (req, res) => {
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

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
    });

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
      pass, // ⚠️ don’t store plain text passwords in prod
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

    res.json({ user: data.user });
  });

  router.post("/login", async (req, res) => {
    const { email, pass } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) return res.status(400).json({ error: error.message });

    setAuthCookies(res, data.session);
    res.json({ user: data.user });
  });

  router.post("/logout", (req, res) => {
    res.clearCookie("sb-access-token");
    res.clearCookie("sb-refresh-token");
    res.json({ message: "Logged out successfully" });
  });

  return router;
};
