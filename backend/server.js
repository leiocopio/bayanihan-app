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

// Handle preflight OPTIONS requests
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

// ----------------- ROUTES -----------------
const testRoutes = require("./routes/test");
const authRoutes = require("./routes/auth")(supabase, setAuthCookies);
const profileRoutes = require("./routes/profile")(supabase, getUserFromCookies);

app.use("/api", testRoutes);
app.use("/api", authRoutes);
app.use("/api", profileRoutes);

// ----------------- HANDLER (serverless) -----------------
let cachedHandler;
async function handler(req, res) {
  if (!cachedHandler) {
    cachedHandler = serverless(app);
  }
  return cachedHandler(req, res);
}

module.exports = handler;

// ----------------- LOCAL DEV -----------------
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Express running at http://localhost:${PORT}`);
  });
}
