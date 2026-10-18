import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Gamepad2, 
  Brain, 
  Sparkles, 
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function About() {
  return (
    <div className="container" style={{ padding: '3rem 1rem 5rem 1rem', maxWidth: '960px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
          <Sparkles size={14} /> The Story of ST PlayZone
        </div>

        <h1 style={{ fontSize: '2.75rem', marginBottom: '1rem', letterSpacing: '-0.5px' }}>
          Play. Challenge. <span className="text-gradient">Level Up.</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
          Designed and engineered by <strong>Satyam Tiwari</strong> as a premier browser sanctuary uniting retro arcade reflex gameplay with brain-stimulating quizzes.
        </p>
      </div>

      {/* Founder Spotlight Card */}
      <div className="glass-card" style={{
        padding: '2.5rem',
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, rgba(19, 28, 48, 0.8) 0%, rgba(139, 92, 246, 0.12) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            color: '#FFF',
            fontWeight: '900',
            boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)'
          }}>
            ST
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', fontWeight: '700', textTransform: 'uppercase' }}>
              Founder & Architect
            </div>
            <h2 style={{ fontSize: '1.6rem', color: '#FFF' }}>
              Satyam Tiwari
            </h2>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1rem', marginBottom: '1.5rem' }}>
          "ST PlayZone was born from a simple conviction: gaming on the web should be lightning fast, beautifully styled, and intellectually rewarding. Too many web gaming sites are cluttered with intrusive ads, broken controls, and clunky interfaces. ST PlayZone provides a curated, sleek, responsive dark arena where players can unwind with polished casual mechanics, challenge their mental faculties, and celebrate progress through genuine achievements."
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="badge badge-purple">⚡ Creative Direction</span>
          <span className="badge badge-cyan">🎮 Game Logic</span>
          <span className="badge badge-green">🧠 Quiz Architecture</span>
        </div>
      </div>

      {/* Core Pillars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.75rem',
        marginBottom: '3.5rem'
      }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(34, 197, 94, 0.15)',
            color: '#4ADE80',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <Gamepad2 size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.5rem' }}>
            Reflex & Logic Arcade
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Classic playable browser games including Snake with keyboard + touch controls, Tic-Tac-Toe with adaptive AI, Holo Memory Match, and mathematically solvable 15-Puzzles.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(34, 211, 238, 0.15)',
            color: 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <Brain size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.5rem' }}>
            Curated Knowledge Quizzes
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Expand your mind across Computer Science, Science & Astronomy, and World Trivia with 15-second speed rounds, instant feedback, and detailed educational explanations.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(139, 92, 246, 0.15)',
            color: '#C084FC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <Award size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.5rem' }}>
            Rewards & Fair Play
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Earn virtual ST points for gameplay wins and quiz accuracy. 100% free, safe, and transparent—points are purely recreational achievement tokens with zero cash conversion.
          </p>
        </div>
      </div>

      {/* Tech Stack & Future Roadmap */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={22} color="var(--accent-cyan)" /> Engineering Architecture & Roadmap
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          ST PlayZone is engineered using a modular, scalable architecture. The frontend is built on <strong>React 19 + Vite</strong> with custom CSS variables, accessible semantics, responsive layouts, and local storage state persistence.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ background: 'rgba(8, 11, 22, 0.6)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: '700', color: 'var(--accent-purple)', marginBottom: '0.25rem' }}>Frontend MVP (Current)</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>React, Vite, React Router, Canvas Confetti, Lucide Icons, Glassmorphism design system.</div>
          </div>

          <div style={{ background: 'rgba(8, 11, 22, 0.6)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '0.25rem' }}>Backend (Phase 6)</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Node.js & Express.js REST APIs for score validation, anti-cheat, and encrypted sessions.</div>
          </div>

          <div style={{ background: 'rgba(8, 11, 22, 0.6)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: '700', color: 'var(--success)', marginBottom: '0.25rem' }}>Database (Phase 6)</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>MongoDB cloud cluster for persistent user profiles, global rankings, and match histories.</div>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div style={{ textAlign: 'center' }}>
        <Link to="/games" className="btn-primary" style={{ padding: '0.85rem 2.25rem', fontSize: '1.05rem' }}>
          <span>Jump Into The Games</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
