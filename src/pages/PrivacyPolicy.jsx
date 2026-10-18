import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Lock, HardDrive, EyeOff, Sparkles } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = 'October 17, 2026';

  return (
    <div className="container" style={{ padding: '3rem 1rem 5rem 1rem', maxWidth: '880px' }}>
      {/* Back link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/" className="btn-outline" style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(34, 211, 238, 0.15)',
          border: '1px solid rgba(34, 211, 238, 0.3)',
          color: 'var(--accent-cyan)',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          <Shield size={14} /> Legal & Compliance
        </div>
        <h1 style={{ fontSize: '2.6rem', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
          Privacy <span className="text-gradient">Policy</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Last updated: <strong>{lastUpdated}</strong> • Effective for ST PlayZone MVP
        </p>
      </div>

      {/* Policy Card */}
      <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section>
          <h2 style={{ fontSize: '1.35rem', color: '#FFF', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--accent-purple)" />
            1. Overview & Commitment
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Welcome to <strong>ST PlayZone</strong>, an independent casual browser gaming and quiz platform created by <strong>Satyam Tiwari</strong>. We respect your privacy and are committed to maintaining a transparent, non-intrusive gaming environment. This Privacy Policy explains what data is stored and how your privacy is handled while visiting our platform.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.35rem', color: '#FFF', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HardDrive size={18} color="var(--accent-cyan)" />
            2. Local Storage Usage (Client-Side Only)
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
            In the current frontend MVP version of ST PlayZone, <strong>we do not operate remote user databases or transmit your gameplay data to external servers</strong>. All interactive game preferences and progress are saved solely on your local device via your web browser's standard <code>localStorage</code> API. This includes:
          </p>
          <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.92rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Your chosen player display name, chosen avatar emoji, and custom tagline.</li>
            <li>Virtual ST points balance and unlocked achievement badges.</li>
            <li>Individual game records (such as high score in Snake, Tic-Tac-Toe wins, and best memory match moves).</li>
            <li>Audio sound preferences (sound on or off toggle).</li>
          </ul>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', marginTop: '0.75rem' }}>
            You may reset or permanently remove this local progress at any time simply by clearing your browser cache and site data for this domain.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.35rem', color: '#FFF', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <EyeOff size={18} color="var(--success)" />
            3. No Tracking Cookies & No Server-Side Logging
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            ST PlayZone currently operates without third-party tracking cookies, analytics trackers, fingerprinting scripts, or advertising identifiers. We do not sell, rent, or monetize personal information. No registration or sensitive credentials (such as passwords or payment details) are ever requested or stored.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.35rem', color: '#FFF', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} color="var(--accent-purple)" />
            4. Contact Inquiries & Feedback Handling
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Our Contact page is provided as a demonstration interface in this phase. Inputs entered into the form are validated client-side to test user experience. Because live backend mail servers and remote storage are not yet connected, your messages are not permanently archived on external databases or sent across third-party marketing networks.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.35rem', color: '#FFF', marginBottom: '0.75rem' }}>
            5. Future Architecture & Policy Updates
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            If and when server-side authentication, online cloud synchronization, or privacy-compliant advertising services are integrated in future development phases, this policy will be comprehensively updated beforehand with full disclosures of data practices, security safeguards, and opt-out controls.
          </p>
        </section>
      </div>
    </div>
  );
}
