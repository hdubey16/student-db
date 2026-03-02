const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ───────── Middleware ─────────
app.use(cors());
app.use(express.json());

// ───────── API Routes ─────────
app.use("/api/students", studentRoutes);

// ───────── Serve React Frontend (Production) ─────────
const clientBuild = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuild));

// Any route that doesn't match /api → serve React index.html
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientBuild, "index.html"));
});

// ───────── Global Error Handler ─────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ───────── Start Server ─────────
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
