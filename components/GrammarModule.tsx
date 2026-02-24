import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UnitData, ModuleProgress, GrammarChallengeQuestion } from '../types';
import useGameSound from '../hooks/useGameSound';
import GrammarSecretAdmirer from './GrammarSecretAdmirer';
import GrammarErrorCorrection from './GrammarErrorCorrection';
import {
  UNIT1_ERROR_CORRECTION, UNIT2_ERROR_CORRECTION, UNIT3_ERROR_CORRECTION,
  UNIT4_ERROR_CORRECTION, UNIT5_ERROR_CORRECTION, UNIT6_ERROR_CORRECTION,
  UNIT1_GRAMMAR_CHALLENGE, UNIT2_GRAMMAR_CHALLENGE, UNIT3_GRAMMAR_CHALLENGE,
  UNIT4_GRAMMAR_CHALLENGE, UNIT5_GRAMMAR_CHALLENGE, UNIT6_GRAMMAR_CHALLENGE
} from '../constants';
import { CheckCircle2, AlertCircle, ChevronRight, BookOpen, Construction, Star, ShieldCheck, Activity, Zap, Puzzle, Trophy } from 'lucide-react';
import PerformanceCertificate from './PerformanceCertificate';

interface GrammarModuleProps {
  studentName?: string;
  studentUsername?: string;
  grammarData: UnitData['grammar'];
  progress: Record<string, ModuleProgress>;
  quizId: string;
  unitId: string;
  onComplete: (score: number) => void;
  onGameComplete?: (score: number) => void;
  onReturn: () => void;
  onNextStep?: () => void;
}

const GrammarModule: React.FC<GrammarModuleProps> = ({
  studentName = "Student", studentUsername, grammarData, progress, quizId, unitId,
  onComplete, onGameComplete, onReturn, onNextStep
}) => {
  const [view, setView] = useState<'study' | 'game' | 'error_correction' | 'quiz' | 'certificate'>('study');
  const [subScores, setSubScores] = useState({ story: 0, error: 0, challenge: 0 });
  const [showGameNext, setShowGameNext] = useState(false);
  const [showErrorNext, setShowErrorNext] = useState(false);
  const [questions, setQuestions] = useState<GrammarChallengeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(20);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const { playCorrect, playWrong, playPop } = useGameSound();
  const timerRef = useRef<any>(null);

  const cardStyle: React.CSSProperties = {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    borderRadius: '24px',
  };

  const getTopicsData = () => {
    const topic = grammarData.topic;
    if (topic.includes("Present Tenses") || unitId === 'u1') return {
      main_title: "PRESENT TENSES",
      description: "Present Simple, Continuous & Stative Verbs",
      topics: [
        { key: 'simple', name: 'PRESENT SIMPLE', usage: ['Daily habits & routines', 'General truths & facts', 'Timetables'], formula: ['(+) S + V(s/es)', '(-) S + don\'t/doesn\'t + V', '(?) Do/Does + S + V?'], signals: ['Every day', 'Usually', 'Always', 'Often', 'Never'] },
        { key: 'continuous', name: 'PRESENT CONTINUOUS', usage: ['Action happening now', 'Temporary situations', 'Future arrangements'], formula: ['(+) S + am/is/are + V-ing', '(-) S + am/is/are not + V-ing', '(?) Am/Is/Are + S + V-ing?'], signals: ['Now', 'At the moment', 'Look!', 'Listen!'] },
        { key: 'stative', name: 'STATIVE VERBS', usage: ['Mental states & feelings', 'Possession', 'Senses'], formula: ['Note: Rarely used in -ing', 'Ex: I know (not I\'m knowing)'], signals: ['Know', 'Like', 'Believe', 'Understand', 'Want'] },
      ]
    };
    if (topic.includes("Past Tenses") || unitId === 'u2') return {
      main_title: "PAST CHRONICLES",
      description: "Past Simple, Continuous & Cleft Sentences",
      topics: [
        { key: 'ps', name: 'PAST SIMPLE', usage: ['Finished actions in the past', 'Historical facts'], formula: ['(+) S + V2/V-ed', '(-) S + didn\'t + V', '(?) Did + S + V?'], signals: ['Yesterday', 'Last week', 'Ago', 'In 2020'] },
        { key: 'pc', name: 'PAST CONTINUOUS', usage: ['Action at a specific past time', 'Interrupted actions'], formula: ['(+) S + was/were + V-ing', '(-) S + wasn\'t/weren\'t + V-ing'], signals: ['At 9PM last night', 'While', 'When'] },
        { key: 'cleft', name: 'CLEFT SENTENCES', usage: ['Emphasizing a specific element'], formula: ['It is/was + emphasis + that/who/which'], signals: ['It was... that', 'It is... who'] },
      ]
    };
    if (topic.includes("Present Perfect") || unitId === 'u3') return {
      main_title: "THE BRIDGE OF TIME",
      description: "Present Perfect & Signal Words",
      topics: [
        { key: 'pp', name: 'PRESENT PERFECT', usage: ['Actions with present relevance', 'Life experiences', 'Unfinished actions'], formula: ['(+) S + have/has + V3/ed', '(-) S + haven\'t/hasn\'t + V3/ed', '(?) Have/Has + S + V3/ed?'], signals: ['just', 'already', 'yet', 'ever', 'never', 'since', 'for'] },
        { key: 'fs', name: 'FOR vs. SINCE', usage: ['FOR: period of time', 'SINCE: point in time'], formula: ['For + 2 years / a long time', 'Since + 2010 / last week'], signals: ['For 3 years', 'Since 2015', 'For a long time'] },
        { key: 'vs', name: 'vs. PAST SIMPLE', usage: ['Past Simple: specific finished time', 'Present Perfect: no specific time'], formula: ['QK: S + V2/ed', 'HTHT: S + have/has + V3/ed'], signals: ['yesterday, ago (Past Simple)', 'recently, so far (Perf.)'] },
      ]
    };
    return {
      main_title: "GRAMMAR FOUNDATION",
      description: "Core English Grammar Structures",
      topics: [
        { key: 'g1', name: grammarData.topic.toUpperCase(), usage: grammarData.mindMap?.centers?.map(c => c.concept) || ['Core usage'], formula: ['S + V + O'], signals: ['Context', 'Signals'] },
      ]
    };
  };

  const topicsData = useMemo(() => getTopicsData(), [grammarData.topic, unitId]);
  const [activeTopic, setActiveTopic] = useState(topicsData.topics[0].key);
  const activeTopicData = topicsData.topics.find(t => t.key === activeTopic) || topicsData.topics[0];

  useEffect(() => { initQuiz(); setActiveTopic(topicsData.topics[0].key); }, [grammarData, unitId]);

  useEffect(() => {
    if (view === 'quiz' && !isAnswered && !gameOver && questions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimer(prev => { if (prev <= 1) { handleAnswer(-1); return 20; } return prev - 1; });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [currentIndex, isAnswered, gameOver, questions, view]);

  const initQuiz = () => {
    const challengeMap: Record<string, any> = { u1: UNIT1_GRAMMAR_CHALLENGE, u2: UNIT2_GRAMMAR_CHALLENGE, u3: UNIT3_GRAMMAR_CHALLENGE, u4: UNIT4_GRAMMAR_CHALLENGE, u5: UNIT5_GRAMMAR_CHALLENGE, u6: UNIT6_GRAMMAR_CHALLENGE };
    let pool: GrammarChallengeQuestion[] = [];
    if (challengeMap[unitId]) pool = [...challengeMap[unitId].questions];
    else if (grammarData.questions?.length) pool = grammarData.questions.map(q => ({ id: q.id, type: 'multiple_choice' as const, question: q.question, options: q.options, answer: q.options[q.correctIndex], explanation: q.explanation }));
    setQuestions(pool); setCurrentIndex(0); setQuizScore(0); setStreak(0); setTimer(20);
    setSelectedOptionIdx(null); setSelectedPart(null); setIsAnswered(false); setGameOver(false);
  };

  const handleAnswer = (val: string | number) => {
    if (isAnswered || !questions.length) return;
    clearInterval(timerRef.current);
    setIsAnswered(true);
    const cur = questions[currentIndex];
    let correct = false;
    if (cur.type === 'multiple_choice') { setSelectedOptionIdx(val as number); correct = val !== -1 && cur.options![val as number] === cur.answer; }
    else { setSelectedPart(val as string); correct = val === cur.error_part; }
    if (correct) { playCorrect(); setQuizScore(s => s + 1); setStreak(s => s + 1); }
    else { playWrong(); setStreak(0); setIsWrong(true); setTimeout(() => setIsWrong(false), 500); }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) { setCurrentIndex(i => i + 1); setTimer(20); setSelectedOptionIdx(null); setSelectedPart(null); setIsAnswered(false); }
    else { setGameOver(true); const cp = questions.length > 0 ? Math.round((quizScore / questions.length) * 80) : 0; setSubScores(prev => ({ ...prev, challenge: cp })); setView('certificate'); }
  };

  const transPanel = (title: string, sub: string, score: number, onNext: () => void, nextLabel: string) => (
    <div className="min-h-[80vh] flex items-center justify-center animate-fadeIn">
      <div className="p-12 rounded-3xl text-center max-w-lg w-full" style={{ background: 'linear-gradient(135deg, #312E81, #1E3A5F)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <Star size={40} fill="currentColor" style={{ color: '#A5B4FC' }} />
        </div>
        <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2 text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{title}</h2>
        <p className="mb-8" style={{ color: '#94A3B8' }}>{sub} Score: {score}/10</p>
        <button onClick={onNext} className="w-full py-4 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 text-white transition-all duration-200"
          style={{ background: 'linear-gradient(135deg, #6366F1, #3B82F6)', boxShadow: '0 8px 25px rgba(99,102,241,0.4)' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          {nextLabel} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  if (view === 'game') {
    if (showGameNext) return transPanel('SECRET STORY COMPLETE', 'Story', subScores.story, () => { setShowGameNext(false); setView('error_correction'); }, 'NEXT: ERROR STREAM');
    return <GrammarSecretAdmirer currentTopic={grammarData.topic} unitId={unitId} onReturn={() => setView('study')}
      onComplete={s => { const w = Math.round(s * 0.1); setSubScores(prev => ({ ...prev, story: w })); if (onGameComplete) onGameComplete(w); setShowGameNext(true); }} />;
  }

  if (view === 'error_correction') {
    if (showErrorNext) return transPanel('ERROR STREAM CLEARED', 'Error', subScores.error, () => { setShowErrorNext(false); setView('quiz'); initQuiz(); }, 'NEXT: GRAMMAR CHALLENGE');
    const em: Record<string, any> = { u1: UNIT1_ERROR_CORRECTION, u2: UNIT2_ERROR_CORRECTION, u3: UNIT3_ERROR_CORRECTION, u4: UNIT4_ERROR_CORRECTION, u5: UNIT5_ERROR_CORRECTION, u6: UNIT6_ERROR_CORRECTION };
    return <GrammarErrorCorrection data={em[unitId] || UNIT1_ERROR_CORRECTION} onReturn={() => setView('study')}
      onComplete={s => { const w = Math.round(s * 0.1); setSubScores(prev => ({ ...prev, error: w })); setShowErrorNext(true); }} />;
  }

  if (view === 'certificate') {
    const total = subScores.story + subScores.error + subScores.challenge;
    return <PerformanceCertificate studentName={studentName} studentUsername={studentUsername} unitTitle={grammarData.topic}
      type="Grammar" score={total}
      feedback={`Story: ${subScores.story}/10 · Errors: ${subScores.error}/10 · Challenge: ${subScores.challenge}/80`}
      onSaveAndExit={() => { onComplete(total); onReturn(); }} />;
  }

  return (
    <div className="min-h-screen -m-4 md:-m-8 p-4 md:p-8" style={{ background: '#0F172A' }}>
      <div className="max-w-6xl mx-auto space-y-10 pb-32">
        {/* Step dots */}
        <div className="flex justify-center space-x-2 mb-8">
          {['Mind Map', 'Secret Story', 'Error Stream', 'Challenge'].map((_, idx) => {
            const ai = view === 'study' ? 0 : view === 'game' ? 1 : view === 'error_correction' ? 2 : 3;
            return <div key={idx} className="h-1.5 w-12 rounded-full transition-all duration-500" style={{ background: idx <= ai ? '#6366F1' : '#1E293B' }}></div>;
          })}
        </div>

        {view === 'study' && (
          <div className="animate-fadeIn space-y-10">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter" style={{ background: 'linear-gradient(135deg, #6366F1, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Poppins, sans-serif' }}>
                {topicsData.main_title}
              </h2>
              <p className="text-sm font-medium" style={{ color: '#64748B' }}>{topicsData.description}</p>
            </div>

            <div className="flex justify-center flex-wrap gap-3">
              {topicsData.topics.map(t => (
                <button key={t.key} onClick={() => setActiveTopic(t.key)}
                  className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-200"
                  style={activeTopic === t.key ? { background: '#6366F1', color: 'white', border: '1px solid #6366F1', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }
                    : { background: 'rgba(255,255,255,0.03)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,0.15)' }}>
                  {t.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-7 rounded-2xl" style={cardStyle}>
                <h4 className="type-caption font-black uppercase tracking-[0.4em] mb-5 pb-2" style={{ color: '#6366F1', borderBottom: '1px solid rgba(99,102,241,0.15)' }}>USAGE</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)', color: '#A5B4FC' }}><BookOpen size={22} /></div>
                    <h4 className="text-2xl font-black uppercase tracking-tight text-[#A5B4FC]">Usage Rules</h4>
                  </div>
                  <p className="text-xl font-medium leading-relaxed" style={{ color: '#CBD5E1' }}>{activeTopicData.usage[0]}</p>
                </div>

                <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,211,238,0.15)', color: '#22D3EE' }}><Activity size={22} /></div>
                    <h4 className="text-2xl font-black uppercase tracking-tight text-[#22D3EE]">Sentence Formula</h4>
                  </div>
                  <div className="space-y-3">
                    {activeTopicData.formula.map((f, i) => (
                      <div key={i} className="p-5 rounded-xl text-2xl font-black text-center italic tracking-wider" style={{ background: '#0F172A', color: '#F8FAFC', border: '1px solid rgba(255,255,255,0.05)' }}>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)', color: '#FCD34D' }}><Zap size={22} /></div>
                    <h4 className="text-2xl font-black uppercase tracking-tight text-[#FCD34D]">Signal Words</h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {activeTopicData.signals.map((sig, i) => (
                      <span key={i} className="px-5 py-2.5 rounded-xl text-xl font-black" style={{ background: 'rgba(255,255,255,0.05)', color: '#F8FAFC', border: '1px solid rgba(255,255,255,0.08)' }}>{sig}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button onClick={() => setView('game')} className="type-button px-10 py-4 rounded-2xl uppercase flex items-center gap-3 text-white transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #6366F1, #3B82F6)', boxShadow: '0 8px 25px rgba(99,102,241,0.4)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(99,102,241,0.55)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.4)'; }}>
                NEXT: SECRET STORY <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {view === 'quiz' && (
          <div className={`relative p-8 md:p-14 rounded-3xl ${isWrong ? 'animate-shake' : ''}`} style={cardStyle}>
            {!gameOver ? (
              <>
                <div className="flex justify-between items-center mb-10 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <p className="type-caption font-black uppercase tracking-widest mb-1" style={{ color: '#6366F1' }}>Challenge Score</p>
                    <p className="type-h2 font-black italic" style={{ color: '#F8FAFC' }}>{quizScore} / {questions.length}</p>
                  </div>
                  <p className="type-h2 font-black italic" style={{ color: timer < 5 ? '#EF4444' : '#22D3EE' }}>{timer}s</p>
                </div>

                {questions[currentIndex] ? (
                  (() => {
                    const cur = questions[currentIndex];
                    return cur.type === 'multiple_choice' ? (
                      <div className="space-y-10">
                        <h3 className="text-4xl font-black italic text-center mb-10 tracking-tighter" style={{ color: '#F8FAFC', fontFamily: 'Poppins, sans-serif' }}>
                          "{cur.question}"
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {cur.options?.map((opt, i) => {
                            let s: React.CSSProperties = { background: '#243044', border: '2px solid rgba(99,102,241,0.15)', color: '#CBD5E1' };
                            if (isAnswered) {
                              if (opt === cur.answer) s = { background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.4)', color: '#4ADE80', boxShadow: '0 0 20px rgba(34,197,94,0.2)' };
                              else if (i === selectedOptionIdx) s = { background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.4)', color: '#FCA5A5' };
                              else s = { opacity: 0.3, background: '#1E293B', border: '2px solid rgba(255,255,255,0.04)', color: '#334155' };
                            }
                            return <button key={i} disabled={isAnswered} onClick={() => handleAnswer(i)}
                              className="type-body p-5 rounded-2xl font-bold text-left transition-all flex items-center space-x-4" style={s}>
                              <span className="w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0" style={{ background: 'rgba(99,102,241,0.1)', color: '#A5B4FC' }}>{String.fromCharCode(65 + i)}</span>
                              <span className="text-xl">{opt}</span>
                            </button>;
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-10 text-center">
                        <div className="type-body-reading leading-relaxed">
                          {cur.question.split(/(\[[A-D]\])/).map((part, i) => {
                            const m = part.match(/\[([A-D])\]/);
                            if (m) {
                              const letter = m[1]; const isC = letter === cur.error_part; const isSel = selectedPart === letter;
                              let s: React.CSSProperties = { background: 'rgba(99,102,241,0.1)', border: '2px solid rgba(99,102,241,0.2)', color: '#A5B4FC' };
                              if (isAnswered) {
                                if (isC) s = { background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)', color: '#4ADE80' };
                                else if (isSel) s = { background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.4)', color: '#FCA5A5' };
                                else s = { opacity: 0.3 };
                              }
                              return <button key={i} disabled={isAnswered} onClick={() => handleAnswer(letter)} className="inline-flex items-center justify-center w-11 h-11 rounded-xl font-black text-lg transition-all mx-1" style={s}>{letter}</button>;
                            }
                            return <span key={i} style={{ color: '#CBD5E1' }}>{part}</span>;
                          })}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-center py-20"><Construction size={48} className="mx-auto mb-4" style={{ color: '#6366F1' }} /><p style={{ color: '#64748B' }}>Challenge sequence loading...</p></div>
                )}

                {isAnswered && questions[currentIndex] && (
                  <div className="mt-10 space-y-6 animate-fadeIn">
                    <div className="p-7 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={streak > 0 ? { background: 'rgba(34,197,94,0.2)', color: '#4ADE80' } : { background: 'rgba(239,68,68,0.2)', color: '#FCA5A5' }}>
                          {streak > 0 ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        </div>
                        <div>
                          <p className="type-caption font-black uppercase tracking-widest mb-1" style={{ color: '#6366F1' }}>Analysis</p>
                          <p className="type-body italic font-medium leading-relaxed" style={{ color: '#CBD5E1' }}>
                            {questions[currentIndex].type === 'error_identification' && <>Error at <span className="font-black" style={{ color: '#A5B4FC' }}>[{questions[currentIndex].error_part}]</span>. Correction: <span className="font-black" style={{ color: '#4ADE80' }}>{questions[currentIndex].correction}</span>. </>}
                            "{questions[currentIndex].explanation}"
                          </p>
                        </div>
                      </div>
                    </div>
                    <button onClick={nextQuestion} className="type-button w-full py-5 rounded-2xl uppercase text-white transition-all duration-200"
                      style={{ background: 'linear-gradient(135deg, #6366F1, #3B82F6)', boxShadow: '0 8px 25px rgba(99,102,241,0.4)' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                      {currentIndex === questions.length - 1 ? 'REVEAL MASTER SCORE' : 'PROCEED TO NEXT QUESTION →'}
                    </button>
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrammarModule;
