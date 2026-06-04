"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/data';
import { Icon, Button, Logo } from '@/components/ui/core';

export default function LoginScreen() {
  const router = useRouter();

  const handleMicrosoftLogin = async () => {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email profile',
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) {
      console.error('Error logging in:', error);
      alert('Failed to log in with Microsoft. Check console for details.');
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
          <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700 }}>Sign in</h2>
          <p style={{ margin: "0 0 26px", fontSize: 14.5, color: "var(--text-2)" }}>
            Use your IITG Outlook email to securely log in.
          </p>
          
          <button onClick={handleMicrosoftLogin} style={{
            width: "100%", padding: "12px", borderRadius: "var(--r-md)", border: "1px solid var(--border-strong)",
            background: "var(--surface)", color: "var(--text)", fontSize: 15, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer",
            boxShadow: "var(--shadow-sm)", transition: "all .15s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--surface)"}>
            <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
              <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
            </svg>
            Sign in with Microsoft
          </button>

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
