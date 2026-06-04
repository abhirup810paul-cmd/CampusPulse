# CampusPulse — Project Rules & Architecture

This document defines the overarching guidelines for the CampusPulse platform.

## 1. Project Goal
Build the central event hub for college campuses. A unified interactive calendar combining auto-extracted community events (via LLM vision) and verified official events.

## 2. 48h Scope Cut (FROZEN)
We are strictly building the Demo Spine:
1. **Unified Calendar:** Populated, color-coded, filterable, with detail modal.
2. **RSVP:** Going / Interested / Not Going with live counts.
3. **LLM Ingestion:** Paste link or upload poster -> auto-extracted event -> confirm -> posts.
4. **Calendar Export:** `.ics` download + "Add to Google Calendar".

**CUT:** Live Instagram scraping, cron workers, pgvector dedup, organizer analytics, paid/merch/UPI, push notifications.
**FAKED:** Official scraped events (seeded via DB).

## 3. Tech Stack
- Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Supabase (PostgreSQL, Auth, Storage, Realtime)
- Anthropic Claude API (Vision/Extraction)
- `ics` npm package

## 4. UI/UX Rules
- `snake_case` everywhere in DB and API signatures.
- All API routes return `{ data, error }`.
- Follow the color-coded categories defined in `src/types.ts`.
- Fall back gracefully during LLM extraction (allow manual edit of the form).

## 5. Branching & Ownership
- P1 (Systems Backend): Supabase, Auth, API Routes (`/api/events`).
- P2 (ML Ingestion): LLM Extraction (`/api/extract`), Submit UI, Eval Harness.
- P3 (Discovery): App Shell, Calendar, Modal, Realtime, ICS Export.
