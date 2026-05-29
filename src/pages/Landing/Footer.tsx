import { Trans } from "../../lib/LanguageContext";
export default function Footer({ data }: { data?: any }) {
  return (
    <footer className="bg-white dark:bg-[#000A15] border-t border-gray-200 dark:border-slate-600/5 mt-auto pb-16 md:pb-0 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-20 flex flex-col md:flex-row items-start justify-between gap-6 md:gap-12">
        <div className="max-w-sm">
          <div className="flex items-center gap-3 mb-4 md:mb-8">
             <div className="w-10 h-10 bg-white rounded-xl flex-shrink-0 flex items-center justify-center shadow-md overflow-hidden">
               <img src="/gambar/poto-harry.png" alt="Harry Gultom Logo" className="w-full h-full object-cover" />
             </div>
             <span className="font-black text-xl tracking-tight text-[#00172D] dark:text-white">Harry <span className="text-[#35ACDF]">Gultom</span></span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed"><Trans>{data?.deskripsi || "Seorang Sales Development Manager dan wakil produk principal resmi untuk ekosistem TI, komputasi HP Inc, serta kolaborasi pintar dari Poly."}</Trans></p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 md:gap-16 w-full md:w-auto md:justify-end">
          <div className="flex flex-col gap-2 md:gap-4">
             <h4 className="font-black text-[#00172D] dark:text-gray-200 mb-2 md:mb-4 uppercase tracking-widest text-[10px]"><Trans>Kantor Pusat</Trans></h4>
             <p className="text-sm font-bold text-gray-500 dark:text-gray-400 flex flex-col gap-1">
               Gedung Harry Gultom<br/>SCBD, Jakarta Selatan 12190
             </p>
          </div>
          
          <div className="flex flex-col gap-2 md:gap-4 mt-2 sm:mt-0">
             <h4 className="font-black text-[#00172D] dark:text-gray-200 mb-2 md:mb-4 uppercase tracking-widest text-[10px]"><Trans>Direktori Utama</Trans></h4>
             <p className="text-sm font-bold text-gray-500 dark:text-gray-400 flex flex-col gap-1">
               info@harrygultom.id<br/>+62 21 8900 1200
             </p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-slate-800 py-6 md:py-8 text-center bg-gray-50 dark:bg-black/20">
        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2">
          &copy; {new Date().getFullYear()} Harry Gultom.
        </p>
      </div>
    </footer>
  );
}
