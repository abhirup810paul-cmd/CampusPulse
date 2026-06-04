/* ============================================================
   CampusPulse — Submit: review form + success
   ============================================================ */

const lbl = { display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--text-2)", marginBottom: 7 };
const inp = {
  width: "100%", padding: "11px 13px", fontSize: 14.5, color: "var(--text)",
  background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)",
  outline: "none", transition: "border-color .15s, box-shadow .15s", fontFamily: "var(--font-sans)",
};

function Field({ label, low, children, onEdit }) {
  return (
    <div className={low ? "cp-low" : ""} style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-2)" }}>{label}</span>
        {low && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700,
            color: "color-mix(in srgb, var(--cat-academic), var(--text) 22%)",
            background: "color-mix(in srgb, var(--cat-academic) 16%, var(--surface))",
            border: "1px solid color-mix(in srgb, var(--cat-academic) 36%, var(--border))",
            padding: "1px 7px", borderRadius: 99 }}>
            <Icon name="sparkles" size={10} /> double-check
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function ReviewForm({ form, set, conf, clearConf, lowCount, isAI, onPublish, onCancel }) {
  const ringLow = (k) => conf[k]
    ? { borderColor: "color-mix(in srgb, var(--cat-academic) 55%, var(--border))",
        boxShadow: "0 0 0 3px color-mix(in srgb, var(--cat-academic) 16%, transparent)",
        background: "color-mix(in srgb, var(--cat-academic) 6%, var(--surface))" }
    : {};
  const change = (k, v) => { set(k, v); if (conf[k]) clearConf(k); };
  const focusRing = (e) => { if (!e.target.dataset.low) { e.target.style.borderColor = "var(--cat-tech)"; e.target.style.boxShadow = "0 0 0 3px var(--ring)"; } };
  const blurRing = (e) => { e.target.style.boxShadow = ""; e.target.style.borderColor = conf[e.target.name] ? "color-mix(in srgb, var(--cat-academic) 55%, var(--border))" : "var(--border-strong)"; };

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r-xl)", background: "var(--surface)",
      boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
      <div style={{ padding: "18px 22px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            {isAI ? "Review the details" : "Event details"}
          </h3>
          {isAI && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700,
              color: "var(--cat-cultural)" }}>
              <Icon name="sparkles" size={13} /> auto-filled
            </span>
          )}
        </div>
      </div>

      {isAI && lowCount > 0 && (
        <div style={{ margin: "16px 22px 0", padding: "12px 14px", borderRadius: "var(--r-md)",
          display: "flex", gap: 11, alignItems: "flex-start",
          background: "color-mix(in srgb, var(--cat-academic) 13%, var(--surface))",
          border: "1px solid color-mix(in srgb, var(--cat-academic) 34%, var(--border))" }}>
          <Icon name="sparkles" size={17} style={{ color: "color-mix(in srgb, var(--cat-academic), var(--text) 14%)", marginTop: 1 }} />
          <div style={{ fontSize: 13, lineHeight: 1.5, color: "color-mix(in srgb, var(--cat-academic), var(--text) 30%)" }}>
            <b>Double-check {lowCount} field{lowCount > 1 ? "s" : ""}.</b> We weren't fully sure about the highlighted ones — give them a quick look before publishing.
          </div>
        </div>
      )}

      <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Event title">
          <input name="title" value={form.title} onChange={(e) => change("title", e.target.value)}
            placeholder="What's the event called?" style={inp} onFocus={focusRing} onBlur={blurRing} />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Date" low={conf.date}>
            <input name="date" data-low={conf.date ? "1" : ""} type="date" value={form.date}
              onChange={(e) => change("date", e.target.value)} style={{ ...inp, ...ringLow("date") }}
              onFocus={focusRing} onBlur={blurRing} />
          </Field>
          <Field label="Category" low={conf.cat}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {CATEGORIES.map((c) => (
                <Chip key={c.key} cat={c.key} size="sm" active={form.cat === c.key}
                  onClick={() => change("cat", c.key)}>{c.label}</Chip>
              ))}
            </div>
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Starts" low={conf.start}>
            <input name="start" type="time" value={form.start} onChange={(e) => change("start", e.target.value)}
              style={inp} onFocus={focusRing} onBlur={blurRing} />
          </Field>
          <Field label="Ends" low={conf.end}>
            <input name="end" type="time" value={form.end} onChange={(e) => change("end", e.target.value)}
              style={inp} onFocus={focusRing} onBlur={blurRing} />
          </Field>
        </div>

        <Field label="Venue" low={conf.venue}>
          <input name="venue" data-low={conf.venue ? "1" : ""} value={form.venue}
            onChange={(e) => change("venue", e.target.value)} placeholder="Where's it happening?"
            style={{ ...inp, ...ringLow("venue") }} onFocus={focusRing} onBlur={blurRing} />
        </Field>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <div>
            <label style={lbl}>Pricing</label>
            <SegmentedControl value={form.free ? "free" : "paid"} size="sm"
              onChange={(v) => change("free", v === "free")}
              options={[{ value: "free", label: "Free" }, { value: "paid", label: "Paid" }]} />
          </div>
          {!form.free && (
            <div style={{ flex: 1, minWidth: 140 }}>
              <Field label="Price" low={conf.price}>
                <input name="price" data-low={conf.price ? "1" : ""} value={form.price}
                  onChange={(e) => change("price", e.target.value)} placeholder="₹—"
                  style={{ ...inp, ...ringLow("price") }} onFocus={focusRing} onBlur={blurRing} />
              </Field>
            </div>
          )}
        </div>

        <Field label="Description">
          <textarea name="desc" value={form.desc} onChange={(e) => change("desc", e.target.value)}
            rows={4} placeholder="Tell students what to expect…"
            style={{ ...inp, resize: "vertical", lineHeight: 1.55 }} onFocus={focusRing} onBlur={blurRing} />
        </Field>
      </div>

      <div style={{ padding: "16px 22px", borderTop: "1px solid var(--border)", display: "flex",
        justifyContent: "space-between", alignItems: "center", gap: 12, background: "var(--surface-2)" }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>Posts as <b style={{ color: "var(--text-2)" }}>Community</b></span>
          <Button variant="primary" icon="check" onClick={onPublish}
            disabled={!form.title || !form.date}>Publish event</Button>
        </div>
      </div>
    </div>
  );
}

function SuccessCard({ form, onPublish }) {
  const cat = form.cat || "cultural";
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r-xl)", background: "var(--surface)",
      boxShadow: "var(--shadow-md)", padding: "40px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "relative", width: 76, height: 76, margin: "0 auto 20px" }}>
        <span style={{ position: "absolute", inset: 0, borderRadius: 99, background: "var(--cat-sports)", opacity: 0.18,
          animation: "cp-pulse-ring 1.8s ease-out infinite" }} />
        <span style={{ position: "absolute", inset: 0, borderRadius: 99, display: "grid", placeItems: "center",
          background: "var(--cat-sports)", color: "#fff" }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l4.5 4.5L19 7" strokeDasharray="24" style={{ animation: "cp-check .5s .15s ease forwards", strokeDashoffset: 24 }} />
          </svg>
        </span>
      </div>
      <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>You're on the calendar! 🎉</h2>
      <p style={{ margin: "0 auto 22px", fontSize: 14.5, color: "var(--text-2)", maxWidth: 380, lineHeight: 1.55 }}>
        <b style={{ color: "var(--text)" }}>{form.title || "Your event"}</b> is now live for the whole campus to discover, RSVP, and star.
      </p>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 16px", marginBottom: 26,
        borderRadius: "var(--r-md)", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
        <CategoryBadge cat={cat} size="sm" />
        <span style={{ fontSize: 13, color: "var(--text-2)" }}>
          {form.date ? longDate(parseDate(form.date)) : "Date TBC"}{form.start ? ` · ${fmtTime(form.start)}` : ""}
        </span>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Button variant="primary" icon="calendar" onClick={() => onPublish && onPublish("goto")}>View on calendar</Button>
        <Button variant="secondary" icon="plus" onClick={() => location.reload()}>Submit another</Button>
      </div>
    </div>
  );
}

Object.assign(window, { ReviewForm, SuccessCard, Field, lbl, inp });
