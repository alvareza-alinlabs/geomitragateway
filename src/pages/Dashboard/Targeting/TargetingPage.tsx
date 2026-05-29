import { Trans } from "../../../lib/LanguageContext";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { motion } from "motion/react";
import {
  Target,
  TrendingUp,
  Calendar,
  Plus,
  ChevronRight,
  Package,
  AlertCircle,
  MoreVertical,
  Upload,
  FileText,
} from "lucide-react";
import { TargetData, ProductData } from "../../../types";
import { exportData, importData } from "../../../lib/exportUtils";

export default function TargetingPage() {
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const saved = localStorage.getItem("targeting_selected_year");
    return saved ? Number(saved) : new Date().getFullYear();
  });
  const [selectedStartMonth, setSelectedStartMonth] = useState<number>(() => {
    const saved = localStorage.getItem("targeting_selected_month");
    return saved ? Number(saved) : new Date().getMonth() + 1;
  });
  const [targets, setTargets] = useState<TargetData[]>([]);
  const [products, setProducts] = useState<Record<string, ProductData>>({});
  const [loading, setLoading] = useState(true);

  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setIsActionMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file, (data) => {
        if (data.length > 0) {
          const newTargets = data.map((item, idx) => {
            const id = item.id || `target-${Date.now()}-${idx}`;
            const bulan = Number(item.bulan) || 1;
            const tahun = Number(item.tahun) || new Date().getFullYear();
            const nilai_sasaran = Number(item.nilai_sasaran) || 0;
            let fokus_produk: string[] = [];
            if (typeof item.fokus_produk === 'string') {
              try {
                fokus_produk = JSON.parse(item.fokus_produk);
              } catch (_) {
                if (item.fokus_produk) {
                  fokus_produk = item.fokus_produk.split(',').map((s: string) => s.trim());
                }
              }
            } else if (Array.isArray(item.fokus_produk)) {
              fokus_produk = item.fokus_produk;
            }
            return { id, bulan, tahun, nilai_sasaran, fokus_produk };
          });

          setTargets(prev => {
            const combined = [...prev];
            newTargets.forEach(nt => {
              const idx = combined.findIndex(ct => ct.id === nt.id);
              if (idx !== -1) {
                combined[idx] = nt;
              } else {
                combined.push(nt);
              }
            });
            localStorage.setItem("targets", JSON.stringify(combined));
            return combined;
          });
        }
      });
    }
  };

  const handleExport = (type: "csv" | "json") => {
    const exportableTargets = targets.map(t => ({
      ...t,
      fokus_produk: JSON.stringify(t.fokus_produk)
    }));
    exportData(exportableTargets, "data_targeting", type);
  };

  const { setHeaderConfig } = useOutletContext<{
    setHeaderConfig: (config: any) => void;
  }>();

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const getTargetForMonthYear = (month: number, year: number) => {
    return targets.find((t) => t.tahun === year && t.bulan === month);
  };

  const rollingMonthsData = useMemo(() => {
    const months = [];
    let curMonth = selectedStartMonth;
    let curYear = selectedYear;

    for (let i = 0; i < 12; i++) {
      months.push({
        month: curMonth,
        year: curYear,
        monthName: monthNames[curMonth - 1],
        target: getTargetForMonthYear(curMonth, curYear),
      });

      curMonth++;
      if (curMonth > 12) {
        curMonth = 1;
        curYear++;
      }
    }
    return months;
  }, [targets, selectedYear, selectedStartMonth]);

  useEffect(() => {
    setHeaderConfig({
      title: "Targeting & Rolling Value",
      subjudul: `Periode 12 Bulan: ${monthNames[selectedStartMonth - 1]} ${selectedYear} sampai ${rollingMonthsData[11].monthName} ${rollingMonthsData[11].year}`,
      showBack: false,
      hideMobileActionsWrap: false,
      actions: (
        <>
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex bg-white dark:bg-[#00172D] p-1 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm shrink-0">
              <select
                value={selectedStartMonth}
                onChange={(e) => setSelectedStartMonth(Number(e.target.value))}
                className="bg-transparent px-3 py-1.5 text-xs font-black text-[#35ACDF] outline-none cursor-pointer uppercase tracking-widest dark:bg-[#00172D]"
              >
                {monthNames.map((n, i) => (
                  <option key={i} value={i + 1} className="dark:bg-[#00172D] dark:text-white">
                    {n}
                  </option>
                ))}
              </select>
              <div className="w-px h-4 bg-gray-100 dark:bg-white/10 my-auto mx-1" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent px-3 py-1.5 text-xs font-black text-gray-800 dark:text-white outline-none cursor-pointer dark:bg-[#00172D]"
              >
                {Array.from(
                  { length: 11 },
                  (_, i) => new Date().getFullYear() - 5 + i,
                ).map((y) => (
                  <option key={y} value={y} className="dark:bg-[#00172D] dark:text-white">
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <Link
              to="/dashboard/targeting/add"
              className="flex items-center justify-center gap-1.5 px-6 py-2.5 bg-[#35ACDF] text-white font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#2c91bd] transition-all shadow-lg shadow-[#35ACDF]/20 whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4 text-white" /><Trans>Tambah</Trans></Link>

            <div key="more" className="relative shrink-0" ref={actionMenuRef}>
              <button 
                onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                className="w-[38px] h-[38px] sm:w-[40px] sm:h-[40px] bg-white dark:bg-[#00172D] border border-gray-400 dark:border-slate-600 text-[#00172D] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-full shadow-sm transition-all flex items-center justify-center cursor-pointer relative z-50"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              {isActionMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={(e) => { e.stopPropagation(); setIsActionMenuOpen(false); }}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#00172D] border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl flex flex-col transition-all z-50">
                     <div className="px-4 py-2 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 bg-gray-50 dark:bg-slate-900/60"><Trans>Tindakan</Trans></div>
                     <button onClick={() => { fileInputRef.current?.click(); setIsActionMenuOpen(false); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-2 cursor-pointer w-full">
                       <Upload className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /><Trans>Import File</Trans></button>
                     <div className="px-4 py-2 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 bg-gray-50 dark:bg-slate-900/60"><Trans>Export Sebagai</Trans></div>
                     <button onClick={() => { handleExport('csv'); setIsActionMenuOpen(false); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-2 cursor-pointer w-full">
                        <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /><Trans>File CSV</Trans></button>
                     <button onClick={() => { handleExport('json'); setIsActionMenuOpen(false); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-widest flex items-center gap-2 cursor-pointer w-full">
                        <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /><Trans>File JSON</Trans></button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Actions Overlay (Rendered in Header's More Vertical) */}
          <div className="md:hidden flex flex-col w-full min-w-[160px] -m-1">
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 pb-2"><Trans>Tindakan</Trans></div>
            <button onClick={() => { fileInputRef.current?.click(); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 whitespace-nowrap tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-3 cursor-pointer">
              <Upload className="w-4 h-4 text-gray-400" /><Trans>Import File</Trans></button>
            <div className="px-3 py-2 mt-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 pb-2 border-t dark:border-slate-600/5"><Trans>Export Sebagai</Trans></div>
            <button onClick={() => { handleExport('csv'); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 whitespace-nowrap tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-3 cursor-pointer">
               <FileText className="w-4 h-4 text-gray-400" /><Trans>File CSV</Trans></button>
            <button onClick={() => { handleExport('json'); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 whitespace-nowrap tracking-widest flex items-center gap-3 cursor-pointer">
               <FileText className="w-4 h-4 text-gray-400" /><Trans>File JSON</Trans></button>
          </div>
        </>
      ),
    });
  }, [setHeaderConfig, selectedStartMonth, selectedYear, rollingMonthsData, isActionMenuOpen]);

  useEffect(() => {
    localStorage.setItem("targeting_selected_year", selectedYear.toString());
    localStorage.setItem(
      "targeting_selected_month",
      selectedStartMonth.toString(),
    );
  }, [selectedYear, selectedStartMonth]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await fetch("/data/products.json");
        const prodData: ProductData[] = await prodRes.json();
        const prodMap: Record<string, ProductData> = {};
        prodData.forEach((p) => {
          prodMap[p.id] = p;
        });
        setProducts(prodMap);

        // Load targets from JSON
        const targetRes = await fetch("/data/targeting.json");
        const jsonTargets: TargetData[] = await targetRes.json();

        // Load targets from localStorage
        const storedTargets = localStorage.getItem("targets");
        const localTargets: TargetData[] = storedTargets
          ? JSON.parse(storedTargets)
          : [];

        // Merge targets (prefer local for the same ID to simulate updates)
        const combined = [...jsonTargets];
        localTargets.forEach((lt) => {
          const idx = combined.findIndex((ct) => ct.id === lt.id);
          if (idx !== -1) {
            combined[idx] = lt;
          } else {
            combined.push(lt);
          }
        });

        setTargets(combined);
        setLoading(false);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculations based on rolling months
  const getVal = (idx: number) =>
    rollingMonthsData[idx]?.target?.nilai_sasaran || 0;

  const Q1 = getVal(0) + getVal(1) + getVal(2);
  const Q2 = getVal(3) + getVal(4) + getVal(5);
  const Q3 = getVal(6) + getVal(7) + getVal(8);
  const Q4 = getVal(9) + getVal(10) + getVal(11);

  const S1 = Q1 + Q2;
  const S2 = Q3 + Q4;
  const YTotal = S1 + S2;

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="animate-pulse bg-gray-200 h-10 w-64 rounded-xl"></div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white h-24 rounded-2xl border border-gray-100 shadow-sm"
            ></div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white h-48 rounded-2xl border border-gray-100 shadow-sm"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Filters (Moved here for mobile friendliness) */}
      <div className="flex w-full md:hidden">
        <div className="flex w-full bg-gray-50 dark:bg-[#000A15] p-1.5 rounded-xl border border-gray-200 dark:border-slate-600/5 shadow-sm shrink-0 justify-between">
          <select
            value={selectedStartMonth}
            onChange={(e) => setSelectedStartMonth(Number(e.target.value))}
            className="flex-1 w-1/2 bg-transparent px-2 py-2 text-[10px] font-black text-[#35ACDF] outline-none cursor-pointer uppercase tracking-widest text-center"
          >
            {monthNames.map((n, i) => (
              <option key={i} value={i + 1} className="bg-white text-gray-900 dark:bg-[#000A15] dark:text-white text-left font-bold text-xs uppercase tracking-widest">
                {n}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="flex-1 w-1/2 bg-transparent px-2 py-2 text-[10px] font-black text-gray-800 dark:text-white outline-none cursor-pointer uppercase tracking-widest text-center"
          >
            {Array.from(
              { length: 11 },
              (_, i) => new Date().getFullYear() - 5 + i,
            ).map((y) => (
              <option key={y} value={y} className="bg-white text-gray-900 dark:bg-[#000A15] dark:text-white text-left font-bold text-xs uppercase tracking-widest">
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#35ACDF] p-5 rounded-2xl border border-white/10 shadow-lg shadow-[#35ACDF]/20 relative overflow-hidden group text-white">
          <div className="relative z-10">
            <p className="text-[9px] uppercase font-bold text-white/80 tracking-widest mb-1"><Trans>TOTAL ROLLING 12 BLN</Trans></p>
            <p className="text-xl font-black text-white">
              {formatRupiah(YTotal)}
            </p>
          </div>
          <div className="absolute right-[-10px] bottom-[-10px] opacity-20 group-hover:scale-110 transition-transform duration-500 pointer-events-none text-white">
            <Target className="w-24 h-24" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#00172D] p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest mb-1">
              SEMESTER AWAL (6 Bln)
            </p>
            <p className="text-xl font-black text-gray-900 dark:text-white">
              {formatRupiah(S1)}
            </p>
          </div>
          <div className="absolute right-[-10px] bottom-[-10px] opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
            <TrendingUp className="w-24 h-24 text-gray-900" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#00172D] p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest mb-1">
              SEMESTER AKHIR (6 Bln)
            </p>
            <p className="text-xl font-black text-gray-900 dark:text-white">
              {formatRupiah(S2)}
            </p>
          </div>
          <div className="absolute right-[-10px] bottom-[-10px] opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
            <TrendingUp className="w-24 h-24 text-gray-900" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#00172D] p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-bold text-gray-900 dark:text-white">
            <div className="flex justify-between">
              <span className="text-gray-400 dark:text-gray-300"><Trans>P1-3</Trans></span>{" "}
              <span className="text-gray-900 dark:text-white">{formatRupiah(Q1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 dark:text-gray-300"><Trans>P4-6</Trans></span>{" "}
              <span className="text-gray-900 dark:text-white">{formatRupiah(Q2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 dark:text-gray-300"><Trans>P7-9</Trans></span>{" "}
              <span className="text-gray-900 dark:text-white">{formatRupiah(Q3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 dark:text-gray-300"><Trans>P10-12</Trans></span>{" "}
              <span className="text-gray-900 dark:text-white">{formatRupiah(Q4)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-start md:hidden">
        <Link
          to="/dashboard/targeting/add"
          className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#35ACDF] text-white font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#2c91bd] transition-all shadow-md shadow-[#35ACDF]/20 shrink-0"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" /><Trans>Tambah Target</Trans></Link>
      </div>

      {/* Grid of Months */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {rollingMonthsData.map((item, idx) => {
          const { month, year, monthName, target } = item;

          if (!target) {
            return (
              <div
                key={`${year}-${month}`}
                className="bg-gray-50 border border-dashed border-gray-200 rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col items-center justify-center text-center space-y-2 md:space-y-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all group"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-lg md:rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-[#35ACDF]">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-gray-500 line-clamp-1">
                    {monthName}
                  </p>
                  <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {year}
                  </p>
                </div>
                <Link
                  to={`/dashboard/targeting/add?month=${month}&year=${year}`}
                  className="text-[8px] md:text-[10px] font-black text-[#35ACDF] bg-blue-50 px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg border border-blue-100 mt-1 block"
                ><Trans>SETUP</Trans></Link>
              </div>
            );
          }

          return (
            <Link
              key={idx}
              to={`/dashboard/targeting/detail/${target.id}`}
              className="group bg-white dark:bg-[#00172D] rounded-xl md:rounded-2xl border border-gray-200 dark:border-slate-800 p-3 md:p-5 hover:border-[#35ACDF] dark:hover:border-[#35ACDF]/50 hover:shadow-xl hover:shadow-[#35ACDF]/5 transition-all flex flex-col relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-3 md:mb-6">
                <div className="overflow-hidden pr-1">
                  <h3 className="font-black text-gray-900 dark:text-white text-xs md:text-sm tracking-tight truncate">
                    {monthName}
                  </h3>
                  <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {year}
                  </p>
                </div>
                <div className="p-1 md:p-2 bg-gray-50 rounded-lg md:rounded-xl group-hover:bg-[#35ACDF] group-hover:text-white transition-colors shrink-0">
                  <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                </div>
              </div>

              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                <div>
                  <label className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5 md:mb-1"><Trans>Target Revenue</Trans></label>
                  <p className="text-sm md:text-lg font-black text-gray-900 dark:text-white leading-none truncate">
                    {formatRupiah(target.nilai_sasaran)}
                  </p>
                </div>

                <div>
                  <label className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1 md:mb-1.5 truncate">
                    Fokus ({(target.fokus_produk || []).length})
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {(target.fokus_produk || []).length > 0 ? (
                      (target.fokus_produk || []).slice(0, 1).map((pid, i) => (
                        <span
                          key={i}
                          className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter bg-gray-50 text-gray-500 px-1.5 md:px-1.5 py-0.5 rounded border border-gray-100 truncate max-w-[60px] md:max-w-[80px]"
                        >
                          {products[pid]?.nama || "Produk"}
                        </span>
                      ))
                    ) : (
                      <span className="text-[7px] md:text-[8px] italic text-gray-300"><Trans>Generic Focus</Trans></span>
                    )}
                    {(target.fokus_produk || []).length > 1 && (
                      <span className="text-[7px] md:text-[8px] font-black bg-[#35ACDF]/10 text-[#35ACDF] px-1 md:px-1.5 py-0.5 rounded border border-[#35ACDF]/20">
                        +{(target.fokus_produk || []).length - 1}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-3 md:pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-1.5">
                  <div
                    className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${target.nilai_sasaran > 0 ? "bg-green-500" : "bg-gray-200"}`}
                  />
                  <span className="text-[7px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest truncate">
                    {target.nilai_sasaran > 0 ? "Aktif" : "Draft"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImport} 
        accept=".csv,.json" 
        className="hidden" 
      />
    </div>
  );
}
