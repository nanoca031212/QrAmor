"use client";

import { motion } from "framer-motion";
import { Zap, Star, Shield } from "lucide-react";

export function DemoSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative bg-[#1a0b3c]/20 border border-white/5 rounded-[3rem] p-8 md:p-20 overflow-hidden group">
          
          {/* Decorative side phones (Desktop) */}
          <div className="hidden lg:block absolute left-[-100px] top-1/2 -translate-y-1/2 w-[300px] h-[500px] bg-zinc-900 rounded-[3rem] border-8 border-zinc-800 shadow-2xl rotate-[-10deg] overflow-hidden opacity-40 group-hover:opacity-100 transition-opacity duration-700">
             <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                {/* Couple image placeholder */}
                <div className="w-full h-full bg-linear-to-b from-zinc-700 to-zinc-900" />
             </div>
          </div>

          <div className="hidden lg:block absolute right-[-100px] top-1/2 -translate-y-1/2 w-[300px] h-[500px] bg-zinc-900 rounded-[3rem] border-8 border-zinc-800 shadow-2xl rotate-[10deg] overflow-hidden opacity-40 group-hover:opacity-100 transition-opacity duration-700">
             <div className="w-full h-full bg-zinc-900 p-6 flex flex-col gap-4">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4">Linha do Tempo</p>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                      className="aspect-square bg-white/5 rounded-lg border border-white/10"
                    />
                  ))}
                </div>
             </div>
          </div>

          {/* Central Content */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-brand-purple/20 border border-brand-purple/30 px-4 py-1.5 rounded-full mb-8"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-purple">
                Nova Experiência
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
              Teste Nossa <br />
              <span className="text-white/40">página de</span> <br />
              <span className="bg-gradient-to-r from-brand-purple to-blue-400 bg-clip-text text-transparent">
                Demonstração
              </span>
            </h2>

            <p className="text-white/50 text-lg md:text-xl max-w-xl mb-12 leading-relaxed">
              Veja na prática como sua declaração pode se tornar uma <span className="text-white font-medium">experiência inesquecível</span>.
            </p>

            <button className="group relative px-10 py-5 rounded-full bg-zinc-950 border border-white/20 text-white font-bold transition-all hover:border-brand-purple hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] overflow-hidden">
              <div className="absolute inset-0 bg-brand-purple/0 group-hover:bg-brand-purple/10 transition-colors" />
              <span className="relative z-10">Testar Agora</span>
            </button>

            {/* Sparkles icons from design */}
            <Zap className="absolute top-0 right-0 md:right-20 w-8 h-8 text-brand-purple/20 blur-[1px]" />
            <Star className="absolute bottom-10 left-0 md:left-20 w-6 h-6 text-blue-400/20 blur-[1px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
