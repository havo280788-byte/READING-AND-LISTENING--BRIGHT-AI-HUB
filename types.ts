
export enum SkillMode {
  DASHBOARD = 'dashboard',
  SPEAKING = 'speaking',
  WRITING = 'writing',
  SETTINGS = 'settings'
}

export interface UserStats {
  speakingScore: number[];
  writingScore: number[];
  lessonsCompleted: number;
  streak: number;
  lastPractice: string;
}

export interface FeedbackItem {
  original: string;
  correction: string;
  explanation: string;
  type: 'grammar' | 'vocabulary' | 'pronunciation' | 'coherence';
}

// Rubric feedback chi tiết cho từng tiêu chí
export interface RubricFeedbackItem {
  criterion: string; // Tên tiêu chí: Content, Language, Pronunciation, Fluency
  score: number; // Điểm đạt được
  maxScore: number; // Điểm tối đa
  feedback: string; // Nhận xét chi tiết cho tiêu chí này
  suggestions: string[]; // Gợi ý cải thiện
}

export interface AIResponse {
  score: number;
  scoreBreakdown?: Record<string, number>; // Detailed score criteria
  feedback: string; // General feedback
  detailedErrors: FeedbackItem[];
  improvedVersion?: string; // For writing
  transcription?: string; // For speaking
  rubricFeedback?: RubricFeedbackItem[]; // Chi tiết chấm điểm theo rubric
}

export interface ChatMessage {
  role: 'ai' | 'user';
  text: string;
  audioUrl?: string; // Optional: if we want to play back user audio
}

export interface HistoryItem {
  id: string;
  date: string;
  mode: 'speaking' | 'writing';
  score: number;
  summary: string;
}

// Gemini specific types
export interface GeminiConfig {
  apiKey: string;
}

export interface AppSettings {
  apiKey: string;
  selectedModel: string;
}

export const AI_MODELS = [
  { id: 'gemini-3-pro-preview', name: '3 Pro', desc: 'Chất lượng cao nhất', icon: 'fa-crosshairs', color: 'text-pink-400', bgColor: 'bg-pink-500/10', borderColor: 'border-pink-500/20', badge: 'MẶC ĐỊNH' },
  { id: 'gemini-3-flash', name: '3 Flash', desc: 'Nhanh & Mạnh mẽ', icon: 'fa-bolt', color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/20' },
  { id: 'gemini-2.5-flash', name: '2.5 Flash', desc: 'Ổn định & An toàn', icon: 'fa-lock', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/20' }
];
