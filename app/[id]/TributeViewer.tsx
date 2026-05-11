"use client";

import { useState, useRef, useEffect } from "react";
import { Eye, Gamepad2, Puzzle, CircleHelp, Heart, Play, SkipBack, SkipForward, Repeat, ArrowLeft, X, Check, Volume2 } from "lucide-react";
import DomeGallery from "@/app/components/DomeGallery";

type SpecialOpeningState = {
  enabled: boolean;
  image: string;
  message: string;
  status: "question" | "success" | "denied";
  showNoButton: boolean;
  isFinished: boolean;
  isExiting: boolean;
};

export default function TributeViewer({ initialData }: { initialData: any }) {
  const data = initialData || {};
  
  const answers = data.answers || {};
  const uploadedImages = data.uploadedImages || [];
  const selectedSpotifyTrack = data.selectedSpotifyTrack || null;
  const games = {
    puzzle: { active: false, image: "", ...(data.games?.puzzle || {}) },
    memory: { active: false, images: [], ...(data.games?.memory || {}) },
    quiz: { active: false, questions: [], ...(data.games?.quiz || {}) },
  };
  const selectedBackground = data.selectedBackground || "default";
  const activeTitleColor = data.activeTitleColor || "#FFFFFF";
  const messageTextStyle = data.messageTextStyle || { bold: false, italic: false, strike: false };
  const messageTextSize = data.messageTextSize || "M";
  const initialSpecialOpening: Omit<
    SpecialOpeningState,
    "status" | "showNoButton" | "isFinished" | "isExiting"
  > = {
    enabled: false,
    image: "/Coelho/um.png",
    message: "Você me ama? ❤️",
    ...(data.specialOpening || {})
  };

  const [specialOpening, setSpecialOpening] = useState<SpecialOpeningState>({
    ...initialSpecialOpening,
    status: "question",
    showNoButton: true,
    isFinished: !initialSpecialOpening.enabled,
    isExiting: false,
  });

  const [isDomeOpen, setIsDomeOpen] = useState(false);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const previewCarouselRef = useRef<HTMLDivElement>(null);

  const [isGameSelectorOpen, setIsGameSelectorOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<null | "puzzle" | "memory" | "quiz">(null);

  // Audio state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const youtubeIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Quiz state
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isAnimateCorrect, setIsAnimateCorrect] = useState(false);

  // Memory state
  const [memoryCards, setMemoryCards] = useState<any[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isMemoryChecking, setIsMemoryChecking] = useState(false);
  const [isMemorySolved, setIsMemorySolved] = useState(false);

  // Puzzle state
  const [puzzlePieces, setPuzzlePieces] = useState<number[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);

  // Helper formats
  const messageSizeClass = {
    P: "text-sm",
    M: "text-base",
    G: "text-lg",
    GG: "text-xl",
  }[messageTextSize as string] || "text-base";

  const backgrounds = [
    { id: "default", type: "none", class: "bg-[#0C0212]" },
    { id: "stars", type: "twinkle", class: "bg-[#0C0212]" },
    { id: "hearts", type: "hearts", class: "bg-[#0C0212] bg-gradient-to-b from-[#1a0b1e] to-[#0C0212]" },
    { id: "dots", type: "dots", class: "bg-[#0C0212]" },
    { id: "rain", type: "dots", class: "bg-[#0C0212]" },
    { id: "mixed-dots", type: "mixed-dots", class: "bg-[#0C0212]" },
  ];

  const currentBg = backgrounds.find((b) => b.id === selectedBackground) || backgrounds[0];

  const handlePreviewScroll = () => {
    if (previewCarouselRef.current) {
      const scrollLeft = previewCarouselRef.current.scrollLeft;
      const width = previewCarouselRef.current.offsetWidth;
      const newIdx = Math.round(scrollLeft / width);
      setCurrentPhotoIdx(newIdx);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isMusicPlaying) {
      const interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev >= trackDuration && trackDuration > 0) return 0;
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isMusicPlaying, trackDuration]);

  useEffect(() => {
    if (selectedSpotifyTrack) {
      const ms = selectedSpotifyTrack.duration || 180000;
      setTrackDuration(ms);
      setElapsedSeconds(0);
      setIsMusicPlaying(true);
    }
  }, [selectedSpotifyTrack]);

  useEffect(() => {
    if (youtubeIframeRef.current) {
      youtubeIframeRef.current.contentWindow?.postMessage(JSON.stringify({
        event: 'command',
        func: 'setVolume',
        args: [volume]
      }), '*');
    }
  }, [volume, isMusicPlaying]);

  const startMemory = () => {
    if (!games.memory.images || games.memory.images.length < 3) return;
    let cards = [...games.memory.images, ...games.memory.images].map((url, index) => ({
      id: index,
      url,
      isFlipped: false,
      isMatched: false,
    }));
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    setMemoryCards(cards);
    setFlippedIndices([]);
    setIsMemorySolved(false);
    setIsMemoryChecking(false);
    setActiveGame("memory");
    setIsGameSelectorOpen(false);
  };

  const handleMemoryClick = (idx: number) => {
    if (isMemoryChecking || memoryCards[idx].isFlipped || memoryCards[idx].isMatched) return;
    const newCards = [...memoryCards];
    newCards[idx].isFlipped = true;
    setMemoryCards(newCards);
    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);
    if (newFlipped.length === 2) {
      setIsMemoryChecking(true);
      const [first, second] = newFlipped;
      if (newCards[first].url === newCards[second].url) {
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setMemoryCards(newCards);
        setFlippedIndices([]);
        setIsMemoryChecking(false);

        if (newCards.every(c => c.isMatched)) {
           setIsMemorySolved(true);
        }
      } else {
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setMemoryCards(newCards);
          setFlippedIndices([]);
          setIsMemoryChecking(false);
        }, 1000);
      }
    }
  };

  const startPuzzle = () => {
    const pieces = Array.from({ length: 9 }, (_, i) => i);
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    setPuzzlePieces(pieces);
    setIsPuzzleSolved(false);
    setActiveGame("puzzle");
    setIsGameSelectorOpen(false);
  };

  const handlePuzzleClick = (idx: number) => {
    if (isPuzzleSolved || selectedPiece === null) {
      if (isPuzzleSolved) return;
      setSelectedPiece(idx);
    } else {
      const newPieces = [...puzzlePieces];
      [newPieces[selectedPiece], newPieces[idx]] = [newPieces[idx], newPieces[selectedPiece]];
      setPuzzlePieces(newPieces);
      setSelectedPiece(null);

      if (newPieces.every((p, i) => p === i)) {
        setIsPuzzleSolved(true);
      }
    }
  };

  const startQuiz = () => {
    if (!games.quiz.questions || games.quiz.questions.length === 0) return;
    setCurrentQuizIdx(0);
    setQuizScore(0);
    setQuizFeedback(null);
    setActiveGame("quiz");
    setIsGameSelectorOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#0C0212] flex items-center justify-center sm:p-6 overflow-hidden">
      {/* Container imitando celular no desktop, full screen no mobile */}
      <div className={`relative w-full h-[100dvh] sm:h-[850px] sm:max-h-[90vh] sm:max-w-[400px] sm:rounded-[3rem] overflow-hidden sm:border-[8px] sm:border-zinc-800 shadow-2xl ${currentBg.class}`}>
        
        {/* Layer 1: Particles Overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {currentBg.type !== "none" &&
            [...Array(currentBg.type === "twinkle" ? 40 : 20)].map((_, i) => {
              const isHearts = currentBg.type === "hearts";
              const isTwinkle = currentBg.type === "twinkle";
              const isMixed = currentBg.type === "mixed-dots";

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
                    left: isTwinkle ? `${(i * 13.7) % 100}%` : `${(i * 7.7) % 100}%`,
                    top: isTwinkle ? `${(i * 19.3) % 100}%` : `-20px`,
                    animationName: isTwinkle ? "twinkle" : "falling-dots",
                    animationDuration: isTwinkle ? `${2 + (i % 3)}s` : `${4 + (i % 3) * 2}s`,
                    animationTimingFunction: isTwinkle ? "ease-in-out" : "linear",
                    animationIterationCount: "infinite",
                    animationDelay: isTwinkle ? `${i * 0.1}s` : `${i * 0.5}s`,
                    opacity: isTwinkle ? 0 : 1,
                  }}
                >
                  {isHearts && <Heart size={10} fill="#f472b6" className="text-fuchsia-400 opacity-60" />}
                </div>
              );
            })}
        </div>

        {/* Special Opening Overlay */}
        {specialOpening.enabled && !specialOpening.isFinished && (
          <div className={`absolute inset-0 z-[100] bg-[#FFF0F5] flex flex-col items-center justify-center p-6 transition-all duration-1000 ${specialOpening.isExiting ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"}`}>
            <div className="w-full max-w-[250px] aspect-square relative mb-12">
              <img
                key={specialOpening.image}
                src={specialOpening.image}
                alt="Coelhinho"
                className="w-full h-full object-contain floating-rabbit animate-in fade-in zoom-in duration-800"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#E91E63] text-center mb-10 leading-tight italic" style={{ fontFamily: "Playlist" }}>
              {specialOpening.message}
            </h2>
            {specialOpening.status !== "success" && (
              <div className="flex gap-4 w-full px-4">
                <button
                  onClick={() => {
                    setSpecialOpening((prev) => ({
                      ...prev,
                      status: "success",
                      image: "/Coelho/dois.png",
                      message: "Eu sabia! 😍",
                      showNoButton: true,
                    }));
                    setTimeout(() => {
                      setSpecialOpening((prev) => ({ ...prev, isExiting: true }));
                      setTimeout(() => {
                        setSpecialOpening((prev) => ({ ...prev, isFinished: true }));
                      }, 1000);
                    }, 2000);
                  }}
                  className="flex-1 bg-[#4CAF50] text-white py-4 rounded-3xl font-black italic text-base shadow-[0_8px_0_#2E7D32] active:translate-y-1 active:shadow-[0_4px_0_#2E7D32] transition-all"
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
                    className="flex-1 bg-[#F44336] text-white py-4 rounded-3xl font-black italic text-base shadow-[0_8px_0_#C62828] active:translate-y-1 active:shadow-[0_4px_0_#C62828] transition-all"
                  >
                    NÃO
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="relative z-10 h-full w-full overflow-y-auto overflow-x-hidden scroll-smooth flex flex-col items-center px-5 pt-16 pb-20 custom-scrollbar">
          
          <h1 className="text-center text-3xl font-semibold w-full leading-tight drop-shadow-md" style={{ fontFamily: "Playlist", color: activeTitleColor }}>
            {answers[1] || "Minha Homenagem"}
          </h1>
          
          <p className={`mt-6 text-center text-white/90 w-full whitespace-pre-wrap leading-relaxed ${messageSizeClass} ${messageTextStyle.bold ? "font-bold" : "font-medium"} ${messageTextStyle.italic ? "italic" : ""} ${messageTextStyle.strike ? "line-through" : ""}`}>
            {answers[2] || "Obrigado por tudo..."}
          </p>

          {uploadedImages.length > 0 && (
            <button
              onClick={() => setIsDomeOpen(true)}
              className="mt-10 flex w-full max-w-[280px] items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center transition-all hover:bg-white/10 shadow-xl active:scale-95"
            >
              <Eye size={20} className="text-white/80" />
              <span className="text-base font-semibold text-white">Nossa Linha do Tempo</span>
            </button>
          )}

          {uploadedImages.length > 0 && (
            <div className="w-full flex flex-col items-center mt-10">
              <div
                ref={previewCarouselRef}
                onScroll={handlePreviewScroll}
                className="static-carousel flex w-full snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] px-2 shrink-0"
              >
                {uploadedImages.map((image: any, index: number) => (
                  <div
                    key={image.id || index}
                    className={`relative aspect-[4/5] min-w-[85%] snap-center overflow-hidden rounded-[2rem] transition-all duration-500 ease-out transform shadow-xl ${
                      index === currentPhotoIdx ? "scale-100 opacity-100 shadow-fuchsia-900/40" : "scale-[0.90] opacity-50 blur-[1px]"
                    }`}
                  >
                    <img src={image.url} alt={`Foto ${index + 1}`} className="h-full w-full object-cover" />
                    {image.description && index === currentPhotoIdx && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12">
                        <p className="text-white text-sm font-medium">{image.description}</p>
                        {image.date && <span className="text-white/60 text-xs mt-1 block">{image.date}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-6">
                {uploadedImages.map((_: any, idx: number) => (
                  <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === currentPhotoIdx ? "w-6 bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.8)]" : "w-2 bg-white/20"}`} />
                ))}
              </div>
            </div>
          )}

          {(games?.puzzle?.active || games?.memory?.active || games?.quiz?.active) && (
            <div className="mt-12 w-full max-w-[280px] flex flex-col gap-2 shrink-0">
              <button
                onClick={() => setIsGameSelectorOpen(true)}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-5 py-4 text-center transition-all hover:bg-fuchsia-500/20 shadow-xl active:scale-95"
              >
                <Gamepad2 size={22} className="text-fuchsia-400" />
                <span className="text-base font-semibold text-white">Vamos Jogar?</span>
              </button>
            </div>
          )}

          {selectedSpotifyTrack && (
            <div className="mt-12 w-full max-w-[300px] bg-black/60 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl mb-8 border border-white/10 flex flex-col shrink-0">
              {isMusicPlaying && (
                <iframe
                  ref={youtubeIframeRef}
                  src={`https://www.youtube.com/embed/${selectedSpotifyTrack.id}?autoplay=1&rel=0&controls=0&enablejsapi=1`}
                  allow="autoplay"
                  className="absolute w-0 h-0 pointer-events-none opacity-0"
                />
              )}
              <div className="relative w-full h-36 overflow-hidden">
                <img src={selectedSpotifyTrack.albumArt} className="absolute inset-0 w-full h-full object-cover" alt="Album Art" />
                {isMusicPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-end justify-start p-4 gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-1 bg-white rounded-full" style={{ height: `${12 + (i % 2 === 0 ? 16 : 8)}px`, animation: `eq-bounce ${0.4 + i * 0.1}s ease-in-out infinite alternate` }} />
                    ))}
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col overflow-hidden pr-2">
                    <span className="text-white font-bold text-sm leading-tight line-clamp-1">{selectedSpotifyTrack.name}</span>
                    <span className="text-white/60 text-[10px] mt-1 uppercase tracking-widest">{selectedSpotifyTrack.artist}</span>
                  </div>
                  <Heart size={18} className="text-white/40 shrink-0 mt-0.5" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all duration-300" style={{ width: `${(elapsedSeconds / trackDuration) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-white/30 font-medium">
                    <span>{formatTime(elapsedSeconds)}</span>
                    <span>{formatTime(trackDuration)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center px-2">
                  <SkipBack size={20} className="text-white/40 hover:text-white transition-colors" />
                  <button onClick={() => setIsMusicPlaying((prev) => !prev)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                    {isMusicPlaying ? (
                      <X size={20} className="text-black" />
                    ) : (
                      <Play size={20} className="text-black ml-1" fill="currentColor" />
                    )}
                  </button>
                  <SkipForward size={20} className="text-white/40 hover:text-white transition-colors" />
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-3 px-1 mt-2">
                  <Volume2 size={14} className="text-white/40" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                  />
                  <span className="text-[10px] text-white/30 w-5">{volume}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Overlays (Games, Dome) */}
        {isGameSelectorOpen && (
          <div className="absolute inset-0 z-[150] bg-[#0C0212]/95 backdrop-blur-xl flex flex-col items-center px-6 pt-24 animate-in fade-in duration-500">
             <button onClick={() => setIsGameSelectorOpen(false)} className="absolute top-8 right-6 text-white/40"><X size={24}/></button>
             <h2 className="text-3xl text-white mb-10 italic" style={{ fontFamily: 'Playlist' }}>Escolha um Jogo</h2>
             <div className="w-full flex flex-col gap-4">
                {games.memory.active && (
                  <button onClick={startMemory} className="w-full p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-[2rem] flex items-center gap-4 text-left transition-all hover:bg-emerald-500/20">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center"><Gamepad2 className="text-emerald-400" /></div>
                    <div><h4 className="text-white font-bold">Jogo da Memória</h4><p className="text-[10px] text-emerald-300/60">Encontre os pares de fotos</p></div>
                  </button>
                )}
                {games.puzzle.active && (
                  <button onClick={startPuzzle} className="w-full p-6 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-[2rem] flex items-center gap-4 text-left transition-all hover:bg-fuchsia-500/20">
                    <div className="w-12 h-12 bg-fuchsia-500/20 rounded-full flex items-center justify-center"><Puzzle className="text-fuchsia-400" /></div>
                    <div><h4 className="text-white font-bold">Quebra-Cabeça</h4><p className="text-[10px] text-fuchsia-300/60">Monte nossa foto especial</p></div>
                  </button>
                )}
                {games.quiz.active && (
                  <button onClick={startQuiz} className="w-full p-6 bg-blue-500/10 border border-blue-500/30 rounded-[2rem] flex items-center gap-4 text-left transition-all hover:bg-blue-500/20">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center"><CircleHelp className="text-blue-400" /></div>
                    <div><h4 className="text-white font-bold">Quiz Especial</h4><p className="text-[10px] text-blue-300/60">O quanto você me conhece?</p></div>
                  </button>
                )}
             </div>
          </div>
        )}

        {activeGame && (
          <div className="absolute inset-0 z-[200] bg-black flex flex-col items-center px-6 pt-20 animate-in slide-in-from-bottom duration-500">
             <button onClick={() => setActiveGame(null)} className="absolute top-10 right-6 text-white/40"><X size={24}/></button>
             <h2 className="text-2xl font-black text-white mb-10 italic" style={{ fontFamily: 'Playlist' }}>
               {activeGame === 'puzzle' ? '🧩 Quebra-Cabeça' : activeGame === 'memory' ? '🧠 Jogo da Memória' : '❓ Quiz Especial'}
             </h2>

             {isPuzzleSolved && (
               <div className="flex flex-col items-center mb-8 animate-in fade-in zoom-in duration-700">
                  <div className="w-16 h-16 bg-fuchsia-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(217,70,239,0.5)] animate-bounce">
                    <Check size={32} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-white italic mb-2" style={{ fontFamily: 'Playlist' }}>Parabéns!</h3>
                  <p className="text-white/70 text-center text-sm">Você montou nossa foto com perfeição! ❤️</p>
               </div>
             )}

             {isMemorySolved && (
               <div className="flex flex-col items-center mb-8 animate-in fade-in zoom-in duration-700">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-bounce">
                    <Check size={32} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-white italic mb-2" style={{ fontFamily: 'Playlist' }}>Incrível!</h3>
                  <p className="text-white/70 text-center text-sm">Sua memória é impecável! ❤️</p>
               </div>
             )}

             {activeGame === 'puzzle' && (
               <div className="w-full flex flex-col items-center">
                 <div className="w-full aspect-square grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 relative overflow-hidden">
                   {puzzlePieces.map((p, i) => (
                     <button 
                       key={i} 
                       onClick={() => handlePuzzleClick(i)}
                       className={`relative aspect-square overflow-hidden transition-all ${selectedPiece === i ? 'ring-2 ring-fuchsia-500 z-10' : ''}`}
                     >
                       <img 
                         src={games.puzzle.image} 
                         className="absolute w-[300%] h-[300%] object-cover max-w-none"
                         style={{ left: `-${(p % 3) * 100}%`, top: `-${Math.floor(p / 3) * 100}%` }}
                       />
                     </button>
                   ))}
                 </div>
               </div>
             )}

             {activeGame === 'memory' && (
               <div className="w-full flex flex-col items-center">
                 <div className="w-full grid grid-cols-3 gap-2 relative">
                   {memoryCards.map((card, i) => (
                     <button 
                       key={i} 
                       onClick={() => handleMemoryClick(i)}
                       className="aspect-[3/4] relative perspective-1000 group"
                     >
                       <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`}>
                         {/* Frente (Verso da carta) */}
                         <div className="absolute inset-0 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center backface-hidden">
                           <Heart size={20} className="text-white/10" />
                         </div>
                         {/* Verso (Imagem) */}
                         <div className="absolute inset-0 rounded-xl overflow-hidden border border-fuchsia-500/50 backface-hidden rotate-y-180">
                           <img src={card.url} className="w-full h-full object-cover" alt="Card" />
                           {card.isMatched && (
                             <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                               <Check size={24} className="text-white drop-shadow-md" />
                             </div>
                           )}
                         </div>
                       </div>
                     </button>
                   ))}
                 </div>
               </div>
             )}

             {activeGame === 'quiz' && (
               <div className="w-full flex flex-col items-center">
                  <div className="w-full bg-white/5 rounded-3xl p-6 border border-white/10 mb-6">
                    <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-2 block">Pergunta {currentQuizIdx + 1}/{games.quiz.questions.length}</span>
                    <h3 className="text-xl text-white font-bold">{games.quiz.questions[currentQuizIdx].q}</h3>
                  </div>
                  <div className="w-full flex flex-col gap-3">
                    {games.quiz.questions[currentQuizIdx].options.map((opt: string, i: number) => (
                      <button 
                        key={i}
                        onClick={() => {
                          if (i === games.quiz.questions[currentQuizIdx].correct) {
                            setIsAnimateCorrect(true);
                            setQuizScore(s => s + 1);
                            setTimeout(() => setIsAnimateCorrect(false), 500);
                          }
                          if (currentQuizIdx < games.quiz.questions.length - 1) {
                            setCurrentQuizIdx(i => i + 1);
                          } else {
                            setQuizFeedback(`Você acertou ${quizScore + (i === games.quiz.questions[currentQuizIdx].correct ? 1 : 0)} de ${games.quiz.questions.length}!`);
                          }
                        }}
                        className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl text-left text-white font-semibold hover:bg-white/10 transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {quizFeedback && (
                    <div className="mt-10 text-center animate-in zoom-in duration-500">
                       <h4 className="text-2xl text-emerald-400 font-bold mb-4">{quizFeedback}</h4>
                       <button onClick={() => setActiveGame(null)} className="px-10 py-3 bg-white text-black font-black rounded-full uppercase text-[10px]">Fechar</button>
                    </div>
                  )}
               </div>
             )}

             {(isPuzzleSolved || isMemorySolved) && (
                <button 
                  onClick={() => setActiveGame(null)} 
                  className="mt-12 w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-full shadow-lg shadow-white/10 animate-in slide-in-from-bottom-4 duration-700"
                >
                  Voltar para a Homenagem
                </button>
             )}

             {!isPuzzleSolved && !isMemorySolved && activeGame !== 'quiz' && (
                <button onClick={() => setActiveGame(null)} className="mt-auto mb-10 text-white/40 uppercase text-[10px] font-black tracking-widest">Encerrar Jogo</button>
             )}
          </div>
        )}

        {isDomeOpen && (
          <div className="fixed sm:absolute inset-0 z-[250] bg-black">
             <button onClick={() => setIsDomeOpen(false)} className="absolute top-10 right-6 z-10 text-white/50 h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><X size={24}/></button>
             <div className="w-full h-full">
                <DomeGallery images={uploadedImages} />
             </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes floating-rabbit {
          0% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
          100% { transform: translateY(0) rotate(-2deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes falling-dots {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(600px) scale(1.5); opacity: 0; }
        }
        @keyframes eq-bounce {
          from { height: 8px; }
          to { height: 20px; }
        }
        .floating-rabbit { animation: floating-rabbit 3s ease-in-out infinite; }
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; }
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
      `}</style>
    </main>
  );
}
