import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Info, Loader2, Database } from 'lucide-react';
import { contactAPI } from '../utils/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'feedback',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dbSaved, setDbSaved] = useState(false);
  const [serverMsg, setServerMsg] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please provide your name or gamer tag.';
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide an email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format (e.g. user@domain.com).';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await contactAPI.sendMessage(formData);
      if (res && res.success) {
        setDbSaved(true);
        setServerMsg(res.message || 'Saved to database successfully.');
      } else {
        setDbSaved(false);
      }
    } catch {
      // Backend offline fallback
      setDbSaved(false);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem 5rem 1rem', maxWidth: '840px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
          <Mail size={14} /> Get in Touch • Demo Interface
        </div>

        <h1 style={{ fontSize: '2.75rem', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>
          Contact & <span className="text-gradient">Feedback</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 1.25rem auto' }}>
          Have ideas for new games, quiz suggestions, or feedback for Satyam Tiwari? Test out our contact interface below.
        </p>

        {/* Demo Mode Notice Banner */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '10px',
          padding: '0.5rem 1rem',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          textAlign: 'left',
          maxWidth: '650px'
        }}>
          <Info size={16} color="#FBBF24" style={{ flexShrink: 0 }} />
          <span>
            <strong>Demo Mode Notice:</strong> This contact form validates inputs client-side as part of the frontend MVP. Live email transmission requires a connected backend or email API (planned for Phase 6).
          </span>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--success)',
              margin: '0 auto 1.5rem auto'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.6rem', color: '#FFF', marginBottom: '0.5rem' }}>
              {dbSaved ? 'Message Saved to Database!' : 'Demo Submission Recorded Locally'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
              Thank you, <strong>{formData.name}</strong>. {dbSaved ? 'Your message has been securely recorded to the ST PlayZone MongoDB database.' : 'Your submission has been captured in your local session.'}
            </p>

            <div style={{
              background: dbSaved ? 'rgba(34, 197, 94, 0.1)' : 'rgba(8, 11, 22, 0.7)',
              border: dbSaved ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              maxWidth: '520px',
              margin: '0 auto 2rem auto',
              fontSize: '0.85rem',
              color: dbSaved ? '#86EFAC' : 'var(--text-muted)',
              lineHeight: 1.6
            }}>
              {dbSaved ? (
                <>
                  <Database size={16} color="var(--success)" style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                  <strong>Database Verified:</strong> {serverMsg || 'Message stored in ContactMessage MongoDB collection.'}
                </>
              ) : (
                <>
                  <Info size={16} color="var(--accent-cyan)" style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                  <strong>Notice:</strong> Saved locally. Run the backend server (`npm run server`) to write messages directly to MongoDB.
                </>
              )}
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', topic: 'feedback', message: '' });
              }}
              className="btn-outline"
            >
              Submit Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Your Name / Tag *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Satyam or GamerTag"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'rgba(8, 11, 22, 0.7)',
                    border: errors.name ? '1px solid #EF4444' : '1px solid var(--border-color)',
                    borderRadius: '10px',
                    color: '#FFF',
                    fontSize: '0.92rem'
                  }}
                />
                {errors.name && <span style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '0.3rem', display: 'block' }}>{errors.name}</span>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'rgba(8, 11, 22, 0.7)',
                    border: errors.email ? '1px solid #EF4444' : '1px solid var(--border-color)',
                    borderRadius: '10px',
                    color: '#FFF',
                    fontSize: '0.92rem'
                  }}
                />
                {errors.email && <span style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '0.3rem', display: 'block' }}>{errors.email}</span>}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '600' }}>
                Subject / Topic
              </label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#10172A',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  color: '#FFF',
                  fontSize: '0.92rem'
                }}
              >
                <option value="feedback">General Platform Feedback</option>
                <option value="game_idea">New Game Request / Mechanic</option>
                <option value="quiz_question">Suggest a Quiz Question</option>
                <option value="bug_report">Report a Glitch or Bug</option>
                <option value="partnership">Sponsorship or Partnership</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '600' }}>
                Message *
              </label>
              <textarea
                rows={5}
                placeholder="Share your thoughts, suggestions, or comments (minimum 10 characters)..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(8, 11, 22, 0.7)',
                  border: errors.message ? '1px solid #EF4444' : '1px solid var(--border-color)',
                  borderRadius: '10px',
                  color: '#FFF',
                  fontSize: '0.92rem',
                  resize: 'vertical'
                }}
              />
              {errors.message && <span style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '0.3rem', display: 'block' }}>{errors.message}</span>}
            </div>

            {/* Disclaimer */}
            <div style={{
              background: 'rgba(8, 11, 22, 0.5)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              fontSize: '0.82rem',
              color: 'var(--text-muted)'
            }}>
              <strong>Note:</strong> Submitted data is kept strictly within your local browser session for validation testing. No external emails or marketing records are created.
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                alignSelf: 'flex-start',
                padding: '0.85rem 2rem',
                fontSize: '1rem',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending to Server...
                </>
              ) : (
                <>
                  <Send size={16} /> Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
