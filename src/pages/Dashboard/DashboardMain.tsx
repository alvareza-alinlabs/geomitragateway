import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "motion/react";
import { Users, Target, Calendar as CalendarIcon, Activity, Coins, Package, ArrowRight, MapPin, Receipt, Clock, Filter, ChevronDown } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import L from "leaflet";
import { getCurrentUser } from "../../lib/auth";
import { HeaderConfig } from "../../layouts/DashboardLayout";
import AnimatedCounter from "../../components/AnimatedCounter";
import { Trans } from "../../lib/LanguageContext";

const createPinIcon = (colorOrUrl: string) => {
  // Cek apakah string merupakan URL atau path gambar (seperti .png, .jpg, dll)
  const isImage = colorOrUrl.match(/\.(jpeg|jpg|gif|png|webp|svg|ico)$/i) || colorOrUrl.includes("/");

  if (isImage) {
    return L.icon({
      iconUrl: colorOrUrl,
      iconSize: [32, 32], // Anda bisa menyesuaikan ukuran gambar
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  }

  return L.divIcon({
    className: "custom-pin-icon bg-transparent border-none",
    html: `
      <div style="display: flex; justify-content: center; align-items: flex-end; width: 32px; height: 32px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="${colorOrUrl}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.3));">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3" fill="white" stroke="none"></circle>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// CONTOH: Jika Anda ingin menggunakan gambar, cukup ubah stringnya:
// const salesIcon = createPinIcon("/gambar/icon-sales.png");
const salesIcon = createPinIcon("#35ACDF");
const distIcon = createPinIcon("#f97316");
const partnerIcon = createPinIcon("#10b981");
const calonMitraIcon = createPinIcon("#3b82f6");

function MapInteractionController({ isInteractive, boundsType, clients }: { isInteractive: boolean, boundsType: "Jakarta" | "Semua", clients: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (isInteractive) {
      map.scrollWheelZoom.enable();
      map.dragging.enable();
    } else {
      map.scrollWheelZoom.disable();
      map.dragging.disable();
    }
  }, [isInteractive, map]);

  useEffect(() => {
     if (boundsType === "Jakarta") {
        const bounds = L.latLngBounds([[-6.3956, 106.685], [-6.0829, 106.973]]);
        map.fitBounds(bounds, { padding: [50, 50] });
     } else {
        if (clients.length > 0) {
           const latLngs: [number, number][] = [];
           for (const c of clients) {
             const lat = Number(c.garis_lintang);
             const lng = Number(c.garis_bujur);
             if (Number.isFinite(lat) && Number.isFinite(lng)) {
               latLngs.push([lat, lng]);
             }
           }
           if (latLngs.length > 0) {
             try {
               map.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50] });
             } catch(e) {
               console.error("Leaflet fitBounds error:", e);
             }
           }
        }
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundsType, clients.length, map]);
  return null;
}

export default function DashboardMain() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const { setHeaderConfig } = useOutletContext<{ setHeaderConfig: (config: HeaderConfig) => void }>();
  
  const [greeting, setGreeting] = useState("");
  const [locationName, setLocationName] = useState("");
  const [summaryTab, setSummaryTab] = useState<'bulan' | 'tahun'>('bulan');
  const [viewMonth, setViewMonth] = useState(() => {
    const saved = localStorage.getItem("dashboard_view_month");
    return saved ? Number(saved) : new Date().getMonth() + 1;
  });
  const [viewYear, setViewYear] = useState(() => {
    const saved = localStorage.getItem("dashboard_view_year");
    return saved ? Number(saved) : new Date().getFullYear();
  });

  useEffect(() => {
    localStorage.setItem("dashboard_view_month", viewMonth.toString());
    localStorage.setItem("dashboard_view_year", viewYear.toString());
  }, [viewMonth, viewYear]);
  const [isMapInteractive, setIsMapInteractive] = useState(false);
  const [focusArea, setFocusArea] = useState<"Jakarta" | "Semua">("Jakarta");
  const [typeFilters, setTypeFilters] = useState({
    Distributor: true,
    Partner: true,
    CalonMitra: true
  });
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  const [isMonthSelectOpen, setIsMonthSelectOpen] = useState(false);
  const [isYearSelectOpen, setIsYearSelectOpen] = useState(false);
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);
  const monthSelectRef = useRef<HTMLDivElement>(null);
  const yearSelectRef = useRef<HTMLDivElement>(null);
  const typeSelectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
      if (monthSelectRef.current && !monthSelectRef.current.contains(event.target as Node)) {
        setIsMonthSelectOpen(false);
      }
      if (yearSelectRef.current && !yearSelectRef.current.contains(event.target as Node)) {
        setIsYearSelectOpen(false);
      }
      if (typeSelectRef.current && !typeSelectRef.current.contains(event.target as Node)) {
        setIsTypeSelectOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);
  const [stats, setStats] = useState({
    partners: 0,
    targetThisMonth: 0,
    achievedThisMonth: 0,
    targetThisYear: 0,
    achievedThisYear: 0,
    schedules: 0,
    revenue: 0,
    unitsSold: 0
  });
  const [initialTargets, setInitialTargets] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState<any[]>([]);
  const [productsMap, setProductsMap] = useState<Record<string, any>>({});
  const [partnersMap, setPartnersMap] = useState<Record<string, any>>({});

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 10) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            if (!res.ok) throw new Error("Nominatim error");
            const data = await res.json();
            if (data && data.address) {
              const addr = data.address;
              const city = addr.city || addr.town || addr.county || addr.city_district || addr.municipality || "";
              const detail = addr.suburb || addr.village || addr.neighbourhood || addr.hamlet || addr.road || "";
              
              if (city && detail && city.toLowerCase() !== detail.toLowerCase()) {
                setLocationName(`${city}, ${detail}`);
              } else if (city || detail) {
                setLocationName(city || detail);
              } else {
                setLocationName("Purwakarta, Nageri Kidul");
              }
            }
          } catch (e) {
            try {
              const { latitude, longitude } = position.coords;
              const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`);
              const data = await res.json();
              if (data) {
                const city = data.city || data.principalSubdivision || "";
                const detail = data.locality || "";
                if (city && detail && city.toLowerCase() !== detail.toLowerCase()) {
                  setLocationName(`${city}, ${detail}`);
                } else if (city || detail) {
                  setLocationName(city || detail);
                } else {
                  setLocationName("Purwakarta, Nageri Kidul");
                }
              }
            } catch (err) {
              setLocationName("Purwakarta, Nageri Kidul");
            }
          }
        },
        (err) => {
          setLocationName("Purwakarta, Nageri Kidul");
        }
      );
    } else {
      setLocationName("Purwakarta, Nageri Kidul");
    }
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/data/sales.json"),
      fetch("/data/partners.json"),
      fetch("/data/products.json"),
      fetch("/data/schedules.json"),
      fetch("/data/transactions.json"),
      fetch("/data/targeting.json")
    ]).then(async ([salesRes, partnersRes, prodRes, schedRes, transRes, targetRes]) => {
      const sales = await salesRes.json();
      const partners = await partnersRes.json();
      const prod = await prodRes.json();
      const sched = await schedRes.json();
      const trans = await transRes.json();
      const jsonTargets = await targetRes.json();

      setInitialTargets(jsonTargets);

      const allClients = [...sales, ...partners].map((c: any) => {
          let tipe = c.tipe === "End User" ? "Partner" : c.tipe;
          const charCode = c.id.charCodeAt(c.id.length - 1) + c.id.length;
          let currentStatus = c.status_distributor || c.status_kemitraan || (["Mitra Aktif", "Calon Mitra"][charCode % 2]);
          if (currentStatus === "Calon Mitra") tipe = "Calon Mitra";
          return { ...c, tipe, status_kemitraan: undefined };
      });
      setClients(allClients);

      const pMap: Record<string, any> = {};
      prod.forEach((p: any) => { pMap[p.id] = p; });
      setProductsMap(pMap);

      const clientMap: Record<string, any> = {};
      allClients.forEach((c: any) => { clientMap[c.id] = c; });
      setPartnersMap(clientMap);

      const storedTargetsStr = localStorage.getItem("targets");
      let currentMonthTarget = 0;
      let currentYearTarget = 0;
      if (storedTargetsStr) {
        try {
          const targetsData = JSON.parse(storedTargetsStr);
          const currentYear = new Date().getFullYear();
          const currentMonth = new Date().getMonth() + 1;
          
          const foundMonth = targetsData.find((t: any) => t.tahun === currentYear && t.bulan === currentMonth);
          if (foundMonth) {
            currentMonthTarget = foundMonth.nilai_sasaran;
          }
          
          currentYearTarget = targetsData
            .filter((t: any) => t.tahun === currentYear)
            .reduce((acc: number, t: any) => acc + (t.nilai_sasaran || 0), 0);
        } catch (e) {}
      }

      const completedTrans = trans.filter((t: any) => t.status !== "Dibatalkan");
      setAllTransactions(completedTrans);
      
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      
      const currentMonthTrans = completedTrans.filter((t: any) => {
         const tg = new Date(t.tanggal);
         return tg.getFullYear() === currentYear && (tg.getMonth() + 1) === currentMonth;
      });
      const currentYearTrans = completedTrans.filter((t: any) => {
         const tg = new Date(t.tanggal);
         return tg.getFullYear() === currentYear;
      });

      const totalAchievedThisMonth = currentMonthTrans.reduce((acc: number, curr: any) => acc + (Number(curr.total_harga) || 0), 0);
      const totalAchievedThisYear = currentYearTrans.reduce((acc: number, curr: any) => acc + (Number(curr.total_harga) || 0), 0);

      const totalRevenue = completedTrans.reduce((acc: number, curr: any) => acc + (Number(curr.total_harga) || 0), 0);
      const totalUnits = completedTrans.reduce((acc: number, curr: any) => {
          const barang = curr.barang && curr.barang.length > 0 ? curr.barang : (curr.id_produk ? [{ jumlah_unit: curr.jumlah_unit || 1 }] : []);
          return acc + barang.reduce((sum: number, item: any) => sum + (Number(item.jumlah_unit) || 1), 0);
      }, 0);

      setStats({
        partners: allClients.length,
        targetThisMonth: currentMonthTarget,
        achievedThisMonth: totalAchievedThisMonth,
        targetThisYear: currentYearTarget,
        achievedThisYear: totalAchievedThisYear,
        schedules: sched.length,
        revenue: totalRevenue,
        unitsSold: totalUnits
      });

      // Sort recent transactions by date descending
      setRecentTransactions(trans.sort((a: any, b: any) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()).slice(0, 5));
      // Upcoming schedules
      setUpcomingSchedules(sched.sort((a: any, b: any) => new Date(a.waktu).getTime() - new Date(b.waktu).getTime()).slice(0, 3));
    });
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);
  };

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
       if (client.tipe === "Sales" || client.tipe === "Broker") return false;
       if (client.tipe === "Partner" && !typeFilters.Partner) return false;
       if (client.tipe === "Calon Mitra" && !typeFilters.CalonMitra) return false;
       if (client.tipe === "Distributor" && !typeFilters.Distributor) return false;
       return true;
    });
  }, [clients, typeFilters]);

  useEffect(() => {
    setHeaderConfig({
       title: <Trans>Geo Mitra Gateway</Trans>,
       subjudul: <Trans>Ringkasan Sistem Internal</Trans>
    });
  }, [setHeaderConfig]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 md:space-y-6 pb-4"
    >
      {/* GREETING SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#00172D] dark:text-white tracking-tight"><Trans>{greeting || "Selamat Datang"}</Trans>, {user.nama}</h2>
          {locationName && (
            <div className="flex items-center gap-1 mt-1 text-[11px] md:text-xs text-gray-600 dark:text-gray-300 font-medium select-none">
              <MapPin className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              <span>{locationName}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          {summaryTab === 'bulan' ? (
            <>
              {/* Custom Month/Year Selectors */}
              <div className="flex-1 md:flex-initial flex items-center justify-between bg-gray-50/80 dark:bg-slate-900/60 backdrop-blur-sm p-0.5 rounded-lg border border-gray-400 dark:border-slate-600 shrink-0 select-none h-[32px]">
                {/* Month Dropdown */}
                <div className="relative flex-1 md:flex-initial flex justify-center h-full" ref={monthSelectRef}>
                  <button 
                    type="button"
                    onClick={() => { setIsMonthSelectOpen(!isMonthSelectOpen); setIsYearSelectOpen(false); }}
                    className="flex items-center justify-center gap-1 w-full md:w-auto px-2 md:px-3.5 h-full rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all text-[#35ACDF] hover:bg-white/50 dark:hover:bg-white/5 cursor-pointer"
                  >
                    <span>{["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][viewMonth-1]}</span>
                    <ChevronDown className="w-2.5 h-2.5 text-[#35ACDF]" />
                  </button>
                  {isMonthSelectOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 top-full mt-2 max-h-48 overflow-y-auto w-28 bg-white/95 dark:bg-[#00172D]/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100/80 dark:border-slate-700 p-1 z-[9999] flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                      {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"].map((n, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => { setViewMonth(i + 1); setIsMonthSelectOpen(false); }}
                          className={`px-3 py-1.5 text-left text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest rounded-lg cursor-pointer w-full transition-all ${viewMonth === i + 1 ? 'bg-[#35ACDF] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-px h-3 bg-gray-200 dark:bg-white/10" />

                {/* Year Dropdown */}
                <div className="relative flex-1 md:flex-initial flex justify-center h-full" ref={yearSelectRef}>
                  <button 
                    type="button"
                    onClick={() => { setIsYearSelectOpen(!isYearSelectOpen); setIsMonthSelectOpen(false); }}
                    className="flex items-center justify-center gap-1 w-full md:w-auto px-2 md:px-3.5 h-full rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all text-gray-800 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5 cursor-pointer"
                  >
                    <span>{viewYear}</span>
                    <ChevronDown className="w-2.5 h-2.5 text-gray-400 dark:text-gray-500" />
                  </button>
                  {isYearSelectOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 md:-translate-x-0 md:right-0 md:left-auto top-full mt-2 max-h-48 overflow-y-auto w-28 bg-white/95 dark:bg-[#00172D]/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100/80 dark:border-slate-700 p-1 z-[9999] flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                      {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => { setViewYear(y); setIsYearSelectOpen(false); }}
                          className={`px-3 py-1.5 text-left text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest rounded-lg cursor-pointer w-full transition-all ${viewYear === y ? 'bg-[#35ACDF] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'}`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tabs Container */}
              <div className="flex-1 md:flex-initial flex bg-gray-50/80 dark:bg-slate-900/60 backdrop-blur-sm p-0.5 rounded-lg border border-gray-400 dark:border-slate-600 shrink-0 h-[32px]">
                <button 
                  onClick={() => setSummaryTab('bulan')}
                  className={`flex-1 md:flex-initial px-3.5 py-1 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-widest text-center transition-all cursor-pointer flex items-center justify-center ${summaryTab === 'bulan' ? 'bg-[#35ACDF] text-white shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                >
                  <Trans>Bulan</Trans>
                </button>
                <button 
                  onClick={() => setSummaryTab('tahun')}
                  className={`flex-1 md:flex-initial px-3.5 py-1 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-widest text-center transition-all cursor-pointer flex items-center justify-center ${summaryTab === 'tahun' ? 'bg-[#35ACDF] text-white shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                >
                  <Trans>Tahun</Trans>
                </button>
              </div>
            </>
          ) : (
            <div className="w-full md:w-auto flex bg-gray-50/80 dark:bg-slate-900/60 backdrop-blur-sm p-0.5 rounded-lg border border-gray-400 dark:border-slate-600 shrink-0 h-[32px] flex-1 md:flex-initial">
              <button 
                onClick={() => setSummaryTab('bulan')}
                className={`flex-1 md:flex-initial px-6 py-1 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-widest text-center transition-all cursor-pointer flex items-center justify-center ${summaryTab === 'bulan' ? 'bg-[#35ACDF] text-white shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <Trans>Bulan</Trans>
              </button>
              <button 
                onClick={() => setSummaryTab('tahun')}
                className={`flex-1 md:flex-initial px-6 py-1 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-widest text-center transition-all cursor-pointer flex items-center justify-center ${summaryTab === 'tahun' ? 'bg-[#35ACDF] text-white shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <Trans>Tahun</Trans>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SUMMARY GRID */}
      {(() => {
        const isMonth = summaryTab === 'bulan';
        
        // Merge targets: initial (json) + local
        const storedTargetsStr = localStorage.getItem("targets");
        let mergedTargets = [...initialTargets];
        if (storedTargetsStr) {
           try {
             const localTargets = JSON.parse(storedTargetsStr);
             localTargets.forEach((lt: any) => {
               const idx = mergedTargets.findIndex(ct => ct.id === lt.id);
               if (idx !== -1) mergedTargets[idx] = lt;
               else mergedTargets.push(lt);
             });
           } catch(e) {}
        }

        let revenue = 0;
        let target = 0;
        let periodLabel = "";

        if (isMonth) {
           periodLabel = `${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][viewMonth-1]} ${viewYear}`;
           
           const found = mergedTargets.find((t: any) => t.tahun === viewYear && t.bulan === viewMonth);
           if (found) target = found.nilai_sasaran;
           
           revenue = allTransactions
             .filter((t: any) => {
               const tg = new Date(t.tanggal);
               return tg.getFullYear() === viewYear && (tg.getMonth() + 1) === viewMonth;
             })
             .reduce((acc: number, curr: any) => acc + (Number(curr.total_harga) || 0), 0);
        } else {
           // Check for rolling month from TargetingPage
           const savedMonth = localStorage.getItem("targeting_selected_month");
           const savedYear = localStorage.getItem("targeting_selected_year");
           
           const startM = savedMonth ? Number(savedMonth) : 1;
           const startY = savedYear ? Number(savedYear) : new Date().getFullYear();
           
           // Calculate 12-month rolling range
           let cumulativeTarget = 0;
           let cumulativeRevenue = 0;
           
           let curM = startM;
           let curY = startY;

           for (let i = 0; i < 12; i++) {
              const mt = mergedTargets.find(t => t.tahun === curY && t.bulan === curM);
              if (mt) cumulativeTarget += mt.nilai_sasaran;

              cumulativeRevenue += allTransactions
                .filter((t: any) => {
                  const tg = new Date(t.tanggal);
                  return tg.getFullYear() === curY && (tg.getMonth() + 1) === curM;
                })
                .reduce((acc: number, curr: any) => acc + (Number(curr.total_harga) || 0), 0);

              curM++;
              if (curM > 12) { curM = 1; curY++; }
           }

           target = cumulativeTarget;
           revenue = cumulativeRevenue;
           
           const endPeriodM = curM === 1 ? 12 : curM - 1;
           const endPeriodY = curM === 1 ? curY - 1 : curY;
           periodLabel = `${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][startM-1]} ${startY} - ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][endPeriodM-1]} ${endPeriodY}`;
        }

        const percent = target > 0 ? (revenue / target) * 100 : 0;
        const cappedPercent = Math.min(100, Math.max(0, percent));
        
        // Circle config
        const circleRadius = 45;
        const circleCircumference = 2 * Math.PI * circleRadius;
        const strokeDashoffset = circleCircumference - (cappedPercent / 100) * circleCircumference;

        return (
          <motion.div 
            key={summaryTab + viewMonth + viewYear}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Metric 1 */}
            <div className="bg-white dark:bg-[#00172D] p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[150px]">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/20 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-900/30 shrink-0">
                   <Coins className="w-5 h-5 text-[#35ACDF]" />
                 </div>
                 <p className="text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-widest leading-tight"><Trans>Pendapatan Total</Trans><br/> 
                   <span className="text-[#35ACDF]">
                     {periodLabel}
                   </span>
                 </p>
              </div>
              <div className="w-full mt-2 flex items-center h-10 lg:h-12 overflow-hidden">
                <p 
                  className="font-black text-[#00172D] dark:text-white text-xl md:text-2xl lg:text-3xl truncate tracking-tight"
                  title={formatCurrency(revenue)}
                >
                  <AnimatedCounter target={revenue} format={formatCurrency} />
                </p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white dark:bg-[#00172D] p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[150px]">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/20 rounded-2xl flex items-center justify-center border border-orange-100 dark:border-orange-900/30 shrink-0">
                   <Target className="w-5 h-5 text-orange-500" />
                 </div>
                 <p className="text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-widest leading-tight"><Trans>Target Penjualan</Trans><br/> 
                   <span className="text-orange-500">
                     {periodLabel}
                   </span>
                 </p>
              </div>
              <div className="w-full mt-2 flex items-center h-10 lg:h-12 overflow-hidden">
                <p 
                  className="font-black text-[#00172D] dark:text-white text-xl md:text-2xl lg:text-3xl truncate tracking-tight"
                  title={formatCurrency(target)}
                >
                  <AnimatedCounter target={target} format={formatCurrency} />
                </p>
              </div>
            </div>

            {/* Metric 3 (Circle Chart) */}
            <div className="bg-white dark:bg-[#00172D] p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[150px] relative overflow-hidden group">
               <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-widest"><Trans>Pencapaian Target</Trans></p>
                  <div className={`p-1 rounded bg-gray-50 dark:bg-white/5 text-[10px] font-bold text-gray-400 group-hover:text-[#35ACDF] transition-colors`}>
                     <AnimatedCounter target={Number.isNaN(percent) ? 0 : Math.round(percent)} suffix="%" />
                  </div>
               </div>
               <div className="flex items-center gap-4 mt-1">
                 <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
                   <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                     <circle
                       cx="50"
                       cy="50"
                       r={circleRadius}
                       stroke="currentColor"
                       strokeWidth="10"
                       fill="transparent"
                       className="text-gray-50 dark:text-slate-800"
                     />
                     <circle
                       cx="50"
                       cy="50"
                       r={circleRadius}
                       stroke="currentColor"
                       strokeWidth="10"
                       fill="transparent"
                       strokeDasharray={circleCircumference}
                       strokeDashoffset={strokeDashoffset}
                       className="text-[#35ACDF] transition-all duration-1000 ease-out"
                       strokeLinecap="round"
                     />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-lg font-black text-[#00172D] dark:text-white leading-none">
                       <AnimatedCounter target={Number.isNaN(percent) ? 0 : Math.round(percent)} suffix="%" />
                     </span>
                   </div>
                 </div>
                 <div className="flex flex-col justify-center">
                    <p className="text-sm font-black text-gray-900 dark:text-slate-100 mb-0.5">
                      {revenue >= target && target > 0 ? "Goal! 🎉" : "On Process"}
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-relaxed">
                      {revenue >= target && target > 0 ? "Lanjutkan performa terbaik Anda." : "Terus kejar target."}
                    </p>
                 </div>
               </div>
            </div>
          </motion.div>
        );
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Map */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between gap-1.5 md:gap-3 shrink-0 w-full select-none">
            <h2 className="text-xs sm:text-sm md:text-lg font-black text-[#00172D] dark:text-white shrink-0"><Trans>Peta Distribusi</Trans></h2>
            
            <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
              {/* Type Filter Dropdown Selector */}
              <div className="relative shrink-0" ref={typeSelectRef}>
                <button
                  type="button"
                  onClick={() => setIsTypeSelectOpen(!isTypeSelectOpen)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-400 dark:border-slate-600 bg-white dark:bg-[#001c38]/90 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#00172D] dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors h-[28px] md:h-[30px] shadow-sm cursor-pointer select-none"
                >
                  <span>
                    {(() => {
                      if (typeFilters.Distributor && typeFilters.Partner && typeFilters.CalonMitra) return "Semua";
                      if (typeFilters.Distributor) return "Distributor";
                      if (typeFilters.Partner) return "Partner";
                      if (typeFilters.CalonMitra) return "Calon";
                      return "Filter";
                    })()}
                  </span>
                  <ChevronDown className="w-2.5 h-2.5 text-gray-400 dark:text-gray-500" />
                </button>
                {isTypeSelectOpen && (
                  <div className="absolute right-0 top-full mt-1 w-28 md:w-32 bg-white dark:bg-[#00172D] rounded-xl shadow-xl border border-gray-400 dark:border-slate-600 p-1 z-[9999] flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                    {["Semua", "Distributor", "Partner", "Calon"].map((lbl) => {
                      const isActive = 
                        lbl === "Semua" ? (typeFilters.Distributor && typeFilters.Partner && typeFilters.CalonMitra) :
                        lbl === "Distributor" ? (typeFilters.Distributor && !typeFilters.Partner && !typeFilters.CalonMitra) :
                        lbl === "Partner" ? (!typeFilters.Distributor && typeFilters.Partner && !typeFilters.CalonMitra) :
                        (!typeFilters.Distributor && !typeFilters.Partner && typeFilters.CalonMitra);

                      const handleTypeClick = () => {
                        if (lbl === "Semua") {
                          setTypeFilters({ Distributor: true, Partner: true, CalonMitra: true });
                        } else if (lbl === "Distributor") {
                          setTypeFilters({ Distributor: true, Partner: false, CalonMitra: false });
                        } else if (lbl === "Partner") {
                          setTypeFilters({ Distributor: false, Partner: true, CalonMitra: false });
                        } else if (lbl === "Calon") {
                          setTypeFilters({ Distributor: false, Partner: false, CalonMitra: true });
                        }
                        setIsTypeSelectOpen(false);
                      };

                      return (
                        <button
                          key={lbl}
                          type="button"
                          onClick={handleTypeClick}
                          className={`px-2 py-1.5 text-left text-[8px] md:text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer w-full hover:bg-gray-50 dark:hover:bg-white/5 ${isActive ? "bg-[#00172D] dark:bg-[#35ACDF] text-white" : "text-gray-700 dark:text-gray-300"}`}
                        >
                          {lbl}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Area Filter Tabs */}
              <div className="flex bg-white dark:bg-[#001c38]/90 rounded-full border border-gray-400 dark:border-slate-600 p-0.5 shadow-sm shrink-0 h-[28px] md:h-[30px] items-center">
                <button 
                  onClick={() => setFocusArea("Semua")}
                  className={`px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-widest transition-colors cursor-pointer ${focusArea === "Semua" ? "bg-[#35ACDF] text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"}`}
                ><Trans>Semua</Trans></button>
                <button 
                  onClick={() => setFocusArea("Jakarta")}
                  className={`px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-widest transition-colors cursor-pointer ${focusArea === "Jakarta" ? "bg-[#35ACDF] text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"}`}
                ><Trans>Jakarta</Trans></button>
              </div>
            </div>
          </div>

          <div 
            className="w-full aspect-square md:aspect-[4/3] bg-gray-50 dark:bg-[#00172D]/40 rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-800 relative z-10"
            onMouseLeave={() => setIsMapInteractive(false)}
          >
            {!isMapInteractive && (
              <div 
                className="absolute inset-0 z-[500] cursor-pointer"
                onClick={() => setIsMapInteractive(true)}
              />
            )}
            <MapContainer 
              center={[-6.200000, 106.816666]} 
              zoom={11} 
              style={{ height: '100%', width: '100%', background: '#f8fafc' }}
              zoomControl={false}
              attributionControl={false}
              scrollWheelZoom={false}
              dragging={false}
            >
              <MapInteractionController isInteractive={isMapInteractive} boundsType={focusArea} clients={filteredClients} />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright"><Trans>OpenStreetMap</Trans></a> contributors'
              />
              {filteredClients.map(client => {
                const lat = Number(client.garis_lintang);
                const lng = Number(client.garis_bujur);
                if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
                
                return (
                <Marker 
                  key={client.id}
                  position={[lat, lng]}
                  icon={client.tipe === "Sales" ? salesIcon : client.tipe === "Distributor" ? distIcon : client.tipe === "Calon Mitra" ? calonMitraIcon : partnerIcon}
                >
                  <Popup className="custom-popup border-none rounded-2xl shadow-2xl p-0">
                    <div 
                      onClick={() => navigate(`/dashboard/client/${client.id}`)}
                      className="p-3 min-w-[180px] bg-[#00172D] hover:bg-gray-900 transition-colors cursor-pointer text-white rounded-2xl group"
                    >
                      <div className="flex items-center flex-wrap gap-1.5 mb-2">
                        <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded ${client.tipe === "Sales" ? "bg-blue-500/20 text-[#35ACDF]" : client.tipe === "Calon Mitra" ? "bg-blue-500/20 text-[#35ACDF]" : client.tipe === "Distributor" ? "bg-orange-500/20 text-[#35ACDF]" : "bg-emerald-500/20 text-emerald-400"}`}>
                          {client.tipe}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-xs group-hover:text-[#35ACDF] transition-colors">{client.perusahaan}</p>
                        <svg className="w-4 h-4 text-gray-500 group-hover:text-[#35ACDF] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </div>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">{client.kota}, {client.provinsi}</p>
                    </div>
                  </Popup>
                </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
        
        {/* Right Side Panels */}
        <div className="bg-white dark:bg-[#00172D] rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h2 className="text-xs md:text-sm font-black text-[#00172D] dark:text-white uppercase tracking-widest"><Trans>Jadwal Mendatang</Trans></h2>
            <Link to="/dashboard/schedule" className="text-[9px] md:text-[10px] font-bold text-[#35ACDF] uppercase tracking-widest hover:underline"><Trans>Lihat Semua</Trans></Link>
          </div>
          <div className="space-y-3 md:space-y-4 overflow-y-auto pr-2 scrollbar-none flex-1">
            {upcomingSchedules.length > 0 ? upcomingSchedules.map((sched, idx) => {
              const dateObj = new Date(sched.waktu);
              return (
              <div key={idx} className="flex gap-3 md:gap-4 items-start pb-3 md:pb-4 border-b border-gray-50 dark:border-slate-600/5 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100/50 dark:border-slate-600/5 text-[#35ACDF] flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-black leading-none">{dateObj.getDate() || '-'}</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest mt-0.5">{dateObj.toLocaleString('id-ID', { month: 'short' }) || ''}</span>
                </div>
                <div>
                  <p className="text-[11px] md:text-xs font-bold text-[#00172D] dark:text-gray-100">{sched.perusahaan}</p>
                  <p className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 line-clamp-1">{sched.tujuan}</p>
                  <div className="flex items-center gap-1 mt-1 text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-400 dark:text-gray-500" /> {dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            )}) : (
              <p className="text-[11px] md:text-xs text-gray-400 dark:text-gray-500 font-medium"><Trans>Tidak ada jadwal.</Trans></p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Horizontal */}
      <div>
        <h2 className="text-xs md:text-sm font-black uppercase tracking-widest mb-4 text-gray-400 dark:text-gray-500 text-center md:text-left"><Trans>Aksi Cepat</Trans></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/?skip=true" className="flex items-center justify-between p-4 rounded-3xl bg-white dark:bg-[#00172D] hover:shadow-md transition-all border border-gray-200 dark:border-slate-800 text-[#00172D] dark:text-gray-100 group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/20 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-900/30 group-hover:scale-105 transition-transform">
                <Target className="w-4 h-4 text-[#35ACDF]" />
              </div>
              <span className="text-xs md:text-sm font-black text-[#00172D] dark:text-gray-200"><Trans>Lihat Landing Page Public</Trans></span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#35ACDF] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all cursor-pointer" />
          </Link>
          <Link to="/dashboard/transactions" className="flex items-center justify-between p-4 rounded-3xl bg-white dark:bg-[#00172D] hover:shadow-md transition-all border border-gray-200 dark:border-slate-800 text-[#00172D] dark:text-gray-100 group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-900/30 group-hover:scale-105 transition-transform">
                <Receipt className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-xs md:text-sm font-black text-[#00172D] dark:text-gray-200"><Trans>Catat Transaksi Baru</Trans></span>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all cursor-pointer" />
          </Link>
          <Link to="/dashboard/partners" className="flex items-center justify-between p-4 rounded-3xl bg-white dark:bg-[#00172D] hover:shadow-md transition-all border border-gray-200 dark:border-slate-800 text-[#00172D] dark:text-gray-100 group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/20 rounded-xl flex items-center justify-center border border-orange-100 dark:border-orange-900/30 group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4 text-orange-500" />
              </div>
              <span className="text-xs md:text-sm font-black text-[#00172D] dark:text-gray-200"><Trans>Daftarkan Mitra</Trans></span>
            </div>
            <ArrowRight className="w-4 h-4 text-orange-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all cursor-pointer" />
          </Link>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white dark:bg-[#00172D] rounded-2xl md:rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50/50 dark:bg-slate-900/40">
          <div>
            <h2 className="text-base md:text-lg font-black text-[#00172D] dark:text-white"><Trans>Transaksi Terbaru</Trans></h2>
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5 md:mt-1"><Trans>Aktivitas Penjualan Partner</Trans></p>
          </div>
          <Link to="/dashboard/transactions" className="text-[10px] md:text-xs font-bold text-[#35ACDF] hover:underline flex items-center gap-1"><Trans>Lihat Lengkap</Trans><ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap min-w-[600px]">
            <thead>
              <tr className="bg-white dark:bg-[#00172D] border-b border-gray-200 dark:border-slate-800">
              <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500"><Trans>ID / Tanggal</Trans></th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500"><Trans>Pembeli</Trans></th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500"><Trans>Produk</Trans></th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 text-right"><Trans>Nilai Total</Trans></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {recentTransactions.map(trx => {
                const partner = partnersMap[trx.id_mitra];
                
                let productNames = "-";
                let qtyTotal = 0;
                
                const txItems = trx.barang && trx.barang.length > 0 ? trx.barang : (trx.id_produk ? [{ id_produk: trx.id_produk, jumlah_unit: trx.jumlah_unit || 1 }] : []);
                qtyTotal = txItems.reduce((acc: number, item: any) => acc + (Number(item.jumlah_unit) || 1), 0);
                
                if (txItems.length === 1) {
                    const product = productsMap[txItems[0].id_produk];
                    productNames = product ? product.nama : "-";
                } else if (txItems.length > 1) {
                    productNames = `${txItems.length} Produk Berbeda`;
                }

                return (
                  <tr key={trx.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <div className="font-mono text-[10px] md:text-xs font-bold text-[#35ACDF]">{trx.id}</div>
                      <div className="text-[9px] md:text-[10px] font-semibold text-gray-500 dark:text-gray-400 mt-0.5">{trx.tanggal}</div>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <div className="font-bold text-[#00172D] dark:text-gray-100 text-xs md:text-sm">{partner ? partner.perusahaan : "-"}</div>
                      <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-0.5">{partner ? partner.tipe : ""}</div>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <div className="font-bold text-gray-800 dark:text-gray-200 text-xs md:text-sm">{productNames}</div>
                      <div className="text-[9px] md:text-[10px] font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                        <AnimatedCounter target={qtyTotal} suffix=" Unit" />
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                      <div className="font-black text-[#00172D] dark:text-white text-xs md:text-sm">
                        <AnimatedCounter target={trx.total_harga} format={formatCurrency} />
                      </div>
                      <div className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest inline-block mt-0.5 md:mt-1 px-2 py-0.5 rounded ${trx.status === "Selesai" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" : trx.status === "Proses" ? "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400" : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"}`}>
                        {trx.status}
                      </div>
                    </td>
                  </tr>
                )}
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
