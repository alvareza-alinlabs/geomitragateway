import { Trans } from "../../../lib/LanguageContext";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Calendar,
  Clock,
  Plus,
  Search,
  User,
  ChevronDown,
  Send,
} from "lucide-react";
import emailjs from "@emailjs/browser";

interface Schedule {
  id: string;
  nama: string;
  perusahaan: string;
  waktu: string;
  tujuan?: string;
  tipe_jadwal?: string;
  status?: string;
  diajukan_oleh?: string;
}

export default function SchedulePage() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [salesMap, setSalesMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const { setHeaderConfig } = useOutletContext<{
    setHeaderConfig: (config: any) => void;
  }>();

  // Format today's date for default filtering if needed, but 'selectedDate' can be empty to show all
  useEffect(() => {
    setHeaderConfig({
      title: "Jadwal",
      subjudul: "Manajemen Aktivitas Harian & Rencana Kunjungan",
      showBack: false,
      hideMobileActionsWrap: true,
      searchBar: (
        <div key="search" className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari PIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-white dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] shadow-sm transition-all text-[10px] font-medium h-[38px] text-gray-800 dark:text-white"
            />
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] shadow-sm transition-all text-[10px] font-medium h-[38px] text-gray-600 dark:text-gray-300"
          />
        </div>
      ),
      actions: [
        <button
          key="add"
          onClick={() => navigate("/dashboard/schedule/add")}
          className="flex items-center justify-center gap-1.5 w-10 h-10 sm:w-auto sm:h-[38px] sm:px-4 p-0 bg-[#35ACDF] hover:bg-[#2c91bd] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md transition-all shrink-0 whitespace-nowrap"
        >
          <Plus className="w-5 h-5 sm:w-3.5 sm:h-3.5 text-white" /><span className="hidden sm:inline"><Trans>Tambah</Trans></span></button>,
      ],
    });
  }, [setHeaderConfig, searchQuery, selectedDate, navigate]);

  useEffect(() => {
    Promise.all([
      fetch("/data/schedules.json").then((res) => res.json()),
      fetch("/data/sales.json").then((res) => res.json()),
    ]).then(([schedData, salesData]) => {
      const sorted = schedData.sort(
        (a: Schedule, b: Schedule) =>
          new Date(a.waktu).getTime() - new Date(b.waktu).getTime(),
      );
      setSchedules(sorted);

      const sMap: Record<string, any> = {};
      salesData.forEach((s: any) => {
        sMap[s.id] = s;
      });
      setSalesMap(sMap);

      setLoading(false);
    });
  }, []);

  const routines = schedules.filter((s) => {
    if (s.tipe_jadwal !== "pribadi") return false;
    const matchesSearch =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.perusahaan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = selectedDate
      ? s.waktu.split("T")[0] === selectedDate
      : true;
    return matchesSearch && matchesDate;
  });

  const appointments = schedules.filter((s) => {
    if (s.tipe_jadwal !== "pengajuan") return false;
    const matchesSearch =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.perusahaan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const updateStatus = async (id: string, newStatus: string) => {
    setOpenDropdown(null);
    setSchedules(
      schedules.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
    );
  };

  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);

  const sendEmailStatusUpdate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const schedule = schedules.find((s) => s.id === id);
    if (!schedule) return;

    // Only send email for approved or canceled
    if (
      schedule.status?.toLowerCase() !== "approved" &&
      schedule.status?.toLowerCase() !== "canceled"
    ) {
      alert(
        "Hanya pengajuan dengan status Approved atau Canceled yang dikirimkan notifikasi email.",
      );
      return;
    }

    setSendingEmailId(id);

    try {
      // Get super admin from users.json
      const usersRes = await fetch("/data/users.json");
      const users = await usersRes.json();
      const superAdmin =
        users.find((u: any) => u.hak_akses?.ringkasan === "Super Admin") ||
        users[0];

      // Get sales related to this schedule
      const diajukanOleh = salesMap[schedule.diajukan_oleh || ""];
      if (diajukanOleh && diajukanOleh.email_kantor) {
        const templateParams = {
          subject: `Pembaruan Status Appointment - ${diajukanOleh.nama}`,
          from_name: superAdmin.nama,
          status:
            schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1),
          status_class: schedule.status.toLowerCase(),
          nama_pic: schedule.nama,
          perusahaan: schedule.perusahaan,
          waktu: new Date(schedule.waktu).toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          tujuan: schedule.tujuan || "-",
          to_name: diajukanOleh.nama || "Sales",
          to_mail: diajukanOleh.email_kantor,
          cc_mail: superAdmin.email, // Super admin email
        };

        await emailjs.send(
          "gmg-otp",
          "appointment",
          templateParams,
          "7afeCxNtF1U9QA0JL",
        );
        console.log("Email sent successfully!");
        alert("Email notifikasi berhasil dikirim.");
      } else {
        alert("Sales tidak ditemukan atau tidak memiliki email.");
      }
    } catch (err) {
      console.error("Failed to send email:", err);
      alert("Gagal mengirim email.");
    } finally {
      setSendingEmailId(null);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20";
      case "canceled":
        return "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20";
      default:
        return "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10 pt-6 pb-20"
    >
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#35ACDF] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Rutinitas Hari Ini */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div className="w-1.5 h-6 bg-[#35ACDF] rounded-full"></div>
              <h2 className="text-sm md:text-base font-black text-[#00172D] dark:text-gray-200 uppercase tracking-widest"><Trans>Rutinitas Hari Ini</Trans></h2>
            </div>

            {routines.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                {routines.map((schedule, index) => {
                  const dateObj = new Date(schedule.waktu);
                  const formattedDate = dateObj.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  const formattedTime = dateObj.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      key={schedule.id}
                      onClick={() =>
                        navigate(`/dashboard/schedule/detail/${schedule.id}`)
                      }
                      className="bg-white dark:bg-[#00172D] rounded-xl md:rounded-2xl p-3 md:p-5 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
                    >
                      <div className="flex items-center justify-between mb-3 text-[9px] md:text-xs text-gray-400 dark:text-gray-400 font-bold uppercase tracking-widest border-b border-gray-200 dark:border-slate-800 pb-2">
                        <span className="flex items-center gap-1 text-[#35ACDF]">
                          <Calendar className="w-3 h-3" /> {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formattedTime}
                        </span>
                      </div>

                      <h3 className="text-xs md:text-sm font-black text-[#00172D] dark:text-white mb-1 line-clamp-1">
                        {schedule.nama}
                      </h3>
                      <p className="text-[8px] md:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
                        {schedule.perusahaan}
                      </p>

                      <div className="mt-auto pt-3 relative flex gap-2">
                        <div className="relative flex-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(
                                openDropdown === schedule.id
                                  ? null
                                  : schedule.id,
                              );
                            }}
                            className={`w-full py-1.5 md:py-2 border rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 ${getStatusColor(schedule.status)}`}
                          >
                            {schedule.status || "pending"}{" "}
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <AnimatePresence>
                            {openDropdown === schedule.id && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute bottom-full left-0 w-full mb-1 bg-white dark:bg-[#001c38] border border-gray-400 dark:border-slate-600 rounded-lg shadow-lg z-50 overflow-hidden"
                              >
                                {["pending", "approved", "canceled"].map(
                                  (s) => (
                                    <button
                                      key={s}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateStatus(schedule.id, s);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-[9px] font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${schedule.status?.toLowerCase() === s ? "bg-gray-50 dark:bg-[#00172D] text-[#35ACDF]" : "text-gray-600 dark:text-gray-300"}`}
                                    >
                                      {s}
                                    </button>
                                  ),
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <button
                          onClick={(e) => sendEmailStatusUpdate(schedule.id, e)}
                          disabled={sendingEmailId === schedule.id}
                          title="Kirim Email Notifikasi"
                          className={`shrink-0 w-8 md:w-9 rounded-lg flex items-center justify-center border transition-all ${sendingEmailId === schedule.id ? "opacity-50 cursor-not-allowed bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30" : "bg-white dark:bg-[#001c38] hover:bg-blue-400/10 border-[#35ACDF]/30 dark:border-[#35ACDF]/40 hover:border-[#35ACDF] dark:hover:border-[#35ACDF] text-[#35ACDF]"}`}
                        >
                          {sendingEmailId === schedule.id ? (
                            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-t-transparent border-[#35ACDF] animate-spin" />
                          ) : (
                            <Send className="w-3 h-3 md:w-4 md:h-4 text-[#35ACDF]" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center text-[10px] md:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50 dark:bg-[#00172D]/40 rounded-2xl border border-gray-150 dark:border-slate-600/5 border-dashed"><Trans>Tidak ada rutinitas untuk tanggal ini</Trans></div>
            )}
          </div>

          {/* Pengajuan Appointment */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div className="w-1.5 h-6 bg-[#35ACDF] rounded-full"></div>
              <h2 className="text-sm md:text-base font-black text-[#00172D] dark:text-gray-200 uppercase tracking-widest"><Trans>Pengajuan Appointment</Trans></h2>
            </div>

            {appointments.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                {appointments.map((schedule, index) => {
                  const dateObj = new Date(schedule.waktu);
                  const formattedDate = dateObj.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  const formattedTime = dateObj.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      key={schedule.id}
                      onClick={() =>
                        navigate(`/dashboard/schedule/detail/${schedule.id}`)
                      }
                      className="bg-white dark:bg-[#00172D] rounded-xl md:rounded-2xl p-3 md:p-5 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full relative"
                    >
                      <div className="flex items-center justify-between mb-3 text-[9px] md:text-xs text-gray-400 dark:text-gray-400 font-bold uppercase tracking-widest border-b border-gray-200 dark:border-slate-800 pb-2">
                        <span className="flex items-center gap-1 text-[#35ACDF]">
                          <Calendar className="w-3 h-3" /> {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formattedTime}
                        </span>
                      </div>

                      <h3 className="text-xs md:text-sm font-black text-[#00172D] dark:text-white mb-1 line-clamp-1">
                        {schedule.nama}
                      </h3>
                      <p className="text-[8px] md:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 line-clamp-1">
                        {schedule.perusahaan}
                      </p>

                      <div className="flex items-center gap-1 text-[8px] md:text-[9px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest bg-gray-50 dark:bg-slate-900/40 p-1.5 md:p-2 rounded-lg mt-auto mb-3">
                        <User className="w-3 h-3 text-[#35ACDF]" /> Oleh:{" "}
                        {schedule.diajukan_oleh || "Sistem"}
                      </div>

                      <div className="mt-auto relative flex gap-2">
                        <div className="relative flex-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(
                                openDropdown === schedule.id
                                  ? null
                                  : schedule.id,
                              );
                            }}
                            className={`w-full py-1.5 md:py-2 border rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 ${getStatusColor(schedule.status)}`}
                          >
                            {schedule.status || "pending"}{" "}
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <AnimatePresence>
                            {openDropdown === schedule.id && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute bottom-full left-0 w-full mb-1 bg-white dark:bg-[#001c38] border border-gray-400 dark:border-slate-600 rounded-lg shadow-lg z-50 overflow-hidden"
                              >
                                {["pending", "approved", "canceled"].map(
                                  (s) => (
                                    <button
                                      key={s}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateStatus(schedule.id, s);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-[9px] font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${schedule.status?.toLowerCase() === s ? "bg-gray-50 dark:bg-[#00172D] text-[#35ACDF]" : "text-gray-600 dark:text-gray-300"}`}
                                    >
                                      {s}
                                    </button>
                                  ),
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <button
                          onClick={(e) => sendEmailStatusUpdate(schedule.id, e)}
                          disabled={sendingEmailId === schedule.id}
                          title="Kirim Email Notifikasi"
                          className={`shrink-0 w-8 md:w-9 rounded-lg flex items-center justify-center border transition-all ${sendingEmailId === schedule.id ? "opacity-50 cursor-not-allowed bg-blue-50 dark:bg-blue-95/20 border-blue-100 dark:border-blue-900/30" : "bg-white dark:bg-[#001c38] hover:bg-blue-400/10 border-[#35ACDF]/30 dark:border-[#35ACDF]/40 hover:border-[#35ACDF] dark:hover:border-[#35ACDF] text-[#35ACDF]"}`}
                        >
                          {sendingEmailId === schedule.id ? (
                            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-t-transparent border-[#35ACDF] animate-spin" />
                          ) : (
                            <Send className="w-3 h-3 md:w-4 md:h-4 text-[#35ACDF]" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center text-[10px] md:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50 dark:bg-[#00172D]/40 rounded-2xl border border-gray-150 dark:border-slate-600/5 border-dashed"><Trans>Tidak ada appointment untuk tanggal ini</Trans></div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
