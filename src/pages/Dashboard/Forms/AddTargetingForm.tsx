import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams, useOutletContext } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Target, 
  ChevronLeft, 
  Save, 
  Search, 
  Check, 
  Calendar, 
  TrendingUp,
  Package,
  FileText,
  X
} from "lucide-react";
import { TargetData, ProductData } from "../../../types";
import { CurrencyInput } from "../../../components/FormInputs";

export default function AddTargetingForm() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { setHeaderConfig } = useOutletContext<{ setHeaderConfig: (config: any) => void }>();

  // Get initial values from query params or existing data
  const qMonth = searchParams.get("month");
  const qYear = searchParams.get("year");

  const [formData, setFormData] = useState<Partial<TargetData>>({
    bulan: qMonth ? Number(qMonth) : new Date().getMonth() + 1,
    tahun: qYear ? Number(qYear) : new Date().getFullYear(),
    nilai_sasaran: 0,
    fokus_produk: [],
    catatan: ""
  });

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  useEffect(() => {
    setHeaderConfig({
      title: <span className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#35ACDF]" />
              {isEdit ? "Edit Konfigurasi Target" : "Setup Target Baru"}
            </span>,
      subjudul: `PERIODE: ${monthNames[(formData.bulan || 1) - 1]} ${formData.tahun}`,
      showBack: true,
      hideMobileActionsWrap: true,
      actions: (
         <>
           <button type="button" onClick={() => { if (typeof window !== "undefined" && (window as any).clearAppCache) (window as any).clearAppCache(); navigate(-1); }} className="p-2 md:px-4 md:py-2 md:bg-gray-50 md:dark:bg-slate-800 md:hover:bg-gray-100 md:dark:hover:bg-slate-700 border-transparent md:border-gray-200 dark:border-slate-600/5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 md:text-gray-600 dark:md:text-gray-300 font-bold uppercase tracking-widest text-[10px] rounded-full md:rounded-xl flex items-center justify-center md:inline-flex md:justify-start gap-1.5 transition-all">
             <X className="w-5 h-5 md:hidden" />
             <span className="hidden md:inline">Batal</span>
           </button>
           <button type="submit" form="add-target-form" className="p-2 md:px-5 md:py-2 md:bg-[#00172D] dark:md:bg-[#35ACDF] hover:bg-gray-50 md:hover:bg-gray-900 dark:hover:bg-[#48bceb] text-[#35ACDF] dark:text-white md:text-white dark:md:text-slate-900 font-bold uppercase tracking-widest text-[10px] rounded-full md:rounded-xl flex items-center justify-center md:inline-flex md:justify-start gap-1.5 transition-all md:shadow-md">
             <Save className="w-5 h-5 md:w-3.5 md:h-3.5 md:text-[#35ACDF] dark:md:text-slate-900" />
             <span className="hidden md:inline">Simpan Target</span>
           </button>
         </>
      )
    });
  }, [setHeaderConfig, isEdit, formData.bulan, formData.tahun, navigate]);

  const [products, setProducts] = useState<ProductData[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const prodRes = await fetch("/data/products.json");
        const prodData = await prodRes.json();
        setProducts(prodData);

        if (isEdit) {
          // Find existing target
          const targetRes = await fetch("/data/targeting.json");
          const allTargets: TargetData[] = await targetRes.json();
          let found = allTargets.find(t => t.id === id);
          
          if (!found) {
            const stored = localStorage.getItem("targets");
            if (stored) {
              const localTargets: TargetData[] = JSON.parse(stored);
              found = localTargets.find(t => t.id === id);
            }
          }

          if (found) {
            setFormData(found);
          }
        } else if (qMonth && qYear) {
           // If direct from card, check if target already exists for that period locally
           const stored = localStorage.getItem("targets");
           if (stored) {
              const localTargets: TargetData[] = JSON.parse(stored);
              const found = localTargets.find(t => t.bulan === Number(qMonth) && t.tahun === Number(qYear));
              if (found) {
                 setFormData(found);
                 // Note: we could redirect to edit/id but showing it here is also fine
              }
           }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading form data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEdit, qMonth, qYear]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.bulan || !formData.tahun || formData.nilai_sasaran === undefined) return;

    const newTarget: TargetData = {
      id: formData.id || `tgt-${formData.tahun}-${formData.bulan}-${Date.now()}`,
      bulan: formData.bulan as number,
      tahun: formData.tahun as number,
      nilai_sasaran: formData.nilai_sasaran as number,
      fokus_produk: formData.fokus_produk || [],
      catatan: formData.catatan || ""
    };

    // Store in localStorage (client-side simulation)
    const stored = localStorage.getItem("targets");
    let currentTargets: TargetData[] = stored ? JSON.parse(stored) : [];
    
    // Duplicate check for add
    const existingIdx = currentTargets.findIndex(t => 
      (isEdit && t.id === id) || (!isEdit && t.bulan === newTarget.bulan && t.tahun === newTarget.tahun)
    );

    if (existingIdx !== -1) {
      currentTargets[existingIdx] = newTarget;
    } else {
      currentTargets.push(newTarget);
    }

    localStorage.setItem("targets", JSON.stringify(currentTargets));
    if (typeof window !== "undefined" && (window as any).clearAppCache) (window as any).clearAppCache();
    navigate(isEdit ? `/dashboard/targeting/detail/${newTarget.id}` : "/dashboard/targeting");
  };

  const toggleFocusProduct = (productId: string) => {
    const current = formData.fokus_produk || [];
    if (current.includes(productId)) {
      setFormData({ ...formData, fokus_produk: current.filter(id => id !== productId) });
    } else {
      setFormData({ ...formData, fokus_produk: [...current, productId] });
    }
  };

  const filteredProducts = products.filter(p => 
    p.nama.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.merek.toLowerCase().includes(productSearch.toLowerCase())
  );

  const formatRupiah = (number: number | undefined) => {
    if (number === undefined) return "Rp -";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-400">Menyiapkan Form...</div>;

  const isPeriodFixed = isEdit || (qMonth && qYear);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="w-full space-y-8">
        <form id="add-target-form" onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Main Config */}
            <div className="bg-white dark:bg-[#00172D] p-8 md:p-10 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                  <TrendingUp className="w-48 h-48 text-[#35ACDF]" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      Periode Penjualan
                    </label>
                    <div className="px-5 py-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl font-black text-gray-900 dark:text-white flex items-center justify-between">
                      <span>{monthNames[(formData.bulan || 1) - 1]}</span>
                      <span className="text-[#35ACDF]">{formData.tahun}</span>
                    </div>
                    {isPeriodFixed ? (
                      <p className="text-[9px] text-orange-500 font-black uppercase tracking-tighter">* Periode sudah dikunci sistem</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                         <select 
                            value={formData.bulan}
                            onChange={(e) => setFormData({...formData, bulan: Number(e.target.value)})}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl font-bold text-xs text-gray-900 dark:text-white outline-none focus:border-[#35ACDF] transition-all"
                         >
                            {monthNames.map((n, i) => <option key={i} value={i+1}>{n}</option>)}
                         </select>
                         <select 
                            value={formData.tahun}
                            onChange={(e) => setFormData({...formData, tahun: Number(e.target.value)})}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl font-bold text-xs text-gray-900 dark:text-white outline-none focus:border-[#35ACDF] transition-all"
                         >
                            {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                         </select>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Target Revenue (Gross)
                    </label>
                    <div className="relative group">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-300 group-focus-within:text-[#35ACDF] transition-colors z-10">Rp</span>
                      <CurrencyInput 
                        value={formData.nilai_sasaran as number}
                        onChange={(val) => setFormData({...formData, nilai_sasaran: val})}
                        className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl font-black text-gray-900 dark:text-white focus:ring-8 focus:ring-[#35ACDF]/5 outline-none text-2xl transition-all"
                      />
                    </div>
                  </div>
               </div>
            </div>

            {/* Focus Products Advanced Search */}
            <div className="bg-white dark:bg-[#00172D] p-8 md:p-10 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-8">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
                    <Package className="w-6 h-6 text-[#35ACDF]" />
                    Optimasi Fokus Produk
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Pilih SKU yang menjadi prioritas penetrasi pasar</p>
                </div>
                
                <div className="relative w-full md:w-80">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Ketik nama produk..."
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setShowResults(e.target.value.length > 0);
                    }}
                    onFocus={() => productSearch.length > 0 && setShowResults(true)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl outline-none focus:border-[#35ACDF] focus:ring-4 focus:ring-[#35ACDF]/5 transition-all text-sm font-bold text-gray-900 dark:text-white"
                  />

                  {/* Results Popup */}
                  {showResults && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-0 right-0 top-full mt-3 bg-white dark:bg-[#00172D] border border-gray-400 dark:border-slate-600 rounded-3xl shadow-2xl shadow-black/10 z-[100] max-h-[400px] overflow-y-auto p-4 space-y-3"
                    >
                      <div className="flex justify-between items-center px-2 py-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hasil Pencarian</span>
                        <button onClick={() => setShowResults(false)} className="text-[10px] font-black text-red-400 hover:text-red-500">TUTUP</button>
                      </div>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map(p => {
                          const isSelected = formData.fokus_produk?.includes(p.id);
                          return (
                            <button 
                              key={p.id}
                              type="button"
                              onClick={() => {
                                toggleFocusProduct(p.id);
                                // Don't close if they might select more? User said "klik baru akan menjadi list"
                              }}
                              className={`w-full flex gap-4 p-3 rounded-2xl border transition-all text-left group ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-inner' : 'bg-white dark:bg-[#00172D] border-transparent hover:bg-gray-50 dark:hover:bg-slate-900'}`}
                            >
                              <div className="w-14 h-14 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-slate-800 flex-shrink-0 overflow-hidden">
                                 <img 
                                   src={p.gambar?.[0] || `https://placehold.co/100x100/eeeeee/00172D?text=${p.merek}`} 
                                   alt={p.nama} 
                                   className="w-full h-full object-cover"
                                 />
                              </div>
                              <div className="flex-1 min-w-0 py-1">
                                <p className="text-xs font-black text-gray-900 dark:text-white truncate group-hover:text-[#35ACDF]">{p.nama}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{p.merek}</p>
                                <div className="mt-1 flex gap-2">
                                   <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 uppercase">Promo: {formatRupiah(p.harga_promo)}</span>
                                   <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-green-50 text-green-600 uppercase">Bottom: {formatRupiah(p.harga_satuan)}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-center pr-2">
                                 <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#35ACDF] border-[#35ACDF]' : 'border-gray-100 group-hover:border-blue-200'}`}>
                                    {isSelected && <Check className="w-4 h-4 text-white" />}
                                 </div>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="py-10 text-center">
                          <p className="text-xs font-bold text-gray-400 italic">Produk tidak ditemukan</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Selected List - "Cart" Style */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">List Produk Terpilih ({formData.fokus_produk?.length || 0})</p>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, fokus_produk: []})}
                      className="text-[9px] font-black text-red-400 hover:text-red-500 underline uppercase tracking-tighter"
                    >
                      Bereskan Semua
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.fokus_produk?.length === 0 ? (
                      <div className="col-span-full py-16 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center space-y-3">
                         <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center text-gray-200 dark:text-gray-600">
                           <Package className="w-10 h-10" />
                         </div>
                         <p className="text-xs font-bold text-gray-400">Belum ada produk SKU yang dipilih as fokus</p>
                      </div>
                    ) : (
                      formData.fokus_produk?.map(pid => {
                        const p = products.find(prod => prod.id === pid);
                        if (!p) return null;
                        return (
                          <motion.div 
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={pid} 
                            className="bg-white dark:bg-[#00172D] border border-gray-200 dark:border-slate-800 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-all group relative"
                          >
                            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900/50 rounded-xl overflow-hidden border border-gray-50 dark:border-slate-600/5 transition-transform group-hover:scale-105">
                               <img 
                                 src={p.gambar?.[0] || `https://placehold.co/200x200/eeeeee/00172D?text=${p.merek}`} 
                                 alt={p.nama} 
                                 className="w-full h-full object-cover"
                               />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                              <div>
                                <h4 className="text-sm font-black text-gray-900 dark:text-white truncate leading-tight mb-0.5">{p.nama}</h4>
                                <p className="text-[9px] font-bold text-[#35ACDF] bg-blue-50 px-1.5 py-0.5 rounded-md inline-block uppercase tracking-widest">{p.merek}</p>
                              </div>
                              
                              <div className="space-y-1 mt-2">
                                <div className="flex justify-between items-center text-[9px] font-bold">
                                   <span className="text-gray-400">Normal</span>
                                   <span className="text-gray-500">{formatRupiah(p.harga_normal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[9px] font-bold">
                                   <span className="text-gray-400">Promotion</span>
                                   <span className="text-orange-500">{formatRupiah(p.harga_promo)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black border-t border-gray-50 pt-1 mt-1">
                                   <span className="text-gray-900 dark:text-white">Bottom Price</span>
                                   <span className="text-green-600">{formatRupiah(p.harga_satuan)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <button 
                              type="button"
                              onClick={() => toggleFocusProduct(p.id)}
                              className="absolute -top-2 -right-2 w-7 h-7 bg-white dark:bg-slate-800 border border-gray-400 dark:border-slate-600 shadow-md rounded-full flex items-center justify-center text-gray-300 dark:text-gray-500 hover:text-red-500 hover:border-red-100 transition-colors"
                            >
                               <Check className="w-4 h-4" />
                            </button>
                          </motion.div>
                        )
                      })
                    )}
                 </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
             {/* Notes / Strategy */}
             <div className="bg-white dark:bg-[#00172D] p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
                <div>
                   <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                     <FileText className="w-5 h-5 text-[#35ACDF]" />
                     Strategi Penjualan
                   </h3>
                   <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Catatan internal tim sales</p>
                </div>
                <textarea 
                  value={formData.catatan}
                  onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                  placeholder="Tuliskan detail strategi, tantangan, atau peluang pasar bulan ini..."
                  rows={8}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-100 outline-none focus:ring-4 focus:ring-[#35ACDF]/5 focus:border-[#35ACDF] transition-all leading-relaxed custom-scrollbar"
                />
             </div>

             {/* Summary & Save */}
             <div className="bg-[#00172D] p-8 rounded-3xl text-white shadow-2xl shadow-[#00172D]/20 space-y-8">
                <div className="space-y-4">
                   <h3 className="text-lg font-black tracking-tight">Final Check</h3>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                         <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Revenue Goal</span>
                         <span className="text-sm font-black text-[#35ACDF]">{formatRupiah(formData.nilai_sasaran)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                         <span className="text-xs font-bold text-white/50 uppercase tracking-widest">SKU Terpilih</span>
                         <span className="text-sm font-black">{formData.fokus_produk?.length || 0} Unit</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                         <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Periode Tag</span>
                         <span className="text-sm font-black uppercase text-[10px]">{monthNames[(formData.bulan || 1) - 1]} {formData.tahun}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
}

