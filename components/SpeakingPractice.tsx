import React, { useState, useRef, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import lamejs from 'lamejs';

import { Button, Card, ScoreCircle, ScoreBreakdown, RubricFeedbackCard, DetailedErrorsSection } from './Components';
import { analyzePronunciation, interactWithExaminer, gradeSpeakingSession, generateSpeech } from '../services/geminiService';
import { AIResponse, ChatMessage } from '../types';

interface Props {
  onComplete: (score: number) => void;
  studentName: string;
}

interface Unit {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  shadowingSentences: string[];
  freeSpeakingQuestions?: { question: string; hint: string }[];
}

const UNITS: Unit[] = [
  {
    id: 1,
    title: "Generation Gap and Independent Life",
    description: "Discuss the differences between generations in your family and how to live independently.",
    icon: "fa-users",
    color: "from-blue-500 to-cyan-500",
    shadowingSentences: [
      "Teenagers want freedom, but parents want control.",
      "Living independently helps young people grow up.",
      "Parents worry, but teens want to make their own decisions.",
      "The generation gap causes arguments at home.",
      "Understanding each other can close the generation gap."
    ],
    freeSpeakingQuestions: [
      { question: "What problems do teenagers often have with their parents? Why?", hint: "rules, clothes, friends, going out late" },
      { question: "Why do many teenagers want to live more independently?", hint: "freedom, decisions, responsibility" },
      { question: "In your opinion, why do parents worry so much about their children?", hint: "safety, future, school performance" },
      { question: "How can parents and teenagers reduce the generation gap?", hint: "communication, listening, understanding" },
      { question: "Do you think teenagers today are more independent than in the past? Why or why not?", hint: "Compare with previous generations & express personal opinion" }
    ]
  },
  {
    id: 2,
    title: "Vietnam and ASEAN",
    description: "Explain the role of Vietnam within the ASEAN community and the benefits of integration.",
    icon: "fa-flag",
    color: "from-red-500 to-pink-500",
    shadowingSentences: [
      "Vietnam is an active member of ASEAN.",
      "ASEAN countries work together for peace and development.",
      "Vietnam attracts many tourists with its rich culture.",
      "Cultural diversity makes ASEAN stronger.",
      "Cooperation helps ASEAN countries grow."
    ],
    freeSpeakingQuestions: [
      { question: "What do you like most about Vietnam compared with other ASEAN countries? Why?", hint: "culture, food, landscapes, cost of living" },
      { question: "If you could visit one ASEAN country, which one would you choose and what would you like to see there?", hint: "Singapore, Thailand, famous landmarks, natural beauty" },
      { question: "How does being a member of ASEAN benefit Vietnam?", hint: "economy, education, culture, tourism" },
      { question: "In what ways can students help promote Vietnamese culture to people from other ASEAN countries?", hint: "social media, cultural exchanges, volunteering" },
      { question: "Do you think cooperation among ASEAN countries is important in the future? Why or why not?", hint: "solidarity, solving common problems, economic strength" }
    ]
  },
  {
    id: 3,
    title: "Global Warming and Ecological Systems",
    description: "What are the main causes of global warming, and how does it affect our ecosystem?",
    icon: "fa-globe-asia",
    color: "from-green-500 to-emerald-600",
    shadowingSentences: [
      "Global warming is becoming a serious problem that affects many countries around the world.",
      "Human activities such as cutting down trees and using fossil fuels cause climate change.",
      "As the Earth gets warmer, extreme weather events happen more frequently.",
      "Reducing pollution is an important way to protect the environment and human health.",
      "If people do not take action now, global warming will have more serious effects in the future."
    ]
  },
  {
    id: 4,
    title: "World Heritage Site",
    description: "Describe a World Heritage Site you know and why it is important to preserve it.",
    icon: "fa-landmark",
    color: "from-yellow-500 to-orange-500",
    shadowingSentences: [
      "World heritage sites are important because they show the history and culture of different countries.",
      "Hoi An Ancient Town attracts many visitors thanks to its well-preserved buildings and traditions.",
      "If world heritage sites are not protected carefully, they may be damaged or destroyed.",
      "Many heritage sites face serious threats from tourism and environmental pollution.",
      "Protecting world heritage sites is a shared responsibility of governments and local communities."
    ]
  },
  {
    id: 5,
    title: "Cities and Education in the Future",
    description: "Predict changes in city life and education systems.",
    icon: "fa-city",
    color: "from-indigo-500 to-purple-600",
    shadowingSentences: [
      "Smart cities will use technology to improve the quality of life.",
      "Online learning allows students to study from anywhere in the world.",
      "In the future, robots might replace human teachers in some subjects.",
      "Traffic jams will be solved by self-driving cars and better public transport.",
      "Education will focus more on critical thinking than memorization."
    ],
    freeSpeakingQuestions: [
      { question: "How do you think cities will change in the next 50 years?", hint: "technology, environment, transport, smart buildings" },
      { question: "What are the advantages and disadvantages of online learning?", hint: "flexibility, cost vs lack of interaction, motivation" },
      { question: "Do you think robots can replace teachers in the future? Why?", hint: "emotional support, creativity, information delivery" },
      { question: "What skills will be most important for students in the future?", hint: "IT skills, problem solving, adaptability" },
      { question: "Would you prefer to live in a smart city or the countryside? Why?", hint: "convenience vs nature, pollution vs peace" }
    ]
  },
  {
    id: 6,
    title: "Social Issues",
    description: "Discuss common social problems and possible solutions.",
    icon: "fa-people-arrows",
    color: "from-gray-500 to-slate-600",
    shadowingSentences: [
      "Poverty is a major social issue in many developing countries.",
      "Bullying at school can have long-lasting effects on children.",
      "Social media can sometimes cause depression and anxiety among teenagers.",
      "Peer pressure often forces young people to do things they dislike.",
      "We need to work together to solve problems like crime and inequality."
    ],
    freeSpeakingQuestions: [
      { question: "What do you think is the biggest social issue in your country today?", hint: "traffic, pollution, poverty, crime" },
      { question: "How can we reduce bullying in schools?", hint: "strict rules, education, support systems" },
      { question: "Why do some teenagers fall into social evils?", hint: "family background, bad friends, lack of awareness" },
      { question: "What role does social media play in modern social issues?", hint: "cyberbullying, fake news, unrealistic standards" },
      { question: "How can students help the community to solve social problems?", hint: "volunteering, raising awareness, helping friends" }
    ]
  },
  {
    id: 7,
    title: "Healthy Lifestyle",
    description: "Explore habits for maintaining physical and mental health.",
    icon: "fa-heart-pulse",
    color: "from-teal-400 to-green-500",
    shadowingSentences: [
      "A balanced diet is essential for maintaining good health.",
      "Regular exercise helps to reduce stress and improve mood.",
      "Getting enough sleep is just as important as eating healthy food.",
      "Fast food contains too much fat and sugar, which is bad for the heart.",
      "Mental health should be taken care of alongside physical health."
    ],
    freeSpeakingQuestions: [
      { question: "What do you do to stay healthy everyday?", hint: "sports, diet, sleep habits" },
      { question: "Why is breakfast considered the most important meal of the day?", hint: "energy for the day, focus, metabolism" },
      { question: "Do you think young people today live a healthy lifestyle? Why?", hint: "technology addiction, fast food, lack of exercise" },
      { question: "How does stress affect your health?", hint: "sleep problems, mood swings, illness" },
      { question: "What advice would you give to someone who wants to lose weight?", hint: "exercise regularly, eat less sugar, drink water" }
    ]
  },
  {
    id: 8,
    title: "Health and Life Expectancy",
    description: "Factors affecting longevity and healthcare challenges.",
    icon: "fa-user-doctor",
    color: "from-sky-500 to-blue-700",
    shadowingSentences: [
      "Advances in medicine have helped people live longer than before.",
      "Regular check-ups can prevent serious diseases later in life.",
      "An aging population brings both challenges and opportunities.",
      "A clean environment contributes significantly to higher life expectancy.",
      "Vaccination has saved millions of lives around the world."
    ],
    freeSpeakingQuestions: [
      { question: "Why has life expectancy increased in recent years?", hint: "better medicine, nutrition, hygiene" },
      { question: "What are the challenges of an aging population?", hint: "healthcare costs, labor shortage, pension" },
      { question: "Do you think living longer is always better? Why?", hint: "quality of life vs quantity, health issues" },
      { question: "How does pollution affect people's life expectancy?", hint: "lung diseases, cancer, immune system" },
      { question: "What can the government do to improve public health?", hint: "build hospitals, health insurance, green spaces" }
    ]
  }
];

type PracticeMode = 'MENU' | 'SHADOWING' | 'FREE_SPEAKING' | 'SUMMARY';

// Helper to create WAV header for raw PCM data
const createWavUrl = (base64Audio: string, sampleRate = 24000): string => {
  const binaryString = atob(base64Audio);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // RIFF chunk length
  view.setUint32(4, 36 + len, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (1 is PCM)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * 2, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, len, true);

  const blob = new Blob([wavHeader, bytes], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
};

const SpeakingPractice: React.FC<Props> = ({ onComplete, studentName }) => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('MENU');

  // --- Score Tracking ---
  const [partScores, setPartScores] = useState({ part1: 0, part2: 0 });
  const [partCompletion, setPartCompletion] = useState({ part1: false, part2: false });
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const partScoresRef = useRef({ part1: 0, part2: 0 });

  // Shadowing State
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  // Free Speaking Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [turnCount, setTurnCount] = useState(0);
  const MAX_TURNS = 5;
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Collect all user answer blobs for Free Speaking download
  const userAudioBlobsRef = useRef<Blob[]>([]);
  const [userAnswerCount, setUserAnswerCount] = useState(0);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [finalResult, setFinalResult] = useState<AIResponse | null>(null); // Lưu kết quả chấm điểm cuối cùng cho Free Speaking
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [permissionError, setPermissionError] = useState<string>("");

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [audioUrl]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Auto-play the latest examiner message via browser TTS when Gemini TTS has no audio
  useEffect(() => {
    if (practiceMode !== 'FREE_SPEAKING') return;
    if (chatHistory.length === 0) return;
    const lastMsg = chatHistory[chatHistory.length - 1];
    // Only auto-play AI messages that have no Gemini audio
    if (lastMsg.role !== 'ai' || lastMsg.audioUrl) return;
    // Small delay to let the UI render first
    const timeout = setTimeout(() => speakWithBrowser(lastMsg.text), 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatHistory, practiceMode]);

  // Keep ref in sync with state
  useEffect(() => {
    partScoresRef.current = partScores;
  }, [partScores]);

  // Auto-save score when entering SUMMARY mode
  useEffect(() => {
    if (practiceMode === 'SUMMARY' && !scoreSubmitted) {
      const totalScore = partScoresRef.current.part1 + partScoresRef.current.part2;
      onComplete(totalScore);
      setScoreSubmitted(true);
    }
  }, [practiceMode, scoreSubmitted, onComplete]);

  // Auto-start Free Speaking Session
  useEffect(() => {
    if (practiceMode === 'FREE_SPEAKING' && selectedUnit && chatHistory.length === 0) {
      startFreeSpeakingSession();
    }
  }, [practiceMode, selectedUnit]);

  const resetSession = () => {
    setResult(null);
    setAudioUrl(null);
    setAudioChunks([]);
    setTimer(0);
    setPermissionError("");
    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  const startFreeSpeakingSession = async () => {
    setIsAnalyzing(true);
    try {
      // If unit has pre-defined questions, use the first one
      const firstQ = selectedUnit?.freeSpeakingQuestions ? selectedUnit.freeSpeakingQuestions[0].question : undefined;

      const { aiResponse } = await interactWithExaminer([], selectedUnit!.title, undefined, firstQ);

      // Audio is handled by browser speechSynthesis via useEffect auto-play
      setChatHistory([{ role: 'ai', text: aiResponse, audioUrl: undefined }]);
    } catch (e) {
      console.error(e);
      setPermissionError("Could not connect to AI examiner.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startRecording = async () => {
    // In Free Speaking, we don't clear chat history, just the current audio recording
    if (practiceMode !== 'FREE_SPEAKING') resetSession();
    else {
      setAudioUrl(null);
      setAudioChunks([]);
      setTimer(0);
      if (timerRef.current) window.clearInterval(timerRef.current);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setAudioChunks(chunks);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      timerRef.current = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error(err);
      setPermissionError("Cannot access microphone. Please grant permission in browser settings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      if (timerRef.current) window.clearInterval(timerRef.current);
    }
  };

  const handlePlaySample = async () => {
    if (isPlayingSample || !selectedUnit) return;
    setIsPlayingSample(true);
    try {
      const text = selectedUnit.shadowingSentences[currentSentenceIdx];
      const base64 = await generateSpeech(text);
      if (base64) {
        const audioUrl = createWavUrl(base64, 24000);
        const audio = new Audio(audioUrl);
        audio.onended = () => {
          setIsPlayingSample(false);
          URL.revokeObjectURL(audioUrl);
        };
        audio.play();
      } else {
        setIsPlayingSample(false);
      }
    } catch (e) {
      console.error("Error playing sample:", e);
      setIsPlayingSample(false);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64 = base64String.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleShadowingSubmit = async () => {
    if (audioChunks.length === 0 || !selectedUnit) return;
    setIsAnalyzing(true);
    try {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const base64 = await blobToBase64(audioBlob);
      const targetText = selectedUnit.shadowingSentences[currentSentenceIdx];
      const response = await analyzePronunciation(base64, targetText);
      setResult(response);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  const handleSavePart1 = () => {
    if (!result) return;
    // Scale 10 to 5
    const scaledScore = (result.score / 10) * 5;
    setPartScores(prev => ({ ...prev, part1: scaledScore }));
    setPartCompletion(prev => ({ ...prev, part1: true }));
    setPracticeMode('MENU');
    setResult(null);
  };

  const handleFreeSpeakingSubmit = async () => {
    if (audioChunks.length === 0 || !selectedUnit) return;

    setIsAnalyzing(true);
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    // Save blob for later download
    userAudioBlobsRef.current.push(audioBlob);
    setUserAnswerCount(prev => prev + 1);
    const base64 = await blobToBase64(audioBlob);

    // Determine next question
    const nextTurnIndex = turnCount + 1;
    const isFinalTurn = nextTurnIndex >= MAX_TURNS;

    let nextQ = undefined;
    if (!isFinalTurn && selectedUnit.freeSpeakingQuestions && selectedUnit.freeSpeakingQuestions[nextTurnIndex]) {
      nextQ = selectedUnit.freeSpeakingQuestions[nextTurnIndex].question;
    }

    try {
      // Send audio to AI to transcribe + get next question
      const { userTranscription, aiResponse } = await interactWithExaminer(
        chatHistory,
        selectedUnit.title,
        base64,
        nextQ,
        isFinalTurn
      );

      // Audio is handled by browser speechSynthesis via useEffect auto-play
      const newHistory: ChatMessage[] = [
        ...chatHistory,
        { role: 'user', text: userTranscription, audioUrl: audioUrl || undefined },
        { role: 'ai', text: aiResponse, audioUrl: undefined }
      ];

      setChatHistory(newHistory);
      setTurnCount(prev => prev + 1);

      // Reset recorder for next turn
      setAudioUrl(null);
      setAudioChunks([]);
      setTimer(0);

      // 2. Check if Session Finished (5 turns)
      if (isFinalTurn) {
        // Finalize
        const finalGrade = await gradeSpeakingSession(newHistory, selectedUnit.title, base64);

        // Lưu kết quả chi tiết để hiển thị trong SUMMARY
        setFinalResult(finalGrade);

        // Scale 10 to 5 for Part 2
        const scaledScore = (finalGrade.score / 10) * 5;
        setPartScores(prev => ({ ...prev, part2: scaledScore }));
        setPartCompletion(prev => ({ ...prev, part2: true }));

        setPracticeMode('SUMMARY');
        // onComplete will be called automatically by the useEffect above
      }

    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadCertificate = () => {
    if (!selectedUnit) return;

    const totalScore = partScores.part1 + partScores.part2;

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
    ctx.strokeStyle = '#DAA520'; // Golden Rod
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

    // 3. Header
    ctx.fillStyle = '#1a365d'; // Dark Blue
    ctx.font = 'bold 50px serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE', canvas.width / 2, 140);

    ctx.font = '28px serif';
    ctx.fillStyle = '#DAA520';
    ctx.fillText('OF SPEAKING MASTERY', canvas.width / 2, 180);

    // 4. Content
    ctx.font = 'italic 24px sans-serif';
    ctx.fillStyle = '#555555';
    ctx.fillText('This certificate is proudly presented to', canvas.width / 2, 250);

    // Student Name
    ctx.font = 'bold italic 60px serif';
    ctx.fillStyle = '#2563EB'; // Blue-600
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
    ctx.fillText(`For outstanding performance in`, canvas.width / 2, 400);
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
    link.download = `Speaking-Certificate-${studentName}-${selectedUnit.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleDownloadFeedback = () => {
    if (!selectedUnit || !finalResult) return;

    const totalScore = partScores.part1 + partScores.part2;
    const today = new Date().toLocaleString();

    let content = `================================================
SPEAKING PRACTICE FEEDBACK - LINGUAAI
================================================

STUDENT: ${studentName}
DATE: ${today}
UNIT: ${selectedUnit.id} - ${selectedUnit.title}

------------------------------------------------
1. OVERALL SCORE: ${totalScore.toFixed(1)} / 10.0
------------------------------------------------
- Part 1 (Shadowing): ${partScores.part1.toFixed(1)} / 5.0
- Part 2 (Free Speaking): ${partScores.part2.toFixed(1)} / 5.0

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
3. GENERAL FEEDBACK
------------------------------------------------
${finalResult.feedback || "No feedback available."}

------------------------------------------------
4. RUBRIC BREAKDOWN
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
5. DETAILED ERRORS & CORRECTIONS
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

    if (finalResult.transcription) {
      content += `
------------------------------------------------
6. CONVERSATION TRANSCRIPT
------------------------------------------------
${finalResult.transcription}
`;
    }

    content += `
================================================
DEVELOPED BY TEACHER VO THI THU HA
================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `Speaking-Feedback-${studentName}-${selectedUnit.id.toString().replace(/\s+/g, '_')}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadFeedbackPDF = () => {
    if (!selectedUnit || !finalResult) return;

    const totalScore = partScores.part1 + partScores.part2;
    const today = new Date().toLocaleString();

    const doc = new jsPDF();
    let yPos = 20;

    // Header
    doc.setFillColor(30, 58, 138); // Dark Blue
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('SPEAKING PRACTICE FEEDBACK', 105, 20, { align: 'center' });
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
    doc.text(`- Part 1 (Shadowing): ${partScores.part1.toFixed(1)} / 5.0`, 25, yPos);
    yPos += 7;
    doc.text(`- Part 2 (Free Speaking): ${partScores.part2.toFixed(1)} / 5.0`, 25, yPos);

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

    // General Feedback
    if (yPos > 250) { doc.addPage(); yPos = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('3. GENERAL FEEDBACK', 20, yPos);
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
      doc.text('4. RUBRIC BREAKDOWN', 20, yPos);
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
      doc.text('5. DETAILED ERRORS & CORRECTIONS', 20, yPos);
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

    // Conversation Transcript
    if (finalResult.transcription) {
      if (yPos > 230) { doc.addPage(); yPos = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('6. CONVERSATION TRANSCRIPT', 20, yPos);
      yPos += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const splitTranscript = doc.splitTextToSize(finalResult.transcription, 170);
      doc.text(splitTranscript, 20, yPos);
      yPos += (splitTranscript.length * 5) + 20;
    }

    // Footer
    if (yPos > 260) { doc.addPage(); yPos = 20; } else { yPos = 270; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setDrawColor(30, 58, 138);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    doc.text('DEVELOPED BY TEACHER VO THI THU HA', 105, yPos, { align: 'center' });

    doc.save(`Speaking-Feedback-${studentName}-${selectedUnit.id.toString().replace(/\s+/g, '_')}.pdf`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Browser TTS — reliable fallback when Gemini TTS fails
  const speakWithBrowser = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.88;
    utterance.pitch = 1.05;

    const doSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const enVoice =
        voices.find(v => v.lang === 'en-US' && v.localService) ||
        voices.find(v => v.lang.startsWith('en-')) ||
        voices.find(v => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
      window.speechSynthesis.speak(utterance);
    };

    // Voices may not be loaded yet on first call
    if (window.speechSynthesis.getVoices().length > 0) {
      doSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak();
      };
    }
  };

  const handleDownloadAnswers = async () => {
    if (userAudioBlobsRef.current.length === 0) return;
    try {
      const audioCtx = new AudioContext();
      const mp3Encoder = new lamejs.Mp3Encoder(1, 44100, 128); // mono, 44100 Hz, 128 kbps
      const mp3Data: Uint8Array[] = [];

      for (const blob of userAudioBlobsRef.current) {
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        // Resample to 44100 if needed and get mono channel
        const sampleRate = audioBuffer.sampleRate;
        const channelData = audioBuffer.getChannelData(0); // mono

        // Resample to 44100 Hz if source differs
        let samples: Float32Array;
        if (sampleRate !== 44100) {
          const ratio = sampleRate / 44100;
          const newLength = Math.round(channelData.length / ratio);
          samples = new Float32Array(newLength);
          for (let i = 0; i < newLength; i++) {
            samples[i] = channelData[Math.round(i * ratio)];
          }
        } else {
          samples = channelData;
        }

        // Convert Float32 PCM to Int16
        const int16Samples = new Int16Array(samples.length);
        for (let i = 0; i < samples.length; i++) {
          const s = Math.max(-1, Math.min(1, samples[i]));
          int16Samples[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        // Encode in chunks
        const chunkSize = 1152;
        for (let i = 0; i < int16Samples.length; i += chunkSize) {
          const chunk = int16Samples.subarray(i, i + chunkSize);
          const encoded = mp3Encoder.encodeBuffer(chunk);
          if (encoded.length > 0) mp3Data.push(encoded);
        }
      }

      // Flush encoder
      const flushed = mp3Encoder.flush();
      if (flushed.length > 0) mp3Data.push(flushed);
      audioCtx.close();

      const mp3Blob = new Blob(mp3Data as unknown as BlobPart[], { type: 'audio/mp3' });
      const url = URL.createObjectURL(mp3Blob);
      const link = document.createElement('a');
      link.download = `Speaking-Answers-${studentName}-Unit${selectedUnit?.id ?? ''}.mp3`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('MP3 encoding failed:', err);
      alert('Could not encode MP3. Your browser may not support audio decoding.');
    }
  };

  const handleBackToUnits = () => {
    setSelectedUnit(null);
    setPracticeMode('MENU');
    resetSession();
    setChatHistory([]);
    setTurnCount(0);
    setPartScores({ part1: 0, part2: 0 });
    setPartCompletion({ part1: false, part2: false });
    setScoreSubmitted(false);
    userAudioBlobsRef.current = [];
    setUserAnswerCount(0);
  };

  const handleBackToMode = () => {
    setPracticeMode('MENU');
    resetSession();
    // Do not reset scores or completion status here to allow progress
  };

  // --- 1. UNIT SELECTION VIEW ---
  if (!selectedUnit) {
    return (
      <div className="space-y-8 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-white mb-6">Select a Speaking Unit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {UNITS.map((unit) => (
            <button
              key={unit.id}
              onClick={() => setSelectedUnit(unit)}
              className="group bg-white/5 rounded-[2rem] p-8 shadow-2xl border border-white/10 hover:border-blue-500/50 transition-all text-left flex gap-6 items-start relative overflow-hidden transform hover:-translate-y-1 backdrop-blur-xl"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${unit.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
                <i className={`fas ${unit.icon} text-3xl`}></i>
              </div>
              <div className="z-10 flex-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Unit {unit.id}</span>
                <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors mt-1 mb-2">{unit.title}</h3>
                <p className="text-lg text-slate-400 mt-2 line-clamp-2 leading-relaxed">{unit.description}</p>
              </div>
              <div className="absolute right-0 bottom-0 opacity-[0.03] transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform">
                <i className={`fas ${unit.icon} text-9xl`}></i>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- SUMMARY VIEW (FINAL SCREEN) ---
  if (practiceMode === 'SUMMARY') {
    const totalScore = partScores.part1 + partScores.part2;
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

          <h2 className="text-4xl font-extrabold text-white mb-2">Unit Complete!</h2>
          <p className="text-xl text-slate-400 mb-8">Here is your speaking result</p>

          <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
            <div className="bg-purple-500/10 p-6 rounded-3xl border border-purple-500/20 shadow-sm">
              <div className="text-sm text-purple-400 font-bold uppercase mb-2 tracking-wide">Part 1 (Shadowing)</div>
              <div className="text-4xl font-extrabold text-white">{partScores.part1.toFixed(1)}<span className="text-xl text-slate-500">/5</span></div>
            </div>
            <div className="bg-blue-500/10 p-6 rounded-3xl border border-blue-500/20 shadow-sm">
              <div className="text-sm text-blue-400 font-bold uppercase mb-2 tracking-wide">Part 2 (Free Speaking)</div>
              <div className="text-4xl font-extrabold text-white">{partScores.part2.toFixed(1)}<span className="text-xl text-slate-500">/5</span></div>
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

          {/* Certificate — only for passed students (≥ 6.0) */}
          {passed ? (
            <div className="space-y-3">
              <p className="text-green-500 font-bold text-xl">🎉 Congratulations! You have completed this speaking task excellently.</p>
              <div className="flex justify-center">
                <button
                  onClick={handleDownloadCertificate}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:-translate-y-1 transition-all flex items-center gap-3"
                >
                  <i className="fas fa-certificate text-xl"></i>
                  Download Certificate
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-orange-400 font-bold text-lg">Keep practicing to reach 6.0 to unlock your certificate!</p>
              <p className="text-slate-500 text-sm">You can still download your feedback and answers below.</p>
            </div>
          )}

          {/* Download Feedback — always visible after session */}
          {finalResult && (
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 flex-wrap">
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
          )}

          {/* Download Answers — always visible when recordings exist */}
          {userAnswerCount > 0 && (
            <div className="mt-4">
              <button
                onClick={handleDownloadAnswers}
                className="mx-auto flex items-center gap-3 px-8 py-4 bg-emerald-600/20 text-emerald-400 font-bold text-lg rounded-2xl border border-emerald-500/30 hover:bg-emerald-600/30 transform hover:-translate-y-1 transition-all"
              >
                <i className="fas fa-headphones text-xl"></i>
                Download Your Answers (.mp3) — {userAnswerCount} recording{userAnswerCount > 1 ? 's' : ''}
              </button>
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
            <ScoreBreakdown breakdown={finalResult.scoreBreakdown} max={3} />
          </Card>
        )}

        {/* Detailed Errors Section */}
        {finalResult?.detailedErrors && finalResult.detailedErrors.length > 0 && (
          <Card>
            <DetailedErrorsSection errors={finalResult.detailedErrors} />
          </Card>
        )}

        {/* Transcript Section */}
        {finalResult?.transcription && (
          <Card title="Conversation Transcript" className="bg-white/5 border-white/10 shadow-2xl backdrop-blur-2xl">
            <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
              <pre className="whitespace-pre-wrap text-slate-300 font-mono text-sm leading-relaxed">
                {finalResult.transcription}
              </pre>
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
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <button onClick={handleBackToUnits} className="text-slate-400 hover:text-blue-400 font-bold text-lg transition-colors flex items-center mb-4">
          <i className="fas fa-arrow-left mr-3"></i> Back to Units
        </button>

        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-white mb-2">{selectedUnit.title}</h2>
          <p className="text-xl text-slate-400">Complete both parts to get your score</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div onClick={() => { setPracticeMode('SHADOWING'); setCurrentSentenceIdx(0); }} className={`cursor-pointer bg-white/5 p-10 rounded-[2rem] shadow-2xl border transition-all group transform hover:-translate-y-1 relative overflow-hidden backdrop-blur-xl ${partCompletion.part1 ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 hover:border-purple-500/50'}`}>
            {partCompletion.part1 && <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl shadow-sm"><i className="fas fa-check mr-1"></i> Done</div>}
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform ${partCompletion.part1 ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
              <i className="fas fa-microphone-lines"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Part 1: Shadowing</h3>
            <p className="text-slate-400 text-lg mb-6">Listen and mimic sentences. Max 5 points.</p>
            <div className={`font-bold text-base uppercase tracking-wider ${partCompletion.part1 ? 'text-green-400' : 'text-purple-400'}`}>
              {partCompletion.part1 ? 'Redo Part 1' : 'Start Practice'} <i className="fas fa-arrow-right ml-1"></i>
            </div>
          </div>

          <div onClick={() => setPracticeMode('FREE_SPEAKING')} className={`cursor-pointer bg-white/5 p-10 rounded-[2rem] shadow-2xl border transition-all group transform hover:-translate-y-1 relative overflow-hidden backdrop-blur-xl ${partCompletion.part2 ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 hover:border-blue-500/50'}`}>
            {partCompletion.part2 && <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl shadow-sm"><i className="fas fa-check mr-1"></i> Done</div>}
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform ${partCompletion.part2 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
              <i className="fas fa-comments"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Part 2: Free Speaking</h3>
            <p className="text-slate-400 text-lg mb-6">Conversation with AI (5 turns). Max 5 points.</p>
            <div className={`font-bold text-base uppercase tracking-wider ${partCompletion.part2 ? 'text-green-400' : 'text-blue-400'}`}>
              {partCompletion.part2 ? 'Redo Part 2' : 'Start Practice'} <i className="fas fa-arrow-right ml-1"></i>
            </div>
          </div>
        </div>

        {/* Final Action */}
        <div className="flex justify-center mt-8">
          <button
            disabled={!(partCompletion.part1 && partCompletion.part2)}
            onClick={() => setPracticeMode('SUMMARY')}
            className={`px-10 py-5 rounded-2xl font-bold text-xl shadow-xl flex items-center gap-4 transition-all duration-300 transform ${partCompletion.part1 && partCompletion.part2
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/50 hover:-translate-y-1 cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            <i className="fas fa-flag-checkered text-2xl"></i>
            View Final Score & Certificate
          </button>
        </div>
      </div>
    );
  }

  // --- 3. SHADOWING MODE ---
  if (practiceMode === 'SHADOWING') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <button onClick={handleBackToMode} className="flex items-center text-slate-400 hover:text-blue-400 font-bold text-lg transition-colors">
          <i className="fas fa-arrow-left mr-3"></i> Back to Menu
        </button>

        <Card title={`Part 1: Shadowing - Sentence ${currentSentenceIdx + 1}/${selectedUnit.shadowingSentences.length}`} className="bg-white/5 border-white/10 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col items-center justify-center space-y-10 py-10">
            {!result ? (
              <>
                <div className="text-center space-y-6 max-w-3xl px-6">
                  <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Read this aloud</p>
                  <h3 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                    "{selectedUnit.shadowingSentences[currentSentenceIdx]}"
                  </h3>

                  {/* Listen Button */}
                  <button
                    onClick={handlePlaySample}
                    disabled={isPlayingSample}
                    className="mx-auto flex items-center gap-3 px-6 py-3 bg-blue-500/10 text-blue-400 rounded-full font-bold text-lg hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                  >
                    {isPlayingSample ? (
                      <>
                        <i className="fas fa-volume-high animate-pulse"></i> Playing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-volume-up"></i> Listen to Sample
                      </>
                    )}
                  </button>

                  <div className="flex gap-4 justify-center mt-8">
                    <button
                      disabled={currentSentenceIdx === 0}
                      onClick={() => { setCurrentSentenceIdx(p => p - 1); resetSession(); }}
                      className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-400 transition-colors border border-white/5"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button
                      disabled={currentSentenceIdx === selectedUnit.shadowingSentences.length - 1}
                      onClick={() => { setCurrentSentenceIdx(p => p + 1); resetSession(); }}
                      className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-400 transition-colors border border-white/5"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>

                {/* Recorder Control */}
                <div className="relative group">
                  {isRecording && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                  )}
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`relative w-28 h-28 rounded-full flex items-center justify-center text-4xl shadow-2xl transition-all duration-300 transform group-hover:scale-105 ${isRecording
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : `bg-gradient-to-br ${selectedUnit.color} text-white`
                      }`}
                  >
                    <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
                  </button>
                </div>
                <div className="text-3xl font-mono text-slate-400 font-bold tracking-widest bg-white/5 px-4 py-1 rounded-lg border border-white/5">
                  {formatTime(timer)}
                </div>

                {audioUrl && !isRecording && (
                  <div className="w-full max-w-lg bg-black/20 p-6 rounded-[2rem] flex flex-col gap-6 shadow-inner border border-white/5">
                    <audio src={audioUrl} controls className="w-full h-12 invert opacity-70" />
                    <div className="flex justify-center gap-4">
                      <Button variant="secondary" onClick={resetSession}>
                        <i className="fas fa-trash mr-2"></i> Retry
                      </Button>
                      <Button onClick={handleShadowingSubmit} isLoading={isAnalyzing}>
                        <i className="fas fa-magic mr-2"></i> Analyze
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Result View inside Shadowing
              <div className="w-full space-y-8 animate-fade-in">
                <div className="flex flex-col items-center">
                  <ScoreCircle score={(result.score / 10) * 5} />
                  <p className="mt-4 text-slate-500 font-bold uppercase">Pronunciation Score (Scaled to 5.0)</p>
                  <div className="text-4xl font-extrabold text-white mt-2">{(result.score / 10 * 5).toFixed(1)}<span className="text-xl text-slate-500">/5</span></div>

                  {/* General Feedback */}
                  <div className="mt-6 max-w-2xl bg-blue-500/10 rounded-2xl p-5 border border-blue-500/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0">
                        <i className="fas fa-comment-dots"></i>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-blue-400 mb-1">General Feedback</p>
                        <p className="text-slate-300 leading-relaxed">{result.feedback}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rubric Feedback for Shadowing */}
                {result.rubricFeedback && result.rubricFeedback.length > 0 && (
                  <div className="mt-8">
                    <RubricFeedbackCard rubricFeedback={result.rubricFeedback} />
                  </div>
                )}

                {/* Score Breakdown */}
                {result.scoreBreakdown && (
                  <div className="mt-6">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <i className="fas fa-chart-bar text-blue-400"></i> Score Breakdown
                    </h4>
                    <ScoreBreakdown breakdown={result.scoreBreakdown} max={3} />
                  </div>
                )}

                {/* Detailed Errors */}
                {result.detailedErrors && result.detailedErrors.length > 0 && (
                  <div className="mt-6">
                    <DetailedErrorsSection errors={result.detailedErrors} />
                  </div>
                )}

                <div className="flex justify-center gap-4 mt-8">
                  <Button variant="secondary" onClick={() => setResult(null)}>
                    <i className="fas fa-rotate-left mr-2"></i> Try Again
                  </Button>
                  <Button onClick={handleSavePart1}>
                    <i className="fas fa-check mr-2"></i> Save & Complete Part 1
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // --- 4. FREE SPEAKING MODE (CHAT UI) ---
  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-160px)] flex flex-col">
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <button onClick={handleBackToMode} className="flex items-center text-slate-400 hover:text-blue-400 font-bold text-lg transition-colors">
          <i className="fas fa-arrow-left mr-3"></i> Back to Menu
        </button>
        <div className="bg-blue-500/10 px-4 py-2 rounded-full text-blue-400 text-sm font-bold shadow-sm border border-blue-500/20 backdrop-blur-md">
          Turn {turnCount}/{MAX_TURNS}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-slate-900/40 rounded-t-[2.5rem] shadow-2xl border border-white/10 p-8 space-y-8 relative custom-scrollbar backdrop-blur-xl">
        {chatHistory.length === 0 && isAnalyzing && (
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col items-center text-slate-500">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-circle-notch fa-spin text-4xl text-blue-500"></i>
              </div>
              <p className="text-lg font-medium text-slate-400">Examiner is preparing the first question...</p>
            </div>
          </div>
        )}

        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'} items-end gap-3`}>
            {msg.role === 'ai' && (
              <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mb-1">
                <i className="fas fa-robot text-sm"></i>
              </div>
            )}
            <div className={`max-w-[75%] rounded-[1.75rem] px-5 py-4 shadow-lg ${msg.role === 'ai'
              ? 'bg-white/5 border border-white/10 rounded-bl-md'
              : 'bg-gradient-to-br from-blue-600 to-indigo-600 rounded-br-md'
              }`}>
              {/* Label */}
              <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${msg.role === 'ai' ? 'text-slate-500' : 'text-blue-200'}`}>
                {msg.role === 'ai' ? '🎙 Examiner Question' : '🎤 Your Answer'}
              </p>
              {/* Audio player if available */}
              {msg.audioUrl && (
                <audio
                  src={msg.audioUrl}
                  controls
                  autoPlay={msg.role === 'ai'}
                  className={`h-10 w-full max-w-[260px] ${msg.role === 'ai' ? 'invert brightness-125' : 'opacity-90'}`}
                />
              )}
              {/* Fallback: show text + browser TTS button for AI when Gemini TTS fails */}
              {!msg.audioUrl && msg.role === 'ai' && (
                <div className="space-y-2">
                  <p className="text-base text-white leading-relaxed">{msg.text}</p>
                  <button
                    onClick={() => speakWithBrowser(msg.text)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm font-bold rounded-full transition-colors"
                  >
                    <i className="fas fa-volume-up"></i> Play
                  </button>
                </div>
              )}
              {!msg.audioUrl && msg.role === 'user' && (
                <p className="text-sm italic text-blue-200">Answer recorded ✓</p>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 mb-1">
                <i className="fas fa-user text-sm"></i>
              </div>
            )}
          </div>
        ))}

        {isAnalyzing && chatHistory.length > 0 && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-5 text-slate-400 text-base flex items-center gap-3">
              <span className="flex gap-1.5">
                <span className="w-2.5 h-2.5 bg-blue-500/50 rounded-full animate-bounce"></span>
                <span className="w-2.5 h-2.5 bg-blue-500/50 rounded-full animate-bounce delay-75"></span>
                <span className="w-2.5 h-2.5 bg-blue-500/50 rounded-full animate-bounce delay-150"></span>
              </span>
              Examiner is thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area (Recording) */}
      <div className="bg-slate-900/60 p-6 border-t border-white/10 rounded-b-[2.5rem] shadow-2xl flex flex-col gap-4 flex-shrink-0 z-10 backdrop-blur-xl">

        {/* Hint Display */}
        {selectedUnit.freeSpeakingQuestions && turnCount < MAX_TURNS && !isRecording && !audioUrl && (
          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl text-base text-blue-200 flex items-start gap-3 animate-fade-in shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0"><i className="fas fa-lightbulb"></i></div>
            <div className="py-1">
              <span className="font-bold text-blue-300">Suggestion:</span> {selectedUnit.freeSpeakingQuestions[turnCount].hint}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-2">
          {turnCount >= MAX_TURNS ? (
            <div className="w-full text-center py-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-3 text-2xl"><i className="fas fa-spinner fa-spin"></i></div>
              <p className="text-blue-800 font-bold text-2xl mb-1">Session Complete!</p>
              <p className="text-gray-500 text-lg">Calculating final score...</p>
            </div>
          ) : (
            <>
              <div className="text-base font-medium text-slate-500">
                {isRecording ? <span className="text-red-400 animate-pulse font-bold flex items-center gap-2"><i className="fas fa-circle text-xs"></i> Recording {formatTime(timer)}</span> : 'Tap microphone to answer'}
              </div>

              <div className="flex gap-4 items-center">
                {audioUrl && !isRecording ? (
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => { setAudioUrl(null); setAudioChunks([]); }}>
                      <i className="fas fa-rotate-left"></i>
                    </Button>
                    <Button onClick={handleFreeSpeakingSubmit} isLoading={isAnalyzing}>
                      Send Answer <i className="fas fa-paper-plane ml-2"></i>
                    </Button>
                  </div>
                ) : (
                  <button
                    disabled={isAnalyzing}
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-xl transition-all hover:scale-105 active:scale-95 ${isRecording
                      ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/30'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                  >
                    <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakingPractice;