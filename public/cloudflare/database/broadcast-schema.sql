CREATE TABLE IF NOT EXISTS broadcasts (
  id VARCHAR(50) PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  tanggal DATETIME NOT NULL,
  tipe VARCHAR(50),
  template_isi TEXT,
  status VARCHAR(20) DEFAULT 'Draft',
  klien_sasaran JSON
);
