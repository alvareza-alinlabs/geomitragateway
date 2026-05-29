import { Trans } from "../../../lib/LanguageContext";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  Mail,
  Search,
  Send,
  CheckCircle2,
  User,
  Building,
  Copy,
  ExternalLink,
  CalendarDays,
  Users,
  Paperclip,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { BroadcastCampaign } from "./BroadcastPage";
import { ClientData } from "../../../types";
import emailjs from "@emailjs/browser";

export default function BroadcastDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setHeaderConfig } = useOutletContext<any>();

  const [campaign, setCampaign] = useState<BroadcastCampaign | null>(null);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClients, setSelectedClients] = useState<Set<string>>(
    new Set(),
  );
  const [activeTab, setActiveTab] = useState<"Belum" | "Terkirim">("Belum");
  const [emailSendMethod, setEmailSendMethod] = useState<"auto" | "manual">(
    "auto",
  );
  const [isSendingAutoMail, setIsSendingAutoMail] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedCampaigns = localStorage.getItem("broadcast_campaigns_v2");
        let allCampaigns: BroadcastCampaign[] = [];
        if (storedCampaigns) {
          allCampaigns = JSON.parse(storedCampaigns);
        } else {
          const res = await fetch("/data/broadcasts.json").catch(() => ({
            json: () => [],
          }));
          allCampaigns = await (res as Response).json();
          localStorage.setItem(
            "broadcast_campaigns_v2",
            JSON.stringify(allCampaigns),
          );
        }

        const found = allCampaigns.find((c) => c.id === id);
        if (found) setCampaign(found);

        const [salesRes, partnersRes] = await Promise.all([
          fetch("/data/sales.json"),
          fetch("/data/partners.json"),
        ]);

        const salesData = await salesRes.json();
        const partnersData = await partnersRes.json();
        setClients([...salesData, ...partnersData]);
      } catch (error) {
        console.error("Fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDeleteCampaign = () => {
    if (confirm("Apakah Anda yakin ingin menghapus campaign ini?")) {
      const storedCampaigns = localStorage.getItem("broadcast_campaigns_v2");
      if (storedCampaigns) {
        const campaigns = JSON.parse(storedCampaigns);
        const newCampaigns = campaigns.filter((c: any) => c.id !== id);
        localStorage.setItem("broadcast_campaigns_v2", JSON.stringify(newCampaigns));
        navigate("/dashboard/broadcast");
      }
    }
  };

  useEffect(() => {
    if (campaign) {
      setHeaderConfig({
        title: campaign.nama,
        subjudul: `${campaign.tipe} • ${new Date(campaign.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}`,
        showBack: true,
        hideMobileActionsWrap: false,
        actions: (
          <>
            <button
              onClick={() => navigate(`/dashboard/broadcast/edit/${campaign.id}`)}
              className="w-full text-left md:w-auto px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 transition-colors flex items-center gap-2 rounded-lg text-sm font-medium"
            >
              <i className="w-4 h-4" /> Edit Campaign
            </button>
            <button
              onClick={handleDeleteCampaign}
              className="w-full text-left md:w-auto px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors flex items-center gap-2 rounded-lg text-sm font-medium"
            >
              <i className="w-4 h-4" /> Hapus Campaign
            </button>
          </>
        ),
      });
    } else {
      setHeaderConfig({
        title: "Detail Broadcast",
        subjudul: "Memuat info...",
        showBack: true,
      });
    }
  }, [campaign, setHeaderConfig, navigate, id]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="animate-pulse font-bold text-gray-400 uppercase tracking-widest"><Trans>Memuat Campaign...</Trans></p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-black text-[#00172D] mb-4"><Trans>Campaign tidak ditemukan</Trans></h2>
        <button
          onClick={() => navigate("/dashboard/broadcast")}
          className="text-[#35ACDF] font-bold underline"
        ><Trans>Kembali</Trans></button>
      </div>
    );
  }

  // Determine the status of clients
  const terkirimIds = new Set(campaign.klien_sasaran.map((t) => t.id_klien));

  const validClients = clients.filter((c) =>
    campaign.tipe === "WhatsApp" ? !!c.no_hp : !!c.email_kantor,
  );
  const belumCount = validClients.filter((c) => !terkirimIds.has(c.id)).length;
  const sudahCount = validClients.filter((c) => terkirimIds.has(c.id)).length;

  const clientList = clients.filter((c) => {
    if (
      searchQuery &&
      !c.perusahaan.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.nama_penanggung_jawab.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (campaign.tipe === "WhatsApp" && !c.no_hp) return false;
    if (campaign.tipe === "Email" && !c.email_kantor) return false;

    const isTerkirim = terkirimIds.has(c.id);
    if (activeTab === "Belum" && isTerkirim) return false;
    if (activeTab === "Terkirim" && !isTerkirim) return false;

    return true;
  });

  const toggleClientSelection = (clientId: string) => {
    if (activeTab === "Terkirim") return; // cannot select already sent
    const newSet = new Set(selectedClients);
    if (newSet.has(clientId)) newSet.delete(clientId);
    else newSet.add(clientId);
    setSelectedClients(newSet);
  };

  const selectAll = () => {
    if (activeTab === "Terkirim") return;
    if (selectedClients.size === clientList.length) {
      setSelectedClients(new Set());
    } else {
      setSelectedClients(new Set(clientList.map((c) => c.id)));
    }
  };

  const isManualMode =
    campaign.tipe === "WhatsApp" ||
    (campaign.tipe === "Email" && emailSendMethod === "manual");

  const handleSendManualIndividual = (client: ClientData) => {
    if (!campaign) return;

    if (campaign.tipe === "WhatsApp") {
      let msg = campaign.template_isi
        .replace(/\{nama\}/g, client.nama_penanggung_jawab)
        .replace(/\{perusahaan\}/g, client.perusahaan);
      window.open(
        `https://wa.me/${client.no_hp}?text=${encodeURIComponent(msg)}`,
        "_blank",
      );
    } else {
      let msg = campaign.template_isi
        .replace(/\{nama\}/g, client.nama_penanggung_jawab)
        .replace(/\{perusahaan\}/g, client.perusahaan);
      window.open(
        `mailto:${client.email_kantor}?subject=${encodeURIComponent(campaign.judul || campaign.nama)}&body=${encodeURIComponent(msg)}`,
        "_self",
      );
    }

    const updatedCampaign = { ...campaign };
    const newTarget = {
      id_klien: client.id,
      status: "Terkirim",
      tanggal_kirim: new Date().toISOString(),
    };

    updatedCampaign.klien_sasaran = [
      ...updatedCampaign.klien_sasaran,
      newTarget,
    ];

    const storedCampaigns = localStorage.getItem("broadcast_campaigns_v2");
    if (storedCampaigns) {
      let allCamps = JSON.parse(storedCampaigns) as BroadcastCampaign[];
      allCamps = allCamps.map((c) =>
        c.id === updatedCampaign.id ? updatedCampaign : c,
      );
      localStorage.setItem("broadcast_campaigns_v2", JSON.stringify(allCamps));
    }

    setCampaign(updatedCampaign);

    const newSet = new Set(selectedClients);
    if (newSet.has(client.id)) {
      newSet.delete(client.id);
      setSelectedClients(newSet);
    }
  };

  const handleSendBroadcast = async () => {
    if (selectedClients.size === 0)
      return alert("Pilih minimal 1 penerima yang belum dihubungi.");

    if (isManualMode && selectedClients.size > 1) {
      return alert(
        "Untuk pengiriman Manual/WhatsApp, silakan pilih 1 penerima saja agar dapat dilakukan satu per satu.",
      );
    }

    const selectedData = clients.filter((c) => selectedClients.has(c.id));

    if (campaign.tipe === "WhatsApp") {
      const firstClient = selectedData[0];
      let msg = campaign.template_isi
        .replace("{nama}", firstClient.nama_penanggung_jawab)
        .replace("{perusahaan}", firstClient.perusahaan);
      window.open(
        `https://wa.me/${firstClient.no_hp}?text=${encodeURIComponent(msg)}`,
        "_blank",
      );
    } else {
      if (emailSendMethod === "auto") {
        setIsSendingAutoMail(true);
        try {
          for (const client of selectedData) {
            let msgHtml = campaign.template_isi
              .replace(/\{nama\}/g, client.nama_penanggung_jawab)
              .replace(/\{perusahaan\}/g, client.perusahaan)
              .replace(/\n/g, "<br/>");

            const templateParams = {
              to_mail: client.email_kantor,
              subject: campaign.judul || campaign.nama,
              from_nama: campaign.pengirim || "Geo Mitra Gateway",
              replay_mail: campaign.reply_to || "",
              bcc_mail: campaign.bcc_mail || "",
              cc_mail: campaign.cc_mail || "",
              message_html: msgHtml,
              company_nama: campaign.pengirim || "Geo Mitra Gateway",
            };

            await emailjs.send(
              "gmg-broadcast",
              "gmg-broadcast",
              templateParams,
              "6JfqbVW9b9aCZwqbn",
            );
          }

          alert(
            `Berhasil mengirimkan ${selectedData.length} AutoMail berurutan!`,
          );
        } catch (error) {
          console.error("AutoMail Error:", error);
          alert(
            "Gagal mengirim AutoMail. Pastikan konfigurasi EmailJS sudah benar.",
          );
          setIsSendingAutoMail(false);
          return;
        }
        setIsSendingAutoMail(false);
      } else {
        const emails = selectedData
          .map((c) => c.email_kantor)
          .filter(Boolean)
          .join(",");
        let msg = campaign.template_isi
          .replace("{nama}", "Bapak/Ibu")
          .replace("{perusahaan}", "Partner Kami");
        window.open(
          `mailto:?bcc=${emails}&subject=${encodeURIComponent(campaign.nama)}&body=${encodeURIComponent(msg)}`,
          "_self",
        );
      }
    }

    // Save to history (update campaign)
    const updatedCampaign = { ...campaign };
    const newTargets = Array.from(selectedClients).map((cid) => ({
      id_klien: cid,
      status: "Terkirim",
      tanggal_kirim: new Date().toISOString(),
    }));

    updatedCampaign.klien_sasaran = [
      ...updatedCampaign.klien_sasaran,
      ...newTargets,
    ];

    // Persist
    const storedCampaigns = localStorage.getItem("broadcast_campaigns_v2");
    if (storedCampaigns) {
      let allCamps = JSON.parse(storedCampaigns) as BroadcastCampaign[];
      allCamps = allCamps.map((c) =>
        c.id === updatedCampaign.id ? updatedCampaign : c,
      );
      localStorage.setItem("broadcast_campaigns_v2", JSON.stringify(allCamps));
    }

    setCampaign(updatedCampaign);
    setSelectedClients(new Set());
  };

  const handleUndoTerkirim = (clientId: any) => {
    if (!campaign) return;

    const updatedCampaign = {
      ...campaign,
      klien_sasaran: campaign.klien_sasaran.filter(
        (t) => t.id_klien != clientId,
      ),
    };

    // Persist
    const storedCampaigns = localStorage.getItem("broadcast_campaigns_v2");
    if (storedCampaigns) {
      let allCamps = JSON.parse(storedCampaigns) as BroadcastCampaign[];
      allCamps = allCamps.map((c) =>
        c.id === updatedCampaign.id ? updatedCampaign : c,
      );
      localStorage.setItem("broadcast_campaigns_v2", JSON.stringify(allCamps));
    }

    setCampaign(updatedCampaign);
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Campaign Info & Template */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#00172D] rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden h-full">
            <div className="absolute right-0 top-0 opacity-5 pointer-events-none p-6">
              {campaign.tipe === "WhatsApp" ? (
                <MessageCircle className="w-24 h-24" />
              ) : (
                <Mail className="w-24 h-24" />
              )}
            </div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-[#00172D] dark:text-white text-lg"><Trans>Detail Template</Trans></h3>
            </div>

            <div className="space-y-6 relative z-10">
                <>
                  {campaign.tipe === "Email" && (
                    <div className="bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-400 dark:border-slate-600 p-4 space-y-3 mb-4">
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block"><Trans>Subject Email</Trans></span>
                        <span className="text-sm font-bold text-[#00172D] dark:text-white">
                          {campaign.judul || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block"><Trans>Dari</Trans></span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {campaign.pengirim || "-"}
                        </span>
                      </div>
                      {campaign.reply_to && (
                        <div>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block"><Trans>Reply To</Trans></span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {campaign.reply_to}
                          </span>
                        </div>
                      )}
                      {(campaign.cc_mail || campaign.bcc_mail) && (
                        <div className="flex gap-4">
                          {campaign.cc_mail && (
                            <div>
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                                CC
                              </span>
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                {campaign.cc_mail}
                              </span>
                            </div>
                          )}
                          {campaign.bcc_mail && (
                            <div>
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block"><Trans>BCC</Trans></span>
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                {campaign.bcc_mail}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {campaign.raw_form ? (
                    <div className="space-y-4">
                      {campaign.tipe === "WhatsApp" && campaign.judul && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1"><Trans>Judul Pesan</Trans></p>
                          <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-xl border border-gray-400 dark:border-slate-600 text-sm text-gray-600 dark:text-gray-300 font-medium whitespace-pre-wrap">
                            {campaign.judul}
                          </div>
                        </div>
                      )}
                      {campaign.raw_form.salam && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1"><Trans>Sapaan / Pembuka</Trans></p>
                          <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-xl border border-gray-400 dark:border-slate-600 text-sm text-gray-600 dark:text-gray-300 font-medium whitespace-pre-wrap">
                            {campaign.raw_form.salam}
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1"><Trans>Isi Pesan Utama</Trans></p>
                        <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-xl border border-gray-400 dark:border-slate-600 text-sm text-gray-600 dark:text-gray-300 font-medium whitespace-pre-wrap">
                          {campaign.raw_form.isi}
                        </div>
                      </div>
                      {campaign.raw_form.linkProduk && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1"><Trans>Link Sorotan</Trans></p>
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800/30 text-sm text-blue-600 dark:text-blue-400 font-medium break-all">
                            {campaign.raw_form.linkProduk}
                          </div>
                        </div>
                      )}
                      {campaign.raw_form.ctas && campaign.raw_form.ctas.length > 0 && campaign.raw_form.ctas.some((cta: any) => cta.label || cta.url) && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1"><Trans>Call To Action (CTA)</Trans></p>
                          <div className="grid gap-2">
                            {campaign.raw_form.ctas.filter((cta: any) => cta.label || cta.url).map((cta: any, i: number) => (
                              <div key={i} className="flex flex-col md:flex-row bg-gray-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-gray-400 dark:border-slate-600 gap-2">
                                <span className="font-bold text-sm text-gray-700 dark:text-gray-200 min-w-[120px]">{cta.label || "-"}</span>
                                <span className="text-sm text-blue-500 dark:text-blue-400 break-all">{cta.url || "-"}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {campaign.raw_form.penutup && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1"><Trans>Penutup</Trans></p>
                          <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-xl border border-gray-400 dark:border-slate-600 text-sm text-gray-600 dark:text-gray-300 font-medium whitespace-pre-wrap">
                            {campaign.raw_form.penutup}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2"><Trans>Isi Pesan</Trans></p>
                      <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-gray-400 dark:border-slate-600 text-sm text-gray-600 dark:text-gray-300 font-medium whitespace-pre-wrap">
                        {campaign.template_isi}
                      </div>
                    </div>
                  )}
                </>

              <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4"><Trans>Statistik Keberhasilan</Trans></p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 flex flex-col justify-center items-center">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {sudahCount}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-450 mt-1 text-center"><Trans>Terkirim</Trans></span>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-500/10 p-4 rounded-2xl border border-orange-100 dark:border-orange-500/20 flex flex-col justify-center items-center">
                    <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                      {belumCount}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-orange-500 dark:text-orange-450 mt-1 text-center"><Trans>Menunggu</Trans></span>
                  </div>
                </div>
              </div>

               {campaign.attachments && campaign.attachments.length > 0 && (
                <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Paperclip className="w-3 h-3" /><Trans>Lampiran Media</Trans></p>
                  <div className="space-y-2">
                    {campaign.attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900/45 border border-gray-200 dark:border-slate-800 rounded-xl"
                      >
                        {file.type.startsWith("image/") ? (
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-gray-400 dark:border-slate-600">
                            <img
                              src={file.data}
                              alt="preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#00172D] dark:text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Execution & Client List */}
        <div className="lg:col-span-2 bg-white dark:bg-[#00172D] rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[600px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-xl">
              <button
                onClick={() => {
                  setActiveTab("Belum");
                  setSelectedClients(new Set());
                  setSearchQuery("");
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "Belum" ? "bg-white dark:bg-[#00172D] text-[#00172D] dark:text-gray-100 shadow-sm" : "text-gray-500 hover:text-[#00172D] dark:hover:text-gray-100"}`}
              >
                Belum Dikirim ({belumCount})
              </button>
              <button
                onClick={() => {
                  setActiveTab("Terkirim");
                  setSelectedClients(new Set());
                  setSearchQuery("");
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "Terkirim" ? "bg-white dark:bg-[#00172D] text-emerald-600 shadow-sm" : "text-gray-500 hover:text-[#00172D] dark:hover:text-gray-100"}`}
              >
                Sudah Terkirim ({sudahCount})
              </button>
            </div>

            {activeTab === "Belum" && (
              <div className="flex items-center gap-3">
                {campaign.tipe === "Email" && (
                  <select
                    value={emailSendMethod}
                    onChange={(e) =>
                      setEmailSendMethod(e.target.value as "auto" | "manual")
                    }
                    className="bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-[#00172D] dark:text-gray-200 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-[#35ACDF]"
                  >
                    <option value="auto">AutoMail (GMG Mail)</option>
                    <option value="manual">ManualMail (Mailto)</option>
                  </select>
                )}
                {!isManualMode && (
                  <button
                    onClick={handleSendBroadcast}
                    disabled={isSendingAutoMail}
                    className="bg-[#35ACDF] hover:bg-[#2c91bd] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-[#35ACDF]/30 flex items-center justify-center gap-2 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    {isSendingAutoMail
                      ? "Mengirim..."
                      : `Eksekusi Broadcast (${selectedClients.size})`}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari perusahaan atau PIC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold outline-none focus:border-[#35ACDF] focus:ring-2 focus:ring-[#35ACDF]/20 transition-all"
              />
            </div>
            {activeTab === "Belum" && !isManualMode && (
              <button
                onClick={selectAll}
                className="text-[#35ACDF] text-[10px] font-black uppercase tracking-widest hover:underline whitespace-nowrap px-2"
              >
                {selectedClients.size === clientList.length &&
                clientList.length > 0
                  ? "Batal Semua"
                  : "Pilih Semua"}
              </button>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {clientList.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center p-10 flex-col gap-3">
                <Users className="w-10 h-10 text-gray-200" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs"><Trans>Tidak ada data untuk ditampilkan</Trans></p>
              </div>
            ) : (
              clientList.map((c) => {
                const isSelected = selectedClients.has(c.id);
                const targetInfo = campaign.klien_sasaran.find(
                  (t) => t.id_klien === c.id,
                );

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      if (activeTab !== "Belum") return;
                      if (isManualMode) {
                        handleSendManualIndividual(c);
                      } else {
                        toggleClientSelection(c.id);
                      }
                    }}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                      activeTab === "Belum"
                        ? !isManualMode && isSelected
                          ? "border-[#35ACDF] bg-blue-50/20 dark:bg-blue-500/10 shadow-sm cursor-pointer"
                          : "border-gray-200 dark:border-slate-800 bg-white dark:bg-[#00172D] hover:border-[#35ACDF]/40 cursor-pointer"
                        : "border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 cursor-default"
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activeTab === "Terkirim" ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-[#00172D] dark:bg-white/10 text-white dark:text-[#35ACDF]"}`}
                      >
                        {activeTab === "Terkirim" ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Building className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-[#00172D] dark:text-white text-xs md:text-sm truncate">
                          {c.perusahaan}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-widest truncate">
                            {c.nama_penanggung_jawab}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                          <span className="text-[10px] uppercase font-bold text-[#35ACDF] tracking-widest truncate">
                            {campaign.tipe === "WhatsApp"
                              ? c.no_hp
                              : c.email_kantor}
                          </span>
                        </div>
                      </div>
                    </div>

                    {activeTab === "Belum" ? (
                      isManualMode ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendManualIndividual(c);
                          }}
                          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#35ACDF]/10 text-[#35ACDF] hover:bg-[#35ACDF] hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
                        >
                          <Send className="w-3 h-3" />{" "}
                          <span className="hidden sm:inline"><Trans>Kirim</Trans></span>
                        </button>
                      ) : (
                        <div
                          className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? "border-[#35ACDF] bg-[#35ACDF] text-white" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-[#00172D]"}`}
                        >
                          {isSelected && (
                            <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                          )}
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 text-right shrink-0">
                        <div>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block"><Trans>Terkirim Pada</Trans></span>
                          <span className="text-xs font-black text-emerald-600">
                            {targetInfo?.tanggal_kirim
                              ? new Date(
                                  targetInfo.tanggal_kirim,
                                ).toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUndoTerkirim(c.id);
                          }}
                          title="Batalkan Status Terkirim"
                          className="text-gray-300 hover:text-red-500 transition-colors bg-white dark:bg-[#00172D] rounded-full p-1 border border-transparent dark:border-slate-600/5 hover:border-red-150 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
