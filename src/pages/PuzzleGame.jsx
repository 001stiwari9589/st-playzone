import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordGameEnd, addPoints } from '../utils/storage';
import { useGame } from '../context/GameContext';
import { playMoveSound, playWinSound } from '../utils/sound';

export default function PuzzleGame() {
  const { stats } = useGame();
  const [gridSize, setGridSize] = useState(4); // 4x4 = 15 puzzle, 3x3 = 8 puzzle
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [bestMoves, setBestMoves] = useState(stats.puzzleBestMoves || null);

  const timerRef = useRef(null);

  // Check if solved
  const checkIsSolved = (currentTiles) => {
    const totalTiles = currentTiles.length;
    for (let i = 0; i < totalTiles - 1; i++) {
      if (currentTiles[i] !== i + 1) return false;
    }
    return currentTiles[totalTiles - 1] === null;
  };

  // Generate Solvable Board by simulating valid random moves from solved state
  const shuffleBoard = (size) => {
    const count = size * size;
    // Solved initial state
    let state = Array.from({ length: count - 1 }, (_, i) => i + 1);
    state.push(null); // empty space

    let blankIdx = count - 1;
    let lastMove = null;

    // Simulate 120 valid random sliding moves
    for (let step = 0; step < 120; step++) {
      const validMoves = [];
      const row = Math.floor(blankIdx / size);
      const col = blankIdx % size;

      if (row > 0) validMoves.push(blankIdx - size); // tile above moves down
      if (row < size - 1) validMoves.push(blankIdx + size); // tile below moves up
      if (col > 0) validMoves.push(blankIdx - 1); // tile left moves right
      if (col < size - 1) validMoves.push(blankIdx + 1); // tile right moves left

      // Filter out immediate undo
      const candidateMoves = validMoves.filter((idx) => idx !== lastMove);
      const chosen = candidateMoves.length > 0
        ? candidateMoves[Math.floor(Math.random() * candidateMoves.length)]
        : validMoves[0];

      state[blankIdx] = state[chosen];
      state[chosen] = null;
      lastMove = blankIdx;
      blankIdx = chosen;
    }

    setTiles(state);
    setMoves(0);
    setSeconds(0);
    setIsTimerActive(false);
    setIsWon(false);

    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    shuffleBoard(gridSize);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gridSize]);

  // Stopwatch timer
  useEffect(() => {
    if (isTimerActive && !isWon) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerActive, isWon]);

  // Handle tile click
  const handleTileClick = (index) => {
    if (isWon || tiles[index] === null) return;

    const blankIdx = tiles.indexOf(null);
    const size = gridSize;

    const row = Math.floor(index / size);
    const col = index % size;
    const blankRow = Math.floor(blankIdx / size);
    const blankCol = blankIdx % size;

    // Check if adjacent (same row and col dist 1, or same col and row dist 1)
    const isAdjacent =
      (row === blankRow && Math.abs(col - blankCol) === 1) ||
      (col === blankCol && Math.abs(row - blankRow) === 1);

    if (!isAdjacent) return;

    if (!isTimerActive) {
      setIsTimerActive(true);
    }

    playMoveSound();
    const newTiles = [...tiles];
    newTiles[blankIdx] = newTiles[index];
    newTiles[index] = null;

    setTiles(newTiles);
    const newMoves = moves + 1;
    setMoves(newMoves);

    // Check victory
    if (checkIsSolved(newTiles)) {
      setIsWon(true);
      setIsTimerActive(false);
      playWinSound();

      if (!bestMoves || newMoves < bestMoves) {
        setBestMoves(newMoves);
      }

      addPoints(25, `Solved the Quantum ${gridSize * gridSize - 1} Puzzle in ${newMoves} moves!`);
      recordGameEnd({
        gameId: 'puzzle',
        win: true,
        moves: newMoves
      });

      try {
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem 4rem 1rem' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/games" className="btn-outline" style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> All Games
          </Link>
          <div>
            <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Quantum 15 Puzzle</span>
              <span className="badge badge-amber">Puzzle</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Slide numbers into ascending sequence. Every shuffle is mathematically solvable!
            </p>
          </div>
        </div>

        {/* Size Selector */}
        <div style={{
          display: 'flex',
          background: 'rgba(19, 28, 48, 0.8)',
          borderRadius: 'var(--radius-md)',
          padding: '0.3rem',
          border: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => setGridSize(3)}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '600',
              background: gridSize === 3 ? 'var(--accent-purple)' : 'transparent',
              color: gridSize === 3 ? '#FFF' : 'var(--text-secondary)'
            }}
          >
            3x3 (8-Tile)
          </button>
          <button
            onClick={() => setGridSize(4)}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '600',
              background: gridSize === 4 ? 'var(--accent-purple)' : 'transparent',
              color: gridSize === 4 ? '#FFF' : 'var(--text-secondary)'
            }}
          >
            4x4 (15-Tile)
          </button>
        </div>
      </div>

      {/* Main Game Stage */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 480px) 1fr',
        gap: '2.5rem',
        alignItems: 'start'
      }} className="puzzle-layout">
        {/* Board Container */}
        <div style={{
          background: 'rgba(13, 19, 33, 0.95)',
          border: '2px solid #263247',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(245, 158, 11, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Counters Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '400px',
            marginBottom: '1.5rem',
            gap: '1rem'
          }}>
            <div style={{
              flex: 1,
              background: 'rgba(8, 11, 22, 0.7)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '0.6rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Moves</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>{moves}</div>
            </div>

            <div style={{
              flex: 1,
              background: 'rgba(8, 11, 22, 0.7)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '0.6rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFF' }}>{formatTime(seconds)}</div>
            </div>

            {bestMoves && (
              <div style={{
                flex: 1,
                background: 'rgba(8, 11, 22, 0.7)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                borderRadius: '12px',
                padding: '0.6rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#DDD6FE', textTransform: 'uppercase' }}>Best Moves</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent-purple)' }}>{bestMoves}</div>
              </div>
            )}
          </div>

          {/* Grid Tiles */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: '10px',
            width: '100%',
            maxWidth: '400px',
            aspectRatio: '1 / 1',
            background: '#090D1A',
            padding: '12px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            position: 'relative'
          }}>
            {tiles.map((val, idx) => {
              if (val === null) {
                return (
                  <div
                    key="empty"
                    style={{
                      background: 'rgba(8, 11, 22, 0.3)',
                      borderRadius: '10px',
                      border: '1px dashed rgba(255, 255, 255, 0.1)'
                    }}
                  />
                );
              }

              return (
                <button
                  key={val}
                  onClick={() => handleTileClick(idx)}
                  disabled={isWon}
                  style={{
                    background: 'linear-gradient(135deg, #1E293B 0%, #111827 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.35)',
                    borderRadius: '12px',
                    fontSize: gridSize === 3 ? '1.8rem' : '1.35rem',
                    fontWeight: '800',
                    fontFamily: 'var(--font-heading)',
                    color: '#F8FAFC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                    transition: 'transform 0.15s ease, border-color 0.15s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                    e.currentTarget.style.transform = 'scale(1.04)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.35)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {val}
                </button>
              );
            })}

            {/* Victory Overlay */}
            {isWon && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(8, 11, 22, 0.92)',
                backdropFilter: 'blur(6px)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                textAlign: 'center',
                zIndex: 10
              }}>
                <CheckCircle2 size={48} color="var(--success)" style={{ marginBottom: '0.75rem' }} />
                <h3 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '0.25rem' }}>
                  Puzzle Solved!
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                  Magnificent! Ordered in <strong style={{ color: 'var(--accent-cyan)' }}>{moves} moves</strong>. +25 ST Points earned!
                </p>
                <button onClick={() => shuffleBoard(gridSize)} className="btn-primary">
                  <RotateCcw size={16} /> Play Again
                </button>
              </div>
            )}
          </div>

          {/* Reset Action */}
          <div style={{ marginTop: '1.5rem', width: '100%', maxWidth: '400px' }}>
            <button
              onClick={() => shuffleBoard(gridSize)}
              className="btn-outline"
              style={{ width: '100%', padding: '0.65rem' }}
            >
              <RotateCcw size={16} /> Reshuffle Puzzle
            </button>
          </div>
        </div>

        {/* Puzzle Guide */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#FFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} color="var(--accent-purple)" /> Rules & Mechanics
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              The 15-puzzle was invented in the 1870s and remains a revered benchmark of spatial logic.
            </p>
            <ul style={{
              paddingLeft: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)'
            }}>
              <li>Click any numbered tile adjacent to the empty slot to slide it in.</li>
              <li>Arrange tiles sequentially from top-left (1) across rows to bottom-right.</li>
              <li>All shuffles are generated via mathematical random walk, ensuring a legitimate solution always exists.</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .puzzle-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
