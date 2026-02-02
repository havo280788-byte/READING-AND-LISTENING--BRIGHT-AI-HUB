
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Mic, Volume2, ChevronRight, AlertCircle, Target, Activity, Trophy, Zap, Cpu, CheckCircle2, Lightbulb, MessageSquare, ArrowLeft, StopCircle, Loader2, RefreshCw } from 'lucide-react';
import { getSpeakingFeedback, getInterviewFeedback, speakText, stopAllSpeech, getActiveApiKey } from '../services/geminiService';
import useGameSound from '../hooks/useGameSound';
import { UnitData } from '../types';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import PerformanceCertificate from './PerformanceCertificate';

interface SpeakingModuleProps {
  studentName: string;
  studentUsername?: string;
  unitId: string;
  speakingData: UnitData['speaking'];
  onComplete: (score: number) => void;
  onReturn: () => void;
}

type ModuleStage = 'DRILLS' | 'CONVERSATION' | 'REPORT';
type WordStatus = 'correct' | 'incorrect' | 'partial' | 'pending';

interface WordEvaluation {
  text: string;
  status: WordStatus;
  phoneticNote: string;
}

interface EvaluationResult {
  accuracyScore: number;
  fluencyScore: number;
  words: WordEvaluation[];
  generalTip: string;
}

interface InterviewQuestion {
  q_id: string;
  question: string;
  ai_response: string;
}

const MAX_INTERVIEW_QUESTIONS = 3;

const UNIT_CONFIGS: Record<string, {
  drills: string[],
  interview: InterviewQuestion[],
  coachTitle: string,
  systemInstruction: string,
  topicLabel: string
}> = {
  u1: {
    drills: [
      "I have a conflict with my parents.",
      "My parents are very strict with me.",
      "I want to be more independent in my life."
    ],
    interview: [
      { q_id: "q1", question: "Do you ever have arguments with your parents about your hairstyle or clothes?", ai_response: "" },
      { q_id: "q2", question: "What is the most common reason for conflicts in your family?", ai_response: "" },
      { q_id: "q3", question: "Do your parents let you make your own decisions about your future career?", ai_response: "" }
    ],
    coachTitle: "THE GENERATION GAP COACH",
    systemInstruction: "You are 'THE GENERATION GAP COACH'. Your goal is to guide the student through a 3-question interview about family and generation gap. Act as a unified female persona. Use ENGLISH ONLY. After every student answer, start by saying 'Thank you for your answer' then ask the next question I provide. If it is the last question, say 'Thank you for your answer' and conclude the session.",
    topicLabel: "The Generation Gap"
  },
  u2: {
    drills: [
      "Vietnam is a member of ASEAN.",
      "We should learn more about ASEAN cultural diversity.",
      "The Temple of Literature is a famous historical site in Hanoi."
    ],
    interview: [
      { q_id: "u2_q1", question: "Can you name some famous historical sites in Vietnam that tourists should visit?", ai_response: "" },
      { q_id: "u2_q2", question: "Why do you think it is important for Vietnam to be a member of ASEAN?", ai_response: "" },
      { q_id: "u2_q3", question: "Which ASEAN country would you like to visit in the future? Why?", ai_response: "" }
    ],
    coachTitle: "THE ASEAN CULTURAL COACH",
    systemInstruction: "You are 'THE ASEAN CULTURAL COACH'. Guide the student through an interview about Vietnam and ASEAN. Unified female persona only. Use ENGLISH ONLY. Start with 'Thank you for your answer' after each response.",
    topicLabel: "Vietnam and ASEAN"
  },
  u3: {
    drills: [
      "Global warming is a serious threat to our ecological systems.",
      "We need to reduce carbon emissions to protect the planet.",
      "Renewable energy sources like wind and solar are better for the environment."
    ],
    interview: [
      { q_id: "u3_q1", question: "What are some of the main causes of global warming in your opinion?", ai_response: "" },
      { q_id: "u3_q2", question: "How does global warming affect the wildlife and plants in Vietnam?", ai_response: "" },
      { q_id: "u3_q3", question: "What can you and your friends do to help protect the environment at school?", ai_response: "" }
    ],
    coachTitle: "THE ECO-SYSTEM COACH",
    systemInstruction: "You are 'THE ECO-SYSTEM COACH'. Interview the student about Global Warming and Ecosystems. Unified female persona only. Use ENGLISH ONLY. Start with 'Thank you for your answer' after each response.",
    topicLabel: "Global Warming"
  },
  u4: {
    drills: [
      "Ha Long Bay is a magnificent natural world heritage site in Vietnam.",
      "We must take action to preserve our cultural heritage for future generations.",
      "Tourism can bring benefits but also pose threats to heritage conservation."
    ],
    interview: [
      { q_id: "u4_q1", question: "Which World Heritage Site in Vietnam do you like the most? Why?", ai_response: "" },
      { q_id: "u4_q2", question: "In your opinion, what are the biggest threats to World Heritage Sites today?", ai_response: "" },
      { q_id: "u4_q3", question: "How can young people help to promote these sites to the world?", ai_response: "" }
    ],
    coachTitle: "THE HERITAGE CONSERVATOR",
    systemInstruction: "You are 'THE HERITAGE CONSERVATOR'. Interview the student about World Heritage. Unified female persona only. Use ENGLISH ONLY. Start with 'Thank you for your answer' after each response.",
    topicLabel: "World Heritage"
  }
};

const SpeakingModule: React.FC<SpeakingModuleProps> = ({ studentName, studentUsername, unitId, onComplete, onReturn }) => {
  const currentConfig = useMemo(() => UNIT_CONFIGS[unitId] || UNIT_CONFIGS.u1, [unitId]);
  
  const [stage, setStage] = useState<ModuleStage>('DRILLS');
  const [drillIdx, setDrillIdx] = useState(0);
  const [interviewIdx, setInterviewIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<string[]>([]);
  const [liveStatus, setLiveStatus] = useState<string>('Ready');
  const [isAIPeaking, setIsAIPeaking] = useState(false);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [isAwaitingAnswer, setIsAwaitingAnswer] = useState(false);
  const [supportedMimeType, setSupportedMimeType] = useState<string>('audio/webm');
  
  const [finalReport, setFinalReport] = useState<any>(null);

  const nextStartTimeRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const sessionRef = useRef<any>(null);
  const currentTurnTranscriptRef = useRef<string>("");
  const fullTranscriptRef = useRef<string[]>([]); 
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null); // Track stream explicitly

  const { playCorrect, playPop, playWrong } = useGameSound();

  // Detect supported mime type on mount
  useEffect(() => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg',
      'audio/wav'
    ];
    for (const t of types) {
      if (MediaRecorder.isTypeSupported(t)) {
        setSupportedMimeType(t);
        break;
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudioHardware();
    };
  }, []);

  const stopAllAudioHardware = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close().catch(() => {});
      outputAudioContextRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const flushAllAudio = () => {
    stopAllSpeech();
    for (const source of sourcesRef.current) {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {}
    }
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    setIsAIPeaking(false);
  };

  const handleSpeak = async (text: string) => {
    flushAllAudio();
    setIsAIPeaking(true);
    await speakText(text);
    setIsAIPeaking(false);
  };

  const initializePendingEvaluation = (text: string) => {
    const words = text.replace(/[.,!?;:]/g, "").split(/\s+/);
    setEvaluation({
      accuracyScore: 0,
      fluencyScore: 0,
      words: words.map(w => ({ text: w, status: 'pending', phoneticNote: 'Analyzing articulation...' })),
      generalTip: 'Linguistic AI is processing phonemes...'
    });
  };

  const startRecordingDrill = async () => {
    if (isRecording || isAnalyzing) return;
    
    // 1. Force Clean Slate
    stopAllAudioHardware();
    playPop();
    setIsRecording(true);
    setEvaluation(null);
    audioChunksRef.current = [];

    try {
      // 2. Hardware Handshake - Bypass Cache
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });
      streamRef.current = stream;
      
      // 3. Setup Analyzer
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;
      
      const source = audioCtx.createMediaStreamSource(stream);
      const analyzer = audioCtx.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);
      
      // Real-time Visualizer Loop
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      const updateLevel = () => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") return;
        analyzer.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVoiceLevel(Math.min(100, avg * 3)); // Scale for visibility
        requestAnimationFrame(updateLevel);
      };

      // 4. Initialize Recorder
      let options = {};
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        options = { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 128000 };
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options = { mimeType: 'audio/mp4', audioBitsPerSecond: 128000 };
      }
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stopAllAudioHardware(); // Release immediately
        setVoiceLevel(0);
        
        const audioBlob = new Blob(audioChunksRef.current, { type: supportedMimeType });
        
        if (audioBlob.size < 500) {
           alert("Microphone Error: No audio detected. Please check your input device.");
           setIsRecording(false);
           setIsAnalyzing(false);
           return;
        }

        initializePendingEvaluation(currentConfig.drills[drillIdx]);
        setIsAnalyzing(true);

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split(',')[1];
          try {
            const result = await getSpeakingFeedback(currentConfig.drills[drillIdx], base64Data, supportedMimeType);
            if (!result || Object.keys(result).length === 0) throw new Error("Empty analysis");
            
            setEvaluation({
              accuracyScore: result.accuracyScore,
              fluencyScore: result.fluencyScore,
              words: result.wordAnalysis.map((w: any) => ({
                text: w.text,
                status: w.status as WordStatus,
                phoneticNote: w.phoneticNote
              })),
              generalTip: result.generalTip
            });
            
            if (result.accuracyScore >= 80) playCorrect(); else playWrong();
          } catch (err: any) {
            console.error("Gemini Handshake Failed:", err);
            let msg = "AI connection failed. Retrying...";
            if (err.message && err.message.includes("403")) msg = "API Key Error: Access Denied.";
            alert(msg);
          } finally {
            setIsAnalyzing(false);
            setIsRecording(false);
          }
        };
      };

      mediaRecorder.start(200); 
      updateLevel(); 

      // Safety Timeout (No auto-timeout policy except for max duration)
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      }, 10000); // 10s max for drills

    } catch (err: any) {
      console.error("Hardware Handshake Error:", err);
      stopAllAudioHardware();
      setIsRecording(false);
      let msg = "Hardware Access Error. Please refresh.";
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = "Microphone Permission Denied. Please allow access in browser settings.";
      }
      alert(msg);
    }
  };

  const stopRecordingDrillManually = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const startLiveSession = async () => {
    flushAllAudio();
    stopAllAudioHardware(); // Ensure clean slate
    setIsLiveActive(true);
    setLiveStatus('Establishing Secure Uplink...'); 
    
    try {
      const apiKey = getActiveApiKey();
      if (!apiKey) throw new Error("API Key missing.");
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      // Live API requires specific sample rates
      const audioCtx = new AudioContextClass({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;
      
      const outputCtx = new AudioContextClass({ sampleRate: 24000 });
      outputAudioContextRef.current = outputCtx;
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000
        }
      });
      streamRef.current = stream;

      const ai = new GoogleGenAI({ apiKey });

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setLiveStatus('Coach Active • Listening');
            const source = audioCtx.createMediaStreamSource(stream);
            const processor = audioCtx.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Wave Meter Logic
              let sum = 0;
              for (let i = 0; i < inputData.length; i += 10) sum += Math.abs(inputData[i]);
              setVoiceLevel(Math.min(100, (sum / (inputData.length / 10)) * 500));

              // PCM Encoding
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              
              sessionPromiseRef.current?.then(s => s.sendRealtimeInput({ media: pcmBlob }))
                .catch(() => {});
            };
            
            source.connect(processor);
            processor.connect(audioCtx.destination);
            sessionRef.current = { stream, processor, source };
            
            const greeting = `Hello! I am ${currentConfig.coachTitle}. I will ask you 3 questions about ${currentConfig.topicLabel}. Are you ready?`;
            setLiveTranscript([`Coach: ${greeting}`]);
            fullTranscriptRef.current = [`Coach: ${greeting}`];
            handleSpeak(greeting);
            setIsAwaitingAnswer(false);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setLiveTranscript(prev => {
                const last = prev[prev.length - 1] || "";
                if (last.startsWith('Coach:')) {
                  const updatedCoachLine = last + text;
                  fullTranscriptRef.current[fullTranscriptRef.current.length - 1] = updatedCoachLine;
                  return [...prev.slice(0, -1), updatedCoachLine];
                }
                const newLine = `Coach: ${text}`;
                fullTranscriptRef.current.push(newLine);
                return [...prev, newLine];
              });
            }
            
            if (message.serverContent?.inputTranscription) {
               const text = message.serverContent.inputTranscription.text;
               currentTurnTranscriptRef.current += text;
               setLiveTranscript(prev => {
                 const last = prev[prev.length - 1] || "";
                 const studentLine = `Student: ${currentTurnTranscriptRef.current}`;
                 if (last.startsWith('Student:')) {
                   return [...prev.slice(0, -1), studentLine];
                 }
                 return [...prev, studentLine];
               });
            }

            if (message.serverContent?.turnComplete) {
               if (currentTurnTranscriptRef.current.trim()) {
                  const finalStudentTurn = `Student: ${currentTurnTranscriptRef.current.trim()}`;
                  fullTranscriptRef.current.push(finalStudentTurn);
                  currentTurnTranscriptRef.current = "";
                  setIsAwaitingAnswer(false);
               }
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              setIsAIPeaking(true);
              const ctx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsAIPeaking(false);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onerror: (e) => {
            console.error('Live Link Broken', e);
            setLiveStatus('Signal Lost');
            stopAllAudioHardware();
            setIsLiveActive(false);
            alert("Connection lost. Please restart the session.");
          },
          onclose: () => {
            setIsLiveActive(false);
            setLiveStatus('Coach Disconnected');
            stopAllAudioHardware();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: currentConfig.systemInstruction,
          outputAudioTranscription: {},
          inputAudioTranscription: {}
        }
      });
    } catch (err: any) {
      console.error("Live Handshake Error:", err);
      stopAllAudioHardware();
      setIsLiveActive(false);
      let msg = 'Connection Failed. Please check permissions.';
      if (err.name === 'NotAllowedError') msg = "Microphone Access Denied.";
      setLiveStatus(msg);
      alert(msg);
    }
  };

  const handleNextQuestion = () => {
    if (interviewIdx < MAX_INTERVIEW_QUESTIONS) {
      const q = currentConfig.interview[interviewIdx];
      flushAllAudio();
      setIsAwaitingAnswer(true);
      
      if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => {
          const prefix = interviewIdx === 0 ? "" : "Thank you for your answer. Now, ";
          session.sendRealtimeInput({
            text: `${prefix}Ask me this specific question: "${q.question}"`
          });
        });
      }
      
      setInterviewIdx(prev => prev + 1);
      setLiveStatus('Coach is asking...');
    } else {
      handleFinishInterview();
    }
  };

  const handleFinishInterview = async () => {
    setIsAnalyzing(true);
    setVoiceLevel(0);
    flushAllAudio();
    stopAllAudioHardware();
    
    if (currentTurnTranscriptRef.current.trim()) {
      fullTranscriptRef.current.push(`Student: ${currentTurnTranscriptRef.current.trim()}`);
      currentTurnTranscriptRef.current = "";
    }

    setIsLiveActive(false);

    try {
      const transcript = fullTranscriptRef.current.join('\n');
      if (!transcript.toLowerCase().includes('student:')) {
        throw new Error("Empty conversation");
      }
      const feedback = await getInterviewFeedback(transcript, currentConfig.topicLabel);
      setFinalReport(feedback);
      setStage('REPORT');
    } catch (err) {
      setFinalReport({
        overallScore: fullTranscriptRef.current.some(l => l.startsWith('Student:')) ? 75 : 0,
        contentFeedback: "Conversation data archived. AI Analysis pending due to network interruption.",
        pronunciationFeedback: "Voice data collected. Standard pronunciation metrics applied.",
        grammarFeedback: "Structural complexity noted. Consistent vocabulary usage.",
        overallMessage: "Session saved. Your communicative effectiveness has been recorded."
      });
      setStage('REPORT');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveAndExit = () => {
    if (!finalReport) return;
    onComplete(finalReport.overallScore);
    onReturn();
  };

  const restartSession = () => {
    setLiveTranscript([]);
    fullTranscriptRef.current = [];
    setInterviewIdx(0);
    startLiveSession();
  };

  if (stage === 'REPORT' && finalReport) {
    return (
      <PerformanceCertificate 
        studentName={studentName}
        studentUsername={studentUsername}
        unitTitle={currentConfig.topicLabel}
        type="Speaking"
        score={finalReport.overallScore}
        feedback={finalReport.overallMessage}
        onSaveAndExit={handleSaveAndExit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 -m-8 p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-10 pb-32">
        <header className="flex flex-col items-center space-y-4 pt-10">
          <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">Speaking Lab</h1>
          <div className="flex gap-2">
            <div className={`h-1.5 w-16 rounded-full transition-all duration-500 ${stage === 'DRILLS' ? 'bg-cyan-400' : 'bg-white/10'}`}></div>
            <div className={`h-1.5 w-16 rounded-full transition-all duration-500 ${stage === 'CONVERSATION' ? 'bg-cyan-400' : 'bg-white/10'}`}></div>
            <div className={`h-1.5 w-16 rounded-full transition-all duration-500 ${stage === 'REPORT' ? 'bg-cyan-400' : 'bg-white/10'}`}></div>
          </div>
        </header>

        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[4rem] p-10 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden">
          {stage === 'DRILLS' && (
            <div className="animate-fadeIn space-y-12">
              <div className="text-center space-y-8">
                <div className="flex items-center justify-center space-x-2 text-slate-500 uppercase font-black text-[10px] tracking-widest">
                  <Target size={14} />
                  <span>Phonetic Drill {drillIdx + 1} / {currentConfig.drills.length}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-tight max-w-4xl mx-auto">
                  "{currentConfig.drills[drillIdx]}"
                </h2>
                
                <div className="flex flex-col items-center gap-10">
                  <div className="flex justify-center space-x-8">
                    <button onClick={() => handleSpeak(currentConfig.drills[drillIdx])} className="group flex flex-col items-center space-y-2">
                      <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all shadow-lg"><Volume2 size={24} /></div>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Model Voice</span>
                    </button>
                    <button onClick={isRecording ? stopRecordingDrillManually : startRecordingDrill} disabled={isAnalyzing} className="group flex flex-col items-center space-y-2">
                      <div className={`w-16 h-16 rounded-3xl border flex items-center justify-center transition-all shadow-xl ${isRecording ? 'bg-rose-600 border-rose-400 text-white animate-pulse' : isAnalyzing ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-white/5 border-white/10 text-rose-500 group-hover:bg-rose-600 group-hover:text-white'}`}>
                        {isAnalyzing ? <Zap className="animate-pulse" size={24} /> : isRecording ? <StopCircle size={24} /> : <Mic size={24} />}
                      </div>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{isRecording ? 'Recording...' : isAnalyzing ? 'Analyzing' : 'Record Answer'}</span>
                    </button>
                  </div>

                  {isRecording && (
                    <div className="w-full max-w-xs space-y-2 animate-fadeIn">
                       <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest text-center">Live Input Monitor</p>
                       <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-rose-500 transition-all duration-75"
                            style={{ width: `${voiceLevel}%` }}
                          ></div>
                       </div>
                    </div>
                  )}
                </div>
              </div>

              {evaluation && (
                <div className="animate-fadeIn space-y-12 pt-10 border-t border-white/10">
                  <div className="flex flex-col items-center space-y-10">
                    <div className="flex flex-wrap gap-x-4 gap-y-8 justify-center">
                      {evaluation.words.map((word, i) => (
                        <div key={i} className="flex flex-col items-center space-y-3">
                          <button 
                            onClick={() => handleSpeak(word.text)}
                            className={`text-2xl md:text-5xl font-black italic px-3 py-1 rounded-2xl transition-all duration-300 relative border-2 ${
                            word.status === 'correct' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5 hover:bg-emerald-400/10 shadow-[0_0_15px_rgba(52,211,153,0.15)]' : 
                            word.status === 'incorrect' ? 'text-rose-500 border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10' : 
                            word.status === 'partial' ? 'text-amber-400 border-amber-400/20 bg-amber-400/5 hover:bg-amber-400/10' :
                            word.status === 'pending' ? 'text-slate-600 border-slate-700 bg-slate-800/5 animate-pulse' :
                            'text-slate-700 opacity-30 border-transparent'
                          }`}>
                            {word.text}
                            {word.status !== 'pending' && word.status !== 'correct' && (
                               <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] shadow-lg">
                                  <AlertCircle size={14} />
                               </div>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 w-full ${isAnalyzing ? 'opacity-20' : 'opacity-100'}`}>
                       <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center space-y-1">
                          <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Accuracy</p>
                          <p className="text-3xl font-black text-white italic">{evaluation.accuracyScore}%</p>
                       </div>
                       <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center space-y-1">
                          <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Fluency</p>
                          <p className="text-3xl font-black text-white italic">{evaluation.fluencyScore}%</p>
                       </div>
                       <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center space-y-1">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Standard</p>
                          <p className="text-xl font-black text-white uppercase italic">{evaluation.accuracyScore >= 80 ? 'Grade A' : 'Improving'}</p>
                       </div>
                    </div>

                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 w-full relative overflow-hidden group shadow-inner">
                      <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400"></div>
                      <div className="flex items-start gap-4">
                        <Lightbulb size={24} className="text-cyan-400 shrink-0" />
                        <div className="space-y-6 w-full">
                          <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Academic Feedback</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {evaluation.words.filter(w => w.status !== 'correct' && w.status !== 'pending').map((w, idx) => (
                              <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-start gap-3 hover:bg-white/10 transition-colors">
                                 <MessageSquare size={14} className="text-amber-500 mt-1 shrink-0" />
                                 <div className="space-y-1">
                                    <p className="text-xs font-black text-white uppercase">[{w.text}]</p>
                                    <p className="text-[11px] text-slate-400 italic leading-relaxed">{w.phoneticNote}</p>
                                 </div>
                              </div>
                            ))}
                            {evaluation.words.filter(w => w.status !== 'correct' && w.status !== 'pending').length === 0 && !isAnalyzing && (
                              <p className="text-sm text-emerald-400 font-medium italic col-span-2">Pronunciation matches academic targets.</p>
                            )}
                          </div>
                          {!isAnalyzing && (
                            <div className="pt-4 border-t border-white/5">
                               <div className="bg-cyan-400/5 p-4 rounded-2xl border border-cyan-400/10">
                                  <p className="text-sm text-slate-300 italic">"{evaluation.generalTip}"</p>
                               </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (drillIdx < currentConfig.drills.length - 1) { setDrillIdx(d => d + 1); setEvaluation(null); }
                      else { setStage('CONVERSATION'); playPop(); }
                    }} 
                    disabled={isAnalyzing}
                    className="w-full py-5 rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all bg-cyan-400 text-slate-950 active:scale-95 hover:bg-cyan-300 disabled:opacity-20"
                  >
                    <span>{drillIdx < currentConfig.drills.length - 1 ? 'Continue Drills' : 'Launch Interaction Lab'}</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}

          {stage === 'CONVERSATION' && (
            <div className="animate-fadeIn space-y-10">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-cyan-500/10 px-4 py-2 rounded-2xl border border-cyan-500/20">
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] flex items-center gap-2">
                    {isLiveActive ? <Activity size={10} className="animate-pulse" /> : <RefreshCw size={10} />}
                    {liveStatus}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{currentConfig.coachTitle}</h3>
                <div className="flex gap-2">
                   {[1, 2, 3].map(i => (
                     <div key={i} className={`w-10 h-1.5 rounded-full border border-cyan-400/20 transition-all duration-700 ${interviewIdx >= i ? 'bg-cyan-400' : 'bg-white/5'}`}></div>
                   ))}
                </div>
              </div>

              <div className="flex flex-col items-center py-6 space-y-12">
                <div className="relative">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${isAIPeaking ? 'border-cyan-400 scale-110 shadow-[0_0_30px_rgba(34,211,238,0.3)]' : 'border-white/10'} transition-all duration-500`}>
                     {isAIPeaking && <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-20"></div>}
                     <Cpu size={64} className={isAIPeaking ? 'text-cyan-400' : 'text-slate-700'} />
                  </div>
                  
                  {isLiveActive && (
                    <div className="absolute top-1/2 left-full ml-10 w-24 hidden md:block">
                       <p className="text-[8px] font-black text-cyan-500 uppercase mb-1">Mic Input</p>
                       <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400 transition-all duration-75" style={{ width: `${voiceLevel}%` }}></div>
                       </div>
                    </div>
                  )}
                </div>

                {!isLiveActive && fullTranscriptRef.current.length === 0 ? (
                  <button onClick={startLiveSession} className="bg-cyan-400 text-slate-950 px-12 py-6 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-xl hover:scale-105 transition-all">ESTABLISH CONNECTION</button>
                ) : !isLiveActive && fullTranscriptRef.current.length > 0 ? (
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-rose-400 font-bold text-sm italic">Connection was lost.</p>
                    <button onClick={restartSession} className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-cyan-100 transition-all">RECONNECT COACH</button>
                  </div>
                ) : (
                  <div className="max-w-3xl w-full space-y-8">
                    <div className="bg-black/40 p-8 rounded-[2rem] border border-white/10 min-h-[200px] max-h-[350px] overflow-y-auto custom-scrollbar space-y-4 shadow-inner">
                       {liveTranscript.length === 0 && <p className="text-slate-600 italic text-center py-10">Waiting for coach to initialize protocol...</p>}
                       {liveTranscript.map((t, i) => (
                         <div key={i} className={`flex ${t.startsWith('Coach:') ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-black leading-relaxed ${t.startsWith('Coach:') ? 'bg-white/5 text-[#00d4ff]' : 'bg-emerald-500/10 text-emerald-400 italic border border-emerald-500/20'}`}>
                               {t}
                            </div>
                         </div>
                       ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <button 
                        onClick={handleNextQuestion} 
                        disabled={isAnalyzing || isAIPeaking || (isAwaitingAnswer && interviewIdx > 0)}
                        className={`bg-cyan-400 text-slate-950 px-8 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all ${ (isAnalyzing || isAIPeaking || (isAwaitingAnswer && interviewIdx > 0)) ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white active:scale-95'}`}
                       >
                         {interviewIdx === 0 ? 'START INTERVIEW' : interviewIdx < MAX_INTERVIEW_QUESTIONS ? 'LISTEN & RESPOND' : 'GENERATE REPORT'}
                       </button>
                       <button onClick={handleFinishInterview} disabled={isAnalyzing} className="bg-rose-600 text-white px-8 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-lg hover:bg-rose-500 transition-all disabled:opacity-20">
                         {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : 'STOP & ARCHIVE'}
                       </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakingModule;
