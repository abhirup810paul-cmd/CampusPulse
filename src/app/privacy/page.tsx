import React from 'react';

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px 80px", lineHeight: 1.6, color: "var(--text-2)" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--text)", marginBottom: 32 }}>Privacy Policy</h1>
      
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", marginTop: 40, marginBottom: 16 }}>1. Information We Collect</h2>
      <p>When you use CampusPulse, we collect:</p>
      <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
        <li><strong>Account Information:</strong> Your institutional email address (@iitg.ac.in) for authentication.</li>
        <li><strong>Interaction Data:</strong> Events you RSVP to, star, or submit to the platform.</li>
      </ul>

      <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", marginTop: 40, marginBottom: 16 }}>2. How We Use Your Information</h2>
      <p>We use your information solely to:</p>
      <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
        <li>Verify your identity as an active student/member of the institution.</li>
        <li>Provide core functionality (saving your starred events and RSVPs).</li>
        <li>Prevent spam and abuse on the platform.</li>
      </ul>

      <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", marginTop: 40, marginBottom: 16 }}>3. Data Sharing</h2>
      <p>We do <strong>not</strong> sell, rent, or share your personal information with third parties. Your data is stored securely using Supabase and is only accessible by the core CampusPulse administrative team for moderation purposes.</p>

      <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", marginTop: 40, marginBottom: 16 }}>4. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact the CampusPulse team at Campus.Pulse@iitg.ac.in.</p>
    </div>
  );
}
