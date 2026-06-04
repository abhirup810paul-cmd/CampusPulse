import React from 'react';

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px 80px", lineHeight: 1.6, color: "var(--text-2)" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--text)", marginBottom: 32 }}>Terms of Service</h1>
      
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", marginTop: 40, marginBottom: 16 }}>1. Acceptance of Terms</h2>
      <p>By accessing and using CampusPulse, you accept and agree to be bound by the terms and provision of this agreement. This platform is exclusively for students and staff of IIT Guwahati.</p>

      <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", marginTop: 40, marginBottom: 16 }}>2. User Content</h2>
      <p>Users may submit events to the platform. By submitting an event, you guarantee that:</p>
      <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
        <li>The event is real and relevant to the campus community.</li>
        <li>You have the right to share the poster and information provided.</li>
        <li>The content does not violate any university policies or guidelines.</li>
      </ul>
      <p>The administrators reserve the right to remove any content that violates these rules or is deemed inappropriate without prior notice.</p>

      <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", marginTop: 40, marginBottom: 16 }}>3. Automated Parsing</h2>
      <p>CampusPulse uses artificial intelligence to parse details from uploaded event posters. While we strive for accuracy, we do not guarantee the correctness of the extracted data. Users are responsible for verifying the event details before attending.</p>

      <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", marginTop: 40, marginBottom: 16 }}>4. Limitation of Liability</h2>
      <p>CampusPulse is provided "as is" without any warranties. The developers of CampusPulse shall not be held liable for any missed events, incorrect information, or damages arising from the use of this platform.</p>
    </div>
  );
}
