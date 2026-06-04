import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SEED_EVENTS = [
  { id: "hackathon-2026", title: "36-Hour Hackathon", date: "2026-09-17", start: "09:00", end: "21:00", venue: "Core-3 Lab Block", description: "Build anything in 36 hours. Open to all branches. Teams of 2–4. Prizes worth ₹50K.", cat: "tech", source: "official", free: true, price: null, going: 42, interested: 18, stars: 7, host: "Coding Club", poster_url: null },
  { id: "crescendo-music", title: "Crescendo — Inter-Hostel Music Night", date: "2026-09-27", start: "19:00", end: "22:30", venue: "Dr. Bhupen Hazarika Auditorium", description: "A night of live sets as hostels battle it out across genres — acoustic, rock, indie and fusion.", cat: "cultural", source: "official", free: false, price: "₹120", going: 73, interested: 24, stars: 15, host: "Music Club", poster_url: null },
  { id: "5k-run-brahmaputra", title: "5K Fun Run: Brahmaputra Trail", date: "2026-09-20", start: "06:00", end: "08:00", venue: "Academic Gate → River Amphitheatre", description: "5K run along the Brahmaputra trail. Registration open till Sep 18. Finisher medals for all.", cat: "sports", source: "club", free: true, price: null, going: 55, interested: 12, stars: 9, host: "Sports Board", poster_url: null },
  { id: "resume-clinic", title: "Resume Review & Mock Interviews", date: "2026-09-19", start: "14:00", end: "17:00", venue: "Conference Hall, Admin Block", description: "Get your resume reviewed by industry mentors and practice mock interviews. Slots limited.", cat: "academic", source: "official", free: true, price: null, going: 30, interested: 22, stars: 4, host: "Placement Cell", poster_url: null },
  { id: "board-game-night", title: "Board Game Night", date: "2026-09-18", start: "20:00", end: "23:00", venue: "Barak Hostel Common Room", description: "Settlers of Catan, Codenames, chess tournaments. Snacks provided. Open to all hostels.", cat: "social", source: "community", free: true, price: null, going: 28, interested: 8, stars: 6, host: "Barak Hostel", poster_url: null },
  { id: "ai-workshop-sep", title: "Hands-on AI Workshop: Build a RAG App", date: "2026-09-22", start: "10:00", end: "13:00", venue: "Core-1 Seminar Hall", description: "Learn to build a Retrieval-Augmented Generation app from scratch using LangChain and Supabase vectors.", cat: "tech", source: "club", free: true, price: null, going: 38, interested: 15, stars: 11, host: "AI Club", poster_url: null },
  { id: "theatre-auditions", title: "Street Play Auditions — Alcheringa Prep", date: "2026-09-21", start: "17:00", end: "19:30", venue: "Open Air Theatre", description: "Auditions for the inter-college street play competition. No prior experience needed.", cat: "cultural", source: "club", free: true, price: null, going: 15, interested: 10, stars: 3, host: "Dramatics Club", poster_url: null },
  { id: "campus-photo-walk", title: "Golden Hour Photo Walk", date: "2026-09-23", start: "16:30", end: "18:30", venue: "Meet at Lakeside Canteen", description: "Capture the campus during golden hour. Bring your phone or camera. Best shots get featured on the magazine.", cat: "social", source: "community", free: true, price: null, going: 20, interested: 14, stars: 8, host: "Photography Club", poster_url: null },
];

const SEED_POSTS = [
  { id: "post-1", author_name: "Aarav Mehta", author_initials: "AM", author_hue: 210, time: "2h ago", body: "Who's heading for the hackathon this weekend? Looking for a teammate who knows React + Supabase!", event_id: "hackathon-2026", trending: true, upvotes: 14 },
  { id: "post-2", author_name: "Sneha Iyer", author_initials: "SI", author_hue: 45, time: "4h ago", body: "The 5K run registration closes tomorrow! Don't forget to sign up at the Sports Board desk.", event_id: "5k-run-brahmaputra", trending: false, upvotes: 8 },
  { id: "post-3", author_name: "Rohit Kalita", author_initials: "RK", author_hue: 120, time: "6h ago", body: "Anyone know if the Crescendo tickets are available online or only at the counter?", event_id: "crescendo-music", trending: true, upvotes: 22 },
  { id: "post-4", author_name: "Priya Nair", author_initials: "PN", author_hue: 290, time: "1d ago", body: "The resume review session was so helpful last semester. Highly recommend for pre-final years!", event_id: "resume-clinic", trending: false, upvotes: 5 },
  { id: "post-5", author_name: "Tenzin Dorjee", author_initials: "TD", author_hue: 170, time: "1d ago", body: "Board game night was fire 🔥 Codenames got really intense by round 3. Let's do this every week!", event_id: "board-game-night", trending: true, upvotes: 19 },
];

async function seed() {
  console.log("🌱 Seeding events...");
  const { error: evErr } = await supabase.from('events').upsert(SEED_EVENTS, { onConflict: 'id' });
  if (evErr) { console.error("❌ Events:", evErr.message); } else { console.log(`✅ ${SEED_EVENTS.length} events seeded.`); }

  console.log("🌱 Seeding posts...");
  const { error: postErr } = await supabase.from('posts').upsert(SEED_POSTS, { onConflict: 'id' });
  if (postErr) { console.error("❌ Posts:", postErr.message); } else { console.log(`✅ ${SEED_POSTS.length} posts seeded.`); }

  console.log("✅ Done!");
}

seed();
