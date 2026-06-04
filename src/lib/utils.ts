import { useState, useEffect } from 'react';
import { TODAY } from './data';

export const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DOW_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export function parseDate(str: string) { const [y, m, dd] = str.split("-").map(Number); return new Date(y, m - 1, dd); }
export function ymd(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
export function sameDay(a: Date, b: Date) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
export function addDays(date: Date, n: number) { const d = new Date(date); d.setDate(d.getDate() + n); return d; }
export function startOfWeek(date: Date) { const d = new Date(date); d.setDate(d.getDate() - d.getDay()); d.setHours(0,0,0,0); return d; }

// 12h time
export function fmtTime(t?: string) {
  if (!t) return "";
  let [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12; if (h === 0) h = 12;
  return m === 0 ? `${h} ${ap}` : `${h}:${String(m).padStart(2, "0")} ${ap}`;
}
export function fmtRange(s?: string, e?: string) { return e ? `${fmtTime(s)} – ${fmtTime(e)}` : fmtTime(s); }
export function timeToMin(t: string) { const [h, m] = t.split(":").map(Number); return h * 60 + m; }

// 6-week month grid (array of Date)
export function monthMatrix(anchor: Date) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const start = startOfWeek(first);
  const cells = [];
  for (let i = 0; i < 42; i++) cells.push(addDays(start, i));
  return cells;
}

// human relative day
export function relativeDay(date: Date) {
  const diff = Math.round((date.getTime() - new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()).getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 1 && diff < 7) return DOW_FULL[date.getDay()];
  return `${DOW[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()].slice(0,3)}`;
}
export function longDate(date: Date) { return `${DOW_FULL[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`; }

export function useInteractions() {
  const KEY = "campuspulse.v1";
  const [state, setState] = useState(() => {
    try { 
      if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem(KEY) || 'null') || { rsvp: {}, stars: {} }; 
      }
    }
    catch { return { rsvp: {}, stars: {} }; }
    return { rsvp: {}, stars: {} };
  });
  
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  useEffect(() => {
    const fetchInteractions = async () => {
      const { supabase } = await import('./supabase');
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.from('user_interactions').select('*').eq('user_id', session.user.id);
        if (data && data.length > 0) {
          setState((prev: any) => {
            const rsvp = { ...prev.rsvp };
            const stars = { ...prev.stars };
            data.forEach((row: any) => {
              if (row.type === 'rsvp') rsvp[row.item_id] = row.value;
              if (row.type === 'star') stars[row.item_id] = row.value === 'true';
            });
            return { rsvp, stars };
          });
        }
      }
    };
    fetchInteractions();
  }, []);

  const syncInteraction = async (itemId: string, type: string, value: string | null) => {
    const { supabase } = await import('./supabase');
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      if (value === null) {
        // delete
        await supabase.from('user_interactions').delete()
          .match({ user_id: session.user.id, item_id: itemId, type });
      } else {
        // upsert
        await supabase.from('user_interactions').upsert({
          user_id: session.user.id,
          item_id: itemId,
          type,
          value
        }, { onConflict: 'user_id,item_id,type' });
      }
    }
  };

  const setRsvp = (id: string, val: string) => {
    setState((s: any) => {
      const newVal = s.rsvp[id] === val ? null : val;
      syncInteraction(id, 'rsvp', newVal);
      return { ...s, rsvp: { ...s.rsvp, [id]: newVal } };
    });
  };
  
  const toggleStar = (id: string) => {
    setState((s: any) => {
      const newVal = !s.stars[id];
      syncInteraction(id, 'star', newVal ? 'true' : null);
      return { ...s, stars: { ...s.stars, [id]: newVal } };
    });
  };

  const goingCount = (ev: any) => ev.going + (state.rsvp[ev.id] === "going" ? 1 : 0);
  const interestedCount = (ev: any) => ev.interested + (state.rsvp[ev.id] === "interested" ? 1 : 0);
  const starCount = (ev: any) => (ev.stars || 0) + (state.stars[ev.id] ? 1 : 0);

  return { state, setRsvp, toggleStar, goingCount, interestedCount, starCount };
}

export function generateICS(ev: any) {
  const dateStr = ev.date.replace(/-/g, '');
  const startStr = ev.start.replace(':', '') + '00';
  const endStr = (ev.end || ev.start).replace(':', '') + '00';
  
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${ev.title}
DTSTART:${dateStr}T${startStr}
DTEND:${dateStr}T${endStr}
LOCATION:${ev.venue}
DESCRIPTION:${ev.desc}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${ev.title.replace(/\s+/g, '_')}.ics`;
  a.click();
}

export function getGoogleCalendarUrl(ev: any) {
  const dateStr = ev.date.replace(/-/g, '');
  const startStr = ev.start.replace(':', '') + '00';
  const endStr = (ev.end || ev.start).replace(':', '') + '00';
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${dateStr}T${startStr}/${dateStr}T${endStr}&details=${encodeURIComponent(ev.desc)}&location=${encodeURIComponent(ev.venue)}`;
}
