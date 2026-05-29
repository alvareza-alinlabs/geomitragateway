# Geo Mitra Gateway - Ekosistem IT & Solusi Terpadu

## 📌 Tentang Proyek Ini
**Geo Mitra Gateway** adalah platform digital komprehensif yang dirancang sebagai pusat ekosistem kemitraan IT, distributor, dan penyedia solusi teknologi. Sistem ini menyediakan portal utama untuk integrasi pemetaan secara langsung, manajemen transaksi, inventaris produk, jadwal penugasan (schedule), dan pengelolaan data kemitraan (Distributor, Partner, End User).

**Dikembangkan secara resmi oleh:**
**AlinLabs Indonesia**  
🌐 **Website:** [www.alinlabs.biz.id](https://www.alinlabs.biz.id)  

---

## 🚀 Arsitektur & Teknologi Utama
Aplikasi ini dibangun menggunakan arsitektur *Single Page Application* (SPA) berbasis web modern yang dioptimalkan untuk skalabilitas tinggi, kecepatan muat data yang responsif, serta kestabilan untuk menampung volume data ekosistem yang besar. 

Teknologi yang digunakan meliputi:
- **Core Framework:** React 19 dengan TypeScript dan Vite (Bundler).
- **Styling & UI:** Tailwind CSS v4, dikombinasikan dengan Framer Motion (`motion/react`) untuk animasi serta transisi routing yang halus.
- **Geospasial & Maps:** Leaflet & React-Leaflet untuk visualisasi spasial partner IT dari seluruh jaringan di wilayah Indonesia, terintegrasi dengan API Geocoding (Nominatim OpenStreetMap & BigDataCloud).
- **Database & Backend:** Cloudflare D1 (Serverless SQL Database) via API dan Cloudflare Workers untuk memproses data berkinerja tinggi dan stabil dengan latensi minimum.
- **Caching System Ganda (Smart Cache):** Manajemen cache dua tingkat yang dinamis menggunakan antarmuka Service Worker bayangan / Custom Fetch Interceptor (`window.fetch`). Fitur ini menggunakan kombinasi **RAM (Memory Cache)** dan **LocalStorage**, sehingga penggunaan memori peramban tidak berlebihan meskipun memuat hingga 3GB modul di latar belakang, memberikan perpindahan rute antar halaman secara instan (Zero Loading).

---

## 🛠️ Fitur & Modul Utama
Sistem ini terdiri dari antarmuka Web Publik (Katalog) dan kapabilitas Sistem Dasbor Internal.

### 1. Modul Publik (Portal Klien)
- **Landing Page Interaktif:** Menyajikan profil Geo Mitra Gateway, layanan, testimoni (Insights) serta navigasi yang terintegrasi.
- **Katalog Produk:** Platform penelusuran produk CCTV, Jaringan, Akses Kontrol, Komputer, dan periferal lainnya secara publik untuk mempercepat siklus penjualan (sales cycle).
- **Invoice Portal:** Halaman statik rincian invoice / biaya dan kanal pembayaran yang siap dipanggil kepada pengguna spesifik (Billing System).
- **Portal Perjanjian (Appointment):** Kemampuan untuk melakukan reservasi dan penjadwalan langsung dengan representasi kalender untuk klien dan agen sales.

### 2. Administrator & Dashboard (Internal)
Sistem internal canggih untuk memantau performa jaringan dan mengelola basis data secara *real-time*:
- **Peta Ekosistem (Interactive Map):** Menampilkan pemetaan titik-lokasi kordinat partner, calon mitra, hingga distributor secara aktual di peta digital.
- **Manajemen Klien & Jaringan (Partner & Sales):** Pendataan PIC, lokasi, hingga status verifikasi (Distributor, Calon Mitra, Mitra Aktif).
- **Manajemen Produk (Inventory Management):** Penyesuaian stok produk (SKU), harga jual normal/promo, kategori, hingga unit dan visual barang.
- **Transaksi & Order:** Mengelola nota, termin pembayaran (Lunas, Sebagian, Belum Lunas), unit transaksi, dan status tagihan. Termasuk pembuatan tagihan yang terhubung ke data partner.
- **Penjadwalan (Scheduling):** Dasbor untuk menyusun rute tim sales lapangan (kanvasing) termasuk status *follow up* (Follow Up, Closing, Meeting). 
- **Broadcast & Komunikasi:** Alat pengiriman informasi massal kepada agen, reseller atau jaringan pembeli menggunakan riwayat integrasi WhatsApp & Email.
- **Konfigurasi Target & Insight:** Manajemen pencapaian kuota transaksi tim, persentase nilai target pemasaran, hingga analitik data.

---

## 🧠 Smart Caching Engine (Performa Kecepatan)
AlinLabs Indonesia secara khusus merancang mesin cache canggih di `src/main.tsx` untuk menjaga alokasi Memori / RAM Browser selalu ringan.
- **Fallback Database Lokal:** Jika koneksi API memburuk, sistem memiliki mekanisme *fallback* kepada file stastis (`.json`) sementara.
- **Intersepsi Fetch (`window.fetch`):** Memblokir, menampung, dan menyimpan kueri-kueri berulang untuk menghemat beban basis data Cloudflare D1. Secara cerdas menyimpan *query string* panjang (hingga batas aman 20 query memory) yang akan ditransfer otomatis pada LocalStorage dan dihancurkan dari memori aktif untuk mencegah RAM bocor (Memory Leak).
- **Pembersihan Otomatis Saat Mutasi (Garbage Collection):** Jika teridentifikasi metode `POST`, `PUT`, `DELETE`, sistem otomatis melenyapkan cache tanpa perlu memuat ulang peramban secara keseluruhan (Seamless Reactivity).

---

## 📞 Informasi Pengembang / Developer
Aplikasi, Source Code dan Basis Sistem ini dirancang dari tahap inkubasi, UI/UX (User Interface / User Experience), arsitektur alur kerja, hingga tahap terdistribusi produksi oleh:

🏛️ **AlinLabs Indonesia** 
> *Software House & Web Development and AI Integration Specialist.*

- **Situs Web:** [https://www.alinlabs.biz.id](https://www.alinlabs.biz.id)
- **Tahun Rilis:** 2026 
- **Lisensi & Hak Cipta:** Proprietary/Internal use untuk Geo Mitra Gateway. Modifikasi inti atau pendistribusian di luar kontrak pengembangan yang telah disepakati memerlukan konfirmasi legal AlinLabs.

Terima kasih atas kepercayaannya dalam menggunakan solusi rancangan kami. Kami memastikan skalabilitas jangka panjang serta peningkatan yang berkesinambungan secara adaptif dan tangguh pada server produksi Anda!
