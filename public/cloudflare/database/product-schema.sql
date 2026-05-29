-- Jika tabel sudah ada dan terjadi error karena kolom video belum ada, jalankan baris berikut di D1 Console Anda secara terpisah:
-- ALTER TABLE products ADD COLUMN video TEXT;

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  kategori VARCHAR(100),
  merek VARCHAR(100),
  harga_satuan DECIMAL(15, 2),
  harga_normal DECIMAL(15, 2),
  harga_dasar DECIMAL(15, 2),
  harga_promo DECIMAL(15, 2),
  deskripsi TEXT,
  spesifikasi JSON,
  gambar JSON,
  video TEXT
);
