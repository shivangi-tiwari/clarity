'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { useToast } from '@/hooks/useToast';
import { PERSON_FIRST_NAME } from '@/lib/messages';

const supportAreaOptions = [
  'Self-confidence',
  'Relationships',
  'Career clarity',
  'Emotional regulation',
  'Setting boundaries',
  'Self-worth',
  'Decision making',
  'Letting go',
  'Communication',
  'Anxiety / Overwhelm',
  'Life transitions',
  'Self-understanding',
];

export default function IntakePage() {
  const { showToast, ToastComponent } = useToast();
  const [form, setForm] = useState({
    fullName: '',
    preferredName: '',
    phone: '',
    email: '',
    city: '',
    occupation: '',
    currentSituation: '',
    hopedChange: '',
    supportAreas: [],
    alreadyTried: '',
    supportNeeded: '',
    successStatement: '',
    anythingElse: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const toggleArea = (area) => {
    setForm(prev => ({
      ...prev,
      supportAreas: prev.supportAreas.includes(area)
        ? prev.supportAreas.filter(a => a !== area)
        : [...prev.supportAreas, area],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || form.fullName.trim().length === 0) {
      showToast('Please enter your full name.', 'error');
      return;
    }
    if (!form.phone?.trim() && !form.email?.trim()) {
      showToast('Please provide at least a phone number or email.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        showToast(data.message || 'Submitted', 'success');
      } else {
        showToast(data.error || 'Submission failed', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="intake-page">
          <div className="intake-container">
            <div className="success-state">
              <div className="success-icon">🌱</div>
              <h2>Thank you — submission received</h2>
              <p>{PERSON_FIRST_NAME} will reach out to you soon.</p>
            </div>
          </div>
        </main>
        <Footer />
        <style jsx>{`
          .intake-page { min-height: 100vh; padding-top: calc(var(--nav-height) + var(--space-3xl)); padding-bottom: var(--space-4xl); background: linear-gradient(165deg, var(--cream-50), var(--cream-200)); }
          .intake-container { max-width: 700px; margin: 0 auto; padding: 0 var(--space-xl); }
          .success-state { text-align: center; padding: var(--space-3xl) var(--space-xl); }
          .success-icon { font-size: 4rem; margin-bottom: var(--space-xl); }
          .success-state h2 { margin-bottom: var(--space-lg); }
          .success-state p { font-size: 1.02rem; max-width: 460px; margin: 0 auto; }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Navbar />
      {ToastComponent}
      <main className="intake-page">
        <div className="intake-container">
          <ScrollReveal>
            <div className="intake-header">
              <span className="section-label">Client Intake</span>
              <h1>Tell me about you</h1>
              <p>Please share as much or as little as you like — your responses help tailor the coaching process.</p>
            </div>
          </ScrollReveal>

          <form onSubmit={handleSubmit}>
            {/* About You */}
            <ScrollReveal delay={0.1}>
              <div className="form-section card">
                <h3 className="section-title">🌱 About you</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullName">Full Name *</label>
                    <input id="fullName" className="form-input" type="text" placeholder="Your full name" required value={form.fullName} onChange={e => update('fullName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="preferredName">Preferred Name</label>
                    <input id="preferredName" className="form-input" type="text" placeholder="What should Mimansa call you?" value={form.preferredName} onChange={e => update('preferredName', e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input id="email" className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Phone</label>
                    <input id="phone" className="form-input" type="tel" placeholder="+91 ..." value={form.phone} onChange={e => update('phone', e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="city">City</label>
                    <input id="city" className="form-input" type="text" placeholder="Where are you based?" value={form.city} onChange={e => update('city', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="occupation">Occupation</label>
                    <input id="occupation" className="form-input" type="text" placeholder="What do you do?" value={form.occupation} onChange={e => update('occupation', e.target.value)} />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Your Situation */}
            <ScrollReveal delay={0.15}>
              <div className="form-section card">
                <h3 className="section-title">💭 Your situation</h3>
                <div className="form-group">
                  <label className="form-label" htmlFor="currentSituation">What's your current situation?</label>
                  <textarea id="currentSituation" className="form-textarea" placeholder="Share what's going on in your life right now..." value={form.currentSituation} onChange={e => update('currentSituation', e.target.value)} rows={4} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="hopedChange">What change are you hoping for?</label>
                  <textarea id="hopedChange" className="form-textarea" placeholder="What would be different if coaching went well?" value={form.hopedChange} onChange={e => update('hopedChange', e.target.value)} rows={4} />
                </div>
              </div>
            </ScrollReveal>

            {/* Support Areas */}
            <ScrollReveal delay={0.2}>
              <div className="form-section card">
                <h3 className="section-title">✨ Areas of support</h3>
                <div className="form-group">
                  <label className="form-label">What would you like support with? (select any)</label>
                  <div className="checkbox-group">
                    {supportAreaOptions.map(area => (
                      <div className="checkbox-item" key={area}>
                        <input
                          type="checkbox"
                          id={`area-${area}`}
                          checked={form.supportAreas.includes(area)}
                          onChange={() => toggleArea(area)}
                        />
                        <label htmlFor={`area-${area}`}>{area}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Background */}
            <ScrollReveal delay={0.25}>
              <div className="form-section card">
                <h3 className="section-title">🌿 A little more</h3>
                <div className="form-group">
                  <label className="form-label" htmlFor="alreadyTried">What have you already tried?</label>
                  <textarea id="alreadyTried" className="form-textarea" placeholder="Therapy, self-help, other approaches..." value={form.alreadyTried} onChange={e => update('alreadyTried', e.target.value)} rows={3} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="supportNeeded">What kind of support do you need?</label>
                  <textarea id="supportNeeded" className="form-textarea" placeholder="How can Mimansa best support you?" value={form.supportNeeded} onChange={e => update('supportNeeded', e.target.value)} rows={3} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="successStatement">What does success look like for you?</label>
                  <textarea id="successStatement" className="form-textarea" placeholder="How will you know coaching has worked?" value={form.successStatement} onChange={e => update('successStatement', e.target.value)} rows={3} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="anythingElse">Anything else you'd like to share?</label>
                  <textarea id="anythingElse" className="form-textarea" placeholder="Anything Mimansa should know..." value={form.anythingElse} onChange={e => update('anythingElse', e.target.value)} rows={3} />
                </div>
              </div>
            </ScrollReveal>

            {/* Submit */}
            <div className="submit-area">
              <button type="submit" className="btn btn-primary submit-btn" disabled={submitting}>
                {submitting ? (
                  <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span> Sending...</>
                ) : (
                  'Submit Intake ✿'
                )}
              </button>
              <p className="submit-note">Your responses are confidential and only visible to {PERSON_FIRST_NAME}.</p>
            </div>
          </form>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        .intake-page {
          min-height: 100vh;
          padding-top: calc(var(--nav-height) + var(--space-2xl));
          padding-bottom: var(--space-4xl);
          background: linear-gradient(165deg, var(--cream-50), var(--cream-200));
        }

        .intake-container {
          max-width: 700px;
          margin: 0 auto;
          padding: 0 var(--space-xl);
        }

        .intake-header {
          text-align: center;
          margin-bottom: var(--space-2xl);
        }

        .intake-header h1 {
          font-size: clamp(2rem, 5vw, 3rem);
          margin-bottom: var(--space-md);
          background: linear-gradient(135deg, var(--brown-700), var(--brown-500));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .intake-header p {
          max-width: 520px;
          margin: 0 auto;
          font-size: 1.02rem;
        }

        .form-section {
          margin-bottom: var(--space-xl);
        }

        .section-title {
          font-size: 1.4rem;
          margin-bottom: var(--space-xl);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid var(--cream-300);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
        }

        .submit-area {
          text-align: center;
          padding: var(--space-xl) 0;
        }

        .submit-btn {
          padding: 16px 48px;
          font-size: 1rem;
        }

        .submit-note {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: var(--space-md);
          font-style: italic;
        }

        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
