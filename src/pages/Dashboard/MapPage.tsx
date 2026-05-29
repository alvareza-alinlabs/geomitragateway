import { Trans } from "../../lib/LanguageContext";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "motion/react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Users, Briefcase, Building2, ExternalLink, Target, TrendingUp, Percent, Map, Filter, ChevronDown, Calendar, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { ClientData } from "../../types";
import { useNavigate, useOutletContext } from "react-router-dom";

const INDONESIAN_MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// Fix standard marker icon issue in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/gambar/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/gambar/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/gambar/marker-shadow.png",
});

// Custom Icons
const createCustomIcon = (colorOrUrl: string) => {
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

  return new L.DivIcon({
    className: "custom-pin-icon bg-transparent border-none",
    html: `
      <div style="display: flex; justify-content: center; align-barang: flex-end; width: 32px; height: 32px;">
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
// const salesIcon = createCustomIcon("/gambar/icon-sales.png");
const salesIcon = createCustomIcon("#35ACDF"); // Blue
const distIcon = createCustomIcon("#f97316"); // Orange
const partnerIcon = createCustomIcon("#10b981"); // Emerald
const calonMitraIcon = createCustomIcon("#3b82f6"); // Blue

function MapInteractionController({ isInteractive, boundsType, clients }: { isInteractive: boolean, boundsType: "Jakarta" | "Semua", clients: ClientData[] }) {
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
             } catch (e) {
               console.error("Leaflet fitBounds error:", e);
             }
           }
        }
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundsType, clients.length, map]);
  return null;
}

export default function MapPage() {
  const [clients, setClients] = useState<(ClientData & { totalBelanja: number, belanjaTerakhir: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMapInteractive, setIsMapInteractive] = useState(false);
  const [focusArea, setFocusArea] = useState<"Jakarta" | "Semua">("Jakarta");
  const [typeFilters, setTypeFilters] = useState({
    Distributor: true,
    Partner: true,
    CalonMitra: true
  });
  const [filterBulan, setFilterBulan] = useState<string>("Semua");
  const [filterTahun, setFilterTahun] = useState<string>("Semua");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  const [activeDropdown, setActiveDropdown] = useState<"bulan" | "tahun" | "sort" | null>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const tRef = useRef<HTMLDivElement>(null);
  const sRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
      const target = event.target as Node;
      if (
        (!bRef.current || !bRef.current.contains(target)) &&
        (!tRef.current || !tRef.current.contains(target)) &&
        (!sRef.current || !sRef.current.contains(target))
      ) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);
  const [sortBy, setSortBy] = useState<"Terbanyak" | "Terbaru">("Terbanyak");
  const navigate = useNavigate();
  const markerRefs = useRef<{ [kunci_data: string]: L.Marker | null }>({});

  // States to keep raw data
  const [allClientsRaw, setAllClientsRaw] = useState<any[]>([]);
  const [allTransRaw, setAllTransRaw] = useState<any[]>([]);

  const availableYears = useMemo(() => {
     if (allTransRaw.length === 0) return [new Date().getFullYear()];
     const years = Array.from(new Set(allTransRaw.map(t => new Date(t.tanggal).getFullYear())));
     return years.sort((a,b) => (b as number) - (a as number));
  }, [allTransRaw]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, partnersRes, prodRes, transRes] = await Promise.all([
          fetch("/data/sales.json"),
          fetch("/data/partners.json"),
          fetch("/data/products.json"),
          fetch("/data/transactions.json")
        ]);
        const salesData = await salesRes.json();
        const partnersData = await partnersRes.json();
        const transData = await transRes.json();
        
        setAllTransRaw(transData);

        const allClients = [...salesData, ...partnersData].map((c: any) => {
          let tipe = c.tipe === "End User" ? "Partner" : c.tipe;
          const charCode = c.id.charCodeAt(c.id.length - 1) + c.id.length;
          let currentStatus = c.status_distributor || c.status_kemitraan || (["Mitra Aktif", "Calon Mitra"][charCode % 2]);
          if (currentStatus === "Calon Mitra") tipe = "Calon Mitra";
          
          return { ...c, tipe };
        });

        setAllClientsRaw(allClients);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
     const computedClients = allClientsRaw.map(c => {
          let clientTrans = allTransRaw.filter((t: any) => t.id_klien === c.id && t.status !== 'Dibatalkan');
          
          if (filterTahun !== "Semua") {
              clientTrans = clientTrans.filter((t: any) => new Date(t.tanggal).getFullYear().toString() === filterTahun);
          }
          if (filterBulan !== "Semua") {
              clientTrans = clientTrans.filter((t: any) => (new Date(t.tanggal).getMonth() + 1).toString() === filterBulan);
          }

          const totalBelanja = clientTrans.reduce((acc: number, t: any) => acc + (Number(t.total_harga) || 0), 0);
          const belanjaTerakhir = clientTrans.length > 0 ? Math.max(...clientTrans.map((t: any) => new Date(t.tanggal).getTime())) : 0;
          
          return { ...c, totalBelanja, belanjaTerakhir };
     });
     setClients(computedClients);
  }, [allClientsRaw, allTransRaw, filterBulan, filterTahun]);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
       if (client.tipe === "Sales" || client.tipe === "Broker") return false;
       if (client.tipe === "Partner" && !typeFilters.Partner) return false;
       if (client.tipe === "Calon Mitra" && !typeFilters.CalonMitra) return false;
       if (client.tipe === "Distributor" && !typeFilters.Distributor) return false;
       return true;
    });
  }, [clients, typeFilters]);

  const totalClients = filteredClients.length;
  const countDistributor = clients.filter(c => c.tipe === "Distributor").length;
  const countPartner = clients.filter(c => c.tipe === "Partner" || c.tipe === "End User").length;
  const countCalonMitra = clients.filter(c => c.tipe === "Calon Mitra").length;
  
  const sortedClientsList = [...filteredClients].sort((a, b) => {
     if (sortBy === "Terbanyak") {
        return b.totalBelanja - a.totalBelanja;
     } else {
        return b.belanjaTerakhir - a.belanjaTerakhir;
     }
  });

  const { setHeaderConfig } = useOutletContext<{ setHeaderConfig: (config: any) => void }>();
  
  useEffect(() => {
     setHeaderConfig({
        title: "Peta Distribusi",
        subjudul: "Pelacakan Jaringan & Titik Lokasi Binaan",
     });
  }, [setHeaderConfig]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Stats Cards - Matching Sleek HTML Theme */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#00172D] p-4 md:p-5 rounded-3xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col gap-2 relative overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
             <Users className="w-16 h-16 md:w-24 md:h-24 text-gray-100 dark:text-gray-500" />
          </div>
          <span className="text-[9px] md:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest relative z-10"><Trans>Total Jaringan</Trans></span>
          <span className="text-2xl md:text-3xl font-black text-[#00172D] dark:text-white relative z-10">{loading ? "..." : (countDistributor + countPartner + countCalonMitra)}</span>
          <div className="flex items-center text-blue-500 text-[8px] md:text-[10px] uppercase font-bold tracking-widest mt-auto relative z-10"><Trans>SEMUA WILAYAH</Trans></div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
          className="bg-white dark:bg-[#00172D] p-4 md:p-5 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <Building2 className="w-16 h-16 md:w-24 md:h-24 text-orange-500" />
          </div>
          <span className="text-[9px] md:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest relative z-10"><Trans>Distributor</Trans></span>
          <span className="text-2xl md:text-3xl font-black text-[#00172D] dark:text-white relative z-10">{loading ? "..." : countDistributor}</span>
          <span className="text-orange-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-auto relative z-10"><Trans>Mitra Level 1</Trans></span>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
          className="bg-white dark:bg-[#00172D] p-4 md:p-5 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden"
        >
           <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <Briefcase className="w-16 h-16 md:w-24 md:h-24 text-emerald-500" />
          </div>
          <span className="text-[9px] md:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest relative z-10"><Trans>Partner / Toko</Trans></span>
          <span className="text-2xl md:text-3xl font-black text-[#00172D] dark:text-white relative z-10">{loading ? "..." : countPartner}</span>
          <span className="text-emerald-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-auto relative z-10"><Trans>Mitra Level 2 & 3</Trans></span>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
          className="bg-white dark:bg-[#00172D] p-4 md:p-5 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <Users className="w-16 h-16 md:w-24 md:h-24 text-blue-500" />
          </div>
          <span className="text-[9px] md:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest relative z-10"><Trans>Calon Mitra</Trans></span>
          <span className="text-2xl md:text-3xl font-black text-[#00172D] dark:text-white relative z-10">{loading ? "..." : countCalonMitra}</span>
          <span className="text-blue-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-auto relative z-10"><Trans>Prospek Jaringan</Trans></span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Map Container Area */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          {/* Map Filters */}
          <div className="flex items-center justify-between gap-3 w-full relative z-20">
            <div className="relative shrink-0" ref={filterDropdownRef}>
              <button 
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm border border-gray-400 dark:border-slate-600 bg-white dark:bg-[#00172D] text-[10px] font-bold uppercase tracking-widest text-[#00172D] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors h-[28px]"
              >
                <Filter className="w-3.5 h-3.5 text-[#35ACDF]" />
                <span><Trans>Filter Mitra</Trans></span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isFilterDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#00172D] rounded-2xl shadow-xl border border-gray-400 dark:border-slate-600 p-2 z-[9999] flex flex-col gap-1">
                   <button
                      onClick={() => setTypeFilters(prev => ({ ...prev, Distributor: !prev.Distributor }))}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors w-full"
                   >
                     <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${typeFilters.Distributor ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                       <span className="text-[10px] uppercase font-bold text-gray-700 dark:text-gray-300 tracking-widest"><Trans>Distributor</Trans></span>
                     </div>
                     <div className={`flex items-center justify-center w-3 h-3 rounded-full border ${typeFilters.Distributor ? 'border-[#35ACDF]' : 'border-gray-300 dark:border-gray-600'}`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${typeFilters.Distributor ? 'bg-[#35ACDF]' : 'bg-transparent'}`} />
                     </div>
                   </button>
                   <button
                      onClick={() => setTypeFilters(prev => ({ ...prev, Partner: !prev.Partner }))}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors w-full"
                   >
                     <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${typeFilters.Partner ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                       <span className="text-[10px] uppercase font-bold text-gray-700 dark:text-gray-300 tracking-widest"><Trans>Partner</Trans></span>
                     </div>
                     <div className={`flex items-center justify-center w-3 h-3 rounded-full border ${typeFilters.Partner ? 'border-[#35ACDF]' : 'border-gray-300 dark:border-gray-600'}`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${typeFilters.Partner ? 'bg-[#35ACDF]' : 'bg-transparent'}`} />
                     </div>
                   </button>
                   <button
                      onClick={() => setTypeFilters(prev => ({ ...prev, CalonMitra: !prev.CalonMitra }))}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors w-full"
                   >
                     <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${typeFilters.CalonMitra ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                       <span className="text-[10px] uppercase font-bold text-gray-700 dark:text-gray-300 tracking-widest"><Trans>Calon Mitra</Trans></span>
                     </div>
                     <div className={`flex items-center justify-center w-3 h-3 rounded-full border ${typeFilters.CalonMitra ? 'border-[#35ACDF]' : 'border-gray-300 dark:border-gray-600'}`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${typeFilters.CalonMitra ? 'bg-[#35ACDF]' : 'bg-transparent'}`} />
                     </div>
                   </button>
                </div>
              )}
            </div>

            <div className="flex bg-white/50 dark:bg-[#00172D]/50 backdrop-blur-md rounded-full border border-gray-400 dark:border-slate-600 p-0.5 shadow-sm shrink-0">
              <button 
                 onClick={() => setFocusArea("Semua")}
                 className={`px-3 py-1.5 rounded-full text-[8px] whitespace-nowrap font-bold uppercase tracking-widest transition-colors ${focusArea === "Semua" ? "bg-[#35ACDF] text-white shadow-md shadow-[#35ACDF]/30" : "text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5"}`}
              >
                 Semua
              </button>
              <button 
                 onClick={() => setFocusArea("Jakarta")}
                 className={`px-3 py-1.5 rounded-full text-[8px] whitespace-nowrap font-bold uppercase tracking-widest transition-colors ${focusArea === "Jakarta" ? "bg-[#35ACDF] text-white shadow-md shadow-[#35ACDF]/30" : "text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5"}`}
              ><Trans>Jakarta</Trans></button>
            </div>
          </div>

          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.5, duration: 0.5 }}
             id="map-view-container"
             className="w-full aspect-square md:aspect-[4/3] bg-gray-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-800 relative z-10"
          >
          {!loading && (
            <div 
              className="w-full h-full relative" 
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
                className="w-full h-full"
                zoomControl={false}
                attributionControl={false}
                scrollWheelZoom={false}
                dragging={false}
              >
                <MapInteractionController isInteractive={isMapInteractive} boundsType={focusArea} clients={filteredClients} />
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
              {filteredClients.map((client) => {
                const lat = Number(client.garis_lintang);
                const lng = Number(client.garis_bujur);
                if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
                
                return (
                <Marker
                  key={client.id}
                  position={[lat, lng]}
                  icon={client.tipe === "Sales" ? salesIcon : client.tipe === "Distributor" ? distIcon : client.tipe === "Calon Mitra" ? calonMitraIcon : partnerIcon}
                  ref={(r) => { markerRefs.current[client.id] = r; }}
                >
                  <Popup className="custom-popup border-none rounded-2xl shadow-2xl p-0">
                    <div 
                      onClick={() => navigate(`/dashboard/client/${client.id}`)}
                      className="p-4 min-w-[200px] bg-[#00172D] hover:bg-gray-900 transition-colors cursor-pointer text-white rounded-2xl group"
                    >
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded ${client.tipe === "Sales" ? "bg-blue-500/20 text-[#35ACDF]" : client.tipe === "Calon Mitra" ? "bg-blue-500/20 text-[#35ACDF]" : client.tipe === "Distributor" ? "bg-orange-500/20 text-[#35ACDF]" : "bg-emerald-500/20 text-emerald-400"}`}>
                          {client.tipe}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                         <h3 className="font-bold text-white text-sm leading-tight group-hover:text-[#35ACDF] transition-colors">{client.perusahaan}</h3>
                         <svg className="w-4 h-4 text-gray-500 group-hover:text-[#35ACDF] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1 mt-1">
                        {client.nama_penanggung_jawab}
                      </p>
                    </div>
                  </Popup>
                </Marker>
                );
              })}
            </MapContainer>
            </div>
          )}
        </motion.div>
        </div>

        {/* Sidebar Customer List */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.6 }}
           className="xl:col-span-1 bg-white dark:bg-[#00172D] rounded-3xl shadow-sm border border-gray-200 dark:border-slate-800 p-5 md:p-6 flex flex-col h-[500px] xl:h-[600px]"
        >
            <div className="flex flex-col gap-4 mb-6">
               <h2 className="text-sm md:text-base font-black text-[#00172D] dark:text-white uppercase tracking-widest"><Trans>Daftar Customer</Trans></h2>
               
               <div className="grid grid-cols-2 gap-2 relative">
                  {/* Custom Bulan Dropdown */}
                  <div className="relative" ref={bRef}>
                     <button
                        type="button"
                        onClick={() => setActiveDropdown(activeDropdown === "bulan" ? null : "bulan")}
                        className="w-full flex items-center justify-between gap-1 px-2.5 py-2 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100/70 dark:hover:bg-slate-800 border border-gray-400 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest rounded-xl focus:outline-none transition-all cursor-pointer h-10"
                     >
                        <div className="flex items-center gap-1.5 min-w-0">
                           <Calendar className="w-3.5 h-3.5 text-[#35ACDF] shrink-0" />
                           <span className="truncate">{filterBulan === "Semua" ? "Semua Bulan" : INDONESIAN_MONTHS[Number(filterBulan) - 1]}</span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0 transition-transform duration-200 ${activeDropdown === "bulan" ? "rotate-180 text-[#35ACDF]" : ""}`} />
                     </button>
                     
                     {activeDropdown === "bulan" && (
                        <div className="absolute left-0 right-0 mt-1.5 max-h-60 overflow-y-auto bg-white dark:bg-[#00172D] rounded-xl shadow-xl border border-gray-400 dark:border-slate-600 p-1.5 z-[9999] flex flex-col gap-0.5 custom-scrollbar">
                           <button
                              type="button"
                              onClick={() => { setFilterBulan("Semua"); setActiveDropdown(null); }}
                              className={`w-full text-left px-3 py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-colors ${filterBulan === "Semua" ? "bg-[#35ACDF]/10 text-[#35ACDF]" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"}`}
                           ><Trans>Semua Bulan</Trans></button>
                           {[...Array(12)].map((_, i) => {
                              const val = (i + 1).toString();
                              return (
                                 <button
                                    key={i}
                                    type="button"
                                    onClick={() => { setFilterBulan(val); setActiveDropdown(null); }}
                                    className={`w-full text-left px-3 py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-colors ${filterBulan === val ? "bg-[#35ACDF]/10 text-[#35ACDF]" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"}`}
                                 >
                                    {INDONESIAN_MONTHS[i]}
                                 </button>
                              );
                           })}
                        </div>
                     )}
                  </div>

                  {/* Custom Tahun Dropdown */}
                  <div className="relative" ref={tRef}>
                     <button
                        type="button"
                        onClick={() => setActiveDropdown(activeDropdown === "tahun" ? null : "tahun")}
                        className="w-full flex items-center justify-between gap-1 px-2.5 py-2 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100/70 dark:hover:bg-slate-800 border border-gray-400 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest rounded-xl focus:outline-none transition-all cursor-pointer h-10"
                     >
                        <div className="flex items-center gap-1.5 min-w-0">
                           <Target className="w-3.5 h-3.5 text-[#35ACDF] shrink-0" />
                           <span className="truncate">{filterTahun === "Semua" ? "Semua Tahun" : filterTahun}</span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0 transition-transform duration-200 ${activeDropdown === "tahun" ? "rotate-180 text-[#35ACDF]" : ""}`} />
                     </button>
                     
                     {activeDropdown === "tahun" && (
                        <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-[#00172D] rounded-xl shadow-xl border border-gray-400 dark:border-slate-600 p-1.5 z-[9999] flex flex-col gap-0.5 max-h-48 overflow-y-auto custom-scrollbar">
                           <button
                              type="button"
                              onClick={() => { setFilterTahun("Semua"); setActiveDropdown(null); }}
                              className={`w-full text-left px-3 py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-colors ${filterTahun === "Semua" ? "bg-[#35ACDF]/10 text-[#35ACDF]" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"}`}
                           ><Trans>Semua Tahun</Trans></button>
                           {availableYears.map(y => {
                              const val = y.toString();
                              return (
                                 <button
                                    key={y}
                                    type="button"
                                    onClick={() => { setFilterTahun(val); setActiveDropdown(null); }}
                                    className={`w-full text-left px-3 py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-colors ${filterTahun === val ? "bg-[#35ACDF]/10 text-[#35ACDF]" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"}`}
                                 >
                                    {val}
                                 </button>
                              );
                           })}
                        </div>
                     )}
                  </div>
               </div>

               {/* Custom Sort Dropdown */}
               <div className="relative" ref={sRef}>
                  <button
                     type="button"
                     onClick={() => setActiveDropdown(activeDropdown === "sort" ? null : "sort")}
                     className="w-full flex items-center justify-between gap-1 px-3 py-2 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100/70 dark:hover:bg-slate-800 border border-gray-400 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest rounded-xl focus:outline-none transition-all cursor-pointer h-10"
                  >
                     <div className="flex items-center gap-1.5 min-w-0">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#35ACDF] shrink-0" />
                        <span className="truncate">{sortBy === "Terbanyak" ? "Belanja Terbanyak" : "Belanja Terbaru"}</span>
                     </div>
                     <ChevronDown className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0 transition-transform duration-200 ${activeDropdown === "sort" ? "rotate-180 text-[#35ACDF]" : ""}`} />
                  </button>
                  
                  {activeDropdown === "sort" && (
                     <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-[#00172D] rounded-xl shadow-xl border border-gray-400 dark:border-slate-600 p-1.5 z-[9999] flex flex-col gap-0.5">
                        <button
                           type="button"
                           onClick={() => { setSortBy("Terbanyak"); setActiveDropdown(null); }}
                           className={`w-full text-left px-3 py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-colors ${sortBy === "Terbanyak" ? "bg-[#35ACDF]/10 text-[#35ACDF]" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"}`}
                        ><Trans>Belanja Terbanyak</Trans></button>
                        <button
                           type="button"
                           onClick={() => { setSortBy("Terbaru"); setActiveDropdown(null); }}
                           className={`w-full text-left px-3 py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-colors ${sortBy === "Terbaru" ? "bg-[#35ACDF]/10 text-[#35ACDF]" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"}`}
                        ><Trans>Belanja Terbaru</Trans></button>
                     </div>
                  )}
               </div>
            </div>
           
           <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
               {sortedClientsList.length === 0 && !loading ? (
                 <div className="h-full flex items-center justify-center text-center p-6">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest"><Trans>Tidak ada data customer untuk filter ini.</Trans></p>
                 </div>
              ) : (
                 sortedClientsList.map((client) => (
                    <div 
                       key={client.id}
                       onClick={() => {
                          const marker = markerRefs.current[client.id];
                          if (marker) {
                             marker.openPopup();
                             if (window.innerWidth < 1024) {
                                document.getElementById('map-view-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                             }
                          }
                       }}
                       className="group p-4 bg-white dark:bg-[#00172D] border border-gray-200 dark:border-slate-800 rounded-2xl hover:border-[#35ACDF]/30 dark:hover:border-[#35ACDF]/30 hover:shadow-md transition-all cursor-pointer flex flex-col gap-2"
                    >
                       <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-[#00172D] dark:text-white text-sm group-hover:text-[#35ACDF] transition-colors">{client.perusahaan}</h3>
                          <span className={`shrink-0 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg ${client.tipe === "Distributor" ? "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400" : client.tipe === "Calon Mitra" ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"}`}>
                             {client.tipe}
                          </span>
                       </div>
                       
                       <div className="flex items-center justify-between mt-1">
                          <div className="flex flex-col">
                             <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest"><Trans>Total Belanja</Trans></span>
                             <span className="text-xs font-black text-[#00172D] dark:text-white">Rp {client.totalBelanja.toLocaleString("id-ID")}</span>
                          </div>
                          <div className="flex flex-col text-right">
                             <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest"><Trans>Transaksi Terakhir</Trans></span>
                             <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                                {client.belanjaTerakhir ? new Date(client.belanjaTerakhir).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric'}) : "-"}
                             </span>
                          </div>
                       </div>
                    </div>
                 ))
              )}
           </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
