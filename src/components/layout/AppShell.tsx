"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Logo, Icon, Avatar } from '@/components/ui/core';

const NAV = [
  { key: "/", label: "Calendar", icon: "calendar" },
  { key: "/community", label: "Community", icon: "compass" },
  { key: "/submit", label: "Submit", icon: "plus" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setThemeState] = useState('light');
  const [menu, setMenu] = useState(false);
  const [w, setW] = useState(1000);

  useEffect(() => {
    setW(window.innerWidth);
    const on = () => setW(window.innerWidth);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const isMobile = w < 860;
  const isLogin = pathname === '/login';

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "color-mix(in srgb, var(--surface) 86%, transparent)",
        backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)"
      }}>
        <div style={{
          maxWidth: 1320, margin: "0 auto", padding: isMobile ? "10px 16px" : "12px 28px",
          display: "flex", alignItems: "center", gap: 16
        }}>
          <button onClick={() => router.push('/')} style={{ border: "none", background: "none", padding: 0 }}>
            <Logo size={isMobile ? 26 : 28} showText={!isMobile} />
          </button>

          <div style={{ flex: 1, maxWidth: 460, position: "relative", marginLeft: isMobile ? "auto" : 6 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }}>
              <Icon name="search" size={17} />
            </span>
            <input placeholder={isMobile ? "Search" : "Search events, venues, clubs…"}
              onFocus={(e) => { e.target.style.borderColor = "var(--cat-tech)"; e.target.style.boxShadow = "0 0 0 3px var(--ring)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = ""; }}
              style={{
                width: "100%", padding: "9px 12px 9px 38px", fontSize: 14, color: "var(--text)",
                background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--r-pill)",
                outline: "none", transition: "all .15s"
              }} />
          </div>

          {!isMobile && (
            <nav style={{ display: "flex", gap: 4 }}>
              {NAV.map((n) => {
                const on = pathname === n.key;
                return (
                  <button key={n.key} onClick={() => router.push(n.key)} style={{
                    display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: "var(--r-md)",
                    fontSize: 14, fontWeight: 600, border: "none", transition: "all .14s",
                    background: on ? "var(--surface-2)" : "transparent", color: on ? "var(--text)" : "var(--text-2)"
                  }}>
                    <Icon name={n.icon} size={16} />{n.label}
                  </button>
                );
              })}
            </nav>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setThemeState(theme === "dark" ? "light" : "dark")} style={{
              width: 32, height: 32, borderRadius: "var(--r-md)", display: "inline-flex",
              alignItems: "center", justifyContent: "center", border: "1px solid var(--border)",
              background: "var(--surface)", color: "var(--text-2)"
            }} aria-label="Toggle theme">
              <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
            </button>
            <div style={{ position: "relative" }}>
              <button onClick={() => setMenu((m) => !m)} style={{ border: "none", background: "none", padding: 0, borderRadius: 99 }}>
                <Avatar person={{ name: 'You Student', initials: 'YS', hue: 200 }} size={34} ring="var(--surface)" />
              </button>
              {menu && (
                <React.Fragment>
                  <div onClick={() => setMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 50 }} />
                  <div style={{
                    position: "absolute", right: 0, top: 44, width: 200, zIndex: 51, padding: 6,
                    background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)",
                    boxShadow: "var(--shadow-lg)", animation: "cp-pop .16s ease"
                  }}>
                    <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700 }}>You Student</div>
                      <div style={{ fontSize: 12, color: "var(--text-3)" }}>you@iitg.ac.in</div>
                    </div>
                    <MenuItem icon="moon" label="Toggle theme" onClick={() => { setThemeState(theme === "dark" ? "light" : "dark"); setMenu(false); }} />
                    <MenuItem icon="arrowR" label="Sign out" onClick={() => { setMenu(false); router.push('/login'); }} />
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </header>

      <main style={{
        flex: 1, maxWidth: 1320, width: "100%", margin: "0 auto",
        padding: isMobile ? "18px 16px 24px" : "26px 28px 40px"
      }}>
        {children}
      </main>

      {isMobile && (
        <nav style={{
          position: "sticky", bottom: 0, zIndex: 40, display: "flex",
          background: "color-mix(in srgb, var(--surface) 92%, transparent)", backdropFilter: "blur(12px)",
          borderTop: "1px solid var(--border)", paddingBottom: "env(safe-area-inset-bottom)"
        }}>
          {NAV.map((n) => {
            const on = pathname === n.key;
            return (
              <button key={n.key} onClick={() => router.push(n.key)} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                padding: "9px 0 11px", border: "none", background: "none",
                color: on ? "var(--cat-tech)" : "var(--text-3)"
              }}>
                <Icon name={n.icon} size={20} fill={n.key === "/submit" && on ? "currentColor" : "none"} />
                <span style={{ fontSize: 11, fontWeight: 700 }}>{n.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

function MenuItem({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10, width: "100%",
      padding: "9px 10px", border: "none", background: "none", borderRadius: "var(--r-sm)", fontSize: 13.5,
      fontWeight: 600, color: "var(--text-2)", textAlign: "left"
    }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}>
      <Icon name={icon} size={16} />{label}
    </button>
  );
}
