import { useState, useRef, useEffect, ReactNode } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { getCurrentUser } from "../lib/auth";
import { LayoutDashboard, Users, Receipt, Package, Settings } from "lucide-react";
import WelcomePopup from "../components/WelcomePopup";
import { Trans, useTranslation } from "../lib/LanguageContext";

export interface HeaderConfig {
  title?: ReactNode;
  subjudul?: ReactNode;
  searchBar?: ReactNode;
  actions?: ReactNode;
  showBack?: boolean;
  hideMobileActionsWrap?: boolean;
}

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>({});
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const user = getCurrentUser();
  const isMainUser = user.id === 1;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (headerConfig.title) {
      if (typeof headerConfig.title === 'string') {
        document.title = `${headerConfig.title} - Geo Mitra Gateway`;
      } else {
        // Fallback for ReactNode titles 
        document.title = 'Sistem Internal - Geo Mitra Gateway';
      }
    }
  }, [headerConfig.title]);

  const navItems = [
    { label: "Ringkasan", path: "/dashboard", exact: true, icon: LayoutDashboard },
    { label: "Partner", path: "/dashboard/partners", exact: false, icon: Users },
    { label: "Transaksi", path: "/dashboard/transactions", exact: false, icon: Receipt },
    { label: "Produk", path: "/dashboard/products", exact: false, icon: Package },
    { label: "Pengaturan", path: "/dashboard/settings", exact: false, icon: Settings },
  ];

  const isActive = (itemPath: string, isExact: boolean) => {
    if (isExact) {
      return location.pathname === itemPath;
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] dark:bg-[#000A15] font-sans overflow-hidden transition-colors duration-300">
      <DashboardSidebar isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative z-10 overflow-hidden min-w-0">
        <DashboardHeader 
           onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
           title={headerConfig.title}
           subjudul={headerConfig.subjudul}
           actions={headerConfig.actions}
           showBack={headerConfig.showBack}
           hideMobileActionsWrap={headerConfig.hideMobileActionsWrap}
         />

        <div ref={scrollRef} className={`flex-1 overflow-y-auto overflow-x-hidden relative p-3 md:px-4 lg:px-5 lg:py-5 pt-3 md:pt-4 pb-8 ${isMainUser ? 'pb-24' : ''}`}>
           {/* Decorative Background Shapes */}
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#35ACDF]/5 rounded-full -mr-48 -mb-48 blur-3xl pointer-events-none"></div>
          <div className="absolute top-20 right-20 w-48 h-48 bg-blue-400/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <Outlet context={{ setHeaderConfig }} />
        </div>

        {/* Mobile Bottom Navigation (Only for Main Admin) */}
        {isMainUser && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#00172D] border-t border-gray-200 dark:border-slate-600/5 z-50 px-2 py-3 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
             {navItems.map((item) => {
               const active = isActive(item.path, item.exact);
               const Icon = item.icon;
               return (
                 <Link 
                    key={item.path} 
                    to={item.path} 
                    className={`flex flex-col items-center p-2 rounded-xl min-w-[64px] transition-colors ${active ? 'text-[#35ACDF]' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-350'}`}
                 >
                   <Icon className={`w-5 h-5 mb-1 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                   <span className={`text-[9px] uppercase tracking-wider ${active ? 'font-black' : 'font-bold'}`}><Trans>{item.label}</Trans></span>
                 </Link>
               );
             })}
          </div>
        )}
      </main>
      
      <WelcomePopup />
    </div>
  );
}
