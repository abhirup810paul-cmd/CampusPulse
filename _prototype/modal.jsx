/* ============================================================
   CampusPulse — Event detail modal
   ============================================================ */

function EventModal({ ev, store, onClose }) {
  const [closing, setClosing] = React.useState(false);
  const close = () => { setClosing(true); setTimeout(onClose, 160); };
  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  if (!ev) return null;

  const date = parseDate(ev.date);
  const rsvp = store.state.rsvp[ev.id] || null;
  const starred = !!store.state.stars[ev.id];
  const going = store.goingCount(ev);
  const attendees = avatars(Math.min(going, 9), ev.seed || 0);
  const [toast, setToast] = React.useState("");
  const fire = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  return (
    <div onClick={close} style={{
      position: "fixed", inset: 0, zIndex: 80, background: "var(--scrim)",
      backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, animation: "cp-fade .16s ease",
    }}>
      <div onClick={(e) => e.stopPropagation()} className={`cat cat-${ev.cat}`} style={{
        width: "min(860px, 100%)", maxHeight: "92vh", overflow: "hidden", background: "var(--surface)",
        borderRadius: "var(--r-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)",
        display: "grid", gridTemplateColumns: "minmax(0, 320px) 1fr",
        animation: closing ? "cp-fade .16s ease forwards reverse" : "cp-pop .22s cubic-bezier(.2,.8,.2,1) both",
      }}>
        {/* poster */}
        <div style={{ position: "relative", background: "var(--c-soft)", minHeight: 320 }}>
          <PosterPlaceholder cat={ev.cat} label="event poster" ratio="auto" radius="0"
            style={{ position: "absolute", inset: 0, borderRadius: 0, border: "none", borderRight: "1px solid var(--c-line)" }} />
          <div style={{ position: "absolute", top: 14, left: 14 }}><CategoryBadge cat={ev.cat} /></div>
          {ev.trending && (
            <div style={{ position: "absolute", top: 14, right: 14 }}>
              <Badge tone="trending" icon="flame">Trending</Badge>
            </div>
          )}
          <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, display: "flex", gap: 8 }}>
            <Badge tone={ev.free ? "free" : "paid"}>{ev.free ? "Free" : ev.price || "Paid"}</Badge>
            <SourceTag source={ev.source} />
          </div>
        </div>

        {/* details */}
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ padding: "22px 24px 0", display: "flex", alignItems: "flex-start", gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, lineHeight: 1.15, flex: 1 }}>{ev.title}</h2>
            <button onClick={close} style={iconBtn} aria-label="Close">
              <Icon name="x" size={18} />
            </button>
          </div>

          <div style={{ padding: "16px 24px 0", overflowY: "auto", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <InfoRow icon="calendar" main={longDate(date)} sub={relativeDay(date)} />
              <InfoRow icon="clock" main={fmtRange(ev.start, ev.end)} />
              <InfoRow icon="pin" main={ev.venue} sub={`Hosted by ${ev.host}`} />
            </div>
            <p style={{ margin: "18px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "var(--text-2)" }}>{ev.desc}</p>

            {/* attendees */}
            <div style={{ margin: "20px 0 4px", display: "flex", alignItems: "center", gap: 12 }}>
              <AvatarStack people={attendees} size={32} max={6} extra={Math.max(0, going - 6)} />
              <span style={{ fontSize: 13.5, color: "var(--text-2)" }}>
                <b style={{ color: "var(--text)" }}>{going}</b> going · <b style={{ color: "var(--text)" }}>{store.interestedCount(ev)}</b> interested
              </span>
            </div>
          </div>

          {/* action bar */}
          <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", background: "var(--surface)",
            display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <RsvpControl value={rsvp} onChange={(v) => store.setRsvp(ev.id, v)} />
              </div>
              <button onClick={() => store.toggleStar(ev.id)} style={{
                display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 14px",
                borderRadius: "var(--r-md)", fontSize: 14, fontWeight: 700, transition: "all .15s",
                border: "1px solid " + (starred ? "color-mix(in srgb, var(--cat-academic) 45%, var(--border))" : "var(--border-strong)"),
                background: starred ? "color-mix(in srgb, var(--cat-academic) 16%, var(--surface))" : "var(--surface)",
                color: starred ? "color-mix(in srgb, var(--cat-academic), var(--text) 20%)" : "var(--text-2)",
              }}>
                <Icon name="star" size={16} fill={starred ? "var(--cat-academic)" : "none"}
                  stroke={2} style={{ color: starred ? "var(--cat-academic)" : "currentColor" }} />
                {store.starCount(ev)}
              </button>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="soft" size="sm" icon="calendar" full
                onClick={() => fire("Opening Google Calendar…")}>Add to Google Calendar</Button>
              <Button variant="soft" size="sm" icon="download" full
                onClick={() => fire("Downloading event.ics…")}>Download .ics</Button>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div onClick={(e) => e.stopPropagation()} style={{ position: "fixed", bottom: 26, left: "50%",
          transform: "translateX(-50%)", background: "var(--text)", color: "var(--surface)",
          padding: "11px 18px", borderRadius: "var(--r-pill)", fontSize: 13.5, fontWeight: 600,
          boxShadow: "var(--shadow-lg)", animation: "cp-fade-up .25s ease", zIndex: 90,
          display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Icon name="check" size={15} stroke={2.6} /> {toast}
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, main, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ width: 38, height: 38, borderRadius: "var(--r-md)", flex: "none",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: "var(--c-soft)", color: "var(--c-ink)", border: "1px solid var(--c-line)" }}>
        <Icon name={icon} size={18} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text)" }}>{main}</div>
        {sub && <div style={{ fontSize: 12.5, color: "var(--text-3)" }}>{sub}</div>}
      </div>
    </div>
  );
}

function RsvpControl({ value, onChange }) {
  const opts = [
    { v: "going", label: "Going", icon: "check", c: "var(--cat-sports)" },
    { v: "interested", label: "Interested", icon: "star", c: "var(--cat-academic)" },
    { v: "none", label: "Can't go", icon: "x", c: "var(--text-3)" },
  ];
  return (
    <div style={{ display: "flex", padding: 4, gap: 3, background: "var(--surface-2)",
      borderRadius: "var(--r-md)", border: "1px solid var(--border)" }}>
      {opts.map((o) => {
        const on = value === o.v;
        return (
          <button key={o.v} onClick={() => onChange(o.v)} style={{
            flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "9px 8px", borderRadius: "calc(var(--r-md) - 3px)", border: "none",
            fontSize: 13.5, fontWeight: 700, transition: "all .15s ease",
            background: on ? o.c : "transparent", color: on ? "#fff" : "var(--text-2)",
            boxShadow: on ? "var(--shadow-sm)" : "none",
          }}>
            <Icon name={o.icon} size={15} fill={on && o.v === "interested" ? "#fff" : "none"} stroke={2.4} />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

const iconBtn = {
  width: 34, height: 34, borderRadius: "var(--r-md)", flex: "none",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-2)",
};

Object.assign(window, { EventModal, RsvpControl, InfoRow, iconBtn });
