
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UnitData, ModuleProgress, GrammarChallengeQuestion } from '../types';
import useGameSound from '../hooks/useGameSound';
import GrammarSecretAdmirer from './GrammarSecretAdmirer';
import GrammarErrorCorrection from './GrammarErrorCorrection';
import {
  UNIT1_ERROR_CORRECTION,
  UNIT2_ERROR_CORRECTION,
  UNIT3_ERROR_CORRECTION,
  UNIT4_ERROR_CORRECTION,
  UNIT5_ERROR_CORRECTION,
  UNIT6_ERROR_CORRECTION,
  UNIT1_GRAMMAR_CHALLENGE,
  UNIT2_GRAMMAR_CHALLENGE,
  UNIT3_GRAMMAR_CHALLENGE,
  UNIT4_GRAMMAR_CHALLENGE,
  UNIT5_GRAMMAR_CHALLENGE,
  UNIT6_GRAMMAR_CHALLENGE
} from '../constants';
import { CheckCircle2, AlertCircle, ChevronRight, BookOpen, Construction, Star, ShieldCheck } from 'lucide-react';
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
  studentName = "Student",
  studentUsername,
  grammarData,
  progress,
  quizId,
  unitId,
  onComplete,
  onGameComplete,
  onReturn,
  onNextStep
}) => {
  // Flow State
  const [view, setView] = useState<'study' | 'game' | 'error_correction' | 'quiz' | 'certificate'>('study');
  const [subScores, setSubScores] = useState({ story: 0, error: 0, challenge: 0 });

  // Transition States
  const [showGameNext, setShowGameNext] = useState(false);
  const [showErrorNext, setShowErrorNext] = useState(false);

  // Quiz State
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

  const topicsData = useMemo(() => {
    if (unitId === 'u1' || grammarData.topic.includes("Present Tenses")) {
      return {
        main_title: "PRESENT TENSES & STATIVE VERBS",
        description: "Visual guide to Present Simple, Present Continuous, and Stative Verbs.",
        keys: ['simple', 'continuous', 'stative'] as const,
        content: {
          simple: {
            name: "PRESENT SIMPLE",
            usage: ["Daily habits & routines", "General truths & facts", "Timetables"],
            formula: ["(+) S + V(s/es)", "(-) S + don't/doesn't + V", "(?) Do/Does + S + V?"],
            signals: ["Every day", "Usually", "Always", "Often", "Never"]
          },
          continuous: {
            name: "PRESENT CONTINUOUS",
            usage: ["Action happening now", "Temporary situations", "Future arrangements"],
            formula: ["(+) S + am/is/are + V-ing", "(-) S + am/is/are not + V-ing", "(?) Am/Is/Are + S + V-ing?"],
            signals: ["Now", "At the moment", "Look!", "Listen!"]
          },
          stative: {
            name: "STATIVE VERBS",
            usage: ["Mental states & feelings", "Possession", "Senses"],
            formula: ["Note: Rarely used in -ing", "Ex: I know (not I'm knowing)"],
            signals: ["Know", "Like", "Believe", "Understand", "Want"]
          }
        }
      };
    } else if (grammarData.topic.includes("Past Tenses")) {
      return {
        main_title: "PAST CHRONICLES",
        description: "Navigating events across the timeline of history.",
        keys: ['past_simple', 'past_continuous', 'cleft'] as const,
        content: {
          past_simple: {
            name: "PAST SIMPLE",
            usage: ["Finished actions in the past", "Historical facts"],
            formula: ["S", "V2 / V-ed", "O"],
            signals: ["Yesterday", "Last week", "Ago"]
          },
          past_continuous: {
            name: "PAST CONTINUOUS",
            usage: ["Action at a specific time", "Interrupted actions"],
            formula: ["S", "Was / Were", "V-ing"],
            signals: ["At 9PM last night", "While"]
          },
          cleft: {
            name: "CLEFT SENTENCES",
            usage: ["Emphasis"],
            formula: ["It is/was", "Emphasized part", "That / Who"],
            signals: ["It was... that"]
          }
        }
      };
    } else if (grammarData.topic.includes("Present Perfect")) {
      return {
        main_title: "THE BRIDGE OF TIME",
        description: "Connecting past experiences with current consequences.",
        keys: ['present_perfect', 'signals', 'comparison'] as const,
        content: {
          present_perfect: {
            name: "THE PRESENT PERFECT",
            usage: [
              "Hành động bắt đầu trong quá khứ và còn tiếp diễn đến hiện tại.",
              "Hành động vừa mới xảy ra để lại kết quả ở hiện tại.",
              "Nói về kinh nghiệm hoặc trải nghiệm sống."
            ],
            formula: ["(+) S + have/has + V3/ed", "(-) S + haven't/hasn't + V3/ed", "(?) Have/Has + S + V3/ed?"],
            signals: ["just", "already", "yet", "ever", "never", "since", "for"]
          },
          signals: {
            name: "SIGNAL WORDS",
            isGrouped: true,
            groups: [
              {
                id: "sig_for_since",
                label: "FOR vs. SINCE",
                cards: [
                  { title: "USAGE", content: ["• For: Khoảng thời gian (Period)", "• Since: Mốc thời gian (Point)"] },
                  { title: "FORMULA", content: ["For + 2 years / a long time", "Since + 2010 / last week"] },
                  { title: "EXAMPLES", content: ["I have lived here for 10 years.", "She has known him since 2015."] }
                ]
              },
              {
                id: "sig_already_just_yet",
                label: "ALREADY / JUST / YET",
                cards: [
                  { title: "USAGE", content: ["• Already: Đã rồi", "• Just: Vừa mới", "• Yet: Chưa (Phủ định/Nghi vấn)"] },
                  { title: "POSITION", content: ["Have/Has + ALREADY/JUST + V3", "End of sentence (YET)"] },
                  { title: "EXAMPLES", content: ["I have just finished.", "Have you eaten yet?"] }
                ]
              },
              {
                id: "sig_ever_never",
                label: "EVER / NEVER",
                cards: [
                  { title: "USAGE", content: ["• Ever: Đã từng (Câu hỏi)", "• Never: Chưa từng (Phủ định)"] },
                  { title: "POSITION", content: ["Have/Has + EVER/NEVER + V3"] },
                  { title: "EXAMPLES", content: ["Have you ever been to Paris?", "I have never eaten sushi."] }
                ]
              }
            ]
          },
          comparison: {
            name: "VS. PAST SIMPLE",
            usage: [
              "QK Đơn: Hành động CÓ thời gian cụ thể trong quá khứ.",
              "HT Hoàn thành: Hành động KHÔNG có thời gian cụ thể hoặc còn kết quả.",
              "QK Đơn: Đã chấm dứt hoàn toàn.",
              "HT Hoàn thành: Có thể còn tiếp diễn."
            ],
            formula: ["QK: S + V2/ed", "HTHT: S + have/has + V3/ed"],
            signals: ["QK: yesterday, last night, ago", "HTHT: so far, recently, since, for"]
          }
        }
      };
    } else if (grammarData.topic.includes("Paired Conjunctions")) {
      return {
        main_title: "LOGICAL PAIRS",
        description: "Mastering complex sentence structures with paired conjunctions.",
        keys: ['paired_conj', 'subject_verb_agr', 'compound_nouns'] as const,
        content: {
          paired_conj: {
            name: "PAIRED CONJUNCTIONS",
            usage: [
              "Both... and: Cả A và B.",
              "Not only... but also: Không những A mà còn B.",
              "Either... or: Hoặc A hoặc B.",
              "Neither... nor: Không A cũng không B."
            ],
            formula: ["A and B must be same part of speech", "e.g., both adj and adj"],
            signals: ["both", "not only", "either", "neither"]
          },
          subject_verb_agr: {
            name: "SUBJECT-VERB AGREEMENT",
            usage: [
              "Both A and B: Luôn chia số nhiều.",
              "Not only... but also: Chia theo B (chủ ngữ 2).",
              "Either A or B: Chia theo B (chủ ngữ 2).",
              "Neither A nor B: Chia theo B (chủ ngữ 2)."
            ],
            formula: ["S1 and S2 -> V(plural)", "S1 or S2 -> V(follows S2)"],
            signals: ["Agreement Rule"]
          },
          compound_nouns: {
            name: "COMPOUND NOUNS",
            usage: [
              "Được tạo từ 2 hoặc nhiều từ ghép lại.",
              "Dấu nhấn thường ở âm tiết đầu tiên.",
              "Có thể là 1 từ, có gạch nối, hoặc 2 từ rời."
            ],
            formula: ["Noun + Noun", "Noun + Verb", "Adj + Noun"],
            signals: ["Lighthouse", "Tour guide", "Software"]
          }
        }
      };
    } else if (grammarData.topic.includes("Future Forms")) {
      return {
        main_title: "FUTURE FORMS",
        description: "Master predictions, plans, and possibilities with future structures.",
        keys: ['will', 'going_to', 'may_might', 'be_likely'] as const,
        content: {
          will: {
            name: "WILL",
            usage: [
              "Dự đoán dựa trên ý kiến cá nhân (I think, I believe, I'm sure).",
              "Quyết định tại thời điểm nói.",
              "Lời hứa, đề nghị, yêu cầu."
            ],
            formula: ["(+) S + will + V", "(-) S + will not (won't) + V", "(?) Will + S + V?"],
            signals: ["I think", "I believe", "I'm sure", "Probably", "Definitely"]
          },
          going_to: {
            name: "BE GOING TO",
            usage: [
              "Dự đoán dựa trên bằng chứng hiện tại (Look! / Watch out!).",
              "Kế hoạch đã quyết định trước."
            ],
            formula: ["(+) S + am/is/are + going to + V", "(-) S + am/is/are + not + going to + V", "(?) Am/Is/Are + S + going to + V?"],
            signals: ["Look!", "Watch out!", "Already planned", "Evidence"]
          },
          may_might: {
            name: "MAY / MIGHT",
            usage: [
              "Khả năng có thể xảy ra trong tương lai (không chắc chắn 100%).",
              "Note: 'Might' thể hiện khả năng thấp hơn 'May'."
            ],
            formula: ["(+) S + may/might + V", "(-) S + may/might not + V"],
            signals: ["Maybe", "Perhaps", "Possible", "S + is not sure"]
          },
          be_likely: {
            name: "BE LIKELY TO",
            usage: [
              "Khả năng cao sẽ xảy ra (có cơ sở).",
              "Dùng thay cho 'probably will'."
            ],
            formula: ["(+) S + am/is/are + likely + to V", "(-) S + am/is/are + unlikely + to V", "(?) Is + S + likely + to V?"],
            signals: ["Likely", "Unlikely", "Probable"]
          }
        }
      };
    } else if (grammarData.topic.includes("Gerunds")) {
      return {
        main_title: "GERUNDS & QUESTION TAGS",
        description: "Mastering -ing forms and tag questions.",
        keys: ['gerunds', 'perfect_gerund', 'question_tags'] as const,
        content: {
          gerunds: {
            name: "GERUNDS (-ING FORM)",
            usage: [
              "Subject: Volunteering helps poor communities.",
              "Object after verbs: enjoy, avoid, suggest, mind...",
              "After prepositions: succeed in, apologize for...",
              "Fixed phrases: look forward to, can't stand..."
            ],
            formula: ["S + V + V-ing", "She enjoys helping people."],
            signals: ["enjoy", "avoid", "suggest", "mind", "deny"]
          },
          perfect_gerund: {
            name: "PERFECT GERUND",
            usage: [
              "Action happened BEFORE the main verb.",
              "Formula: having + V3/ed",
              "Ex: She denied having taken the money."
            ],
            formula: ["having + V3/ed"],
            signals: ["deny", "admit", "apologize for", "accuse of"]
          },
          question_tags: {
            name: "QUESTION TAGS",
            usage: [
              "(+) Sentence -> (-) Tag: She is nice, isn't she?",
              "(-) Sentence -> (+) Tag: You don't know, do you?",
              "Special: I am -> aren't I?, Let's -> shall we?"
            ],
            formula: ["S + V..., aux + pron?", "Imperative -> will you?"],
            signals: ["isn't it?", "don't you?", "shall we?"]
          }
        }
      };
    } else {
      return {
        main_title: "GRAMMAR FOUNDATION",
        description: "Building a solid base for advanced English proficiency.",
        keys: ['simple', 'continuous', 'stative'] as const,
        content: {
          simple: {
            name: "PRESENT SIMPLE",
            usage: ["Daily habits", "General truths"],
            formula: ["S + V(s/es)", "S + don't/doesn't + V"],
            signals: ["Every day", "Usually"]
          },
          continuous: {
            name: "PRESENT CONTINUOUS",
            usage: ["Happening now"],
            formula: ["S + am/is/are + V-ing"],
            signals: ["Now", "At the moment"]
          },
          stative: {
            name: "STATIVE VERBS",
            usage: ["Mental states", "Feelings"],
            formula: ["No -ing form"],
            signals: ["Know", "Like", "Believe"]
          }
        }
      };
    }
  }, [grammarData.topic, unitId]);

  const [activeTopic, setActiveTopic] = useState<string>(topicsData.keys[0]);
  const [activeGroupIdx, setActiveGroupIdx] = useState(0);

  useEffect(() => {
    initQuiz();
    setActiveTopic(topicsData.keys[0]);
  }, [grammarData, topicsData]);

  // Quiz Timer
  useEffect(() => {
    if (view === 'quiz' && !isAnswered && !gameOver && questions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            handleAnswer(-1);
            return 20;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [currentIndex, isAnswered, gameOver, questions, view]);

  const initQuiz = () => {
    const challengeMap: Record<string, any> = {
      u1: UNIT1_GRAMMAR_CHALLENGE,
      u2: UNIT2_GRAMMAR_CHALLENGE,
      u3: UNIT3_GRAMMAR_CHALLENGE,
      u4: UNIT4_GRAMMAR_CHALLENGE,
      u5: UNIT5_GRAMMAR_CHALLENGE,
      u6: UNIT6_GRAMMAR_CHALLENGE
    };

    let pool: GrammarChallengeQuestion[] = [];

    if (challengeMap[unitId]) {
      pool = [...challengeMap[unitId].questions];
    } else if (grammarData.questions && grammarData.questions.length > 0) {
      pool = grammarData.questions.map(q => ({
        id: q.id,
        type: 'multiple_choice',
        question: q.question,
        options: q.options,
        answer: q.options[q.correctIndex],
        explanation: q.explanation
      }));
    }

    setQuestions(pool);
    setCurrentIndex(0);
    setQuizScore(0);
    setStreak(0);
    setTimer(20);
    setSelectedOptionIdx(null);
    setSelectedPart(null);
    setIsAnswered(false);
    setGameOver(false);
  };

  const handleAnswer = (val: string | number) => {
    if (isAnswered || questions.length === 0) return;
    clearInterval(timerRef.current);
    setIsAnswered(true);

    const current = questions[currentIndex];
    let isCorrect = false;

    if (current.type === 'multiple_choice') {
      setSelectedOptionIdx(val as number);
      if (val === -1) {
        isCorrect = false;
      } else {
        isCorrect = current.options![val as number] === current.answer;
      }
    } else if (current.type === 'error_identification') {
      setSelectedPart(val as string);
      isCorrect = val === current.error_part;
    }

    if (isCorrect) {
      playCorrect();
      setQuizScore(s => s + 1); // Track correct count
      setStreak(s => s + 1);
    } else {
      playWrong();
      setStreak(0);
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimer(20);
      setSelectedOptionIdx(null);
      setSelectedPart(null);
      setIsAnswered(false);
    } else {
      setGameOver(true);
      // Calculate weighted score for Challenge: Max 80 points
      const challengePoints = questions.length > 0 ? Math.round((quizScore / questions.length) * 80) : 0;
      setSubScores(prev => ({ ...prev, challenge: challengePoints }));
      setView('certificate');
    }
  };

  const renderQuestionContent = () => {
    const current = questions[currentIndex];
    if (!current) return (
      <div className="text-center py-20">
        <Construction size={48} className="text-green-500 mx-auto mb-6" />
        <p className="text-slate-500 font-bold italic">Challenge sequence coming soon...</p>
      </div>
    );

    if (current.type === 'multiple_choice') {
      return (
        <div className="space-y-12">
          <h3 className="text-3xl md:text-5xl font-black text-[#27AE60] text-center italic leading-tight mb-12">
            "{current.question}"
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {current.options?.map((opt, i) => {
              let styles = "bg-white border-2 border-green-200 text-slate-700 hover:bg-green-50 hover:border-[#27AE60]";
              if (isAnswered) {
                if (opt === current.answer) styles = "bg-[#27AE60]/20 border-[#27AE60] text-[#27AE60] shadow-[0_0_30px_rgba(39,174,96,0.3)] scale-[1.02]";
                else if (i === selectedOptionIdx) styles = "bg-[#FF0000] border-[#FF0000] text-white opacity-100";
                else styles = "opacity-20 grayscale pointer-events-none";
              }
              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(i)}
                  className={`p-8 rounded-[3rem] font-bold text-left transition-all relative flex items-center space-x-6 border-4 ${styles}`}
                >
                  <span className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-xl font-black border-2 border-green-200 shrink-0 text-[#27AE60]">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 text-3xl tracking-tight">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    } else {
      const parts = current.question.split(/(\[[A-D]\])/);
      const elements = parts.map((part, i) => {
        const match = part.match(/\[([A-D])\]/);
        if (match) {
          const letter = match[1];
          const isCorrect = letter === current.error_part;
          const isSelected = selectedPart === letter;

          let colorClass = "text-[#27AE60] border-[#27AE60]/30 bg-green-50 hover:bg-green-100";
          if (isAnswered) {
            if (isCorrect) colorClass = "bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
            else if (isSelected) colorClass = "bg-[#FF0000] text-white border-[#FF0000]";
            else colorClass = "text-slate-400 border-slate-300 opacity-30 pointer-events-none";
          }

          return (
            <button
              key={i}
              disabled={isAnswered}
              onClick={() => handleAnswer(letter)}
              className={`inline-flex items-center justify-center w-14 h-14 rounded-xl border-2 font-black text-xl transition-all mx-1 ${colorClass}`}
            >
              {letter}
            </button>
          );
        }
        return <span key={i} className="text-2xl md:text-3xl text-slate-700">{part}</span>;
      });

      return (
        <div className="space-y-12 text-center">
          <div className="text-2xl md:text-4xl font-bold text-[#2D3748] leading-relaxed tracking-tight">
            {elements}
          </div>
          {!isAnswered && (
            <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Identify the part with a grammatical error</p>
          )}
        </div>
      );
    }
  };

  // ----- STATE MACHINES -----

  // 1. SECRET STORY (10 Points)
  if (view === 'game') {
    if (showGameNext) {
      return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-8 animate-fadeIn">
          <div className="bg-[#27AE60] text-white p-12 rounded-[3rem] shadow-2xl text-center max-w-lg">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star size={40} className="text-white" fill="currentColor" />
            </div>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">SECRET STORY COMPLETE</h2>
            <p className="text-white/80 font-bold mb-8">Score Recorded: {subScores.story}/10</p>
            <button
              onClick={() => { setShowGameNext(false); setView('error_correction'); }}
              className="w-full bg-white text-[#27AE60] py-5 rounded-[2rem] font-black uppercase text-sm tracking-[0.4em] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 border-b-8 border-[#1E8449]"
            >
              NEXT: ERROR STREAM <ChevronRight size={18} />
            </button>
          </div>
        </div>
      );
    }
    return <GrammarSecretAdmirer
      currentTopic={grammarData.topic}
      onReturn={() => setView('study')}
      onComplete={(s) => {
        // Map 100-scale to 10-scale
        const weighted = Math.round(s * 0.1);
        setSubScores(prev => ({ ...prev, story: weighted }));
        if (onGameComplete) onGameComplete(weighted); // Optional external track
        setShowGameNext(true);
      }}
    />;
  }

  // 2. ERROR STREAM (10 Points)
  if (view === 'error_correction') {
    if (showErrorNext) {
      return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-8 animate-fadeIn">
          <div className="bg-[#27AE60] text-white p-12 rounded-[3rem] shadow-2xl text-center max-w-lg">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">ERROR STREAM CLEARED</h2>
            <p className="text-white/80 font-bold mb-8">Score Recorded: {subScores.error}/10</p>
            <button
              onClick={() => { setShowErrorNext(false); setView('quiz'); initQuiz(); }}
              className="w-full bg-white text-[#27AE60] py-5 rounded-[2rem] font-black uppercase text-sm tracking-[0.4em] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 border-b-8 border-[#1E8449]"
            >
              NEXT: GRAMMAR CHALLENGE <ChevronRight size={18} />
            </button>
          </div>
        </div>
      );
    }
    const errorDataMap: Record<string, any> = {
      u1: UNIT1_ERROR_CORRECTION,
      u2: UNIT2_ERROR_CORRECTION,
      u3: UNIT3_ERROR_CORRECTION,
      u4: UNIT4_ERROR_CORRECTION,
      u5: UNIT5_ERROR_CORRECTION,
      u6: UNIT6_ERROR_CORRECTION
    };
    const errorData = errorDataMap[unitId] || UNIT1_ERROR_CORRECTION;
    return <GrammarErrorCorrection
      data={errorData}
      onReturn={() => setView('study')}
      onComplete={(s) => {
        // s is 0-100 from component
        const weighted = Math.round(s * 0.1);
        setSubScores(prev => ({ ...prev, error: weighted }));
        setShowErrorNext(true);
      }}
    />;
  }

  // 3. FINAL CERTIFICATE (Total Score / 100)
  if (view === 'certificate') {
    const totalScore = subScores.story + subScores.error + subScores.challenge;

    return (
      <PerformanceCertificate
        studentName={studentName}
        studentUsername={studentUsername}
        unitTitle={grammarData.topic}
        type="Grammar"
        score={totalScore}
        feedback={`Grammar Module Complete. Story: ${subScores.story}/10, Errors: ${subScores.error}/10, Challenge: ${subScores.challenge}/80.`}
        onSaveAndExit={() => { onComplete(totalScore); onReturn(); }}
      />
    );
  }

  // 0. MIND MAP & 4. CHALLENGE (Quiz) Views Rendered Below
  const activeTopicInfo = (topicsData.content as any)[activeTopic];

  return (
    <div className="min-h-screen bg-white -m-4 md:-m-8 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-10 pb-32">
        {/* Progress Stepper - Read Only */}
        <div className="flex justify-center space-x-2 mb-8">
          {['Mind Map', 'Secret Story (10pts)', 'Error Stream (10pts)', 'Challenge (80pts)'].map((step, idx) => {
            const activeIdx = view === 'study' ? 0 : view === 'game' ? 1 : view === 'error_correction' ? 2 : 3;
            return (
              <div key={idx} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${idx <= activeIdx ? 'bg-[#27AE60]' : 'bg-slate-200'}`}></div>
            );
          })}
        </div>

        {view === 'study' ? (
          <div className="animate-fadeIn space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-[#27AE60] text-5xl font-black uppercase italic leading-tight drop-shadow-xl tracking-tighter">
                {topicsData.main_title}
              </h2>
              <div className="bg-green-50 border border-green-100 px-8 py-3 rounded-full inline-block">
                <p className="text-[#2ECC71] text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <BookOpen size={14} /> {topicsData.description}
                </p>
              </div>
            </div>

            <div className="flex justify-center flex-wrap gap-4">
              {topicsData.keys.map(t => (
                <button key={t} onClick={() => { setActiveTopic(t); setActiveGroupIdx(0); }} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-2 transition-all ${activeTopic === t ? 'bg-[#27AE60] text-white border-[#27AE60] shadow-lg scale-105' : 'bg-white text-[#27AE60] border-green-100 hover:border-green-200'}`}>
                  {(topicsData.content as any)[t].name}
                </button>
              ))}
            </div>

            {activeTopicInfo.isGrouped ? (
              <div className="space-y-10">
                <div className="flex justify-center space-x-3">
                  {activeTopicInfo.groups.map((group: any, idx: number) => (
                    <button
                      key={group.id}
                      onClick={() => setActiveGroupIdx(idx)}
                      className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeGroupIdx === idx ? 'bg-[#27AE60] text-white' : 'bg-white text-[#27AE60] border border-green-100'}`}
                    >
                      {group.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn" key={activeGroupIdx}>
                  {activeTopicInfo.groups[activeGroupIdx].cards.map((card: any, i: number) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border-2 border-green-100 shadow-xl relative overflow-hidden group hover:border-[#27AE60] transition-colors">
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-50 rounded-full blur-xl group-hover:bg-green-100"></div>
                      <h4 className="text-[#27AE60] font-black text-[10px] uppercase tracking-[0.3em] mb-4 border-b border-green-100 pb-2">{card.title}</h4>
                      <ul className="space-y-3">
                        {card.content.map((item: string, j: number) => (
                          <li key={j} className="text-[#2D3748] text-sm font-medium leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-green-100 shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-green-100 transition-colors"></div>
                  <h4 className="text-[#27AE60] font-black text-[10px] uppercase tracking-[0.4em] mb-6 border-b border-green-100 pb-2">USAGE</h4>
                  <ul className="space-y-4 relative z-10">
                    {activeTopicInfo.usage.map((u: string, i: number) => (
                      <li key={i} className="text-[#2D3748] text-sm leading-relaxed flex items-start">
                        <span className="text-[#27AE60] mr-2 text-lg">•</span>
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-green-100 shadow-lg group">
                  <h4 className="text-[#27AE60] font-black text-[10px] uppercase tracking-[0.4em] mb-6 border-b border-green-100 pb-2">FORMULA</h4>
                  <div className="space-y-3 relative z-10">
                    {activeTopicInfo.formula.map((p: string, i: number) => (
                      <div key={i} className="bg-green-50 p-4 rounded-2xl border border-green-100 text-[#27AE60] text-xs font-bold font-mono shadow-inner group-hover:border-green-200 transition-colors">
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-green-100 shadow-lg group">
                  <h4 className="text-[#27AE60] font-black text-[10px] uppercase tracking-[0.4em] mb-6 border-b border-green-100 pb-2">SIGNALS</h4>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    {activeTopicInfo.signals.map((s: string, i: number) => (
                      <span key={i} className="bg-green-50 px-4 py-2 rounded-xl text-[#27AE60] text-[11px] font-black uppercase tracking-widest border border-green-100 hover:bg-green-100 transition-colors">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center pt-8">
              <button
                onClick={() => setView('game')}
                className="px-12 py-5 bg-[#27AE60] text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:bg-[#2ECC71] transition-all flex items-center gap-3 border-b-[6px] border-[#1E8449] active:translate-y-1 active:border-b-0"
              >
                NEXT: SECRET STORY <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          // This block now only renders for 'quiz' view since game and error have their own if-returns
          view === 'quiz' && (
            <div className={`relative bg-white p-10 md:p-16 rounded-[4rem] border-4 border-green-100 shadow-2xl flex flex-col ${isWrong ? 'animate-shake' : ''}`}>
              {!gameOver ? (
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-12 bg-green-50 p-8 rounded-[3rem]">
                    <div className="text-center">
                      <p className="text-[10px] text-[#2ECC71] font-black uppercase tracking-widest">Challenge Score</p>
                      <p className="text-5xl font-black text-[#27AE60] italic">{quizScore} / {questions.length}</p>
                    </div>
                    <div className={`text-4xl font-black italic ${timer < 5 ? 'text-rose-500' : 'text-[#27AE60]'}`}>
                      {timer}s
                    </div>
                  </div>

                  {renderQuestionContent()}

                  {isAnswered && questions[currentIndex] && (
                    <div className="mt-12 space-y-8 animate-fadeIn">
                      <div className="p-8 bg-green-50 rounded-[2.5rem] text-[#2D3748] border border-green-100 shadow-inner">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${streak > 0 ? 'bg-green-500 text-white' : 'bg-rose-500 text-white'}`}>
                            {streak > 0 ? <CheckCircle2 /> : <AlertCircle />}
                          </div>
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-[#27AE60] uppercase tracking-widest">Analysis</p>
                            <p className="text-lg italic font-medium leading-relaxed">
                              {questions[currentIndex].type === 'error_identification' && (
                                <>Error at part <span className="font-black text-[#27AE60]">[{questions[currentIndex].error_part}]</span>. Correction: <span className="font-black text-[#2ECC71]">{questions[currentIndex].correction}</span>. </>
                              )}
                              "{questions[currentIndex].explanation}"
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={nextQuestion}
                        className="w-full bg-[#27AE60] text-white py-6 rounded-[3rem] font-black uppercase tracking-[0.4em] text-sm shadow-2xl border-b-8 border-[#2ECC71] hover:bg-[#2ECC71] active:border-b-0 active:translate-y-1 transition-all"
                      >
                        {currentIndex === questions.length - 1 ? 'REVEAL MASTER SCORE' : 'PROCEED TO THE NEXT QUESTION ➝'}
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GrammarModule;
