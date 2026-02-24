
export interface VocabularyWord {
  id: string;
  english: string;
  phonetic?: string;
  vietnamese: string;
  example: string;
  wordFamily?: string;
  visualPrompt?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ClozeQuestion {
  id: number;
  sentence: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  illustrationUrl?: string;
}

export interface SentenceScrambleItem {
  id: number;
  scrambled: string[];
  correct_sentence: string;
  vietnamese_meaning: string;
}

export interface GrammarGame {
  id: number;
  fragments: string[];
  correct: string;
  type: string;
}

export interface GrammarMindMapNode {
  id: string;
  name: string;
  usage: string[];
  formula: string[];
  signals: string[];
}


export interface PracticeTestQuestion {
  id: number;
  type: 'multiple_choice' | 'synonym' | 'antonym' | 'word_form' | 'grammar' | 'listening_spelling';
  question?: string;
  context?: string;
  root_word?: string;
  options?: string[];
  answer: string;
  explanation: string;
  audio_placeholder?: string;
  hint?: string;
}

export interface PracticeTestSection {
  section_name: string;
  description?: string;
  questions: PracticeTestQuestion[];
}

export interface PracticeTestData {
  module_id: string;
  title: string;
  unit_context: string;
  type: string;
  total_questions: number;
  time_limit_minutes: number;
  description: string;
  sections: PracticeTestSection[];
}

export interface ErrorCorrectionQuestion {
  id: number;
  sentence: string;
  error_part: string;
  correction: string;
  explanation: string;
}

export interface ErrorCorrectionData {
  module_id: string;
  title: string;
  description: string;
  questions: ErrorCorrectionQuestion[];
}

export interface GrammarChallengeQuestion {
  id: number;
  type: 'multiple_choice' | 'error_identification';
  question: string;
  options?: string[];
  answer?: string;
  error_part?: string;
  correction?: string;
  explanation: string;
}

export interface GrammarChallengeData {
  module_id: string;
  title: string;
  unit_context: string;
  description: string;
  total_questions: number;
  questions: GrammarChallengeQuestion[];
}

export interface WordDerivative {
  form: string;
  type: string;
  meaning: string;
}

export interface WordFormEntry {
  root_word: string;
  derivatives: WordDerivative[];
}

export interface WordFormData {
  module_id: string;
  unit_context: string;
  forms: WordFormEntry[];
}

export interface SpeakingDrill {
  text: string;
  translation?: string;
  focus?: string;
}

export interface SpeakingInterview {
  question: string;
  keywords?: string[];
  modelAnswer?: string;
}

export interface SpeakingPresentation {
  prompt: string;
  requirements: string[];
  sample?: string;
}

export interface ReadingQuestion {
  id: number;
  question?: string;
  sentence?: string;
  answer: string | boolean;
  options?: string[];
  explanation?: string;
  hint?: string;
}

export interface ReadingTask {
  task_id: string;
  type: 'true_false' | 'fill_in_blanks' | 'multiple_choice';
  instruction: string;
  questions: ReadingQuestion[];
}

export interface ReadingData {
  module_id: string;
  title: string;
  unit_context: string;
  reading_text: {
    title: string;
    content: string;
  };
  tasks: ReadingTask[];
}

export interface ListeningData {
  module_id: string;
  title: string;
  unit_context: string;
  audio_source: string;
  transcript: {
    title: string;
    speakers: string[];
    content: string;
  };
  tasks: ReadingTask[];
}

export interface UnitData {
  id: string;
  title: string;
  vocab: VocabularyWord[];
  grammar: {
    topic: string;
    theory?: string;
    mindMap?: GrammarMindMapNode[];
    questions: QuizQuestion[];
    games: GrammarGame[];
  };
  speaking: {
    drills: SpeakingDrill[];
    interview: SpeakingInterview[];
    presentation?: SpeakingPresentation;
  };
  reading?: ReadingData;
  listening?: ListeningData;
}

export interface ModuleProgress {
  status: 'completed' | 'in_progress' | 'not_started';
  score: number;
  attempts: number;
}

export interface UserStats {
  username: string;
  name: string;
  level: string;
  xp: number;
  streak: number;
  badges: string[];
  lastVisit: string;
  selectedUnitId: string;
  completedModules: number;
  completedModuleIds: string[];
  moduleProgress: Record<string, ModuleProgress>;
  progress: {
    vocabulary: number;
    grammar: number;
    speaking: number;
    reading: number;
    listening: number;
    challenge: number;
  };
}

export interface UserAccount {
  username: string;
  password: string;
  name: string;
}

export interface UnitRank {
  unit_id: string;
  unit_name: string;
  student_rank: number;
  score: number;
  max_score: number;
}

export interface TopStudent {
  rank: number;
  avatar_url: string;
  name: string;
  score: number;
}

export interface UserPerformance {
  student_name: string;
  avatar_url?: string;
  current_rank: number;
  total_score: number;
  trend: 'up' | 'down' | 'stable';
  progress_percentage: number;
  message: string;
}

export interface RankingData {
  user_performance: UserPerformance;
  unit_ranks: UnitRank[];
  top_students: TopStudent[];
  total_students: number;
}

export type ViewType = 'dashboard' | 'vocabulary' | 'grammar' | 'speaking' | 'reading' | 'listening' | 'practice_test' | 'teacher_dashboard';
