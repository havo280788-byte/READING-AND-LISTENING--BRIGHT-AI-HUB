
import React, { useState, useEffect, useMemo } from 'react';
import { ViewType, UserStats, UserAccount } from './types';
import {
  COURSE_DATA,
  UNIT1_PRACTICE_TEST,
  UNIT2_PRACTICE_TEST,
  UNIT3_PRACTICE_TEST,
  UNIT4_PRACTICE_TEST,
  UNIT5_PRACTICE_TEST,
  UNIT6_PRACTICE_TEST,
  UNIT7_PRACTICE_TEST,
  UNIT8_PRACTICE_TEST
} from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VocabularyModule from './components/VocabularyModule';
import GrammarModule from './components/GrammarModule';
import ReadingModule from './components/ReadingModule';
import ListeningModule from './components/ListeningModule';
import PracticeTest from './components/PracticeTest';
import Auth from './components/Auth';
import ApiKeyModal from './components/ApiKeyModal';
import TeacherDashboard from './components/TeacherDashboard';
import { Target, CheckCircle, CloudSync, Settings, Book, Puzzle, Headphones, BookOpen, Shield, LayoutDashboard, Mic, Zap, Database, GraduationCap } from 'lucide-react';
import { syncScoreToSheet, updateModuleStatus, getActiveApiKey } from './services/geminiService';
import { saveStudentProgress, loadStudentProgress, loadAllStudentsProgress, isFirebaseConfigured, setFirebaseUrl, getFirebaseUrl } from './services/firebaseService';

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
  const [firebaseStudents, setFirebaseStudents] = useState<Record<string, any>>({});

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('elite_eng_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [stats, setStats] = useState<UserStats | null>(() => {
    const savedUser = localStorage.getItem('elite_eng_current_user');
    if (!savedUser) return null;
    const user = JSON.parse(savedUser);
    const savedStats = localStorage.getItem(`${STORAGE_KEY_PREFIX}_${user.username}`);
    if (!savedStats) return INITIAL_STATS(user.username, user.name);

    const parsed = JSON.parse(savedStats);
    // Recalculate progress from moduleProgress to ensure it's always up-to-date
    const uid = parsed.selectedUnitId || 'u1';
    const mp = parsed.moduleProgress || {};
    parsed.progress = {
      vocabulary: Math.max(mp[`${uid}_vocabulary_memory`]?.score || 0, mp[`${uid}_vocabulary_escape`]?.score || 0),
      grammar: mp[`${uid}_grammar_quiz`]?.score || 0,
      speaking: 0,
      reading: mp[`${uid}_reading`]?.score || 0,
      listening: mp[`${uid}_listening`]?.score || 0,
      challenge: mp[`${uid}_practice_test`]?.score || 0
    };
    return parsed;
  });

  const hasApiKey = !!getActiveApiKey();

  // Check for API Key on load
  useEffect(() => {
    const key = getActiveApiKey();
    if (!key) {
      setIsApiKeyModalOpen(true);
    }
  }, []);

  // Auto-import Firebase URL from ?fb= query parameter AND sync local data
  useEffect(() => {
    // Step 1: Import Firebase URL from query params if present
    const params = new URLSearchParams(window.location.search);
    const fbParam = params.get('fb');
    if (fbParam) {
      setFirebaseUrl(fbParam);
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('fb');
      window.history.replaceState({}, '', url.toString());
    }

    // Step 2: Auto-sync local data to Firebase (runs after URL is set above)
    const syncOnLoad = async () => {
      if (isFirebaseConfigured() && currentUser && stats) {
        try {
          await saveStudentProgress(currentUser.username, stats);
          console.log('Auto-synced local data to Firebase on load');
          // Also refresh leaderboard after sync
          const allData = await loadAllStudentsProgress();
          if (allData && Object.keys(allData).length > 0) {
            setFirebaseStudents(allData);
          }
        } catch (e) {
          console.warn('Auto-sync on load failed:', e);
        }
      }
    };
    syncOnLoad();
  }, []); // Run once on mount

  // Refresh Firebase leaderboard data
  const refreshFirebaseData = async () => {
    if (isFirebaseConfigured()) {
      try {
        const allData = await loadAllStudentsProgress();
        if (allData && Object.keys(allData).length > 0) {
          setFirebaseStudents(allData);
        }
      } catch (e) {
        console.warn('Firebase refresh failed:', e);
      }
    }
  };

  useEffect(() => {
    refreshFirebaseData();
    const interval = setInterval(refreshFirebaseData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Name Normalization Effect - only depends on currentUser
  useEffect(() => {
    if (currentUser) {
      const normalizedName = normalizeName(currentUser.name);

      if (currentUser.name !== normalizedName) {
        const newUser = { ...currentUser, name: normalizedName };
        setCurrentUser(newUser);
        localStorage.setItem('elite_eng_current_user', JSON.stringify(newUser));

        setStats(prev => prev ? { ...prev, name: normalizedName } : null);
      }
    }
  }, [currentUser]);

  // Remote sync disabled - app runs in local-only mode
  // Progress is loaded from localStorage in handleLogin and initial state

  // Helper: recalculate progress from moduleProgress (called inline, not via useEffect)
  const recalculateProgress = (moduleProgress: Record<string, any>, unitId: string) => {
    return {
      vocabulary: Math.max(
        moduleProgress[`${unitId}_vocabulary_memory`]?.score || 0,
        moduleProgress[`${unitId}_vocabulary_escape`]?.score || 0
      ),
      grammar: moduleProgress[`${unitId}_grammar_quiz`]?.score || 0,
      speaking: 0,
      reading: moduleProgress[`${unitId}_reading`]?.score || 0,
      listening: moduleProgress[`${unitId}_listening`]?.score || 0,
      challenge: moduleProgress[`${unitId}_practice_test`]?.score || 0
    };
  };

  // Recalculate progress whenever unit changes
  useEffect(() => {
    if (!stats) return;
    const nextProgress = recalculateProgress(stats.moduleProgress, stats.selectedUnitId);
    if (JSON.stringify(stats.progress) !== JSON.stringify(nextProgress)) {
      setStats(prev => prev ? ({ ...prev, progress: nextProgress }) : null);
    }
  }, [stats?.selectedUnitId]);

  // Save Local Storage changes
  useEffect(() => {
    if (stats && currentUser) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_${currentUser.username}`, JSON.stringify(stats));
    }
  }, [stats, currentUser]);

  const handleLogin = async (user: UserAccount) => {
    const normalizedUser = { ...user, name: normalizeName(user.name) };
    setCurrentUser(normalizedUser);
    localStorage.setItem('elite_eng_current_user', JSON.stringify(normalizedUser));

    const localStats = localStorage.getItem(`${STORAGE_KEY_PREFIX}_${normalizedUser.username}`);
    let finalStats = localStats ? JSON.parse(localStats) : INITIAL_STATS(normalizedUser.username, normalizedUser.name);

    // Try to load from Firebase and merge (remote takes priority for XP/modules)
    if (isFirebaseConfigured()) {
      try {
        const remoteData = await loadStudentProgress(normalizedUser.username);
        if (remoteData) {
          // Merge: take the higher XP, more completed modules, and merge moduleProgress
          const mergedModuleProgress = { ...finalStats.moduleProgress };
          if (remoteData.moduleProgress) {
            for (const [key, val] of Object.entries(remoteData.moduleProgress as Record<string, any>)) {
              const localVal = mergedModuleProgress[key];
              if (!localVal || (val && (val as any).score > (localVal as any).score)) {
                mergedModuleProgress[key] = val;
              }
            }
          }
          finalStats = {
            ...finalStats,
            xp: Math.max(finalStats.xp || 0, remoteData.xp || 0),
            completedModules: Math.max(finalStats.completedModules || 0, remoteData.completedModules || 0),
            moduleProgress: mergedModuleProgress,
            selectedUnitId: remoteData.selectedUnitId || finalStats.selectedUnitId
          };
        }

        // Push merged data BACK to Firebase (so local-only progress gets synced)
        await saveStudentProgress(normalizedUser.username, finalStats);

        // Refresh leaderboard
        const allData = await loadAllStudentsProgress();
        if (allData) setFirebaseStudents(allData);
      } catch (e) {
        console.warn('Firebase merge skipped:', e);
      }
    }

    // Recalculate progress from moduleProgress immediately (not via useEffect)
    finalStats.progress = recalculateProgress(finalStats.moduleProgress || {}, finalStats.selectedUnitId);

    setStats(finalStats);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_${normalizedUser.username}`, JSON.stringify(finalStats));
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

  const handleTaskCompletion = async (moduleId: string, score: number) => {
    if (!stats || !currentUser) return;
    setIsSyncing(true);

    const unitLabel = COURSE_DATA.find(u => u.id === stats.selectedUnitId)?.title.split(':')[0] || "General";

    try {
      // 1. Sync Activity/Score (NOW LOCAL ONLY - NO GOOGLE SHEETS)
      await syncScoreToSheet({
        name: currentUser.name,
        unit: unitLabel,
        module: moduleId,
        score: score
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

        // Recalculate progress immediately from the new moduleProgress
        const newProgress = recalculateProgress(newModuleProgress, prev.selectedUnitId);

        // Track completed module IDs
        const newCompletedIds = isNewCompletion && !isSubTask
          ? [...(prev.completedModuleIds || []), moduleId]
          : (prev.completedModuleIds || []);

        const updatedStats = {
          ...prev,
          xp: prev.xp + xpReward,
          completedModules: prev.completedModules + moduleCountIncr,
          completedModuleIds: newCompletedIds,
          moduleProgress: newModuleProgress,
          progress: newProgress
        };

        // 4. Sync to Firebase (fire and forget)
        if (isFirebaseConfigured() && currentUser) {
          saveStudentProgress(currentUser.username, updatedStats).then(() => {
            // Refresh leaderboard after sync
            loadAllStudentsProgress().then(allData => {
              if (allData) setFirebaseStudents(allData);
            });
          });
        }

        return updatedStats;
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
                  {activeView === 'dashboard' && <LayoutDashboard size={16} className="text-[#27AE60]" />}
                  {activeView === 'vocabulary' && <Book size={16} className="text-[#27AE60]" />}
                  {activeView === 'grammar' && <Puzzle size={16} className="text-[#27AE60]" />}
                  {activeView === 'listening' && <Headphones size={16} className="text-[#27AE60]" />}
                  {activeView === 'reading' && <BookOpen size={16} className="text-[#27AE60]" />}
                  {activeView === 'practice_test' && <Shield size={16} className="text-[#27AE60]" />}
                  {activeView === 'teacher_dashboard' && <GraduationCap size={16} className="text-[#27AE60]" />}
                  <h1 className="text-xl font-black text-[#27AE60] uppercase tracking-tight shadow-sm">{activeView === 'practice_test' ? 'Challenge' : activeView === 'teacher_dashboard' ? 'Teacher' : activeView} Hub</h1>
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

                {/* Firebase Status Indicator */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${isFirebaseConfigured() ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
                  <Database size={12} />
                  <span className="hidden md:inline">{isFirebaseConfigured() ? 'Firebase ✓' : 'No Firebase'}</span>
                  <span className={`w-2 h-2 rounded-full ${isFirebaseConfigured() ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`} />
                </div>

                {isSyncing && (
                  <div className="flex items-center gap-2 bg-white/20 text-[#27AE60] px-3 py-1.5 rounded-full border border-[#27AE60]/30 animate-pulse">
                    <CloudSync size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Local Saving</span>
                  </div>
                )}
                <div className="bg-green-50 text-[#27AE60] px-4 py-2 rounded-2xl font-black flex items-center shadow-lg border border-[#2ECC71]/20 ml-auto md:ml-0">
                  <Zap size={14} className="text-[#27AE60] mr-2" />
                  <span className="w-5 h-5 rounded-lg bg-[#27AE60] text-white flex items-center justify-center text-[8px] mr-2 uppercase">XP</span> {stats.xp}
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#27AE60] flex items-center justify-center text-white font-black shadow-lg border-2 border-white">{stats.name.charAt(0)}</div>
              </div>
            </header>

            {activeView === 'dashboard' && <Dashboard stats={stats} unitTitle={currentUnit.title} totalModules={TOTAL_MODULES} onNavigate={setActiveView} firebaseStudents={firebaseStudents} />}

            {activeView === 'teacher_dashboard' && currentUser?.username === 'student53' && <TeacherDashboard firebaseStudents={firebaseStudents} onRefresh={refreshFirebaseData} />}

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


            {activeView === 'practice_test' && (
              <PracticeTest
                studentName={stats.name}
                testData={{
                  u1: UNIT1_PRACTICE_TEST,
                  u2: UNIT2_PRACTICE_TEST,
                  u3: UNIT3_PRACTICE_TEST,
                  u4: UNIT4_PRACTICE_TEST,
                  u5: UNIT5_PRACTICE_TEST,
                  u6: UNIT6_PRACTICE_TEST,
                  u7: UNIT7_PRACTICE_TEST,
                  u8: UNIT8_PRACTICE_TEST
                }[stats.selectedUnitId] || UNIT1_PRACTICE_TEST}
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
          ✨ DEVELOPED BY TEACHER VO THI THU HA ✨
        </p>
        <p className="text-[14px] font-normal text-[#2ECC71] uppercase tracking-[0.5px] leading-tight mt-1">
          🏫 TRAN HUNG DAO HIGH SCHOOL - LAM DONG
        </p>
      </div>
    </div>
  );
};

export default App;
