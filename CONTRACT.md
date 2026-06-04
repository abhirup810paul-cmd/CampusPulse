# CampusPulse — System Contract (v2)

This document is the frozen source of truth for the system's data models and API signatures. Do not deviate from these shapes or routes.

## 1. Database Schema Overview

We use Supabase. Data is stored across the following core tables:
- `users`: Managed by Supabase Auth (Azure AD / Microsoft OAuth for IITG Outlook login). Mirrored to `public.users`.
- `events`: The core event object.
- `rsvps`: Records an attendee's RSVP status (`going`, `interested`, `not_going`).
- `stars`: Records if a user has starred an event.

## 2. Core Entities

### Event
The `events` table must include these columns (all `snake_case`):
- `id` (uuid, pk)
- `title` (text)
- `description` (text)
- `start_time` (timestamptz, nullable)
- `end_time` (timestamptz, nullable)
- `location` (text)
- `category` (text: 'cultural' | 'tech' | 'sports' | 'academic' | 'social')
- `source` (text: 'official' | 'community')
- `status` (text: 'published' | 'community')
- `is_free` (boolean, default true)
- `price` (text, nullable)
- `poster_url` (text, nullable)
- `created_at` (timestamptz)
- `view_count` (int, default 0)
- `star_count` (int, default 0) - *Managed by trigger*
- `rsvp_going_count` (int, default 0) - *Managed by trigger*
- `submitter_id` (uuid, fk to users, nullable)

### ExtractedEvent
The LLM extraction output must precisely match this JSON shape (all `snake_case`):
- `title` (string)
- `description` (string)
- `start_time` (ISO UTC string or null)
- `end_time` (ISO UTC string or null)
- `location` (string)
- `category` (string: 'cultural' | 'tech' | 'sports' | 'academic' | 'social')
- `confidence` (string: 'high' | 'low')
- `is_free` (boolean)
- `price` (string or null)

## 3. Data Integrity & Triggers
- `star_count` and `rsvp_going_count` MUST be updated via Postgres triggers on `INSERT`/`DELETE` of `stars` and `rsvps`. **Do not update these from API routes.**
- Supabase Realtime must be enabled for the `events` table so the client can subscribe to count updates.
- Row Level Security (RLS) policies: users can only modify their own `stars` and `rsvps`. Events are public read.

## 4. API Signatures

All API routes must return exactly `{ data, error }`. `error` is null on success; `data` is null on failure. All keys in JSON payloads are `snake_case`.

### 4.1. `GET /api/events`
Returns all events.
- **Response**: `{ data: Event[], error: null }`

### 4.2. `GET /api/events/:id`
Increments `view_count` and returns the event.
- **Response**: `{ data: Event, error: null }`

### 4.3. `POST /api/events`
Creates a new event (used by the submit flow).
- **Body**: Omit `id`, `created_at`, `view_count`, `star_count`, `rsvp_going_count`.
- **Response**: `{ data: Event, error: null }`

### 4.4. `POST /api/extract`
Extracts event data from an image or URL.
- **Body**: `{ type: 'link', url: string }` OR `{ type: 'image', image_base64: string }`
- **Response**: `{ data: ExtractedEvent, error: null }`
*(Note: Always returns 200 with partial data on extraction failure to degrade gracefully.)*

### 4.5. `POST /api/events/:id/rsvp`
Creates or updates an RSVP for the logged-in user.
- **Body**: `{ status: 'going' | 'interested' | 'not_going' }`
- **Response**: `{ data: null, error: null }`

### 4.6. `POST /api/events/:id/star`
Toggles the star for the logged-in user.
- **Body**: `{ action: 'star' | 'unstar' }`
- **Response**: `{ data: null, error: null }`

### 4.7. `GET /api/events/:id/attendees`
Fetches a list of attendees (for avatars).
- **Response**: `{ data: { user_id: string, avatar_url?: string }[], error: null }`
