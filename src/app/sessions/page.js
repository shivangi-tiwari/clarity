'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { useToast } from '@/hooks/useToast';
import { PERSON_FIRST_NAME } from '@/lib/messages';

const nextStepOptions = [
  'Practice a new boundary',
  'Journal daily',
  'Have a difficult conversation',
  'Practice self-compassion',
  'Set a specific goal',
  'Create a self-care routine',
  'Mindfulness / meditation',
  'Reach out for support',
  'Rest and recharge',
  'Creative expression',
];

export default function SessionReflectionPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const [form, setForm] = useState({
    clientIdentifier: '',
    sessionDate: new Date().toISOString().split('T')[0],
    sessionNumber: '',
    mostImportant: '',
    stoodOut: '',
    feelingLeaving: '',
    insightCarry: '',
    gentleWith: '',
    nextSteps: [],
    nextStepDetails: '',
    supportSelf: '',
    confidenceRating: 0,
    focusBeforeNext: '',
    exploreNext: '',
    wordForward: '',
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleStep = (step) => {
    setForm(prev => ({
      ...prev,
      nextSteps: prev.nextSteps.includes(step)
        ? prev.nextSteps.filter(s => s !== step)
        : [...prev.nextSteps, step],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clientIdentifier.trim()) {
      showToast('Please enter your name or email.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/sessions', {
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
      <>
        <Navbar />
        <main className="session-page">
          <div className="session-container">
            <div className="success-state">
              <div className="success-icon">🌿</div>
              <h2>Reflection saved</h2>
              <p>
                Thank you for taking the time to reflect. This is an act of self-care.
                Your words have been saved and will help guide your next session.
              </p>
              <p className="gentle-reminder">
                "You are braver than you believe, stronger than you seem, 
                and smarter than you think."
              </p>
              <div className="success-actions">
                <Link href="/" className="btn btn-primary">Return Home</Link>
                <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setForm({ ...form, mostImportant: '', stoodOut: '', feelingLeaving: '', insightCarry: '', gentleWith: '', nextSteps: [], nextStepDetails: '', supportSelf: '', confidenceRating: 0, focusBeforeNext: '', exploreNext: '', wordForward: '' }); }}>
                  New Reflection
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <style jsx>{`
          .session-page { min-height: 100vh; padding-top: calc(var(--nav-height) + var(--space-3xl)); padding-bottom: var(--space-4xl); background: linear-gradient(165deg, var(--cream-50), var(--cream-200)); }
          .session-container { max-width: 700px; margin: 0 auto; padding: 0 var(--space-xl); }
          .success-state { text-align: center; padding: var(--space-3xl) var(--space-xl); }
          .success-icon { font-size: 4rem; margin-bottom: var(--space-xl); }
          .success-state h2 { margin-bottom: var(--space-lg); }
          .success-state p { font-size: 1.02rem; max-width: 500px; margin: 0 auto var(--space-lg); }
          .gentle-reminder { font-style: italic; color: var(--brown-400); font-family: var(--font-heading); font-size: 1.1rem !important; }
          .success-actions { display: flex; gap: var(--space-md); justify-content: center; margin-top: var(--space-2xl); }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Navbar />
      {ToastComponent}
      <main className="session-page">
        <div className="session-container">
          <ScrollReveal>
            <div className="session-header">
              <span className="section-label">Clarity Reflection</span>
              <h1>Session Reflection Form</h1>
              <p>
                Take a moment to reflect on today's session. There's no right way to do this — 
                just let your thoughts flow honestly.
              </p>
            </div>
          </ScrollReveal>

          <form onSubmit={handleSubmit}>
            {/* Identification */}
            <ScrollReveal delay={0.1}>
              <div className="form-section card">
                <h3 className="section-title">🌱 Who are you?</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="clientId">Your Name or Email *</label>
                    <input id="clientId" className="form-input" type="text" placeholder="So we can link your reflections" value={form.clientIdentifier} onChange={e => update('clientIdentifier', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="sessionDate">Session Date</label>
                    <input id="sessionDate" className="form-input" type="date" value={form.sessionDate} onChange={e => update('sessionDate', e.target.value)} />
                  </div>
                </div>
                <div className="form-group" style={{ maxWidth: '200px' }}>
                  <label className="form-label" htmlFor="sessionNum">Session Number</label>
                  <input id="sessionNum" className="form-input" type="number" min="1" placeholder="#" value={form.sessionNumber} onChange={e => update('sessionNumber', e.target.value)} />
                </div>
              </div>
            </ScrollReveal>

            {/* Core Reflections */}
            <ScrollReveal delay={0.15}>
              <div className="form-section card">
                <h3 className="section-title">💭 Reflecting on the session</h3>

                <div className="form-group">
                  <label className="form-label" htmlFor="mostImportant">What was the most important thing we discussed today?</label>
                  <textarea id="mostImportant" className="form-textarea" placeholder="What stood out most?" value={form.mostImportant} onChange={e => update('mostImportant', e.target.value)} rows={4} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="stoodOut">Was there anything that surprised you or stood out?</label>
                  <textarea id="stoodOut" className="form-textarea" placeholder="Any unexpected insights or moments?" value={form.stoodOut} onChange={e => update('stoodOut', e.target.value)} rows={3} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="feelingLeaving">How are you feeling as you leave this session?</label>
                  <textarea id="feelingLeaving" className="form-textarea" placeholder="Name the emotions present right now..." value={form.feelingLeaving} onChange={e => update('feelingLeaving', e.target.value)} rows={3} />
                </div>
              </div>
            </ScrollReveal>

            {/* Insights */}
            <ScrollReveal delay={0.2}>
              <div className="form-section card">
                <h3 className="section-title">✨ Insights & Gentleness</h3>

                <div className="form-group">
                  <label className="form-label" htmlFor="insightCarry">What insight or awareness will you carry with you?</label>
                  <textarea id="insightCarry" className="form-textarea" placeholder="What will you remember?" value={form.insightCarry} onChange={e => update('insightCarry', e.target.value)} rows={3} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="gentleWith">What do you need to be gentle with yourself about?</label>
                  <span className="form-sublabel">What deserves compassion, not criticism?</span>
                  <textarea id="gentleWith" className="form-textarea" placeholder="Be kind to yourself..." value={form.gentleWith} onChange={e => update('gentleWith', e.target.value)} rows={3} />
                </div>
              </div>
            </ScrollReveal>

            {/* Next Steps */}
            <ScrollReveal delay={0.25}>
              <div className="form-section card">
                <h3 className="section-title">🌿 Moving Forward</h3>

                <div className="form-group">
                  <label className="form-label">What are your next steps? (select all that apply)</label>
                  <div className="checkbox-group">
                    {nextStepOptions.map(step => (
                      <div className="checkbox-item" key={step}>
                        <input type="checkbox" id={`step-${step}`} checked={form.nextSteps.includes(step)} onChange={() => toggleStep(step)} />
                        <label htmlFor={`step-${step}`}>{step}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="nextStepDetails">Any details about your next steps?</label>
                  <textarea id="nextStepDetails" className="form-textarea" placeholder="What specifically will you do?" value={form.nextStepDetails} onChange={e => update('nextStepDetails', e.target.value)} rows={3} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="supportSelf">How will you support yourself between sessions?</label>
                  <textarea id="supportSelf" className="form-textarea" placeholder="Your self-care plan..." value={form.supportSelf} onChange={e => update('supportSelf', e.target.value)} rows={3} />
                </div>
              </div>
            </ScrollReveal>

            {/* Confidence & Closing */}
            <ScrollReveal delay={0.3}>
              <div className="form-section card">
                <h3 className="section-title">🤎 Closing Thoughts</h3>

                <div className="form-group">
                  <label className="form-label">How confident do you feel about your next steps?</label>
                  <div className="rating-scale">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <div key={n} className={`rating-dot ${form.confidenceRating === n ? 'active' : ''}`} onClick={() => update('confidenceRating', n)}>
                        {n}
                      </div>
                    ))}
                  </div>
                  <div className="rating-labels">
                    <span>Not confident</span>
                    <span>Very confident</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="focusBeforeNext">What would you like to focus on before our next session?</label>
                  <textarea id="focusBeforeNext" className="form-textarea" placeholder="What needs your attention?" value={form.focusBeforeNext} onChange={e => update('focusBeforeNext', e.target.value)} rows={3} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="exploreNext">Is there anything you'd like to explore in our next session?</label>
                  <textarea id="exploreNext" className="form-textarea" placeholder="Topics, feelings, situations..." value={form.exploreNext} onChange={e => update('exploreNext', e.target.value)} rows={3} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="wordForward">Choose one word to carry forward</label>
                  <span className="form-sublabel">A word that captures what you want to embody.</span>
                  <input id="wordForward" className="form-input word-input" type="text" placeholder="Your word..." value={form.wordForward} onChange={e => update('wordForward', e.target.value)} maxLength={50} />
                </div>
              </div>
            </ScrollReveal>

            {/* Submit Button */}
            <div className="submit-area">
              <button type="submit" className="btn btn-primary submit-btn" disabled={submitting}>
                {submitting ? (
                  <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span> Saving Reflection...</>
                ) : (
                  'Save My Reflection ✿'
                )}
              </button>
              <p className="submit-note">Your reflection is confidential and only visible to {PERSON_FIRST_NAME}.</p>
            </div>
          </form>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        .session-page {
          min-height: 100vh;
          padding-top: calc(var(--nav-height) + var(--space-2xl));
          padding-bottom: var(--space-4xl);
          background: linear-gradient(165deg, var(--cream-50), var(--cream-200));
        }

        .session-container {
          max-width: 700px;
          margin: 0 auto;
          padding: 0 var(--space-xl);
        }

        .session-header {
          text-align: center;
          margin-bottom: var(--space-2xl);
        }

        .session-header h1 {
          font-size: clamp(2rem, 5vw, 3rem);
          margin-bottom: var(--space-md);
          background: linear-gradient(135deg, var(--brown-700), var(--brown-500));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .session-header p {
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

        .word-input {
          max-width: 300px;
          font-family: var(--font-heading);
          font-size: 1.4rem;
          text-align: center;
          letter-spacing: 0.05em;
          font-weight: 500;
          color: var(--brown-600);
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
