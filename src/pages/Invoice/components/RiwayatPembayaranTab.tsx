import React, { Fragment, useState } from 'react';
import { motion } from 'motion/react';
import { History, FileText, Info, Send } from 'lucide-react';
import { RegularCard } from './RegularCard';

const HistoryRow = ({ date, time, title, desc, price, isPaid, proofImageRef, setProofImage }: any) => {
  const [showDesc, setShowDesc] = useState(false);
  return (
      <Fragment>
      <tr className={`border-b border-[#1E2D3D]/50 hover:bg-[#1E2D3D]/30 transition-colors ${isPaid ? '' : 'opacity-70'}`}>
          {/* ICON INFO (Tersendiri di Mobile & Desktop) */}
          <td className="w-10 sm:w-12 p-3 sm:p-4 pt-4 sm:pt-4 text-center align-top shrink-0">
            <button 
              className="mt-0.5 sm:mt-0 shrink-0 text-gray-400 hover:text-[#0096D6] focus:outline-none"
              onClick={() => setShowDesc(!showDesc)}
              title="Lihat Penjelasan"
            >
              <Info size={16} className={showDesc ? "text-[#0096D6]" : ""} />
            </button>
          </td>

          {/* DESKTOP TANGGAL */}
          <td className={`p-3 sm:p-4 pt-4 sm:pt-4 align-top hidden sm:table-cell whitespace-nowrap ${isPaid ? 'text-gray-300' : 'text-gray-400'}`}>
            <div>
              {date}
              {time && <><br /><span className="text-xs text-gray-500">{time}</span></>}
            </div>
          </td>
          {/* DESKTOP/MOBILE KETERANGAN */}
          <td className={`p-3 sm:p-4 pt-4 sm:pt-4 align-top w-full ${isPaid ? 'text-white font-medium' : 'text-gray-300'}`}>
            {/* MOBILE TANGGAL */}
            <div className="sm:hidden mb-2 text-sm text-gray-400 font-normal">
              {date} {time && <span className="text-xs ml-1">{time}</span>}
            </div>
            
            <div className="flex flex-col">
               <div>
                  <span className="sm:hidden font-medium text-white block mb-1">{title}</span>
                  <span className="hidden sm:inline">{title}</span>
                  {isPaid && proofImageRef && (
                     <button 
                        onClick={() => setProofImage(proofImageRef)}
                        className="mt-1 sm:mt-2 text-xs text-[#0096D6] hover:text-[#007BB5] transition-colors flex items-center gap-1"
                     >
                        <FileText size={12} className="hidden sm:inline-block" />
                        <span className="hidden sm:inline">Lihat Bukti Transaksi</span>
                        <span className="sm:hidden">Lihat Bukti</span>
                     </button>
                  )}
               </div>
            </div>
          </td>
          <td className={`p-3 sm:p-4 pt-4 sm:pt-4 text-right font-mono align-top whitespace-nowrap ${isPaid ? 'text-white' : 'text-gray-400'}`}>{price}</td>
        </tr>
        {showDesc && (
           <tr className="bg-[#152B46]/30">
             <td colSpan={4} className="p-4 pt-3 pb-4 text-sm text-gray-300 border-b border-[#1E2D3D]/50 hidden sm:table-cell">
               <strong className="text-[#0096D6] mb-1 block">Keterangan:</strong> {desc}
             </td>
             <td colSpan={3} className="p-4 pt-3 pb-4 text-sm text-gray-300 border-b border-[#1E2D3D]/50 sm:hidden">
               <strong className="text-[#0096D6] mb-1 block">Keterangan:</strong> {desc}
             </td>
           </tr>
        )}
      </Fragment>
  );
};

export const RiwayatPembayaranTab = ({ setProofImage }: { setProofImage: (image: string | null) => void }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <RegularCard>
        <div className="p-6 border-b border-[#1E2D3D] flex justify-between items-center bg-[#0F223A]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <History size={24} className="text-[#0096D6]" />
              Riwayat Pembayaran
            </h2>
        </div>
        <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="hidden sm:table-header-group">
                  <tr className="bg-[#1E2D3D]/50 text-gray-300 text-sm border-b border-[#1E2D3D]">
                    <th className="w-10 sm:w-12 p-3 sm:p-4 text-center"></th>
                    <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">Tanggal</th>
                    <th className="p-3 sm:p-4 font-semibold w-full">Keterangan</th>
                    <th className="p-3 sm:p-4 font-semibold text-right whitespace-nowrap">Nominal</th>
                  </tr>
              </thead>
              <thead className="sm:hidden">
                  <tr className="bg-[#1E2D3D]/50 text-gray-300 text-sm border-b border-[#1E2D3D]">
                    <th className="w-10 p-3 text-center"></th>
                    <th className="p-3 font-semibold w-full">Keterangan</th>
                    <th className="p-3 font-semibold text-right whitespace-nowrap">Nominal</th>
                  </tr>
              </thead>
              <tbody className="text-sm">
                  <HistoryRow 
                    date="24 Mei 2026"
                    time="15:28"
                    title="Pembayaran Tahap 1 (DP Sebagian)"
                    desc="Pembayaran uang muka DP (Down Payment) untuk memulai proses pengerjaan sistem dan pengadaan server."
                    price="Rp3.000.000"
                    isPaid={true}
                    proofImageRef="/gambar/bukti-dp.jpeg"
                    setProofImage={setProofImage}
                  />
                  <HistoryRow 
                    date="26 Mei 2026"
                    time="23:59"
                    title="Pembayaran Tahap 2 (Proyek Selesai)"
                    desc="Tagihan ini diterbitkan dan harus dibayarkan setelah seluruh pengembangan modul dan infrastruktur sistem selesai dikerjakan sesuai dengan ruang lingkup."
                    price="Rp2.082.000"
                    isPaid={false}
                  />
                  <HistoryRow 
                    date="2 Juni 2026"
                    time="23:59"
                    title="Pembayaran Tahap 3 (Revisi & Pelunasan)"
                    desc="Pelunasan sisa tagihan akhir setelah masa revisi selesai dan proyek telah sepenuhnya diserahkan."
                    price="Rp1.270.500"
                    isPaid={false}
                  />
              </tbody>
              <tfoot className="bg-[#0F223A]/50">
                <tr className="hidden sm:table-row">
                  <td colSpan={3} className="p-4 text-right font-bold text-gray-400">Total Pembayaran Masuk</td>
                  <td className="p-4 text-right font-bold text-emerald-400 whitespace-nowrap">Rp3.000.000</td>
                </tr>
                <tr className="sm:hidden">
                  <td colSpan={2} className="p-4 text-right font-bold text-gray-400">Total Masuk</td>
                  <td className="p-4 text-right font-bold text-emerald-400 whitespace-nowrap">Rp3.000.000</td>
                </tr>
                <tr className="hidden sm:table-row">
                  <td colSpan={3} className="p-4 text-right font-bold text-gray-300">Sisa Tagihan (Belum Lunas)</td>
                  <td className="p-4 text-right font-bold text-[#0096D6] whitespace-nowrap">Rp3.352.500</td>
                </tr>
                <tr className="sm:hidden">
                  <td colSpan={2} className="p-4 text-right font-bold text-gray-300">Sisa Tagihan</td>
                  <td className="p-4 text-right font-bold text-[#0096D6] whitespace-nowrap">Rp3.352.500</td>
                </tr>
              </tfoot>
            </table>
        </div>
      </RegularCard>

    </motion.div>
  );
};
