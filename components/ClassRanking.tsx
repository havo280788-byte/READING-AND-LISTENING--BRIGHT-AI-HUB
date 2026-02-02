
import React from 'react';
import { RankingData, UnitRank } from '../types';
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, ArrowLeft, Award, Star, Info } from 'lucide-react';

interface ClassRankingProps {
  rankingData: RankingData;
  onReturn: () => void;
}

const ClassRanking: React.FC<ClassRankingProps> = ({ rankingData, onReturn }) => {
  const { user_performance, unit_ranks, total_students } = rankingData;

  const hasData = user_performance.total_score > 0;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="text-emerald-500" size={16} />;
      case 'down': return <TrendingDown className="text-rose-500" size={16} />;
      default: return <Minus className="text-slate-400" size={16} />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 0) return 'bg-slate-100 text-slate-400 opacity-50';
    if (rank === 1) return 'bg-amber-400 text-amber-950';
    if (rank <= 5) return 'bg-[#2ECC71] text-white';
    if (rank <= 10) return 'bg-[#27AE60] text-white';
    return 'bg-slate-100 text-slate-500';
  };

  if (!hasData) {
    return (
      <div className="animate-fadeIn flex flex-col items-center justify-center min-h-[60vh] space-y-10">
        <div className="bg-white rounded-[3rem] p-12 text-center shadow-2xl border-4 border-[#27AE60]/10 max-w-lg">
           <div className="w-24 h-24 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Info size={48} />
           </div>
           <h2 className="text-3xl font-black text-[#1A2F1F] uppercase tracking-tighter italic mb-4">Chưa có kết quả</h2>
           <p className="text-slate-500 font-medium mb-10 leading-relaxed">
             "Bảng xếp hạng sẽ được cập nhật ngay khi bạn tích lũy được những điểm XP đầu tiên từ các bài học hoặc Challenge. Hãy bắt đầu chinh phục ngay nhé!"
           </p>
           <button 
             onClick={onReturn}
             className="w-full bg-[#27AE60] text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] shadow-xl hover:bg-[#27AE60] transition-all flex items-center justify-center gap-4 border-b-[6px] border-[#27AE60] active:translate-y-1 active:border-b-0"
           >
             <ArrowLeft size={18} />
             <span>Quay lại Dashboard</span>
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-10 pb-20 max-w-5xl mx-auto">
      {/* Profile Achievement Header */}
      <section className="bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-[2.5rem] p-10 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none rotate-12">
          <Trophy size={180} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="relative">
            <div className="w-40 h-40 rounded-full border-4 border-white/20 p-1.5 shadow-2xl">
              <img 
                src={user_performance.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user_performance.student_name}`} 
                alt="Profile" 
                className="w-full h-full rounded-full bg-white/10 object-cover"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-white text-[#27AE60] w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-xl border-4 border-[#27AE60]">
              #{user_performance.current_rank || '??'}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="space-y-1">
              <p className="text-white/80 text-[11px] font-black uppercase tracking-[0.5em] mb-2 flex items-center justify-center md:justify-start gap-2">
                <Star size={14} fill="currentColor" /> Personal Achievement Summary
              </p>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">{user_performance.student_name}</h2>
              <p className="text-white/70 font-bold text-sm tracking-wide">Elite English Hub • Grade 11 Class A1</p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <div className="bg-white/10 border border-white/20 px-6 py-4 rounded-3xl backdrop-blur-sm">
                 <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Global Rank</p>
                 <div className="flex items-center gap-3">
                    <span className="text-2xl font-black">{user_performance.current_rank || '--'} / {total_students}</span>
                    {getTrendIcon(user_performance.trend)}
                 </div>
              </div>
              <div className="bg-white/10 border border-white/20 px-6 py-4 rounded-3xl backdrop-blur-sm">
                 <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Total Academic XP</p>
                 <span className="text-2xl font-black">{user_performance.total_score.toLocaleString()} XP</span>
              </div>
              <div className="bg-white/10 border border-white/20 px-6 py-4 rounded-3xl backdrop-blur-sm">
                 <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Curriculum Mastery</p>
                 <span className="text-2xl font-black">{user_performance.progress_percentage}%</span>
              </div>
            </div>

            <div className="bg-white/10 border border-white/20 px-8 py-4 rounded-[2rem] inline-block shadow-inner">
               <p className="text-sm font-medium italic text-white/90 leading-relaxed">
                 "{user_performance.message}"
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Table (Top 3) */}
      <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border-2 border-[#27AE60]/20 space-y-6">
         <div className="flex items-center gap-3 border-b border-[#27AE60]/10 pb-4">
            <Crown className="text-[#27AE60]" size={24} />
            <h3 className="text-xl font-black text-[#1A2F1F] uppercase italic tracking-tighter">Class Top Performers</h3>
         </div>
         <div className="space-y-4">
            {rankingData.top_students.map((student, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-[#F7FCF7] border border-[#27AE60]/10 group hover:border-[#27AE60]/30 transition-all">
                 <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${idx === 0 ? 'bg-amber-400 text-amber-950' : idx === 1 ? 'bg-slate-200 text-slate-600' : 'bg-orange-200 text-orange-800'}`}>
                       {student.rank}
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                       <img src={student.avatar_url} alt={student.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-[#1A2F1F]">{student.name}</span>
                 </div>
                 <span className="font-black text-[#27AE60] italic">{student.score} XP</span>
              </div>
            ))}
         </div>
      </section>

      {/* Unit Rank Clean Cards */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-[#27AE60]/20 pb-4">
           <div className="flex items-center space-x-3">
              <Award className="text-[#27AE60]" size={24} />
              <h3 className="text-2xl font-black text-[#1A2F1F] uppercase tracking-tighter italic">Personal Unit Standings</h3>
           </div>
           <span className="text-[10px] font-black text-[#5D6D61] uppercase tracking-widest">Sort: Academic Progression</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {unit_ranks.map((rank) => (
            <div 
              key={rank.unit_id}
              className="bg-white rounded-[2.5rem] p-8 shadow-xl border-2 border-[#27AE60]/20 transition-all duration-300 hover:shadow-2xl hover:border-[#27AE60]/40 group relative overflow-hidden"
            >
              <div className="flex flex-col h-full justify-between space-y-8">
                <div className="flex items-start justify-between">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-[#5D6D61] uppercase tracking-[0.2em]">{rank.unit_id.toUpperCase()}</p>
                      <h4 className="text-xl font-black text-[#1A2F1F] leading-tight max-w-[200px]">{rank.unit_name}</h4>
                   </div>
                   <div className={`px-4 py-2 rounded-2xl font-black text-xs shadow-md border-2 border-white/20 ${getRankBadgeColor(rank.student_rank)}`}>
                      {rank.student_rank > 0 ? `Rank #${rank.student_rank}` : 'Not Ranked'}
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-end mb-2">
                      <p className="text-base font-bold text-[#1A2F1F] opacity-90">
                         Hạng lớp: <span className="text-xl font-black">{rank.student_rank || '--'}</span> / {total_students}
                      </p>
                      <p className="text-sm font-black text-[#5D6D61] italic">
                         (Tích lũy: {rank.score}/{rank.max_score}%)
                      </p>
                   </div>
                   
                   <div className="w-full bg-[#27AE60]/10 h-4 rounded-full overflow-hidden p-1 border border-[#27AE60]/20">
                      <div 
                        className="h-full bg-[#27AE60] rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(39,174,96,0.3)]"
                        style={{ width: `${(rank.score / rank.max_score) * 100}%` }}
                      ></div>
                   </div>
                </div>

                <div className="pt-6 border-t border-[#27AE60]/10 flex items-center justify-between text-[10px] font-black text-[#5D6D61] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                   <span>Unit Mastery Status</span>
                   <span className={rank.student_rank > 0 && rank.student_rank <= 3 ? 'text-amber-600' : 'text-[#27AE60]'}>
                     {rank.student_rank === 0 ? '❌ Not Started' : rank.student_rank <= 3 ? '🏆 Elite Performer' : '✅ Unit Active'}
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Return Button */}
      <div className="flex flex-col items-center justify-center pt-10 space-y-6">
         <div className="text-center space-y-2 opacity-50 max-w-md mx-auto">
            <p className="text-[10px] font-black text-[#5D6D61] uppercase tracking-[0.3em]">Developed with ❤️ by Teacher Vo Thi Thu Ha</p>
            <p className="text-xs text-[#5D6D61] font-medium italic">
              "Rankings are updated in real-time as you earn XP. Keep learning to reach the top of the leaderboard!"
            </p>
         </div>

         <button 
           onClick={onReturn}
           className="group px-12 py-6 bg-[#27AE60] text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:bg-[#2ECC71] transition-all flex items-center gap-4 border-b-[6px] border-[#2ECC71] active:translate-y-1 active:border-b-0"
         >
           <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
           <span>Return to Hub</span>
         </button>
      </div>
    </div>
  );
};

export default ClassRanking;
