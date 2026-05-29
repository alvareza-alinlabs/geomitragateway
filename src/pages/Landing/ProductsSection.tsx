import { Trans } from "../../lib/LanguageContext";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Monitor, ArrowRight } from "lucide-react";
import { ProductData } from "../../types";

export default function ProductsSection({ products }: { products: ProductData[] }) {
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  };

  return (
    <section id="produk" className="relative z-10 bg-[#00172D] border-t-0 mt-12 md:mt-16 pt-12 md:pt-16 pb-16 md:pb-24">
      {/* Floating Catalog Badge Header */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="bg-red-500 px-8 py-3 md:px-12 md:py-4 rounded-full shadow-2xl flex items-center justify-center whitespace-nowrap shadow-black/30 border-2 border-white/20">
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight"><Trans>Katalog Solusi</Trans></h2>
        </div>
      </div>

      {/* Dynamic Animated Background Shimmer / Passing Lights */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Light 1: Diagonal Right Down */}
        <motion.div
          animate={{ 
            x: ['-50vw', '120vw'],
            y: ['-50vh', '120vh'],
            opacity: [0, 0.8, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-[80vw] md:w-[50vw] h-[80vw] md:h-[50vw] bg-[#50A2FF] rounded-full blur-[80px] md:blur-[120px] mix-blend-screen"
        />
        
        {/* Light 2: Diagonal Left Up */}
        <motion.div
          animate={{ 
            x: ['120vw', '-50vw'],
            y: ['120vh', '-50vh'],
            opacity: [0, 0.7, 0]
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: 3 }}
          className="absolute top-0 left-0 w-[90vw] md:w-[60vw] h-[90vw] md:h-[60vw] bg-[#35ACDF] rounded-full blur-[90px] md:blur-[140px] mix-blend-screen"
        />

        {/* Light 3: Horizontal Sweep */}
        <motion.div
          animate={{ 
            x: ['-100vw', '150vw'],
            opacity: [0, 0.75, 0]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear", delay: 1 }}
          className="absolute top-[30%] left-0 w-[100vw] h-[40vw] bg-[#50A2FF] rounded-full blur-[80px] md:blur-[120px] mix-blend-screen"
        />

        {/* Light 4: Vertical Sweep */}
        <motion.div
           animate={{
              y: ['150vh', '-50vh'],
              opacity: [0, 0.65, 0]
           }}
           transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 5 }}
           className="absolute left-[60%] top-0 w-[50vw] h-[100vw] bg-[#35ACDF] rounded-full blur-[100px] mix-blend-screen"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center justify-center mb-8 md:mb-12 text-center">
          <p className="text-gray-300 font-medium text-sm md:text-base leading-relaxed max-w-2xl px-4">
            <Trans>Perangkat keras pilihan premium untuk mendukung efisiensi transformasi tempat kerja digital Anda.</Trans>
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 8).map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link 
                to={`/katalog/${product.id}`}
                className={`bg-[#002244] border border-white/10 shadow-xl hover:shadow-2xl hover:border-[#50A2FF]/50 transition-all overflow-hidden flex flex-col group block h-full relative aspect-[4/5] ${idx % 2 === 0 ? '-rotate-2 md:rotate-0' : 'rotate-2 md:rotate-0'}`}
              >
                {product.video ? (
                  <video 
                    src={product.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />
                ) : product.gambar && product.gambar.length > 0 ? (
                  <img 
                    src={product.gambar[0]} 
                    alt={product.nama} 
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#00172D] flex items-center justify-center">
                    <Monitor className="w-16 h-16 text-white/20" />
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
