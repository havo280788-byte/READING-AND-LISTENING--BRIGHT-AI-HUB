import { GoogleGenAI, Modality } from "@google/genai";
import { AIResponse, ChatMessage, AI_MODELS } from "../types";

// Allow dynamic API key and model injection
let appApiKey = process.env.API_KEY || "";
let appModel = "gemini-3-pro-preview";

// Fallback sequence: if default fails, try these in order
const FALLBACK_MODELS = [
  "gemini-3-pro-preview",
  "gemini-3-flash",
  "gemini-2.5-flash"
];

// TTS dedicated model
const TTS_MODEL = "gemini-2.5-flash-preview-tts";

// Helper for delay in retry logic
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry configuration
const MAX_RETRIES = 4;
const BASE_DELAY_MS = 3000;

export const setApiKey = (key: string) => {
  appApiKey = key;
};

export const setModel = (model: string) => {
  appModel = model;
};

const getClient = () => {
  if (!appApiKey) {
    throw new Error("API Key is missing. Please enter your Gemini API Key in the settings.");
  }
  return new GoogleGenAI({ apiKey: appApiKey });
}

// Helper to clean JSON string if it comes with markdown blocks
const cleanJsonString = (str: string): string => {
  return str.replace(/```json\n?|```/g, "").trim();
};

// Generic helper to generate content with fallback logic
const generateContentWithFallback = async (
  contents: any,
  config: any,
  preferredModel: string = appModel
): Promise<any> => {
  const ai = getClient();

  // List of models to try: Preferred model -> Fallback list
  // Use Set to remove duplicates
  const modelsToTry = Array.from(new Set([preferredModel, ...FALLBACK_MODELS]));

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      console.log(`Attempting with model: ${model}`);
      const response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: config
      });
      return response; // Success
    } catch (error: any) {
      console.warn(`Model ${model} failed:`, error.message);
      lastError = error;
      // Continue to next model
    }
  }

  // If we get here, all models failed
  console.error("All AI models failed.");
  const errorMsg = lastError?.message || "Unknown error";
  if (errorMsg.includes('429')) {
    throw new Error(`API quota exceeded. Vui lòng đợi vài giây và thử lại, hoặc kiểm tra quota API của bạn.`);
  }
  throw new Error(`AI Service Unavailable: ${errorMsg}. Vui lòng kiểm tra API Key trong Settings.`);
};

// Wrapper with exponential backoff retry for 429 errors
const withRetry = async <T>(
  operation: () => Promise<T>,
  operationName: string = "AI operation"
): Promise<T> => {
  let lastError: any = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      const is429 = error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED');

      if (is429 && attempt < MAX_RETRIES - 1) {
        const waitTime = BASE_DELAY_MS * Math.pow(2, attempt);
        console.log(`[${operationName}] Rate limited (attempt ${attempt + 1}/${MAX_RETRIES}). Retrying in ${waitTime}ms...`);
        await delay(waitTime);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

export const generateSpeech = async (text: string): Promise<string> => {
  const ai = getClient();
  // Try different voices as fallback on each retry
  const voices = ['Kore', 'Aoede', 'Charon'];

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const voiceName = voices[attempt % voices.length];
      const response = await ai.models.generateContent({
        model: TTS_MODEL,
        contents: { parts: [{ text }] },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName } }
          }
        }
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return base64Audio; // success
      }
      console.warn(`TTS attempt ${attempt + 1}: No audio data, retrying...`);
    } catch (error: any) {
      console.warn(`TTS attempt ${attempt + 1} failed:`, error.message);
    }

    // Wait before retry: 1s, 2s, 4s
    if (attempt < 2) {
      await delay(1000 * Math.pow(2, attempt));
    }
  }

  console.warn("TTS: All attempts failed, returning empty string for browser fallback.");
  return "";
};

export const analyzeWriting = async (
  text: string,
  taskType: "IELTS" | "TOEIC" | "General" = "General"
): Promise<AIResponse> => {

  const prompt = `
    Act as an expert IELTS Writing examiner for ${taskType}. 
    
    **CRITICAL: ALL YOUR FEEDBACK, EXPLANATIONS, AND SUGGESTIONS MUST BE WRITTEN IN ENGLISH. DO NOT WRITE IN VIETNAMESE.**
    
    Analyze the following text provided by a student.
    
    Student Text: "${text}"

    Your task is to evaluate the student's writing based STRICTLY on the following IELTS Writing rubric (Total 10 points):

    **1. Task Response - Max 2.5 points**
    - 2.5 pts: Fully addresses all parts of the task, presents a well-developed response with relevant, extended and supported ideas.
    - 2.0 pts: Addresses all parts of the task, presents a clear position with relevant main ideas, but some may be inadequately developed.
    - 1.5 pts: Addresses the task only partially, position may be unclear, ideas may be irrelevant or not fully developed.
    - 1.0 pt: Barely addresses the task, position is unclear, ideas are largely undeveloped or irrelevant.
    - 0 pts: Does not address the task at all.

    **2. Coherence and Cohesion - Max 2.5 points**
    - 2.5 pts: Logically organizes information and ideas, uses a range of cohesive devices appropriately, clear paragraphing.
    - 2.0 pts: Arranges information coherently, uses cohesive devices but may be mechanical, clear overall progression.
    - 1.5 pts: Presents information with some organization but lacks overall progression, inadequate or overuse of cohesive devices.
    - 1.0 pt: Does not organize ideas logically, limited use of cohesive devices, difficult to follow.
    - 0 pts: No apparent organization.

    **3. Lexical Resource (Vocabulary) - Max 2.5 points**
    - 2.5 pts: Uses a wide range of vocabulary fluently and flexibly, uses uncommon lexical items with style, rare errors in spelling/word formation.
    - 2.0 pts: Uses a sufficient range of vocabulary, attempts less common vocabulary with some inaccuracy, occasional errors do not impede meaning.
    - 1.5 pts: Uses limited range of vocabulary, errors in word choice and spelling may cause difficulty.
    - 1.0 pt: Uses only basic vocabulary, frequent errors in word choice and spelling.
    - 0 pts: Vocabulary is extremely limited.

    **4. Grammatical Range and Accuracy - Max 2.5 points**
    - 2.5 pts: Uses a wide range of structures, majority of sentences are error-free, rare minor errors.
    - 2.0 pts: Uses a variety of complex structures, errors rarely reduce communication, good control of grammar.
    - 1.5 pts: Uses a mix of simple and complex sentences, frequent grammatical errors may cause some difficulty.
    - 1.0 pt: Uses only a limited range of structures, errors are frequent and may cause strain.
    - 0 pts: Cannot use sentence forms except in memorized phrases.

    Your task:
    1. Score strictly based on the rubric above.
    2. Identify grammatical errors, spelling mistakes, and awkward phrasing.
    3. Suggest better vocabulary appropriate for a high-level context.
    4. Provide a rewritten, improved version of the text.
    5. For each criterion, provide detailed feedback in English explaining the score.
    6. For each criterion, provide 2-3 specific suggestions for improvement in English.

    **IMPORTANT: Write ALL feedback, explanations, and suggestions in English.**

    Return the result strictly in this JSON format:
    {
      "score": number, // Total score out of 10
      "scoreBreakdown": {
        "Task Response": number, // Max 2.5
        "Coherence": number, // Max 2.5
        "Vocabulary": number, // Max 2.5
        "Grammar": number // Max 2.5
      },
      "feedback": "string (General encouraging feedback in English)",
      "rubricFeedback": [
        {
          "criterion": "Task Response",
          "score": number,
          "maxScore": 2.5,
          "feedback": "string (Detailed assessment of how well the task requirements were addressed, ideas developed)",
          "suggestions": ["Improvement suggestion 1 in English", "Improvement suggestion 2 in English"]
        },
        {
          "criterion": "Coherence and Cohesion",
          "score": number,
          "maxScore": 2.5,
          "feedback": "string (Detailed assessment of organization, paragraphing, and use of cohesive devices)",
          "suggestions": ["Suggestion in English", "Suggestion in English"]
        },
        {
          "criterion": "Lexical Resource",
          "score": number,
          "maxScore": 2.5,
          "feedback": "string (Detailed assessment of vocabulary range, accuracy, and appropriateness)",
          "suggestions": ["Suggestion in English", "Suggestion in English"]
        },
        {
          "criterion": "Grammatical Range and Accuracy",
          "score": number,
          "maxScore": 2.5,
          "feedback": "string (Detailed assessment of sentence structures and grammatical accuracy)",
          "suggestions": ["Suggestion in English", "Suggestion in English"]
        }
      ],
      "detailedErrors": [
        {
          "original": "string (the mistake)",
          "correction": "string (the fix)",
          "explanation": "string (Explanation in English why this is wrong)",
          "type": "grammar" | "vocabulary" | "coherence"
        }
      ],
      "improvedVersion": "string (Improved version of the text)"
    }
  `;

  try {
    const response = await withRetry(
      () => generateContentWithFallback(
        prompt,
        { responseMimeType: "application/json" }
      ),
      "Writing Analysis"
    );

    const jsonText = cleanJsonString(response.text || "{}");
    return JSON.parse(jsonText) as AIResponse;
  } catch (error: any) {
    console.error("Gemini Writing Error:", error.message);
    throw error;
  }
};

export const analyzeSpeaking = async (
  audioBase64: string,
  topic: string = "General English"
): Promise<AIResponse> => {
  // Re-using the Grading Logic
  return gradeSpeakingSession([{ role: 'user', text: '(Audio Transcript Placeholder)' }], topic, audioBase64);
};

// --- 1. Interaction Logic (Turn-by-Turn) ---
export const interactWithExaminer = async (
  history: ChatMessage[],
  topic: string,
  userAudioBase64?: string,
  specificQuestion?: string,
  isFinish: boolean = false
): Promise<{ userTranscription: string; aiResponse: string }> => {

  // Construct context from history
  const context = history.map(h => `${h.role === 'ai' ? 'Examiner' : 'Student'}: ${h.text}`).join("\n");

  const systemInstruction = `
    You are a friendly but professional IELTS Speaking Examiner. 
    The topic is: "${topic}".
    
    Your goal is to conduct a short interview.
    
    Current Conversation History:
    ${context}
  `;

  let prompt = "";
  const parts: any[] = [];

  if (!userAudioBase64) {
    // Start of session
    if (specificQuestion) {
      prompt = `Start the interview. Introduce yourself briefly (1 sentence) and ask exactly this question: "${specificQuestion}". Return JSON: { "transcription": "", "response": "Your intro and question" }`;
    } else {
      prompt = `Start the interview. Introduce yourself briefly and ask the first question about "${topic}". Return JSON: { "transcription": "", "response": "Your intro and question" }`;
    }
    parts.push({ text: prompt });
  } else {
    // User responded
    const transcriptionInstruction = "1. Transcribe the user's audio accurately.";

    if (isFinish) {
      prompt = `
          The user just answered the final question via audio.
          ${transcriptionInstruction}
          2. Generate a brief polite closing statement (e.g. "Thank you for your answers. The test is now finished.").
          Do NOT ask another question.
          
          Return JSON: { "transcription": "exact words spoken by student", "response": "Closing statement" }
        `;
    } else if (specificQuestion) {
      prompt = `
          The user just answered via audio. 
          ${transcriptionInstruction}
          2. Generate a brief, natural response to acknowledge their answer (e.g., "That's interesting," "I see").
          3. Ask exactly this NEXT question: "${specificQuestion}".
          4. Keep your response concise (under 30 words) so the student talks more.
          
          Return JSON: { "transcription": "exact words spoken by student", "response": "Your reaction + next question" }
        `;
    } else {
      prompt = `
          The user just answered via audio. 
          ${transcriptionInstruction}
          2. Generate a brief, natural response to acknowledge their answer (e.g., "That's interesting," "I see").
          3. Ask the NEXT follow-up question related to the topic.
          4. Keep your response concise (under 30 words) so the student talks more.
          
          Return JSON: { "transcription": "exact words spoken by student", "response": "Your reaction + next question" }
        `;
    }

    parts.push({ inlineData: { mimeType: "audio/webm; codecs=opus", data: userAudioBase64 } });
    parts.push({ text: prompt });
  }

  try {
    const response = await withRetry(
      () => generateContentWithFallback(
        { parts: parts },
        {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json"
        }
      ),
      "Speaking Interaction"
    );

    const jsonText = cleanJsonString(response.text || "{}");
    const result = JSON.parse(jsonText);

    // TTS is handled by browser speechSynthesis in the component — no API call needed
    return {
      userTranscription: result.transcription || "",
      aiResponse: result.response
    };
  } catch (error: any) {
    console.error("Gemini Interaction Error:", error.message);
    throw error;
  }
};

// --- 2. Final Grading Logic (After 5 turns) ---
export const gradeSpeakingSession = async (
  fullHistory: ChatMessage[],
  topic: string,
  lastAudioBase64?: string // Optional: pass the last audio chunk if needed for specific analysis, but text is primary here
): Promise<AIResponse> => {

  const transcript = fullHistory.map(h => `${h.role.toUpperCase()}: ${h.text}`).join("\n");

  const prompt = `
    Act as a Speaking Examiner following IELTS speaking assessment standards. 
    
    **CRITICAL: ALL YOUR FEEDBACK, EXPLANATIONS, AND SUGGESTIONS MUST BE WRITTEN IN ENGLISH. DO NOT WRITE IN VIETNAMESE.**
    
    Topic: "${topic}".
    
    Here is the full transcript of the interview with the student:
    
    ${transcript}

    Your task is to evaluate the student's performance based STRICTLY on the following IELTS-style rubric (Total 10 points):

    **1. Fluency and Coherence - Max 2.5 points**
    - 2.5 pts: Speaks fluently with steady pace, minimal hesitation, logical organization of ideas, uses cohesive devices naturally.
    - 2.0 pts: Generally fluent but occasional hesitation, ideas mostly organized logically.
    - 1.5 pts: Noticeable hesitation, some repetition, ideas sometimes lack clear connection.
    - 1.0 pt: Frequent pauses, fragmented speech, difficulty maintaining coherent response.
    - 0 pts: Unable to produce connected speech.

    **2. Lexical Resource (Vocabulary) - Max 2.5 points**
    - 2.5 pts: Wide range of vocabulary, uses collocations and idiomatic expressions naturally, precise word choice.
    - 2.0 pts: Good vocabulary range, generally appropriate word choice, some collocations used correctly.
    - 1.5 pts: Adequate vocabulary but limited range, some word choice errors, basic collocations.
    - 1.0 pt: Limited vocabulary, frequent errors affecting meaning, relies on basic words.
    - 0 pts: Extremely limited vocabulary, unable to convey meaning.

    **3. Grammatical Range and Accuracy - Max 2.5 points**
    - 2.5 pts: Uses a variety of complex structures accurately, errors are rare and minor.
    - 2.0 pts: Mix of simple and complex sentences, most structures are accurate.
    - 1.5 pts: Attempts complex structures but with frequent errors, relies mainly on simple sentences.
    - 1.0 pt: Limited range of structures, many grammatical errors affecting communication.
    - 0 pts: Severe grammatical errors, communication greatly impaired.

    **4. Pronunciation - Max 2.5 points**
    - 2.5 pts: Clear pronunciation, natural intonation and stress patterns, easy to understand throughout.
    - 2.0 pts: Generally clear, some minor pronunciation issues, mostly understandable.
    - 1.5 pts: Some pronunciation errors, occasional strain on listener, but still understandable.
    - 1.0 pt: Frequent pronunciation errors, difficult to understand at times.
    - 0 pts: Very poor pronunciation, mostly unintelligible.

    Analyze the transcript (and audio context if available) to determine the score.
    
    **IMPORTANT: Write ALL feedback, explanations, and suggestions in English.** For each criterion, you MUST provide:
    1. A specific score based on the rubric
    2. Detailed feedback explaining WHY the student received that score (in English)
    3. 2-3 specific suggestions for improvement (in English)

    Identify any specific errors in pronunciation, grammar, or vocabulary from the text provided.

    Return the result strictly in this JSON format:
    {
      "transcription": "Full session transcript...",
      "score": number, // Total score out of 10
      "scoreBreakdown": {
         "Fluency": number, // Max 2.5
         "Vocabulary": number, // Max 2.5
         "Grammar": number, // Max 2.5
         "Pronunciation": number // Max 2.5
      },
      "feedback": "string (Overall feedback in English)",
      "rubricFeedback": [
        {
          "criterion": "Fluency and Coherence",
          "score": number,
          "maxScore": 2.5,
          "feedback": "string (Detailed assessment of fluency, pace, hesitation, and logical organization)",
          "suggestions": ["Suggestion in English", "Suggestion in English"]
        },
        {
          "criterion": "Lexical Resource",
          "score": number,
          "maxScore": 2.5,
          "feedback": "string (Detailed assessment of vocabulary range, collocations, and word choice)",
          "suggestions": ["Suggestion in English", "Suggestion in English"]
        },
        {
          "criterion": "Grammatical Range and Accuracy",
          "score": number,
          "maxScore": 2.5,
          "feedback": "string (Detailed assessment of sentence structures and grammatical accuracy)",
          "suggestions": ["Suggestion in English", "Suggestion in English"]
        },
        {
          "criterion": "Pronunciation",
          "score": number,
          "maxScore": 2.5,
          "feedback": "string (Detailed assessment of pronunciation, intonation, and stress)",
          "suggestions": ["Suggestion in English", "Suggestion in English"]
        }
      ],
      "detailedErrors": [
        {
          "original": "string (error)",
          "correction": "string (correction)",
          "explanation": "string (Explanation in English)",
          "type": "pronunciation" | "grammar" | "vocabulary"
        }
      ]
    }
  `;

  // We can attach the last audio chunk just to give the model a sense of the voice quality for the *final* turn
  const contents: any = { parts: [] };
  if (lastAudioBase64) {
    contents.parts.push({ inlineData: { mimeType: "audio/webm; codecs=opus", data: lastAudioBase64 } });
  }
  contents.parts.push({ text: prompt });

  try {
    const response = await withRetry(
      () => generateContentWithFallback(
        contents,
        { responseMimeType: "application/json" }
      ),
      "Speaking Grading"
    );

    const jsonText = cleanJsonString(response.text || "{}");
    return JSON.parse(jsonText) as AIResponse;
  } catch (error: any) {
    console.error("Gemini Grading Error:", error.message);
    throw error;
  }
};

export const analyzePronunciation = async (
  audioBase64: string,
  targetText: string
): Promise<AIResponse> => {

  const prompt = `
    Act as a strict pronunciation coach following IELTS speaking assessment standards. 
    
    **CRITICAL: ALL YOUR FEEDBACK, EXPLANATIONS, AND SUGGESTIONS MUST BE WRITTEN IN ENGLISH. DO NOT WRITE IN VIETNAMESE.**
    
    The student is trying to read/shadow this specific sentence: "${targetText}".
    Analyze the attached audio recording based on the following IELTS-style rubric (Total 10 points).

    **RUBRIC CRITERIA:**

    **1. Fluency and Coherence - Max 2.5 points**
    - 2.5 pts: Speaks fluently with steady pace, smooth flow, good linking sounds, no unnecessary pauses.
    - 2.0 pts: Generally fluent with minor hesitation, mostly smooth delivery.
    - 1.5 pts: Noticeable hesitation, some choppy delivery, word-by-word reading.
    - 1.0 pt: Frequent pauses, fragmented speech, poor rhythm.
    - 0 pts: Unable to produce connected speech.

    **2. Lexical Resource (Vocabulary Pronunciation) - Max 2.5 points**
    - 2.5 pts: All words pronounced correctly, including difficult vocabulary and multi-syllable words.
    - 2.0 pts: Most words correct, minor errors on difficult words.
    - 1.5 pts: Some vocabulary mispronounced, but meaning still clear.
    - 1.0 pt: Many words mispronounced, affecting comprehension.
    - 0 pts: Most words unintelligible.

    **3. Grammatical Accuracy (Sentence Flow) - Max 2.5 points**
    - 2.5 pts: Reads with proper sentence structure awareness, correct pausing at punctuation, maintains sentence meaning.
    - 2.0 pts: Good sentence flow, mostly appropriate pausing.
    - 1.5 pts: Some awkward pauses breaking sentence structure.
    - 1.0 pt: Poor sentence flow, pauses in wrong places.
    - 0 pts: No awareness of sentence structure.

    **4. Pronunciation (Individual Sounds & Intonation) - Max 2.5 points**
    - 2.5 pts: Clear individual sounds, correct ending consonants, natural intonation, proper word stress.
    - 2.0 pts: Generally clear, minor sound errors, mostly natural intonation.
    - 1.5 pts: Some sound errors (th, s, ed endings), flat intonation.
    - 1.0 pt: Many sound errors, monotone delivery.
    - 0 pts: Very poor pronunciation, unintelligible.

    Your task:
    1. Transcribe exactly what the student said.
    2. Score strictly based on the rubric above.
    3. Identify words that were mispronounced, skipped, or added.
    4. For each criterion, provide detailed feedback in English explaining the score.
    5. For each criterion, provide 2-3 specific suggestions for improvement in English.

    **IMPORTANT: Write ALL feedback, explanations, and suggestions in English.**

    Return the result strictly in this JSON format:
    {
      "transcription": "string",
      "score": number (Sum of criteria points, 0-10),
      "scoreBreakdown": {
         "Fluency": number, // Max 2.5
         "Vocabulary": number, // Max 2.5
         "Grammar": number, // Max 2.5
         "Pronunciation": number // Max 2.5
      },
      "feedback": "string (Overall comment in English)",
      "rubricFeedback": [
        {
          "criterion": "Fluency and Coherence",
          "score": number,
          "maxScore": 2.5,
          "feedback": "string (Detailed assessment of fluency, pace, and flow)",
          "suggestions": ["Suggestion in English", "Suggestion in English"]
        },
        {
          "criterion": "Lexical Resource",
          "score": number,
          "maxScore": 2.5,
          "feedback": "string (Detailed assessment of vocabulary pronunciation)",
          "suggestions": ["Suggestion in English", "Suggestion in English"]
        },
        {
          "criterion": "Grammatical Accuracy",
          "score": number,
          "maxScore": 2.5,
          "feedback": "string (Detailed assessment of sentence flow and structure)",
          "suggestions": ["Suggestion in English", "Suggestion in English"]
        },
        {
          "criterion": "Pronunciation",
          "score": number,
          "maxScore": 2.5,
          "feedback": "string (Detailed assessment of individual sounds, intonation, and stress)",
          "suggestions": ["Suggestion in English", "Suggestion in English"]
        }
      ],
      "detailedErrors": [
        {
          "original": "string (the word they struggled with)",
          "correction": "string (IPA or phonetic spelling)",
          "explanation": "string (Specific advice in English on how to pronounce this word)",
          "type": "pronunciation"
        }
      ]
    }
  `;

  try {
    const response = await withRetry(
      () => generateContentWithFallback(
        {
          parts: [
            {
              inlineData: {
                mimeType: "audio/webm; codecs=opus",
                data: audioBase64
              }
            },
            { text: prompt }
          ]
        },
        { responseMimeType: "application/json" }
      ),
      "Pronunciation Analysis"
    );

    const jsonText = cleanJsonString(response.text || "{}");
    return JSON.parse(jsonText) as AIResponse;
  } catch (error: any) {
    console.error("Gemini Pronunciation Error:", error.message);
    throw error;
  }
};
