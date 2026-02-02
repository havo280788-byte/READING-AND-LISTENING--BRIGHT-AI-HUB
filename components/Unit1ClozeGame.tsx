
import React, { useState } from 'react';
import { unit1GameData } from '../constants';
import { ModuleProgress } from '../types';
import useGameSound from '../hooks/useGameSound';

interface Unit1ClozeGameProps {
  onComplete: (score: number) => void;
  onReturn: () => void;
  progress?: ModuleProgress;
}

const MAX_RETRIES = 2;

const Unit1ClozeGame: React.FC<Unit1ClozeGameProps> = ({ onComplete, onReturn, progress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [shake, setShake] = useState(false);
  const [answersHistory, setAnswersHistory] = useState<(boolean | null)[]>(new Array(10).fill(null));

  const { playCorrect, playWrong } = useGameSound();

  const currentAttempts = progress?.attempts || 0;
  const remainingRetries = Math.max(0, MAX_RETRIES - currentAttempts);

  const currentQuestion = unit1GameData[currentIndex];
  const isCorrectChoice = selectedAnswer === currentQuestion.correctAnswer;

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    
    const isCorrect = option === currentQuestion.correctAnswer;
    setSelectedAnswer(option);
    setIsAnswered(true);

    const newHistory = [...answersHistory];
    newHistory[currentIndex] = isCorrect;
    setAnswersHistory(newHistory);

    if (isCorrect) {
      playCorrect();
      setScore(s => s + 10);
    } else {
      playWrong();
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    if (currentIndex < unit1GameData.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setGameOver(true);
      onComplete(score);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setGameOver(false);
    setAnswersHistory(new Array(10).fill(null));
  };

  const getOptionStyles = (opt: string, index: number) => {
    const tints = [
      { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', circle: 'bg-blue-500', hover: 'hover:bg-blue-100 hover:border-blue-300' },
      { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', circle: 'bg-emerald-500', hover: 'hover:bg-emerald-100 hover:border-emerald-300' },
      { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', circle: 'bg-amber-500', hover: 'hover:bg-amber-100 hover:border-amber-300' },
      { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', circle: 'bg-purple-500', hover: 'hover:bg-purple-100 hover:border-purple-300' },
    ];
    
    const tint = tints[index % tints.length];

    if (isAnswered) {
      if (opt === currentQuestion.correctAnswer) {
        return "bg-green-100 border-green-500 text-green-700 font-black shadow-md shadow-green-100 scale-[1.02]";
      } else if (opt === selectedAnswer) {
        return "bg-[#FF0000] border-[#FF0000] text-white font-black scale-[0.98] opacity-100";
      } else {
        return "bg-slate-50 border-slate-100 text-slate-300 grayscale opacity-40 cursor-default";
      }
    }
    
    return `${tint.bg} ${tint.border} ${tint.text} ${tint.hover} transform hover:-translate-y-1 hover:shadow-md cursor-pointer`;
  };

  const getLetterCircleStyles = (index: number) => {
    const circles = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];
    return `${circles[index % circles.length]} text-white`;
  };

  if (gameOver) {
    return (
      <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl text-center animate-bounceIn max-w-lg mx-auto border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
        <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-lg shadow-blue-200">
          <i className="fa-solid fa-trophy"></i>
        </div>
        <h2 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">Mission Accomplished!</h2>
        <p className="text-slate-500 mb-4 text-lg font-medium">You have completed the Tech Mastery Challenge.</p>
        
        <div className="inline-block bg-blue-50 px-8 py-4 rounded-[2rem] border-2 border-blue-100 mb-10">
          <p className="text-blue-600 font-black text-4xl tracking-widest">{score}%</p>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Final Score</p>
        </div>
        
        <div className="space-y-4">
          {remainingRetries > 0 && (
            <button 
              onClick={handleRetry} 
              className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center"
            >
              <i className="fa-solid fa-rotate-right mr-2"></i> Thử lại (Còn {remainingRetries} lượt)
            </button>
          )}
          {remainingRetries === 0 && (
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-widest">
              <i className="fa-solid fa-lock mr-2"></i> Bạn đã hết lượt làm lại.
            </div>
          )}
          <button 
            type="button"
            onClick={onReturn} 
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-black transition-all active:scale-95 flex items-center justify-center"
          >
             <i className="fa-solid fa-house mr-2"></i> Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-2xl mx-auto space-y-6 ${shake ? 'animate-shake' : ''}`}>
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
        <div className="flex justify-between items-center mb-1">
           <h2 className="text-3xl font-black text-slate-800 tracking-tight">Tech Mastery</h2>
           <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
             Attempt {currentAttempts + 1}/3
           </div>
        </div>
        <p className="text-slate-400 font-bold text-sm tracking-wide mb-8">Generation Gap & Future Technology</p>

        <div className="flex justify-between items-center px-2 md:px-6 relative">
          <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 -z-10"></div>
          {answersHistory.map((status, i) => {
            const isActive = i === currentIndex;
            const isCompleted = status !== null;
            const isCorrect = status === true;
            let iconClass = "fa-solid fa-microchip";
            let containerClass = "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 bg-white ";
            
            if (isActive) { 
              containerClass += "border-blue-500 text-blue-500 scale-125 shadow-lg shadow-blue-100 ring-4 ring-blue-50"; 
            } else if (isCompleted) {
              if (isCorrect) { 
                containerClass = "w-10 h-10 rounded-full flex items-center justify-center bg-green-500 text-white border-green-500 shadow-md"; 
                iconClass = "fa-solid fa-check text-sm"; 
              } else { 
                containerClass = "w-10 h-10 rounded-full flex items-center justify-center bg-red-500 text-white border-red-500 shadow-md"; 
                iconClass = "fa-solid fa-xmark text-sm"; 
              }
            } else { 
              containerClass += "border-slate-100 text-slate-300 opacity-60"; 
            }
            return ( 
              <div key={i} className="flex flex-col items-center group"> 
                <div className={containerClass}> <i className={iconClass}></i> </div> 
              </div> 
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden transition-all duration-500">
        <div className="w-full h-48 overflow-hidden relative group">
          <img 
            src={currentQuestion.illustrationUrl || "https://source.unsplash.com/random/800x400/?technology"} 
            alt="Question Illustration" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent"></div>
        </div>

        <div className="p-8 md:p-10 relative">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-50 rounded-full opacity-30 blur-3xl"></div>
          
          <p className="text-2xl md:text-4xl font-bold text-slate-800 leading-relaxed mb-12 text-center relative z-10">
            {currentQuestion.sentence.split('_______').map((part, i) => (
              <React.Fragment key={i}>
                {part}
                {i === 0 && (
                  <span className={`inline-block min-w-[140px] border-b-4 mx-2 text-center transition-all px-2 ${
                    isAnswered ? isCorrectChoice ? 'text-green-600 border-green-500' : 'text-red-500 border-red-500' : 'text-blue-500 border-blue-200'
                  }`}>
                    {selectedAnswer || '_______'}
                  </span>
                )}
              </React.Fragment>
            ))}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {currentQuestion.options.map((opt, i) => (
              <button 
                key={opt} 
                disabled={isAnswered} 
                onClick={() => handleSelect(opt)} 
                className={`p-8 rounded-3xl font-black text-2xl transition-all shadow-sm flex items-center space-x-6 border-4 ${getOptionStyles(opt, i)}`}
              >
                <span className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-black border-2 border-white/30 ${getLetterCircleStyles(i)}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 text-left">{opt}</span>
                {isAnswered && opt === currentQuestion.correctAnswer && <i className="fa-solid fa-circle-check text-green-500 ml-2 text-3xl"></i>}
              </button>
            ))}
          </div>

          {isAnswered && (
            <div className="mt-10 animate-fadeIn space-y-6 relative z-10">
              <div className={`p-6 rounded-[2rem] border-2 shadow-lg flex items-start space-x-6 ${isCorrectChoice ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center flex-shrink-0 text-3xl shadow-sm ${isCorrectChoice ? 'bg-green-500 text-white' : 'bg-orange-100 text-orange-600'}`}>
                  <i className={`fa-solid ${isCorrectChoice ? 'fa-award' : 'fa-lightbulb'}`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="font-black text-xl">{isCorrectChoice ? '🎉 Chính xác! Amazing!' : '⚠️ Cần cố gắng thêm!'}</p>
                  </div>
                  {!isCorrectChoice && <p className="font-bold text-red-700 mb-2">Đáp án đúng: <span className="underline decoration-2 underline-offset-4">{currentQuestion.correctAnswer}</span></p>}
                  <div className="pt-3 border-t border-black/5">
                    <p className="text-sm leading-relaxed font-medium"><span className="font-black opacity-50 uppercase text-[10px] tracking-widest block mb-1">Giải thích chi tiết:</span>{currentQuestion.explanation}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleNext} className="bg-slate-900 text-white py-4 px-10 rounded-2xl font-black hover:bg-red-700 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center space-x-3">
                  <span className="uppercase tracking-widest text-xs font-black">{currentIndex === unit1GameData.length - 1 ? 'FINISH CHALLENGE' : 'PROCEED TO THE NEXT QUESTION'}</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unit1ClozeGame;
