import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const hasGeminiKey = !!apiKey;

let model;
if (hasGeminiKey) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  } catch (error) {
    console.warn("Failed to initialize Gemini:", error);
  }
}

const NOTES_PROMPT = `You are an expert note-taking assistant for students. Convert the following YouTube video transcript into well-structured, comprehensive study notes.

IMPORTANT FORMATTING RULES:
- Use markdown formatting
- Start with a clear title using # 
- Add a ## Summary section (3-5 sentences)
- Add ## Key Concepts section with the most important ideas
- Add ## Detailed Notes section with organized subsections using ### 
- Use bullet points for details
- Bold important terms and definitions
- Add a ## Quick Review / Exam Notes section with concise revision points
- Add a ## Q&A Section with 5 potential exam questions and brief answers
- Make it student-friendly with simple language
- Highlight timestamps in format [MM:SS] where relevant

TRANSCRIPT:
{transcript}

Generate comprehensive, exam-focused study notes:`;

const TRANSLATE_PROMPT = `Translate the following structured notes into {language}. 
Maintain ALL formatting (headers, bullet points, bold text).
Keep technical terms in English with translation in parentheses.
Make it natural and easy to read in {language}.

NOTES:
{notes}

Translated notes:`;

export async function generateNotes(transcript) {
  if (!hasGeminiKey || !model) {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env.local file.');
  }

  try {
    const prompt = NOTES_PROMPT.replace('{transcript}', transcript);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate notes. Please try again.');
  }
}

export async function translateNotes(notes, language) {
  if (!hasGeminiKey || !model) {
    throw new Error('GEMINI_API_KEY is not configured. Add it to .env.local file.');
  }

  const languageMap = {
    hi: 'Hindi',
    hinglish: 'Hinglish (Hindi-English mix)',
    mr: 'Marathi',
  };

  const langName = languageMap[language] || language;

  try {
    const prompt = TRANSLATE_PROMPT
      .replace('{language}', langName)
      .replace('{notes}', notes);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Translation Error:', error);
    throw new Error('Failed to translate notes.');
  }
}
