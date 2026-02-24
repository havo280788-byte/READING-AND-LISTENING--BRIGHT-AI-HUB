
import React, { useState, useEffect, useRef } from 'react';
import { ListeningData, ReadingTask } from '../types';
import {
  Headphones, Play, Pause, RotateCcw, CheckCircle2, AlertCircle,
  ChevronDown, ArrowLeft, Construction, ShieldCheck, Loader2,
  Eye, EyeOff, FileText, ChevronRight
} from 'lucide-react';
import useGameSound from '../hooks/useGameSound';
import { generateAudioUrl, fetchExternalAudioUrl, unlockAudio, speakText, stopAllSpeech } from '../services/geminiService';
import PerformanceCertificate from './PerformanceCertificate';

interface ListeningModuleProps {
  studentName?: string;
  studentUsername?: string;
  listeningData: ListeningData;
  onComplete: (score: number) => void;
  onReturn: () => void;
  onNextStep?: () => void;
}

const ListeningModule: React.FC<ListeningModuleProps> = ({
  studentName = "Student",
  studentUsername,
  listeningData,
  onComplete,
  onReturn,
  onNextStep
}) => {
  const [openTaskIndex, setOpenTaskIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | boolean>>({});
  const [isAnswered, setIsAnswered] = useState<Record<number, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sourceType, setSourceType] = useState<'LOCAL' | 'GEMINI' | 'NATIVE'>('LOCAL');
  const [isLoadingAudio, setIsLoadingAudio] = useState(true);
  const [useNativeTTS, setUseNativeTTS] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { playCorrect, playWrong, playPop } = useGameSound();

  const hasTasks = listeningData.tasks && listeningData.tasks.length > 0;
  const totalQuestions = hasTasks ? listeningData.tasks.reduce((acc, task) => acc + task.questions.length, 0) : 0;

  useEffect(() => {
    let active = true;
    const prepareAudio = async () => {
      setIsLoadingAudio(true);
      const externalLink = await fetchExternalAudioUrl(listeningData.module_id);
      if (externalLink && active) {
        setAudioUrl(externalLink); setSourceType('LOCAL'); setUseNativeTTS(false); setIsLoadingAudio(false); return;
      }
      const aiUrl = await generateAudioUrl(listeningData.transcript.content);
      if (aiUrl && active) {
        setAudioUrl(aiUrl); setSourceType('GEMINI'); setUseNativeTTS(false);
      } else if (active) {
        setAudioUrl(null); setSourceType('NATIVE'); setUseNativeTTS(true);
      }
      setIsLoadingAudio(false);
    };
    prepareAudio();
    return () => { active = false; stopAllSpeech(); if (audioUrl && sourceType === 'GEMINI') URL.revokeObjectURL(audioUrl); };
  }, [listeningData]);

  const togglePlayback = async () => {
    if (isLoadingAudio) return;
    await unlockAudio(); playPop();
    if (useNativeTTS) {
      if (isPlaying) { stopAllSpeech(); setIsPlaying(false); }
      else { setIsPlaying(true); speakText(listeningData.transcript.content).then(() => setIsPlaying(false)); }
      return;
    }
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else try { await audioRef.current.play(); } catch (e) { }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) { setCurrentTime(audioRef.current.currentTime); setDuration(audioRef.current.duration || 0); }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current && !useNativeTTS) { const v = parseFloat(e.target.value); audioRef.current.currentTime = v; setCurrentTime(v); }
  };

  const formatTime = (t: number) => {
    if (isNaN(t)) return "0:00";
    return `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;
  };

  const handleTFAnswer = (qId: number, answer: boolean, task: ReadingTask) => {
    if (isAnswered[qId]) return;
    const q = task.questions.find(q => q.id === qId);
    const correct = answer === q?.answer;
    setUserAnswers(p => ({ ...p, [qId]: answer }));
    setIsAnswered(p => ({ ...p, [qId]: true }));
    if (correct) { playCorrect(); setScore(s => s + 1); } else { playWrong(); }
  };

  const handleGapFill = (qId: number, value: string, task: ReadingTask) => {
    if (isAnswered[qId]) return;
    const q = task.questions.find(q => q.id === qId);
    const correct = value.trim().toLowerCase() === (q?.answer as string).toLowerCase();
    setUserAnswers(p => ({ ...p, [qId]: value }));
    setIsAnswered(p => ({ ...p, [qId]: true }));
    if (correct) { playCorrect(); setScore(s => s + 1); } else { playWrong(); }
  };

  const handleMCAnswer = (qId: number, option: string, task: ReadingTask) => {
    if (isAnswered[qId]) return;
    const q = task.questions.find(q => q.id === qId);
    const correct = option === (q?.answer as string);
    setUserAnswers(p => ({ ...p, [qId]: option }));
    setIsAnswered(p => ({ ...p, [qId]: true }));
    if (correct) { playCorrect(); setScore(s => s + 1); } else { playWrong(); }
  };

  const handleSubmitAnswers = () => {
    setIsSubmitted(true); playPop();
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
  };

  const handleRetry = () => {
    setShowCertificate(false); setScore(0); setOpenTaskIndex(0);
    setUserAnswers({}); setIsAnswered({}); setIsSubmitted(false); setShowTranscript(false);
  };

  if (showCertificate) {
    const finalScore = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    return (
      <PerformanceCertificate
        studentName={studentName} studentUsername={studentUsername}
        unitTitle={`Listening: ${listeningData.title}`} type="Listening"
        score={finalScore} feedback={`Listening comprehension complete. Accuracy: ${finalScore}%.`}
        passThreshold={60}
        onSaveAndExit={() => { onComplete(finalScore); if (finalScore < 60) onReturn(); }}
        onRetry={handleRetry} onNextStep={onNextStep} nextLabel="PROCEED TO READING"
      />
    );
  }

  const cardStyle: React.CSSProperties = {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    borderRadius: '20px',
  };

  const allAnswered = hasTasks && listeningData.tasks.every(t => t.questions.every(q => isAnswered[q.id]));

  return (
    <div className="animate-fadeIn w-full flex flex-col gap-8 pb-24">

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-4 rounded-2xl"
        style={cardStyle}>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.12)', color: '#6366F1' }}>
            <Headphones size={20} />
          </div>
          <div>
            <p className="type-caption font-black uppercase tracking-[0.4em] mb-0.5" style={{ color: '#475569' }}>
              {listeningData.unit_context}
            </p>
            <h2 className="type-h2 font-black tracking-tight" style={{ color: '#F8FAFC' }}>
              {listeningData.title}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center px-5 py-2 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="type-caption font-black uppercase tracking-widest mb-0.5" style={{ color: '#6366F1' }}>Score</p>
            <p className="text-base font-black italic" style={{ background: 'linear-gradient(135deg,#6366F1,#22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
            </p>
          </div>
          <button onClick={onReturn}
            className="p-2.5 rounded-xl transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.06)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#A5B4FC'; e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
            <ArrowLeft size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-8 w-full">

        {/* Audio Player */}
        <div className="rounded-3xl p-8 text-white relative overflow-hidden group w-full"
          style={{ background: 'linear-gradient(135deg, #312E81 0%, #1E40AF 50%, #0E7490 100%)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>

          {/* Background watermark */}
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none rotate-12 transition-transform group-hover:scale-110" style={{ color: '#22D3EE' }}>
            <Headphones size={180} />
          </div>

          {!useNativeTTS && (
            <audio ref={audioRef} src={audioUrl || ''}
              onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)}
              onLoadedMetadata={handleTimeUpdate} preload="auto" className="hidden" />
          )}

          <div className="relative z-10 flex flex-col items-center space-y-8">
            <div className="text-center space-y-2">
              <p className="type-caption font-black text-white/70 uppercase tracking-[0.4em] flex items-center justify-center gap-2">
                <ShieldCheck size={12} />
                {sourceType === 'LOCAL' ? 'Original Recording' : sourceType === 'NATIVE' ? 'System Voice (Fallback)' : 'AI Narrated'}
              </p>
              <h3 className="type-h2 font-black italic tracking-tighter uppercase leading-tight">
                {listeningData.transcript.title}
              </h3>
            </div>

            <div className="flex items-center gap-8">
              <button
                onClick={() => {
                  if (useNativeTTS) { stopAllSpeech(); setIsPlaying(false); }
                  else if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play(); }
                }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
                style={{ background: 'rgba(255,255,255,0.15)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
                <RotateCcw size={20} />
              </button>

              <button
                onClick={togglePlayback}
                disabled={isLoadingAudio}
                className="w-20 h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95"
                style={{
                  background: isPlaying ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
                  color: isPlaying ? '#6366F1' : 'white',
                  boxShadow: isPlaying ? '0 0 30px rgba(255,255,255,0.3)' : '0 10px 30px rgba(0,0,0,0.4)',
                  opacity: isLoadingAudio ? 0.5 : 1,
                  cursor: isLoadingAudio ? 'not-allowed' : 'pointer',
                }}>
                {isLoadingAudio ? <Loader2 size={32} className="animate-spin" />
                  : isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-1" fill="currentColor" />}
              </button>
            </div>

            {!useNativeTTS && (
              <div className="w-full max-w-2xl space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="relative h-2 w-full">
                  <input type="range" min="0" max={duration || 0} step="0.01" value={currentTime} onChange={handleScrub}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="absolute inset-0 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <div className="h-full rounded-full transition-all duration-100"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%`, background: 'linear-gradient(90deg, #A5B4FC, #67E8F9)' }}>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {useNativeTTS && (
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Audio scrubber unavailable in system voice mode
              </p>
            )}
          </div>
        </div>

        {/* Tasks */}
        <div className="w-full space-y-6">
          {/* Section Label */}
          <div className="py-3 rounded-2xl text-center" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.12)' }}>
            <h4 className="type-caption font-black uppercase tracking-[0.6em]" style={{ color: '#6366F1' }}>Listening Tasks</h4>
          </div>

          {hasTasks ? listeningData.tasks.map((task, idx) => {
            const isOpen = openTaskIndex === idx;
            const isTaskAnswered = task.questions.every(q => isAnswered[q.id]);

            return (
              <div key={task.task_id} className="rounded-2xl overflow-hidden transition-all duration-500"
                style={{
                  background: '#1E293B',
                  border: isOpen ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: isOpen ? '0 0 20px rgba(99,102,241,0.1)' : '0 10px 30px rgba(0,0,0,0.3)',
                }}>
                <button
                  onClick={() => { setOpenTaskIndex(isOpen ? -1 : idx); playPop(); }}
                  className="w-full px-6 py-5 flex items-center justify-between transition-colors"
                  style={{ background: isOpen ? 'rgba(99,102,241,0.06)' : 'transparent' }}
                  onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent'; }}>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                      style={isTaskAnswered ? { background: 'rgba(34,197,94,0.15)', color: '#4ADE80' } : { background: 'rgba(99,102,241,0.1)', color: '#A5B4FC' }}>
                      {isTaskAnswered ? <CheckCircle2 size={16} /> : <span className="font-bold text-xs">{idx + 1}</span>}
                    </div>
                    <div className="text-left">
                      <p className="type-h4 font-black uppercase italic tracking-wide" style={{ color: '#CBD5E1' }}>{task.instruction.split(':')[0]}</p>
                      <p className="type-caption font-bold uppercase tracking-widest" style={{ color: '#475569' }}>{task.questions.length} questions</p>
                    </div>
                  </div>
                  <ChevronDown size={16} className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
                    style={{ color: isOpen ? '#6366F1' : '#475569' }} />
                </button>

                <div className={`transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <div className="px-6 pb-8 pt-4 space-y-4" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>

                    {/* TRUE / FALSE */}
                    {task.type === 'true_false' && task.questions.map(q => (
                      <div key={q.id} className="space-y-3 p-5 rounded-2xl" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="flex items-start gap-3">
                          <span className="font-black mt-0.5 shrink-0 text-lg" style={{ color: '#6366F1' }}>{q.id}.</span>
                          <p className="text-xl font-medium leading-relaxed" style={{ color: '#CBD5E1' }}>{q.question}</p>
                        </div>
                        <div className="flex gap-3 pl-6">
                          {['True', 'False'].map((label) => {
                            const val = label === 'True';
                            const isCorrect = q.answer === val;
                            const isSelected = userAnswers[q.id] === val;
                            let btnStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.08)', color: '#94A3B8' };
                            if (isAnswered[q.id]) {
                              if (isSelected && isCorrect) btnStyle = { background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)', color: '#4ADE80', boxShadow: '0 0 15px rgba(34,197,94,0.15)' };
                              else if (isSelected && !isCorrect) btnStyle = { background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.4)', color: '#FCA5A5' };
                              else if (!isSelected && isCorrect) btnStyle = { background: 'rgba(34,197,94,0.06)', border: '2px solid rgba(34,197,94,0.2)', color: '#4ADE80' };
                              else btnStyle = { opacity: 0.25, background: '#1E293B', border: '2px solid rgba(255,255,255,0.04)', color: '#334155' };
                            }
                            return (
                              <button key={label} disabled={!!isAnswered[q.id]} onClick={() => handleTFAnswer(q.id, val, task)}
                                className="flex-1 py-4 rounded-xl font-bold text-lg uppercase tracking-widest border transition-all"
                                style={btnStyle}
                                onMouseEnter={e => { if (!isAnswered[q.id]) e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; }}
                                onMouseLeave={e => { if (!isAnswered[q.id]) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {/* FILL IN BLANKS */}
                    {task.type === 'fill_in_blanks' && task.questions.map(q => (
                      <div key={q.id} className="space-y-3 p-5 rounded-2xl" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p className="text-xl font-medium leading-relaxed" style={{ color: '#CBD5E1' }}>
                          <span className="font-black mr-2" style={{ color: '#6366F1' }}>{q.id}.</span>
                          {q.sentence?.split('_______').map((part, i) => (
                            <React.Fragment key={i}>
                              {part}
                              {i === 0 && (
                                <span className="inline-block border-b-2 min-w-[60px] mx-2 text-center font-bold px-1"
                                  style={{ borderColor: '#6366F1', color: '#A5B4FC' }}>
                                  {isAnswered[q.id] ? (userAnswers[q.id] as string) : '_______'}
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </p>
                        {!isAnswered[q.id] ? (
                          <div className="flex gap-2 pl-6">
                            <input type="text" placeholder={`Hint: ${q.hint}`}
                              className="flex-1 px-4 py-2.5 rounded-xl text-base font-bold outline-none transition-all"
                              style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', color: '#F8FAFC' }}
                              onFocus={e => e.target.style.borderColor = '#6366F1'}
                              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                              onKeyDown={e => { if (e.key === 'Enter') handleGapFill(q.id, (e.target as HTMLInputElement).value, task); }} />
                            <button
                              onClick={e => { const inp = (e.currentTarget.previousSibling as HTMLInputElement); handleGapFill(q.id, inp.value, task); }}
                              className="px-5 py-2.5 rounded-xl font-black text-sm uppercase text-white transition-all"
                              style={{ background: 'linear-gradient(135deg, #6366F1, #3B82F6)' }}
                              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                              OK
                            </button>
                          </div>
                        ) : (
                          <div className="pl-6 animate-fadeIn">
                            <p className="text-sm font-medium italic" style={{ color: userAnswers[q.id]?.toString().toLowerCase() === q.answer.toString().toLowerCase() ? '#4ADE80' : '#FCA5A5' }}>
                              Answer: <strong>{q.answer as string}</strong> · {q.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* MULTIPLE CHOICE */}
                    {task.type === 'multiple_choice' && task.questions.map(q => (
                      <div key={q.id} className="space-y-3 p-5 rounded-2xl" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p className="text-xl font-medium leading-relaxed" style={{ color: '#CBD5E1' }}>
                          <span className="font-black mr-2" style={{ color: '#6366F1' }}>{q.id}.</span> {q.question}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-5">
                          {q.options?.map((opt, i) => {
                            const isCorrect = opt === (q.answer as string);
                            const isSelected = userAnswers[q.id] === opt;
                            let btnStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(255,255,255,0.06)', color: '#94A3B8' };
                            if (isAnswered[q.id]) {
                              if (isSelected && isCorrect) btnStyle = { background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.4)', color: '#4ADE80', boxShadow: '0 0 12px rgba(34,197,94,0.15)' };
                              else if (isSelected && !isCorrect) btnStyle = { background: 'rgba(239,68,68,0.12)', border: '2px solid rgba(239,68,68,0.4)', color: '#FCA5A5' };
                              else if (!isSelected && isCorrect) btnStyle = { background: 'rgba(34,197,94,0.05)', border: '2px solid rgba(34,197,94,0.2)', color: '#4ADE80' };
                              else btnStyle = { opacity: 0.2, background: '#1E293B', border: '2px solid rgba(255,255,255,0.03)', color: '#334155' };
                            }
                            return (
                              <button key={i} disabled={!!isAnswered[q.id]} onClick={() => handleMCAnswer(q.id, opt, task)}
                                className="p-4 rounded-xl text-left font-bold text-lg border transition-all flex items-center gap-3"
                                style={btnStyle}
                                onMouseEnter={e => { if (!isAnswered[q.id]) e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'; }}
                                onMouseLeave={e => { if (!isAnswered[q.id]) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0"
                                  style={{ background: 'rgba(99,102,241,0.1)', color: '#A5B4FC' }}>
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <span className="break-words">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                        {isAnswered[q.id] && (
                          <p className="pl-5 text-sm font-medium italic animate-fadeIn" style={{ color: '#64748B' }}>{q.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-20 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
              <Construction className="mx-auto mb-4" size={32} style={{ color: '#334155' }} />
              <p className="text-xs font-medium italic" style={{ color: '#334155' }}>Assessment sequence awaiting initialization.</p>
            </div>
          )}

          {/* Transcript Toggle */}
          {isSubmitted && (
            <div className="w-full space-y-6 animate-fadeIn pt-4" style={{ borderTop: '1px dashed rgba(255,255,255,0.06)' }}>
              <div className="flex justify-center">
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="type-button px-8 py-3 rounded-2xl uppercase transition-all flex items-center gap-3"
                  style={showTranscript
                    ? { background: 'rgba(99,102,241,0.15)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,0.3)' }
                    : { background: 'rgba(255,255,255,0.03)', color: '#64748B', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => { if (!showTranscript) { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.color = '#A5B4FC'; } }}
                  onMouseLeave={e => { if (!showTranscript) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#64748B'; } }}>
                  {showTranscript ? <><EyeOff size={16} /> Hide Tapescript</> : <><Eye size={16} /> Show Tapescript</>}
                </button>
              </div>

              {showTranscript && (
                <div className="p-8 md:p-10 space-y-6 animate-fadeIn rounded-2xl"
                  style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-3 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <FileText size={18} style={{ color: '#6366F1' }} />
                    <h4 className="text-sm font-black uppercase tracking-[0.3em]" style={{ color: '#6366F1' }}>Official Tapescript</h4>
                  </div>
                  <div className="text-base font-medium italic leading-relaxed text-justify" style={{ color: '#94A3B8' }}>
                    {listeningData.transcript.content.split('\n\n').map((para, idx) => (
                      <p key={idx} className="mb-4">{para}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit / Finish CTA */}
          <div className="pt-6 text-center pb-8">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitAnswers}
                disabled={!allAnswered}
                className="px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all"
                style={allAnswered ? {
                  background: 'linear-gradient(135deg, #6366F1, #3B82F6)',
                  color: 'white',
                  boxShadow: '0 8px 25px rgba(99,102,241,0.4)',
                } : {
                  background: '#1E293B',
                  color: '#334155',
                  cursor: 'not-allowed',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
                onMouseEnter={e => { if (allAnswered) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(99,102,241,0.55)'; } }}
                onMouseLeave={e => { if (allAnswered) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.4)'; } }}>
                Submit Answers
              </button>
            ) : (
              <button
                onClick={() => setShowCertificate(true)}
                className="px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 mx-auto transition-all text-white"
                style={{ background: 'linear-gradient(135deg, #6366F1, #3B82F6)', boxShadow: '0 8px 25px rgba(99,102,241,0.4)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(99,102,241,0.55)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.4)'; }}>
                FINISH LISTENING <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeningModule;
