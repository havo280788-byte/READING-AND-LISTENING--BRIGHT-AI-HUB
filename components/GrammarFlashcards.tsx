import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface Flashcard {
    id: number;
    front: string;
    back: React.ReactNode;
    color: string;
    category: string;
}

const UNIT1_FLASHCARDS: Flashcard[] = [
    // PRESENT SIMPLE
    {
        id: 1,
        category: 'PRESENT SIMPLE',
        color: '#3B82F6',
        front: 'When do we use the Present Simple?',
        back: (
            <ul className="list-disc list-inside space-y-2">
                <li>Habits and routines</li>
                <li>General facts and truths</li>
                <li>Fixed schedules</li>
            </ul>
        )
    },
    {
        id: 2,
        category: 'PRESENT SIMPLE',
        color: '#3B82F6',
        front: 'What is the form of the Present Simple?',
        back: (
            <div className="space-y-2 font-mono text-sm md:text-base">
                <p>(+) S + V(s/es)</p>
                <p>(-) S + do/does not + V</p>
                <p>(?) Do/Does + S + V?</p>
            </div>
        )
    },
    {
        id: 3,
        category: 'PRESENT SIMPLE',
        color: '#3B82F6',
        front: 'What happens with He/She/It?',
        back: (
            <div className="space-y-2">
                <p>Add -s / -es to the verb.</p>
                <p className="italic text-blue-300">Example: She works.</p>
            </div>
        )
    },
    {
        id: 4,
        category: 'PRESENT SIMPLE',
        color: '#3B82F6',
        front: 'Signal words of the Present Simple?',
        back: <p className="text-lg font-bold">always | usually | often | every day | never</p>
    },
    // PRESENT CONTINUOUS
    {
        id: 5,
        category: 'PRESENT CONTINUOUS',
        color: '#22C55E',
        front: 'When do we use the Present Continuous?',
        back: (
            <ul className="list-disc list-inside space-y-2">
                <li>Actions happening now</li>
                <li>Temporary situations</li>
                <li>Changing situations</li>
            </ul>
        )
    },
    {
        id: 6,
        category: 'PRESENT CONTINUOUS',
        color: '#22C55E',
        front: 'What is the form of the Present Continuous?',
        back: <p className="text-xl font-mono">S + am/is/are + V-ing</p>
    },
    {
        id: 7,
        category: 'PRESENT CONTINUOUS',
        color: '#22C55E',
        front: 'Common signal words?',
        back: <p className="text-lg font-bold">now | right now | at the moment | currently</p>
    },
    {
        id: 8,
        category: 'PRESENT CONTINUOUS',
        color: '#22C55E',
        front: 'What is a common mistake?',
        back: (
            <div className="space-y-3">
                <p className="text-red-400">❌ She is study now.</p>
                <p className="text-green-400">✅ She is studying now.</p>
            </div>
        )
    },
    // STATIVE VERBS
    {
        id: 9,
        category: 'STATIVE VERBS',
        color: '#F59E0B',
        front: 'What are stative verbs?',
        back: (
            <div className="space-y-2">
                <p className="font-bold mb-1">Verbs describing:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Thoughts</li>
                    <li>Feelings</li>
                    <li>Possession</li>
                    <li>Senses</li>
                </ul>
            </div>
        )
    },
    {
        id: 10,
        category: 'STATIVE VERBS',
        color: '#F59E0B',
        front: 'Can we use stative verbs in continuous form?',
        back: (
            <div className="space-y-3 font-semibold">
                <p className="text-orange-300">Usually NO.</p>
                <p className="text-red-400">❌ I am knowing.</p>
                <p className="text-green-400">✅ I know.</p>
            </div>
        )
    },
    {
        id: 11,
        category: 'STATIVE VERBS',
        color: '#F59E0B',
        front: 'Examples of stative verbs?',
        back: <p className="text-base leading-relaxed">know | believe | love | hate | have | own | see | hear</p>
    },
    // COMPARISON
    {
        id: 12,
        category: 'COMPARISON',
        color: '#EF4444',
        front: (
            <div className="space-y-4">
                <p className="text-lg font-bold mb-2">Present Simple or Present Continuous?</p>
                <div className="italic text-slate-300 space-y-1">
                    <p>“She works every day.”</p>
                    <p>“She is working now.”</p>
                </div>
            </div>
        ) as any,
        back: (
            <div className="space-y-4 font-bold">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span>Habit</span>
                    <span className="text-blue-400">Present Simple</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Happening now</span>
                    <span className="text-green-400">Continuous</span>
                </div>
            </div>
        )
    }
];

const GrammarFlashcards: React.FC<{ unitId: string; activeCategory?: string }> = ({ unitId, activeCategory }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Map module keys to flashcard categories
    const categoryMap: Record<string, string> = {
        'simple': 'PRESENT SIMPLE',
        'continuous': 'PRESENT CONTINUOUS',
        'stative': 'STATIVE VERBS'
    };

    const targetCategory = activeCategory ? categoryMap[activeCategory] : null;

    // Filter cards based on unit and selected category
    const allCards = unitId === 'u1' ? UNIT1_FLASHCARDS : [];

    // Use useMemo to avoid re-filtering every render
    const cards = React.useMemo(() => {
        if (!targetCategory) return allCards;
        return allCards.filter(c => c.category === targetCategory || c.category === 'COMPARISON');
    }, [allCards, targetCategory]);

    // Reset index if it becomes invalid after filtering
    React.useEffect(() => {
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [activeCategory]);

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 150);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }, 150);
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    if (cards.length === 0) {
        return (
            <div className="text-center p-10 card-dark border-dashed border-2 border-slate-700">
                <p className="text-slate-400">Flashcards for this unit are coming soon!</p>
            </div>
        );
    }

    const currentCard = cards[currentIndex];

    return (
        <div className="w-full max-w-xl mx-auto space-y-8 animate-fadeIn">
            {/* Card Section */}
            <div className="perspective-1000 h-80 w-full cursor-pointer" onClick={handleFlip}>
                <div
                    className={`relative w-full h-full transition-all duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                >
                    {/* Front Side */}
                    <div className="absolute inset-0 backface-hidden card-dark border-2 flex flex-col items-center justify-center p-8 text-center"
                        style={{ borderColor: `${currentCard.color}44` }}>
                        <span className="absolute top-4 left-6 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5"
                            style={{ color: currentCard.color }}>
                            {currentCard.category}
                        </span>
                        <span className="absolute top-4 right-6 text-[10px] font-bold text-slate-500 italic">
                            Card {currentIndex + 1}/{cards.length}
                        </span>
                        <div className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
                            {currentCard.front}
                        </div>
                        <p className="absolute bottom-4 text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <RotateCcw size={12} /> Click to reveal
                        </p>
                    </div>

                    {/* Back Side */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 card-dark border-2 border-white/10 flex flex-col items-center justify-center p-8 text-center"
                        style={{ background: `linear-gradient(135deg, #1E293B, ${currentCard.color}11)` }}>
                        <span className="absolute top-4 left-6 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5"
                            style={{ color: currentCard.color }}>
                            {currentCard.category}
                        </span>
                        <div className="text-lg md:text-xl text-slate-100 leading-relaxed w-full">
                            {currentCard.back}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="flex-1 flex justify-center gap-1.5">
                    {cards.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-indigo-500' : 'w-1.5 bg-slate-700'}`}
                        />
                    ))}
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default GrammarFlashcards;
