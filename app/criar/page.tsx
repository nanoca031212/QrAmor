import {
  ChevronRight,
  Heart,
  MessageCircle,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";

const directOptions = [
  { label: "Mãe", icon: Heart, color: "text-pink-300" },
  { label: "Avó/Avô", icon: Sparkles, color: "text-yellow-300" },
  { label: "Filho/filha", icon: Heart, color: "text-yellow-300" },
  { label: "Esposa/o", icon: UserRound, color: "text-violet-300" },
  { label: "Outro", icon: Sparkles, color: "text-fuchsia-300" },
];

const Criacao = () => {
  return (
    <section className="relative min-h-screen overflow-hidden md:px-0 px-4 flex items-center justify-center bg-center  text-white">
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center pt-10 text-center">
        <div className="mb-8 flex w-full items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-semibold text-white/90">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-fuchsia-500/15 text-fuchsia-300">
              <Sparkles size={14} />
            </div>
            QrDoAmor
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            21 criando agora
          </div>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            Pra quem é a surpresa?
          </h1>
          <p className="mt-3 text-sm text-white/50 md:text-base">
            A página é criada sob medida pra essa pessoa.
          </p>
        </div>

        <div className="flex w-full flex-col gap-6">
          <Link href="/criar/montar">
            <button
              type="button"
              className="group relative w-full rounded-[1.7rem] border border-pink-500/30 bg-pink-500/8 px-5 py-5 text-left shadow-[0_0_40px_rgba(236,72,153,0.10)] transition-all hover:border-pink-400/40 hover:bg-pink-500/10"
            >
              <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                Dia das Mães
              </span>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-pink-300/20 bg-pink-500/12 text-4xl text-pink-300">
                  🌸
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">
                    Presente para Mãe
                  </h2>
                  <p className="mt-1 text-sm text-white/50">
                    Homenageie quem sempre esteve por você
                  </p>
                </div>
                <ChevronRight className="text-white/35 transition-transform group-hover:translate-x-1 group-hover:text-white" />
              </div>
            </button>
          </Link>
          <Link href="/criar/montar">
            <button
              type="button"
              className="group relative w-full rounded-[1.7rem] border border-fuchsia-500/30 bg-fuchsia-500/8 px-5 py-5 text-left shadow-[0_0_40px_rgba(168,85,247,0.08)] transition-all hover:border-fuchsia-400/40 hover:bg-fuchsia-500/10"
            >
              <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                Mais popular
              </span>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/15 text-pink-300">
                  <Heart size={24} fill="currentColor" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">
                    Presente de Amor
                  </h2>
                  <p className="mt-1 text-sm text-white/50">
                    Pra namorado(a), conjuge ou crush
                  </p>
                </div>
                <ChevronRight className="text-white/35 transition-transform group-hover:translate-x-1 group-hover:text-white" />
              </div>
            </button>
          </Link>

          <Link href="/criar/montar">
            <button
              type="button"
              className="group relative w-full rounded-[1.7rem] border border-orange-500/25 bg-orange-500/7 px-5 py-5 text-left shadow-[0_0_40px_rgba(249,115,22,0.06)] transition-all hover:border-orange-400/35 hover:bg-orange-500/10"
            >
              <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                Dia do amigo
              </span>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-orange-300/20 bg-orange-500/12 text-orange-300">
                  <MessageCircle size={24} />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">
                    Presente para Amiga
                  </h2>
                  <p className="mt-1 text-sm text-white/50">
                    Surpreenda sua melhor amiga - Edicao Dia do Amigo
                  </p>
                </div>
                <ChevronRight className="text-white/35 transition-transform group-hover:translate-x-1 group-hover:text-white" />
              </div>
            </button>
          </Link>
        </div>

        <div className="mt-8 flex w-full items-center gap-4">
          <div className="h-px flex-1 bg-white/8" />
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/25">
            Ou homenageie diretamente
          </span>
          <div className="h-px flex-1 bg-white/8" />
        </div>

        <div className="mt-6 flex w-full flex-wrap items-center justify-center gap-3">
          {directOptions.map(({ label, icon: Icon, color }) => (
            <Link key={label} href="/criar/montar">
              <button
                key={label}
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/75 transition-all hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
              >
                <Icon className={color} size={14} fill="currentColor" />
                {label}
              </button>
            </Link>
          ))}

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/75 transition-all hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
          >
            <Users className="text-sky-300" size={14} />
            Para amigos
          </button>
        </div>

        <p className="mt-10 text-xs text-white/30">
          Pronto em 5 minutos - o passado vai se emocionar
        </p>
      </div>
    </section>
  );
};

export default Criacao;
