
import React, { useState, useEffect, useMemo } from 'react';
import { PracticeTestData, PracticeTestQuestion, PracticeTestSection, ModuleProgress } from '../types';
import { Target, Timer, ChevronRight, CheckCircle2, AlertCircle, Volume2, Trophy, ArrowLeft, Headphones, Zap, ShieldCheck, Construction, Loader2, RotateCcw } from 'lucide-react';
import useGameSound from '../hooks/useGameSound';
import { speakText } from '../services/geminiService';
import PerformanceCertificate from './PerformanceCertificate';

interface PracticeTestProps {
  studentName?: string;
  studentUsername?: string;
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
        if (prev <= 1) { clearInterval(timer); finishTest(); return 0; }
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
    if (isCorrect) { playCorrect(); setScore(s => s + 1); setStreak(s => s + 1); }
    else { playWrong(); setStreak(0); }
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

  const finishTest = () => setIsFinished(true);

  const calculateFinalScore = () => {
    const secretStoryRaw = unitProgress?.[`${unitPrefix}_grammar_game`]?.score || 0;
    const secretStoryScore = Math.round(secretStoryRaw * 0.1);
    const memoryMatchRaw = unitProgress?.[`${unitPrefix}_vocabulary_memory`]?.score || 0;
    const memoryMatchScore = Math.round(memoryMatchRaw * 0.1);
    const challengeRaw = flatQuestions.length > 0 ? (score / flatQuestions.length) : 0;
    const challengeScore = Math.round(challengeRaw * 80);
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

  const cardStyle: React.CSSProperties = {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
  };

  // ── EMPTY STATE ───────────────────────────────────────────────────────────────
  if (flatQuestions.length === 0) {
    return (
      <div className="min-h-screen -m-4 md:-m-8 p-4 md:p-8 flex flex-col items-center justify-center animate-fadeIn"
        style={{ background: '#0F172A' }}>
        <div className="max-w-2xl w-full rounded-3xl p-12 text-center space-y-8"
          style={cardStyle}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#FBB040' }}>
            <Construction size={48} />
          </div>
          <div className="space-y-3">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter" style={{ color: '#F8FAFC' }}>
              Under Construction
            </h2>
            <p className="text-lg font-medium italic leading-relaxed" style={{ color: '#64748B' }}>
              The academic sequence for {testData.unit_context} is currently being compiled.
            </p>
          </div>
          <button onClick={onReturn}
            className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm text-white transition-all flex items-center justify-center gap-3 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #6366F1, #3B82F6)', boxShadow: '0 8px 25px rgba(99,102,241,0.4)' }}>
            <ArrowLeft size={18} /><span>Return to Hub</span>
          </button>
        </div>
      </div>
    );
  }

  // ── FINISHED SCREEN ───────────────────────────────────────────────────────────
  if (isFinished) {
    const totalScore = calculateFinalScore();
    const isPass = totalScore >= 70;
    const challengeRawPercent = Math.round((score / flatQuestions.length) * 100);

    if (isPass) {
      return (
        <div className="min-h-screen -m-4 md:-m-8 p-4 md:p-8" style={{ background: '#0F172A' }}>
          <PerformanceCertificate
            studentName={studentName}
            studentUsername={studentUsername}
            unitTitle={testData.title}
            type="Challenge"
            score={totalScore}
            feedback={`UNIT MASTERY ACHIEVED. Challenge: ${challengeRawPercent}%. Total Unit Score: ${totalScore}/100.`}
            onSaveAndExit={handleSaveAndExit}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen -m-4 md:-m-8 p-4 md:p-8 flex flex-col items-center justify-center" style={{ background: '#0F172A' }}>
        <div className="max-w-2xl w-full rounded-3xl p-12 text-center space-y-8 animate-fadeIn" style={cardStyle}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto animate-pulse"
            style={{ background: 'rgba(245,158,11,0.15)', border: '2px solid rgba(245,158,11,0.3)', color: '#FBB040' }}>
            <Target size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter" style={{ color: '#F8FAFC' }}>Keep Going!</h2>
            <p className="text-lg font-medium" style={{ color: '#94A3B8' }}>
              Don't give up — keep practicing to improve your score.
            </p>
          </div>
          <div className="rounded-2xl p-6 space-y-3"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <p className="text-base font-medium" style={{ color: '#94A3B8' }}>
              Sorry, <span className="font-bold" style={{ color: '#FCD34D' }}>{studentName}</span> — you need at least{' '}
              <span className="font-black" style={{ color: '#FCA5A5' }}>70 points</span> to receive a certificate.
            </p>
            <div className="flex flex-col items-center gap-1 mt-2">
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#475569' }}>Total Unit Score</span>
              <span className="text-6xl font-black italic" style={{ color: '#F59E0B' }}>{totalScore}/100</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => { setIsFinished(false); setCurrentQuestionIdx(0); setAnswers({}); setIsAnswered(false); setSelectedOption(null); setTypedAnswer(''); setScore(0); setStreak(0); setTimeLeft(testData.time_limit_minutes * 60); }}
              className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm text-white transition-all flex items-center justify-center gap-3 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 8px 25px rgba(245,158,11,0.35)' }}>
              <RotateCcw size={18} /><span>Retry Challenge</span>
            </button>
            <button onClick={onReturn}
              className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#CBD5E1'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94A3B8'; }}>
              <ArrowLeft size={18} /><span>Return to Hub</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressVal = ((currentQuestionIdx + 1) / flatQuestions.length) * 100;
  const isCorrectAnswered = isAnswered && ((typedAnswer.toLowerCase() === currentQuestion?.answer.toLowerCase()) || (selectedOption?.toLowerCase() === currentQuestion?.answer.toLowerCase()));

  // ── QUIZ SCREEN ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen -m-4 md:-m-8 p-4 md:p-8 flex flex-col" style={{ background: '#0F172A' }}>
      <div className="max-w-6xl mx-auto w-full space-y-6 flex-1 flex flex-col">

        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 rounded-2xl" style={cardStyle}>
          <div className="flex items-center gap-4">
            <button onClick={onReturn}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#A5B4FC'; e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}>
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: '#6366F1' }}>{testData.title}</p>
              <p className="text-xs font-medium uppercase tracking-widest" style={{ color: '#475569' }}>{currentSection?.section_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={timeLeft < 300
                ? { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }
                : { background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <Timer size={14} style={{ color: timeLeft < 300 ? '#FCA5A5' : '#A5B4FC' }} className={timeLeft < 300 ? 'animate-pulse' : ''} />
              <span className="font-mono font-black text-sm" style={{ color: timeLeft < 300 ? '#FCA5A5' : '#A5B4FC' }}>{formatTime(timeLeft)}</span>
            </div>
            {/* Score */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <Target size={14} style={{ color: '#6366F1' }} />
              <span className="font-black text-sm italic" style={{ color: '#A5B4FC' }}>{score} XP</span>
            </div>
            {/* Combo */}
            {streak > 2 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl animate-bounce"
                style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#FCD34D' }}>
                <Zap size={14} fill="currentColor" />
                <span className="text-xs font-black">×{streak} COMBO</span>
              </div>
            )}
          </div>
        </header>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between px-1">
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#6366F1' }}>Progress</span>
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#475569' }}>
              {currentQuestionIdx + 1} / {flatQuestions.length}
            </span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressVal}%`, background: 'linear-gradient(90deg, #6366F1, #22D3EE)' }} />
          </div>
        </div>

        {/* Question Card */}
        <main className="flex-1 flex flex-col justify-center py-2">
          <div className="rounded-3xl p-8 md:p-14 relative overflow-hidden min-h-[420px] flex flex-col justify-center"
            style={{ background: '#1E293B', border: '1px solid rgba(99,102,241,0.15)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>

            {/* Background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-10"
              style={{ background: '#6366F1', transform: 'translate(50%, -50%)' }} />
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-10"
              style={{ background: '#22D3EE', transform: 'translate(-50%, 50%)' }} />

            {/* Question type badge */}
            <div className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
              style={{ background: 'rgba(99,102,241,0.1)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,0.2)' }}>
              Q{currentQuestionIdx + 1} · {currentQuestion?.type?.replace(/_/g, ' ')}
            </div>

            <div className="relative z-10 space-y-10">

              {/* Question text */}
              <div className="text-center space-y-5">
                {currentQuestion?.type === 'listening_spelling' ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="p-5 rounded-full" style={{ background: 'rgba(99,102,241,0.12)', color: '#A5B4FC' }}>
                      <Headphones size={40} />
                    </div>
                    <button
                      onClick={() => handleSpeak(currentQuestion.audio_placeholder || '')}
                      disabled={isSpeaking}
                      className="flex items-center gap-3 px-10 py-5 rounded-2xl text-white font-black text-lg uppercase tracking-widest transition-all"
                      style={{ background: 'linear-gradient(135deg, #6366F1, #3B82F6)', boxShadow: '0 8px 25px rgba(99,102,241,0.4)' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                      {isSpeaking ? <Loader2 size={24} className="animate-spin" /> : <Volume2 size={24} />}
                      <span>Listen to Word</span>
                    </button>
                    <p className="text-xl italic font-medium" style={{ color: '#94A3B8' }}>"{currentQuestion.hint}"</p>
                  </div>
                ) : (
                  <>
                    {currentQuestion?.context && (
                      <p className="text-xl italic font-medium leading-relaxed max-w-3xl mx-auto" style={{ color: '#64748B' }}>
                        "{currentQuestion.context}"
                      </p>
                    )}
                    {currentQuestion?.root_word && (
                      <div className="w-fit mx-auto px-5 py-1 rounded-full"
                        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <span className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: '#A5B4FC' }}>
                          Root Word: {currentQuestion.root_word}
                        </span>
                      </div>
                    )}
                    <h2 className="text-3xl md:text-4xl font-black italic tracking-tight leading-tight max-w-5xl mx-auto" style={{ color: '#F8FAFC' }}>
                      "{currentQuestion?.question}"
                    </h2>
                  </>
                )}
              </div>

              {/* Options / Input */}
              <div className="w-full max-w-5xl mx-auto">
                {currentQuestion?.type === 'listening_spelling' ? (
                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      type="text"
                      value={typedAnswer}
                      onChange={e => setTypedAnswer(e.target.value)}
                      disabled={isAnswered}
                      onKeyDown={e => e.key === 'Enter' && handleTypeSubmit()}
                      placeholder="Type the word you hear..."
                      className="flex-1 rounded-2xl px-8 py-5 text-2xl font-bold outline-none transition-all"
                      style={{ background: '#0F172A', border: '2px solid rgba(99,102,241,0.3)', color: '#F8FAFC' }}
                      onFocus={e => e.target.style.borderColor = '#6366F1'}
                      onBlur={e => e.target.style.borderColor = 'rgba(99,102,241,0.3)'}
                      autoFocus
                    />
                    <button
                      onClick={handleTypeSubmit}
                      disabled={isAnswered || !typedAnswer.trim()}
                      className="px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest text-white disabled:opacity-30 transition-all"
                      style={{ background: 'linear-gradient(135deg, #6366F1, #3B82F6)', boxShadow: '0 8px 25px rgba(99,102,241,0.4)' }}>
                      Submit
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion?.options?.map((opt, i) => {
                      const isCorrect = opt.toLowerCase() === currentQuestion.answer.toLowerCase();
                      const isSelected = selectedOption === opt;
                      let btnStyle: React.CSSProperties = {
                        background: 'rgba(255,255,255,0.03)',
                        border: '2px solid rgba(255,255,255,0.07)',
                        color: '#94A3B8',
                      };
                      if (isAnswered) {
                        if (isCorrect) btnStyle = { background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.5)', color: '#4ADE80', boxShadow: '0 0 30px rgba(34,197,94,0.2)' };
                        else if (isSelected) btnStyle = { background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.5)', color: '#FCA5A5' };
                        else btnStyle = { opacity: 0.2, background: '#1E293B', border: '2px solid rgba(255,255,255,0.04)', color: '#334155', pointerEvents: 'none' };
                      }

                      return (
                        <button
                          key={i}
                          disabled={isAnswered}
                          onClick={() => handleOptionSelect(opt)}
                          className="p-6 md:p-8 rounded-3xl text-left transition-all duration-200 flex items-center gap-6 group active:scale-[0.98]"
                          style={btnStyle}
                          onMouseEnter={e => { if (!isAnswered) { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.color = '#CBD5E1'; } }}
                          onMouseLeave={e => { if (!isAnswered) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#94A3B8'; } }}>
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 transition-all"
                            style={isAnswered && isCorrect
                              ? { background: 'rgba(34,197,94,0.2)', color: '#4ADE80', border: '2px solid rgba(34,197,94,0.4)' }
                              : { background: 'rgba(99,102,241,0.1)', color: '#A5B4FC', border: '2px solid rgba(99,102,241,0.2)' }}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className="text-xl md:text-2xl font-bold leading-snug flex-1">{opt}</span>
                          {isAnswered && isCorrect && <CheckCircle2 size={24} style={{ color: '#4ADE80' }} className="shrink-0" />}
                          {isAnswered && isSelected && !isCorrect && <AlertCircle size={24} style={{ color: '#FCA5A5' }} className="shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Explanation + Next */}
              {isAnswered && currentQuestion && (
                <div className="animate-fadeIn space-y-6 pt-4">
                  <div className="rounded-2xl p-6 flex items-start gap-4"
                    style={isCorrectAnswered
                      ? { background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }
                      : { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={isCorrectAnswered
                        ? { background: 'rgba(34,197,94,0.15)', color: '#4ADE80' }
                        : { background: 'rgba(239,68,68,0.15)', color: '#FCA5A5' }}>
                      {isCorrectAnswered ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-[0.3em] mb-1"
                        style={{ color: isCorrectAnswered ? '#4ADE80' : '#FCA5A5' }}>
                        {isCorrectAnswered ? 'Correct!' : 'Incorrect'}
                      </p>
                      <p className="text-lg font-medium italic leading-relaxed" style={{ color: '#CBD5E1' }}>
                        "{currentQuestion.explanation}"
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={nextQuestion}
                    className="w-full py-6 rounded-2xl font-black uppercase text-sm tracking-widest text-white transition-all flex items-center justify-center gap-4 active:scale-[0.99]"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #3B82F6)', boxShadow: '0 10px 30px rgba(99,102,241,0.5)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.01)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(99,102,241,0.65)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(99,102,241,0.5)'; }}>
                    <span>{currentQuestionIdx < flatQuestions.length - 1 ? 'Next Question' : 'Finalize Challenge'}</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center">
          <div className="flex justify-center items-center gap-8" style={{ color: '#334155' }}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <Zap size={12} /><span>Low Latency AI</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={12} /><span>Anti-Hijack Voice</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <Target size={12} /><span>US Academic Standard</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PracticeTest;
