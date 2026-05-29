import { Link, useLocation } from "react-router-dom";
import { Home, Package, PhoneIcon } from "lucide-react";
import { Trans } from "../../lib/LanguageContext";

export default function BottomNavigation() {
  const location = useLocation();
  const isAppointmentNow = location.pathname.includes('appointment=now') || window.location.href.includes('appointment=now');

  if (isAppointmentNow) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#000A15]/95 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe transition-colors duration-300">
      <div className="flex items-center justify-around px-2 py-2">
        <Link to="/" className={`flex flex-col items-center gap-1 p-2 transition-colors w-1/3 ${location.pathname === '/' ? 'text-[#35ACDF]' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}>
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5"><Trans>Beranda</Trans></span>
        </Link>
        <Link to="/katalog" className={`flex flex-col items-center gap-1 p-2 transition-colors w-1/3 ${location.pathname === '/katalog' ? 'text-[#35ACDF]' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}>
          <Package className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5"><Trans>Katalog</Trans></span>
        </Link>
        <Link to="/appointment" className={`flex flex-col items-center gap-1 p-2 transition-colors w-1/3 ${location.pathname === '/appointment' ? 'text-[#35ACDF]' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}>
          <PhoneIcon className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5"><Trans>Konsultasi</Trans></span>
        </Link>
      </div>
    </div>
  );
}
