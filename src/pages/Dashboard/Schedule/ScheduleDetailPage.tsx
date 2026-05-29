import { Trans } from "../../../lib/LanguageContext";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock, Edit2, Phone, Trash2, MapPin, Building, Flag, Mail, Briefcase, Users, Navigation } from "lucide-react";
import InteractiveMap from "../../../components/InteractiveMap";

export default function ScheduleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeaderConfig } = useOutletContext<any>();
  const [schedule, setSchedule] = useState<any>(null);
  const [salesPerson, setSalesPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/schedules.json").then(res => res.json()),
      fetch("/data/sales.json").then(res => res.json()),
      fetch("/data/products.json").then(res => res.json())
    ])
      .then(([schedulesData, salesData, productData]) => {
        const found = schedulesData.find((s: any) => s.id === id);
        if (found) {
          // map product IDs to names
          const mappedProducts = (found.produk || []).map((pid: string) => {
             const prod = productData.find((p: any) => p.id === pid);
             return prod ? prod.nama : pid;
          });
          setSchedule({ ...found, produk_names: mappedProducts });
          if (found.diajukan_oleh) {
            const sp = salesData.find((s: any) => s.id === found.diajukan_oleh);
            if (sp) {
              setSalesPerson(sp);
            }
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (schedule) {
      const currentUserStr = localStorage.getItem("currentUser");
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
      const isSuperAdmin = currentUser?.hak_akses?.ringkasan === "Super Admin";
      // Allow edit only if it's pribadi and belongs to them or is marked "Admin"
      const canEdit = schedule.tipe_jadwal === "pribadi" && (schedule.diajukan_oleh === "Admin" || schedule.diajukan_oleh === currentUser?.nama);

      setHeaderConfig({
        title: "Detail Jadwal",
        subjudul: schedule.id,
        showBack: true,
        hideMobileActionsWrap: false,
        actions: (
            <>
               {canEdit && (
                 <button onClick={() => navigate(`/dashboard/schedule/add?edit=${schedule.id}`)} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 transition-colors flex items-center gap-2 rounded-lg text-sm font-medium">
                    <Edit2 className="w-4 h-4" />Edit Jadwal
                 </button>
               )}
               <button onClick={() => alert("Fitur hapus belum tersedia")} className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors flex items-center gap-2 rounded-lg text-sm font-medium">
                  <Trash2 className="w-4 h-4" />Hapus Jadwal
               </button>
            </>
        )
      });
    } else {
      setHeaderConfig({
        title: "Detail Jadwal",
        subjudul: "Memuat info jadwal...",
        showBack: true
      });
    }
  }, [schedule, setHeaderConfig, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-[#35ACDF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-500 uppercase tracking-widest"><Trans>Jadwal tidak ditemukan</Trans></h2>
      </div>
    );
  }

  const dateObj = new Date(schedule.waktu);
  const formattedDate = dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const formattedTime = dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-20 space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white dark:bg-[#00172D] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-6 border-b border-gray-200 dark:border-slate-800 pb-6">
                  <div>
                    <h2 className="text-2xl font-black text-[#00172D] dark:text-white uppercase tracking-tight">{schedule.nama}</h2>
                    {schedule.email_pic && (
                      <div className="flex items-center gap-2 mt-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
                         <Mail className="w-4 h-4 text-[#35ACDF]" /> {schedule.email_pic}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1 text-gray-500 font-bold text-xs uppercase tracking-widest">
                       <Phone className="w-4 h-4 text-[#35ACDF]" /> {schedule.telepon}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
                         <Building className="w-4 h-4 text-[#35ACDF]" /> {schedule.perusahaan}
                      </div>
                      {schedule.email_kantor && (
                        <div className="flex items-center gap-2 mt-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
                           <Mail className="w-4 h-4 text-gray-400" /> {schedule.email_kantor}
                        </div>
                      )}
                      {schedule.alamat_perusahaan && (
                        <div className="flex items-start gap-2 mt-2 text-gray-500 font-bold text-xs uppercase tracking-widest leading-relaxed">
                           <MapPin className="w-4 h-4 text-gray-400 shrink-0" /> {schedule.alamat_perusahaan}
                        </div>
                      )}
                      {schedule.link_maps && (
                        <a href={schedule.link_maps} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 mb-2 text-[#35ACDF] font-bold text-xs uppercase tracking-widest hover:underline">
                           <Navigation className="w-3 h-3" /><Trans>Buka di Google Maps</Trans></a>
                      )}
                      
                      {schedule.koordinat_maps && (
                        <div className="w-full mt-3 h-[200px] rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 relative">
                           <InteractiveMap position={schedule.koordinat_maps} onPositionChange={() => {}} />
                           <div className="absolute inset-0 z-[400] bg-transparent"></div> {/* Overlay to prevent interacting accidentally but allowing scrolling */}
                        </div>
                      )}
                    </div>
                    
                    {(schedule.sektor_industri || schedule.skala_perusahaan) && (
                      <div className="flex flex-wrap items-center gap-3 mt-4">
                         {schedule.sektor_industri && (
                            <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                               <Briefcase className="w-3 h-3 text-[#35ACDF]" /> {schedule.sektor_industri}
                            </span>
                         )}
                         {schedule.skala_perusahaan && (
                            <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                               <Users className="w-3 h-3 text-[#35ACDF]" /> {schedule.skala_perusahaan} Karyawan
                            </span>
                         )}
                      </div>
                    )}
                 </div>
                 <div className="flex flex-col items-start sm:items-end gap-2">
                    {schedule.tipe_jadwal && (
                      <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${schedule.tipe_jadwal === 'sales' ? 'bg-indigo-50 text-indigo-600' : 'bg-purple-50 text-purple-600'}`}>
                        Tipe: {schedule.tipe_jadwal}
                      </span>
                    )}
                    {schedule.status && (
                      <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${schedule.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : schedule.status === 'canceled' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                        Status: {schedule.status}
                      </span>
                    )}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-blue-50/50 dark:bg-[#35ACDF]/10 p-6 rounded-2xl border border-blue-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-[#35ACDF] mb-3">
                       <Calendar className="w-5 h-5 text-gray-400" />
                       <span className="font-black uppercase tracking-widest text-xs"><Trans>Tanggal Pelaksanaan</Trans></span>
                    </div>
                    <p className="font-bold text-[#00172D] dark:text-white">{formattedDate}</p>
                 </div>
                 
                 <div className="bg-blue-50/50 dark:bg-[#35ACDF]/10 p-6 rounded-2xl border border-orange-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-[#35ACDF] mb-3">
                       <Clock className="w-5 h-5 text-gray-400" />
                       <span className="font-black uppercase tracking-widest text-xs"><Trans>Waktu Pelaksanaan</Trans></span>
                    </div>
                    <p className="font-bold text-[#00172D] dark:text-white">{formattedTime} WIB</p>
                 </div>
              </div>

              <div>
                 <div className="flex items-center gap-2 text-gray-400 mb-3 border-b border-gray-200 dark:border-slate-800 pb-2">
                    <Flag className="w-4 h-4 text-[#35ACDF]" />
                    <span className="font-black uppercase tracking-widest text-xs"><Trans>Tujuan & Agenda</Trans></span>
                 </div>
                 <div className="p-6 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-400 dark:border-slate-600 text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
                    {schedule.tujuan}
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white dark:bg-[#00172D] rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm text-center space-y-4">
              <h3 className="font-black text-[#00172D] dark:text-white uppercase tracking-widest text-xs border-b border-gray-200 dark:border-slate-800 pb-3"><Trans>Produk Diminati</Trans></h3>
              <div className="flex flex-wrap gap-2 justify-center">
                 {schedule.produk_names && schedule.produk_names.map((p: string, idx: number) => (
                    <span key={idx} className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-bold uppercase tracking-widest text-[10px] px-4 py-2 rounded-xl">
                       {p}
                    </span>
                 ))}
                 {(!schedule.produk_names || schedule.produk_names.length === 0) && (
                    <span className="text-gray-400 text-xs italic"><Trans>Tidak ada referensi produk</Trans></span>
                 )}
              </div>
           </div>

           {schedule.diajukan_oleh && (
             <div className="bg-white dark:bg-[#00172D] rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
               <h3 className="font-black text-[#00172D] dark:text-white uppercase tracking-widest text-xs border-b border-gray-200 dark:border-slate-800 pb-3 text-center"><Trans>Diajukan Oleh</Trans></h3>
               <div className="text-center">
                  <p className="font-bold text-gray-800 dark:text-white">{salesPerson ? salesPerson.nama_penanggung_jawab : schedule.diajukan_oleh}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {salesPerson?.jabatan || (schedule.diajukan_oleh.startsWith('S') ? 'Sales Representative' : 'Sistem Referensi')}
                  </p>
               </div>
               
               {salesPerson && (
                 <div className="pt-4 border-t border-gray-50 dark:border-slate-600/5 flex flex-col gap-3">
                   {salesPerson.email_kantor && (
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest justify-center">
                       <Mail className="w-3.5 h-3.5 text-gray-400" />
                       {salesPerson.email_kantor}
                     </div>
                   )}
                   {salesPerson.no_hp && (
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest justify-center">
                       <Phone className="w-3.5 h-3.5 text-gray-400" />
                       {salesPerson.no_hp}
                     </div>
                   )}
                   {(salesPerson.provinsi || salesPerson.area) && (
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest justify-center">
                       <MapPin className="w-3.5 h-3.5 text-gray-400" />
                       {salesPerson.area ? `${salesPerson.area}, ` : ''}{salesPerson.provinsi}
                     </div>
                   )}
                 </div>
               )}
             </div>
           )}
        </div>
      </div>
    </motion.div>
  );
}
