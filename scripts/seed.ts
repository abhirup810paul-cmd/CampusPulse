import { createClient } from '@supabase/supabase-js';
import { EVENTS, FEED } from '../src/lib/data';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding Events...');
  for (const event of EVENTS) {
    const { error } = await supabase.from('events').upsert({
      id: event.id,
      title: event.title,
      date: event.date,
      start: event.start,
      "end": event.end,
      venue: event.venue,
      description: event.desc,
      cat: event.cat,
      source: event.source,
      price: event.price || null,
      going: event.going,
      interested: event.interested,
      stars: event.stars
    });
    
    if (error) {
      console.error(`Error inserting event ${event.id}:`, error);
    }
  }

  console.log('Seeding Posts...');
  for (const post of FEED) {
    // Parse author name from 'Akash (Lohit)' format
    const nameMatch = post.by.match(/(.*)\s\((.*)\)/);
    const authorName = nameMatch ? nameMatch[1] : post.by;
    
    // Generate initials and hue just like avatar() does
    const parts = authorName.trim().split(/\s+/);
    const initials = (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
    let h = 0;
    for (let i = 0; i < authorName.length; i++) h = (h * 31 + authorName.charCodeAt(i)) % 360;

    const { error } = await supabase.from('posts').upsert({
      id: post.id,
      author_name: post.by,
      author_initials: initials,
      author_hue: h,
      time: post.when,
      body: post.body,
      trending: post.trending || false,
      upvotes: post.stars || 0
    });

    if (error) {
      console.error(`Error inserting post ${post.id}:`, error);
    }
  }

  console.log('Seeding complete!');
}

seed();
