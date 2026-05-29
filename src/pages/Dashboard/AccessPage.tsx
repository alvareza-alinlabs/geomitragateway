import { Trans } from "../../lib/LanguageContext";
import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { motion } from "motion/react";
import { Shield, UserPlus, CheckCircle2, Trash2, Edit2, LogIn } from "lucide-react";
import { MOCK_USERS, getCurrentUser, setCurrentUser, UserAccount } from "../../lib/auth";

export default function AccessPage() {
  const [successMsg, setSuccessMsg] = useState("");
  const [currentUser, setLocalCurrentUser] = useState<UserAccount>(getCurrentUser());

  const { setHeaderConfig } = useOutletContext<{ setHeaderConfig: (config: any) => void }>();

  useEffect(() => {
    setHeaderConfig({
      title: "Bagikan Akses",
      subjudul: "Kelola siapa yang dapat melihat / mengedit data sistem",
      showBack: false,
      hideMobileActionsWrap: true,
      actions: [
        <Link key="add" to="/dashboard/access/add" className="flex items-center justify-center gap-2 w-10 h-10 sm:w-auto sm:h-auto sm:px-6 sm:py-2.5 bg-[#35ACDF] hover:bg-blue-500 text-white font-bold uppercase tracking-widest text-[10px] rounded-full sm:rounded-xl shadow-md shadow-[#35ACDF]/20 transition-all shrink-0">
          <UserPlus className="w-5 h-5 sm:w-4 sm:h-4 text-white" /><span className="hidden sm:inline"><Trans>Pengguna Baru</Trans></span></Link>
      ]
    });
  }, [setHeaderConfig]);

  useEffect(() => {
    const handleStorage = () => setLocalCurrentUser(getCurrentUser());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const simulateSwitchUser = (user: UserAccount) => {
    setCurrentUser(user);
    setLocalCurrentUser(user);
    setSuccessMsg(`Berhasil beralih profil ke: ${user.nama}`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-emerald-200">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#35ACDF]" /> {successMsg}
        </div>
      )}

      <div className="space-y-6">
        {/* User Table */}
        <div className="bg-white dark:bg-[#00172D] rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#001c38]/50 border-b border-gray-200 dark:border-slate-800">
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400"><Trans>Pengguna</Trans></th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400"><Trans>Kata Sandi</Trans></th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400"><Trans>Ringkasan</Trans></th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400"><Trans>Peta & Mitra</Trans></th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400"><Trans>Kinerja</Trans></th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400"><Trans>Akses Sistem</Trans></th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 text-right"><Trans>Tindakan</Trans></th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map(rowUser => (
                  <tr key={rowUser.id} className={`border-b border-gray-50 dark:border-slate-600/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors ${currentUser.id === rowUser.id ? "bg-blue-50/30 dark:bg-[#35ACDF]/10" : ""}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[#00172D] dark:text-white text-sm">{rowUser.nama}</p>
                        {currentUser.id === rowUser.id && (
                          <span className="px-2 py-0.5 bg-[#35ACDF] text-white text-[9px] rounded-md font-bold uppercase tracking-widest"><Trans>Saat Ini</Trans></span>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">{rowUser.email}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                         <span className="text-xs font-mono bg-gray-100 dark:bg-white/5 px-2 py-1 rounded text-gray-600 dark:text-gray-300 tracking-widest">
                           {rowUser.password ? "••••••••" : "Belum diatur"}
                         </span>
                       </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded inline-block w-max ${rowUser.hak_akses.ringkasan === 'Super Admin' ? 'bg-[#00172D] dark:bg-[#35ACDF]/20 dark:text-[#35ACDF] text-white' : rowUser.hak_akses.ringkasan === 'Viewer' ? 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400' : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-550'}`}>
                        {rowUser.hak_akses.ringkasan}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded inline-block w-max ${rowUser.hak_akses.peta === 'Super Admin' ? 'bg-[#00172D] dark:bg-[#35ACDF]/20 dark:text-[#35ACDF] text-white' : rowUser.hak_akses.peta === 'Viewer' ? 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400' : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-550'}`}>
                          Peta: {rowUser.hak_akses.peta}
                        </span>
                        <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded inline-block w-max ${rowUser.hak_akses.mitra === 'Super Admin' ? 'bg-[#00172D] dark:bg-[#35ACDF]/20 dark:text-[#35ACDF] text-white' : rowUser.hak_akses.mitra === 'Viewer' ? 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400' : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-550'}`}>
                          Mitra: {rowUser.hak_akses.mitra}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded inline-block w-max ${rowUser.hak_akses.transaksi === 'Super Admin' ? 'bg-[#00172D] dark:bg-[#35ACDF]/20 dark:text-[#35ACDF] text-white' : rowUser.hak_akses.transaksi === 'Viewer' ? 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400' : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-550'}`}>
                          Trx: {rowUser.hak_akses.transaksi}
                        </span>
                        <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded inline-block w-max ${rowUser.hak_akses.produk === 'Super Admin' ? 'bg-[#00172D] dark:bg-[#35ACDF]/20 dark:text-[#35ACDF] text-white' : rowUser.hak_akses.produk === 'Viewer' ? 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400' : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-550'}`}>
                          Produk: {rowUser.hak_akses.produk}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                       <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded inline-block w-max ${rowUser.hak_akses.akses === 'Super Admin' ? 'bg-[#00172D] dark:bg-[#35ACDF]/20 dark:text-[#35ACDF] text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-550'}`}>
                        {rowUser.hak_akses.akses}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                         <button 
                           onClick={() => simulateSwitchUser(rowUser)} 
                           title="Simulasikan Login sebagai User ini"
                           className="p-2 text-[#35ACDF] hover:bg-[#35ACDF]/10 rounded-lg transition-colors border border-transparent hover:border-[#35ACDF]/20"
                         >
                           <LogIn className="w-4 h-4 text-[#35ACDF]" />
                         </button>
                        <Link to={`/dashboard/access/edit?id=${rowUser.id}`} className="p-2 text-gray-400 hover:text-[#35ACDF] hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors inline-block"><Edit2 className="w-4 h-4 text-gray-400 dark:text-gray-500" /></Link>
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-gray-400 dark:text-gray-500" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#001c38]/40 border-t border-gray-200 dark:border-slate-800 text-xs text-gray-500 dark:text-gray-450 flex items-start gap-2">
            <span className="font-bold uppercase tracking-widest text-[#00172D] dark:text-white shrink-0">Info Simulasi:</span> 
            Klik ikon "Log In" di kolom Tindakan untuk berpindah sesi dan melihat perubahan menu di Sidebar sesuai izin peran. Peran "None" menyembunyikan navigasi secara visual.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
