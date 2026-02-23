
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
    title: "Level 1: Family Dinner – Anna",
    image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "Look at Anna! She " },
      { type: "input", hint: "cry", correct: "is crying", explanation: "Present Continuous – action happening right now." },
      { text: ". She usually " },
      { type: "input", hint: "be", correct: "is", explanation: "Present Simple – general characteristic." },
      { text: " very confident, but today she " },
      { type: "input", hint: "feel", correct: "is feeling", explanation: "Present Continuous – temporary state happening now." },
      { text: " upset." }
    ]
  },
  {
    id: 2,
    title: "Level 2: Family Dinner – Parents",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "My parents usually " },
      { type: "input", hint: "argue", correct: "argue", explanation: "Present Simple – habitual action." },
      { text: " about my school performance, but tonight they " },
      { type: "input", hint: "talk", correct: "are talking", explanation: "Present Continuous – action happening right now (tonight)." },
      { text: " calmly." }
    ]
  },
  {
    id: 3,
    title: "Level 3: Family Dinner – Thinking",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "I " },
      { type: "input", hint: "think", correct: "think", explanation: "Present Simple – 'think' as opinion (stative verb)." },
      { text: " teenagers need more independence. But right now I " },
      { type: "input", hint: "think", correct: "am thinking", explanation: "Present Continuous – 'think' as mental process (considering)." },
      { text: " about apologising to my dad." }
    ]
  },
  {
    id: 4,
    title: "Level 4: Family Dinner – Tom",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "Tom usually " },
      { type: "input", hint: "listen", correct: "listens", explanation: "Present Simple – habitual action with 'usually'." },
      { text: " to rock music, but today he " },
      { type: "input", hint: "not listen", correct: "is not listening", explanation: "Present Continuous negative – temporary action now." },
      { text: " to anything. He " },
      { type: "input", hint: "seem", correct: "seems", explanation: "Present Simple – stative verb (linking verb)." },
      { text: " worried." }
    ]
  },
  {
    id: 5,
    title: "Level 5: Family Dinner – Sister",
    image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "My sister " },
      { type: "input", hint: "always / borrow", correct: "is always borrowing", explanation: "Present Continuous with 'always' – expressing annoyance." },
      { text: " my clothes without asking! I " },
      { type: "input", hint: "hate", correct: "hate", explanation: "Present Simple – stative verb (emotion)." },
      { text: " that." }
    ]
  }
];

const UNIT2_STORY: StoryLevel[] = [
  {
    id: 1,
    title: "Level 1: The Ancient Town",
    image: "https://images.unsplash.com/photo-1554232456-8727aae0cfa4?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "Last summer, we " },
      { type: "input", hint: "visit", correct: "visited", explanation: "Past Simple for a completed action in the past (last summer)." },
      { text: " Hội An. While we " },
      { type: "input", hint: "walk", correct: "were walking", explanation: "Past Continuous for an action in progress at a specific time in the past." },
      { text: " along the streets, our guide " },
      { type: "input", hint: "tell", correct: "was telling", explanation: "Past Continuous for simultaneous action (while walking)." },
      { text: " us about the history of the town." }
    ]
  },
  {
    id: 2,
    title: "Level 2: The Museum",
    image: "https://images.unsplash.com/photo-1599573356073-631d80766181?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "When we " },
      { type: "input", hint: "arrive", correct: "arrived", explanation: "Past Simple for a short action interrupting a longer one." },
      { text: " at the museum, many tourists " },
      { type: "input", hint: "take", correct: "were taking", explanation: "Past Continuous for an action in progress when another happened." },
      { text: " photos. It was the ancient statue that " },
      { type: "input", hint: "attract", correct: "attracted", explanation: "Past Simple in a cleft sentence." },
      { text: " my attention the most." }
    ]
  },
  {
    id: 3,
    title: "Level 3: The Imperial City",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "While my parents " },
      { type: "input", hint: "explore", correct: "were exploring", explanation: "Past Continuous for a long action in the past." },
      { text: " the palace, I " },
      { type: "input", hint: "buy", correct: "bought", explanation: "Past Simple for a completed action while another was happening." },
      { text: " some souvenirs. The guide said the citadel " },
      { type: "input", hint: "build", correct: "was built", explanation: "Passive voice in Past Simple." },
      { text: " in the 19th century." }
    ]
  },
  {
    id: 4,
    title: "Level 4: The Japanese Bridge",
    image: "https://images.unsplash.com/photo-1698205500858-2954784318c6?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "We " },
      { type: "input", hint: "take", correct: "were taking", explanation: "Past Continuous for an action in progress." },
      { text: " pictures when it suddenly " },
      { type: "input", hint: "start", correct: "started", explanation: "Past Simple for the interrupting action." },
      { text: " to rain. It was the bridge that " },
      { type: "input", hint: "impress", correct: "impressed", explanation: "Past Simple in a cleft sentence." },
      { text: " me the most during the trip." }
    ]
  },
  {
    id: 5,
    title: "Level 5: The Lantern Festival",
    image: "https://images.unsplash.com/photo-1596395345790-25e8381ace0f?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "People " },
      { type: "input", hint: "decorate", correct: "were decorating", explanation: "Past Continuous for describing a scene in the past." },
      { text: " the streets while musicians " },
      { type: "input", hint: "perform", correct: "were performing", explanation: "Past Continuous for parallel actions in the past." },
      { text: " traditional music. Not only the lanterns but also the atmosphere " },
      { type: "input", hint: "be", correct: "was", explanation: "Past Simple of 'be' (singular subject 'atmosphere')." },
      { text: " magical." }
    ]
  }
];

const UNIT3_STORY: StoryLevel[] = [
  {
    id: 1,
    title: "Level 1: The Wildfire",
    image: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "Last year, a large wildfire " },
      { type: "input", hint: "destroy", correct: "destroyed", explanation: "Past Simple for a completed event at a specific time (last year)." },
      { text: " thousands of hectares of forest. Since then, many volunteers " },
      { type: "input", hint: "plant", correct: "have planted", explanation: "Present Perfect for action starting in past continuing to now (since then)." },
      { text: " new trees and " },
      { type: "input", hint: "raise", correct: "have raised", explanation: "Present Perfect for action from past to present." },
      { text: " money for the victims." }
    ]
  },
  {
    id: 2,
    title: "Level 2: Rising Temperatures",
    image: "https://images.unsplash.com/photo-1504370805625-d32c54b16100?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "Temperatures " },
      { type: "input", hint: "increase", correct: "have increased", explanation: "Present Perfect for change over a period of time up to now." },
      { text: " significantly over the past decade. Scientists " },
      { type: "input", hint: "study", correct: "have studied", explanation: "Present Perfect for an action happening over a period up to now." },
      { text: " climate change for many years and " },
      { type: "input", hint: "warn", correct: "have warned", explanation: "Present Perfect for repeated action up to present." },
      { text: " people about its dangers." }
    ]
  },
  {
    id: 3,
    title: "Level 3: Plastic Waste",
    image: "https://images.unsplash.com/photo-1618477461853-5f8dd1c915c3?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "Yesterday, our class " },
      { type: "input", hint: "organise", correct: "organised", explanation: "Past Simple for action at specific past time (yesterday)." },
      { text: " a clean-up campaign at the beach. We " },
      { type: "input", hint: "collect", correct: "collected", explanation: "Past Simple for series of finished past actions." },
      { text: " more than 300 plastic bottles and " },
      { type: "input", hint: "learn", correct: "learned", explanation: "Past Simple for completed past action." },
      { text: " how pollution affects marine life." }
    ]
  },
  {
    id: 4,
    title: "Level 4: The Flood",
    image: "https://images.unsplash.com/photo-1547623641-d2c56c03e2a7?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "Two months ago, heavy rain " },
      { type: "input", hint: "cause", correct: "caused", explanation: "Past Simple for specific past time (two months ago)." },
      { text: " serious flooding in the area. Since that time, the local community " },
      { type: "input", hint: "build", correct: "has built", explanation: "Present Perfect with 'since' marker." },
      { text: " stronger houses and " },
      { type: "input", hint: "prepare", correct: "has prepared", explanation: "Present Perfect for result relevant to now." },
      { text: " better emergency plans." }
    ]
  },
  {
    id: 5,
    title: "Level 5: Endangered Species",
    image: "https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "Many animal species " },
      { type: "input", hint: "disappear", correct: "have disappeared", explanation: "Present Perfect for recent gradual change." },
      { text: " in recent years. Environmental groups " },
      { type: "input", hint: "work", correct: "have worked", explanation: "Present Perfect for unfinished action duration." },
      { text: " hard to protect wildlife and " },
      { type: "input", hint: "educate", correct: "have educated", explanation: "Present Perfect for activity continuing to present." },
      { text: " young people about conservation." }
    ]
  }
];

const UNIT4_STORY: StoryLevel[] = [
  {
    id: 1,
    title: "Level 1: The Famous City",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "Last month, our class visited Huế. The trip was memorable because the city is famous for " },
      { type: "input", hint: "both / neither", correct: "both", explanation: "Correlative conjunction: both... and." },
      { text: " its ancient citadel " },
      { type: "input", hint: "and / nor", correct: "and", explanation: "Correlative conjunction pair for 'both'." },
      { text: " its royal tombs." }
    ]
  },
  {
    id: 2,
    title: "Level 2: Cultural Importance",
    image: "https://images.unsplash.com/photo-1599573356073-631d80766181?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "During the tour, we learned that " },
      { type: "input", hint: "either / both", correct: "both", explanation: "Connecting two subjects." },
      { text: " the architecture " },
      { type: "input", hint: "or / and", correct: "and", explanation: "Completion of 'both... and' structure." },
      { text: " the cultural value make the site important worldwide." }
    ]
  },
  {
    id: 3,
    title: "Level 3: Touring Options",
    image: "https://images.unsplash.com/photo-1510217627448-93666f7f6311?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "Our guide explained that visitors can choose " },
      { type: "input", hint: "neither / either", correct: "either", explanation: "Presenting a choice between two options." },
      { text: " to explore the palace on their own " },
      { type: "input", hint: "nor / or", correct: "or", explanation: "Completion of 'either... or' structure." },
      { text: " to join a guided tour." }
    ]
  },
  {
    id: 4,
    title: "Level 4: A New Experience",
    image: "https://images.unsplash.com/photo-1554232456-8727aae0cfa4?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "Surprisingly, " },
      { type: "input", hint: "neither / not only", correct: "neither", explanation: "Negative correlation: neither... nor." },
      { text: " the students " },
      { type: "input", hint: "nor / but also", correct: "nor", explanation: "Completion of 'neither... nor' structure." },
      { text: " the teachers had visited the site before, so everything felt new to us." }
    ]
  },
  {
    id: 5,
    title: "Level 5: Final Thoughts",
    image: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "At the end of the day, we agreed that Huế is " },
      { type: "input", hint: "not only / both", correct: "not only", explanation: "Emphasis: not only... but also." },
      { text: " beautiful " },
      { type: "input", hint: "but also / and", correct: "but also", explanation: "Completion of 'not only... but also' structure." },
      { text: " historically significant." }
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
const UNIT6_STORY: StoryLevel[] = [
  {
    id: 1,
    title: "Level 1: The Plan",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "Last month, our class discussed " },
      { type: "input", hint: "join", correct: "joining", explanation: "Gerund after 'discuss'." },
      { text: " a non-profit project. The organisation suggested " },
      { type: "input", hint: "collect", correct: "collecting", explanation: "Gerund after 'suggest'." },
      { text: " clothes for those in need." }
    ]
  },
  {
    id: 2,
    title: "Level 2: Getting Ready",
    image: "https://images.unsplash.com/photo-1593113630400-ea4288d22497?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "Many students were excited about " },
      { type: "input", hint: "participate", correct: "participating", explanation: "Gerund after preposition 'about'." },
      { text: " in the campaign. On the first day, we avoided " },
      { type: "input", hint: "waste", correct: "wasting", explanation: "Gerund after 'avoid'." },
      { text: " any resources." }
    ]
  },
  {
    id: 3,
    title: "Level 3: Correcting Mistakes",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "Our teacher admitted " },
      { type: "input", hint: "make", correct: "having made", explanation: "Perfect Gerund for past action." },
      { text: " some mistakes in the schedule, but she quickly fixed them, " },
      { type: "input", hint: "didn't she", correct: "didn't she", explanation: "Tag question matching 'fixed' (Past Simple)." }
    ]
  },
  {
    id: 4,
    title: "Level 4: Team Effort",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "Nobody wanted to leave early, " },
      { type: "input", hint: "did they", correct: "did they", explanation: "Positive tag because 'Nobody' is negative." },
      { text: "? Several students considered " },
      { type: "input", hint: "work", correct: "working", explanation: "Gerund after 'consider'." },
      { text: " extra hours to support the shelter." }
    ]
  },
  {
    id: 5,
    title: "Level 5: Final Thoughts",
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop",
    segments: [
      { text: "I remember " },
      { type: "input", hint: "feel", correct: "feeling", explanation: "Gerund after 'remember' (past memory)." },
      { text: " proud when we finished. The experience helped us understand team importance, " },
      { type: "input", hint: "didn't it", correct: "didn't it", explanation: "Tag question matching 'helped' (Past Simple)." },
      { text: "?" }
    ]
  }
];
const UNIT7_STORY: StoryLevel[] = [{ id: 1, title: "Healthy Life", image: "https://source.unsplash.com/random/800x600/?health", segments: [] }];
const UNIT8_STORY: StoryLevel[] = [{ id: 1, title: "Longevity", image: "https://source.unsplash.com/random/800x600/?senior", segments: [] }];

interface GrammarSecretAdmirerProps {
  currentTopic: string;
  unitId: string;
  onReturn: () => void;
  onComplete: (score: number) => void;
}

const GrammarSecretAdmirer: React.FC<GrammarSecretAdmirerProps> = ({ currentTopic, unitId, onReturn, onComplete }) => {
  const [levelIdx, setLevelIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [validated, setValidated] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});
  const { playCorrect, playWrong, playPop } = useGameSound();

  const storyData = useMemo(() => {
    // Prioritize unitId mapping
    if (unitId === 'u1') return UNIT1_STORY;
    if (unitId === 'u2') return UNIT2_STORY;
    if (unitId === 'u3') return UNIT3_STORY;
    if (unitId === 'u4') return UNIT4_STORY;
    if (unitId === 'u5') return UNIT5_STORY;
    if (unitId === 'u6') return UNIT6_STORY;
    if (unitId === 'u7') return UNIT7_STORY;
    if (unitId === 'u8') return UNIT8_STORY;

    // Fallback to topic string matching
    if (currentTopic.includes("Past Tenses")) return UNIT2_STORY;
    if (currentTopic.includes("Present Perfect")) return UNIT3_STORY;
    if (currentTopic.includes("Paired Conjunctions")) return UNIT4_STORY;
    if (currentTopic.includes("Future Forms")) return UNIT5_STORY;
    if (currentTopic.includes("Linking Words")) return UNIT6_STORY;
    if (currentTopic.includes("Modals")) return UNIT7_STORY;
    if (currentTopic.includes("Reported Speech")) return UNIT8_STORY;
    return UNIT1_STORY;
  }, [currentTopic, unitId]);

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
        <h2 className="type-h2 text-white uppercase italic tracking-tighter mb-4">Story Coming Soon</h2>
        <p className="type-body text-slate-400 mb-8">This grammar adventure is currently being written.</p>
        <button onClick={() => onComplete(100)} className="bg-cyan-500 text-slate-950 px-10 py-4 rounded-2xl type-button transition-transform">
          Skip to Next Stage
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] bg-[#050510] rounded-[2.5rem] overflow-hidden flex flex-col p-6 md:p-12 border-4 border-white/5">
      <div className="flex justify-between items-center mb-8">
        <h2 className="type-h3 text-white uppercase italic tracking-tighter">RECOVERING KNOWLEDGE</h2>
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
            <div className="absolute bottom-6 left-6"><h3 className="type-h4 text-white">{currentLevel.title}</h3></div>
          </div>
        </div>
        <div className="lg:w-2/3 bg-white/5 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border border-white/10 flex flex-col justify-between">
          <div className="type-body-reading text-white">
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
                      className={`w-40 bg-transparent border-b-2 text-center outline-none py-1 type-body ${isWrong ? 'border-red-500 text-red-400' : isRight ? 'border-green-500 text-green-400' : 'border-gray-600 focus:border-cyan-400 text-white'}`}
                    />
                    {isWrong && <div className="absolute top-full left-0 bg-red-950 text-red-200 type-caption p-2 rounded z-20"><p>{seg.correct}</p><p className="opacity-70">{seg.explanation}</p></div>}
                  </span>
                );
              }
              return <span key={i}>{seg.text}</span>;
            })}
          </div>
          <div className="mt-12 flex justify-end">
            {!allCorrect ? (
              <button onClick={validate} className="bg-cyan-400 text-slate-900 px-8 py-3 rounded-xl type-button">VERIFY SEQUENCE</button>
            ) : (
              <button onClick={nextLevel} className="bg-cyan-500 text-slate-950 px-10 py-4 rounded-2xl type-button">
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
