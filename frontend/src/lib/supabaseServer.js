import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

// Use server-only env vars (defined in .env but WITHOUT VITE_)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase server env vars");
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);
