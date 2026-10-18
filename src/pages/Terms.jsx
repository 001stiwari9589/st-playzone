import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, ShieldAlert, Award, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Terms() {
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
          background: 'rgba(139, 92, 246, 0.15)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          color: '#C084FC',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          <FileText size={14} /> User Agreement
        </div>
        <h1 style={{ fontSize: '2.6rem', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
          Terms & <span className="text-gradient">Conditions</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Last updated: <strong>{lastUpdated}</strong> • Rules governing your use of ST PlayZone
        </p>
      </div>

      {/* Terms Body */}
      <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section>
          <h2 style={{ fontSize: '1.35rem', color: '#FFF', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="var(--accent-purple)" />
            1. Acceptance of Terms
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            By accessing or playing games on <strong>ST PlayZone</strong> (created by <strong>Satyam Tiwari</strong>), you agree to be bound by these Terms and Conditions. ST PlayZone provides free, casual browser-based arcade entertainment and educational quizzes for personal, recreational use.
          </p>
        </section>

        <section style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '14px',
          padding: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.3rem', color: '#FBBF24', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} color="#FBBF24" />
            2. Strict Virtual-Points Policy (Zero Monetary Value)
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
            Throughout ST PlayZone, players can accumulate "ST Points", level rankings, and unlock virtual achievement badges. <strong>Under no circumstances do virtual points possess monetary, cash, or cryptocurrency value:</strong>
          </p>
          <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.92rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li>Virtual points cannot be redeemed, sold, traded, or converted into real currency, gift vouchers, or prizes.</li>
            <li>There are no deposits, no withdrawals, no gambling, and no real-money wagering.</li>
            <li>There are no paid-entry tournaments or fee-based competitions.</li>
            <li>Points are purely client-side motivational tokens celebrating personal milestones.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.35rem', color: '#FFF', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="var(--accent-cyan)" />
            3. Permitted Use & Fair Play
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            You may play and interact with the platform for personal entertainment and educational self-testing. You agree not to exploit software glitches, attempt to inject malicious code into client bundles, or disrupt other users' experience.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.35rem', color: '#FFF', marginBottom: '0.75rem' }}>
            4. Intellectual Property & Branding
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            The brand name "ST PlayZone", tagline "Play. Challenge. Level Up.", logos, graphics, and custom source code are created by Satyam Tiwari. All visual styles, logos, and custom code are protected by intellectual property conventions.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.35rem', color: '#FFF', marginBottom: '0.75rem' }}>
            5. Disclaimer of Warranties
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            ST PlayZone is provided on an "as-is" and "as-available" basis. While we strive to ensure high performance and bug-free gameplay across modern web browsers, we make no guarantees that the website will be uninterrupted or error-free at all times.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.35rem', color: '#FFF', marginBottom: '0.75rem' }}>
            6. Modifications
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            We reserve the right to modify these terms and enhance platform features as development progresses into future phases. Continued use of the platform constitutes agreement with any updated terms.
          </p>
        </section>
      </div>
    </div>
  );
}
