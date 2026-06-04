"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/data';
import { Icon, Button, Logo } from '@/components/ui/core';

export default function LoginScreen() {
  const router = useRouter();

  const handleGithubLogin = async () => {
    const { supabase } = await import('@/lib/supabase');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      alert(error.message);
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
            Use your GitHub account to instantly log in.
          </p>
          
          <button onClick={handleGithubLogin} style={{
            width: "100%", padding: "12px", borderRadius: "var(--r-md)", border: "1px solid var(--border-strong)",
            background: "var(--surface)", color: "var(--text)", fontSize: 15, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer",
            boxShadow: "var(--shadow-sm)", transition: "all .15s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--surface)"}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            Sign in with GitHub
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
