import React from 'react';
import { 
  Trophy, 
  Brain, 
  Zap, 
  Swords, 
  Eye, 
  Grid, 
  Flame, 
  Calendar, 
  Sparkles, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';

const iconMap = {
  Trophy,
  Brain,
  Zap,
  Swords,
  Eye,
  Grid,
  Flame,
  Calendar,
  Sparkles
};

export default function AchievementBadge({ achievement, isUnlocked }) {
  const IconComponent = iconMap[achievement.icon] || Trophy;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        background: isUnlocked ? 'rgba(19, 28, 48, 0.85)' : 'rgba(16, 23, 42, 0.4)',
        border: isUnlocked ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid var(--border-color)',
        boxShadow: isUnlocked ? '0 8px 25px -5px rgba(139, 92, 246, 0.2)' : 'none',
        opacity: isUnlocked ? 1 : 0.65,
        transition: 'all 0.25s ease'
      }}
    >
      {/* Icon Capsule */}
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: isUnlocked
            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(34, 211, 238, 0.25) 100%)'
            : 'rgba(255, 255, 255, 0.05)',
          border: isUnlocked ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: isUnlocked ? 'var(--accent-cyan)' : 'var(--text-muted)'
        }}
      >
        {isUnlocked ? (
          <IconComponent size={24} />
        ) : (
          <Lock size={20} />
        )}
      </div>

      {/* Details */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
          <h4 style={{ 
            fontSize: '0.98rem', 
            color: isUnlocked ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: '600'
          }}>
            {achievement.title}
          </h4>
          {isUnlocked ? (
            <CheckCircle2 size={15} color="var(--success)" />
          ) : (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Locked</span>
          )}
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {achievement.description}
        </p>
      </div>

      {/* Points Reward */}
      <div style={{
        fontSize: '0.8rem',
        fontWeight: '700',
        color: isUnlocked ? 'var(--accent-cyan)' : 'var(--text-muted)',
        background: isUnlocked ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255, 255, 255, 0.03)',
        padding: '0.3rem 0.6rem',
        borderRadius: '8px',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem'
      }}>
        <Zap size={12} fill={isUnlocked ? 'var(--accent-cyan)' : 'none'} />
        +{achievement.rewardPoints} PTS
      </div>
    </div>
  );
}
