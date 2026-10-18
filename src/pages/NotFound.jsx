import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, Gamepad2, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container" style={{
      padding: '5rem 1rem 6rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      minHeight: '70vh'
    }}>
      <div style={{
        width: '84px',
        height: '84px',
        borderRadius: '24px',
        background: 'rgba(239, 68, 68, 0.15)',
        border: '2px solid rgba(239, 68, 68, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#EF4444',
        marginBottom: '1.5rem',
        boxShadow: '0 0 30px rgba(239, 68, 68, 0.25)'
      }}>
        <ShieldAlert size={44} />
      </div>

      <div className="badge badge-purple" style={{ marginBottom: '1rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
        ERROR 404 • ARENA SECTOR NOT FOUND
      </div>

      <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem', letterSpacing: '-1px' }}>
        Lost in the <span className="text-gradient">Cyber Void</span>
      </h1>

      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '540px', lineHeight: 1.6, marginBottom: '2.5rem' }}>
        The page or game sector you requested does not exist or may have been relocated. Check the URL or return to safety in the main hub.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn-primary" style={{ padding: '0.8rem 1.8rem' }}>
          <Home size={18} />
          <span>Return Home</span>
        </Link>
        <Link to="/games" className="btn-secondary" style={{ padding: '0.8rem 1.8rem' }}>
          <Gamepad2 size={18} />
          <span>Browse Games</span>
        </Link>
      </div>
    </div>
  );
}
