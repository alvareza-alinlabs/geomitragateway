import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cloud, Database, Mail, Monitor, Lock, LayoutDashboard, TableProperties, LayoutTemplate, Settings, HelpCircle, Server, Info } from 'lucide-react';
import { AccordionCard } from './AccordionCard';

const DataTableRow = ({ item }: { item: { name: string, desc: string, price: string, originalPrice?: string } }) => {
  const [showDesc, setShowDesc] = useState(false);

  let discountBadge = null;
  if (item.originalPrice) {
    const parsePrice = (priceStr: string) => parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
    const original = parsePrice(item.originalPrice);
    const current = parsePrice(item.price);
    if (original > current && original > 0) {
      const discountPercent = Math.round(((original - current) / original) * 100);
      discountBadge = <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-sans font-bold shadow-sm">-{discountPercent}%</span>;
    }
  }

  return (
    <>
      <tr className="border-b border-[#1E2D3D]/50 hover:bg-[#1E2D3D]/30 transition-colors">
        <td className="w-10 sm:w-12 p-3 sm:p-4 pt-4 sm:pt-4 text-center align-top shrink-0">
          <button 
            className="mt-0.5 sm:mt-0 text-gray-400 hover:text-[#0096D6] focus:outline-none"
            onClick={() => setShowDesc(!showDesc)}
            title="Lihat Deskripsi"
          >
            <Info size={18} className={showDesc ? "text-[#0096D6]" : ""} />
          </button>
        </td>
        <td className="p-3 sm:p-4 pt-4 sm:pt-4 text-white font-medium align-top">
          {item.name}
        </td>
        <td className="p-4 text-gray-400 align-top hidden sm:table-cell">{item.desc}</td>
        <td className="p-4 text-right font-mono align-top whitespace-nowrap">
          {item.originalPrice && (
            <div className="flex items-center justify-end gap-1.5 mb-0.5">
              <span className="text-gray-500 line-through text-xs">{item.originalPrice}</span>
              {discountBadge}
            </div>
          )}
          <span className="text-white">{item.price}</span>
        </td>
      </tr>
      {showDesc && (
        <tr className="sm:hidden bg-[#152B46]/30">
          <td colSpan={3} className="p-4 pt-3 pb-4 text-sm text-gray-300 border-b border-[#1E2D3D]/50">
            <strong className="text-[#0096D6] mb-1 block">Deskripsi Layanan:</strong> {item.desc}
          </td>
        </tr>
      )}
    </>
  );
}

const DataTable = ({ items, total }: { items: { name: string, desc: string, price: string, originalPrice?: string }[], total: string }) => (
  <div className="p-0">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#1E2D3D]/50 text-gray-300 text-sm border-b border-[#1E2D3D]">
            <th className="w-10 sm:w-12 p-3 sm:p-4 text-center"></th>
            <th className="p-3 sm:p-4 font-semibold whitespace-nowrap lg:whitespace-normal min-w-[150px]">Layanan</th>
            <th className="p-3 sm:p-4 font-semibold hidden sm:table-cell w-full">Deskripsi</th>
            <th className="p-3 sm:p-4 font-semibold text-right whitespace-nowrap">Harga</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <DataTableRow item={item} />
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdditionalServiceRow = ({ item }: { item: any }) => {
  const [showDesc, setShowDesc] = useState(false);

  const renderPrice = (priceStr: string, originalPriceStr?: string) => {
    let discountBadge = null;
    if (originalPriceStr) {
      const parsePrice = (p: string) => parseInt(p.replace(/[^0-9]/g, ''), 10);
      const original = parsePrice(originalPriceStr);
      const current = parsePrice(priceStr);
      if (original > current && original > 0) {
        const discountPercent = Math.round(((original - current) / original) * 100);
        discountBadge = <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-sans font-bold shadow-sm">-{discountPercent}%</span>;
      }
    }
    return (
      <div className="flex flex-col items-center justify-center">
        {originalPriceStr && (
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <span className="text-gray-500 line-through text-[10px]">{originalPriceStr}</span>
            {discountBadge}
          </div>
        )}
        <div className="whitespace-nowrap">
          {priceStr}
          <span className="text-[10px] text-gray-500 ml-0.5">/baris</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <tr className="border-b border-[#1E2D3D]/50 hover:bg-[#1E2D3D]/30 transition-colors">
        <td className="w-10 sm:w-12 p-3 sm:p-4 pt-4 sm:pt-4 text-center align-top shrink-0">
          <button 
            className="mt-0.5 sm:mt-0 text-gray-400 hover:text-[#0096D6] focus:outline-none"
            onClick={() => setShowDesc(!showDesc)}
            title="Lihat Deskripsi"
          >
            <Info size={16} className={showDesc ? "text-[#0096D6]" : ""} />
          </button>
        </td>
        <td className="p-3 sm:p-4 pt-4 sm:pt-4 text-white font-medium align-top leading-tight min-w-[120px]">
          {item.name}
        </td>
        <td className="p-4 text-gray-400 align-top hidden md:table-cell min-w-[200px]">{item.desc}</td>
        <td className="p-3 sm:p-4 text-white text-center font-mono align-top align-middle">
          {renderPrice(item.price1, item.originalPrice1)}
        </td>
        <td className="p-3 sm:p-4 text-white text-center font-mono align-top align-middle">
          {renderPrice(item.price2, item.originalPrice2)}
        </td>
        <td className="p-3 sm:p-4 text-white text-center font-mono align-top align-middle">
          {renderPrice(item.price3, item.originalPrice3)}
        </td>
      </tr>
      {showDesc && (
        <tr className="md:hidden bg-[#152B46]/30">
          <td colSpan={6} className="p-4 pt-3 pb-4 text-xs sm:text-sm text-gray-300 border-b border-[#1E2D3D]/50">
            <strong className="text-[#0096D6] mb-1 block">Deskripsi Layanan:</strong> {item.desc}
          </td>
        </tr>
      )}
    </>
  );
};

export const RincianBiayaTab = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="text-center mb-8 bg-[#0F223A] p-6 rounded-xl border border-[#1E2D3D] flex flex-col items-center justify-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Rincian Anggaran</h2>
          <p className="text-sm text-gray-400 mt-1">Daftar biaya pengembangan modul & infrastruktur sistem.</p>
        </div>
        <div className="mt-6 flex flex-col items-center justify-center">
            <p className="text-gray-400 text-sm mb-1">Total Akumulasi</p>
            <div className="flex items-center justify-center gap-2 mb-1">
              <p className="line-through text-gray-500 font-medium">Rp10.530.000</p>
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded font-sans font-bold shadow-sm">-40%</span>
            </div>
            <p className="text-3xl font-black text-[#0096D6] leading-tight">Rp6.352.500</p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <AccordionCard icon={Cloud} title="Infrastruktur Publikasi & Jaringan" total="Rp465.000" defaultOpen={true}>
          <DataTable 
            items={[
              { name: "Domain .com (1 Tahun)", desc: "Registrasi dan kepemilikan domain .com selama 1 tahun", price: "Rp160.000", originalPrice: "Rp250.000" },
              { name: "Setup DNS & Konfigurasi Domain", desc: "Pengaturan nameserver, DNS record, verifikasi domain, dan koneksi domain ke server produksi", price: "Rp115.000", originalPrice: "Rp200.000" },
              { name: "Setup Hosting Cloud (Vercel)", desc: "Konfigurasi project, environment variables, build settings, deployment production, dan optimasi dasar", price: "Rp100.000", originalPrice: "Rp175.000" },
              { name: "Continuous Deployment (CI/CD)", desc: "Integrasi repository GitHub dengan Vercel agar update kode dapat ter-deploy otomatis", price: "Rp50.000", originalPrice: "Rp80.000" },
              { name: "SSL/HTTPS & Security Setup", desc: "Aktivasi sertifikat SSL, konfigurasi HTTPS, redirect keamanan, dan validasi akses domain", price: "Rp40.000", originalPrice: "Rp75.000" },
            ]}
            total="Rp465.000"
          />
        </AccordionCard>

        <AccordionCard icon={Database} title="Database & Backend Integration" total="Rp500.000">
          <DataTable 
            items={[
              { name: "Perancangan Skema Database", desc: "Struktur tabel dan relasi data untuk pengguna, produk, appointment, transaksi, dan kebutuhan lainnya", price: "Rp150.000", originalPrice: "Rp250.000" },
              { name: "Setup Database Cloudflare D1", desc: "Pembuatan environment, inisialisasi database, dan koneksi ke aplikasi", price: "Rp75.000", originalPrice: "Rp125.000" },
              { name: "API & Backend CRUD", desc: "Pembuatan fitur Create, Read, Update, Delete sesuai kebutuhan", price: "Rp175.000", originalPrice: "Rp300.000" },
              { name: "Integrasi Frontend ke Database", desc: "Menghubungkan frontend, dashboard, dan modul agar data tersimpan real-time", price: "Rp100.000", originalPrice: "Rp150.000" },
            ]}
            total="Rp500.000"
          />
        </AccordionCard>

        <AccordionCard icon={Mail} title="Email Marketing & Broadcast" total="Rp500.000">
          <DataTable 
            items={[
              { name: "Sistem Broadcast Email", desc: "Pengiriman email massal ke database pelanggan atau prospek", price: "Rp150.000", originalPrice: "Rp250.000" },
              { name: "Manajemen Daftar Kontak", desc: "Penyimpanan dan pengelolaan daftar penerima email marketing", price: "Rp100.000", originalPrice: "Rp150.000" },
              { name: "Template Campaign Email", desc: "Pembuatan template email promosi atau newsletter perusahaan", price: "Rp100.000", originalPrice: "Rp150.000" },
              { name: "Penjadwalan & Pengiriman Campaign", desc: "Pengaturan jadwal dan otomatisasi pengiriman email campaign", price: "Rp150.000", originalPrice: "Rp250.000" },
            ]}
            total="Rp500.000"
          />
        </AccordionCard>

        <AccordionCard icon={Monitor} title="Halaman Publik (Front-End)" total="Rp1.125.000">
          <DataTable 
            items={[
              { name: "Beranda (Landing Page Utama)", desc: "Hero banner interaktif, insight perusahaan, animasi scroll, CTA, dan layout responsif", price: "Rp600.000", originalPrice: "Rp1.000.000" },
              { name: "Katalog Produk Publik", desc: "Sistem pencarian interaktif, filter kategori, popup rekomendasi, dan grid produk", price: "Rp200.000", originalPrice: "Rp350.000" },
              { name: "Detail Produk Publik", desc: "Galeri foto, spesifikasi lengkap, variasi harga, dan tombol cetak penawaran", price: "Rp125.000", originalPrice: "Rp200.000" },
              { name: "Formulir Konsultasi (Appointment)", desc: "Form input data klien, pemilihan jadwal meeting, dan navigasi mobile", price: "Rp200.000", originalPrice: "Rp350.000" },
            ]}
            total="Rp1.125.000"
          />
        </AccordionCard>

        <AccordionCard icon={Lock} title="Otentikasi" total="Rp150.000">
          <DataTable 
            items={[
              { name: "Halaman Login", desc: "Form input kredensial aman, validasi login, dan proteksi rute dashboard", price: "Rp150.000", originalPrice: "Rp250.000" },
            ]}
            total="Rp150.000"
          />
        </AccordionCard>

        <AccordionCard icon={LayoutDashboard} title="Dasbor Administratif" total="Rp900.000">
          <DataTable 
            items={[
              { name: "Ringkasan (Dashboard Utama)", desc: "Dashboard statistik dan ringkasan informasi utama", price: "Rp500.000", originalPrice: "Rp850.000" },
              { name: "Peta Distribusi (Partner & Sales)", desc: "Visualisasi persebaran partner/klien dan area sales lengkap dengan tooltip", price: "Rp400.000", originalPrice: "Rp650.000" },
            ]}
            total="Rp900.000"
          />
        </AccordionCard>

        <AccordionCard icon={TableProperties} title="Manajemen Data & Tabel" total="Rp1.475.000">
          <DataTable 
            items={[
              { name: "Daftar Mitra / Database", desc: "Tabel daftar klien/mitra dengan pencarian dan aksi manajemen data", price: "Rp200.000", originalPrice: "Rp350.000" },
              { name: "Detail Mitra/Klien", desc: "Rincian data perusahaan/klien dan riwayat kerja sama", price: "Rp150.000", originalPrice: "Rp250.000" },
              { name: "Daftar Penjualan (Sales)", desc: "Tabel aktivitas penjualan dan tracking konversi", price: "Rp200.000", originalPrice: "Rp350.000" },
              { name: "Daftar Transaksi", desc: "Riwayat transaksi, arus dana, dan persetujuan order", price: "Rp200.000", originalPrice: "Rp350.000" },
              { name: "Detail Transaksi", desc: "Tampilan detail transaksi berbentuk invoice atau struk digital", price: "Rp150.000", originalPrice: "Rp250.000" },
              { name: "Manajemen Produk", desc: "Tabel inventaris dan katalog produk internal", price: "Rp100.000", originalPrice: "Rp150.000" },
              { name: "Detail Produk (Internal)", desc: "Spesifikasi teknis, stok, dan informasi internal produk", price: "Rp75.000", originalPrice: "Rp125.000" },
              { name: "Jadwal & Agenda", desc: "Timeline meeting, agenda kegiatan, dan kalender jadwal klien", price: "Rp250.000", originalPrice: "Rp400.000" },
              { name: "Detail Jadwal / Agenda", desc: "Informasi waktu, peserta rapat, dan catatan hasil konsultasi", price: "Rp150.000", originalPrice: "Rp250.000" },
            ]}
            total="Rp1.475.000"
          />
        </AccordionCard>

        <AccordionCard icon={LayoutTemplate} title="Halaman Formulir Data" total="Rp587.500">
          <DataTable 
            items={[
              { name: "Form Tambah Mitra Baru", desc: "Input identitas klien/badan usaha dan data lokasi", price: "Rp100.000", originalPrice: "Rp150.000" },
              { name: "Form Tambah Produk", desc: "Upload gambar produk, harga, kategori, dan spesifikasi", price: "Rp62.500", originalPrice: "Rp100.000" },
              { name: "Form Tambah Penjualan", desc: "Form pencatatan progres dan aktivitas sales", price: "Rp100.000", originalPrice: "Rp150.000" },
              { name: "Form Tambah Transaksi", desc: "Form pencatatan transaksi operasional dan finansial", price: "Rp125.000", originalPrice: "Rp200.000" },
              { name: "Form Tambah Jadwal/Agenda", desc: "Form penjadwalan pertemuan dan agenda kegiatan", price: "Rp100.000", originalPrice: "Rp150.000" },
              { name: "Form Tambah/Edit Akses User", desc: "Pembuatan akun dan kredensial login pegawai", price: "Rp100.000", originalPrice: "Rp150.000" },
            ]}
            total="Rp587.500"
          />
        </AccordionCard>

        <AccordionCard icon={Settings} title="Pengaturan & Konfigurasi" total="Rp650.000">
          <DataTable 
            items={[
              { name: "Konfigurasi Landing Page", desc: "Pengelolaan hero section, teks, dan gambar dinamis", price: "Rp300.000", originalPrice: "Rp500.000" },
              { name: "Manajemen Akses User", desc: "Pengaturan akses admin dan user", price: "Rp200.000", originalPrice: "Rp350.000" },
              { name: "Pengaturan Sistem", desc: "Pengaturan preferensi dasar aplikasi", price: "Rp150.000", originalPrice: "Rp250.000" },
            ]}
            total="Rp650.000"
          />
        </AccordionCard>

        <div className="pt-6 pb-2 border-t border-[#1E2D3D] text-center sm:text-left mt-8">
           <h3 className="text-xl font-bold text-white mb-1">Layanan Opsional</h3>
           <p className="text-sm text-gray-400">Pilih layanan tambahan yang tersedia jika diperlukan di kemudian hari.</p>
        </div>
        
        <AccordionCard icon={Database} title="Migrasi & Salin Data">
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1E2D3D]/50 text-gray-300 text-xs sm:text-sm border-b border-[#1E2D3D]">
                  <th className="w-10 sm:w-12 p-3 sm:p-4 text-center"></th>
                  <th className="p-3 sm:p-4 font-semibold w-1/3 sm:w-auto min-w-[120px]">Paket Salin Data</th>
                  <th className="p-3 sm:p-4 font-semibold hidden md:table-cell w-4/12 min-w-[200px]">Deskripsi</th>
                  <th className="p-3 sm:p-4 font-semibold text-center whitespace-nowrap">0–1000 Data</th>
                  <th className="p-3 sm:p-4 font-semibold text-center whitespace-nowrap">1000–2500 Data</th>
                  <th className="p-3 sm:p-4 font-semibold text-center whitespace-nowrap">5000+ Data</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm">
                {[
                  { name: 'Salin Dasar', desc: 'Import data dari Excel ke database, penyesuaian kolom, dan perapihan format dasar', price1: 'Rp1.000', originalPrice1: 'Rp1.500', price2: 'Rp750', originalPrice2: 'Rp1.250', price3: 'Rp500', originalPrice3: 'Rp850' },
                  { name: 'Salin + Validasi', desc: 'Import data, standarisasi penulisan, perbaikan format, dan penghapusan duplikat', price1: 'Rp1.750', originalPrice1: 'Rp2.500', price2: 'Rp1.250', originalPrice2: 'Rp1.850', price3: 'Rp850', originalPrice3: 'Rp1.350' },
                  { name: 'Validasi + Geocoding', desc: 'Seluruh fitur Salin + Validasi ditambah konversi alamat menjadi koordinat Latitude & Longitude', price1: 'Rp3.000', originalPrice1: 'Rp4.500', price2: 'Rp2.250', originalPrice2: 'Rp3.500', price3: 'Rp1.500', originalPrice3: 'Rp2.350' }
                ].map((item, idx) => (
                  <React.Fragment key={idx}>
                    <AdditionalServiceRow item={item} />
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-[#0F223A]/50 border-t border-[#1E2D3D] text-xs text-gray-400 flex items-start gap-2">
             <HelpCircle size={16} className="text-[#0096D6] shrink-0 mt-0.5" />
             <p>Biaya ini adalah hitungan per baris data dari Excel klien untuk dimasukkan ke sistem. Harga turun jika data lebih banyak.</p>
          </div>
        </AccordionCard>
        
        <AccordionCard icon={Server} title="Maintenance">
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1E2D3D]/50 text-gray-300 text-xs sm:text-sm border-b border-[#1E2D3D]">
                  <th className="p-4 font-semibold w-1/4 sm:w-auto min-w-[120px]">Paket Maintenance</th>
                  <th className="p-4 font-semibold hidden md:table-cell w-1/2 min-w-[200px]">Fasilitas Termasuk</th>
                  <th className="p-4 font-semibold text-right whitespace-nowrap">Biaya per Bulan</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm">
                <tr className="border-b border-[#1E2D3D]/50 hover:bg-[#1E2D3D]/30 transition-colors">
                  <td className="p-3 sm:p-4 text-white font-medium align-top leading-tight min-w-[120px]">Basic Maintenance</td>
                  <td className="p-4 text-gray-400 align-top hidden md:table-cell min-w-[200px]">Pengecekan server rutin, backup mingguan, dan minor bug fixing.</td>
                  <td className="p-3 sm:p-4 text-white text-right font-mono align-top whitespace-nowrap">Rp150.000</td>
                </tr>
                <tr className="border-b border-[#1E2D3D]/50 hover:bg-[#1E2D3D]/30 transition-colors">
                  <td className="p-3 sm:p-4 text-white font-medium align-top leading-tight min-w-[120px]">Pro Maintenance</td>
                  <td className="p-4 text-gray-400 align-top hidden md:table-cell min-w-[200px]">Pemantauan 24/7, backup harian otomatis, optimalisasi performa, prioritas support, dan minor bug fixing.</td>
                  <td className="p-3 sm:p-4 text-white text-right font-mono align-top whitespace-nowrap">Rp350.000</td>
                </tr>
                <tr className="border-b border-[#1E2D3D]/50 hover:bg-[#1E2D3D]/30 transition-colors">
                  <td className="p-3 sm:p-4 text-white font-medium align-top leading-tight min-w-[120px]">Custom Maintenance</td>
                  <td className="p-4 text-gray-400 align-top hidden md:table-cell min-w-[200px]">Fasilitas disesuaikan dengan kebutuhan khusus perusahaan.</td>
                  <td className="p-3 sm:p-4 text-gray-400 text-right font-mono align-top whitespace-nowrap italic">Hubungi Kami</td>
                </tr>
              </tbody>
            </table>
          </div>
        </AccordionCard>
      </div>
    </motion.div>
  );
};
