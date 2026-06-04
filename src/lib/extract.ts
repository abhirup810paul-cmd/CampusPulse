/**
 * CampusPulse AI Ingestion Engine — Core Extraction Function (Groq + Llama 4 Scout)
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  THIS IS THE MAIN DELIVERABLE                                    │
 * │                                                                  │
 * │  A single, self-contained module that takes an ExtractionInput   │
 * │  (image base64 or URL) and returns a clean ExtractedEvent JSON.  │
 * │                                                                  │
 * │  Import and call:                                                │
 * │    import { extractEvent } from '@/lib/extract';                 │
 * │    const event = await extractEvent(input);                      │
 * └──────────────────────────────────────────────────────────────────┘
 */

import Groq from 'groq-sdk';
import type { ExtractedEvent } from '../types';
import { buildSystemPrompt, buildUserPrompt } from './prompt';
import {
  sanitizeLLMResponse,
  buildFallbackEvent,
  validateExtractedEvent,
} from './helpers';

// ─── Groq Client Initialization ──────────────────────────────────────────────

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error(
      '❌ GROQ_API_KEY not found or not set.\n' +
        '   1. Get your free key from https://console.groq.com/keys\n' +
        '   2. Paste it into the .env file'
    );
  }

  return new Groq({ apiKey });
}

// ─── Core Extraction Function ────────────────────────────────────────────────

/**
 * Extracts structured event data from an image or URL using Groq
 * with Meta's Llama 4 Scout (multimodal vision model).
 */
export async function extractEvent(input: {
  type: 'link' | 'image';
  url?: string;
  image_base64?: string;
  mime_type?: string;
}): Promise<ExtractedEvent> {
  try {
    // ── Validate input ────────────────────────────────────────────────
    if (input.type === 'image' && !input.image_base64) {
      return buildFallbackEvent('No image data provided');
    }
    if (input.type === 'link' && !input.url) {
      return buildFallbackEvent('No URL provided');
    }

    // ── Initialize Groq ───────────────────────────────────────────────
    const groq = getGroqClient();
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(input.type, input.url);

    const messages: any[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ];

    if (input.type === 'image' && input.image_base64) {
      // Vision request: send image as base64 data URI
      // Strip metadata if present before prepending
      const base64Data = input.image_base64.replace(/^data:image\/\w+;base64,/, '');
      const mimeType = input.mime_type || 'image/jpeg';
      const dataUri = `data:${mimeType};base64,${base64Data}`;

      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: userPrompt },
          {
            type: 'image_url',
            image_url: {
              url: dataUri,
            },
          },
        ],
      });
    } else {
      // Text-only request: send URL as text context
      messages.push({
        role: 'user',
        content: userPrompt,
      });
    }

    // ── Execute API Call ─────────────────────────────────────────────
    // Using Llama 4 Scout — a multimodal model with vision capabilities
    // available on Groq's free tier
    const response = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: messages,
      temperature: 0,
      max_tokens: 1024,
    });

    // ── Extract the response text ─────────────────────────────────────
    const rawText = response.choices[0]?.message?.content;

    if (!rawText || rawText.trim().length === 0) {
      return buildFallbackEvent('LLM returned empty response');
    }

    // ── Parse and validate ────────────────────────────────────────────
    const sanitized = sanitizeLLMResponse(rawText);
    const parsed = JSON.parse(sanitized) as Record<string, unknown>;
    const validated = validateExtractedEvent(parsed);

    return validated;
  } catch (error) {
    // ── Defensive fallback — app NEVER crashes ────────────────────────
    const message =
      error instanceof Error ? error.message : 'Unknown extraction error';

    console.error(`\n⚠️  Extraction failed: ${message}\n`);

    return buildFallbackEvent(message);
  }
}
