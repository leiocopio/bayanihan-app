import { supabase } from "./supabaseClient";

// Test (like /api/test)
export async function testAPI() {
  return { message: "Wazzup? 🚀" };
}

// Signup
export async function signup({
  email,
  password,
  first_name,
  last_name,
  address_street,
  address_bgy,
  address_city,
  address_province,
  address_region,
  user_type,
  contact_number,
}) {
  // 1. Sign up with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  // 2. Save user profile in "users" table
  const { error: dbError } = await supabase.from("users").insert({
    id: data.user.id,
    email,
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

  if (dbError) throw new Error(dbError.message);

  return data.user;
}

// Login
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data.user;
}

// Profile (get current user + DB profile)
export async function getProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("users")
    .select(
      "first_name, last_name, address_street, address_bgy, address_city, address_province, contact_number, email"
    )
    .eq("id", user.id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Logout
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
  return { message: "Logged out successfully" };
}
