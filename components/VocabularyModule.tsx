
import React, { useState, useEffect, useMemo } from 'react';
import { VocabularyWord, ModuleProgress } from '../types';
import VocabularyEscapeRoom from './VocabularyEscapeRoom';
import useGameSound from '../hooks/useGameSound';
import { generateVocabImage, speakText, getEnglishDefinition } from '../services/geminiService';
import { Sparkles, Image as ImageIcon, Loader2, Volume2, Archive, Brain, Library, ChevronDown, RotateCcw, ChevronRight, HelpCircle, Layers, CheckCircle } from 'lucide-react';
import PerformanceCertificate from './PerformanceCertificate';

interface VocabularyModuleProps {
  studentName: string;
  vocabData: VocabularyWord[];
  progress: Record<string, ModuleProgress>;
  vocabGameId: string;
  onGameComplete: (id: string, score: number) => void;
  onReturn: () => void;
  initialView?: 'list' | 'game';
  onNextStep?: () => void;
}

interface Card {
  id: string;
  wordId: string;
  content: string;
  type: 'EN' | 'VN';
  isFlipped: boolean;
  isMatched: boolean;
}

const VocabularyModule: React.FC<VocabularyModuleProps> = ({ 
  studentName,
  vocabData, 
  progress,
  vocabGameId,
  onGameComplete, 
  onReturn,
  initialView = 'list',
  onNextStep
}) => {
  // Enforce sequential order: list -> visualizer -> game -> escape -> certificate
  const [view, setView] = useState<'list' | 'visualizer' | 'game' | 'escape' | 'certificate'>(initialView === 'game' ? 'game' : 'list');
  const [certType, setCertType] = useState<'Vocabulary' | 'Forbidden Library'>('Forbidden Library');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Memory Game State
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Visualizer State
  const [visualizingWord, setVisualizingWord] = useState<VocabularyWord | null>(null);
  const [currentDefinition, setCurrentDefinition] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Scoring
  const [finalScore, setFinalScore] = useState(0);

  const { playCorrect, playWrong, playPop } = useGameSound();

  const unitPrefix = vocabGameId.split('_')[0];
  const escapeRoomId = `${unitPrefix}_vocabulary_escape`;

  useEffect(() => {
    // Only re-initialize if not in a sequential flow state that depends on user action
    if (initialView === 'game' && view !== 'game') {
        setView('game');
    }
  }, [initialView]);

  useEffect(() => {
    if (view === 'game') initGame();
    if (view === 'visualizer' && vocabData.length > 0 && !visualizingWord) {
      handleGenerateImage(vocabData[0]);
    }
  }, [vocabData, view]);

  useEffect(() => {
    let interval: any;
    if (isActive && !isGameOver) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isGameOver]);

  const initGame = () => {
    const pool = [...vocabData].sort(() => Math.random() - 0.5).slice(0, 8);
    const gameCards: Card[] = [];
    pool.forEach((word) => {
      gameCards.push({ id: `en-${word.id}`, wordId: word.id, content: word.english, type: 'EN', isFlipped: false, isMatched: false });
      gameCards.push({ id: `vn-${word.id}`, wordId: word.id, content: word.vietnamese, type: 'VN', isFlipped: false, isMatched: false });
    });
    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setTime(0);
    setIsGameOver(false);
    setIsActive(false);
  };

  const handleSpeak = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    await speakText(text);
    setIsSpeaking(false);
  };

  const handleCardInteraction = (word: VocabularyWord) => {
    const isExpanding = expandedId !== word.id;
    setExpandedId(isExpanding ? word.id : null);
    handleSpeak(word.english);
    
    if (isExpanding) {
      onGameComplete(`${unitPrefix}_vocab_viewed_${word.id}`, 100);
    }
  };

  const handleMemoryClick = (index: number) => {
    if (isGameOver || flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;
    if (!isActive) setIsActive(true);
    playPop();
    
    setCards(prev => {
      const next = [...prev];
      next[index] = { ...next[index], isFlipped: true };
      return next;
    });

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      
      if (cards[firstIdx].wordId === cards[secondIdx].wordId) {
        setTimeout(() => {
          playCorrect();
          setCards(prev => {
            const next = [...prev];
            next[firstIdx] = { ...next[firstIdx], isMatched: true };
            next[secondIdx] = { ...next[secondIdx], isMatched: true };
            return next;
          });
          setFlippedIndices([]);
          setMatches(m => {
            const nextMatches = m + 1;
            if (nextMatches === 8) {
              setIsGameOver(true);
              const calculatedScore = Math.max(0, 100 - (moves + 1 - 8) * 5);
              onGameComplete(vocabGameId, calculatedScore);
              setFinalScore(calculatedScore); // Preliminary score
            }
            return nextMatches;
          });
        }, 500);
      } else {
        setTimeout(() => {
          playWrong();
          setCards(prev => {
            const next = [...prev];
            next[firstIdx] = { ...next[firstIdx], isFlipped: false };
            next[secondIdx] = { ...next[secondIdx], isFlipped: false };
            return next;
          });
          setFlippedIndices([]);
        }, 1200);
      }
    }
  };

  const handleGenerateImage = async (word: VocabularyWord) => {
    setVisualizingWord(word);
    setGeneratedImage(null);
    setCurrentDefinition(null);
    setIsGenerating(true);
    playPop();
    
    onGameComplete(`${unitPrefix}_vocab_viewed_${word.id}`, 100);

    try {
      const [img, def] = await Promise.all([
        generateVocabImage(word.english, word.visualPrompt),
        getEnglishDefinition(word.english)
      ]);
      setGeneratedImage(img);
      setCurrentDefinition(def);
    } catch (err) {
      console.error("AI Visualization Sync Error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEscapeComplete = (score: number) => {
    onGameComplete(escapeRoomId, score);
    setFinalScore(score);
    setCertType('Forbidden Library');
    setView('certificate');
  };

  const handleCertificateExit = () => {
    onReturn();
  };

  if (view === 'certificate') {
    const unitTitleMap: Record<string, string> = {
      'u1': 'Generation Gap',
      'u2': 'Vietnam and ASEAN',
      'u3': 'Global Warming',
      'u4': 'World Heritage'
    };
    const unitTitle = unitTitleMap[unitPrefix] || "Unknown Unit";
    
    // Forbidden Library is the final assessment
    const feedback = `Forbidden Library Assessment Complete. Score: ${finalScore}%. Access granted to advanced modules.`;

    return (
      <PerformanceCertificate 
        studentName={studentName}
        unitTitle={`Vocabulary Master: ${unitTitle}`}
        type={certType}
        score={finalScore}
        feedback={feedback}
        onSaveAndExit={handleCertificateExit}
      />
    );
  }

  // Calculate current step for progress bar
  const currentStepIndex = view === 'list' ? 0 : view === 'visualizer' ? 1 : view === 'game' ? 2 : view === 'escape' ? 3 : 4;
  const steps = ['Archive', 'Visualizer', 'Memory', 'Forbidden Library'];

  return (
    <div className="min-h-screen bg-white -m-4 md:-m-8 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12 pb-20">
        
        {/* Progress Stepper */}
        <div className="flex justify-center items-center space-x-2 md:space-x-4 mb-8 overflow-x-auto">
          {steps.map((label, idx) => (
            <React.Fragment key={idx}>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all ${idx <= currentStepIndex ? 'bg-[#27AE60] border-[#27AE60] text-white shadow-lg' : 'bg-white border-slate-100 text-slate-300'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${idx <= currentStepIndex ? 'bg-white text-[#27AE60]' : 'bg-slate-200 text-slate-400'}`}>
                  {idx + 1}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-8 h-1 rounded-full ${idx < currentStepIndex ? 'bg-[#27AE60]' : 'bg-slate-100'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {view === 'list' && (
          <div className="animate-fadeIn space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-5xl font-black text-[#27AE60] uppercase tracking-tighter drop-shadow-sm italic">WORD ARCHIVE</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.6em]">Academic Collection • {unitPrefix.toUpperCase()}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {vocabData.map((word) => {
                const isExpanded = expandedId === word.id;
                return (
                  <div key={word.id} onClick={() => handleCardInteraction(word)} className={`group relative bg-white rounded-3xl p-8 shadow-lg border-2 transition-all duration-500 cursor-pointer ${isExpanded ? 'scale-[1.04] border-[#27AE60] shadow-2xl' : 'border-slate-100 hover:-translate-y-2 hover:border-[#27AE60]/30'}`}>
                    <div className="absolute top-6 right-6">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${isExpanded ? 'bg-[#27AE60] text-white rotate-12' : 'bg-[#27AE60]/10 text-[#27AE60] group-hover:bg-[#27AE60]/20'}`}>
                        {isSpeaking && isExpanded ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="pr-10">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Vocabulary Item</span>
                        <h3 className="text-3xl font-black text-[#2D3748] tracking-tighter leading-none">{word.english}</h3>
                        {word.phonetic && <p className="text-sm font-mono text-slate-500 mt-1">{word.phonetic}</p>}
                      </div>
                      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                        <div className="pt-6 border-t border-slate-100 space-y-6">
                          <div className="bg-green-50 p-5 rounded-2xl border border-[#27AE60]/10">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Meaning & POS</span>
                            <p className="text-xl font-bold text-[#2D3748]">{word.vietnamese}</p>
                          </div>
                          {word.wordFamily && (
                             <div className="bg-white p-5 rounded-2xl border-2 border-[#27AE60]/10 shadow-sm">
                               <div className="flex items-center gap-2 mb-3">
                                 <Layers size={14} className="text-[#27AE60]" />
                                 <span className="text-[9px] font-black text-[#27AE60] uppercase tracking-[0.2em]">Academic Word Family</span>
                               </div>
                               <p className="text-base text-[#2D3748] font-black leading-relaxed tracking-tight">{word.wordFamily}</p>
                             </div>
                          )}
                          <div className="relative">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2" onClick={(e) => { e.stopPropagation(); handleSpeak(word.example); }}>Academic Context (Tap to Listen)</span>
                            <p className="text-sm text-[#2D3748]/80 leading-relaxed font-medium italic pl-4 border-l-2 border-[#27AE60]/30">"{word.example}"</p>
                          </div>
                        </div>
                      </div>
                      {!isExpanded && (
                        <div className="pt-6 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
                           <span className="text-[9px] font-black text-[#27AE60] uppercase tracking-[0.2em]">Unlock details</span>
                           <ChevronDown size={14} className="animate-bounce text-[#27AE60]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pt-8">
               <button 
                 onClick={() => { setView('visualizer'); playPop(); }}
                 className="px-12 py-5 bg-[#27AE60] text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:bg-[#2ECC71] transition-all flex items-center gap-3 border-b-[6px] border-[#1E8449] active:translate-y-1 active:border-b-0"
               >
                 PROCEED TO AI VISUALIZER <ChevronRight size={16} />
               </button>
            </div>
          </div>
        )}

        {/* ... Visualizer code ... */}
        {view === 'visualizer' && (
          <div className="animate-fadeIn space-y-12">
             {/* ... visualizer content preserved ... */}
             <div className="text-center space-y-4">
              <h2 className="text-5xl font-black text-[#27AE60] uppercase tracking-tighter drop-shadow-sm italic">AI VISUALIZER</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.6em]">Academic Visualization Lab • Web Compatible</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8 items-start">
               <div className="lg:w-1/3 w-full bg-white p-6 rounded-[2rem] border border-slate-200 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar shadow-xl">
                  {vocabData.map(word => (
                    <button 
                      key={word.id} 
                      onClick={() => handleGenerateImage(word)}
                      disabled={isGenerating}
                      className={`w-full p-4 rounded-2xl text-left transition-all border flex items-center justify-between group ${visualizingWord?.id === word.id ? 'bg-[#E8F5E9] border-[#27AE60] text-[#27AE60] shadow-md' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-[#27AE60]/30'}`}
                    >
                      <p className="text-sm font-black tracking-tight uppercase">{word.english}</p>
                    </button>
                  ))}
               </div>
               <div className="lg:w-2/3 w-full bg-slate-50 rounded-[3rem] border border-slate-200 p-8 flex flex-col items-center justify-center min-h-[500px]">
                  {/* ... image display logic ... */}
                  {generatedImage ? <img src={generatedImage} alt="Vis" className="w-full rounded-[2rem] shadow-xl" /> : <p className="text-slate-400 font-bold">Select a word to visualize</p>}
                  {currentDefinition && <p className="mt-4 text-center text-slate-600 italic font-medium max-w-md">"{currentDefinition}"</p>}
               </div>
            </div>

            <div className="flex justify-center pt-8">
               <button 
                 onClick={() => { setView('game'); playPop(); }}
                 className="px-12 py-5 bg-[#27AE60] text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:bg-[#2ECC71] transition-all flex items-center gap-3 border-b-[6px] border-[#1E8449] active:translate-y-1 active:border-b-0"
               >
                 PROCEED TO MEMORY MATCH <ChevronRight size={16} />
               </button>
            </div>
          </div>
        )}

        {view === 'game' && (
          <div className="animate-fadeIn space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-5xl font-black text-[#27AE60] uppercase tracking-tighter drop-shadow-sm italic">MEMORY MATCH</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.6em]">Recall & Retain</p>
            </div>

            <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 max-w-4xl mx-auto">
              <div className="flex items-center space-x-12 w-full justify-center">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Moves</p>
                  <p className="text-4xl font-black text-[#27AE60]">{moves}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Timer</p>
                  <p className="text-4xl font-black text-slate-800">{time}s</p>
                </div>
              </div>
            </div>
            
            {isGameOver ? (
              <div className="flex flex-col items-center justify-center gap-8 py-20 bg-white rounded-[3rem] shadow-2xl border-4 border-[#27AE60]/20 max-w-2xl mx-auto">
                 <div className="w-20 h-20 bg-emerald-100 text-[#27AE60] rounded-full flex items-center justify-center mb-2">
                    <Brain size={40} />
                 </div>
                 <h3 className="text-4xl font-black text-[#27AE60] italic tracking-tighter uppercase">Memory Match Complete!</h3>
                 <p className="text-slate-500 font-bold">Score recorded.</p>
                 <button 
                   onClick={() => { setView('escape'); playPop(); }}
                   className="px-12 py-5 bg-[#27AE60] text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:bg-[#2ECC71] transition-all flex items-center gap-3 border-b-[6px] border-[#1E8449] active:translate-y-1 active:border-b-0"
                 >
                   NEXT: FORBIDDEN LIBRARY <ChevronRight size={16} />
                 </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                  <div key={card.id} onClick={() => handleMemoryClick(index)} className={`aspect-[5/4] perspective-1000 cursor-pointer active:scale-95 transition-transform`}>
                    <div className={`relative w-full h-full duration-500 transform-style-preserve-3d transition-transform ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`}>
                      <div className="absolute inset-0 backface-hidden bg-[#27AE60] rounded-[2rem] flex flex-col items-center justify-center border-4 border-white shadow-xl z-20">
                         <Brain size={48} className="text-white/20 mb-2" />
                         <div className="w-12 h-1 bg-white/10 rounded-full"></div>
                      </div>
                      <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-[2rem] flex items-center justify-center p-6 text-center border-2 z-10 ${card.isMatched ? 'border-green-500 bg-green-50 shadow-[0_0_20px_rgba(39,174,96,0.2)]' : 'border-slate-100 shadow-inner'}`}>
                        {(card.isFlipped || card.isMatched) && (
                          <p className={`font-black text-sm leading-tight uppercase ${card.isMatched ? 'text-green-700' : 'text-slate-800'}`}>
                            {card.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'escape' && <VocabularyEscapeRoom unitId={unitPrefix} onComplete={handleEscapeComplete} onReturn={onReturn} />}
      </div>
      
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-progress {
          animation: progress 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default VocabularyModule;
