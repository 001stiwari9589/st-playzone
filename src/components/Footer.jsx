import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Award, FileText, Shield, AlertCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '4rem 0 2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-cyan) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                color: '#FFFFFF'
              }}>
                ST
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
                ST <span className="text-gradient">PlayZone</span>
              </span>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              A high-octane casual browser arcade and interactive quiz universe designed to test reflexes, stretch intellect, and reward daily progression.
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              background: 'rgba(139, 92, 246, 0.12)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#C084FC',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              <Award size={14} />
              <span>Created by Satyam Tiwari</span>
            </div>
          </div>

          {/* Quick Play Links */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#FFFFFF', letterSpacing: '0.02em' }}>
              Playable Games
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li>
                <Link to="/games/snake" style={{ transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-cyan)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  🐍 Neon Snake Classic
                </Link>
              </li>
              <li>
                <Link to="/games/tic-tac-toe" style={{ transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-cyan)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  ⚔️ Cyber Tic-Tac-Toe
                </Link>
              </li>
              <li>
                <Link to="/games/memory" style={{ transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-cyan)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  👁️ Holo Memory Match
                </Link>
              </li>
              <li>
                <Link to="/games/puzzle" style={{ transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-cyan)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  🧩 Quantum 15 Puzzle
                </Link>
              </li>
            </ul>
          </div>

          {/* Knowledge & Platform */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#FFFFFF', letterSpacing: '0.02em' }}>
              Explore & Compete
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li>
                <Link to="/quiz" style={{ transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-cyan)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  ⚡ Daily Challenge Quiz
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" style={{ transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-cyan)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  🏆 Global Leaderboard (Demo)
                </Link>
              </li>
              <li>
                <Link to="/profile" style={{ transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-cyan)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  👤 User Profile & Badges
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-cyan)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  ℹ️ About ST PlayZone
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-cyan)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  📫 Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance Links */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#FFFFFF', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={18} color="var(--success)" />
              Legal & Disclaimers
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              <li>
                <Link to="/privacy-policy" style={{ transition: 'color 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.35rem' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-cyan)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  <Shield size={14} color="var(--accent-cyan)" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" style={{ transition: 'color 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.35rem' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-cyan)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  <FileText size={14} color="var(--accent-purple)" /> Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" style={{ transition: 'color 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.35rem' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-cyan)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  <AlertCircle size={14} color="#F87171" /> Disclaimer & Points Policy
                </Link>
              </li>
            </ul>

            <div style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              background: 'rgba(8, 11, 22, 0.5)',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              Virtual ST Points are non-monetary achievements with zero cash or withdrawal value.
            </div>
          </div>
        </div>

        {/* Bottom Credits Bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} <strong>ST PlayZone</strong>. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/privacy-policy" style={{ color: 'var(--text-muted)' }} onMouseOver={e => e.currentTarget.style.color = '#FFF'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>Privacy</Link>
            <span>•</span>
            <Link to="/terms" style={{ color: 'var(--text-muted)' }} onMouseOver={e => e.currentTarget.style.color = '#FFF'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>Terms</Link>
            <span>•</span>
            <Link to="/disclaimer" style={{ color: 'var(--text-muted)' }} onMouseOver={e => e.currentTarget.style.color = '#FFF'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>Disclaimer</Link>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              Built with <Heart size={14} color="#EF4444" fill="#EF4444" /> by <strong style={{ color: 'var(--text-primary)' }}>Satyam Tiwari</strong>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
