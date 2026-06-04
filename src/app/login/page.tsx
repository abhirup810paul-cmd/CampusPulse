"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/data';
import { Icon, Button, Logo } from '@/components/ui/core';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    if (!email.endsWith('@iitg.ac.in') && !email.endsWith('@iitg.ernet.in')) {
      alert("Please use your official IITG email address.");
      return;
    }

    setLoading(true);
    const { supabase } = await import('@/lib/supabase');
    
    let error;
    if (isSignUp) {
      const res = await supabase.auth.signUp({ email, password });
      error = res.error;
    } else {
      const res = await supabase.auth.signInWithPassword({ email, password });
      error = res.error;
    }

    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div data-screen-label="Login" style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", minHeight: "100vh" }} className="cp-login">
      {/* brand panel */}
      <div style={{ position: "relative", overflow: "hidden", padding: "48px 52px",
        background: "linear-gradient(155deg, #0b1120 0%, #131a2e 60%, #1a1340 100%)", color: "#fff",
        display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "50vh" }}>
        <div style={{ position: "relative", zIndex: 2, marginBottom: 40 }}>
          <Logo size={30} />
        </div>
        <div style={{ position: "relative", zIndex: 2 }}>
          <h1 className="font-display" style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.08, margin: "0 0 16px", letterSpacing: "-0.03em" }}>
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
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.45)", position: "relative", zIndex: 2, marginTop: 40 }}>
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
        <div style={{ width: "min(380px, 100%)" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700 }}>{isSignUp ? "Create Account" : "Sign in"}</h2>
          <p style={{ margin: "0 0 26px", fontSize: 14.5, color: "var(--text-2)" }}>
            Use your IITG email to securely log in.
          </p>
          
          <form onSubmit={handleEmailLogin}>
            <div style={{ marginBottom: 12 }}>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@iitg.ac.in" 
                style={{
                  width: "100%", padding: "14px 16px", fontSize: 15, color: "var(--text)",
                  background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)",
                  outline: "none", transition: "all .15s", fontFamily: "var(--font-sans)"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--cat-tech)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border-strong)"}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                style={{
                  width: "100%", padding: "14px 16px", fontSize: 15, color: "var(--text)",
                  background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)",
                  outline: "none", transition: "all .15s", fontFamily: "var(--font-sans)"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--cat-tech)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border-strong)"}
              />
            </div>
            <Button variant="primary" full size="lg" disabled={loading} style={{ position: "relative", marginBottom: 12 }}>
              {loading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
            <div style={{ textAlign: "center" }}>
              <button type="button" onClick={() => setIsSignUp(!isSignUp)} style={{ background: "none", border: "none", fontSize: 13, color: "var(--cat-tech)", cursor: "pointer", fontWeight: 600 }}>
                {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
              </button>
            </div>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "22px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 12, color: "var(--text-3)" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>
          
          <Button variant="secondary" full size="lg" onClick={() => router.push('/')}>Browse as guest</Button>
          
          <p style={{ fontSize: 12, color: "var(--text-3)", textAlign: "center", marginTop: 22, lineHeight: 1.5 }}>
            By continuing you agree to the campus community guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
