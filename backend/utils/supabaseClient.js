// supabaseClient.js
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

// Load environment variables from .env file


const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY;  // Use service_role key only on backend
export const supabase = createClient(supabaseUrl, supabaseKey)