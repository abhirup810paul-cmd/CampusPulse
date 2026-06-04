# Handoff: CampusPulse — Unified Campus Event Platform

## Overview
CampusPulse is a unified college event discovery platform. Students can browse every campus event in one place, RSVP, star events, and submit their own (with AI-assisted poster extraction). The platform targets IIT Guwahati (generalises to any campus) and runs on **desktop and mobile**.

---

## About the Design Files
The HTML/JSX files in this bundle are **high-fidelity interactive prototypes** — design references showing intended look, layout, and behaviour. They are **not production code to ship directly** (they use Babel-in-browser and inline JSX for ease of iteration).

Your task is to **recreate these designs in your target stack** (React + Tailwind CSS + shadcn/ui as specified in the brief, or the framework you choose) using its established patterns and component libraries.

---

## Fidelity
**High-fidelity.** The prototypes are pixel-accurate references for:
- Exact hex colours per category
- Typography scale (Space Grotesk display, Plus Jakarta Sans body, JetBrains Mono meta)
- Spacing, corner radii, shadow values
- All interaction states (hover, active, focus rings, RSVP selection, star toggle)
- Animation timings (modal pop, AI extraction scan, step list, success ring)

---

## Tech Stack Recommendation
| Layer | Recommendation |
|-------|----------------|
| Framework | Next.js 14 (App Router) or Vite + React 18 |
| Styling | Tailwind CSS v3 + CSS custom properties for category tokens |
| Components | shadcn/ui (Button, Badge, Dialog, Tabs, Toggle, SegmentedControl) |
| Icons | Lucide React (exact icon names listed per component below) |
| Fonts | Google Fonts: `Space Grotesk` (500–700), `Plus Jakarta Sans` (400–800), `JetBrains Mono` (400–600) |
| State | Zustand or React Context for RSVP/star state; localStorage persistence |
| Calendar | Build custom (the time-grid layout is bespoke — no off-the-shelf lib matches) |
| AI extraction | Anthropic Claude API (vision) for poster parsing |
| Auth | Magic link via Resend or Supabase Auth |

---

## Design Tokens

### Category Color System
These are the **exact accent values** from the brief. Use as CSS custom properties:

```css
--cat-tech:     #3b82f6;   /* Tailwind blue-500 */
--cat-cultural: #a855f7;   /* Tailwind purple-500 */
--cat-sports:   #22c55e;   /* Tailwind green-500 */
--cat-academic: #f59e0b;   /* Tailwind amber-400 */
--cat-social:   #ec4899;   /* Tailwind pink-500 */
--cat-personal: #64748b;   /* Tailwind slate-500 */
--cat-merch:    #ef4444;   /* Tailwind red-500 */
--cat-trending: #fb923c;   /* Tailwind orange-400 */
```

For soft backgrounds and ink colours, derive from the accent:
```css
--c-soft:  color-mix(in srgb, var(--c) 16%, var(--surface));
--c-soft-2:color-mix(in srgb, var(--c) 26%, var(--surface));
--c-ink:   color-mix(in srgb, var(--c), var(--text) 26%);
--c-line:  color-mix(in srgb, var(--c) 38%, var(--border));
```

### Light Theme
```
--bg:           #f4f6f9
--surface:      #ffffff
--surface-2:    #f1f4f8
--surface-3:    #e9edf3
--border:       #e3e8ef
--border-strong:#cdd5e0
--text:         #0d1424
--text-2:       #51607a
--text-3:       #8a97ac
```

### Dark Theme
```
--bg:           #05070d
--surface:      #0e1422
--surface-2:    #151d2e
--surface-3:    #1d2738
--border:       #222d42
--border-strong:#32405a
--text:         #eef2f8
--text-2:       #9aa7bd
--text-3:       #647288
```

### Radius
```
--r-sm: 8px   --r-md: 12px   --r-lg: 16px   --r-xl: 22px   --r-pill: 999px
```

### Shadows
```
--shadow-sm: 0 1px 2px rgba(15,23,42,.06), 0 1px 1px rgba(15,23,42,.04)
--shadow-md: 0 4px 14px -4px rgba(15,23,42,.12), 0 2px 6px -2px rgba(15,23,42,.08)
--shadow-lg: 0 24px 60px -18px rgba(15,23,42,.28), 0 10px 24px -12px rgba(15,23,42,.16)
```

### Typography
| Role | Font | Weight | Size | Letter-spacing |
|------|------|--------|------|----------------|
| Display/headings | Space Grotesk | 700 | 24–44px | -0.025em to -0.03em |
| Body | Plus Jakarta Sans | 400/600 | 13–16px | -0.01em |
| Meta/timestamps | JetBrains Mono | 500 | 10–13px | 0 |
| Section labels | Plus Jakarta Sans | 700 | 11px | 0.08em uppercase |

---

## Screens

### 1. Login — Magic Link
**File:** `login.jsx` → `LoginScreen`

**Layout:** Full-viewport two-column grid (`1.05fr 1fr`)
- **Left (brand):** Dark gradient panel (`#0b1120 → #131a2e → #1a1340`). Logo top-left. Large display headline with gradient text on "living calendar." (tech→cultural→social gradient). Category chip strip. Footer caption.
- **Right (form):** Centered vertically. 380px max-width card. Email input with mail icon prefix, `Send magic link` primary button (full-width, lg size), divider, `Browse as guest` secondary button.

**States:**
- Default: email input empty, `Send magic link` button disabled
- Typed valid email: button enables
- Sent: Replace form with confirmation state — mail icon, "Check your inbox" heading, email address shown in bold, `Open CampusPulse` CTA. Link back to re-enter email.

**Email validation:** Standard RFC regex — just `@` + `.` check is sufficient for MVP.

---

### 2. Calendar (Hero Screen)
**File:** `calendar.jsx` → `CalendarScreen`, `MonthView`, `TimeGrid`

**App shell layout:**
- Sticky top bar (64px) + left filter rail (236px fixed) + calendar area (flex-1)
- Mobile: top bar + bottom nav (no filter rail; filter rail becomes a bottom sheet)

**Top bar:**
- Logo left (28px mark + wordmark)
- Search box center (pill shape, surface-2 bg, border, search icon prefix) — max-width 460px
- Nav links: Calendar · Community · Submit · System (icon + label, ghost buttons, surface-2 bg when active)
- Theme toggle button (moon/sun icon, 34×34)
- Avatar button → dropdown (sign out, theme)

**Filter rail (left, 236px):**
- "Filters" label + icon + event count / "Clear" link
- Category: 7 toggle chips (dot + label, pill shape, active state uses `--c-soft` bg + `--c-line` border)
- Source: 3 checkbox rows (Official / Club / Community) — custom checkbox style (16px rounded square)
- Price: 3-option SegmentedControl (All / Free / Paid)
- Fest season info card (dashed border, sparkles icon)

**Calendar header (above grid):**
- Month label (Space Grotesk 700, 26px) + prev/next arrow buttons (32px icon buttons) + Today button
- View toggle: SegmentedControl (Month w/ grid icon / Week / Day)

**Month view grid:**
- 7-column CSS grid, 42 cells, `minmax(118px, 1fr)` row height
- Today: date shown in filled blue-500 circle (24px)
- Out-of-month days: slightly dimmed background
- Event chips: per-day, sorted by start time, max 3 visible + "+N more" link
  - Chip: 6px coloured dot + mono time label + truncated title, `--c-soft` bg, `--c-line` border, left-offset on hover

**Week view:**
- 7 columns + 56px time-label column, sticky day headers
- Auto-scroll to 8am on mount
- Events: absolutely positioned blocks by start time & duration. Lane-packing for overlaps (split column width). Left border `3px solid var(--c)`, `--c-soft` background.
- px/min ratio: `0.95` (so 60min = 57px)

**Day view:**
- Same time grid, single column, events can be wider

---

### 3. Event Detail Modal
**File:** `modal.jsx` → `EventModal`

**Trigger:** Click any calendar chip or event block.

**Layout:** Centered overlay (`max-w-[860px]`), two-column grid (`minmax(0,320px) 1fr`), `max-h-[92vh]`.

**Left column — poster:**
- Striped placeholder (or real image when integrated)
- Category badge (top-left absolute)
- Trending badge (top-right, orange flame)
- Free/Paid badge + Source tag (bottom-left absolute)

**Right column:**
- Title (Space Grotesk 700, 24px)
- Info rows: calendar icon + date + relative day; clock icon + time range; pin icon + venue + host
- Description body text (14.5px, line-height 1.6)
- Attendee section: AvatarStack (32px, max 6 + "+N") + "{N} going · {M} interested" text

**RSVP control (segmented, bottom action bar):**
- 3 segments: Going (green) / Interested (amber) / Can't go (slate)
- Selected segment: solid filled background in category colour, white text
- Unselected: transparent, `--text-2`

**Star button:**
- 34px icon + count, amber when starred (star icon filled amber), `--surface` bg with amber border tint

**Export row:** Two soft buttons full-width: "Add to Google Calendar" (calendar icon) + "Download .ics" (download icon)

**Toast:** Appears at viewport bottom center on export action — dark pill, check icon, fades up, auto-dismisses after 2.2s.

**Animation:** `scale(0.96) translateY(8px) opacity(0)` → natural state, 220ms cubic-bezier(0.2, 0.8, 0.2, 1). Backdrop: blur(6px) + scrim.

---

### 4. Submit Event Flow (Signature Screen)
**File:** `submit.jsx` + `submit-form.jsx`

**Three tabs:** Paste link · Upload poster · Manual (Tabs component, full-width)

#### Upload poster tab (primary flow)

**Idle state:** Dropzone card (dashed border, surface-2 bg). Gradient upload icon (tech→cultural). Drag-and-drop text. OR divider. "Try a sample poster" soft button.

**Extracting state (the magic moment):**
- Left column: poster image/placeholder with overlay
  - Scan line animation: horizontal bar sweeping top→bottom, 1.7s loop, `--cat-tech` glow tint
  - Spinner overlay centre (white circle spinner + sparkles icon)
  - Mono label "reading poster…"
- Step list below (4 steps): Reading poster → Title/desc → Date/time → Venue/category
  - Steps: pending (grey, 40% opacity) → active (purple dot, pulsing) → done (green check circle, full opacity)
  - Timing: 780ms per step, final transition 480ms after last step

**Review state (form visible):**
- Two-column layout: poster (left, sticky, `minmax(0,360px)`) + form (right, animated in)
- "Extracted" green badge overlaid on poster bottom-left
- Form header: "Review the details" + "auto-filled" purple label (sparkles icon)
- **Low-confidence banner** (amber): "Double-check {N} fields" with sparkles icon. Shown when AI confidence is low for any field.
- Low-confidence fields: amber focus ring (`--cat-academic` tint), amber "double-check" pill badge next to label
- Fields: Title · Date + Category (2-col) · Start + End time (2-col) · Venue · Pricing toggle (Free/Paid) + Price input · Description textarea
- Footer: "Posts as Community" label + "Publish event" primary button (disabled until title + date filled)

**Success state:**
- Animated green check circle (ring pulse animation)
- "You're on the calendar! 🎉" heading
- Event title + date summary pill
- "View on calendar" primary CTA + "Submit another" secondary

#### Paste link tab
- URL input + "Fetch details" accent button (disabled when empty)
- Same extraction + review flow

#### Manual tab
- Jumps directly to review form (no poster, no extraction)

---

### 5. Community Feed
**File:** `feed.jsx` → `FeedScreen`, `FeedCard`

**Layout:** Single column, max-width 680px, centred.

**Compose bar:** Surface card. User avatar (36px) + placeholder text + "+ Post" teal link.

**Sort bar:** Flame icon + trending count (amber) on left. Trending/Recent SegmentedControl on right.

**Feed cards:**
- Surface bg, `--border` or `--c-line` for trending
- Trending cards: 3px left border in `var(--c)`, "Hot" badge (orange flame)
- Header: 38px avatar + name + timestamp + category badge + trending badge
- Title (Space Grotesk 700, 16.5px) + body copy
- Action row: Star button (pill, amber when starred, count) · "Count me in · {N}" button (pill, green when joined) · Community source tag right-aligned
- Sort: `(b.trending ? 1 : 0) - (a.trending ? 1 : 0) || starCount desc`

---

### 6. Design System screen
**File:** `login.jsx` → `StyleguideScreen`

For reference only — documents colours, typography, buttons, chips, badges, avatars, controls.

---

## Core Components

### Button
Variants: `primary` (dark fill) · `secondary` (surface, border) · `soft` (surface-2) · `ghost` (transparent) · `accent` (uses `--c` for bg, white text) · `danger` (red)
Sizes: `sm` (7/12px pad, 13px type) · `md` default (10/16px, 14.5px) · `lg` (13/22px, 16px)
Icon: lucide icon left or right. Scale(0.97) on mousedown.

### Chip (filter toggle)
Pill shape. Inactive: surface bg, `--border`, `--text-2`. Active: `--c-soft` bg, `--c-line` border + inset shadow, `--c-ink` text. 8px coloured dot.

### CategoryBadge
Pill. `--c-soft` bg, `--c-ink` text, `--c-line` border. 7px dot + label. Sizes: sm / md.

### Badge
Tones: neutral · free (green-tint) · paid (neutral-strong) · trending (orange-tint). Small pill, 700 weight.

### Avatar
Deterministic gradient from name hash (hsl `${h} 70% 58%` → `hsl(${h+40} 68% 48%)`). Initials 2 chars. Ring: 2px solid surface.

### AvatarStack
Negative margin stack (`-size*0.32`). Z-index decreasing left→right. "+N" overflow chip.

### SegmentedControl
Surface-2 bg container (4px pad). Active segment: surface bg + shadow-sm. Transition all 150ms.

### Toggle
40×23px pill. Off: surface-3. On: `--cat-sports` green. 17px white thumb, 2px padding. Smooth transform.

### Tabs (submit flow)
Full-width, same SegmentedControl pattern but `flex: 1` each tab.

---

## Interactions & Animations

| Interaction | Animation |
|-------------|-----------|
| Modal open | `scale(0.96) translateY(8px) opacity(0)` → natural, 220ms ease-out |
| Modal close | Reverse fade 160ms |
| Backdrop | `opacity(0)` → scrim + blur(6px), 160ms |
| Toast | `translateY(10px) opacity(0)` → natural, 250ms, auto-dismiss 2.2s |
| Screen enter | `translateY(10px) opacity(0)` → natural, 350ms (submit review form) |
| AI scan line | Sweep top→bottom, 1.7s loop, linear |
| AI step dots | Pulse opacity 0.8→0, 0.6s alternate infinite |
| Success ring | `scale(0.6) opacity(0.8)` → `scale(2.2) opacity(0)`, 1.8s loop |
| Success check | SVG stroke-dashoffset 24→0, 0.5s ease, 150ms delay |
| Calendar chip hover | `translateX(1px)` + `brightness(0.97)` |

---

## State Management

```typescript
// Per-event interaction state (persist to localStorage)
interface InteractionState {
  rsvp: Record<string, "going" | "interested" | "none" | null>;
  stars: Record<string, boolean>;
}

// Derived counts
goingCount(ev)      = ev.going + (rsvp[ev.id] === "going" ? 1 : 0)
interestedCount(ev) = ev.interested + (rsvp[ev.id] === "interested" ? 1 : 0)
starCount(ev)       = ev.stars + (stars[ev.id] ? 1 : 0)
```

**Calendar UI state:**
- `view`: "month" | "week" | "day"
- `anchor`: Date (drives which month/week/day is shown)
- `filters`: `{ cats: Set<string>, sources: Set<string>, price: "all"|"free"|"paid", q: string }`
- `selectedEvent`: Event | null (drives modal open/closed)

**Submit flow state:**
- `tab`: "link" | "upload" | "manual"
- `phase`: "idle" | "extracting" | "review" | "done"
- `form`: FormValues (title, date, start, end, venue, cat, free, price, desc)
- `conf`: Record<string, boolean> (low-confidence fields)

---

## AI Extraction (the signature feature)

When a user uploads a poster or pastes a link, call Claude claude-opus-4 vision with:

```
You are an event data extractor. Given this event poster image, extract:
- title (string)
- date (YYYY-MM-DD)
- start_time (HH:MM 24h)
- end_time (HH:MM 24h, if present)
- venue (string)
- category: one of tech|cultural|sports|academic|social|personal|merch
- is_free (boolean)
- price (string, e.g. "₹120", only if not free)
- description (1–3 sentences)

For each field, also return a confidence: "high" | "low".
Return as JSON. If a field is not visible, set it to null with confidence "low".
```

Show extraction animation (4 labelled steps, ~800ms each) while the API call is in flight. On response:
- Populate form fields
- Mark `confidence: "low"` fields in the `conf` object → amber highlight + "double-check" badge
- Show the low-confidence banner if any fields are low-confidence

---

## Data Shape

```typescript
interface Event {
  id: string;
  title: string;
  cat: "tech"|"cultural"|"sports"|"academic"|"social"|"personal"|"merch";
  source: "official"|"club"|"community";
  free: boolean;
  price?: string;           // e.g. "₹699+"
  date: string;             // "YYYY-MM-DD"
  start: string;            // "HH:MM"
  end: string;              // "HH:MM"
  venue: string;
  host: string;
  desc: string;
  going: number;
  interested: number;
  stars: number;
  trending?: boolean;
  seed: number;             // for deterministic avatar generation
}

interface FeedPost {
  id: string;
  title: string;
  cat: string;
  by: string;               // "Name (Hostel)"
  when: string;             // relative, e.g. "2h ago"
  going: number;
  stars: number;
  trending?: boolean;
  body: string;
}
```

---

## Responsive Breakpoint

| Width | Layout |
|-------|--------|
| ≥ 860px | Top bar + left rail (236px) + calendar; no bottom nav |
| < 860px | Top bar (compact) + bottom nav; filter rail → bottom sheet |

Mobile-specific changes:
- Logo: mark only (no wordmark) in top bar
- Search: shorter placeholder
- Filter button in calendar header → opens bottom sheet
- Bottom nav: 4 items (Calendar, Community, Submit, System)
- Bottom nav uses `env(safe-area-inset-bottom)` padding

---

## Files in this Package

| File | Contents |
|------|----------|
| `CampusPulse.html` | Entry point — loads all scripts in order |
| `styles.css` | All design tokens (CSS custom properties), keyframe animations, base reset |
| `data.jsx` | IITG event dataset, category/source constants, avatar helpers |
| `util.jsx` | Date helpers, time formatting, `useInteractions` hook |
| `components.jsx` | Logo, Icon, Button, Chip, CategoryBadge, Badge, Avatar(Stack), SegmentedControl, Toggle, Tabs, PosterPlaceholder |
| `calendar.jsx` | FilterRail, MonthView, TimeGrid (week+day), DayColumn, event chip |
| `modal.jsx` | EventModal, RsvpControl, InfoRow, toast |
| `submit.jsx` | SubmitScreen, InputPane, ExtractionOverlay, StepList |
| `submit-form.jsx` | ReviewForm, Field, SuccessCard |
| `feed.jsx` | FeedScreen, FeedCard |
| `login.jsx` | LoginScreen, StyleguideScreen |
| `app.jsx` | App shell, TopBar, BottomNav, CalendarScreen composition, FilterSheet, Tweaks |

---

## How to Use This with a Vibe-Coding Tool

**Cursor / Windsurf / Claude Code:**
1. Download this handoff zip
2. Put the HTML prototype files somewhere in your project (e.g. `design/`)
3. Paste this README as context at the start of your session:
   > "I have an interactive prototype in `design/`. Use it as a pixel-accurate reference to build this in React + Tailwind + shadcn/ui. Start with the design tokens in `design/styles.css`."
4. Work screen by screen — the README gives you exact component specs

**Lovable / Bolt / v0:**
- Paste this README as your initial prompt
- Reference specific sections per screen
- Ask it to implement one screen at a time, starting with design tokens

**Key prompt to include:**
> "The category color system is the heart of the design — 7 categories each with a hex accent, derived soft/ink/line tones via color-mix(). Every chip, badge, event block, and filter uses these derived tones. Implement this token system first before any components."
