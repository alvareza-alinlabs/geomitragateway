CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(50) PRIMARY KEY,
  tanggal DATETIME NOT NULL,
  id_mitra VARCHAR(50),
  id_penjual VARCHAR(50),
  id_produk VARCHAR(50),
  jumlah_unit INTEGER DEFAULT 1,
  barang JSON,
  total_harga DECIMAL(15, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending',
  jenis_pembelian VARCHAR(50)
);
