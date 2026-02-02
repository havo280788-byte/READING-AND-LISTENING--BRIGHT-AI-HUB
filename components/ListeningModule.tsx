
import React, { useState, useEffect, useRef } from 'react';
import { ListeningData, ReadingTask } from '../types';
import { Headphones, Play, Pause, RotateCcw, CheckCircle2, AlertCircle, ChevronDown, ScrollText, ArrowLeft, Construction, Zap, ShieldCheck, Timer as TimerIcon, CloudSync, Star, Loader2, Eye, EyeOff, FileText, ChevronRight } from 'lucide-react';
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
        setAudioUrl(externalLink);
        setSourceType('LOCAL');
        setUseNativeTTS(false);
        setIsLoadingAudio(false);
        return;
      }
      
      const aiUrl = await generateAudioUrl(listeningData.transcript.content);
      if (aiUrl && active) {
        setAudioUrl(aiUrl);
        setSourceType('GEMINI');
        setUseNativeTTS(false);
      } else if (active) {
        // Fallback to Native TTS if AI fails
        setAudioUrl(null);
        setSourceType('NATIVE');
        setUseNativeTTS(true);
      }
      setIsLoadingAudio(false);
    };
    prepareAudio();
    return () => { 
      active = false; 
      stopAllSpeech();
      if (audioUrl && sourceType === 'GEMINI') URL.revokeObjectURL(audioUrl);
    };
  }, [listeningData]);

  const togglePlayback = async () => {
    if (isLoadingAudio) return;
    await unlockAudio();
    playPop();

    if (useNativeTTS) {
       if (isPlaying) {
         stopAllSpeech();
         setIsPlaying(false);
       } else {
         setIsPlaying(true);
         // speakText returns promise when done
         speakText(listeningData.transcript.content).then(() => {
            // Check if still mounted/relevant before updating state if needed
            // For simple logic we just turn off isPlaying
            setIsPlaying(false);
         });
       }
       return;
    }

    if (!audioRef.current) return;
    if (isPlaying) { 
      audioRef.current.pause(); 
    } else { 
      try { await audioRef.current.play(); } catch (e) { }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current && !useNativeTTS) {
      const val = parseFloat(e.target.value);
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTFAnswer = (qId: number, answer: boolean, task: ReadingTask) => {
    if (isAnswered[qId]) return;
    const question = task.questions.find(q => q.id === qId);
    const isCorrect = answer === question?.answer;
    setUserAnswers(prev => ({ ...prev, [qId]: answer }));
    setIsAnswered(prev => ({ ...prev, [qId]: true }));
    if (isCorrect) { playCorrect(); setScore(s => s + 1); } else { playWrong(); }
  };

  const handleGapFill = (qId: number, value: string, task: ReadingTask) => {
    if (isAnswered[qId]) return;
    const question = task.questions.find(q => q.id === qId);
    const isCorrect = value.trim().toLowerCase() === (question?.answer as string).toLowerCase();
    setUserAnswers(prev => ({ ...prev, [qId]: value }));
    setIsAnswered(prev => ({ ...prev, [qId]: true }));
    if (isCorrect) { playCorrect(); setScore(s => s + 1); } else { playWrong(); }
  };

  const handleMCAnswer = (qId: number, option: string, task: ReadingTask) => {
    if (isAnswered[qId]) return;
    const question = task.questions.find(q => q.id === qId);
    const isCorrect = option === (question?.answer as string);
    setUserAnswers(prev => ({ ...prev, [qId]: option }));
    setIsAnswered(prev => ({ ...prev, [qId]: true }));
    if (isCorrect) { playCorrect(); setScore(s => s + 1); } else { playWrong(); }
  };

  const handleSubmitAnswers = () => {
    setIsSubmitted(true);
    playPop();
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const finalizeSession = () => {
    setShowCertificate(true);
  };

  const handleRetry = () => {
    setShowCertificate(false);
    setScore(0);
    setOpenTaskIndex(0);
    setUserAnswers({});
    setIsAnswered({});
    setIsSubmitted(false);
    setShowTranscript(false);
  };

  if (showCertificate) {
    const finalScore = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    return (
      <PerformanceCertificate 
        studentName={studentName}
        unitTitle={`Listening: ${listeningData.title}`}
        type="Listening"
        score={finalScore}
        feedback={`Listening comprehension assessment complete. Accuracy: ${finalScore}%.`}
        passThreshold={60}
        onSaveAndExit={() => {
          onComplete(finalScore);
          // If score is low, just return. If high, certificate handles "Next"
          if (finalScore < 60) onReturn();
        }}
        onRetry={handleRetry}
        onNextStep={onNextStep}
        nextLabel="PROCEED TO READING"
      />
    );
  }

  return (
    <div className="animate-fadeIn w-full flex flex-col gap-8 pb-24">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white backdrop-blur-md px-6 py-4 rounded-[2rem] border border-green-100 shadow-xl">
        <div className="flex items-center space-x-5">
           <div className="w-10 h-10 rounded-xl bg-[#27AE60]/10 flex items-center justify-center text-[#27AE60]"><Headphones size={20} /></div>
           <div><p className="text-[9px] font-black text-[#5D6D61] uppercase tracking-[0.4em] mb-0.5">{listeningData.unit_context}</p><h2 className="text-lg font-black text-[#2D3748] tracking-tight">{listeningData.title}</h2></div>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-center px-5 py-1.5 bg-green-50 rounded-xl border border-[#27AE60]/20 shadow-sm"><p className="text-[8px] font-black text-[#5D6D61] uppercase tracking-widest">Score</p><p className="text-base font-black text-[#27AE60] italic">{totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%</p></div>
           <button onClick={onReturn} className="p-2.5 rounded-xl bg-green-50 border border-[#27AE60]/20 text-[#5D6D61] hover:text-[#27AE60] transition-colors shadow-sm"><ArrowLeft size={18} /></button>
        </div>
      </header>

      {/* Main Content: Vertical Layout */}
      <div className="flex flex-col gap-8 w-full">
        {/* Audio Player Card - Full Width */}
        <div className="bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group w-full">
           <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none rotate-12 transition-transform group-hover:scale-110"><CloudSync size={180} /></div>
           {!useNativeTTS && (
             <audio 
               ref={audioRef} 
               src={audioUrl || ''} 
               onPlay={() => setIsPlaying(true)} 
               onPause={() => setIsPlaying(false)} 
               onTimeUpdate={handleTimeUpdate} 
               onEnded={() => setIsPlaying(false)} 
               onLoadedMetadata={handleTimeUpdate} 
               preload="auto" 
               className="hidden" 
             />
           )}
           <div className="relative z-10 flex flex-col items-center space-y-8">
              <div className="text-center space-y-2">
                <p className="text-[10px] font-black text-white/80 uppercase tracking-[0.4em] flex items-center justify-center gap-2">
                  <ShieldCheck size={12} /> {sourceType === 'LOCAL' ? 'Original' : sourceType === 'NATIVE' ? 'System Voice (Fallback)' : 'AI Narrated'}
                </p>
                <h3 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase leading-tight">{listeningData.transcript.title}</h3>
              </div>
              
              <div className="flex items-center gap-8">
                 <button 
                  onClick={() => { 
                    if (useNativeTTS) {
                      stopAllSpeech();
                      setIsPlaying(false);
                    } else if(audioRef.current) { 
                      audioRef.current.currentTime = 0; 
                      audioRef.current.play(); 
                    } 
                  }} 
                  className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
                 >
                   <RotateCcw size={20} />
                 </button>
                 
                 <button 
                  onClick={togglePlayback} 
                  disabled={isLoadingAudio}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-2xl ${isPlaying ? 'bg-white text-[#27AE60]' : 'bg-white/20 text-white backdrop-blur-sm'} ${isLoadingAudio ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                   {isLoadingAudio ? (
                     <Loader2 size={32} className="animate-spin" />
                   ) : (
                     isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-1" fill="currentColor" />
                   )}
                 </button>
              </div>
              
              {!useNativeTTS && (
                <div className="w-full max-w-2xl space-y-2">
                   <div className="flex justify-between items-center text-[10px] font-black font-mono text-white/60"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
                   <div className="relative h-2 w-full group">
                      <input type="range" min="0" max={duration || 0} step="0.01" value={currentTime} onChange={handleScrub} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="absolute inset-0 bg-white/20 h-2 rounded-full overflow-hidden p-0.5 border border-white/10"><div className="h-full bg-white rounded-full transition-all duration-100" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}></div></div>
                   </div>
                </div>
              )}
              {useNativeTTS && (
                <div className="w-full max-w-2xl text-center">
                   <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Audio Scrubber Unavailable in System Voice Mode</p>
                </div>
              )}
           </div>
        </div>

        {/* Listening Tasks */}
        <div className="w-full space-y-6">
          <div className="bg-white backdrop-blur-md py-3 rounded-2xl text-center border border-green-100 shadow-sm">
             <h4 className="text-[10px] font-black text-[#27AE60] uppercase tracking-[0.6em]">Listening Tasks</h4>
          </div>

          {hasTasks ? listeningData.tasks.map((task, idx) => {
            const isOpen = openTaskIndex === idx;
            const isTaskAnswered = task.questions.every(q => isAnswered[q.id]);
            
            return (
              <div key={task.task_id} className={`bg-white backdrop-blur-md rounded-[2rem] border-2 shadow-lg overflow-hidden transition-all duration-500 ${isOpen ? 'ring-2 ring-[#27AE60]/20 border-[#27AE60]/40' : 'border-green-50 opacity-95'}`}>
                 <button 
                  onClick={() => { setOpenTaskIndex(isOpen ? -1 : idx); playPop(); }}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                 >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isTaskAnswered ? 'bg-[#27AE60] text-white shadow-lg' : 'bg-[#27AE60]/10 text-[#27AE60]'}`}>
                        {isTaskAnswered ? <CheckCircle2 size={16} /> : <span className="font-bold text-xs">{idx + 1}</span>}
                      </div>
                      <div className="text-left">
                         <p className="text-sm font-black text-[#2D3748] uppercase italic tracking-wide">{task.instruction.split(':')[0]}</p>
                         <p className="text-[8px] font-bold text-[#5D6D61] uppercase tracking-widest">{task.questions.length} questions</p>
                      </div>
                    </div>
                    <ChevronDown size={16} className={`text-[#5D6D61] transition-transform duration-500 ${isOpen ? 'rotate-180 text-[#27AE60]' : ''}`} />
                 </button>

                 <div className={`transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                    <div className="px-6 pb-8 pt-2 bg-green-50 border-t border-[#27AE60]/10 space-y-6">
                       {/* Task content mapping (True/False, Fill blanks, Multiple Choice) */}
                       {task.type === 'true_false' && task.questions.map(q => (
                          <div key={q.id} className="space-y-2 p-4 bg-white rounded-2xl border border-[#27AE60]/10 shadow-sm">
                             <div className="flex items-start gap-2">
                               <span className="text-xl font-black text-[#27AE60] mt-0.5">{q.id}.</span>
                               <p className="text-xl font-medium text-[#2D3748] leading-relaxed">{q.question}</p>
                             </div>
                             <div className="flex gap-2 pl-5 pt-2">
                                {['True', 'False'].map((label) => {
                                  const val = label === 'True';
                                  const isCorrect = q.answer === val;
                                  const isSelected = userAnswers[q.id] === val;
                                  let btnClass = "bg-slate-50 border-[#27AE60]/20 text-[#5D6D61] hover:border-[#27AE60]";
                                  if (isAnswered[q.id]) {
                                    if (isSelected) btnClass = isCorrect ? "bg-[#27AE60] border-[#27AE60] text-white" : "bg-[#FF0000] border-[#FF0000] text-white";
                                    else if (isCorrect) btnClass = "bg-emerald-50 border-emerald-200 text-emerald-600";
                                    else btnClass = "opacity-30 grayscale";
                                  }
                                  return (<button key={label} disabled={isAnswered[q.id]} onClick={() => handleTFAnswer(q.id, val, task)} className={`flex-1 py-4 rounded-lg font-bold text-lg uppercase tracking-widest border transition-all ${btnClass}`}>{label}</button>);
                                })}
                             </div>
                          </div>
                       ))}
                       {task.type === 'fill_in_blanks' && task.questions.map(q => (
                          <div key={q.id} className="space-y-3 p-4 bg-white rounded-2xl border border-[#27AE60]/10 shadow-sm">
                             <p className="text-xl font-medium text-[#2D3748] leading-relaxed">
                               <span className="text-[#27AE60] font-black mr-2">{q.id}.</span>
                               {q.sentence?.split('_______').map((part, i) => (
                                 <React.Fragment key={i}>{part}{i === 0 && (<span className="inline-block border-b-4 border-[#27AE60] min-w-[60px] mx-2 text-center text-[#27AE60] font-bold px-1 text-xl">{isAnswered[q.id] ? (userAnswers[q.id] as string) : '_______'}</span>)}</React.Fragment>
                               ))}
                             </p>
                             {!isAnswered[q.id] ? (
                               <div className="flex gap-2 pl-6">
                                  <input type="text" placeholder={`Hint: ${q.hint}`} className="bg-slate-50 border border-[#27AE60]/20 rounded-lg px-3 py-2 text-lg font-bold text-[#2D3748] outline-none focus:border-[#27AE60] w-full" onKeyDown={(e) => { if (e.key === 'Enter') handleGapFill(q.id, (e.target as HTMLInputElement).value, task); }} />
                                  <button onClick={(e) => { const input = (e.currentTarget.previousSibling as HTMLInputElement); handleGapFill(q.id, input.value, task); }} className="bg-[#27AE60] text-white px-4 py-2 rounded-lg font-black text-sm uppercase hover:bg-[#2ECC71] transition-all shadow-md">OK</button>
                               </div>
                             ) : (
                               <div className="pl-6 animate-fadeIn"><p className="text-sm font-medium italic text-[#5D6D61]"><span className={userAnswers[q.id]?.toString().toLowerCase() === q.answer.toString().toLowerCase() ? 'text-[#27AE60]' : 'text-[#FF0000]'}>Answer: {q.answer as string}</span> • {q.explanation}</p></div>
                             )}
                          </div>
                       ))}
                       {task.type === 'multiple_choice' && task.questions.map(q => (
                          <div key={q.id} className="space-y-3 p-4 bg-white rounded-2xl border border-[#27AE60]/10 shadow-sm">
                             <p className="text-xl font-medium text-[#2D3748] leading-relaxed"><span className="text-[#27AE60] font-black mr-2">{q.id}.</span> {q.question}</p>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-5">
                                {q.options?.map((opt, i) => {
                                  const isCorrect = opt === (q.answer as string);
                                  const isSelected = userAnswers[q.id] === opt;
                                  let btnClass = "bg-slate-50 border-[#27AE60]/20 text-[#2D3748] hover:border-[#27AE60]";
                                  if (isAnswered[q.id]) {
                                    if (isSelected) btnClass = isCorrect ? "bg-[#27AE60] border-[#27AE60] text-white" : "bg-[#FF0000] border-[#FF0000] text-white";
                                    else if (isCorrect) btnClass = "bg-emerald-50 border-emerald-200 text-emerald-600";
                                    else btnClass = "opacity-30 grayscale";
                                  }
                                  return (
                                    <button 
                                      key={i} 
                                      disabled={isAnswered[q.id]} 
                                      onClick={() => handleMCAnswer(q.id, opt, task)} 
                                      className={`p-4 rounded-lg text-left font-bold text-lg border transition-all flex items-center gap-3 ${btnClass}`}
                                    >
                                      <span className="w-8 h-8 rounded bg-white/50 flex items-center justify-center text-sm font-black border border-black/5 shrink-0">
                                        {String.fromCharCode(65 + i)}
                                      </span>
                                      <span className="break-words">{opt}</span>
                                    </button>
                                  );
                                })}
                             </div>
                             {isAnswered[q.id] && <p className="pl-5 text-sm font-medium italic text-[#5D6D61] animate-fadeIn mt-1">{q.explanation}</p>}
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
            );
          }) : (
            <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
               <Construction className="mx-auto mb-4 text-slate-600" size={32} />
               <p className="text-slate-400 font-medium italic text-xs">Assessment sequence awaiting initialization.</p>
            </div>
          )}

          {/* Conditional Transcript Section */}
          {isSubmitted && (
            <div className="w-full space-y-6 animate-fadeIn pt-4 border-t border-dashed border-green-200">
               <div className="flex justify-center">
                  <button 
                    onClick={() => setShowTranscript(!showTranscript)}
                    className={`px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest border-2 transition-all flex items-center gap-3 shadow-sm ${showTranscript ? 'bg-green-100 text-[#27AE60] border-[#27AE60]' : 'bg-white text-[#27AE60] border-[#27AE60] hover:bg-green-50'}`}
                  >
                    {showTranscript ? <><EyeOff size={16} /> Hide Tapescript</> : <><Eye size={16} /> Show the Tapescript</>}
                  </button>
               </div>

               {showTranscript && (
                  <div className="bg-white backdrop-blur-md rounded-[2.5rem] border-2 border-green-100 shadow-lg p-8 md:p-10 space-y-6 animate-fadeIn">
                      <div className="border-b border-[#27AE60]/10 pb-4 mb-2 flex items-center gap-3">
                        <FileText size={18} className="text-[#27AE60]" />
                        <h4 className="text-sm font-black text-[#27AE60] uppercase tracking-[0.3em]">Official Tapescript</h4>
                      </div>
                      <div className="prose prose-slate max-w-none text-base text-[#2D3748] font-medium italic leading-relaxed text-justify">
                        {listeningData.transcript.content.split('\n\n').map((para, idx) => (<p key={idx} className="mb-4">{para}</p>))}
                      </div>
                  </div>
               )}
            </div>
          )}

          <div className="pt-6 text-center pb-8">
             {!isSubmitted ? (
               <button 
                onClick={handleSubmitAnswers}
                disabled={!hasTasks || !listeningData.tasks.every(t => t.questions.every(q => isAnswered[q.id]))}
                className={`px-12 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-xl transition-all border-b-[4px] active:border-b-0 active:translate-y-1 ${(!hasTasks || !listeningData.tasks.every(t => t.questions.every(q => isAnswered[q.id]))) ? 'bg-slate-200 text-slate-400 border-slate-300 opacity-50 cursor-not-allowed' : 'bg-[#27AE60] text-white border-[#2ECC71] hover:bg-[#2ECC71] shadow-[#27AE60]/30'}`}
               >
                 Submit Answers
               </button>
             ) : (
               <button 
                onClick={finalizeSession}
                className="px-12 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-xl transition-all border-b-[4px] active:border-b-0 active:translate-y-1 bg-[#27AE60] text-white border-[#1E8449] hover:bg-[#2ECC71] flex items-center justify-center gap-2 mx-auto"
               >
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
