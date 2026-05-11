"use client";

import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Camera,
  CircleHelp,
  Eye,
  Gamepad2,
  ImagePlus,
  Puzzle,
  WandSparkles,
  X,
  Heart,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import DomeGallery, { GalleryImage } from "@/app/components/DomeGallery";
import { loadStripe } from "@stripe/stripe-js";
import { set as idbSet } from "idb-keyval";

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
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const previewCarouselRef = useRef<HTMLDivElement>(null);
  const [messageTextSize, setMessageTextSize] = useState<
    "P" | "M" | "G" | "GG"
  >("M");
  const [uploadedImages, setUploadedImages] = useState<GalleryImage[]>([]);
  const [isDomeOpen, setIsDomeOpen] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const [spotifySearchQuery, setSpotifySearchQuery] = useState("");
  const [spotifyResults, setSpotifyResults] = useState<any[]>([]);
  const [selectedSpotifyTrack, setSelectedSpotifyTrack] = useState<any | null>(
    null,
  );
  const [isSearchingSpotify, setIsSearchingSpotify] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const youtubeIframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedBackground, setSelectedBackground] =
    useState<string>("default");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Estados dos Jogos
  const [games, setGames] = useState({
    puzzle: { active: false, image: null as string | null },
    memory: { active: false, images: [] as string[] },
    quiz: {
      active: false,
      questions: [{ q: "", options: ["", ""], correct: 0 }],
    },
  });
  const [isGameSelectorOpen, setIsGameSelectorOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<
    null | "puzzle" | "memory" | "quiz"
  >(null);
  const [puzzlePieces, setPuzzlePieces] = useState<number[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);

  // Estados Memória
  const [memoryCards, setMemoryCards] = useState<
    { id: number; url: string; isFlipped: boolean; isMatched: boolean }[]
  >([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isMemoryChecking, setIsMemoryChecking] = useState(false);

  // Inicializar Memória
  const startMemory = () => {
    if (games.memory.images.length < 3) return;

    // Criar pares
    let cards = [...games.memory.images, ...games.memory.images].map(
      (url, index) => ({
        id: index,
        url,
        isFlipped: false,
        isMatched: false,
      }),
    );

    // Shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    setMemoryCards(cards);
    setFlippedIndices([]);
    setIsMemoryChecking(false);
    setActiveGame("memory");
    setIsGameSelectorOpen(false);
  };

  // Inicializar Quebra-cabeça
  const startPuzzle = () => {
    const pieces = Array.from({ length: 9 }, (_, i) => i);
    // Shuffle
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    setPuzzlePieces(pieces);
    setActiveGame("puzzle");
    setIsGameSelectorOpen(false);
  };

  // Estados Quiz
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isAnimateCorrect, setIsAnimateCorrect] = useState(false);

  // Estados Pagamento
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePayment = async (plan: "vip" | "avancado" | "basico" = "vip") => {
    try {
      setIsProcessingPayment(true);

      // Salvar dados no localStorage para a página de sucesso
      const tributeData = {
        answers,
        uploadedImages,
        selectedSpotifyTrack,
        games,
        specialOpening,
        selectedBackground,
        activeTitleColor,
        messageTextStyle,
        messageTextSize,
      };
      await idbSet("mycupid_tribute_data", tributeData);

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      );

      if (!stripe) throw new Error("Stripe failed to load");

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          metadata: {
            title: currentTitle,
            song: selectedSpotifyTrack?.name,
            plan,
            gamesCount: [
              games.puzzle.active,
              games.memory.active,
              games.quiz.active,
            ].filter(Boolean).length,
          },
        }),
      });

      const session = await response.json();

      if (session.error) throw new Error(session.error);

      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error("Não foi possível gerar a URL de pagamento.");
      }
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Estado Abertura Especial
  const [specialOpening, setSpecialOpening] = useState({
    enabled: false,
    status: "idle", // 'idle', 'question', 'success', 'denied'
    image: "/Coelho/um.png",
    message: "Voce me ama? ❤️",
    showNoButton: true,
    isFinished: false,
    isExiting: false,
  });

  // Inicializar Quiz
  const startQuiz = () => {
    if (games.quiz.questions.length === 0) return;
    setCurrentQuizIdx(0);
    setQuizScore(0);
    setQuizFeedback(null);
    setActiveGame("quiz");
    setIsGameSelectorOpen(false);
  };

  const backgrounds = [
    {
      id: "default",
      name: "Padrão",
      desc: "clássico",
      class: "bg-[#0C0212]",
      type: "none",
    },
    {
      id: "stars",
      name: "Céu estrelado",
      desc: "romântico",
      class: "bg-[#0C0212]",
      type: "twinkle",
      favorite: true,
    },
    {
      id: "hearts",
      name: "Buquê digital",
      desc: "cinematográfico",
      class: "bg-[#0C0212] bg-gradient-to-b from-[#1a0b1e] to-[#0C0212]",
      type: "hearts",
      favorite: true,
    },
    {
      id: "mixed-dots",
      name: "Ponto",
      desc: "vibrante",
      class: "bg-[#0C0212]",
      type: "mixed-dots",
    },
    {
      id: "rain",
      name: "Chuva de luz",
      desc: "mágico",
      class: "bg-[#0C0212]",
      type: "dots",
    },
  ];

  const currentItem = item[currentStep];
  const currentAnswer = answers[currentStep] ?? "";
  const currentTitle =
    currentStep === 1 && answers[0]
      ? `${answers[0]}, ah, batata dioce! 🌷 Como você quer titular essa homenagem?`
      : currentItem.title;
  const progressWidth = `${((currentStep + 1) / item.length) * 100}%`;

  // Helper: formata segundos em M:SS
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Timer do player de música
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isMusicPlaying) {
      playerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (trackDuration > 0 && prev >= trackDuration) {
            clearInterval(playerIntervalRef.current!);
            setIsMusicPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (playerIntervalRef.current) clearInterval(playerIntervalRef.current);
    }
    return () => {
      if (playerIntervalRef.current) clearInterval(playerIntervalRef.current);
    };
  }, [isMusicPlaying, trackDuration]);

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

  const handlePreviewScroll = () => {
    if (previewCarouselRef.current) {
      const container = previewCarouselRef.current;
      const children = container.children;
      const centerX = container.scrollLeft + container.offsetWidth / 2;

      let closestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const distance = Math.abs(centerX - childCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = i;
        }
      }
      setCurrentPhotoIdx(closestIdx);
    }
  };

  const toggleMessageTextStyle = (style: "bold" | "italic" | "strike") => {
    setMessageTextStyle((prev) => ({
      ...prev,
      [style]: !prev[style],
    }));
  };

  const handleSpotifySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSpotifySearchQuery(query);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (!query.trim()) {
      setSpotifyResults([]);
      return;
    }

    setIsSearchingSpotify(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/youtube/search?q=${encodeURIComponent(query)}`,
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          // Data already formatted by the route
          setSpotifyResults(data);
        } else {
          console.error("YouTube API Error:", data);
          setSpotifyResults([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearchingSpotify(false);
      }
    }, 500);
  };

  const handleSelectTrack = async (track: any) => {
    setSelectedSpotifyTrack(track);
    setSpotifyResults([]);
    setSpotifySearchQuery("");
    setRecommendations([]);
    setIsMusicPlaying(false);
    setElapsedSeconds(0);
    setTrackDuration(track.duration || 0);
    if (playerIntervalRef.current) clearInterval(playerIntervalRef.current);
    // Buscar mais músicas do mesmo artista
    try {
      const res = await fetch(
        `/api/youtube/search?q=${encodeURIComponent(track.artist + " music")}`,
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        // Remove a música já selecionada das recomendações
        setRecommendations(
          data.filter((t: any) => t.id !== track.id).slice(0, 4),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGalleryUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const imageUrls = await Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === "string") {
                resolve(reader.result);
              } else {
                reject(new Error("Falha ao carregar imagem"));
              }
            };
            reader.onerror = () =>
              reject(new Error("Falha ao ler arquivo enviado"));
            reader.readAsDataURL(file);
          }),
      ),
    );

    setUploadedImages((prev) => [
      ...prev,
      ...imageUrls.map((url) => ({
        id: crypto.randomUUID(),
        url,
        date: "",
        description: "",
      })),
    ]);
    event.target.value = "";
  };

  const updateImageField = (
    id: string | undefined,
    field: "date" | "description",
    value: string,
  ) => {
    if (!id) return;
    setUploadedImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, [field]: value } : img)),
    );
  };

  const removeImage = (id: string | undefined) => {
    if (!id) return;
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const messageSizeClass = {
    P: "text-xs",
    M: "text-sm",
    G: "text-base",
    GG: "text-lg",
  }[messageTextSize];

  return (
    <div className="relative  overflow-hidden ">
      {isDomeOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black">
          <div className="relative z-10 flex w-full items-center justify-between p-6 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex flex-col gap-1">
              <span className="text-white font-bold text-xl">
                Nossa Linha do Tempo
              </span>
              <span className="text-xs text-white/50">
                Toque e arraste para girar
              </span>
            </div>
            <button
              onClick={() => setIsDomeOpen(false)}
              className="text-white/70 hover:text-white flex items-center justify-center h-10 w-10 rounded-full bg-white/5 border border-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <DomeGallery
              images={uploadedImages}
              itemsCount={
                uploadedImages.length > 0
                  ? Math.max(12, uploadedImages.length * 2)
                  : 20
              }
            />
          </div>
        </div>
      )}
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
          <div className="flex shrink-0">
            <img
              key={currentStep}
              src="/Logo.png"
              alt="Logo MyCupid"
              className="w-20 h-auto object-contain floating-logo animate-in zoom-in-105 duration-500"
            />
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
              </div>
            )}
            {currentStep === 4 && (
              <div className="flex flex-col mb-3 gap-4">
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center rounded-2xl border border-[#522541] bg-[#311539] px-4 py-3 text-center transition-colors hover:bg-white/7"
                >
                  <div className="flex flex-row items-center  justify-center gap-4">
                    <div className=" flex items-center justify-center rounded-full bg-white/8 text-white/80">
                      <ImagePlus size={18} />
                    </div>
                    <h1 className="text-sm font-semibold text-white">
                      Adicionar momentos ({uploadedImages.length}/24)
                    </h1>
                  </div>
                  <p className="mt-1 text-xs text-white/45">
                    pode escolher várias fotos de uma vez
                  </p>
                </button>

                <div className="flex flex-col gap-3">
                  {uploadedImages.map((img) => (
                    <div
                      key={img.id}
                      className="flex gap-3 bg-[#1A0B18] border border-[#2D162A] rounded-xl p-3 relative"
                    >
                      <img
                        src={img.url}
                        className="w-[72px] h-[72px] min-w-[72px] rounded-lg object-cover"
                        alt="Momento"
                      />
                      <div className="flex flex-col gap-2 flex-1 pt-1">
                        <div className="flex items-center gap-2 bg-[#0C0212] border border-[#2D162A] rounded-md px-3 py-1.5">
                          <Calendar size={14} className="text-white/50" />
                          <input
                            placeholder="Data do momento"
                            value={img.date || ""}
                            onChange={(e) =>
                              updateImageField(img.id, "date", e.target.value)
                            }
                            className="bg-transparent border-none outline-none text-xs font-semibold text-white/70 w-full"
                          />
                        </div>
                        <div className="flex items-center gap-2 bg-[#0C0212] border border-[#2D162A] rounded-md px-3 py-1.5">
                          <input
                            placeholder="Conta o que rolou..."
                            value={img.description || ""}
                            onChange={(e) =>
                              updateImageField(
                                img.id,
                                "description",
                                e.target.value,
                              )
                            }
                            className="bg-transparent border-none outline-none text-xs font-bold text-white w-full"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute top-2 right-2 p-1 text-white/40 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {currentStep === 5 && (
              <div className="flex items-center mb-3 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setSpecialOpening((prev) => ({
                      ...prev,
                      enabled: true,
                      status: "question",
                    }))
                  }
                  className={`flex w-full flex-col items-center justify-center rounded-2xl border px-4 py-2 text-center transition-all ${specialOpening.enabled ? "border-[#A04979] bg-fuchsia-500/10 shadow-[0_0_15px_rgba(217,70,239,0.2)]" : "border-white/10 bg-white/5 hover:bg-white/7"}`}
                >
                  <div
                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border text-2xl ${specialOpening.enabled ? "border-fuchsia-400 text-white" : "border-white/10 text-white/80"}`}
                  >
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
                  onClick={() =>
                    setSpecialOpening((prev) => ({
                      ...prev,
                      enabled: false,
                      status: "idle",
                    }))
                  }
                  className={`flex w-full flex-col items-center justify-center rounded-2xl border px-4 py-2 text-center transition-all ${!specialOpening.enabled ? "border-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "border-white/10 bg-white/5 hover:bg-white/7"}`}
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
            {currentStep === 6 && (
              <div className="flex flex-col mb-3 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={currentItem.subtitle}
                    value={spotifySearchQuery}
                    onChange={handleSpotifySearch}
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/90 outline-none transition-colors focus:border-[#7B2654] focus-visible:border-[#7B2654]"
                  />
                  {isSearchingSpotify && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">
                      <span className="animate-spin inline-block">⌛</span>
                    </div>
                  )}
                </div>

                {spotifyResults.length === 0 &&
                  !spotifySearchQuery &&
                  !selectedSpotifyTrack && (
                    <div className="flex flex-col gap-2">
                      <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-white/45 pl-1">
                        Sugestões
                      </h1>
                      {[
                        {
                          id: "dQw4w9WgXcQ",
                          name: "Never Gonna Give You Up",
                          artist: "Rick Astley",
                          albumArt:
                            "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
                        },
                        {
                          id: "450p7goxZqg",
                          name: "All of Me",
                          artist: "John Legend",
                          albumArt:
                            "https://i.ytimg.com/vi/450p7goxZqg/hqdefault.jpg",
                        },
                        {
                          id: "lp-EO5I60KA",
                          name: "Perfect",
                          artist: "Ed Sheeran",
                          albumArt:
                            "https://i.ytimg.com/vi/lp-EO5I60KA/hqdefault.jpg",
                        },
                      ].map((track) => (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => handleSelectTrack(track)}
                          className="flex items-center gap-3 rounded-xl bg-white/5 p-2 hover:bg-white/10 transition-colors text-left border border-white/5"
                        >
                          <div className="relative w-16 h-12 shrink-0 rounded-lg overflow-hidden">
                            <img
                              src={track.albumArt}
                              alt={track.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play
                                size={14}
                                className="text-white"
                                fill="white"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-semibold text-white truncate">
                              {track.name}
                            </span>
                            <span className="text-xs text-white/60 truncate">
                              {track.artist}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                {spotifyResults.length > 0 && (
                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2 [scrollbar-width:thin] scrollbar-thumb-white/20 scrollbar-track-transparent">
                    {spotifyResults.map((track) => (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => handleSelectTrack(track)}
                        className="flex items-center gap-3 rounded-xl bg-white/5 p-2 hover:bg-white/10 transition-colors text-left border border-white/5"
                      >
                        <div className="relative w-16 h-12 shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={track.albumArt}
                            alt={track.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play
                              size={14}
                              className="text-white"
                              fill="white"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-semibold text-white truncate">
                            {track.name}
                          </span>
                          <span className="text-xs text-white/60 truncate">
                            {track.artist}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {selectedSpotifyTrack && (
                  <div className="flex flex-col gap-3">
                    <div className="rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-10 shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={selectedSpotifyTrack.albumArt}
                            alt={selectedSpotifyTrack.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play
                              size={12}
                              className="text-white"
                              fill="white"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-xs text-fuchsia-300 font-bold uppercase tracking-wider mb-0.5">
                            Música Selecionada
                          </span>
                          <span className="text-sm font-bold text-white truncate">
                            {selectedSpotifyTrack.name}
                          </span>
                          <span className="text-xs text-white/70 truncate">
                            {selectedSpotifyTrack.artist}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSpotifyTrack(null);
                          setRecommendations([]);
                        }}
                        className="text-white/50 hover:text-white p-2 shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {recommendations.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-white/45 pl-1">
                          Mais de {selectedSpotifyTrack.artist}
                        </h1>
                        {recommendations.map((rec) => (
                          <button
                            key={rec.id}
                            type="button"
                            onClick={() => handleSelectTrack(rec)}
                            className="flex items-center gap-3 rounded-xl bg-white/5 p-2 hover:bg-white/10 transition-colors text-left border border-white/5"
                          >
                            <div className="relative w-14 h-10 shrink-0 rounded-lg overflow-hidden">
                              <img
                                src={rec.albumArt}
                                alt={rec.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Play
                                  size={12}
                                  className="text-white"
                                  fill="white"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-xs font-semibold text-white truncate">
                                {rec.name}
                              </span>
                              <span className="text-[10px] text-white/60 truncate">
                                {rec.artist}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {currentStep === 8 && (
              <div className="flex flex-col mb-4 gap-4">
                <div className="uppercase text-white/45 text-[10px] mb-1 font-bold tracking-[0.2em] flex items-center gap-2">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <span>🎮 Jogue Comigo</span>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>

                {/* Quebra-cabeça */}
                <div className="rounded-[2rem] bg-white/5 border border-white/10 overflow-hidden">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
                        <Puzzle size={24} className="text-white" />
                      </div>
                      <div>
                        <h1 className="text-sm font-bold text-white">
                          Quebra-cabeça
                        </h1>
                        <p className="text-[10px] text-white/50">
                          Monta peça por peça pra ver a foto
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setGames((prev) => ({
                          ...prev,
                          puzzle: {
                            ...prev.puzzle,
                            active: !prev.puzzle.active,
                          },
                        }))
                      }
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${games.puzzle.active ? "bg-fuchsia-500" : "bg-white/10"}`}
                    >
                      <div
                        className={`h-4 w-4 bg-white rounded-full transition-transform ${games.puzzle.active ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </button>
                  </div>

                  {games.puzzle.active && (
                    <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="rounded-xl border border-white/5 bg-white/5 p-3 mb-4 flex items-center gap-2">
                        <span className="text-xs">🧩</span>
                        <p className="text-[10px] text-white/70 font-medium">
                          Ele(a) vai montar peça por peça pra revelar sua foto
                        </p>
                      </div>

                      <h2 className="text-[10px] font-black uppercase tracking-wider text-white/40 mb-2 flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 flex items-center justify-center text-[10px]">
                          1
                        </span>
                        Foto do Quebra-cabeça
                      </h2>

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="puzzle-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === "string") {
                                setGames((prev) => ({
                                  ...prev,
                                  puzzle: {
                                    ...prev.puzzle,
                                    image: reader.result as string,
                                  },
                                }));
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="puzzle-upload"
                        className="w-full aspect-video rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center gap-2 group cursor-pointer overflow-hidden"
                      >
                        {games.puzzle.image ? (
                          <img
                            src={games.puzzle.image}
                            className="w-full h-full object-cover"
                            alt="Preview"
                          />
                        ) : (
                          <>
                            <div className="h-10 w-10 rounded-full bg-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/30 group-hover:scale-110 transition-transform">
                              <ImagePlus size={20} />
                            </div>
                            <span className="text-xs font-bold text-white">
                              Escolher uma foto
                            </span>
                            <span className="text-[10px] text-white/40">
                              vai virar um quebra-cabeça 9x9
                            </span>
                          </>
                        )}
                      </label>

                      <div className="mt-4 rounded-xl bg-white/5 p-3 flex items-start gap-2">
                        <span className="text-xs">💡</span>
                        <p className="text-[10px] text-white/60 leading-relaxed italic">
                          Uma foto que{" "}
                          <span className="text-white font-bold">
                            só ele(a) vai entender
                          </span>{" "}
                          funciona melhor — a primeira foto juntos, o lugar onde
                          pediu em namoro...
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Jogo da Memória */}
                <div className="rounded-[2rem] bg-white/5 border border-white/10 overflow-hidden">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Gamepad2 size={24} className="text-white" />
                      </div>
                      <div>
                        <h1 className="text-sm font-bold text-white">
                          Jogo da memória
                        </h1>
                        <p className="text-[10px] text-white/50">
                          Pares de fotos pra virar e combinar
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setGames((prev) => ({
                          ...prev,
                          memory: {
                            ...prev.memory,
                            active: !prev.memory.active,
                          },
                        }))
                      }
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${games.memory.active ? "bg-fuchsia-500" : "bg-white/10"}`}
                    >
                      <div
                        className={`h-4 w-4 bg-white rounded-full transition-transform ${games.memory.active ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </button>
                  </div>

                  {games.memory.active && (
                    <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="rounded-xl border border-white/5 bg-white/5 p-3 mb-4 flex items-center gap-2">
                        <span className="text-xs">🎴</span>
                        <p className="text-[10px] text-white/70 font-medium">
                          Pares de cartas com fotos de vocês — vira as cartas e
                          acha os pares
                        </p>
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <h2 className="text-[10px] font-black uppercase tracking-wider text-white/40 flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 flex items-center justify-center text-[10px]">
                            1
                          </span>
                          Fotos pro Jogo
                        </h2>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${games.memory.images.length >= 3 ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/60"}`}
                        >
                          {games.memory.images.length}/6 (mín 3)
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {games.memory.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-2xl overflow-hidden group"
                          >
                            <img
                              src={img}
                              className="w-full h-full object-cover"
                              alt="Memory"
                            />
                            <button
                              onClick={() =>
                                setGames((prev) => ({
                                  ...prev,
                                  memory: {
                                    ...prev.memory,
                                    images: prev.memory.images.filter(
                                      (_, i) => i !== idx,
                                    ),
                                  },
                                }))
                              }
                              className="absolute top-1 right-1 h-5 w-5 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                        {games.memory.images.length < 6 && (
                          <>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              id="memory-upload"
                              className="hidden"
                              onChange={async (e) => {
                                const files = Array.from(e.target.files || []);
                                const remaining =
                                  6 - games.memory.images.length;
                                const selectedFiles = files.slice(0, remaining);

                                const base64Images = await Promise.all(
                                  selectedFiles.map(
                                    (file) =>
                                      new Promise<string>((resolve) => {
                                        const reader = new FileReader();
                                        reader.onload = () =>
                                          resolve(reader.result as string);
                                        reader.readAsDataURL(file);
                                      }),
                                  ),
                                );

                                setGames((prev) => ({
                                  ...prev,
                                  memory: {
                                    ...prev.memory,
                                    images: [
                                      ...prev.memory.images,
                                      ...base64Images,
                                    ],
                                  },
                                }));
                              }}
                            />
                            <label
                              htmlFor="memory-upload"
                              className="aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition-colors cursor-pointer"
                            >
                              <span className="text-lg text-white/40">+</span>
                              <span className="text-[9px] font-bold text-white/40">
                                várias fotos
                              </span>
                            </label>
                          </>
                        )}
                      </div>

                      <div className="mt-4 rounded-xl bg-white/5 p-3 flex items-start gap-2">
                        <span className="text-xs">🎴</span>
                        <p className="text-[10px] text-white/60 leading-relaxed">
                          Cada foto vira um par de cartas. Escolhe{" "}
                          <span className="text-white font-bold">3 fotos</span>{" "}
                          que marcaram — viagens, jantares, selfies bobas.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quiz */}
                <div className="rounded-[2rem] bg-white/5 border border-white/10 overflow-hidden">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <CircleHelp size={24} className="text-white" />
                      </div>
                      <div>
                        <h1 className="text-sm font-bold text-white">
                          Quanto ela te conhece?
                        </h1>
                        <p className="text-[10px] text-white/50">
                          Perguntas sobre a mãe
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setGames((prev) => ({
                          ...prev,
                          quiz: { ...prev.quiz, active: !prev.quiz.active },
                        }))
                      }
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${games.quiz.active ? "bg-fuchsia-500" : "bg-white/10"}`}
                    >
                      <div
                        className={`h-4 w-4 bg-white rounded-full transition-transform ${games.quiz.active ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </button>
                  </div>

                  {games.quiz.active && (
                    <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="rounded-xl border border-white/5 bg-white/5 p-3 mb-4 flex items-center gap-2">
                        <span className="text-xs text-orange-400">❓</span>
                        <p className="text-[10px] text-white/70 font-medium">
                          Perguntas personalizadas que só quem te conhece
                          responde
                        </p>
                      </div>

                      <div className="space-y-4">
                        {games.quiz.questions.map((q, idx) => (
                          <div
                            key={idx}
                            className="relative p-4 rounded-2xl border border-white/10 bg-white/5 animate-in zoom-in-95 duration-300"
                          >
                            <button
                              onClick={() => {
                                const newQs = games.quiz.questions.filter(
                                  (_, i) => i !== idx,
                                );
                                setGames((prev) => ({
                                  ...prev,
                                  quiz: { ...prev.quiz, questions: newQs },
                                }));
                              }}
                              className="absolute top-3 right-3 text-white/30 hover:text-white"
                            >
                              <X size={14} />
                            </button>
                            <h2 className="text-[10px] font-black uppercase tracking-wider text-white/40 mb-3 flex items-center gap-2">
                              <span className="h-5 w-5 rounded-full bg-fuchsia-500 text-white flex items-center justify-center text-[10px]">
                                {idx + 1}
                              </span>
                              Pergunta
                            </h2>
                            <textarea
                              value={q.q}
                              onChange={(e) => {
                                const newQs = [...games.quiz.questions];
                                newQs[idx].q = e.target.value;
                                setGames((prev) => ({
                                  ...prev,
                                  quiz: { ...prev.quiz, questions: newQs },
                                }));
                              }}
                              placeholder="Ex: Qual o meu filme favorito?"
                              className="w-full bg-transparent border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-fuchsia-500/50 min-h-[80px]"
                            />

                            <div className="mt-4">
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">
                                Opções - Toca na correta ✓
                              </h3>
                              <div className="space-y-2">
                                {q.options.map((opt, oIdx) => (
                                  <div
                                    key={oIdx}
                                    className="flex items-center gap-2 group"
                                  >
                                    <button
                                      onClick={() => {
                                        const newQs = [...games.quiz.questions];
                                        newQs[idx].correct = oIdx;
                                        setGames((prev) => ({
                                          ...prev,
                                          quiz: {
                                            ...prev.quiz,
                                            questions: newQs,
                                          },
                                        }));
                                      }}
                                      className={`h-7 w-7 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all ${q.correct === oIdx ? "bg-emerald-500 border-emerald-500 text-white" : "border-white/20 text-white/40 hover:border-white/40"}`}
                                    >
                                      {q.correct === oIdx
                                        ? "✓"
                                        : String.fromCharCode(65 + oIdx)}
                                    </button>
                                    <div className="relative flex-1">
                                      <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                          const newQs = [
                                            ...games.quiz.questions,
                                          ];
                                          newQs[idx].options[oIdx] =
                                            e.target.value;
                                          setGames((prev) => ({
                                            ...prev,
                                            quiz: {
                                              ...prev.quiz,
                                              questions: newQs,
                                            },
                                          }));
                                        }}
                                        placeholder={`Resposta ${String.fromCharCode(65 + oIdx)}`}
                                        className={`w-full bg-transparent border ${q.correct === oIdx ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10"} rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-fuchsia-500/30`}
                                      />
                                      {q.options.length > 2 && (
                                        <button
                                          onClick={() => {
                                            const newQs = [
                                              ...games.quiz.questions,
                                            ];
                                            newQs[idx].options =
                                              q.options.filter(
                                                (_, i) => i !== oIdx,
                                              );
                                            if (q.correct === oIdx)
                                              newQs[idx].correct = 0;
                                            setGames((prev) => ({
                                              ...prev,
                                              quiz: {
                                                ...prev.quiz,
                                                questions: newQs,
                                              },
                                            }));
                                          }}
                                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/10 hover:text-white/40"
                                        >
                                          <X size={12} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                                {q.options.length < 4 && (
                                  <button
                                    onClick={() => {
                                      const newQs = [...games.quiz.questions];
                                      newQs[idx].options.push("");
                                      setGames((prev) => ({
                                        ...prev,
                                        quiz: {
                                          ...prev.quiz,
                                          questions: newQs,
                                        },
                                      }));
                                    }}
                                    className="w-full py-2 rounded-xl border border-dashed border-white/10 text-[10px] font-bold text-white/40 hover:bg-white/5"
                                  >
                                    + Mais uma opção
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          if (games.quiz.questions.length >= 5) return;
                          setGames((prev) => ({
                            ...prev,
                            quiz: {
                              ...prev.quiz,
                              questions: [
                                ...prev.quiz.questions,
                                { q: "", options: ["", ""], correct: 0 },
                              ],
                            },
                          }));
                        }}
                        className="w-full mt-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-xs font-bold text-white flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                      >
                        <span>+ Mais uma pergunta</span>
                        <span className="text-white/30">
                          ({games.quiz.questions.length}/5)
                        </span>
                      </button>

                      <div className="mt-4 rounded-xl bg-white/5 p-3 flex items-start gap-2">
                        <span className="text-xs">💬</span>
                        <p className="text-[10px] text-white/60 leading-relaxed">
                          Mistura fácil com difícil:{" "}
                          <span className="text-white">
                            "qual minha comida favorita"
                          </span>{" "}
                          junto com{" "}
                          <span className="text-white">
                            "qual foi o primeiro filme que vimos juntos"
                          </span>
                          .
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {currentStep === 9 && (
              <div className="mb-4 flex flex-col gap-6">
                {/* Card VIP */}
                <button
                  type="button"
                  onClick={() => handlePayment("vip")}
                  disabled={isProcessingPayment}
                  className="relative overflow-visible rounded-[1.75rem] border-2 border-yellow-400 bg-[linear-gradient(180deg,rgba(120,32,72,0.28)_0%,rgba(28,9,34,0.96)_100%)] px-4 pb-5 pt-6 shadow-[0_0_30px_rgba(250,204,21,0.14)] text-left transition-all active:scale-[0.98] hover:shadow-[0_0_45px_rgba(250,204,21,0.25)] disabled:opacity-60"
                >
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-orange-600 via-yellow-600 to-violet-600 px-3 py-1 text-center text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
                    🤍 Melhor custo 🤍
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-black text-yellow-300">VIP</span>
                        <span className="text-sm text-yellow-300">💎</span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-white/80">
                        Tudo liberado - preco fechado
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-white/30 line-through">R$ 49,99</p>
                      <p className="text-3xl font-black leading-none text-white">R$ 34,99</p>
                      <p className="mt-1 text-xs font-bold text-emerald-400">Economize R$ 15,00</p>
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

                  <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-yellow-400/15 border border-yellow-400/30 py-2.5 text-xs font-black uppercase tracking-widest text-yellow-300">
                    {isProcessingPayment ? <span className="animate-pulse">Processando...</span> : <><span>Escolher VIP</span> <ArrowRight size={14} /></>}
                  </div>
                </button>

                {/* Card Avançado */}
                <button
                  type="button"
                  onClick={() => handlePayment("avancado")}
                  disabled={isProcessingPayment}
                  className="relative overflow-visible rounded-[1.75rem] border border-fuchsia-400/60 bg-[linear-gradient(180deg,rgba(99,20,66,0.45)_0%,rgba(15,7,22,0.98)_100%)] px-4 pb-5 pt-6 shadow-[0_0_25px_rgba(217,70,239,0.18)] text-left transition-all active:scale-[0.98] hover:shadow-[0_0_40px_rgba(217,70,239,0.3)] disabled:opacity-60"
                >
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-3 py-1 text-center text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
                    ✨ Mais popular ✨
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-black text-white">Avançado</span>
                        <span className="text-sm text-fuchsia-300">✨</span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-white/75">A experiência completa</p>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-black leading-none text-white">R$ 24,90</p>
                      <p className="mt-1 text-xs font-bold text-white/45">+ add-ons opcionais</p>
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

                  <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-fuchsia-500/15 border border-fuchsia-400/30 py-2.5 text-xs font-black uppercase tracking-widest text-fuchsia-300">
                    {isProcessingPayment ? <span className="animate-pulse">Processando...</span> : <><span>Escolher Avançado</span> <ArrowRight size={14} /></>}
                  </div>
                </button>

                {/* Card Básico */}
                <button
                  type="button"
                  onClick={() => handlePayment("basico")}
                  disabled={isProcessingPayment}
                  className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(35,19,44,0.45)_0%,rgba(12,8,20,0.98)_100%)] px-4 pb-5 pt-5 text-left transition-all active:scale-[0.98] hover:border-white/20 disabled:opacity-60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-2xl font-black text-white">Básico</span>
                      <p className="mt-1 text-xs font-semibold text-white/75">O essencial pra emocionar</p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-black leading-none text-white">R$ 19,90</p>
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

                  <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white/8 border border-white/10 py-2.5 text-xs font-black uppercase tracking-widest text-white/60">
                    {isProcessingPayment ? <span className="animate-pulse">Processando...</span> : <><span>Escolher Básico</span> <ArrowRight size={14} /></>}
                  </div>
                </button>
              </div>
            )}
            {currentStep === 7 && (
              <div className="mb-2">
                <div className="uppercase text-white/45 text-[10px] mb-3 font-bold tracking-[0.2em] flex items-center gap-2">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <span>✨ Favoritos do Cupido</span>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <div className="static-carousel relative -mx-4 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [-ms-overflow-style:none]">
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setSelectedBackground(bg.id)}
                      className={`relative flex min-h-[160px] min-w-[140px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border transition-all ${
                        selectedBackground === bg.id
                          ? "border-fuchsia-500 ring-1 ring-fuchsia-500/50"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {/* Background Preview */}
                      <div
                        className={`absolute inset-0 opacity-60 ${bg.class}`}
                      />

                      {/* Particles Animation Overlay inside Card */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {bg.type !== "none" &&
                          [...Array(bg.type === "twinkle" ? 15 : 8)].map(
                            (_, i) => {
                              const isHearts = bg.type === "hearts";
                              const isTwinkle = bg.type === "twinkle";
                              const isMixed = bg.type === "mixed-dots";

                              const dotColor = isMixed
                                ? i % 2 === 0
                                  ? "bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                                  : "bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.8)]"
                                : "bg-white/60 shadow-[0_0_5px_rgba(255,255,255,0.5)]";

                              return (
                                <div
                                  key={i}
                                  className={`absolute ${isHearts ? "" : isTwinkle ? "h-1 w-1 rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,1)]" : `h-1.5 w-1.5 rounded-full ${dotColor}`}`}
                                  style={{
                                    left: isTwinkle
                                      ? `${(i * 37.7) % 100}%`
                                      : `${(i * 23.7) % 100}%`,
                                    top: isTwinkle
                                      ? `${(i * 29.3) % 100}%`
                                      : `-10px`,
                                    animationName: isTwinkle
                                      ? "twinkle"
                                      : "falling-dots",
                                    animationDuration: isTwinkle
                                      ? `${1.5 + (i % 2)}s`
                                      : `${3 + (i % 3)}s`,
                                    animationTimingFunction: isTwinkle
                                      ? "ease-in-out"
                                      : "linear",
                                    animationIterationCount: "infinite",
                                    animationDelay: isTwinkle
                                      ? `${i * 0.2}s`
                                      : `${i * 0.8}s`,
                                    opacity: isTwinkle ? 0 : 1,
                                  }}
                                >
                                  {isHearts && (
                                    <Heart
                                      size={14}
                                      fill="#f472b6"
                                      className="text-fuchsia-400 opacity-80"
                                    />
                                  )}
                                </div>
                              );
                            },
                          )}
                      </div>

                      {/* Badge Favorito */}
                      {bg.favorite && (
                        <div className="absolute top-2 left-2 z-10">
                          <div className="bg-fuchsia-500/80 backdrop-blur-md px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                            <Heart
                              size={8}
                              fill="white"
                              className="text-white"
                            />
                            <span className="text-[8px] font-black uppercase text-white leading-none">
                              Favorito
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="relative mt-auto p-3 z-10 bg-gradient-to-t from-black/80 to-transparent w-full">
                        <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
                          {bg.type === "hearts"
                            ? "💗"
                            : bg.type === "dots"
                              ? "✨"
                              : "🌑"}{" "}
                          {bg.name}
                        </h1>
                        <p className="text-[10px] text-white/50 font-medium">
                          {bg.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep !== 2 &&
              currentStep !== 3 &&
              currentStep !== 4 &&
              currentStep !== 5 &&
              currentStep !== 6 &&
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

          {/* Hidden inputs for gallery and camera */}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryUpload}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleGalleryUpload}
            className="hidden"
          />

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
            <div className="absolute top-2 left-1/2 h-5 w-18 -translate-x-1/2 rounded-full bg-[#0C0212] border-[1px] border-zinc-600 sm:h-8 sm:w-40 z-20" />

            <div
              className={`relative h-full w-full overflow-hidden transition-all duration-700 ${backgrounds.find((bg) => bg.id === selectedBackground)?.class || "bg-[#0C0212]"}`}
            >
              {/* Special Opening Overlay */}
              {specialOpening.enabled && !specialOpening.isFinished && (
                <div
                  className={`absolute inset-0 z-[100] bg-[#FFF0F5] flex flex-col items-center justify-center p-6 transition-all duration-1000 ${specialOpening.isExiting ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"} ${!specialOpening.isExiting ? "animate-in fade-in duration-700" : ""}`}
                >
                  <div className="w-full max-w-[200px] aspect-square relative mb-12">
                    <img
                      key={specialOpening.image}
                      src={specialOpening.image}
                      alt="Rabbit"
                      className="w-full h-full object-contain floating-rabbit animate-in fade-in zoom-in duration-800 fill-mode-both"
                    />
                  </div>

                  <h2
                    key={specialOpening.message}
                    className="text-xl font-bold text-[#E91E63] text-center mb-8 leading-tight italic animate-in slide-in-from-bottom-2 duration-500"
                    style={{ fontFamily: "Playlist" }}
                  >
                    {specialOpening.message}
                  </h2>

                  {specialOpening.status !== "success" && (
                    <div className="flex gap-4 w-full animate-in fade-in duration-500">
                      <button
                        onClick={() => {
                          setSpecialOpening((prev) => ({
                            ...prev,
                            status: "success",
                            image: "/Coelho/dois.png",
                            message: "Eu sabia! 😍",
                            showNoButton: true,
                          }));
                          // Start exiting sequence
                          setTimeout(() => {
                            setSpecialOpening((prev) => ({
                              ...prev,
                              isExiting: true,
                            }));
                            setTimeout(() => {
                              setSpecialOpening((prev) => ({
                                ...prev,
                                isFinished: true,
                              }));
                            }, 1000); // Match duration-1000
                          }, 2000);
                        }}
                        className="flex-1 bg-[#4CAF50] text-white py-4 rounded-3xl font-black italic text-sm shadow-[0_8px_0_#2E7D32] active:translate-y-1 active:shadow-[0_4px_0_#2E7D32] transition-all tracking-widest"
                      >
                        SIM
                      </button>

                      {specialOpening.showNoButton && (
                        <button
                          onClick={() => {
                            setSpecialOpening((prev) => ({
                              ...prev,
                              status: "denied",
                              image: "/Coelho/tres.png",
                              message: "Fala a verdade! 😤",
                              showNoButton: false,
                            }));
                          }}
                          className="flex-1 bg-[#F44336] text-white py-4 rounded-3xl font-black italic text-sm shadow-[0_8px_0_#C62828] active:translate-y-1 active:shadow-[0_4px_0_#C62828] transition-all tracking-widest"
                        >
                          NAO
                        </button>
                      )}
                    </div>
                  )}

                  {/* Reset button for preview purposes if needed */}
                  <button
                    onClick={() =>
                      setSpecialOpening((prev) => ({
                        ...prev,
                        status: "question",
                        image: "/Coelho/um.png",
                        message: "Voce me ama? ❤️",
                        showNoButton: true,
                        isFinished: false,
                        isExiting: false,
                      }))
                    }
                    className="absolute bottom-4 text-[8px] text-[#E91E63]/30 uppercase font-black tracking-tighter"
                  >
                    Reset Preview
                  </button>
                </div>
              )}

              {/* Layer 1: Fixed Particles Overlay */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {backgrounds.find((bg) => bg.id === selectedBackground)
                  ?.type !== "none" &&
                  [
                    ...Array(
                      backgrounds.find((bg) => bg.id === selectedBackground)
                        ?.type === "twinkle"
                        ? 40
                        : 20,
                    ),
                  ].map((_, i) => {
                    const bg = backgrounds.find(
                      (b) => b.id === selectedBackground,
                    );
                    const isHearts = bg?.type === "hearts";
                    const isTwinkle = bg?.type === "twinkle";
                    const isMixed = bg?.type === "mixed-dots";

                    const dotColor = isMixed
                      ? i % 2 === 0
                        ? "bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                        : "bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.8)]"
                      : "bg-white/40 shadow-[0_0_5px_rgba(255,255,255,0.5)]";

                    return (
                      <div
                        key={i}
                        className={`absolute ${isHearts ? "" : isTwinkle ? "h-1 w-1 rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,1)]" : `h-1 w-1 rounded-full ${dotColor}`}`}
                        style={{
                          left: isTwinkle
                            ? `${(i * 13.7) % 100}%`
                            : `${(i * 7.7) % 100}%`,
                          top: isTwinkle ? `${(i * 19.3) % 100}%` : `-20px`,
                          animationName: isTwinkle ? "twinkle" : "falling-dots",
                          animationDuration: isTwinkle
                            ? `${2 + (i % 3)}s`
                            : `${4 + (i % 3) * 2}s`,
                          animationTimingFunction: isTwinkle
                            ? "ease-in-out"
                            : "linear",
                          animationIterationCount: "infinite",
                          animationDelay: isTwinkle
                            ? `${i * 0.1}s`
                            : `${i * 0.5}s`,
                          opacity: isTwinkle ? 0 : 1,
                        }}
                      >
                        {isHearts && (
                          <Heart
                            size={10}
                            fill="#f472b6"
                            className="text-fuchsia-400 opacity-60"
                          />
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Layer 2: Scrollable Content */}
              <div className="relative z-10 h-full w-full overflow-y-auto overflow-x-hidden scroll-smooth flex flex-col items-center px-4 pt-16 pb-12 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]">
                <p
                  className="text-center text-xl font-semibold w-full"
                  style={{ fontFamily: "Playlist", color: activeTitleColor }}
                >
                  {answers[1] || "Seu Titulo Aqui"}
                </p>
                <p
                  className={`mt-3 text-center text-white/75 w-full ${messageSizeClass} ${
                    messageTextStyle.bold ? "font-bold" : "font-medium"
                  } ${messageTextStyle.italic ? "italic" : ""} ${
                    messageTextStyle.strike ? "line-through" : ""
                  }`}
                >
                  {answers[2] || "Sua mensagem de amor..."}
                </p>

                {currentStep >= 4 && uploadedImages.length > 0 && (
                  <button
                    onClick={() => setIsDomeOpen(true)}
                    className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#4A2440] bg-[#1E0E1C] px-4 py-2 text-center transition-colors hover:bg-white/5 shadow-lg shadow-fuchsia-900/20"
                  >
                    <Eye size={18} className="text-white/80" />
                    <span className="text-sm font-semibold text-white">
                      Nossa Linha do Tempo
                    </span>
                  </button>
                )}

                {uploadedImages.length > 0 && (
                  <div className="w-full flex flex-col items-center">
                    <div
                      ref={previewCarouselRef}
                      onScroll={handlePreviewScroll}
                      className={`static-carousel flex w-full snap-x snap-mandatory gap-2 overflow-x-auto [scrollbar-width:none] px-4 shrink-0 ${currentStep === 4 ? "mt-2" : "mt-4"}`}
                    >
                      {uploadedImages.map((image, index) => (
                        <div
                          key={image.id || index}
                          className={`aspect-square min-w-[92%] snap-center overflow-hidden rounded-3xl transition-all duration-500 ease-out transform ${
                            index === currentPhotoIdx
                              ? "scale-100 opacity-100"
                              : "scale-[0.85] opacity-40 blur-[1px]"
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={`Foto enviada pelo cliente ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    {/* Indicators */}
                    <div className="flex gap-1.5 mt-4">
                      {uploadedImages.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentPhotoIdx ? "w-4 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "w-1.5 bg-white/20"}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {currentStep >= 4 && (
                  <div className="mt-4 w-full flex flex-col gap-2 shrink-0">
                    {(games.puzzle.active ||
                      games.memory.active ||
                      games.quiz.active) && (
                      <button
                        onClick={() => setIsGameSelectorOpen(true)}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-indigo-900/40 bg-indigo-950/40 px-4 py-2 text-center transition-colors hover:bg-white/5 shadow-lg shadow-indigo-900/20 animate-in fade-in zoom-in-95 duration-300"
                      >
                        <Gamepad2 size={18} className="text-indigo-300" />
                        <span className="text-sm font-semibold text-white">
                          Vamos Jogar?
                        </span>
                      </button>
                    )}
                  </div>
                )}

                {selectedSpotifyTrack && (
                  <div className="mt-6 w-full max-w-[220px] bg-[#121212] rounded-xl overflow-hidden shadow-lg mb-4 border border-white/5 flex flex-col shrink-0">
                    {/* Iframe invisível apenas para o áudio */}
                    {isMusicPlaying && (
                      <iframe
                        ref={youtubeIframeRef}
                        src={`https://www.youtube.com/embed/${selectedSpotifyTrack.id}?autoplay=1&rel=0&controls=0&modestbranding=1`}
                        allow="autoplay; encrypted-media"
                        frameBorder="0"
                        title={selectedSpotifyTrack.name}
                        className="absolute w-0 h-0 pointer-events-none opacity-0"
                      />
                    )}

                    {/* Capa sempre visível */}
                    <div className="relative w-full h-28 overflow-hidden">
                      <img
                        src={selectedSpotifyTrack.albumArt}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Thumbnail"
                      />
                      {/* Overlay escuro com animação de equalizer quando tocando */}
                      {isMusicPlaying && (
                        <div className="absolute inset-0 bg-black/20 flex items-end justify-start p-2 gap-[3px]">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="w-[3px] bg-fuchsia-400 rounded-full"
                              style={{
                                height: `${8 + (i % 2 === 0 ? 12 : 6)}px`,
                                animation: `eq-bounce ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col overflow-hidden pr-2 flex-1">
                          <span className="text-white font-bold text-[11px] leading-tight line-clamp-2">
                            {selectedSpotifyTrack.name}
                          </span>
                          <span className="text-white/60 text-[10px] mt-0.5 truncate">
                            {selectedSpotifyTrack.artist}
                          </span>
                        </div>
                        <Heart
                          size={14}
                          className="text-white/60 shrink-0 mt-0.5"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-fuchsia-500 transition-all duration-500"
                            style={{
                              width: `${(elapsedSeconds / trackDuration) * 100}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-[8px] text-white/40 font-medium">
                          <span>{formatTime(elapsedSeconds)}</span>
                          <span>{formatTime(trackDuration)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center px-1 mt-1">
                        <SkipBack size={14} className="text-white/40" />
                        <button
                          onClick={() => setIsMusicPlaying((prev) => !prev)}
                          className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg shadow-white/5 hover:scale-105 transition-transform"
                        >
                          {isMusicPlaying ? (
                            <div className="flex gap-[2px]">
                              <div className="w-[2px] h-2.5 bg-black rounded-sm" />
                              <div className="w-[2px] h-2.5 bg-black rounded-sm" />
                            </div>
                          ) : (
                            <Play
                              size={10}
                              className="text-black ml-0.5"
                              fill="black"
                            />
                          )}
                        </button>
                        <SkipForward size={14} className="text-white/40" />
                        <Repeat size={12} className="text-white/20" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Game Selector Overlay - stays on top of scrollable content */}
              {isGameSelectorOpen && (
                <div className="absolute inset-0 z-50 bg-[#0C0212] flex flex-col items-center px-4 pt-20 animate-in fade-in duration-300">
                  <button
                    onClick={() => setIsGameSelectorOpen(false)}
                    className="absolute top-4 right-4 text-white/50 hover:text-white"
                  >
                    <X size={20} />
                  </button>

                  <h1
                    className="text-2xl text-white mb-8"
                    style={{ fontFamily: "Playlist" }}
                  >
                    Escolha um Jogo
                  </h1>

                  <div className="grid grid-cols-1 gap-4 w-full overflow-y-auto px-2 pb-10 custom-scrollbar">
                    {games.memory.active && (
                      <button
                        onClick={startMemory}
                        disabled={games.memory.images.length < 3}
                        className={`flex flex-col items-center gap-3 rounded-3xl border border-white/5 p-6 text-center transition-all hover:scale-[1.02] active:scale-95 ${games.memory.images.length < 3 ? "opacity-50 grayscale cursor-not-allowed bg-white/5" : "bg-[#1a0b1e]"}`}
                      >
                        <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Gamepad2 size={28} className="text-purple-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">
                          Jogo da Memória
                        </h2>
                        <p className="text-[10px] text-white/50 leading-tight px-4">
                          {games.memory.images.length < 3
                            ? "Adicione pelo menos 3 fotos"
                            : "Encontre os pares de suas fotos especiais."}
                        </p>
                      </button>
                    )}

                    {games.puzzle.active && (
                      <button
                        onClick={startPuzzle}
                        className="flex flex-col items-center gap-3 rounded-3xl border border-white/5 bg-[#1e0e1c] p-6 text-center transition-all hover:scale-[1.02] active:scale-95"
                      >
                        <div className="h-12 w-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                          <Puzzle size={28} className="text-pink-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">
                          Quebra-cabeça
                        </h2>
                        <p className="text-[10px] text-white/50 leading-tight px-4">
                          Monte peça por peça para revelar sua foto.
                        </p>
                      </button>
                    )}

                    {games.quiz.active && (
                      <button
                        onClick={startQuiz}
                        className="flex flex-col items-center gap-3 rounded-3xl border border-white/5 bg-[#0e1c1e] p-6 text-center transition-all hover:scale-[1.02] active:scale-95"
                      >
                        <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <CircleHelp size={28} className="text-blue-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">
                          Quiz Especial
                        </h2>
                        <p className="text-[10px] text-white/50 leading-tight px-4">
                          Responda as perguntas e mostre que me conhece.
                        </p>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Quiz Game Screen */}
              {activeGame === "quiz" && (
                <div
                  className={`absolute inset-0 z-[60] bg-[#0C0212] flex flex-col items-center px-4 pt-16 animate-in fade-in duration-300 ${isAnimateCorrect ? "ring-inset ring-8 ring-emerald-500/30" : ""}`}
                >
                  <button
                    onClick={() => setActiveGame(null)}
                    className="absolute top-4 left-4 text-white/50 hover:text-white flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                  >
                    <ArrowLeft size={14} /> Sair
                  </button>

                  <h1
                    className="text-2xl text-white mb-2"
                    style={{ fontFamily: "Playlist" }}
                  >
                    {quizFeedback ? "Resultado do Quiz" : "Quanto me conhece?"}
                  </h1>
                  <p className="text-[10px] text-white/40 mb-8 uppercase tracking-[0.2em] font-black">
                    {quizFeedback
                      ? "Veja como você se saiu"
                      : `Pergunta ${currentQuizIdx + 1} de ${games.quiz.questions.length}`}
                  </p>

                  {!quizFeedback ? (
                    <div className="w-full animate-in slide-in-from-right-4 duration-300">
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6">
                        <h2 className="text-lg font-bold text-white text-center leading-tight">
                          {games.quiz.questions[currentQuizIdx].q ||
                            "Pergunta sem título"}
                        </h2>
                      </div>

                      <div className="space-y-3">
                        {games.quiz.questions[currentQuizIdx].options.map(
                          (opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                const isCorrect =
                                  idx ===
                                  games.quiz.questions[currentQuizIdx].correct;
                                if (isCorrect) {
                                  setQuizScore((prev) => prev + 1);
                                  setIsAnimateCorrect(true);
                                  setTimeout(
                                    () => setIsAnimateCorrect(false),
                                    500,
                                  );
                                }

                                if (
                                  currentQuizIdx <
                                  games.quiz.questions.length - 1
                                ) {
                                  setCurrentQuizIdx((prev) => prev + 1);
                                } else {
                                  // Finalizar
                                  const finalScore =
                                    quizScore + (isCorrect ? 1 : 0);
                                  const total = games.quiz.questions.length;
                                  const percent = (finalScore / total) * 100;

                                  let msg = "";
                                  if (percent === 100)
                                    msg = "Uau! Você é minha alma gêmea! ❤️";
                                  else if (percent >= 70)
                                    msg =
                                      "Muito bom! Me conhece quase tudo! ✨";
                                  else if (percent >= 50)
                                    msg =
                                      "Na média, mas podemos melhorar hein? 👀";
                                  else
                                    msg =
                                      "Xiii... precisa prestar mais atenção em mim! 😂";

                                  setQuizFeedback(msg);
                                }
                              }}
                              className="w-full flex items-center gap-4 bg-white/5 border border-white/10 hover:border-fuchsia-500/50 hover:bg-white/10 p-4 rounded-2xl transition-all group"
                            >
                              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white group-hover:bg-fuchsia-500">
                                {String.fromCharCode(65 + idx)}
                              </div>
                              <span className="text-sm text-white/80 font-medium">
                                {opt || `Opção ${idx + 1}`}
                              </span>
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col items-center animate-in zoom-in-95 duration-500">
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/30">
                        <CircleHelp size={40} className="text-white" />
                      </div>

                      <div className="text-center mb-8">
                        <p className="text-4xl font-black text-white mb-2">
                          {quizScore}/{games.quiz.questions.length}
                        </p>
                        <p className="text-lg font-bold text-fuchsia-400 leading-tight px-4">
                          {quizFeedback}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setActiveGame(null);
                          setIsGameSelectorOpen(false);
                        }}
                        className="w-full bg-white text-black py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-white/10 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        Voltar para a página
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Active Game Screen */}
              {activeGame === "puzzle" && (
                <div className="absolute inset-0 z-[60] bg-[#0C0212] flex flex-col items-center px-4 pt-16 animate-in fade-in duration-300">
                  <button
                    onClick={() => setActiveGame(null)}
                    className="absolute top-4 left-4 text-white/50 hover:text-white flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                  >
                    <ArrowLeft size={14} /> Sair
                  </button>

                  <h1
                    className="text-2xl text-white mb-2"
                    style={{ fontFamily: "Playlist" }}
                  >
                    {puzzlePieces.every((p, i) => p === i) &&
                    puzzlePieces.length > 0
                      ? "Parabéns você conseguiu"
                      : "Quebra-cabeça"}
                  </h1>
                  <p className="text-[10px] text-white/40 mb-8 uppercase tracking-[0.2em] font-black">
                    {puzzlePieces.every((p, i) => p === i) &&
                    puzzlePieces.length > 0
                      ? "Você revelou a foto completa!"
                      : "Toque em duas peças para trocar"}
                  </p>

                  <div className="w-full aspect-square grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 relative">
                    {puzzlePieces.map((pieceIdx, currentPos) => {
                      const isWin =
                        puzzlePieces.every((p, i) => p === i) &&
                        puzzlePieces.length > 0;
                      return (
                        <button
                          key={currentPos}
                          disabled={isWin}
                          onClick={() => {
                            if (selectedPiece === null) {
                              setSelectedPiece(currentPos);
                            } else {
                              const newPieces = [...puzzlePieces];
                              [
                                newPieces[selectedPiece],
                                newPieces[currentPos],
                              ] = [
                                newPieces[currentPos],
                                newPieces[selectedPiece],
                              ];
                              setPuzzlePieces(newPieces);
                              setSelectedPiece(null);
                            }
                          }}
                          className={`relative overflow-hidden rounded-lg transition-all duration-300 ${selectedPiece === currentPos ? "ring-2 ring-fuchsia-500 scale-95 z-10" : ""} ${isWin ? "grayscale-0 brightness-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]" : ""}`}
                        >
                          <div
                            className="absolute inset-0 bg-no-repeat"
                            style={{
                              backgroundImage: `url(${games.puzzle.image || "https://via.placeholder.com/300"})`,
                              backgroundSize: "300% 300%",
                              backgroundPosition: `${(pieceIdx % 3) * 50}% ${Math.floor(pieceIdx / 3) * 50}%`,
                            }}
                          />
                          {!isWin && (
                            <div className="absolute inset-0 bg-black/10" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {puzzlePieces.every((p, i) => p === i) &&
                  puzzlePieces.length > 0 ? (
                    <div className="mt-12 w-full animate-in slide-in-from-bottom-4 duration-500">
                      <button
                        onClick={() => {
                          setActiveGame(null);
                          setIsGameSelectorOpen(false);
                        }}
                        className="w-full bg-white text-black py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-white/10 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        Voltar para a página
                      </button>
                    </div>
                  ) : (
                    <div className="mt-10 p-4 rounded-2xl bg-white/5 border border-white/10 w-full flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-fuchsia-500/20 flex items-center justify-center shrink-0">
                        <Puzzle size={20} className="text-fuchsia-400" />
                      </div>
                      <p className="text-[10px] text-white/50 leading-relaxed font-medium">
                        O quebra-cabeça ajuda a focar nas memórias... <br />
                        <span className="text-white/80">
                          Monte as 9 peças para ver a foto completa.
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Memory Game Screen */}
              {activeGame === "memory" && (
                <div className="absolute inset-0 z-[60] bg-[#0C0212] flex flex-col items-center px-4 pt-16 animate-in fade-in duration-300">
                  <button
                    onClick={() => setActiveGame(null)}
                    className="absolute top-4 left-4 text-white/50 hover:text-white flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                  >
                    <ArrowLeft size={14} /> Sair
                  </button>

                  <h1
                    className="text-2xl text-white mb-2"
                    style={{ fontFamily: "Playlist" }}
                  >
                    {memoryCards.every((c) => c.isMatched)
                      ? "Parabéns você conseguiu"
                      : "Jogo da Memória"}
                  </h1>
                  <p className="text-[10px] text-white/40 mb-8 uppercase tracking-[0.2em] font-black">
                    {memoryCards.every((c) => c.isMatched)
                      ? "Você encontrou todos os pares!"
                      : "Encontre as fotos iguais"}
                  </p>

                  <div
                    className={`w-full grid ${memoryCards.length <= 8 ? "grid-cols-3" : "grid-cols-4"} gap-2 bg-white/5 p-2 rounded-2xl border border-white/10`}
                  >
                    {memoryCards.map((card, idx) => (
                      <button
                        key={card.id}
                        disabled={
                          card.isMatched || card.isFlipped || isMemoryChecking
                        }
                        onClick={() => {
                          const newDeck = [...memoryCards];
                          newDeck[idx].isFlipped = true;
                          setMemoryCards(newDeck);

                          const newFlipped = [...flippedIndices, idx];
                          setFlippedIndices(newFlipped);

                          if (newFlipped.length === 2) {
                            setIsMemoryChecking(true);
                            const [firstIdx, secondIdx] = newFlipped;

                            if (
                              newDeck[firstIdx].url === newDeck[secondIdx].url
                            ) {
                              setTimeout(() => {
                                newDeck[firstIdx].isMatched = true;
                                newDeck[secondIdx].isMatched = true;
                                setMemoryCards([...newDeck]);
                                setFlippedIndices([]);
                                setIsMemoryChecking(false);
                              }, 500);
                            } else {
                              setTimeout(() => {
                                newDeck[firstIdx].isFlipped = false;
                                newDeck[secondIdx].isFlipped = false;
                                setMemoryCards([...newDeck]);
                                setFlippedIndices([]);
                                setIsMemoryChecking(false);
                              }, 1000);
                            }
                          }
                        }}
                        className="aspect-[3/4] relative perspective-1000 group"
                      >
                        <div
                          className={`relative w-full h-full transition-all duration-500 transform-style-3d ${card.isFlipped || card.isMatched ? "rotate-y-180" : ""}`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-fuchsia-900 rounded-lg flex items-center justify-center border border-white/10 backface-hidden">
                            <Heart size={20} className="text-white/20" />
                          </div>
                          <div className="absolute inset-0 rounded-lg overflow-hidden border border-fuchsia-500/50 rotate-y-180 backface-hidden">
                            <img
                              src={card.url}
                              className="w-full h-full object-cover"
                              alt="Card"
                            />
                            {card.isMatched && (
                              <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                                <span className="text-xl">✓</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {memoryCards.every((c) => c.isMatched) &&
                    memoryCards.length > 0 && (
                      <div className="mt-12 w-full animate-in slide-in-from-bottom-4 duration-500">
                        <button
                          onClick={() => {
                            setActiveGame(null);
                            setIsGameSelectorOpen(false);
                          }}
                          className="w-full bg-white text-black py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-white/10 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                          Voltar para a página
                        </button>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-[150] bg-black px-4 py-2 gap-4 flex">
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
        @keyframes eq-bounce {
          from {
            transform: scaleY(0.4);
          }
          to {
            transform: scaleY(1);
          }
        }
        @keyframes falling-dots {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(600px) scale(1.5);
            opacity: 0;
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        @keyframes floating-rabbit {
          0% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
          100% {
            transform: translateY(0) rotate(-2deg);
          }
        }
        @keyframes floating-logo {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .floating-rabbit {
          animation: floating-rabbit 3s ease-in-out infinite;
        }
        .floating-logo {
          animation: floating-logo 4s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default montagem;
