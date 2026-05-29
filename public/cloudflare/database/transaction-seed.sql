INSERT OR REPLACE INTO transactions (id, tanggal, id_mitra, barang, total_harga, status, jenis_pembelian) VALUES 
('TRX-001', '2026-01-15', 'S001', json('[{"id_produk": "P001", "jumlah_unit": 7, "harga_total": 175000000}]'), 175000000, 'Selesai', 'Full Payment'),
('TRX-002', '2026-01-20', 'D001', json('[{"id_produk": "P002", "jumlah_unit": 2, "harga_total": 90000000}]'), 90000000, 'Selesai', 'Sewa'),
('TRX-003', '2026-02-10', 'S001', json('[{"id_produk": "P003", "jumlah_unit": 3, "harga_total": 16500000}]'), 16500000, 'Selesai', 'Full Payment'),
('TRX-004', '2026-02-25', 'E001', json('[{"id_produk": "P006", "jumlah_unit": 2, "harga_total": 64000000}]'), 64000000, 'Proses', 'Termin'),
('TRX-005', '2026-03-05', 'E002', json('[{"id_produk": "P004", "jumlah_unit": 1, "harga_total": 12000000}]'), 12000000, 'Selesai', 'Full Payment'),
('TRX-006', '2026-03-21', 'S002', json('[{"id_produk": "P005", "jumlah_unit": 15, "harga_total": 52500000}]'), 52500000, 'Selesai', 'Trial'),
('TRX-007', '2026-04-12', 'D001', json('[{"id_produk": "P001", "jumlah_unit": 4, "harga_total": 100000000}]'), 100000000, 'Selesai', 'Sewa'),
('TRX-008', '2026-04-28', 'E002', json('[{"id_produk": "P002", "jumlah_unit": 5, "harga_total": 225000000}]'), 225000000, 'Selesai', 'Full Payment'),
('TRX-009', '2026-05-18', 'S001', json('[{"id_produk": "P001", "jumlah_unit": 2, "harga_total": 50000000}, {"id_produk": "P003", "jumlah_unit": 1, "harga_total": 5500000}]'), 55500000, 'Selesai', 'Full Payment'),
('TRX-010', '2026-05-22', 'S002', json('[{"id_produk": "P005", "jumlah_unit": 20, "harga_total": 70000000}]'), 70000000, 'Selesai', 'Trial');
