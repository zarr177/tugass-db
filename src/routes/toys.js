const express = require("express");
const router  = express.Router();
const db = require("../lib/db");

const userData = [];

// GET /users
router.get("/", async (req, res) => {
const { name, stock, price } = req.query;
  const data = await db.query("SELECT * FROM toys");
  res.json(data.rows);
});

//post in router
router.post("/", async (req, res) => {
  console.log("Menerima request POST /toys dengan body:", req.body);

  //creaate user in database
  const { name, stock, price } = req.body;

  //validate if email already exists in database
  const toysExists = await db.query("SELECT * FROM toys WHERE stock = $1", [
    stock,
  ]);
  if (toysExists.rows.length > 0) {
    return res.status(400).json({ error: "stock ini sudah digunakan" });
  }

  const createToys = await db.query(
    "INSERT INTO toys (name, stock, price) VALUES ($1, $2, $3) RETURNING *",
    [name, stock, price],
  );
  res.status(201).json(createToys.rows[0]);
});

   //   const { name, email, age } = req.body;
   //   const newUser = { id: userData.length + 1, name: name, email: email, age: age};
   //   userData.push(newUser);
   //   res.status(201).json(newUser);


 // DELETE /toys/:id
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

// PUT /toys/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, stock, price } = req.body;

    const result = await db.query(
      `UPDATE toys
       SET name = $1,
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


module.exports = router;