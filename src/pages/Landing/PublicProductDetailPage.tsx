import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Monitor, Package, Tags, Info, ChevronRight } from "lucide-react";
import { ProductData } from "../../types";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import { Trans } from "../../lib/LanguageContext";

export default function PublicProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showVideo, setShowVideo] = useState(true);
  const [showMobileGallery, setShowMobileGallery] = useState(false);
  const galleryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerGallery = () => {
    setShowMobileGallery(true);
    if (galleryTimeoutRef.current) clearTimeout(galleryTimeoutRef.current);
    galleryTimeoutRef.current = setTimeout(() => {
      setShowMobileGallery(false);
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (galleryTimeoutRef.current) clearTimeout(galleryTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    fetch("/data/products.json")
      .then(res => res.json())
      .then((data: ProductData[]) => {
        const found = data.find(p => p.id === id);
        if (found) {
          setProduct(found);
          setShowVideo(!!found.video);
        }
        setLoading(false);
      });
  }, [id]);

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#000A15] font-sans flex flex-col text-[#00172D] dark:text-gray-100 transition-colors duration-300">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500 mt-20">
          <Package className="w-10 h-10 md:w-12 md:h-12 mb-4 animate-bounce text-[#35ACDF]" />
          <p className="text-[10px] md:text-sm font-bold uppercase tracking-widest"><Trans>Memuat Detail Produk...</Trans></p>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#000A15] font-sans flex flex-col text-[#00172D] dark:text-gray-100 transition-colors duration-300">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-6 pt-24 md:pt-32 pb-12 w-full text-center mt-20">
          <h1 className="text-2xl font-black text-[#00172D] dark:text-white mb-4"><Trans>Produk Tidak Ditemukan</Trans></h1>
          <button onClick={() => navigate('/katalog')} className="text-[#35ACDF] font-bold hover:underline"><Trans>Kembali ke Katalog</Trans></button>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#000A15] font-sans flex flex-col text-[#00172D] dark:text-gray-100 pb-16 md:pb-0 transition-colors duration-300">
      <Header />

      <main className="flex-1 w-full flex flex-col md:flex-row md:max-w-7xl md:mx-auto md:px-6 md:pt-28 md:pb-12 md:gap-12">
        {/* Left Column: Image Area */}
        <div className="w-full md:w-1/2 flex flex-col shrink-0">
          {/* Hero-like Full Width Main Image (1:1 Ratio) */}
          <div 
            className="group relative w-full aspect-square bg-[#f8fafc] dark:bg-[#001428] flex items-center justify-center overflow-hidden mt-16 md:mt-0 border border-gray-100 dark:border-slate-600/10 md:rounded-3xl shrink-0 cursor-pointer md:cursor-default"
            onClick={triggerGallery}
          >
            {showVideo && product.video ? (
              <video 
                 src={product.video}
                 autoPlay
                 loop
                 muted
                 playsInline
                 className="w-full h-full object-cover object-center" 
              />
            ) : product.gambar && product.gambar.length > 0 ? (
              <img 
                 src={product.gambar[activeImage]} 
                 alt={product.nama} 
                 className="w-full h-full object-cover md:object-contain object-center" 
              />
            ) : (
              <Package className="w-24 h-24 text-gray-300 dark:text-gray-700" />
            )}

            {/* Mobile Mini Gallery Layer */}
            {((product.gambar && product.gambar.length > 0) || product.video) && (
              <>
                {/* Gradient Overlay (Visible when gallery open) - Mobile Only */}
                <div className={`md:hidden absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 pointer-events-none ${showMobileGallery ? 'opacity-100' : 'opacity-0'}`}></div>

                {/* Mini Gallery - Mobile Only (Hidden safely on desktop by md:hidden) */}
                <div 
                  className={`md:hidden absolute bottom-6 right-6 z-10 flex gap-3 overflow-x-auto max-w-[calc(100vw-3rem)] px-2 py-2 transition-all duration-300 ease-out ${showMobileGallery ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {product.video && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowVideo(true);
                        triggerGallery();
                      }}
                      className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-[#00172D] border border-transparent dark:border-slate-600/10 transition-all duration-300 shrink-0 flex items-center justify-center ${showVideo ? 'opacity-100 scale-110 shadow-2xl z-20' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}
                    >
                       <video src={product.video} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                       <Monitor className="w-5 h-5 text-white relative z-10" />
                    </button>
                  )}
                  {product.gambar?.map((img, iIdx) => (
                    <button 
                      key={iIdx} 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImage(iIdx);
                        setShowVideo(false);
                        triggerGallery();
                      }}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-white dark:bg-[#001428] border border-transparent dark:border-slate-600/10 transition-all duration-300 shrink-0 ${!showVideo && activeImage === iIdx ? 'opacity-100 scale-110 shadow-2xl z-20' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}
                    >
                      <img src={img} alt={`Thumb ${iIdx}`} className="w-full h-full object-contain object-center p-1" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Desktop Static Mini Gallery below main image */}
          {((product.gambar && product.gambar.length > 0) || product.video) && (
            <div className="hidden md:flex gap-4 mt-6 overflow-x-auto pb-2 px-1">
              {product.video && (
                <button 
                  onClick={() => {
                    setShowVideo(true);
                  }}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300 shrink-0 bg-[#00172D] border border-transparent dark:border-slate-600/10 ${showVideo ? 'shadow-md scale-105 opacity-100' : 'opacity-60 hover:opacity-100 hover:scale-105'}`}
                >
                  <video src={product.video} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-white" />
                  </div>
                </button>
              )}
              {product.gambar?.map((img, iIdx) => (
                <button 
                  key={iIdx} 
                  onClick={() => {
                    setActiveImage(iIdx);
                    setShowVideo(false);
                  }}
                  className={`w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300 shrink-0 bg-white dark:bg-[#001428] border border-transparent dark:border-slate-600/10 ${!showVideo && activeImage === iIdx ? 'shadow-md scale-105 opacity-100' : 'opacity-60 hover:opacity-100 hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <img src={img} alt={`Thumb ${iIdx}`} className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details Section directly on page */}
        <div className="w-full md:w-1/2 flex flex-col px-6 py-12 md:px-0 md:py-0">
          <div className="flex flex-col gap-8 mb-12">
             <div className="flex-1">
               <div className="flex flex-wrap items-center gap-3 mb-4">
                 <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${product.merek === 'HP Inc' ? 'bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30' : 'bg-orange-50 text-orange-600 border border-orange-100 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/30'}`}>
                   {product.merek}
                 </span>
                 <span className="text-[10px] text-[#35ACDF] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-950/40 border border-transparent dark:border-blue-900/30 px-3 py-1.5 rounded-full">{product.kategori} Enterprise</span>
               </div>
               <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#00172D] dark:text-white mb-4 leading-tight tracking-tight">{product.nama}</h1>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest"><Trans>ID Produk:</Trans> {product.id}</p>
             </div>
          </div>

          <div className="mb-12">
            <h3 className="text-sm font-black text-[#00172D] dark:text-white uppercase tracking-widest mb-4"><Trans>Deskripsi Produk</Trans></h3>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              <Trans>{product.deskripsi || "Informasi deskripsi belum tersedia untuk produk ini."}</Trans>
            </p>
          </div>

          <div className="mb-12">
             <h3 className="text-sm font-black text-[#00172D] dark:text-white uppercase tracking-widest mb-5 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#35ACDF]" /> <Trans>Spesifikasi Utama</Trans>
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
               {product.spesifikasi && product.spesifikasi.length > 0 ? (
                 product.spesifikasi.map((spec, sIdx) => (
                   <div key={sIdx} className="flex items-start gap-3">
                     <div className="w-5 h-5 rounded-full bg-[#35ACDF]/10 flex items-center justify-center shrink-0 mt-0.5">
                       <ChevronRight className="w-3.5 h-3.5 text-[#35ACDF]" />
                     </div>
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed"><Trans>{spec}</Trans></span>
                   </div>
                 ))
               ) : (
                  <span className="text-sm text-gray-400 font-medium italic col-span-2"><Trans>Spesifikasi detail tidak tersedia.</Trans></span>
               )}
             </div>
          </div>
          
          <div className="pt-8 hidden md:flex flex-row items-center gap-4 border-t border-gray-100 dark:border-slate-600/10">
             <Link 
               to="/appointment" 
               className="w-auto bg-[#00172D] dark:bg-white dark:text-[#000A15] hover:bg-gray-900 dark:hover:bg-gray-100 shadow-xl shadow-[#00172D]/10 dark:shadow-none text-white text-[11px] font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 animate-none"
             >
               <Trans>Konsultasi Pengadaan</Trans>
             </Link>
             <button onClick={() => window.print()} className="w-auto bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-[#00172D] dark:text-white text-[11px] font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-colors text-center border border-gray-200 dark:border-slate-600/10">
               <Trans>Cetak Penawaran / PDF</Trans>
             </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-slate-800 py-8 text-center bg-white dark:bg-[#000A15]/40 mt-auto md:mb-0 mb-20">
        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Harry Gultom. <Trans>Data Katalog Terverifikasi.</Trans>
        </p>
      </footer>
      
      {/* Custom Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#000A15]/95 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe p-3 flex gap-3">
         <button onClick={() => window.print()} className="w-1/3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-[#00172D] dark:text-white text-[10px] font-black uppercase tracking-widest py-3.5 rounded-xl transition-colors text-center border border-gray-200 dark:border-slate-600/10">
           <Trans>Cetak PDF</Trans>
         </button>
         <Link 
           to="/appointment" 
           className="flex-1 bg-[#00172D] dark:bg-white dark:text-[#000A15] shadow-xl shadow-[#00172D]/10 dark:shadow-none text-white text-[10px] font-black uppercase tracking-widest py-3.5 rounded-xl text-center flex items-center justify-center gap-2"
         >
           <Trans>Konsultasi</Trans>
         </Link>
      </div>
    </div>
  );
}
