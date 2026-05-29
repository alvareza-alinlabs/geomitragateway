import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Megaphone,
  MessageCircle,
  Mail,
  Plus,
  Trash2,
  Link as LinkIcon,
  Image as ImageIcon,
  Paperclip,
  FileText,
  X,
  FileCheck
} from "lucide-react";

export default function AddBroadcastForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setHeaderConfig } = useOutletContext<{
    setHeaderConfig: (config: any) => void;
  }>();

  const [formData, setFormData] = useState({
    nama: "",
    tipe: "WhatsApp" as "WhatsApp" | "Email",
    pengirim: "Geo Mitra Gateway",
    reply_to: "",
    cc_mail: "",
    bcc_mail: "",
    judul: "",
    salam: "Halo {nama},",
    isi: "",
    linkProduk: "",
    ctas: [{ label: "", url: "" }],
    penutup: "Terima kasih,\nTim Kami",
    attachments: [] as { nama: string; data: string; type: string }[],
  });

  const APPLY_TEMPLATE = (type: "Penawaran WA" | "Info Email" | "Undangan WA" | "Promo Email") => {
    if (type === "Penawaran WA") {
      setFormData(prev => ({
        ...prev,
        tipe: "WhatsApp",
        judul: "Penawaran Spesial Produk Baru",
        salam: "Selamat pagi Bapak/Ibu {nama} dari {perusahaan},",
        isi: "Kami memiliki penawaran menarik khusus untuk rekan bisnis kami. Kami baru saja meluncurkan seri produk terbaru yang bisa meningkatkan efisiensi operasional perusahaan Anda.\n\nDapatkan diskon khusus hingga 20% untuk pemesanan minggu ini.",
        ctas: [{ label: "Lihat Katalog", url: "https://example.com/katalog" }],
        penutup: "Tertarik? Jangan ragu untuk membalas pesan ini atau menghubungi tim kami.\n\nSalam sukses,\nGeo Mitra Gateway",
      }));
    } else if (type === "Info Email") {
      setFormData(prev => ({
        ...prev,
        tipe: "Email",
        judul: "Pemberitahuan Pemeliharaan Sistem",
        salam: "Yth. Bapak/Ibu {nama},\nPerwakilan {perusahaan},",
        isi: "Bersama email ini, kami ingin memberitahukan bahwa akan dilakukan pemeliharaan sistem pada layanan Geo Mitra pada pekan mendatang.\n\nSistem mungkin akan mengalami sedikit gangguan selama proses berlangsung. Kami memohon maaf atas ketidaknyamanan yang mungkin terjadi.",
        ctas: [{ label: "Detail Pembaruan", url: "https://example.com/status" }],
        penutup: "Hormat kami,\nTim Support Geo Mitra",
      }));
    } else if (type === "Undangan WA") {
      setFormData(prev => ({
        ...prev,
        tipe: "WhatsApp",
        judul: "Undangan Gathering Partner 2026",
        salam: "Halo {nama}, bagaimana kabarnya?",
        isi: "Kami dari Geo Mitra Gateway mengundang {perusahaan} untuk hadir dalam acara Gathering tahunan kita. Acara ini akan membahas update teknologi terbaru dan penghargaan untuk partner terbaik.\n\nCatat Tanggalnya!\nHari: Kamis, 28 Mei 2026\nLokasi: Grand Mercure",
        ctas: [{ label: "RSVP Kehadiran", url: "https://example.com/rsvp" }],
        penutup: "Kami sangat menantikan kehadiran Anda.\n\nTerima kasih,\nTim Geo Mitra Gateway",
      }));
    } else if (type === "Promo Email") {
      setFormData(prev => ({
        ...prev,
        tipe: "Email",
        judul: "🚨 Cuci Gudang Akhir Tahun - Diskon s/d 50%",
        salam: "Halo {nama},",
        isi: "Waktu yang tepat untuk mengupgrade perangkat keras di {perusahaan}! Kami mengadakan promo besar-besaran untuk produk-produk unggulan dari HP Inc & Poly.\n\nStok sangat terbatas, siapa cepat dia dapat.",
        ctas: [{ label: "Klaim Promo", url: "https://example.com/promo" }, { label: "Hubungi Sales", url: "https://example.com/contact" }],
        penutup: "Selamat berbelanja,\nTim Sales Geo Mitra Gateway",
      }));
    }
  };

  useEffect(() => {
    if (id) {
      const storedCampaigns = localStorage.getItem("broadcast_campaigns_v2");
      if (storedCampaigns) {
        const campaigns = JSON.parse(storedCampaigns);
        const existing = campaigns.find((c: any) => c.id === id);
        if (existing) {
          if (existing.raw_form) {
            setFormData(existing.raw_form);
          } else {
            // fallback
            setFormData(prev => ({ ...prev, nama: existing.nama, tipe: existing.tipe, pengirim: existing.pengirim, judul: existing.judul, reply_to: existing.reply_to || "", cc_mail: existing.cc_mail || "", bcc_mail: existing.bcc_mail || "", isi: existing.template_isi || "", attachments: existing.attachments || [] }));
          }
        }
      }
    }
  }, [id]);

  useEffect(() => {
    setHeaderConfig({
      title: id ? "Edit Campaign" : "Buat Campaign Baru",
      subjudul: id ? "Update Pesan & Target" : "Desain Pesan & Pilih Target",
      showBack: true,
      hideMobileActionsWrap: true,
      actions: (
        <>
          <button
            type="button"
            onClick={() => { if (typeof window !== "undefined" && (window as any).clearAppCache) (window as any).clearAppCache(); navigate(-1); }}
            className="p-2 md:px-4 md:py-2 md:bg-gray-50 dark:md:bg-slate-900/50 md:hover:bg-gray-100 dark:md:hover:bg-slate-900 border-transparent md:border-gray-200 dark:md:border-transparent text-gray-400 hover:text-gray-600 md:text-gray-600 dark:text-gray-300 font-bold uppercase tracking-widest text-[10px] rounded-full md:rounded-xl flex items-center justify-center md:inline-flex md:justify-start gap-1.5 transition-all"
          >
            <X className="w-5 h-5 md:hidden" />
            <span className="hidden md:inline">Batal</span>
          </button>
          <button
            type="submit"
            form="add-broadcast-form"
            className="p-2 md:px-5 md:py-2 md:bg-[#00172D] hover:bg-gray-50 md:hover:bg-gray-900 text-[#35ACDF] md:text-white font-bold uppercase tracking-widest text-[10px] rounded-full md:rounded-xl flex items-center justify-center md:inline-flex md:justify-start gap-1.5 transition-all md:shadow-md"
          >
            <Save className="w-5 h-5 md:w-3.5 md:h-3.5 md:text-[#35ACDF]" />
            <span className="hidden md:inline">Simpan Campaign</span>
          </button>
        </>
      ),
    });
  }, [setHeaderConfig, navigate, id]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    Array.from(fileList).forEach((file: File) => {
      // limit size to 2MB for localstorage safety
      if (file.size > 2 * 1024 * 1024) {
        alert(
          `File ${file.name} terlalu besar. Maksimal 2MB untuk preview lokal.`,
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({
            ...prev,
            attachments: [
              ...prev.attachments,
              {
                nama: file.name,
                type: file.type,
                data: event.target!.result as string,
              },
            ],
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = "";
  };

  const removeAttachment = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== idx),
    }));
  };

  const handleAddCTA = () => {
    setFormData({
      ...formData,
      ctas: [...formData.ctas, { label: "", url: "" }],
    });
  };

  const handleRemoveCTA = (index: number) => {
    const newCtas = formData.ctas.filter((_, i) => i !== index);
    setFormData({ ...formData, ctas: newCtas });
  };

  const handleCTAChange = (
    index: number,
    field: "label" | "url",
    value: string,
  ) => {
    const newCtas = [...formData.ctas];
    newCtas[index][field] = value;
    setFormData({ ...formData, ctas: newCtas });
  };

  const extractFirstUrl = () => {
    if (formData.linkProduk) return formData.linkProduk;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const isiUrls = formData.isi.match(urlRegex);
    if (isiUrls && isiUrls.length > 0) return isiUrls[0];

    for (const cta of formData.ctas) {
      if (cta.url) {
        const ctaUrls = cta.url.match(urlRegex);
        if (ctaUrls && ctaUrls.length > 0) return ctaUrls[0];
      }
    }
    return null;
  };

  const metaPreviewUrl = extractFirstUrl();

  const getHostname = (url: string) => {
    try {
      return new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
    } catch {
      return url;
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama || !formData.isi) {
      return alert("Nama campaign dan isi pesan wajib diisi.");
    }

    let template_isi = "";
    if (formData.judul) {
      template_isi +=
        formData.tipe === "Email"
          ? `<b>${formData.judul}</b>\n\n`
          : `*${formData.judul}*\n\n`;
    }
    if (formData.linkProduk) template_isi += `${formData.linkProduk}\n\n`;
    template_isi += `${formData.salam}\n\n`;
    template_isi += `${formData.isi}\n\n`;

    const validCtas = formData.ctas.filter((cta) => cta.label && cta.url);
    if (validCtas.length > 0) {
      validCtas.forEach((cta) => {
        template_isi +=
          formData.tipe === "Email"
            ? `<b>${cta.label}:</b>\n<a href="${cta.url}">${cta.url}</a>\n\n`
            : `*${cta.label}:*\n${cta.url}\n\n`;
      });
    }

    template_isi += `${formData.penutup}`;

    const storedCampaigns = localStorage.getItem("broadcast_campaigns_v2");
    let campaigns = [];
    if (storedCampaigns) {
      campaigns = JSON.parse(storedCampaigns);
    }

    const campaignData = {
      nama: formData.nama,
      tipe: formData.tipe,
      pengirim: formData.pengirim,
      judul: formData.judul,
      reply_to: formData.reply_to,
      cc_mail: formData.cc_mail,
      bcc_mail: formData.bcc_mail,
      template_isi: template_isi,
      attachments: formData.attachments,
      raw_form: formData,
    };

    let savedId = id;
    if (id) {
      campaigns = campaigns.map((c: any) => c.id === id ? { ...c, ...campaignData, tanggal: new Date().toISOString() } : c);
    } else {
      savedId = `CAMP-${Date.now()}`;
      campaigns.unshift({
        id: savedId,
        ...campaignData,
        tanggal: new Date().toISOString(),
        status: "Aktif",
        klien_sasaran: [],
      });
    }

    localStorage.setItem("broadcast_campaigns_v2", JSON.stringify(campaigns));

    if (typeof window !== "undefined" && (window as any).clearAppCache) (window as any).clearAppCache();
    navigate(`/dashboard/broadcast/${savedId}`);
  };

  return (
    <div className="pb-20 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#00172D] rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none p-8">
          <Megaphone className="w-64 h-64" />
        </div>

        <form
          id="add-broadcast-form"
          onSubmit={handleSave}
          className="space-y-8 relative z-10 w-full"
        >
          {/* TEMPLATE QUICK ACTIONS */}
          {!id && (
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="w-full text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pilih Template Cepat:</span>
              <button type="button" onClick={() => APPLY_TEMPLATE("Penawaran WA")} className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-green-100 transition-colors">Penawaran WA</button>
              <button type="button" onClick={() => APPLY_TEMPLATE("Undangan WA")} className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-green-100 transition-colors">Undangan WA</button>
              <button type="button" onClick={() => APPLY_TEMPLATE("Info Email")} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-100 transition-colors">Info Email</button>
              <button type="button" onClick={() => APPLY_TEMPLATE("Promo Email")} className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-orange-100 transition-colors">Promo Email</button>
            </div>
          )}

          {/* IDENTITAS CAMPAIGN */}
          <div className="space-y-6 lg:space-y-8 pb-8 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-black text-[#00172D] dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-50 dark:bg-white/10 text-blue-500 dark:text-[#35ACDF] flex items-center justify-center text-xs">
                  1
                </span>
                Identitas Campaign
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Nama Campaign
                </label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Promo Ramadhan 2026"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Nama Pengirim / Perusahaan
                </label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Geo Mitra Gateway"
                  value={formData.pengirim}
                  onChange={(e) =>
                    setFormData({ ...formData, pengirim: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Metode Pengiriman
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, tipe: "WhatsApp" })
                    }
                    className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${formData.tipe === "WhatsApp" ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "border-gray-400 dark:border-slate-600 bg-white dark:bg-[#00172D] hover:border-emerald-200 dark:hover:border-emerald-800 text-gray-400"}`}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">
                      WhatsApp
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tipe: "Email" })}
                    className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${formData.tipe === "Email" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "border-gray-400 dark:border-slate-600 bg-white dark:bg-[#00172D] hover:border-blue-200 dark:hover:border-blue-800 text-gray-400"}`}
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">
                      Email
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {formData.tipe === "Email" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200 dark:border-slate-800">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Reply-To (Opsional)
                  </label>
                  <input
                    type="email"
                    placeholder="Contoh: CS@geomitra.com"
                    value={formData.reply_to}
                    onChange={(e) =>
                      setFormData({ ...formData, reply_to: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    CC Email (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: manager@geomitra.com"
                    value={formData.cc_mail}
                    onChange={(e) =>
                      setFormData({ ...formData, cc_mail: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    BCC Email (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: monitoring@geomitra.com"
                    value={formData.bcc_mail}
                    onChange={(e) =>
                      setFormData({ ...formData, bcc_mail: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium"
                  />
                </div>
              </div>
            )}
          </div>

          {/* DRAFT PESAN */}
          <div className="space-y-6 lg:space-y-8">
            <div>
              <h3 className="text-lg font-black text-[#00172D] dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-50 dark:bg-white/10 text-blue-500 dark:text-[#35ACDF] flex items-center justify-center text-xs">
                  2
                </span>
                Penyusunan Format Pesan
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Judul{" "}
                    {formData.tipe === "Email"
                      ? "/ Subject Email"
                      : "Pesan (Opsional)"}
                  </label>
                  <input
                    type="text"
                    required={formData.tipe === "Email"}
                    value={formData.judul}
                    onChange={(e) =>
                      setFormData({ ...formData, judul: e.target.value })
                    }
                    placeholder={
                      formData.tipe === "Email"
                        ? "Contoh: Penawaran Spesial"
                        : "Contoh: PROMO AKHIR BULAN"
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Salam Pembuka
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.salam}
                    onChange={(e) =>
                      setFormData({ ...formData, salam: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium"
                  />
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pt-1">
                    Gunakan {"{nama}"} atau {"{perusahaan}"}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Isi Pesan Utama
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.isi}
                    onChange={(e) =>
                      setFormData({ ...formData, isi: e.target.value })
                    }
                    placeholder="Tuliskan inti pesan atau penawaran produk..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium resize-none"
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Link Produk Utama (Opsional)
                  </label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      value={formData.linkProduk}
                      onChange={(e) =>
                        setFormData({ ...formData, linkProduk: e.target.value })
                      }
                      placeholder="https://example.com/produk"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium"
                    />
                  </div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pt-1">
                    Link ini akan diprioritaskan sebagai preview web
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Tombol Aksi / CTA
                    </label>
                    <button
                      type="button"
                      onClick={handleAddCTA}
                      className="text-[#35ACDF] text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3 h-3" /> <span className="hidden sm:inline">Tambah CTA</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.ctas.map((cta, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            placeholder="Label CTA (misal: Beli Sekarang)"
                            value={cta.label}
                            onChange={(e) =>
                              handleCTAChange(index, "label", e.target.value)
                            }
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-xs font-bold"
                          />
                          <input
                            type="url"
                            placeholder="URL Target"
                            value={cta.url}
                            onChange={(e) =>
                              handleCTAChange(index, "url", e.target.value)
                            }
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-xs font-medium"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCTA(index)}
                          className="p-2.5 mt-0.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 pt-4 border-t border-gray-200 dark:border-slate-800">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Kalimat Penutup / Footer
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.penutup}
                    onChange={(e) =>
                      setFormData({ ...formData, penutup: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium resize-none"
                  ></textarea>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Lampiran Media (Opsional)
                      </label>
                      <p className="text-[9px] text-gray-500 mt-0.5">
                        Maks 2MB per file (Gambar/PDF)
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[#35ACDF] text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:underline"
                    >
                      <Paperclip className="w-3 h-3" /> <span className="hidden sm:inline">Tambah File</span>
                    </button>
                  </div>

                  {formData.attachments.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {formData.attachments.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-xl relative group"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            {file.type.startsWith("image/") ? (
                              <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden border border-gray-100">
                                <img
                                  src={file.data}
                                  alt="preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                                <FileText className="w-4 h-4" />
                              </div>
                            )}
                            <div className="truncate">
                              <p className="text-[10px] font-bold text-gray-700 truncate">
                                {file.name}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(idx)}
                            className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 border border-gray-400 dark:border-slate-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-[10px] text-orange-500 font-medium italic mt-2 bg-orange-50 p-3 rounded-xl border border-orange-100">
                    *Catatan:{" "}
                    {formData.tipe === "WhatsApp"
                      ? "Tautan wa.me / api.whatsapp.com tidak mendukung lampiran otomatis via parameter URL."
                      : "Protokol mailto (Email Browser) tidak mendukung lampiran otomatis."}{" "}
                    Anda perlu melampirkan file secara manual saat aplikasi
                    terbuka. Draft ini hanya sebagai pengingat.
                  </p>
                </div>
              </div>

              {/* Live Preview */}
              <div className="bg-gray-50 dark:bg-slate-900/30 rounded-3xl p-6 border border-gray-200 dark:border-slate-600/5 flex flex-col h-full sticky top-8">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  Simulasi Tampilan ({formData.tipe})
                  <span className="bg-white dark:bg-white/10 px-2 py-0.5 rounded shadow-sm text-gray-500 dark:text-gray-300">
                    Live Preview
                  </span>
                </h4>

                <div className="flex-1 bg-white dark:bg-[#00172D] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 font-medium text-sm text-[#00172D] dark:text-gray-100 whitespace-pre-wrap leading-relaxed shadow-lg">
                  {metaPreviewUrl && (
                    <div className="mb-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-400 dark:border-slate-600 rounded-xl overflow-hidden hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                      <div className="h-24 bg-gray-200 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-gray-500 relative overflow-hidden">
                        <ImageIcon className="w-8 h-8 opacity-20" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                      </div>
                      <div className="p-3">
                        <h5 className="font-black text-xs text-[#00172D] line-clamp-1">
                          Preview Artikel atau Produk
                        </h5>
                        <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">
                          Deskripsi meta preview dari link{" "}
                          {getHostname(metaPreviewUrl)} akan muncul di sini
                          secara otomatis.
                        </p>
                        <p className="text-[9px] text-[#35ACDF] font-bold mt-1.5 uppercase tracking-widest">
                          {getHostname(metaPreviewUrl)}
                        </p>
                      </div>
                    </div>
                  )}

                  {formData.linkProduk && (
                    <p className="text-[#35ACDF] mb-3 hover:underline break-all">
                      {formData.linkProduk}
                    </p>
                  )}
                  {formData.judul && (
                    <p className="font-black text-[15px] mb-3">
                      *{formData.judul.toUpperCase()}*
                    </p>
                  )}
                  <p>
                    {formData.salam
                      .replace("{nama}", "Bapak/Ibu")
                      .replace("{perusahaan}", "PT Contoh Hebat")}
                  </p>

                  <p className="mt-3 text-gray-600">
                    {formData.isi || (
                      <span className="text-gray-300 italic">
                        Isi pesan akan tampil di sini...
                      </span>
                    )}
                  </p>

                  {formData.ctas.filter((cta) => cta.label && cta.url).length >
                    0 && (
                    <div className="mt-4 space-y-2">
                      {formData.ctas
                        .filter((cta) => cta.label && cta.url)
                        .map((cta, i) => (
                          <p key={i} className="text-gray-600">
                            <span className="font-bold">{cta.label}:</span>{" "}
                            <span className="text-[#35ACDF]">{cta.url}</span>
                          </p>
                        ))}
                    </div>
                  )}

                  <p className="mt-3 text-gray-400 text-xs whitespace-pre-wrap">
                    {formData.penutup}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
