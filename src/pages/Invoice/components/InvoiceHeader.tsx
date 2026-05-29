import React from 'react';
import { CreditCard, Mail, List, History, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface InvoiceHeaderProps {
  activeTab: string;
  onOpenPaymentModal: () => void;
}

export default function InvoiceHeader({ activeTab, onOpenPaymentModal }: InvoiceHeaderProps) {
  const navigate = useNavigate();
  
  const TabButton = ({ id, icon: Icon, mobileLabel, desktopLabel }: { id: string, icon: any, mobileLabel: string, desktopLabel: string }) => (
    <button
      onClick={() => navigate(`/invoice/${id}`)}
      className={`flex-1 flex items-center justify-center gap-2 px-2 py-3 sm:px-4 sm:py-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
        activeTab === id 
          ? 'border-[#0096D6] text-white bg-[#0096D6]/5' 
          : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
      }`}
    >
      <Icon size={18} />
      <span className="sm:hidden">{mobileLabel}</span>
      <span className="hidden sm:inline">{desktopLabel}</span>
    </button>
  );

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-[#0A192F]/90 backdrop-blur-md border-b border-[#1E2D3D] shadow-lg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors mr-1 sm:mr-2">
            <ArrowLeft size={20} />
          </Link>
          <img src="/gambar/alinlabs-logo.png" alt="Logo AlinLabs" className="h-6 w-auto object-contain hidden sm:block" />
          <div className="flex flex-col">
            <h1 className="text-sm sm:text-base font-bold text-white leading-tight">AlinLabs Indonesia</h1>
            <span className="text-[10px] text-[#0096D6]">Geo Mitra Gateway Developer</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenPaymentModal}
            className="text-xs font-semibold text-white bg-[#0096D6] hover:bg-[#007BB5] px-3 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-[#0096D6]/20"
          >
            <CreditCard size={12} className="sm:w-3 sm:h-3" />
            PayNow
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="flex w-full overflow-x-auto scrollbar-hide border-b border-[#1E2D3D]">
          <TabButton id="tagihan" icon={Mail} mobileLabel="Tagihan" desktopLabel="Surat Tagihan" />
          <TabButton id="rincian" icon={List} mobileLabel="Rincian" desktopLabel="Rincian Biaya" />
          <TabButton id="riwayat" icon={History} mobileLabel="Riwayat" desktopLabel="Riwayat Pembayaran" />
          <TabButton id="e-kontrak" icon={ShieldCheck} mobileLabel="E-Kontrak" desktopLabel="E-Kontrak (Ketentuan)" />
        </div>
      </div>
    </div>
  );
}
