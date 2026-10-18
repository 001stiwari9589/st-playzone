import React, { useState, useMemo } from 'react';
import { GAMES } from '../data/games';
import GameCard from '../components/GameCard';
import { Search, Gamepad2, Filter, Zap, Sparkles } from 'lucide-react';

export default function Games() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const categories = ['All', 'Arcade', 'Strategy', 'Brain', 'Puzzle'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredGames = useMemo(() => {
    return GAMES.filter((game) => {
      const matchesSearch =
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || game.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesDifficulty =
        selectedDifficulty === 'All' || game.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  return (
    <div className="container" style={{ padding: '3rem 1rem 5rem 1rem' }}>
      {/* Title & Banner */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
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
          <Sparkles size={14} /> Interactive Arcade Portal
        </div>

        <h1 style={{ fontSize: '2.75rem', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>
          Explore Playable <span className="text-gradient">Games</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Pick a challenge, test your reflexes and strategic mind, and stack up virtual ST points for the leaderboard.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-card" style={{
        padding: '1.25rem 1.5rem',
        marginBottom: '2.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Search Input */}
        <div style={{
          position: 'relative',
          flex: '1 1 280px',
          maxWidth: '420px'
        }}>
          <Search size={18} color="var(--text-muted)" style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)'
          }} />
          <input
            type="text"
            placeholder="Search games by title, genre, rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'rgba(8, 11, 22, 0.7)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '0.7rem 1rem 0.7rem 2.6rem',
              color: '#FFFFFF',
              fontSize: '0.92rem'
            }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Filter size={14} /> Genre:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: '600',
                background: selectedCategory === cat ? 'var(--accent-purple)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === cat ? '#FFF' : 'var(--text-secondary)',
                border: selectedCategory === cat ? '1px solid var(--accent-purple)' : '1px solid var(--border-color)',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Games Catalog Grid */}
      {filteredGames.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.75rem'
        }}>
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '2rem auto'
        }}>
          <Gamepad2 size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.5rem' }}>No games found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            No games match "{searchQuery}". Try searching for Snake, Tic-Tac-Toe, or resetting the filter.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedDifficulty('All'); }}
            className="btn-outline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
