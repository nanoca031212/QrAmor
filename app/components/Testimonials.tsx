"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Bru & Manu",
    content: "Achei q ia ser difícil de fazer mas é mó de boa. A música de fundo deu mó clima 😍",
  },
  {
    name: "Fe & Gi",
    content: "O QR Code funcionou direitinho no jantar. Foi o ponto alto da noite, vlw msm!",
  },
  {
    name: "Dani & Lice",
    content: "Cara, mt foda. É uma parada q fica pra sempre, tlgd? Não é que nem presente q acaba ou quebra.",
  },
  {
    name: "Dedé & Lena",
    content: "Sem palavras... ficou mto profissa! Parece q paguei uma fortuna pra um designer fazer.",
  },
  {
    name: "Nick",
    content: "Impressionante. O combo perfeito para surpreender.",
  },
  {
    name: "Fer & Sah",
    content: "Eu tava sem ideia do q dar e isso salvou meu namoro kkkk brincadeira, mas ajudou mto!",
  },
  {
    name: "Will & Carol",
    content: "Aquele contador de tempo é hipnotizante. A gnt fica olhando os segundos passarem juntinhos.",
  },
  {
    name: "Leo & Bia",
    content: "Nossa primeira viagem registrada para sempre juntas. Amei cada detalhe!",
  },
];

export function Testimonials() {
  return (
    <section id="avaliacoes" className="py-24 relative overflow-hidden bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-20">
          
          {/* Avatar Cluster Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 shadow-xl"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-800" />
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <div className="flex text-yellow-500">
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
              </div>
              <span>4.9 <span className="text-white/40 font-normal">de +10.000 casais</span></span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6 text-balance"
          >
            Histórias reais. <span className="text-brand-purple">Emoções de verdade.</span>
          </motion.h2>

          <p className="text-white/50 text-sm md:text-base max-w-2xl mb-12">
            Mais de 10.000 casais já eternizaram suas histórias. Veja o que eles estão dizendo.
          </p>

          {/* Rating Breakdown Bars */}
          <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            {[
              { label: "5 estrelas", percent: 91, color: "bg-brand-purple" },
              { label: "4 estrelas", percent: 7, color: "bg-white/20" },
              { label: "3 ou menos", percent: 2, color: "bg-white/10" },
            ].map((bar, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[10px] uppercase font-bold text-white/40 whitespace-nowrap">{bar.label}</span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${bar.percent}%` }}
                    className={`h-full ${bar.color}`}
                  />
                </div>
                <span className="text-[10px] font-bold text-white/60">{bar.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="relative p-6 rounded-[2rem] bg-[#1a1a1a]/40 border border-white/5 hover:border-brand-purple/20 transition-all duration-500 overflow-hidden group"
            >
              <Quote className="absolute -top-4 -right-4 w-16 h-16 text-white/[0.03] group-hover:text-brand-purple/5 transition-colors rotate-12" />
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10" />
                <div>
                  <h4 className="text-sm font-bold">{review.name}</h4>
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-white/60 text-xs leading-relaxed italic relative z-10">
                "{review.content}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
