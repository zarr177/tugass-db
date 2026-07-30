const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const toysRouter = require("./routes/toys");

const app = express();

// Security
app.use(helmet());

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:3000"],
  credentials: true,
}));

// Body Parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

// Logger
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Root
app.get("/", (req, res) => {
  res.json({
    message: "🚀 B2Camp API berjalan",
  });
});

// Routes
app.use("/api/v1/toys", toysRouter);

app.get("/api/v1/info", (req, res) => {
  res.json({
    app: "B2Camp API",
    version: "1.0.0",
    env: process.env.NODE_ENV || "development",
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} tidak ditemukan`,
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    error: err.message || "Terjadi kesalahan pada server.",
  });
});

module.exports = app;