"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Heart, Music, Play, Repeat, SkipBack, SkipForward, 
  Gamepad2, Puzzle, X, ArrowLeft, Eye, CircleHelp, Check
} from "lucide-react";
import DomeGallery, { GalleryImage } from "@/app/components/DomeGallery";
import { get as idbGet } from 'idb-keyval';

export default function SucessoPage() {
  const [data, setData] = useState<any>(null);
  const [activeGame, setActiveGame] = useState<null | 'puzzle' | 'memory' | 'quiz'>(null);
  const [isOpeningFinished, setIsOpeningFinished] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isGameSelectorOpen, setIsGameSelectorOpen] = useState(false);
  const [isDomeOpen, setIsDomeOpen] = useState(false);

  // Estados dos Jogos
  const [puzzlePieces, setPuzzlePieces] = useState<number[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [memoryCards, setMemoryCards] = useState<any[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isMemoryChecking, setIsMemoryChecking] = useState(false);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isAnimateCorrect, setIsAnimateCorrect] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);
  const [isMemorySolved, setIsMemorySolved] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const youtubeIframeRef = useRef<HTMLIFrameElement | null>(null);
  const [openingState, setOpeningState] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const savedData = await idbGet('mycupid_tribute_data');
      if (savedData) {
        setData(savedData);
        if (savedData.specialOpening?.enabled) {
          setOpeningState({
            ...savedData.specialOpening,
            status: 'question',
            image: '/Coelho/um.png',
            message: 'Voce me ama? ❤️',
            showNoButton: true,
            isFinished: false,
            isExiting: false
          });
          setIsOpeningFinished(false);
          setIsExiting(false);
        } else {
          setIsOpeningFinished(true);
        }
      }
    };
    loadData();
  }, []);

  const handleScroll = () => {
    if (carouselRef.current) {
      const container = carouselRef.current;
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

  const seek = (seconds: number) => {
    if (youtubeIframeRef.current) {
      const newTime = Math.max(0, elapsedSeconds + seconds);
      youtubeIframeRef.current.contentWindow?.postMessage(JSON.stringify({
        event: 'command',
        func: 'seekTo',
        args: [newTime, true]
      }), '*');
      setElapsedSeconds(newTime);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMusicPlaying) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => {
          const duration = data?.selectedSpotifyTrack?.duration || 0;
          if (duration > 0 && prev >= duration) {
            setIsMusicPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMusicPlaying, data?.selectedSpotifyTrack?.duration]);

  // Lógica dos Jogos
  const startPuzzle = () => {
    const pieces = Array.from({ length: 9 }, (_, i) => i);
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    setPuzzlePieces(pieces);
    setIsPuzzleSolved(false);
    setActiveGame('puzzle');
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

      // Check completion
      if (newPieces.every((p, i) => p === i)) {
        setIsPuzzleSolved(true);
      }
    }
  };

  const startMemory = () => {
    if (!data?.games.memory.images.length) return;
    let cards = [...data.games.memory.images, ...data.games.memory.images].map((url, index) => ({
      id: index,
      url,
      isFlipped: false,
      isMatched: false
    }));
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    setMemoryCards(cards);
    setFlippedIndices([]);
    setIsMemorySolved(false);
    setIsMemoryChecking(false);
    setActiveGame('memory');
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
        setIsMemoryChecking(false);
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

  const startQuiz = () => {
    setCurrentQuizIdx(0);
    setQuizScore(0);
    setQuizFeedback(null);
    setActiveGame('quiz');
    setIsGameSelectorOpen(false);
  };

  if (!data) return (
    <div className="min-h-screen bg-[#0C0212] flex items-center justify-center text-white">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <Heart fill="white" className="text-white" />
        <p className="text-sm font-bold uppercase tracking-widest">Preparando Surpresa...</p>
      </div>
    </div>
  );

  const backgrounds = [
    { id: "default", name: "Padrão", desc: "clássico", class: "bg-[#0C0212]", type: "none" },
    { id: "stars", name: "Céu estrelado", desc: "romântico", class: "bg-[#0C0212]", type: "twinkle" },
    { id: "hearts", name: "Chuva de corações", desc: "apaixonante", class: "bg-[#1A0B1A]", type: "hearts" },
    { id: "dots", name: "Pontinhos mágicos", desc: "minimalista", class: "bg-[#0F0F1A]", type: "dots" },
    { id: "mixed-dots", name: "Vagalumes", desc: "encantador", class: "bg-[#0A1A0A]", type: "mixed-dots" }
  ];

  const currentBg = backgrounds.find(bg => bg.id === data.selectedBackground) || backgrounds[0];

  return (
    <div className={`min-h-screen ${currentBg.class} relative flex items-center justify-center font-sans overflow-hidden`}>
      
      {/* Background Particles Full Width */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {currentBg.type !== 'none' && [...Array(50)].map((_, i) => (
          <div 
            key={i} 
            className={`absolute ${currentBg.type === 'hearts' ? '' : 'h-1.5 w-1.5 rounded-full bg-white shadow-lg'}`}
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animation: `twinkle ${2 + (i % 3)}s infinite alternate`,
              opacity: 0.4
            }}
          >
            {currentBg.type === 'hearts' && <Heart size={14} fill="#f472b6" className="text-fuchsia-400 opacity-60" />}
          </div>
        ))}
      </div>

      {/* Abertura Especial Overlay - Viewport Full Width */}
      {openingState?.enabled && !isOpeningFinished && (
        <div className={`fixed inset-0 z-[1000] bg-[#FFF0F5] flex flex-col items-center justify-center p-6 transition-all duration-1000 ${isExiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
           <div className="w-full max-w-[280px] aspect-square relative mb-12">
              <img 
                key={openingState.image}
                src={openingState.image} 
                alt="Rabbit" 
                className="w-full h-full object-contain floating-rabbit animate-in fade-in zoom-in duration-800 fill-mode-both"
              />
           </div>
           <h2 key={openingState.message} className="text-2xl font-bold text-[#E91E63] text-center mb-8 italic px-4" style={{ fontFamily: 'Playlist' }}>
             {openingState.message}
           </h2>
           {openingState.status !== 'success' && (
             <div className="flex gap-6 w-full max-w-sm animate-in fade-in duration-500">
                <button 
                  onClick={() => {
                    setOpeningState((prev: any) => ({ ...prev, status: 'success', image: '/Coelho/dois.png', message: 'Eu sabia! 😍' }));
                    setTimeout(() => {
                      setIsExiting(true);
                      setTimeout(() => setIsOpeningFinished(true), 1100);
                    }, 1800);
                  }}
                  className="flex-1 bg-[#4CAF50] text-white py-5 rounded-[2rem] font-black italic shadow-[0_10px_0_#2E7D32] active:translate-y-1 transition-all text-lg tracking-widest"
                >
                  SIM
                </button>
                {openingState.showNoButton && (
                  <button 
                    onClick={() => setOpeningState((prev: any) => ({ ...prev, status: 'denied', image: '/Coelho/tres.png', message: 'Fala a verdade! 😤', showNoButton: false }))}
                    className="flex-1 bg-[#F44336] text-white py-5 rounded-[2rem] font-black italic shadow-[0_10px_0_#C62828] active:translate-y-1 transition-all text-lg tracking-widest"
                  >
                    NAO
                  </button>
                )}
             </div>
           )}
        </div>
      )}

      {/* Main Tribute Container */}
      <div className={`relative w-full max-w-[500px] h-screen bg-transparent overflow-hidden z-10 transition-all duration-1000 ${!isOpeningFinished ? 'blur-md scale-95 opacity-0' : 'blur-0 scale-100 opacity-100'}`}>
        
        {/* Content Scrollable */}
        <div className="relative h-full w-full overflow-y-auto overflow-x-hidden scroll-smooth [scrollbar-width:none]">
           <div className="flex flex-col items-center px-6 pt-16 pb-40">
              <img src="/Logo.png" alt="Logo" className="w-28 mb-10 floating-logo" />
              
              <h1 
                className="text-4xl text-center font-bold italic tracking-tighter"
                style={{ color: data.activeTitleColor, fontFamily: 'Playlist' }}
              >
                {data.answers[1]}
              </h1>

              <p className={`mt-6 text-center text-white/90 leading-relaxed max-w-sm ${data.messageTextSize === 'G' ? 'text-lg' : data.messageTextSize === 'GG' ? 'text-xl' : 'text-base'} ${data.messageTextStyle.italic ? 'italic' : ''} ${data.messageTextStyle.bold ? 'font-bold' : ''}`}>
                {data.answers[2]}
              </p>

              <button onClick={() => setIsDomeOpen(true)} className="mt-8 w-full py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl flex items-center justify-center gap-3 text-white font-bold transition-all hover:bg-white/20">
                 <Eye size={20} className="text-white/80" />
                 Nossa Linha do Tempo
              </button>

              {data.uploadedImages.length > 0 && (
                <div className="mt-10 w-full flex flex-col items-center">
                  <div 
                    ref={carouselRef}
                    onScroll={handleScroll}
                    className="w-full flex snap-x snap-mandatory gap-2 overflow-x-auto [scrollbar-width:none] px-4"
                  >
                    {data.uploadedImages.map((img: any, idx: number) => (
                      <div 
                        key={idx} 
                        className={`aspect-square min-w-[92%] snap-center rounded-[2.5rem] overflow-hidden shadow-2xl relative transition-all duration-500 ease-out transform ${
                          idx === currentPhotoIdx ? 'scale-100 opacity-100' : 'scale-[0.85] opacity-40 blur-[2px]'
                        }`}
                      >
                         <img src={img.url} className="w-full h-full object-cover" alt="Momentos" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Indicators */}
                  <div className="flex gap-2 mt-6">
                    {data.uploadedImages.map((_: any, idx: number) => (
                      <div 
                        key={idx} 
                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentPhotoIdx ? 'w-6 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'w-2 bg-white/20'}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 w-full flex flex-col gap-3">
                 {(data.games.puzzle.active || data.games.memory.active || data.games.quiz.active) && (
                   <button onClick={() => setIsGameSelectorOpen(true)} className="w-full py-4 bg-fuchsia-500/10 backdrop-blur-md border border-fuchsia-500/30 rounded-3xl flex items-center justify-center gap-3 text-white font-bold transition-all hover:bg-fuchsia-500/20">
                      <Gamepad2 size={20} className="text-fuchsia-400" />
                      Vamos Jogar?
                   </button>
                 )}
              </div>

              {data.selectedSpotifyTrack && (
                <div className="mt-10 w-full max-w-[280px] bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in duration-500">
                   {/* Capa no Topo */}
                   <div className="relative w-full h-40 overflow-hidden">
                      <img src={data.selectedSpotifyTrack.albumArt} className="absolute inset-0 w-full h-full object-cover" alt="Capa" />
                      {isMusicPlaying && (
                        <div className="absolute inset-0 bg-black/20 flex items-end justify-start p-3 gap-1">
                           {[1,2,3,4].map(i => (
                             <div 
                               key={i} 
                               className="w-1 bg-white rounded-full"
                               style={{ 
                                 height: `${12 + (i % 2 === 0 ? 10 : 5)}px`,
                                 animation: `eq-bounce ${0.4 + i * 0.1}s ease-in-out infinite alternate`
                               }}
                             />
                           ))}
                        </div>
                      )}
                   </div>

                   <div className="p-5 flex flex-col gap-4">
                      {/* Info */}
                      <div className="flex justify-between items-start">
                         <div className="flex flex-col overflow-hidden pr-2 flex-1">
                            <span className="text-white font-bold text-sm leading-tight line-clamp-1">{data.selectedSpotifyTrack.name}</span>
                            <span className="text-white/60 text-[10px] mt-1 truncate uppercase tracking-widest">{data.selectedSpotifyTrack.artist}</span>
                         </div>
                         <Heart size={16} className="text-white/40 shrink-0 mt-0.5" />
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="flex flex-col gap-1.5">
                         <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-white transition-all duration-300" 
                              style={{ width: `${(elapsedSeconds / (data.selectedSpotifyTrack.duration || 1)) * 100}%` }}
                            />
                         </div>
                         <div className="flex justify-between text-[9px] text-white/30 font-medium tracking-wider">
                            <span>{Math.floor(elapsedSeconds / 60)}:{Math.floor(elapsedSeconds % 60).toString().padStart(2, '0')}</span>
                            <span>{Math.floor((data.selectedSpotifyTrack.duration || 0) / 60)}:{Math.floor((data.selectedSpotifyTrack.duration || 0) % 60).toString().padStart(2, '0')}</span>
                         </div>
                      </div>

                      {/* Controls */}
                      <div className="flex justify-between items-center px-2">
                         <button onClick={() => seek(-10)} className="text-white/40 hover:text-white transition-colors">
                           <SkipBack size={18} fill="currentColor" />
                         </button>
                         <button 
                           onClick={() => setIsMusicPlaying(!isMusicPlaying)} 
                           className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-lg hover:scale-105 transition-transform active:scale-95"
                         >
                            {isMusicPlaying ? <X size={20} /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                         </button>
                         <button onClick={() => seek(10)} className="text-white/40 hover:text-white transition-colors">
                           <SkipForward size={18} fill="currentColor" />
                         </button>
                      </div>
                   </div>

                   {isMusicPlaying && (
                     <iframe
                        ref={youtubeIframeRef}
                        src={`https://www.youtube.com/embed/${data.selectedSpotifyTrack.id}?autoplay=1&rel=0&controls=1&enablejsapi=1`}
                        allow="autoplay"
                        className="hidden"
                     />
                   )}
                </div>
              )}
           </div>
        </div>

        {/* Overlays (Games, Dome) */}
        {isGameSelectorOpen && (
          <div className="absolute inset-0 z-[150] bg-[#0C0212]/95 backdrop-blur-xl flex flex-col items-center px-6 pt-24 animate-in fade-in duration-500">
             <button onClick={() => setIsGameSelectorOpen(false)} className="absolute top-8 right-6 text-white/40"><X size={24}/></button>
             <h2 className="text-3xl text-white mb-10 italic" style={{ fontFamily: 'Playlist' }}>Escolha um Jogo</h2>
             <div className="w-full flex flex-col gap-4">
                {data.games.memory.active && (
                  <button onClick={startMemory} className="w-full p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-[2rem] flex items-center gap-4 text-left transition-all hover:bg-emerald-500/20">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center"><Gamepad2 className="text-emerald-400" /></div>
                    <div><h4 className="text-white font-bold">Jogo da Memória</h4><p className="text-[10px] text-emerald-300/60">Encontre os pares de fotos</p></div>
                  </button>
                )}
                {data.games.puzzle.active && (
                  <button onClick={startPuzzle} className="w-full p-6 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-[2rem] flex items-center gap-4 text-left transition-all hover:bg-fuchsia-500/20">
                    <div className="w-12 h-12 bg-fuchsia-500/20 rounded-full flex items-center justify-center"><Puzzle className="text-fuchsia-400" /></div>
                    <div><h4 className="text-white font-bold">Quebra-Cabeça</h4><p className="text-[10px] text-fuchsia-300/60">Monte nossa foto especial</p></div>
                  </button>
                )}
                {data.games.quiz.active && (
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
                         src={data.games.puzzle.image} 
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
                 <div className="w-full grid grid-cols-3 gap-3 relative">
                   {memoryCards.map((card, i) => (
                     <button 
                       key={i} 
                       onClick={() => handleMemoryClick(i)}
                       className={`aspect-square relative perspective-1000 transition-all duration-500 ${card.isFlipped ? 'rotate-y-180' : ''}`}
                     >
                       <div className={`absolute inset-0 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center transition-all backface-hidden ${card.isFlipped ? 'opacity-0' : 'opacity-100'}`}>
                         <Heart className="text-white/20" />
                       </div>
                       <div className={`absolute inset-0 rounded-xl overflow-hidden border border-fuchsia-500/50 backface-hidden rotate-y-180 ${card.isFlipped ? 'opacity-100' : 'opacity-0'}`}>
                         <img src={card.url} className="w-full h-full object-cover" />
                       </div>
                     </button>
                   ))}
                 </div>
               </div>
             )}

             {activeGame === 'quiz' && (
               <div className="w-full flex flex-col items-center">
                  <div className="w-full bg-white/5 rounded-3xl p-6 border border-white/10 mb-6">
                    <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-2 block">Pergunta {currentQuizIdx + 1}/{data.games.quiz.questions.length}</span>
                    <h3 className="text-xl text-white font-bold">{data.games.quiz.questions[currentQuizIdx].q}</h3>
                  </div>
                  <div className="w-full flex flex-col gap-3">
                    {data.games.quiz.questions[currentQuizIdx].options.map((opt: string, i: number) => (
                      <button 
                        key={i}
                        onClick={() => {
                          if (i === data.games.quiz.questions[currentQuizIdx].correct) {
                            setIsAnimateCorrect(true);
                            setQuizScore(s => s + 1);
                            setTimeout(() => setIsAnimateCorrect(false), 500);
                          }
                          if (currentQuizIdx < data.games.quiz.questions.length - 1) {
                            setCurrentQuizIdx(i => i + 1);
                          } else {
                            setQuizFeedback(`Você acertou ${quizScore + (i === data.games.quiz.questions[currentQuizIdx].correct ? 1 : 0)} de ${data.games.quiz.questions.length}!`);
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
          <div className="absolute inset-0 z-[250] bg-black animate-in fade-in duration-500">
             <button onClick={() => setIsDomeOpen(false)} className="absolute top-10 right-6 z-10 text-white/50"><X size={24}/></button>
             <div className="w-full h-full">
                <DomeGallery images={data.uploadedImages} />
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
        @keyframes floating-logo {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        @keyframes twinkle {
          from { opacity: 0.2; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1.1); }
        }
        .floating-rabbit { animation: floating-rabbit 3s ease-in-out infinite; }
        .floating-logo { animation: floating-logo 4s ease-in-out infinite; }
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
}
