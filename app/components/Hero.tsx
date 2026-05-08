"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, Heart, Camera } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const typewriterText = [
  "de forma unica!",
  "de forma especial",
  "de forma inesquecivel",
  "de forma romantica",
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = typewriterText[index];
    const typingSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentFullText.substring(0, displayText.length + 1));
        if (displayText.length + 1 === currentFullText.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentFullText.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % typewriterText.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index]);

  return (
    <section
      id="inicio"
      className="relative overflow-hidden pt-8 pb-20 md:pt-32 md:pb-32"
    >
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-purple/20 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-purple/10 blur-[100px] rounded-full -z-10" />

      <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-3 rounded-full border border-fuchsia-500/40 bg-[linear-gradient(90deg,rgba(88,10,58,0.95)_0%,rgba(33,10,48,0.95)_100%)] px-3 py-1 shadow-[0_0_30px_rgba(217,70,239,0.18)]"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.9)]" />
            <span className="text-[10px] font-black tracking-[0.18em] text-pink-200 uppercase">
              🌸 Dia das Mães
            </span>
            <span className="text-pink-400/70">-</span>
            <span className="text-[10px] font-black text-yellow-300 uppercase">
              ate 40% off
            </span>
          </motion.div>

          <h1
            style={{ fontFamily: "Georgia, serif" }}
            className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6"
          >
            <span className="truncate">
              {" "}
              Surpreenda sua mãe <br />
            </span>
            <span
              style={{ fontFamily: "'Playlist'" }}
              className="relative inline-block text-brand-purple min-w-[300px] text-6xl md:text-7xl py-2"
            >
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="inline-block w-[3px] h-[40px] md:h-[60px] bg-brand-purple ml-1 align-middle"
              />
              <motion.span
                layoutId="underline"
                className="absolute -bottom-1 left-0 w-full h-1 bg-brand-purple/30 rounded-full"
              />
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link href="/criar">
            <button className="w-full sm:w-auto bg-white text-black font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
              Surpreender agora
              <ArrowRight className="w-5 h-5" />
            </button>
            </Link>
              <Link href="/">
            <button className="w-full sm:w-auto bg-white text-black font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
              Ver Exemplo
              <ArrowRight className="w-5 h-5" />
            </button>
            </Link>
          </div>
          <div className="flex items-center gap-2 px-6 py-4">
            <div className="flex text-yellow-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-sm font-medium text-white/50 underline">
              4.9/5 (2k+ reviews)
            </span>
          </div>
        </div>

        {/* Right Content - Phone Mockup & Floating Badges */}
        <div className="relative flex justify-center lg:justify-end">
          {/* Mockup Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-[300px] h-[600px] bg-white border-[12px] border-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden glow-purple"
          >
            {/* Camera cutout */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-zinc-900 rounded-b-3xl" />

            {/* Inner Content Placeholder */}
            <div className="p-8 pt-16 h-full bg-linear-to-b from-zinc-50 to-zinc-200 flex flex-col items-center justify-center text-zinc-400">
              <Camera className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm text-center font-medium">Preview do App</p>
            </div>
          </motion.div>

          {/* Floating Badges */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -left-8 lg:-left-12 glass p-4 rounded-3xl shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-500 fill-current" />
              </div>
              <div>
                <p className="text-xs font-bold font-script text-pink-400 text-lg">
                  Eternize momentos
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">
                  Para sempre
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-12 -right-4 lg:-right-12 glass p-4 rounded-3xl shadow-2xl border-brand-purple/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-purple/20 rounded-full flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-brand-purple rounded-sm" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-widest">
                  QR Code
                </p>
                <p className="text-sm font-medium text-brand-purple">
                  Exclusivo
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
