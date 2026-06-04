"use client";

import React, { useState } from 'react';
import { CATEGORIES, avatars } from '@/lib/data';
import { Button, Chip, CategoryBadge, Badge, SourceTag, AvatarStack, SegmentedControl, Icon } from '@/components/ui/core';

function SG({ title, children }: any) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-3)" }}>{title}</h3>
      {children}
    </section>
  );
}

function card(extra?: any) {
  return { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-sm)", padding: 20, ...extra };
}

export default function StyleguideScreen() {
  const [seg, setSeg] = useState("month");

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
                <div className="font-mono" style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>
                  {({ tech:"#3b82f6", cultural:"#a855f7", sports:"#22c55e", academic:"#f59e0b", social:"#ec4899", personal:"#64748b", merch:"#ef4444", trending:"#fb923c" } as any)[c.key]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SG>

      <SG title="Typography">
        <div style={card()}>
          <div className="font-display" style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-0.03em" }}>What's on this week</div>
          <div style={{ fontSize: 16, color: "var(--text-2)", marginTop: 8, maxWidth: 560, lineHeight: 1.6 }}>
            Body copy in Plus Jakarta Sans keeps long descriptions readable and friendly without feeling corporate.
          </div>
          <div className="font-mono" style={{ fontSize: 13, color: "var(--text-3)", marginTop: 10 }}>7 PM – 10:30 PM · Dr. Bhupen Hazarika Auditorium</div>
        </div>
      </SG>

      <SG title="Buttons">
        <div style={card({ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" })}>
          <Button variant="primary" icon="plus">Primary</Button>
          <Button variant="secondary" icon="calendar">Secondary</Button>
          <Button variant="soft" icon="download">Soft</Button>
          <Button variant="accent" icon="sparkles" style={{ "--c": "var(--cat-cultural)" } as any}>Accent</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </SG>

      <SG title="Chips, badges & avatars">
        <div style={card({ display: "flex", flexDirection: "column", gap: 16 })}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CATEGORIES.map((c) => <Chip key={c.key} cat={c.key} active size="sm" onClick={() => {}}>{c.label}</Chip>)}
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
        </div>
      </SG>
    </div>
  );
}
