// src/app.js
// Express app — terpisah dari server.js agar mudah di-test

const express = require("express");
const cors    = require("cors");
const helmet  = require("helmet");
const morgan  = require("morgan");

const toysRouter = require("./routes/toys");

const app = express();

// ============================================================
// Security middleware
// ============================================================
app.use(helmet());          // Set security headers (X-Frame-Options, CSP, dll)
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "http://localhost:3000",
  credentials: true,
}));

// ============================================================
// Request parsing
// ============================================================
app.use(express.json({ limit: "10kb" }));       // Parse JSON body, batasi ukuran
app.use(express.urlencoded({ extended: false })); // Parse form data

// ============================================================
// Logging (hanya di development)
// ============================================================
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ============================================================
// Routes
// ============================================================
app.use("/api/V1/toys", toysRouter); 

app.get("/api/v1/info", (req, res) => {
  res.json({
    app:     "B2Camp API",
    version: "1.0.0",
    env:     process.env.NODE_ENV || "development",
  });
});


// app.get("/api/v1/toys", (req, res) => {
//   res.json({
//    name: "Porsche GT",
//    stock: 100,
//    price: 20000,
//   });
// });

// ============================================================
// 404 handler — tangkap route yang tidak ada
// ============================================================
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} tidak ditemukan` });
});

// ============================================================
// Global error handler — HARUS punya 4 parameter (err, req, res, next)
// ============================================================
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status  = err.status || 500;
  const message = err.message || "Terjadi kesalahan di server";

  // Jangan expose stack trace ke client di production
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  res.status(status).json({ error: message });
});

module.exports = app;
