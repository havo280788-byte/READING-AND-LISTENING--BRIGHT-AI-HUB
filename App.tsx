
import React, { useState, useEffect, useMemo } from 'react';
import { ViewType, UserStats, UserAccount, ModuleProgress } from './types';
import { COURSE_DATA, UNIT1_PRACTICE_TEST, UNIT2_PRACTICE_TEST, UNIT3_PRACTICE_TEST, UNIT4_PRACTICE_TEST } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VocabularyModule from './components/VocabularyModule';
import GrammarModule from './components/GrammarModule';
import ReadingModule from './components/ReadingModule';
import ListeningModule from './components/ListeningModule';
import WritingModule from './components/WritingModule';
import PracticeTest from './components/PracticeTest';
import Auth from './components/Auth';
import ApiKeyModal from './components/ApiKeyModal';
import { Target, CheckCircle, CloudSync, Settings } from 'lucide-react';
import { syncScoreToSheet, fetchRemoteProgress, updateModuleStatus, getActiveApiKey } from './services/geminiService';

const TOTAL_MODULES = 30;
const STORAGE_KEY_PREFIX = 'ELITE_ENG_USER_DATA_V8';

const INITIAL_STATS = (username: string, name: string): UserStats => ({
  username,
  name,
  level: "Grade 11 - Intermediate",
  xp: 0,
  streak: 1,
  badges: [],
  lastVisit: new Date().toISOString(),
  selectedUnitId: COURSE_DATA[0].id,
  completedModules: 0,
  completedModuleIds: [],
  moduleProgress: {},
  progress: {
    vocabulary: 0,
    grammar: 0,
    speaking: 0,
    writing: 0,
    reading: 0,
    listening: 0,
    challenge: 0
  }
});

const normalizeName = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .toUpperCase();
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [vocabInitialView, setVocabInitialView] = useState<'list' | 'game'>('list');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('elite_eng_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [stats, setStats] = useState<UserStats | null>(() => {
    const savedUser = localStorage.getItem('elite_eng_current_user');
    if (!savedUser) return null;
    const user = JSON.parse(savedUser);
    const savedStats = localStorage.getItem(`${STORAGE_KEY_PREFIX}_${user.username}`);
    return savedStats ? JSON.parse(savedStats) : INITIAL_STATS(user.username, user.name);
  });

  const hasApiKey = !!getActiveApiKey();

  // Check for API Key on load
  useEffect(() => {
    const key = getActiveApiKey();
    if (!key) {
      setIsApiKeyModalOpen(true);
    }
  }, []);

  // Name Normalization Effect
  useEffect(() => {
    if (currentUser) {
      const normalizedName = normalizeName(currentUser.name);
      
      if (currentUser.name !== normalizedName) {
        const newUser = { ...currentUser, name: normalizedName };
        setCurrentUser(newUser);
        localStorage.setItem('elite_eng_current_user', JSON.stringify(newUser));
        
        if (stats) {
          const newStats = { ...stats, name: normalizedName };
          setStats(newStats);
          // Stats are saved to local storage by the existing effect
        }
      }
    }
  }, [currentUser, stats]);

  // Sync with Remote Progress on Login (Remote Hydration) - NOW LOCAL ONLY MOCK
  useEffect(() => {
    if (currentUser && stats && Object.keys(stats.moduleProgress).length === 0) {
      const syncRemote = async () => {
        setIsSyncing(true);
        // fetchRemoteProgress now returns empty/mock, effectively disabling sync
        const remoteData = await fetchRemoteProgress(currentUser.name);
        if (remoteData && remoteData.length > 0) {
          const newModuleProgress: Record<string, ModuleProgress> = {};
          let totalXp = 0;
          let completedCount = 0;
          
          remoteData.forEach((row: any) => {
            newModuleProgress[row.module_id] = {
              status: row.status as 'completed',
              score: parseInt(row.score) || 0,
              attempts: 1
            };
            if (row.status === 'completed') {
              completedCount++;
              totalXp += 100; // Base XP for remote recovery
            }
          });

          setStats(prev => prev ? ({ 
            ...prev, 
            moduleProgress: newModuleProgress, 
            xp: totalXp,
            completedModules: completedCount
          }) : null);
        }
        setIsSyncing(false);
      };
      syncRemote();
    }
  }, [currentUser]);

  // Update Progress Bars based on Module Progress
  useEffect(() => {
    if (!stats) return;
    const uid = stats.selectedUnitId;
    
    const nextProgress = {
      vocabulary: stats.moduleProgress[`${uid}_vocabulary_memory`]?.score || 
                 stats.moduleProgress[`${uid}_vocabulary_escape`]?.score || 0,
      grammar: stats.moduleProgress[`${uid}_grammar_quiz`]?.score || 0,
      speaking: 0,
      writing: stats.moduleProgress[`${uid}_writing`]?.score || 0,
      reading: stats.moduleProgress[`${uid}_reading`]?.score || 0,
      listening: stats.moduleProgress[`${uid}_listening`]?.score || 0,
      challenge: stats.moduleProgress[`${uid}_practice_test`]?.score || 0
    };

    if (JSON.stringify(stats.progress) !== JSON.stringify(nextProgress)) {
      setStats(prev => prev ? ({ ...prev, progress: nextProgress }) : null);
    }
  }, [stats?.moduleProgress, stats?.selectedUnitId]);

  // Save Local Storage changes
  useEffect(() => {
    if (stats && currentUser) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_${currentUser.username}`, JSON.stringify(stats));
    }
  }, [stats, currentUser]);

  const handleLogin = (user: UserAccount) => {
    const normalizedUser = { ...user, name: normalizeName(user.name) };
    setCurrentUser(normalizedUser);
    localStorage.setItem('elite_eng_current_user', JSON.stringify(normalizedUser));
    const savedStats = localStorage.getItem(`${STORAGE_KEY_PREFIX}_${normalizedUser.username}`);
    setStats(savedStats ? JSON.parse(savedStats) : INITIAL_STATS(normalizedUser.username, normalizedUser.name));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setStats(null);
    localStorage.removeItem('elite_eng_current_user');
  };

  const handleResetProgress = () => {
    if (currentUser && window.confirm("Xóa toàn bộ tiến trình học tập trên thiết bị này?")) {
      const resetStats = INITIAL_STATS(currentUser.username, currentUser.name);
      setStats(resetStats);
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_${currentUser.username}`, JSON.stringify(resetStats));
      setActiveView('dashboard');
    }
  };

  const handleTaskCompletion = async (moduleId: string, score: number, meta?: { writing_content?: string, ai_writing_feedback?: string }) => {
    if (!stats || !currentUser) return;
    setIsSyncing(true);
    
    const unitLabel = COURSE_DATA.find(u => u.id === stats.selectedUnitId)?.title.split(':')[0] || "General";
    
    try {
      // 1. Sync Activity/Score (NOW LOCAL ONLY - NO GOOGLE SHEETS)
      await syncScoreToSheet({
        name: currentUser.name,
        unit: unitLabel,
        module: moduleId,
        score: score,
        writing_content: meta?.writing_content,
        ai_feedback: meta?.ai_writing_feedback
      });

      // 2. Set Status for Mastery Progress (NOW LOCAL ONLY)
      await updateModuleStatus(currentUser.name, moduleId, "completed", score);

      // 3. Update Local State for Instant UI Feedback
      setStats(prev => {
        if (!prev) return null;
        const currentModule = prev.moduleProgress[moduleId] || { status: 'not_started', score: 0, attempts: 0 };
        const isNewCompletion = currentModule.status !== 'completed';
        const newScore = Math.max(currentModule.score, score);
        
        // XP calculation: 50 for completion, 10 for retrying
        const isSubTask = moduleId.includes('_vocab_viewed_');
        const xpReward = isNewCompletion ? (isSubTask ? 5 : 50) : (isSubTask ? 0 : 10);
        const moduleCountIncr = isNewCompletion && !isSubTask ? 1 : 0;

        const newModuleProgress = { 
          ...prev.moduleProgress, 
          [moduleId]: { 
            status: 'completed' as const, 
            score: newScore, 
            attempts: currentModule.attempts + 1 
          } 
        };
        
        return { 
          ...prev, 
          xp: prev.xp + xpReward, 
          completedModules: prev.completedModules + moduleCountIncr, 
          moduleProgress: newModuleProgress 
        };
      });
    } catch (e) {
      console.error("Syncing failed but local progress saved:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!currentUser || !stats) return <Auth onLogin={handleLogin} />;

  const currentUnit = COURSE_DATA.find(u => u.id === stats.selectedUnitId) || COURSE_DATA[0];

  // Sequential Flow Handling
  const handleSequenceNext = (fromModule: string) => {
    switch (fromModule) {
      case 'grammar_game':
        setVocabInitialView('game');
        setActiveView('vocabulary');
        break;
      case 'vocabulary_game':
        setActiveView('listening');
        break;
      case 'listening':
        setActiveView('reading');
        break;
      case 'reading':
        setActiveView('writing');
        break;
      case 'writing':
        setActiveView('practice_test');
        break;
      default:
        setActiveView('dashboard');
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} />
      
      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        <Sidebar 
          activeView={activeView} 
          setActiveView={(view) => {
            if (view === 'vocabulary') setVocabInitialView('list');
            setActiveView(view);
          }} 
          selectedUnitId={stats.selectedUnitId} 
          onUnitChange={(uid) => { setStats(prev => prev ? ({ ...prev, selectedUnitId: uid }) : null); setActiveView('dashboard'); }} 
          user={currentUser} 
          onLogout={handleLogout} 
          onReset={handleResetProgress}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="animate-fadeIn">
                <div className="flex items-center space-x-2 mb-1">
                   <Target size={14} className="text-[#27AE60]" />
                   <h1 className="text-xl font-black text-[#27AE60] uppercase tracking-tight shadow-sm">{activeView} Hub</h1>
                </div>
                <p className="text-[#2ECC71] font-medium text-sm">Tran Hung Dao High School • {currentUnit.title}</p>
              </div>
              
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <button 
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className="flex items-center gap-3 bg-white/50 hover:bg-white text-[#2D3748] px-4 py-2.5 rounded-xl border border-slate-200 transition-all shadow-sm group"
                >
                  <div className={`p-1.5 rounded-lg ${hasApiKey ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600 animate-pulse'}`}>
                    <Settings size={18} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-600 transition-colors">AI Configuration</span>
                    {!hasApiKey ? (
                      <span className="text-[9px] font-bold text-rose-500 whitespace-nowrap">Lấy API key để sử dụng app</span>
                    ) : (
                      <span className="text-[9px] font-bold text-blue-500 flex items-center gap-1"><CheckCircle size={10} /> Active</span>
                    )}
                  </div>
                </button>

                {isSyncing && (
                  <div className="flex items-center gap-2 bg-white/20 text-[#27AE60] px-3 py-1.5 rounded-full border border-[#27AE60]/30 animate-pulse">
                     <CloudSync size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Local Saving</span>
                  </div>
                )}
                <div className="bg-green-50 text-[#27AE60] px-4 py-2 rounded-2xl font-black flex items-center shadow-lg border border-[#2ECC71]/20 ml-auto md:ml-0">
                  <CheckCircle size={14} className="text-[#27AE60] mr-2" />
                  <span className="w-5 h-5 rounded-lg bg-[#27AE60] text-white flex items-center justify-center text-[8px] mr-2 uppercase">XP</span> {stats.xp}
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#27AE60] flex items-center justify-center text-white font-black shadow-lg border-2 border-white">{stats.name.charAt(0)}</div>
              </div>
            </header>

            {activeView === 'dashboard' && <Dashboard stats={stats} unitTitle={currentUnit.title} totalModules={TOTAL_MODULES} onNavigate={setActiveView} />}
            
            {activeView === 'vocabulary' && (
              <VocabularyModule 
                studentName={stats.name} 
                vocabData={currentUnit.vocab} 
                progress={stats.moduleProgress} 
                vocabGameId={`${stats.selectedUnitId}_vocabulary_memory`} 
                onGameComplete={(id, score) => {
                  handleTaskCompletion(id, score);
                }} 
                onReturn={() => setActiveView('dashboard')}
                initialView={vocabInitialView}
                onNextStep={() => handleSequenceNext('vocabulary_game')}
              />
            )}

            {activeView === 'grammar' && (
              <GrammarModule 
                studentName={stats.name} 
                studentUsername={stats.username} 
                grammarData={currentUnit.grammar} 
                progress={stats.moduleProgress} 
                quizId={`${stats.selectedUnitId}_grammar_quiz`} 
                unitId={stats.selectedUnitId} 
                onComplete={(score) => handleTaskCompletion(`${stats.selectedUnitId}_grammar_quiz`, score)} 
                onGameComplete={(score) => {
                  handleTaskCompletion(`${stats.selectedUnitId}_grammar_game`, score);
                }}
                onReturn={() => setActiveView('dashboard')} 
                onNextStep={() => handleSequenceNext('grammar_game')}
              />
            )}

            {activeView === 'listening' && currentUnit.listening && (
              <ListeningModule 
                studentName={stats.name} 
                listeningData={currentUnit.listening} 
                onComplete={(score) => handleTaskCompletion(`${stats.selectedUnitId}_listening`, score)} 
                onReturn={() => setActiveView('dashboard')}
                onNextStep={() => handleSequenceNext('listening')}
              />
            )}

            {activeView === 'reading' && currentUnit.reading && (
              <ReadingModule 
                studentName={stats.name} 
                readingData={currentUnit.reading} 
                onComplete={(score) => handleTaskCompletion(`${stats.selectedUnitId}_reading`, score)} 
                onReturn={() => setActiveView('dashboard')}
                onNextStep={() => handleSequenceNext('reading')}
              />
            )}

            {activeView === 'writing' && (
              <WritingModule 
                studentName={stats.name}
                studentUsername={stats.username}
                writingData={currentUnit.writing}
                onComplete={(score, meta) => handleTaskCompletion(`${stats.selectedUnitId}_writing`, score, meta)}
                onReturn={() => setActiveView('dashboard')}
                onNextStep={() => handleSequenceNext('writing')}
              />
            )}

            {activeView === 'practice_test' && (
               <PracticeTest 
                studentName={stats.name}
                testData={stats.selectedUnitId === 'u4' ? UNIT4_PRACTICE_TEST : stats.selectedUnitId === 'u3' ? UNIT3_PRACTICE_TEST : stats.selectedUnitId === 'u2' ? UNIT2_PRACTICE_TEST : UNIT1_PRACTICE_TEST} 
                onComplete={(score) => handleTaskCompletion(`${stats.selectedUnitId}_practice_test`, score)} 
                onReturn={() => setActiveView('dashboard')} 
                unitProgress={stats.moduleProgress}
               />
            )}
          </div>
        </main>
      </div>

      <div className="fixed bottom-[20px] left-1/2 -translate-x-1/2 z-[1000] pointer-events-none select-none flex flex-col items-center justify-center w-auto animate-fadeIn px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md shadow-sm border border-black/5">
        <p className="text-[18px] font-bold text-[#27AE60] uppercase tracking-[0.5px] leading-tight whitespace-nowrap">
          DEVELOPED BY TEACHER VO THI THU HA
        </p>
        <p className="text-[14px] font-normal text-[#2ECC71] uppercase tracking-[0.5px] leading-tight mt-1">
          TRAN HUNG DAO HIGH SCHOOL - LAM DONG
        </p>
      </div>
    </div>
  );
};

export default App;
