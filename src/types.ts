export interface ClientData {
  id: string;
  tipe: "Sales" | "Broker" | "Distributor" | "Partner" | "Calon Mitra";
  perusahaan: string;
  jenis_perusahaan?: string;
  provinsi: string;
  kota: string;
  area: string;
  alamat_detail: string;
  garis_lintang: number;
  garis_bujur: number;
  telepon_kantor: string;
  email_kantor: string;
  nama_penanggung_jawab: string; // PIC of the partner
  id_penjual?: string; // Internal Sales responsible for this partner/client
  nama_penjual?: string; // Cache for the name of the internal sales
  jabatan: string;
  no_hp: string;
  catatan: string;
  status_kemitraan?: "Mitra Aktif" | "Calon Mitra";
  list_produk_kompetitor?: string[];
  value_kompetitor?: string;
}

export interface ProductData {
  id: string;
  nama: string;
  kategori: string;
  merek: string;
  harga_satuan: number;
  harga_normal?: number;
  harga_dasar?: number;
  harga_promo?: number;
  deskripsi?: string;
  spesifikasi?: string[];
  gambar?: string[];
  video?: string;
}

export interface TargetData {
  id: string;
  bulan: number; // 1-12
  tahun: number;
  nilai_sasaran: number; // Target uang
  fokus_produk: string[]; // List ID produk yang menjadi fokus
  catatan?: string;
}

export interface TransactionItem {
  id_produk: string;
  jumlah_unit: number;
  harga_satuan?: number;
}

export interface TransactionData {
  id: string;
  tanggal: string;
  id_mitra: string;
  id_penjual?: string;
  id_produk?: string; // Kept for backwards compatibility
  jumlah_unit?: number; // Kept for backwards compatibility 
  barang?: TransactionItem[];
  total_harga: number;
  status: "Selesai" | "Proses" | "Batal";
  jenis_pembelian?: "Full Payment" | "Sewa" | "Termin" | "Trial" | "Konsinyasi" | string;
}
