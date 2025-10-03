function setAuthCookies(res, session) {
  res.setHeader("Set-Cookie", [
    `sb-access-token=${session.access_token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax; ${
      process.env.NODE_ENV === "production" ? "Secure" : ""
    }`,
    `sb-refresh-token=${session.refresh_token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax; ${
      process.env.NODE_ENV === "production" ? "Secure" : ""
    }`
  ]);
}

async function getUserFromCookies(req, supabase) {
  const cookieHeader = req.headers.cookie || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map(c => c.trim().split("="))
  );
  const accessToken = cookies["sb-access-token"];
  if (!accessToken) return null;

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error) {
    console.error("getUser error:", error.message);
    return null;
  }
  return user;
}

module.exports = { setAuthCookies, getUserFromCookies };
