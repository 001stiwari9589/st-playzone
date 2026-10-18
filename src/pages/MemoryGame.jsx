import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  RotateCcw, 
  Clock, 
  Move, 
  Star, 
  Sparkles, 
  Award, 
  Eye, 
  HelpCircle, 
  CheckCircle2, 
  X,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordGameEnd, addPoints } from '../utils/storage';
import { useGame } from '../context/GameContext';
import { playMoveSound, playEatSound, playWinSound } from '../utils/sound';

const CARD_SYMBOLS = [
  { id: 'gamepad', icon: '🎮', label: 'Arcade Core' },
  { id: 'sword', icon: '⚔️', label: 'Plasma Blade' },
  { id: 'shield', icon: '🛡️', label: 'Force Barrier' },
  { id: 'trophy', icon: '🏆', label: 'Grand Chalice' },
  { id: 'diamond', icon: '💎', label: 'Cyber Crystal' },
  { id: 'zap', icon: '⚡', label: 'Voltage Surge' },
  { id: 'flame', icon: '🔥', label: 'Inferno Spark' },
  { id: 'rocket', icon: '🚀', label: 'Quantum Warp' },
];

export default function MemoryGame() {
  const { stats } = useGame();
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [bestMoves, setBestMoves] = useState(stats.memoryBestMoves || null);
  
  // New user assistance states
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [peekCooldown, setPeekCooldown] = useState(false);
  const [mismatchIndices, setMismatchIndices] = useState([]);
  const [turnStatus, setTurnStatus] = useState('first'); // 'first' | 'second' | 'match' | 'mismatch'

  const timerRef = useRef(null);

  // Initialize and shuffle cards
  const initializeGame = () => {
    const deck = [...CARD_SYMBOLS, ...CARD_SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        instanceId: index,
        ...item,
      }));

    setCards(deck);
    setFlippedIndices([]);
    setMatchedIds([]);
    setMismatchIndices([]);
    setMoves(0);
    setTimeSeconds(0);
    setIsTimerRunning(false);
    setIsWon(false);
    setIsPeeking(false);
    setTurnStatus('first');

    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    initializeGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer runner
  useEffect(() => {
    if (isTimerRunning && !isWon) {
      timerRef.current = setInterval(() => {
        setTimeSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, isWon]);

  // Peek all cards for 3 seconds helper
  const handlePeekAll = () => {
    if (isPeeking || peekCooldown || isWon) return;
    setIsPeeking(true);
    setPeekCooldown(true);

    setTimeout(() => {
      setIsPeeking(false);
      setTimeout(() => setPeekCooldown(false), 5000); // 5s cooldown
    }, 3000);
  };

  // Handle Card Click
  const handleCardClick = (index) => {
    if (isPeeking) return;
    if (flippedIndices.length === 2) return;
    if (flippedIndices.includes(index)) return;
    if (matchedIds.includes(cards[index].id)) return;
    if (isWon) return;

    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    playMoveSound();
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);
    setMismatchIndices([]);

    if (newFlipped.length === 1) {
      setTurnStatus('second');
    } else if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.id === secondCard.id) {
        // MATCH!
        playEatSound();
        setTurnStatus('match');
        const newMatched = [...matchedIds, firstCard.id];
        setMatchedIds(newMatched);
        setFlippedIndices([]);

        if (newMatched.length === CARD_SYMBOLS.length) {
          handleVictory(moves + 1);
        } else {
          setTimeout(() => setTurnStatus('first'), 1200);
        }
      } else {
        // MISMATCH!
        setTurnStatus('mismatch');
        setMismatchIndices([firstIdx, secondIdx]);

        setTimeout(() => {
          setFlippedIndices([]);
          setMismatchIndices([]);
          setTurnStatus('first');
        }, 900);
      }
    }
  };

  const handleVictory = (finalMoves) => {
    setIsWon(true);
    setIsTimerRunning(false);
    playWinSound();

    if (!bestMoves || finalMoves < bestMoves) {
      setBestMoves(finalMoves);
    }

    addPoints(15, `Matched all Holo Cards in ${finalMoves} moves!`);
    recordGameEnd({
      gameId: 'memory',
      win: true,
      moves: finalMoves
    });

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const calculateStars = () => {
    if (moves <= 14) return 3;
    if (moves <= 20) return 2;
    return 1;
  };

  const firstFlippedCard = flippedIndices.length === 1 ? cards[flippedIndices[0]] : null;

  return (
    <div className="container" style={{ padding: '2.5rem 1rem 4rem 1rem' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/games" className="btn-outline" style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> All Games
          </Link>
          <div>
            <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Holo Memory Match</span>
              <span className="badge badge-cyan">Brain Arena</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Dono same cards dhoondh kar pair banana hai (Card Pair Matching Game).
            </p>
          </div>
        </div>

        {/* Action Controls & Live Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Rules / Niyam Button */}
          <button
            onClick={() => setShowRulesModal(true)}
            className="btn-secondary"
            style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
          >
            <HelpCircle size={16} /> Khelne Ka Niyam
          </button>

          {/* Peek 3s Button */}
          <button
            onClick={handlePeekAll}
            disabled={isPeeking || peekCooldown || isWon}
            className="btn-outline"
            style={{
              padding: '0.55rem 1rem',
              fontSize: '0.85rem',
              color: isPeeking ? 'var(--accent-cyan)' : 'var(--text-primary)',
              borderColor: isPeeking ? 'var(--accent-cyan)' : 'var(--border-color)'
            }}
            title="3 seconds ke liye sabhi cards preview karein"
          >
            <Eye size={16} /> {isPeeking ? 'Peeking (3s)...' : 'Peek Cards (Hint)'}
          </button>

          {/* Moves Count */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.45rem 1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Move size={11} /> Moves
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-cyan)', lineHeight: 1.1 }}>
              {moves}
            </div>
          </div>

          {/* Time */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.45rem 1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Clock size={11} /> Time
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFF', lineHeight: 1.1 }}>
              {formatTime(timeSeconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Quick Guide Banner (Hindi + English) */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(34, 211, 238, 0.15) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--accent-purple)',
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800'
          }}>
            ?
          </div>
          <div style={{ fontSize: '0.9rem' }}>
            <strong style={{ color: '#FFF' }}>Game Ka Niyam: </strong>
            <span style={{ color: 'var(--text-secondary)' }}>
              16 cards mein se 2 same cards (jodi) dhoondhni hai. Dono same milte hi wo lock ho jayenge!
            </span>
          </div>
        </div>

        {/* Pairs matched badge */}
        <div style={{
          background: 'rgba(8, 11, 22, 0.7)',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          border: '1px solid var(--border-color)',
          fontSize: '0.82rem',
          color: 'var(--accent-cyan)',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <CheckCircle2 size={14} color="var(--success)" />
          Pairs Matched: {matchedIds.length} / 8
        </div>
      </div>

      {/* Main Game Stage */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 620px) 1fr',
        gap: '2.5rem',
        alignItems: 'start'
      }} className="memory-layout">
        {/* Card Grid Container */}
        <div style={{
          background: 'rgba(13, 19, 33, 0.95)',
          border: '2px solid #263247',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(34, 211, 238, 0.15)',
          position: 'relative'
        }}>
          {/* Dynamic Turn Instruction Bar */}
          <div style={{
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            textAlign: 'center',
            fontSize: '0.88rem',
            fontWeight: '600',
            transition: 'all 0.25s ease',
            backgroundColor: turnStatus === 'match' 
              ? 'rgba(34, 197, 94, 0.2)' 
              : turnStatus === 'mismatch'
              ? 'rgba(239, 68, 68, 0.2)'
              : turnStatus === 'second'
              ? 'rgba(139, 92, 246, 0.2)'
              : 'rgba(34, 211, 238, 0.12)',
            color: turnStatus === 'match'
              ? '#4ADE80'
              : turnStatus === 'mismatch'
              ? '#F87171'
              : turnStatus === 'second'
              ? '#DDD6FE'
              : 'var(--accent-cyan)',
            border: turnStatus === 'match'
              ? '1px solid var(--success)'
              : turnStatus === 'mismatch'
              ? '1px solid #EF4444'
              : turnStatus === 'second'
              ? '1px solid var(--accent-purple)'
              : '1px solid rgba(34, 211, 238, 0.3)'
          }}>
            {turnStatus === 'first' && '👉 Step 1: Kisi bhi card par click kijiye pehla symbol dekhne ke liye'}
            {turnStatus === 'second' && firstFlippedCard && `👉 Step 2: Ab doosra card click karke matching "${firstFlippedCard.label} ${firstFlippedCard.icon}" dhoondhiye!`}
            {turnStatus === 'match' && '🎉 Badiya! Pair match ho gaya! (+1 Locked)'}
            {turnStatus === 'mismatch' && '❌ Dono cards alag the! Unki jagah yaad rakhein aur doosra try karein.'}
          </div>

          {/* 4x4 Grid of Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            aspectRatio: '1 / 1'
          }}>
            {cards.map((card, idx) => {
              const isFlipped = flippedIndices.includes(idx);
              const isMatched = matchedIds.includes(card.id);
              const isMismatch = mismatchIndices.includes(idx);
              const showFront = isFlipped || isMatched || isPeeking;

              let bgColor = 'rgba(19, 28, 48, 0.85)';
              let borderColor = 'var(--border-color)';
              let shadow = 'none';

              if (isMatched) {
                bgColor = 'rgba(34, 197, 94, 0.2)';
                borderColor = 'var(--success)';
                shadow = '0 0 20px rgba(34, 197, 94, 0.4)';
              } else if (isMismatch) {
                bgColor = 'rgba(239, 68, 68, 0.25)';
                borderColor = '#EF4444';
                shadow = '0 0 20px rgba(239, 68, 68, 0.5)';
              } else if (showFront) {
                bgColor = 'rgba(34, 211, 238, 0.2)';
                borderColor = 'var(--accent-cyan)';
                shadow = '0 0 20px rgba(34, 211, 238, 0.35)';
              }

              return (
                <button
                  key={card.instanceId}
                  onClick={() => handleCardClick(idx)}
                  disabled={showFront || isWon || isPeeking}
                  style={{
                    backgroundColor: bgColor,
                    border: `2px solid ${borderColor}`,
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: showFront ? 'default' : 'pointer',
                    transition: 'all 0.25s ease',
                    transform: showFront ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: shadow,
                    position: 'relative'
                  }}
                >
                  {showFront ? (
                    <>
                      <span style={{ fontSize: '2.4rem', lineHeight: 1 }}>{card.icon}</span>
                      <span style={{
                        fontSize: '0.68rem',
                        color: isMatched ? '#4ADE80' : 'var(--text-secondary)',
                        marginTop: '0.35rem',
                        fontWeight: '700'
                      }}>
                        {card.label}
                      </span>
                      {isMatched && (
                        <span style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: 'var(--success)',
                          color: '#000',
                          fontSize: '0.55rem',
                          fontWeight: '900',
                          padding: '1px 4px',
                          borderRadius: '4px'
                        }}>
                          MATCH
                        </span>
                      )}
                    </>
                  ) : (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-purple)',
                        fontWeight: '900',
                        fontSize: '0.9rem'
                      }}>
                        ST
                      </div>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Tap to flip</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Victory Modal Overlay */}
          {isWon && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(8, 11, 22, 0.94)',
              backdropFilter: 'blur(8px)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              textAlign: 'center',
              zIndex: 10
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(34, 211, 238, 0.2)',
                border: '1px solid var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)',
                marginBottom: '1rem'
              }}>
                <Award size={36} />
              </div>

              <h2 style={{ fontSize: '1.75rem', color: '#FFF', marginBottom: '0.5rem' }}>
                Shabash! Sabhi 8 Pairs Match Ho Gaye!
              </h2>

              {/* Star Rating */}
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    fill={i < calculateStars() ? '#F59E0B' : 'none'}
                    color={i < calculateStars() ? '#F59E0B' : 'var(--text-muted)'}
                  />
                ))}
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Aapne <strong style={{ color: '#FFF' }}>{moves} moves</strong> ({formatTime(timeSeconds)}) mein poora kiya. +15 ST Points added!
              </p>

              <button onClick={initializeGame} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
                <RotateCcw size={16} /> Dobara Khelein (Play Again)
              </button>
            </div>
          )}

          {/* Action Row */}
          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center' }}>
            <button onClick={initializeGame} className="btn-outline" style={{ padding: '0.65rem 1.5rem' }}>
              <RotateCcw size={14} /> Restart / Naya Grid Banayein
            </button>
          </div>
        </div>

        {/* Side Panel: Rules & Instructions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Step by Step Hindi Rules Card */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#FFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={18} color="var(--accent-cyan)" /> Khelne Ka Tareeka (Rules)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(139, 92, 246, 0.2)',
                  color: 'var(--accent-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  flexShrink: 0
                }}>1</div>
                <div>
                  <strong style={{ color: '#FFF' }}>Pehla Card Kholein:</strong>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Kisi bhi card par click karein. Uska symbol (jaise 🎮, ⚔️, ⚡) aur naam dhyan se dekhein.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(34, 211, 238, 0.2)',
                  color: 'var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  flexShrink: 0
                }}>2</div>
                <div>
                  <strong style={{ color: '#FFF' }}>Doosra Card Dhoondhein:</strong>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Doosre card par click karein. Agar dono par same symbol nikla to **Pair MATCH** ho jayega aur green ho kar lock rahega!
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#F87171',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  flexShrink: 0
                }}>3</div>
                <div>
                  <strong style={{ color: '#FFF' }}>Agar Mismatch Hua To:</strong>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Dono cards wapas band ho jayenge. Dimaag mein yaad rakhein ki kaun sa card kahan tha!
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(34, 197, 94, 0.2)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  flexShrink: 0
                }}>4</div>
                <div>
                  <strong style={{ color: '#FFF' }}>Jeet Ka Niyam:</strong>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Kul 8 pairs hain. Sabhi 8 pairs ko kam se kam moves mein unlock karke jeetein aur ST Points earn karein!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Criteria */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', color: '#FFF', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="var(--accent-cyan)" /> Star Ratings & Bonus
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>⭐⭐⭐ 3 Stars</span>
                <strong style={{ color: '#FBBF24' }}>&le; 14 Moves</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>⭐⭐ 2 Stars</span>
                <strong style={{ color: '#FBBF24' }}>15 - 20 Moves</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>⭐ 1 Star</span>
                <strong style={{ color: '#FBBF24' }}>21+ Moves</strong>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', color: 'var(--accent-cyan)', fontSize: '0.8rem' }}>
                ⚡ 16 ya kam moves mein jeetne par "Memory Prodigy" badge unlock hoga (+20 bonus points)!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Modal */}
      {showRulesModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 9999
        }}>
          <div className="glass-card" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '2rem',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowRulesModal(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                color: 'var(--text-muted)'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={22} color="var(--accent-cyan)" />
              Holo Memory Match Kaise Khele?
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <p>
                <strong>Khel ka lakshya (Goal):</strong> Board par 16 cards hain jinme 8 alag-alag symbols ke jode (pairs) chhupe hain. Aapko har pair ko dhoondhna hai.
              </p>
              <p>
                <strong>Kaise khelte hain:</strong>
                <br />1. Kisi 1st card par tap karein—card khulega aur uska symbol dikhega.
                <br />2. Kisi doosre 2nd card par tap karein.
                <br />3. Agar dono cards same hain, to wo pair lock ho jayega (Match)!
                <br />4. Agar dono alag hain, to wo 1 second baad wapas band ho jayenge.
                <br />5. Dimaag mein yaad rakhein kaun sa icon kahan chhipa tha.
              </p>
              <p style={{ color: 'var(--accent-cyan)' }}>
                💡 <strong>Hint:</strong> Agar shuruaat mein symbols dekhna chahein, to "Peek Cards (Hint)" button dabayein, jisse 3 seconds ke liye saare cards dikh jayenge!
              </p>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="btn-primary"
              style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem' }}
            >
              Samajh Gaya, Khelte Hain!
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .memory-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
