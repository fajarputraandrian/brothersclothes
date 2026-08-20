const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'brothers_clothes_db'
});

db.connect((err) => {
    if (err) {
        console.error('Koneksi Database Gagal:', err);
    } else {
        console.log('Berhasil terhubung ke database MySQL!');
    }
});

module.exports = db;