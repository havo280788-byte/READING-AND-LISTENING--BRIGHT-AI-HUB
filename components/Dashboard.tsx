
import React, { useState, useMemo } from 'react';
import { UserStats } from '../types';
import { Book, Puzzle, Mic, PenTool, CheckCircle2, Zap, ChevronRight, BookOpen, Headphones, Shield, Trophy, Crown, Flame, Star, GraduationCap, BarChart3, Sparkles, TrendingUp, Award } from 'lucide-react';
import { ALL_STUDENTS } from '../constants';

interface DashboardProps {
  stats: UserStats;
  unitTitle: string;
  totalModules: number;
  onNavigate: (view: any) => void;
  firebaseStudents?: Record<string, any>;
}

const CURRICULUM: Record<number, { id: number, title: string, subtitle: string, emoji: string, progress: Record<string, number>, status: 'unlocked' | 'locked' }> = {
  1: { id: 1, title: "Generation Gap", subtitle: "Independent Life", emoji: "👨‍👩‍👧‍👦", status: 'unlocked', progress: { vocabulary: 0, grammar: 0, reading: 0, listening: 0, challenge: 0 } },
  2: { id: 2, title: "Vietnam and ASEAN", subtitle: "Cultural Heritage", emoji: "🌏", status: 'unlocked', progress: { vocabulary: 0, grammar: 0, reading: 0, listening: 0, challenge: 0 } },
  3: { id: 3, title: "Global Warming", subtitle: "Ecological Systems", emoji: "🌡️", status: 'unlocked', progress: { vocabulary: 0, grammar: 0, reading: 0, listening: 0, challenge: 0 } },
  4: { id: 4, title: "World Heritage", subtitle: "Culture & Preservation", emoji: "🏛️", status: 'unlocked', progress: { vocabulary: 0, grammar: 0, reading: 0, listening: 0, challenge: 0 } },
  5: { id: 5, title: "Cities & Education", subtitle: "Future Life", emoji: "🏙️", status: 'unlocked', progress: { vocabulary: 0, grammar: 0, reading: 0, listening: 0, challenge: 0 } },
  6: { id: 6, title: "Social Issues", subtitle: "Community Awareness", emoji: "🤝", status: 'unlocked', progress: { vocabulary: 0, grammar: 0, reading: 0, listening: 0, challenge: 0 } },
  7: { id: 7, title: "Healthy Lifestyle", subtitle: "Well-being", emoji: "💪", status: 'unlocked', progress: { vocabulary: 0, grammar: 0, reading: 0, listening: 0, challenge: 0 } },
  8: { id: 8, title: "Health & Life Expectancy", subtitle: "Longevity", emoji: "❤️‍🩹", status: 'unlocked', progress: { vocabulary: 0, grammar: 0, reading: 0, listening: 0, challenge: 0 } },
};

const Dashboard: React.FC<DashboardProps> = ({ stats, unitTitle, totalModules, onNavigate, firebaseStudents = {} }) => {
  const [activeUnitId, setActiveUnitId] = useState<number>(() => {
    const num = parseInt(stats.selectedUnitId.replace('u', ''));
    return isNaN(num) ? 1 : num;
  });

  const currentUnitData = CURRICULUM[activeUnitId] || CURRICULUM[1];
  const progressPercentage = Math.round((stats.completedModules / totalModules) * 100);
  const isEnrolledUnit = stats.selectedUnitId === `u${activeUnitId}`;

  const STORAGE_KEY_PREFIX = 'ELITE_ENG_USER_DATA_V8';

  // Removed local student data to use shared constants

  const { rankedStudents, currentUserRank } = useMemo(() => {
    const savedDataMap: Record<string, { xp: number; completedModules: number }> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX + '_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          const uname = data.username || key.replace(STORAGE_KEY_PREFIX + '_', '');
          savedDataMap[uname] = { xp: data.xp || 0, completedModules: data.completedModules || 0 };
        } catch (e) { /* skip */ }
      }
    }

    const students = ALL_STUDENTS.map(s => {
      const fbData = firebaseStudents[s.username];
      const localData = savedDataMap[s.username];
      return {
        name: s.name,
        username: s.username,
        xp: Math.max(fbData?.xp || 0, localData?.xp || 0),
        completedModules: Math.max(fbData?.completedModules || 0, localData?.completedModules || 0)
      };
    });

    students.sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name));
    const ranked = students.map((s, i) => ({ ...s, rank: i + 1 }));
    const myRank = ranked.find(s => s.username === stats.username);
    return { rankedStudents: ranked, currentUserRank: myRank };
  }, [stats.xp, stats.username, firebaseStudents]);

  const skills = [
    { key: 'vocabulary', label: 'Vocabulary', vietnamese: 'Từ vựng', icon: <Book size={18} />, watermark: <Book size={140} />, iconColor: '#6366F1', barGradient: 'linear-gradient(90deg, #6366F1, #8B5CF6)' },
    { key: 'grammar', label: 'Grammar', vietnamese: 'Ngữ pháp', icon: <Puzzle size={18} />, watermark: <Puzzle size={140} />, iconColor: '#3B82F6', barGradient: 'linear-gradient(90deg, #3B82F6, #6366F1)' },
    { key: 'reading', label: 'Reading', vietnamese: 'Đọc', icon: <BookOpen size={18} />, watermark: <BookOpen size={140} />, iconColor: '#22D3EE', barGradient: 'linear-gradient(90deg, #0E7490, #22D3EE)' },
    { key: 'listening', label: 'Listening', vietnamese: 'Nghe', icon: <Headphones size={18} />, watermark: <Headphones size={140} />, iconColor: '#8B5CF6', barGradient: 'linear-gradient(90deg, #7C3AED, #A78BFA)' },
    { key: 'challenge', label: 'Challenge', vietnamese: 'Thử thách', icon: <Shield size={18} />, watermark: <Zap size={140} />, iconColor: '#F59E0B', barGradient: 'linear-gradient(90deg, #D97706, #F59E0B)' },
  ];

  const getBarGradient = (pct: number, defaultGradient: string) => {
    if (pct === 0) return '#334155';
    if (pct < 30) return 'linear-gradient(90deg, #B45309, #F59E0B)';
    return defaultGradient;
  };

  const cardStyle: React.CSSProperties = {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    borderRadius: '24px',
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-24">
      {/* Hero Card */}
      <section className="relative overflow-hidden p-8 md:p-10" style={cardStyle}>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <p className="type-caption font-bold uppercase tracking-widest mb-1" style={{ color: '#6366F1' }}>AI Learning Hub · G11</p>
              <h2 className="type-h2 font-black mb-1" style={{ color: '#F8FAFC' }}>
                Hello, {stats.name}! 👋
              </h2>
              <p className="type-small" style={{ color: '#94A3B8' }}>
                Progress: <span className="font-bold" style={{ color: '#22D3EE' }}>{progressPercentage}%</span> complete
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <div className="px-5 py-3 rounded-2xl" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Flame size={12} style={{ color: '#6366F1' }} />
                  <p className="type-caption font-black uppercase tracking-widest" style={{ color: '#6366F1' }}>XP Points</p>
                </div>
                <p className="text-xl font-black" style={{ background: 'linear-gradient(135deg, #6366F1, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.xp}</p>
              </div>
              <div className="px-5 py-3 rounded-2xl" style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.15)' }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <GraduationCap size={12} style={{ color: '#22D3EE' }} />
                  <p className="type-caption font-black uppercase tracking-widest" style={{ color: '#22D3EE' }}>Level</p>
                </div>
                <p className="text-xl font-black" style={{ color: '#22D3EE' }}>Grade 11</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex justify-between items-end mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 size={14} style={{ color: '#6366F1' }} />
                  <h4 className="type-caption font-black uppercase tracking-widest" style={{ color: '#CBD5E1' }}>Curriculum Mastery</h4>
                </div>
                <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                  Modules: <span className="font-bold" style={{ color: '#A5B4FC' }}>{stats.completedModules}</span> / {totalModules}
                </p>
              </div>
              <span className="text-3xl font-black" style={{ background: 'linear-gradient(135deg, #6366F1, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden p-0.5" style={{ background: '#0F172A' }}>
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%`, background: 'linear-gradient(90deg, #6366F1, #22D3EE)' }}
              ></div>
            </div>
          </div>
        </div>
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: '#6366F1', opacity: 0.04, filter: 'blur(60px)' }}></div>
      </section>

      {/* Leaderboard */}
      {rankedStudents.length > 0 && (
        <section className="relative overflow-hidden p-8 md:p-10" style={cardStyle}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>
                  <Trophy size={20} />
                </div>
                <div>
                  <h3 className="type-h3 font-black uppercase tracking-tight" style={{ color: '#F8FAFC' }}>Class Leaderboard</h3>
                  <p className="type-caption font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>{rankedStudents.length} students ranked by XP</p>
                </div>
              </div>
              {currentUserRank && (
                <div className="px-4 py-2.5 rounded-xl" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <p className="type-caption font-black uppercase tracking-widest" style={{ color: '#A5B4FC' }}>Your Rank</p>
                  <p className="text-xl font-black text-center" style={{ background: 'linear-gradient(135deg, #6366F1, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    #{currentUserRank.rank}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {rankedStudents.map((student) => {
                const isMe = student.username === stats.username;
                const rankColors = student.rank === 1 ? { bg: 'rgba(251,191,36,0.15)', text: '#FBBF24' }
                  : student.rank === 2 ? { bg: 'rgba(148,163,184,0.15)', text: '#94A3B8' }
                    : student.rank === 3 ? { bg: 'rgba(249,115,22,0.15)', text: '#FB923C' }
                      : { bg: 'rgba(51,65,85,0.5)', text: '#64748B' };
                const rankEmoji = student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : student.rank === 3 ? '🥉' : '';

                return (
                  <div
                    key={student.username}
                    className="flex items-center justify-between p-4 rounded-xl transition-all duration-200"
                    style={isMe ? {
                      background: 'rgba(99,102,241,0.1)',
                      border: '1px solid rgba(99,102,241,0.25)',
                      boxShadow: '0 0 15px rgba(99,102,241,0.1)',
                    } : {
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs"
                        style={{ background: rankColors.bg, color: rankColors.text }}>
                        {rankEmoji || `#${student.rank}`}
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white"
                        style={{ background: isMe ? 'linear-gradient(135deg, #6366F1, #3B82F6)' : '#334155' }}>
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="type-small font-bold" style={{ color: isMe ? '#A5B4FC' : '#CBD5E1' }}>
                          {student.name} {isMe && <span className="type-caption font-black ml-1" style={{ color: '#6366F1' }}>(You)</span>}
                        </p>
                        <p className="type-caption" style={{ color: '#475569' }}>
                          {student.xp === 0 ? 'Chưa bắt đầu' : `${student.completedModules} modules`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black" style={{ color: student.xp > 0 ? (isMe ? '#A5B4FC' : '#CBD5E1') : '#334155' }}>
                        {student.xp}
                      </span>
                      <p className="type-caption font-bold uppercase" style={{ color: '#475569' }}>XP</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: '#F59E0B', opacity: 0.03, filter: 'blur(50px)' }}></div>
        </section>
      )}

      {/* Unit Tabs */}
      <section className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
        {Object.values(CURRICULUM).map((unit) => (
          <button
            key={unit.id}
            onClick={() => setActiveUnitId(unit.id)}
            disabled={unit.status === 'locked'}
            className="type-caption px-5 py-2.5 rounded-full font-bold uppercase tracking-widest transition-all duration-200 border whitespace-nowrap flex items-center gap-2"
            style={activeUnitId === unit.id ? {
              background: '#6366F1',
              color: 'white',
              border: '1px solid #6366F1',
              boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
            } : {
              background: 'rgba(255,255,255,0.03)',
              color: '#94A3B8',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
            onMouseEnter={(e) => { if (activeUnitId !== unit.id) { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.color = '#CBD5E1'; } }}
            onMouseLeave={(e) => { if (activeUnitId !== unit.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#94A3B8'; } }}
          >
            <span>{unit.emoji}</span>
            Unit {unit.id}: {unit.title}
          </button>
        ))}
      </section>

      {/* Skills Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentUnitData.emoji}</span>
            <h3 className="text-xl font-black" style={{ color: '#F8FAFC', fontFamily: 'Poppins, sans-serif' }}>
              {currentUnitData.title} Mastery
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} style={{ color: '#22D3EE' }} />
            <span className="type-caption font-black uppercase tracking-widest" style={{ color: '#22D3EE' }}>Grade 11 Advanced</span>
          </div>
        </div>

        {/* Challenge CTA */}
        {isEnrolledUnit && (
          <div
            onClick={() => onNavigate('practice_test')}
            className="p-8 rounded-3xl relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.01]"
            style={{ background: 'linear-gradient(135deg, #312E81, #1E3A5F)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform" style={{ color: '#22D3EE' }}>
              <Zap size={120} fill="currentColor" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 animate-pulse"
                  style={{ background: 'rgba(99,102,241,0.2)', color: '#A5B4FC' }}>
                  <Award size={12} /> Elite Challenge
                </div>
              </div>
              <h4 className="text-4xl font-black italic tracking-tighter mb-2 uppercase" style={{ color: '#F8FAFC', fontFamily: 'Poppins, sans-serif' }}>
                Unit {activeUnitId} Challenge
              </h4>
              <p className="text-sm font-medium italic max-w-xl" style={{ color: '#94A3B8' }}>
                {activeUnitId <= 4 ? 'Complete comprehensive questions to prove your mastery.' : 'Advanced module structure ready. Content pending final compilation.'}
              </p>
              <div className="mt-8 flex items-center space-x-4">
                <div className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors flex items-center gap-2 text-white"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #3B82F6)', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>
                  <Zap size={14} /> Start Final Assessment <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {skills.map((skill) => {
            let val: number;
            if (isEnrolledUnit) {
              val = stats.progress[skill.key as keyof typeof stats.progress] || 0;
            } else {
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
                className="relative overflow-hidden p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                style={{
                  background: '#1E293B',
                  border: '1px solid rgba(255,255,255,0.05)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#243044'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#1E293B'}
              >
                <div className="absolute -bottom-8 -right-8 opacity-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                  style={{ color: skill.iconColor }}>
                  {skill.watermark}
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${skill.iconColor}20`, color: skill.iconColor }}>
                      {skill.icon}
                    </div>
                    <div>
                      <h4 className="type-h4 font-black leading-tight" style={{ color: '#F8FAFC' }}>{skill.label}</h4>
                      <p className="type-caption font-black uppercase tracking-widest" style={{ color: '#64748B' }}>{skill.vietnamese}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <p className="type-caption font-medium" style={{ color: '#64748B' }}>
                        Unit {currentUnitData.id}: {currentUnitData.title}
                      </p>
                      <span className="text-3xl font-black" style={{ color: skill.iconColor }}>{val}%</span>
                    </div>

                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#0F172A' }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${val}%`, background: val === 0 ? '#334155' : skill.barGradient }}
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
