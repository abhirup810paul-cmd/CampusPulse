/* ============================================================
   CampusPulse — date utils + interaction store
   ============================================================ */

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DOW_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function parseDate(str) { const [y, m, dd] = str.split("-").map(Number); return new Date(y, m - 1, dd); }
function ymd(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d; }
function startOfWeek(date) { const d = new Date(date); d.setDate(d.getDate() - d.getDay()); d.setHours(0,0,0,0); return d; }

// 12h time
function fmtTime(t) {
  if (!t) return "";
  let [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12; if (h === 0) h = 12;
  return m === 0 ? `${h} ${ap}` : `${h}:${String(m).padStart(2, "0")} ${ap}`;
}
function fmtRange(s, e) { return e ? `${fmtTime(s)} – ${fmtTime(e)}` : fmtTime(s); }
function timeToMin(t) { const [h, m] = t.split(":").map(Number); return h * 60 + m; }

// 6-week month grid (array of Date)
function monthMatrix(anchor) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const start = startOfWeek(first);
  const cells = [];
  for (let i = 0; i < 42; i++) cells.push(addDays(start, i));
  return cells;
}

// human relative day
function relativeDay(date) {
  const diff = Math.round((date - new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate())) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 1 && diff < 7) return DOW_FULL[date.getDay()];
  return `${DOW[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()].slice(0,3)}`;
}
function longDate(date) { return `${DOW_FULL[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`; }

/* ---- interaction store: RSVP + stars persisted to localStorage ---- */
function useInteractions() {
  const KEY = "campuspulse.v1";
  const [state, setState] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || { rsvp: {}, stars: {} }; }
    catch { return { rsvp: {}, stars: {} }; }
  });
  React.useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const setRsvp = (id, val) => setState((s) => ({ ...s, rsvp: { ...s.rsvp, [id]: s.rsvp[id] === val ? null : val } }));
  const toggleStar = (id) => setState((s) => ({ ...s, stars: { ...s.stars, [id]: !s.stars[id] } }));

  // derived counts: base + user's contribution
  const goingCount = (ev) => ev.going + (state.rsvp[ev.id] === "going" ? 1 : 0);
  const interestedCount = (ev) => ev.interested + (state.rsvp[ev.id] === "interested" ? 1 : 0);
  const starCount = (ev) => ev.stars + (state.stars[ev.id] ? 1 : 0);

  return { state, setRsvp, toggleStar, goingCount, interestedCount, starCount };
}

Object.assign(window, {
  DOW, DOW_FULL, MONTHS, parseDate, ymd, sameDay, addDays, startOfWeek,
  fmtTime, fmtRange, timeToMin, monthMatrix, relativeDay, longDate, useInteractions,
});
