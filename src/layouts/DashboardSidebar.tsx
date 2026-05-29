import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Map, Database, LogOut, Menu, PackageSearch, Calendar, X, LayoutDashboard, Settings, Receipt, Users, Shield, Target, Megaphone } from "lucide-react";
import { cn } from "../lib/utils";
import { getCurrentUser, hasAccess } from "../lib/auth";
import { Trans } from "../lib/LanguageContext";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";

interface DashboardSidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

export default function DashboardSidebar({ isMobileOpen, setIsMobileOpen }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  // State for current user hak_akses
  const [user, setUser] = useState(getCurrentUser());

  useLockBodyScroll(isMobileOpen);

  useEffect(() => {
    const handleStorage = () => setUser(getCurrentUser());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("currentUser");
    // force a simple reload to apply side effects just in case
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const navGroupsRaw = [
    {
      judul: "Navigasi",
      barang: [
        { nama: "Ringkasan", path: "/dashboard", icon: LayoutDashboard, exact: true, action: "ringkasan" as keyof typeof user.hak_akses },
      ]
    },
    {
      judul: "Partner & Sales",
      barang: [
        { nama: "Peta Distribusi", path: "/dashboard/map", icon: Map, action: "peta" as keyof typeof user.hak_akses },
        { nama: "Daftar Partner", path: "/dashboard/partners", icon: Database, action: "mitra" as keyof typeof user.hak_akses },
        { nama: "Daftar Sales", path: "/dashboard/sales", icon: Users, action: "penjualan" as keyof typeof user.hak_akses },
      ]
    },
    {
      judul: "Kinerja",
      barang: [
        { nama: "Transaksi", path: "/dashboard/transactions", icon: Receipt, action: "transaksi" as keyof typeof user.hak_akses },
        { nama: "Targeting", path: "/dashboard/targeting", icon: Target, action: "transaksi" as keyof typeof user.hak_akses },
        { nama: "Produk", path: "/dashboard/products", icon: PackageSearch, action: "produk" as keyof typeof user.hak_akses },
        { nama: "Jadwal", path: "/dashboard/schedule", icon: Calendar, action: "jadwal" as keyof typeof user.hak_akses },
        { nama: "Broadcast", path: "/dashboard/broadcast", icon: Megaphone, action: "transaksi" as keyof typeof user.hak_akses },
      ]
    },
    {
      judul: "Sistem",
      barang: [
        { nama: "Landing Page", path: "/dashboard/landing-config", icon: LayoutDashboard, action: "akses" as keyof typeof user.hak_akses },
        { nama: "Hak Akses", path: "/dashboard/access", icon: Shield, action: "akses" as keyof typeof user.hak_akses },
      ]
    }
  ];

  const navGroups = navGroupsRaw.map(group => ({
    ...group,
    barang: group.barang.filter(item => hasAccess(user.hak_akses[item.action]))
  })).filter(group => group.barang.length > 0);

  // Add the "Pengaturan" option manually to "Sistem" since it's accessible to everyone
  const finalNavGroups = navGroups.map(group => {
    if (group.judul === "Sistem") {
      return {
        ...group,
        barang: [...group.barang, { nama: "Pengaturan", path: "/dashboard/settings", icon: Settings }]
      };
    }
    return group;
  });

  // If "Sistem" was completely filtered out but we need to add Pengaturan, we should ensure it exists.
  if (!finalNavGroups.find(g => g.judul === "Sistem")) {
    finalNavGroups.push({
      judul: "Sistem",
      barang: [{ nama: "Pengaturan", path: "/dashboard/settings", icon: Settings }]
    });
  }

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        className={cn(
          "bg-white dark:bg-[#00172D] flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-gray-200 dark:border-slate-800 z-50 h-full transition-all duration-300",
          "fixed md:relative inset-y-0 left-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-8 bg-white dark:bg-[#001c38] border border-gray-200 dark:border-slate-600/10 text-gray-500 dark:text-gray-400 rounded-full p-1 shadow-sm hover:text-[#35ACDF] hover:border-[#35ACDF]/30 transition-colors z-30"
        >
          <Menu className="w-4 h-4" />
        </button>
        

      <div className="flex items-center gap-3 p-6 mb-2">
        <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
          <img src="/gambar/icon-dashboard-color.png" alt="Dashboard Logo" className="w-full h-full object-contain" />
        </div>
        {!isCollapsed && (
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-bold text-lg leading-tight tracking-tight whitespace-nowrap overflow-hidden"
          >
            <span className="text-[#35ACDF]">Geo Mitra</span><br/><span className="text-gray-900 dark:text-white">Gateway</span>
          </motion.h1>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 scrollbar-hide">
        <nav className="space-y-6">
          {finalNavGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-1">
              {!isCollapsed && (
                <h3 className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  <Trans>{group.judul}</Trans>
                </h3>
              )}
              {isCollapsed && <div className="h-4" />} {/* Spacer for collapsed state to separate groups visually */}
              
              <div className="space-y-1">
                {group.barang.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={(item as any).exact}
                    onClick={() => { if (isMobileOpen) setIsMobileOpen(false); }}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-all group relative",
                        isActive
                          ? "bg-[#f0f9ff] dark:bg-blue-950/40 text-[#35ACDF] font-semibold"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                      )
                    }
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0 transition-colors",
                        "group-[.active]:text-[#35ACDF]"
                      )}
                    />
                    {!isCollapsed && (
                      <span className="whitespace-nowrap overflow-hidden text-sm truncate relative z-10">
                        <Trans>{item.nama}</Trans>
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="w-full px-4 pb-6 mt-auto">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 hover:bg-red-100/80 dark:hover:bg-red-900/30 rounded-xl transition-colors font-semibold`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3 whitespace-nowrap overflow-hidden text-sm"><Trans>Keluar</Trans></span>}
        </button>
      </div>
    </motion.aside>
    </>
  );
}
