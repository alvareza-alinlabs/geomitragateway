import { Trans } from "../../../lib/LanguageContext";
import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  useOutletContext,
} from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  PackageSearch,
  Target,
  TrendingUp,
  Edit2,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  Plus,
  Tags,
  Info,
  ChevronRight,
} from "lucide-react";
import { ProductData } from "../../../types";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { setHeaderConfig } = useOutletContext<any>();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const [isEditing, setIsEditing] = useState(
    searchParams.get("edit") === "true",
  );
  const [formData, setFormData] = useState<Partial<ProductData>>({});

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch("/data/products.json");
        const data = await res.json();
        const found = data.find((p: ProductData) => p.id === id);
        if (found) {
          setProduct(found);
          setFormData(found);
          setShowVideo(!!found.video);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  useEffect(() => {
    setIsEditing(searchParams.get("edit") === "true");
  }, [searchParams]);

  useEffect(() => {
    if (product) {
      setHeaderConfig({
        title: isEditing ? `Edit ${product.nama}` : product.nama,
        subjudul: isEditing ? "Mode Edit Produk" : "Detail Produk & Performa",
        showBack: true,
      });
    }
  }, [product, isEditing, setHeaderConfig]);

  const toggleEdit = (status: boolean) => {
    if (status) {
      setSearchParams({ edit: "true" });
      setFormData(product || {});
    } else {
      setSearchParams({});
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      setProduct({ ...product, ...formData } as ProductData);
      toggleEdit(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      navigate("/dashboard/products");
    }
  };

  const updateSpec = (index: number, value: string) => {
    const newSpecs = [...(formData.spesifikasi || [])];
    newSpecs[index] = value;
    setFormData({ ...formData, spesifikasi: newSpecs });
  };

  const addSpec = () => {
    setFormData({
      ...formData,
      spesifikasi: [...(formData.spesifikasi || []), ""],
    });
  };

  const removeSpec = (index: number) => {
    const newSpecs = [...(formData.spesifikasi || [])];
    newSpecs.splice(index, 1);
    setFormData({ ...formData, spesifikasi: newSpecs });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...(formData.gambar || [])];
    newImages[index] = value;
    setFormData({ ...formData, gambar: newImages });
  };

  const addImage = () => {
    setFormData({ ...formData, gambar: [...(formData.gambar || []), ""] });
  };

  const removeImage = (index: number) => {
    const newImages = [...(formData.gambar || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, gambar: newImages });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#35ACDF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-black text-[#00172D] mb-4"><Trans>Produk tidak ditemukan</Trans></h2>
        <button
          onClick={() => navigate(-1)}
          className="text-[#35ACDF] font-bold hover:underline"
        ><Trans>Kembali</Trans></button>
      </div>
    );
  }

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pb-10"
    >
      {isEditing ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT AREA: EDIT FORM */}
          <div className="lg:col-span-2 space-y-6">
            <form
              id="edit-product-form"
              onSubmit={handleSave}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-[#00172D] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Trans>Nama / Model Produk</Trans></label>
                    <input
                      required
                      type="text"
                      value={formData.nama || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, nama: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Trans>Merek</Trans></label>
                      <select
                        required
                        value={formData.merek || "SecurX"}
                        onChange={(e) =>
                          setFormData({ ...formData, merek: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium"
                      >
                        <option value="SecurX"><Trans>SecurX</Trans></option>
                        <option value="SpectraVision"><Trans>SpectraVision</Trans></option>
                        <option value="GateKeep"><Trans>GateKeep</Trans></option>
                        <option value="ConnectLink"><Trans>ConnectLink</Trans></option>
                        <option value="Other"><Trans>Lainnya</Trans></option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Trans>Kategori</Trans></label>
                      <select
                        required
                        value={formData.kategori || "Security System"}
                        onChange={(e) =>
                          setFormData({ ...formData, kategori: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium"
                      >
                        <option value="Security System"><Trans>Security System</Trans></option>
                        <option value="CCTV"><Trans>CCTV</Trans></option>
                        <option value="Access Control"><Trans>Access Control</Trans></option>
                        <option value="IT Peripheral"><Trans>IT Peripheral</Trans></option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Trans>Deskripsi Produk</Trans></label>
                  <textarea
                    value={formData.deskripsi || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, deskripsi: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Harga Normal (IDR)
                    </label>
                    <input
                      required
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      min="0"
                      value={
                        formData.harga_normal || formData.harga_satuan || 0
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          harga_normal: Number(e.target.value),
                          harga_satuan: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Harga Dasar (Bottom) (IDR)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      min="0"
                      value={formData.harga_dasar || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          harga_dasar: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Harga Promo (IDR)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      min="0"
                      value={formData.harga_promo || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          harga_promo: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#00172D] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-black text-[#00172D] dark:text-white uppercase tracking-widest"><Trans>Spesifikasi Kunci</Trans></h3>
                  <button
                    type="button"
                    onClick={addSpec}
                    className="px-3 py-1.5 bg-blue-50 text-[#35ACDF] hover:bg-[#35ACDF] hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3 text-[#35ACDF]" /><Trans>Tambah</Trans></button>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {(!formData.spesifikasi ||
                      formData.spesifikasi.length === 0) && (
                      <div className="p-4 text-center text-xs text-gray-400 font-bold uppercase tracking-widest bg-gray-50 rounded-xl"><Trans>Belum ada spesifikasi</Trans></div>
                    )}
                    {formData.spesifikasi?.map((spec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={spec}
                          onChange={(e) => updateSpec(index, e.target.value)}
                          placeholder={`Spec ${index + 1}`}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpec(index)}
                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="bg-white dark:bg-[#00172D] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#35ACDF]" />
                    <h3 className="text-sm font-black text-[#00172D] uppercase tracking-widest"><Trans>Galeri Produk</Trans></h3>
                  </div>
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-3 py-1.5 bg-blue-50 text-[#35ACDF] hover:bg-[#35ACDF] hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3 text-[#35ACDF]" /><Trans>Tambah Image URL</Trans></button>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {(!formData.gambar || formData.gambar.length === 0) && (
                      <div className="p-4 text-center text-xs text-gray-400 font-bold uppercase tracking-widest bg-gray-50 rounded-xl"><Trans>Belum ada gambar</Trans></div>
                    )}
                    {formData.gambar?.map((img, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-2"
                      >
                        <input
                          type="url"
                          value={img}
                          onChange={(e) => updateImage(index, e.target.value)}
                          placeholder="https://..."
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] dark:focus:border-[#35ACDF] outline-none text-sm font-medium"
                        />
                        {img && (
                          <div className="w-12 h-10 shrink-0 border border-gray-400 dark:border-slate-600 rounded flex items-center justify-center overflow-hidden bg-white dark:bg-white/5">
                            <img
                              src={img}
                              alt="Preview"
                              className="max-w-full max-h-full object-cover"
                              onError={(e) =>
                                (e.currentTarget.style.display = "none")
                              }
                            />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT AREA: QUICK ACTIONS (EDIT MODE) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-3">
              <button
                type="submit"
                form="edit-product-form"
                className="w-full py-4 bg-[#00172D] hover:bg-gray-900 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4 text-[#35ACDF]" /><Trans>Simpan Perubahan</Trans></button>
              <button
                type="button"
                onClick={() => toggleEdit(false)}
                className="w-full py-3 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-200 dark:border-slate-600/20 text-gray-600 dark:text-gray-300 font-bold uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4 text-gray-400" /><Trans>Batalkan</Trans></button>
            </div>

            {/* Performa Penjualan (Removed as target is global now) */}
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white dark:bg-[#00172D] rounded-3xl p-6 md:p-10 border border-gray-200 dark:border-slate-800 shadow-sm">
          {/* Left Column: Image Area */}
          <div className="w-full lg:w-1/2 flex flex-col shrink-0">
            {/* Hero-like Full Width Main Image (1:1 Ratio) */}
            <div className="group relative w-full aspect-square bg-[#f8fafc] flex items-center justify-center overflow-hidden border border-gray-100 rounded-3xl shrink-0">
              {showVideo && product.video ? (
                <>
                 <video 
                    src={product.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-center" 
                 />
                  
                  {/* Gradient Overlay (Visible on Hover) - Mobile Only */}
                  <div className="lg:hidden absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  {/* Mini Gallery (Visible on Hover) - Mobile Only */}
                  {product.gambar && product.gambar.length > 0 && (
                    <div className="lg:hidden absolute bottom-6 right-6 z-10 flex gap-3 overflow-x-auto max-w-[calc(100vw-3rem)] px-2 py-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                      {product.gambar.map((img, iIdx) => (
                        <button
                          key={iIdx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImage(iIdx);
                            setShowVideo(false);
                          }}
                          className={`w-14 h-14 rounded-xl overflow-hidden transition-all duration-300 shrink-0 ${activeImage === iIdx && !showVideo ? "opacity-100 scale-110 shadow-2xl z-20 border-[#35ACDF] border-2" : "border-2 border-transparent opacity-40 hover:opacity-100 hover:scale-105"}`}
                        >
                          <img
                            src={img}
                            alt={`Thumb ${iIdx}`}
                            className="w-full h-full object-cover object-center"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : product.gambar && product.gambar.length > 0 ? (
                <>
                  <img
                    src={product.gambar[activeImage] || product.gambar[0]}
                    alt={product.nama}
                    className="w-full h-full object-cover md:object-contain object-center"
                  />

                  {/* Gradient Overlay (Visible on Hover) - Mobile Only */}
                  <div className="lg:hidden absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  {/* Mini Gallery (Visible on Hover) - Mobile Only */}
                  <div className="lg:hidden absolute bottom-6 right-6 z-10 flex gap-3 overflow-x-auto max-w-[calc(100vw-3rem)] px-2 py-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                    {product.gambar.map((img, iIdx) => (
                      <button
                        key={iIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImage(iIdx);
                        }}
                        className={`w-14 h-14 rounded-xl overflow-hidden transition-all duration-300 shrink-0 ${activeImage === iIdx ? "opacity-100 scale-110 shadow-2xl z-20 border-[#35ACDF] border-2" : "border-2 border-transparent opacity-40 hover:opacity-100 hover:scale-105"}`}
                      >
                        <img
                          src={img}
                          alt={`Thumb ${iIdx}`}
                          className="w-full h-full object-cover object-center"
                        />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <PackageSearch className="w-24 h-24 text-gray-300" />
              )}
            </div>

            {/* Desktop Static Mini Gallery below main image */}
            {product.gambar && product.gambar.length > 0 && (
              <div className="hidden lg:flex gap-4 mt-6 overflow-x-auto pb-2 px-1">
                {product.gambar.map((img, iIdx) => (
                  <button
                    key={iIdx}
                    onClick={() => {
                      setActiveImage(iIdx);
                      setShowVideo(false);
                    }}
                    className={`w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300 shrink-0 border-2 bg-[#f8fafc] ${activeImage === iIdx && !showVideo ? "border-[#35ACDF] shadow-md scale-105 opacity-100" : "border-transparent opacity-60 hover:opacity-100 hover:scale-105 hover:border-gray-200"}`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${iIdx}`}
                      className="w-full h-full object-cover lg:object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${product.merek === "HP Inc" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/10" : "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-500/10"}`}
                  >
                    {product.merek}
                  </span>
                  <span className="text-[10px] text-[#35ACDF] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-950/40 border border-transparent dark:border-slate-600/5 px-3 py-1.5 rounded-full">
                    {product.kategori} Enterprise
                  </span>
                </div>
                <h2 className="text-2xl lg:text-4xl font-black text-[#00172D] dark:text-white mb-2 leading-tight tracking-tight">
                  {product.nama}
                </h2>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                  ID Produk: {product.id}
                </p>
              </div>

              {/* Pricing Information */}
              <div className="bg-gray-50 dark:bg-[#001c38] rounded-3xl p-6 border border-gray-200 dark:border-slate-800 relative overflow-hidden shadow-sm w-full shrink-0">
                {product.harga_promo &&
                  product.harga_normal &&
                  product.harga_promo < product.harga_normal && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl z-10 shadow-sm"><Trans>Promo Eksklusif</Trans></div>
                  )}
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Tags className="w-4 h-4 text-[#35ACDF]" /><Trans>Harga Investasi</Trans></p>

                {product.harga_normal &&
                product.harga_promo &&
                product.harga_promo < product.harga_normal ? (
                  <div
                    className="mt-1 flex-1 min-w-0"
                    style={{ containerType: "inline-size" }}
                  >
                    <p
                      className="font-black text-[#00172D] dark:text-[#35ACDF] whitespace-nowrap tracking-tight"
                      style={{
                        fontSize: `clamp(1rem, ${100 / Math.max(10, formatCurrency(product.harga_promo).length * 0.55)}cqi, 1.875rem)`,
                      }}
                    >
                      {formatCurrency(product.harga_promo)}
                    </p>
                    <p className="text-sm text-gray-400 font-bold mt-1">
                      <span className="relative inline-block">
                        <span className="absolute w-[110%] h-[1.5px] bg-red-500 left-[-5%] top-1/2 -translate-y-1/2 -rotate-[6deg]"></span>
                        {formatCurrency(product.harga_normal)}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div
                    className="mt-1 flex-1 min-w-0"
                    style={{ containerType: "inline-size" }}
                  >
                    <p
                      className="font-black text-[#00172D] dark:text-[#35ACDF] whitespace-nowrap tracking-tight"
                      style={{
                        fontSize: `clamp(1rem, ${100 / Math.max(10, formatCurrency(product.harga_normal || product.harga_satuan).length * 0.55)}cqi, 1.875rem)`,
                      }}
                    >
                      {formatCurrency(
                        product.harga_normal || product.harga_satuan,
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={() => toggleEdit(true)}
                className="flex-1 py-3.5 bg-[#00172D] dark:bg-[#35ACDF] border border-[#00172D] dark:border-[#35ACDF] text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4 text-[#35ACDF] dark:text-white" /><Trans>Edit Produk</Trans></button>
              <button
                onClick={handleDelete}
                className="px-6 py-3.5 bg-white dark:bg-transparent border border-gray-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /><Trans>Hapus</Trans></button>
            </div>

            <div className="mb-10">
              <h3 className="text-[10px] lg:text-xs font-black text-[#00172D] dark:text-white uppercase tracking-widest mb-3 border-b border-gray-200 dark:border-slate-800 pb-2 flex items-center gap-2"><Trans>Deskripsi Produk</Trans></h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium whitespace-pre-wrap">
                {product.deskripsi ||
                  "Informasi deskripsi belum tersedia untuk produk ini."}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-[10px] lg:text-xs font-black text-[#00172D] dark:text-white uppercase tracking-widest mb-4 border-b border-gray-200 dark:border-slate-800 pb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#35ACDF]" /><Trans>Spesifikasi Utama</Trans></h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                {product.spesifikasi && product.spesifikasi.length > 0 ? (
                  product.spesifikasi.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#35ACDF]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <ChevronRight className="w-3 h-3 text-[#35ACDF]" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
                        {spec}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-gray-400 font-medium italic col-span-2"><Trans>Spesifikasi detail tidak tersedia.</Trans></span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
