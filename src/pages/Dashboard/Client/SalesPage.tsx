import { Trans } from "../../../lib/LanguageContext";
import React, { useState, useEffect, useMemo, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Phone, MapPin, X, Building, CheckCircle2, User, Mail, FileText, Briefcase, Hash, LayoutGrid, List, Table as TableIcon, Target, Download, Upload, Plus, MoreVertical } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ClientData } from "../../../types";
import { exportData, importData } from "../../../lib/exportUtils";

export default function SalesPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"card" | "list" | "table">("card");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setIsActionMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<ClientData>>({});

  const navigate = useNavigate();
  const { setHeaderConfig } = useOutletContext<{ setHeaderConfig: (config: any) => void }>();

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchSearch = client.nama_penanggung_jawab?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          client.perusahaan.toLowerCase().includes(searchQuery.toLowerCase());

      return matchSearch;
    });
  }, [clients, searchQuery]);

  useEffect(() => {
    setHeaderConfig({
      title: "Tim Sales & Broker",
      subjudul: "Daftar Tim Penjualan & Koneksi",
      showBack: false,
      searchBar: (
        <div key="search-filter" className="relative flex-1 min-w-[100px] flex items-center bg-white dark:bg-[#00172D] border border-gray-400 dark:border-slate-600 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-[#35ACDF]/50 h-[38px] sm:h-[40px]">
           <Search className="absolute left-3 w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
           <input
             type="text"
             placeholder="Cari..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="pl-9 pr-4 py-1.5 sm:py-2 w-full bg-transparent focus:outline-none text-[10px] sm:text-xs font-medium rounded-full min-w-0 text-gray-800 dark:text-white"
           />
        </div>
      ),
      actions: (
        <>
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button 
              key="add"
              onClick={() => navigate('/dashboard/sales/add')}
              className="hidden md:flex w-[40px] h-[40px] md:w-auto px-0 md:px-4 bg-[#35ACDF] hover:bg-[#2c91bd] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm transition-all items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4 text-white" /> <span className="hidden md:inline"><Trans>Tambah</Trans></span>
            </button>
            <div key="views" className="hidden md:flex bg-white dark:bg-[#00172D] border border-gray-400 dark:border-slate-600 rounded-full p-0.5 sm:p-1 shadow-sm h-[38px] sm:h-[40px] shrink-0 w-max">
              <button onClick={() => setViewMode("card")} className={`px-2.5 sm:px-3 py-1 flex items-center justify-center rounded-full transition-colors ${viewMode === "card" ? "bg-[#35ACDF] text-white shadow-md shadow-[#35ACDF]/30" : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"}`}>
                <LayoutGrid className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${viewMode === "card" ? "text-white" : "text-[#35ACDF]"}`} />
              </button>
              <button onClick={() => setViewMode("list")} className={`px-2.5 sm:px-3 py-1 flex items-center justify-center rounded-full transition-colors ${viewMode === "list" ? "bg-[#35ACDF] text-white shadow-md shadow-[#35ACDF]/30" : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"}`}>
                <List className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${viewMode === "list" ? "text-white" : "text-[#35ACDF]"}`} />
              </button>
              <button onClick={() => setViewMode("table")} className={`px-2.5 sm:px-3 py-1 flex items-center justify-center rounded-full transition-colors ${viewMode === "table" ? "bg-[#35ACDF] text-white shadow-md shadow-[#35ACDF]/30" : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"}`}>
                <TableIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${viewMode === "table" ? "text-white" : "text-[#35ACDF]"}`} />
              </button>
            </div>
            <div key="more" className="relative shrink-0" ref={actionMenuRef}>
              <button 
                onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                className="w-[38px] h-[38px] sm:w-[40px] sm:h-[40px] bg-white dark:bg-[#00172D] border border-gray-400 dark:border-slate-600 text-[#00172D] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-full shadow-sm transition-all flex items-center justify-center relative z-50"
              >
                <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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
                       <Upload className="w-3.5 h-3.5 text-gray-400 dark:text-gray-550" /><Trans>Import File</Trans></button>
                     <div className="px-4 py-2 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 bg-gray-50 dark:bg-slate-900/60"><Trans>Export Sebagai</Trans></div>
                     <button onClick={() => { exportData(filteredClients, 'data_sales', 'csv'); setIsActionMenuOpen(false); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-550" /><Trans>File CSV</Trans></button>
                     <button onClick={() => { exportData(filteredClients, 'data_sales', 'json'); setIsActionMenuOpen(false); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-550" /><Trans>File JSON</Trans></button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Actions Overlay (Rendered in Header's More Vertical) */}
          <div className="md:hidden flex flex-col w-full min-w-[160px] -m-1 bg-white dark:bg-[#00172D]">
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 pb-2"><Trans>Mode Tampilan</Trans></div>
            <div className="flex bg-gray-50 dark:bg-slate-900/60 rounded-lg p-1 mx-3 my-1 mt-2 items-center justify-between shadow-inner">
               <button onClick={() => { setViewMode("card"); }} className={`flex-1 py-1.5 flex items-center justify-center rounded-md transition-colors ${viewMode === "card" ? "bg-white dark:bg-[#001c38] shadow-sm text-[#35ACDF]" : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"}`}>
                 <LayoutGrid className="w-4 h-4" />
               </button>
               <button onClick={() => { setViewMode("list"); }} className={`flex-1 py-1.5 flex items-center justify-center rounded-md transition-colors ${viewMode === "list" ? "bg-white dark:bg-[#001c38] shadow-sm text-[#35ACDF]" : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"}`}>
                 <List className="w-4 h-4" />
               </button>
               <button onClick={() => { setViewMode("table"); }} className={`flex-1 py-1.5 flex items-center justify-center rounded-md transition-colors ${viewMode === "table" ? "bg-white dark:bg-[#001c38] shadow-sm text-[#35ACDF]" : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"}`}>
                 <TableIcon className="w-4 h-4" />
               </button>
            </div>
            
            <div className="px-3 py-2 mt-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 pb-2 border-t dark:border-slate-600/5"><Trans>Tindakan</Trans></div>
            <button onClick={() => { fileInputRef.current?.click(); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 whitespace-nowrap tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-3">
              <Upload className="w-4 h-4 text-gray-400 dark:text-gray-550" /><Trans>Import File</Trans></button>
            
            <div className="px-3 py-2 mt-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 pb-2 border-t dark:border-slate-600/5"><Trans>Export Sebagai</Trans></div>
            <button onClick={() => { exportData(filteredClients, 'data_sales', 'csv'); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 whitespace-nowrap tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-3">
               <FileText className="w-4 h-4 text-gray-400 dark:text-gray-550" /><Trans>File CSV</Trans></button>
            <button onClick={() => { exportData(filteredClients, 'data_sales', 'json'); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 whitespace-nowrap tracking-widest flex items-center gap-3">
               <FileText className="w-4 h-4 text-gray-400 dark:text-gray-550" /><Trans>File JSON</Trans></button>
          </div>
        </>
      )
    });
  }, [setHeaderConfig, viewMode, searchQuery, navigate, filteredClients, isActionMenuOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesRes = await fetch("/data/sales.json");
        const salesData = await salesRes.json();
        
        setClients(salesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file, (data) => {
        if (data.length > 0) {
          setClients(prev => [...prev, ...data]);
        }
      });
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const newSales = {
      ...formData,
      id: `SLS-${Date.now()}`,
      perusahaan: "Internal PT",
      tipe: "Sales",
      fokus_produk: formData.fokus_produk || [],
      garis_lintang: formData.garis_lintang || -6.200000,
      garis_bujur: formData.garis_bujur || 106.816666
    } as ClientData;
    
    setClients([newSales, ...clients]);
    setIsAdding(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 pt-2"
    >
      {/* Mobile Add Button */}
      <div className="md:hidden flex px-1">
        <button 
          onClick={() => navigate('/dashboard/sales/add')}
          className="w-full py-3 bg-[#35ACDF] hover:bg-[#2c91bd] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md shadow-[#35ACDF]/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /><Trans>Tambah Sales</Trans></button>
      </div>

      {/* Database Container */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#35ACDF] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="mt-1">
          {viewMode === "card" && (
            <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
              <AnimatePresence>
                {filteredClients.map((client) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    key={client.id}
                    onClick={() => navigate(`/dashboard/client/${client.id}`)}
                    className="bg-white dark:bg-[#00172D] rounded-xl md:rounded-3xl p-3 sm:p-5 md:p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-gray-200 dark:hover:border-white/10 transition-all duration-300 cursor-pointer flex flex-col hover:scale-[1.02]"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex flex-col">
                        <span className={`text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1 ${client.tipe === "Broker" ? "text-purple-600" : "text-[#35ACDF]"}`}>
                          {client.tipe}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xs sm:text-base md:text-lg font-bold text-[#00172D] dark:text-white mb-0.5 md:mb-1 truncate">{client.nama_penanggung_jawab}</h3>
                    <p className="text-[7px] sm:text-[9px] md:text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-2 md:mb-4 flex items-center gap-1 tracking-wider line-clamp-1">
                       {client.provinsi} &bull; {client.kota}
                    </p>

                    <div className="mt-auto space-y-1.5 sm:space-y-2 pt-2 md:pt-4 border-t border-gray-50 dark:border-slate-600/5 flex-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[11px] md:text-xs font-semibold text-gray-600 dark:text-gray-300">
                        <Building className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-[#35ACDF] shrink-0" />
                        <span className="truncate">{client.perusahaan}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[11px] md:text-xs font-semibold text-gray-600 dark:text-gray-300">
                        <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-[#35ACDF] shrink-0" />
                        <span className="truncate">{client.no_hp || client.telepon_kantor}</span>
                      </div>
                    </div>

                    <div className="mt-2 md:mt-4 flex flex-wrap gap-1 md:gap-1.5">
                      {false && client.fokus_produk?.map(f => (
                        <span key={f} className="text-[6px] sm:text-[8px] md:text-[9px] uppercase tracking-widest font-bold bg-gray-50 text-gray-500 px-1 sm:px-2 py-0.5 sm:py-1 rounded">
                          {f}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {viewMode === "list" && (
            <div className="space-y-3 md:space-y-4">
              <AnimatePresence>
                {filteredClients.map((client) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={client.id}
                    onClick={() => navigate(`/dashboard/client/${client.id}`)}
                    className="bg-white dark:bg-[#00172D] rounded-2xl p-4 md:p-5 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                       <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 dark:bg-slate-900 border border-gray-100/10 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                         <User className="w-4 h-4 md:w-5 md:h-5 text-[#35ACDF]" />
                       </div>
                       <div className="min-w-0">
                         <h3 className="font-bold text-[#00172D] dark:text-white text-base md:text-lg truncate">{client.nama_penanggung_jawab}</h3>
                         <p className="text-[11px] md:text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">{client.perusahaan} &bull; {client.provinsi}</p>
                       </div>
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${client.tipe === "Broker" ? "text-purple-600" : "text-[#35ACDF]"}`}>
                        {client.tipe}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {viewMode === "table" && (
            <div className="bg-white dark:bg-[#00172D] rounded-2xl md:rounded-3xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap min-w-[600px]">
                  <thead className="bg-gray-50 dark:bg-slate-900/60 border-b border-gray-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400"><Trans>Nama</Trans></th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400"><Trans>Tipe</Trans></th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400"><Trans>Perusahaan / Kontak</Trans></th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400"><Trans>Area</Trans></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                    {filteredClients.map((client) => (
                      <tr key={client.id} onClick={() => navigate(`/dashboard/client/${client.id}`)} className="hover:bg-gray-50/50 dark:hover:bg-white/5 cursor-pointer transition-colors group">
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <div className="font-bold text-[#00172D] dark:text-white text-xs md:text-sm">{client.nama_penanggung_jawab}</div>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <span className={`px-2 py-1 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded ${client.tipe === "Broker" ? "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400" : "bg-blue-50 dark:bg-blue-950/30 text-[#35ACDF]"}`}>
                            {client.tipe}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <div className="font-bold text-[#00172D] dark:text-white text-xs md:text-sm">{client.perusahaan}</div>
                          <div className="text-[9px] md:text-[10px] font-semibold text-gray-400 dark:text-gray-500 mt-0.5">{client.no_hp || client.telepon_kantor}</div>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                           <div className="text-[9px] md:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{client.kota}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredClients.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm"
            ><Trans>Tidak ada data yang ditemukan</Trans></motion.div>
          )}
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
