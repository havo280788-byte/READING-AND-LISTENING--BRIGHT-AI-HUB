import React, { useState, useEffect } from 'react';
import { SkillMode, UserStats, AI_MODELS } from './types';
import Dashboard from './components/Dashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import SpeakingPractice from './components/SpeakingPractice';
import WritingPractice from './components/WritingPractice';
import LoginScreen from './components/LoginScreen';
import { SettingsModal } from './components/SettingsModal';
import { setApiKey, setModel } from './services/geminiService';
import { saveUserStats, getUserStats } from './services/firebaseService';

function App() {
   const [currentUser, setCurrentUser] = useState<string | null>(null);
   const [activeTab, setActiveTab] = useState<SkillMode>(SkillMode.DASHBOARD);
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
   const [currentApiKey, setCurrentApiKey] = useState('');
   const [currentModel, setCurrentModel] = useState('gemini-3-pro-preview');

   // User Progress State
   const [stats, setStats] = useState<UserStats>({
      speakingScore: [],
      writingScore: [],
      lessonsCompleted: 0,
      streak: 1,
      lastPractice: new Date().toISOString()
   });

   // Load User on Mount
   useEffect(() => {
      const savedUser = localStorage.getItem('lingua_current_user');
      const savedKey = localStorage.getItem('lingua_api_key');
      const savedModel = localStorage.getItem('lingua_model');

      if (savedUser && savedKey) {
         setApiKey(savedKey);
         setCurrentApiKey(savedKey);

         if (savedModel) {
            setModel(savedModel);
            setCurrentModel(savedModel);
         }

         handleLogin(savedUser, savedKey, savedModel || 'gemini-3-pro-preview');
      }
   }, []);

   const handleLogin = (name: string, key: string, model: string) => {
      setCurrentUser(name);
      localStorage.setItem('lingua_current_user', name);

      // Save API key & Model
      setApiKey(key);
      localStorage.setItem('lingua_api_key', key);
      setCurrentApiKey(key);

      setModel(model);
      localStorage.setItem('lingua_model', model);
      setCurrentModel(model);

      // Load stats for this specific user - Try Firebase first
      const loadStats = async () => {
         try {
            const cloudStats = await getUserStats(name);
            if (cloudStats) {
               setStats(cloudStats);
               return;
            }

            // Fallback to localStorage if cloud is empty
            const userStatsKey = `lingua_stats_${name.replace(/\s+/g, '_')}`;
            const storedStats = localStorage.getItem(userStatsKey);

            if (storedStats) {
               const parsedStats = JSON.parse(storedStats);
               setStats(parsedStats);
               // Sync fallback to cloud
               saveUserStats(name, parsedStats);
            } else {
               // Reset stats for new user
               const initialStats: UserStats = {
                  speakingScore: [],
                  writingScore: [],
                  lessonsCompleted: 0,
                  streak: 1,
                  lastPractice: new Date().toISOString()
               };
               setStats(initialStats);
               saveUserStats(name, initialStats);
            }
         } catch (error) {
            console.error("Error loading stats during login:", error);
         }
      };

      loadStats();
   };

   const handleLogout = () => {
      setCurrentUser(null);
      localStorage.removeItem('lingua_current_user');
      setStats({
         speakingScore: [],
         writingScore: [],
         lessonsCompleted: 0,
         streak: 1,
         lastPractice: new Date().toISOString()
      });
      setActiveTab(SkillMode.DASHBOARD);
   };

   const handleSaveSettings = () => {
      setApiKey(currentApiKey);
      setModel(currentModel);
      localStorage.setItem('lingua_api_key', currentApiKey);
      localStorage.setItem('lingua_model', currentModel);
      setIsSettingsOpen(false);
   };

   // Update Stats Helper
   const updateStats = (score: number, mode: 'speaking' | 'writing') => {
      if (!currentUser) return;

      const newStats = { ...stats };
      if (mode === 'speaking') {
         newStats.speakingScore = [...newStats.speakingScore, score];
      } else {
         newStats.writingScore = [...newStats.writingScore, score];
      }
      newStats.lessonsCompleted += 1;
      newStats.lastPractice = new Date().toISOString();

      setStats(newStats);

      // Save to Firebase (Cloud)
      saveUserStats(currentUser, newStats).catch(err => console.error("Cloud save failed:", err));

      // Backup to localStorage
      const userStatsKey = `lingua_stats_${currentUser.replace(/\s+/g, '_')}`;
      localStorage.setItem(userStatsKey, JSON.stringify(newStats));
   };

   // Navigation Items
   const navItems = [
      { id: SkillMode.DASHBOARD, label: 'Overview', icon: 'fa-chart-pie' },
      { id: SkillMode.SPEAKING, label: 'Speaking', icon: 'fa-microphone' },
      { id: SkillMode.WRITING, label: 'Writing', icon: 'fa-pen-nib' },
   ];

   // --- RENDER LOGIN IF NO USER ---
   if (!currentUser) {
      return <LoginScreen onLogin={handleLogin} />;
   }

   const modelInfo = AI_MODELS.find(m => m.id === currentModel) || AI_MODELS[0];

   // --- MAIN APP UI ---
   return (
      <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-100 bg-[#0F172A]">

         {/* Sidebar / Mobile Header */}
         <aside className="w-full md:w-80 bg-slate-900/60 backdrop-blur-2xl border-r border-white/10 flex-shrink-0 sticky top-0 md:h-screen z-20 flex flex-col shadow-2xl">
            <div className="p-8 flex items-center gap-4 border-b border-white/5">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 transform hover:scale-110 transition-transform">
                  <i className="fas fa-shapes text-2xl"></i>
               </div>
               <div>
                  <h1 className="font-extrabold text-2xl tracking-tight text-white leading-none">Lingua<span className="text-blue-500">AI</span></h1>
                  <p className="text-sm text-slate-400 font-semibold tracking-wide mt-1">English Mastery</p>
               </div>
            </div>

            <div className="px-8 py-6">
               <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-sm ring-2 ring-white/10">
                     {currentUser.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                     <p className="text-xs text-blue-400 uppercase font-bold tracking-wider mb-0.5">
                        {currentUser === 'Nguyen Thi Thu Ha' ? 'Teacher' : 'Student'}
                     </p>
                     <p className="font-bold text-lg text-white truncate">{currentUser}</p>
                  </div>
               </div>
            </div>

            <nav className="flex-1 px-6 space-y-3 overflow-y-auto py-2">
               {navItems.map((item) => (
                  <button
                     key={item.id}
                     onClick={() => setActiveTab(item.id)}
                     className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl transition-all duration-300 font-bold text-lg group ${activeTab === item.id
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                  >
                     <i className={`fas ${item.icon} w-8 text-center text-xl transition-transform group-hover:scale-110`}></i>
                     {item.label}
                     {activeTab === item.id && <i className="fas fa-chevron-right ml-auto text-sm opacity-50"></i>}
                  </button>
               ))}
            </nav>

            <div className="p-6 border-t border-white/5">
               <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-6 py-4 text-red-400 hover:bg-red-400/10 rounded-2xl transition-colors font-bold text-lg"
               >
                  <i className="fas fa-sign-out-alt w-8 text-center text-xl"></i>
                  Sign Out
               </button>
            </div>
         </aside>

         {/* Main Content */}
         <main className="flex-1 overflow-y-auto h-screen custom-scrollbar">
            <div className="max-w-7xl mx-auto p-6 md:p-12 flex flex-col min-h-full">

               <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                  <div>
                     <h2 className="text-4xl font-extrabold text-white tracking-tight">
                        {navItems.find(n => n.id === activeTab)?.label}
                     </h2>
                     <p className="text-slate-400 text-lg mt-2">Welcome back, <span className="font-bold text-blue-400">{currentUser}</span>! Ready to learn?</p>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-4">
                     {/* Connection Status */}
                     <div className="hidden md:flex px-5 py-2.5 bg-white/5 rounded-full border border-white/10 shadow-sm items-center gap-3">
                        <div className="relative flex h-3 w-3">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </div>
                        <span className="text-sm font-bold text-slate-300">Connected</span>
                     </div>

                     {/* Settings Button */}
                     <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex flex-col items-end group"
                     >
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 shadow-sm hover:shadow-md flex items-center justify-center text-slate-400 transition-all group-hover:border-blue-500/50 group-hover:text-blue-400">
                           <i className="fas fa-cog text-xl"></i>
                        </div>
                        {(!currentApiKey || currentApiKey.length < 10) && (
                           <span className="text-[10px] font-bold text-red-500 mt-1 bg-red-50 px-2 py-0.5 rounded-md border border-red-100 whitespace-nowrap animate-pulse">
                              Get API Key to use the app
                           </span>
                        )}
                     </button>
                  </div>
               </header>

               {/* Settings Modal */}
               <SettingsModal
                  isOpen={isSettingsOpen}
                  onClose={() => setIsSettingsOpen(false)}
                  apiKey={currentApiKey}
                  setApiKey={setCurrentApiKey}
                  selectedModel={currentModel}
                  setModel={setCurrentModel}
                  onSave={handleSaveSettings}
               />

               {/* Content Area */}
               <div className="animate-fade-in-up pb-10 flex-1">
                  {activeTab === SkillMode.DASHBOARD && (
                     currentUser === 'Nguyen Thi Thu Ha'
                        ? <TeacherDashboard />
                        : <Dashboard stats={stats} />
                  )}
                  {activeTab === SkillMode.SPEAKING && (
                     <SpeakingPractice
                        onComplete={(score) => updateStats(score, 'speaking')}
                        studentName={currentUser}
                     />
                  )}
                  {activeTab === SkillMode.WRITING && (
                     <WritingPractice
                        onComplete={(score) => updateStats(score, 'writing')}
                        studentName={currentUser}
                     />
                  )}
               </div>

               {/* Footer */}
               <footer className="py-6 text-center text-blue-400 text-xs font-bold uppercase tracking-widest border-t border-white/5 mt-auto">
                  DEVELOPED BY TEACHER VO THI THU HA - TRAN HUNG DAO HIGH SCHOOL - LAM DONG
               </footer>
            </div>
         </main>
      </div>
   );
}

export default App;