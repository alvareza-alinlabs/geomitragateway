import { Trans } from "../../lib/LanguageContext";
import { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, AnimatePresence } from "motion/react";
import { Award, Users, Building2, Store } from "lucide-react";
import AnimatedCounter from '../../components/AnimatedCounter';
import BrandTicker from '../../components/BrandTicker';

export default function PartnersMapSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [partnerBrands, setPartnerBrands] = useState<string[]>([]);


  const stats = [
    { icon: <Award className="w-8 h-8 md:w-10 md:h-10 text-[#35ACDF]" />, target: 15, suffix: "+", label: "Tahun Pengalaman" },
    { icon: <Users className="w-8 h-8 md:w-10 md:h-10 text-[#35ACDF]" />, target: 500, suffix: "+", label: "Klien Percaya" },
    { icon: <Building2 className="w-8 h-8 md:w-10 md:h-10 text-[#35ACDF]" />, target: 50, suffix: "+", label: "Distributor Aktif" },
    { icon: <Store className="w-8 h-8 md:w-10 md:h-10 text-[#35ACDF]" />, target: 100, suffix: "+", label: "Store Tersebar" },
  ];

  const categories = [
    {
      judul: "Distributor",
      cards: [
        { nama: "PT Synnex Metrodata", desc: "Suplai andal perangkat keras eksekutif berskala nasional." },
        { nama: "VST ECS Indonesia", desc: "Katalisator distribusi PC dengan kualifikasi standar TKDN." },
      ]
    },
    {
      judul: "Partner",
      cards: [
        { nama: "Hewlett Packard (HPE)", desc: "Pusat data & server tangguh untuk lonjakan skalabilitas perusahaan." },
        { nama: "TD SYNNEX", desc: "Akselerasi ruang kerja masa depan dengan komunikasi mulus." },
      ]
    },
    {
      judul: "Store",
      cards: [
        { nama: "PT Pasifik Citi", desc: "Akses eksklusif berbelanja resmi secara digital dari HP®." },
        { nama: "IT Galeri", desc: "Flagship eksperimental premium untuk merasakan langsung inovasi." },
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % categories.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [categories.length]);

  useEffect(() => {
    // Fetch from the local database JSON to populate the ticker
    fetch("/data/partners.json")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Extract unique company names
          const companies = Array.from(new Set(data.map((item: any) => item.perusahaan).filter(Boolean)));
          
          // Fallback if there aren't enough companies, we can merge with category cards just in case
          const fallbackBrands = categories.flatMap(cat => cat.cards.map(c => c.nama));
          const finalBrands = companies.length > 2 ? companies : [...new Set([...companies, ...fallbackBrands])];
          
          setPartnerBrands(finalBrands as string[]);
        }
      })
      .catch(err => console.error("Failed to load partner brands:", err));
  }, []);

  return (
    <section className="pt-4 pb-16 md:py-24 relative z-10 bg-gray-50/50 dark:bg-[#000A15]/40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between mb-10 md:mb-16 gap-10">
          <div className="max-w-2xl md:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center md:items-start md:text-left"
            >
              <h2 className="text-3xl md:text-5xl font-black text-[#00172D] dark:text-white mb-4 tracking-tight"><Trans>Mitra Kami</Trans></h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base">
                <Trans>Jaringan mitra eksekutif untuk solusi IT terdepan di seluruh sudut kota.</Trans>
              </p>
            </motion.div>
          </div>
          
          {/* Stats Section mapped next to text on larger screens */}
          <div className="md:w-1/2 grid grid-cols-2 gap-8 md:gap-4 md:items-center">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4"
              >
                <div className="flex items-center gap-3 md:gap-0">
                  <div className="flex items-center justify-center text-[#35ACDF]">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-[#00172D] dark:text-white tracking-tight leading-none md:hidden">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </div>
                </div>
                <div className="flex flex-col mt-1 md:mt-0">
                  <div className="hidden md:block text-3xl md:text-4xl font-black text-[#00172D] dark:text-white tracking-tight leading-none">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase md:mt-1"><Trans>{stat.label}</Trans></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full flex justify-center items-center overflow-hidden relative z-10 mb-16"
        >
          <div className="w-full max-w-4xl aspect-video md:aspect-auto md:h-[500px]">
            <DotLottieReact
              src="/lottie/indonesian-maps-blue.lottie"
              loop
              autoplay
            />
          </div>
        </motion.div>

        {/* Categories Section */}
        <div className="flex gap-4 md:gap-8 justify-center items-center mb-0 md:mb-2 border-b border-gray-100 dark:border-slate-600/10">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`pb-2 md:pb-3 px-2 md:px-4 text-xs md:text-sm font-black uppercase tracking-widest transition-colors relative ${
                activeTab === idx ? "text-[#35ACDF]" : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              }`}
            >
              <Trans>{cat.judul}</Trans>
              {activeTab === idx && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#35ACDF]"
                />
              )}
            </button>
          ))}
        </div>

        <div className="relative overflow-visible min-h-[100px] pt-6 md:pt-8 mb-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6 w-full"
            >
              {categories[activeTab].cards.map((card, idx) => (
                <div key={idx} className="bg-white dark:bg-[#00172D] rounded-xl md:rounded-2xl p-4 md:p-8 shadow-sm dark:shadow-black/20 border border-gray-200 dark:border-slate-800 flex flex-col h-full items-center text-center md:items-start md:text-left transition-colors duration-300">
                   <div className="flex flex-col md:flex-row items-center md:justify-start gap-3 md:gap-4 mb-2 md:mb-4">
                     <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-50 dark:bg-[#35ACDF]/10 border border-blue-100 dark:border-[#35ACDF]/20 rounded-lg md:rounded-xl flex-shrink-0 flex items-center justify-center text-[#35ACDF] font-black text-xs md:text-lg tracking-widest shadow-sm">
                       {(() => {
                         const cleanName = card.nama.replace(/^(PT|CV)\s+/i, '').trim();
                         const words = cleanName.split(' ');
                         if (words.length > 1) {
                           return (words[0][0] + words[1][0]).toUpperCase();
                         }
                         return cleanName.substring(0, 2).toUpperCase();
                       })()}
                     </div>
                     <h3 className="text-[13px] md:text-xl font-bold text-[#00172D] dark:text-white leading-tight">{card.nama}</h3>
                   </div>
                   <p className="text-gray-500 dark:text-gray-400 text-[10px] md:text-base leading-relaxed md:leading-relaxed"><Trans>{card.desc}</Trans></p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {partnerBrands.length > 0 && <BrandTicker items={partnerBrands} />}

      </div>
    </section>
  );
}
