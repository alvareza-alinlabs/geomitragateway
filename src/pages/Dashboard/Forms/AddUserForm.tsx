import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { ArrowLeft, Save, Shield } from "lucide-react";
import { motion } from "motion/react";
import { ROLES, RoleType } from "../../../lib/auth";

const defaultPermissions = {
  ringkasan: "Viewer" as RoleType,
  peta: "Viewer" as RoleType,
  mitra: "None" as RoleType,
  penjualan: "None" as RoleType,
  transaksi: "Viewer" as RoleType,
  produk: "Viewer" as RoleType,
  jadwal: "None" as RoleType,
  akses: "None" as RoleType,
};

export default function AddUserForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setHeaderConfig } = useOutletContext<{ setHeaderConfig: (config: any) => void }>();
  const isEditing = location.search.includes('edit=');
  
  useEffect(() => {
    setHeaderConfig({
      title: isEditing ? "Edit Pengguna" : "Tambah Pengguna",
      subjudul: "Detail profil dan hak akses",
      showBack: true
    });
  }, [setHeaderConfig, isEditing]);

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    hak_akses: defaultPermissions
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && (window as any).clearAppCache) (window as any).clearAppCache();
    navigate("/dashboard/access");
  };

  const handlePermissionChange = (feature: keyof typeof defaultPermissions, value: RoleType) => {
    setFormData(prev => ({
      ...prev,
      hak_akses: {
        ...prev.hak_akses,
        [feature]: value
      }
    }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-20 max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
           <h2 className="text-sm font-black text-[#00172D] uppercase tracking-widest mb-6">Informasi Akun</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Nama Lengkap</label>
                <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Email Akses</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Kata Sandi {isEditing && "(Kosongkan jika tidak diubah)"}</label>
                <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
              </div>
           </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
           <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-[#35ACDF]" />
              <h2 className="text-sm font-black text-[#00172D] uppercase tracking-widest">Atur Hak Akses</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
             {Object.keys(defaultPermissions).map((feature) => (
                <div key={feature} className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-widest capitalize">{feature}</span>
                  <select 
                    value={formData.hak_akses[feature as keyof typeof defaultPermissions]} 
                    onChange={(e) => handlePermissionChange(feature as keyof typeof defaultPermissions, e.target.value as RoleType)}
                    className="pr-8 pl-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none uppercase tracking-widest"
                  >
                     {ROLES.map(role => (
                        <option key={role} value={role}>{role}</option>
                     ))}
                  </select>
                </div>
             ))}
           </div>
        </div>

        <button type="submit" className="w-full py-4 bg-[#00172D] hover:bg-gray-800 text-white font-bold uppercase tracking-widest text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-2">
           <Save className="w-4 h-4 text-[#35ACDF]" /> Simpan Pengguna
        </button>
      </form>
    </motion.div>
  );
}
