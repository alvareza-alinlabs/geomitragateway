import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Wallet, Check, X, Copy } from 'lucide-react';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  useLockBodyScroll(isOpen);

  const handleCopy = (text: string, bank: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(bank);
    setTimeout(() => setCopiedBank(null), 2000);
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#050B14]/80 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-2xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto bg-[#0A192F] border-t sm:border border-[#1E2D3D] rounded-t-2xl sm:rounded-xl shadow-2xl pointer-events-auto"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b border-[#1E2D3D] bg-[#0A192F]/90 backdrop-blur-md">
                <h3 className="text-lg sm:text-xl font-bold text-white">Tata Cara Pembayaran</h3>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                {/* Panduan Pembayaran */}
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
                    <CreditCard size={18} className="text-[#0096D6] sm:w-5 sm:h-5" />
                    Informasi Rekening
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Pembayaran dapat dilakukan melalui transfer ke rekening berikut ini. Mohon sertakan keterangan <strong className="text-white">INV-2024-001</strong> pada berita transfer.
                  </p>

                  <div className="space-y-4">
                    <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 flex justify-between items-center">
                      <div>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e2/Seabank_Indonesia.png" alt="SeaBank" className="h-6 sm:h-8 mb-2 object-contain" />
                        <p className="font-bold text-gray-900 text-sm sm:text-base">SeaBank</p>
                        <p className="font-mono text-base sm:text-lg text-gray-800">9013 8727 7710</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">a.n. Mela Melati Aprilia</p>
                      </div>
                      <button
                        onClick={() => handleCopy('901387277710', 'seabank')}
                        className={`flex items-center justify-center p-2 rounded transform transition-all active:scale-95 ${copiedBank === 'seabank' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        title="Salin Rekening"
                      >
                        {copiedBank === 'seabank' ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>

                    <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 flex justify-between items-center">
                      <div>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/Bank_BTN_logo.png" alt="BTN" className="h-6 sm:h-8 mb-2 object-contain" />
                        <p className="font-bold text-gray-900 text-sm sm:text-base">Bank Tabungan Negara (BTN)</p>
                        <p className="font-mono text-base sm:text-lg text-gray-800">3601 6100 1943 0</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">a.n. Alvareza Hilka Pratama</p>
                      </div>
                      <button
                        onClick={() => handleCopy('3601610019430', 'btn')}
                        className={`flex items-center justify-center p-2 rounded transform transition-all active:scale-95 ${copiedBank === 'btn' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        title="Salin Rekening"
                      >
                        {copiedBank === 'btn' ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1E2D3D]">
                  <a
                    href="https://wa.me/6281807000054?text=Halo%20Tim%20AlinLabs%2C%20saya%20telah%20melakukan%20pembayaran%20untuk%20Invoice%20saya.%20Berikut%20saya%20lampirkan%20bukti%20transfernya."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#0096D6] hover:bg-[#007BB5] text-white px-6 py-3 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Konfirmasi Pembayaran
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
