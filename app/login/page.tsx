"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess("Login realizado com sucesso! Redirecionando...");
      router.push("/minhas-paginas");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Erro ao cadastrar. Tente novamente.");
      return;
    }

    setSuccess("Conta criada com sucesso! Fazendo login...");

    // Loga automaticamente após cadastro
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/minhas-paginas");
    }
  };

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

        <div className="flex flex-col items-center mb-6 mt-6">
          <img src="/Logo.png" alt="MyCupid" className="w-14 h-auto mb-3 object-contain" />
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 text-center">
            {mode === "login" ? "Acesse sua Conta" : "Criar Conta"}
          </h1>
          <p className="text-sm text-white/50 text-center">
            {mode === "login"
              ? "Entre para salvar e gerenciar suas páginas."
              : "Cadastre-se para criar sua primeira página."}
          </p>
        </div>



        <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="flex flex-col gap-4">
          {/* Erro em vermelho */}
          {error && (
            <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* Sucesso em verde */}
          {success && (
            <div className="rounded-md border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-400 font-medium">
              {success}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-white">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-[#311539] bg-[#09030b] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#7B2654]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-[#311539] bg-[#09030b] px-4 py-3 pr-11 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#7B2654]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              onClick={() => setMode("login")}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-[#7411c4] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#610ea3] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && mode === "login" ? <Loader2 size={16} className="animate-spin" /> : null}
              Entrar
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={() => setMode("register")}
              className="w-full flex items-center justify-center gap-2 rounded-md py-3 text-sm border border-white/30 hover:border-white/50 font-semibold text-white transition-colors hover:bg-black/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && mode === "register" ? <Loader2 size={16} className="animate-spin" /> : null}
              Cadastrar
            </button>
          </div>
        </form>

        <div className="mt-7 text-center">
          <p className="text-xs text-white/40 leading-relaxed">
            Ao continuar, você concorda com nossos<br />
            <Link href="/termos" className="underline hover:text-white/60">Termos de Serviço</Link> e{" "}
            <Link href="/privacidade" className="underline hover:text-white/60">Política de Privacidade</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
