
import React, { useState, useEffect, useMemo } from 'react';
import useGameSound from '../hooks/useGameSound';

interface Segment {
  text?: string;
  type?: 'input';
  hint?: string;
  correct?: string;
  explanation?: string;
}

interface StoryLevel {
  id: number;
  title: string;
  image: string;
  segments: Segment[];
}

const UNIT1_STORY: StoryLevel[] = [
  {
    id: 1,
    title: "Level 1: The Concert",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "Look at Mark! He " },
      { type: "input", hint: "stand", correct: "is standing", explanation: "Happening right now." },
      { text: " in the corner. Usually, he " },
      { type: "input", hint: "love", correct: "loves", explanation: "Stative verb / General truth." },
      { text: " rock music, but today he " },
      { type: "input", hint: "seem", correct: "seems", explanation: "Linking verb (state)." }
    ]
  }
];

const UNIT2_STORY: StoryLevel[] = [
  {
    id: 1,
    title: "The Historical Citadel",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "Yesterday, Lan " },
      { type: "input", hint: "visit", correct: "visited", explanation: "Past Simple for finished action." },
      { text: " the Hue Imperial Citadel. While she " },
      { type: "input", hint: "walk", correct: "was walking", explanation: "Past Continuous for background action." },
      { text: " through the gates, it " },
      { type: "input", hint: "start", correct: "started", explanation: "Past Simple for interrupting action." }
    ]
  }
];

const UNIT3_STORY: StoryLevel[] = [
  {
    id: 1,
    title: "Level 1: Environmental Rescue",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "Look! The volunteers " },
      { type: "input", hint: "save", correct: "have saved", explanation: "Present Perfect for achievement so far." },
      { text: " ten sea turtles so far. Last week, they " },
      { type: "input", hint: "clean", correct: "cleaned", explanation: "Past Simple for specific time 'last week'." },
      { text: " the whole beach. Since 2010, the local community " },
      { type: "input", hint: "plant", correct: "has planted", explanation: "Present Perfect with 'since'." },
      { text: " thousands of trees." }
    ]
  }
];

const UNIT4_STORY: StoryLevel[] = [
  {
    id: 1,
    title: "Level 1: The Preservation Project",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eaa0ae?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "The team discovered that " },
      { type: "input", hint: "neither / nor", correct: "neither the castle nor the temple", explanation: "Neither... nor for two items." },
      { text: " was safe from erosion. We need to hire " },
      { type: "input", hint: "both / and", correct: "both an architect and a historian", explanation: "Both... and for two items." },
      { text: " to start the repair. " },
      { type: "input", hint: "not only / but also", correct: "Not only the roof but also the walls", explanation: "Not only... but also for emphasis." },
      { text: " are collapsing due to heavy rain." }
    ]
  },
  {
    id: 2,
    title: "Level 2: Compound Clues",
    image: "https://images.unsplash.com/photo-1510217627448-93666f7f6311?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "We followed our " },
      { type: "input", hint: "tour guide", correct: "tour guide", explanation: "Compound Noun (Tour + Guide)." },
      { text: " to the old " },
      { type: "input", hint: "lighthouse", correct: "lighthouse", explanation: "Compound Noun (Light + House)." },
      { text: " near the cliff. He told us that " },
      { type: "input", hint: "either / or", correct: "either we stay here or we move", explanation: "Either... or for choice." },
      { text: " to the shelter before the storm hits the " },
      { type: "input", hint: "greenhouse", correct: "greenhouse", explanation: "Compound Noun (Green + House)." }
    ]
  }
];

const UNIT5_STORY: StoryLevel[] = [
  {
    id: 1,
    title: "MINH'S MORNING IN 2050",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "In the year 2050, Minh wakes up in his smart apartment in the city. The digital roads outside his window are busy, and flying vehicles " },
      { type: "input", hint: "probably / replace", correct: "will probably replace", explanation: "Use 'will + adverb + verb' for predictions." },
      { text: " traditional cars very soon. Minh looks at the sky and sees many drones, so he thinks that they " },
      { type: "input", hint: "be / likely", correct: "are likely", explanation: "Use 'be likely to' for probability." },
      { text: " to become more common in the future. His smart mirror shows today’s schedule and says that his online lesson " },
      { type: "input", hint: "start", correct: "is going to start", explanation: "Use 'be going to' for predictions based on evidence." },
      { text: " in ten minutes. Minh believes that schools " },
      { type: "input", hint: "definitely / change", correct: "will definitely change", explanation: "Use 'will + adverb + verb' for strong beliefs." },
      { text: " in the future. Students " },
      { type: "input", hint: "may / not / go", correct: "may not go", explanation: "Use 'may not' for possibility." },
      { text: " to school buildings anymore, and teachers " },
      { type: "input", hint: "teach / likely", correct: "are likely to teach", explanation: "Use 'be likely to + verb' structure." },
      { text: " through hologram devices instead." }
    ]
  }
];

// Placeholders for future units
const UNIT6_STORY: StoryLevel[] = [{ id: 1, title: "Social Issues", image: "https://source.unsplash.com/random/800x600/?community", segments: [] }];
const UNIT7_STORY: StoryLevel[] = [{ id: 1, title: "Healthy Life", image: "https://source.unsplash.com/random/800x600/?health", segments: [] }];
const UNIT8_STORY: StoryLevel[] = [{ id: 1, title: "Longevity", image: "https://source.unsplash.com/random/800x600/?senior", segments: [] }];

interface GrammarSecretAdmirerProps {
  currentTopic: string;
  onReturn: () => void;
  onComplete: (score: number) => void;
}

const GrammarSecretAdmirer: React.FC<GrammarSecretAdmirerProps> = ({ currentTopic, onReturn, onComplete }) => {
  const [levelIdx, setLevelIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [validated, setValidated] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});
  const { playCorrect, playWrong, playPop } = useGameSound();

  const storyData = useMemo(() => {
    if (currentTopic.includes("Past Tenses")) return UNIT2_STORY;
    if (currentTopic.includes("Present Perfect")) return UNIT3_STORY;
    if (currentTopic.includes("Paired Conjunctions")) return UNIT4_STORY;
    if (currentTopic.includes("Future Forms")) return UNIT5_STORY;
    if (currentTopic.includes("Linking Words")) return UNIT6_STORY;
    if (currentTopic.includes("Modals")) return UNIT7_STORY;
    if (currentTopic.includes("Reported Speech")) return UNIT8_STORY;
    return UNIT1_STORY;
  }, [currentTopic]);

  const currentLevel = storyData[levelIdx];

  const handleInputChange = (idx: number, val: string) => {
    setAnswers(prev => ({ ...prev, [idx]: val }));
  };

  const validate = () => {
    // Auto-pass if no segments (placeholder state)
    if (!currentLevel.segments || currentLevel.segments.length === 0) {
        onComplete(100);
        return;
    }

    const newResults: Record<number, boolean> = {};
    currentLevel.segments.forEach((seg, idx) => {
      if (seg.type === 'input') {
        const isCorrect = (answers[idx] || '').trim().toLowerCase() === seg.correct?.toLowerCase();
        newResults[idx] = isCorrect;
      }
    });

    const isPerfect = Object.values(newResults).every(v => v === true);
    setResults(newResults);
    setValidated(true);

    if (isPerfect) playCorrect(); else playWrong();
  };

  const nextLevel = () => {
    playPop();
    if (levelIdx < storyData.length - 1) {
      setLevelIdx(prev => prev + 1);
      setAnswers({});
      setValidated(false);
      setResults({});
    } else {
      onComplete(100);
    }
  };

  const allCorrect = validated && Object.values(results).every(v => v === true);

  if (!currentLevel.segments || currentLevel.segments.length === 0) {
      return (
        <div className="min-h-[50vh] bg-[#050510] rounded-[2.5rem] flex flex-col items-center justify-center p-12 border-4 border-white/5 text-center">
            <h2 className="text-3xl font-bold text-white uppercase italic tracking-tighter mb-4">Story Coming Soon</h2>
            <p className="text-slate-400 mb-8">This grammar adventure is currently being written.</p>
            <button onClick={() => onComplete(100)} className="bg-cyan-500 text-slate-950 px-10 py-4 rounded-2xl font-black uppercase text-sm hover:scale-105 transition-transform">
                Skip to Next Stage
            </button>
        </div>
      )
  }

  return (
    <div className="min-h-[80vh] bg-[#050510] rounded-[2.5rem] overflow-hidden flex flex-col p-6 md:p-12 border-4 border-white/5">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white uppercase italic tracking-tighter">RECOVERING KNOWLEDGE</h2>
        <div className="flex space-x-2">
          {storyData.map((_, i) => (
            <div key={i} className={`w-10 h-2 rounded-full transition-all ${i <= levelIdx ? 'bg-cyan-400' : 'bg-white/10'}`}></div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col lg:flex-row gap-10">
        <div className="lg:w-1/3 flex flex-col space-y-6">
          <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 relative group">
            <img src={currentLevel.image} alt={currentLevel.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            <div className="absolute bottom-6 left-6"><h3 className="text-xl font-bold text-white">{currentLevel.title}</h3></div>
          </div>
        </div>
        <div className="lg:w-2/3 bg-white/5 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border border-white/10 flex flex-col justify-between">
          <div className="text-lg md:text-xl text-white font-medium leading-[2.2]">
            {currentLevel.segments.map((seg, i) => {
              if (seg.type === 'input') {
                const isWrong = validated && results[i] === false;
                const isRight = validated && results[i] === true;
                return (
                  <span key={i} className="inline-block relative mx-1">
                    <input 
                      type="text" 
                      value={answers[i] || ''} 
                      onChange={(e) => handleInputChange(i, e.target.value)} 
                      disabled={allCorrect} 
                      placeholder={`(${seg.hint})`} 
                      className={`w-40 bg-transparent border-b-2 text-center outline-none py-1 ${isWrong ? 'border-red-500 text-red-400' : isRight ? 'border-green-500 text-green-400' : 'border-gray-600 focus:border-cyan-400 text-white'}`}
                    />
                    {isWrong && <div className="absolute top-full left-0 bg-red-950 text-red-200 text-[10px] p-2 rounded z-20"><p>{seg.correct}</p><p className="opacity-70">{seg.explanation}</p></div>}
                  </span>
                );
              }
              return <span key={i}>{seg.text}</span>;
            })}
          </div>
          <div className="mt-12 flex justify-end">
            {!allCorrect ? (
              <button onClick={validate} className="bg-cyan-400 text-slate-900 px-8 py-3 rounded-xl font-black uppercase text-xs">VERIFY SEQUENCE</button>
            ) : (
              <button onClick={nextLevel} className="bg-cyan-500 text-slate-950 px-10 py-4 rounded-2xl font-black uppercase text-sm">
                {levelIdx < storyData.length - 1 ? 'NEXT RECORD' : 'MISSION COMPLETE'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarSecretAdmirer;
