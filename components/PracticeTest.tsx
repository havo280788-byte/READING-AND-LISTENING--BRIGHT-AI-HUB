
import React, { useState, useEffect, useMemo } from 'react';
import { PracticeTestData, PracticeTestQuestion, PracticeTestSection, ModuleProgress } from '../types';
import { Target, Timer, ChevronRight, CheckCircle2, AlertCircle, Volume2, Trophy, ArrowLeft, Headphones, Zap, ShieldCheck, Construction, Loader2 } from 'lucide-react';
import useGameSound from '../hooks/useGameSound';
import { speakText } from '../services/geminiService';
import PerformanceCertificate from './PerformanceCertificate';

interface PracticeTestProps {
  studentName?: string;
  studentUsername?: string; // Optional
  testData: PracticeTestData;
  onComplete: (score: number) => void;
  onReturn: () => void;
  unitProgress?: Record<string, ModuleProgress>;
}

const PracticeTest: React.FC<PracticeTestProps> = ({
  studentName = "Student",
  studentUsername,
  testData,
  onComplete,
  onReturn,
  unitProgress
}) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(testData.time_limit_minutes * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { playCorrect, playWrong, playPop } = useGameSound();

  // Extract unit ID from testData.module_id (e.g., "u1_practice_test" -> "u1")
  const unitPrefix = testData.module_id.split('_')[0];

  const flatQuestions = useMemo(() => {
    return testData.sections.flatMap(s => s.questions) || [];
  }, [testData]);

  const currentQuestion = flatQuestions[currentQuestionIdx];

  const currentSection = useMemo(() => {
    if (flatQuestions.length === 0) return null;
    let count = 0;
    for (const section of testData.sections) {
      count += section.questions.length;
      if (currentQuestionIdx < count) return section;
    }
    return testData.sections[0];
  }, [currentQuestionIdx, testData, flatQuestions]);

  useEffect(() => {
    if (flatQuestions.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [flatQuestions.length]);

  const handleSpeak = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    await speakText(text);
    setIsSpeaking(false);
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswered || !currentQuestion) return;
    setSelectedOption(option);
    const isCorrect = option.toLowerCase() === currentQuestion.answer.toLowerCase();
    processResult(isCorrect, option);
  };

  const handleTypeSubmit = () => {
    if (isAnswered || !typedAnswer.trim() || !currentQuestion) return;
    const isCorrect = typedAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase();
    processResult(isCorrect, typedAnswer.trim());
  };

  const processResult = (isCorrect: boolean, userValue: string) => {
    if (!currentQuestion) return;
    setIsAnswered(true);
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: userValue }));

    if (isCorrect) {
      playCorrect();
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      playWrong();
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < flatQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setTypedAnswer('');
      playPop();
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    setIsFinished(true);
  };

  const calculateFinalScore = () => {
    // 1. Secret Story (Grammar Game): Max 10 points
    // Stored as percentage (0-100) in unitProgress
    const secretStoryRaw = unitProgress?.[`${unitPrefix}_grammar_game`]?.score || 0;
    const secretStoryScore = Math.round(secretStoryRaw * 0.1); // 100 -> 10

    // 2. Memory Match (Vocab Game): Max 10 points
    const memoryMatchRaw = unitProgress?.[`${unitPrefix}_vocabulary_memory`]?.score || 0;
    const memoryMatchScore = Math.round(memoryMatchRaw * 0.1); // 100 -> 10

    // 3. Challenge (This test): Max 80 points
    const challengeRaw = flatQuestions.length > 0 ? (score / flatQuestions.length) : 0; // 0 to 1
    const challengeScore = Math.round(challengeRaw * 80); // 1 -> 80

    return secretStoryScore + memoryMatchScore + challengeScore;
  };

  const handleSaveAndExit = () => {
    const finalScore = flatQuestions.length > 0 ? Math.round((score / flatQuestions.length) * 100) : 0;
    onComplete(finalScore);
    onReturn();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (flatQuestions.length === 0) {
    return (
      <div className="min-h-screen -m-4 md:-m-8 p-4 md:p-8 flex flex-col items-center justify-center animate-fadeIn">
        <div className="max-w-2xl w-full bg-white backdrop-blur-md rounded-[3rem] border-4 border-[#27AE60]/20 shadow-2xl p-12 text-center space-y-10">
          <div className="w-24 h-24 bg-[#27AE60]/10 text-[#27AE60] rounded-full flex items-center justify-center mx-auto mb-6">
            <Construction size={48} />
          </div>
          <div className="space-y-4">
            <h2 className="type-h2 text-[#2D3748] uppercase italic tracking-tighter">Under Construction</h2>
            <p className="type-body-reading text-[#5D6D61] italic leading-relaxed">
              "The academic sequence for {testData.unit_context} is currently being compiled. Please return to the unit hub and check back soon."
            </p>
          </div>
          <button
            onClick={onReturn}
            className="w-full bg-[#27AE60] text-white py-6 rounded-[2rem] type-button shadow-xl hover:bg-[#2ECC71] transition-all flex items-center justify-center space-x-3"
          >
            <ArrowLeft size={18} />
            <span>Return to Hub</span>
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const totalScore = calculateFinalScore();
    const isPass = totalScore >= 70;
    const challengeRawPercent = Math.round((score / flatQuestions.length) * 100);

    return (
      <div className="min-h-screen -m-4 md:-m-8 p-4 md:p-8 flex flex-col items-center justify-center bg-white">
        {isPass ? (
          <div className="w-full">
            <PerformanceCertificate
              studentName={studentName}
              studentUsername={studentUsername}
              unitTitle={testData.title}
              type="Challenge"
              score={totalScore}
              feedback={`UNIT MASTERY ACHIEVED. Challenge: ${challengeRawPercent}%. Total Unit Score: ${totalScore}/100.`}
              onSaveAndExit={handleSaveAndExit}
            />
            <div className="flex justify-center mt-8">
              <button
                onClick={handleSaveAndExit}
                className="px-8 py-3 border-2 border-[#27AE60] text-[#27AE60] type-button rounded-2xl hover:bg-green-50 transition-all"
              >
                QUAY LẠI MÀN HÌNH CHÍNH UNIT
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl border-4 border-[#27AE60]/20">
            <div className="w-24 h-24 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-pulse">
              <Target size={48} />
            </div>
            <h2 className="type-h3 text-[#2D3748] uppercase tracking-tighter italic mb-4">Cố gắng lên!</h2>
            <div className="bg-green-50 border border-[#27AE60]/20 p-6 rounded-2xl mb-8">
              <p className="type-body text-slate-600 leading-relaxed">
                Rất tiếc <span className="font-bold text-[#27AE60]">{studentName}</span>, bạn chưa đạt 70 điểm tổng kết để nhận chứng chỉ.
              </p>
              <div className="mt-4 flex flex-col items-center">
                <span className="type-caption text-slate-400 tracking-widest">Tổng Điểm Unit</span>
                <span className="type-h1 text-[#27AE60]">{totalScore}/100</span>
              </div>
            </div>
            <button
              onClick={onReturn}
              className="w-full bg-[#27AE60] text-white py-5 rounded-[2rem] type-button shadow-xl hover:bg-[#2ECC71] transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <ArrowLeft size={18} />
              <span>QUAY LẠI MÀN HÌNH CHÍNH UNIT</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  const progressVal = ((currentQuestionIdx + 1) / flatQuestions.length) * 100;

  return (
    <div className="min-h-screen -m-4 md:-m-8 p-4 md:p-8 flex flex-col">
      <div className="max-w-6xl mx-auto w-full space-y-8 flex-1 flex flex-col">
        {/* Header preserved */}
        <header className="flex justify-between items-center bg-white backdrop-blur-xl border border-green-100 p-6 rounded-[2.5rem]">
          <div className="flex items-center gap-4">
            <button onClick={onReturn} className="w-10 h-10 rounded-full bg-[#27AE60]/10 flex items-center justify-center text-[#5D6D61] hover:text-[#27AE60] transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h3 className="type-caption text-[#27AE60] tracking-[0.3em] mb-1">{testData.title}</h3>
              <p className="type-caption text-[#5D6D61] tracking-widest">{currentSection?.section_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-[#27AE60]/10">
              <Timer size={14} className={timeLeft < 300 ? 'text-rose-500 animate-pulse' : 'text-[#27AE60]'} />
              <span className={`type-small font-mono ${timeLeft < 300 ? 'text-rose-500' : 'text-[#2D3748]'}`}>{formatTime(timeLeft)}</span>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-[#27AE60]/10">
              <Target size={14} className="text-[#27AE60]" />
              <span className="type-small text-[#2D3748] italic">{score} XP</span>
            </div>
            {streak > 2 && (
              <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-xl border border-green-500/30 text-green-600 animate-bounce">
                <Zap size={14} fill="currentColor" />
                <span className="text-xs font-black">X{streak} COMBO</span>
              </div>
            )}
          </div>
        </header>

        <div className="space-y-2">
          <div className="flex justify-between px-2">
            <span className="type-caption text-[#2ECC71] tracking-widest">Progress</span>
            <span className="type-caption text-[#27AE60] tracking-widest">{currentQuestionIdx + 1} / {flatQuestions.length}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-[#27AE60] rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${progressVal}%` }}
            ></div>
          </div>
        </div>

        <main className="flex-1 flex flex-col justify-center py-4">
          {/* Question content preserved */}
          <div className="bg-white backdrop-blur-md border border-green-100 rounded-[4rem] p-8 md:p-16 shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#27AE60]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#27AE60]/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>

            <div className="relative z-10 space-y-12">
              <div className="text-center space-y-6">
                {currentQuestion?.type === 'listening_spelling' ? (
                  <div className="flex flex-col items-center gap-8">
                    <div className="p-4 rounded-full bg-[#27AE60]/10 border border-[#27AE60]/20 text-[#27AE60] mb-2">
                      <Headphones size={32} />
                    </div>
                    <button
                      onClick={() => handleSpeak(currentQuestion.audio_placeholder || '')}
                      disabled={isSpeaking}
                      className="flex items-center gap-3 bg-green-50 hover:bg-[#27AE60] hover:text-white transition-all px-8 py-4 rounded-2xl border border-[#27AE60]/20 group shadow-lg text-[#2D3748]"
                    >
                      {isSpeaking ? <Loader2 size={24} className="animate-spin" /> : <Volume2 size={24} className="group-hover:animate-bounce" />}
                      <span className="type-button">Listen to Word (US Female)</span>
                    </button>
                    <p className="text-[#5D6D61] italic font-medium">"{currentQuestion.hint}"</p>
                  </div>
                ) : (
                  <>
                    {currentQuestion?.context && (
                      <p className="text-[#5D6D61] italic font-medium text-lg leading-relaxed max-w-2xl mx-auto">
                        "{currentQuestion.context}"
                      </p>
                    )}
                    {currentQuestion?.root_word && (
                      <div className="bg-[#27AE60]/5 w-fit mx-auto px-6 py-1 rounded-full border border-[#27AE60]/10 mb-2">
                        <span className="type-caption text-[#27AE60] tracking-[0.3em]">Root Word: {currentQuestion.root_word}</span>
                      </div>
                    )}
                    <h2 className="type-h1 text-[#2D3748] leading-tight italic tracking-tighter max-w-5xl mx-auto">
                      "{currentQuestion?.question}"
                    </h2>
                  </>
                )}
              </div>

              <div className="w-full max-w-5xl mx-auto">
                {currentQuestion?.type === 'listening_spelling' ? (
                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      type="text"
                      value={typedAnswer}
                      onChange={(e) => setTypedAnswer(e.target.value)}
                      disabled={isAnswered}
                      onKeyDown={(e) => e.key === 'Enter' && handleTypeSubmit()}
                      placeholder="Type the word you hear..."
                      className="flex-1 bg-green-50 border-2 border-[#27AE60]/20 rounded-[2rem] px-8 py-5 type-h2 text-[#2D3748] outline-none focus:border-[#27AE60]/50 transition-all shadow-inner placeholder:text-slate-400"
                      autoFocus
                    />
                    <button
                      onClick={handleTypeSubmit}
                      disabled={isAnswered || !typedAnswer.trim()}
                      className="bg-[#27AE60] text-white px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest disabled:opacity-30 transition-all shadow-xl hover:bg-[#2ECC71] active:scale-95"
                    >
                      Submit
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentQuestion?.options?.map((opt, i) => {
                      const isCorrect = opt.toLowerCase() === currentQuestion.answer.toLowerCase();
                      const isSelected = selectedOption === opt;

                      let styles = "bg-green-50 border-[#27AE60]/10 text-[#5D6D61] hover:bg-green-100 hover:border-[#27AE60]/30";
                      if (isAnswered) {
                        if (isCorrect) styles = "bg-[#27AE60]/20 border-[#27AE60] text-[#27AE60] shadow-[0_0_30px_rgba(39,174,96,0.2)]";
                        else if (isSelected) styles = "bg-[#FF0000] border-[#FF0000] text-white"; // Red Preserved
                        else styles = "opacity-20 pointer-events-none grayscale";
                      }

                      return (
                        <button
                          key={i}
                          disabled={isAnswered}
                          onClick={() => handleOptionSelect(opt)}
                          className={`p-8 rounded-[3rem] border-4 text-left transition-all flex items-center gap-8 group ${styles}`}
                        >
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center type-h3 border-2 transition-all shrink-0 ${isAnswered && isCorrect ? 'bg-[#27AE60] border-[#2ECC71] text-white' : 'bg-white border-[#27AE60]/10 text-[#27AE60]'}`}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className="type-h2 flex-1 tracking-tight">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {isAnswered && currentQuestion && (
                <div className="animate-slideUp space-y-8 pt-8">
                  <div className="bg-green-50 border border-[#27AE60]/20 p-8 rounded-[3rem] shadow-inner relative group">
                    <div className="flex items-start gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${(typedAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) || (selectedOption?.toLowerCase() === currentQuestion.answer.toLowerCase()) ? 'bg-[#27AE60] text-white' : 'bg-[#FF0000] text-white'}`}>
                        {(typedAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) || (selectedOption?.toLowerCase() === currentQuestion.answer.toLowerCase()) ? <ShieldCheck /> : <AlertCircle />}
                      </div>
                      <div className="space-y-2 flex-1">
                        <p className="type-caption text-[#5D6D61] tracking-[0.3em]">Analysis</p>
                        <p className="type-body-reading text-[#2D3748] italic leading-relaxed">"{currentQuestion.explanation}"</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={nextQuestion}
                    className="w-full bg-[#27AE60] text-white py-6 rounded-[3rem] type-button shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-center gap-4 active:scale-95 border-b-8 border-[#2ECC71]"
                  >
                    <span>{currentQuestionIdx < flatQuestions.length - 1 ? 'PROCEED TO THE NEXT QUESTION' : 'Finalize Challenge'}</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="py-8 text-center border-t border-slate-200">
          <div className="flex justify-center items-center gap-10 opacity-60 text-[#27AE60]">
            <div className="flex items-center gap-2"><Zap size={14} /><span className="type-caption">Low Latency AI</span></div>
            <div className="flex items-center gap-2"><ShieldCheck size={14} /><span className="type-caption">Anti-Hijack Voice Engine</span></div>
            <div className="flex items-center gap-2"><Target size={14} /><span className="type-caption">Academic US Standard</span></div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PracticeTest;
