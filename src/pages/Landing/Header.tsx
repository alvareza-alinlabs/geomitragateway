import { Link, useLocation, useNavigate } from "react-router-dom";
import { Server, ArrowLeft, Settings, Globe, Moon, Sun, LogIn } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLanguage, Trans } from "../../lib/LanguageContext";

function SettingsMenu({ isTransparent, iconClassName, isAppointmentNow }: { isTransparent: boolean, iconClassName: string, isAppointmentNow?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useLanguage();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsLangMenuOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    // Synchronize document class
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen to cross-instance theme changes (desktop and mobile top header sync)
  useEffect(() => {
    const handleThemeChange = (e: any) => {
      if (e.detail) {
        setTheme(e.detail);
      }
    };
    window.addEventListener("themeChanged", handleThemeChange);
    return () => {
      window.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    window.dispatchEvent(new CustomEvent("themeChanged", { detail: nextTheme }));
  };

  const selectLanguage = (lang: 'id' | 'en' | 'zh') => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
    setIsOpen(false);
  };

  const getLanguageLabel = (code: string) => {
    if (code === 'id') return 'Indonesia';
    if (code === 'en') return 'English';
    if (code === 'zh') return '中文 (Mandarin)';
    return code;
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => { setIsOpen(!isOpen); setIsLangMenuOpen(false); }}
        className={`flex items-center justify-center p-2 rounded-full transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
      >
        <Settings className={iconClassName} strokeWidth={1.5} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute top-full mt-2 right-0 md:right-0 w-64 bg-white dark:bg-[#00172D] rounded-2xl shadow-xl border border-gray-400 dark:border-slate-600 overflow-hidden text-[#00172D] dark:text-white z-[100] origin-top-right flex flex-col"
          >
            <div className="p-4 bg-gray-50 dark:bg-black/25 border-b border-gray-100 dark:border-slate-600/10 flex items-center gap-2">
              {isLangMenuOpen ? (
                <>
                  <button onClick={() => setIsLangMenuOpen(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg">
                    <ArrowLeft className="w-4 h-4 text-gray-500" />
                  </button>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-0.5"><Trans>Pilih Bahasa</Trans></h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500"><Trans>Pilihan Anda akan disimpan</Trans></p>
                  </div>
                </>
              ) : (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1"><Trans>Pengaturan</Trans></h3>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500"><Trans>Sesuaikan preferensi Anda</Trans></p>
                </div>
              )}
            </div>
            
            <div className="p-2 flex flex-col gap-1 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {isLangMenuOpen ? (
                  <motion.div
                    key="langMenu"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col gap-1 w-full"
                  >
                    {(['id', 'en', 'zh'] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button" 
                        onClick={() => selectLanguage(lang)} 
                        className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
                      >
                        <span className="text-sm font-medium">{getLanguageLabel(lang)}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${language === lang ? 'border-[#35ACDF] bg-[#35ACDF]/10' : 'border-gray-300 dark:border-gray-600'}`}>
                          {language === lang && <div className="w-2 h-2 rounded-full bg-[#35ACDF]"></div>}
                        </div>
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                     key="mainMenu"
                     initial={{ x: -20, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     exit={{ x: -20, opacity: 0 }}
                     transition={{ duration: 0.15 }}
                     className="flex flex-col gap-1 w-full"
                  >
                     <button type="button" onClick={() => setIsLangMenuOpen(true)} className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-[#00172D] dark:text-white">
                       <div className="flex items-center gap-3 text-sm font-medium">
                         <Globe className="w-4 h-4 text-gray-400 dark:text-gray-500" /> <Trans>Bahasa</Trans>
                       </div>
                       <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-white/10 dark:text-gray-300 px-2 py-1 rounded-md">{language.toUpperCase()}</span>
                     </button>
                     <button type="button" onClick={toggleTheme} className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-[#00172D] dark:text-white">
                       <div className="flex items-center gap-3 text-sm font-medium">
                         {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-gray-400 dark:text-gray-500" />}
                         <Trans>{theme === "dark" ? "Mode Terang" : "Mode Gelap"}</Trans>
                       </div>
                       <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === "dark" ? 'bg-[#35ACDF]' : 'bg-gray-200'}`}>
                         <div className={`w-3 h-3 bg-white rounded-full absolute top-[2px] shadow-sm transition-all ${theme === "dark" ? 'right-0.5' : 'left-0.5'}`}></div>
                       </div>
                     </button>
                     {!isAppointmentNow && (
                       <>
                         <div className="h-px bg-gray-100 dark:bg-white/10 my-1"></div>
                         <Link 
                           to="/login" 
                           className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-white/5 text-blue-600 dark:text-[#35ACDF] transition-colors text-sm font-medium"
                         >
                           <LogIn className="w-4 h-4" /> <Trans>Login Dashboard</Trans>
                         </Link>
                       </>
                     )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isKatalogDetail = location.pathname.startsWith('/katalog/') && location.pathname !== '/katalog';
  const isHomePage = location.pathname === '/';
  const isTransparent = isHomePage && !isScrolled;
  
  const isAppointmentNow = location.pathname.includes('appointment=now') || window.location.href.includes('appointment=now');
  
  const showBackButton = !isHomePage && !isAppointmentNow;
  const backPath = isKatalogDetail ? '/katalog' : '/';

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 hidden md:block ${isTransparent ? 'bg-transparent border-transparent' : 'bg-white dark:bg-[#000A15]/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
          <div className="flex items-center">
            {showBackButton ? (
              <button onClick={() => navigate(backPath)} className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left">
                <div className="flex items-center justify-center">
                  <ArrowLeft className={`w-6 h-6 ${isTransparent ? 'text-white' : 'text-[#00172D] dark:text-gray-200'}`} />
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden shadow-md flex-shrink-0 bg-white">
                  <img src="/gambar/poto-harry.png" alt="Harry Gultom Logo" className="w-full h-full object-cover" />
                </div>
                <div className="hidden lg:flex flex-col">
                  <span className={`font-black text-xl tracking-tight leading-none mb-1 ${isTransparent ? 'text-white' : 'text-[#00172D] dark:text-white'}`}>Harry <span className={isTransparent ? 'text-blue-300' : 'text-[#35ACDF]'}>Gultom</span></span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest leading-none ${isTransparent ? 'text-white/80' : 'text-gray-400 dark:text-gray-400'}`}>Geo Mitra Gateway</span>
                </div>
              </button>
            ) : (
              <Link to="/" className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full overflow-hidden shadow-md flex-shrink-0 bg-white">
                   <img src="/gambar/poto-harry.png" alt="Harry Gultom Logo" className="w-full h-full object-cover" />
                 </div>
                 <div className="hidden lg:flex flex-col">
                   <span className={`font-black text-xl tracking-tight leading-none mb-1 ${isTransparent ? 'text-white' : 'text-[#00172D] dark:text-white'}`}>Harry <span className={isTransparent ? 'text-blue-300' : 'text-[#35ACDF]'}>Gultom</span></span>
                   <span className={`text-[10px] font-bold uppercase tracking-widest leading-none ${isTransparent ? 'text-white/80' : 'text-gray-400 dark:text-gray-400'}`}>Geo Mitra Gateway</span>
                 </div>
              </Link>
            )}
          </div>

          {!isAppointmentNow && (
            <div className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-8 font-bold text-[11px] uppercase tracking-widest ${isTransparent ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
              <Link to="/" className={`transition-colors ${location.pathname === '/' ? (isTransparent ? 'text-white' : 'text-[#35ACDF]') : (isTransparent ? 'hover:text-white' : 'hover:text-[#35ACDF] dark:hover:text-white')}`}>
                <Trans>Beranda</Trans>
              </Link>
              <Link to="/katalog" className={`transition-colors ${location.pathname === '/katalog' ? (isTransparent ? 'text-white' : 'text-[#35ACDF]') : (isTransparent ? 'hover:text-white' : 'hover:text-[#35ACDF] dark:hover:text-white')}`}>
                <Trans>Katalog</Trans>
              </Link>
              <Link to="/appointment" className={`transition-colors ${location.pathname === '/appointment' ? (isTransparent ? 'text-white' : 'text-[#35ACDF]') : (isTransparent ? 'hover:text-white' : 'hover:text-[#35ACDF] dark:hover:text-white')}`}>
                <Trans>Konsultasi</Trans>
              </Link>
            </div>
          )}

          <SettingsMenu isTransparent={isTransparent} iconClassName="w-6 h-6" isAppointmentNow={isAppointmentNow} />
        </div>
      </nav>

      {/* Mobile Top Header */}
      <nav className={`md:hidden fixed top-0 w-full z-50 transition-all duration-300 ${isTransparent ? 'bg-transparent border-transparent' : 'bg-white dark:bg-[#000A15]/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 shadow-sm'}`}>
        <div className="px-6 h-16 flex items-center justify-between relative">
          {showBackButton ? (
             <button onClick={() => navigate(backPath)} className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left">
               <div className="flex items-center justify-center">
                 <ArrowLeft className={`w-5 h-5 ${isTransparent ? 'text-white' : 'text-[#00172D] dark:text-gray-200'}`} />
               </div>
               <div className="w-8 h-8 rounded-full overflow-hidden shadow-md flex-shrink-0 bg-white">
                 <img src="/gambar/poto-harry.png" alt="Harry Gultom Logo" className="w-full h-full object-cover" />
               </div>
               <div className="flex flex-col text-left">
                 <span className={`font-black text-lg tracking-tight leading-none mb-0.5 ${isTransparent ? 'text-white' : 'text-[#00172D] dark:text-white'}`}>Harry <span className={isTransparent ? 'text-blue-300' : 'text-[#35ACDF]'}>Gultom</span></span>
                 <span className={`text-[8px] font-bold uppercase tracking-widest leading-none ${isTransparent ? 'text-white/80' : 'text-gray-400 dark:text-gray-400'}`}>Geo Mitra Gateway</span>
               </div>
             </button>
          ) : (
            <Link 
              to="/" 
              className={`flex items-center gap-2 transition-opacity duration-300 ${isHomePage && !isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
               <div className="w-8 h-8 rounded-full overflow-hidden shadow-md flex-shrink-0 bg-white">
                 <img src="/gambar/poto-harry.png" alt="Harry Gultom Logo" className="w-full h-full object-cover" />
               </div>
               <div className="flex flex-col">
                 <span className={`font-black text-lg tracking-tight leading-none mb-0.5 ${isTransparent ? 'text-white' : 'text-[#00172D] dark:text-white'}`}>Harry <span className={isTransparent ? 'text-blue-300' : 'text-[#35ACDF]'}>Gultom</span></span>
                 <span className={`text-[8px] font-bold uppercase tracking-widest leading-none ${isTransparent ? 'text-white/80' : 'text-gray-400 dark:text-gray-400'}`}>Geo Mitra Gateway</span>
               </div>
            </Link>
          )}

          <SettingsMenu isTransparent={isTransparent} iconClassName="w-5 h-5" isAppointmentNow={isAppointmentNow} />
        </div>
      </nav>
    </>
  );
}

