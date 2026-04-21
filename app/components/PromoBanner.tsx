"use client";

import { motion } from "framer-motion";

export function PromoBanner() {
  return (
    <div className="relative w-full bg-linear-to-r from-brand-purple/20 via-brand-purple/40 to-brand-purple/20 border-b border-white/10 py-2.5 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-4 text-xs md:text-sm font-medium tracking-wide"
      >
        <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-tighter">Oferta</span>
        <p className="flex items-center gap-2">
          Adquira com <span className="text-brand-purple font-bold">50% DESCONTO</span> por tempo limitado
        </p>
        <div className="hidden md:flex items-center gap-1.5 font-mono text-brand-purple bg-black/20 px-2 py-0.5 rounded">
          <span>00</span>:<span>45</span>:<span>12</span>
        </div>
      </motion.div>
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
    </div>
  );
}
