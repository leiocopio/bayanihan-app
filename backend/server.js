// server.js (for local dev only)
const express = require("express");
const app = express();

app.use(express.json());

app.use("/api/test", require("./api/test").default || require("./api/test"));
app.use("/api/signup", require("./api/signup").default || require("./api/signup"));
app.use("/api/login", require("./api/login").default || require("./api/login"));
app.use("/api/profile", require("./api/profile").default || require("./api/profile"));
app.use("/api/logout", require("./api/logout").default || require("./api/logout"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Local API running on http://localhost:${PORT}`);
});
