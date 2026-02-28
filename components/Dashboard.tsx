import React from 'react';
import { Card } from './Components';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserStats } from '../types';

interface Props {
   stats: UserStats;
}

const Dashboard: React.FC<Props> = ({ stats }) => {
   return (
      <div className="space-y-8 animate-fade-in">
         {/* Hero Banner Section */}
         <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-900/80 via-blue-900/40 to-slate-900/80 border border-white/10 p-8 md:p-12 shadow-2xl backdrop-blur-3xl">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-purple-500/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex-1 space-y-4 text-center md:text-left">
                  <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                     Welcome back! 👋
                  </h2>
                  <p className="text-blue-200/80 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
                     Continue your journey to master English. Every lesson is a step closer to your goal!
                  </p>

                  <div className="pt-6 flex flex-wrap justify-center md:justify-start gap-4">
                     <div className="bg-white/10 backdrop-blur-md border border-white/10 px-8 py-4 rounded-3xl shadow-xl hover:bg-white/15 transition-all group">
                        <div className="flex flex-col">
                           <span className="text-blue-300 font-bold uppercase text-xs tracking-widest mb-1">Lessons Completed</span>
                           <div className="flex items-baseline gap-2">
                              <span className="text-5xl font-black text-white group-hover:scale-105 transition-transform inline-block">
                                 {stats.lessonsCompleted}
                              </span>
                              <span className="text-blue-400 font-bold text-lg leading-none">lessons</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Stylized Illustration Area */}
               <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                  {/* Glowing Orbit Rings */}
                  <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                  <div className="absolute inset-4 border border-purple-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>

                  {/* Central Icon Illustration */}
                  <div className="relative z-10 w-48 h-48 md:w-56 md:h-56 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[3rem] shadow-2xl shadow-blue-500/40 flex items-center justify-center transform hover:scale-105 transition-all duration-500">
                     <div className="absolute inset-0 bg-white/10 rounded-[3rem] backdrop-blur-sm border border-white/20"></div>
                     <i className="fas fa-rocket text-7xl md:text-8xl text-white drop-shadow-2xl relative z-10 animate-bounce-slow"></i>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute top-0 right-4 w-12 h-12 bg-yellow-400/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-yellow-400 border border-yellow-400/30 animate-float-delayed">
                     <i className="fas fa-star text-xl"></i>
                  </div>
                  <div className="absolute bottom-8 left-0 w-14 h-14 bg-indigo-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/30 animate-float">
                     <i className="fas fa-graduation-cap text-2xl"></i>
                  </div>
               </div>
            </div>
         </div>

         {/* Daily Tips (Main secondary section) */}
         <div className="max-w-6xl mx-auto w-full">
            <Card title="Daily Tips" className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl rounded-[2.5rem]">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 pb-4">
                  <div className="flex flex-col items-center text-center p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all group">
                     <div className="w-16 h-16 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center mb-4 text-3xl border border-green-500/20 group-hover:scale-110 transition-transform">
                        <i className="fas fa-microphone-lines"></i>
                     </div>
                     <h4 className="font-bold text-white mb-2 text-xl">Self-Correction</h4>
                     <p className="text-base text-slate-400 leading-relaxed max-w-xs">Record your speech and listen back. You'll catch 50% more of your own errors.</p>
                  </div>

                  <div className="flex flex-col items-center text-center p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:border-purple-500/30 transition-all group">
                     <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 text-3xl border border-purple-500/20 group-hover:scale-110 transition-transform">
                        <i className="fas fa-book-open"></i>
                     </div>
                     <h4 className="font-bold text-white mb-2 text-xl">Vocabulary</h4>
                     <p className="text-base text-slate-400 leading-relaxed max-w-xs">Learn 5 new "high-value" words daily. Try using them in a sentence immediately.</p>
                  </div>

                  <div className="flex flex-col items-center text-center p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:border-yellow-500/30 transition-all group">
                     <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center mb-4 text-3xl border border-yellow-500/20 group-hover:scale-110 transition-transform">
                        <i className="fas fa-clock"></i>
                     </div>
                     <h4 className="font-bold text-white mb-2 text-xl">Consistency</h4>
                     <p className="text-base text-slate-400 leading-relaxed max-w-xs">15 minutes every morning is better than 2 hours once a week. Stay disciplined!</p>
                  </div>
               </div>
            </Card>
         </div>
      </div>
   );
};



export default Dashboard;