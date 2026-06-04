"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Icon, Button, Badge } from '@/components/ui/core';
import { ymd } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Check auth and fetch events
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      loadEvents();
    });
  }, [router]);

  const loadEvents = async () => {
    setLoading(true);
    const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (data) setEvents(data);
    setLoading(false);
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    await supabase.from('events').delete().eq('id', id);
    setEvents(e => e.filter(x => x.id !== id));
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 16px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px" }}>Admin Dashboard</h1>
          <p style={{ color: "var(--text-2)", margin: 0, fontSize: 15 }}>Manage events submitted by the community.</p>
        </div>
        <Button variant="primary" icon="plus" onClick={() => router.push('/submit')}>New Event</Button>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: "center", color: "var(--text-3)" }}>Loading events...</div>
        ) : events.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", color: "var(--text-3)" }}>
            <Icon name="calendar" size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
            <div>No events found in the database.</div>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)", textAlign: "left", color: "var(--text-2)" }}>
                <th style={{ padding: "14px 20px", fontWeight: 600 }}>Event Title</th>
                <th style={{ padding: "14px 20px", fontWeight: 600 }}>Date</th>
                <th style={{ padding: "14px 20px", fontWeight: 600 }}>Category</th>
                <th style={{ padding: "14px 20px", fontWeight: 600 }}>Stats</th>
                <th style={{ padding: "14px 20px", fontWeight: 600, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{ev.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>{ev.venue}</div>
                  </td>
                  <td style={{ padding: "14px 20px", color: "var(--text-2)" }}>
                    <div style={{ fontWeight: 500, color: "var(--text)" }}>{ev.date}</div>
                    <div style={{ fontSize: 12 }}>{ev.start}</div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <Badge tone="default" size="sm">{ev.cat}</Badge>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: 12, color: "var(--text-2)", fontSize: 13 }}>
                      <span title="RSVPs"><Icon name="users" size={14} style={{ marginRight: 4 }} />{ev.going}</span>
                      <span title="Stars"><Icon name="star" size={14} style={{ marginRight: 4 }} />{ev.stars}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", textAlign: "right" }}>
                    <Button variant="soft" size="sm" onClick={() => deleteEvent(ev.id)} style={{ color: "var(--cat-social)" }}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
