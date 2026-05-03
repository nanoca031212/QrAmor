import {
  CheckCircle2,
  Puzzle,
  Gamepad2,
  HardDrive,
  Star,
  Users,
  ShieldCheck,
  ArrowRight,
  Lock,
  HeadphonesIcon,
  Hourglass,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function Planos() {
  return (
    <div id="planos" className="relative flex w-full flex-col items-center overflow-hidden bg-black py-24 text-white">

      {/* Header Badges and Titles */}
      <div className="relative z-10 mb-16 flex flex-col items-center px-4 text-center">
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-6">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-xs font-bold tracking-widest text-red-400 uppercase">
            Oferta por tempo limitado
          </span>
        </div>

        <h1 className="font-heading mb-4 max-w-3xl text-4xl font-bold leading-tight  md:text-5xl lg:text-5xl">
          Eternize sua história <br className="hidden md:block" />{" "}
          <span className="bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
            por menos de um lanche
          </span>
        </h1>

        <p className="text-sm md:text-base text-white/60 mb-8 max-w-xl">
          Escolha o plano certo e crie uma página que vai emocionar — em
          minutos.
        </p>

        {/* Social Proof */}
        <div className="flex flex-wrap justify-center items-center gap-4 text-xs md:text-sm text-white/70 font-medium mb-10">
          <div className="flex items-center gap-1.5">
            <div className="flex text-yellow-400">
              <Star className="fill-current w-4 h-4" />
              <Star className="fill-current w-4 h-4" />
              <Star className="fill-current w-4 h-4" />
              <Star className="fill-current w-4 h-4" />
              <Star className="fill-current w-4 h-4" />
            </div>
            <span>
              <strong className="text-white">4.9</strong> / 5 estrelas
            </span>
          </div>
          <span className="hidden md:block text-white/20">|</span>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-purple-400" />
            <span>
              <strong className="text-white">+10.000</strong> casais felizes
            </span>
          </div>
          <span className="hidden md:block text-white/20">|</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Garantia de 7 dias</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[11px] font-bold tracking-widest text-red-500 uppercase">
            Apenas 2 vagas com desconto restantes hoje
          </span>
        </div>
      </div>

      {/* Pricing Cards Container */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center gap-8 px-4 lg:flex-row lg:items-center lg:gap-10">
        {/* ===================== PLANO BÁSICO ===================== */}
        <div className="w-full lg:w-[400px] rounded-3xl bg-black border border-white/5 p-8 flex flex-col transition-all hover:border-white/10">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-1">Plano Básico</h3>
            <p className="text-sm text-white/50">
              Uma surpresa emocionante com prazo definido.
            </p>
          </div>

          <div className="flex items-start justify-center gap-1 mb-1">
            <span className="text-lg font-bold text-white/60 mt-1">R$</span>
            <span className="text-5xl font-black text-white">19</span>
            <span className="text-lg font-bold text-white mt-1">,90</span>
          </div>
          <p className="text-xs text-white/40 text-center mb-8">
            Pagamento único
          </p>

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm text-white/80">
                Galeria de fotos (até 10 fotos)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm text-white/80">
                Música de fundo + gravação de voz
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm text-white/80">
                Linha do Tempo 3D (até 20 momentos)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Puzzle className="w-5 h-5 text-teal-500 shrink-0" />
              <span className="text-sm text-white/80">
                Quebra-cabeça Interativo
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-5 h-5 text-teal-500 shrink-0" />
              <span className="text-sm text-white/80">
                Jogo da Memória + Quiz do Casal
              </span>
            </div>
            <div className="flex items-center gap-3 opacity-40">
              <Hourglass className="w-5 h-5 text-white/60 shrink-0" />
              <span className="text-sm text-white/60">
                Página disponível por apenas 24h
              </span>
            </div>
            <div className="flex items-center gap-3 opacity-30">
              <HardDrive className="w-5 h-5 text-white/60 shrink-0" />
              <span className="text-sm text-white/60 line-through">
                Página permanente + backup infinito
              </span>
            </div>
          </div>

          <div className="mt-auto mb-6 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex items-start gap-3">
            <Hourglass className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-500/80 leading-relaxed">
              Atenção: a página expira após 24h do momento do presente. Sem
              possibilidade de recuperação depois disso.
            </p>
          </div>
          <Link href="/criar">
            <button className="w-full py-4 px-6 rounded-2xl bg-black border border-white/5 hover:bg-black hover:border-white/10 transition-all flex items-center justify-center gap-2 text-sm font-semibold text-white/90">
              Começar minha surpresa
              <ArrowRight className="w-4 h-4 opacity-70" />
            </button>
          </Link>
        </div>

        {/* ===================== PLANO AVANÇADO ===================== */}
        <div className="relative w-full lg:w-[440px] rounded-[2rem] bg-black border-2 border-purple-500/50 p-8 flex flex-col shadow-2xl shadow-purple-900/30 transform scale-100 lg:scale-[1.02] z-10">
          {/* Badge Mais Popular */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <Star className="w-3 h-3 fill-current" />
            MAIS POPULAR
            <Star className="w-3 h-3 fill-current" />
          </div>

          <div className="mb-6 mt-2">
            <h3 className="text-3xl font-black text-white mb-1">
              Plano Avançado
            </h3>
            <p className="text-sm text-white/60">
              A experiência completa e eterna.
            </p>
          </div>

          <div className="bg-black border border-purple-500/20 rounded-2xl p-6 flex flex-col items-center justify-center mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent pointer-events-none"></div>
            <p className="text-sm text-white/40 line-through mb-1">
              De R$ 39,90
            </p>
            <div className="flex items-start justify-center gap-1 mb-1">
              <span className="text-xl font-bold text-white/80 mt-1">R$</span>
              <span className="text-6xl font-black text-white">24</span>
              <span className="text-xl font-bold text-white mt-1">,90</span>
            </div>
            <p className="text-xs text-white/50 text-center">
              Pagamento único • Sem mensalidade
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <p className="text-sm font-normal font-semibold text-emerald-400">
              152 pessoas compraram hoje
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm font-medium text-white/90">
                Galeria de fotos (até 10 fotos)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm font-medium text-white/90">
                Música de fundo + gravação de voz
              </span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm font-medium text-white/90">
                Linha do Tempo 3D (até 20 momentos)
              </span>
            </div>

            {/* Exclusive Items */}
            <div className="flex items-center justify-between gap-3 bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <Puzzle className="w-5 h-5 text-purple-400 shrink-0" />
                <span className="text-sm font-semibold text-white">
                  Quebra-cabeça Interativo
                </span>
              </div>
              <span className="text-[9px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded uppercase tracking-wider">
                Exclusivo
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-5 h-5 text-purple-400 shrink-0" />
                <span className="text-sm font-semibold text-white">
                  Jogo da Memória + Quiz do Casal
                </span>
              </div>
              <span className="text-[9px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded uppercase tracking-wider">
                Exclusivo
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <HardDrive className="w-5 h-5 text-purple-400 shrink-0" />
                <span className="text-sm font-semibold text-white">
                  Página permanente + backup infinito
                </span>
              </div>
              <span className="text-[9px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded uppercase tracking-wider">
                Exclusivo
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-y-2 gap-x-4 mb-6">
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
              <ShieldCheck className="w-3 h-3" /> Pagamento seguro
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-yellow-400 font-medium">
              <Sparkles className="w-3 h-3" /> Acesso imediato
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-medium">
              <Lock className="w-3 h-3" /> Garantia 7 dias
            </div>
          </div>
          <Link href="/criar">
            <button className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 shadow-xl shadow-purple-900/40 transition-all flex items-center justify-center gap-2 text-base font-bold text-white mb-6 group transform hover:scale-[1.02] active:scale-95">
              <Sparkles className="w-4 h-4" />
              Surpreender quem eu amo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          <div className="flex justify-center items-center gap-4 text-[10px] text-white/40">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Garantia 7 dias
            </div>
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" /> Dados protegidos
            </div>
            <div className="flex items-center gap-1">
              <HeadphonesIcon className="w-3 h-3" /> Suporte 24h
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
