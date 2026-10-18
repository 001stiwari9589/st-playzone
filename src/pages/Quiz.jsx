import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QUIZ_CATEGORIES, QUIZ_DATA } from '../data/questions';
import { 
  Brain, 
  Terminal, 
  Atom, 
  Globe, 
  Flame, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  RotateCcw, 
  ChevronRight, 
  Zap, 
  ArrowLeft 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordQuizEnd, addPoints } from '../utils/storage';
import { playEatSound, playGameOverSound, playWinSound } from '../utils/sound';

const categoryIcons = {
  Terminal,
  Atom,
  Globe,
  Flame,
};

const QUESTION_TIME_LIMIT = 15; // 15 seconds per question

export default function Quiz() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const timerRef = useRef(null);

  // Handle timeout
  const handleTimeOut = useCallback(() => {
    setIsAnswered((alreadyAnswered) => {
      if (alreadyAnswered) return true;
      setSelectedOption(-1);
      return true;
    });
  }, []);

  // Start category quiz
  const handleSelectCategory = (catId) => {
    const rawQuestions = QUIZ_DATA[catId] || [];
    // Shuffle questions slightly for freshness
    const shuffled = [...rawQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setSelectedCategory(catId);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setTimeLeft(QUESTION_TIME_LIMIT);
    setIsQuizComplete(false);
  };

  // Timer runner per question
  useEffect(() => {
    if (!selectedCategory || isQuizComplete || isAnswered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedCategory, currentIdx, isAnswered, isQuizComplete, handleTimeOut]);

  // Handle Option Click
  const handleOptionClick = (index) => {
    if (isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(index);
    setIsAnswered(true);

    const currQ = questions[currentIdx];
    if (index === currQ.correctIndex) {
      setScore((prev) => prev + 1);
      playEatSound();
    } else {
      playGameOverSound();
    }
  };

  // Move to next question or end
  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(QUESTION_TIME_LIMIT);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsQuizComplete(true);
    playWinSound();
    const finalScore = score + (selectedOption === questions[currentIdx]?.correctIndex ? 1 : 0);
    const total = questions.length;
    const isPerfect = finalScore === total;

    // Calculate and award points
    let pointsAwarded = 10;
    if (isPerfect) pointsAwarded += 20;
    if (selectedCategory === 'daily') pointsAwarded += 5;

    addPoints(pointsAwarded, `Completed ${selectedCategory.toUpperCase()} Quiz with score ${finalScore}/${total}`);
    recordQuizEnd({
      category: selectedCategory,
      correct: finalScore,
      total: total
    });

    if (finalScore >= Math.ceil(total * 0.7)) {
      try {
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const currQuestion = questions[currentIdx];
  const activeCategoryMeta = QUIZ_CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="container" style={{ padding: '3rem 1rem 5rem 1rem' }}>
      {/* Category Selection View */}
      {!selectedCategory ? (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(34, 211, 238, 0.15)',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              color: '#67E8F9',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              <Brain size={14} /> Cognitive Arenas
            </div>
            <h1 style={{ fontSize: '2.75rem', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>
              Knowledge & Trivia <span className="text-gradient">Challenges</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '620px', margin: '0 auto' }}>
              Pick a discipline, race against the 15-second countdown timer, expand your knowledge, and earn ST points.
            </p>
          </div>

          {/* Category Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {QUIZ_CATEGORIES.map((cat) => {
              const IconComp = categoryIcons[cat.icon] || Brain;
              return (
                <div
                  key={cat.id}
                  className="glass-card"
                  style={{
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                  onClick={() => handleSelectCategory(cat.id)}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      background: `${cat.color}20`,
                      border: `1px solid ${cat.color}50`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: cat.color,
                      marginBottom: '1.25rem'
                    }}>
                      <IconComp size={26} />
                    </div>

                    <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: '#FFF' }}>
                      {cat.name}
                    </h3>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                      {cat.description}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '1rem',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>{cat.questionCount} Questions</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      Start Quiz <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : isQuizComplete ? (
        /* Results View */
        <div className="glass-card" style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '3rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
          }}>
            <Trophy size={36} color="#FFF" />
          </div>

          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            Quiz Completed!
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem' }}>
            Category: <strong style={{ color: '#FFF' }}>{activeCategoryMeta?.name}</strong>
          </p>

          <div style={{
            background: 'rgba(8, 11, 22, 0.7)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.75rem',
            marginBottom: '2rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Your Score</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent-cyan)' }}>
                {score} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ {questions.length}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#FFF' }}>
                {Math.round((score / questions.length) * 100)}%
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '12px',
            padding: '0.85rem',
            color: '#4ADE80',
            fontWeight: '600',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}>
            <Zap size={18} fill="#4ADE80" />
            +{(score === questions.length ? 30 : 10)} ST Points Added to Profile!
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleSelectCategory(selectedCategory)}
              className="btn-primary"
              style={{ padding: '0.75rem 1.75rem' }}
            >
              <RotateCcw size={16} /> Retake Quiz
            </button>
            <button
              onClick={() => setSelectedCategory(null)}
              className="btn-outline"
              style={{ padding: '0.75rem 1.75rem' }}
            >
              Choose Another Category
            </button>
          </div>
        </div>
      ) : (
        /* Active Quiz Question View */
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          {/* Top Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <button
              onClick={() => setSelectedCategory(null)}
              className="btn-outline"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            >
              <ArrowLeft size={14} /> Exit
            </button>

            <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Question {currentIdx + 1} of {questions.length}
            </span>

            {/* Countdown Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '9999px',
              background: timeLeft <= 5 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 211, 238, 0.15)',
              border: timeLeft <= 5 ? '1px solid #EF4444' : '1px solid rgba(34, 211, 238, 0.3)',
              color: timeLeft <= 5 ? '#F87171' : 'var(--accent-cyan)',
              fontWeight: '700',
              fontSize: '0.9rem'
            }}>
              <Clock size={16} />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '9999px',
            marginBottom: '2rem',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentIdx + 1) / questions.length) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-cyan))',
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Question Card */}
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{
              fontSize: '1.4rem',
              lineHeight: 1.4,
              color: '#FFFFFF',
              marginBottom: '2rem',
              letterSpacing: '-0.2px'
            }}>
              {currQuestion.question}
            </h2>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {currQuestion.options.map((option, optIdx) => {
                let btnBg = 'rgba(8, 11, 22, 0.6)';
                let btnBorder = '1px solid var(--border-color)';
                let textColor = '#F8FAFC';
                let icon = null;

                if (isAnswered) {
                  if (optIdx === currQuestion.correctIndex) {
                    btnBg = 'rgba(34, 197, 94, 0.2)';
                    btnBorder = '2px solid #22C55E';
                    textColor = '#4ADE80';
                    icon = <CheckCircle2 size={20} color="#22C55E" />;
                  } else if (optIdx === selectedOption) {
                    btnBg = 'rgba(239, 68, 68, 0.2)';
                    btnBorder = '2px solid #EF4444';
                    textColor = '#F87171';
                    icon = <XCircle size={20} color="#EF4444" />;
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleOptionClick(optIdx)}
                    disabled={isAnswered}
                    style={{
                      background: btnBg,
                      border: btnBorder,
                      borderRadius: '12px',
                      padding: '1rem 1.25rem',
                      textAlign: 'left',
                      color: textColor,
                      fontSize: '1rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                      cursor: isAnswered ? 'default' : 'pointer'
                    }}
                    onMouseOver={(e) => {
                      if (!isAnswered) {
                        e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                        e.currentTarget.style.background = 'rgba(34, 211, 238, 0.08)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isAnswered) {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.background = 'rgba(8, 11, 22, 0.6)';
                      }
                    }}
                  >
                    <span>{option}</span>
                    {icon}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation Snippet & Next Control */}
          {isAnswered && (
            <div className="glass-card" style={{
              padding: '1.25rem 1.5rem',
              animation: 'fadeIn 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div>
                <strong style={{ color: 'var(--accent-cyan)', fontSize: '0.88rem' }}>Explanation: </strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {currQuestion.explanation}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleNextQuestion} className="btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
                  <span>{currentIdx + 1 < questions.length ? 'Next Question' : 'View Results'}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
