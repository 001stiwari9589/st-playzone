import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Gamepad2, Swords, Eye, Grid, Zap, Sparkles } from 'lucide-react';

const iconMap = {
  Gamepad2,
  Swords,
  Eye,
  Grid
};

export default function GameCard({ game }) {
  const IconComponent = iconMap[game.icon] || Gamepad2;

  const getBadgeClass = (color) => {
    switch (color) {
      case 'green': return 'badge-green';
      case 'purple': return 'badge-purple';
      case 'cyan': return 'badge-cyan';
      case 'amber': return 'badge-amber';
      default: return 'badge-purple';
    }
  };

  return (
    <div 
      className="glass-card" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        position: 'relative',
        height: '100%'
      }}
    >
      {/* Top Banner Gradient & Graphic */}
      <div style={{
        background: game.bannerGradient,
        height: '130px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow orb */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: game.accentColor,
          opacity: 0.15,
          filter: 'blur(30px)'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'rgba(8, 11, 22, 0.7)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${game.accentColor}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 20px ${game.accentColor}25`
          }}>
            <IconComponent size={28} color={game.accentColor} />
          </div>

          <div>
            <span className={`badge ${getBadgeClass(game.badgeColor)}`} style={{ marginBottom: '0.25rem' }}>
              {game.category}
            </span>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Difficulty: <strong style={{ color: '#FFFFFF' }}>{game.difficulty}</strong>
            </div>
          </div>
        </div>

        {game.popular && (
          <div style={{
            background: 'rgba(139, 92, 246, 0.25)',
            border: '1px solid var(--accent-purple)',
            color: '#DDD6FE',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <Sparkles size={12} />
            HOT
          </div>
        )}
      </div>

      {/* Content Area */}
      <div style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{
            fontSize: '1.25rem',
            marginBottom: '0.5rem',
            letterSpacing: '-0.3px',
            color: '#FFFFFF'
          }}>
            {game.title}
          </h3>

          <p style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '1rem'
          }}>
            {game.description}
          </p>

          <div style={{
            background: 'rgba(8, 11, 22, 0.5)',
            borderRadius: '10px',
            padding: '0.6rem 0.85rem',
            marginBottom: '1.25rem',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Controls: <strong style={{ color: 'var(--text-secondary)' }}>{game.controls}</strong></span>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Zap size={12} /> {game.rewardText}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={game.route}
          className="btn-primary"
          style={{
            width: '100%',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            fontSize: '0.95rem'
          }}
        >
          <Play size={16} fill="#FFFFFF" />
          <span>Launch Game</span>
        </Link>
      </div>
    </div>
  );
}
