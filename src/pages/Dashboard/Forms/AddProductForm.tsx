import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ArrowLeft, Save, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { ProductData } from "../../../types";
import { CurrencyInput } from "../../../components/FormInputs";

export default function AddProductForm() {
  const navigate = useNavigate();
  const { setHeaderConfig } = useOutletContext<{ setHeaderConfig: (config: any) => void }>();

  useEffect(() => {
    setHeaderConfig({
      title: "Tambah Produk",
      subjudul: "Katalog Produk Baru",
      showBack: true,
      hideMobileActionsWrap: true,
      actions: (
        <button
          type="submit"
          form="add-product-form"
          className="flex items-center justify-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-[#35ACDF] text-white font-bold text-[10px] md:text-xs uppercase tracking-widest rounded-xl hover:bg-[#2c91bd] transition-all shadow-lg shadow-[#35ACDF]/20 cursor-pointer hover:scale-102 active:scale-98 whitespace-nowrap"
        >
          <Save className="w-4 h-4 md:w-4 md:h-4 text-white" />
          <span className="hidden md:inline">Simpan Produk</span>
        </button>
      )
    });
  }, [setHeaderConfig]);

  const [formData, setFormData] = useState<Partial<ProductData>>({
    kategori: "Security System",
    merek: "SecurX",
    spesifikasi: [""],
    gambar: [""]
  });

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    // Simulate save
    if (typeof window !== "undefined" && (window as any).clearAppCache) (window as any).clearAppCache();
    navigate("/dashboard/products");
  };

  const updateSpec = (index: number, value: string) => {
    const newSpecs = [...(formData.spesifikasi || [])];
    newSpecs[index] = value;
    setFormData({ ...formData, spesifikasi: newSpecs });
  };

  const addSpec = () => {
    setFormData({ ...formData, spesifikasi: [...(formData.spesifikasi || []), ""] });
  };

  const removeSpec = (index: number) => {
    const newSpecs = [...(formData.spesifikasi || [])];
    newSpecs.splice(index, 1);
    setFormData({ ...formData, spesifikasi: newSpecs });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...(formData.gambar || [])];
    newImages[index] = value;
    setFormData({ ...formData, gambar: newImages });
  };

  const addImage = () => {
    setFormData({ ...formData, gambar: [...(formData.gambar || []), ""] });
  };

  const removeImage = (index: number) => {
    const newImages = [...(formData.gambar || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, gambar: newImages });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-6 pb-10"
    >
      <form id="add-product-form" onSubmit={handleSave} className="space-y-6">
        <div className="bg-white dark:bg-[#00172D] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama / Model Produk</label>
              <input required type="text" value={formData.nama || ""} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600/5 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Merek</label>
                <select required value={formData.merek || "SecurX"} onChange={e => setFormData({...formData, merek: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600/5 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium">
                  <option value="SecurX">SecurX</option>
                  <option value="SpectraVision">SpectraVision</option>
                  <option value="GateKeep">GateKeep</option>
                  <option value="ConnectLink">ConnectLink</option>
                  <option value="Other">Lainnya</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kategori</label>
                <select required value={formData.kategori || "Security System"} onChange={e => setFormData({...formData, kategori: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600/5 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium">
                  <option value="Security System">Security System</option>
                  <option value="CCTV">CCTV</option>
                  <option value="Access Control">Access Control</option>
                  <option value="IT Peripheral">IT Peripheral</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Deskripsi Produk</label>
            <textarea value={formData.deskripsi || ""} onChange={e => setFormData({...formData, deskripsi: e.target.value})} rows={3} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600/5 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Harga Normal (IDR)</label>
              <CurrencyInput required value={formData.harga_normal || formData.harga_satuan || 0} onChange={val => setFormData({...formData, harga_normal: val, harga_satuan: val})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600/5 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Harga Dasar (Bottom) (IDR)</label>
              <CurrencyInput value={formData.harga_dasar || 0} onChange={val => setFormData({...formData, harga_dasar: val})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600/5 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Harga Promo (IDR)</label>
              <CurrencyInput value={formData.harga_promo || 0} onChange={val => setFormData({...formData, harga_promo: val})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600/5 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
            </div>
          </div>

        </div>

        <div className="bg-white dark:bg-[#00172D] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-black text-[#00172D] dark:text-white uppercase tracking-widest">Spesifikasi Kunci</h3>
            <button type="button" onClick={addSpec} className="px-3 py-1.5 bg-blue-50 text-[#35ACDF] hover:bg-[#35ACDF] hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
              <Plus className="w-3 h-3 text-[#35ACDF]" /> Tambah
            </button>
          </div>
          <div className="space-y-3">
             <AnimatePresence>
               {formData.spesifikasi?.map((spec, index) => (
                 <motion.div key={index} initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="flex gap-2">
                    <input type="text" value={spec} onChange={(e) => updateSpec(index, e.target.value)} placeholder={`Spec ${index + 1}`} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600/5 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
                    <button type="button" onClick={() => removeSpec(index)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                       <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                 </motion.div>
               ))}
             </AnimatePresence>
          </div>
        </div>

        <div className="bg-white dark:bg-[#00172D] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#35ACDF]" />
              <h3 className="text-sm font-black text-[#00172D] dark:text-white uppercase tracking-widest">Galeri Produk</h3>
            </div>
            <button type="button" onClick={addImage} className="px-3 py-1.5 bg-blue-50 text-[#35ACDF] hover:bg-[#35ACDF] hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
              <Plus className="w-3 h-3 text-[#35ACDF]" /> Tambah Image URL
            </button>
          </div>
          <div className="space-y-3">
             <AnimatePresence>
               {formData.gambar?.map((img, index) => (
                 <motion.div key={index} initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="flex gap-2">
                    <input type="url" value={img} onChange={(e) => updateImage(index, e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600/5 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
                    {img && (
                      <div className="w-12 h-10 shrink-0 border border-gray-400 dark:border-slate-600 rounded flex items-center justify-center overflow-hidden bg-white dark:bg-white/5">
                        <img src={img} alt="Preview" className="max-w-full max-h-full object-cover" onError={e => e.currentTarget.style.display='none'} />
                      </div>
                    )}
                    <button type="button" onClick={() => removeImage(index)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                       <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                 </motion.div>
               ))}
             </AnimatePresence>
          </div>
        </div>


      </form>
    </motion.div>
  );
}
