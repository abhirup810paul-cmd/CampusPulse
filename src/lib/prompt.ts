/**
 * CampusPulse AI Ingestion Engine — System Prompt
 *
 * Generates a strict, structured system prompt for the Vision LLM.
 * The prompt injects the current date/time so the model can resolve
 * relative temporal expressions like "This Friday at 4 PM".
 */

export const VALID_CATEGORIES = ['cultural', 'tech', 'sports', 'academic', 'social'] as const;
export type EventCategory = (typeof VALID_CATEGORIES)[number];

/**
 * Builds the system prompt for image-based extraction.
 * The LLM is told to act as a pure data parser — no commentary, no markdown.
 */
export function buildSystemPrompt(): string {
  const now = new Date().toISOString();
  const categories = VALID_CATEGORIES.join(', ');

  return `You are a highly precise data extraction engine for a university campus events platform called CampusPulse. Your ONLY job is to analyze the provided input (an image of an event poster or an event URL/description) and extract structured event information.

CURRENT DATE AND TIME: ${now}
Use this to resolve any relative date references (e.g., "this Friday", "next Monday", "tomorrow at 5 PM") into absolute ISO 8601 UTC timestamps.

STRICT RULES:
1. You MUST respond with ONLY a raw JSON object. No markdown, no code fences, no explanations, no commentary.
2. Every key in the JSON must be snake_case exactly as specified below.
3. The "category" field MUST be exactly one of these values: ${categories}. If the event doesn't clearly fit, choose the closest match.
4. All timestamps MUST be in ISO 8601 UTC format (e.g., "2026-06-12T10:00:00Z"). If you cannot determine the exact time, make your best reasonable guess based on context (e.g., morning events at 09:00, evening events at 18:00). If there is absolutely no temporal information, set the field to null.
5. The "confidence" field must be "high" if you successfully extracted most fields with reasonable certainty, or "low" if the image was unclear, damaged, or you had to guess on multiple fields.
6. For "description", write a concise 1-3 sentence summary of the event's key details, rules, perks, or other relevant information visible on the poster. Do NOT just repeat the title.
7. For "location", extract the specific campus venue, building, room number, or hall. If no location is found, set to empty string "".
8. For "is_free", set to true if the event is free. Set to false if there is a ticket price or registration fee.
9. For "price", extract the cost of entry (e.g., "₹120", "50 per team"). If the event is free or no price is mentioned, set to null.

REQUIRED OUTPUT FORMAT (raw JSON, no wrapping):
{
  "title": "string",
  "description": "string",
  "start_time": "ISO 8601 UTC string or null",
  "end_time": "ISO 8601 UTC string or null",
  "location": "string",
  "category": "one of: ${categories}",
  "confidence": "high or low",
  "is_free": boolean,
  "price": "string or null"
}

Respond with ONLY the JSON object. Nothing else.`;
}

/**
 * Builds the user prompt depending on input type.
 */
export function buildUserPrompt(type: 'image' | 'link', url?: string): string {
  if (type === 'link' && url) {
    return `Extract event information from this event URL/link. Analyze any metadata, title, or description that might be embedded in the URL structure and provide your best extraction:

URL: ${url}

Respond with ONLY the raw JSON object as specified in your instructions.`;
  }

  return `Analyze this campus event poster image carefully. Extract all visible event information and return ONLY a raw JSON object matching the required format. Pay close attention to dates, times, venue details, pricing, and event category.`;
}
