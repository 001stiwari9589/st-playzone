import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowLeft, 
  Trophy, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordGameEnd, addPoints } from '../utils/storage';
import { useGame } from '../context/GameContext';
import { playEatSound, playGameOverSound, playWinSound, isSoundEnabled, toggleSound } from '../utils/sound';

const GRID_SIZE = 20;
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 480;
const CELL_SIZE = CANVAS_WIDTH / GRID_SIZE; // 24px per cell

export default function SnakeGame() {
  const { stats } = useGame();
  const canvasRef = useRef(null);

  // Sound state
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  // Reactive UI state
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(stats.snakeHighScore || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState('normal'); // 'easy' (130ms), 'normal' (100ms), 'hard' (75ms)

  // Game internal state kept in refs for zero-latency, lag-free loop
  const gameStateRef = useRef({
    snake: [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ],
    direction: { x: 0, y: -1 }, // Moving up
    directionQueue: [],
    food: { x: 5, y: 5 },
    score: 0,
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    speed: 100,
    lastTick: 0,
    touchStartX: 0,
    touchStartY: 0
  });

  const animFrameIdRef = useRef(null);

  // Sound toggle handler
  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundOn(next);
  };

  // Generate valid food position
  const generateNewFood = (snake) => {
    while (true) {
      const rx = Math.floor(Math.random() * GRID_SIZE);
      const ry = Math.floor(Math.random() * GRID_SIZE);
      const conflict = snake.some((seg) => seg.x === rx && seg.y === ry);
      if (!conflict) return { x: rx, y: ry };
    }
  };

  // Change direction safely with a queue to support rapid keystrokes
  const queueDirection = useCallback((newDir) => {
    const state = gameStateRef.current;
    if (!state.isPlaying || state.isPaused || state.isGameOver) return;

    const lastDir = state.directionQueue.length > 0 
      ? state.directionQueue[state.directionQueue.length - 1] 
      : state.direction;

    // Disallow 180-degree immediate reverse into own body
    if (newDir.x === -lastDir.x && newDir.y === -lastDir.y) return;
    // Disallow same direction
    if (newDir.x === lastDir.x && newDir.y === lastDir.y) return;

    if (state.directionQueue.length < 2) {
      state.directionQueue.push(newDir);
    }
  }, []);

  // End game handler
  const triggerGameOver = useCallback(() => {
    const state = gameStateRef.current;
    state.isPlaying = false;
    state.isGameOver = true;
    setIsPlaying(false);
    setIsGameOver(true);

    playGameOverSound();

    const finalScore = state.score;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        playWinSound();
      } catch (e) {}
    }

    const earned = Math.min(30, Math.max(5, Math.floor(finalScore / 5)));
    addPoints(earned, `Earned in Neon Snake with ${finalScore} points!`);
    recordGameEnd({
      gameId: 'snake',
      win: finalScore >= 30,
      score: finalScore
    });
  }, [highScore]);

  // Start / Restart Game
  const startGame = useCallback(() => {
    const initialSnake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    const initialDir = { x: 0, y: -1 };
    const initialFood = generateNewFood(initialSnake);

    let speedVal = 100;
    if (difficulty === 'easy') speedVal = 130;
    if (difficulty === 'hard') speedVal = 75;

    gameStateRef.current = {
      ...gameStateRef.current,
      snake: initialSnake,
      direction: initialDir,
      directionQueue: [],
      food: initialFood,
      score: 0,
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      speed: speedVal,
      lastTick: performance.now()
    };

    setScore(0);
    setIsPlaying(true);
    setIsPaused(false);
    setIsGameOver(false);

    // Focus canvas so immediate arrow keys work
    if (canvasRef.current) {
      canvasRef.current.focus();
    }
  }, [difficulty]);

  const togglePause = useCallback(() => {
    const state = gameStateRef.current;
    if (!state.isPlaying || state.isGameOver) return;
    state.isPaused = !state.isPaused;
    setIsPaused(state.isPaused);
  }, []);

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent browser default scroll for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.code === 'Space') {
        const state = gameStateRef.current;
        if (!state.isPlaying) {
          startGame();
        } else {
          togglePause();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          queueDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          queueDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          queueDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          queueDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [queueDirection, startGame, togglePause]);

  // Touch Swipe on Canvas
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      gameStateRef.current.touchStartX = e.touches[0].clientX;
      gameStateRef.current.touchStartY = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e) => {
    if (!e.changedTouches || !e.changedTouches[0]) return;
    const deltaX = e.changedTouches[0].clientX - gameStateRef.current.touchStartX;
    const deltaY = e.changedTouches[0].clientY - gameStateRef.current.touchStartY;

    if (Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20) return; // ignore tap

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        queueDirection({ x: 1, y: 0 }); // Right
      } else {
        queueDirection({ x: -1, y: 0 }); // Left
      }
    } else {
      if (deltaY > 0) {
        queueDirection({ x: 0, y: 1 }); // Down
      } else {
        queueDirection({ x: 0, y: -1 }); // Up
      }
    }
  };

  // Main Render & Physics Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = (time) => {
      const state = gameStateRef.current;

      // Update game physics if running and time elapsed
      if (state.isPlaying && !state.isPaused && !state.isGameOver) {
        if (time - state.lastTick >= state.speed) {
          state.lastTick = time;

          // Consume next direction from queue if available
          if (state.directionQueue.length > 0) {
            state.direction = state.directionQueue.shift();
          }

          const head = state.snake[0];
          const newHead = {
            x: head.x + state.direction.x,
            y: head.y + state.direction.y,
          };

          // Wall collision
          if (
            newHead.x < 0 ||
            newHead.x >= GRID_SIZE ||
            newHead.y < 0 ||
            newHead.y >= GRID_SIZE
          ) {
            triggerGameOver();
          } else {
            // Self collision check
            const selfCrash = state.snake.some(
              (seg) => seg.x === newHead.x && seg.y === newHead.y
            );

            if (selfCrash) {
              triggerGameOver();
            } else {
              // Food collision
              const ateFood = newHead.x === state.food.x && newHead.y === state.food.y;
              state.snake.unshift(newHead);

              if (ateFood) {
                state.score += 10;
                setScore(state.score);
                state.food = generateNewFood(state.snake);
                playEatSound();

                // Gradually accelerate up to speed threshold
                state.speed = Math.max(55, state.speed - 2);
              } else {
                state.snake.pop();
              }
            }
          }
        }
      }

      // ---------------- DRAWING ROUTINE ----------------
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Background
      ctx.fillStyle = '#080B16';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Cyber Grid Lines
      ctx.strokeStyle = '#10172A';
      ctx.lineWidth = 1;
      for (let x = 0; x <= CANVAS_WIDTH; x += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y <= CANVAS_HEIGHT; y += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }

      // Draw Food (Pulsing glowing neon cyan orb)
      const food = state.food;
      const foodCenterX = food.x * CELL_SIZE + CELL_SIZE / 2;
      const foodCenterY = food.y * CELL_SIZE + CELL_SIZE / 2;
      const pulse = 1 + 0.15 * Math.sin(time / 150);

      // Food outer glow
      const foodGlow = ctx.createRadialGradient(
        foodCenterX, foodCenterY, 2,
        foodCenterX, foodCenterY, CELL_SIZE
      );
      foodGlow.addColorStop(0, '#22D3EE');
      foodGlow.addColorStop(0.5, 'rgba(34, 211, 238, 0.4)');
      foodGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = foodGlow;
      ctx.beginPath();
      ctx.arc(foodCenterX, foodCenterY, CELL_SIZE * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Food core
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(foodCenterX, foodCenterY, (CELL_SIZE / 3) * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Draw Snake Body
      const snake = state.snake;
      for (let i = snake.length - 1; i >= 0; i--) {
        const seg = snake[i];
        const isHead = i === 0;

        const segX = seg.x * CELL_SIZE + 2;
        const segY = seg.y * CELL_SIZE + 2;
        const segW = CELL_SIZE - 4;
        const segH = CELL_SIZE - 4;

        if (isHead) {
          // Neon Purple to Cyan glowing Head
          ctx.fillStyle = '#8B5CF6';
          ctx.shadowColor = '#8B5CF6';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.roundRect(segX, segY, segW, segH, 6);
          ctx.fill();
          ctx.shadowBlur = 0; // reset

          // Snake eyes
          ctx.fillStyle = '#22D3EE';
          const eyeSize = 3;
          let eye1 = { x: segX + 5, y: segY + 5 };
          let eye2 = { x: segX + segW - 7, y: segY + 5 };

          if (state.direction.x === 1) {
            eye1 = { x: segX + segW - 6, y: segY + 5 };
            eye2 = { x: segX + segW - 6, y: segY + segH - 7 };
          } else if (state.direction.x === -1) {
            eye1 = { x: segX + 4, y: segY + 5 };
            eye2 = { x: segX + 4, y: segY + segH - 7 };
          } else if (state.direction.y === 1) {
            eye1 = { x: segX + 5, y: segY + segH - 6 };
            eye2 = { x: segX + segW - 7, y: segY + segH - 6 };
          }

          ctx.fillRect(eye1.x, eye1.y, eyeSize, eyeSize);
          ctx.fillRect(eye2.x, eye2.y, eyeSize, eyeSize);
        } else {
          // Alternating Electric Purple and Cyan Body Segments
          ctx.fillStyle = i % 2 === 0 ? '#7C3AED' : '#6366F1';
          ctx.beginPath();
          ctx.roundRect(segX, segY, segW, segH, 4);
          ctx.fill();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameIdRef.current);
  }, [triggerGameOver]);

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
          <Link
            to="/games"
            className="btn-outline"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} /> All Games
          </Link>
          <div>
            <h1 style={{ fontSize: '2.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span>Neon Snake</span>
              <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>Arcade</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Smooth 60 FPS neon arcade physics with instant keyboard & touch steering.
            </p>
          </div>
        </div>

        {/* Top Controls & Scores */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="btn-outline"
            style={{ padding: '0.55rem', borderRadius: '10px' }}
            title={soundOn ? 'Sound is ON' : 'Sound is OFF'}
            aria-label="Toggle Sound"
          >
            {soundOn ? <Volume2 size={18} color="var(--accent-cyan)" /> : <VolumeX size={18} color="var(--text-muted)" />}
          </button>

          {/* Speed Selector */}
          <div style={{
            display: 'flex',
            background: 'rgba(19, 28, 48, 0.8)',
            borderRadius: 'var(--radius-md)',
            padding: '0.25rem',
            border: '1px solid var(--border-color)'
          }}>
            {['easy', 'normal', 'hard'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setDifficulty(lvl);
                  if (isPlaying) startGame();
                }}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  background: difficulty === lvl ? 'var(--accent-purple)' : 'transparent',
                  color: difficulty === lvl ? '#FFF' : 'var(--text-secondary)'
                }}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Current Score */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 1.1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Score</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--accent-cyan)', lineHeight: 1.1 }}>{score}</div>
          </div>

          {/* Best Score */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 1.1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#DDD6FE', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Trophy size={11} /> Best
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--accent-purple)', lineHeight: 1.1 }}>{highScore}</div>
          </div>
        </div>
      </div>

      {/* Main Game Stage */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 510px) 1fr',
        gap: '2.5rem',
        alignItems: 'start'
      }} className="snake-layout">
        {/* Canvas Game Stage */}
        <div style={{
          background: 'rgba(13, 19, 33, 0.95)',
          border: '2px solid #263247',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(139, 92, 246, 0.2)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* HTML5 Canvas Container */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: `${CANVAS_WIDTH}px`,
            aspectRatio: '1 / 1',
            borderRadius: '14px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              tabIndex={0}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                outline: 'none',
                touchAction: 'none',
                cursor: isPlaying ? 'crosshair' : 'default'
              }}
            />

            {/* Overlay: Game Start Banner */}
            {!isPlaying && !isGameOver && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(8, 11, 22, 0.88)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  marginBottom: '1rem',
                  boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)'
                }}>
                  <Play size={32} fill="#FFFFFF" />
                </div>
                <h3 style={{ fontSize: '1.75rem', color: '#FFF', marginBottom: '0.4rem' }}>
                  Ready to Slither?
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '300px', marginBottom: '1.5rem' }}>
                  Control with Arrow Keys, WASD, or Swipe on screen. Press Space to pause.
                </p>
                <button
                  onClick={startGame}
                  className="btn-primary"
                  style={{ padding: '0.85rem 2.5rem', fontSize: '1.05rem' }}
                >
                  Start Game
                </button>
              </div>
            )}

            {/* Overlay: Paused */}
            {isPaused && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(8, 11, 22, 0.85)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
              }}>
                <h3 style={{ fontSize: '1.75rem', color: 'var(--accent-cyan)' }}>Game Paused</h3>
                <button onClick={togglePause} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
                  Resume
                </button>
              </div>
            )}

            {/* Overlay: Game Over */}
            {isGameOver && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.94)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#EF4444',
                  marginBottom: '0.75rem'
                }}>
                  <ShieldAlert size={32} />
                </div>
                <h3 style={{ fontSize: '1.75rem', color: '#FFF', marginBottom: '0.25rem' }}>
                  Game Over!
                </h3>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Final Score: <strong style={{ color: 'var(--accent-cyan)' }}>{score}</strong>
                </div>

                {score >= highScore && score > 0 && (
                  <div className="badge badge-purple" style={{ marginBottom: '1.25rem', padding: '0.35rem 0.85rem' }}>
                    🏆 New Personal High Score!
                  </div>
                )}

                <button onClick={startGame} className="btn-primary" style={{ padding: '0.75rem 2.2rem' }}>
                  <RotateCcw size={16} /> Play Again
                </button>
              </div>
            )}
          </div>

          {/* Quick Buttons Below Canvas */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1rem',
            width: '100%',
            maxWidth: `${CANVAS_WIDTH}px`,
            gap: '0.75rem'
          }}>
            {isPlaying && (
              <button
                onClick={togglePause}
                className="btn-outline"
                style={{ flex: 1, padding: '0.65rem' }}
              >
                {isPaused ? <Play size={15} /> : <Pause size={15} />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
            )}

            <button
              onClick={startGame}
              className="btn-outline"
              style={{ flex: 1, padding: '0.65rem' }}
            >
              <RotateCcw size={15} />
              <span>Restart</span>
            </button>
          </div>
        </div>

        {/* Right Side: Responsive Controls & Strategy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Instant Responsive On-Screen Virtual D-Pad with Zero Latency Touch */}
          <div className="glass-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <h4 style={{ fontSize: '1.05rem', color: '#FFF', marginBottom: '0.25rem' }}>
              Touch & Click Controls
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Tap directional keys or swipe directly on the canvas
            </p>

            <div style={{
              display: 'inline-grid',
              gridTemplateColumns: 'repeat(3, 62px)',
              gridTemplateRows: 'repeat(3, 62px)',
              gap: '10px',
              justifyContent: 'center',
              touchAction: 'manipulation'
            }}>
              <div />
              <button
                onTouchStart={(e) => { e.preventDefault(); queueDirection({ x: 0, y: -1 }); }}
                onClick={() => queueDirection({ x: 0, y: -1 })}
                className="btn-outline"
                style={{
                  borderRadius: '14px',
                  padding: 0,
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.4)'
                }}
                aria-label="Move Up"
              >
                <ChevronUp size={28} color="var(--accent-cyan)" />
              </button>
              <div />

              <button
                onTouchStart={(e) => { e.preventDefault(); queueDirection({ x: -1, y: 0 }); }}
                onClick={() => queueDirection({ x: -1, y: 0 })}
                className="btn-outline"
                style={{
                  borderRadius: '14px',
                  padding: 0,
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.4)'
                }}
                aria-label="Move Left"
              >
                <ChevronLeft size={28} color="var(--accent-cyan)" />
              </button>

              <div style={{
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontWeight: '700'
              }}>
                PAD
              </div>

              <button
                onTouchStart={(e) => { e.preventDefault(); queueDirection({ x: 1, y: 0 }); }}
                onClick={() => queueDirection({ x: 1, y: 0 })}
                className="btn-outline"
                style={{
                  borderRadius: '14px',
                  padding: 0,
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.4)'
                }}
                aria-label="Move Right"
              >
                <ChevronRight size={28} color="var(--accent-cyan)" />
              </button>

              <div />
              <button
                onTouchStart={(e) => { e.preventDefault(); queueDirection({ x: 0, y: 1 }); }}
                onClick={() => queueDirection({ x: 0, y: 1 })}
                className="btn-outline"
                style={{
                  borderRadius: '14px',
                  padding: 0,
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.4)'
                }}
                aria-label="Move Down"
              >
                <ChevronDown size={28} color="var(--accent-cyan)" />
              </button>
              <div />
            </div>
          </div>

          {/* Rules and Rewards Card */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h4 style={{ fontSize: '1.05rem', color: '#FFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} color="var(--accent-purple)" /> Rules & ST Rewards
            </h4>
            <ul style={{
              paddingLeft: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              <li>Collect glowing cyan energy pulses to grow longer (<strong>+10 points each</strong>).</li>
              <li>Avoid colliding with the perimeter boundaries or crossing your own tail.</li>
              <li>Score <strong>50+ points</strong> to unlock the <em>Snake Charmer</em> achievement badge.</li>
              <li>Earn bonus ST virtual points to climb the global leaderboard.</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .snake-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
