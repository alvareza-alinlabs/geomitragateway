import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const AccordionCard = ({ icon: Icon, title, total, children, className = '', defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={`bg-[#0A192F] border border-[#1E2D3D] rounded-xl overflow-hidden ${className}`}>
      {/* HEADER CARD */}
      <div 
        className={`flex items-center justify-between p-4 sm:p-5 bg-[#0F223A] cursor-pointer hover:bg-[#152B46] transition-colors ${isOpen ? 'border-b border-[#1E2D3D]' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#0096D6]/10 text-[#0096D6] rounded-lg">
            <Icon size={24} />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white pr-2">{title}</h2>
        </div>
        
        <div className="flex items-center gap-3 text-gray-400">
          <div className="text-gray-400">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>
      
      {/* CONTENT LIST CARD */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-[#0A192F]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER TOTAL CARD */}
      {total && (
        <div className="flex items-center justify-between p-4 sm:p-5 bg-[#0F223A] border-t border-[#1E2D3D]">
          <p className="text-sm font-semibold text-gray-400">Sub Total Biaya</p>
          <p className="text-base sm:text-lg font-bold text-[#0096D6]">{total}</p>
        </div>
      )}
    </div>
  );
};
