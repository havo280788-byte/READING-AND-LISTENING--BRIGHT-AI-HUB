import React from 'react';

// --- Card Component ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-white/5 rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:shadow-xl backdrop-blur-xl ${className}`}>
    {title && (
      <div className="px-8 py-6 border-b border-white/10 bg-white/5">
        <h3 className="font-bold text-xl text-white tracking-tight">{title}</h3>
      </div>
    )}
    <div className="p-8">{children}</div>
  </div>
);

// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading, className = '', ...props }) => {
  const baseStyle = "px-8 py-3.5 rounded-2xl text-lg font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-sm";

  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5",
    secondary: "bg-white/10 text-slate-300 border-2 border-white/10 hover:bg-white/20 hover:border-white/20",
    outline: "border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
        <>
          <i className="fas fa-circle-notch fa-spin"></i> Processing...
        </>
      ) : children}
    </button>
  );
};

// --- Score Circle ---
export const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const getColor = (s: number) => {
    if (s >= 8.0) return 'text-green-400 border-green-500/50 bg-green-500/10';
    if (s >= 6.0) return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
    if (s >= 4.0) return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
    return 'text-red-400 border-red-500/50 bg-red-500/10';
  };

  return (
    <div className={`w-32 h-32 rounded-full border-[6px] flex items-center justify-center ${getColor(score)} shadow-inner transition-all duration-500 transform hover:scale-105`}>
      <span className="text-5xl font-extrabold tracking-tighter">{score.toFixed(1)}</span>
    </div>
  );
};

// --- Score Breakdown ---
export const ScoreBreakdown: React.FC<{ breakdown: Record<string, number>; max?: number }> = ({ breakdown, max = 10 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
    {Object.entries(breakdown).map(([key, value]) => {
      const val = value as number;
      return (
        <div key={key} className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between text-sm font-bold text-slate-400 mb-3 uppercase tracking-wide">
            <span>{key}</span>
            <span className="text-white text-base">{val}/{max}</span>
          </div>
          <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden p-[2px]">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${val >= max * 0.8 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                val >= max * 0.5 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                  'bg-gradient-to-r from-yellow-400 to-yellow-500'
                }`}
              style={{ width: `${(val / max) * 100}%` }}
            ></div>
          </div>
        </div>
      );
    })}
  </div>
);

// --- Rubric Feedback Card (Chi tiết chấm điểm theo rubric) ---
interface RubricFeedbackItem {
  criterion: string;
  score: number;
  maxScore: number;
  feedback: string;
  suggestions: string[];
}

const getCriterionIcon = (criterion: string) => {
  switch (criterion.toLowerCase()) {
    // IELTS Speaking criteria
    case 'fluency and coherence': return 'fa-water';
    case 'lexical resource': return 'fa-book';
    case 'grammatical range and accuracy': return 'fa-spell-check';
    case 'grammatical accuracy': return 'fa-spell-check';
    case 'pronunciation': return 'fa-volume-up';
    // Legacy speaking criteria (fallback)
    case 'content': return 'fa-lightbulb';
    case 'language': return 'fa-language';
    case 'fluency': return 'fa-water';
    // Legacy shadowing criteria
    case 'articulation': return 'fa-microphone';
    case 'intonation': return 'fa-music';
    case 'confidence': return 'fa-user-check';
    // IELTS Writing criteria
    case 'task response': return 'fa-tasks';
    case 'coherence and cohesion': return 'fa-link';
    case 'coherence': return 'fa-link';
    case 'vocabulary': return 'fa-book';
    case 'grammar': return 'fa-spell-check';
    default: return 'fa-star';
  }
};

const getCriterionColor = (criterion: string) => {
  switch (criterion.toLowerCase()) {
    // IELTS Speaking criteria
    case 'fluency and coherence': return { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20', gradient: 'from-teal-400 to-teal-500' };
    case 'lexical resource': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', gradient: 'from-emerald-400 to-emerald-500' };
    case 'grammatical range and accuracy': return { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', gradient: 'from-violet-400 to-violet-500' };
    case 'grammatical accuracy': return { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', gradient: 'from-violet-400 to-violet-500' };
    case 'pronunciation': return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', gradient: 'from-orange-400 to-orange-500' };
    // Legacy speaking criteria (fallback)
    case 'content': return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', gradient: 'from-purple-400 to-purple-500' };
    case 'language': return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', gradient: 'from-blue-400 to-blue-500' };
    case 'fluency': return { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20', gradient: 'from-teal-400 to-teal-500' };
    // Legacy shadowing criteria
    case 'articulation': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', gradient: 'from-red-400 to-red-500' };
    case 'intonation': return { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', gradient: 'from-pink-400 to-pink-500' };
    case 'confidence': return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', gradient: 'from-amber-400 to-amber-500' };
    // IELTS Writing criteria
    case 'task response': return { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', gradient: 'from-indigo-400 to-indigo-500' };
    case 'coherence and cohesion': return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', gradient: 'from-cyan-400 to-cyan-500' };
    case 'coherence': return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', gradient: 'from-cyan-400 to-cyan-500' };
    case 'vocabulary': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', gradient: 'from-emerald-400 to-emerald-500' };
    case 'grammar': return { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', gradient: 'from-violet-400 to-violet-500' };
    default: return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', gradient: 'from-slate-400 to-slate-500' };
  }
};

export const RubricFeedbackCard: React.FC<{ rubricFeedback: RubricFeedbackItem[] }> = ({ rubricFeedback }) => (
  <div className="space-y-6">
    <h4 className="text-xl font-bold text-white flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
        <i className="fas fa-clipboard-check"></i>
      </div>
      Detailed Rubric Assessment
    </h4>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {rubricFeedback.map((item, idx) => {
        const colors = getCriterionColor(item.criterion);
        const percentage = (item.score / item.maxScore) * 100;

        return (
          <div
            key={idx}
            className={`${colors.bg} rounded-2xl border ${colors.border} p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 shadow-sm flex items-center justify-center ${colors.text}`}>
                  <i className={`fas ${getCriterionIcon(item.criterion)} text-xl`}></i>
                </div>
                <div>
                  <h5 className="font-bold text-white text-lg">{item.criterion}</h5>
                  <p className="text-sm text-slate-400">Assessment Criterion</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-extrabold ${colors.text}`}>
                  {item.score}
                  <span className="text-lg text-slate-500 font-normal">/{item.maxScore}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden mb-4 shadow-inner">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${colors.gradient} transition-all duration-1000 ease-out`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            {/* Feedback */}
            <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/5 shadow-inner">
              <p className="text-slate-200 leading-relaxed">{item.feedback}</p>
            </div>

            {/* Suggestions */}
            {item.suggestions && item.suggestions.length > 0 && (
              <div className="space-y-2">
                <p className={`text-sm font-bold ${colors.text} uppercase tracking-wide flex items-center gap-2`}>
                  <i className="fas fa-magic"></i> Improvement Suggestions
                </p>
                <ul className="space-y-2">
                  {item.suggestions.map((suggestion, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2 text-slate-300 text-sm bg-white/5 border border-white/5 rounded-lg p-3 shadow-inner">
                      <span className={`w-5 h-5 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border ${colors.border}`}>
                        {sIdx + 1}
                      </span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

// --- Detailed Errors Section ---
interface DetailedError {
  original: string;
  correction: string;
  explanation: string;
  type: 'grammar' | 'vocabulary' | 'pronunciation' | 'coherence';
}

export const DetailedErrorsSection: React.FC<{ errors: DetailedError[] }> = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'grammar': return { icon: 'fa-spell-check', bg: 'bg-red-500/10', text: 'text-red-400', label: 'Grammar' };
      case 'vocabulary': return { icon: 'fa-book', bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Vocabulary' };
      case 'pronunciation': return { icon: 'fa-volume-up', bg: 'bg-orange-500/10', text: 'text-orange-400', label: 'Pronunciation' };
      case 'coherence': return { icon: 'fa-link', bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'Coherence' };
      default: return { icon: 'fa-exclamation-circle', bg: 'bg-slate-500/10', text: 'text-slate-400', label: 'Other' };
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-xl font-bold text-white flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        Errors to Correct
      </h4>

      <div className="space-y-4">
        {errors.map((error, idx) => {
          const typeInfo = getTypeInfo(error.type);
          return (
            <div key={idx} className="bg-white/5 rounded-2xl border border-white/10 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl ${typeInfo.bg} ${typeInfo.text} flex items-center justify-center shrink-0 border border-white/5`}>
                  <i className={`fas ${typeInfo.icon}`}></i>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${typeInfo.bg} ${typeInfo.text} border border-white/5`}>
                      {typeInfo.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="line-through text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg font-medium border border-red-500/20">
                      {error.original}
                    </span>
                    <i className="fas fa-arrow-right text-slate-500"></i>
                    <span className="text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg font-medium border border-green-500/20">
                      {error.correction}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm bg-black/20 rounded-lg p-3 border border-white/5">
                    <i className="fas fa-info-circle text-blue-400 mr-2"></i>
                    {error.explanation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};