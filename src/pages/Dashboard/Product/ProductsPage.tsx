import { Trans } from "../../../lib/LanguageContext";
import React, { useState, useEffect, useMemo, FormEvent, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PackageSearch, Target, TrendingUp, Search, Plus, Trash2, Edit2, X, Download, Upload, Image as ImageIcon, MoreVertical, FileText } from "lucide-react";
import { exportData, importData } from "../../../lib/exportUtils";

import { useNavigate, useOutletContext } from "react-router-dom";

interface Product {
  id: string;
  nama: string;
  kategori: string;
  merek: string;
  target_bulanan: number;
  tercapai: number;
  gambar?: string[];
  harga_satuan?: number;
  harga_normal?: number;
  harga_dasar?: number;
  harga_promo?: number;
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const { setHeaderConfig } = useOutletContext<{ setHeaderConfig: (config: any) => void }>();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setIsActionMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.merek.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  useEffect(() => {
    setHeaderConfig({
      title: "Produk & Target",
      subjudul: "Katalog Produk & Target Penjualan",
      showBack: false,
      searchBar: (
        <div key="search" className="relative flex-1 min-w-[100px] flex items-center bg-white dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-[#35ACDF]/50 h-[40px]">
           <Search className="absolute left-3 w-4 h-4 text-gray-400 shrink-0" />
           <input
             type="text"
             placeholder="Cari..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="pl-9 pr-4 py-2 w-full h-[38px] bg-transparent focus:outline-none text-sm font-medium rounded-full min-w-0"
           />
        </div>
      ),
      actions: (
        <>
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button 
              key="add"
              onClick={() => navigate('/dashboard/product/add')}
              className="w-[40px] h-[40px] md:w-auto px-0 md:px-4 bg-[#35ACDF] hover:bg-[#2c91bd] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4 text-white" /> <span className="hidden md:inline"><Trans>Tambah</Trans></span>
            </button>
            <div key="more" className="relative z-[9999] shrink-0" ref={actionMenuRef}>
              <button 
                onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                className="w-[40px] h-[40px] bg-white dark:bg-[#00172D] border border-gray-400 dark:border-slate-600 text-[#00172D] dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-slate-900/50 rounded-full shadow-sm transition-all flex items-center justify-center shrink-0 relative z-50"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              {isActionMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={(e) => { e.stopPropagation(); setIsActionMenuOpen(false); }}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#00172D] border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl flex flex-col transition-all z-50">
                     <div className="px-4 py-2 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 bg-gray-50 dark:bg-slate-900/60"><Trans>Tindakan</Trans></div>
                     <button onClick={() => { fileInputRef.current?.click(); setIsActionMenuOpen(false); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-2">
                       <Upload className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /><Trans>Import File</Trans></button>
                     <div className="px-4 py-2 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 bg-gray-50 dark:bg-slate-900/60"><Trans>Export Sebagai</Trans></div>
                     <button onClick={() => { exportData(filteredProducts, 'produk', 'csv'); setIsActionMenuOpen(false); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /><Trans>File CSV</Trans></button>
                     <button onClick={() => { exportData(filteredProducts, 'produk', 'json'); setIsActionMenuOpen(false); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /><Trans>File JSON</Trans></button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile Overlay */}
          <div className="md:hidden flex flex-col w-full min-w-[160px] -m-1">
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 pb-2"><Trans>Tindakan</Trans></div>
            <button onClick={() => { fileInputRef.current?.click(); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 whitespace-nowrap tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-3">
              <Upload className="w-4 h-4 text-gray-400 dark:text-gray-500" /><Trans>Import File</Trans></button>
            
            <div className="px-3 py-2 mt-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 pb-2 border-t dark:border-slate-600/5"><Trans>Export Sebagai</Trans></div>
            <button onClick={() => { exportData(filteredProducts, 'produk', 'csv'); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 whitespace-nowrap tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-3">
               <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500" /><Trans>File CSV</Trans></button>
            <button onClick={() => { exportData(filteredProducts, 'produk', 'json'); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 whitespace-nowrap tracking-widest flex items-center gap-3">
               <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500" /><Trans>File JSON</Trans></button>
          </div>
        </>
      )
    });
  }, [setHeaderConfig, isActionMenuOpen, searchQuery, navigate, filteredProducts]);

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file, (data) => {
        if (data.length > 0) {
          setProducts(prev => [...prev, ...data]);
        }
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 md:space-y-6 h-full pt-1 md:pt-4"
    >
      {loading ? (
        <div className="flex justify-center py-20">
           <div className="w-8 h-8 border-4 border-[#35ACDF] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Mobile Add Product Card */}
          <div className="md:hidden">
            <button
              onClick={() => navigate('/dashboard/product/add')}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#00172D] border border-dashed border-[#35ACDF]/40 dark:border-slate-600/20 hover:border-[#35ACDF] rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#35ACDF]/10 flex items-center justify-center text-[#35ACDF] group-hover:bg-[#35ACDF] group-hover:text-white transition-all duration-300">
                  <Plus className="w-5 h-5 shrink-0" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#00172D] dark:text-gray-100"><Trans>Buat Produk Baru</Trans></p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-450 font-medium"><Trans>Tambahkan katalog & target penjualan</Trans></p>
                </div>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#35ACDF] bg-[#35ACDF]/10 dark:bg-[#35ACDF]/20 px-2.5 py-1 rounded-lg"><Trans>Tambah</Trans></span>
            </button>
          </div>

          <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence>
              {filteredProducts.map((product, index) => {
                const displayImage = product.gambar?.[0] || null;
                
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    key={product.id}
                    onClick={() => navigate(`/dashboard/product/${product.id}`)}
                    className="bg-white dark:bg-[#00172D] rounded-2xl md:rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:shadow-[#35ACDF]/5 dark:hover:shadow-[#35ACDF]/10 transition-all duration-300 hover:scale-[1.02] flex flex-col cursor-pointer group overflow-hidden"
                  >
                    <div className="w-full aspect-square bg-gray-50 dark:bg-slate-900/50 flex items-center justify-center relative overflow-hidden">
                      {product.video ? (
                        <video 
                          src={product.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : displayImage ? (
                        <img src={displayImage} alt={product.nama} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    
                    <div className="p-4 md:p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-1.5 mb-2">
                         <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded shrink-0">
                           {product.merek}
                         </span>
                         <span className="text-[10px] text-gray-400 dark:text-gray-450 font-bold uppercase tracking-widest line-clamp-1">{product.kategori}</span>
                      </div>
                      
                      <h3 className="text-sm md:text-base font-bold text-[#00172D] dark:text-white mb-1 line-clamp-2 leading-tight">{product.nama}</h3>
                      
                      <div className="mt-auto pt-3">
                         {((product.harga_normal || product.harga_dasar) && (product.harga_promo || product.harga_satuan)) ? (
                           <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                               <span className="relative inline-block text-[9px] sm:text-[10px] md:text-xs text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap shrink-0">
                                 <span className="absolute w-[110%] h-[1.5px] bg-red-500 left-[-5%] top-1/2 -translate-y-1/2 -rotate-[8deg]"></span>
                                 Rp {(product.harga_normal || product.harga_dasar || 0).toLocaleString('id-ID')}
                               </span>
                              {(product.harga_promo) && (
                                <span className="px-1 py-0.5 bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 text-[8px] font-black rounded uppercase tracking-widest shrink-0">
                                  Disc {Math.round((1 - product.harga_promo / (product.harga_normal || product.harga_dasar || 1)) * 100)}%
                                </span>
                              )}
                           </div>
                         ) : null}
                         <p className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-black dark:text-[#35ACDF] leading-none whitespace-nowrap">
                           Rp {(product.harga_promo || product.harga_satuan || 0).toLocaleString('id-ID')}
                         </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
      <input 
        type="file" 
        accept=".csv,.json" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleImport} 
      />
    </motion.div>
  );
}
