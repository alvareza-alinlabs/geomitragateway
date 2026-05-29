import { useState, FormEvent, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Save, Navigation, Loader2, MapPin, X } from "lucide-react";
import { ClientData } from "../../../types";
import { PhoneInput } from "../../../components/FormInputs";
import InteractiveMap from "../../../components/InteractiveMap";

export default function AddPartnerForm() {
  const navigate = useNavigate();
  const { setHeaderConfig } = useOutletContext<{ setHeaderConfig: (config: any) => void }>();
  
  useEffect(() => {
    setHeaderConfig({
      title: "Formulir Partner",
      subjudul: "Tambah / Edit Data Mitra",
      showBack: true,
      hideMobileActionsWrap: true,
      actions: (
         <>
           <button type="button" onClick={() => navigate(-1)} className="p-2 md:px-4 md:py-2 md:bg-gray-50 md:hover:bg-gray-100 border-transparent md:border-gray-200 text-gray-400 hover:text-gray-600 md:text-gray-600 font-bold uppercase tracking-widest text-[10px] rounded-full md:rounded-xl flex items-center justify-center md:inline-flex md:justify-start gap-1.5 transition-all">
             <X className="w-5 h-5 md:hidden" />
             <span className="hidden md:inline">Batal</span>
           </button>
           <button type="submit" form="add-partner-form" className="p-2 md:px-5 md:py-2 md:bg-[#00172D] hover:bg-gray-50 md:hover:bg-gray-900 text-[#35ACDF] md:text-white font-bold uppercase tracking-widest text-[10px] rounded-full md:rounded-xl flex items-center justify-center md:inline-flex md:justify-start gap-1.5 transition-all md:shadow-md">
             <Save className="w-5 h-5 md:w-3.5 md:h-3.5 md:text-[#35ACDF]" />
             <span className="hidden md:inline">Simpan Partner</span>
           </button>
         </>
      )
    });
  }, [setHeaderConfig, navigate]);

  const [formData, setFormData] = useState<Partial<ClientData>>({
    tipe: "Distributor",
    fokus_produk: []
  });

  const [isLocating, setIsLocating] = useState(false);

  const updateLocationDetails = async (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, garis_lintang: lat, garis_bujur: lng }));
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      if (data && data.display_name) {
         setFormData((prev) => ({ ...prev, alamat_detail: data.display_name }));
      } else {
         const fallbackResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`);
         const fallbackData = await fallbackResponse.json();
         if (fallbackData) {
           const addressParts = [fallbackData.locality, fallbackData.city, fallbackData.principalSubdivision, fallbackData.countryName].filter(Boolean);
           if (addressParts.length > 0) {
              setFormData((prev) => ({ ...prev, alamat_detail: addressParts.join(", ") }));
           }
         }
      }
    } catch (error) {
      console.error("Error fetching address: ", error);
    }
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          updateLocationDetails(lat, lng);
          setIsLocating(false);
        },
        (error) => {
          alert("Gagal mendapatkan lokasi. Pastikan izin lokasi (GPS) diberikan.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    } else {
      alert("Browser Anda tidak mendukung geolokasi GPS.");
      setIsLocating(false);
    }
  };

  const handleProductToggle = (product: string) => {
    const currentProducts = formData.fokus_produk || [];
    if (currentProducts.includes(product)) {
      setFormData({ ...formData, fokus_produk: currentProducts.filter(p => p !== product) });
    } else {
      setFormData({ ...formData, fokus_produk: [...currentProducts, product] });
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    // Simulate save
    if (typeof window !== "undefined" && (window as any).clearAppCache) (window as any).clearAppCache();
    navigate("/dashboard/partners");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-6 pb-10"
    >
      <div className="bg-white dark:bg-[#00172D] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm">
        <form id="add-partner-form" onSubmit={handleSave} className="space-y-8">
          
          {/* Bagian 1: Perusahaan */}
          <div>
            <h3 className="text-sm font-bold text-[#00172D] dark:text-white uppercase tracking-widest border-b border-gray-400 dark:border-slate-600 pb-2 mb-4">1. Profil Perusahaan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Perusahaan</label>
                <input required type="text" value={formData.perusahaan || ""} onChange={e => setFormData({...formData, perusahaan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jenis Perusahaan</label>
                <select required value={formData.jenis_perusahaan || ""} onChange={e => setFormData({...formData, jenis_perusahaan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium cursor-pointer">
                  <option value="" disabled>-- Pilih Jenis Perusahaan --</option>
                  <option value="Manufaktur">Manufaktur</option>
                  <option value="Bank / Keuangan">Bank / Keuangan</option>
                  <option value="Retail">Retail</option>
                  <option value="Teknologi / IT">Teknologi / IT</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Lainnya">Lainnya...</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Kantor</label>
                <input type="email" value={formData.email_kantor || ""} onChange={e => setFormData({...formData, email_kantor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Telepon Kantor</label>
                <input type="tel" inputMode="numeric" value={formData.telepon_kantor || ""} onChange={e => setFormData({...formData, telepon_kantor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
              </div>
            </div>
          </div>

          {/* Bagian 2: PIC */}
          <div>
            <h3 className="text-sm font-bold text-[#00172D] dark:text-white uppercase tracking-widest border-b border-gray-400 dark:border-slate-600 pb-2 mb-4">2. Person In Charge (PIC)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama PIC / Kontak</label>
                <input required type="text" value={formData.nama_penanggung_jawab || ""} onChange={e => setFormData({...formData, nama_penanggung_jawab: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jabatan PIC</label>
                <input required type="text" value={formData.jabatan || ""} onChange={e => setFormData({...formData, jabatan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nomor HP / WhatsApp</label>
                <PhoneInput required value={formData.no_hp || ""} onChange={val => setFormData({...formData, no_hp: val})} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus-within:ring-2 focus-within:ring-[#35ACDF]/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#35ACDF] uppercase tracking-widest">Nama Sales Internal (Penanggung Jawab)</label>
                <input type="text" value={formData.nama_penjual || ""} onChange={e => setFormData({...formData, nama_penjual: e.target.value})} className="w-full px-4 py-3 bg-blue-50/50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
              </div>
            </div>
          </div>

          {/* Bagian 3: Lokasi & Koordinat */}
          <div>
            <h3 className="text-sm font-bold text-[#00172D] dark:text-white uppercase tracking-widest border-b border-gray-400 dark:border-slate-600 pb-2 mb-4">3. Lokasi & Peta (WAJIB UNTUK MAPS)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Provinsi</label>
                <input required type="text" value={formData.provinsi || ""} onChange={e => setFormData({...formData, provinsi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kota / Kabupaten</label>
                <input required type="text" value={formData.kota || ""} onChange={e => setFormData({...formData, kota: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Area Kawasan</label>
                <input type="text" value={formData.area || ""} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold flexitems-center gap-1 text-orange-500 uppercase tracking-widest">Latitude (Garis Lintang)</label>
                <input required step="any" type="number" inputMode="decimal" value={formData.garis_lintang || ""} onChange={e => setFormData({...formData, garis_lintang: parseFloat(e.target.value)})} placeholder="-6.200000" className="w-full px-4 py-3 bg-blue-50/30 dark:bg-blue-900/30 border border-orange-200 dark:border-orange-500/30 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500/50 outline-none text-sm font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold flex items-center gap-1 text-[#35ACDF] uppercase tracking-widest">Longitude (Garis Bujur)</label>
                <input required step="any" type="number" inputMode="decimal" value={formData.garis_bujur || ""} onChange={e => setFormData({...formData, garis_bujur: parseFloat(e.target.value)})} placeholder="106.816666" className="w-full px-4 py-3 bg-orange-50/30 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-500/30 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500/50 outline-none text-sm font-medium" />
              </div>
              <div className="md:col-span-2 pt-2">
                <button type="button" onClick={handleGetCurrentLocation} disabled={isLocating} className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-[#35ACDF]/10 text-[#35ACDF] font-bold text-sm rounded-xl hover:bg-[#35ACDF]/20 transition-colors disabled:opacity-50">
                  {isLocating ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Mencari Lokasi...</span></> : <><Navigation className="w-4 h-4" /><span>Gunakan GPS Saat Ini</span></>}
                </button>
                <div className="w-full rounded-xl overflow-hidden border border-gray-400 dark:border-slate-600 mt-3 aspect-[4/3] md:aspect-[16/9] relative z-0">
                  <InteractiveMap 
                    position={{ lat: formData.garis_lintang || -6.200000, lng: formData.garis_bujur || 106.816666 }} 
                    onPositionChange={(pos) => updateLocationDetails(pos.lat, pos.lng)} 
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alamat Detail Lengkap</label>
              <textarea required rows={3} value={formData.alamat_detail || ""} onChange={e => setFormData({...formData, alamat_detail: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium resize-none" />
            </div>
          </div>

          {/* Bagian 4: Sistem & Relasi */}
          <div>
            <h3 className="text-sm font-bold text-[#00172D] dark:text-white uppercase tracking-widest border-b border-gray-400 dark:border-slate-600 pb-2 mb-4">4. Status Kemitraan & Produk</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipe / Jenis</label>
                <select required value={formData.tipe || "Distributor"} onChange={e => setFormData({...formData, tipe: e.target.value as any})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium">
                  <option value="Distributor">Distributor</option>
                  <option value="Partner">Partner</option>
                  <option value="Calon Mitra">Calon Mitra</option>
                  <option value="Sales">Tim Sales Internal</option>
                </select>
              </div>
            </div>
            
            <div className="hidden space-y-3 mb-6">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fokus Produk</label>
              <div className="flex flex-wrap gap-2">
                {["HP Inc", "Poly", "Laptop", "Printer", "PC"].map((item) => (
                  <label key={item} className="relative flex-shrink-0 cursor-pointer group">
                    <input type="checkbox" className="peer sr-only" checked={formData.fokus_produk?.includes(item)} onChange={() => handleProductToggle(item)} />
                    <span className="inline-block px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-500 transition-all peer-checked:bg-[#35ACDF] peer-checked:text-white peer-checked:border-[#35ACDF] hover:bg-gray-100 dark:hover:bg-slate-800 peer-checked:hover:bg-[#35ACDF]">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">List Produk Kompetitor (Opsional)</label>
              <input type="text" placeholder="Gunakan koma untuk pisahkan (e.g. Dell, Lenovo, Logitech)" value={formData.list_produk_kompetitor?.join(", ") || ""} onChange={e => setFormData({...formData, list_produk_kompetitor: e.target.value.split(",").map(v => v.trim()).filter(v => v)})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium" />
            </div>

            <div className="space-y-3 mb-6">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Value / Kelebihan Kompetitor vs Kita</label>
              <textarea rows={2} placeholder="Sebutkan kenapa kompetitor lebih dipilih (jika status Calon Mitra)..." value={formData.value_kompetitor || ""} onChange={e => setFormData({...formData, value_kompetitor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium resize-none" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catatan Tambahan</label>
              <textarea rows={3} value={formData.catatan || ""} onChange={e => setFormData({...formData, catatan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium resize-none" />
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
