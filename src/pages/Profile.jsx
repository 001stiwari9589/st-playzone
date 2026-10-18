import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { saveProfile } from '../utils/storage';
import { ACHIEVEMENTS } from '../data/achievements';
import AchievementBadge from '../components/AchievementBadge';
import { 
  Zap, 
  Trophy, 
  Check, 
  Edit3, 
  Award, 
  Sparkles,
  Info,
  ShieldAlert
} from 'lucide-react';

const AVATAR_OPTIONS = ['🎮', '⚡', '🚀', '⚔️', '🧠', '👾', '💎', '🐉'];

export default function Profile() {
  const { profile, stats, unlockedAchievements, updateUserProfile, isAuthenticated, authUser } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile.username);
  const [tagline, setTagline] = useState(profile.tagline || '');
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar || '🎮');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateUserProfile({
      username: username.trim() || 'Player One',
      tagline: tagline.trim(),
      avatar: selectedAvatar
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem 5rem 1rem' }}>
      {/* Title */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', letterSpacing: '-0.5px' }}>
            Player <span className="text-gradient">Profile</span>
          </h1>
          {isAuthenticated ? (
            <span style={{
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#86EFAC',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              🟢 MongoDB Synced Account
            </span>
          ) : (
            <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
              Local Demo Profile
            </span>
          )}
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
          Manage your gaming identity, view unlocked achievement badges, and track career statistics.
        </p>

        {/* Storage Notice */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: isAuthenticated ? 'rgba(34, 197, 94, 0.08)' : 'rgba(34, 211, 238, 0.08)',
          border: isAuthenticated ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid rgba(34, 211, 238, 0.25)',
          borderRadius: '10px',
          padding: '0.5rem 0.95rem',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)'
        }}>
          <Info size={15} color={isAuthenticated ? 'var(--success)' : 'var(--accent-cyan)'} style={{ flexShrink: 0 }} />
          <span>
            {isAuthenticated ? (
              <>
                <strong>Cloud Connected:</strong> Your profile is linked to <strong>{authUser?.email}</strong> and saved in MongoDB. Edits sync to both local cache and database.
              </>
            ) : (
              <>
                <strong>Guest Session:</strong> You are currently playing as a guest. <a href="/login" style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>Sign In</a> or <a href="/register" style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>Register</a> to save your scores to MongoDB permanently!
              </>
            )}
          </span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 380px) 1fr',
        gap: '2.5rem',
        alignItems: 'start'
      }} className="profile-layout">
        {/* Left Card: Identity & Avatar */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(34, 211, 238, 0.3) 100%)',
              border: '2px solid var(--accent-cyan)',
              boxShadow: '0 0 25px rgba(34, 211, 238, 0.3)',
              fontSize: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              {profile.avatar || '🎮'}
            </div>

            <h2 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '0.25rem' }}>
              {profile.username}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1rem' }}>
              "{profile.tagline || 'Ready to level up'}"
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.9rem',
              borderRadius: '9999px',
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              color: '#DDD6FE',
              fontWeight: '700',
              fontSize: '0.85rem'
            }}>
              <Award size={15} color="var(--accent-purple)" />
              Tier: Level {profile.level} Challenger
            </div>
          </div>

          {/* Quick Points Summary */}
          <div style={{
            background: 'rgba(8, 11, 22, 0.7)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Virtual Points</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                {profile.points} <span style={{ fontSize: '0.8rem' }}>PTS</span>
              </div>
            </div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(34, 211, 238, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)'
            }}>
              <Zap size={22} fill="var(--accent-cyan)" />
            </div>
          </div>

          {/* Edit Profile Form or Trigger */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-outline"
              style={{ width: '100%', padding: '0.7rem', justifyContent: 'center' }}
            >
              <Edit3 size={16} /> Edit Identity
            </button>
          ) : (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Player Name
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={24}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    background: 'rgba(8, 11, 22, 0.8)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Tagline / Motto
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  maxLength={40}
                  placeholder="Your battle cry..."
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    background: 'rgba(8, 11, 22, 0.8)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Choose Avatar
                </label>
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        fontSize: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: selectedAvatar === av ? 'rgba(34, 211, 238, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: selectedAvatar === av ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)'
                      }}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.65rem' }}>
                  <Check size={16} /> Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-outline"
                  style={{ flex: 1, padding: '0.65rem' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {savedSuccess && (
            <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--success)', textAlign: 'center' }}>
              ✓ Profile successfully updated!
            </div>
          )}
        </div>

        {/* Right Section: Career Stats & Achievements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Career Stats Grid */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} color="var(--accent-cyan)" /> Career Milestones
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                background: 'rgba(8, 11, 22, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Games Played</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#FFF', marginTop: '0.2rem' }}>
                  {profile.gamesPlayed}
                </div>
              </div>

              <div style={{
                background: 'rgba(8, 11, 22, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Quizzes Taken</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#FFF', marginTop: '0.2rem' }}>
                  {profile.quizzesCompleted}
                </div>
              </div>

              <div style={{
                background: 'rgba(8, 11, 22, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Snake High</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
                  {stats.snakeHighScore || 0}
                </div>
              </div>

              <div style={{
                background: 'rgba(8, 11, 22, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>TicTacToe Wins</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-purple)', marginTop: '0.2rem' }}>
                  {stats.tictacWins || 0}
                </div>
              </div>

              <div style={{
                background: 'rgba(8, 11, 22, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Quiz Accuracy</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--success)', marginTop: '0.2rem' }}>
                  {stats.quizAccuracy || 0}%
                </div>
              </div>
            </div>
          </div>

          {/* Unlocked Achievements List */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem'
            }}>
              <h3 style={{ fontSize: '1.2rem', color: '#FFF', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Trophy size={18} color="var(--accent-purple)" />
                Achievements ({unlockedAchievements.length} / {ACHIEVEMENTS.length})
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>
                {Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100)}% Unlocked
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem'
            }}>
              {ACHIEVEMENTS.map((ach) => (
                <AchievementBadge
                  key={ach.id}
                  achievement={ach}
                  isUnlocked={unlockedAchievements.includes(ach.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .profile-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
