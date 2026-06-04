/* ============================================================
   CampusPulse — app shell, navigation, calendar composition, Tweaks
   ============================================================ */

const { useState, useEffect, useMemo, useRef } = React;

function useViewport() {
  const [w, setW] = useState(window.__forceMobile ? 390 : window.innerWidth);
  useEffect(() => {
    if (window.__forceMobile) return;
    const on = () => setW(window.innerWidth);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return { w, isMobile: !!(window.__forceMobile || w < 860), isNarrow: !!(window.__forceMobile || w < 1180) };
}

/* ---------------- Calendar screen composition ---------------- */
function CalendarScreen({ store, onOpen, f, setF, view, setView, anchor, setAnchor, isMobile, openFilters }) {
  const filtered = useMemo(() => EVENTS.filter((e) => eventMatches(e, f)), [f]);
  const monthLabel = `${MONTHS[anchor.getMonth()]} ${anchor.getFullYear()}`;

  // On mobile, "week" shows 3 days centred on anchor (yesterday / today / tomorrow)
  const weekDays = useMemo(() => {
    if (view === "week" && isMobile) return [-1, 0, 1].map((d) => addDays(anchor, d));
    const s = startOfWeek(anchor);
    return Array.from({ length: 7 }, (_, i) => addDays(s, i));
  }, [anchor, view, isMobile]);

  const nav = (dir) => {
    if (view === "month") setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() + dir, 1));
    else if (view === "week" && isMobile) setAnchor(addDays(anchor, dir));      // step 1 day in 3-day view
    else if (view === "week") setAnchor(addDays(anchor, dir * 7));
    else setAnchor(addDays(anchor, dir));
  };

  const sameMonth = weekDays[0].getMonth() === weekDays[weekDays.length - 1].getMonth();
  const label = view === "month" ? monthLabel
    : view === "week" && isMobile
      ? `${weekDays[0].getDate()} – ${weekDays[2].getDate()} ${MONTHS[weekDays[2].getMonth()].slice(0,3)}`
      : view === "week"
        ? (sameMonth
            ? `${weekDays[0].getDate()} – ${weekDays[6].getDate()} ${MONTHS[weekDays[6].getMonth()].slice(0,3)} ${weekDays[6].getFullYear()}`
            : `${weekDays[0].getDate()} ${MONTHS[weekDays[0].getMonth()].slice(0,3)} – ${weekDays[6].getDate()} ${MONTHS[weekDays[6].getMonth()].slice(0,3)}`)
        : longDate(anchor);

  const activeFilters = f.cats.size + f.sources.size + (f.price !== "all" ? 1 : 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "236px 1fr", gap: 24, alignItems: "start" }}>
      {!isMobile && <FilterRail f={f} setF={setF} count={filtered.length}
        onClear={() => setF({ cats: new Set(), sources: new Set(), price: "all", q: f.q })} />}

      <div style={{ minWidth: 0 }}>
        {/* calendar header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ margin: 0, fontSize: isMobile ? 21 : 26, fontWeight: 700, minWidth: 0,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</h1>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => nav(-1)} style={navArrow} aria-label="Previous"><Icon name="chevronL" size={17} /></button>
              <button onClick={() => nav(1)} style={navArrow} aria-label="Next"><Icon name="chevronR" size={17} /></button>
            </div>
            <Button variant="soft" size="sm" onClick={() => setAnchor(new Date(TODAY))}>Today</Button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isMobile && (
              <Button variant="secondary" size="sm" icon="filter" onClick={openFilters}>
                Filters{activeFilters ? ` · ${activeFilters}` : ""}</Button>
            )}
            <SegmentedControl size="sm" value={view} onChange={setView}
              options={[{ value: "month", label: "Month", icon: "grid" }, { value: "week", label: "Week" }, { value: "day", label: "Day" }]} />
          </div>
        </div>

        {/* active filter summary */}
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
          <MonthView anchor={anchor} events={filtered} store={store} onOpen={onOpen}
            onJumpDay={(d) => { setAnchor(d); setView("day"); }} />
        ) : view === "week" ? (
          <TimeGrid days={weekDays} events={filtered} store={store} onOpen={onOpen} />
        ) : (
          <TimeGrid days={[anchor]} events={filtered} store={store} onOpen={onOpen} />
        )}
      </div>
    </div>
  );
}
const navArrow = { width: 32, height: 32, borderRadius: "var(--r-md)", display: "inline-flex",
  alignItems: "center", justifyContent: "center", border: "1px solid var(--border)",
  background: "var(--surface)", color: "var(--text-2)" };

function EmptyState({ onClear }) {
  return (
    <div style={{ border: "1px dashed var(--border-strong)", borderRadius: "var(--r-lg)", padding: "56px 24px",
      textAlign: "center", background: "var(--surface)" }}>
      <div style={{ width: 52, height: 52, margin: "0 auto 14px", borderRadius: "var(--r-lg)", display: "grid",
        placeItems: "center", background: "var(--surface-2)", color: "var(--text-3)" }}>
        <Icon name="calendar" size={24} /></div>
      <div style={{ fontSize: 16, fontWeight: 700 }}>Nothing matches those filters</div>
      <p style={{ fontSize: 14, color: "var(--text-2)", margin: "6px 0 16px" }}>Try widening your search or clearing filters.</p>
      <Button variant="secondary" size="sm" onClick={onClear}>Clear filters</Button>
    </div>
  );
}

/* ---------------- Top bar + nav ---------------- */
const NAV = [
  { key: "calendar", label: "Calendar", icon: "calendar" },
  { key: "community", label: "Community", icon: "compass" },
  { key: "submit", label: "Submit", icon: "plus" },
  { key: "styleguide", label: "System", icon: "grid" },
];
function TopBar({ screen, setScreen, theme, setTheme, q, setQ, isMobile, onSignOut }) {
  const [menu, setMenu] = useState(false);
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40, background: "color-mix(in srgb, var(--surface) 86%, transparent)",
      backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: isMobile ? "10px 16px" : "12px 28px",
        display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => setScreen("calendar")} style={{ border: "none", background: "none", padding: 0 }}>
          <Logo size={isMobile ? 26 : 28} showText={!isMobile} />
        </button>

        {/* search */}
        <div style={{ flex: 1, maxWidth: 460, position: "relative", marginLeft: isMobile ? "auto" : 6 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }}>
            <Icon name="search" size={17} /></span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={isMobile ? "Search" : "Search events, venues, clubs…"}
            onFocus={(e) => { setScreen("calendar"); e.target.style.borderColor = "var(--cat-tech)"; e.target.style.boxShadow = "0 0 0 3px var(--ring)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = ""; }}
            style={{ width: "100%", padding: "9px 12px 9px 38px", fontSize: 14, color: "var(--text)",
              background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--r-pill)",
              outline: "none", transition: "all .15s" }} />
        </div>

        {!isMobile && (
          <nav style={{ display: "flex", gap: 4 }}>
            {NAV.map((n) => {
              const on = screen === n.key;
              return (
                <button key={n.key} onClick={() => setScreen(n.key)} style={{
                  display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: "var(--r-md)",
                  fontSize: 14, fontWeight: 600, border: "none", transition: "all .14s",
                  background: on ? "var(--surface-2)" : "transparent", color: on ? "var(--text)" : "var(--text-2)" }}>
                  <Icon name={n.icon} size={16} />{n.label}
                </button>
              );
            })}
          </nav>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={iconBtn} aria-label="Toggle theme">
            <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
          </button>
          <div style={{ position: "relative" }}>
            <button onClick={() => setMenu((m) => !m)} style={{ border: "none", background: "none", padding: 0, borderRadius: 99 }}>
              <Avatar person={avatar("You Student")} size={34} ring="var(--surface)" />
            </button>
            {menu && (
              <React.Fragment>
                <div onClick={() => setMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 50 }} />
                <div style={{ position: "absolute", right: 0, top: 44, width: 200, zIndex: 51, padding: 6,
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)",
                  boxShadow: "var(--shadow-lg)", animation: "cp-pop .16s ease" }}>
                  <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>You Student</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>you@iitg.ac.in</div>
                  </div>
                  <MenuItem icon="moon" label="Toggle theme" onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); setMenu(false); }} />
                  <MenuItem icon="arrowR" label="Sign out" onClick={() => { setMenu(false); onSignOut(); }} />
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
function MenuItem({ icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%",
      padding: "9px 10px", border: "none", background: "none", borderRadius: "var(--r-sm)", fontSize: 13.5,
      fontWeight: 600, color: "var(--text-2)", textAlign: "left" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}>
      <Icon name={icon} size={16} />{label}
    </button>
  );
}
function BottomNav({ screen, setScreen }) {
  return (
    <nav style={{ position: "sticky", bottom: 0, zIndex: 40, display: "flex",
      background: "color-mix(in srgb, var(--surface) 92%, transparent)", backdropFilter: "blur(12px)",
      borderTop: "1px solid var(--border)", paddingBottom: "env(safe-area-inset-bottom)" }}>
      {NAV.map((n) => {
        const on = screen === n.key;
        return (
          <button key={n.key} onClick={() => setScreen(n.key)} style={{ flex: 1, display: "flex",
            flexDirection: "column", alignItems: "center", gap: 3, padding: "9px 0 11px", border: "none",
            background: "none", color: on ? "var(--cat-tech)" : "var(--text-3)" }}>
            <Icon name={n.icon} size={20} fill={n.key === "submit" && on ? "none" : "none"} />
            <span style={{ fontSize: 11, fontWeight: 700 }}>{n.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ---------------- Mobile filter sheet ---------------- */
function FilterSheet({ f, setF, count, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 70, background: "var(--scrim)",
      display: "flex", alignItems: "flex-end", animation: "cp-fade .16s ease" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxHeight: "82vh", overflowY: "auto",
        background: "var(--surface)", borderRadius: "var(--r-xl) var(--r-xl) 0 0", padding: 22,
        animation: "cp-fade-up .24s cubic-bezier(.2,.8,.2,1)" }}>
        <div style={{ width: 40, height: 4, borderRadius: 99, background: "var(--border-strong)", margin: "0 auto 18px" }} />
        <FilterRail f={f} setF={setF} count={count}
          onClear={() => setF({ cats: new Set(), sources: new Set(), price: "all", q: f.q })} />
        <Button variant="primary" full size="lg" style={{ marginTop: 22 }} onClick={onClose}>Show {count} events</Button>
      </div>
    </div>
  );
}

/* ---------------- App root ---------------- */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentIntensity": 100,
  "roundness": 100,
  "theme": "light"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [authed, setAuthed] = useState(false);
  const [screen, setScreen] = useState("calendar");
  const [theme, setThemeState] = useState(t.theme || "light");
  const [view, setView] = useState("month");
  const [anchor, setAnchor] = useState(new Date(TODAY));
  const [selected, setSelected] = useState(null);
  const [sheet, setSheet] = useState(false);
  const [f, setF] = useState({ cats: new Set(), sources: new Set(), price: "all", q: "" });
  const store = useInteractions();
  const { isMobile } = useViewport();

  const setTheme = (v) => { setThemeState(v); setTweak("theme", v); };
  useEffect(() => { if (t.theme && t.theme !== theme) setThemeState(t.theme); }, [t.theme]);

  // apply theme + tweak-driven tokens
  const ai = (t.accentIntensity ?? 100) / 100;
  const rs = (t.roundness ?? 100) / 100;
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);

  const rootVars = {
    "--ai": ai,
    "--r-sm": `${8 * rs}px`, "--r-md": `${12 * rs}px`, "--r-lg": `${16 * rs}px`, "--r-xl": `${22 * rs}px`,
    ...(window.__forceMobile ? { height: "100%", overflow: "hidden" } : { minHeight: "100%" }),
    display: "flex", flexDirection: "column",
  };

  const setQ = (q) => setF((s) => ({ ...s, q }));

  if (!authed) {
    return (
      <div style={rootVars}>
        <LoginScreen theme={theme} setTheme={setTheme} onEnter={() => setAuthed(true)} />
        <TweakPanelUI t={t} setTweak={setTweak} theme={theme} setTheme={setTheme} />
      </div>
    );
  }

  return (
    <div style={rootVars}>
      <TopBar screen={screen} setScreen={setScreen} theme={theme} setTheme={setTheme}
        q={f.q} setQ={setQ} isMobile={isMobile} onSignOut={() => setAuthed(false)} />

      <main style={{ flex: 1, maxWidth: 1320, width: "100%", margin: "0 auto",
        padding: isMobile ? "18px 16px 24px" : "26px 28px 40px",
        ...(window.__forceMobile ? { overflowY: "auto", overflowX: "hidden" } : {}) }}>
        {screen === "calendar" && (
          <CalendarScreen store={store} onOpen={setSelected} f={f} setF={setF} view={view} setView={setView}
            anchor={anchor} setAnchor={setAnchor} isMobile={isMobile} openFilters={() => setSheet(true)} />
        )}
        {screen === "community" && <FeedScreen store={store} onCompose={() => setScreen("submit")} />}
        {screen === "submit" && (
          <SubmitScreen onCancel={() => setScreen("calendar")}
            onPublish={(arg) => { if (arg === "goto") setScreen("calendar"); }} />
        )}
        {screen === "styleguide" && <StyleguideScreen />}
      </main>

      {isMobile && <BottomNav screen={screen} setScreen={setScreen} />}
      {selected && <EventModal ev={selected} store={store} onClose={() => setSelected(null)} />}
      {sheet && <FilterSheet f={f} setF={setF} count={EVENTS.filter((e) => eventMatches(e, f)).length} onClose={() => setSheet(false)} />}

      <TweakPanelUI t={t} setTweak={setTweak} theme={theme} setTheme={setTheme} />
    </div>
  );
}

function TweakPanelUI({ t, setTweak, theme, setTheme }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Color" />
      <TweakSlider label="Accent intensity" value={t.accentIntensity} min={20} max={140} step={10} unit="%"
        onChange={(v) => setTweak("accentIntensity", v)} />
      <TweakSection label="Shape" />
      <TweakSlider label="Corner roundness" value={t.roundness} min={40} max={160} step={10} unit="%"
        onChange={(v) => setTweak("roundness", v)} />
      <TweakSection label="Theme" />
      <TweakRadio label="Mode" value={theme} options={["light", "dark"]} onChange={setTheme} />
    </TweaksPanel>
  );
}

Object.assign(window, { CampusPulseApp: App });
if (!window.__skipAutoMount) {
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
}
