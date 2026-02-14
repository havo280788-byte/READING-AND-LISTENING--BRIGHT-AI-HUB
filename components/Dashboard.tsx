
import React, { useState, useMemo } from 'react';
import { UserStats } from '../types';
import { Book, Puzzle, Mic, PenTool, CheckCircle2, Zap, ChevronRight, BookOpen, Headphones, Shield, Trophy, Crown } from 'lucide-react';

interface DashboardProps {
  stats: UserStats;
  unitTitle: string;
  totalModules: number;
  onNavigate: (view: any) => void;
}

const CURRICULUM: Record<number, { id: number, title: string, subtitle: string, progress: Record<string, number>, status: 'unlocked' | 'locked' }> = {
  1: {
    id: 1,
    title: "Generation Gap",
    subtitle: "Independent Life",
    status: 'unlocked',
    progress: { vocabulary: 0, grammar: 0, reading: 0, listening: 0, challenge: 0 }
  },
  2: {
    id: 2,
    title: "Vietnam and ASEAN",
    subtitle: "Cultural Heritage",
    status: 'unlocked',
    progress: { vocabulary: 0, grammar: 0, reading: 0, listening: 0, challenge: 0 }
  },
  3: {
    id: 3,
    title: "Global Warming",
    subtitle: "Ecological Systems",
    status: 'unlocked',
    progress: { vocabulary: 0, grammar: 0, reading: 0, listening: 0, challenge: 0 }
  },
  4: {
    id: 4,
    title: "World Heritage",
    subtitle: "Culture & Preservation",
    status: 'unlocked',
    progress: { vocabulary: 0, grammar: 0, reading: 0, listening: 0, challenge: 0 }
  },
  5: {
    id: 5,
    title: "Cities & Education",
    subtitle: "Future Life",
    status: 'unlocked',
    progress: { vocabulary: 0, grammar: 0, reading: 0, listening: 0, challenge: 0 }
  },
  6: {
    id: 6,
    title: "Social Issues",
    subtitle: "Community Awareness",
    status: 'unlocked',
    progress: { vocabulary: 0, grammar: 0, reading: 0, listening: 0, challenge: 0 }
  },
  7: {
    id: 7,
    title: "Healthy Lifestyle",
    subtitle: "Well-being",
    status: 'unlocked',
    progress: { vocabulary: 0, grammar: 0, reading: 0, listening: 0, challenge: 0 }
  },
  8: {
    id: 8,
    title: "Health & Life Expectancy",
    subtitle: "Longevity",
    status: 'unlocked',
    progress: { vocabulary: 0, grammar: 0, reading: 0, listening: 0, challenge: 0 }
  }
};

const Dashboard: React.FC<DashboardProps> = ({ stats, unitTitle, totalModules, onNavigate }) => {
  const [activeUnitId, setActiveUnitId] = useState<number>(() => {
    const num = parseInt(stats.selectedUnitId.replace('u', ''));
    return isNaN(num) ? 1 : num;
  });

  const currentUnitData = CURRICULUM[activeUnitId] || CURRICULUM[1];
  const progressPercentage = Math.round((stats.completedModules / totalModules) * 100);
  const isEnrolledUnit = stats.selectedUnitId === `u${activeUnitId}`;

  // Build XP ranking from all students' localStorage data
  const STORAGE_KEY_PREFIX = 'ELITE_ENG_USER_DATA_V8';
  const { rankedStudents, currentUserRank } = useMemo(() => {
    const students: { name: string; username: string; xp: number; completedModules: number }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX + '_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.name && typeof data.xp === 'number') {
            students.push({
              name: data.name,
              username: data.username || key.replace(STORAGE_KEY_PREFIX + '_', ''),
              xp: data.xp,
              completedModules: data.completedModules || 0
            });
          }
        } catch (e) { /* skip invalid entries */ }
      }
    }
    students.sort((a, b) => b.xp - a.xp);
    const ranked = students.map((s, i) => ({ ...s, rank: i + 1 }));
    const myRank = ranked.find(s => s.username === stats.username);
    return { rankedStudents: ranked, currentUserRank: myRank };
  }, [stats.xp, stats.username]);

  const skills = [
    {
      key: 'vocabulary',
      label: 'Vocabulary',
      vietnamese: 'Từ vựng',
      icon: <Book size={18} />,
      watermark: <Book size={140} />,
      bg: 'bg-white',
      accent: 'text-[#27AE60]',
      barDefault: 'bg-[#2ECC71]',
      border: 'border-green-50'
    },
    {
      key: 'grammar',
      label: 'Grammar',
      vietnamese: 'Ngữ pháp',
      icon: <Puzzle size={18} />,
      watermark: <Puzzle size={140} />,
      bg: 'bg-white',
      accent: 'text-[#27AE60]',
      barDefault: 'bg-[#2ECC71]',
      border: 'border-green-50'
    },
    {
      key: 'reading',
      label: 'Reading',
      vietnamese: 'Đọc',
      icon: <BookOpen size={18} />,
      watermark: <BookOpen size={140} />,
      bg: 'bg-white',
      accent: 'text-[#27AE60]',
      barDefault: 'bg-[#2ECC71]',
      border: 'border-green-50'
    },
    {
      key: 'listening',
      label: 'Listening',
      vietnamese: 'Nghe',
      icon: <Headphones size={18} />,
      watermark: <Headphones size={140} />,
      bg: 'bg-white',
      accent: 'text-[#27AE60]',
      barDefault: 'bg-[#2ECC71]',
      border: 'border-green-50'
    },
    {
      key: 'challenge',
      label: 'Challenge',
      vietnamese: 'Thử thách',
      icon: <Shield size={18} />,
      watermark: <Zap size={140} />,
      bg: 'bg-[#FFF9C4]',
      accent: 'text-[#F1C40F]',
      barDefault: 'bg-[#F39C12]',
      border: 'border-[#FFF59D]'
    },
  ];

  const getDynamicColor = (pct: number, defaultClass: string) => {
    if (pct === 0) return 'bg-slate-200';
    if (pct < 30) return 'bg-amber-400';
    if (pct < 70) return 'bg-[#2ECC71]';
    return 'bg-[#27AE60]';
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-24">
      <section className="bg-white backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-green-100 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-[#2D3748] mb-1">Hello, {stats.name}! 👋</h2>
              <p className="text-[#5D6D61] font-medium">Global Course Progress: <span className="text-[#27AE60] font-bold">{progressPercentage}%</span></p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <div className="bg-green-50 px-5 py-3 rounded-2xl border border-[#27AE60]/20">
                <p className="text-[10px] font-black text-[#2ECC71] uppercase tracking-widest mb-1">XP Points</p>
                <p className="text-xl font-black text-[#27AE60] italic">{stats.xp}</p>
              </div>
              <div className="bg-green-50 px-5 py-3 rounded-2xl border border-[#27AE60]/20">
                <p className="text-[10px] font-black text-[#2ECC71] uppercase tracking-widest mb-1">Level</p>
                <p className="text-xl font-black text-[#27AE60] italic">Grade 11</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-[2rem] border border-[#27AE60]/20 shadow-inner">
            <div className="flex justify-between items-end mb-3">
              <div>
                <h4 className="text-sm font-black text-[#2D3748] uppercase tracking-widest mb-1">Curriculum Mastery</h4>
                <p className="text-xs text-[#5D6D61]">Total Modules Completed: <span className="font-bold text-[#27AE60]">{stats.completedModules}</span> / {totalModules}</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-[#2ECC71]">{progressPercentage}%</span>
              </div>
            </div>
            <div className="w-full bg-[#27AE60]/10 h-4 rounded-full overflow-hidden p-1 border border-[#27AE60]/20">
              <div
                className="h-full bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#27AE60]/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
      </section>

      {/* XP Leaderboard */}
      {rankedStudents.length > 0 && (
        <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-green-100 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                  <Trophy size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#2D3748] uppercase tracking-tight">Class Leaderboard</h3>
                  <p className="text-[10px] font-bold text-[#5D6D61] uppercase tracking-widest">{rankedStudents.length} students ranked by XP</p>
                </div>
              </div>
              {currentUserRank && (
                <div className="bg-green-50 px-5 py-2.5 rounded-2xl border border-[#27AE60]/20">
                  <p className="text-[10px] font-black text-[#2ECC71] uppercase tracking-widest">Your Rank</p>
                  <p className="text-xl font-black text-[#27AE60] text-center">#{currentUserRank.rank}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {rankedStudents.slice(0, 10).map((student) => {
                const isMe = student.username === stats.username;
                const rankBg = student.rank === 1 ? 'bg-amber-400 text-amber-950'
                  : student.rank === 2 ? 'bg-slate-300 text-slate-700'
                    : student.rank === 3 ? 'bg-orange-300 text-orange-800'
                      : 'bg-slate-100 text-slate-500';
                const rankEmoji = student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : student.rank === 3 ? '🥉' : '';

                return (
                  <div
                    key={student.username}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all ${isMe
                        ? 'bg-green-50 border-2 border-[#27AE60]/40 shadow-md ring-2 ring-[#27AE60]/10'
                        : 'bg-slate-50/50 border border-slate-100 hover:border-green-200'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${rankBg}`}>
                        {rankEmoji || `#${student.rank}`}
                      </div>
                      <div className="w-9 h-9 rounded-full bg-[#27AE60] text-white flex items-center justify-center font-black text-sm shadow-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isMe ? 'text-[#27AE60]' : 'text-[#2D3748]'}`}>
                          {student.name} {isMe && <span className="text-[10px] font-black text-[#2ECC71] uppercase ml-1">(You)</span>}
                        </p>
                        <p className="text-[10px] text-slate-400">{student.completedModules} modules completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-black ${isMe ? 'text-[#27AE60]' : 'text-[#2D3748]'}`}>{student.xp}</span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">XP</p>
                    </div>
                  </div>
                );
              })}

              {/* Show current user if outside top 10 */}
              {currentUserRank && currentUserRank.rank > 10 && (
                <>
                  <div className="flex items-center justify-center py-2">
                    <span className="text-xs text-slate-300 font-bold">• • •</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-green-50 border-2 border-[#27AE60]/40 shadow-md ring-2 ring-[#27AE60]/10">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs bg-green-100 text-[#27AE60]">
                        #{currentUserRank.rank}
                      </div>
                      <div className="w-9 h-9 rounded-full bg-[#27AE60] text-white flex items-center justify-center font-black text-sm shadow-sm">
                        {currentUserRank.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#27AE60]">
                          {currentUserRank.name} <span className="text-[10px] font-black text-[#2ECC71] uppercase ml-1">(You)</span>
                        </p>
                        <p className="text-[10px] text-slate-400">{currentUserRank.completedModules} modules completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-[#27AE60]">{currentUserRank.xp}</span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">XP</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/5 rounded-full blur-[60px] -mr-24 -mt-24"></div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {Object.values(CURRICULUM).map((unit) => (
            <button
              key={unit.id}
              onClick={() => setActiveUnitId(unit.id)}
              disabled={unit.status === 'locked'}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border shadow-sm whitespace-nowrap flex items-center gap-2
                ${activeUnitId === unit.id
                  ? 'bg-[#27AE60] text-white border-[#27AE60] shadow-lg scale-105'
                  : unit.status === 'locked'
                    ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-60'
                    : 'bg-white text-[#2D3748] border-green-100 hover:bg-green-50'}`}
            >
              {unit.status === 'locked' && <i className="fa-solid fa-lock text-[10px]"></i>}
              Unit {unit.id}: {unit.title}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-black text-[#27AE60] drop-shadow-sm">
            {activeUnitId === 1 ? 'Generation Gap' : activeUnitId === 2 ? 'Vietnam & ASEAN' : activeUnitId === 3 ? 'Global Warming' : activeUnitId === 4 ? 'World Heritage' : activeUnitId === 5 ? 'Future Cities' : activeUnitId === 6 ? 'Social Issues' : activeUnitId === 7 ? 'Healthy Lifestyle' : 'Health & Life'} Mastery
          </h3>
          <span className="text-[10px] font-black text-[#2ECC71] uppercase tracking-widest">Target: Grade 11 Advanced</span>
        </div>

        {isEnrolledUnit && (
          <div
            onClick={() => onNavigate('practice_test')}
            className={`p-8 rounded-[2.5rem] border-4 shadow-2xl mb-8 relative overflow-hidden group cursor-pointer hover:scale-[1.01] transition-all bg-white border-green-100`}
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform text-[#27AE60]">
              <Zap size={120} fill="currentColor" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-[#27AE60]/10 text-[#27AE60] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                  Elite Challenge
                </div>
              </div>
              <h4 className="text-4xl font-black text-[#2D3748] italic tracking-tighter mb-2 uppercase">
                Unit {activeUnitId} Challenge
              </h4>
              <p className="text-[#5D6D61] text-sm font-medium italic max-w-xl">
                {activeUnitId <= 4 ? 'Complete comprehensive questions to prove your mastery.' : 'Advanced module structure ready. Content pending final compilation.'}
              </p>

              <div className="mt-8 flex items-center space-x-4">
                <div className="px-6 py-3 bg-[#27AE60] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-colors shadow-lg flex items-center gap-2 hover:bg-[#2ECC71]">
                  Start Final Assessment
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skills.map((skill) => {
            let val: number;
            if (isEnrolledUnit) {
              val = stats.progress[skill.key as keyof typeof stats.progress] || 0;
            } else {
              // Read actual progress from moduleProgress for this unit
              const uid = `u${activeUnitId}`;
              const keyMap: Record<string, string[]> = {
                vocabulary: [`${uid}_vocabulary_memory`, `${uid}_vocabulary_escape`],
                grammar: [`${uid}_grammar_quiz`],
                reading: [`${uid}_reading`],
                listening: [`${uid}_listening`],
                challenge: [`${uid}_practice_test`],
              };
              const moduleKeys = keyMap[skill.key] || [];
              val = Math.max(0, ...moduleKeys.map(k => stats.moduleProgress[k]?.score || 0));
            }

            return (
              <div
                key={skill.key}
                onClick={() => isEnrolledUnit && (skill.key === 'challenge' ? onNavigate('practice_test') : onNavigate(skill.key))}
                className={`relative overflow-hidden p-8 rounded-[2.5rem] bg-white backdrop-blur-sm border-2 border-green-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group`}
              >
                <div className={`absolute -bottom-8 -right-8 ${skill.accent} opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  {skill.watermark}
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-50 shadow-sm flex items-center justify-center text-[#27AE60]">
                        {skill.icon}
                      </div>
                      <div>
                        <h4 className={`text-lg font-black leading-tight text-[#2D3748]`}>
                          {skill.label} <span className="text-sm font-medium opacity-60">({skill.vietnamese})</span>
                        </h4>
                        <p className="text-[10px] font-black text-[#5D6D61] uppercase tracking-widest">Skill Proficiency</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 space-y-4">
                    <div className="flex justify-between items-end">
                      <p className="text-xs font-bold text-[#5D6D61] italic">
                        Unit {currentUnitData.id}: {currentUnitData.title}
                      </p>
                      <span className={`text-4xl font-black ${skill.accent}`}>{val}%</span>
                    </div>

                    <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200 p-1">
                      <div
                        className={`h-full ${getDynamicColor(val, skill.barDefault)} rounded-full transition-all duration-1000 ease-out ${val === 0 ? 'opacity-0' : 'opacity-100'}`}
                        style={{ width: `${val}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
