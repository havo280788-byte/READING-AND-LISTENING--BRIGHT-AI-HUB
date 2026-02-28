import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';

import { Button, Card, ScoreCircle, ScoreBreakdown, RubricFeedbackCard, DetailedErrorsSection } from './Components';
import { analyzeWriting } from '../services/geminiService';
import { AIResponse } from '../types';

interface Props {
  onComplete: (score: number) => void;
  studentName: string;
}

interface WritingUnit {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  type: 'ESSAY' | 'EMAIL'; // Added to distinguish task type
  scrambleSentences: string[]; // Part 1 data
  paragraphSentences: string[]; // Part 2 data (correct order)
  essayPrompt: string; // Part 3 data
  essayHint: string;
  structure: {
    introduction: string;
    body: string;
    conclusion: string;
  };
}

const WRITING_UNITS: WritingUnit[] = [
  {
    id: 1,
    title: "Generation Gap and Independent Life",
    description: "Write about family relationships and independence.",
    icon: "fa-users",
    color: "from-blue-500 to-cyan-500",
    type: 'ESSAY',
    scrambleSentences: [
      "Parents should respect their children's privacy.",
      "Living independently teaches young people responsibility.",
      "The generation gap can lead to conflicts.",
      "Communication is the key to understanding.",
      "Teenagers often want to make their own decisions."
    ],
    paragraphSentences: [
      "Living in an extended family can be challenging.",
      "Grandparents often hold traditional values regarding life.",
      "Meanwhile, teenagers want to express their own modern style.",
      "This difference in perspective creates the generation gap.",
      "However, mutual respect can help solve these conflicts."
    ],
    essayPrompt: "Write an essay (150-200 words) discussing the advantages and disadvantages of living in an extended family.",
    essayHint: "Think about: emotional support, childcare vs. lack of privacy, generation gap conflicts.",
    structure: {
      introduction: "Define 'extended family' and state that living together has both pros and cons.",
      body: "Paragraph 1: Advantages (financial support, childcare, bonding). Paragraph 2: Disadvantages (lack of privacy, generational conflicts).",
      conclusion: "Summarize main points and give your personal opinion (e.g., mutual respect is key)."
    }
  },
  {
    id: 2,
    title: "Vietnam and ASEAN",
    description: "Discuss Vietnam's integration into the ASEAN community.",
    icon: "fa-flag",
    color: "from-red-500 to-pink-500",
    type: 'ESSAY',
    scrambleSentences: [
      "Vietnam joined ASEAN in July 1995.",
      "ASEAN aims to promote economic growth and peace.",
      "Cultural exchanges help people understand each other.",
      "Visa-free travel encourages tourism within the region.",
      "English is the working language of ASEAN."
    ],
    paragraphSentences: [
      "Vietnam became a member of ASEAN in 1995.",
      "This membership opened many economic opportunities for the country.",
      "It also promoted cultural exchanges with neighboring nations.",
      "Vietnamese youth can now travel easily within the region.",
      "Overall, ASEAN integration has greatly benefited the country."
    ],
    essayPrompt: "Write an essay (150-200 words) about the benefits for Vietnamese students when Vietnam is a member of ASEAN.",
    essayHint: "Think about: education opportunities, scholarship, job market, cultural exchange.",
    structure: {
      introduction: "Introduce Vietnam's membership in ASEAN and state that it brings many benefits to students.",
      body: "Paragraph 1: Educational opportunities (scholarships, exchange programs). Paragraph 2: Career opportunities (working in ASEAN countries, improving English).",
      conclusion: "Reaffirm the importance of ASEAN integration for the future of Vietnamese youth."
    }
  },
  {
    id: 3,
    title: "Global Warming and Ecological Systems",
    description: "Address environmental issues and solutions.",
    icon: "fa-globe-asia",
    color: "from-green-500 to-emerald-600",
    type: 'EMAIL',
    scrambleSentences: [
      "Carbon dioxide is a major greenhouse gas.",
      "Deforestation contributes significantly to global warming.",
      "We should use renewable energy sources like solar power.",
      "Planting more trees helps to reduce carbon footprints.",
      "Climate change causes extreme weather events."
    ],
    paragraphSentences: [
      "Global warming is a major threat to our planet.",
      "It is caused primarily by greenhouse gas emissions.",
      "Rising temperatures lead to melting ice caps.",
      "Consequently, sea levels are rising dangerously.",
      "We must act now to reduce our carbon footprint."
    ],
    essayPrompt: "Write an email (120-150 words) to your friend, Tom, suggesting ways to reduce global warming in your local community.",
    essayHint: "Think about: recycling, saving electricity, using public transport, planting trees.",
    structure: {
      introduction: "Salutation (Dear Tom,), ask about his health, and state your reason for writing (sharing eco-friendly tips).",
      body: "Suggestion 1: Save energy at home (turn off lights). Suggestion 2: Travel green (bike/bus). Suggestion 3: Practice 3Rs (Reduce, Reuse, Recycle).",
      conclusion: "Hope he finds the tips useful. Closing salutation (Best wishes, [Your Name])."
    }
  },
  {
    id: 4,
    title: "World Heritage Site",
    description: "Preserving history and promoting tourism.",
    icon: "fa-landmark",
    color: "from-yellow-500 to-orange-500",
    type: 'EMAIL',
    scrambleSentences: [
      "Ha Long Bay was recognized by UNESCO as a heritage site.",
      "Tourism brings revenue to local communities.",
      "We must preserve these sites for future generations.",
      "Many heritage sites are threatened by pollution.",
      "Visitors should respect the local culture and environment."
    ],
    paragraphSentences: [
      "Hoi An Ancient Town is a famous heritage site.",
      "It reflects a fusion of indigenous and foreign cultures.",
      "Many tourists visit to see the old architecture.",
      "However, tourism can put pressure on the infrastructure.",
      "Preserving the site requires strict management rules."
    ],
    essayPrompt: "Write an email (120-150 words) to a foreign friend inviting them to visit a World Heritage Site in Vietnam and explaining why it should be preserved.",
    essayHint: "Think about: Hoi An/Ha Long Bay, beauty, history, tourism responsibility.",
    structure: {
      introduction: "Salutation (Dear...), ask about their holiday plans, and introduce a famous site (e.g., Ha Long Bay or Hoi An).",
      body: "Describe the site's beauty and history. Explain why preservation is crucial (cultural identity, future generations).",
      conclusion: "Invite them to come and visit together. Sign-off (Love, [Your Name])."
    }
  },
  {
    id: 5,
    title: "Cities and Education in the Future",
    description: "Write about future trends in urban life and learning.",
    icon: "fa-city",
    color: "from-indigo-500 to-purple-600",
    type: 'ESSAY',
    scrambleSentences: [
      "Technology will transform how we learn and work.",
      "Smart cities use data to manage resources efficiently.",
      "Future schools might not have traditional classrooms.",
      "Sustainable cities focus on renewable energy sources.",
      "Virtual reality can make learning more interactive."
    ],
    paragraphSentences: [
      "In the future, cities will be much smarter and greener.",
      "Buildings will generate their own solar energy.",
      "Public transport will be fully automated and electric.",
      "This will reduce pollution and traffic congestion significantly.",
      "Consequently, the quality of life for urban residents will improve."
    ],
    essayPrompt: "Write an essay (150-200 words) discussing the benefits of online education in the future.",
    essayHint: "Think about: flexibility, cost savings, access to global resources, personalized learning.",
    structure: {
      introduction: "Introduce the trend of online education replacing traditional methods.",
      body: "Paragraph 1: Flexibility and convenience (learn anywhere, anytime). Paragraph 2: Access to resources (global courses, experts).",
      conclusion: "Summarize benefits and state that online education is a positive step forward."
    }
  },
  {
    id: 6,
    title: "Social Issues",
    description: "Discuss causes and solutions for social problems.",
    icon: "fa-people-arrows",
    color: "from-gray-500 to-slate-600",
    type: 'ESSAY',
    scrambleSentences: [
      "Overpopulation puts pressure on natural resources.",
      "Peer pressure can lead to negative behaviors.",
      "Education is the best way to reduce poverty.",
      "Cyberbullying is a growing problem among teenagers.",
      "The government must take action to reduce crime rates."
    ],
    paragraphSentences: [
      "Bullying is a serious issue in many schools today.",
      "It can be physical, verbal, or social exclusion.",
      "Victims of bullying often suffer from anxiety and depression.",
      "Therefore, schools need strict policies to protect students.",
      "Teachers and parents must also listen to children's problems."
    ],
    essayPrompt: "Write an essay (150-200 words) discussing the causes and solutions for bullying in schools.",
    essayHint: "Think about: family issues, lack of supervision, counseling, strict rules, awareness campaigns.",
    structure: {
      introduction: "Define bullying and state that it is a prevalent issue in schools.",
      body: "Paragraph 1: Causes (family problems, media influence, peer pressure). Paragraph 2: Solutions (education, strict punishment, counseling).",
      conclusion: "Emphasize that solving bullying requires effort from schools, parents, and students."
    }
  },
  {
    id: 7,
    title: "Healthy Lifestyle",
    description: "Write about habits for a healthy body and mind.",
    icon: "fa-heart-pulse",
    color: "from-teal-400 to-green-500",
    type: 'ESSAY',
    scrambleSentences: [
      "You should drink at least two liters of water daily.",
      "Avoiding fast food is key to a healthy diet.",
      "Physical activity strengthens the heart and lungs.",
      "Stress management is important for mental well-being.",
      "A good night's sleep helps the body recover."
    ],
    paragraphSentences: [
      "Maintaining a healthy lifestyle is not difficult.",
      "First, you need to eat a balanced diet with vegetables.",
      "Second, regular exercise is crucial for physical strength.",
      "Finally, getting enough sleep helps your brain function well.",
      "These simple habits lead to a long and happy life."
    ],
    essayPrompt: "Write an essay (150-200 words) about the importance of a healthy lifestyle for teenagers.",
    essayHint: "Think about: physical growth, mental health, study performance, disease prevention.",
    structure: {
      introduction: "State that health is wealth and teenagers need to prioritize it.",
      body: "Paragraph 1: Physical benefits (growth, energy for studying). Paragraph 2: Mental benefits (reducing stress, better focus).",
      conclusion: "Encourage teenagers to adopt healthy habits early in life."
    }
  },
  {
    id: 8,
    title: "Health and Life Expectancy",
    description: "Analyze factors affecting human longevity.",
    icon: "fa-user-doctor",
    color: "from-sky-500 to-blue-700",
    type: 'ESSAY',
    scrambleSentences: [
      "Life expectancy has increased due to better healthcare.",
      "Vaccines protect us from dangerous infectious diseases.",
      "Eating vegetables contributes to a longer life.",
      "Smoking is a major cause of lung cancer.",
      "Regular medical check-ups catch diseases early."
    ],
    paragraphSentences: [
      "Many factors affect how long a person lives.",
      "Genetics play a role, but lifestyle is more important.",
      "People who exercise and eat well tend to live longer.",
      "Access to modern medicine also extends life expectancy.",
      "Therefore, we have some control over our own longevity."
    ],
    essayPrompt: "Write an essay (150-200 words) discussing the factors that have led to increased life expectancy.",
    essayHint: "Think about: medical advances (vaccines), better nutrition, sanitation, education.",
    structure: {
      introduction: "State that life expectancy has risen significantly in recent decades.",
      body: "Paragraph 1: Medical advances (vaccines, antibiotics, surgery). Paragraph 2: Better living conditions (clean water, nutrition, hygiene).",
      conclusion: "Conclude that humans are living longer and healthier lives than ever before."
    }
  }
];

type PracticeMode = 'MENU' | 'SCRAMBLE_WORDS' | 'SCRAMBLE_PARAGRAPH' | 'ESSAY' | 'SUMMARY';

interface DraggableItem {
  id: number;
  text: string;
}

// Helper function to play a success sound using Web Audio API
const playSuccessSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Play a Major Triad (C - E - G) for a happy success sound
    playNote(523.25, now, 0.5);      // C5
    playNote(659.25, now + 0.1, 0.5); // E5
    playNote(783.99, now + 0.2, 0.8); // G5
  } catch (e) {
    console.error("Failed to play sound", e);
  }
};

const WritingPractice: React.FC<Props> = ({ onComplete, studentName }) => {
  const [selectedUnit, setSelectedUnit] = useState<WritingUnit | null>(null);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('MENU');

  // --- Tracking Scores & Completion ---
  const [partScores, setPartScores] = useState({ part1: 0, part2: 0, part3: 0 });
  const [partCompletion, setPartCompletion] = useState({ part1: false, part2: false, part3: false });
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const partScoresRef = useRef({ part1: 0, part2: 0, part3: 0 });

  // --- Part 1: Sentence Scramble State ---
  const [scrambleIdx, setScrambleIdx] = useState(0);
  const [availableWords, setAvailableWords] = useState<DraggableItem[]>([]);
  const [selectedWords, setSelectedWords] = useState<DraggableItem[]>([]);
  const [scrambleStatus, setScrambleStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // --- Part 2: Paragraph Scramble State ---
  const [paraAvailable, setParaAvailable] = useState<DraggableItem[]>([]);
  const [paraSelected, setParaSelected] = useState<DraggableItem[]>([]);
  const [paraStatus, setParaStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // --- Part 3: Essay/Email State ---
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [finalResult, setFinalResult] = useState<AIResponse | null>(null); // Lưu kết quả cuối cùng để hiển thị trong SUMMARY

  // Initialize Part 1 Round
  useEffect(() => {
    if (practiceMode === 'SCRAMBLE_WORDS' && selectedUnit) {
      loadScrambleSentence(scrambleIdx);
    }
  }, [practiceMode, scrambleIdx, selectedUnit]);

  // Initialize Part 2 Round
  useEffect(() => {
    if (practiceMode === 'SCRAMBLE_PARAGRAPH' && selectedUnit) {
      loadScrambleParagraph();
    }
  }, [practiceMode, selectedUnit]);

  // Keep ref in sync with state
  useEffect(() => {
    partScoresRef.current = partScores;
  }, [partScores]);

  // Auto-save score when entering SUMMARY mode
  useEffect(() => {
    if (practiceMode === 'SUMMARY' && !scoreSubmitted) {
      const totalScore = partScoresRef.current.part1 + partScoresRef.current.part2 + partScoresRef.current.part3;
      onComplete(totalScore);
      setScoreSubmitted(true);
    }
  }, [practiceMode, scoreSubmitted, onComplete]);

  // --- PART 1 LOGIC ---
  const loadScrambleSentence = (idx: number) => {
    if (!selectedUnit) return;
    const sentence = selectedUnit.scrambleSentences[idx];
    const words = sentence.split(' ').map((w, i) => ({ id: i, text: w }));
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffled);
    setSelectedWords([]);
    setScrambleStatus('idle');
  };

  const handleWordClick = (word: DraggableItem, from: 'pool' | 'selected') => {
    if (scrambleStatus === 'correct') return;
    if (from === 'pool') {
      setAvailableWords(prev => prev.filter(w => w.id !== word.id));
      setSelectedWords(prev => [...prev, word]);
    } else {
      setSelectedWords(prev => prev.filter(w => w.id !== word.id));
      setAvailableWords(prev => [...prev, word]);
    }
    setScrambleStatus('idle');
  };

  const checkScramble = () => {
    if (!selectedUnit) return;
    const currentSentence = selectedUnit.scrambleSentences[scrambleIdx];
    const userSentence = selectedWords.map(w => w.text).join(' ');
    if (userSentence === currentSentence) {
      setScrambleStatus('correct');
      playSuccessSound(); // Play Success Sound
    }
    else setScrambleStatus('wrong');
  };

  const nextScramble = () => {
    if (!selectedUnit) return;
    if (scrambleIdx < selectedUnit.scrambleSentences.length - 1) {
      setScrambleIdx(prev => prev + 1);
    } else {
      // Finished Part 1
      alert("Part 1 Completed! You earned 2 points.");
      setPartScores(prev => ({ ...prev, part1: 2 }));
      setPartCompletion(prev => ({ ...prev, part1: true }));
      setPracticeMode('MENU');
      setScrambleIdx(0);
    }
  };

  // --- PART 2 LOGIC ---
  const loadScrambleParagraph = () => {
    if (!selectedUnit) return;
    const items = selectedUnit.paragraphSentences.map((s, i) => ({ id: i, text: s }));
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setParaAvailable(shuffled);
    setParaSelected([]);
    setParaStatus('idle');
  };

  const handleSentenceClick = (item: DraggableItem, from: 'pool' | 'selected') => {
    if (paraStatus === 'correct') return;
    if (from === 'pool') {
      setParaAvailable(prev => prev.filter(i => i.id !== item.id));
      setParaSelected(prev => [...prev, item]);
    } else {
      setParaSelected(prev => prev.filter(i => i.id !== item.id));
      setParaAvailable(prev => [...prev, item]);
    }
    setParaStatus('idle');
  };

  const checkParagraph = () => {
    const currentOrderIds = paraSelected.map(i => i.id);
    let isCorrect = true;
    if (currentOrderIds.length !== selectedUnit?.paragraphSentences.length) {
      isCorrect = false;
    } else {
      for (let i = 0; i < currentOrderIds.length; i++) {
        if (currentOrderIds[i] !== i) {
          isCorrect = false;
          break;
        }
      }
    }

    if (isCorrect) {
      setParaStatus('correct');
      playSuccessSound(); // Play Success Sound
      // Finished Part 2
      setTimeout(() => {
        alert("Part 2 Completed! You earned 2 points.");
        setPartScores(prev => ({ ...prev, part2: 2 }));
        setPartCompletion(prev => ({ ...prev, part2: true }));
        setPracticeMode('MENU');
      }, 1000);
    } else {
      setParaStatus('wrong');
    }
  };

  // --- PART 3 LOGIC ---
  const handleEssayAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    try {
      const response = await analyzeWriting(text);
      setResult(response);

      // Lưu kết quả chi tiết để hiển thị trong SUMMARY
      setFinalResult(response);

      // Calculate scaled score (Gemini gives /10, we scale to /6 for Part 3)
      // Wait to update global stats until final summary, but update local state here
      const scaledScore = (response.score / 10) * 6;
      setPartScores(prev => ({ ...prev, part3: scaledScore }));
      setPartCompletion(prev => ({ ...prev, part3: true }));

    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinishPart3 = () => {
    setPracticeMode('MENU');
    setText(''); // Clear text for cleaner state, or keep it if we want persistence
    setResult(null);
  };

  // --- CERTIFICATE LOGIC ---
  const handleDownloadCertificate = () => {
    if (!selectedUnit) return;

    const totalScore = partScores.part1 + partScores.part2 + partScores.part3;

    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Border
    ctx.lineWidth = 15;
    ctx.strokeStyle = '#2563EB'; // Blue-600
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#DAA520'; // Gold
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

    // 3. Header
    ctx.fillStyle = '#1e3a8a'; // Dark Blue
    ctx.font = 'bold 50px serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE', canvas.width / 2, 140);

    ctx.font = '28px serif';
    ctx.fillStyle = '#DAA520';
    ctx.fillText('OF WRITING MASTERY', canvas.width / 2, 180);

    // 4. Content
    ctx.font = 'italic 24px sans-serif';
    ctx.fillStyle = '#555555';
    ctx.fillText('This certificate is awarded to', canvas.width / 2, 250);

    // Student Name
    ctx.font = 'bold italic 60px serif';
    ctx.fillStyle = '#2563EB';
    ctx.fillText(studentName, canvas.width / 2, 330);

    // Line under name
    ctx.beginPath();
    ctx.moveTo(250, 350);
    ctx.lineTo(750, 350);
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Description
    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#444444';
    ctx.fillText(`For completing the writing assessment for`, canvas.width / 2, 400);
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`Unit: ${selectedUnit.title}`, canvas.width / 2, 440);

    // Score
    ctx.fillStyle = '#16a34a'; // Green
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(`Total Score: ${totalScore.toFixed(1)}/10`, canvas.width / 2, 500);

    // 5. Footer (Date and Signature)
    const today = new Date().toLocaleDateString('en-GB');

    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.fillText(`Date: ${today}`, 100, 600);

    ctx.textAlign = 'right';
    ctx.fillText('LinguaAI Director', 900, 600);

    ctx.font = 'italic 30px serif';
    ctx.fillText('Gemini AI', 900, 570);

    // Download
    const link = document.createElement('a');
    link.download = `Writing-Certificate-${studentName}-${selectedUnit.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleDownloadFeedback = () => {
    if (!selectedUnit || !finalResult) return;

    const totalScore = partScores.part1 + partScores.part2 + partScores.part3;
    const today = new Date().toLocaleString();

    let content = `================================================
WRITING PRACTICE FEEDBACK - LINGUAAI
================================================

STUDENT: ${studentName}
DATE: ${today}
UNIT: ${selectedUnit.id} - ${selectedUnit.title}
TYPE: ${selectedUnit.type}

------------------------------------------------
1. OVERALL SCORE: ${totalScore.toFixed(1)} / 10.0
------------------------------------------------
- Task 1 (Sentence Scramble): ${partScores.part1} / 2.0
- Task 2 (Paragraph Scramble): ${partScores.part2} / 2.0
- Task 3 (${selectedUnit.type === 'EMAIL' ? 'Email Writing' : 'Essay Writing'}): ${partScores.part3.toFixed(1)} / 6.0

`;

    if (finalResult.scoreBreakdown) {
      content += `------------------------------------------------
2. SCORE BREAKDOWN
------------------------------------------------
`;
      Object.entries(finalResult.scoreBreakdown).forEach(([key, value]) => {
        content += `- ${key}: ${value} / 10\n`;
      });
      content += `\n`;
    }

    content += `------------------------------------------------
3. ORIGINAL TEXT
------------------------------------------------
${text || "No text available."}

------------------------------------------------
4. GENERAL FEEDBACK
------------------------------------------------
${finalResult.feedback || "No feedback available."}

------------------------------------------------
5. RUBRIC BREAKDOWN
------------------------------------------------
`;

    if (finalResult.rubricFeedback) {
      finalResult.rubricFeedback.forEach(item => {
        content += `[${item.criterion}]: ${item.score}/${item.maxScore}
Feedback: ${item.feedback}
`;
        if (item.suggestions && item.suggestions.length > 0) {
          content += `Suggestions:\n`;
          item.suggestions.forEach((s, i) => {
            content += `  ${i + 1}. ${s}\n`;
          });
        }
        content += `\n`;
      });
    }

    if (finalResult.detailedErrors && finalResult.detailedErrors.length > 0) {
      content += `------------------------------------------------
6. DETAILED ERRORS & CORRECTIONS
------------------------------------------------
`;
      finalResult.detailedErrors.forEach((error, idx) => {
        content += `${idx + 1}. TYPE: ${error.type.toUpperCase()}
   Original: "${error.original}"
   Correction: "${error.correction}"
   Explanation: ${error.explanation}
\n`;
      });
    }

    if (finalResult.improvedVersion) {
      content += `------------------------------------------------
7. IMPROVED VERSION (SUGGESTION)
------------------------------------------------
${finalResult.improvedVersion}
`;
    }

    content += `
================================================
DEVELOPED BY TEACHER VO THI THU HA
================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `Writing-Feedback-${studentName}-${selectedUnit.id.toString().replace(/\s+/g, '_')}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadFeedbackPDF = () => {
    if (!selectedUnit || !finalResult) return;

    const totalScore = partScores.part1 + partScores.part2 + partScores.part3;
    const today = new Date().toLocaleString();

    const doc = new jsPDF();
    let yPos = 20;

    // Header
    doc.setFillColor(30, 58, 138); // Dark Blue
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('WRITING PRACTICE FEEDBACK', 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text('LINGUAAI - SMART LEARNING PLATFORM', 105, 30, { align: 'center' });

    yPos = 50;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`STUDENT: ${studentName}`, 20, yPos);
    doc.text(`DATE: ${today}`, 120, yPos);
    yPos += 10;
    doc.text(`UNIT: ${selectedUnit.id} - ${selectedUnit.title}`, 20, yPos);
    yPos += 10;
    doc.text(`TYPE: ${selectedUnit.type}`, 20, yPos);

    yPos += 15;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Overall Score
    doc.setFontSize(14);
    doc.text('1. OVERALL SCORE', 20, yPos);
    yPos += 10;
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235); // Blue-600
    doc.text(`${totalScore.toFixed(1)} / 10.0`, 20, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    yPos += 10;
    doc.text(`- Task 1 (Sentence Scramble): ${partScores.part1} / 2.0`, 25, yPos);
    yPos += 7;
    doc.text(`- Task 2 (Paragraph Scramble): ${partScores.part2} / 2.0`, 25, yPos);
    yPos += 7;
    doc.text(`- Task 3 (${selectedUnit.type === 'EMAIL' ? 'Email Writing' : 'Essay Writing'}): ${partScores.part3.toFixed(1)} / 6.0`, 25, yPos);

    yPos += 15;
    if (finalResult.scoreBreakdown) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('2. SCORE BREAKDOWN', 20, yPos);
      yPos += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      Object.entries(finalResult.scoreBreakdown).forEach(([key, value]) => {
        doc.text(`- ${key}: ${value} / 10`, 25, yPos);
        yPos += 7;
      });
      yPos += 5;
    }

    // Original Text
    if (yPos > 250) { doc.addPage(); yPos = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('3. ORIGINAL TEXT', 20, yPos);
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const splitOriginalText = doc.splitTextToSize(text || "No text available.", 170);
    doc.text(splitOriginalText, 20, yPos);
    yPos += (splitOriginalText.length * 5) + 10;

    // General Feedback
    if (yPos > 250) { doc.addPage(); yPos = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('4. GENERAL FEEDBACK', 20, yPos);
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const splitFeedback = doc.splitTextToSize(finalResult.feedback || "No feedback available.", 170);
    doc.text(splitFeedback, 20, yPos);
    yPos += (splitFeedback.length * 5) + 10;

    // Rubric Breakdown
    if (finalResult.rubricFeedback) {
      if (yPos > 230) { doc.addPage(); yPos = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('5. RUBRIC BREAKDOWN', 20, yPos);
      yPos += 10;
      doc.setFontSize(10);
      finalResult.rubricFeedback.forEach(item => {
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        doc.setFont('helvetica', 'bold');
        doc.text(`[${item.criterion}]: ${item.score}/${item.maxScore}`, 20, yPos);
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        const critFeedback = doc.splitTextToSize(`Feedback: ${item.feedback}`, 160);
        doc.text(critFeedback, 25, yPos);
        yPos += (critFeedback.length * 5) + 4;

        if (item.suggestions && item.suggestions.length > 0) {
          doc.setFont('helvetica', 'italic');
          doc.text(`Suggestions:`, 25, yPos);
          yPos += 5;
          item.suggestions.forEach((s, i) => {
            const sugText = doc.splitTextToSize(`${i + 1}. ${s}`, 150);
            doc.text(sugText, 30, yPos);
            yPos += (sugText.length * 5);
          });
          yPos += 5;
        }
        doc.setFontSize(10);
      });
      yPos += 10;
    }

    // Detailed Errors
    if (finalResult.detailedErrors && finalResult.detailedErrors.length > 0) {
      if (yPos > 230) { doc.addPage(); yPos = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('6. DETAILED ERRORS & CORRECTIONS', 20, yPos);
      yPos += 10;
      doc.setFontSize(10);
      finalResult.detailedErrors.forEach((error, idx) => {
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        doc.setFont('helvetica', 'bold');
        doc.text(`${idx + 1}. TYPE: ${error.type.toUpperCase()}`, 20, yPos);
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.text(`Original: "${error.original}"`, 25, yPos);
        yPos += 5;
        doc.setTextColor(22, 101, 52); // Green-800
        doc.text(`Correction: "${error.correction}"`, 25, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 5;
        const explText = doc.splitTextToSize(`Explanation: ${error.explanation}`, 160);
        doc.text(explText, 25, yPos);
        yPos += (explText.length * 5) + 5;
      });
      yPos += 10;
    }

    // Improved Version
    if (finalResult.improvedVersion) {
      if (yPos > 230) { doc.addPage(); yPos = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('7. IMPROVED VERSION (SUGGESTION)', 20, yPos);
      yPos += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const splitImproved = doc.splitTextToSize(finalResult.improvedVersion, 170);
      doc.text(splitImproved, 20, yPos);
      yPos += (splitImproved.length * 5) + 20;
    }

    // Footer
    if (yPos > 260) { doc.addPage(); yPos = 20; } else { yPos = 270; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setDrawColor(30, 58, 138);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    doc.text('DEVELOPED BY TEACHER VO THI THU HA', 105, yPos, { align: 'center' });

    doc.save(`Writing-Feedback-${studentName}-${selectedUnit.id.toString().replace(/\s+/g, '_')}.pdf`);
  };

  // Navigation Helpers
  const handleBackToUnits = () => {
    setSelectedUnit(null);
    setPracticeMode('MENU');
    resetStates();
  };

  const handleBackToMode = () => {
    setPracticeMode('MENU');
  };

  const resetStates = () => {
    setResult(null);
    setText('');
    setScrambleIdx(0);
    setScrambleStatus('idle');
    setParaStatus('idle');
    setPartScores({ part1: 0, part2: 0, part3: 0 });
    setPartCompletion({ part1: false, part2: false, part3: false });
    setScoreSubmitted(false);
  };

  // --- 1. UNIT SELECTION VIEW ---
  if (!selectedUnit) {
    return (
      <div className="space-y-8 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-white mb-6">Select a Writing Unit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {WRITING_UNITS.map((unit) => (
            <button
              key={unit.id}
              onClick={() => setSelectedUnit(unit)}
              className="group bg-white/5 rounded-[2rem] p-8 shadow-2xl border border-white/10 hover:border-blue-500/50 transition-all text-left flex gap-6 items-start relative overflow-hidden transform hover:-translate-y-1 backdrop-blur-xl"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${unit.color} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform`}>
                <i className={`fas ${unit.icon} text-3xl`}></i>
              </div>
              <div className="z-10 flex-1">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Unit {unit.id}</span>
                <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors mt-1 mb-2">{unit.title}</h3>
                <p className="text-base text-slate-400 line-clamp-2 leading-relaxed">{unit.description}</p>
                <div className={`inline-flex items-center gap-2 mt-4 text-xs font-bold px-3 py-1.5 rounded-full border ${unit.type === 'EMAIL' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                  <i className={`fas ${unit.type === 'EMAIL' ? 'fa-envelope' : 'fa-pen-nib'}`}></i>
                  {unit.type === 'EMAIL' ? 'Email Writing' : 'Essay Writing'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- SUMMARY / CERTIFICATE VIEW ---
  if (practiceMode === 'SUMMARY') {
    const totalScore = partScores.part1 + partScores.part2 + partScores.part3;
    const passed = totalScore >= 6.0;

    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
        <button onClick={handleBackToMode} className="text-slate-400 hover:text-blue-400 font-bold text-lg transition-colors flex items-center mb-4">
          <i className="fas fa-arrow-left mr-3"></i> Back to Menu
        </button>

        {/* Score Summary Card */}
        <Card className="text-center py-12 bg-white/5 border-white/10 shadow-2xl backdrop-blur-2xl">
          <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center text-5xl mb-6 shadow-2xl ${passed ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
            <i className={`fas ${passed ? 'fa-trophy' : 'fa-clipboard-check'}`}></i>
          </div>

          <h2 className="text-4xl font-extrabold text-white mb-2">Writing Complete!</h2>
          <p className="text-xl text-slate-400 mb-8">Here is your writing result</p>

          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
            <div className="bg-orange-500/10 p-6 rounded-3xl border border-orange-500/20 shadow-sm">
              <div className="text-sm text-orange-400 font-bold uppercase mb-2 tracking-wide">Task 1</div>
              <div className="text-4xl font-extrabold text-white">{partScores.part1}<span className="text-xl text-slate-500">/2</span></div>
            </div>
            <div className="bg-purple-500/10 p-6 rounded-3xl border border-purple-500/20 shadow-sm">
              <div className="text-sm text-purple-400 font-bold uppercase mb-2 tracking-wide">Task 2</div>
              <div className="text-4xl font-extrabold text-white">{partScores.part2}<span className="text-xl text-slate-500">/2</span></div>
            </div>
            <div className="bg-blue-500/10 p-6 rounded-3xl border border-blue-500/20 shadow-sm">
              <div className="text-sm text-blue-400 font-bold uppercase mb-2 tracking-wide">Task 3</div>
              <div className="text-4xl font-extrabold text-white">{partScores.part3.toFixed(1)}<span className="text-xl text-slate-500">/6</span></div>
            </div>
          </div>

          <div className="bg-white/5 rounded-3xl p-8 max-w-lg mx-auto mb-8 border border-white/5 shadow-inner">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-3">Total Score</p>
            <div className="text-7xl font-black text-white tracking-tight">{totalScore.toFixed(1)}<span className="text-3xl text-slate-500 font-normal">/10</span></div>
          </div>

          {/* General Feedback */}
          {finalResult?.feedback && (
            <div className="max-w-2xl mx-auto mb-8 bg-blue-500/10 rounded-2xl p-6 border border-blue-500/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0">
                  <i className="fas fa-comment-dots text-xl"></i>
                </div>
                <div className="text-left">
                  <p className="font-bold text-blue-400 mb-2">General Feedback</p>
                  <p className="text-slate-300 leading-relaxed">{finalResult.feedback}</p>
                </div>
              </div>
            </div>
          )}

          {passed ? (
            <div className="space-y-6">
              <p className="text-green-600 font-bold text-xl">🎉 Congratulations! You have completed this writing task excellently.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => handleDownloadCertificate()}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:-translate-y-1 transition-all flex items-center gap-3"
                >
                  <i className="fas fa-certificate text-xl"></i>
                  Download Certificate
                </button>
                <button
                  onClick={handleDownloadFeedback}
                  className="px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-2xl border border-white/20 hover:bg-white/20 transform hover:-translate-y-1 transition-all flex items-center gap-3"
                >
                  <i className="fas fa-file-download text-xl text-blue-400"></i>
                  Download Feedback (.txt)
                </button>
                <button
                  onClick={handleDownloadFeedbackPDF}
                  className="px-8 py-4 bg-blue-600/20 text-blue-400 font-bold text-lg rounded-2xl border border-blue-500/30 hover:bg-blue-600/30 transform hover:-translate-y-1 transition-all flex items-center gap-3"
                >
                  <i className="fas fa-file-pdf text-xl"></i>
                  Download Feedback (.pdf)
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-orange-600 font-bold text-xl">Keep practicing to reach 6.0 to unlock your certificate!</p>
              <Button onClick={() => {
                handleBackToUnits();
              }}>
                Return to Units
              </Button>
            </div>
          )}
        </Card>

        {/* Detailed Rubric Feedback Section */}
        {finalResult?.rubricFeedback && finalResult.rubricFeedback.length > 0 && (
          <Card>
            <RubricFeedbackCard rubricFeedback={finalResult.rubricFeedback} />
          </Card>
        )}

        {/* Score Breakdown (if available) */}
        {finalResult?.scoreBreakdown && (
          <Card title="Score Breakdown">
            <ScoreBreakdown breakdown={finalResult.scoreBreakdown} />
          </Card>
        )}

        {/* Detailed Errors Section */}
        {finalResult?.detailedErrors && finalResult.detailedErrors.length > 0 && (
          <Card>
            <DetailedErrorsSection errors={finalResult.detailedErrors} />
          </Card>
        )}

        {/* Improved Version */}
        {finalResult?.improvedVersion && (
          <Card title="Improved Version" className="bg-white/5 border-white/10 shadow-2xl backdrop-blur-2xl">
            <div className="bg-green-500/10 rounded-2xl p-6 border border-green-500/20">
              <p className="text-slate-300 text-lg leading-loose font-serif">{finalResult.improvedVersion}</p>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-4 pb-8">
          <Button variant="secondary" onClick={handleBackToMode}>
            <i className="fas fa-redo mr-2"></i> Try Again
          </Button>
          <Button onClick={handleBackToUnits}>
            <i className="fas fa-home mr-2"></i> Choose Another Unit
          </Button>
        </div>
      </div>
    );
  }

  // --- 2. MODE SELECTION VIEW ---
  if (practiceMode === 'MENU') {
    const taskTitle = selectedUnit.type === 'EMAIL' ? 'Email Writing' : 'Essay Writing';
    const allCompleted = partCompletion.part1 && partCompletion.part2 && partCompletion.part3;

    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        <button onClick={handleBackToUnits} className="text-slate-400 hover:text-blue-400 font-bold text-lg transition-colors flex items-center mb-4">
          <i className="fas fa-arrow-left mr-3"></i> Back to Units
        </button>

        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">{selectedUnit.title}</h2>
          <p className="text-xl text-slate-400">Complete all parts to get your certificate</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Part 1 */}
          <div onClick={() => setPracticeMode('SCRAMBLE_WORDS')} className={`cursor-pointer bg-white/5 p-8 rounded-[2rem] shadow-2xl border transition-all duration-300 group relative overflow-hidden backdrop-blur-xl ${partCompletion.part1 ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 hover:border-orange-500/50'}`}>
            {partCompletion.part1 && <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl shadow-sm"><i className="fas fa-check mr-1"></i> Done</div>}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform ${partCompletion.part1 ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
              <i className="fas fa-sort-alpha-down"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Part 1: Sentence Scramble</h3>
            <p className="text-slate-400 text-base font-medium mb-4">2 Points</p>
            <div className={`font-bold text-sm uppercase tracking-wider ${partCompletion.part1 ? 'text-green-400' : 'text-orange-400'}`}>
              {partCompletion.part1 ? 'Review' : 'Start'} <i className="fas fa-arrow-right ml-1"></i>
            </div>
          </div>

          {/* Part 2 */}
          <div onClick={() => setPracticeMode('SCRAMBLE_PARAGRAPH')} className={`cursor-pointer bg-white/5 p-8 rounded-[2rem] shadow-2xl border transition-all duration-300 group relative overflow-hidden backdrop-blur-xl ${partCompletion.part2 ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 hover:border-purple-500/50'}`}>
            {partCompletion.part2 && <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl shadow-sm"><i className="fas fa-check mr-1"></i> Done</div>}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform ${partCompletion.part2 ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
              <i className="fas fa-layer-group"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Part 2: Paragraph Scramble</h3>
            <p className="text-slate-400 text-base font-medium mb-4">2 Points</p>
            <div className={`font-bold text-sm uppercase tracking-wider ${partCompletion.part2 ? 'text-green-400' : 'text-purple-400'}`}>
              {partCompletion.part2 ? 'Review' : 'Start'} <i className="fas fa-arrow-right ml-1"></i>
            </div>
          </div>

          {/* Part 3 */}
          <div onClick={() => setPracticeMode('ESSAY')} className={`cursor-pointer bg-white/5 p-8 rounded-[2rem] shadow-2xl border transition-all duration-300 group relative overflow-hidden backdrop-blur-xl ${partCompletion.part3 ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 hover:border-blue-500/50'}`}>
            {partCompletion.part3 && <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl shadow-sm"><i className="fas fa-check mr-1"></i> Done</div>}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform ${partCompletion.part3 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
              <i className={`fas ${selectedUnit.type === 'EMAIL' ? 'fa-envelope' : 'fa-pen-nib'}`}></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Part 3: {taskTitle}</h3>
            <p className="text-slate-400 text-base font-medium mb-4">6 Points</p>
            <div className={`font-bold text-sm uppercase tracking-wider ${partCompletion.part3 ? 'text-green-400' : 'text-blue-400'}`}>
              {partCompletion.part3 ? 'Review' : 'Start'} <i className="fas fa-arrow-right ml-1"></i>
            </div>
          </div>
        </div>

        {/* Final Action */}
        <div className="flex justify-center">
          <button
            disabled={!allCompleted}
            onClick={() => setPracticeMode('SUMMARY')}
            className={`px-10 py-5 rounded-2xl font-bold text-xl shadow-xl flex items-center gap-4 transition-all duration-300 transform ${allCompleted
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/50 hover:-translate-y-1 cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            <i className="fas fa-flag-checkered text-2xl"></i>
            Finish Unit & Get Certificate
          </button>
        </div>

      </div>
    );
  }

  // --- 3. PART 1: SENTENCE SCRAMBLE ---
  if (practiceMode === 'SCRAMBLE_WORDS') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <button onClick={handleBackToMode} className="flex items-center text-gray-500 hover:text-blue-600 font-bold text-lg transition-colors">
          <i className="fas fa-arrow-left mr-3"></i> Back to Menu
        </button>

        <Card title={`Part 1: Sentence Scramble (${scrambleIdx + 1}/${selectedUnit.scrambleSentences.length})`} className="bg-white/5 border-white/10 shadow-2xl backdrop-blur-2xl">
          <div className="py-8 space-y-10">
            <div className="text-center">
              <p className="text-slate-400 mb-4 font-medium text-lg">Arrange the words to make a meaningful sentence</p>

              {/* Answer Area */}
              <div className={`min-h-[120px] bg-black/20 rounded-2xl border-2 border-dashed p-6 flex flex-wrap gap-3 justify-center items-center transition-colors ${scrambleStatus === 'correct' ? 'border-green-500/50 bg-green-500/10' :
                scrambleStatus === 'wrong' ? 'border-red-500/50 bg-red-500/10' : 'border-white/10'
                }`}>
                {selectedWords.length === 0 && <span className="text-slate-500 italic text-lg">Click words below to build sentence</span>}
                {selectedWords.map((word) => (
                  <button
                    key={word.id}
                    onClick={() => handleWordClick(word, 'selected')}
                    className="px-5 py-3 bg-white/5 border border-white/10 shadow-sm rounded-xl font-bold text-lg text-white hover:bg-red-500/10 hover:border-red-500/50 transition-colors transform active:scale-95"
                  >
                    {word.text}
                  </button>
                ))}
              </div>

              {/* Feedback Message */}
              <div className="h-10 mt-4">
                {scrambleStatus === 'correct' && <span className="text-green-400 font-bold text-xl flex items-center justify-center gap-2"><i className="fas fa-check-circle text-2xl"></i>Correct!</span>}
                {scrambleStatus === 'wrong' && <span className="text-red-400 font-bold text-xl flex items-center justify-center gap-2"><i className="fas fa-times-circle text-2xl"></i>Incorrect, try again.</span>}
              </div>
            </div>

            {/* Word Pool */}
            <div className="flex flex-wrap gap-4 justify-center">
              {availableWords.map((word) => (
                <button
                  key={word.id}
                  onClick={() => handleWordClick(word, 'pool')}
                  className="px-5 py-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl font-bold text-lg shadow-sm hover:bg-blue-500/20 hover:-translate-y-1 transition-all"
                >
                  {word.text}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-6 pt-6 border-t border-white/10">
              <Button variant="secondary" onClick={() => loadScrambleSentence(scrambleIdx)}>
                <i className="fas fa-rotate-right mr-2"></i> Reset
              </Button>
              {scrambleStatus === 'correct' ? (
                <Button onClick={nextScramble}>
                  Next Sentence <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              ) : (
                <Button onClick={checkScramble} disabled={selectedWords.length === 0}>
                  Check Answer
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // --- 4. PART 2: PARAGRAPH SCRAMBLE ---
  if (practiceMode === 'SCRAMBLE_PARAGRAPH') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <button onClick={handleBackToMode} className="flex items-center text-gray-500 hover:text-blue-600 font-bold text-lg transition-colors">
          <i className="fas fa-arrow-left mr-3"></i> Back to Menu
        </button>

        <Card title="Part 2: Paragraph Scramble" className="bg-white/5 border-white/10 shadow-2xl backdrop-blur-2xl">
          <div className="space-y-8">
            <p className="text-slate-400 text-center text-lg font-medium">Arrange the sentences below to form a logical paragraph.</p>

            {/* Ordered Area */}
            <div className={`space-y-4 min-h-[200px] p-6 rounded-2xl border-2 border-dashed transition-colors ${paraStatus === 'correct' ? 'border-green-500/50 bg-green-500/10' :
              paraStatus === 'wrong' ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 bg-black/20'
              }`}>
              {paraSelected.length === 0 && (
                <div className="text-center text-slate-500 h-full flex items-center justify-center pt-12 text-lg">
                  <p>Click sentences from the pool to move them here.</p>
                </div>
              )}
              {paraSelected.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => handleSentenceClick(item, 'selected')}
                  className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer hover:border-red-300 transition-colors flex gap-4 items-center group"
                >
                  <span className="font-bold text-blue-500 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-lg group-hover:bg-red-50 group-hover:text-red-500 transition-colors">{index + 1}</span>
                  <span className="text-lg text-gray-800">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Status */}
            <div className="text-center h-8">
              {paraStatus === 'correct' && <span className="text-green-400 font-bold text-xl"><i className="fas fa-check-circle mr-2"></i>Perfect! Paragraph is correct.</span>}
              {paraStatus === 'wrong' && <span className="text-red-400 font-bold text-xl"><i className="fas fa-times-circle mr-2"></i>Incorrect order. Try again.</span>}
            </div>

            {/* Pool Area */}
            <div className="border-t border-white/10 pt-8">
              <h4 className="font-bold text-slate-300 mb-6 text-xl">Sentence Pool</h4>
              <div className="space-y-4">
                {paraAvailable.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSentenceClick(item, 'pool')}
                    className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl shadow-sm cursor-pointer hover:bg-blue-500/20 hover:shadow-md hover:-translate-y-0.5 transition-all text-blue-200 text-lg font-medium"
                  >
                    {item.text}
                  </div>
                ))}
                {paraAvailable.length === 0 && <p className="text-center text-slate-500 italic text-lg">All sentences placed.</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-6 pt-6">
              <Button variant="secondary" onClick={loadScrambleParagraph}>
                <i className="fas fa-rotate-right mr-2"></i> Reset
              </Button>
              <Button onClick={checkParagraph} disabled={paraAvailable.length > 0 || paraStatus === 'correct'}>
                Check Order
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // --- 5. PART 3: ESSAY/EMAIL WRITING ---
  const taskTitle = selectedUnit.type === 'EMAIL' ? 'Email Writing' : 'Essay Writing';
  const taskIcon = selectedUnit.type === 'EMAIL' ? 'fa-envelope' : 'fa-feather-alt';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <button onClick={handleBackToMode} className="flex items-center text-slate-400 hover:text-blue-400 font-bold text-lg transition-colors">
          <i className="fas fa-arrow-left mr-3"></i> Back to Menu
        </button>
        <div className="text-sm font-bold text-blue-400 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 uppercase tracking-wide backdrop-blur-md">Part 3: {taskTitle}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="space-y-6">
          <Card title="Writing Task" className="h-full bg-white/5 border-white/10 shadow-2xl backdrop-blur-2xl">
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl text-blue-100">
                <p className="font-bold mb-2 text-lg flex items-center gap-2 text-blue-400"><i className={`fas ${taskIcon}`}></i> Prompt:</p>
                <p className="italic mb-4 text-lg leading-relaxed font-serif text-slate-200">"{selectedUnit.essayPrompt}"</p>
                <p className="text-sm text-blue-300 bg-blue-500/10 p-3 rounded-lg"><span className="font-bold text-blue-400">Hint:</span> {selectedUnit.essayHint}</p>
              </div>

              {/* New Structure Hint */}
              <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-2xl text-purple-100">
                <h4 className="font-bold mb-3 flex items-center gap-2 text-lg text-purple-400"><i className="fas fa-list-ul"></i> Structure Suggestions:</h4>
                <ul className="space-y-3 list-disc pl-5">
                  <li className="leading-relaxed"><span className="font-bold text-purple-400">Introduction:</span> {selectedUnit.structure.introduction}</li>
                  <li className="leading-relaxed"><span className="font-bold text-purple-400">Body:</span> {selectedUnit.structure.body}</li>
                  <li className="leading-relaxed"><span className="font-bold text-purple-400">Conclusion:</span> {selectedUnit.structure.conclusion}</li>
                </ul>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-80 p-6 rounded-2xl border-2 border-white/10 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none bg-black/20 text-white text-lg leading-loose font-medium shadow-inner transition-all placeholder-slate-600"
                placeholder={`Type your ${selectedUnit.type === 'EMAIL' ? 'email' : 'essay'} here...`}
              />
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-slate-500">{text.split(/\s+/).filter(w => w.length > 0).length} words</span>
                <Button onClick={handleEssayAnalyze} isLoading={isAnalyzing} disabled={text.length < 10}>
                  <i className="fas fa-paper-plane mr-2"></i> AI Grading
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Output Area */}
        <div className="space-y-6">
          {result ? (
            <Card title="Assessment Result" className="h-full bg-white/5 border-blue-500/30 shadow-2xl backdrop-blur-2xl ring-1 ring-blue-500/20">
              <div className="flex flex-col gap-8 mb-8">
                <div className="flex items-center gap-8 bg-black/20 p-6 rounded-3xl border border-white/5">
                  <ScoreCircle score={(result.score / 10) * 6} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white text-xl">General Feedback</h3>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Scaled to 6.0</span>
                    </div>
                    <p className="text-base text-slate-300 leading-relaxed">{result.feedback}</p>
                  </div>
                </div>
                {/* Score Breakdown */}
                {result.scoreBreakdown && (
                  <div className="w-full">
                    <ScoreBreakdown breakdown={result.scoreBreakdown} />
                  </div>
                )}
              </div>

              <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {/* Rubric Feedback Section */}
                {result.rubricFeedback && result.rubricFeedback.length > 0 && (
                  <RubricFeedbackCard rubricFeedback={result.rubricFeedback} />
                )}

                {/* Detailed Errors Section */}
                {result.detailedErrors && result.detailedErrors.length > 0 && (
                  <DetailedErrorsSection errors={result.detailedErrors} />
                )}

                {result.improvedVersion && (
                  <div className="bg-green-500/10 p-6 rounded-3xl border border-green-500/20 shadow-sm">
                    <h4 className="text-green-400 font-bold mb-4 text-base uppercase tracking-wide flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"><i className="fas fa-magic"></i></div>
                      Improved Version
                    </h4>
                    <p className="text-slate-300 text-lg leading-loose font-serif">{result.improvedVersion}</p>
                  </div>
                )}
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <Button onClick={handleFinishPart3}>
                  Save Part 3 & Return <i className="fas fa-save ml-2"></i>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="h-full rounded-[2rem] border-4 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 p-12 text-center bg-black/20 backdrop-blur-sm">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-xl border border-white/5">
                <i className="fas fa-robot text-4xl text-blue-400"></i>
              </div>
              <p className="text-xl font-medium max-w-md text-slate-400">Write your {selectedUnit.type === 'EMAIL' ? 'email' : 'essay'} on the left and click "AI Grading" to get instant feedback from Gemini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WritingPractice;