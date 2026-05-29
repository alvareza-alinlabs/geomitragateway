import { Trans } from "../../../lib/LanguageContext";
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Phone, Mail, User, Briefcase, Hash, FileText, ArrowLeft, Building, Receipt, ShoppingBag, Edit2, Trash2, Save, X, Plus } from "lucide-react";
import { ClientData, TransactionData } from "../../../types";
import { PhoneInput } from "../../../components/FormInputs";
import { useOutletContext } from "react-router-dom";

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [client, setClient] = useState<ClientData | null>(null);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [partners, setPartners] = useState<ClientData[]>([]); // For Sales, to list their partners
  const [allSales, setAllSales] = useState<ClientData[]>([]); // To populate Sales dropdown in edit partner
  
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(searchParams.get("edit") === "true");
  const [formData, setFormData] = useState<Partial<ClientData>>({});

  const { setHeaderConfig } = useOutletContext<{ setHeaderConfig: (config: any) => void }>();

  const isSalesDetails = client?.tipe === "Sales" || client?.tipe === "Broker";

  useEffect(() => {
    if (client) {
      setHeaderConfig({
        title: isEditing 
            ? `Edit ${isSalesDetails ? client.nama_penanggung_jawab : client.perusahaan}` 
            : (isSalesDetails ? client.nama_penanggung_jawab : client.perusahaan),
        subjudul: isEditing 
            ? `Mode Edit ${isSalesDetails ? 'Sales' : 'Partner'}` 
            : `Detail Informasi & Riwayat ${isSalesDetails ? 'Sales' : 'Partner'}`,
        showBack: true,
        actions: isEditing ? [
          <button key="cancel" type="button" onClick={() => { setSearchParams({}); }} className="w-full md:w-auto px-4 py-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-400 dark:border-slate-600 text-gray-600 dark:text-gray-300 font-bold uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center md:inline-flex md:justify-start gap-1.5 transition-all">
             <X className="w-3.5 h-3.5 text-gray-400" /><Trans>Batalkan</Trans></button>,
          <button key="save" type="submit" form="edit-client-form" className="w-full md:w-auto px-5 py-2 bg-[#00172D] dark:bg-white text-white dark:text-[#000A15] hover:bg-gray-900 dark:hover:bg-gray-100 font-bold uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center md:inline-flex md:justify-start gap-1.5 transition-all shadow-md">
             <Save className="w-3.5 h-3.5 text-[#35ACDF]" /><Trans>Simpan</Trans></button>
        ] : [
          <button key="edit" onClick={() => { setFormData(client || {}); setSearchParams({ edit: 'true' }); }} className="w-full md:w-auto px-4 py-2 bg-[#00172D] dark:bg-white text-white dark:text-[#000A15] hover:bg-gray-900 dark:hover:bg-gray-100 font-bold uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center md:inline-flex md:justify-start gap-1.5 transition-all shadow-md">
             <Edit2 className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /><Trans>Edit Data</Trans></button>,
          <button key="delete" onClick={() => {
            if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
               if (client?.tipe === "Sales" || client?.tipe === "Broker") {
                 navigate('/dashboard/sales');
               } else {
                 navigate('/dashboard/partners');
               }
            }
          }} className="w-full md:w-auto px-4 py-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center md:inline-flex md:justify-start gap-1.5 transition-all">
             <Trash2 className="w-3.5 h-3.5 text-gray-400" /><Trans>Hapus Data</Trans></button>
        ]
      });
    }
  }, [client, isEditing, isSalesDetails, setHeaderConfig, setSearchParams, navigate]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const [salesRes, partnersRes, transRes] = await Promise.all([
          fetch("/data/sales.json"),
          fetch("/data/partners.json"),
          fetch("/data/transactions.json")
        ]);
        const salesData = await salesRes.json();
        const partnersData = await partnersRes.json();
        const allTrans = await transRes.json();
        
        const allClients = [...salesData, ...partnersData].map((c: any) => {
          let tipe = c.tipe === "End User" ? "Partner" : c.tipe;
          const charCode = c.id.charCodeAt(c.id.length - 1) + c.id.length;
          let currentStatus = c.status_distributor || c.status_kemitraan || (["Mitra Aktif", "Calon Mitra"][charCode % 2]);
          if (currentStatus === "Calon Mitra") tipe = "Calon Mitra";
          return { ...c, tipe, status_kemitraan: undefined };
        });

        setAllSales(salesData);

        const found = allClients.find(c => c.id === id);
        if (found) {
          setClient(found);
          setFormData(found);
          if (found.tipe === "Sales" || found.tipe === "Broker") {
            const myPartners = allClients.filter(c => (c.tipe !== "Sales" && c.tipe !== "Broker") && (c.id_penjual === found.id || c.nama_penjual === found.nama_penanggung_jawab));
            setPartners(myPartners);
            
            const partnerIds = myPartners.map(p => p.id);
            const salesTrans = allTrans.filter((t: any) => t.id_mitra === id || partnerIds.includes(t.id_mitra) || t.id_penjual === id);
            setTransactions(salesTrans);
          } else {
             const clientTrans = allTrans.filter((t: any) => t.id_mitra === id);
             setTransactions(clientTrans);
          }
        }
      } catch (error) {
        console.error("Failed to fetch client detail:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchDetail();
    }
  }, [id]);

  useEffect(() => {
    setIsEditing(searchParams.get("edit") === "true");
  }, [searchParams]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (client) {
      setClient({ ...client, ...formData } as ClientData);
      setSearchParams({});
    }
  };

  const formatWa = (numStr?: string) => {
    if (!numStr) return "";
    let clean = numStr.replace(/\D/g, '');
    if (clean.startsWith('0')) return '62' + clean.slice(1);
    return clean;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#35ACDF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-black text-[#00172D] mb-4"><Trans>Data tidak ditemukan</Trans></h2>
        <button onClick={() => navigate(-1)} className="text-[#35ACDF] font-bold hover:underline"><Trans>Kembali</Trans></button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-10"
    >
      <div>
        {/* Detail Content or Edit Form */}
        <div className="w-full space-y-6">
            {isEditing ? (
             <form id="edit-client-form" onSubmit={handleSave} className="space-y-6">
                <div className="bg-white dark:bg-[#00172D] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {!isSalesDetails && (
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Perusahaan*</label>
                        <input required type="text" value={formData.perusahaan || ""} onChange={e => setFormData({...formData, perusahaan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium text-gray-900 dark:text-white" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap (PIC/Sales)*</label>
                      <input required type="text" value={formData.nama_penanggung_jawab || ""} onChange={e => setFormData({...formData, nama_penanggung_jawab: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium text-gray-900 dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Trans>Jabatan</Trans></label>
                      <input type="text" value={formData.jabatan || ""} onChange={e => setFormData({...formData, jabatan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium text-gray-900 dark:text-white" />
                    </div>
                  </div>

                  {!isSalesDetails && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Trans>Sales Penanggung Jawab</Trans></label>
                      <select value={formData.id_penjual || ""} onChange={e => {
                        const s = allSales.find(sale => sale.id === e.target.value);
                        setFormData({...formData, id_penjual: s?.id, nama_penjual: s?.nama_penanggung_jawab});
                      }} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium cursor-pointer text-gray-900 dark:text-white">
                        <option value=""><Trans>Pilih Sales Team...</Trans></option>
                        {allSales.map(s => (
                           <option key={s.id} value={s.id}>{s.nama_penanggung_jawab}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Trans>Provinsi</Trans></label>
                      <input type="text" value={formData.provinsi || ""} onChange={e => setFormData({...formData, provinsi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium text-gray-900 dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Trans>Kota</Trans></label>
                      <input type="text" value={formData.kota || ""} onChange={e => setFormData({...formData, kota: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium text-gray-900 dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Trans>Area</Trans></label>
                      <input type="text" value={formData.area || ""} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium text-gray-900 dark:text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold flex items-center gap-1 text-orange-500 uppercase tracking-widest">Latitude (Garis Lintang)</label>
                      <input step="any" type="number" inputMode="decimal" value={formData.garis_lintang || ""} onChange={e => setFormData({...formData, garis_lintang: parseFloat(e.target.value)})} placeholder="-6.200000" className="w-full px-4 py-3 bg-blue-50/30 dark:bg-blue-950/20 border border-orange-200 dark:border-orange-500/20 rounded-xl focus:ring-2 focus:ring-orange-500/50 outline-none text-sm font-medium text-gray-900 dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold flex items-center gap-1 text-[#35ACDF] uppercase tracking-widest">Longitude (Garis Bujur)</label>
                      <input step="any" type="number" inputMode="decimal" value={formData.garis_bujur || ""} onChange={e => setFormData({...formData, garis_bujur: parseFloat(e.target.value)})} placeholder="106.816666" className="w-full px-4 py-3 bg-orange-50/30 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-500/20 rounded-xl focus:ring-2 focus:ring-orange-500/50 outline-none text-sm font-medium text-gray-900 dark:text-white" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Trans>Alamat Detail</Trans></label>
                    <textarea value={formData.alamat_detail || ""} onChange={e => setFormData({...formData, alamat_detail: e.target.value})} rows={2} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium text-gray-900 dark:text-white" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No. Handphone*</label>
                      <PhoneInput required value={formData.no_hp || ""} onChange={val => setFormData({...formData, no_hp: val})} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus-within:ring-2 focus-within:ring-[#35ACDF]/50" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Trans>Telepon Kantor</Trans></label>
                      <input type="tel" inputMode="numeric" pattern="[0-9]*" value={formData.telepon_kantor || ""} onChange={e => setFormData({...formData, telepon_kantor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium text-gray-900 dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Trans>Email</Trans></label>
                      <input type="email" value={formData.email_kantor || ""} onChange={e => setFormData({...formData, email_kantor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium text-gray-900 dark:text-white" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catatan (Internal)</label>
                    <textarea value={formData.catatan || ""} onChange={e => setFormData({...formData, catatan: e.target.value})} rows={3} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium text-gray-900 dark:text-white" />
                  </div>

                  {!isSalesDetails && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Trans>Tipe / Jenis</Trans></label>
                          <select required value={formData.tipe || "Distributor"} onChange={e => setFormData({...formData, tipe: e.target.value as any})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium text-gray-900 dark:text-white">
                            <option value="Distributor"><Trans>Distributor</Trans></option>
                            <option value="Partner"><Trans>Partner</Trans></option>
                            <option value="Calon Mitra"><Trans>Calon Mitra</Trans></option>
                            <option value="Sales"><Trans>Tim Sales Internal</Trans></option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">List Produk Kompetitor (Opsional)</label>
                        <input type="text" placeholder="Gunakan koma untuk pisahkan (e.g. Dell, Lenovo, Logitech)" value={formData.list_produk_kompetitor?.join(", ") || ""} onChange={e => setFormData({...formData, list_produk_kompetitor: e.target.value.split(",").map(v => v.trim()).filter(v => v)})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium text-gray-900 dark:text-white" />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Trans>Value / Kelebihan Kompetitor vs Kita</Trans></label>
                        <textarea rows={2} placeholder="Sebutkan kenapa kompetitor lebih dipilih (jika status Calon Mitra)..." value={formData.value_kompetitor || ""} onChange={e => setFormData({...formData, value_kompetitor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium text-gray-900 dark:text-white resize-none" />
                      </div>
                    </>
                  )}
                </div>
             </form>
           ) : (
             <div className="space-y-6">
               <div className="bg-white dark:bg-[#00172D] rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                 <div className="flex items-center gap-2 mb-6">
                    {!isSalesDetails && (
                      <>
                        <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded ${client.tipe === "Sales" ? "bg-blue-50 dark:bg-blue-950/35 text-[#35ACDF]" : client.tipe === "Distributor" ? "bg-orange-50 dark:bg-orange-950/35 text-orange-600" : "bg-emerald-50 dark:bg-emerald-950/35 text-emerald-600"}`}>
                          {client.tipe}
                        </span>
                        {client.jenis_perusahaan && (
                          <span className="px-2 py-1 text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-300 rounded drop-shadow-sm">
                            {client.jenis_perusahaan}
                          </span>
                        )}
                      </>
                    )}
                 </div>

                 <div className="space-y-5">
                     <div className="flex items-start gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#35ACDF] mt-0.5">
                         <MapPin className="w-4 h-4 text-[#35ACDF]" />
                       </div>
                       <div>
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{isSalesDetails ? 'Area Operasional' : 'Alamat Lengkap'}</p>
                         <p className="font-bold text-gray-800 dark:text-white text-sm mt-0.5 leading-relaxed">{client.alamat_detail}</p>
                         <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs mt-1">{client.kota}, {client.provinsi}</p>
                       </div>
                     </div>
                     
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#35ACDF] shrink-0">
                         <Building className="w-4 h-4 text-[#35ACDF]" />
                       </div>
                       <div className="flex-1">
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{isSalesDetails ? 'Kantor' : 'Telepon Kantor'}</p>
                         <p className="font-bold text-gray-800 dark:text-white text-sm mt-0.5">{isSalesDetails ? client.perusahaan : client.telepon_kantor}</p>
                       </div>
                       {!isSalesDetails && client.telepon_kantor && (
                         <a href={`tel:${client.telepon_kantor.replace(/\D/g,'')}`} title="Call" className="w-8 h-8 rounded bg-gray-50 dark:bg-white/5 hover:bg-[#35ACDF] dark:hover:bg-[#35ACDF] text-[#35ACDF] hover:text-white flex items-center justify-center transition-colors">
                           <Phone className="w-4 h-4 text-[#35ACDF] group-hover:text-white" />
                         </a>
                       )}
                     </div>
                     
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#35ACDF] shrink-0">
                         <Mail className="w-4 h-4 text-[#35ACDF]" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Email {isSalesDetails ? 'Personal' : 'Kantor'}</p>
                         <p className="font-bold text-gray-800 dark:text-white text-sm mt-0.5 truncate">{client.email_kantor}</p>
                       </div>
                       {client.email_kantor && (
                         <a href={`mailto:${client.email_kantor}`} title="Send Email" className="w-8 h-8 rounded bg-gray-50 dark:bg-white/5 hover:bg-[#35ACDF] dark:hover:bg-[#35ACDF] text-[#35ACDF] hover:text-white flex items-center justify-center transition-colors shrink-0">
                           <Mail className="w-4 h-4 text-[#35ACDF] group-hover:text-white" />
                         </a>
                       )}
                     </div>
                 </div>

                 <div className="border-t border-gray-200 dark:border-slate-800 mt-6 pt-6 space-y-5">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#35ACDF] shrink-0">
                         <User className="w-4 h-4 text-[#35ACDF]" />
                       </div>
                       <div className="flex-1">
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{isSalesDetails ? 'Nama Lengkap' : 'Nama PIC'}</p>
                         <p className="font-bold text-gray-800 dark:text-white text-sm mt-0.5">{client.nama_penanggung_jawab}</p>
                       </div>
                     </div>

                     {!isSalesDetails && (
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 flex items-center justify-center text-[#35ACDF] shrink-0">
                           <Briefcase className="w-4 h-4 text-[#35ACDF]" />
                         </div>
                         <div className="flex-1">
                           <p className="text-[9px] font-bold text-[#35ACDF] uppercase tracking-widest"><Trans>Sales Tanggung Jawab</Trans></p>
                           <p className="font-bold text-[#00172D] dark:text-[#35ACDF] text-sm mt-0.5">{client.nama_penjual || "-"}</p>
                         </div>
                       </div>
                     )}
                     
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#35ACDF] shrink-0">
                         <Hash className="w-4 h-4 text-[#35ACDF]" />
                       </div>
                       <div className="flex-1">
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest"><Trans>Jabatan</Trans></p>
                         <p className="font-bold text-gray-800 dark:text-white text-sm mt-0.5">{client.jabatan}</p>
                       </div>
                     </div>

                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#35ACDF] shrink-0">
                         <Phone className="w-4 h-4 text-[#35ACDF]" />
                       </div>
                       <div className="flex-1">
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest"><Trans>No. Handphone</Trans></p>
                         <p className="font-bold text-gray-800 dark:text-white text-sm mt-0.5">{client.no_hp}</p>
                       </div>
                       <div className="flex gap-2 shrink-0">
                         <a href={`tel:${client.no_hp.replace(/\D/g,'')}`} title="Call" className="w-8 h-8 rounded bg-gray-50 dark:bg-white/5 hover:bg-blue-600 hover:text-white text-[#35ACDF] flex items-center justify-center transition-colors">
                           <Phone className="w-4 h-4 text-[#35ACDF] group-hover:text-white" />
                         </a>
                         <a href={`https://wa.me/${formatWa(client.no_hp)}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="w-8 h-8 rounded bg-gray-50 dark:bg-white/5 hover:bg-emerald-500 hover:text-white text-[#35ACDF] flex items-center justify-center transition-colors">
                           <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                         </a>
                       </div>
                     </div>
                 </div>

                 {!isSalesDetails && false && (
                   <div className="border-t border-gray-100 mt-6 pt-6">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3"><Trans>Fokus Produk / Spesialisasi</Trans></p>
                       <div className="flex flex-wrap gap-2">
                         {(client.fokus_produk || []).map(f => (
                           <span key={f} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-[9px] font-bold uppercase tracking-widest rounded shadow-sm">
                             {f}
                           </span>
                         ))}
                       </div>
                   </div>
                 )}

                 {client.list_produk_kompetitor && client.list_produk_kompetitor.length > 0 && (
                     <div className="border-t border-gray-100 mt-6 pt-6">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3"><Trans>Produk Kompetitor</Trans></p>
                         <div className="flex flex-wrap gap-2">
                           {client.list_produk_kompetitor.map(f => (
                             <span key={f} className="px-3 py-1.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-[9px] font-bold uppercase tracking-widest rounded shadow-sm border border-red-100/10">
                               {f}
                             </span>
                           ))}
                         </div>
                     </div>
                 )}

                 {client.value_kompetitor && (
                     <div className="border-t border-gray-200 dark:border-slate-800 mt-6 pt-6">
                       <div className="flex items-start gap-3 group">
                         <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#35ACDF] mt-0.5">
                           <FileText className="w-4 h-4 text-[#35ACDF]" />
                         </div>
                         <div>
                           <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest"><Trans>Value Kompetitor vs Kita</Trans></p>
                           <p className="font-bold text-gray-800 dark:text-white text-sm mt-0.5">{client.value_kompetitor}</p>
                         </div>
                       </div>
                     </div>
                 )}
                 
                 {client.catatan && (
                     <div className="border-t border-gray-200 dark:border-slate-800 mt-6 pt-6">
                       <div className="flex items-start gap-3 group">
                         <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#35ACDF] mt-0.5">
                           <FileText className="w-4 h-4 text-[#35ACDF]" />
                         </div>
                         <div>
                           <p className="text-[9px] font-bold text-[#35ACDF] uppercase tracking-widest"><Trans>Catatan Tambahan</Trans></p>
                           <p className="font-bold text-gray-800 dark:text-white text-sm mt-0.5">{client.catatan}</p>
                         </div>
                       </div>
                     </div>
                 )}
               </div>

               {/* Jika ini adalah detail khusus internal Sales, tampilkan daftar partner mereka */}
               {isSalesDetails && (
                 <div className="bg-white dark:bg-[#00172D] rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-slate-800 shadow-sm">
                   <div className="flex items-center gap-3 mb-6 border-b border-gray-50 dark:border-slate-600/5 pb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#35ACDF]/10 flex items-center justify-center text-[#35ACDF]">
                         <Building className="w-5 h-5 text-[#35ACDF]" />
                      </div>
                      <div>
                         <h2 className="text-xl font-black text-[#00172D] dark:text-white"><Trans>Mitra / Klien Binaan</Trans></h2>
                         <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mt-0.5">Partner dibawah kelolaan {client.nama_penanggung_jawab}</p>
                      </div>
                   </div>

                   {partners.length === 0 ? (
                      <div className="pt-6 pb-2 text-center flex flex-col items-center">
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]"><Trans>Belum memiliki partner kelolaan</Trans></p>
                      </div>
                   ) : (
                     <div className="space-y-3">
                       {partners.map(partner => (
                         <Link to={`/dashboard/client/${partner.id}`} key={partner.id} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-900/40 hover:bg-gray-50 dark:hover:bg-slate-900/80 hover:shadow-sm rounded-2xl border border-gray-200 dark:border-slate-800 transition-all gap-4">
                            <div>
                                <div className="font-bold text-gray-800 dark:text-white">{partner.perusahaan}</div>
                               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{partner.tipe} &bull; {partner.kota}</div>
                            </div>
                            <ArrowLeft className="w-4 h-4 rotate-180 text-gray-400" />
                         </Link>
                       ))}
                     </div>
                   )}
                 </div>
               )}

               {/* Riwayat Transaksi */}
               <div className="bg-white dark:bg-[#00172D] rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-slate-800 shadow-sm min-h-[400px]">
                  <div className="flex items-center gap-3 mb-6 border-b border-gray-50 dark:border-slate-600/5 pb-4">
                     <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#35ACDF]/10 flex items-center justify-center text-[#35ACDF]">
                        <Receipt className="w-5 h-5 text-[#35ACDF]" />
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-[#00172D] dark:text-white"><Trans>Riwayat Transaksi</Trans></h2>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mt-0.5">Semua Transaksi oleh {isSalesDetails ? client.nama_penanggung_jawab : client.perusahaan}</p>
                     </div>
                  </div>

                  {transactions.length === 0 ? (
                     <div className="py-20 text-center flex flex-col items-center">
                       <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                         <ShoppingBag className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                       </div>
                       <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]"><Trans>Belum ada riwayat transaksi</Trans></p>
                     </div>
                  ) : (
                     <div className="space-y-4">
                        {transactions.map(trx => (
                          <Link to={`/dashboard/transaction/${trx.id}`} key={trx.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-gray-50/50 dark:bg-slate-900/40 hover:bg-gray-50 dark:hover:bg-slate-900/80 hover:shadow-md cursor-pointer rounded-2xl border border-gray-200 dark:border-slate-800 transition-all gap-4">
                             <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white dark:bg-white/5 rounded-xl shadow-sm flex items-center justify-center text-[#35ACDF]">
                                  <ShoppingBag className="w-6 h-6 text-[#35ACDF]" />
                                </div>
                                <div>
                                   <div className="flex items-center gap-2 mb-1">
                                      <span className="font-black text-gray-800 dark:text-white text-base">{trx.id}</span>
                                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded ${trx.status === "Selesai" ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400" : trx.status === "Proses" ? "bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400" : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"}`}>
                                        {trx.status}
                                      </span>
                                   </div>
                                   <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{new Date(trx.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                             </div>
                             <div className="md:text-right border-t md:border-t-0 border-gray-200 dark:border-slate-800 pt-3 md:pt-0">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{trx.barang?.reduce((acc: any, curr: any) => acc + curr.jumlah_unit, 0) || trx.jumlah_unit || 0} Unit &bull; {trx.jenis_pembelian}</p>
                                <p className="text-lg font-black text-[#00172D] dark:text-white">Rp {(trx.total_harga).toLocaleString('id-ID')}</p>
                             </div>
                          </Link>
                        ))}
                     </div>
                  )}
               </div>
             </div>
           )}
        </div>
      </div>
    </motion.div>
  );
}

