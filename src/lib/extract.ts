import { GoogleGenerativeAI } from '@google/generative-ai';
import { ExtractedEvent } from '../types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are a strict data extraction assistant for CampusPulse, a college event platform.
Your task is to extract event details from a poster image or a text description and output ONLY a JSON object.
Do not wrap the JSON in markdown fences (like \`\`\`json) or include any prose.

Output the JSON matching this exact structure:
{
  "title": "string",
  "description": "string (summarize the key vibe and details, max 3 sentences)",
  "start_time": "ISO 8601 UTC string, or null",
  "end_time": "ISO 8601 UTC string, or null",
  "location": "string (e.g. 'Main Auditorium')",
  "category": "cultural" | "tech" | "sports" | "academic" | "social",
  "confidence": "high" | "low",
  "is_free": boolean,
  "price": "string or null"
}

RULES:
1. If the date or time is relative ("this Friday"), use the current date to resolve it.
2. If fields are ambiguous or hard to read, make your best guess but set "confidence": "low".
3. If the input is completely unreadable or not an event, return all null/empty values and "confidence": "low".
4. Ensure category strictly matches one of the 5 allowed strings.
5. All times must be formatted as ISO UTC strings. Assume IST (UTC+5:30) if no timezone is provided.`;

export async function extractEvent(input: { type: 'link' | 'image'; url?: string; image_base64?: string }): Promise<ExtractedEvent> {
  const currentDate = new Date().toISOString();
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: SYSTEM_PROMPT });
    
    let promptParts: any[] = [];
    
    if (input.type === 'image' && input.image_base64) {
      const base64Data = input.image_base64.replace(/^data:image\/\w+;base64,/, '');
      promptParts.push({
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg'
        }
      });
      promptParts.push(`Extract event details from this poster. Today is ${currentDate}. Output purely JSON.`);
    } else if (input.type === 'link' && input.url) {
      promptParts.push(`Extract event details for the event found at this link: ${input.url}. Today is ${currentDate}. Output purely JSON.`);
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: promptParts }],
      generationConfig: {
        temperature: 0.1,
      }
    });

    const textOutput = result.response.text();
    
    // Defensive parsing: strip stray markdown fences
    const cleanJson = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(cleanJson);
    
    // Validate shape
    return {
      title: parsed.title || '',
      description: parsed.description || '',
      start_time: parsed.start_time || null,
      end_time: parsed.end_time || null,
      location: parsed.location || '',
      category: ['cultural', 'tech', 'sports', 'academic', 'social'].includes(parsed.category) ? parsed.category : 'cultural',
      confidence: parsed.confidence === 'high' ? 'high' : 'low',
      is_free: !!parsed.is_free,
      price: parsed.price || null
    };

  } catch (err) {
    console.error("Extraction failed:", err);
    // Graceful fallback
    return {
      title: '',
      description: '',
      start_time: null,
      end_time: null,
      location: '',
      category: 'cultural',
      confidence: 'low',
      is_free: true,
      price: null
    };
  }
}
