import React from 'react';
import { useGame } from '../context/GameContext';
import { Zap, Trophy, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useGame();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isAchievement = toast.type === 'achievement';
        return (
          <div key={toast.id} className="toast-item">
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: isAchievement 
                ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))'
                : 'rgba(34, 211, 238, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: isAchievement ? '#FFFFFF' : 'var(--accent-cyan)'
            }}>
              {isAchievement ? <Trophy size={20} /> : <Zap size={20} fill="var(--accent-cyan)" />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: '700',
                color: isAchievement ? '#DDD6FE' : 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {toast.message}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss"
              style={{
                color: 'var(--text-muted)',
                padding: '0.2rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
