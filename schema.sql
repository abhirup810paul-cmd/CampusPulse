-- Supabase Schema for CampusPulse
-- Run this in the Supabase SQL Editor

-- 1. Create the events table
CREATE TABLE public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    start TEXT NOT NULL, -- Format: HH:MM
    "end" TEXT,          -- Format: HH:MM
    venue TEXT NOT NULL,
    desc TEXT,
    cat TEXT NOT NULL,   -- e.g. 'tech', 'cultural', 'academic'
    source TEXT NOT NULL, -- e.g. 'official', 'club', 'student'
    price TEXT,
    going INTEGER DEFAULT 0,
    interested INTEGER DEFAULT 0,
    stars INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the posts table (Community Feed)
CREATE TABLE public.posts (
    id TEXT PRIMARY KEY,
    author_name TEXT NOT NULL,
    author_initials TEXT NOT NULL,
    author_hue INTEGER NOT NULL,
    time TEXT NOT NULL, -- Stored as relative time string (or timestamp)
    body TEXT NOT NULL,
    event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
    trending BOOLEAN DEFAULT FALSE,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create the user_interactions table (RSVPs and Stars)
-- This assumes users are authenticated via Supabase Auth
CREATE TABLE public.user_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL, -- 'going', 'interested', 'star'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, event_id, interaction_type)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Anyone can read events
CREATE POLICY "Allow public read-access on events" ON public.events FOR SELECT USING (true);
-- Authenticated users can insert events
CREATE POLICY "Allow auth insert on events" ON public.events FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Anyone can read posts
CREATE POLICY "Allow public read-access on posts" ON public.posts FOR SELECT USING (true);
-- Authenticated users can insert posts
CREATE POLICY "Allow auth insert on posts" ON public.posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can only read, insert, and delete their own interactions
CREATE POLICY "Allow users to read their interactions" ON public.user_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their interactions" ON public.user_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their interactions" ON public.user_interactions FOR DELETE USING (auth.uid() = user_id);

-- 6. Realtime setup
-- Enable realtime for all tables
alter publication supabase_realtime add table public.events;
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.user_interactions;
