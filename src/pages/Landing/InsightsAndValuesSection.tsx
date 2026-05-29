import { Trans } from "../../lib/LanguageContext";
import { useState } from "react";
import { Award, BookOpen, ShieldCheck, Monitor, HeadphonesIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function InsightsAndValuesSection({ statistik: stats, data }: { statistik: any, data?: any }) {
  const [activeTab, setActiveTab] = useState<"insight" | "nilai" | "kinerja">("insight");

  const desktopInsights = (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-6 flex flex-col md:flex-row gap-10 lg:gap-16 items-center">
        <div className="w-full md:w-5/12 lg:w-1/2">
          <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] group">
            <img src="/gambar/harry-gultom-portrait.webp" alt="Harry Gultom" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00172D] via-[#00172D]/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full text-white">
              <span className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-3 md:mb-4">
                <Award className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#35ACDF]" /> <Trans>Enterprise IT Consultant</Trans>
              </span>
              <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">Harry Gultom</h3>
              <p className="text-blue-100 text-xs md:text-sm font-medium leading-relaxed">
                <Trans>Lebih dari 15 tahun pengalaman mengorkestrasi infrastruktur TI berskala nasional untuk sektor pemerintahan dan enterprise.</Trans>
              </p>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-7/12 lg:w-1/2 text-left">
           <span className="text-[10px] font-black uppercase tracking-widest text-[#35ACDF] mb-3 block"><Trans>Insight & Edukasi</Trans></span>
           <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#00172D] dark:text-white mb-4 md:mb-6 tracking-tight"><Trans>Menavigasi Ekosistem</Trans> <br className="hidden md:block" /><Trans>IT Modern.</Trans></h2>
           <p className="text-gray-500 dark:text-gray-400 mb-8 md:mb-10 leading-relaxed font-medium text-sm md:text-base"><Trans>Banyak korporasi berinvestasi pada perangkat keras yang salah. Berikut adalah tiga pilar fundamental yang selalu saya tekankan sebelum melakukan pengadaan infrastruktur teknologi berskala besar.</Trans></p>
           
           <div className="space-y-6 md:space-y-8">
             <div className="flex gap-4 md:gap-6 group">
               <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#00172D] dark:group-hover:bg-[#35ACDF] transition-colors text-gray-400">
                 <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-[#35ACDF]" />
               </div>
               <div>
                 <h4 className="text-lg md:text-xl font-black text-[#00172D] dark:text-white mb-1 md:mb-2 tracking-tight"><Trans>Total Cost of Ownership (TCO)</Trans></h4>
                 <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed"><Trans>Harga pembelian awal hanya merepresentasikan 30% dari total biaya perangkat. Biaya operasional, deployment, dan pemeliharaan adalah beban terbesar.</Trans></p>
               </div>
             </div>
             
             <div className="flex gap-4 md:gap-6 group">
               <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#00172D] dark:group-hover:bg-[#35ACDF] transition-colors text-gray-400">
                 <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-[#35ACDF]" />
               </div>
               <div>
                 <h4 className="text-lg md:text-xl font-black text-[#00172D] dark:text-white mb-1 md:mb-2 tracking-tight"><Trans>Endpoint Security First</Trans></h4>
                 <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed"><Trans>Laptop dan PC adalah gerbang utama ancaman siber. Fitur keamanan berbasis hardware (seperti HP Wolf Security) tidak dapat lagi dikesampingkan.</Trans></p>
               </div>
             </div>
             
             <div className="flex gap-4 md:gap-6 group">
               <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#00172D] dark:group-hover:bg-[#35ACDF] transition-colors text-gray-400">
                 <Monitor className="w-6 h-6 md:w-8 md:h-8 text-[#35ACDF]" />
               </div>
               <div>
                 <h4 className="text-lg md:text-xl font-black text-[#00172D] dark:text-white mb-1 md:mb-2 tracking-tight"><Trans>Kolaborasi Hibrida Imersif</Trans></h4>
                 <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed"><Trans>Sistem video conference harus mampu memberikan keadilan bagi peserta virtual maupun fisik. Kualitas audio dan framing otomatis adalah kunci keterlibatan.</Trans></p>
               </div>
             </div>
           </div>
        </div>
      </div>
  );

  const desktopCorporateValues = (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-6 relative z-10 grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
         <div>
           <span className="text-[10px] font-black uppercase tracking-widest text-[#35ACDF] mb-3 md:mb-4 block"><Trans>Nilai Strategis</Trans></span>
           <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 tracking-tight leading-tight text-[#00172D] dark:text-white" dangerouslySetInnerHTML={{ __html: data?.judul?.replace('\n', '<br/>') || "Komitmen Kepada <br/>Mitra & Klien." }}></h2>
           <p className="text-gray-600 dark:text-gray-350 text-sm md:text-lg mb-8 md:mb-10 leading-relaxed">
             {data?.subjudul || "Bukan sekadar menawarkan produk, namun kami memastikan kemitraan yang berkelanjutan. Kami memberikan dukungan solusi perangkat keras yang tepat sasaran, dengan jaminan layanan resmi dari principal."}
           </p>
           
           <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-emerald-500 shrink-0 border border-gray-100 dark:border-slate-600/10 group-hover:bg-[#00172D] dark:group-hover:bg-[#35ACDF] transition-colors">
                  <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-[#35ACDF]" />
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-black text-[#00172D] dark:text-white mb-1"><Trans>Jaminan Keaslian Eksekutif</Trans></h4>
                  <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 leading-relaxed md:leading-relaxed"><Trans>Sertifikasi rantai pasok ketat menjamin tidak ada komponen pasar abu-abu. Garansi prinsipal berlaku penuh hari pertama.</Trans></p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#35ACDF] shrink-0 border border-gray-100 dark:border-slate-600/10 group-hover:bg-[#00172D] dark:group-hover:bg-[#35ACDF] transition-colors">
                  <HeadphonesIcon className="w-5 h-5 md:w-6 md:h-6 text-[#35ACDF]" />
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-black text-[#00172D] dark:text-white mb-1"><Trans>Dukungan Lapis Kedua (L2)</Trans></h4>
                  <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 leading-relaxed md:leading-relaxed"><Trans>Tim rekayasa internal bersertifikasi siap memandu eskalasi kompleks, melewati batas layanan dasar vendor.</Trans></p>
                </div>
              </div>
           </div>
         </div>
         
         <div className="bg-white dark:bg-[#00172D] shadow-xl shadow-gray-200/50 dark:shadow-none rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 border border-gray-200 dark:border-slate-800 transition-all">
            <h3 className="text-lg md:text-xl font-black mb-6 md:mb-8 text-center tracking-tight text-[#00172D] dark:text-white"><Trans>Kinerja Kemitraan Tahunan</Trans></h3>
            
            <div className="space-y-6 md:space-y-8">
              <div>
                <div className="flex justify-between items-end mb-2 md:mb-3">
                  <span className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400"><Trans>Volume Perangkat Komputasi</Trans></span>
                  <span className="text-base md:text-lg font-black text-[#00172D] dark:text-white">{Number.isNaN(stats?.volumeUnit) ? "0" : stats?.volumeUnit.toLocaleString()}+ <span className="text-[10px] md:text-xs text-[#35ACDF] font-bold uppercase tracking-widest"><Trans>Unit</Trans></span></span>
                </div>
                <div className="h-1.5 md:h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#35ACDF] rounded-full transition-all duration-1000" style={{ width: `${stats?.volumePercent || 0}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-2 md:mb-3">
                  <span className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400"><Trans>Penyebaran Alat Kolaborasi</Trans></span>
                  <span className="text-base md:text-lg font-black text-[#00172D] dark:text-white">{Number.isNaN(stats?.roomCollab) ? "0" : stats?.roomCollab.toLocaleString()}+ <span className="text-[10px] md:text-xs text-orange-500 font-bold uppercase tracking-widest"><Trans>Ruang</Trans></span></span>
                </div>
                <div className="h-1.5 md:h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full transition-all duration-1000" style={{ width: `${stats?.roomPercent || 0}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-2 md:mb-3">
                  <span className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400"><Trans>Indeks Penyelesaian Tender</Trans></span>
                  <span className="text-base md:text-lg font-black text-[#00172D] dark:text-white">{Number.isNaN(stats?.tenderSuccess) ? "0" : stats?.tenderSuccess}%</span>
                </div>
                <div className="h-1.5 md:h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${stats?.tenderSuccess || 0}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 md:mt-12 text-center pt-6 md:pt-8 border-t border-gray-200 dark:border-slate-600/10">
              <p className="text-[11px] md:text-xs font-medium text-gray-400 dark:text-gray-500"><Trans>Pencapaian Berkelanjutan Hari Ini (Q3 2024)</Trans></p>
            </div>
         </div>
      </div>
  );

  const insightContent = (
    <div className="w-full text-left space-y-6">
        <h2 className="text-2xl font-black text-[#00172D] dark:text-white mb-3 tracking-tight"><Trans>Menavigasi Ekosistem IT Modern.</Trans></h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed font-medium text-sm"><Trans>Banyak korporasi berinvestasi pada perangkat keras yang salah. Berikut adalah tiga pilar fundamental yang selalu saya tekankan sebelum melakukan pengadaan infrastruktur teknologi berskala besar.</Trans></p>
        
        <div className="space-y-6">
          <div className="flex gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0 text-gray-400 group-hover:bg-[#00172D] dark:group-hover:bg-[#35ACDF] transition-colors">
              <BookOpen className="w-6 h-6 text-[#35ACDF]" />
            </div>
            <div>
              <h4 className="text-lg font-black text-[#00172D] dark:text-white mb-1 tracking-tight"><Trans>Total Cost of Ownership</Trans></h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed"><Trans>Harga pembelian awal hanya merepresentasikan 30% dari total biaya perangkat. Biaya operasional, deployment, dan pemeliharaan adalah beban terbesar.</Trans></p>
            </div>
          </div>
          
          <div className="flex gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0 text-gray-400 group-hover:bg-[#00172D] dark:group-hover:bg-[#35ACDF] transition-colors">
              <ShieldCheck className="w-6 h-6 text-[#35ACDF]" />
            </div>
            <div>
              <h4 className="text-lg font-black text-[#00172D] dark:text-white mb-1 tracking-tight"><Trans>Endpoint Security First</Trans></h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed"><Trans>Laptop dan PC adalah gerbang utama ancaman siber. Fitur keamanan berbasis hardware (seperti HP Wolf Security) tidak dapat lagi dikesampingkan.</Trans></p>
            </div>
          </div>
          
          <div className="flex gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0 text-gray-400 group-hover:bg-[#00172D] dark:group-hover:bg-[#35ACDF] transition-colors">
              <Monitor className="w-6 h-6 text-[#35ACDF]" />
            </div>
            <div>
              <h4 className="text-lg font-black text-[#00172D] dark:text-white mb-1 tracking-tight"><Trans>Kolaborasi Hibrida Imersif</Trans></h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed"><Trans>Sistem video conference harus mampu memberikan keadilan bagi peserta virtual maupun fisik. Kualitas audio dan framing otomatis adalah kunci keterlibatan.</Trans></p>
            </div>
          </div>
        </div>
    </div>
  );

  const nilaiContent = (
    <div>
        <h2 className="text-2xl font-black mb-4 tracking-tight leading-tight text-[#00172D] dark:text-white" dangerouslySetInnerHTML={{ __html: data?.judul?.replace('\n', '<br/>') || "Komitmen Kepada <br/>Mitra & Klien." }}></h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 leading-relaxed">
          {data?.subjudul || "Bukan sekadar menawarkan produk, namun kami memastikan kemitraan yang berkelanjutan. Kami memberikan dukungan solusi perangkat keras yang tepat sasaran, dengan jaminan layanan resmi dari principal."}
        </p>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-emerald-500 shrink-0 border border-gray-100 dark:border-slate-600/10 group-hover:bg-[#00172D] dark:group-hover:bg-[#35ACDF] transition-colors">
              <ShieldCheck className="w-5 h-5 text-[#35ACDF]" />
            </div>
            <div>
              <h4 className="text-base font-black text-[#00172D] dark:text-white mb-1"><Trans>Jaminan Keaslian Eksekutif</Trans></h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed"><Trans>Sertifikasi rantai pasok ketat menjamin tidak ada komponen pasar abu-abu. Garansi prinsipal berlaku penuh hari pertama.</Trans></p>
            </div>
          </div>
          <div className="flex items-start gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#35ACDF] shrink-0 border border-gray-100 dark:border-slate-600/10 group-hover:bg-[#00172D] dark:group-hover:bg-[#35ACDF] transition-colors">
              <HeadphonesIcon className="w-5 h-5 text-[#35ACDF]" />
            </div>
            <div>
              <h4 className="text-base font-black text-[#00172D] dark:text-white mb-1"><Trans>Dukungan Lapis Kedua (L2)</Trans></h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed"><Trans>Tim rekayasa internal bersertifikasi siap memandu eskalasi kompleks, melewati batas layanan dasar vendor.</Trans></p>
            </div>
          </div>
        </div>
      </div>
  );

  const kinerjaContent = (
    <div className="bg-white dark:bg-[#00172D] shadow-xl shadow-gray-200/50 dark:shadow-none rounded-3xl p-6 border border-gray-200 dark:border-slate-800 transition-all">
        <h3 className="text-lg font-black mb-6 text-center tracking-tight text-[#00172D] dark:text-white"><Trans>Kinerja Kemitraan Tahunan</Trans></h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400"><Trans>Volume Perangkat Komputasi</Trans></span>
              <span className="text-base font-black text-[#00172D] dark:text-white">{Number.isNaN(stats?.volumeUnit) ? "0" : stats?.volumeUnit.toLocaleString()}+ <span className="text-[10px] text-[#35ACDF] font-bold uppercase tracking-widest"><Trans>Unit</Trans></span></span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#35ACDF] rounded-full transition-all duration-1000" style={{ width: `${stats?.volumePercent || 0}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400"><Trans>Penyebaran Alat Kolaborasi</Trans></span>
              <span className="text-base font-black text-[#00172D] dark:text-white">{Number.isNaN(stats?.roomCollab) ? "0" : stats?.roomCollab.toLocaleString()}+ <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest"><Trans>Ruang</Trans></span></span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-orange-500 rounded-full transition-all duration-1000" style={{ width: `${stats?.roomPercent || 0}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400"><Trans>Indeks Penyelesaian Tender</Trans></span>
              <span className="text-base font-black text-[#00172D] dark:text-white">{Number.isNaN(stats?.tenderSuccess) ? "0" : stats?.tenderSuccess}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${stats?.tenderSuccess || 0}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center pt-6 border-t border-gray-200 dark:border-slate-600/10">
          <p className="text-[11px] font-medium text-gray-450 dark:text-gray-500"><Trans>Pencapaian Berkelanjutan Hari Ini (Q3 2024)</Trans></p>
        </div>
      </div>
  );

  return (
    <>
      <section id="edukasi" className="hidden md:block py-16 md:py-24 relative z-10 bg-white dark:bg-[#000A15] transition-colors duration-300">
        {desktopInsights}
      </section>

      <section id="nilai" className="hidden md:block bg-white dark:bg-[#000A15] py-16 md:py-24 lg:py-32 relative z-10 overflow-hidden text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {desktopCorporateValues}
      </section>

      {/* MOBILE ONLY VIEW */}
      <section className="md:hidden py-16 relative z-10 bg-white dark:bg-[#000A15] transition-colors duration-300">
        <div className="px-6 mb-8">
           <div className="relative rounded-[2rem] overflow-hidden shadow-xl aspect-[4/5] group">
              <img src="/gambar/harry-gultom-portrait.webp" alt="Harry Gultom" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00172D] via-[#00172D]/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full text-white">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-[9px] font-black uppercase tracking-widest mb-3">
                  <Award className="w-3.5 h-3.5 text-[#35ACDF]" /> <Trans>Enterprise IT Consultant</Trans>
                </span>
                <h3 className="text-2xl font-black mb-2 tracking-tight">Harry Gultom</h3>
                <p className="text-blue-100 text-xs font-medium leading-relaxed">
                  <Trans>Lebih dari 15 tahun pengalaman mengorkestrasi infrastruktur TI berskala nasional.</Trans>
                </p>
              </div>
            </div>
        </div>

        <div className="px-6 mb-6">
          <div className="flex bg-gray-50 dark:bg-white/5 rounded-full p-1.5 relative border border-gray-200 dark:border-slate-800 shadow-inner">
            {["insight", "nilai", "kinerja"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`flex-1 text-[11px] font-bold py-2.5 rounded-full capitalize transition-colors duration-300 relative z-10 ${
                  activeTab === tab ? "text-white dark:text-[#00172D]" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Trans>{tab === "insight" ? "Insight" : tab === "nilai" ? "Nilai Strategis" : "Kinerja"}</Trans>
              </button>
            ))}
            <div 
              className="absolute top-1.5 bottom-1.5 rounded-full bg-[#00172D] dark:bg-[#35ACDF] shadow-md transition-all duration-300 ease-out z-0"
              style={{
                width: 'calc(33.333% - 4px)',
                left: activeTab === 'insight' ? '6px' : activeTab === 'nilai' ? 'calc(33.333% + 2px)' : 'calc(66.666% - 2px)'
              }}
            />
          </div>
        </div>

        <div className="px-6">
          <AnimatePresence mode="wait">
            {activeTab === "insight" && (
              <motion.div
                key="insight"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {insightContent}
              </motion.div>
            )}
            {activeTab === "nilai" && (
              <motion.div
                key="nilai"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {nilaiContent}
              </motion.div>
            )}
            {activeTab === "kinerja" && (
              <motion.div
                key="kinerja"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {kinerjaContent}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
