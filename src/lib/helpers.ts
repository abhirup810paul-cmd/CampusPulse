/**
 * CampusPulse AI Ingestion Engine — Helper Utilities
 *
 * Provides Base64 file conversion, LLM response sanitization,
 * and safe fallback event construction.
 */

import fs from 'node:fs';
import path from 'node:path';
import type { ExtractedEvent, Category } from '../types';
import { VALID_CATEGORIES } from './prompt';

// ─── MIME Type Detection ─────────────────────────────────────────────────────

const MIME_MAP: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
};

export interface Base64Image {
  base64: string;
  mimeType: string;
  fileName: string;
}

/**
 * Reads an image file from disk and converts it to a Base64 string
 * along with its detected MIME type.
 */
export function imageFileToBase64(filePath: string): Base64Image {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  const ext = path.extname(absolutePath).toLowerCase();
  const mimeType = MIME_MAP[ext];

  if (!mimeType) {
    throw new Error(
      `Unsupported image format "${ext}". Supported: ${Object.keys(MIME_MAP).join(', ')}`
    );
  }

  const buffer = fs.readFileSync(absolutePath);
  const base64 = buffer.toString('base64');

  return {
    base64,
    mimeType,
    fileName: path.basename(absolutePath),
  };
}

// ─── LLM Response Sanitization ──────────────────────────────────────────────

/**
 * Strips markdown code fences and other wrapping that LLMs sometimes
 * add around JSON responses despite being told not to.
 */
export function sanitizeLLMResponse(raw: string): string {
  let cleaned = raw.trim();

  // Strip markdown code fences: ```json ... ``` or ``` ... ```
  const fenceMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  // Strip leading "json" keyword if the model prefixed it
  if (cleaned.startsWith('json')) {
    cleaned = cleaned.slice(4).trim();
  }

  // Ensure we're left with something that looks like JSON
  if (!cleaned.startsWith('{')) {
    // Try to find the first { and last } as a last resort
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }
  }

  return cleaned;
}

// ─── Fallback Event ─────────────────────────────────────────────────────────

/**
 * Returns a safe, empty event structure with confidence: "low".
 * Used when the LLM fails, returns bad JSON, or the image is unreadable.
 */
export function buildFallbackEvent(reason?: string): ExtractedEvent {
  return {
    title: '',
    description: reason ? `Extraction failed: ${reason}` : '',
    start_time: null,
    end_time: null,
    location: '',
    category: 'cultural',
    confidence: 'low',
    is_free: true,
    price: null,
  };
}

// ─── Validation ─────────────────────────────────────────────────────────────

/**
 * Validates and normalizes a raw parsed JSON object into a proper ExtractedEvent.
 * Ensures category is valid, timestamps look correct, and all keys exist.
 */
export function validateExtractedEvent(raw: Record<string, unknown>): ExtractedEvent {
  // Validate category — must be one of the allowed lowercase Category values
  let category: Category = 'cultural';
  const rawCategory = raw.category;
  if (typeof rawCategory === 'string') {
    const matched = VALID_CATEGORIES.find((c) => c === rawCategory.toLowerCase());
    if (matched) {
      category = matched;
    }
  }

  // Validate ISO timestamps
  const start_time = isValidISO(raw.start_time) ? (raw.start_time as string) : null;
  const end_time = isValidISO(raw.end_time) ? (raw.end_time as string) : null;

  // Determine confidence
  const hasTitle = typeof raw.title === 'string' && raw.title.length > 0;
  const rawConfidence = raw.confidence === 'high' ? 'high' : 'low';
  const confidence: 'high' | 'low' = hasTitle ? rawConfidence : 'low';

  return {
    title: typeof raw.title === 'string' ? raw.title : '',
    description: typeof raw.description === 'string' ? raw.description : '',
    start_time,
    end_time,
    location: typeof raw.location === 'string' ? raw.location : '',
    category,
    confidence,
    is_free: typeof raw.is_free === 'boolean' ? raw.is_free : true,
    price: typeof raw.price === 'string' ? raw.price : null,
  };
}

/**
 * Checks if a value looks like a valid ISO 8601 date string.
 */
function isValidISO(value: unknown): boolean {
  if (typeof value !== 'string' || value.length === 0) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

// ─── Directory Scanner ──────────────────────────────────────────────────────

/**
 * Finds all supported image files in a directory.
 */
export function findImageFiles(dirPath: string): string[] {
  const absoluteDir = path.resolve(dirPath);

  if (!fs.existsSync(absoluteDir)) {
    return [];
  }

  const files = fs.readdirSync(absoluteDir);
  const supportedExts = Object.keys(MIME_MAP);

  return files
    .filter((f) => supportedExts.includes(path.extname(f).toLowerCase()))
    .map((f) => path.join(absoluteDir, f))
    .sort();
}
