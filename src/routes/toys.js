const express = require("express");
const router = express.Router();
const db = require("../lib/db");

// ==============================
// GET /toys
// ==============================
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM toys ORDER BY id ASC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Terjadi kesalahan pada server.",
    });
  }
});

// ==============================
// GET /toys/:id
// ==============================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "SELECT * FROM toys WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Data tidak ditemukan.",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Terjadi kesalahan pada server.",
    });
  }
});

// ==============================
// POST /toys
// ==============================
router.post("/", async (req, res) => {
  try {
    const { name, stock, price } = req.body;

    // Validasi input
    if (!name || !stock || price == null) {
      return res.status(400).json({
        error: "name, stock, dan price wajib diisi.",
      });
    }

    // Cek stock sudah ada atau belum
    const toysExists = await db.query(
      "SELECT * FROM toys WHERE stock = $1",
      [stock]
    );

    if (toysExists.rows.length > 0) {
      return res.status(400).json({
        error: "Stock ini sudah digunakan.",
      });
    }

    // Insert data
    const result = await db.query(
      `INSERT INTO toys (name, stock, price)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, stock, price]
    );

    res.status(201).json({
      message: "Data berhasil ditambahkan.",
      data: result.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Terjadi kesalahan pada server.",
    });
  }
});

// ==============================
// PUT /toys/:id
// ==============================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, stock, price } = req.body;

    if (!name || !stock || price == null) {
      return res.status(400).json({
        error: "name, stock, dan price wajib diisi.",
      });
    }

    const result = await db.query(
      `UPDATE toys
       SET
         name = $1,
         stock = $2,
         price = $3
       WHERE id = $4
       RETURNING *`,
      [name, stock, price, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Data tidak ditemukan.",
      });
    }

    res.status(200).json({
      message: "Data berhasil diperbarui.",
      data: result.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Terjadi kesalahan pada server.",
    });
  }
});

// ==============================
// DELETE /toys/:id
// ==============================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "DELETE FROM toys WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Data tidak ditemukan.",
      });
    }

    res.status(200).json({
      message: "Data berhasil dihapus.",
      data: result.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Terjadi kesalahan pada server.",
    });
  }
});

module.exports = router;