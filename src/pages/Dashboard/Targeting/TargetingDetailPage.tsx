import { Trans } from "../../../lib/LanguageContext";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useOutletContext } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Target, 
  ChevronLeft, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  Calendar, 
  Package,
  AlertCircle
} from "lucide-react";
import { TargetData, ProductData } from "../../../types";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";

export default function TargetingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setHeaderConfig } = useOutletContext<any>();
  const [target, setTarget] = useState<TargetData | null>(null);
  const [products, setProducts] = useState<Record<string, ProductData>>({});
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useLockBodyScroll(showDeleteConfirm);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products for listing
        const prodRes = await fetch("/data/products.json");
        const prodData: ProductData[] = await prodRes.json();
        const prodMap: Record<string, ProductData> = {};
        prodData.forEach(p => { prodMap[p.id] = p; });
        setProducts(prodMap);

        // Fetch targeting data
        // Note: In a real app, this would be an API call. 
        // Here we simulate by fetching the JSON and finding the ID.
        const targetRes = await fetch("/data/targeting.json");
        const allTargets: TargetData[] = await targetRes.json();
        const found = allTargets.find(t => t.id === id);
        
        if (found) {
          setTarget(found);
        } else {
          // Fallback to local storage if not in JSON (consistent with existing pattern)
          const stored = localStorage.getItem("targets");
          if (stored) {
            const localTargets: TargetData[] = JSON.parse(stored);
            const localFound = localTargets.find(t => t.id === id);
            if (localFound) setTarget(localFound);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading detail data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (target) {
      setHeaderConfig({
        title: "Detail Target",
        subjudul: `${monthNames[target.bulan - 1]} ${target.tahun}`,
        showBack: true,
        actions: (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold uppercase tracking-widest text-[10px] rounded-xl flex items-center gap-1.5 transition-colors border border-red-100"
            >
              <Trash2 className="w-3.5 h-3.5" /><Trans>Hapus</Trans></button>
            <Link 
              to={`/dashboard/targeting/edit/${target.id}`}
              className="px-4 py-2 bg-[#00172D] hover:bg-gray-900 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl flex items-center gap-1.5 transition-shadow shadow-md"
            >
              <Edit3 className="w-3.5 h-3.5" /><Trans>Edit</Trans></Link>
          </div>
        )
      });
    } else {
      setHeaderConfig({
        title: "Detail Target",
        subjudul: "Memuat info...",
        showBack: true
      });
    }
  }, [target, setHeaderConfig]);

  const handleDelete = () => {
    // Simulate delete
    const stored = localStorage.getItem("targets");
    if (stored) {
      const localTargets: TargetData[] = JSON.parse(stored);
      const filtered = localTargets.filter(t => t.id !== id);
      localStorage.setItem("targets", JSON.stringify(filtered));
    }
    navigate("/dashboard/targeting");
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  if (loading) {
    return <div className="p-10 flex justify-center items-center font-bold text-gray-400 italic"><Trans>Memuat Detail Target...</Trans></div>;
  }

  if (!target) {
    return (
      <div className="p-10 flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="w-16 h-16 text-gray-300" />
        <p className="text-xl font-bold text-gray-500"><Trans>Target tidak ditemukan</Trans></p>
        <button onClick={() => navigate("/dashboard/targeting")} className="text-sm font-bold text-[#35ACDF] bg-blue-50 px-6 py-2 rounded-xl"><Trans>Kembali ke Daftar</Trans></button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" /><Trans>Target Revenue</Trans></p>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                  {formatRupiah(target.nilai_sasaran)}
                </h2>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /><Trans>Periode Target</Trans></p>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {monthNames[target.bulan - 1]} <span className="text-[#35ACDF]">{target.tahun}</span>
                </h2>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3"><Trans>Catatan internal & Strategi</Trans></p>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="text-gray-600 leading-relaxed font-medium">
                  {target.catatan || "Tidak ada catatan strategis untuk periode ini."}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
               <p className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2">
                 <Package className="w-5 h-5 text-[#35ACDF]" />
                 Fokus Produk ({(target.fokus_produk || []).length})
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(target.fokus_produk || []).length > 0 ? (
                (target.fokus_produk || []).map(pid => {
                  const p = products[pid];
                  return (
                    <div key={pid} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-blue-100 hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-blue-50 transition-colors">
                        <Package className="w-6 h-6 text-gray-300 group-hover:text-[#35ACDF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{p?.nama || "Produk dihapus"}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{p?.merek || "Brand Unknown"}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-10 text-center">
                  <p className="text-gray-400 italic"><Trans>Tidak ada fokus produk yang dikonfigurasi.</Trans></p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#00172D] p-6 rounded-3xl text-white shadow-xl shadow-[#00172D]/10"
           >
              <h3 className="text-lg font-black mb-4 tracking-tight"><Trans>Status Insight</Trans></h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center py-3 border-b border-white/10 text-xs font-bold">
                    <span className="text-white/50"><Trans>Status</Trans></span>
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg"><Trans>Aktif</Trans></span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-white/10 text-xs font-bold">
                    <span className="text-white/50"><Trans>Tingkat Prioritas</Trans></span>
                    <span className="text-[#35ACDF]"><Trans>Sangat Tinggi</Trans></span>
                 </div>
                 <div className="flex justify-between items-center py-3 text-xs font-bold">
                    <span className="text-white/50"><Trans>Sisa Hari</Trans></span>
                    <span>31 Hari</span>
                 </div>
              </div>
           </motion.div>

           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4"><Trans>Metadata System</Trans></p>
             <div className="space-y-3 text-[10px] font-black text-gray-500">
               <div className="flex justify-between pb-2 border-b border-gray-50">
                 <span><Trans>ID TARGET</Trans></span>
                 <span className="text-gray-900 uppercase font-mono">{target.id}</span>
               </div>
               <div className="flex justify-between pb-2 border-b border-gray-50">
                 <span><Trans>DIBUAT PADA</Trans></span>
                 <span className="text-gray-900 uppercase">24 Mei 2026</span>
               </div>
               <div className="flex justify-between">
                 <span><Trans>UPDATE TERAKHIR</Trans></span>
                 <span className="text-gray-900 uppercase"><Trans>Baru Saja</Trans></span>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-sm rounded-3xl p-8 text-center space-y-6"
          >
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Hapus Target?</h3>
              <p className="text-sm text-gray-500 font-medium mt-2"><Trans>Data ini tidak dapat dikembalikan setelah dihapus.</Trans></p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
              ><Trans>BATAL</Trans></button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-3 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-2xl transition-all shadow-lg shadow-red-500/20"
              ><Trans>HAPUS</Trans></button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
