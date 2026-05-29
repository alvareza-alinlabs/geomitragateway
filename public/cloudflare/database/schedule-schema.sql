CREATE TABLE IF NOT EXISTS schedules (
  id VARCHAR(50) PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  email_pic VARCHAR(100),
  perusahaan VARCHAR(255),
  telepon VARCHAR(20),
  email_kantor VARCHAR(100),
  sektor_industri VARCHAR(100),
  skala_perusahaan VARCHAR(50),
  alamat_perusahaan TEXT,
  link_maps VARCHAR(255),
  koordinat_maps JSON,
  waktu DATETIME,
  tujuan TEXT,
  produk JSON,
  tipe_jadwal VARCHAR(50),
  status VARCHAR(20),
  diajukan_oleh VARCHAR(50)
);
