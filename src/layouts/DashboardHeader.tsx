import { UserCircle, Menu, ArrowLeft, MoreVertical, Search, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { getCurrentUser } from "../lib/auth";
import { useLocation, useNavigate } from "react-router-dom";

export interface DashboardHeaderProps {
  onMenuClick: () => void;
  title?: React.ReactNode;
  subjudul?: React.ReactNode;
  searchBar?: React.ReactNode;
  actions?: React.ReactNode;
  showBack?: boolean;
  hideMobileActionsWrap?: boolean;
}

export default function DashboardHeader({ onMenuClick, title, subjudul, searchBar, actions, showBack, hideMobileActionsWrap }: DashboardHeaderProps) {
  const user = getCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileActionsOpen, setIsMobileActionsOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  
  // Checking if the current route is a detail or add page as a fallback
  const isSubPage = showBack !== undefined ? showBack : location.pathname.split('/').length > 3;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setIsMobileActionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileSearchOpen(false);
    setIsMobileActionsOpen(false);
  }, [location.pathname, location.search]);

  return (
    <header className="h-20 bg-white/70 dark:bg-[#000A15]/75 backdrop-blur-md border-b border-gray-200 dark:border-slate-600/5 px-4 md:px-8 flex items-center justify-between z-[100] flex-shrink-0 relative">
      <div className={`flex items-center gap-3 md:gap-4 flex-1 min-w-0 ${isMobileSearchOpen ? 'hidden md:flex' : 'flex'}`}>
        {isSubPage ? (
          <button 
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors -ml-2 shrink-0"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        ) : (
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors -ml-2 shrink-0"
          >
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        )}
        <div className="min-w-0 truncate">
          {title ? (
            <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white tracking-tight leading-tight truncate">{title}</h2>
          ) : (
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white tracking-tight truncate">Sistem Internal <span className="text-[#35ACDF]">Partner</span></h2>
          )}
          
          {subjudul ? (
            <p className="text-[9px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate normal-case">{subjudul}</p>
          ) : (
            <p className="hidden md:block text-[9px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate normal-case">Jaringan Distribusi Perangkat Keras HP Inc & Poly</p>
          )}
        </div>
      </div>

      {searchBar && isMobileSearchOpen && (
        <div className="flex-1 flex items-center gap-2 md:hidden">
          <div className="flex-1">
             {searchBar}
          </div>
          <button 
            onClick={() => setIsMobileSearchOpen(false)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className={`flex items-center gap-2 md:gap-4 shrink-0 ${isMobileSearchOpen ? 'hidden md:flex' : 'flex'}`}>
        {/* Desktop View */}
        <div className="hidden md:flex items-center gap-2 md:gap-3">
          {searchBar}
          {actions}
        </div>

        {/* Mobile View */}
        <div className="flex md:hidden items-center gap-1">
           {searchBar && !isMobileSearchOpen && (
             <button 
               onClick={() => setIsMobileSearchOpen(true)}
               className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
             >
               <Search className="w-5 h-5" />
             </button>
           )}
           {actions && (
             hideMobileActionsWrap ? (
               <div className="flex items-center gap-1.5">
                 {actions}
               </div>
             ) : (
               <div className="relative" ref={actionsRef}>
                 <button 
                   onClick={() => setIsMobileActionsOpen(!isMobileActionsOpen)}
                   className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors relative z-50"
                 >
                   <MoreVertical className="w-5 h-5" />
                 </button>
                 {isMobileActionsOpen && (
                   <>
                     <div 
                       className="fixed inset-0 z-40 bg-transparent"
                       onClick={(e) => { e.stopPropagation(); setIsMobileActionsOpen(false); }}
                     />
                     <div className="absolute right-[-4px] top-[calc(100%+8px)] bg-white dark:bg-[#00172D] rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 p-2 min-w-[200px] z-[50] flex flex-col gap-1">
                       {Array.isArray(actions) ? actions.map((act: any, idx: number) => <div key={idx} onClick={() => setIsMobileActionsOpen(false)}>{act}</div>) : <div onClick={() => setIsMobileActionsOpen(false)}>{actions}</div>}
                     </div>
                   </>
                 )}
               </div>
             )
           )}
        </div>
      </div>
    </header>
  );
}
