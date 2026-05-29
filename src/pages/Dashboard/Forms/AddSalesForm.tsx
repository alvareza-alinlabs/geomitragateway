import { useState, FormEvent, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import { ClientData } from "../../../types";
import { PhoneInput } from "../../../components/FormInputs";

export default function AddSalesForm() {
  const navigate = useNavigate();
  const { setHeaderConfig } = useOutletContext<{ setHeaderConfig: (config: any) => void }>();

  useEffect(() => {
    setHeaderConfig({
      title: "Tambah Tim Sales",
      subjudul: "Daftarkan Tim Sales Internal Baru",
      showBack: true,
      hideMobileActionsWrap: true,
      actions: (
         <>
           <button type="button" onClick={() => { if (typeof window !== "undefined" && (window as any).clearAppCache) (window as any).clearAppCache(); navigate(-1); }} className="p-2 md:px-4 md:py-2 md:bg-gray-50 md:hover:bg-gray-100 border-transparent md:border-gray-200 text-gray-400 hover:text-gray-600 md:text-gray-600 font-bold uppercase tracking-widest text-[10px] rounded-full md:rounded-xl flex items-center justify-center md:inline-flex md:justify-start gap-1.5 transition-all">
             <X className="w-5 h-5 md:hidden" />
             <span className="hidden md:inline">Batal</span>
           </button>
           <button type="submit" form="add-sales-form" className="p-2 md:px-5 md:py-2 md:bg-[#00172D] hover:bg-gray-50 md:hover:bg-gray-900 text-[#35ACDF] md:text-white font-bold uppercase tracking-widest text-[10px] rounded-full md:rounded-xl flex items-center justify-center md:inline-flex md:justify-start gap-1.5 transition-all md:shadow-md">
             <Save className="w-5 h-5 md:w-3.5 md:h-3.5 md:text-[#35ACDF]" />
             <span className="hidden md:inline">Tambah Sales</span>
           </button>
         </>
      )
    });
  }, [setHeaderConfig, navigate]);

  const [formData, setFormData] = useState<Partial<ClientData>>({
    status_kemitraan: "Mitra Aktif"
  });

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && (window as any).clearAppCache) (window as any).clearAppCache();
    navigate("/dashboard/sales");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto space-y-6 pb-10"
    >
      <div className="bg-white dark:bg-[#00172D] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm">
        <form id="add-sales-form" onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipe Keanggotaan</label>
              <select required value={formData.tipe || "Sales"} onChange={e => setFormData({...formData, tipe: e.target.value as "Sales" | "Broker"})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium">
                <option value="Sales">Sales Internal</option>
                <option value="Broker">Broker / Koneksi Freelance</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap (PIC)</label>
              <input required type="text" value={formData.nama_penanggung_jawab || ""} onChange={e => setFormData({...formData, nama_penanggung_jawab: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jabatan</label>
              <input required type="text" placeholder="Area Sales Manager" value={formData.jabatan || ""} onChange={e => setFormData({...formData, jabatan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Telepon / WhatsApp</label>
              <PhoneInput required value={formData.no_hp || formData.telepon_kantor || ""} onChange={val => setFormData({...formData, no_hp: val, telepon_kantor: val})} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus-within:ring-2 focus-within:ring-[#35ACDF]/50" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Perusahaan</label>
              <input required type="email" value={formData.email_kantor || ""} onChange={e => setFormData({...formData, email_kantor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Area Assignment (Provinsi)</label>
              <input required type="text" value={formData.provinsi || ""} onChange={e => setFormData({...formData, provinsi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold flex items-center gap-1 text-orange-500 uppercase tracking-widest">Latitude (Garis Lintang)</label>
              <input required step="any" type="number" inputMode="decimal" value={formData.garis_lintang || ""} onChange={e => setFormData({...formData, garis_lintang: parseFloat(e.target.value)})} placeholder="-6.200000" className="w-full px-4 py-3 bg-blue-50/30 dark:bg-blue-900/30 border border-orange-200 dark:border-orange-500/30 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500/50 outline-none text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold flex items-center gap-1 text-[#35ACDF] uppercase tracking-widest">Longitude (Garis Bujur)</label>
              <input required step="any" type="number" inputMode="decimal" value={formData.garis_bujur || ""} onChange={e => setFormData({...formData, garis_bujur: parseFloat(e.target.value)})} placeholder="106.816666" className="w-full px-4 py-3 bg-orange-50/30 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-500/30 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500/50 outline-none text-sm font-medium" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alamat Detail Lengkap / Base Area</label>
            <textarea required rows={3} value={formData.alamat_detail || ""} onChange={e => setFormData({...formData, alamat_detail: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium resize-none" />
          </div>
        </form>
      </div>
    </motion.div>
  );
}
