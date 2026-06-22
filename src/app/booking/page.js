'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { useToast } from '@/hooks/useToast';
import { PERSON_FIRST_NAME } from '@/lib/messages';

const discoverySession = { label: 'Discovery Call', duration: '30 min', price: 'Free', icon: '🌱' };

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
];

function BookingContent() {
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    timeSlot: '',
    sessionType: 'discovery',
    message: '',
  });

  const [bookedSlots, setBookedSlots] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast, ToastComponent } = useToast();
  const BOOKING_FORM_URL = process.env.NEXT_PUBLIC_BOOKING_FORM_URL || '';

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (!form.date) return;
    const fetchSlots = async () => {
      try {
        const res = await fetch(`/api/booking?date=${form.date}`);
        const data = await res.json();
        if (res.ok) setBookedSlots(data.bookedSlots || []);
      } catch {
        setBookedSlots([]);
      }
    };
    fetchSlots();
    setForm(prev => ({ ...prev, timeSlot: '' }));
  }, [form.date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.date || !form.timeSlot) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        showToast(data.message, 'success');
      } else {
        showToast(data.error || 'Something went wrong.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="success-state">
        <div className="success-icon">📅</div>
        <h2>Session booked!</h2>
        <p>
          Your {discoverySession.label} has been requested.
          {PERSON_FIRST_NAME} will confirm your booking shortly.
        </p>
        <div className="booking-summary card">
          <div className="summary-row">
            <span>Session</span>
            <strong>{discoverySession.label}</strong>
          </div>
          <div className="summary-row">
            <span>Date</span>
            <strong>{new Date(form.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
          </div>
          <div className="summary-row">
            <span>Time</span>
            <strong>{form.timeSlot}</strong>
          </div>
        </div>
        <div className="success-actions">
          <Link href="/" className="btn btn-primary">Return Home</Link>
          <Link href="/intake" className="btn btn-secondary">Fill Intake Form</Link>
        </div>

        <style jsx>{`
          .success-state { text-align: center; padding: var(--space-3xl) var(--space-xl); }
          .success-icon { font-size: 4rem; margin-bottom: var(--space-xl); }
          .success-state h2 { margin-bottom: var(--space-lg); }
          .success-state p { font-size: 1.02rem; max-width: 460px; margin: 0 auto var(--space-2xl); }
          .booking-summary { max-width: 380px; margin: 0 auto var(--space-2xl); text-align: left; }
          .summary-row { display: flex; justify-content: space-between; padding: var(--space-sm) 0; border-bottom: 1px solid var(--cream-300); font-size: 0.92rem; }
          .summary-row:last-child { border-bottom: none; }
          .summary-row span { color: var(--text-muted); }
          .success-actions { display: flex; gap: var(--space-md); justify-content: center; }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {ToastComponent}
      {BOOKING_FORM_URL && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <a className="btn btn-outline" href={BOOKING_FORM_URL} target="_blank" rel="noopener noreferrer">Open Booking Form</a>
        </div>
      )}
      <ScrollReveal>
        <div className="booking-header">
          <span className="section-label">Book a Session</span>
          <h1>Begin your journey</h1>
          <p>Pick a date and time, and take the first step toward clarity.</p>
        </div>
      </ScrollReveal>

      <form onSubmit={handleSubmit}>
        {/* Session Type — single card, centered */}
        <ScrollReveal delay={0.1}>
          <div className="form-section">
            <div className="session-type-single">
              <div className="session-type-card type-selected">
                <span className="type-icon">{discoverySession.icon}</span>
                <strong>{discoverySession.label}</strong>
                <span className="type-duration">{discoverySession.duration}</span>
                <span className="type-price">{discoverySession.price}</span>
                <div className="type-check">✓</div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Personal Details */}
        <ScrollReveal delay={0.15}>
          <div className="form-section card">
            <h3 className="section-title">Your details</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="book-name">Full Name *</label>
                <input id="book-name" className="form-input" type="text" placeholder="Your name" value={form.name} onChange={e => update('name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="book-email">Email *</label>
                <input id="book-email" className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => update('email', e.target.value)} required />
              </div>
            </div>
            <div className="form-group" style={{ maxWidth: '300px' }}>
              <label className="form-label" htmlFor="book-phone">Phone</label>
              <input id="book-phone" className="form-input" type="tel" placeholder="+91 ..." value={form.phone} onChange={e => update('phone', e.target.value)} />
            </div>
          </div>
        </ScrollReveal>

        {/* Date & Time */}
        <ScrollReveal delay={0.2}>
          <div className="form-section card">
            <h3 className="section-title">Pick a date & time</h3>
            <div className="form-group">
              <label className="form-label" htmlFor="book-date">Preferred Date *</label>
              <input id="book-date" className="form-input" type="date" min={getMinDate()} value={form.date} onChange={e => update('date', e.target.value)} required style={{ maxWidth: '250px' }} />
            </div>

            {form.date && (
              <div className="form-group">
                <label className="form-label">Available Time Slots *</label>
                <div className="time-slots-grid">
                  {timeSlots.map(slot => {
                    const isBooked = bookedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        className={`time-slot ${form.timeSlot === slot ? 'slot-selected' : ''} ${isBooked ? 'slot-booked' : ''}`}
                        onClick={() => !isBooked && update('timeSlot', slot)}
                        disabled={isBooked}
                      >
                        {slot}
                        {isBooked && <span className="booked-label">Booked</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Message */}
        <ScrollReveal delay={0.25}>
          <div className="form-section card">
            <div className="form-group">
              <label className="form-label" htmlFor="book-message">Anything you'd like to share? (optional)</label>
              <textarea id="book-message" className="form-textarea" placeholder="Questions, concerns, or things Mimansa should know..." value={form.message} onChange={e => update('message', e.target.value)} rows={4} />
            </div>
          </div>
        </ScrollReveal>

        {/* Submit */}
        <div className="submit-area">
          <button type="submit" className="btn btn-primary submit-btn" disabled={submitting}>
            {submitting ? (
              <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span> Booking...</>
            ) : (
              'Confirm Booking ✿'
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .booking-header { text-align: center; margin-bottom: var(--space-2xl); }
        .booking-header h1 { font-size: clamp(2rem,5vw,3rem); margin-bottom: var(--space-md); background: linear-gradient(135deg,var(--brown-700),var(--brown-500)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .booking-header p { max-width: 500px; margin: 0 auto; font-size: 1.02rem; }
        .form-section { margin-bottom: var(--space-xl); }
        .section-title { font-size: 1.3rem; margin-bottom: var(--space-xl); padding-bottom: var(--space-md); border-bottom: 1px solid var(--cream-300); }
        .session-type-single { display: flex; justify-content: center; }
        .session-type-card { padding: var(--space-xl) var(--space-2xl); border: 2px solid var(--border-light); border-radius: var(--radius-lg); text-align: center; background: var(--bg-card); position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; width: 260px; }
        .type-selected { border-color: var(--brown-500); background: var(--accent-soft); box-shadow: var(--shadow-md); }
        .type-icon { font-size: 2rem; }
        .session-type-card strong { font-family: var(--font-heading); font-size: 1.1rem; color: var(--text-primary); }
        .type-duration { font-size: 0.8rem; color: var(--text-muted); }
        .type-price { font-size: 0.9rem; font-weight: 600; color: var(--brown-500); }
        .type-check { position: absolute; top: 10px; right: 10px; width: 24px; height: 24px; border-radius: 50%; background: var(--brown-500); color: var(--cream-50); font-size: 0.7rem; display: flex; align-items: center; justify-content: center; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); }
        .time-slots-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: var(--space-sm); }
        .time-slot { padding: 12px 8px; border: 1.5px solid var(--border-light); border-radius: var(--radius-md); background: var(--bg-card); font-size: 0.88rem; cursor: pointer; transition: all var(--transition-base); font-family: var(--font-body); text-align: center; }
        .time-slot:hover:not(.slot-booked) { border-color: var(--brown-400); background: var(--accent-soft); }
        .slot-selected { border-color: var(--brown-500) !important; background: var(--brown-500) !important; color: var(--cream-50) !important; font-weight: 600; }
        .slot-booked { opacity: 0.4; cursor: not-allowed; text-decoration: line-through; }
        .booked-label { display: block; font-size: 0.65rem; color: var(--error); margin-top: 2px; text-decoration: none; }
        .submit-area { text-align: center; padding: var(--space-xl) 0; }
        .submit-btn { padding: 16px 48px; font-size: 1rem; }
        @media (max-width: 768px) { .time-slots-grid { grid-template-columns: repeat(3,1fr); } .form-row { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <main className="booking-page">
        <div className="booking-container">
          <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner spinner-large" style={{ margin: '0 auto' }}></div></div>}>
            <BookingContent />
          </Suspense>
        </div>
      </main>
      <Footer />
      <style jsx>{`
        .booking-page {
          min-height: 100vh;
          padding-top: calc(var(--nav-height) + var(--space-2xl));
          padding-bottom: var(--space-4xl);
          background: linear-gradient(165deg, var(--cream-50), var(--cream-200));
        }
        .booking-container {
          max-width: 750px;
          margin: 0 auto;
          padding: 0 var(--space-xl);
        }
      `}</style>
    </>
  );
}
