const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Menyajikan File Frontend (HTML, CSS, JS)
// Folder frontend berada di dalam folder backend
app.use(express.static(path.join(__dirname, 'frontend')));

// 2. Route Utama (Membuka index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// 3. Konfigurasi Koneksi Database MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Sesuaikan jika MySQL kamu pakai password
    database: 'brothers_clothes_db'
});

// Cek Koneksi Database
db.connect((err) => {
    if (err) {
        console.error('❌ Gagal terhubung ke database MySQL:', err.message);
    } else {
        console.log('✅ Berhasil terhubung ke database MySQL!');
    }
});

// 4. API Endpoint: Ambil Semua Data Produk
app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM products';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error saat mengambil data produk:', err);
            return res.status(500).json({ error: 'Gagal mengambil data produk dari database' });
        }
        res.json(results);
    });
});

// 5. Jalankan Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});