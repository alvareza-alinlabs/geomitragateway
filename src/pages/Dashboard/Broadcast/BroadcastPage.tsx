import { Trans } from "../../../lib/LanguageContext";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Megaphone,
  MessageCircle,
  Mail,
  Plus,
  Search,
  CalendarDays,
  Users,
  ChevronRight,
} from "lucide-react";

export interface BroadcastCampaign {
  id: string;
  nama: string;
  tanggal: string;
  tipe: "WhatsApp" | "Email";
  template_isi: string;
  status: string;
  judul?: string;
  klien_sasaran: {
    id_klien: string;
    status: string;
    tanggal_kirim?: string;
  }[];
  attachments?: { nama: string; data: string; type: string }[];
  pengirim?: string;
  reply_to?: string;
  bcc_mail?: string;
  cc_mail?: string;
}

export default function BroadcastPage() {
  const [campaigns, setCampaigns] = useState<BroadcastCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { setHeaderConfig } = useOutletContext<{
    setHeaderConfig: (config: any) => void;
  }>();

  useEffect(() => {
    setHeaderConfig({
      title: "Campaign Broadcast",
      subjudul: "Manajemen Kampanye Pesan Massal",
      showBack: false,
      hideMobileActionsWrap: true,
      actions: [
        <button
          key="add-campaign"
          onClick={() => navigate("/dashboard/broadcast/add")}
          className="bg-[#35ACDF] hover:bg-[#2c91bd] text-white px-4 md:px-6 py-2 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-[#35ACDF]/30 flex items-center justify-center gap-2 transition-all w-full md:w-auto"
        >
          <Plus className="w-4 h-4" /><span className="hidden sm:inline"><Trans>Buat Campaign Baru</Trans></span></button>,
      ],
    });
  }, [setHeaderConfig, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/data/broadcasts.json").catch(() => ({
          json: () => [],
        }));
        const bData = await (res as Response).json();

        const storedCampaigns = localStorage.getItem("broadcast_campaigns_v2");
        if (storedCampaigns) {
          setCampaigns(JSON.parse(storedCampaigns));
        } else {
          setCampaigns(bData);
          localStorage.setItem("broadcast_campaigns_v2", JSON.stringify(bData));
        }
      } catch (error) {
        console.error("Fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 md:space-y-8 pb-20 pt-6">
      <div className="bg-white dark:bg-[#00172D] rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-black text-[#00172D] dark:text-white"><Trans>Daftar Campaign</Trans></h2>
        </div>

        {loading ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm"><Trans>Belum ada campaign</Trans></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                onClick={() => navigate(`/dashboard/broadcast/${camp.id}`)}
                className="bg-white dark:bg-[#00172D] border border-gray-200 dark:border-slate-800 rounded-2xl p-5 hover:border-[#35ACDF]/50 hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110">
                  {camp.tipe === "WhatsApp" ? (
                    <MessageCircle className="w-24 h-24" />
                  ) : (
                    <Mail className="w-24 h-24" />
                  )}
                </div>

                <div className="flex items-start gap-3 mb-4 relative z-10">
                  <div
                    className={`p-3 rounded-xl ${camp.tipe === "WhatsApp" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400" : "bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400"}`}
                  >
                    {camp.tipe === "WhatsApp" ? (
                      <MessageCircle className="w-5 h-5" />
                    ) : (
                      <Mail className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#00172D] dark:text-white text-sm group-hover:text-[#35ACDF] transition-colors truncate">
                      {camp.nama}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(camp.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col mt-auto relative z-10">
                  <p className="text-xs text-gray-500 dark:text-gray-300 line-clamp-2 mb-4 bg-gray-50 dark:bg-slate-900/40 p-3 rounded-xl italic">
                    "{camp.template_isi}"
                  </p>
                  <div className="flex items-center justify-between border-t border-gray-200 dark:border-slate-800 pt-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>
                        {
                          camp.klien_sasaran.filter(
                            (t) => t.status === "Terkirim",
                          ).length
                        }{" "}
                        Terkirim
                      </span>
                    </div>
                    <div className="flex items-center text-[#35ACDF] text-[10px] font-black uppercase tracking-widest group-hover:gap-2 transition-all"><Trans>Lihat Detail</Trans><ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
