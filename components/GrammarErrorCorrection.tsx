import React, { useState, useMemo } from 'react';
import { ErrorCorrectionData, ErrorCorrectionQuestion } from '../types';
import { ShieldCheck, AlertCircle, ChevronRight, CheckCircle2, Zap, ArrowLeft, Lightbulb } from 'lucide-react';
import useGameSound from '../hooks/useGameSound';

interface GrammarErrorCorrectionProps {
  data: ErrorCorrectionData;
  onComplete: (score: number) => void;
  onReturn: () => void;
}

const GrammarErrorCorrection: React.FC<GrammarErrorCorrectionProps> = ({ data, onComplete, onReturn }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [shake, setShake] = useState(false);

  const { playCorrect, playWrong, playPop } = useGameSound();

  const currentQuestion = data.questions[currentIndex];

  // Helper to parse the sentence and make parts clickable
  const parsedSentence = useMemo(() => {
    const parts = currentQuestion.sentence.split(/(\[[A-D]\])/);
    return parts.map((part, i) => {
      const match = part.match(/\[([A-D])\]/);
      if (match) {
        const letter = match[1];
        const isCorrect = letter === currentQuestion.error_part;
        const isSelected = selectedPart === letter;
        
        let colorClass = "text-amber-500 border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10";
        if (isAnswered) {
          if (isCorrect) colorClass = "bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
          else if (isSelected) colorClass = "bg-rose-500/20 text-rose-400 border-rose-500";
          else colorClass = "text-slate-600 border-slate-800 opacity-30 pointer-events-none";
        }

        return (
          <button
            key={i}
            disabled={isAnswered}
            onClick={() => handleSelect(letter)}
            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border-2 font-black text-xs transition-all mx-1 ${colorClass}`}
          >
            {letter}
          </button>
        );
      }
      return <span key={i} className="text-slate-200">{part}</span>;
    });
  }, [currentQuestion, isAnswered, selectedPart]);

  const handleSelect = (letter: string) => {
    if (isAnswered) return;
    playPop();
    setSelectedPart(letter);
    setIsAnswered(true);

    if (letter === currentQuestion.error_part) {
      playCorrect();
      setScore(s => s + 10);
    } else {
      playWrong();
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    if (currentIndex < data.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedPart(null);
      playPop();
    } else {
      setIsGameOver(true);
      const finalScore = Math.round((score / (data.questions.length * 10)) * 100);
      onComplete(finalScore);
    }
  };

  if (isGameOver) {
    const finalScore = Math.round((score / (data.questions.length * 10)) * 100);
    return (
      <div className="bg-[#2d1f18] rounded-[3rem] p-12 text-center shadow-2xl animate-bounceIn max-w-lg mx-auto border-4 border-amber-900/30 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 to-rose-500"></div>
        <div className="w-24 h-24 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">
          <ShieldCheck />
        </div>
        <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">Mission Accomplished</h2>
        <p className="text-slate-400 mb-8 font-medium">You have corrected the grammar stream.</p>
        
        <div className="bg-amber-500/5 p-8 rounded-[2.5rem] border border-amber-500/20 mb-10">
           <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Final Accuracy</p>
           <p className="text-7xl font-black text-amber-400 italic">{finalScore}%</p>
        </div>
        
        <button 
          onClick={onReturn}
          className="w-full bg-amber-600 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] shadow-xl hover:bg-amber-500 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <ArrowLeft size={18} />
          <span>Return to Study Hub</span>
        </button>
      </div>
    );
  }

  const progressPercentage = ((currentIndex + 1) / data.questions.length) * 100;

  return (
    <div className={`max-w-4xl mx-auto space-y-8 animate-fadeIn ${shake ? 'animate-shake' : ''}`}>
      {/* Header Info */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
           <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center border border-amber-500/20">
              <Zap size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-1">{data.title}</p>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{data.description}</h3>
           </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-center">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Current XP</p>
              <p className="text-2xl font-black text-white italic">{score}</p>
           </div>
           <div className="w-px h-10 bg-white/10"></div>
           <div className="text-center">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Progress</p>
              <p className="text-2xl font-black text-amber-500 italic">{currentIndex + 1}/{data.questions.length}</p>
           </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
        <div 
          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-[#2d1f18] rounded-[4rem] border border-white/5 p-10 md:p-16 shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[400px]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>

        <div className="relative z-10 space-y-12">
           <div className="text-center">
              <p className="text-lg md:text-3xl font-bold text-white leading-relaxed tracking-tight">
                {parsedSentence}
              </p>
              <p className="mt-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Identify the part with a grammatical error</p>
           </div>

           {isAnswered && (
             <div className="animate-slideUp space-y-8">
                <div className={`p-8 rounded-[2.5rem] border-2 shadow-inner relative overflow-hidden transition-all ${selectedPart === currentQuestion.error_part ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                   <div className="flex items-start gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl shadow-lg ${selectedPart === currentQuestion.error_part ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                        {selectedPart === currentQuestion.error_part ? <CheckCircle2 /> : <AlertCircle />}
                      </div>
                      <div className="space-y-3">
                         <div className="flex items-center gap-3">
                            <h4 className={`text-xl font-black italic tracking-tighter uppercase ${selectedPart === currentQuestion.error_part ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {selectedPart === currentQuestion.error_part ? 'Well Spotted!' : 'Incorrect Identification'}
                            </h4>
                         </div>
                         <div className="space-y-1">
                            <p className="text-slate-300 font-medium">
                               Error at part <span className="font-black text-white">[{currentQuestion.error_part}]</span>. 
                               Correction: <span className="font-black text-amber-400 underline decoration-2 underline-offset-4">{currentQuestion.correction}</span>
                            </p>
                            <div className="pt-3 border-t border-white/5 flex items-start gap-2">
                               <Lightbulb size={14} className="text-amber-500 mt-1 shrink-0" />
                               <p className="text-sm italic text-slate-400 leading-relaxed">"{currentQuestion.explanation}"</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={handleNext}
                  className="w-full bg-white text-[#2d1f18] py-6 rounded-[3rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:bg-amber-100 transition-all flex items-center justify-center gap-4 active:scale-95 border-b-8 border-slate-300"
                >
                  <span>{currentIndex < data.questions.length - 1 ? 'PROCEED TO THE NEXT QUESTION' : 'Final Analysis'}</span>
                  <ChevronRight size={18} />
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default GrammarErrorCorrection;