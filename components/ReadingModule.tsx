
import React, { useState, useMemo } from 'react';
import { ReadingData, ReadingQuestion, ReadingTask } from '../types';
import { BookOpen, CheckCircle2, AlertCircle, ChevronDown, HelpCircle, ArrowLeft, RotateCcw, Construction, Star, ChevronRight } from 'lucide-react';
import useGameSound from '../hooks/useGameSound';
import PerformanceCertificate from './PerformanceCertificate';

interface ReadingModuleProps {
  studentName?: string;
  readingData: ReadingData;
  onComplete: (score: number) => void;
  onReturn: () => void;
  onNextStep?: () => void;
}

const ReadingModule: React.FC<ReadingModuleProps> = ({
  studentName = "Student",
  readingData,
  onComplete,
  onReturn,
  onNextStep
}) => {
  const [openTaskIndex, setOpenTaskIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | boolean>>({});
  const [isAnswered, setIsAnswered] = useState<Record<number, boolean>>({});
  const [showCertificate, setShowCertificate] = useState(false);
  // score state tracks raw correct count for sound effects logic, but display uses weightedScore
  const [rawCorrectCount, setRawCorrectCount] = useState(0);

  const { playCorrect, playWrong, playPop } = useGameSound();

  const hasTasks = readingData.tasks && readingData.tasks.length > 0;

  // Weighted Score Calculation (30-40-30 distribution)
  const weightedScore = useMemo(() => {
    if (!hasTasks) return 0;

    // Configuration: Task 1 (30pts), Task 2 (40pts), Task 3 (30pts)
    const WEIGHTS = [30, 40, 30];
    let totalWeightedScore = 0;
    let totalPotentialWeight = 0;

    readingData.tasks.forEach((task, index) => {
      // Use configured weight, or default to 0 if unexpected extra tasks
      const weight = index < WEIGHTS.length ? WEIGHTS[index] : 0;

      if (task.questions.length > 0 && weight > 0) {
        totalPotentialWeight += weight;
        let correctCount = 0;

        task.questions.forEach(q => {
          const uAns = userAnswers[q.id];
          if (uAns !== undefined) {
            const qAns = q.answer;
            // Loose comparison for strings, exact for boolean
            const isCorrect = typeof qAns === 'boolean'
              ? uAns === qAns
              : String(uAns).trim().toLowerCase() === String(qAns).trim().toLowerCase();

            if (isCorrect) correctCount++;
          }
        });

        // Add proportional score for this task
        totalWeightedScore += (correctCount / task.questions.length) * weight;
      }
    });

    // Normalize to 100 scale if total potential weight is not 100 (e.g. missing tasks)
    if (totalPotentialWeight === 0) return 0;

    // If we have all 3 tasks, totalPotentialWeight is 100, so result is just totalWeightedScore
    return Math.round((totalWeightedScore / totalPotentialWeight) * 100);
  }, [userAnswers, readingData, hasTasks]);

  const handleTFAnswer = (qId: number, answer: boolean, task: ReadingTask) => {
    if (isAnswered[qId]) return;
    const question = task.questions.find(q => q.id === qId);
    const isCorrect = answer === question?.answer;
    setUserAnswers(prev => ({ ...prev, [qId]: answer }));
    setIsAnswered(prev => ({ ...prev, [qId]: true }));
    if (isCorrect) { playCorrect(); setRawCorrectCount(s => s + 1); } else { playWrong(); }
  };

  const handleGapFill = (qId: number, value: string, task: ReadingTask) => {
    if (isAnswered[qId]) return;
    const question = task.questions.find(q => q.id === qId);
    const isCorrect = value.trim().toLowerCase() === (question?.answer as string).toLowerCase();
    setUserAnswers(prev => ({ ...prev, [qId]: value }));
    setIsAnswered(prev => ({ ...prev, [qId]: true }));
    if (isCorrect) { playCorrect(); setRawCorrectCount(s => s + 1); } else { playWrong(); }
  };

  const handleMCAnswer = (qId: number, option: string, task: ReadingTask) => {
    if (isAnswered[qId]) return;
    const question = task.questions.find(q => q.id === qId);
    const isCorrect = option === (question?.answer as string);
    setUserAnswers(prev => ({ ...prev, [qId]: option }));
    setIsAnswered(prev => ({ ...prev, [qId]: true }));
    if (isCorrect) { playCorrect(); setRawCorrectCount(s => s + 1); } else { playWrong(); }
  };

  const finalizeSession = () => {
    setShowCertificate(true);
  };

  const handleRetry = () => {
    setShowCertificate(false);
    setRawCorrectCount(0);
    setOpenTaskIndex(0);
    setUserAnswers({});
    setIsAnswered({});
  };

  if (showCertificate) {
    return (
      <PerformanceCertificate
        studentName={studentName}
        unitTitle={`Reading: ${readingData.title}`}
        type="Reading"
        score={weightedScore}
        feedback={`Reading comprehension assessment complete. Weighted Score: ${weightedScore}/100.`}
        passThreshold={60}
        downloadText="TẢI CHỨNG NHẬN READING"
        exitText="QUAY TRỞ LẠI HUB"
        customScoreDisplay={`Score: ${weightedScore}/100`}
        onSaveAndExit={() => {
          onComplete(weightedScore);
          // Always return to hub as requested by workflow
          onReturn();
        }}
        onRetry={handleRetry}
      // Removed onNextStep to enforce "Back to Hub" workflow
      />
    );
  }

  if (!hasTasks) {
    return (
      <div className="animate-fadeIn space-y-10 pb-20 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-[3rem] border-4 border-[#27AE60]/20 p-12 text-center shadow-2xl w-full backdrop-blur-md">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Construction size={40} />
          </div>
          <h2 className="type-h2 text-[#2D3748] uppercase italic mb-4">module reserved</h2>
          <button onClick={onReturn} className="w-full bg-[#27AE60] text-white py-6 rounded-[2rem] type-button shadow-xl hover:bg-black transition-all flex items-center justify-center space-x-3"><ArrowLeft size={18} /><span>return to hub</span></button>
        </div>
      </div>
    );
  }

  const cardStyle: React.CSSProperties = {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    borderRadius: '20px',
  };

  return (
    <div className="animate-fadeIn w-full flex flex-col gap-8 pb-24">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-4 rounded-2xl" style={cardStyle}>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,211,238,0.12)', color: '#22D3EE' }}>
            <BookOpen size={20} />
          </div>
          <div>
            <p className="type-caption font-black uppercase tracking-[0.4em] mb-0.5" style={{ color: '#475569' }}>{readingData.unit_context}</p>
            <h2 className="type-h2 font-black tracking-tight" style={{ color: '#F8FAFC' }}>{readingData.title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center px-5 py-2 rounded-xl" style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
            <p className="type-caption font-black uppercase tracking-widest mb-0.5" style={{ color: '#22D3EE' }}>Score</p>
            <p className="text-base font-black italic" style={{ background: 'linear-gradient(135deg,#22D3EE,#6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{weightedScore}/100</p>
          </div>
          <button onClick={onReturn} className="p-2.5 rounded-xl transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.06)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#67E8F9'; e.currentTarget.style.background = 'rgba(34,211,238,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
            <ArrowLeft size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-8 w-full">

        {/* Reading Passage Card */}
        <section className="w-full rounded-3xl relative overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(34,211,238,0.15)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
          <div className="absolute top-0 left-0 w-full h-1 z-10" style={{ background: 'linear-gradient(90deg, #22D3EE, #6366F1)' }}></div>
          <div className="p-8 md:p-12 space-y-8">
            <div className="space-y-2 pb-4" style={{ borderBottom: '1px solid rgba(34,211,238,0.1)' }}>
              <p className="type-caption font-black uppercase tracking-[0.4em]" style={{ color: '#22D3EE' }}>Reading Passage</p>
              <h3 className="type-h2 font-black leading-tight italic tracking-tighter" style={{ color: '#F8FAFC' }}>{readingData.reading_text.title}</h3>
            </div>
            <div>
              <p className="text-xl leading-relaxed font-medium text-justify whitespace-pre-wrap"
                style={{ color: '#CBD5E1', lineHeight: '2' }}>
                {readingData.reading_text.content}
              </p>
            </div>
          </div>
        </section>

        {/* Assessment Tasks */}
        <div className="w-full space-y-6">
          <div className="py-3 rounded-2xl text-center" style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.12)' }}>
            <h4 className="type-caption font-black uppercase tracking-[0.6em]" style={{ color: '#22D3EE' }}>Comprehension Check (Total: 100 Pts)</h4>
          </div>

          {readingData.tasks.map((task, idx) => {
            const isOpen = openTaskIndex === idx;
            const isTaskAnswered = task.questions.every(q => isAnswered[q.id]);
            const taskPoints = idx === 0 ? 30 : idx === 1 ? 40 : 30;

            return (
              <div key={task.task_id} className="rounded-2xl overflow-hidden transition-all duration-500"
                style={{
                  background: '#1E293B',
                  border: isOpen ? '1px solid rgba(34,211,238,0.3)' : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: isOpen ? '0 0 20px rgba(34,211,238,0.1)' : '0 10px 30px rgba(0,0,0,0.3)',
                }}>
                <button
                  onClick={() => { setOpenTaskIndex(isOpen ? -1 : idx); playPop(); }}
                  className="w-full px-6 py-5 flex items-center justify-between transition-colors"
                  style={{ background: isOpen ? 'rgba(34,211,238,0.06)' : 'transparent' }}
                  onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent'; }}>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                      style={isTaskAnswered ? { background: 'rgba(34,197,94,0.15)', color: '#4ADE80' } : { background: 'rgba(34,211,238,0.1)', color: '#67E8F9' }}>
                      {isTaskAnswered ? <CheckCircle2 size={16} /> : <span className="font-bold text-xs">{idx + 1}</span>}
                    </div>
                    <div className="text-left">
                      <p className="type-h4 font-black uppercase italic tracking-wide" style={{ color: '#CBD5E1' }}>{task.instruction.split(':')[0]}</p>
                      <p className="type-caption font-bold uppercase tracking-widest" style={{ color: '#475569' }}>{task.questions.length} QUESTIONS • {taskPoints} POINTS</p>
                    </div>
                  </div>
                  <ChevronDown size={16} className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
                    style={{ color: isOpen ? '#22D3EE' : '#475569' }} />
                </button>

                <div className={`transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <div className="px-6 pb-8 pt-4 space-y-4" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>

                    {task.type === 'true_false' && task.questions.map(q => (
                      <div key={q.id} className="space-y-3 p-5 rounded-2xl" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="flex items-start gap-3">
                          <span className="font-black mt-0.5 shrink-0 text-lg" style={{ color: '#22D3EE' }}>{q.id}.</span>
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
                                className="flex-1 py-4 rounded-xl font-bold text-base uppercase tracking-widest border transition-all"
                                style={btnStyle}
                                onMouseEnter={e => { if (!isAnswered[q.id]) e.currentTarget.style.borderColor = 'rgba(34,211,238,0.4)'; }}
                                onMouseLeave={e => { if (!isAnswered[q.id]) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                                {label}
                              </button>
                            );
                          })}
                        </div>
                        {isAnswered[q.id] && <p className="pl-6 text-sm font-medium italic mt-2 animate-fadeIn" style={{ color: '#475569' }}>Note: {q.explanation}</p>}
                      </div>
                    ))}

                    {task.type === 'fill_in_blanks' && task.questions.map(q => (
                      <div key={q.id} className="space-y-3 p-5 rounded-2xl" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p className="text-xl font-medium leading-relaxed" style={{ color: '#CBD5E1' }}>
                          <span className="font-black mr-2 text-lg" style={{ color: '#22D3EE' }}>{q.id}.</span>
                          {q.sentence?.split('_______').map((part, i) => (
                            <React.Fragment key={i}>
                              {part}
                              {i === 0 && (
                                <span className="inline-block border-b-2 min-w-[60px] mx-2 text-center font-bold px-1"
                                  style={{ borderColor: '#22D3EE', color: '#67E8F9' }}>
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
                              onFocus={e => e.target.style.borderColor = '#22D3EE'}
                              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                              onKeyDown={e => { if (e.key === 'Enter') handleGapFill(q.id, (e.target as HTMLInputElement).value, task); }} />
                            <button
                              onClick={e => { const inp = (e.currentTarget.previousSibling as HTMLInputElement); handleGapFill(q.id, inp.value, task); }}
                              className="px-5 py-2.5 rounded-xl font-black text-sm uppercase text-white transition-all"
                              style={{ background: 'linear-gradient(135deg, #22D3EE, #6366F1)' }}
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

                    {task.type === 'multiple_choice' && task.questions.map(q => (
                      <div key={q.id} className="space-y-3 p-5 rounded-2xl" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p className="text-xl font-medium leading-relaxed" style={{ color: '#CBD5E1' }}>
                          <span className="font-black mr-2 text-lg" style={{ color: '#22D3EE' }}>{q.id}.</span> {q.question}
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
                                className="p-4 rounded-xl text-left font-bold text-base border transition-all flex items-center gap-3"
                                style={btnStyle}
                                onMouseEnter={e => { if (!isAnswered[q.id]) e.currentTarget.style.borderColor = 'rgba(34,211,238,0.35)'; }}
                                onMouseLeave={e => { if (!isAnswered[q.id]) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0"
                                  style={{ background: 'rgba(34,211,238,0.1)', color: '#67E8F9' }}>
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

                    {isTaskAnswered && idx < readingData.tasks.length - 1 && (
                      <button onClick={() => { setOpenTaskIndex(idx + 1); playPop(); }}
                        className="w-full py-4 mt-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        style={{ background: 'rgba(34,211,238,0.08)', color: '#67E8F9', border: '1px solid rgba(34,211,238,0.2)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,211,238,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,211,238,0.08)'}>
                        NEXT TASK <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-6 text-center pb-8">
            <button
              onClick={finalizeSession}
              disabled={!readingData.tasks.every(t => t.questions.every(q => isAnswered[q.id]))}
              className="px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all"
              style={readingData.tasks.every(t => t.questions.every(q => isAnswered[q.id])) ? {
                background: 'linear-gradient(135deg, #22D3EE, #6366F1)',
                color: 'white',
                boxShadow: '0 8px 25px rgba(34,211,238,0.4)',
              } : {
                background: '#1E293B',
                color: '#334155',
                cursor: 'not-allowed',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
              onMouseEnter={e => { if (readingData.tasks.every(t => t.questions.every(q => isAnswered[q.id]))) { e.currentTarget.style.transform = 'scale(1.02)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
              View Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingModule;
