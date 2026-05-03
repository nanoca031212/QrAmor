"use client";

import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CircleHelp,
  Gamepad2,
  ImagePlus,
  Puzzle,
  WandSparkles,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

type EventoItem = {
  title: string;
  subtitle: string;
  suggestionTitles?: string[];
  titleColorOptions?: string[];
};

const titleColorOptions = [
  "#FFFFFF",
  "#FFD6E7",
  "#F472B6",
  "#EF4444",
  "#FB923C",
  "#FDE047",
  "#7DD3FC",
  "#A78BFA",
];

const item: EventoItem[] = [
  {
    title:
      "Oiii! 💘 Antes de tudo: qual o nome de quem vai receber essa surpresa?",
    subtitle:
      "Crie seu perfil para que os usuários possam conhecer o seu perfil",
  },
  {
    title: "Ah, batata dioce! 🌷 Como você quer titular essa homenagem?",
    subtitle:
      "Crie seu perfil para que os usuários possam conhecer o seu perfil",
    suggestionTitles: ["Para a melhor mãe do mundo", "Mãe, te amo 🌸"],
    titleColorOptions: titleColorOptions,
  },
  {
    title:
      "Agora escreve a mensagem principal 💌 Vai ser a parte que mais toca o coração.",
    subtitle:
      "Mãe, eu nunca vou conseguir colocar em palavras o quanto você significa pra mim...",
  },
  {
    title:
      "Hora das fotos 📸 — escolhe aquelas fotos marcantes de vocês. Sabrina vai chorar!",
    subtitle:
      "Crie seu perfil para que os usuários possam conhecer o seu perfil",
  },
  {
    title:
      "Agora vamos montar os momentos especiais de vocês 🕰️ — aniversários, viagens, o dia que… vem tudo!",
    subtitle:
      "Crie seu perfil para que os usuários possam conhecer o seu perfil",
  },
  {
    title:
      "Quer uma abertura especial pra surpreender? ✨ Dá um toque mágico logo de cara.",
    subtitle:
      "Crie seu perfil para que os usuários possam conhecer o seu perfil",
  },
  {
    title:
      "Tem uma música que lembra Sabrina? 🎶 Cola aqui — música certa arrepia na hora.",
    subtitle: "Buscar nome da musica ou artista",
  },
  {
    title:
      "Que clima você quer pra homenagem? 💫 Olha que lindos esses fundinhos:",
    subtitle: "Buscar nome da musica ou artista",
  },
  {
    title:
      "Quer adicionar joguinhos interativos? 🎮 Deixa a página ainda mais especial.",
    subtitle: "Buscar nome da musica ou artista",
  },
  {
    title: "Quase pronto! 🎉 Escolhe o plano que combina com o que você quer.",
    subtitle: "Buscar nome da musica ou artista",
  },
];

const montagem = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(() => item.map(() => ""));
  const [activeTitleColor, setActiveTitleColor] = useState("#FFFFFF");
  const [messageTextStyle, setMessageTextStyle] = useState({
    bold: false,
    italic: false,
    strike: false,
  });
  const [messageTextSize, setMessageTextSize] = useState<
    "P" | "M" | "G" | "GG"
  >("M");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const currentItem = item[currentStep];
  const currentAnswer = answers[currentStep] ?? "";
  const currentTitle =
    currentStep === 1 && answers[0]
      ? `${answers[0]}, ah, batata dioce! 🌷 Como você quer titular essa homenagem?`
      : currentItem.title;
  const progressWidth = `${((currentStep + 1) / item.length) * 100}%`;

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) =>
      prev.map((answer, index) => (index === currentStep ? value : answer)),
    );
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, item.length - 1));
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const toggleMessageTextStyle = (style: "bold" | "italic" | "strike") => {
    setMessageTextStyle((prev) => ({
      ...prev,
      [style]: !prev[style],
    }));
  };

  const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUploadedImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const messageSizeClass = {
    P: "text-xs",
    M: "text-sm",
    G: "text-base",
    GG: "text-lg",
  }[messageTextSize];

  return (
    <div className="relative  overflow-hidden ">
      <div className="absolute left-[-88px] top-24 h-[280px] w-[280px] rounded-full bg-fuchsia-500/28 blur-[95px] -z-20 animate-pulse md:top-0 md:left-1/4 md:h-[500px] md:w-[500px] md:bg-brand-purple/20 md:blur-[120px]" />
      <div className="absolute bottom-[-70px] right-[-50px] h-[260px] w-[260px] rounded-full bg-violet-500/20 blur-[100px] -z-10 md:bottom-0 md:right-1/4 md:h-[400px] md:w-[400px] md:bg-brand-purple/10 md:blur-[100px]" />

      <div className="border-b border-white/5 bg-black/30 px-4 py-4 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-md items-center gap-4">
          <Link
            href="/criar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 transition-colors hover:bg-white/10"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className=" flex justify-center items-center min-w-0 flex-1  gap-3">
            <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-white transition-all duration-300"
                style={{ width: progressWidth }}
              />
            </div>
            <span className="text-xs font-semibold tracking-wide text-white/70">
              {currentStep + 1}/{item.length}
            </span>
          </div>
        </div>
      </div>
      <div className="pt-3  px-4">
        <div className="  flex items-center gap-6 px-4">
          <div className="flex flex-col items-center">
            <h1>Montar </h1>
            <h1>Perfil</h1>
          </div>
          <div className="space-y-1">
            <h1 className="uppercase text-[10px] tracking-[0.2em] text-white/70 font-bold">
              cupido
            </h1>
            <div className="bg-brand-purple/10  p-4 border border-brand-purple/20 rounded-3xl font-bold">
              <h1>{currentTitle}</h1>
            </div>
          </div>
        </div>
        <div className="flex w-full gap-3 overflow-x-auto py-3 text-sm">
          {(currentItem.suggestionTitles ?? []).map((title) => (
            <button
              key={title}
              type="button"
              onClick={() => handleAnswerChange(title)}
              className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-white transition-colors hover:bg-white/10"
            >
              <h1>{title}</h1>
            </button>
          ))}
        </div>
        <div>
          <div>
            {currentStep === 2 && (
              <>
                <div className=" flex justify-between">
                  <div className="flex flex-col  pb-3 gap-3">
                    <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
                      Estilo
                    </h1>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggleMessageTextStyle("bold")}
                        className={`flex h-10 w-10 items-center justify-center border text-lg transition-colors ${
                          messageTextStyle.bold
                            ? "border-fuchsia-400 bg-fuchsia-500/15 text-white"
                            : "border-white/10 bg-white/5 text-white/70"
                        }`}
                      >
                        <span className="font-bold">B</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleMessageTextStyle("italic")}
                        className={`flex h-10 w-10 items-center justify-center border text-lg transition-colors ${
                          messageTextStyle.italic
                            ? "border-fuchsia-400 bg-fuchsia-500/15 text-white"
                            : "border-white/10 bg-white/5 text-white/70"
                        }`}
                      >
                        <span className="italic">I</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleMessageTextStyle("strike")}
                        className={`flex h-10 w-10 items-center justify-center border text-lg transition-colors ${
                          messageTextStyle.strike
                            ? "border-fuchsia-400 bg-fuchsia-500/15 text-white"
                            : "border-white/10 bg-white/5 text-white/70"
                        }`}
                      >
                        <span className="line-through">S</span>
                      </button>
                    </div>
                  </div>
                  {/* segundo */}
                  <div className="flex flex-col  pb-3 gap-3">
                    <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
                      Tamanho do texto
                    </h1>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setMessageTextSize("P")}
                        className={`flex h-10 w-10 items-center justify-center border text-lg transition-colors ${
                          messageTextSize === "P"
                            ? "border-fuchsia-400 bg-fuchsia-500/15 text-white"
                            : "border-white/10 bg-white/5 text-white/70"
                        }`}
                      >
                        <span className="font-semibold">P</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMessageTextSize("M")}
                        className={`flex h-10 w-10 items-center justify-center border text-lg transition-colors ${
                          messageTextSize === "M"
                            ? "border-fuchsia-400 bg-fuchsia-500/15 text-white"
                            : "border-white/10 bg-white/5 text-white/70"
                        }`}
                      >
                        <span className="font-semibold">M</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMessageTextSize("G")}
                        className={`flex h-10 w-10 items-center justify-center border text-lg transition-colors ${
                          messageTextSize === "G"
                            ? "border-fuchsia-400 bg-fuchsia-500/15 text-white"
                            : "border-white/10 bg-white/5 text-white/70"
                        }`}
                      >
                        <span className="font-semibold">G</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMessageTextSize("GG")}
                        className={`flex h-10 w-10 items-center justify-center border text-lg transition-colors ${
                          messageTextSize === "GG"
                            ? "border-fuchsia-400 bg-fuchsia-500/15 text-white"
                            : "border-white/10 bg-white/5 text-white/70"
                        }`}
                      >
                        <span className="text-sm font-semibold">GG</span>
                      </button>
                    </div>
                  </div>
                </div>
                <textarea
                  placeholder={currentItem.subtitle}
                  maxLength={2000}
                  value={currentAnswer}
                  onChange={(event) => handleAnswerChange(event.target.value)}
                  className="min-h-[150px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-white/90 outline-none transition-colors resize-none placeholder:text-white/35 focus:border-[#7B2654] focus-visible:border-[#7B2654]"
                />

                <div className="mt-1 pr-1 text-xs font-semibold text-right text-white/60 ">
                  <h1>{currentAnswer.length}/2000</h1>
                </div>
              </>
            )}
            {currentStep === 3 && (
              <div className="flex items-center mb-3 gap-4">
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center rounded-2xl border border-[#522541] bg-[#311539] px-4 py-2 text-center transition-colors hover:bg-white/7"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/80">
                    <ImagePlus size={18} />
                  </div>
                  <h1 className="text-sm font-semibold text-white">
                    Enviar foto
                  </h1>
                  <p className="mt-1 text-xs text-white/45">Da galeria</p>
                </button>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-center transition-colors hover:bg-white/7"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/80">
                    <Camera size={18} />
                  </div>
                  <h1 className="text-sm font-semibold text-white">
                    Tirar foto
                  </h1>
                  <p className="mt-1 text-xs text-white/45">Usar camera</p>
                </button>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
              </div>
            )}
            {currentStep === 4 && (
              <div className="flex items-center mb-3 gap-4">
                <button
                  type="button"
                  className="flex w-full flex-col items-center justify-center rounded-2xl border border-[#522541] bg-[#311539] px-4 py-3 text-center transition-colors hover:bg-white/7"
                >
                  <div className="flex flex-row items-center  justify-center gap-4">
                    <div className=" flex items-center justify-center rounded-full bg-white/8 text-white/80">
                      <ImagePlus size={18} />
                    </div>
                    <h1 className="text-sm font-semibold text-white">
                      Adicionar momentos (0/24)
                    </h1>
                  </div>
                  <p className="mt-1 text-xs text-white/45">
                    pode escolher várias fotos de uma vez
                  </p>
                </button>
              </div>
            )}
            {currentStep === 5 && (
              <div className="flex items-center mb-3 gap-4">
                <button
                  type="button"
                  className="flex w-full flex-col items-center justify-center rounded-2xl border border-[#A04979] bg-white/5 px-4 py-2 text-center transition-colors hover:bg-white/7"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-2xl text-white/80">
                    🐰
                  </div>
                  <h1 className="text-sm font-semibold text-white">
                    Coelhinho
                  </h1>
                  <p className="mt-1 text-xs text-white/45">
                    Animação fofinha pra começar com graça
                  </p>
                </button>
                <button
                  type="button"
                  className="flex w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-center transition-colors hover:bg-white/7"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-2xl text-white/80">
                    🌟
                  </div>
                  <h1 className="text-sm font-semibold text-white">
                    Sem abertura
                  </h1>
                  <p className="mt-1 text-xs text-white/45">
                    A página abre direto no conteúdo
                  </p>
                </button>
              </div>
            )}
            {currentStep === 8 && (
              <div className="flex flex-col mb-4 gap-2">
                <button
                  type="button"
                  className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 p-3 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Puzzle size={20} />
                    </div>
                    <div className="flex flex-col font-bold">
                      <h1 className="text-base">Quebra-cabeça</h1>
                      <h1 className="text-xs text-white/70">
                        Monta peça por peça pra ver a foto
                      </h1>
                    </div>
                  </div>
                  <div className="flex h-8 w-14 shrink-0 items-center rounded-full bg-white/10 px-1">
                    <div className="h-6 w-6 rounded-full bg-white" />
                  </div>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 p-3 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Gamepad2 size={20} />
                    </div>
                    <div className="flex flex-col font-bold">
                      <h1 className="text-base">Jogo da memória</h1>
                      <h1 className="text-xs text-white/70">
                        Pares de fotos pra virar e combinar
                      </h1>
                    </div>
                  </div>
                  <div className="flex h-8 w-14 shrink-0 items-center rounded-full bg-white/10 px-1">
                    <div className="h-6 w-6 rounded-full bg-white" />
                  </div>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 p-3 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <CircleHelp size={20} />
                    </div>
                    <div className="flex flex-col font-bold">
                      <h1 className="text-base">Quanto ela te conhece?</h1>
                      <h1 className="text-xs text-white/70">
                        Perguntas sobre a mãe
                      </h1>
                    </div>
                  </div>
                  <div className="flex h-8 w-14 shrink-0 items-center rounded-full bg-white/10 px-1">
                    <div className="h-6 w-6 rounded-full bg-white" />
                  </div>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 p-3 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <WandSparkles size={20} />
                    </div>
                    <div className="flex flex-col font-bold">
                      <h1 className="text-base">Adivinhe a palavra</h1>
                      <h1 className="text-xs text-white/70">
                        Forca - descobre a palavra
                      </h1>
                    </div>
                  </div>
                  <div className="flex h-8 w-14 shrink-0 items-center rounded-full bg-white/10 px-1">
                    <div className="h-6 w-6 rounded-full bg-white" />
                  </div>
                </button>
              </div>
            )}
            {currentStep === 9 && (
              <div className="mb-4 flex flex-col gap-4">
                <div className="relative overflow-visible rounded-[1.75rem] border-2 border-yellow-400 bg-[linear-gradient(180deg,rgba(120,32,72,0.28)_0%,rgba(28,9,34,0.96)_100%)] px-4 pb-5 pt-6 shadow-[0_0_30px_rgba(250,204,21,0.14)]">
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-orange-600 via-yellow-600 to-violet-600 px-3 py-1 text-center text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
                    🤍 Melhor custo 🤍
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1">
                        <h1 className="text-2xl font-black text-yellow-300">
                          VIP
                        </h1>
                        <span className="text-sm text-yellow-300">💎</span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-white/80">
                        Tudo liberado - preco fechado
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-white/30 line-through">
                        R$ 49,99
                      </p>
                      <p className="text-3xl font-black leading-none text-white">
                        R$ 34,99
                      </p>
                      <p className="mt-1 text-xs font-bold text-emerald-400">
                        Economize R$ 15,00
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-md border border-yellow-400/25 bg-yellow-400/10 px-3 py-2 text-center text-sm font-bold text-white">
                    ∞ No ar pra sempre - edite quando quiser
                  </div>

                  <div className="mt-4 space-y-2.5 text-sm font-medium text-white/92">
                    <p>✏️ Edite a página quando quiser, pra sempre</p>
                    <p>💎 TUDO do Avançado incluso</p>
                    <p>✨ Todas as intros liberadas</p>
                    <p>🎤 Mensagem de voz já incluída</p>
                    <p>🔳 QR Code personalizado (qualquer tema)</p>
                    <p>• Jogo "adivinhe a palavra" incluso</p>
                  </div>
                </div>
                <div className="relative overflow-visible rounded-[1.75rem] border border-fuchsia-400/60 bg-[linear-gradient(180deg,rgba(99,20,66,0.45)_0%,rgba(15,7,22,0.98)_100%)] px-4 pb-5 pt-6 shadow-[0_0_25px_rgba(217,70,239,0.18)]">
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-3 py-1 text-center text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
                    ✨ Mais popular ✨
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1">
                        <h1 className="text-2xl font-black text-white">
                          Avançado
                        </h1>
                        <span className="text-sm text-fuchsia-300">✨</span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-white/75">
                        A experiência completa
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-black leading-none text-white">
                        R$ 24,90
                      </p>
                      <p className="mt-1 text-xs font-bold text-white/45">
                        + add-ons opcionais
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-md border border-fuchsia-400/25 bg-fuchsia-500/10 px-3 py-2 text-sm font-bold text-white">
                    ∞ Fica no ar pra sempre
                  </div>

                  <div className="mt-4 space-y-2.5 text-sm font-medium text-white/92">
                    <p>🎮 Joguinhos: quebra-cabeça, memória, quiz</p>
                    <p>🎤 Mensagem de voz gravada por você</p>
                    <p>✨ Intros especiais (coelho/poema)</p>
                    <p>🎵 Música de fundo personalizada</p>
                  </div>
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(35,19,44,0.45)_0%,rgba(12,8,20,0.98)_100%)] px-4 pb-5 pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h1 className="text-2xl font-black text-white">Básico</h1>
                      <p className="mt-1 text-xs font-semibold text-white/75">
                        O essencial pra emocionar
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-black leading-none text-white">
                        R$ 19,90
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-md border border-yellow-500/25 bg-yellow-500/10 px-3 py-2 text-sm font-bold text-yellow-200">
                    ⏰ Expira em 25 horas
                  </div>

                  <div className="mt-4 space-y-2.5 text-sm font-medium text-white/90">
                    <p>• Página dedicada com título e mensagem</p>
                    <p>• Galeria de fotos (até 10)</p>
                    <p>• Contador de tempo juntos</p>
                    <p>• Linha do tempo dos momentos</p>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 7 && (
              <div className="mb-2">
                <div className="uppercase text-white/80 text-sm mb-1 font-bold">
                  <h1>
                    <span className="text-lg">✨</span> Favoritos do Cupido
                  </h1>
                </div>
                <div className="static-carousel relative -mx-4 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-4 pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none]">
                  <button
                    type="button"
                    className="flex min-h-[110px] min-w-[220px] shrink-0 snap-start flex-col justify-end rounded-2xl border border-[#A04979] bg-white/5 px-4 py-5 text-left transition-colors hover:bg-white/7"
                  >
                    <h1 className="text-sm  font-semibold text-white">
                      Coelhinho
                    </h1>
                    <p className="mt-1 text-xs text-white/45">
                      Animação fofinha pra começar com graça
                    </p>
                  </button>
                  <button
                    type="button"
                    className="flex min-h-[110px] min-w-[220px] shrink-0 snap-start flex-col justify-end rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-left transition-colors hover:bg-white/7"
                  >
                    <h1 className="text-sm font-semibold text-white">
                      Sem abertura
                    </h1>
                    <p className="mt-1 text-xs text-white/45">
                      A página abre direto no conteúdo
                    </p>
                  </button>
                  <button
                    type="button"
                    className="flex min-h-[110px] min-w-[220px] shrink-0 snap-start flex-col justify-end rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-left transition-colors hover:bg-white/7"
                  >
                    <h1 className="text-sm font-semibold text-white">
                      Sem abertura
                    </h1>
                    <p className="mt-1 text-xs text-white/45">
                      A página abre direto no conteúdo
                    </p>
                  </button>
                </div>
              </div>
            )}

            {currentStep !== 2 &&
              currentStep !== 3 &&
              currentStep !== 4 &&
              currentStep !== 5 &&
              currentStep !== 7 &&
              currentStep !== 8 &&
              currentStep !== 9 && (
                <>
                  <input
                    type="text"
                    placeholder={currentItem.subtitle}
                    value={currentAnswer}
                    onChange={(event) => handleAnswerChange(event.target.value)}
                    className="h-10 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-white/90 outline-none transition-colors focus:border-[#7B2654] focus-visible:border-[#7B2654]"
                  />

                  <div className="mt-1 pr-1 text-xs font-semibold text-right text-white/60 ">
                    <h1>{currentAnswer.length}/20</h1>
                  </div>
                </>
              )}
          </div>
          {currentStep === 1 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <h1 className="text-xs font-bold uppercase text-white/70">
                  Cor do título
                </h1>
                <div className="flex items-center gap-3">
                  <h1 className="text-xs font-bold uppercase text-white/70">
                    Personalizado
                  </h1>
                  <label className="relative block h-5 w-5 cursor-pointer overflow-hidden rounded-md border border-white/15 bg-white">
                    <span
                      className="absolute inset-[1px] rounded-[5px]"
                      style={{ backgroundColor: activeTitleColor }}
                    />
                    <input
                      type="color"
                      aria-label="Escolher cor personalizada do titulo"
                      value={activeTitleColor}
                      onChange={(event) =>
                        setActiveTitleColor(event.target.value)
                      }
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </label>
                </div>
              </div>
              <div className="color-scroll flex w-full items-center gap-2 overflow-x-auto pt-3 [scrollbar-width:none] [-ms-overflow-style:none]">
                {(currentItem.titleColorOptions ?? []).map((color) => {
                  const isActive = activeTitleColor === color;

                  return (
                    <button
                      key={color}
                      type="button"
                      aria-label={`Selecionar cor ${color}`}
                      onClick={() => setActiveTitleColor(color)}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-transform ${
                        isActive
                          ? "scale-105 border-white"
                          : "border-white/10 hover:scale-105"
                      }`}
                    >
                      <span
                        className="h-7 w-7 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div
            className={`relative mx-auto aspect-[1/2] mb-20 w-full max-w-[260px] overflow-hidden rounded-[2.5rem] border-[1px] border-zinc-600 bg-white shadow-xl shadow-[0_0_45px_rgba(217,70,239,0.35)] glow-purple sm:border-[8px] ${
              currentStep === 1 ? "mt-4" : ""
            }`}
          >
            {/* Camera cutout */}
            <div className="absolute top-2 left-1/2 h-5 w-18 -translate-x-1/2 rounded-full bg-[#0C0212] border-[1px] border-zinc-600 sm:h-8 sm:w-40" />

            {/* Inner Content Placeholder */}
            <div className="flex h-full flex-col items-center justify-start bg-[#0C0212] px-4 pt-16 text-zinc-400 sm:pt-20">
              <p
                className="text-center text-xl font-semibold"
                style={{ fontFamily: "Playlist", color: activeTitleColor }}
              >
                {answers[1] || "Seu Titulo Aqui"}
              </p>
              <p
                className={`mt-3 text-center text-white/75 ${messageSizeClass} ${
                  messageTextStyle.bold ? "font-bold" : "font-medium"
                } ${messageTextStyle.italic ? "italic" : ""} ${
                  messageTextStyle.strike ? "line-through" : ""
                }`}
              >
                {answers[2] || "Sua mensagem de amor..."}
              </p>
              {uploadedImage && (
                <img
                  src={uploadedImage}
                  alt="Foto enviada pelo cliente"
                  className="mt-4 w-full rounded-2xl object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black px-4 py-2 gap-4 flex">
        <button
          type="button"
          onClick={handlePreviousStep}
          disabled={currentStep === 0}
          className="w-[40%] border border-white/15 py-3 disabled:cursor-not-allowed disabled:opacity-40"
        >
          voltar
        </button>
        <button
          type="button"
          onClick={handleNextStep}
          disabled={currentStep === item.length - 1}
          className="flex w-[60%] items-center justify-center gap-4 border border-white bg-white py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          Continuar
          <ArrowRight size={18} />
        </button>
      </div>
      <style jsx>{`
        .static-carousel::-webkit-scrollbar,
        .color-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default montagem;
