import React from 'react';

/* ---------- Icons (simple stroke set, lucide-ish) ---------- */
const ICON_PATHS: Record<string, string> = {
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2-4.3-4.3",
  plus: "M12 5v14M5 12h14",
  x: "M18 6 6 18M6 6l12 12",
  chevronL: "M15 18l-6-6 6-6",
  chevronR: "M9 18l6-6-6-6",
  chevronD: "M6 9l6 6 6-6",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  clock: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  pin: "M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z",
  filter: "M3 5h18l-7 8v6l-4 2v-8z",
  download: "M12 3v12m0 0 4-4m-4 4-4-4M5 21h14",
  link: "M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5",
  upload: "M12 15V3m0 0L8 7m4-4 4 4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2",
  sparkles: "M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6zM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8zM5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8z",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z",
  check: "M5 12l4.5 4.5L19 7",
  flame: "M12 22c4 0 7-2.7 7-7 0-3-2-5.3-3.2-6.6-.4 1.8-1.6 2.6-2.3 2.6.4-2.4-.6-5-2.5-7-.3 2.6-1.7 4-3 5.2C6.4 6.8 5 9 5 12c0 4.3 3 10 7 10z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  home: "M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5",
  bell: "M18 9a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  ticket: "M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4zM12 6v0M12 12v0M12 18v0",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  arrowR: "M5 12h14M13 6l6 6-6 6",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 13a7.6 7.6 0 0 0 0-2l2-1.5-2-3.5-2.4 1a7.6 7.6 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.5L4.6 11a7.6 7.6 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7.6 7.6 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.5z",
  edit: "M4 20h4L19 9a2 2 0 0 0-3-3L5 17v3zM14 6l3 3",
  image: "M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6",
  refresh: "M21 12a9 9 0 1 1-3-6.7M21 4v4h-4",
  compass: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z",
};

export function Icon({ name, size = 18, stroke = 2, fill = "none", style, className }: { name: string; size?: number; stroke?: number; fill?: string; style?: React.CSSProperties; className?: string }) {
  const p = ICON_PATHS[name] || "";
  const solid = fill !== "none";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={solid ? fill : "none"}
      className={className}
      style={{ flex: "none", display: "block", ...style }}
      stroke={solid ? "none" : "currentColor"} strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round">
      <path d={p} />
    </svg>
  );
}

/* ---------- Logo ---------- */
export function PulseMark({ size = 28, live = true }: { size?: number, live?: boolean }) {
  return (
    <span style={{
      position: "relative", width: size, height: size, flex: "none",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      borderRadius: size * 0.32,
      background: "linear-gradient(150deg, var(--cat-tech), var(--cat-cultural) 55%, var(--cat-social))",
      boxShadow: "0 6px 16px -6px color-mix(in srgb, var(--cat-cultural) 60%, transparent)",
    }}>
      <svg width={size * 0.66} height={size * 0.66} viewBox="0 0 24 24" fill="none"
        stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h4l2.5-6 4 14 3-8 2 4h4">
          {live && (
            <animate attributeName="stroke-dasharray" dur="2.4s" repeatCount="indefinite"
              values="0 40; 40 0; 40 0" keyTimes="0;0.6;1" />
          )}
        </path>
      </svg>
    </span>
  );
}

export function Logo({ size = 28, showText = true, live = true }: { size?: number, showText?: boolean, live?: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <PulseMark size={size} live={live} />
      {showText && (
        <span className="font-display font-bold" style={{ fontSize: size * 0.66, letterSpacing: "-0.03em" }}>
          Campus<span style={{ color: "var(--cat-tech)" }}>Pulse</span>
        </span>
      )}
    </span>
  );
}

/* ---------- Button ---------- */
export function Button({ children, variant = "primary", size = "md", icon, iconRight, full, style, ...rest }: any) {
  const pad = size === "sm" ? "7px 12px" : size === "lg" ? "13px 22px" : "10px 16px";
  const fs = size === "sm" ? 13 : size === "lg" ? 16 : 14.5;
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: pad, fontSize: fs, fontWeight: 600, fontFamily: "var(--font-sans)",
    borderRadius: "var(--r-md)", border: "1px solid transparent", lineHeight: 1.1,
    width: full ? "100%" : undefined, whiteSpace: "nowrap" as any,
    transition: "transform .12s ease, background .15s ease, border-color .15s, box-shadow .15s, opacity .15s",
  };
  const variants: any = {
    primary: { background: "var(--text)", color: "var(--surface)", boxShadow: "var(--shadow-sm)" },
    secondary: { background: "var(--surface)", color: "var(--text)", borderColor: "var(--border-strong)", boxShadow: "var(--shadow-sm)" },
    ghost: { background: "transparent", color: "var(--text-2)" },
    soft: { background: "var(--surface-2)", color: "var(--text)", borderColor: "var(--border)" },
    accent: { background: "var(--c, var(--cat-tech))", color: "#fff", boxShadow: "0 6px 16px -8px var(--c, var(--cat-tech))" },
    danger: { background: "var(--cat-merch)", color: "#fff" },
  };
  return (
    <button {...rest} style={{ ...base, ...variants[variant], ...style }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "")}>
      {icon && <Icon name={icon} size={fs + 2} />}
      {children}
      {iconRight && <Icon name={iconRight} size={fs + 2} />}
    </button>
  );
}

/* ---------- Chip ---------- */
export function Chip({ children, active, cat, onClick, dot, size = "md" }: any) {
  const cls = cat ? `cat cat-${cat}` : "cat";
  const pad = size === "sm" ? "5px 10px" : "7px 13px";
  return (
    <button className={cls} onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 7, padding: pad,
      fontSize: size === "sm" ? 12.5 : 13.5, fontWeight: 600, borderRadius: "var(--r-pill)",
      cursor: "pointer", transition: "all .14s ease", whiteSpace: "nowrap",
      border: "1px solid " + (active ? "var(--c-line)" : "var(--border)"),
      background: active ? "var(--c-soft)" : "var(--surface)",
      color: active ? "var(--c-ink)" : "var(--text-2)",
      boxShadow: active ? "inset 0 0 0 1px var(--c-line)" : "none",
    }}>
      {dot !== false && (
        <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--c)",
          opacity: active ? 1 : 0.5, flex: "none" }} />
      )}
      {children}
    </button>
  );
}

/* ---------- CategoryBadge ---------- */
export function CategoryBadge({ cat, size = "md" }: { cat: string, size?: "sm"|"md" }) {
  return (
    <span className={`cat cat-${cat}`} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: size === "sm" ? "3px 9px" : "5px 11px",
      fontSize: size === "sm" ? 11.5 : 12.5, fontWeight: 700, borderRadius: "var(--r-pill)",
      background: "var(--c-soft)", color: "var(--c-ink)", border: "1px solid var(--c-line)",
      letterSpacing: "0.01em",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 99, background: "var(--c)", flex: "none" }} />
      <span className="capitalize">{cat}</span>
    </span>
  );
}

/* ---------- Badge ---------- */
export function Badge({ children, tone = "neutral", icon, size = "md" }: any) {
  const tones: any = {
    neutral: { bg: "var(--surface-2)", fg: "var(--text-2)", bd: "var(--border)" },
    free: { bg: "color-mix(in srgb, var(--cat-sports) 14%, var(--surface))", fg: "color-mix(in srgb, var(--cat-sports), var(--text) 22%)", bd: "color-mix(in srgb, var(--cat-sports) 32%, var(--border))" },
    paid: { bg: "var(--surface-2)", fg: "var(--text-2)", bd: "var(--border-strong)" },
    trending: { bg: "color-mix(in srgb, var(--cat-trending) 16%, var(--surface))", fg: "color-mix(in srgb, var(--cat-trending), var(--text) 18%)", bd: "color-mix(in srgb, var(--cat-trending) 36%, var(--border))" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: size === "sm" ? "2px 8px" : "4px 10px",
      fontSize: size === "sm" ? 11 : 12, fontWeight: 700, borderRadius: "var(--r-pill)",
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
    }}>
      {icon && <Icon name={icon} size={12} stroke={2.4} fill={tone === "trending" ? "currentColor" : "none"} />}
      {children}
    </span>
  );
}

/* ---------- SourceTag ---------- */
export function SourceTag({ source }: { source: string }) {
  const map: any = {
    official: { label: "Official", icon: "check" },
    club: { label: "Club", icon: "users" },
    community: { label: "Community", icon: "compass" },
  };
  const s = map[source] || map.community;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5,
      fontWeight: 600, color: "var(--text-3)" }}>
      <Icon name={s.icon} size={13} stroke={2.2} />{s.label}
    </span>
  );
}

/* ---------- Avatar & Stack ---------- */
export function Avatar({ person, size = 30, ring = "var(--surface)" }: any) {
  return (
    <span title={person.name} style={{
      width: size, height: size, borderRadius: 99, flex: "none",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 700, color: "#fff",
      fontFamily: "var(--font-sans)",
      background: `linear-gradient(140deg, hsl(${person.hue} 70% 58%), hsl(${(person.hue + 40) % 360} 68% 48%))`,
      boxShadow: `0 0 0 2px ${ring}`,
    }}>{person.initials}</span>
  );
}

export function AvatarStack({ people, size = 30, max = 5, extra }: any) {
  const shown = people.slice(0, max);
  const more = extra != null ? extra : Math.max(0, people.length - max);
  return (
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      {shown.map((p: any, i: number) => (
        <span key={i} style={{ marginLeft: i === 0 ? 0 : -size * 0.32, zIndex: shown.length - i }}>
          <Avatar person={p} size={size} />
        </span>
      ))}
      {more > 0 && (
        <span style={{ marginLeft: -size * 0.32, width: size, height: size, borderRadius: 99,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: size * 0.32, fontWeight: 700, color: "var(--text-2)",
          background: "var(--surface-3)", boxShadow: "0 0 0 2px var(--surface)", zIndex: 0 }}>
          +{more}
        </span>
      )}
    </span>
  );
}

/* ---------- SegmentedControl ---------- */
export function SegmentedControl({ options, value, onChange, size = "md", accent }: any) {
  const pad = size === "sm" ? "6px 11px" : "9px 15px";
  return (
    <div style={{ display: "inline-flex", padding: 4, gap: 3, background: "var(--surface-2)",
      borderRadius: "var(--r-md)", border: "1px solid var(--border)" }}>
      {options.map((o: any) => {
        const v = typeof o === "string" ? o : o.value;
        const label = typeof o === "string" ? o : o.label;
        const on = v === value;
        return (
          <button key={v} onClick={() => onChange(v)} style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: pad,
            fontSize: size === "sm" ? 13 : 14, fontWeight: 600, borderRadius: "calc(var(--r-md) - 3px)",
            border: "none", whiteSpace: "nowrap", transition: "all .15s ease",
            background: on ? (accent || "var(--surface)") : "transparent",
            color: on ? (accent ? "#fff" : "var(--text)") : "var(--text-2)",
            boxShadow: on ? "var(--shadow-sm)" : "none",
          }}>
            {o.icon && <Icon name={o.icon} size={15} />}
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Toggle ---------- */
export function Toggle({ checked, onChange, label }: any) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      display: "inline-flex", alignItems: "center", gap: 9, background: "none", border: "none", padding: 0 }}>
      <span style={{ width: 40, height: 23, borderRadius: 99, padding: 2, transition: "background .18s",
        background: checked ? "var(--cat-sports)" : "var(--surface-3)", border: "1px solid var(--border)" }}>
        <span style={{ display: "block", width: 17, height: 17, borderRadius: 99, background: "#fff",
          boxShadow: "var(--shadow-sm)", transform: checked ? "translateX(17px)" : "none", transition: "transform .18s" }} />
      </span>
      {label && <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-2)" }}>{label}</span>}
    </button>
  );
}

/* ---------- Tabs ---------- */
export function Tabs({ tabs, value, onChange }: any) {
  return (
    <div style={{ display: "flex", gap: 4, background: "var(--surface-2)", padding: 5,
      borderRadius: "var(--r-md)", border: "1px solid var(--border)" }}>
      {tabs.map((t: any) => {
        const on = t.value === value;
        return (
          <button key={t.value} onClick={() => onChange(t.value)} style={{
            flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "11px 14px", fontSize: 14.5, fontWeight: 600, borderRadius: "calc(var(--r-md) - 3px)",
            border: "none", transition: "all .15s ease",
            background: on ? "var(--surface)" : "transparent",
            color: on ? "var(--text)" : "var(--text-2)", boxShadow: on ? "var(--shadow-sm)" : "none",
          }}>
            {t.icon && <Icon name={t.icon} size={16} />}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- PosterPlaceholder ---------- */
export function PosterPlaceholder({ cat = "tech", label = "event poster", ratio = "4 / 5", radius = "var(--r-lg)", style }: any) {
  return (
    <div className={`cat cat-${cat}`} style={{
      aspectRatio: ratio, borderRadius: radius, position: "relative", overflow: "hidden",
      border: "1px solid var(--c-line)",
      background: `repeating-linear-gradient(135deg, var(--c-soft) 0 14px, var(--c-soft-2) 14px 28px)`,
      display: "flex", alignItems: "center", justifyContent: "center", ...style,
    }}>
      <span className="font-mono" style={{ fontSize: 12, color: "var(--c-ink)", opacity: 0.8,
        textTransform: "uppercase", letterSpacing: "0.12em", padding: "6px 12px",
        background: "color-mix(in srgb, var(--surface) 70%, transparent)", borderRadius: 99 }}>
        {label}
      </span>
    </div>
  );
}
