"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Image as ImageIcon, Heart, Music, ArrowRight } from "lucide-react";
import { useState } from "react";

const slides = [
  {
    title: "Contador de Tempo",
    description: "Mostre o tempo exato que vocês compartilham, desde anos até segundos.",
    icon: Clock,
  },
  {
    title: "Galeria de Fotos",
    description: "Relembre os melhores momentos com uma galeria interativa e elegante.",
    icon: ImageIcon,
  },
  {
    title: "Mensagem Especial",
    description: "Expresse seus sentimentos com textos personalizados e declarações de amor.",
    icon: Heart,
  },
  {
    title: "Música do Casal",
    description: "Adicione a trilha sonora da sua história para tocar enquanto eles navegam.",
    icon: Music,
  },
];

export function ShowcaseCarousel() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((index + 1) % slides.length);
  const prev = () => setIndex((index - 1 + slides.length) % slides.length);

  return (
    <section id="vantagens" className="py-24 relative overflow-hidden bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 flex flex-col items-center">
        
        {/* Titles */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-4"
          >
            Crie uma página de amor <br />
            <span className="text-linear-to-r from-white via-brand-purple to-white bg-clip-text text-transparent">
              Totalmente Personalizada
            </span>
          </motion.h2>
          <p className="text-white/40 text-sm md:text-base">
            Use o assistente passo a passo para montar cada detalhe.
          </p>
        </div>

        {/* Active Feature Name */}
        <div className="text-center mb-12 h-32 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mb-4 text-brand-purple">
                {(() => {
                  const Icon = slides[index].icon;
                  return <Icon className="w-6 h-6" />;
                })()}
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">{slides[index].title}</h3>
              <p className="text-white/40 text-sm max-w-xs">{slides[index].description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full max-w-5xl flex items-center justify-center py-20">
          
          {/* Navigation Arrows */}
          <button 
            onClick={prev}
            className="absolute left-4 md:left-20 z-30 w-12 h-12 glass rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={next}
            className="absolute right-4 md:right-20 z-30 w-12 h-12 glass rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Phone Display with Drag Support */}
          <motion.div 
            className="flex items-center justify-center gap-4 md:gap-12 relative w-full h-[500px] cursor-grab active:cursor-grabbing select-none"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              const threshold = 50;
              if (info.offset.x < -threshold) next();
              else if (info.offset.x > threshold) prev();
            }}
          >
             {slides.map((_, i) => {
               const offset = i - index;
               // Handle wrapping for 3 phones logic
               let position = offset;
               if (offset > 1) position = offset - slides.length;
               if (offset < -1) position = offset + slides.length;

               const isActive = position === 0;
               const isVisible = Math.abs(position) <= 1;

               if (!isVisible) return null;

               return (
                 <motion.div
                   key={i}
                   animate={{
                     x: position * 280,
                     scale: isActive ? 1 : 0.8,
                     opacity: isActive ? 1 : 0.3,
                     rotateY: position * 15,
                     z: isActive ? 0 : -100,
                   }}
                   transition={{ type: "spring", stiffness: 300, damping: 30 }}
                   className={`absolute w-[240px] md:w-[280px] aspect-[9/19] rounded-[3rem] border-8 border-zinc-900 bg-white shadow-2xl overflow-hidden pointer-events-none ${!isActive ? 'blur-[2px]' : 'glow-purple'}`}
                 >
                   {/* Phone Content Placeholder */}
                   <div className="w-full h-full bg-linear-to-b from-zinc-100 to-zinc-300 flex items-center justify-center p-6">
                      <div className="w-full h-full border-2 border-dashed border-zinc-400/30 rounded-2xl flex items-center justify-center text-zinc-400 text-center px-4">
                        <p className="text-[10px] font-bold uppercase tracking-tighter opacity-30">
                          {slides[i].title} <br /> Page Preview
                        </p>
                      </div>
                   </div>
                 </motion.div>
               );
             })}
          </motion.div>
        </div>

        {/* Pagination & CTA */}
        <div className="flex flex-col items-center gap-12 mt-8">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 transition-all rounded-full ${index === i ? "w-8 bg-brand-purple" : "w-2 bg-white/10"}`}
              />
            ))}
          </div>

          <button className="bg-white text-black font-bold px-10 py-5 rounded-full flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            Criar meu presente
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
