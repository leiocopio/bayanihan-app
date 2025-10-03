// ----------------- DOTENV (local only) -----------------
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const serverless = require("serverless-http");
const { createClient } = require("@supabase/supabase-js");

const app = express();

// ----------------- MIDDLEWARE -----------------
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

// ----------------- ENV CHECK -----------------
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_KEY in environment variables.");
  process.exit(1);
}

// ----------------- SUPABASE -----------------
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ----------------- AUTH HELPERS -----------------
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

async function getUserFromCookies(req) {
  const accessToken = req.cookies["sb-access-token"];
  if (!accessToken) return null;

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error) {
    console.error("getUser error:", error.message);
    return null;
  }
  return data.user;
}

// ----------------- ROUTES -----------------
app.get("/api/test", (req, res) => {
  res.json({ message: "Wazzup? 🚀" });
});

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
    return res.status(400).json({
      error: error.message.includes("already registered")
        ? "Email already exists"
        : error.message,
    });
  }

  const { error: dbError } = await supabase.from("users").insert({
    id: data.user.id,
    email,
    pass, // ⚠️ don't store plain passwords in prod
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

app.post("/api/login", async (req, res) => {
  const { email, pass } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error) return res.status(400).json({ error: error.message });

  setAuthCookies(res, data.session);
  res.json({ user: data.user });
});

app.get("/api/profile", async (req, res) => {
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

app.post("/api/logout", (req, res) => {
  res.clearCookie("sb-access-token");
  res.clearCookie("sb-refresh-token");
  res.json({ message: "Logged out successfully" });
});

// ----------------- EXPORT FOR VERCEL -----------------
module.exports = app;
module.exports.handler = serverless(app);

// ----------------- LOCAL DEV -----------------
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Express running at http://localhost:${PORT}`);
  });
}
