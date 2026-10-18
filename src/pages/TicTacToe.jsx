import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Bot, Users, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordGameEnd, addPoints } from '../utils/storage';
import { useGame } from '../context/GameContext';
import { playMoveSound, playWinSound, playGameOverSound } from '../utils/sound';

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

export default function TicTacToe() {
  const { stats } = useGame();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameMode, setGameMode] = useState('ai'); // 'ai' or 'pvp'
  const [scores, setScores] = useState({ x: stats.tictacWins || 0, o: 0, ties: 0 });
  const [winnerInfo, setWinnerInfo] = useState(null); // { winner: 'X' | 'O' | 'Draw', line: [] }

  const checkWinner = (currentBoard) => {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: combo };
      }
    }
    if (currentBoard.every((cell) => cell !== null)) {
      return { winner: 'Draw', line: [] };
    }
    return null;
  };

  // AI Move calculation (Smart heuristic: win if can, block if can, or pick center/corners)
  const getAiMove = (currentBoard) => {
    // 1. Can AI win in 1 move?
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      const vals = [currentBoard[a], currentBoard[b], currentBoard[c]];
      if (vals.filter(v => v === 'O').length === 2 && vals.filter(v => v === null).length === 1) {
        if (!currentBoard[a]) return a;
        if (!currentBoard[b]) return b;
        if (!currentBoard[c]) return c;
      }
    }

    // 2. Can player X win in 1 move? Block them!
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      const vals = [currentBoard[a], currentBoard[b], currentBoard[c]];
      if (vals.filter(v => v === 'X').length === 2 && vals.filter(v => v === null).length === 1) {
        if (!currentBoard[a]) return a;
        if (!currentBoard[b]) return b;
        if (!currentBoard[c]) return c;
      }
    }

    // 3. Take Center if available
    if (currentBoard[4] === null) return 4;

    // 4. Take random available corner
    const corners = [0, 2, 6, 8].filter(i => currentBoard[i] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // 5. Take any open cell
    const emptyCells = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  // Trigger AI move if it's O's turn and AI mode active
  useEffect(() => {
    if (gameMode === 'ai' && !isXNext && !winnerInfo) {
      const timer = setTimeout(() => {
        const aiIndex = getAiMove(board);
        if (aiIndex !== undefined && board[aiIndex] === null) {
          handleCellClick(aiIndex, false);
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isXNext, gameMode, winnerInfo, board]);

  const handleCellClick = (index, isHumanAction = true) => {
    if (board[index] || winnerInfo) return;
    if (gameMode === 'ai' && !isXNext && isHumanAction) return;

    const newBoard = [...board];
    const mark = isXNext ? 'X' : 'O';
    newBoard[index] = mark;
    setBoard(newBoard);
    playMoveSound();

    const outcome = checkWinner(newBoard);
    if (outcome) {
      setWinnerInfo(outcome);
      if (outcome.winner === 'X') {
        setScores((prev) => ({ ...prev, x: prev.x + 1 }));
        addPoints(10, 'Victory in Cyber Tic-Tac-Toe!');
        recordGameEnd({ gameId: 'tic-tac-toe', win: true });
        playWinSound();
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      } else if (outcome.winner === 'O') {
        setScores((prev) => ({ ...prev, o: prev.o + 1 }));
        recordGameEnd({ gameId: 'tic-tac-toe', win: false });
        playGameOverSound();
      } else {
        setScores((prev) => ({ ...prev, ties: prev.ties + 1 }));
        recordGameEnd({ gameId: 'tic-tac-toe', win: false });
      }
    } else {
      setIsXNext(!isXNext);
    }
  };

  const resetRound = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinnerInfo(null);
  };

  const resetAllScores = () => {
    resetRound();
    setScores({ x: 0, o: 0, ties: 0 });
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
              <span>Cyber Tic-Tac-Toe</span>
              <span className="badge badge-purple">Strategy</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Outthink your opponent locally or test tactical wits against the cyber AI.
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div style={{
          display: 'flex',
          background: 'rgba(19, 28, 48, 0.8)',
          borderRadius: 'var(--radius-md)',
          padding: '0.3rem',
          border: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => { setGameMode('ai'); resetRound(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: '600',
              background: gameMode === 'ai' ? 'var(--accent-purple)' : 'transparent',
              color: gameMode === 'ai' ? '#FFF' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            <Bot size={16} /> VS AI
          </button>
          <button
            onClick={() => { setGameMode('pvp'); resetRound(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: '600',
              background: gameMode === 'pvp' ? 'var(--accent-purple)' : 'transparent',
              color: gameMode === 'pvp' ? '#FFF' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            <Users size={16} /> Pass & Play
          </button>
        </div>
      </div>

      {/* Main Game Stage */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 460px) 1fr',
        gap: '2.5rem',
        alignItems: 'start'
      }} className="tictac-layout">
        {/* Game Board Container */}
        <div style={{
          background: 'rgba(13, 19, 33, 0.95)',
          border: '2px solid #263247',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(139, 92, 246, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Status Indicator */}
          <div style={{
            marginBottom: '1.5rem',
            fontSize: '1.1rem',
            fontWeight: '700',
            textAlign: 'center'
          }}>
            {!winnerInfo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Current Turn:</span>
                <span style={{
                  color: isXNext ? 'var(--accent-cyan)' : 'var(--accent-purple)',
                  textShadow: isXNext ? '0 0 10px rgba(34, 211, 238, 0.5)' : '0 0 10px rgba(139, 92, 246, 0.5)'
                }}>
                  {isXNext ? 'Player X' : gameMode === 'ai' ? 'Cyber AI (O)' : 'Player O'}
                </span>
              </div>
            ) : winnerInfo.winner === 'Draw' ? (
              <span style={{ color: 'var(--text-secondary)' }}>🤝 It's a Stalemate Draw!</span>
            ) : (
              <span style={{ color: winnerInfo.winner === 'X' ? 'var(--accent-cyan)' : 'var(--accent-purple)' }}>
                🎉 {winnerInfo.winner === 'X' ? 'Player X Wins!' : gameMode === 'ai' ? 'Cyber AI Wins!' : 'Player O Wins!'}
              </span>
            )}
          </div>

          {/* 3x3 Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            width: '100%',
            maxWidth: '360px',
            aspectRatio: '1 / 1'
          }}>
            {board.map((cell, idx) => {
              const isWinningCell = winnerInfo?.line?.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleCellClick(idx, true)}
                  disabled={Boolean(cell || winnerInfo || (gameMode === 'ai' && !isXNext))}
                  style={{
                    backgroundColor: isWinningCell 
                      ? 'rgba(139, 92, 246, 0.3)' 
                      : 'rgba(19, 28, 48, 0.8)',
                    border: isWinningCell 
                      ? '2px solid var(--accent-cyan)' 
                      : '1px solid var(--border-color)',
                    borderRadius: '16px',
                    fontSize: '3rem',
                    fontWeight: '900',
                    fontFamily: 'var(--font-heading)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: cell === 'X' ? 'var(--accent-cyan)' : 'var(--accent-purple)',
                    textShadow: cell === 'X' 
                      ? '0 0 20px rgba(34, 211, 238, 0.7)' 
                      : '0 0 20px rgba(139, 92, 246, 0.7)',
                    transition: 'all 0.2s ease',
                    boxShadow: isWinningCell ? '0 0 25px rgba(34, 211, 238, 0.4)' : 'none',
                    transform: isWinningCell ? 'scale(1.03)' : 'none',
                    cursor: cell || winnerInfo ? 'default' : 'pointer'
                  }}
                >
                  {cell}
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem', width: '100%', maxWidth: '360px' }}>
            <button
              onClick={resetRound}
              className="btn-primary"
              style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}
            >
              <RotateCcw size={16} /> New Round
            </button>
          </div>
        </div>

        {/* Scoreboard and Info Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Scoreboard */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#FFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={18} color="var(--accent-purple)" /> Match Scoreboard
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              textAlign: 'center'
            }}>
              <div style={{
                background: 'rgba(8, 11, 22, 0.6)',
                border: '1px solid rgba(34, 211, 238, 0.3)',
                borderRadius: '12px',
                padding: '1rem 0.5rem'
              }}>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: '700', fontSize: '0.85rem' }}>Player X</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFF', marginTop: '0.25rem' }}>
                  {scores.x}
                </div>
              </div>

              <div style={{
                background: 'rgba(8, 11, 22, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1rem 0.5rem'
              }}>
                <div style={{ color: 'var(--text-secondary)', fontWeight: '700', fontSize: '0.85rem' }}>Draws</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFF', marginTop: '0.25rem' }}>
                  {scores.ties}
                </div>
              </div>

              <div style={{
                background: 'rgba(8, 11, 22, 0.6)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                padding: '1rem 0.5rem'
              }}>
                <div style={{ color: 'var(--accent-purple)', fontWeight: '700', fontSize: '0.85rem' }}>
                  {gameMode === 'ai' ? 'Cyber AI' : 'Player O'}
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFF', marginTop: '0.25rem' }}>
                  {scores.o}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                onClick={resetAllScores}
                style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'underline' }}
              >
                Reset Match Scores
              </button>
            </div>
          </div>

          {/* Strategy Tips */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', color: '#FFF', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="var(--accent-cyan)" /> Pro Tips
            </h4>
            <ul style={{
              paddingLeft: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)'
            }}>
              <li>Taking the center tile provides the strongest opening offensive posture.</li>
              <li>Every win earns <strong>+10 ST Points</strong> and helps unlock the <em>Tactical Mind</em> achievement.</li>
              <li>The Cyber AI actively predicts your traps—watch out for double forks!</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .tictac-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
