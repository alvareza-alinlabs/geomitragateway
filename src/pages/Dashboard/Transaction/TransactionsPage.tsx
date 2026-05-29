import { Trans } from "../../../lib/LanguageContext";
import React, { useState, useEffect, useMemo, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Receipt, Search, Filter, TrendingUp, Coins, Package, CheckCircle2, Clock, BarChart3, PieChartIcon, Table as TableIcon, Download, Upload, Plus, X, Activity, Target, MoreVertical, FileText } from "lucide-react";
import { ClientData, ProductData, TransactionData, TargetData } from "../../../types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { exportData, importData } from "../../../lib/exportUtils";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";

import { useNavigate, useOutletContext } from "react-router-dom";

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [partners, setPartners] = useState<Record<string, ClientData>>({});
  const [products, setProducts] = useState<Record<string, ProductData>>({});
  const [loading, setLoading] = useState(true);
  
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

  const [searchQuery, setSearchQuery] = useState("");
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [filterPeriode, setFilterPeriode] = useState("Semua");
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");

  const [isAnalisisTransaksiOpen, setIsAnalisisTransaksiOpen] = useState(false);
  const [isAnalisisTargetOpen, setIsAnalisisTargetOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  useLockBodyScroll(isAnalisisTransaksiOpen || isAnalisisTargetOpen);

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<TransactionData>>({});

  const [sales, setSales] = useState<Record<string, ClientData>>({});
  const [targets, setTargets] = useState<TargetData[]>([]);

  const { setHeaderConfig } = useOutletContext<{ setHeaderConfig: (config: any) => void }>();

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const partner = partners[t.id_mitra];
      const product = products[t.id_produk];
      
      const matchSearch = (partner?.perusahaan || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (product?.nama || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.id.toLowerCase().includes(searchQuery.toLowerCase());
                    
      const matchJenis = filterJenis === "Semua" || (t.jenis_pembelian || "Full Payment") === filterJenis;
      
      let matchPeriode = true;
      if (filterPeriode === "3Bulan") {
        const txDate = new Date(t.tanggal);
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        matchPeriode = txDate >= threeMonthsAgo;
      } else if (filterPeriode === "BulanIni") {
        const txDate = new Date(t.tanggal);
        const now = new Date();
        matchPeriode = txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      }

      return matchSearch && matchJenis && matchPeriode;
    });
  }, [transactions, partners, products, searchQuery, filterJenis, filterPeriode]);

  useEffect(() => {
    setHeaderConfig({
      title: "Data Transaksi",
      subjudul: "Riwayat Order & Invoice Klien",
      showBack: false,
      actions: (
        <>
          {/* Desktop View Action Group */}
          <div className="hidden md:flex items-center gap-2 relative z-[9999]">
            <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-full p-1 shadow-sm h-[40px] shrink-0 flex">
              <button onClick={() => setViewMode("table")} className={`px-4 flex items-center justify-center gap-2 rounded-full transition-colors text-xs font-bold uppercase tracking-widest ${viewMode === "table" ? "bg-[#35ACDF] text-white shadow-md shadow-[#35ACDF]/30" : "text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"}`}>
                <TableIcon className={`w-3.5 h-3.5 ${viewMode === "table" ? "text-white" : "text-[#35ACDF]"}`} /><Trans>Tabel</Trans></button>
              <button onClick={() => setViewMode("chart")} className={`px-4 flex items-center justify-center gap-2 rounded-full transition-colors text-xs font-bold uppercase tracking-widest ${viewMode === "chart" ? "bg-[#35ACDF] text-white shadow-md shadow-[#35ACDF]/30" : "text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"}`}>
                <BarChart3 className={`w-3.5 h-3.5 ${viewMode === "chart" ? "text-white" : "text-[#35ACDF]"}`} /><Trans>Visual</Trans></button>
            </div>
            
            <div className="relative shrink-0" ref={actionMenuRef}>
              <button 
                onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                className="w-[40px] h-[40px] bg-white dark:bg-[#00172D] border border-gray-400 dark:border-slate-600 text-[#00172D] dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-slate-900/50 rounded-full shadow-sm transition-all flex items-center justify-center relative z-50"
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
                     <div className="px-4 py-2 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 bg-gray-50 dark:bg-slate-900/60"><Trans>Analisa Data</Trans></div>
                     <button onClick={(e) => { setIsAnalisisTransaksiOpen(true); setIsAnalyzing(true); setTimeout(() => setIsAnalyzing(false), 1500); setIsActionMenuOpen(false); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-2">
                       <Activity className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /><Trans>Analisa Transaksi</Trans></button>
                     <button onClick={(e) => { setIsAnalisisTargetOpen(true); setIsAnalyzing(true); setTimeout(() => setIsAnalyzing(false), 1500); setIsActionMenuOpen(false); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-2">
                       <Target className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /><Trans>Analisa Target</Trans></button>
                     <div className="px-4 py-2 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 bg-gray-50 dark:bg-slate-900/60"><Trans>Tindakan</Trans></div>
                     <button onClick={(e) => { fileInputRef.current?.click(); setIsActionMenuOpen(false); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-2">
                       <Upload className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /><Trans>Import File</Trans></button>
                     <div className="px-4 py-2 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 bg-gray-50 dark:bg-slate-900/60"><Trans>Export Sebagai</Trans></div>
                     <button onClick={(e) => { exportData(filteredTransactions, 'transaksi', 'csv'); setIsActionMenuOpen(false); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /><Trans>File CSV</Trans></button>
                     <button onClick={(e) => { exportData(filteredTransactions, 'transaksi', 'json'); setIsActionMenuOpen(false); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /><Trans>File JSON</Trans></button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile View Items inside DashboardHeader's Dropdown */}
          <div className="flex md:hidden flex-col w-full min-w-[160px] -m-1">
             <div className="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 pb-2"><Trans>Mode Tampilan</Trans></div>
             <div className="flex bg-gray-50 dark:bg-slate-900/60 rounded-lg p-1 mx-3 my-1 mt-2 items-center justify-between shadow-inner">
               <button onClick={() => { setViewMode("table"); }} className={`flex-1 py-1.5 flex items-center justify-center rounded-md transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-[#001c38] shadow-sm text-[#35ACDF]' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                 <TableIcon className="w-4 h-4" />
               </button>
               <button onClick={() => { setViewMode("chart"); }} className={`flex-1 py-1.5 flex items-center justify-center rounded-md transition-colors ${viewMode === 'chart' ? 'bg-white dark:bg-[#001c38] shadow-sm text-[#35ACDF]' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                 <BarChart3 className="w-4 h-4" />
               </button>
             </div>
             
             <div className="px-3 py-2 mt-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 pb-2 border-t dark:border-slate-600/5"><Trans>Analisa Data</Trans></div>
             <button onClick={(e) => { setIsAnalisisTransaksiOpen(true); setIsAnalyzing(true); setTimeout(() => setIsAnalyzing(false), 1500); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 whitespace-nowrap tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-3">
               <Activity className="w-4 h-4 text-gray-400 dark:text-gray-500" /><Trans>Analisa Transaksi</Trans></button>
             <button onClick={(e) => { setIsAnalisisTargetOpen(true); setIsAnalyzing(true); setTimeout(() => setIsAnalyzing(false), 1500); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 whitespace-nowrap tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-3">
               <Target className="w-4 h-4 text-gray-400 dark:text-gray-500" /><Trans>Analisa Target</Trans></button>
             
             <div className="px-3 py-2 mt-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 pb-2 border-t dark:border-slate-600/5"><Trans>Tindakan</Trans></div>
             <button onClick={(e) => { fileInputRef.current?.click(); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 whitespace-nowrap tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-3">
               <Upload className="w-4 h-4 text-gray-400 dark:text-gray-500" /><Trans>Import File</Trans></button>
             
             <div className="px-3 py-2 mt-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-600/5 pb-2 border-t dark:border-slate-600/5"><Trans>Export Sebagai</Trans></div>
             <button onClick={(e) => { exportData(filteredTransactions, 'transaksi', 'csv'); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 whitespace-nowrap tracking-widest border-b border-gray-50 dark:border-slate-600/5 flex items-center gap-3">
                <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500" /><Trans>File CSV</Trans></button>
             <button onClick={(e) => { exportData(filteredTransactions, 'transaksi', 'json'); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 whitespace-nowrap tracking-widest flex items-center gap-3">
                <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500" /><Trans>File JSON</Trans></button>
          </div>
        </>
      )
    });
  }, [setHeaderConfig, viewMode, isActionMenuOpen, filteredTransactions]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedTargets = localStorage.getItem("targets");
        if (storedTargets) {
          setTargets(JSON.parse(storedTargets));
        }
        
        const [salesRes, partnersRes, prodRes, transRes] = await Promise.all([
          fetch("/data/sales.json"),
          fetch("/data/partners.json"),
          fetch("/data/products.json"),
          fetch("/data/transactions.json")
        ]);

        const salesData: ClientData[] = await salesRes.json();
        const salesMap: Record<string, ClientData> = {};
        salesData.forEach(s => { salesMap[s.id] = s; });
        setSales(salesMap);

        const partnersData: ClientData[] = await partnersRes.json();
        const allPartners = [...salesData, ...partnersData];
        
        const partnerMap: Record<string, ClientData> = {};
        allPartners.forEach(p => { partnerMap[p.id] = p; });
        setPartners(partnerMap);

        const prodData: ProductData[] = await prodRes.json();
        const prodMap: Record<string, ProductData> = {};
        prodData.forEach(p => { prodMap[p.id] = p; });
        setProducts(prodMap);

        const transData: TransactionData[] = await transRes.json();
        setTransactions(transData);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);
  };



  const totalRevenue = filteredTransactions.filter(t => t.status === "Selesai").reduce((acc, t) => acc + t.total_harga, 0);
  const totalUnits = filteredTransactions.filter(t => t.status === "Selesai").reduce((acc, t) => {
    const barang = t.barang && t.barang.length > 0 ? t.barang : (t.id_produk ? [{ jumlah_unit: t.jumlah_unit || 1 }] : []);
    return acc + barang.reduce((sum, item) => sum + (item.jumlah_unit || 1), 0);
  }, 0);

  // Chart Data Preparation
  const chartData = useMemo(() => {
    const revenueByProduct: Record<string, number> = {};
    const unitsByProduct: Record<string, number> = {};
    const typeDistribution: Record<string, number> = {};

    filteredTransactions.filter(t => t.status === "Selesai").forEach(t => {
      const barang = t.barang && t.barang.length > 0 ? t.barang : (t.id_produk ? [{ id_produk: t.id_produk, jumlah_unit: t.jumlah_unit || 1, harga_satuan: t.total_harga / (t.jumlah_unit || 1) }] : []);

      barang.forEach((item: any) => {
        const pName = products[item.id_produk]?.nama || item.id_produk || "Unknown";
        const totalLinePrice = item.harga_total || (item.harga_satuan || 0) * item.jumlah_unit;
        
        revenueByProduct[pName] = (revenueByProduct[pName] || 0) + totalLinePrice;
        unitsByProduct[pName] = (unitsByProduct[pName] || 0) + item.jumlah_unit;
      });
      
      const type = t.jenis_pembelian || "Full Payment";
      typeDistribution[type] = (typeDistribution[type] || 0) + 1;
    });

    return {
      revenueByProduct: Object.entries(revenueByProduct).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5),
      unitsByProduct: Object.entries(unitsByProduct).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5),
      typeDistribution: Object.entries(typeDistribution).map(([name, value]) => ({ name, value }))
    };
  }, [filteredTransactions, products]);

  const COLORS = ['#35ACDF', '#f97316', '#10b981', '#6366f1', '#eab308'];

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file, (data) => {
        if (data.length > 0) {
          setTransactions(prev => [...prev, ...data]);
        }
      });
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const newTx = {
      ...formData,
      id: `TRX-${Date.now()}`,
      tanggal: new Date().toISOString().split("T")[0],
      jumlah_unit: Number(formData.jumlah_unit || 1),
      total_harga: Number(formData.total_harga || 0),
    } as TransactionData;
    
    setTransactions([newTx, ...transactions]);
    setIsAdding(false);
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Stats Summary - Title removed by request */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#00172D] p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 dark:border-slate-800 flex items-center gap-4 md:gap-6 relative overflow-hidden"
        >
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 dark:bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 z-10">
            <Coins className="w-6 h-6 md:w-8 md:h-8 text-[#35ACDF]" />
          </div>
          <div className="z-10 flex-1 min-w-0" style={{ containerType: 'inline-size' }}>
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Pendapatan (Selesai)</p>
            <p className="font-black text-[#00172D] dark:text-white whitespace-nowrap tracking-tight" style={loading ? {} : { fontSize: `clamp(1rem, ${100 / Math.max(10, formatCurrency(totalRevenue).length * 0.55)}cqi, 1.5rem)` }}>
              {loading ? "..." : formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <TrendingUp className="w-24 h-24 md:w-32 md:h-32 text-gray-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-[#00172D] p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 dark:border-slate-800 flex items-center gap-4 md:gap-6 relative overflow-hidden"
        >
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 dark:bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 z-10">
            <Package className="w-6 h-6 md:w-8 md:h-8 text-[#35ACDF]" />
          </div>
          <div className="z-10">
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Unit Terjual (Selesai)</p>
            <p className="text-xl md:text-2xl font-black text-[#00172D] dark:text-white">{loading ? "..." : (Number.isNaN(totalUnits) ? "0" : totalUnits)}</p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <Package className="w-24 h-24 md:w-32 md:h-32 text-gray-100" />
          </div>
        </motion.div>
      </div>

      {/* Transaction List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-[#00172D] rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-visible"
      >
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between md:items-center bg-gray-50/50 dark:bg-slate-900/40 relative z-20">
          <div className="flex gap-2 w-full md:w-auto flex-1">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari ID, Partner, atau Produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-24 py-2 w-full bg-white dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] shadow-sm text-xs font-medium transition-all h-[40px] text-gray-800 dark:text-gray-100"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="relative w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md transition-colors cursor-pointer group">
                  <Filter className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 group-hover:text-[#35ACDF]" />
                  <select
                    value={filterJenis}
                    onChange={(e) => setFilterJenis(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[1px]"
                  >
                    <option value="Semua" className="dark:bg-[#00172D]"><Trans>Semua Pembelian</Trans></option>
                    <option value="Full Payment" className="dark:bg-[#00172D]"><Trans>Full Payment</Trans></option>
                    <option value="Termin" className="dark:bg-[#00172D]"><Trans>Termin</Trans></option>
                    <option value="Sewa" className="dark:bg-[#00172D]"><Trans>Sewa / DaaS</Trans></option>
                    <option value="Trial" className="dark:bg-[#00172D]"><Trans>Trial / PoC</Trans></option>
                  </select>
                  {filterJenis !== "Semua" && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#35ACDF] rounded-full border-2 border-white dark:border-[#00172D]"></div>
                  )}
                </div>
                <div className="relative w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md transition-colors cursor-pointer group">
                  <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 group-hover:text-[#35ACDF]" />
                  <select
                    value={filterPeriode}
                    onChange={(e) => setFilterPeriode(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[1px]"
                  >
                    <option value="Semua" className="dark:bg-[#00172D]"><Trans>Semua Waktu</Trans></option>
                    <option value="BulanIni" className="dark:bg-[#00172D]"><Trans>Bulan Ini</Trans></option>
                    <option value="3Bulan" className="dark:bg-[#00172D]">3 Bulan Terakhir</option>
                  </select>
                  {filterPeriode !== "Semua" && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#35ACDF] rounded-full border-2 border-white dark:border-[#00172D]"></div>
                  )}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/dashboard/transactions/add')}
              className="w-[40px] h-[40px] md:w-auto px-0 md:px-4 shrink-0 bg-[#35ACDF] hover:bg-[#2c91bd] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-white" /> <span className="hidden md:inline"><Trans>Tambah</Trans></span>
            </button>
          </div>
        </div>

        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-800">
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400"><Trans>Tanggal & ID</Trans></th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Pembeli (Partner)</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400"><Trans>Total Harga</Trans></th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400"><Trans>Status</Trans></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm font-bold text-gray-400 uppercase tracking-widest"><Trans>Memuat data...</Trans></td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm font-bold text-gray-400 uppercase tracking-widest"><Trans>Tidak ada transaksi ditemukan</Trans></td>
                  </tr>
                ) : (
                  filteredTransactions.map((trx) => {
                    const partner = partners[trx.id_mitra];
                    let productNames = "-";
                    let discountGiven = 0;
                    let basePriceAcc = 0;
                    
                    const txItems = trx.barang && trx.barang.length > 0 ? trx.barang : (trx.id_produk ? [{ id_produk: trx.id_produk, jumlah_unit: trx.jumlah_unit || 1, harga_satuan: trx.total_harga / (trx.jumlah_unit || 1) }] : []);
                    const totalQty = txItems.reduce((acc, item) => acc + item.jumlah_unit, 0);
                    
                    if (txItems.length === 1) {
                        const product = products[txItems[0].id_produk];
                        productNames = product ? product.nama : "-";
                        const normalPrice = product ? (product.harga_normal || product.harga_satuan) : 0;
                        const basePrice = product ? (product.harga_dasar || product.harga_satuan * 0.9) : 0;
                        discountGiven = (normalPrice * txItems[0].jumlah_unit) - trx.total_harga;
                        basePriceAcc = basePrice * txItems[0].jumlah_unit;
                    } else if (txItems.length > 1) {
                        productNames = `${txItems.length} Produk Berbeda`;
                        txItems.forEach(item => {
                            const product = products[item.id_produk];
                            const normalPrice = product ? (product.harga_normal || product.harga_satuan) : 0;
                            const basePrice = product ? (product.harga_dasar || product.harga_satuan * 0.9) : 0;
                            discountGiven += (normalPrice * item.jumlah_unit) - ((item.harga_satuan || 0) * item.jumlah_unit);
                            basePriceAcc += basePrice * item.jumlah_unit;
                        });
                    }
                    
                    const marginValue = trx.total_harga - basePriceAcc;

                    return (
                        <tr key={trx.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => navigate(`/dashboard/transaction/${trx.id}`)}>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <div className="text-xs md:text-sm font-bold text-[#00172D] dark:text-white">{trx.tanggal}</div>
                          <div className="font-mono text-[9px] text-[#8C9BA5] mt-0.5">{trx.id}</div>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <div className="font-bold text-[#00172D] dark:text-white text-xs md:text-sm">{partner ? partner.perusahaan : "-"}</div>
                          <div className="text-[9px] md:text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">{partner ? partner.tipe : ""}</div>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 font-black text-[#00172D] dark:text-white text-xs md:text-sm">
                          {formatCurrency(trx.total_harga)}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          {trx.status === "Selesai" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                              <CheckCircle2 className="w-3 h-3 text-[#35ACDF]" /><Trans>Selesai</Trans></span>
                          ) : trx.status === "Proses" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-orange-50 text-orange-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                              <Clock className="w-3 h-3 text-gray-400" /><Trans>Proses</Trans></span>
                          ) : (
                             <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-50 text-red-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest"><Trans>Batal</Trans></span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 bg-white dark:bg-[#00172D]/40 rounded-b-2xl md:rounded-b-3xl">
            <div className="space-y-4">
              <h3 className="font-black text-[#00172D] dark:text-white text-base md:text-lg flex items-center gap-2">
                <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-[#35ACDF]" /> Pendapatan by Produk (Top 5)
              </h3>
              <div className="h-[250px] md:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.revenueByProduct}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} tickFormatter={(val) => val.length > 12 ? val.substring(0, 12) + '...' : val} />
                    <YAxis tickFormatter={(val) => `Rp${(val / 1000000).toFixed(0)}M`} tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                    <RechartsTooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" fill="#35ACDF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-black text-[#00172D] dark:text-white text-base md:text-lg flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 md:w-5 md:h-5 text-[#35ACDF]" /><Trans>Distribusi Metode Pembelian</Trans></h3>
              <div className="h-[250px] md:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.typeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.typeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Analisa Transaksi Modal */}
      <AnimatePresence>
        {isAnalisisTransaksiOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-4 bg-[#00172D]/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 50 }}
              className="w-full md:max-w-2xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto bg-white dark:bg-[#00172D] rounded-t-3xl md:rounded-3xl shadow-2xl p-5 md:p-8 relative border border-transparent dark:border-slate-600/5 scrollbar-hide"
            >
              <button 
                onClick={() => setIsAnalisisTransaksiOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-1.5 md:p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
              >
                <X className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              </button>
              
              <div className="flex items-center gap-3 mb-6 md:mb-8 border-b border-gray-200 dark:border-slate-800 pb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#35ACDF]">
                  <Activity className="w-4 h-4 md:w-5 md:h-5 text-[#35ACDF]" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-[#00172D] dark:text-white tracking-tight"><Trans>Analisa Transaksi</Trans></h2>
                  <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-0.5"><Trans>Performa & Tren Penjualan</Trans></p>
                </div>
              </div>

              {isAnalyzing ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-[#35ACDF]/20 border-t-[#35ACDF] rounded-full animate-spin"></div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-widest animate-pulse"><Trans>Memproses Data Transaksi...</Trans></p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-slate-800">
                    <h3 className="text-[10px] font-bold text-[#35ACDF] uppercase tracking-widest mb-2"><Trans>Ringkasan Eksekutif</Trans></h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Total transaksi terverifikasi berjumlah {filteredTransactions.length} dengan nilai omset mencapai {formatCurrency(totalRevenue)}.
                      Metode pembayaran "Full Payment" mendominasi penjualan aktif saat ini.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1"><Trans>Transaksi Tertinggi</Trans></p>
                      <p className="text-lg font-black text-[#00172D] dark:text-white break-words">
                        {filteredTransactions.length > 0 ? formatCurrency(Math.max(...filteredTransactions.map(t => t.total_harga))) : "Rp 0"}
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1"><Trans>Status Keberhasilan</Trans></p>
                      <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                        {((filteredTransactions.filter(t => t.status === "Selesai").length / (filteredTransactions.length || 1)) * 100).toFixed(0)}% Selesai
                      </p>
                    </div>
                  </div>

                  <div className="p-5 border border-gray-200 dark:border-slate-800 rounded-2xl">
                     <h3 className="text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-widest mb-4"><Trans>Pola Pemesanan Partner</Trans></h3>
                     <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                       <li className="flex items-start gap-2">
                         <CheckCircle2 className="w-4 h-4 text-[#35ACDF] shrink-0 mt-0.5 text-[#35ACDF]" /><Trans>Mayoritas volume perangkat keras diserap oleh distributor besar.</Trans></li>
                       <li className="flex items-start gap-2">
                         <CheckCircle2 className="w-4 h-4 text-[#35ACDF] shrink-0 mt-0.5 text-[#35ACDF]" />
                         Stabilitas pembayaran (Termin) lebih disukai oleh klien area Jabodetabek.
                       </li>
                     </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analisa Target Modal */}
      <AnimatePresence>
        {isAnalisisTargetOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-4 bg-[#00172D]/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 50 }}
              className="w-full md:max-w-2xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto bg-white dark:bg-[#00172D] rounded-t-3xl md:rounded-3xl shadow-2xl p-5 md:p-8 relative border border-transparent dark:border-slate-600/5 scrollbar-hide"
            >
              <button 
                onClick={() => setIsAnalisisTargetOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-1.5 md:p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
              >
                <X className="w-4 h-4 md:w-5 md:h-5 text-gray-400 dark:text-gray-550" />
              </button>
              
              <div className="flex items-center gap-3 mb-6 md:mb-8 border-b border-gray-200 dark:border-slate-800 pb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#35ACDF]">
                  <Target className="w-4 h-4 md:w-5 md:h-5 text-[#35ACDF]" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-[#00172D] dark:text-white tracking-tight"><Trans>Analisa Target</Trans></h2>
                  <p className="text-gray-500 dark:text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-0.5"><Trans>Evaluasi Capaian & Rekomendasi</Trans></p>
                </div>
              </div>

              {isAnalyzing ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-widest animate-pulse"><Trans>Menghitung Deviasi Target...</Trans></p>
                </div>
              ) : (
                <div className="space-y-6">
                  {(() => {
                      const currentYear = new Date().getFullYear();
                      const currentMonth = new Date().getMonth() + 1;
                      
                      const currentMonthTarget = targets.find(t => t.tahun === currentYear && t.bulan === currentMonth);
                      const targetValue = currentMonthTarget?.nilai_sasaran || 0;
                      
                      // Calculate total revenue for this month
                      const revenueThisMonth = transactions.filter(tx => {
                        const tg = new Date(tx.tanggal);
                        return tg.getFullYear() === currentYear && (tg.getMonth() + 1) === currentMonth;
                      }).reduce((acc, tx) => acc + ((tx.harga_satuan || 0) * tx.jumlah_unit), 0);

                      const percentAchieved = targetValue > 0 ? (revenueThisMonth / targetValue) * 100 : 0;
                      const isBehind = targetValue > 0 && revenueThisMonth < targetValue;
                      const formatRupiah = (num: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);

                      return (
                        <>
                          <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-slate-800">
                            <h3 className="text-[10px] font-bold text-[#35ACDF] uppercase tracking-widest mb-2">Evaluasi Momentum (Bulan Ini)</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                              {isBehind 
                                ? `Pencapaian revenue bulan ini masih tertinggal dari target yang ditetapkan. Diperlukan strategi pemasaran tambahan untuk mencapai target ${formatRupiah(targetValue)}.`
                                : targetValue > 0 
                                  ? `Pencapaian luar biasa! Revenue bulan ini telah melampaui atau sesuai target (${formatRupiah(targetValue)}).`
                                  : `Belum ada target yang di-set untuk bulan ini. Akses menu Targeting untuk konfigurasi.`}
                            </p>
                          </div>

                          {targetValue > 0 && (
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-widest"><Trans>Tindakan Prioritas Penjualan</Trans></h3>
                              
                              <div className="space-y-3">
                                <div className={`p-4 border ${isBehind ? 'border-red-100/10 dark:border-red-500/20 bg-gray-50 dark:bg-red-500/10' : 'border-green-100/10 dark:border-green-500/20 bg-green-50/50 dark:bg-green-500/10'} rounded-2xl`}>
                                  <div className="flex justify-between items-start mb-2">
                                    <p className="font-bold text-gray-800 dark:text-white"><Trans>Target Value Bulan Ini</Trans></p>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${isBehind ? 'bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-950/20 text-green-600 dark:text-green-400'}`}>
                                      {isBehind ? 'TARGET TERTINGGAL' : 'TARGET TERCAPAI'}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2"><Trans>Mencapai</Trans><b>{percentAchieved.toFixed(1)}%</b> dari target revenue ({formatRupiah(revenueThisMonth)} / {formatRupiah(targetValue)}).
                                  </p>
                                  <div className={`w-full bg-white dark:bg-white/5 rounded-full h-1.5 border ${isBehind ? 'border-red-100 dark:border-red-900' : 'border-green-100 dark:border-green-900'} overflow-hidden`}>
                                    <div className={`${isBehind ? 'bg-red-500' : 'bg-green-500'} h-1.5`} style={{ width: `${Math.min(100, percentAchieved)}%` }}></div>
                                  </div>
                                  {isBehind && (
                                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-3">
                                      Defisit: {formatRupiah(targetValue - revenueThisMonth)}
                                    </p>
                                  )}
                                </div>
 
                                {currentMonthTarget && currentMonthTarget.fokus_produk && currentMonthTarget.fokus_produk.length > 0 && (
                                  <div className="p-4 border border-blue-100/10 dark:border-blue-500/20 bg-blue-50/30 dark:bg-blue-500/10 rounded-2xl mt-4">
                                     <h4 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3"><Trans>Fokus Produk Bulan Ini</Trans></h4>
                                     <div className="space-y-2">
                                        {currentMonthTarget.fokus_produk.map((id: string) => (
                                            <div key={id} className="text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-800">
                                               {products[id]?.nama || 'Produk ID ' + id}
                                            </div>
                                        ))}
                                     </div>
                                     <p className="text-[10px] font-bold text-gray-500 mt-3 uppercase tracking-widest"><Trans>Arahkan partner untuk meningkatkan stok produk ini.</Trans></p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )
                  })()}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <input 
        type="file" 
        accept=".csv,.json" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleImport} 
      />
    </div>
  );
}
