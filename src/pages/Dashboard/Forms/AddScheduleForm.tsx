import { useState, FormEvent, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Save, User, Mail, Phone, Calendar, Clock, ChevronLeft, ChevronRight, Briefcase, MapPin, Navigation, Loader2, AlertCircle, Search, BadgeCheck } from "lucide-react";
import InteractiveMap from "../../../components/InteractiveMap";

interface Schedule {
  id: string;
  nama: string;
  perusahaan: string;
  telepon: string;
  email_kantor?: string;
  sektor_industri?: string;
  skala_perusahaan?: string;
  waktu: string;
  tujuan: string;
  produk: string[];
  tipe_jadwal?: string;
  status?: string;
  diajukan_oleh?: string;
}

const generateCalendarDays = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  const firstDay = date.getDay();
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export interface Product {
  id: string;
  nama: string;
  gambar?: string[];
  harga_normal?: number;
  harga_promo?: number;
  harga_dasar?: number;
  harga_satuan?: number;
}

export default function AddScheduleForm() {
  const navigate = useNavigate();
  const { setHeaderConfig } = useOutletContext<{ setHeaderConfig: (config: any) => void }>();
  const topRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Partial<Schedule>>({
    tipe_jadwal: 'pengajuan',
    status: 'pending',
    produk: []
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [schedules, setSchedules] = useState<{ waktu: string }[]>([]);
  const [conflictError, setConflictError] = useState("");

  
  const [salesList, setSalesList] = useState<{ id: string, nama_penanggung_jawab: string, perusahaan: string }[]>([]);
  const [salesSearchQuery, setSalesSearchQuery] = useState("");
  const [selectedSalesName, setSelectedSalesName] = useState("");
  const [isSalesDropdownOpen, setIsSalesDropdownOpen] = useState(false);
  const salesRef = useRef<HTMLDivElement>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [mapLink, setMapLink] = useState("https://www.google.com/maps?q=-6.2088,106.8456");
  const [isLocating, setIsLocating] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState<{lat: number, lng: number}>({ lat: -6.2088, lng: 106.8456 });
  const [companyAddress, setCompanyAddress] = useState("");
  
  const searchRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setHeaderConfig({
      title: "Buat Rencana Pertemuan",
      subjudul: "Isi detail secara lengkap",
      showBack: true
    });
  }, [setHeaderConfig]);

  useEffect(() => {
    if (addressRef.current) {
      addressRef.current.style.height = 'auto';
      addressRef.current.style.height = `${addressRef.current.scrollHeight}px`;
    }
  }, [companyAddress]);

  const updateLocationDetails = async (lat: number, lng: number) => {
    setMapCoordinates({ lat, lng });
    setMapLink(`https://www.google.com/maps?q=${lat},${lng}`);
    
    try {
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`);
      const data = await response.json();
      if (data) {
        const addressParts = [data.locality, data.city, data.principalSubdivision, data.countryName].filter(Boolean);
        if (addressParts.length > 0) {
           setCompanyAddress(addressParts.join(", "));
        }
      }
    } catch (error) {
      console.error("Error fetching address: ", error);
    }
  };

  useEffect(() => {
    if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  useEffect(() => {
    fetch("/data/schedules.json")
      .then(res => res.json())
      .then(data => setSchedules(data));
      
    fetch("/data/products.json")
      .then(res => res.json())
      .then(data => setProducts(data));
      
    fetch("/data/sales.json")
      .then(res => res.json())
      .then(data => setSalesList(data));
      
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setIsTimePickerOpen(false);
      }
      if (salesRef.current && !salesRef.current.contains(event.target as Node)) {
        setIsSalesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateTimeChange = (newDate: string, newTime: string) => {
    setSelectedDate(newDate);
    setSelectedTime(newTime);
    setConflictError("");

    if (!newDate || !newTime) return;

    const selectedDateTime = new Date(`${newDate}T${newTime}`).getTime();
    const hasConflict = schedules.some(schedule => {
      const scheduleTime = new Date(schedule.waktu).getTime();
      const diffInHours = Math.abs(scheduleTime - selectedDateTime) / (1000 * 60 * 60);
      return diffInHours < 1;
    });

    if (hasConflict) {
      setConflictError("Maaf, jadwal pada waktu tersebut sudah terisi. Silakan pilih waktu lain.");
    }
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          updateLocationDetails(lat, lng);
          setIsLocating(false);
        },
        (error) => {
          alert("Gagal mendapatkan lokasi. Pastikan izin lokasi (GPS) diberikan.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    } else {
      alert("Browser Anda tidak mendukung geolokasi GPS.");
      setIsLocating(false);
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (conflictError) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => { if (typeof window !== "undefined" && (window as any).clearAppCache) (window as any).clearAppCache(); navigate("/dashboard/schedule"); }, 1000);
    }, 1000);
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return "";
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredSales = salesList.filter(sales =>
    sales.nama_penanggung_jawab.toLowerCase().includes(salesSearchQuery.toLowerCase())
  );
  const isSelectedSalesUnknown = selectedSalesName && !salesList.find(s => s.nama_penanggung_jawab.toLowerCase() === selectedSalesName.toLowerCase());
  const filteredProducts = products.filter(product => 
    product.nama.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedProducts.find(p => p.id === product.id)
  );

  return (
    <motion.div
      ref={topRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-4 md:px-0 space-y-4 pb-4"
    >
      <form onSubmit={handleSave} className="space-y-4">
        
        {/* Step Indicator */}
        <div className="flex justify-center items-center gap-2 mb-2 lg:-mt-2">
           {[1, 2, 3].map(step => (
              <div key={step} className={`h-1.5 rounded-full transition-all ${currentPage === step ? 'w-6 bg-[#35ACDF]' : 'w-1.5 bg-gray-200'}`} />
           ))}
        </div>

        <AnimatePresence mode="wait">
        {currentPage === 1 && (
        <motion.div 
          key="page1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-[#00172D] p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 space-y-6 shadow-sm"
        >
          {/* Page 1: Informasi Sales & PIC */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-1">
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-[#35ACDF]/10 flex items-center justify-center text-[#35ACDF]">
                <BadgeCheck className="w-4 h-4 text-[#35ACDF]" />
              </div>
              <h3 className="font-bold text-[#00172D] dark:text-white text-sm uppercase tracking-widest">Informasi Sales Pengaju</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className={`space-y-2 relative ${isSelectedSalesUnknown ? '' : 'md:col-span-2'}`} ref={salesRef}>
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Nama Sales Manager</label>
                <input
                  required={formData.tipe_jadwal !== 'pribadi'}
                  type="text"
                  value={salesSearchQuery}
                  onChange={(e) => {
                    setSalesSearchQuery(e.target.value);
                    setSelectedSalesName(e.target.value);
                    setIsSalesDropdownOpen(true);
                    setFormData({...formData, diajukan_oleh: e.target.value});
                  }}
                  onFocus={() => setIsSalesDropdownOpen(true)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600/5 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] placeholder-slate-400 transition-all font-medium text-sm"
                  placeholder="Ketik atau pilih nama sales..."
                />
                <AnimatePresence>
                  {isSalesDropdownOpen && filteredSales.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute z-20 w-full mt-2 bg-white dark:bg-[#00172D] border border-gray-400 dark:border-slate-600 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
                    >
                      {filteredSales.map(sales => (
                        <div 
                          key={sales.id}
                          onClick={() => {
                            setSelectedSalesName(sales.nama_penanggung_jawab);
                            setSalesSearchQuery(sales.nama_penanggung_jawab);
                            setIsSalesDropdownOpen(false);
                            setFormData({...formData, diajukan_oleh: sales.id});
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 border-b border-gray-50 cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-[#35ACDF] font-bold text-xs flex items-center justify-center shrink-0">
                            {sales.nama_penanggung_jawab.charAt(0)}
                          </div>
                          <div>
                              <p className="font-bold text-xs text-gray-900">{sales.nama_penanggung_jawab}</p>
                              <p className="text-[10px] text-gray-500">{sales.perusahaan}</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {isSelectedSalesUnknown && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Email Sales Manager</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input required={formData.tipe_jadwal !== 'pribadi'} type="email" className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600/5 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] font-medium text-sm" placeholder="contoh@domain.com" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <hr className="border-gray-200 dark:border-slate-800" />

          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-1">
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-[#35ACDF]/10 flex items-center justify-center text-[#35ACDF]">
                <User className="w-4 h-4 text-[#35ACDF]" />
              </div>
              <h3 className="font-bold text-[#00172D] dark:text-white text-sm uppercase tracking-widest">Informasi Klien (PIC) & Jadwal</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Nama Lengkap PIC</label>
                <input required={formData.tipe_jadwal !== 'pribadi'} type="text" value={formData.nama || ""} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600/5 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] font-medium text-sm" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Email PIC</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input required={formData.tipe_jadwal !== 'pribadi'} type="email" className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600/5 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] font-medium text-sm" placeholder="johndoe@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Nomor HP PIC</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input required={formData.tipe_jadwal !== 'pribadi'} type="tel" inputMode="numeric" pattern="[0-9]*" value={formData.telepon || ""} onChange={e => setFormData({...formData, telepon: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600/5 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] font-medium text-sm" placeholder="0812..." />
              </div>
            </div>

            {/* Custom Calendar & Drum Reel Time component code duplicated from AppointmentPage for consistent fancy look */}
            <div className="space-y-2 relative" ref={calendarRef}>
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Tanggal Pertemuan</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" />
                <input 
                  readOnly 
                  type="text" 
                  value={selectedDate ? new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ""}
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  placeholder="Pilih Tanggal"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border dark:border-slate-600/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] font-medium text-sm cursor-pointer ${conflictError ? 'border-red-400 focus:ring-red-500' : 'border-slate-200'}`} 
                />
              </div>
              <AnimatePresence>
                {isCalendarOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute z-20 w-[320px] left-0 mt-2 bg-white dark:bg-[#00172D] rounded-xl shadow-xl border border-slate-100 dark:border-slate-600/5 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded text-slate-600"><ChevronLeft className="w-5 h-5" /></button>
                      <span className="font-bold text-[#00172D] text-sm">{currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
                      <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded text-slate-600"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                       {['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map(d => <span key={d} className="text-[10px] font-bold text-gray-400">{d}</span>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth()).map((date, i) => {
                        if (!date) return <div key={`empty-${i}`} className="p-2" />;
                        const isSelected = selectedDate === date.toISOString().split('T')[0];
                        const isPast = date < new Date(new Date().setHours(0,0,0,0));
                        return (
                          <button key={date.toISOString()} type="button" disabled={isPast} onClick={() => { handleDateTimeChange(date.toISOString().split('T')[0], selectedTime); setIsCalendarOpen(false); }} className={`p-2 w-full text-center text-sm rounded-lg transition-colors ${isSelected ? 'bg-[#35ACDF] text-white font-bold' : isPast ? 'text-gray-300 cursor-not-allowed' : 'text-slate-700 hover:bg-blue-50'}`}>
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2 relative" ref={timePickerRef}>
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Waktu</label>
              <div onClick={() => setIsTimePickerOpen(!isTimePickerOpen)} className={`flex justify-between items-center bg-slate-50 dark:bg-slate-900 border dark:border-slate-600/5 rounded-xl text-slate-800 dark:text-white px-4 py-3 cursor-pointer ${conflictError ? 'border-red-400 focus-within:ring-2 focus-within:ring-red-500' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                   <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                   <span className={`font-medium text-sm ${selectedTime ? 'text-slate-800' : 'text-slate-400'}`}>
                     {selectedTime ? selectedTime.replace(':', ' : ') : '-- : --'}
                   </span>
                </div>
              </div>
              <AnimatePresence>
                {isTimePickerOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute z-20 w-full mt-2 bg-white dark:bg-[#00172D] rounded-xl shadow-xl border border-slate-100 dark:border-slate-600/5 dark:border-slate-700 p-2">
                    <div className="flex gap-2">
                       <div className="flex-1 flex flex-col h-[200px] border-r border-slate-100 dark:border-slate-600/5 bg-slate-50/50 dark:bg-slate-900/50 rounded-l-lg">
                          <div className="text-center py-2 text-[10px] uppercase font-bold text-gray-400 bg-white">Jam</div>
                          <div className="flex-1 overflow-y-auto no-scrollbar snap-y snap-mandatory relative" onScroll={(e) => { const el = e.currentTarget; const index = Math.round(el.scrollTop / 40); const h = (8 + Math.min(Math.max(index, 0), 9)).toString().padStart(2, '0'); const currentMin = selectedTime.split(':')[1] || "00"; if (selectedTime.split(':')[0] !== h) { handleDateTimeChange(selectedDate, `${h}:${currentMin}`); } }}>
                             <div className="pointer-events-none absolute top-1/2 left-0 w-full h-[40px] -mt-[20px] bg-blue-50/50 border-y border-blue-100 z-0"></div>
                             <div className="pt-[52px] pb-[52px] relative z-10">
                               {Array.from({ length: 10 }, (_, i) => {
                                  const h = (8 + i).toString().padStart(2, '0');
                                  const isSelected = selectedTime.split(':')[0] === h;
                                  return (
                                    <div key={`h-${h}`} className={`h-[40px] flex items-center justify-center snap-center cursor-pointer ${isSelected ? 'text-[#35ACDF] text-lg font-black' : 'text-slate-400 text-sm font-medium'}`} onClick={(e) => { const currentMin = selectedTime.split(':')[1] || "00"; handleDateTimeChange(selectedDate, `${h}:${currentMin}`); e.currentTarget.parentElement?.parentElement?.scrollTo({ top: i * 40, behavior: 'smooth' }); }}>
                                      {h}
                                    </div>
                                  );
                               })}
                             </div>
                          </div>
                       </div>
                       <div className="flex-1 flex flex-col h-[200px] bg-slate-50/50 dark:bg-slate-900/50 rounded-r-lg">
                          <div className="text-center py-2 text-[10px] uppercase font-bold text-gray-400 bg-white">Menit</div>
                          <div className="flex-1 overflow-y-auto no-scrollbar snap-y snap-mandatory relative" onScroll={(e) => { const el = e.currentTarget; const index = Math.round(el.scrollTop / 40); const m = Math.min(Math.max(index, 0), 59).toString().padStart(2, '0'); const currentHour = selectedTime.split(':')[0] || "12"; if (selectedTime.split(':')[1] !== m) { handleDateTimeChange(selectedDate, `${currentHour}:${m}`); } }}>
                             <div className="pointer-events-none absolute top-1/2 left-0 w-full h-[40px] -mt-[20px] bg-blue-50/50 border-y border-blue-100 z-0"></div>
                             <div className="pt-[52px] pb-[52px] relative z-10">
                               {Array.from({ length: 60 }, (_, i) => {
                                  const m = i.toString().padStart(2, '0');
                                  const isSelected = selectedTime.split(':')[1] === m;
                                  return (
                                    <div key={`m-${m}`} className={`h-[40px] flex items-center justify-center snap-center cursor-pointer ${isSelected ? 'text-[#35ACDF] text-lg font-black' : 'text-slate-400 text-sm font-medium'}`} onClick={(e) => { const currentHour = selectedTime.split(':')[0] || "12"; handleDateTimeChange(selectedDate, `${currentHour}:${m}`); e.currentTarget.parentElement?.parentElement?.scrollTo({ top: i * 40, behavior: 'smooth' }); }}>
                                      {m}
                                    </div>
                                  );
                               })}
                             </div>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {conflictError && <p className="text-xs font-bold text-red-500 md:col-span-2 relative -top-3">{conflictError}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
             <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Tipe Jadwal</label>
                <select value={formData.tipe_jadwal || "pengajuan"} onChange={e => setFormData({...formData, tipe_jadwal: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600/5 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] font-medium text-sm">
                  <option value="pengajuan">Jadwal Pengajuan (Klien/Sales)</option>
                  <option value="pribadi">Rencana Pribadi (User)</option>
                </select>
             </div>
              {formData.tipe_jadwal === "pengajuan" && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Status Persetujuan</label>
                  <select value={formData.status || "pending"} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600/5 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] font-medium text-sm">
                      <option value="pending">Menunggu Persetujuan</option>
                      <option value="approved">Disetujui (Approved)</option>
                      <option value="canceled">Dibatalkan (Canceled)</option>
                  </select>
                </div>
             )}
          </div>
          </div>
        </motion.div>
        )}

        {currentPage === 2 && (
        <motion.div 
          key="page2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-[#00172D] p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 space-y-6 shadow-sm"
        >
          {/* Page 2: Profil Perusahaan */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-1">
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-[#35ACDF]/10 flex items-center justify-center text-[#35ACDF]">
                <Briefcase className="w-4 h-4 text-[#35ACDF]" />
              </div>
              <h3 className="font-bold text-[#00172D] dark:text-white text-sm uppercase tracking-widest">Profil Perusahaan</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Sektor Industri</label>
                 <select value={formData.sektor_industri || ""} onChange={e => setFormData({...formData, sektor_industri: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600/5 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] font-medium text-sm">
                   <option value="">Pilih Sektor Industri...</option>
                   <option value="Teknologi">Teknologi & IT</option>
                   <option value="Pendidikan">Pendidikan</option>
                   <option value="Kesehatan">Kesehatan</option>
                   <option value="Keuangan">Perbankan & Keuangan</option>
                   <option value="Ritel">Ritel & E-Commerce</option>
                   <option value="Lainnya">Lainnya</option>
                 </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Nama Perusahaan</label>
                <input required={formData.tipe_jadwal !== 'pribadi'} type="text" value={formData.perusahaan || ""} onChange={e => setFormData({...formData, perusahaan: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600/5 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] font-medium text-sm" placeholder="PT Maju Bersama" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Email Kantor</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={formData.email_kantor || ""} onChange={e => setFormData({...formData, email_kantor: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600/5 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] font-medium text-sm" placeholder="nama@perusahaan.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Telepon Perusahaan</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" inputMode="numeric" className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600/5 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] font-medium text-sm" placeholder="021..." />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Alamat Perusahaan</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                <textarea ref={addressRef} rows={1} value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600/5 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] font-medium text-sm resize-none overflow-hidden" placeholder="Jl. Sudirman No 1..." />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="url" value={mapLink} onChange={(e) => setMapLink(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600/5 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] font-medium text-sm" placeholder="https://maps.google.com/..." />
                </div>
                <button type="button" onClick={handleGetCurrentLocation} disabled={isLocating} className="flex-shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-[#35ACDF]/10 text-[#35ACDF] font-bold text-sm rounded-xl hover:bg-[#35ACDF]/20 transition-colors disabled:opacity-50">
                  {isLocating ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Mencari...</span></> : <><Navigation className="w-4 h-4" /><span>Gunakan Lokasi Saat Ini</span></>}
                </button>
              </div>
              <div className="w-full rounded-xl overflow-hidden border border-slate-200 mt-3 h-[250px] md:h-[350px] relative z-0">
                <InteractiveMap position={mapCoordinates} onPositionChange={(pos) => updateLocationDetails(pos.lat, pos.lng)} />
              </div>
            </div>
          </div>
          </div>
        </motion.div>
        )}

        {currentPage === 3 && (
        <motion.div 
          key="page3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-[#00172D] p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 space-y-6 shadow-sm"
        >
          {/* Page 3: Detail Tambahan */}
          <div className="flex items-center gap-3 pb-1">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-[#35ACDF]/10 flex items-center justify-center text-[#35ACDF]">
              <AlertCircle className="w-4 h-4 text-[#35ACDF]" />
            </div>
            <h3 className="font-bold text-[#00172D] dark:text-white text-sm uppercase tracking-widest">Detail Tambahan</h3>
          </div>
          
          <div className="space-y-3">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Ketertarikan Produk</label>
            <div className="relative z-10" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600/5 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] font-medium text-sm" placeholder="Cari produk dari katalog..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsDropdownOpen(true)} />
              </div>
              <AnimatePresence>
                {isDropdownOpen && searchQuery.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute w-full mt-2 bg-white dark:bg-[#00172D] rounded-xl shadow-xl border border-slate-100 dark:border-slate-600/5 dark:border-slate-700 max-h-[300px] overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <div key={product.id} onClick={() => { setSelectedProducts([...selectedProducts, product]); setSearchQuery(""); setIsDropdownOpen(false); setFormData({...formData, produk: [...(formData.produk||[]), product.id]}) }} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border-b border-slate-50 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1">
                              {product.gambar && product.gambar.length > 0 ? <img src={product.gambar[0]} alt={product.nama} className="w-full h-full object-contain" /> : <div className="w-full h-full bg-slate-100 rounded"></div>}
                            </div>
                            <p className="text-sm font-bold text-[#00172D]">{product.nama}</p>
                          </div>
                          <p className="text-xs font-black text-[#00172D]">{formatCurrency(product.harga_normal || product.harga_satuan || product.harga_dasar)}</p>
                        </div>
                      ))
                    ) : <div className="px-4 py-3 text-slate-500 text-sm text-center">Produk tidak ditemukan</div>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {selectedProducts.length > 0 && (
              <div className="flex flex-col gap-3 pt-3">
                {selectedProducts.map((product) => (
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={product.id} className="flex items-center justify-between p-3 bg-white dark:bg-[#00172D] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1">
                          {product.gambar && product.gambar.length > 0 ? <img src={product.gambar[0]} alt={product.nama} className="w-full h-full object-contain" /> : <div className="w-full h-full bg-slate-100 rounded"></div>}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#00172D]">{product.nama}</h4>
                          <span className="text-[10px] font-bold text-[#35ACDF] uppercase tracking-widest">{product.merek || "Product"}</span>
                        </div>
                     </div>
                     <button type="button" onClick={() => { setSelectedProducts(selectedProducts.filter(p => p.id !== product.id)); setFormData({...formData, produk: formData.produk?.filter(p => p !== product.id)}); }} className="flex-shrink-0 text-gray-400 hover:text-red-500 p-2"><AlertCircle className="w-4 h-4" /> Hapus</button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Tujuan Meeting & Catatan Tambahan</label>
            <textarea required={formData.tipe_jadwal !== 'pribadi'} rows={4} value={formData.tujuan || ""} onChange={e => setFormData({...formData, tujuan: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600/5 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] font-medium text-sm resize-none" placeholder="Jelaskan tujuan pertemuan..." />
          </div>
        </motion.div>
        )}
        </AnimatePresence>

        <div className="flex justify-between items-center pt-6 pb-8 border-t border-gray-100 mt-6">
           {currentPage > 1 ? (
             <button type="button" onClick={() => setCurrentPage(currentPage - 1)} className="px-6 py-3 bg-white dark:bg-transparent border border-gray-200 dark:border-slate-600/20 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 font-bold uppercase tracking-widest text-xs rounded-xl transition-all">
               Kembali
             </button>
           ) : (
             <button type="button" onClick={() => { if (typeof window !== "undefined" && (window as any).clearAppCache) (window as any).clearAppCache(); navigate(-1); }} className="px-6 py-3 bg-white dark:bg-transparent border border-gray-200 dark:border-slate-600/20 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 font-bold uppercase tracking-widest text-xs rounded-xl transition-all">
               Batal
             </button>
           )}

           {currentPage < 3 ? (
             <button type="button" onClick={() => setCurrentPage(currentPage + 1)} className="px-6 py-3 bg-[#35ACDF] hover:bg-[#2b8db8] text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all">
               Selanjutnya
             </button>
           ) : (
             <button type="submit" disabled={status === "loading"} className="px-6 py-3 bg-[#00172D] hover:bg-[#004A7D] text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-70">
               {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 text-[#35ACDF]" /> Ajukan Jadwal</>}
             </button>
           )}
        </div>
      </form>
    </motion.div>
  );
}
