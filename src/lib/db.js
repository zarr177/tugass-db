//require("dotenv").config();

const Pool = require('pg').Pool;

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,

});

db.query("SELECT NOW()", (err, res) => { if (err) { 
    console.error("Koneksi ke database gagal:", err);
 } else { 
    console.log("Koneksi ke database berhasil:", res.rows[0]); 
}});

// create table if not exists users (id serial primary key, name varchar(100), email varchar(100) unique, age int);
db.query(`CREATE TABLE IF NOT EXISTS toys (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    stock VARCHAR(100) UNIQUE NOT NULL,
    price INT
);`, (err, res) => {
    if (err) {
        console.error("Gagal membuat tabel toys:", err);
    } else {
        console.log("Tabel toys berhasil dibuat atau sudah ada.");
    }
});

module.exports = db;