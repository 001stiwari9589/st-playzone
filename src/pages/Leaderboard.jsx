import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Zap, ShieldCheck, Info, RefreshCw, Database } from 'lucide-react';
import { leaderboardAPI } from '../utils/api';

const SAMPLE_LEADERBOARD = [
  { id: '1', name: 'CyberViper', avatar: '🐍', points: 340, games: 42, badge: 'Grandmaster', isDemo: true },
  { id: '2', name: 'QuantumGlitch', avatar: '⚡', points: 290, games: 38, badge: 'Trivia Ace', isDemo: true },
  { id: '3', name: 'NovaStrike', avatar: '🚀', points: 265, games: 31, badge: 'Speed Demon', isDemo: true },
  { id: '4', name: 'PixelSamurai', avatar: '⚔️', points: 220, games: 27, badge: 'Tactician', isDemo: true },
  { id: '5', name: 'AstroMind', avatar: '🧠', points: 195, games: 22, badge: 'Quiz Explorer', isDemo: true },
  { id: '6', name: 'ShadowByte', avatar: '👾', points: 170, games: 19, badge: 'Puzzle King', isDemo: true },
  { id: '7', name: 'ZeroCool', avatar: '💎', points: 145, games: 16, badge: 'Arcade Rookie', isDemo: true },
];

export default function Leaderboard() {
  const { profile, authUser } = useGame();
  const [activeTab, setActiveTab] = useState('all-time'); // 'weekly' or 'all-time'
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiveDB, setIsLiveDB] = useState(false);

  const fetchBoard = async () => {
    setLoading(true);
    try {
      const res = await leaderboardAPI.getLeaderboard();
      const list = res?.leaderboard || res?.data;
      if (Array.isArray(list) && list.length > 0) {
        setLeaderboardData(list);
        setIsLiveDB(true);
      } else {
        setLeaderboardData(SAMPLE_LEADERBOARD);
        setIsLiveDB(false);
      }
    } catch {
      setLeaderboardData(SAMPLE_LEADERBOARD);
      setIsLiveDB(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  // Insert user dynamically and sort
  const combinedList = [
    ...leaderboardData,
    {
      id: authUser ? authUser.id : 'current_user',
      name: `${profile.username} (You)`,
      avatar: profile.avatar || '🎮',
      points: profile.points,
      games: profile.gamesPlayed,
      badge: `Level ${profile.level}`,
      isCurrentUser: true,
      isDemo: false
    }
  ].filter((item, index, self) => 
    // Remove duplicate entry if current user is already in fetched DB records
    index === self.findIndex((t) => (t.id === item.id || (authUser && t.name === authUser.username)))
  ).sort((a, b) => b.points - a.points);

  const getRankBadge = (rank) => {
    if (rank === 1) return <span style={{ color: '#FBBF24', fontSize: '1.25rem' }}>🥇</span>;
    if (rank === 2) return <span style={{ color: '#E2E8F0', fontSize: '1.25rem' }}>🥈</span>;
    if (rank === 3) return <span style={{ color: '#CD7F32', fontSize: '1.25rem' }}>🥉</span>;
    return <span style={{ fontWeight: '700', color: 'var(--text-muted)' }}>#{rank}</span>;
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem 5rem 1rem' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
          <Trophy size={14} /> Demo Leaderboard & Benchmarks
        </div>

        <h1 style={{ fontSize: '2.75rem', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>
          ST <span className="text-gradient">Leaderboard</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto 1rem auto' }}>
          Test your arcade reflexes and quiz intellect to climb above sample community benchmarks.
        </p>

        {/* Notice of Demo Status */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: 'rgba(34, 211, 238, 0.08)',
          border: '1px solid rgba(34, 211, 238, 0.25)',
          borderRadius: '8px',
          padding: '0.4rem 0.9rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <Info size={14} color="var(--accent-cyan)" />
          <span><strong>Demo Notice:</strong> Other player ranks are simulated sample targets. Your score is tracked locally on this device.</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2.5rem'
      }}>
        <div style={{
          display: 'inline-flex',
          background: 'rgba(19, 28, 48, 0.8)',
          borderRadius: 'var(--radius-md)',
          padding: '0.35rem',
          border: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => setActiveTab('weekly')}
            style={{
              padding: '0.55rem 1.4rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: '600',
              background: activeTab === 'weekly' ? 'var(--accent-purple)' : 'transparent',
              color: activeTab === 'weekly' ? '#FFF' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            Weekly Champions
          </button>
          <button
            onClick={() => setActiveTab('all-time')}
            style={{
              padding: '0.55rem 1.4rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: '600',
              background: activeTab === 'all-time' ? 'var(--accent-purple)' : 'transparent',
              color: activeTab === 'all-time' ? '#FFF' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            All-Time Legends
          </button>
        </div>
      </div>

      {/* Top 3 Podium Highlights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.5rem',
        maxWidth: '900px',
        margin: '0 auto 3rem auto'
      }}>
        {combinedList.slice(0, 3).map((player, idx) => {
          const rank = idx + 1;
          const isGold = rank === 1;
          return (
            <div
              key={player.id}
              className="glass-card"
              style={{
                padding: '2rem 1.5rem',
                textAlign: 'center',
                position: 'relative',
                border: isGold ? '2px solid rgba(251, 191, 36, 0.5)' : '1px solid var(--border-color)',
                boxShadow: isGold ? '0 0 35px rgba(251, 191, 36, 0.2)' : 'none',
                transform: isGold ? 'scale(1.04)' : 'none'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: isGold ? '#FBBF24' : rank === 2 ? '#94A3B8' : '#CD7F32',
                color: '#000',
                fontWeight: '800',
                padding: '0.2rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem'
              }}>
                RANK #{rank}
              </div>

              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                fontSize: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0.5rem auto 1rem auto',
                border: '1px solid var(--border-color)'
              }}>
                {player.avatar}
              </div>

              <h3 style={{ fontSize: '1.15rem', color: '#FFF', marginBottom: '0.25rem' }}>
                {player.name}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem', fontWeight: '600' }}>
                {player.badge}
              </div>

              {player.isDemo && (
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  [Sample Benchmark]
                </div>
              )}

              <div style={{
                background: 'rgba(8, 11, 22, 0.7)',
                padding: '0.6rem',
                borderRadius: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#FFF',
                fontWeight: '700'
              }}>
                <Zap size={16} fill="var(--accent-cyan)" color="var(--accent-cyan)" />
                {player.points} PTS
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="glass-card" style={{
        maxWidth: '900px',
        margin: '0 auto',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ fontSize: '1.1rem', color: '#FFF' }}>Standings Table</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.78rem',
              color: isLiveDB ? 'var(--success)' : 'var(--accent-cyan)',
              background: isLiveDB ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 211, 238, 0.1)',
              padding: '0.2rem 0.6rem',
              borderRadius: '6px',
              border: isLiveDB ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(34, 211, 238, 0.3)'
            }}>
              {isLiveDB ? (
                <>
                  <Database size={12} /> Live MongoDB Sync
                </>
              ) : (
                <>
                  ⚡ Client-side Benchmarks
                </>
              )}
            </span>
            <button
              onClick={fetchBoard}
              disabled={loading}
              title="Refresh Leaderboard"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '0.3rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px' }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase'
              }}>
                <th style={{ padding: '1rem 1.75rem', width: '80px' }}>Rank</th>
                <th style={{ padding: '1rem' }}>Player</th>
                <th style={{ padding: '1rem' }}>Badge / Type</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Matches</th>
                <th style={{ padding: '1rem 1.75rem', textAlign: 'right' }}>ST Points</th>
              </tr>
            </thead>
            <tbody>
              {combinedList.map((player, idx) => {
                const rank = idx + 1;
                return (
                  <tr
                    key={player.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      background: player.isCurrentUser ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <td style={{ padding: '1.1rem 1.75rem' }}>
                      {getRankBadge(rank)}
                    </td>
                    <td style={{ padding: '1.1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.3rem' }}>{player.avatar}</span>
                        <div>
                          <strong style={{ color: player.isCurrentUser ? 'var(--accent-cyan)' : '#FFF', fontSize: '0.95rem' }}>
                            {player.name}
                          </strong>
                          {player.isCurrentUser ? (
                            <span style={{
                              marginLeft: '0.5rem',
                              background: 'var(--accent-purple)',
                              color: '#FFF',
                              fontSize: '0.65rem',
                              padding: '0.15rem 0.4rem',
                              borderRadius: '4px',
                              fontWeight: '700'
                            }}>
                              YOU
                            </span>
                          ) : (
                            <span style={{
                              marginLeft: '0.5rem',
                              background: 'rgba(255, 255, 255, 0.08)',
                              color: 'var(--text-muted)',
                              fontSize: '0.65rem',
                              padding: '0.15rem 0.4rem',
                              borderRadius: '4px'
                            }}>
                              Sample
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.1rem' }}>
                      <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                        {player.badge}
                      </span>
                    </td>
                    <td style={{ padding: '1.1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                      {player.games}
                    </td>
                    <td style={{ padding: '1.1rem 1.75rem', textAlign: 'right', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                      {player.points} PTS
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notice Banner */}
      <div style={{
        maxWidth: '900px',
        margin: '2rem auto 0 auto',
        padding: '1.1rem 1.35rem',
        borderRadius: '12px',
        background: 'rgba(8, 11, 22, 0.6)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <ShieldCheck size={22} color="var(--success)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Fair Play & Non-Monetary Disclaimer:</strong> Leaderboard points represent client-side demo achievements and community sample benchmarks. Virtual ST Points have zero cash, monetary, or withdrawal value.
        </span>
      </div>
    </div>
  );
}
