"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Conte a sua história de amor",
    description: "Preencha os dados do seu relacionamento e escolha elementos únicos para surpreender sua pessoa amada.",
    number: "1",
  },
  {
    title: "Personalize cada detalhe",
    description: "Escolha suas fotos, adicione a música de vocês e escreva uma mensagem especial. É aqui que a mágica acontece!",
    number: "2",
  },
  {
    title: "Receba seu QR Code",
    description: "Após a finalização, você receberá o QR Code de acesso ao presente personalizado em poucos instantes.",
    number: "3",
  },
  {
    title: "Surpreenda com amor",
    description: "Compartilhe o QR Code e veja a emoção ao descobrir um presente que fala diretamente ao coração.",
    number: "4",
  },
];

export function Steps() {
  return (
    <section id="como-funciona" className="py-24 relative overflow-hidden bg-linear-to-b from-zinc-950 via-[#1a0b3c]/30 to-zinc-950">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0%,transparent_70%)] -z-10" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-balance"
          >
            Crie um presente inesquecível em <br className="hidden md:block" />
            <span className="text-brand-purple">4 passos simples</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group h-full"
            >
              {/* Card Container */}
              <div className="h-full bg-[#13072e]/40 border border-white/5 rounded-[2.5rem] p-8 pt-16 text-center hover:border-brand-purple/30 transition-all duration-500 shadow-2xl backdrop-blur-sm">
                
                {/* Number Badge */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-brand-purple/30 z-20">
                  {step.number}
                </div>

                {/* Illustration Placeholder (Cupid) */}
                <div className="w-full aspect-square bg-[#1a0b3c]/50 rounded-3xl mb-8 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.2)_0%,transparent_70%)] animate-pulse" />
                   {/* This is where the Cupid image would go */}
                   <div className="w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                   <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold z-10">Cupid Art</p>
                </div>

                <h3 className="text-xl font-bold mb-4 leading-tight group-hover:text-brand-purple transition-colors">
                  {step.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
