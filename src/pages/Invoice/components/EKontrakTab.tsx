import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Download, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { RegularCard } from './RegularCard';
import { ekontrakData } from '../data/ekontrak';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const EKontrakTab = () => {
  const [showViewer, setShowViewer] = useState(false);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'scroll' | 'page'>('scroll');
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
           setContainerWidth(Math.max(entry.contentRect.width - 32, 200)); // 32 for padding
        }
      });
      resizeObserver.observe(node);
    }
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300">
        <div className="text-center flex flex-col items-center mb-8 bg-[#0F223A] p-6 rounded-xl border border-[#1E2D3D]">
          <ShieldCheck size={48} className="text-[#0096D6] mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2" dangerouslySetInnerHTML={{ __html: ekontrakData.header.title }}>
          </h2>
          <p className="text-sm text-gray-400 mb-6 max-w-2xl mx-auto">{ekontrakData.header.subtitle}</p>
          
          <div className="text-xs text-gray-500 space-y-1 mb-6">
              <p>Diterbitkan: {ekontrakData.header.publishDate}</p>
              <p>Nomor: {ekontrakData.header.documentNumber}</p>
              <p>Status: {ekontrakData.header.status}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowViewer(true)}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-[#152B46] hover:bg-[#1E3B5C] border border-[#1E2D3D] text-white rounded-lg transition-colors font-medium text-sm"
            >
              <Eye size={16} />
              <span>Lihat Dokumen</span>
            </button>
            <a
              href="/files/e-kontrak.pdf"
              download="E-Kontrak.pdf"
              className="flex items-center justify-center gap-2 px-6 py-2 bg-[#0096D6] hover:bg-[#007BB5] text-white rounded-lg transition-colors font-medium text-sm shadow-lg shadow-[#0096D6]/20"
            >
              <Download size={16} />
              <span>Unduh PDF</span>
            </a>
          </div>
        </div>

        <RegularCard className="bg-[#152B46] border border-[#1E2D3D]">
          <div className="p-6 sm:p-10 space-y-8 text-sm sm:text-base leading-relaxed text-justify">
            
            {/* MUKADIMAH */}
            <section>
              <p className="mb-4" dangerouslySetInnerHTML={{ __html: ekontrakData.mukadimah.intro }}></p>
              <ol className="list-decimal pl-5 space-y-4 text-gray-400 mb-4">
                <li>
                  <strong className="text-white">{ekontrakData.mukadimah.pihakPertama.nama}</strong>, mewakili <strong className="text-white">{ekontrakData.mukadimah.pihakPertama.mewakili}</strong>, dalam hal ini bertindak sebagai <span dangerouslySetInnerHTML={{ __html: ekontrakData.mukadimah.pihakPertama.peran }}></span>.
                </li>
                <li>
                  <strong className="text-white">{ekontrakData.mukadimah.pihakKedua.nama}</strong>, bertindak sebagai <strong>{ekontrakData.mukadimah.pihakKedua.mewakili}</strong>, <span dangerouslySetInnerHTML={{ __html: ekontrakData.mukadimah.pihakKedua.peran }}></span>.
                </li>
              </ol>
              <p className="border-l-4 border-[#0096D6] pl-4 italic text-xs sm:text-sm text-gray-400 bg-[#0F223A] p-3 rounded-r-lg" dangerouslySetInnerHTML={{ __html: ekontrakData.mukadimah.kesepakatan }}>
              </p>
            </section>

            {/* PASAL-PASAL */}
            {ekontrakData.pasal.map((pasalData, index) => {
              const [pasalNum, pasalTitle] = pasalData.title.split(' - ');
              return (
                <section key={index} className="scroll-mt-32">
                  <div className="mb-4 border-b border-[#1E2D3D] pb-3 text-center">
                    <div className="text-white font-bold mb-1 text-lg">
                      {pasalNum}
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {pasalTitle}
                    </h3>
                  </div>
                  
                  {pasalData.ayat.map((ayatItem, ayatIdx) => (
                    <div key={ayatIdx} className="mb-3 text-gray-300">
                      <div className="flex gap-3">
                        <span className="shrink-0 font-medium">{ayatItem.nomor}</span>
                        <span dangerouslySetInnerHTML={{ __html: ayatItem.teks }}></span>
                      </div>
                      {ayatItem.list && ayatItem.list.length > 0 && (
                        <ol className="list-[lower-alpha] pl-5 space-y-1 mt-2 text-gray-400 ml-8">
                          {ayatItem.list.map((listItem, listIdx) => {
                            const splitIdx = listItem.indexOf(':');
                            if (splitIdx !== -1 && splitIdx < 50) {
                               const boldPart = listItem.substring(0, splitIdx + 1);
                               const restPart = listItem.substring(splitIdx + 1);
                               return (
                                 <li key={listIdx}>
                                   <strong className="text-white">{boldPart}</strong><span dangerouslySetInnerHTML={{ __html: restPart }}></span>
                                 </li>
                               );
                            }
                            return <li key={listIdx} dangerouslySetInnerHTML={{ __html: listItem }}></li>;
                          })}
                        </ol>
                      )}
                    </div>
                  ))}
                </section>
              );
            })}

          </div>
        </RegularCard>
        
        <div className="bg-[#0096D6]/10 border border-[#0096D6]/30 rounded-xl p-4 sm:p-6 text-sm text-[#0096D6] font-medium text-center" dangerouslySetInnerHTML={{ __html: ekontrakData.footer }}>
        </div>
      </motion.div>

      <AnimatePresence>
        {showViewer && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm">
            {/* Overlay background for click-outside */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setShowViewer(false)}
            />
            
            <motion.div 
              initial={{ y: '100%', opacity: 0, scale: 1 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: '100%', opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full sm:w-[95vw] sm:max-w-6xl h-[90vh] sm:h-[95vh] bg-[#0F223A] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            >
               <div className="flex justify-between items-center p-4 border-b border-[#1E2D3D] bg-[#0F223A] z-10 shrink-0">
                 <div className="flex items-center gap-4">
                   <h3 className="font-semibold text-white">E-Kontrak.pdf</h3>
                   <a 
                     href="/files/e-kontrak.pdf" 
                     download="E-Kontrak.pdf"
                     className="flex items-center gap-2 text-xs bg-[#0096D6] hover:bg-[#007BB5] text-white px-3 py-1.5 rounded-md transition-colors"
                   >
                     <Download size={14} />
                     <span className="hidden sm:inline">Unduh PDF</span>
                   </a>
                   
                   <div className="hidden sm:flex items-center bg-[#152B46] rounded-lg p-1 border border-[#1E2D3D] ml-4">
                     <button
                       onClick={() => setViewMode('scroll')}
                       className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'scroll' ? 'bg-[#0F223A] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                     >
                       Scroll
                     </button>
                     <button
                       onClick={() => setViewMode('page')}
                       className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'page' ? 'bg-[#0F223A] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                     >
                       Page
                     </button>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="flex sm:hidden items-center bg-[#152B46] rounded-lg p-1 border border-[#1E2D3D] mr-2">
                     <button
                       onClick={() => setViewMode('scroll')}
                       className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'scroll' ? 'bg-[#0F223A] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                     >
                       Scroll
                     </button>
                     <button
                       onClick={() => setViewMode('page')}
                       className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'page' ? 'bg-[#0F223A] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                     >
                       Page
                     </button>
                   </div>
                   <button 
                    onClick={() => setShowViewer(false)} 
                    className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                   >
                     <X size={20} />
                   </button>
                 </div>
               </div>
               <div className="flex-1 w-full bg-[#1E2D3D] relative overflow-hidden flex flex-col items-center">
                  <div className="flex-1 w-full overflow-y-auto px-4 py-6 flex justify-center" ref={containerRef}>
                    <Document
                      file="/files/e-kontrak.pdf"
                      onLoadSuccess={onDocumentLoadSuccess}
                      className="flex flex-col items-center"
                      loading={
                        <div className="text-gray-400 mt-10">Memuat Dokumen...</div>
                      }
                      error={
                         <div className="text-red-400 mt-10 text-center">
                           <p>Gagal memuat dokumen.</p>
                           <p className="text-sm">Silakan unduh dokumen untuk melihat isinya.</p>
                         </div>
                      }
                    >
                      {viewMode === 'scroll' ? (
                        numPages ? (
                          Array.from(new Array(numPages), (el, index) => (
                            <div key={`page_${index + 1}`}>
                              <Page 
                                pageNumber={index + 1} 
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                className="max-w-full shadow-lg mb-6 last:mb-0"
                                width={containerWidth || undefined}
                              />
                            </div>
                          ))
                        ) : null
                      ) : (
                        <Page 
                          pageNumber={pageNumber} 
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                          className="max-w-full shadow-lg"
                          width={containerWidth || undefined}
                        />
                      )}
                    </Document>
                  </div>
                  
                  {/* PDF Navigation Controls */}
                  {viewMode === 'page' && numPages && numPages > 0 && (
                    <div className="bg-[#0F223A] w-full p-4 border-t border-[#1E2D3D] flex items-center justify-center gap-4 shrink-0">
                      <button
                        disabled={pageNumber <= 1}
                        onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="text-sm text-gray-300">
                        Halaman {pageNumber} dari {numPages}
                      </span>
                      <button
                        disabled={pageNumber >= numPages}
                        onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

