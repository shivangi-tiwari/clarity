'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';

export default function EmailModal({ isOpen, onClose, recipientEmail }) {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || 'Failed to send email', 'error');
        setSending(false);
        return;
      }

      const data = await res.json();
      showToast(data.message || 'Message sent successfully!', 'success');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => onClose(), 500);
    } catch (err) {
      console.error('Error:', err);
      showToast('Network error', 'error');
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Send an Email</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Your Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Your Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Message *</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Type your message..."
              rows="5"
              className="form-textarea"
            ></textarea>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={sending} className="btn btn-primary">
              {sending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .modal-content {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: var(--space-2xl);
          max-width: 500px;
          width: 90%;
          z-index: 1000;
          box-shadow: var(--shadow-lg);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
        }

        .modal-header h3 {
          margin: 0;
          color: var(--text-primary);
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-muted);
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close:hover {
          color: var(--text-primary);
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .form-input,
        .form-textarea {
          padding: var(--space-sm) var(--space-md);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 1rem;
          color: var(--text-primary);
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--brown-500);
          box-shadow: 0 0 0 3px rgba(139, 111, 71, 0.1);
        }

        .form-textarea {
          resize: vertical;
          font-size: 0.95rem;
        }

        .modal-actions {
          display: flex;
          gap: var(--space-md);
          margin-top: var(--space-lg);
          justify-content: flex-end;
        }

        .btn {
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-md);
          border: none;
          font-weight: 500;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}
