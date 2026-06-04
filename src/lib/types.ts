/**
 * CampusPulse AI Ingestion Engine — Type Definitions
 *
 * These interfaces define the exact data contract between the AI engine
 * and the rest of the CampusPulse application.
 */

// ─── Allowed Category Enum ───────────────────────────────────────────────────

export const VALID_CATEGORIES = ['Tech', 'Cultural', 'Sports', 'Academic', 'Social'] as const;
export type EventCategory = (typeof VALID_CATEGORIES)[number];

// ─── Input Contract ──────────────────────────────────────────────────────────

/**
 * What the backend passes into the extraction function.
 * Exactly one of `image_base64` or `url` will be populated.
 */
export interface ExtractionInput {
  type: 'image' | 'link';
  image_base64?: string; // Base64-encoded image string (PNG, JPG, WEBP)
  mime_type?: string;    // e.g. 'image/png', 'image/jpeg'
  url?: string;          // e.g. "https://lu.ma/college-hackathon"
}

// ─── Output Contract ─────────────────────────────────────────────────────────

/**
 * The structured, database-ready event object returned by the engine.
 * All keys are snake_case — no camelCase allowed.
 */
export interface ExtractedEvent {
  title: string | null;
  description: string | null;
  start_time: string | null;   // ISO 8601 UTC — e.g. '2026-06-12T10:00:00Z'
  end_time: string | null;     // ISO 8601 UTC
  location: string | null;
  category: EventCategory | null;
  confidence: 'high' | 'low';
}

// ─── Helper type for the Base64 loader ───────────────────────────────────────

export interface Base64Image {
  base64: string;
  mimeType: string;
  fileName: string;
}
