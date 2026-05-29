import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link, useSearchParams } from "react-router-dom";
import { Package, Monitor, Search, Headphones, Printer, Gamepad2, LayoutGrid, Shield, Camera, Fingerprint, Network } from "lucide-react";
import { ProductData } from "../../types";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import { Trans, useTranslation } from "../../lib/LanguageContext";

const ProductCard: React.FC<{ product: ProductData; index: number }> = ({ product, index }) => {
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  };

  return (
    <Link 
      to={`/katalog/${product.id}`}
      className={`bg-white dark:bg-[#001428] border border-transparent dark:border-slate-600/5 rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group block relative aspect-[4/5] ${index % 2 === 0 ? '-rotate-2 md:rotate-0' : 'rotate-2 md:rotate-0'}`}
    >
      {product.video ? (
        <video 
          src={product.video}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
        />
      ) : product.gambar && product.gambar.length > 0 ? (
        <img 
          src={product.gambar[0]} 
          alt={product.nama} 
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-50 dark:bg-[#001c38] flex items-center justify-center">
          <Monitor className="w-16 h-16 text-gray-200 dark:text-gray-700" />
        </div>
      )}
      
      {product.harga_promo && product.harga_normal && product.harga_promo < product.harga_normal && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-bl-lg z-10 shadow-sm">
          <Trans>Promo</Trans>
        </div>
      )}

      {/* Overlay - Always Visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#00172D]/90 via-[#00172D]/40 to-transparent opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
        <h2 className="text-sm md:text-base font-black text-white mb-1 line-clamp-2 leading-tight">{product.nama}</h2>
        <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest line-clamp-1">{product.kategori}</p>
      </div>
    </Link>
  );
}

export default function PublicProductsPage() {
  const { t, language } = useTranslation();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchPlaceholder, setSearchPlaceholder] = useState("Cari nama atau spesifikasi produk...");
  
  useEffect(() => {
    t("Cari nama atau spesifikasi produk...").then(setSearchPlaceholder);
  }, [language, t]);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "Semua";

  useEffect(() => {
    fetch("/data/products.json")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (e.target.value) {
        newParams.set("search", e.target.value);
      } else {
        newParams.delete("search");
      }
      return newParams;
    });
  };

  const handleCategoryClick = (cat: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (cat !== "Semua") {
        newParams.set("category", cat);
      } else {
        newParams.delete("category");
      }
      return newParams;
    });
  };

  const categories = [
    { id: "Semua", label: "Semua", icon: <LayoutGrid className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" /> },
    { id: "Security System", label: "Security System", icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" /> },
    { id: "CCTV", label: "CCTV", icon: <Camera className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" /> },
    { id: "Access Control", label: "Access Control", icon: <Fingerprint className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" /> },
    { id: "IT Peripheral", label: "IT Peripheral", icon: <Network className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" /> }
  ];

  const filteredProducts = products.filter(product => {
    const matchSearch = product.nama.toLowerCase().includes(search.toLowerCase()) || 
      (product.deskripsi && product.deskripsi.toLowerCase().includes(search.toLowerCase()));
      
    let matchCat = true;
    if (category !== "Semua") {
       matchCat = product.kategori.toLowerCase() === category.toLowerCase();
    }

    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#000A15] font-sans flex flex-col text-[#00172D] dark:text-gray-100 pb-16 md:pb-0 transition-colors duration-300">
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-24 md:pt-32 pb-12 md:pb-24 w-full">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-8 md:mb-12 text-left w-full"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-[#35ACDF] mb-3 block"><Trans>Marketplace</Trans></span>
          <h1 className="text-3xl md:text-5xl font-black text-[#00172D] dark:text-white mb-4 md:mb-6 tracking-tight"><Trans>Katalog Produk</Trans></h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-lg leading-relaxed max-w-2xl">
            <Trans>Eksplorasi jajaran produk IoT, sistem keamanan, CCTV, kontrol akses, dan perangkat pendukung IT premium untuk kebutuhan bisnis dan korporasi.</Trans>
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-10 w-full">
           <div className="flex flex-col gap-6">
             {/* Search Bar */}
             <form className="relative flex items-center w-full shadow-sm rounded-full mb-2" onSubmit={(e) => e.preventDefault()}>
                <Search className="absolute left-5 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={search}
                  onChange={handleSearch}
                  placeholder={searchPlaceholder} 
                  className="w-full pl-14 pr-6 py-4 md:py-5 rounded-full bg-white dark:bg-[#001428] border border-gray-100 dark:border-slate-600/10 text-[#00172D] dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] transition-all font-medium md:text-lg shadow-sm shadow-gray-200/50 dark:shadow-none"
                />
              </form>

             {/* Category Cards */}
             <div className="grid grid-cols-5 gap-2 sm:gap-4 md:gap-6 w-full max-w-4xl mx-auto">
               {categories.map((cat) => (
                  <div 
                    key={cat.id} 
                    className="flex flex-col items-center group cursor-pointer" 
                    onClick={() => handleCategoryClick(cat.id)}
                  >
                    <div className={`w-full max-w-[64px] sm:max-w-[80px] md:max-w-[110px] aspect-square flex items-center justify-center rounded-xl md:rounded-3xl border transition-all mb-2 md:mb-4 mx-auto ${category === cat.id ? 'bg-[#35ACDF] border-[#35ACDF] shadow-md shadow-[#35ACDF]/30 group-hover:shadow-xl' : 'bg-white dark:bg-[#001428] border-gray-100 dark:border-slate-600/10 shadow-sm group-hover:shadow-xl group-hover:border-[#35ACDF]/30'}`}>
                      <div className={`transition-all transform group-hover:scale-110 duration-300 ${category === cat.id ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-[#35ACDF]'}`}>
                        {cat.icon}
                      </div>
                    </div>
                    <span className={`text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest text-center transition-colors px-1 md:px-0 mt-1 md:mt-2 ${category === cat.id ? 'text-[#35ACDF]' : 'text-gray-500 dark:text-gray-400 group-hover:text-[#35ACDF]'}`}>
                      <Trans>{cat.label}</Trans>
                    </span>
                  </div>
               ))}
             </div>
           </div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 text-gray-400">
             <Package className="w-10 h-10 md:w-12 md:h-12 mb-4 animate-bounce text-[#35ACDF]" />
             <p className="text-[10px] md:text-sm font-bold uppercase tracking-widest"><Trans>Memuat Katalog Produk...</Trans></p>
           </div>
        ) : (
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="w-12 h-12 text-gray-200 mb-4" />
                <h3 className="text-lg font-black text-[#00172D] dark:text-white mb-2"><Trans>Produk Tidak Ditemukan</Trans></h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm"><Trans>Coba sesuaikan kata kunci pencarian atau ganti kategori.</Trans></p>
                <button onClick={() => { setSearchParams({}); }} className="mt-6 text-[10px] font-black tracking-widest uppercase px-6 py-3 bg-[#35ACDF] text-white rounded-full hover:bg-[#2b8eb8] transition-colors">
                  <Trans>Reset Filter</Trans>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 py-6 md:py-8 text-center bg-white dark:bg-[#000A15]/40 mt-auto md:mb-0 mb-16">
        <p className="text-[9px] md:text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Harry Gultom. <Trans>Data Katalog Terverifikasi.</Trans>
        </p>
      </footer>
      <BottomNavigation />
    </div>
  );
}
