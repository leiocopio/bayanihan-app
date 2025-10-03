const express = require("express");
const router = express.Router();

module.exports = (supabase, getUserFromCookies) => {
  router.get("/profile", async (req, res) => {
    const user = await getUserFromCookies(req);
    if (!user) return res.status(401).json({ error: "Not authenticated" });

    const { data: userProfile, error } = await supabase
      .from("users")
      .select(
        "first_name, last_name, address_street, address_bgy, address_city, address_province, contact_number, email"
      )
      .eq("id", user.id)
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json({ user: userProfile });
  });

  return router;
};
