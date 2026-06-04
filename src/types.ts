// ── Single source of truth for all CampusPulse types ──

export type Category = 'cultural' | 'tech' | 'sports' | 'academic' | 'social';
export type Source = 'official' | 'club' | 'community';
export type RSVPStatus = 'going' | 'interested' | 'not_going';

/** Matches the Supabase `events` table columns exactly */
export interface Event {
  id: string;
  title: string;
  date: string;          // YYYY-MM-DD
  start: string;         // HH:mm
  end: string;           // HH:mm
  venue: string;
  description: string;
  cat: Category;
  source: Source;
  free: boolean;
  price: string | null;
  going: number;
  interested: number;
  stars: number;
  host: string | null;
  poster_url: string | null;
  created_at: string;
}

/** Output from the AI extraction pipeline */
export interface ExtractedEvent {
  title: string;
  description: string;
  start_time: string | null;
  end_time: string | null;
  location: string;
  category: Category;
  confidence: 'high' | 'low';
  is_free: boolean;
  price: string | null;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  cultural: '#EC4899',
  tech: '#3B82F6',
  sports: '#10B981',
  academic: '#8B5CF6',
  social: '#F59E0B',
};
