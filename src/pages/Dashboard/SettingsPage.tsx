import { Trans } from "../../lib/LanguageContext";
import { useState, FormEvent, useEffect } from "react";
import { motion } from "motion/react";
import { Key, CheckCircle2, Globe, Moon, Download, Sun } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { getCurrentUser, setCurrentUser, UserAccount } from "../../lib/auth";
import { useLanguage, useTranslation } from "../../lib/LanguageContext";

export default function SettingsPage() {
  const [successMsg, setSuccessMsg] = useState("");
  const [currentUser, setLocalCurrentUser] = useState<UserAccount>(getCurrentUser());
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { setHeaderConfig } = useOutletContext<{ setHeaderConfig: (config: any) => void }>();
  
  const { t } = useTranslation();
  // Custom language hook
  const { language, setLanguage } = useLanguage();

  // Dynamic theme state synchronized with landing header
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    setHeaderConfig({
      title: <Trans>Pengaturan Pribadi</Trans>,
      subjudul: <Trans>Kelola kredensial akun, preferensi bahasa, dan tema</Trans>,
      showBack: false
    });
  }, [setHeaderConfig]);

  useEffect(() => {
    const handleStorage = () => setLocalCurrentUser(getCurrentUser());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Sync theme with document element and localStorage
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Sync theme across other sections/instances listening to custom event
  useEffect(() => {
    const handleThemeChange = (e: any) => {
      if (e.detail) {
        setTheme(e.detail);
      }
    };
    window.addEventListener("themeChanged", handleThemeChange);
    return () => window.removeEventListener("themeChanged", handleThemeChange);
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    window.dispatchEvent(new CustomEvent("themeChanged", { detail: newTheme }));
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        }
        setDeferredPrompt(null);
      });
    } else {
      const txt = await t("Perangkat Anda tidak mendukung instalasi aplikasi (PWA) atau aplikasi sudah diinstal.");
      alert(txt);
    }
  };

  const handleSaveAccount = async (e: FormEvent) => {
    e.preventDefault();
    const txt = await t("Pengaturan berhasil disimpan.");
    setSuccessMsg(txt);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const languages = [
    { code: 'id', label: 'Bahasa Indonesia' },
    { code: 'en', label: 'English (US)' },
    { code: 'zh', label: '中文 (Mandarin)' }
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 w-full pt-6"
    >
      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-emerald-200 dark:border-emerald-900/40">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#35ACDF]" /> {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Kredensial */}
        <div className="bg-white dark:bg-[#00172D] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-slate-800 pb-4">
             <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/20 rounded-xl flex items-center justify-center text-[#35ACDF]">
                <Key className="w-5 h-5 text-[#35ACDF]" />
             </div>
             <div>
                <h2 className="text-lg font-black text-[#00172D] dark:text-white"><Trans>Kredensial Akun</Trans></h2>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest"><Trans>Perbarui email & kata sandi Anda</Trans></p>
             </div>
          </div>

          <form onSubmit={handleSaveAccount} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest"><Trans>Nama Lengkap</Trans></label>
                <input type="text" disabled value={currentUser.nama} className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-600/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] transition-all text-sm font-medium opacity-70 text-gray-800 dark:text-gray-300" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest"><Trans>Alamat Email</Trans></label>
                <input type="email" defaultValue={currentUser.email} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] transition-all text-sm font-medium text-gray-800 dark:text-white" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest"><Trans>Kata Sandi Baru</Trans></label>
                <input type="password" placeholder="Kosongkan untuk mempertahankan yang sama" className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] transition-all text-sm font-medium text-gray-800 dark:text-white" />
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" className="px-8 py-3 bg-[#00172D] dark:bg-[#35ACDF] hover:bg-gray-900 dark:hover:bg-[#35ACDF]/80 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-lg transition-all cursor-pointer"><Trans>Simpan Kredensial</Trans></button>
            </div>
          </form>
        </div>

        {/* Preferensi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Instalasi PWA */}
          <div className="bg-white dark:bg-[#00172D] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden md:col-span-2">
            <div className="flex items-center gap-3 mb-6 relative z-10">
               <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/20 rounded-xl flex items-center justify-center text-[#35ACDF]">
                  <Download className="w-5 h-5 text-[#35ACDF]" />
               </div>
               <div>
                 <h2 className="text-lg font-black text-[#00172D] dark:text-white"><Trans>Instalasi Aplikasi</Trans></h2>
                 <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest"><Trans>Pasang aplikasi ini di perangkat Anda</Trans></p>
               </div>
            </div>
            <div className="space-y-4 relative z-10">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Aplikasi ini mendukung Progressive Web App (PWA). Anda dapat menginstalnya di perangkat (desktop atau mobile) untuk akses lebih cepat, tanpa perlu membuka browser.
              </p>
              <button 
                onClick={handleInstallClick}
                className="px-8 py-3 bg-[#35ACDF] hover:bg-[#35ACDF]/80 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-white" /><Trans>Install Aplikasi Sekarang</Trans></button>
            </div>
          </div>

          {/* Bahasa */}
          <div className="bg-white dark:bg-[#00172D] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-50 dark:bg-[#35ACDF]/5 rounded-full blur-2xl opacity-50"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
               <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/20 rounded-xl flex items-center justify-center text-[#35ACDF]">
                  <Globe className="w-5 h-5 text-[#35ACDF]" />
               </div>
               <div>
                 <h2 className="text-lg font-black text-[#00172D] dark:text-white"><Trans>Bahasa</Trans></h2>
                 <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest"><Trans>Pilih bahasa UI</Trans></p>
               </div>
            </div>
            <div className="space-y-3 relative z-10">
              {languages.map((lang) => (
                <label key={lang.code} className={`relative flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-colors ${language === lang.code ? 'border-orange-200 dark:border-[#35ACDF]/50 bg-orange-50/10 dark:bg-[#35ACDF]/10' : 'border-gray-200 dark:border-slate-800'}`}>
                  <span className={`font-bold text-sm tracking-widest uppercase ${language === lang.code ? 'text-[#00172D] dark:text-[#35ACDF]' : 'text-gray-500 dark:text-gray-400'}`}>{lang.label}</span>
                  <input type="radio" name="lang" value={lang.code} checked={language === lang.code} onChange={() => setLanguage(lang.code as any)} className="w-4 h-4 text-[#35ACDF] border-gray-300 pointer-events-none" />
                </label>
              ))}
              <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mt-2"><Trans>*Tergulir & selaras otomatis di semua halaman</Trans></p>
            </div>
          </div>

          {/* Tema */}
          <div className="bg-white dark:bg-[#00172D] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-50 dark:bg-[#35ACDF]/5 rounded-full blur-2xl opacity-50"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
               <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/20 rounded-xl flex items-center justify-center text-[#35ACDF]">
                  {theme === "dark" ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-[#35ACDF]" />}
               </div>
               <div>
                 <h2 className="text-lg font-black text-[#00172D] dark:text-white"><Trans>Tema Tampilan</Trans></h2>
                 <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest"><Trans>Mode Terang / Gelap</Trans></p>
               </div>
            </div>
            <div className="space-y-3 relative z-10">
              <button
                type="button"
                onClick={() => handleThemeChange("light")}
                className={`relative flex items-center justify-between p-4 border w-full text-left rounded-2xl cursor-pointer transition-all ${theme === "light" ? "border-[#35ACDF] bg-[#f0f9ff]/30 dark:bg-[#35ACDF]/5" : "border-gray-200 dark:border-slate-800"}`}
              >
                <span className={`font-bold text-sm tracking-widest uppercase ${theme === "light" ? "text-[#35ACDF]" : "text-gray-500 dark:text-gray-400"}`}><Trans>Mode Terang</Trans></span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${theme === "light" ? "border-[#35ACDF]" : "border-gray-300"}`}>
                  {theme === "light" && <div className="w-2.5 h-2.5 rounded-full bg-[#35ACDF]" />}
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => handleThemeChange("dark")}
                className={`relative flex items-center justify-between p-4 border w-full text-left rounded-2xl cursor-pointer transition-all ${theme === "dark" ? "border-[#35ACDF] bg-[#f0f9ff]/30 dark:bg-[#35ACDF]/5" : "border-gray-200 dark:border-slate-800"}`}
              >
                <span className={`font-bold text-sm tracking-widest uppercase ${theme === "dark" ? "text-amber-500 dark:text-[#35ACDF]" : "text-gray-500 dark:text-gray-400"}`}><Trans>Mode Gelap</Trans></span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${theme === "dark" ? "border-amber-500 dark:border-[#35ACDF]" : "border-gray-300"}`}>
                  {theme === "dark" && <div className="w-2.5 h-2.5 rounded-full bg-amber-500 dark:bg-[#35ACDF]" />}
                </div>
              </button>
              <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mt-2"><Trans>*Tergulir & selaras otomatis di seluruh halaman</Trans></p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
