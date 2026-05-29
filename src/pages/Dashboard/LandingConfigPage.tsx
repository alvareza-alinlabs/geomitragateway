import { Trans } from "../../lib/LanguageContext";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LayoutDashboard, Save, Loader2, CheckCircle2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";

export default function LandingConfigPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { setHeaderConfig } = useOutletContext<{
    setHeaderConfig: (config: any) => void;
  }>();

  // Extract handleSave to be mapped in header actions
  const handleSave = () => {
    setSaving(true);
    setSaveSuccess(false);
    // Simulate save to backend
    if (typeof window !== "undefined" && (window as any).clearAppCache) (window as any).clearAppCache();
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  useEffect(() => {
    setHeaderConfig({
      title: "Landing Page Config",
      subjudul: "Atur konten halaman utama portal",
      showBack: false,
      hideMobileActionsWrap: true,
      actions: [
        <button
          key="save"
          onClick={handleSave}
          disabled={saving || !data}
          className="flex items-center justify-center gap-1.5 w-10 h-10 sm:w-auto sm:px-6 sm:py-2.5 bg-[#35ACDF] hover:bg-[#2c91bd] text-white text-[10px] font-bold uppercase tracking-widest rounded-full sm:rounded-xl shadow-md transition-all shrink-0 whitespace-nowrap disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 sm:w-3.5 sm:h-3.5 animate-spin text-white" />
          ) : saveSuccess ? (
            <CheckCircle2 className="w-5 h-5 sm:w-3.5 sm:h-3.5 text-white" />
          ) : (
            <Save className="w-5 h-5 sm:w-3.5 sm:h-3.5 text-white" />
          )}
          <span className="hidden sm:inline">
            {saving
              ? "Menyimpan..."
              : saveSuccess
                ? "Tersimpan"
                : "Simpan Perubahan"}
          </span>
        </button>,
      ],
    });
  }, [setHeaderConfig, saving, saveSuccess, data]);

  useEffect(() => {
    fetch("/data/landing.json")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (section: string, field: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#35ACDF] animate-spin text-[#35ACDF]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-20 pt-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section Config */}
        <div className="bg-white dark:bg-[#00172D] p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-50 dark:border-slate-600/5 pb-4">
            <div className="w-10 h-10 bg-blue-50 dark:bg-[#001c38] text-[#35ACDF] rounded-xl flex items-center justify-center border border-transparent dark:border-slate-600/5">
              <LayoutDashboard className="w-5 h-5 text-[#35ACDF]" />
            </div>
            <h2 className="text-lg font-black text-[#00172D] dark:text-white"><Trans>Hero Section</Trans></h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Teks untuk beranda (Hero) telah dinonaktifkan sesuai kebutuhan.
              Hero kini hanya menampilkan background video tanpa teks.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Corporate Values Config */}
          <div className="bg-white dark:bg-[#00172D] p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-50 dark:border-slate-600/5 pb-4">
              <div className="w-10 h-10 bg-blue-50 dark:bg-[#001c38] text-[#35ACDF] rounded-xl flex items-center justify-center border border-transparent dark:border-slate-600/5">
                <LayoutDashboard className="w-5 h-5 text-[#35ACDF]" />
              </div>
              <h2 className="text-lg font-black text-[#00172D] dark:text-white"><Trans>Nilai Strategis</Trans></h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 block">
                  Judul Section (Bisa gunakan \n untuk enter)
                </label>
                <input
                  type="text"
                  value={data?.nilai_perusahaan?.judul || ""}
                  onChange={(e) =>
                    handleChange("nilai_perusahaan", "title", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#001c38] border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 block"><Trans>Deskripsi Singkat</Trans></label>
                <textarea
                  rows={3}
                  value={data?.nilai_perusahaan?.subjudul || ""}
                  onChange={(e) =>
                    handleChange("nilai_perusahaan", "subjudul", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#001c38] border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] text-sm font-medium resize-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Config */}
          <div className="bg-white dark:bg-[#00172D] p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-50 dark:border-slate-600/5 pb-4">
              <div className="w-10 h-10 bg-blue-50 dark:bg-[#001c38] text-[#35ACDF] rounded-xl flex items-center justify-center border border-transparent dark:border-slate-600/5">
                <LayoutDashboard className="w-5 h-5 text-[#35ACDF]" />
              </div>
              <h2 className="text-lg font-black text-[#00172D] dark:text-white"><Trans>Footer & Profil</Trans></h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 block">
                  Deskripsi Profil (Bawah Logo)
                </label>
                <textarea
                  rows={3}
                  value={data?.catatan_kaki?.deskripsi || ""}
                  onChange={(e) =>
                    handleChange("catatan_kaki", "deskripsi", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#001c38] border border-gray-400 dark:border-slate-600 text-gray-800 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] text-sm font-medium resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
