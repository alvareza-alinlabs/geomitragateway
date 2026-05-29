CREATE TABLE IF NOT EXISTS targets (
  id VARCHAR(50) PRIMARY KEY,
  bulan INTEGER NOT NULL,
  tahun INTEGER NOT NULL,
  nilai_sasaran DECIMAL(15, 2) DEFAULT 0.00,
  fokus_produk JSON,
  catatan TEXT
);
