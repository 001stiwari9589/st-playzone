import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ShieldCheck, Zap, Brain, Users, Award } from 'lucide-react';

export default function Disclaimer() {
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
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#F87171',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          <AlertCircle size={14} /> Legal Disclaimer
        </div>
        <h1 style={{ fontSize: '2.6rem', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
          Platform <span className="text-gradient">Disclaimer</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Last updated: <strong>{lastUpdated}</strong> • Important disclosures for ST PlayZone visitors
        </p>
      </div>

      {/* Body */}
      <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Virtual Points Disclaimer */}
        <section style={{
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          borderRadius: '14px',
          padding: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.3rem', color: '#DDD6FE', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={20} color="var(--accent-cyan)" />
            1. Virtual Points & In-Game Rewards
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            All points, levels, challenge scores, and achievement badges displayed on ST PlayZone are <strong>purely virtual tokens</strong> created for gamification, personal recreation, and self-motivation. They carry <strong>zero cash, monetary, or trade value</strong>. ST PlayZone does not offer real-money gaming, gambling, betting, cash payouts, deposits, withdrawals, or prize lotteries.
          </p>
        </section>

        {/* Demo Data & Leaderboard Disclaimer */}
        <section>
          <h2 style={{ fontSize: '1.35rem', color: '#FFF', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} color="var(--accent-purple)" />
            2. Demonstration Status & Sample Leaderboard
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            In this frontend MVP phase, the Leaderboard presents simulated community benchmark ranks alongside your local score to illustrate how competitive leaderboards will function. The names and scores of other players listed on the leaderboard are illustrative demo data and do not represent verified real registered user profiles.
          </p>
        </section>

        {/* Educational Quizzes Disclaimer */}
        <section>
          <h2 style={{ fontSize: '1.35rem', color: '#FFF', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Brain size={18} color="var(--accent-cyan)" />
            3. Educational & Quiz Content
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Quizzes provided in the Computer Science, Science, and General Knowledge arenas are curated strictly for intellectual curiosity, casual learning, and trivia amusement. While we make every effort to ensure information accuracy, quiz questions are not official educational curriculum materials and do not guarantee academic or professional certification exam success.
          </p>
        </section>

        {/* Browser Compatibility & Safety */}
        <section>
          <h2 style={{ fontSize: '1.35rem', color: '#FFF', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="var(--success)" />
            4. Fair Play & Software Availability
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            ST PlayZone is provided by Satyam Tiwari free of charge for browser-based play. We make reasonable efforts to maintain smooth performance across mobile and desktop environments, but do not warrant uninterrupted access or immunity from browser-specific quirks or hardware variances.
          </p>
        </section>
      </div>
    </div>
  );
}
