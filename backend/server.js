import express from "express";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL , // your Svelte frontend
    credentials: true,
  })
);

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_KEY in environment variables."
  );
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Sign up route
app.post("/api/signup", async (req, res) => {
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

  // Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
  });

  if (error) {
    // ✅ Catch duplicate email case
    if (error.message.includes("already registered")) {
      return res.status(400).json({ error: "Email already exists" });
    }
    return res.status(400).json({ error: error.message });
  }

  // Insert into your public.users table
  const { error: dbError } = await supabase.from("users").insert({
    id: data.user.id,
    email,
    pass, // ⚠️ you may not need this column if Supabase Auth already stores it
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

  if (dbError) {
    return res.status(400).json({ error: dbError.message });
  }

  res.json({ user: data.user });
});

// Sign-in route
app.post("/api/login", async (req, res) => {
  const { email, pass } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ user: data.user, session: data.session });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Wazzup?" });
});

app.get("/api/profile", async (req, res) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { data: userProfile, error: profileError } = await supabase
    .from("users") // ✅ use your own table
    .select(
      "first_name, last_name, address_street, address_bgy, address_city, address_province, contact_number, email"
    )
    .eq("id", user.id) // must match auth.users.id
    .single();

  if (profileError) {
    return res.status(400).json({ error: profileError.message });
  }

  res.json({ user: userProfile });
});

app.post("/api/logout", async (req, res) => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // If you use cookies, clear them here
  res.clearCookie("sb:token"); // replace with your cookie name if different

  // Always return JSON
  return res.json({ message: "Logged out successfully" });
});


app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
