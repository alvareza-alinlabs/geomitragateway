import { useState, useEffect, FormEvent, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Loader2, AlertCircle, Phone, Briefcase, Mail, User, Calendar, Clock, Search, X, ChevronLeft, ChevronRight, MapPin, Navigation, BadgeCheck } from "lucide-react";
import Header from "./Landing/Header";
import BottomNavigation from "./Landing/BottomNavigation";
import InteractiveMap from "../components/InteractiveMap";
import emailjs from '@emailjs/browser';
import { Trans, useTranslation } from "../lib/LanguageContext";

const MOCK_HOURS = Array.from({ length: 24 }, (_, i) => {
  return `${i.toString().padStart(2, '0')}:00`;
});

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

export default function AppointmentPage() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
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
  
  const [currentMobilePage, setCurrentMobilePage] = useState(0);
  
  const [mapLink, setMapLink] = useState("https://www.google.com/maps?q=-6.2088,106.8456");
  const [isLocating, setIsLocating] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState<{lat: number, lng: number}>({ lat: -6.2088, lng: 106.8456 }); // Default to Jakarta
  const [companyAddress, setCompanyAddress] = useState("");
  
  const searchRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);

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

    // Check if the selected time is within 2 hours of any existing schedule
    const selectedDateTime = new Date(`${newDate}T${newTime}`).getTime();
    const hasConflict = schedules.some(schedule => {
      const scheduleTime = new Date(schedule.waktu).getTime();
      const diffInHours = Math.abs(scheduleTime - selectedDateTime) / (1000 * 60 * 60);
      return diffInHours < 2; // Block if within 2 hours
    });

    if (hasConflict) {
      t("Maaf, jadwal pada waktu tersebut sudah terisi. Silakan pilih waktu lain.").then(setConflictError);
    }
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = position.coords.accuracy;
          
          updateLocationDetails(lat, lng);
          setIsLocating(false);
          
          if (accuracy > 500) {
            alert(`Lokasi GPS ditemukan, namun akurasi rendah (radius ${Math.round(accuracy)}m). Silakan geser pin di peta untuk menyesuaikan secara manual.`);
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
          let errorMsg = "Gagal mendapatkan lokasi. Pastikan izin lokasi (GPS) diberikan di browser Anda.";
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg = "Akses Lokasi ditolak oleh browser. Mohon izinkan akses lokasi.";
          }
          alert(errorMsg);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    } else {
      alert("Browser Anda tidak mendukung geolokasi GPS.");
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (conflictError) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const picName = formData.get("pic_name") as string;
    const picEmail = formData.get("pic_email") as string;
    const company = formData.get("company") as string;
    const purpose = formData.get("purpose") as string;

    setStatus("loading");
    
    try {
      const usersRes = await fetch("/data/users.json");
      const users = await usersRes.json();
      const superAdmin = users.find((u: any) => u.hak_akses?.ringkasan === "Super Admin") || users[0];

      const templateParams = {
        subject: `Pengajuan Appointment Baru - ${company}`,
        from_name: picName, 
        status: "Pending",
        status_class: "pending",
        nama_pic: picName,
        perusahaan: company,
        waktu: new Date(`${selectedDate}T${selectedTime}`).toLocaleString("id-ID", {
          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
        }),
        tujuan: purpose || "-",
        to_name: superAdmin.nama,
        to_mail: superAdmin.email,
        cc_mail: picEmail,
      };

      await emailjs.send(
        'gmg-otp',
        'appointment',
        templateParams,
        '7afeCxNtF1U9QA0JL'
      );

      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        setSelectedDate("");
        setSelectedTime("");
        setSelectedProducts([]);
        setSearchQuery("");
        form.reset();
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengirim pengajuan. Silakan coba lagi.");
      setStatus("idle");
    }
  };

  const filteredSales = salesList.filter(sales =>
    sales.nama_penanggung_jawab.toLowerCase().includes(salesSearchQuery.toLowerCase())
  );
  
  const isSelectedSalesUnknown = selectedSalesName && !salesList.find(s => s.nama_penanggung_jawab.toLowerCase() === selectedSalesName.toLowerCase());

  const filteredProducts = products.filter(product => 
    product.nama.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedProducts.find(p => p.id === product.id)
  );

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return "";
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProducts([...selectedProducts, product]);
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#000d1a] font-sans flex flex-col text-[#00172D] dark:text-slate-100 pb-16 md:pb-0 transition-colors duration-300">
      <Header />
      
      <main className="flex-1 flex flex-col p-6 mb-12 md:mb-24 pt-24 md:pt-32 w-full max-w-7xl mx-auto">
        
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-left mb-8 md:mb-16 w-full"
        >
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#35ACDF] mb-3 block"><Trans>Konsultasi Personal</Trans></span>
          <h1 className="text-3xl md:text-5xl font-black text-[#00172D] dark:text-white mb-4 md:mb-6 tracking-tight"><Trans>Atur Jadwal Pertemuan</Trans></h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-xs md:text-lg leading-relaxed max-w-2xl">
            <Trans>Diskusikan kebutuhan distribusi dan jelajahi portofolio produk unggulan bersama kami. Pilih waktu fleksibel untuk sesi Anda.</Trans>
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.1 }}
           className="w-full"
        >
          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#001428] p-4 md:p-12 rounded-3xl md:rounded-[2rem] border border-gray-200 dark:border-slate-800 shadow-xl shadow-blue-900/5 dark:shadow-none tracking-normal overflow-hidden transition-colors duration-300">
            <div className="flex justify-center gap-2 mb-6 md:hidden">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all ${currentMobilePage === idx ? "w-6 bg-[#35ACDF]" : "w-1.5 bg-gray-200 dark:bg-gray-700"}`} />
              ))}
            </div>

            <div className="md:space-y-8">
              {/* PAGE 1 */}
              <div className={`w-full space-y-6 md:space-y-8 ${currentMobilePage === 0 ? 'block' : 'hidden md:block'}`}>
                {/* Segment 1: Informasi Sales */}
                <div className="space-y-3.5 md:space-y-4">
                  <div className="flex items-center gap-3 border-b border-gray-200 dark:border-slate-800 pb-2">
                    <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-[#35ACDF]">
                      <BadgeCheck className="w-3.5 h-3.5 text-[#35ACDF]" />
                    </div>
                    <h3 className="font-bold text-[#00172D] dark:text-white text-xs md:text-sm uppercase tracking-widest"><Trans>Informasi Sales Pengaju</Trans></h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <div className={`space-y-2 relative ${isSelectedSalesUnknown ? '' : 'md:col-span-2'}`} ref={salesRef}>
                  <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400"><Trans>Nama Sales Manager</Trans></label>
                  <input
                    required
                    type="text"
                    value={salesSearchQuery}
                    onChange={(e) => {
                      setSalesSearchQuery(e.target.value);
                      setSelectedSalesName(e.target.value);
                      setIsSalesDropdownOpen(true);
                    }}
                    onFocus={() => setIsSalesDropdownOpen(true)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#001c38] border border-slate-400 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium text-xs md:text-sm hover:border-slate-300 dark:hover:border-slate-500"
                    placeholder="Ketik atau pilih nama sales..."
                  />
                  
                  <AnimatePresence>
                    {isSalesDropdownOpen && filteredSales.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-20 w-full mt-2 bg-white dark:bg-[#001428] border border-gray-400 dark:border-slate-600 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
                      >
                        {filteredSales.map(sales => (
                          <div 
                            key={sales.id}
                            onClick={() => {
                              setSelectedSalesName(sales.nama_penanggung_jawab);
                              setSalesSearchQuery(sales.nama_penanggung_jawab);
                              setIsSalesDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-[#001c38] transition-colors flex items-center gap-3 border-b border-gray-50 dark:border-slate-600/5 last:border-0 cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-[#35ACDF] font-bold text-xs shrink-0">
                              {sales.nama_penanggung_jawab.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-xs text-gray-950 dark:text-white">{sales.nama_penanggung_jawab}</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">{sales.perusahaan}</p>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {isSelectedSalesUnknown && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2"
                  >
                    <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400"><Trans>Email Sales Manager</Trans></label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        required
                        type="email"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#001c38] border border-slate-400 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium text-xs md:text-sm hover:border-slate-300 dark:hover:border-slate-500"
                        placeholder="contoh@domain.com"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
              
              <div className="flex justify-end pt-2 md:hidden">
                  <button type="button" onClick={() => setCurrentMobilePage(1)} className="w-12 h-12 flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-[#35ACDF] rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                    <ChevronRight className="w-6 h-6" />
                  </button>
              </div>
            </div>

            {/* PAGE 2 */}
            <div className={`w-full space-y-6 md:space-y-8 ${currentMobilePage === 1 ? 'block' : 'hidden md:block'}`}>
              {/* Segment 2: PIC & Jadwal */}
              <div className="space-y-3.5 md:space-y-4 pt-2 md:pt-4">
              <div className="flex items-center gap-3 border-b border-gray-200 dark:border-slate-800 pb-2">
                <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-[#35ACDF]">
                  <User className="w-3.5 h-3.5 text-[#35ACDF]" />
                </div>
                <h3 className="font-bold text-[#00172D] dark:text-white text-xs md:text-sm uppercase tracking-widest"><Trans>Informasi Klien (PIC) & Jadwal</Trans></h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400"><Trans>Nama Lengkap PIC (Calon Klien)</Trans></label>
                  <input
                    required
                    name="pic_name"
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#001c38] border border-slate-400 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium text-xs md:text-sm hover:border-slate-300 dark:hover:border-slate-500"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400"><Trans>Email (PIC)</Trans></label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      required
                      name="pic_email"
                      type="email"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#001c38] border border-slate-400 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium text-xs md:text-sm hover:border-slate-300 dark:hover:border-slate-500"
                      placeholder="johndoe@email.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400"><Trans>Nomor HP (PIC)</Trans></label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      required
                      type="tel"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#001c38] border border-slate-400 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium text-xs md:text-sm hover:border-slate-300 dark:hover:border-slate-500"
                      placeholder="0812..."
                    />
                  </div>
                </div>
                <div className="space-y-2 relative" ref={calendarRef}>
                  <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400"><Trans>Tanggal Pertemuan</Trans></label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" />
                    <input 
                      readOnly 
                      type="text" 
                      value={selectedDate ? new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ""}
                      onClick={() => { setIsCalendarOpen(!isCalendarOpen); }}
                      placeholder="Pilih Tanggal"
                      className={`w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#001c38] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] transition-all font-medium text-xs md:text-sm hover:border-slate-300 dark:hover:border-slate-500 text-slate-600 dark:text-slate-300 cursor-pointer ${conflictError ? 'border-red-400 dark:border-red-500/50 focus:ring-red-500/50' : 'border-slate-400 dark:border-slate-600'}`} 
                    />
                  </div>
                  <AnimatePresence>
                    {isCalendarOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-20 w-full md:w-[320px] left-0 mt-2 bg-white dark:bg-[#001428] rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400">
                            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <span className="font-bold text-[#00172D] dark:text-white text-xs md:text-sm">
                            {currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                          </span>
                          <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400">
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
                            <span key={d} className="text-[9px] md:text-[10px] font-bold text-gray-400"><Trans>{d}</Trans></span>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {generateCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth()).map((date, i) => {
                            if (!date) return <div key={`empty-${i}`} className="p-2" />;
                            const isSelected = selectedDate === date.toISOString().split('T')[0];
                            const isPast = date < new Date(new Date().setHours(0,0,0,0));
                            return (
                              <button
                                key={date.toISOString()}
                                type="button"
                                disabled={isPast}
                                onClick={() => {
                                  handleDateTimeChange(date.toISOString().split('T')[0], selectedTime);
                                  setIsCalendarOpen(false);
                                }}
                                className={`p-2 w-full text-center text-xs md:text-sm rounded-lg transition-colors
                                  ${isSelected ? 'bg-[#35ACDF] text-white font-bold shadow-md shadow-[#35ACDF]/30' : 
                                    isPast ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed' : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-[#35ACDF]'}`}
                              >
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
                  <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400"><Trans>Waktu</Trans></label>
                  <div
                    onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
                    className={`flex justify-between items-center bg-slate-50 dark:bg-[#001c38] border border-slate-400 dark:border-slate-600 rounded-xl px-4 py-3 cursor-pointer transition-all ${conflictError ? 'border-red-400 dark:border-red-500/50 focus-within:ring-2 focus-within:ring-red-500/50' : 'border-slate-400 dark:border-slate-600/15 hover:border-slate-300 dark:hover:border-slate-500 focus-within:ring-2 focus-within:ring-[#35ACDF]/50'}`}
                  >
                    <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                       <span className={`font-medium text-xs md:text-sm ${selectedTime ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
                         {selectedTime ? selectedTime.replace(':', ' : ') : '-- : --'}
                       </span>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isTimePickerOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-20 w-full mt-2 bg-white dark:bg-[#001428] rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-2"
                      >
                        <div className="flex gap-2">
                           {/* Hours Reel */}
                           <div className="flex-1 flex flex-col h-[200px] border-r border-slate-100 dark:border-slate-600/5 bg-slate-50/50 dark:bg-[#001c38]/50 rounded-l-lg">
                              <div className="text-center py-2 text-[10px] uppercase font-bold text-gray-400 bg-white dark:bg-[#001428] shadow-sm z-10 relative"><Trans>Jam</Trans></div>
                              <div 
                                className="flex-1 overflow-y-auto no-scrollbar snap-y snap-mandatory relative"
                                onScroll={(e) => {
                                   const el = e.currentTarget;
                                   const index = Math.round(el.scrollTop / 40);
                                   
                                   const availableHours = Array.from({ length: 10 }, (_, i) => (8 + i).toString().padStart(2, '0')).filter(hr => {
                                      if (!selectedDate) return true;
                                      const chkT = new Date(`${selectedDate}T${hr}:00`).getTime();
                                      return !schedules.some(s => Math.abs(new Date(s.waktu).getTime() - chkT) / 3600000 < 2);
                                   });
                                   if (availableHours.length === 0) return;
                                   
                                   const clampedIndex = Math.min(Math.max(index, 0), availableHours.length - 1);
                                   const h = availableHours[clampedIndex];
                                   const currentMin = selectedTime.split(':')[1] || "00";
                                   if (selectedTime.split(':')[0] !== h) {
                                      handleDateTimeChange(selectedDate, `${h}:${currentMin}`);
                                   }
                                }}
                              >
                                 <div className="pointer-events-none absolute top-1/2 left-0 w-full h-[40px] -mt-[20px] bg-blue-50/50 border-y border-blue-100 z-0"></div>
                                 <div className="pt-[52px] pb-[52px] relative z-10">
                                   {Array.from({ length: 10 }, (_, i) => (8 + i).toString().padStart(2, '0'))
                                     .filter(h => {
                                       if (!selectedDate) return true;
                                       const chkT = new Date(`${selectedDate}T${h}:00`).getTime();
                                       return !schedules.some(s => Math.abs(new Date(s.waktu).getTime() - chkT) / 3600000 < 2);
                                     })
                                     .map((h, i) => {
                                       const isSelected = selectedTime.split(':')[0] === h;
                                       return (
                                         <div
                                           key={`h-${h}`}
                                           className={`h-[40px] flex items-center justify-center snap-center cursor-pointer transition-all ${isSelected ? 'text-[#35ACDF] text-lg font-black' : 'text-slate-400 text-sm font-medium hover:text-slate-600'}`}
                                           onClick={(e) => {
                                              const currentMin = selectedTime.split(':')[1] || "00";
                                              handleDateTimeChange(selectedDate, `${h}:${currentMin}`);
                                              e.currentTarget.parentElement?.parentElement?.scrollTo({ top: i * 40, behavior: 'smooth' });
                                           }}
                                         >
                                           {h}
                                         </div>
                                       );
                                   })}
                                 </div>
                              </div>
                           </div>
                           
                           {/* Minutes Reel */}
                           <div className="flex-1 flex flex-col h-[200px] bg-slate-50/50 dark:bg-[#001c38]/50 rounded-r-lg">
                              <div className="text-center py-2 text-[10px] uppercase font-bold text-gray-400 bg-white dark:bg-[#001428] shadow-sm z-10 relative"><Trans>Menit</Trans></div>
                              <div 
                                className="flex-1 overflow-y-auto no-scrollbar snap-y snap-mandatory relative"
                                onScroll={(e) => {
                                   const el = e.currentTarget;
                                   const index = Math.round(el.scrollTop / 40);
                                   const m = Math.min(Math.max(index, 0), 59).toString().padStart(2, '0');
                                   const currentHour = selectedTime.split(':')[0] || "12";
                                   if (selectedTime.split(':')[1] !== m) {
                                      handleDateTimeChange(selectedDate, `${currentHour}:${m}`);
                                   }
                                }}
                              >
                                 <div className="pointer-events-none absolute top-1/2 left-0 w-full h-[40px] -mt-[20px] bg-blue-50/50 dark:bg-blue-950/20 border-y border-blue-100 dark:border-blue-900/40 z-0"></div>
                                 <div className="pt-[52px] pb-[52px] relative z-10">
                                   {Array.from({ length: 60 }, (_, i) => {
                                      const m = i.toString().padStart(2, '0');
                                      const isSelected = selectedTime.split(':')[1] === m;
                                      return (
                                        <div
                                          key={`m-${m}`}
                                          className={`h-[40px] flex items-center justify-center snap-center cursor-pointer transition-all ${isSelected ? 'text-[#35ACDF] text-lg font-black' : 'text-slate-400 dark:text-slate-500 text-sm font-medium hover:text-slate-600 dark:hover:text-slate-300'}`}
                                          onClick={(e) => {
                                             const currentHour = selectedTime.split(':')[0] || "12";
                                             handleDateTimeChange(selectedDate, `${currentHour}:${m}`);
                                             e.currentTarget.parentElement?.parentElement?.scrollTo({ top: i * 40, behavior: 'smooth' });
                                          }}
                                        >
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
              </div>
            </div>
              
              <div className="flex justify-between pt-2 md:hidden">
                  <button type="button" onClick={() => setCurrentMobilePage(0)} className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button type="button" onClick={() => setCurrentMobilePage(2)} className="w-12 h-12 flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-[#35ACDF] rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                    <ChevronRight className="w-6 h-6" />
                  </button>
              </div>
            </div>

            {/* PAGE 3 */}
            <div className={`w-full space-y-6 md:space-y-8 ${currentMobilePage === 2 ? 'block' : 'hidden md:block'}`}>
              {/* Segment 3: Detail Perusahaan */}
              <div className="space-y-3.5 md:space-y-4 md:pt-4">
              <div className="flex items-center gap-3 border-b border-gray-200 dark:border-slate-800 pb-2">
                <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-[#35ACDF]">
                  <Briefcase className="w-3.5 h-3.5 text-[#35ACDF]" />
                </div>
                <h3 className="font-bold text-[#00172D] dark:text-white text-xs md:text-sm uppercase tracking-widest"><Trans>Profil Perusahaan</Trans></h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="space-y-2">
                   <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400"><Trans>Sektor Industri</Trans></label>
                   <select className="w-full px-4 py-3 bg-slate-50 dark:bg-[#001c38] border border-slate-400 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] transition-all font-medium text-xs md:text-sm hover:border-slate-300 dark:hover:border-slate-500 text-slate-650 dark:text-slate-300 appearance-none">
                     <option value="" className="dark:bg-[#001428] dark:text-slate-300"><Trans>Pilih Sektor Industri...</Trans></option>
                     <option value="Teknologi" className="dark:bg-[#001428] dark:text-slate-300"><Trans>Teknologi & IT</Trans></option>
                     <option value="Pendidikan" className="dark:bg-[#001428] dark:text-slate-300"><Trans>Pendidikan</Trans></option>
                     <option value="Kesehatan" className="dark:bg-[#001428] dark:text-slate-300"><Trans>Kesehatan</Trans></option>
                     <option value="Keuangan" className="dark:bg-[#001428] dark:text-slate-300"><Trans>Perbankan & Keuangan</Trans></option>
                     <option value="Ritel" className="dark:bg-[#001428] dark:text-slate-300"><Trans>Ritel & E-Commerce</Trans></option>
                     <option value="Lainnya" className="dark:bg-[#001428] dark:text-slate-300"><Trans>Lainnya</Trans></option>
                   </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400"><Trans>Nama Perusahaan</Trans></label>
                  <input
                    required
                    name="company"
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#001c38] border border-slate-400 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium text-xs md:text-sm hover:border-slate-300 dark:hover:border-slate-500"
                    placeholder="PT Maju Bersama"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400"><Trans>Email Kantor</Trans></label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#001c38] border border-slate-400 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium text-xs md:text-sm hover:border-slate-300 dark:hover:border-slate-500"
                      placeholder="nama@perusahaan.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400"><Trans>Telepon Perusahaan</Trans></label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#001c38] border border-slate-400 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium text-xs md:text-sm hover:border-slate-300 dark:hover:border-slate-500"
                      placeholder="021..."
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400"><Trans>Alamat Perusahaan</Trans></label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                    <textarea 
                      ref={addressRef}
                      rows={1} 
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#001c38] border border-slate-400 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] placeholder-slate-400 dark:placeholder-slate-500 transition-all resize-none font-medium text-xs md:text-sm hover:border-slate-300 dark:hover:border-slate-500 overflow-hidden" 
                      placeholder="Jl. Sudirman No 1..." 
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400"><Trans>Link Maps / Lokasi</Trans></label>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        value={mapLink}
                        onChange={(e) => setMapLink(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#001c38] border border-slate-400 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium text-xs md:text-sm hover:border-slate-300 dark:hover:border-slate-500"
                        placeholder="https://maps.google.com/..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleGetCurrentLocation}
                      disabled={isLocating}
                      className="flex-shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-[#35ACDF]/10 dark:bg-[#35ACDF]/25 text-[#35ACDF] dark:text-[#52c1f0] font-bold text-xs md:text-sm rounded-xl hover:bg-[#35ACDF]/20 dark:hover:bg-[#35ACDF]/35 transition-colors disabled:opacity-50"
                    >
                      {isLocating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span><Trans>Mencari...</Trans></span>
                        </>
                      ) : (
                        <>
                          <Navigation className="w-4 h-4" />
                          <span><Trans>Gunakan Lokasi Saat Ini</Trans></span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Map Preview */}
                  <div className="w-full rounded-xl overflow-hidden border border-slate-400 dark:border-slate-600 shadow-sm mt-3 h-[250px] md:h-[350px] relative z-0">
                    <InteractiveMap 
                      position={mapCoordinates} 
                      onPositionChange={(pos) => {
                        updateLocationDetails(pos.lat, pos.lng);
                      }} 
                    />
                  </div>
                </div>
              </div>
            </div>
              
              <div className="flex justify-between pt-2 md:hidden">
                  <button type="button" onClick={() => setCurrentMobilePage(1)} className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button type="button" onClick={() => setCurrentMobilePage(3)} className="w-12 h-12 flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-[#35ACDF] rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                    <ChevronRight className="w-6 h-6" />
                  </button>
              </div>
            </div>

            {/* PAGE 4 */}
            <div className={`w-full space-y-6 md:space-y-8 ${currentMobilePage === 3 ? 'block' : 'hidden md:block'}`}>
              {/* Segment 4: Catatan */}
              <div className="space-y-3.5 md:space-y-4 md:pt-4">
              <div className="flex items-center gap-3 border-b border-gray-200 dark:border-slate-800 pb-2">
                <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-[#35ACDF]">
                  <AlertCircle className="w-3.5 h-3.5 text-[#35ACDF]" />
                </div>
                <h3 className="font-bold text-[#00172D] dark:text-white text-xs md:text-sm uppercase tracking-widest"><Trans>Detail Tambahan</Trans></h3>
              </div>
              
              <div className="space-y-3">
                <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400"><Trans>Ketertarikan Produk</Trans></label>
                
                {/* Search Bar */}
                <div className="relative z-10" ref={searchRef}>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#001c38] border border-slate-400 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium text-xs md:text-sm hover:border-slate-300 dark:hover:border-slate-500"
                      placeholder="Cari produk yang diminati..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsDropdownOpen(true)}
                    />
                  </div>

                  {/* Dropdown Results */}
                  <AnimatePresence>
                    {isDropdownOpen && searchQuery.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute w-full mt-2 bg-white dark:bg-[#001428] rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 max-h-[300px] overflow-y-auto"
                      >
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map(product => (
                            <div
                              key={product.id}
                              onClick={() => handleSelectProduct(product)}
                              className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer border-b border-slate-50 dark:border-slate-600/5 last:border-0 transition-colors flex flex-row items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg flex items-center justify-center p-1">
                                  {product.gambar && product.gambar.length > 0 ? (
                                    <img src={product.gambar[0]} alt={product.nama} className="w-full h-full object-contain" />
                                  ) : (
                                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-xs md:text-sm font-bold text-[#00172D] dark:text-slate-100 leading-tight">{product.nama}</p>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                {(product.harga_normal || product.harga_dasar) && (product.harga_promo || product.harga_satuan) && ((product.harga_promo || product.harga_satuan)! < (product.harga_normal || product.harga_dasar)!) ? (
                                  <div className="flex flex-col items-end">
                                    <p className="text-[9px] md:text-[10px] text-gray-400 dark:text-gray-500 font-bold mb-0.5">
                                      <span className="relative inline-block">
                                        <span className="absolute w-[110%] h-[1.5px] bg-red-500 left-[-5%] top-1/2 -translate-y-1/2 -rotate-[6deg]"></span>
                                        {formatCurrency(product.harga_normal || product.harga_dasar)}
                                      </span>
                                    </p>
                                    <p className="text-[10px] md:text-xs font-black text-[#00172D] dark:text-white tracking-tight">{formatCurrency(product.harga_promo || product.harga_satuan)}</p>
                                  </div>
                                ) : (
                                  <p className="text-[10px] md:text-xs font-black text-[#00172D] dark:text-white tracking-tight">{formatCurrency(product.harga_normal || product.harga_satuan || product.harga_dasar)}</p>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs md:text-sm text-center">
                            Produk tidak ditemukan
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Selected Products Chips */}
                {selectedProducts.length > 0 && (
                  <div className="flex flex-col gap-3 pt-3">
                    {selectedProducts.map((product) => (
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={product.id} 
                        className="flex items-center justify-between p-3 bg-white dark:bg-[#001c38]/80 border border-slate-400 dark:border-slate-600 rounded-xl shadow-sm relative group"
                      >
                         <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                            <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg flex items-center justify-center p-1">
                              {product.gambar && product.gambar.length > 0 ? (
                                <img src={product.gambar[0]} alt={product.nama} className="w-full h-full object-contain" />
                              ) : (
                                <div className="w-full h-full bg-slate-100 rounded"></div>
                              )}
                            </div>
                            <div className="overflow-hidden">
                               <p className="text-[11px] sm:text-xs md:text-sm font-bold text-[#00172D] dark:text-slate-100 leading-tight truncate px-1">{product.nama}</p>
                               <div className="mt-1 px-1">
                                {(product.harga_normal || product.harga_dasar) && (product.harga_promo || product.harga_satuan) && ((product.harga_promo || product.harga_satuan)! < (product.harga_normal || product.harga_dasar)!) ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] md:text-[10px] text-gray-400 font-bold inline-block">
                                      <span className="relative inline-block">
                                        <span className="absolute w-[110%] h-[1.5px] bg-red-500 left-[-5%] top-1/2 -translate-y-1/2 -rotate-[6deg]"></span>
                                        {formatCurrency(product.harga_normal || product.harga_dasar)}
                                      </span>
                                    </span>
                                    <span className="text-[10px] sm:text-[11px] md:text-xs font-black text-[#00172D] dark:text-[#52c1f0]">{formatCurrency(product.harga_promo || product.harga_satuan)}</span>
                                  </div>
                                ) : (
                                  <span className="text-[10px] sm:text-[11px] md:text-xs font-black text-[#00172D] dark:text-[#52c1f0]">{formatCurrency(product.harga_normal || product.harga_satuan || product.harga_dasar)}</span>
                                )}
                               </div>
                            </div>
                         </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(product.id)}
                          className="w-7 h-7 md:w-8 md:h-8 shrink-0 rounded-full bg-red-50 dark:bg-red-950/45 md:bg-white md:dark:bg-slate-900 md:border md:border-slate-100 md:dark:border-slate-600/5 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white md:hover:border-red-500 transition-colors"
                        >
                          <X className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400">Tujuan Meeting & Catatan</label>
                <textarea 
                  required 
                  name="purpose"
                  rows={3} 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#001c38] border border-slate-400 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] placeholder-slate-400 dark:placeholder-slate-500 transition-all resize-none font-medium text-xs md:text-sm hover:border-slate-300 dark:hover:border-slate-500" 
                  placeholder="Ceritakan singkat tujuan konsultasi Anda..." 
                />
              </div>
            </div>
            
            {conflictError && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-2 p-3 md:p-4 bg-red-50 text-red-600 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#35ACDF]" />
                {conflictError}
              </motion.div>
            )}

            <div className="pt-4 md:pt-6 flex flex-row items-center gap-3">
              <button
                type="button" 
                onClick={() => setCurrentMobilePage(2)} 
                className="w-14 items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors h-[50px] md:hidden flex shrink-0 border border-slate-200 dark:border-slate-700"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={status !== "idle" || !!conflictError}
                type="submit"
                className="w-full flex-1 py-4 bg-[#00172D] dark:bg-[#35ACDF] dark:hover:bg-[#48bceb] hover:bg-gray-900 text-white dark:text-slate-950 font-black uppercase tracking-widest text-[11px] md:text-xs rounded-xl shadow-xl shadow-[#00172D]/20 dark:shadow-[#35ACDF]/10 transition-all border border-transparent flex items-center justify-center h-[50px]"
              >
                {status === "idle" && "Konfirmasi Jadwalan"}
                {status === "loading" && <Loader2 className="w-5 h-5 animate-spin text-[#35ACDF]" />}
                {status === "success" && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#35ACDF]" /> Berhasil
                  </motion.div>
                )}
              </motion.button>
            </div>
          </div>
          </div>
          </form>
        </motion.div>
      </main>
      <BottomNavigation />
    </div>
  );
}
