/* ============================================================
   CampusPulse — Login (magic link) + Styleguide
   ============================================================ */

function LoginScreen({ onEnter, theme, setTheme }) {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div data-screen-label="Login" style={{ flex: 1, display: "grid", gridTemplateColumns: "1.05fr 1fr", minHeight: "100vh" }}
      className="cp-login">
      {/* brand panel */}
      <div style={{ position: "relative", overflow: "hidden", padding: "48px 52px",
        background: "linear-gradient(155deg, #0b1120 0%, #131a2e 60%, #1a1340 100%)", color: "#fff",
        display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Logo size={30} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <h1 className="display" style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.08, margin: "0 0 16px",
            letterSpacing: "-0.03em" }}>
            Everything<br />happening on<br />campus, in one<br />
            <span style={{ background: "linear-gradient(90deg, var(--cat-tech), var(--cat-cultural), var(--cat-social))",
              WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>living calendar.</span>
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,.7)", maxWidth: 380, margin: 0 }}>
            Discover fests, talks, matches and meetups. RSVP in a tap. Submit your own in seconds — we'll even read the poster for you.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 26 }}>
            {CATEGORIES.map((c) => (
              <span key={c.key} className={`cat cat-${c.key}`} style={{ display: "inline-flex", alignItems: "center", gap: 6,
                padding: "6px 12px", borderRadius: 99, fontSize: 12.5, fontWeight: 700,
                background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)", color: "#fff" }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--c)" }} /> {c.label}
              </span>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.45)", position: "relative", zIndex: 2 }}>
          Built for IIT Guwahati · 700 acres on the Brahmaputra
        </div>
        {/* floating glow */}
        <div style={{ position: "absolute", top: -120, right: -120, width: 360, height: 360, borderRadius: 99,
          background: "radial-gradient(circle, color-mix(in srgb, var(--cat-cultural) 55%, transparent), transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -80, left: 40, width: 240, height: 240, borderRadius: 99,
          background: "radial-gradient(circle, color-mix(in srgb, var(--cat-tech) 45%, transparent), transparent 70%)" }} />
      </div>

      {/* form panel */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ ...iconBtn, position: "absolute", top: 24, right: 24 }}>
          <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
        </button>
        <div style={{ width: "min(380px, 100%)" }}>
          {!sent ? (
            <React.Fragment>
              <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700 }}>Sign in</h2>
              <p style={{ margin: "0 0 26px", fontSize: 14.5, color: "var(--text-2)" }}>
                Use your college email — we'll send a magic link. No passwords, ever.
              </p>
              <label style={lbl}>College email</label>
              <div style={{ position: "relative", marginBottom: 16 }}>
                <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }}>
                  <Icon name="mail" size={17} /></span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rollno@iitg.ac.in"
                  type="email" style={{ ...inp, paddingLeft: 40 }}
                  onKeyDown={(e) => e.key === "Enter" && valid && setSent(true)}
                  onFocus={(e) => { e.target.style.borderColor = "var(--cat-tech)"; e.target.style.boxShadow = "0 0 0 3px var(--ring)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--border-strong)"; e.target.style.boxShadow = ""; }} />
              </div>
              <Button variant="primary" full size="lg" iconRight="arrowR" disabled={!valid}
                onClick={() => setSent(true)}>Send magic link</Button>
              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "22px 0" }}>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                <span style={{ fontSize: 12, color: "var(--text-3)" }}>or</span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>
              <Button variant="secondary" full size="lg" onClick={() => onEnter()}>Browse as guest</Button>
              <p style={{ fontSize: 12, color: "var(--text-3)", textAlign: "center", marginTop: 22, lineHeight: 1.5 }}>
                By continuing you agree to the campus community guidelines.
              </p>
            </React.Fragment>
          ) : (
            <div style={{ textAlign: "center", animation: "cp-pop .3s ease" }}>
              <div style={{ width: 64, height: 64, margin: "0 auto 18px", borderRadius: "var(--r-lg)",
                display: "grid", placeItems: "center", color: "#fff",
                background: "linear-gradient(150deg, var(--cat-tech), var(--cat-cultural))" }}>
                <Icon name="mail" size={28} /></div>
              <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>Check your inbox</h2>
              <p style={{ margin: "0 auto 24px", fontSize: 14.5, color: "var(--text-2)", maxWidth: 320, lineHeight: 1.55 }}>
                We sent a magic link to <b style={{ color: "var(--text)" }}>{email}</b>. Tap it to jump straight into CampusPulse.
              </p>
              <Button variant="primary" full size="lg" icon="arrowR" onClick={() => onEnter()}>Open CampusPulse</Button>
              <button onClick={() => setSent(false)} style={{ border: "none", background: "none", marginTop: 16,
                fontSize: 13, fontWeight: 600, color: "var(--text-3)" }}>Use a different email</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Styleguide ---------------- */
function SG({ title, children }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.08em", color: "var(--text-3)" }}>{title}</h3>
      {children}
    </section>
  );
}
function card(extra) {
  return { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
    boxShadow: "var(--shadow-sm)", padding: 20, ...extra };
}
function StyleguideScreen() {
  const [seg, setSeg] = React.useState("month");
  const [tog, setTog] = React.useState(true);
  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "8px 4px 48px" }}>
      <h1 style={{ margin: "0 0 6px", fontSize: 30, fontWeight: 700 }}>Design system</h1>
      <p style={{ margin: "0 0 32px", fontSize: 15, color: "var(--text-2)", maxWidth: 620 }}>
        Neutral slate chrome, with the seven event categories doing the talking. Geometric display type
        (Space Grotesk), humanist UI (Plus Jakarta Sans), mono for metadata (JetBrains Mono). Maps cleanly
        to Tailwind tokens + shadcn/ui primitives.
      </p>

      <SG title="Category color system">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
          {[...CATEGORIES, { key: "trending", label: "Trending" }].map((c) => (
            <div key={c.key} className={`cat cat-${c.key}`} style={card({ padding: 0, overflow: "hidden" })}>
              <div style={{ height: 56, background: "var(--c)" }} />
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{c.label}</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>
                  {{tech:"#3b82f6",cultural:"#a855f7",sports:"#22c55e",academic:"#f59e0b",social:"#ec4899",personal:"#64748b",merch:"#ef4444",trending:"#fb923c"}[c.key]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SG>

      <SG title="Typography">
        <div style={card()}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 700, letterSpacing: "-0.03em" }}>What's on this week</div>
          <div style={{ fontSize: 16, color: "var(--text-2)", marginTop: 8, maxWidth: 560, lineHeight: 1.6 }}>
            Body copy in Plus Jakarta Sans keeps long descriptions readable and friendly without feeling corporate.
          </div>
          <div className="mono" style={{ fontSize: 13, color: "var(--text-3)", marginTop: 10 }}>7 PM – 10:30 PM · Dr. Bhupen Hazarika Auditorium</div>
        </div>
      </SG>

      <SG title="Buttons">
        <div style={card({ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" })}>
          <Button variant="primary" icon="plus">Primary</Button>
          <Button variant="secondary" icon="calendar">Secondary</Button>
          <Button variant="soft" icon="download">Soft</Button>
          <Button variant="accent" icon="sparkles" style={{ "--c": "var(--cat-cultural)" }}>Accent</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </SG>

      <SG title="Chips, badges & avatars">
        <div style={card({ display: "flex", flexDirection: "column", gap: 16 })}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CATEGORIES.map((c) => <Chip key={c.key} cat={c.key} active size="sm">{c.label}</Chip>)}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <CategoryBadge cat="tech" /><CategoryBadge cat="sports" />
            <Badge tone="free">Free</Badge><Badge tone="paid">₹120</Badge>
            <Badge tone="trending" icon="flame">Trending</Badge>
            <SourceTag source="official" /><SourceTag source="club" />
          </div>
          <AvatarStack people={avatars(8, 2)} size={34} max={6} extra={18} />
        </div>
      </SG>

      <SG title="Controls">
        <div style={card({ display: "flex", flexWrap: "wrap", gap: 22, alignItems: "center" })}>
          <SegmentedControl value={seg} onChange={setSeg}
            options={[{ value: "month", label: "Month", icon: "grid" }, { value: "week", label: "Week" }, { value: "day", label: "Day" }]} />
          <Toggle checked={tog} onChange={setTog} label="Free only" />
        </div>
      </SG>
    </div>
  );
}

Object.assign(window, { LoginScreen, StyleguideScreen });
