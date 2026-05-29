import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, ShoppingBag } from "lucide-react";
import { ClientData, ProductData, TransactionData, TransactionItem } from "../../../types";
import { CurrencyInput } from "../../../components/FormInputs";

export default function AddTransactionForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const { setHeaderConfig } = useOutletContext<{ setHeaderConfig: (config: any) => void }>();

  useEffect(() => {
    setHeaderConfig({
      title: isEdit ? "Edit Transaksi" : "Tambah Transaksi",
      subjudul: isEdit ? `Mengubah Transaksi ${id}` : "Catat Pembelian Baru dengan Multi Produk",
      showBack: true
    });
  }, [setHeaderConfig, isEdit, id]);

  const [formData, setFormData] = useState<Partial<TransactionData>>({
    status: "Selesai",
    jenis_pembelian: "Full Payment",
    barang: [],
    total_harga: 0
  });

  const [partners, setPartners] = useState<ClientData[]>([]);
  const [sales, setSales] = useState<ClientData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, partnersRes, prodRes, trxRes] = await Promise.all([
          fetch("/data/sales.json"),
          fetch("/data/partners.json"),
          fetch("/data/products.json"),
          fetch("/data/transactions.json")
        ]);

        const salesData: ClientData[] = await salesRes.json();
        setSales(salesData);

        const partnersData: ClientData[] = await partnersRes.json();
        setPartners([...salesData, ...partnersData]);

        const prodData: ProductData[] = await prodRes.json();
        setProducts(prodData);

        if (isEdit && id) {
          const trxData: TransactionData[] = await trxRes.json();
          const targetTrx = trxData.find(t => t.id === id);
          if (targetTrx) {
            setFormData(targetTrx);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [isEdit, id]);

  const recalculateTotal = (barang: TransactionItem[]) => {
    return barang.reduce((acc, item) => acc + ((item.harga_satuan || 0) * item.jumlah_unit), 0);
  };

  const handleAddItem = () => {
    if (products.length === 0) return;
    const newItem: TransactionItem = {
      id_produk: "",
      jumlah_unit: 1,
      harga_satuan: 0
    };
    setFormData(prev => ({ ...prev, barang: [...(prev.barang || []), newItem] }));
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...(formData.barang || [])];
    newItems.splice(index, 1);
    setFormData(prev => ({ ...prev, barang: newItems, total_harga: recalculateTotal(newItems) }));
  };

  const handleItemChange = (index: number, field: keyof TransactionItem, value: any) => {
    const newItems = [...(formData.barang || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'id_produk') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].harga_satuan = product.harga_satuan;
      }
    }
    
    setFormData(prev => ({ ...prev, barang: newItems, total_harga: recalculateTotal(newItems) }));
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.barang || formData.barang.length === 0) {
      alert("Tambahkan minimal 1 produk ke dalam transaksi.");
      return;
    }
    if (typeof window !== "undefined" && (window as any).clearAppCache) (window as any).clearAppCache();
    navigate("/dashboard/transactions");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-6 pb-10"
    >
      <div className="bg-white dark:bg-[#00172D] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pilih Partner / PIC</label>
              <select required value={formData.id_mitra || ""} onChange={e => setFormData({...formData, id_mitra: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium cursor-pointer dark:text-gray-100">
                <option value="" disabled>-- Pilih Partner --</option>
                {partners.map(p => (
                  <option key={p.id} value={p.id}>{p.perusahaan} ({p.nama_penanggung_jawab})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#35ACDF] uppercase tracking-widest">Sales Tanggung Jawab</label>
              <select value={formData.id_penjual || ""} onChange={e => setFormData({...formData, id_penjual: e.target.value})} className="w-full px-4 py-3 bg-blue-50/50 dark:bg-[#35ACDF]/5 border border-blue-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium cursor-pointer dark:text-gray-100">
                <option value="">-- Tanpa Sales Internal --</option>
                {sales.map(s => (
                  <option key={s.id} value={s.id}>{s.nama_penanggung_jawab} ({s.provinsi})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6 pb-2 border-t border-gray-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#35ACDF]" />
                <h3 className="text-sm font-black text-[#00172D] uppercase tracking-widest">Daftar Produk</h3>
              </div>
              <button type="button" onClick={handleAddItem} className="px-4 py-2 bg-blue-50 dark:bg-[#35ACDF]/10 text-[#35ACDF] hover:bg-[#35ACDF] hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4 text-[#35ACDF]" /> Tambah Produk
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {(!formData.barang || formData.barang.length === 0) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 border-2 border-dashed border-gray-200 dark:border-slate-600/10 rounded-2xl text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Belum ada produk. Klik tambah produk.</p>
                  </motion.div>
                )}
                {formData.barang?.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-800"
                  >
                    <div className="space-y-1 md:col-span-5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Produk {index + 1}</label>
                      <select required value={item.id_produk} onChange={e => handleItemChange(index, "id_produk", e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium cursor-pointer text-gray-800 dark:text-gray-100">
                        <option value="" disabled>-- Pilih--</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.nama}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jumlah Unit</label>
                      <input required type="text" inputMode="numeric" pattern="[0-9]*" value={item.jumlah_unit || ""} onChange={e => handleItemChange(index, "jumlah_unit", Number(e.target.value))} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium text-gray-800 dark:text-gray-100" />
                    </div>
                    <div className="space-y-1 md:col-span-4">
                      <label className="text-[10px] font-bold text-[#35ACDF] uppercase tracking-widest">Harga / Unit (Rp)</label>
                      <CurrencyInput required value={item.harga_satuan || 0} onChange={val => handleItemChange(index, "harga_satuan", val)} className="w-full px-4 py-3 bg-blue-50 dark:bg-[#35ACDF]/5 border border-blue-100 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-[#35ACDF]/50 outline-none text-sm font-medium dark:text-gray-100" />
                    </div>
                    <div className="md:col-span-1 flex justify-center pb-1">
                      <button type="button" onClick={() => handleRemoveItem(index)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors">
                        <Trash2 className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="mt-4 flex justify-end">
              <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl flex items-center justify-between w-full md:w-1/2">
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total Keseluruhan</span>
                <span className="text-xl font-black text-[#00172D] dark:text-white">
                  Rp {(formData.total_harga || 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-slate-800">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Metode Pembelian</label>
              <select required value={formData.jenis_pembelian || "Full Payment"} onChange={e => setFormData({...formData, jenis_pembelian: e.target.value as any})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium cursor-pointer dark:text-gray-100">
                <option value="Full Payment">Full Payment</option>
                <option value="Termin">Termin</option>
                <option value="Sewa">Sewa / DaaS</option>
                <option value="Trial">Trial / PoC</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Transaksi</label>
              <select required value={formData.status || "Selesai"} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-400 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium cursor-pointer dark:text-gray-100">
                <option value="Selesai">Selesai</option>
                <option value="Proses">Proses</option>
                <option value="Batal">Batal</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-slate-800 mt-6">
             <button type="button" onClick={() => { if (typeof window !== "undefined" && (window as any).clearAppCache) (window as any).clearAppCache(); navigate(-1); }} className="px-6 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 font-bold uppercase tracking-widest text-xs rounded-xl transition-all">
               Batal
             </button>
             <button type="submit" className="px-6 py-3 bg-[#00172D] dark:bg-[#35ACDF] hover:bg-[#004A7D] dark:hover:bg-[#48bceb] text-white dark:text-slate-900 font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all flex items-center gap-2">
               <Save className="w-4 h-4 text-[#35ACDF] dark:text-slate-900" /> {isEdit ? "Simpan Perubahan" : "Simpan Transaksi"}
             </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
