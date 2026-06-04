"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/data';
import { parseDate, longDate, fmtTime } from '@/lib/utils';
import { Icon, Button, Tabs, SegmentedControl, Chip, CategoryBadge, PosterPlaceholder } from '@/components/ui/core';

const EXTRACT_STEPS = [
  { icon: "image", label: "Reading the poster" },
  { icon: "sparkles", label: "Pulling out title & description" },
  { icon: "calendar", label: "Finding date & time" },
  { icon: "pin", label: "Detecting venue & category" },
];

const SAMPLE_EXTRACTION = {
  title: { v: "Crescendo — Inter-Hostel Music Night", c: "high" },
  date: { v: "2026-09-27", c: "low" },
  start: { v: "19:00", c: "high" },
  end: { v: "22:30", c: "high" },
  venue: { v: "Dr. Bhupen Hazarika Auditorium", c: "low" },
  cat: { v: "cultural", c: "high" },
  free: { v: false, c: "high" },
  price: { v: "₹120", c: "low" },
  desc: { v: "A night of live sets as hostels battle it out across genres — acoustic, rock, indie and fusion. Open to all; doors at 6:30 PM. Outside food not allowed.", c: "high" },
};

function blankForm() {
  return { title: "", date: "", start: "", end: "", venue: "", cat: "", free: true, price: "", desc: "" };
}

export function SubmitScreen() {
  const router = useRouter();
  const [tab, setTab] = useState("upload");
  const [phase, setPhase] = useState("idle"); // idle | extracting | review | done
  const [stepIdx, setStepIdx] = useState(0);
  const [form, setForm] = useState<any>(blankForm());
  const [conf, setConf] = useState<any>({}); // field -> 'low'
  const [poster, setPoster] = useState<any>(null); // {url} or null (sample)
  const [link, setLink] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const clearConf = (k: string) => setConf((c: any) => { const n = { ...c }; delete n[k]; return n; });

  const runExtraction = () => {
    setPhase("extracting"); setStepIdx(0);
    let i = 0;
    const t = setInterval(() => {
      i++; setStepIdx(i);
      if (i >= EXTRACT_STEPS.length) {
        clearInterval(t);
        setTimeout(() => {
          const f: any = {}, c: any = {};
          Object.entries(SAMPLE_EXTRACTION).forEach(([k, o]) => { f[k] = o.v; if (o.c === "low") c[k] = true; });
          setForm(f); setConf(c); setPhase("review");
        }, 480);
      }
    }, 780);
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPoster({ url }); runExtraction();
  };
  const useSample = () => { setPoster(null); runExtraction(); };
  const startManual = () => { setForm(blankForm()); setConf({}); setPhase("review"); };

  const switchTab = (t: string) => {
    setTab(t); setPhase("idle"); setForm(blankForm()); setConf({}); setPoster(null); setLink("");
    if (t === "manual") startManual();
  };

  const handlePublish = async () => {
    const { supabase } = await import('@/lib/supabase');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      alert("You must be signed in to post an event.");
      router.push('/login');
      return;
    }

    const newId = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).slice(2, 6);
    
    const { error } = await supabase.from('events').insert({
      id: newId,
      title: form.title,
      cat: form.cat || 'social',
      source: 'community',
      free: form.free,
      date: form.date,
      start: form.start,
      end: form.end,
      venue: form.venue,
      description: form.desc,
      price: form.price,
      going: 0,
      interested: 0,
      stars: 0,
    });

    if (error) {
      console.error(error);
      alert("Failed to submit event: " + error.message);
    } else {
      setPhase("done");
    }
  };

  const lowCount = Object.keys(conf).length;

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "8px 4px 40px" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ margin: "0 0 6px", fontSize: 30, fontWeight: 700 }}>Submit an event</h1>
        <p style={{ margin: 0, fontSize: 15, color: "var(--text-2)" }}>
          Drop a poster and let CampusPulse fill in the details — or add them yourself.
        </p>
      </div>

      <div style={{ maxWidth: 460, marginBottom: 22 }}>
        <Tabs value={tab} onChange={switchTab} tabs={[
          { value: "link", label: "Paste link", icon: "link" },
          { value: "upload", label: "Upload poster", icon: "upload" },
          { value: "manual", label: "Manual", icon: "edit" },
        ]} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: phase === "review" || phase === "done" ? "repeat(auto-fit, minmax(320px, 1fr))" : "1fr", gap: 24, alignItems: "start" }}>
        {(tab !== "manual") && (
          <div style={{ position: "sticky", top: 76 }}>
            <InputPane tab={tab} phase={phase} stepIdx={stepIdx} poster={poster}
              link={link} setLink={setLink} fileRef={fileRef} onFile={onFile}
              useSample={useSample} runExtraction={runExtraction} />
          </div>
        )}

        {(phase === "review" || phase === "done") && (
          <div style={{ animation: "cp-fade-up .35s ease" }}>
            {phase === "done" ? (
              <SuccessCard form={form} onPublish={(arg: string) => arg === "goto" ? router.push('/') : null} />
            ) : (
              <ReviewForm form={form} set={set} conf={conf} clearConf={clearConf} lowCount={lowCount}
                isAI={tab !== "manual"} onPublish={handlePublish} onCancel={() => router.push('/')} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InputPane({ tab, phase, stepIdx, poster, link, setLink, fileRef, onFile, useSample, runExtraction }: any) {
  const showPoster = poster || phase !== "idle";
  const lbl = { display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--text-2)", marginBottom: 7 };
  const inp = {
    width: "100%", padding: "11px 13px", fontSize: 14.5, color: "var(--text)",
    background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)",
    outline: "none", transition: "border-color .15s, box-shadow .15s", fontFamily: "var(--font-sans)",
  };

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r-xl)", background: "var(--surface)", padding: 16, boxShadow: "var(--shadow-sm)" }}>
      {tab === "link" && phase === "idle" && (
        <div>
          <label style={lbl}>Event link</label>
          <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="instagram.com/p/…  ·  unstop.com/…" style={inp} />
          <p style={{ fontSize: 12.5, color: "var(--text-3)", margin: "10px 2px 14px", lineHeight: 1.5 }}>
            Paste an Instagram post, club page, or registration link. We'll read it and fill the form.
          </p>
          <Button variant="accent" full icon="sparkles" style={{ "--c": "var(--cat-cultural)" }} onClick={runExtraction} disabled={!link.trim()}>Fetch details</Button>
        </div>
      )}

      {tab === "upload" && phase === "idle" && (
        <div>
          <button onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--cat-tech)"; }}
            onDragLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
            onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }}
            style={{ width: "100%", padding: "38px 18px", borderRadius: "var(--r-lg)", cursor: "pointer",
              border: "2px dashed var(--border-strong)", background: "var(--surface-2)", transition: "border-color .15s",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
            <span style={{ width: 52, height: 52, borderRadius: "var(--r-lg)", display: "inline-flex",
              alignItems: "center", justifyContent: "center", color: "#fff",
              background: "linear-gradient(150deg, var(--cat-tech), var(--cat-cultural))" }}>
              <Icon name="upload" size={24} /></span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Drop a poster here</div>
              <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 3 }}>PNG, JPG or PDF · or click to browse</div>
            </div>
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 12, color: "var(--text-3)" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>
          <Button variant="soft" full icon="sparkles" onClick={useSample}>Try a sample poster</Button>
        </div>
      )}

      {showPoster && (
        <div style={{ position: "relative", borderRadius: "var(--r-lg)", overflow: "hidden", border: "1px solid var(--border)" }}>
          {poster ? (
            <img src={poster.url} alt="poster" style={{ width: "100%", display: "block", maxHeight: 460, objectFit: "cover" }} />
          ) : (
            <PosterPlaceholder cat="cultural" label="music night poster" ratio="4 / 5" radius="0" style={{ border: "none" }} />
          )}

          {phase === "extracting" && <ExtractionOverlay />}

          {phase === "review" && (
            <div style={{ position: "absolute", top: 10, left: 10, display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 11px", borderRadius: 99, fontSize: 12, fontWeight: 700, color: "#fff",
              background: "color-mix(in srgb, var(--cat-sports) 92%, black)", boxShadow: "var(--shadow-md)" }}>
              <Icon name="check" size={13} stroke={3} /> Extracted
            </div>
          )}
        </div>
      )}

      {phase === "extracting" && <StepList stepIdx={stepIdx} />}
    </div>
  );
}

function ExtractionOverlay() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "color-mix(in srgb, var(--cat-cultural) 22%, rgba(5,7,13,.55))", backdropFilter: "blur(1px)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, height: 64, background: "linear-gradient(180deg, transparent, color-mix(in srgb, var(--cat-tech) 80%, transparent), transparent)", animation: "cp-scan 1.7s ease-in-out infinite" }} />
      <style>{`@keyframes cp-scan { 0%{top:-64px} 100%{top:100%} }`}</style>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "#fff" }}>
          <span style={{ position: "relative", width: 46, height: 46 }}>
            <span style={{ position: "absolute", inset: 0, borderRadius: 99, border: "2px solid rgba(255,255,255,.5)", borderTopColor: "#fff", animation: "cp-spin .8s linear infinite" }} />
            <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}><Icon name="sparkles" size={20} /></span>
          </span>
          <span className="font-mono" style={{ fontSize: 12, letterSpacing: "0.04em" }}>reading poster…</span>
        </div>
      </div>
    </div>
  );
}

function StepList({ stepIdx }: { stepIdx: number }) {
  return (
    <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 9 }}>
      {EXTRACT_STEPS.map((s, i) => {
        const done = i < stepIdx, active = i === stepIdx;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600, opacity: done || active ? 1 : 0.4, transition: "opacity .3s" }}>
            <span style={{ width: 24, height: 24, borderRadius: 99, flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", background: done ? "var(--cat-sports)" : active ? "var(--cat-cultural)" : "var(--surface-3)", color: done || active ? "#fff" : "var(--text-3)" }}>
              {done ? <Icon name="check" size={13} stroke={3} /> : active ? <span style={{ width: 8, height: 8, borderRadius: 99, background: "#fff", animation: "cp-fade .6s ease-in-out infinite alternate" }} /> : <Icon name={s.icon} size={12} />}
            </span>
            <span style={{ color: done ? "var(--text-2)" : "var(--text)" }}>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, low, children }: any) {
  return (
    <div className={low ? "cp-low" : ""} style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-2)" }}>{label}</span>
        {low && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "color-mix(in srgb, var(--cat-academic), var(--text) 22%)", background: "color-mix(in srgb, var(--cat-academic) 16%, var(--surface))", border: "1px solid color-mix(in srgb, var(--cat-academic) 36%, var(--border))", padding: "1px 7px", borderRadius: 99 }}>
            <Icon name="sparkles" size={10} /> double-check
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function ReviewForm({ form, set, conf, clearConf, lowCount, isAI, onPublish, onCancel }: any) {
  const lbl = { display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--text-2)", marginBottom: 7 };
  const inp = { width: "100%", padding: "11px 13px", fontSize: 14.5, color: "var(--text)", background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)", outline: "none", transition: "border-color .15s, box-shadow .15s", fontFamily: "var(--font-sans)" };

  const ringLow = (k: string) => conf[k] ? { borderColor: "color-mix(in srgb, var(--cat-academic) 55%, var(--border))", boxShadow: "0 0 0 3px color-mix(in srgb, var(--cat-academic) 16%, transparent)", background: "color-mix(in srgb, var(--cat-academic) 6%, var(--surface))" } : {};
  const change = (k: string, v: any) => { set(k, v); if (conf[k]) clearConf(k); };
  const focusRing = (e: any) => { if (!e.target.dataset.low) { e.target.style.borderColor = "var(--cat-tech)"; e.target.style.boxShadow = "0 0 0 3px var(--ring)"; } };
  const blurRing = (e: any) => { e.target.style.boxShadow = ""; e.target.style.borderColor = conf[e.target.name] ? "color-mix(in srgb, var(--cat-academic) 55%, var(--border))" : "var(--border-strong)"; };

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r-xl)", background: "var(--surface)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
      <div style={{ padding: "18px 22px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{isAI ? "Review the details" : "Event details"}</h3>
          {isAI && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: "var(--cat-cultural)" }}><Icon name="sparkles" size={13} /> auto-filled</span>}
        </div>
      </div>

      {isAI && lowCount > 0 && (
        <div style={{ margin: "16px 22px 0", padding: "12px 14px", borderRadius: "var(--r-md)", display: "flex", gap: 11, alignItems: "flex-start", background: "color-mix(in srgb, var(--cat-academic) 13%, var(--surface))", border: "1px solid color-mix(in srgb, var(--cat-academic) 34%, var(--border))" }}>
          <Icon name="sparkles" size={17} style={{ color: "color-mix(in srgb, var(--cat-academic), var(--text) 14%)", marginTop: 1 }} />
          <div style={{ fontSize: 13, lineHeight: 1.5, color: "color-mix(in srgb, var(--cat-academic), var(--text) 30%)" }}>
            <b>Double-check {lowCount} field{lowCount > 1 ? "s" : ""}.</b> We weren't fully sure about the highlighted ones — give them a quick look before publishing.
          </div>
        </div>
      )}

      <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Event title">
          <input name="title" value={form.title} onChange={(e) => change("title", e.target.value)} placeholder="What's the event called?" style={inp} onFocus={focusRing} onBlur={blurRing} />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Date" low={conf.date}>
            <input name="date" data-low={conf.date ? "1" : ""} type="date" value={form.date} onChange={(e) => change("date", e.target.value)} style={{ ...inp, ...ringLow("date") }} onFocus={focusRing} onBlur={blurRing} />
          </Field>
          <Field label="Category" low={conf.cat}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {CATEGORIES.map((c) => (
                <Chip key={c.key} cat={c.key} size="sm" active={form.cat === c.key} onClick={() => change("cat", c.key)}>{c.label}</Chip>
              ))}
            </div>
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Starts" low={conf.start}>
            <input name="start" type="time" value={form.start} onChange={(e) => change("start", e.target.value)} style={inp} onFocus={focusRing} onBlur={blurRing} />
          </Field>
          <Field label="Ends" low={conf.end}>
            <input name="end" type="time" value={form.end} onChange={(e) => change("end", e.target.value)} style={inp} onFocus={focusRing} onBlur={blurRing} />
          </Field>
        </div>

        <Field label="Venue" low={conf.venue}>
          <input name="venue" data-low={conf.venue ? "1" : ""} value={form.venue} onChange={(e) => change("venue", e.target.value)} placeholder="Where's it happening?" style={{ ...inp, ...ringLow("venue") }} onFocus={focusRing} onBlur={blurRing} />
        </Field>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <div>
            <label style={lbl}>Pricing</label>
            <SegmentedControl value={form.free ? "free" : "paid"} size="sm" onChange={(v: string) => change("free", v === "free")} options={[{ value: "free", label: "Free" }, { value: "paid", label: "Paid" }]} />
          </div>
          {!form.free && (
            <div style={{ flex: 1, minWidth: 140 }}>
              <Field label="Price" low={conf.price}>
                <input name="price" data-low={conf.price ? "1" : ""} value={form.price} onChange={(e) => change("price", e.target.value)} placeholder="₹—" style={{ ...inp, ...ringLow("price") }} onFocus={focusRing} onBlur={blurRing} />
              </Field>
            </div>
          )}
        </div>

        <Field label="Description">
          <textarea name="desc" value={form.desc} onChange={(e) => change("desc", e.target.value)} rows={4} placeholder="Tell students what to expect…" style={{ ...inp, resize: "vertical", lineHeight: 1.55 }} onFocus={focusRing} onBlur={blurRing} />
        </Field>
      </div>

      <div style={{ padding: "16px 22px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, background: "var(--surface-2)" }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>Posts as <b style={{ color: "var(--text-2)" }}>Community</b></span>
          <Button variant="primary" icon="check" onClick={onPublish} disabled={!form.title || !form.date}>Publish event</Button>
        </div>
      </div>
    </div>
  );
}

function SuccessCard({ form, onPublish }: any) {
  const cat = form.cat || "cultural";
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r-xl)", background: "var(--surface)", boxShadow: "var(--shadow-md)", padding: "40px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "relative", width: 76, height: 76, margin: "0 auto 20px" }}>
        <span style={{ position: "absolute", inset: 0, borderRadius: 99, background: "var(--cat-sports)", opacity: 0.18, animation: "cp-pulse-ring 1.8s ease-out infinite" }} />
        <span style={{ position: "absolute", inset: 0, borderRadius: 99, display: "grid", placeItems: "center", background: "var(--cat-sports)", color: "#fff" }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l4.5 4.5L19 7" strokeDasharray="24" style={{ animation: "cp-check .5s .15s ease forwards", strokeDashoffset: 24 }} />
          </svg>
        </span>
      </div>
      <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>You're on the calendar! 🎉</h2>
      <p style={{ margin: "0 auto 22px", fontSize: 14.5, color: "var(--text-2)", maxWidth: 380, lineHeight: 1.55 }}>
        <b style={{ color: "var(--text)" }}>{form.title || "Your event"}</b> is now live for the whole campus to discover, RSVP, and star.
      </p>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 16px", marginBottom: 26, borderRadius: "var(--r-md)", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
        <CategoryBadge cat={cat} size="sm" />
        <span style={{ fontSize: 13, color: "var(--text-2)" }}>
          {form.date ? longDate(parseDate(form.date)) : "Date TBC"}{form.start ? ` · ${fmtTime(form.start)}` : ""}
        </span>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Button variant="primary" icon="calendar" onClick={() => onPublish && onPublish("goto")}>View on calendar</Button>
        <Button variant="secondary" icon="plus" onClick={() => window.location.reload()}>Submit another</Button>
      </div>
    </div>
  );
}
