
import React, { useState, useEffect, useMemo } from 'react';
import { VocabularyWord, ModuleProgress } from '../types';
import VocabularyEscapeRoom from './VocabularyEscapeRoom';
import useGameSound from '../hooks/useGameSound';
import { generateVocabImage, speakText, getEnglishDefinition } from '../services/geminiService';
import { Sparkles, Image as ImageIcon, Loader2, Volume2, Archive, Brain, Library, ChevronDown, RotateCcw, ChevronRight, HelpCircle, Layers, CheckCircle, ShieldAlert } from 'lucide-react';
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
  const [view, setView] = useState<'list' | 'visualizer' | 'game' | 'escape' | 'certificate'>(initialView === 'game' ? 'game' : 'list');
  const [certType, setCertType] = useState<'Vocabulary' | 'Forbidden Library'>('Forbidden Library');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const [visualizingWord, setVisualizingWord] = useState<VocabularyWord | null>(null);
  const [currentDefinition, setCurrentDefinition] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [finalScore, setFinalScore] = useState(0);

  const { playCorrect, playWrong, playPop } = useGameSound();

  const unitPrefix = vocabGameId.split('_')[0];
  const escapeRoomId = `${unitPrefix}_vocabulary_escape`;

  useEffect(() => {
    if (initialView === 'game' && view !== 'game') setView('game');
  }, [initialView]);

  useEffect(() => {
    if (view === 'game') initGame();
    if (view === 'visualizer' && vocabData.length > 0 && !visualizingWord) handleGenerateImage(vocabData[0]);
  }, [vocabData, view]);

  useEffect(() => {
    let interval: any;
    if (isActive && !isGameOver) interval = setInterval(() => setTime((prev) => prev + 1), 1000);
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
    setFlippedIndices([]); setMoves(0); setMatches(0); setTime(0); setIsGameOver(false); setIsActive(false);
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
    if (isExpanding) onGameComplete(`${unitPrefix}_vocab_viewed_${word.id}`, 100);
  };

  const handleMemoryClick = (index: number) => {
    if (isGameOver || flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;
    if (!isActive) setIsActive(true);
    playPop();
    setCards(prev => { const next = [...prev]; next[index] = { ...next[index], isFlipped: true }; return next; });
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (cards[firstIdx].wordId === cards[secondIdx].wordId) {
        setTimeout(() => {
          playCorrect();
          setCards(prev => { const next = [...prev]; next[firstIdx] = { ...next[firstIdx], isMatched: true }; next[secondIdx] = { ...next[secondIdx], isMatched: true }; return next; });
          setFlippedIndices([]);
          setMatches(m => {
            const nextMatches = m + 1;
            if (nextMatches === 8) {
              setIsGameOver(true);
              const calculatedScore = Math.max(0, 100 - (moves + 1 - 8) * 5);
              onGameComplete(vocabGameId, calculatedScore);
              setFinalScore(calculatedScore);
            }
            return nextMatches;
          });
        }, 500);
      } else {
        setTimeout(() => {
          playWrong();
          setCards(prev => { const next = [...prev]; next[firstIdx] = { ...next[firstIdx], isFlipped: false }; next[secondIdx] = { ...next[secondIdx], isFlipped: false }; return next; });
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
      const [img, def] = await Promise.all([generateVocabImage(word.english, word.visualPrompt), getEnglishDefinition(word.english)]);
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

  if (view === 'certificate') {
    const unitTitleMap: Record<string, string> = { 'u1': 'Generation Gap', 'u2': 'Vietnam and ASEAN', 'u3': 'Global Warming', 'u4': 'World Heritage' };
    const unitTitle = unitTitleMap[unitPrefix] || "Unknown Unit";
    const feedback = `Forbidden Library Assessment Complete. Score: ${finalScore}%. Access granted to advanced modules.`;
    return (
      <PerformanceCertificate
        studentName={studentName}
        unitTitle={`Vocabulary Master: ${unitTitle}`}
        type={certType}
        score={finalScore}
        feedback={feedback}
        onSaveAndExit={onReturn}
      />
    );
  }

  const currentStepIndex = view === 'list' ? 0 : view === 'visualizer' ? 1 : view === 'game' ? 2 : view === 'escape' ? 3 : 4;
  const steps = ['Archive', 'AI Visualizer', 'Memory Match', 'Forbidden Library'];

  const cardStyle: React.CSSProperties = { background: '#1E293B', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderRadius: '20px' };

  const proceedBtn = (label: string, onClick: () => void) => (
    <div className="flex justify-center pt-8">
      <button
        onClick={onClick}
        className="px-10 py-4 font-black uppercase text-sm tracking-widest flex items-center gap-3 rounded-2xl text-white transition-all duration-200"
        style={{ background: 'linear-gradient(135deg, #6366F1, #3B82F6)', boxShadow: '0 8px 25px rgba(99,102,241,0.4)' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(99,102,241,0.55)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.4)'; }}
      >
        {label} <ChevronRight size={18} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen -m-4 md:-m-8 p-4 md:p-8" style={{ background: '#0F172A' }}>
      <div className="max-w-7xl mx-auto space-y-12 pb-20">

        {/* Progress Stepper */}
        <div className="flex justify-center items-center space-x-2 md:space-x-3 mb-8 overflow-x-auto pb-2">
          {steps.map((label, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all"
                style={idx <= currentStepIndex ? {
                  background: 'rgba(99,102,241,0.15)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  color: '#A5B4FC',
                } : {
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#475569',
                }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
                  style={idx <= currentStepIndex ? { background: '#6366F1', color: 'white' } : { background: '#1E293B', color: '#475569' }}>
                  {idx + 1}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className="w-6 h-px rounded-full" style={{ background: idx < currentStepIndex ? '#6366F1' : '#1E293B' }}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* WORD ARCHIVE */}
        {view === 'list' && (
          <div className="animate-fadeIn space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-5xl font-black uppercase tracking-tighter italic" style={{ background: 'linear-gradient(135deg, #6366F1, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Poppins, sans-serif' }}>
                WORD ARCHIVE
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.6em]" style={{ color: '#475569' }}>Academic Collection · {unitPrefix.toUpperCase()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vocabData.map((word) => {
                const isExpanded = expandedId === word.id;
                return (
                  <div key={word.id} onClick={() => handleCardInteraction(word)}
                    className="group relative rounded-3xl p-7 transition-all duration-500 cursor-pointer"
                    style={isExpanded ? {
                      background: '#243044',
                      border: '1px solid rgba(99,102,241,0.4)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                      transform: 'scale(1.02)',
                    } : {
                      background: '#1E293B',
                      border: '1px solid rgba(255,255,255,0.05)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    }}
                    onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.border = '1px solid rgba(99,102,241,0.2)'; }}
                    onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)'; }}
                  >
                    <div className="absolute top-5 right-5">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                        style={isExpanded ? { background: 'linear-gradient(135deg, #6366F1, #22D3EE)', color: 'white' } : { background: 'rgba(99,102,241,0.1)', color: '#6366F1' }}>
                        {isSpeaking && isExpanded ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="pr-10">
                        <span className="text-[10px] font-black uppercase tracking-widest block mb-1" style={{ color: '#475569' }}>Vocabulary</span>
                        <h3 className="text-2xl font-black tracking-tighter leading-none" style={{ color: '#F8FAFC', fontFamily: 'Poppins, sans-serif' }}>{word.english}</h3>
                        {word.phonetic && <p className="text-sm font-mono mt-1" style={{ color: '#64748B' }}>{word.phonetic}</p>}
                      </div>
                      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                        <div className="pt-5 border-t space-y-5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                          <div className="p-4 rounded-2xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                            <span className="text-[9px] font-black uppercase tracking-widest block mb-1" style={{ color: '#64748B' }}>Meaning & POS</span>
                            <p className="text-lg font-bold" style={{ color: '#F8FAFC' }}>{word.vietnamese}</p>
                          </div>
                          {word.wordFamily && (
                            <div className="p-4 rounded-2xl" style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.1)' }}>
                              <div className="flex items-center gap-2 mb-2">
                                <Layers size={12} style={{ color: '#22D3EE' }} />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: '#22D3EE' }}>Academic Word Family</span>
                              </div>
                              <p className="text-base font-black leading-relaxed tracking-tight" style={{ color: '#CBD5E1' }}>{word.wordFamily}</p>
                            </div>
                          )}
                          <div className="relative">
                            <span className="text-[9px] font-black uppercase tracking-widest block mb-2" style={{ color: '#475569' }}
                              onClick={(e) => { e.stopPropagation(); handleSpeak(word.example); }}>
                              Academic Context (Tap to Listen)
                            </span>
                            <p className="text-sm leading-relaxed font-medium italic pl-4" style={{ color: '#94A3B8', borderLeft: '2px solid rgba(99,102,241,0.3)' }}>"{word.example}"</p>
                          </div>
                        </div>
                      </div>
                      {!isExpanded && (
                        <div className="pt-5 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: '#6366F1' }}>Unlock details</span>
                          <ChevronDown size={14} className="animate-bounce" style={{ color: '#6366F1' }} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {proceedBtn('PROCEED TO AI VISUALIZER', () => { setView('visualizer'); playPop(); })}
          </div>
        )}

        {/* AI VISUALIZER */}
        {view === 'visualizer' && (
          <div className="animate-fadeIn space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-5xl font-black uppercase tracking-tighter italic" style={{ background: 'linear-gradient(135deg, #6366F1, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Poppins, sans-serif' }}>
                AI VISUALIZER
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.6em]" style={{ color: '#475569' }}>Academic Visualization Lab</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="lg:w-1/3 w-full p-4 rounded-2xl space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar" style={cardStyle}>
                {vocabData.map(word => (
                  <button
                    key={word.id}
                    onClick={() => handleGenerateImage(word)}
                    disabled={isGenerating}
                    className="w-full p-3 rounded-xl text-left transition-all flex items-center justify-between"
                    style={visualizingWord?.id === word.id ? {
                      background: 'rgba(99,102,241,0.15)',
                      border: '1px solid rgba(99,102,241,0.35)',
                      color: '#A5B4FC',
                    } : {
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      color: '#64748B',
                    }}
                  >
                    <p className="text-sm font-black tracking-tight uppercase">{word.english}</p>
                  </button>
                ))}
              </div>
              <div className="lg:w-2/3 w-full rounded-3xl p-8 flex flex-col items-center justify-center min-h-[500px]" style={cardStyle}>
                {generatedImage === "ERROR_GENERATION_FAILED" ? (
                  <div className="text-center p-8 rounded-2xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <ShieldAlert className="w-12 h-12 mx-auto mb-4" style={{ color: '#F59E0B' }} />
                    <p className="font-bold uppercase tracking-wide" style={{ color: '#F59E0B' }}>Visualization Unavailable</p>
                    <p className="text-xs mt-2" style={{ color: '#78350F' }}>AI visualizer is experiencing high traffic. Please try again later.</p>
                  </div>
                ) : generatedImage ? (
                  <img src={generatedImage} alt="Vis" className="w-full rounded-2xl shadow-xl" />
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366F1' }}>
                      <ImageIcon size={28} />
                    </div>
                    <p className="font-bold" style={{ color: '#475569' }}>Select a word to visualize</p>
                  </div>
                )}
                {currentDefinition && <p className="mt-4 text-center italic font-medium max-w-md" style={{ color: '#64748B' }}>"{currentDefinition}"</p>}
              </div>
            </div>
            {proceedBtn('PROCEED TO MEMORY MATCH', () => { setView('game'); playPop(); })}
          </div>
        )}

        {/* MEMORY MATCH */}
        {view === 'game' && (
          <div className="animate-fadeIn space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-5xl font-black uppercase tracking-tighter italic" style={{ background: 'linear-gradient(135deg, #6366F1, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Poppins, sans-serif' }}>
                MEMORY MATCH
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.6em]" style={{ color: '#475569' }}>Recall & Retain</p>
            </div>

            <div className="flex justify-center items-center gap-12 p-8 rounded-2xl max-w-3xl mx-auto" style={cardStyle}>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#64748B' }}>Total Moves</p>
                <p className="text-4xl font-black" style={{ color: '#6366F1' }}>{moves}</p>
              </div>
              <div className="w-px h-12" style={{ background: 'rgba(255,255,255,0.06)' }}></div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#64748B' }}>Timer</p>
                <p className="text-4xl font-black" style={{ color: '#F8FAFC' }}>{time}s</p>
              </div>
            </div>

            {isGameOver ? (
              <div className="flex flex-col items-center justify-center gap-8 py-20 rounded-3xl max-w-2xl mx-auto" style={cardStyle}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366F1' }}>
                  <Brain size={40} />
                </div>
                <h3 className="text-4xl font-black italic tracking-tighter uppercase" style={{ background: 'linear-gradient(135deg, #6366F1, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Poppins, sans-serif' }}>
                  Memory Match Complete!
                </h3>
                <p className="font-bold" style={{ color: '#64748B' }}>Score recorded. Proceeding to final challenge.</p>
                <button
                  onClick={() => { setView('escape'); playPop(); }}
                  className="px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest text-white transition-all duration-200 flex items-center gap-3"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #3B82F6)', boxShadow: '0 8px 25px rgba(99,102,241,0.4)' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  NEXT: FORBIDDEN LIBRARY <ChevronRight size={18} />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {cards.map((card, index) => (
                  <div key={card.id} onClick={() => handleMemoryClick(index)} className="aspect-[5/4] perspective-1000 cursor-pointer active:scale-95 transition-transform">
                    <div className={`relative w-full h-full duration-500 transform-style-preserve-3d transition-transform ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`}>
                      {/* Card Back */}
                      <div className="absolute inset-0 backface-hidden rounded-2xl flex flex-col items-center justify-center z-20"
                        style={{ background: 'linear-gradient(135deg, #312E81, #1E3A5F)', border: '2px solid rgba(99,102,241,0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
                        <Brain size={36} style={{ color: 'rgba(165,180,252,0.3)' }} />
                      </div>
                      {/* Card Front */}
                      <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl flex items-center justify-center p-5 text-center z-10`}
                        style={card.isMatched ? {
                          background: 'rgba(34,197,94,0.12)',
                          border: '2px solid rgba(34,197,94,0.35)',
                          boxShadow: '0 0 20px rgba(34,197,94,0.2)',
                        } : {
                          background: '#243044',
                          border: '2px solid rgba(99,102,241,0.2)',
                        }}>
                        {(card.isFlipped || card.isMatched) && (
                          <p className="font-black text-sm leading-tight uppercase" style={{ color: card.isMatched ? '#4ADE80' : '#F8FAFC' }}>
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
        @keyframes progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
        .animate-progress { animation: progress 2s infinite linear; }
      `}</style>
    </div>
  );
};

export default VocabularyModule;
