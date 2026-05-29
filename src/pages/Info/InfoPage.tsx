import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Code, Cpu, Server, Globe, Mail, Phone, Clock, FileText, Database, 
  Network, Github, LayoutGrid, ArrowLeft, ChevronDown, Layout, LayoutList
} from 'lucide-react';
import { infoData } from '../../data/info';
import { Link } from 'react-router-dom';

export default function InfoPage() {
  const [viewMode, setViewMode] = useState<'accordion' | 'tab'>('accordion');
  const [activeTab, setActiveTab] = useState('sistem');
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const sections = [
    {
      id: 'sistem',
      icon: Shield,
      title: 'Detail Sistem & Domain',
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-[#1E2D3D]">
            <span className="text-gray-400 text-sm sm:text-base">Versi Rilis</span>
            <span className="text-white font-medium bg-[#152B46] px-3 py-1 rounded-lg border border-[#1E2D3D] text-sm">
              v{infoData.appVersion}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#1E2D3D]">
            <span className="text-gray-400 text-sm sm:text-base">Custom Domain</span>
            <a href={`https://${infoData.productionDomain}`} target="_blank" rel="noreferrer" className="text-[#0096D6] hover:text-[#007BB5] font-medium text-sm sm:text-base transition-colors flex items-center gap-1">
              {infoData.productionDomain}
            </a>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#1E2D3D]">
            <span className="text-gray-400 text-sm sm:text-base">Vercel Edge</span>
            <a href={infoData.vercelDomain} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-500 font-medium text-sm sm:text-base transition-colors flex items-center gap-1">
              {infoData.vercelDomain.replace('https://', '')}
            </a>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#1E2D3D]">
            <span className="text-gray-400 text-sm sm:text-base">Repository Source</span>
            <a href={infoData.githubRepo} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white font-medium flex items-center gap-2 text-sm sm:text-base transition-colors">
              <Github size={16} />
              GitHub Source
            </a>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#1E2D3D]">
            <span className="text-gray-400 text-sm sm:text-base">Pengembang</span>
            <span className="text-white font-medium text-sm sm:text-base">{infoData.developer}</span>
          </div>
        </div>
      )
    },
    {
      id: 'teknologi',
      icon: Code,
      title: 'Teknologi',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {infoData.techStack.map((tech, idx) => (
            <div key={idx} className="bg-[#152B46] p-4 rounded-xl border border-[#1E2D3D] flex items-center gap-3">
              <div className="bg-[#0F223A] p-2 rounded-lg text-[#0096D6] shrink-0">
                <Code size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 truncate">{tech.name}</p>
                <p className="text-sm font-semibold text-white truncate">{tech.value}</p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'deployment',
      icon: LayoutGrid,
      title: 'Alur Deployment & Pengiriman',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoData.deploymentFlow.map((flow, idx) => (
            <div key={idx} className="bg-[#152B46] p-5 rounded-xl border border-[#1E2D3D] flex flex-col items-start gap-3 hover:border-[#0096D6]/50 transition-colors group">
              <div className="text-[#0096D6] font-bold text-sm bg-[#0096D6]/10 px-3 py-1.5 rounded-lg border border-[#0096D6]/20 group-hover:bg-[#0096D6]/20 transition-colors">
                {flow.step.split('.')[0]}
              </div>
              <div className="flex-1 mt-1">
                <p className="text-base font-semibold text-white mb-2">{flow.step.split('.')[1].trim()}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{flow.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'infrastruktur',
      icon: Network,
      title: 'Infrastruktur & Layanan Cloud',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {infoData.infrastructure.map((infra, idx) => (
            <div key={idx} className="bg-[#152B46] p-4 rounded-xl border border-[#1E2D3D] flex items-center gap-4">
              <div className="bg-[#0F223A] p-3 rounded-lg text-emerald-400 shrink-0">
                <Server size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 mb-0.5">{infra.name}</p>
                <p className="text-sm font-semibold text-white truncate">{infra.value}</p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'database',
      icon: Database,
      title: infoData.databaseMechanisms.title,
      content: (
        <div className="space-y-4">
          {infoData.databaseMechanisms.details.map((detail, idx) => (
            <div key={idx} className="flex gap-4 bg-[#152B46] p-4 rounded-xl border border-[#1E2D3D]">
              <div className="mt-1 shrink-0 bg-[#0096D6]/20 p-2 rounded-full h-fit">
                <div className="w-2 h-2 bg-[#0096D6] rounded-full"></div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{detail}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'email',
      icon: Mail,
      title: infoData.emailAutomations.title,
      content: (
        <div>
          <p className="text-sm text-gray-300 leading-relaxed mb-6 bg-[#152B46] p-4 rounded-xl border border-[#1E2D3D]">
            {infoData.emailAutomations.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {infoData.emailAutomations.accounts.map((account, idx) => (
              <div key={idx} className="bg-[#152B46] p-5 rounded-xl border border-[#1E2D3D]">
                <div className="text-amber-400 font-medium text-sm mb-3 flex items-center gap-2 bg-amber-400/10 w-fit px-3 py-1.5 rounded-lg border border-amber-400/20">
                  <Mail size={16} />
                  {account.email}
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{account.usage}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#0096D6]/10 border border-[#0096D6]/20 p-5 rounded-xl flex gap-3 items-start">
            <div className="text-[#0096D6] shrink-0 mt-0.5">
              <Globe size={20} />
            </div>
            <p className="text-sm text-blue-100 leading-relaxed">
              {infoData.emailAutomations.note}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'fitur',
      icon: FileText,
      title: 'Modul Utama & Fitur',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {infoData.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-4 bg-[#152B46] p-5 rounded-xl border border-[#1E2D3D] hover:border-[#0096D6]/40 transition-colors">
              <div className="bg-[#0096D6]/20 p-2 rounded-lg text-[#0096D6] shrink-0">
                <Clock size={16} />
              </div>
              <span className="text-sm text-gray-300 leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'kontak',
      icon: Phone,
      title: 'Pusat Layanan',
      content: (
        <div className="bg-gradient-to-br from-[#0096D6]/10 to-transparent border border-[#0096D6]/30 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#0096D6]/20 rounded-2xl flex items-center justify-center text-[#0096D6] mb-6 border border-[#0096D6]/30">
             <Phone size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Butuh Bantuan Lebih Lanjut?</h3>
          <p className="text-sm text-gray-400 mb-8 max-w-md">Hubungi kami untuk mendapatkan dukungan teknis atau konsultasi lebih lanjut terkait layanan sistem operasi Geo Mitra Gateway.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <a href={`https://${infoData.website}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 bg-[#152B46] hover:bg-[#1E2D3D] border border-[#1E2D3D] px-6 py-3 rounded-xl text-sm font-medium text-white transition-all hover:border-[#0096D6]/50">
              <Globe size={18} className="text-[#0096D6]" />
              Website
            </a>
            <a href={`mailto:${infoData.email}`} className="flex items-center justify-center gap-3 bg-[#152B46] hover:bg-[#1E2D3D] border border-[#1E2D3D] px-6 py-3 rounded-xl text-sm font-medium text-white transition-all hover:border-[#0096D6]/50">
              <Mail size={18} className="text-amber-400" />
              Email Support
            </a>
            <a href={`tel:${infoData.phone}`} className="flex items-center justify-center gap-3 bg-[#152B46] hover:bg-[#1E2D3D] border border-[#1E2D3D] px-6 py-3 rounded-xl text-sm font-medium text-white transition-all hover:border-[#0096D6]/50">
              <Phone size={18} className="text-emerald-400" />
              Telepon
            </a>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className={`min-h-[100dvh] bg-[#071324] font-sans selection:bg-[#0096D6] selection:text-white transition-all duration-300 pb-20 ${viewMode === 'tab' ? 'pt-36 lg:pt-40' : 'pt-28'}`}>
      
      {/* Sticky Header */}
      <div className="fixed top-0 inset-x-0 z-50 bg-[#0A192F]/90 backdrop-blur-md border-b border-[#1E2D3D] shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors bg-[#152B46] p-2 border border-[#1E2D3D] rounded-lg">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0F223A] border border-[#1E2D3D] rounded-xl flex items-center justify-center shadow-md hidden sm:flex">
                <Cpu size={24} className="text-[#0096D6]" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-base sm:text-lg font-bold text-white leading-tight">Informasi Sistem</h1>
                <span className="text-[10px] sm:text-xs text-[#0096D6] font-medium tracking-wide">Geo Mitra Gateway</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center bg-[#152B46] p-1 rounded-lg border border-[#1E2D3D] shadow-inner">
            <button 
              onClick={() => setViewMode('accordion')}
              className={`p-1.5 sm:p-2 sm:px-3 text-xs sm:text-sm font-medium flex items-center gap-1.5 rounded-md transition-all ${viewMode === 'accordion' ? 'bg-[#0096D6] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-[#1E2D3D]'}`}
              title="Card / Accordion Mode"
            >
              <LayoutList size={16} />
              <span className="hidden md:inline">Cards</span>
            </button>
            <button 
              onClick={() => setViewMode('tab')}
              className={`p-1.5 sm:p-2 sm:px-3 text-xs sm:text-sm font-medium flex items-center gap-1.5 rounded-md transition-all ${viewMode === 'tab' ? 'bg-[#0096D6] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-[#1E2D3D]'}`}
              title="Tab Mode"
            >
              <Layout size={16} />
              <span className="hidden md:inline">Tabs</span>
            </button>
          </div>
        </div>
        
        {/* Horizontal Scrollable Tabs when in Tab Mode */}
        {viewMode === 'tab' && (
          <div className="max-w-4xl mx-auto px-0 sm:px-6">
            <div className="flex w-full overflow-x-auto border-t border-[#1E2D3D] px-2 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
               {sections.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setActiveTab(s.id)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 sm:py-4 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                      activeTab === s.id
                        ? 'border-[#0096D6] text-[#0096D6] bg-[#0096D6]/5'
                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#152B46]'
                    }`}
                  >
                     <s.icon size={16} />
                     {s.title}
                  </button>
               ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6">
        {/* Intro */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="text-sm sm:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed border border-[#1E2D3D] bg-[#0F223A] p-4 sm:p-6 rounded-2xl shadow-lg">
            {infoData.description}
          </p>
        </motion.div>

        {/* Content Area */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {viewMode === 'accordion' ? (
              <motion.div 
                key="accordion-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-4"
              >
                {sections.map((section, index) => {
                  const isOpen = !!openAccordions[section.id];
                  return (
                    <motion.div 
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-[#0F223A] rounded-2xl border border-[#1E2D3D] overflow-hidden shadow-lg hover:border-[#0096D6]/30 transition-colors"
                    >
                      <button 
                        onClick={() => toggleAccordion(section.id)}
                        className="w-full flex items-center justify-between p-5 sm:p-6 cursor-pointer bg-[#0F223A] hover:bg-[#152B46] transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-xl transition-all duration-300 ${isOpen ? 'bg-[#0096D6] text-white shadow-md shadow-[#0096D6]/20 flex-shrink-0' : 'bg-[#152B46] text-[#0096D6] flex-shrink-0'}`}>
                            <section.icon size={22} />
                          </div>
                          <h3 className={`text-base sm:text-lg font-bold text-left transition-colors ${isOpen ? 'text-white' : 'text-gray-200'}`}>
                            {section.title}
                          </h3>
                        </div>
                        <div className={`bg-[#152B46] p-1.5 rounded-lg text-gray-400 transition-all duration-300 flex-shrink-0 ml-4 ${isOpen ? 'rotate-180 bg-[#0096D6]/10 text-[#0096D6]' : ''}`}>
                          <ChevronDown size={20} />
                        </div>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="p-5 sm:p-6 pt-0 border-t border-[#1E2D3D] mt-2 bg-[#0A192F]/30 bg-opacity-50">
                              {section.content}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div 
                key="tab-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-[#0F223A] rounded-2xl border border-[#1E2D3D] shadow-xl p-6 sm:p-8 min-h-[400px]"
              >
                <div className="mb-8 flex items-center gap-3 pb-4 border-b border-[#1E2D3D]">
                  <div className="bg-[#0096D6]/20 p-2.5 rounded-xl text-[#0096D6]">
                    {React.createElement(sections.find(s => s.id === activeTab)?.icon || Shield, { size: 24 })}
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {sections.find(s => s.id === activeTab)?.title}
                  </h2>
                </div>
                {sections.find(s => s.id === activeTab)?.content}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center text-xs text-gray-500"
        >
          <p>{infoData.license}</p>
        </motion.div>

      </div>
    </div>
  );
}

