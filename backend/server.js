import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import serverless from "serverless-http";
import { createClient } from "@supabase/supabase-js";

const fastify = Fastify();

// ---------- CORS FIX ----------
fastify.register(cors, {
  origin: (origin, cb) => {
    // Allow your frontend, or fallback to all origins
    const allowedOrigin = process.env.FRONTEND_URL || true;
    cb(null, allowedOrigin);
  },
  credentials: true,
});

// Cookies
fastify.register(cookie);

// ---------- ENV VALIDATION ----------
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY in env.");
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ---------- AUTH HELPERS ----------
function setAuthCookies(reply, session) {
  reply.setCookie("sb-access-token", session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000, // 1h
  });
  reply.setCookie("sb-refresh-token", session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7 * 1000, // 7d
  });
}

async function getUserFromCookies(request) {
  const accessToken = request.cookies["sb-access-token"];
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

// Signup
fastify.post("/api/signup", async (request, reply) => {
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
  } = request.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
  });

  if (error) {
    return reply.code(400).send({
      error: error.message.includes("already registered")
        ? "Email already exists"
        : error.message,
    });
  }

  const { error: dbError } = await supabase.from("users").insert({
    id: data.user.id,
    email,
    pass, // ⚠️ avoid storing plain passwords in production
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
    return reply.code(400).send({ error: dbError.message });
  }

  return { user: data.user };
});

// Login
fastify.post("/api/login", async (request, reply) => {
  const { email, pass } = request.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error) return reply.code(400).send({ error: error.message });

  setAuthCookies(reply, data.session);
  return { user: data.user };
});

// Profile
fastify.get("/api/profile", async (request, reply) => {
  const user = await getUserFromCookies(request);

  if (!user) return reply.code(401).send({ error: "Not authenticated" });

  const { data: userProfile, error } = await supabase
    .from("users")
    .select(
      "first_name, last_name, address_street, address_bgy, address_city, address_province, contact_number, email"
    )
    .eq("id", user.id)
    .single();

  if (error) return reply.code(400).send({ error: error.message });

  return { user: userProfile };
});

// Logout
fastify.post("/api/logout", async (request, reply) => {
  reply.clearCookie("sb-access-token");
  reply.clearCookie("sb-refresh-token");
  return { message: "Logged out successfully" };
});

// Test
fastify.get("/api/test", async () => {
  return { message: "Wazzup?" };
});

// ---------- HANDLER (serverless) ----------
let cachedHandler;

async function handler(req, res) {
  if (!cachedHandler) {
    cachedHandler = serverless(fastify);
  }
  return cachedHandler(req, res);
}

export default handler;
