import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Monitor, Headphones, Printer, Gamepad2, ArrowRight, ChevronLeft, ChevronRight, Shield, Camera, Fingerprint, Network } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "../../lib/LanguageContext";

const slides = [
  {
    id: 1,
    mobile: "/gambar/mobile-banner1.webp",
    desktop: "/gambar/desktop-banner1.webp",
    alt: "Eksplorasi jajaran produk HP Inc dan Poly"
  },
  {
    id: 2,
    mobile: "/gambar/mobile-banner2.webp",
    desktop: "/gambar/desktop-banner2.webp",
    alt: "Perangkat Keras HP dan Poly Enterprise"
  },
  {
    id: 3,
    mobile: "/gambar/mobile-banner3.webp",
    desktop: "/gambar/desktop-banner3.webp",
    alt: "Katalog Produk Terverifikasi HP Inc dan Poly"
  }
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : direction < 0 ? "-100%" : 0,
    opacity: 1
  }),
  center: {
    x: "0%",
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : direction > 0 ? "-100%" : 0,
    opacity: 1
  })
};

interface HeroProps {
  y: any;
  data?: {
    label: string;
    judul_hitam: string;
    judul_biru: string;
    subjudul: string;
    tombol_utama: string;
    tombol_sekunder: string;
  };
}

export default function Hero({ y, data }: HeroProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { t, language } = useTranslation();
  const [placeholder, setPlaceholder] = useState("Cari nama atau spesifikasi produk...");
  useEffect(() => {
    t("Cari nama atau spesifikasi produk...").then(setPlaceholder);
  }, [language, t]);

  const [isFocused, setIsFocused] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const [[slideIndex, direction], setSlide] = useState([0, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIdx = (slideIndex + 1) % slides.length;
      setSlide([nextIdx, 1]);
    }, 6000); // Ganti slide otomatis setiap 6 detik
    return () => clearInterval(timer);
  }, [slideIndex]);

  const nextSlide = () => {
    const nextIdx = (slideIndex + 1) % slides.length;
    setSlide([nextIdx, 1]);
  };

  const prevSlide = () => {
    const prevIdx = (slideIndex - 1 + slides.length) % slides.length;
    setSlide([prevIdx, -1]);
  };

  useEffect(() => {
    fetch('/data/products.json')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error loading products:", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/katalog?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate(`/katalog`);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/katalog?category=${encodeURIComponent(category)}`);
  };

  const filteredProducts = searchTerm
    ? products.filter(p => p.nama.toLowerCase().includes(searchTerm.toLowerCase()) || p.kategori.toLowerCase().includes(searchTerm.toLowerCase()))
    : products.slice(0, 3);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const categories = [
    { id: "Security System", label: <Trans>Security System</Trans> as any, icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" /> },
    { id: "CCTV", label: <Trans>CCTV</Trans> as any, icon: <Camera className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" /> },
    { id: "Access Control", label: <Trans>Access Control</Trans> as any, icon: <Fingerprint className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" /> },
    { id: "IT Peripheral", label: <Trans>IT Peripheral</Trans> as any, icon: <Network className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" /> }
  ];

  return (
    <div className="flex flex-col items-center w-full">
      <section className="relative overflow-hidden w-full aspect-[4/3] md:aspect-[3/1] group bg-[#000d1a] dark:bg-black/35 select-none">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slideIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", ease: [0.4, 0.0, 0.2, 1], duration: 0.6 }
            }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={slides[slideIndex].mobile} 
              alt={slides[slideIndex].alt} 
              className="block md:hidden w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <img 
              src={slides[slideIndex].desktop} 
              alt={slides[slideIndex].alt} 
              className="hidden md:block w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Visual ambient overlay for premium depth and text readability/blend */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots (Positioned above the floating overlapping search bar) */}
        <div className="absolute bottom-12 md:bottom-14 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 md:gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (idx !== slideIndex) {
                  setSlide([idx, idx > slideIndex ? 1 : -1]);
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${slideIndex === idx ? 'bg-[#35ACDF] w-6 md:w-8' : 'bg-white/40 hover:bg-white/70 w-2 md:w-2.5'}`}
              aria-label={`Ke slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Floating Section */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-6 -mt-8 md:-mt-10 z-20 relative flex flex-col items-center mb-4 md:mb-16">
        {/* Floating Search Bar */}
        <div ref={searchRef} className="w-full relative mb-8">
          <form onSubmit={handleSearch} className="relative flex items-center w-full shadow-2xl rounded-full bg-white dark:bg-[#001D38] dark:shadow-black/40 z-30">
            <Search className="absolute left-5 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder={placeholder} 
              className="w-full pl-14 pr-6 py-4 md:py-5 rounded-full bg-transparent border-2 border-transparent text-[#00172D] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#35ACDF]/30 focus:bg-white dark:focus:bg-[#001D38] transition-all font-medium md:text-lg"
            />
          </form>

          {/* Autocomplete Popup */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 w-full mt-3 bg-white dark:bg-[#001D38] rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-black/50 border border-gray-100 dark:border-slate-600/10 overflow-hidden z-20 flex flex-col"
              >
                <div className="p-4 md:p-6 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#35ACDF] mb-4 block">
                    {searchTerm ? <Trans>Hasil Pencarian</Trans> : <Trans>Rekomendasi Pilihan</Trans>}
                  </span>
                  
                  {filteredProducts.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {filteredProducts.slice(0, 4).map((product) => (
                        <button
                          key={product.id}
                          onClick={() => navigate(`/katalog/${product.id}`)}
                          className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left group w-full"
                        >
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100 dark:border-slate-600/10">
                            {product.gambar?.[0] ? (
                              <img src={product.gambar[0]} alt={product.nama} className="w-full h-full object-contain p-1 mix-blend-multiply dark:mix-blend-normal dark:bg-[#002244]" />
                            ) : (
                              <Monitor className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm md:text-base font-black text-[#00172D] dark:text-white group-hover:text-[#35ACDF] transition-colors truncate">{product.nama}</h4>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest truncate">{product.kategori} Enterprise</p>
                          </div>
                          <div className="hidden sm:block text-right shrink-0 px-2">
                            <p className="text-sm font-black text-[#00172D] dark:text-white">{formatCurrency(product.harga_promo || product.harga_satuan)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                       <Search className="w-8 h-8 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                       <p className="text-sm font-medium"><Trans>Tidak ada produk yang cocok dengan</Trans> "{searchTerm}"</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 dark:bg-black/20 p-3 md:p-4 border-t border-gray-100 dark:border-slate-600/10 mt-2">
                  <button
                    onClick={() => {
                        setIsFocused(false);
                        if (searchTerm.trim()) {
                            navigate(`/katalog?search=${encodeURIComponent(searchTerm)}`);
                        } else {
                            navigate(`/katalog`);
                        }
                    }}
                    className="w-full py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-slate-600/10 hover:border-[#35ACDF] text-[#00172D] dark:text-white hover:text-[#35ACDF] rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Trans>Lihat Semua Produk</Trans><ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 w-full max-w-3xl mx-auto">
          {categories.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center group cursor-pointer" onClick={() => handleCategoryClick(cat.id)}>
              <div
                className="w-full max-w-[64px] sm:max-w-[80px] md:max-w-[110px] aspect-square flex items-center justify-center rounded-xl md:rounded-3xl bg-white dark:bg-[#00172D] border border-gray-200 dark:border-slate-800 shadow-sm group-hover:shadow-xl dark:group-hover:shadow-black/50 group-hover:border-[#35ACDF]/30 transition-all mb-2 md:mb-4 mx-auto"
              >
                <div className="text-gray-400 dark:text-gray-500 group-hover:text-[#35ACDF] transition-colors transform group-hover:scale-110 duration-300">
                  {cat.icon}
                </div>
              </div>
              <span className="text-[#00172D] dark:text-gray-300 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest text-center transition-colors group-hover:text-[#35ACDF] px-1 md:px-0">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
