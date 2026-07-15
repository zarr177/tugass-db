// src/server.js
// Entry point — start HTTP server
require("dotenv").config();

const app  = require("./app");
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 B2Camp API berjalan di http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`   Toys available: http://localhost:${PORT}/toys`);
});

// Graceful shutdown — tutup koneksi dengan bersih saat server berhenti
process.on("SIGTERM", () => {
  console.log("SIGTERM diterima. Menutup server...");
  server.close(() => {
    console.log("Server berhasil ditutup.");
    process.exit(0);
  });
});
