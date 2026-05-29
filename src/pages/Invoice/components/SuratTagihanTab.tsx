import React from 'react';
import { motion } from 'motion/react';
import QRCode from "react-qr-code";
import { RegularCard } from './RegularCard';

export const SuratTagihanTab = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <RegularCard className="bg-gradient-to-b from-[#0F223A] to-[#0A192F] relative shadow-2xl">
        {/* Header Invoice Letter */}
        <div className="p-5 sm:p-10 border-b border-[#1E2D3D]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4 sm:mb-6">
                <img src="/gambar/alinlabs-logo.png" alt="AlinLabs" className="h-10 w-auto" />
                <div>
                  <h2 className="text-xl sm:text-3xl font-bold text-white">INVOICE</h2>
                  <p className="text-[#0096D6] font-mono text-sm sm:text-base">Nomor : INV/2026/05/0012</p>
                </div>
              </div>
              
              <div className="text-xs sm:text-sm text-gray-400 space-y-1">
                <p className="text-white font-semibold">Diterbitkan oleh:</p>
                <p>AlinLabs Indonesia</p>
                <p>Pengembang Sistem & Solusi Digital</p>
              </div>
            </div>
            
            <div className="text-left sm:text-right text-xs sm:text-sm text-gray-400 bg-[#050B14] p-3 sm:p-4 rounded-lg border border-[#1E2D3D] self-start w-full sm:w-auto">
              <p className="text-white font-semibold mb-2">Kepada Yth:</p>
              <p className="text-white">Bpk. Harry M. Gultom</p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-10 space-y-4 sm:space-y-6 text-xs sm:text-base leading-relaxed text-gray-300 text-justify">
          <p>Dengan hormat,</p>
          <p>
            Terima kasih atas kepercayaannya menunjuk <strong>AlinLabs Indonesia</strong> sebagai mitra dalam merancang dan mengembangkan platform otomasi bisnis dan ekosistem IT untuk <strong>Geo Mitra Gateway</strong>. Pemesanan proyek ini dilakukan pada tanggal <strong>23 Mei 2026</strong>, dengan estimasi penyelesaian final pada <strong>2 Juni 2026</strong>.
          </p>
          <p>
            Geo Mitra Gateway dirancang sebagai platform portal digital komprehensif yang menjadi pusat ekosistem kemitraan IT. Fungsi utama sistem ini meliputi penyajian katalog produk publik yang interaktif, serta Dasbor Internal (Back-Office) berskala enterprise untuk pengelolaan titik-lokasi mitra (Interactive Map), transaksi B2B, penjadwalan sales (schedule), manajemen inventaris, dan broadcast informasi guna mendukung akselerasi bisnis secara terpusat.
          </p>
          <p>
            Melalui dokumen ini, kami bermaksud menyampaikan rincian tagihan biaya keseluruhan untuk pembangunan sistem berbasis web dan dashboard operasional yang telah disepakati. Rincian detail dari masing-masing modul dapat dilihat pada tab <strong>Rincian Biaya</strong>.
          </p>

          <div className="bg-[#152B46] p-4 sm:p-6 rounded-lg my-6 sm:my-8 text-left text-sm sm:text-base space-y-4">
            <h3 className="text-center font-bold text-white text-lg sm:text-xl pb-2 border-b border-[#1E2D3D] mb-4">RIWAYAT PEMESANAN</h3>
            <div>
              <p className="text-gray-300 mb-1">Nomor Pemesanan:</p>
              <p className="text-gray-300 font-bold">ORD/0012/04/26/WB</p>
            </div>
            <div>
              <p className="text-gray-300 mb-1">Tanggal Pemesanan:</p>
              <p className="text-gray-300 font-bold">23 Mei 2026</p>
            </div>
            <div>
              <p className="text-gray-300 mb-1">Estimasi Selesai:</p>
              <p className="text-gray-300 font-bold">2 Juni 2026</p>
            </div>
            <div>
              <p className="text-gray-300 mb-1">Harga Normal:</p>
              <div className="flex items-center gap-2">
                <p className="text-gray-300 font-bold line-through">Rp10.530.000</p>
                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-sans font-bold">-40%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-300 mb-1">Harga Promosi:</p>
              <p className="text-gray-300 font-bold">Rp6.352.500</p>
            </div>
          </div>

          <p>
            Kami sangat bersemangat dan bangga dapat berkontribusi dalam perjalanan dan inovasi digital Geo Mitra Gateway. Harapan kami, platform inovatif ini dapat mendatangkan efisiensi, nilai lebih, dan skalabilitas tinggi bagi pertumbuhan bisnis Anda. Jika ada pertanyaan, jangan ragu untuk menghubungi tim kami yang selalu siap sedia merespon dan membantu Anda dengan sepenuh hati.
          </p>

          <div className="pt-4 sm:pt-6 pb-2 flex justify-end">
            <div className="text-center">
              <p className="text-gray-400 mb-2 sm:mb-4 whitespace-nowrap text-xs sm:text-sm text-center">Hormat kami,</p>
              <div className="flex justify-center mb-2">
                <div className="bg-white p-1 rounded">
                  <QRCode value="Mela Melati Aprilia" size={60} />
                </div>
              </div>
              <p className="font-bold text-white border-b border-[#1E2D3D] pb-1 text-sm sm:text-base text-center mt-2">Mela Melati Aprilia</p>
              <p className="text-xs sm:text-sm text-[#0096D6] pt-1 text-center">Finance</p>
              <p className="text-[10px] sm:text-xs text-gray-500 text-center">AlinLabs Indonesia</p>
            </div>
          </div>
        </div>
      </RegularCard>
    </motion.div>
  );
};
