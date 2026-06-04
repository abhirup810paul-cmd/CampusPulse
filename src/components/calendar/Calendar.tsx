"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { EVENTS, CATEGORIES, SOURCES, TODAY } from '@/lib/data';
import { 
  ymd, sameDay, addDays, startOfWeek, timeToMin, monthMatrix, 
  fmtTime, fmtRange, DOW, MONTHS, useInteractions 
} from '@/lib/utils';
import { Icon, Button, SegmentedControl, Chip, CategoryBadge, Badge, SourceTag, AvatarStack, PosterPlaceholder } from '@/components/ui/core';
import { EventModal } from './EventModal';

function eventMatches(ev: any, f: any) {
  if (f.cats.size && !f.cats.has(ev.cat)) return false;
  if (f.sources.size && !f.sources.has(ev.source)) return false;
  if (f.price === "free" && !ev.free) return false;
  if (f.price === "paid" && ev.free) return false;
  if (f.q) {
    const q = f.q.toLowerCase();
    const hay = (ev.title + " " + ev.venue + " " + ev.host + " " + ev.desc).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

export function CalendarScreen({ isMobile }: { isMobile: boolean }) {
  const store = useInteractions();
  const [f, setF] = useState({ cats: new Set(), sources: new Set(), price: "all", q: "" });
  const [view, setView] = useState("month");
  const [anchor, setAnchor] = useState(new Date(TODAY));
  const [selected, setSelected] = useState<any>(null);
  const [sheet, setSheet] = useState(false);

  const filtered = useMemo(() => EVENTS.filter((e) => eventMatches(e, f)), [f]);
  const monthLabel = `${MONTHS[anchor.getMonth()]} ${anchor.getFullYear()}`;
  const weekDays = useMemo(() => { const s = startOfWeek(anchor); return Array.from({ length: 7 }, (_, i) => addDays(s, i)); }, [anchor]);

  const nav = (dir: number) => {
    if (view === "month") setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() + dir, 1));
    else if (view === "week") setAnchor(addDays(anchor, dir * 7));
    else setAnchor(addDays(anchor, dir));
  };
  const sameMonth = weekDays[0].getMonth() === weekDays[6].getMonth();
  const label = view === "month" ? monthLabel
    : view === "week"
      ? (sameMonth
          ? `${weekDays[0].getDate()} – ${weekDays[6].getDate()} ${MONTHS[weekDays[6].getMonth()].slice(0,3)} ${weekDays[6].getFullYear()}`
          : `${weekDays[0].getDate()} ${MONTHS[weekDays[0].getMonth()].slice(0,3)} – ${weekDays[6].getDate()} ${MONTHS[weekDays[6].getMonth()].slice(0,3)}`)
    : `${DOW[anchor.getDay()]}, ${anchor.getDate()} ${MONTHS[anchor.getMonth()]} ${anchor.getFullYear()}`;

  const activeFilters = f.cats.size + f.sources.size + (f.price !== "all" ? 1 : 0);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "236px 1fr", gap: 24, alignItems: "start" }}>
        {!isMobile && <FilterRail f={f} setF={setF} count={filtered.length}
          onClear={() => setF({ cats: new Set(), sources: new Set(), price: "all", q: f.q })} />}

        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ margin: 0, fontSize: isMobile ? 21 : 26, fontWeight: 700, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {label}
              </h1>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => nav(-1)} className="navArrow" aria-label="Previous"><Icon name="chevronL" size={17} /></button>
                <button onClick={() => nav(1)} className="navArrow" aria-label="Next"><Icon name="chevronR" size={17} /></button>
              </div>
              <Button variant="soft" size="sm" onClick={() => setAnchor(new Date(TODAY))}>Today</Button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {isMobile && (
                <Button variant="secondary" size="sm" icon="filter" onClick={() => setSheet(true)}>
                  Filters{activeFilters ? ` · ${activeFilters}` : ""}
                </Button>
              )}
              <SegmentedControl size="sm" value={view} onChange={setView}
                options={[{ value: "month", label: "Month", icon: "grid" }, { value: "week", label: "Week" }, { value: "day", label: "Day" }]} />
            </div>
          </div>

          {(f.q || activeFilters > 0) && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: "var(--text-3)" }}>
                {filtered.length} event{filtered.length !== 1 ? "s" : ""}{f.q ? ` matching “${f.q}”` : ""}
              </span>
            </div>
          )}

          {filtered.length === 0 ? (
            <EmptyState onClear={() => setF({ cats: new Set(), sources: new Set(), price: "all", q: "" })} />
          ) : view === "month" ? (
            <MonthView anchor={anchor} events={filtered} store={store} onOpen={setSelected}
              onJumpDay={(d: Date) => { setAnchor(d); setView("day"); }} />
          ) : view === "week" ? (
            <TimeGrid days={weekDays} events={filtered} store={store} onOpen={setSelected} />
          ) : (
            <TimeGrid days={[anchor]} events={filtered} store={store} onOpen={setSelected} />
          )}
        </div>
      </div>

      {sheet && <FilterSheet f={f} setF={setF} count={filtered.length} onClose={() => setSheet(false)} />}
      {selected && <EventModal ev={selected} store={store} onClose={() => setSelected(null)} />}
      
      <style>{`
        .navArrow { width: 32px; height: 32px; border-radius: var(--r-md); display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--border); background: var(--surface); color: var(--text-2); }
      `}</style>
    </>
  );
}

function FilterRail({ f, setF, count, onClear }: any) {
  const toggleSet = (key: string, val: string) => setF((s: any) => {
    const next = new Set(s[key]); next.has(val) ? next.delete(val) : next.add(val);
    return { ...s, [key]: next };
  });
  const active = f.cats.size || f.sources.size || f.price !== "all";
  const ftLabel = { fontSize: 11, fontWeight: 700, textTransform: "uppercase" as any, letterSpacing: "0.08em", color: "var(--text-3)", marginBottom: 10 };

  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "var(--text-2)" }}>
          <Icon name="filter" size={15} /> Filters
        </span>
        {active ? (
          <button onClick={onClear} style={{ border: "none", background: "none", fontSize: 12.5, fontWeight: 600, color: "var(--cat-tech)" }}>Clear</button>
        ) : (
          <span className="font-mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{count} events</span>
        )}
      </div>

      <div>
        <div style={ftLabel}>Category</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {CATEGORIES.map((c) => (
            <Chip key={c.key} cat={c.key} active={f.cats.has(c.key)} size="sm" onClick={() => toggleSet("cats", c.key)}>{c.label}</Chip>
          ))}
        </div>
      </div>

      <div>
        <div style={ftLabel}>Source</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {SOURCES.map((s) => {
            const on = f.sources.has(s.key);
            return (
              <button key={s.key} onClick={() => toggleSet("sources", s.key)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 11px",
                border: "1px solid " + (on ? "var(--border-strong)" : "var(--border)"),
                background: on ? "var(--surface-2)" : "var(--surface)", borderRadius: "var(--r-md)",
                fontSize: 13.5, fontWeight: 600, color: on ? "var(--text)" : "var(--text-2)",
                transition: "all .14s ease",
              }}>
                <span style={{ width: 16, height: 16, borderRadius: 5, flex: "none",
                  border: "1.5px solid " + (on ? "var(--text)" : "var(--border-strong)"),
                  background: on ? "var(--text)" : "transparent",
                  display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  {on && <Icon name="check" size={11} stroke={3} style={{ color: "var(--surface)" }} />}
                </span>
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div style={ftLabel}>Price</div>
        <SegmentedControl size="sm" value={f.price} onChange={(v: any) => setF((s: any) => ({ ...s, price: v }))}
          options={[{ value: "all", label: "All" }, { value: "free", label: "Free" }, { value: "paid", label: "Paid" }]} />
      </div>

      <div style={{ padding: 14, borderRadius: "var(--r-lg)", border: "1px dashed var(--border-strong)", background: "var(--surface-2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700 }}>
          <Icon name="sparkles" size={15} style={{ color: "var(--cat-cultural)" }} /> Fest season
        </div>
        <p style={{ margin: "7px 0 0", fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.5 }}>
          Alcheringa & Techniche listings drop weekly. Star events to get reminders.
        </p>
      </div>
    </aside>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div style={{ border: "1px dashed var(--border-strong)", borderRadius: "var(--r-lg)", padding: "56px 24px", textAlign: "center", background: "var(--surface)" }}>
      <div style={{ width: 52, height: 52, margin: "0 auto 14px", borderRadius: "var(--r-lg)", display: "grid", placeItems: "center", background: "var(--surface-2)", color: "var(--text-3)" }}>
        <Icon name="calendar" size={24} />
      </div>
      <div style={{ fontSize: 16, fontWeight: 700 }}>Nothing matches those filters</div>
      <p style={{ fontSize: 14, color: "var(--text-2)", margin: "6px 0 16px" }}>Try widening your search or clearing filters.</p>
      <Button variant="secondary" size="sm" onClick={onClear}>Clear filters</Button>
    </div>
  );
}

function FilterSheet({ f, setF, count, onClose }: any) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 70, background: "var(--scrim)", display: "flex", alignItems: "flex-end", animation: "cp-fade .16s ease" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxHeight: "82vh", overflowY: "auto", background: "var(--surface)", borderRadius: "var(--r-xl) var(--r-xl) 0 0", padding: 22, animation: "cp-fade-up .24s cubic-bezier(.2,.8,.2,1)" }}>
        <div style={{ width: 40, height: 4, borderRadius: 99, background: "var(--border-strong)", margin: "0 auto 18px" }} />
        <FilterRail f={f} setF={setF} count={count} onClear={() => setF({ cats: new Set(), sources: new Set(), price: "all", q: f.q })} />
        <Button variant="primary" full size="lg" style={{ marginTop: 22 }} onClick={onClose}>Show {count} events</Button>
      </div>
    </div>
  );
}

/* ---------------- Month view ---------------- */
function MonthView({ anchor, events, onOpen, onJumpDay, store }: any) {
  const cells = monthMatrix(anchor);
  const byDay: any = {};
  events.forEach((e: any) => { (byDay[e.date] ||= []).push(e); });
  Object.values(byDay).forEach((arr: any) => arr.sort((a: any, b: any) => timeToMin(a.start) - timeToMin(b.start)));
  const cap = 3;

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden", background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderBottom: "1px solid var(--border)" }}>
        {DOW.map((d) => (
          <div key={d} style={{ padding: "11px 12px", fontSize: 11.5, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gridAutoRows: "minmax(118px, 1fr)" }}>
        {cells.map((date, i) => {
          const inMonth = date.getMonth() === anchor.getMonth();
          const isToday = sameDay(date, TODAY);
          const dayEvents = byDay[ymd(date)] || [];
          return (
            <div key={i} style={{
              borderRight: (i % 7 !== 6) ? "1px solid var(--border)" : "none",
              borderBottom: i < 35 ? "1px solid var(--border)" : "none",
              padding: 7, display: "flex", flexDirection: "column", gap: 4, minWidth: 0,
              background: inMonth ? "transparent" : "color-mix(in srgb, var(--surface-2) 55%, var(--surface))",
            }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 24, height: 24, padding: "0 6px", borderRadius: 99, fontSize: 12.5,
                  fontWeight: isToday ? 800 : 600, fontFamily: "var(--font-mono)",
                  color: isToday ? "#fff" : inMonth ? "var(--text)" : "var(--text-3)",
                  background: isToday ? "var(--cat-tech)" : "transparent",
                }}>{date.getDate()}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                {dayEvents.slice(0, cap).map((ev: any) => (
                  <MonthChip key={ev.id} ev={ev} onOpen={onOpen} starred={store.state.stars[ev.id]} />
                ))}
                {dayEvents.length > cap && (
                  <button onClick={() => onJumpDay(date)} style={{ textAlign: "left", border: "none", background: "none", fontSize: 11.5, fontWeight: 700, color: "var(--text-2)", padding: "2px 6px" }}>
                    +{dayEvents.length - cap} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonthChip({ ev, onOpen, starred }: any) {
  return (
    <button className={`cat cat-${ev.cat}`} onClick={() => onOpen(ev)} title={ev.title} style={{
      display: "flex", alignItems: "center", gap: 6, width: "100%", textAlign: "left",
      padding: "3px 7px 3px 6px", borderRadius: 7, border: "1px solid var(--c-line)",
      background: "var(--c-soft)", color: "var(--c-ink)", cursor: "pointer", minWidth: 0,
      transition: "transform .1s ease, filter .12s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(0.97)"; e.currentTarget.style.transform = "translateX(1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--c)", flex: "none" }} />
      <span className="font-mono" style={{ fontSize: 10, opacity: 0.85, flex: "none" }}>{fmtTime(ev.start).replace(" ", "")}</span>
      <span style={{ fontSize: 11.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>{ev.title}</span>
      {starred && <Icon name="star" size={10} fill="var(--c)" style={{ marginLeft: "auto", flex: "none" }} />}
    </button>
  );
}

/* ---------------- Time grid (week + day) ---------------- */
const DAY_START = 5, DAY_END = 24, PXMIN = 0.95;

function packLanes(evs: any) {
  const sorted = [...evs].sort((a: any, b: any) => timeToMin(a.start) - timeToMin(b.start));
  const lanes: number[] = [];
  const placed = sorted.map((e) => {
    const s = timeToMin(e.start), en = Math.max(timeToMin(e.end || e.start) , s + 45);
    let lane = lanes.findIndex((end) => end <= s);
    if (lane === -1) { lane = lanes.length; lanes.push(en); } else lanes[lane] = en;
    return { e, s, en, lane };
  });
  return { placed, laneCount: Math.max(1, lanes.length) };
}

function DayColumn({ date, events, onOpen, store }: any) {
  const dayEvents = events.filter((e: any) => e.date === ymd(date));
  const { placed, laneCount } = packLanes(dayEvents);
  return (
    <div style={{ position: "relative", height: (DAY_END - DAY_START) * 60 * PXMIN, borderRight: "1px solid var(--border)" }}>
      {Array.from({ length: DAY_END - DAY_START }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 0, right: 0, top: i * 60 * PXMIN, borderTop: "1px solid var(--border)", height: 60 * PXMIN }} />
      ))}
      {placed.map(({ e, s, en, lane }) => {
        const top = (s - DAY_START * 60) * PXMIN;
        const h = Math.max(26, (en - s) * PXMIN - 3);
        const w = `calc((100% - 6px) / ${laneCount})`;
        const tall = h > 50;
        return (
          <button key={e.id} className={`cat cat-${e.cat}`} onClick={() => onOpen(e)} style={{
            position: "absolute", top, left: `calc(${lane} * ${w} + 3px)`, width: w, height: h,
            textAlign: "left", padding: tall ? "6px 8px" : "3px 8px", overflow: "hidden",
            borderRadius: 8, border: "1px solid var(--c-line)", borderLeft: "3px solid var(--c)",
            background: "var(--c-soft)", color: "var(--c-ink)", cursor: "pointer",
            display: "flex", flexDirection: "column", gap: 2, transition: "filter .12s",
          }}
            onMouseEnter={(ev) => (ev.currentTarget.style.filter = "brightness(0.97)")}
            onMouseLeave={(ev) => (ev.currentTarget.style.filter = "")}>
            <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: tall ? 2 : 1, WebkitBoxOrient: "vertical" as any }}>{e.title}</span>
            {tall && <span className="font-mono" style={{ fontSize: 10.5, opacity: 0.8 }}>{fmtRange(e.start, e.end)}</span>}
          </button>
        );
      })}
    </div>
  );
}

function TimeGrid({ days, events, onOpen, store }: any) {
  const hours = Array.from({ length: DAY_END - DAY_START }).map((_, i) => DAY_START + i);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const dayKeys = days.map(ymd);
    const dayEvents = events.filter((e: any) => dayKeys.includes(e.date));
    const earliest = dayEvents.length
      ? Math.min(...dayEvents.map((e: any) => timeToMin(e.start)))
      : 8 * 60;
    const targetHour = Math.max(DAY_START * 60, Math.min(earliest - 30, 8 * 60));
    const scrollTop = (targetHour - DAY_START * 60) * PXMIN - 16;
    scrollRef.current.scrollTop = Math.max(0, scrollTop);
  }, [days, events]);

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden", background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ display: "grid", gridTemplateColumns: `56px repeat(${days.length},1fr)`, borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "var(--surface)", zIndex: 2 }}>
        <div />
        {days.map((d: Date, i: number) => {
          const today = sameDay(d, TODAY);
          return (
            <div key={i} style={{ padding: "10px 12px", borderLeft: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase" }}>{DOW[d.getDay()]}</span>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 99, fontSize: 13, fontWeight: 700, fontFamily: "var(--font-mono)", background: today ? "var(--cat-tech)" : "transparent", color: today ? "#fff" : "var(--text)" }}>{d.getDate()}</span>
            </div>
          );
        })}
      </div>
      <div ref={scrollRef} style={{ maxHeight: "calc(100vh - 240px)", overflowY: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: `56px repeat(${days.length},1fr)`, position: "relative" }}>
          <div style={{ position: "relative", height: (DAY_END - DAY_START) * 60 * PXMIN }}>
            {hours.map((h, i) => (
              <div key={h} style={{ position: "absolute", top: i * 60 * PXMIN - 7, right: 8, fontSize: 10.5, fontFamily: "var(--font-mono)", color: "var(--text-3)" }}>{fmtTime(`${h}:00`).replace(" ", "")}</div>
            ))}
          </div>
          {days.map((d: Date, i: number) => <DayColumn key={i} date={d} events={events} onOpen={onOpen} store={store} />)}
        </div>
      </div>
    </div>
  );
}
