
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";

// Exported to allow components to access the unified key logic
export const getActiveApiKey = () => {
  const localKey = localStorage.getItem('user_gemini_key');
  const envKey = process.env.API_KEY;

  // Prioritize Local Storage Key if it exists and is not empty
  if (localKey && localKey.trim() !== "") {
    return localKey;
  }

  // Fallback to Env Key if Local Key is missing
  // Also check if envKey is a placeholder
  if (envKey && !envKey.includes("INSERT_API_KEY") && envKey.trim() !== "") {
    return envKey;
  }

  return "";
};

// Helper to get preferred model or fallback
export const getPreferredModel = (fallback: string = 'gemini-1.5-flash') => {
  return localStorage.getItem('user_gemini_model') || fallback;
};

// Helper for retry logic with backoff
async function retryOperation<T>(operation: () => Promise<T>, retries = 2, delay = 1000): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    const isRateLimit = error?.status === 429 || error?.code === 429 ||
      (error?.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')));

    if (retries > 0 && isRateLimit) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryOperation(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * DATA SYNCHRONIZATION SERVICE - LOCAL MODE ONLY
 * No external Google Sheets sync.
 */
export const syncScoreToSheet = async (data: {
  name: string;
  unit: string;
  module?: string;
  score?: number;
  duration?: string;
  writing_content?: string;
  ai_feedback?: string;
  sentence?: string;
  accuracy?: number;
  fluency?: number;
  tip?: string;
}) => {
  // Local Save Logic can be implemented here if needed (e.g. to localStorage)
  // For now, it's a no-op as per instruction to remove sync protocols.
  console.log("Local save only:", data);
  return true;
};

/**
 * PROGRESS FETCHERS - LOCAL MODE ONLY
 */
export const fetchRemoteProgress = async (studentName: string) => {
  // Return empty or mock data to simulate local-only behavior
  return [];
};

export const fetchClassRanking = async () => {
  // Return empty or mock data
  return [];
};

export const updateModuleStatus = async (studentName: string, moduleId: string, status: string, score: number) => {
  // Local logic only
  console.log("Local update status:", { studentName, moduleId, status, score });
  return true;
};

/**
 * CMS Audio Discovery (Original Master Audio Vault)
 */
export const fetchExternalAudioUrl = async (moduleId: string): Promise<string | null> => {
  const vault: Record<string, string> = {
    // All units now use Gemini TTS to ensure audio matches the text transcripts exactly.
    // Placeholder music files have been removed.
  };
  return vault[moduleId] || null;
};

let globalAudioContext: AudioContext | null = null;
let activeTTSBufferSource: AudioBufferSourceNode | null = null;

export const unlockAudio = async () => {
  if (!globalAudioContext) {
    globalAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  if (globalAudioContext.state === 'suspended') {
    await globalAudioContext.resume();
  }
  return globalAudioContext;
};

export const stopAllSpeech = () => {
  if (activeTTSBufferSource) {
    try {
      activeTTSBufferSource.stop();
      activeTTSBufferSource.disconnect();
    } catch (e) { }
    activeTTSBufferSource = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

function decodeBase64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function createWavBlob(pcmData: Uint8Array, sampleRate: number = 24000): Blob {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  view.setUint32(0, 0x52494646, false);
  view.setUint32(4, 36 + pcmData.length, true);
  view.setUint32(8, 0x57415645, false);
  view.setUint32(12, 0x666d7420, false);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  view.setUint32(36, 0x64617461, false);
  view.setUint32(40, pcmData.length, true);
  return new Blob([header, pcmData], { type: 'audio/wav' });
}

function splitTextForTTS(text: string, maxLength: number = 2000): string[] {
  if (text.length <= maxLength) return [text];

  const chunks: string[] = [];
  let currentChunk = "";

  // Split by sentence endings first
  const sentences = text.match(/[^.!?\n]+[.!?\n]+(\s+|$)/g) || [text];

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLength) {
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  if (currentChunk.trim()) chunks.push(currentChunk.trim());

  return chunks;
}

export const generateAudioUrl = async (text: string): Promise<string | null> => {
  const apiKey = getActiveApiKey();
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });

  const chunks = splitTextForTTS(text);
  const pcmChunks: Uint8Array[] = [];

  try {
    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      // Use retryOperation with explicit generic type
      const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text: chunk }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      }));
      const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64) {
        pcmChunks.push(decodeBase64ToUint8Array(base64));
      }
    }

    if (pcmChunks.length === 0) return null;

    const totalLength = pcmChunks.reduce((acc, curr) => acc + curr.length, 0);
    const combinedPCM = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of pcmChunks) {
      combinedPCM.set(chunk, offset);
      offset += chunk.length;
    }

    const blob = createWavBlob(combinedPCM, 24000);
    return URL.createObjectURL(blob);
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      console.warn("Gemini TTS Quota Exceeded. Falling back to system/silent mode.");
    } else {
      console.error("Audio generation failure:", error);
    }
    return null;
  }
};

export const generateAudioBuffer = async (text: string): Promise<AudioBuffer | null> => {
  const apiKey = getActiveApiKey();
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });

  const chunks = splitTextForTTS(text);
  const pcmChunks: Uint8Array[] = [];

  try {
    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text: chunk }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
        }
      }));
      const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64) {
        pcmChunks.push(decodeBase64ToUint8Array(base64));
      }
    }

    if (pcmChunks.length === 0) return null;

    const totalLength = pcmChunks.reduce((acc, curr) => acc + curr.length, 0);
    const combinedPCM = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of pcmChunks) {
      combinedPCM.set(chunk, offset);
      offset += chunk.length;
    }

    const ctx = await unlockAudio();
    const dataInt16 = new Int16Array(combinedPCM.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      console.warn("Gemini TTS Quota Exceeded (Buffer).");
    }
    return null;
  }
};

export const speakText = async (text: string) => {
  stopAllSpeech();
  const ctx = await unlockAudio();
  const buffer = await generateAudioBuffer(text);
  if (buffer) {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    activeTTSBufferSource = source;
    source.start();
    return new Promise<void>(r => source.onended = () => {
      if (activeTTSBufferSource === source) activeTTSBufferSource = null;
      r();
    });
  }
  return new Promise<void>(r => {
    const u = new SpeechSynthesisUtterance(text);
    u.onend = () => r();
    window.speechSynthesis.speak(u);
  });
};

export const getEnglishDefinition = async (word: string) => {
  const apiKey = getActiveApiKey();
  if (!apiKey) return "...";
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: getPreferredModel('gemini-1.5-flash'),
      contents: `Definition for: "${word}". Max 12 words.`,
    });
    return response.text?.trim() || "";
  } catch (e) {
    return "...";
  }
};

export const generateVocabImage = async (word: string, customPrompt?: string) => {
  const apiKey = getActiveApiKey();
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });
  try {
    const prompt = customPrompt || `Simple educational illustration: ${word}`;
    const response = await ai.models.generateContent({
      model: 'imagen-3.0-generate-001',
      contents: { parts: [{ text: prompt }] },
    });
    // Safe access to inlineData
    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    const data = part?.inlineData;
    return data ? `data:${data.mimeType};base64,${data.data}` : null;
  } catch (e: any) {
    console.error("Image generation failed:", e);
    // Return a placeholder or explicit error if needed, but for now null lets UI handle it (e.g. show default image or error state)
    // You might want to return a specific string to signal error to the UI
    return "ERROR_GENERATION_FAILED";
  }
};

export const getSpeakingFeedback = async (targetSentence: string, audioData: string, mimeType: string = "audio/webm;codecs=opus") => {
  const apiKey = getActiveApiKey();
  if (!apiKey) return {};
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: getPreferredModel('gemini-3-flash-preview'),
    contents: [
      {
        text: `You are an AI Pronunciation Specialist. 
      Evaluate the student's recording of this sentence: "${targetSentence}"
      Check word stress, final consonants, and flow. 
      If the audio has background noise but the speech is intelligible, grade it based on the speech.
      Provide feedback in JSON.` },
      { inlineData: { mimeType: mimeType, data: audioData } }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          accuracyScore: { type: Type.NUMBER },
          fluencyScore: { type: Type.NUMBER },
          wordAnalysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                status: { type: Type.STRING },
                phoneticNote: { type: Type.STRING }
              },
              required: ["text", "status", "phoneticNote"]
            }
          },
          generalTip: { type: Type.STRING }
        },
        required: ["accuracyScore", "fluencyScore", "wordAnalysis", "generalTip"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getInterviewFeedback = async (transcript: string, topic: string) => {
  const apiKey = getActiveApiKey();
  if (!apiKey) return {};
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: getPreferredModel('gemini-1.5-flash'),
    contents: `Analyze this English speaking interview transcript for the topic "${topic}".
    Transcript:
    ${transcript}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          contentFeedback: { type: Type.STRING },
          pronunciationFeedback: { type: Type.STRING },
          grammarFeedback: { type: Type.STRING },
          overallMessage: { type: Type.STRING }
        },
        required: ["overallScore", "contentFeedback", "pronunciationFeedback", "grammarFeedback", "overallMessage"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getWritingFeedback = async (text: string, context: string) => {
  const apiKey = getActiveApiKey();
  if (!apiKey) return {};
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: getPreferredModel('gemini-1.5-flash'),
    contents: `Act as a strict IELTS Examiner and Grammar Coach. Evaluate this Grade 11 English essay.
    Topic: ${context}
    Student Essay: "${text}"
    
    Provide a JSON response adhering to this schema:
    {
      "score": number (0-10, allow 1 decimal),
      "criteriaScores": { "taskResponse": number, "coherence": number, "vocabulary": number, "grammar": number },
      "positives": ["Strength 1 (Vocabulary/Structure)", "Strength 2"],
      "improvements": ["Improvement area 1 (Coherence/Expansion)", "Improvement area 2"],
      "errors": [
        { 
          "original": "exact text segment from essay containing the error", 
          "correction": "corrected text segment", 
          "explanation": "Detailed explanation in Vietnamese (Giải thích chi tiết bằng tiếng Việt)", 
          "type": "Grammar/Spelling/Word Choice/Punctuation" 
        }
      ],
      "detailedAnalysis": "A comprehensive paragraph summarizing the student's performance."
    }
    Important: 
    1. Identify specific errors in grammar, spelling, word choice, and punctuation. 
    2. "explanation" MUST be in Vietnamese.
    3. If the essay is perfect, the "errors" array can be empty.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          criteriaScores: {
            type: Type.OBJECT,
            properties: {
              taskResponse: { type: Type.NUMBER },
              coherence: { type: Type.NUMBER },
              vocabulary: { type: Type.NUMBER },
              grammar: { type: Type.NUMBER }
            }
          },
          positives: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          errors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                correction: { type: Type.STRING },
                explanation: { type: Type.STRING },
                type: { type: Type.STRING }
              },
              required: ["original", "correction", "explanation", "type"]
            }
          },
          detailedAnalysis: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
