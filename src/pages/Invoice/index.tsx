import React, { useEffect, useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useParams, Navigate } from 'react-router-dom';

import PaymentModal from './components/PaymentModal';
import InvoiceHeader from './components/InvoiceHeader';
import { SuratTagihanTab } from './components/SuratTagihanTab';
import { RincianBiayaTab } from './components/RincianBiayaTab';
import { RiwayatPembayaranTab } from './components/RiwayatPembayaranTab';
import { EKontrakTab } from './components/EKontrakTab';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';

export default function InvoicePage() {
  const { tab } = useParams();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [proofImage, setProofImage] = useState<string | null>(null);

  useLockBodyScroll(!!proofImage);

  useEffect(() => {
    document.title = 'Invoice & Tagihan Resmi';
  }, []);

  const validTabs = ['tagihan', 'rincian', 'riwayat', 'e-kontrak'];
  const activeTab = tab && validTabs.includes(tab) ? tab : 'tagihan';

  if (!tab || !validTabs.includes(tab)) {
    return <Navigate to="/invoice/tagihan" replace />;
  }

  return (
    <div className="min-h-screen bg-[#050B14] text-gray-300 font-sans selection:bg-[#0096D6]/30 selection:text-white pb-12 relative overflow-x-hidden">
      <InvoiceHeader 
        activeTab={activeTab} 
        onOpenPaymentModal={() => setIsPaymentModalOpen(true)} 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36">
        
        {/* TAB 1: SURAT PENGANTAR */}
        {activeTab === 'tagihan' && <SuratTagihanTab />}

        {/* TAB 2: RINCIAN BIAYA */}
        {activeTab === 'rincian' && <RincianBiayaTab />}

        {/* TAB 3: RIWAYAT PEMBAYARAN */}
        {activeTab === 'riwayat' && <RiwayatPembayaranTab setProofImage={setProofImage} />}

        {/* TAB 4: E-KONTRAK */}
        {activeTab === 'e-kontrak' && <EKontrakTab />}

      <footer className="text-center py-12 text-xs sm:text-sm text-gray-400 space-y-2">
        <p className="font-semibold text-gray-300">AlinLabs Indonesia</p>
        <p>Nagri Kidul, Purwakarta, Jawa Barat - 41111</p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <a href="https://www.alinlabs.biz.id" target="_blank" rel="noreferrer" className="hover:text-[#0096D6] transition-colors">
            www.alinlabs.biz.id
          </a>
          <span className="text-gray-600">|</span>
          <a href="mailto:office.alincorporation@gmail.com" className="hover:text-[#0096D6] transition-colors">
            office.alincorporation@gmail.com
          </a>
        </div>
        <div className="flex items-center justify-center gap-4 mt-1">
          <a href="https://wa.me/6281807000054" target="_blank" rel="noreferrer" className="hover:text-[#25D366] transition-colors">
            0818-070000-54
          </a>
        </div>
        <p className="mt-4 pt-4 border-t border-[#1E2D3D] max-w-sm mx-auto">
          © {new Date().getFullYear()} Hak Cipta Dilindungi.<br/>
          Tagihan Diterbitkan Secara Digital.
        </p>
      </footer>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
      />

      <AnimatePresence>
        {proofImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#050B14]/90 backdrop-blur-sm"
            onClick={() => setProofImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-3xl w-full max-h-[85vh] md:max-h-[90vh] flex flex-col bg-[#0A192F] rounded-xl overflow-hidden border border-[#1E2D3D] shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-[#1E2D3D] bg-[#0F223A]">
                <h3 className="font-bold text-white">Bukti Pembayaran</h3>
                <button onClick={() => setProofImage(null)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 overflow-auto flex justify-center bg-[#050B14]">
                 <img src={proofImage} alt="Bukti Transfer" className="max-w-full h-auto rounded" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
