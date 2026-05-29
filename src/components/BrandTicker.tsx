import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface BrandTickerProps {
  items: string[];
}

export default function BrandTicker({ items }: BrandTickerProps) {
  // If no items, we don't render anything
  if (!items || items.length === 0) return null;

  // Duplicate items to ensure smooth infinite scroll
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="w-full overflow-hidden bg-white/50 dark:bg-white/5 backdrop-blur-sm border-t border-b border-gray-200 dark:border-slate-800 py-6 md:py-8 mt-12 mb-4 relative flex items-center">
      {/* Fade Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#F9FAFB] dark:from-[#000A15] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#F9FAFB] dark:from-[#000A15] to-transparent z-10 pointer-events-none"></div>

      <motion.div
        className="flex gap-12 md:gap-24 whitespace-nowrap px-6"
        animate={{
          x: ["0%", "-33.333333%"],
        }}
        transition={{
          duration: 30, // Adjust speed here
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {duplicatedItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center grayscale dark:invert-[0.25] opacity-50 dark:opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 pointer-events-auto"
          >
            <span className="text-sm md:text-lg font-black tracking-widest text-[#00172D] dark:text-gray-300 uppercase font-sans">
              {item}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
