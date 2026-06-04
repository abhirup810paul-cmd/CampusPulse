export const TODAY = new Date(2026, 8, 16); // 16 Sep 2026

export const CATEGORIES = [
  { key: "tech",     label: "Tech",     v: "--cat-tech" },
  { key: "cultural", label: "Cultural", v: "--cat-cultural" },
  { key: "sports",   label: "Sports",   v: "--cat-sports" },
  { key: "academic", label: "Academic", v: "--cat-academic" },
  { key: "social",   label: "Social",   v: "--cat-social" },
  { key: "personal", label: "Personal", v: "--cat-personal" },
  { key: "merch",    label: "Merch",    v: "--cat-merch" },
];

export const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));

export const SOURCES = [
  { key: "official",  label: "Official" },
  { key: "club",      label: "Club" },
  { key: "community", label: "Community" },
];

export function avatar(name: string) {
  const parts = name.trim().split(/\s+/);
  const initials = (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return { name, initials, hue: h };
}

export const PEOPLE = [
  "Aarav Mehta","Ananya Das","Rohit Kalita","Sneha Iyer","Dev Sharma","Priya Nair",
  "Karan Bose","Ishita Roy","Tenzin Dorjee","Megha Saikia","Arjun Patel","Riya Sen",
  "Nikhil Rao","Tara Gupta","Sahil Ahmed","Naina Borah","Vikram Singh","Pooja Reddy",
  "Manish Yadav","Kritika Jain","Farhan Ali","Diya Kapoor","Aditya Nath","Lhamo Tashi",
].map(avatar);

export function avatars(n: number, seed = 0) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(PEOPLE[(seed + i * 5 + 1) % PEOPLE.length]);
  return out;
}

const d = (day: number) => `2026-09-${String(day).padStart(2, "0")}`;

export const EVENTS = [
  {
    id: "techniche-bootcamp", title: "Techniche '26 — Robotics Bootcamp", cat: "tech",
    source: "official", free: true, date: d(16), start: "16:00", end: "18:30",
    venue: "Mechanical Workshop, Core 4", host: "Techniche",
    desc: "Hands-on build session for the line-following + maze-solver bots ahead of Techniche. Components provided; bring your laptop with Arduino IDE installed.",
    going: 142, interested: 318, stars: 264, trending: true, seed: 1,
  },
  {
    id: "alcher-auditions", title: "Voice of Alcheringa — Open Auditions", cat: "cultural",
    source: "club", free: true, date: d(16), start: "19:00", end: "22:00",
    venue: "Dr. Bhupen Hazarika Auditorium", host: "Music Club",
    desc: "Solo singing auditions for Alcheringa's flagship vocal competition. One original or cover, max 3 minutes. Karaoke tracks supported.",
    going: 64, interested: 121, stars: 98, trending: true, seed: 6,
  },
  {
    id: "ddp-talk", title: "AI for Bharat — Guest Lecture", cat: "academic",
    source: "official", free: true, date: d(16), start: "11:30", end: "13:00",
    venue: "LHC, Hall 3", host: "Dept. of CSE",
    desc: "Distinguished alumni talk on building low-resource language models for India, followed by an open Q&A and lunch networking.",
    going: 88, interested: 96, stars: 41, seed: 3,
  },
  {
    id: "river-run", title: "5 AM Brahmaputra Riverbank Run", cat: "personal",
    source: "community", free: true, date: d(17), start: "05:00", end: "06:15",
    venue: "Lohit Hostel Gate → Riverfront", host: "Akash (Lohit)",
    desc: "Easy 6 km group run along the river before class. All paces welcome — we regroup at the ghat. Bring water.",
    going: 23, interested: 47, stars: 31, seed: 9,
  },
  {
    id: "footy-league", title: "Inter-Hostel Football: Manas vs Kameng", cat: "sports",
    source: "official", free: true, date: d(17), start: "16:30", end: "18:00",
    venue: "Sports Complex — Football Ground", host: "Spardha",
    desc: "Group stage of the inter-hostel league. Manas top the table; Kameng need a win to qualify. Come cheer your hostel.",
    going: 210, interested: 156, stars: 73, trending: true, seed: 2,
  },
  {
    id: "merch-drop", title: "Techniche Merch Drop — Hoodies & Tees", cat: "merch",
    source: "official", free: false, price: "₹699+", date: d(17), start: "10:00", end: "17:00",
    venue: "Students' Activity Centre", host: "Techniche",
    desc: "First batch of this year's fest merch. Limited hoodie sizes — early-bird pricing for the first 100 orders.",
    going: 0, interested: 204, stars: 188, seed: 5,
  },
  {
    id: "open-mic", title: "Open Mic Night — Poetry & Acoustic", cat: "social",
    source: "club", free: true, date: d(18), start: "20:00", end: "23:00",
    venue: "Open Air Theatre", host: "Literati + Music Club",
    desc: "Sign up at the door for a 5-minute slot. Poetry, stand-up, acoustic sets — anything goes. Chai and maggi stall on site.",
    going: 97, interested: 188, stars: 142, trending: true, seed: 8,
  },
  {
    id: "hackcsea", title: "HackCSEA — 24h Hackathon Kickoff", cat: "tech",
    source: "club", free: true, date: d(18), start: "18:00", end: "21:00",
    venue: "Conference Centre", host: "Coding Club",
    desc: "Theme reveal + team formation for the overnight build. Mentors from campus startups on call. Dinner and unlimited coffee included.",
    going: 156, interested: 142, stars: 119, seed: 4,
  },
  {
    id: "ml-workshop", title: "Hands-on: Fine-tuning LLMs", cat: "academic",
    source: "club", free: false, price: "₹150", date: d(19), start: "15:00", end: "18:00",
    venue: "Central Computer Centre", host: "AI Club",
    desc: "Bring a dataset; leave with a fine-tuned model. Limited to 40 seats — registration includes GPU credits for the session.",
    going: 38, interested: 71, stars: 54, seed: 7,
  },
  {
    id: "swim-meet", title: "Aquatics Time Trials", cat: "sports",
    source: "official", free: true, date: d(19), start: "07:00", end: "09:00",
    venue: "Swimming Pool, Sports Complex", host: "Spardha",
    desc: "Selection trials for the Inter-IIT aquatics squad. Freestyle and breaststroke heats. Spectators welcome from the gallery.",
    going: 41, interested: 33, stars: 18, seed: 11,
  },
  {
    id: "movie-lawn", title: "Open-Air Movie Night on Manas Lawn", cat: "social",
    source: "community", free: true, date: d(19), start: "20:30", end: "23:00",
    venue: "Manas Hostel Lawn", host: "Film Club",
    desc: "Projector + big screen under the stars. This week: a cult sci-fi double feature. Bring a mat; popcorn on us.",
    going: 132, interested: 167, stars: 95, seed: 10,
  },
  {
    id: "ticket-resale", title: "Selling 2× Alcheringa Pro-Night Passes", cat: "merch",
    source: "community", free: false, price: "₹1,200 ea", date: d(20), start: "00:00", end: "23:59",
    venue: "Pickup near Kameng Hostel", host: "Rishav (Kameng)",
    desc: "Got two extra Day-2 pro-night passes. Face value, no markup. DM to coordinate pickup before the fest.",
    going: 0, interested: 28, stars: 12, seed: 13,
  },
  {
    id: "udgam-pitch", title: "Udgam E-Summit: Startup Pitch Night", cat: "academic",
    source: "official", free: true, date: d(20), start: "17:00", end: "20:00",
    venue: "Dr. Bhupen Hazarika Auditorium", host: "Udgam",
    desc: "Ten student ventures pitch to a panel of VCs and alumni founders. Audience votes for the People's Choice award.",
    going: 119, interested: 203, stars: 161, trending: true, seed: 12,
  },
  {
    id: "photowalk", title: "Sunrise Photowalk — Campus Hills", cat: "personal",
    source: "community", free: true, date: d(20), start: "05:30", end: "08:00",
    venue: "Meet at Library Steps", host: "Photography Club",
    desc: "Chase the morning light up the campus hill trail. All cameras (and phones) welcome. We'll do a quick edit session after.",
    going: 29, interested: 58, stars: 37, seed: 14,
  },
  {
    id: "rock-o-phonix", title: "Rock-o-Phonix — Band Eliminations", cat: "cultural",
    source: "club", free: true, date: d(21), start: "18:30", end: "22:30",
    venue: "Open Air Theatre", host: "Music Club",
    desc: "Prelims for one of India's biggest college band competitions. Eight bands, 20 minutes each. Mosh responsibly.",
    going: 173, interested: 241, stars: 209, trending: true, seed: 15,
  },
  {
    id: "chess-blitz", title: "Campus Blitz Chess Open", cat: "sports",
    source: "club", free: false, price: "₹50", date: d(21), start: "15:00", end: "19:00",
    venue: "Students' Activity Centre", host: "Chess Club",
    desc: "7-round Swiss, 5+0 blitz. Cash prizes for the top three. Rated and unrated sections. Boards and clocks provided.",
    going: 52, interested: 44, stars: 22, seed: 16,
  },
];

export const FEED = [
  {
    id: "f-run", title: "5 AM run at the lake — who's in?", cat: "personal",
    by: "Akash (Lohit)", when: "2h ago", going: 23, stars: 31, trending: true,
    body: "Doing an easy 6k along the Brahmaputra before class tomorrow. Chill pace, we stop at the ghat for chai. Drop a 🏃 if joining.",
  },
  {
    id: "f-tickets", title: "Selling 2× Alcher pro-night passes (face value)", cat: "merch",
    by: "Rishav (Kameng)", when: "40m ago", going: 0, stars: 12, trending: true,
    body: "Plans changed — letting go of two Day-2 passes at face value, no markup. Pickup near Kameng. First to confirm gets them.",
  },
  {
    id: "f-guitar", title: "Acoustic jam on Manas lawn tonight 🎸", cat: "social",
    by: "Sneha (Gabharu)", when: "1h ago", going: 18, stars: 26,
    body: "Bringing the guitar out around 9. Anyone who sings or plays, pull up. Requests open. It's a vibe, not a performance.",
  },
  {
    id: "f-cycle", title: "Selling barely-used hybrid cycle", cat: "merch",
    by: "Dev (Siang)", when: "5h ago", going: 0, stars: 9,
    body: "Graduating, so my Btwin hybrid needs a new home. 6 months old, new tube last week. ₹6,500, slightly negotiable.",
  },
];
