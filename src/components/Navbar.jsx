import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Gamepad2, 
  Brain, 
  Trophy, 
  Info, 
  Mail, 
  Menu, 
  X, 
  Zap, 
  Home,
  LogIn,
  LogOut,
  UserPlus
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { profile, isAuthenticated, authUser, logout } = useGame();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Games', path: '/games', icon: Gamepad2 },
    { name: 'Quiz', path: '/quiz', icon: Brain },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(8, 11, 22, 0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      transition: 'all 0.3s ease'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px'
      }}>
        {/* Brand Logo */}
        <Link 
          to="/" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-cyan) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.45)',
            position: 'relative'
          }}>
            <span style={{ 
              fontWeight: '900', 
              fontSize: '1.25rem', 
              color: '#FFFFFF',
              letterSpacing: '-0.5px' 
            }}>
              ST
            </span>
            <div style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#22D3EE',
              boxShadow: '0 0 8px #22D3EE'
            }} />
          </div>

          <div>
            <div style={{
              fontSize: '1.35rem',
              fontWeight: '800',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <span>ST</span>
              <span className="text-gradient">PlayZone</span>
            </div>
            <div style={{ 
              fontSize: '0.7rem', 
              color: 'var(--text-muted)', 
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontWeight: '600'
            }}>
              Play • Challenge • Level Up
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }} className="desktop-nav">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  fontWeight: active ? '600' : '500',
                  color: active ? '#FFFFFF' : 'var(--text-secondary)',
                  backgroundColor: active ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                  border: active ? '1px solid rgba(139, 92, 246, 0.35)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <Icon size={16} color={active ? 'var(--accent-cyan)' : 'currentColor'} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Points Badge, Auth & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Points Pill */}
          <Link
            to="/profile"
            title="Your Level & Virtual Points"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.4rem 0.8rem',
              background: 'rgba(19, 28, 48, 0.8)',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: '700',
              color: '#FFFFFF',
              boxShadow: '0 0 15px rgba(34, 211, 238, 0.15)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 211, 238, 0.2)',
              color: 'var(--accent-cyan)'
            }}>
              <Zap size={13} fill="var(--accent-cyan)" />
            </div>
            <span>{profile.points} <span style={{ color: 'var(--accent-cyan)', fontSize: '0.72rem' }}>PTS</span></span>
            <span style={{ 
              backgroundColor: 'var(--accent-purple)', 
              color: '#FFF', 
              fontSize: '0.65rem', 
              padding: '0.1rem 0.35rem', 
              borderRadius: '6px' 
            }}>
              LVL {profile.level}
            </span>
          </Link>

          {/* Profile Avatar / Auth actions */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to="/profile"
                title={`${authUser?.username || 'Profile'} (Connected to MongoDB)`}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1E293B, #0F172A)',
                  border: '2px solid var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  boxShadow: '0 0 12px rgba(34, 211, 238, 0.3)'
                }}
              >
                {profile.avatar || '🎮'}
              </Link>
              <button
                onClick={logout}
                title="Sign Out"
                className="btn-outline"
                style={{ padding: '0.45rem', borderRadius: '8px', color: 'var(--text-muted)' }}
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Link
                to="/login"
                className="btn-secondary"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="mobile-toggle"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: active ? '700' : '500',
                  color: active ? 'var(--accent-cyan)' : 'var(--text-primary)',
                  backgroundColor: active ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                  border: active ? '1px solid rgba(34, 211, 238, 0.3)' : '1px solid transparent'
                }}
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.25rem', display: 'flex', gap: '0.5rem' }}>
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="btn-outline"
                style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}
              >
                <LogOut size={16} /> Sign Out ({authUser?.username})
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', padding: '0.65rem' }}
                >
                  <LogIn size={16} /> Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', padding: '0.65rem' }}
                >
                  <UserPlus size={16} /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
