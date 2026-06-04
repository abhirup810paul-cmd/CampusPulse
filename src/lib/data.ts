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

import { supabase } from './supabase';

export async function fetchEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })
    .order('start', { ascending: true });
    
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  return data;
}

export async function fetchPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return data;
}
