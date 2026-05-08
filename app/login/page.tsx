"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#09090b]">
      {/* Background gradients */}
      <div className="absolute left-[-88px] top-24 h-[280px] w-[280px] rounded-full bg-fuchsia-500/28 blur-[95px] -z-20 animate-pulse md:top-0 md:left-1/4 md:h-[500px] md:w-[500px] md:bg-brand-purple/20 md:blur-[120px]" />
      <div className="absolute bottom-[-70px] right-[-50px] h-[260px] w-[260px] rounded-full bg-violet-500/20 blur-[100px] -z-10 md:bottom-0 md:right-1/4 md:h-[400px] md:w-[400px] md:bg-brand-purple/10 md:blur-[100px]" />

      <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-xl border border-[#522541] bg-[#1a0b1e]/80 backdrop-blur-md shadow-2xl relative z-10 mx-4">
        <Link
          href="/"
          className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 transition-colors hover:bg-white/10"
        >
          <ArrowLeft size={16} />
        </Link>
        
        <div className="flex flex-col items-center mb-8 mt-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">Acesse sua Conta</h1>
          <p className="text-sm text-white/60 text-center px-2 sm:px-4">
            Entre ou crie uma conta para salvar e gerenciar suas páginas.
          </p>
        </div>

        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-3 rounded-md bg-white/5 border border-white/10 px-4 py-3 sm:py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuar com Google
        </button>

        <div className="relative my-6 flex items-center py-2">
          <div className="flex-grow border-t border-[#311539]"></div>
          <span className="mx-4 flex-shrink-0 text-xs font-semibold text-white/30 uppercase tracking-wider">
            OU CONTINUE COM
          </span>
          <div className="flex-grow border-t border-[#311539]"></div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-white">
            E-mail
          </label>
          <input
            type="email"
            placeholder="seu@email.com"
            className="w-full rounded-md border border-[#311539] bg-[#09030b] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#7B2654]"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-white">
            Senha
          </label>
          <input
            type="password"
            placeholder="Sua senha"
            className="w-full rounded-md border border-[#311539] bg-[#09030b] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#7B2654]"
          />
        </div>

        <div className="flex gap-4">
          <button className="flex-1 rounded-md bg-[#7411c4] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#610ea3]">
            Entrar
          </button>
          <button className="flex-1 rounded-md bg-[#422557] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#341d45]">
            Cadastrar
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-white/40 leading-relaxed">
            Ao continuar, você concorda com nossos<br />
            <Link href="/termos" className="underline hover:text-white/60">Termos de Serviço</Link> e <Link href="/privacidade" className="underline hover:text-white/60">Política de Privacidade</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
