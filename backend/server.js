import express from "express";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser()); 

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // allow your frontend
    credentials: true,
  })
);



// Handle preflight OPTIONS
app.options("*", cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));

// Validate env
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY in env.");
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ---------- AUTH HELPERS ----------

// Save Supabase session tokens to cookies
function setAuthCookies(res, session) {
  res.cookie("sb-access-token", session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000, // 1h
  });
  res.cookie("sb-refresh-token", session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7 * 1000, // 7d
  });
}

// Get user from cookies
async function getUserFromCookies(req) {
  const accessToken = req.cookies["sb-access-token"];
  if (!accessToken) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);

  if (error) {
    console.error("getUser error:", error.message);
    return null;
  }
  return user;
}

// ---------- ROUTES ----------

// Sign up
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

  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return res.status(400).json({ error: "Email already exists" });
    }
    return res.status(400).json({ error: error.message });
  }

  // Insert into your own table
  const { error: dbError } = await supabase.from("users").insert({
    id: data.user.id,
    email,
    pass, // ⚠️ storing plain password is not recommended!
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

// Login
app.post("/api/login", async (req, res) => {
  const { email, pass } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // Save tokens in cookies
  setAuthCookies(res, data.session);

  res.json({ user: data.user });
});

// Profile
app.get("/api/profile", async (req, res) => {
  const user = await getUserFromCookies(req);

  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { data: userProfile, error: profileError } = await supabase
    .from("users")
    .select(
      "first_name, last_name, address_street, address_bgy, address_city, address_province, contact_number, email"
    )
    .eq("id", user.id)
    .single();

  if (profileError) {
    return res.status(400).json({ error: profileError.message });
  }

  res.json({ user: userProfile });
});

// Logout
app.post("/api/logout", async (req, res) => {
  res.clearCookie("sb-access-token");
  res.clearCookie("sb-refresh-token");

  return res.json({ message: "Logged out successfully" });
});

// Test
app.get("/api/test", (req, res) => {
  res.json({ message: "Wazzup?" });
});

export const handler = serverless(app);


