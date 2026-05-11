"use client";

import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle2, Sparkles } from "lucide-react";

export default function RegistroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [paid, setPaid] = useState(false);
  const [userExists, setUserExists] = useState(false);

  // Busca email do comprador via session_id
  useEffect(() => {
    if (!sessionId) {
      setLoadingSession(false);
      return;
    }

    fetch(`/api/checkout/session?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.email) setEmail(data.email);
        if (data.customerName) setName(data.customerName);
        if (data.paid) setPaid(true);
        if (data.userExists) setUserExists(true);
      })
      .catch(() => {})
      .finally(() => setLoadingSession(false));
  }, [sessionId]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    if (userExists) {
      // Já existe, então apenas faz login
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      setLoading(false);
      if (result?.error) {
        setError("Senha incorreta. Verifique e tente novamente.");
      } else {
        router.push("/minhas-paginas");
      }
      return;
    }

    // Cadastra o usuário
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Se por algum motivo deu que já existe agora, tenta login
      if (res.status === 409) {
        const loginResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        setLoading(false);
        if (loginResult?.error) {
          setError("Conta já existente. Verifique sua senha.");
        } else {
          router.push("/minhas-paginas");
        }
        return;
      }
      setError(data.error || "Erro ao cadastrar. Tente novamente.");
      setLoading(false);
      return;
    }

    // Loga automaticamente
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/minhas-paginas");
    }
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-fuchsia-500 border-t-transparent animate-spin" />
          <p className="text-white/50 text-sm">Verificando pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#09090b] px-4">
      {/* Background gradients */}
      <div className="absolute left-[-88px] top-24 h-[280px] w-[280px] rounded-full bg-fuchsia-500/25 blur-[95px] -z-20 animate-pulse" />
      <div className="absolute bottom-[-70px] right-[-50px] h-[260px] w-[260px] rounded-full bg-violet-500/20 blur-[100px] -z-10" />

      <div className="w-full max-w-sm sm:max-w-md">
        {/* Success banner */}
        {paid && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5 animate-in slide-in-from-top-2 duration-500">
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-300">
                Pagamento confirmado! 🎉
              </p>
              <p className="text-xs text-emerald-400/70 mt-0.5">
                Agora crie sua conta para acessar sua página.
              </p>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-[#522541] bg-[#1a0b1e]/90 backdrop-blur-md shadow-2xl p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-7">
            <div className="relative mb-4">
              <img
                src="/Logo.png"
                alt="MyCupid"
                className="w-14 h-auto object-contain"
              />
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-fuchsia-500 flex items-center justify-center">
                <Sparkles size={10} className="text-white" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 text-center">
              {userExists ? "Você já tem uma conta!" : "Criar sua conta"}
            </h1>
            <p className="text-sm text-white/50 text-center">
              {userExists
                ? "Este e-mail já está cadastrado. Digite sua senha para entrar."
                : paid
                ? "Sua compra está garantida. Só falta criar a conta!"
                : "Cadastre-se para acessar sua página de amor."}
            </p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400 font-medium">
                {error}
              </div>
            )}

            {/* Nome - Esconde se o usuário já existe */}
            {!userExists && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-white">
                  Seu nome{" "}
                  <span className="text-white/30 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Como quer ser chamado?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#311539] bg-[#09030b] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#7B2654]"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-white">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-[#311539] bg-[#09030b] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#7B2654] disabled:opacity-60"
              />
              {paid && email && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-fuchsia-400/80">
                  <CheckCircle2 size={11} />
                  Email preenchido com os dados da sua compra
                </p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-white">
                {userExists ? "Sua senha" : "Criar senha"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#311539] bg-[#09030b] px-4 py-3 pr-11 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#7B2654]"
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

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-fuchsia-900/30 transition-all hover:scale-[1.02] hover:shadow-fuchsia-900/50 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Sparkles size={15} />
                  {userExists ? "Entrar e ver minha página" : "Criar conta e ver minha página"}
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-white/30 leading-relaxed">
            Já tem conta?{" "}
            <a href="/login" className="text-fuchsia-400 hover:text-fuchsia-300 underline">
              Fazer login
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
