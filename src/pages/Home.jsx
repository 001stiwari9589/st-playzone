import React from 'react';
import { Link } from 'react-router-dom';
import { GAMES } from '../data/games';
import { ACHIEVEMENTS } from '../data/achievements';
import GameCard from '../components/GameCard';
import AchievementBadge from '../components/AchievementBadge';
import { useGame } from '../context/GameContext';
import { 
  Play, 
  Brain, 
  Trophy, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  Flame, 
  ShieldCheck, 
  Target, 
  Award,
  ChevronRight,
  Gamepad2
} from 'lucide-react';

export default function Home() {
  const { profile, unlockedAchievements } = useGame();

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '5rem 1rem 6rem 1rem',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 10%, rgba(139, 92, 246, 0.15) 0%, rgba(8, 11, 22, 1) 70%)'
      }}>
        {/* Decorative Grid Lines / Background glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1200px',
          height: '100%',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(34, 211, 238, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 1.1rem',
            borderRadius: '9999px',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.25)',
            color: '#DDD6FE',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '1.75rem'
          }}>
            <Sparkles size={16} color="var(--accent-cyan)" />
            <span>Casual Arcade & Brain Battles • Founded by Satyam Tiwari</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: '900',
            lineHeight: 1.15,
            letterSpacing: '-1.5px',
            marginBottom: '1.5rem',
            maxWidth: '900px',
            margin: '0 auto 1.5rem auto'
          }}>
            Your Next Level <br />
            <span className="text-gradient">Starts Right Here.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6
          }}>
            Play exciting arcade classics, challenge your mind with timed quizzes, stack up virtual ST points, and unlock glory on the leaderboard.
          </p>

          {/* CTA Action Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <Link
              to="/games"
              className="btn-primary"
              style={{
                padding: '0.9rem 2.2rem',
                fontSize: '1.05rem',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <Play size={18} fill="#FFF" />
              <span>Play Games</span>
            </Link>

            <Link
              to="/quiz"
              className="btn-secondary"
              style={{
                padding: '0.9rem 2.2rem',
                fontSize: '1.05rem',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <Brain size={18} />
              <span>Take Daily Quiz</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2.5rem',
            marginTop: '4rem',
            padding: '1.25rem 2.5rem',
            background: 'rgba(19, 28, 48, 0.65)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#FFF' }}>4 Games</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fully Playable</div>
            </div>
            <div style={{ width: '1px', height: '36px', background: 'var(--border-color)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--accent-cyan)' }}>4 Arenas</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Knowledge Quizzes</div>
            </div>
            <div style={{ width: '1px', height: '36px', background: 'var(--border-color)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--accent-purple)' }}>{profile.points} PTS</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Your ST Balance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{
                fontSize: '0.82rem',
                color: 'var(--accent-cyan)',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.4rem'
              }}>
                Instant Arcade
              </div>
              <h2 style={{ fontSize: '2.25rem', letterSpacing: '-0.5px' }}>
                Featured <span className="text-gradient">Playable Games</span>
              </h2>
            </div>

            <Link
              to="/games"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--accent-purple)',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}
            >
              <span>View All 4 Games</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem'
          }}>
            {GAMES.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>

      {/* Daily Quiz Highlight Banner */}
      <section style={{ padding: '3rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="glass-card daily-quiz-banner" style={{
            padding: '3rem',
            background: 'linear-gradient(135deg, rgba(19, 28, 48, 0.95) 0%, rgba(139, 92, 246, 0.15) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#FBBF24',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                marginBottom: '1rem'
              }}>
                <Flame size={14} /> Daily Special Challenge
              </div>

              <h3 style={{ fontSize: '2rem', color: '#FFF', marginBottom: '0.75rem' }}>
                Test Your Intellect & Earn <span style={{ color: 'var(--accent-cyan)' }}>+20 Bonus Points</span>
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Complete today's fast 5-question speed trivia. Beat the 15-second timer on every question to unlock the coveted <em>Daily Challenger</em> badge!
              </p>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Zap size={16} color="var(--accent-cyan)" /> 5 Timed Questions
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Award size={16} color="var(--accent-purple)" /> Achievement Unlock
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={16} color="var(--success)" /> Instant Feedback
                </span>
              </div>
            </div>

            <Link
              to="/quiz"
              className="btn-primary"
              style={{
                padding: '1rem 2.25rem',
                fontSize: '1.05rem',
                whiteSpace: 'nowrap',
                alignSelf: 'center'
              }}
            >
              <span>Take Challenge</span>
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* How ST PlayZone Works */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              fontSize: '0.82rem',
              color: 'var(--accent-purple)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.4rem'
            }}>
              Simple & Engaging
            </div>
            <h2 style={{ fontSize: '2.25rem', letterSpacing: '-0.5px' }}>
              How ST PlayZone <span className="text-gradient">Works</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            <div className="glass-card" style={{ padding: '2.25rem', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                fontSize: '3rem',
                fontWeight: '900',
                color: 'rgba(255, 255, 255, 0.05)',
                lineHeight: 1
              }}>
                01
              </div>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#C084FC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Gamepad2 size={26} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#FFF', marginBottom: '0.5rem' }}>
                Pick Your Challenge
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Choose between fast-paced arcade classics like Snake and Tic-Tac-Toe, or cognitive trivia quizzes covering coding and science.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2.25rem', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                fontSize: '3rem',
                fontWeight: '900',
                color: 'rgba(255, 255, 255, 0.05)',
                lineHeight: 1
              }}>
                02
              </div>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'rgba(34, 211, 238, 0.15)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Target size={26} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#FFF', marginBottom: '0.5rem' }}>
                Test Skill & Reflexes
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Battle AI opponents, beat the question countdown timers, and solve mathematical 15-puzzles with precise strategy.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2.25rem', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                fontSize: '3rem',
                fontWeight: '900',
                color: 'rgba(255, 255, 255, 0.05)',
                lineHeight: 1
              }}>
                03
              </div>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#4ADE80',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Trophy size={26} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#FFF', marginBottom: '0.5rem' }}>
                Level Up & Dominate
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Accumulate virtual ST points, level up your profile tier, unlock rare achievement badges, and climb the public leaderboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Preview */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{
                fontSize: '0.82rem',
                color: 'var(--accent-purple)',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.4rem'
              }}>
                Player Progression
              </div>
              <h2 style={{ fontSize: '2.25rem', letterSpacing: '-0.5px' }}>
                Unlockable <span className="text-gradient">Badges</span>
              </h2>
            </div>

            <Link
              to="/profile"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--accent-cyan)',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}
            >
              <span>View All Achievements</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {ACHIEVEMENTS.slice(0, 4).map((ach) => (
              <AchievementBadge
                key={ach.id}
                achievement={ach}
                isUnlocked={unlockedAchievements.includes(ach.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .daily-quiz-banner {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
