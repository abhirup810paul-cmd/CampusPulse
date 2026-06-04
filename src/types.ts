export type Category = 'cultural' | 'tech' | 'sports' | 'academic' | 'social';
export type Source = 'official' | 'community';
export type Status = 'published' | 'community';
export type RSVPStatus = 'going' | 'interested' | 'not_going';

export interface Event {
  id: string;
  title: string;
  description: string;
  start_time: string | null;
  end_time: string | null;
  location: string;
  category: Category;
  source: Source;
  status: Status;
  is_free: boolean;
  price: string | null;
  poster_url: string | null;
  created_at: string;
  view_count: number;
  star_count: number;
  rsvp_going_count: number;
  submitter_id: string | null;
}

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
  cultural: '#EC4899', // pink-500
  tech: '#3B82F6',     // blue-500
  sports: '#10B981',   // emerald-500
  academic: '#8B5CF6', // violet-500
  social: '#F59E0B'    // amber-500
};
