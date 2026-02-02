
import React, { useState } from 'react';

interface EntranceTestProps {
  onComplete: (level: string) => void;
}

const TEST_QUESTIONS = [
  {
    question: "Choose the word that has a different stress pattern:",
    options: ["Generation", "Experience", "Information", "Education"],
    correct: 1 // Experience (2nd syllable), others are 3rd
  },
  {
    question: "I ____ English since I was in primary school.",
    options: ["studied", "have studied", "was studying", "study"],
    correct: 1
  },
  {
    question: "Conflicts often ____ when parents and children don't understand each other.",
    options: ["happen", "happened", "are happening", "happenings"],
    correct: 0
  },
  {
    question: "The generation gap is the difference ____ attitudes and behavior between generations.",
    options: ["on", "with", "in", "between"],
    correct: 2
  },
  {
    question: "He is a very ____ student. He always finishes his homework early.",
    options: ["lazy", "hard-working", "active", "creative"],
    correct: 1
  }
];

const EntranceTest: React.FC<EntranceTestProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (index: number) => {
    if (index === TEST_QUESTIONS[step].correct) {
      setScore(s => s + 1);
    }

    if (step < TEST_QUESTIONS.length - 1) {
      setStep(s => s + 1);
    } else {
      setFinished(true);
    }
  };

  const getLevel = () => {
    if (score <= 2) return "Grade 11 - Pre-Intermediate";
    if (score <= 4) return "Grade 11 - Intermediate";
    return "Grade 11 - Advanced";
  };

  if (finished) {
    const assignedLevel = getLevel();
    return (
      <div className="max-w-2xl mx-auto bg-white p-12 rounded-3xl shadow-2xl text-center animate-fadeIn">
        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">
          <i className="fa-solid fa-award"></i>
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-4">Assessment Complete!</h2>
        <p className="text-slate-500 mb-8 text-lg">Based on your performance, we've assigned you to:</p>
        <div className="bg-blue-600 text-white p-6 rounded-2xl mb-10 shadow-xl shadow-blue-100 transform hover:scale-105 transition-transform cursor-default">
          <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Assigned Level</p>
          <p className="text-2xl font-black">{assignedLevel}</p>
        </div>
        <button 
          onClick={() => onComplete(assignedLevel)}
          className="bg-slate-800 text-white px-12 py-4 rounded-2xl font-bold shadow-lg hover:bg-slate-900 transition-all"
        >
          Start Learning Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 animate-slideUp">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Placement Test</h2>
          <span className="text-blue-600 font-bold">{Math.round(((step) / TEST_QUESTIONS.length) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${(step / TEST_QUESTIONS.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-slate-700 leading-relaxed">
          {TEST_QUESTIONS[step].question}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {TEST_QUESTIONS[step].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="p-5 text-left border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-slate-600"
            >
              <span className="w-8 h-8 rounded-full bg-slate-100 inline-flex items-center justify-center mr-4 text-xs font-bold text-slate-400">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EntranceTest;
