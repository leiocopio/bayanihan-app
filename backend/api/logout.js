export default function handler(req, res) {
  res.setHeader("Set-Cookie", [
    "sb-access-token=; HttpOnly; Path=/; Max-Age=0",
    "sb-refresh-token=; HttpOnly; Path=/; Max-Age=0",
  ]);
  res.status(200).json({ message: "Logged out successfully" });
}
