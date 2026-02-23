
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

  return (
    <div className="animate-fadeIn w-full flex flex-col gap-8 pb-24">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white backdrop-blur-md px-6 py-4 rounded-[2rem] border border-green-100 shadow-xl">
        <div className="flex items-center space-x-5">
          <div className="w-10 h-10 rounded-xl bg-[#27AE60]/10 flex items-center justify-center text-[#27AE60]"><BookOpen size={20} /></div>
          <div><p className="type-caption text-[#5D6D61] tracking-[0.4em] mb-0.5">{readingData.unit_context}</p><h2 className="type-h3 text-[#2D3748] tracking-tight">{readingData.title}</h2></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center px-5 py-1.5 bg-green-50 rounded-xl border border-[#27AE60]/20 shadow-sm"><p className="type-caption text-[#5D6D61] tracking-widest">Weighted Score</p><p className="type-h4 text-[#27AE60] italic">{weightedScore}/100</p></div>
          <button onClick={onReturn} className="p-2.5 rounded-xl bg-green-50 border border-[#27AE60]/20 text-[#5D6D61] hover:text-[#27AE60] transition-colors shadow-sm"><ArrowLeft size={18} /></button>
        </div>
      </header>

      {/* Main Content: Vertical Layout */}
      <div className="flex flex-col gap-8 w-full">

        {/* Reading Passage Card */}
        <section className="w-full bg-white backdrop-blur-md rounded-[2.5rem] border-2 border-green-100 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#27AE60] z-10"></div>
          <div className="p-8 md:p-12 space-y-8">
            <div className="space-y-2 border-b border-[#27AE60]/10 pb-4">
              <p className="type-caption text-[#2ECC71] tracking-[0.4em]">Reading Passage</p>
              <h3 className="type-h2 text-[#2D3748] leading-tight italic tracking-tighter">{readingData.reading_text.title}</h3>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="type-body-reading text-[#2D3748] first-letter:text-6xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:text-[#27AE60] whitespace-pre-wrap text-justify">
                {readingData.reading_text.content}
              </p>
            </div>
          </div>
        </section>

        {/* Assessment Tasks */}
        <div className="w-full space-y-6">
          <div className="bg-white backdrop-blur-md py-3 rounded-2xl text-center border border-green-100 shadow-sm">
            <h4 className="type-caption text-[#5D6D61] tracking-[0.6em]">Comprehension Check (Total: 100 Pts)</h4>
          </div>

          {readingData.tasks.map((task, idx) => {
            const isOpen = openTaskIndex === idx;
            const isTaskAnswered = task.questions.every(q => isAnswered[q.id]);
            const taskPoints = idx === 0 ? 30 : idx === 1 ? 40 : 30;

            return (
              <div key={task.task_id} className={`bg-white backdrop-blur-md rounded-[2rem] border-2 shadow-lg overflow-hidden transition-all duration-500 ${isOpen ? 'ring-2 ring-[#27AE60]/10 border-[#27AE60]/30' : 'border-green-50 opacity-95'}`}>
                <button
                  onClick={() => { setOpenTaskIndex(isOpen ? -1 : idx); playPop(); }}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isTaskAnswered ? 'bg-[#27AE60] text-white shadow-lg' : 'bg-[#27AE60]/10 text-[#27AE60]'}`}>
                      {isTaskAnswered ? <CheckCircle2 size={16} /> : <span className="font-bold text-xs">{idx + 1}</span>}
                    </div>
                    <div className="text-left">
                      <p className="type-h4 text-[#2D3748] uppercase italic tracking-wide">{task.instruction.split(':')[0]}</p>
                      <p className="type-caption text-[#5D6D61] tracking-widest">{task.questions.length} QUESTIONS • {taskPoints} POINTS</p>
                    </div>
                  </div>
                  <ChevronDown size={16} className={`text-[#5D6D61] transition-transform duration-500 ${isOpen ? 'rotate-180 text-[#27AE60]' : ''}`} />
                </button>

                <div className={`transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <div className="px-6 pb-8 pt-6 bg-green-50 border-t border-[#27AE60]/10 space-y-8">
                    {/* ... Task Content Preserved (TF, Blanks, MC) ... */}
                    {task.type === 'true_false' && task.questions.map(q => (
                      <div key={q.id} className="space-y-4 p-6 bg-white rounded-3xl border border-[#27AE60]/10 shadow-sm">
                        <div className="flex items-start gap-3">
                          <span className="type-h3 text-[#27AE60] mt-0.5">{q.id}.</span>
                          <p className="type-body-reading text-[#2D3748] leading-relaxed">{q.question}</p>
                        </div>
                        <div className="flex gap-4 pl-8 pt-2">
                          {['True', 'False'].map((label) => {
                            const val = label === 'True';
                            const isCorrect = q.answer === val;
                            const isSelected = userAnswers[q.id] === val;
                            let btnClass = "bg-slate-50 border-[#27AE60]/30 text-[#5D6D61] hover:border-[#27AE60] hover:bg-green-50";
                            if (isAnswered[q.id]) {
                              if (isSelected) btnClass = isCorrect ? "bg-[#27AE60] border-[#27AE60] text-white" : "bg-[#FF0000] border-[#FF0000] text-white";
                              else if (isCorrect) btnClass = "bg-emerald-50 border-emerald-200 text-emerald-600";
                              else btnClass = "opacity-30 grayscale";
                            }
                            return (<button key={label} disabled={isAnswered[q.id]} onClick={() => handleTFAnswer(q.id, val, task)} className={`flex-1 py-4 rounded-2xl type-button border-2 transition-all ${btnClass}`}>{label}</button>);
                          })}
                        </div>
                        {isAnswered[q.id] && <p className="pl-8 type-small italic text-[#5D6D61] animate-fadeIn mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">Note: {q.explanation}</p>}
                      </div>
                    ))}
                    {task.type === 'fill_in_blanks' && task.questions.map(q => (
                      <div key={q.id} className="space-y-4 p-6 bg-white rounded-3xl border border-[#27AE60]/10 shadow-sm">
                        <p className="type-body-reading text-[#2D3748] leading-relaxed">
                          <span className="text-[#27AE60] type-h3 mr-3">{q.id}.</span>
                          {q.sentence?.split('_______').map((part, i) => (
                            <React.Fragment key={i}>{part}{i === 0 && (<span className="inline-block border-b-4 border-[#27AE60] min-w-[100px] mx-2 text-center text-[#27AE60] font-bold px-2 type-h3">{isAnswered[q.id] ? (userAnswers[q.id] as string) : '_______'}</span>)}</React.Fragment>
                          ))}
                        </p>
                        {!isAnswered[q.id] ? (
                          <div className="flex gap-3 pl-8">
                            <input type="text" placeholder={`Hint: ${q.hint}`} className="bg-slate-50 border-2 border-[#27AE60]/30 rounded-2xl px-5 py-3 type-body text-[#2D3748] outline-none focus:border-[#27AE60] w-full shadow-inner" onKeyDown={(e) => { if (e.key === 'Enter') handleGapFill(q.id, (e.target as HTMLInputElement).value, task); }} />
                            <button onClick={(e) => { const input = (e.currentTarget.previousSibling as HTMLInputElement); handleGapFill(q.id, input.value, task); }} className="bg-[#27AE60] text-white px-6 py-3 rounded-2xl type-button transition-all shadow-md active:scale-95">OK</button>
                          </div>
                        ) : (
                          <div className="pl-8 animate-fadeIn mt-2"><p className="type-small italic text-[#5D6D61] bg-slate-50 p-3 rounded-xl border border-slate-100"><span className={`font-bold mr-2 ${userAnswers[q.id]?.toString().toLowerCase() === q.answer.toString().toLowerCase() ? 'text-[#27AE60]' : 'text-[#FF0000]'}`}>Answer: {q.answer as string}</span> • {q.explanation}</p></div>
                        )}
                      </div>
                    ))}
                    {task.type === 'multiple_choice' && task.questions.map(q => (
                      <div key={q.id} className="space-y-5 p-6 bg-white rounded-3xl border border-[#27AE60]/10 shadow-sm">
                        <p className="type-body-reading text-[#2D3748] leading-relaxed"><span className="text-[#27AE60] type-h3 mr-3">{q.id}.</span> {q.question}</p>
                        <div className="grid grid-cols-1 gap-3 pl-8">
                          {q.options?.map((opt, i) => {
                            const isCorrect = opt === (q.answer as string);
                            const isSelected = userAnswers[q.id] === opt;
                            let btnClass = "bg-slate-50 border-[#27AE60]/20 text-[#2D3748] hover:border-[#27AE60] hover:bg-green-50";
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
                                className={`p-4 rounded-xl text-left type-body border-2 transition-all flex items-center gap-4 shadow-sm ${btnClass}`}
                              >
                                <span className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center type-caption border border-black/5 shrink-0">
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <span className="break-words">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                        {isAnswered[q.id] && <p className="pl-8 type-small italic text-[#5D6D61] animate-fadeIn mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">{q.explanation}</p>}
                      </div>
                    ))}

                    {isTaskAnswered && idx < readingData.tasks.length - 1 && (
                      <button onClick={() => { setOpenTaskIndex(idx + 1); playPop(); }} className="w-full py-4 mt-6 rounded-2xl bg-green-50 text-[#27AE60] type-button border border-[#27AE60]/30 hover:bg-green-100 transition-all flex items-center justify-center gap-2">NEXT TASK <ChevronDown size={14} /></button>
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
              className={`px-12 py-5 rounded-[2rem] type-button shadow-xl transition-all border-b-[4px] active:border-b-0 active:translate-y-1 ${readingData.tasks.every(t => t.questions.every(q => isAnswered[q.id])) ? 'bg-[#27AE60] text-white border-[#2ECC71] hover:bg-[#2ECC71]' : 'bg-slate-200 text-slate-400 border-slate-300 opacity-50 cursor-not-allowed'}`}
            >
              XEM KẾT QUẢ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingModule;
