'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

export default function ProcessSection() {
  const steps = [
    { num: '01', title: 'Reach Out', desc: 'Book a free discovery call or fill out the intake form — share as much or as little as you\'re comfortable with.' },
    { num: '02', title: 'Connect', desc: 'We\'ll have a warm conversation to understand your needs, answer your questions, and see if we feel like the right fit.' },
    { num: '03', title: 'Begin Your Journey', desc: 'Together, we\'ll create a personalized path forward — at your pace, honoring your process, celebrating every step.' },
    { num: '04', title: 'Reflect & Grow', desc: 'After each session, you\'ll reflect on your insights. Over time, watch your emotional clarity deepen and flourish.' },
  ];

  return (
    <section className="process section" id="process">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-label">The Journey</span>
            <h2>How it works</h2>
            <p>Your path to emotional clarity in four gentle steps.</p>
          </div>
        </ScrollReveal>

        <div className="process-timeline">
          {steps.map((step, i) => (
            <ScrollReveal key={step.num} delay={i * 0.15}>
              <div className="process-step">
                <div className="step-number">{step.num}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.5}>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
            <Link href="/intake" className="btn btn-primary">
              Start With the Intake Form
            </Link>
          </div>
        </ScrollReveal>
      </div>

      <style jsx>{`
        .process {
          background: var(--bg-primary);
          text-align: center;
        }

        .process-timeline {
          max-width: 700px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
          position: relative;
        }

        .process-timeline::before {
          content: '';
          position: absolute;
          left: 28px;
          top: 40px;
          bottom: 40px;
          width: 2px;
          background: linear-gradient(180deg, var(--brown-200), var(--brown-400), var(--brown-200));
        }

        .process-step {
          display: flex;
          gap: var(--space-xl);
          align-items: flex-start;
          position: relative;
        }

        .step-number {
          flex-shrink: 0;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brown-500), var(--brown-600));
          color: var(--cream-50);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 600;
          z-index: 1;
          box-shadow: 0 4px 16px rgba(139, 111, 71, 0.25);
        }

        .step-content {
          padding-top: 8px;
          text-align: left;
          flex: 1;
        }

        .step-content h3 {
          margin-bottom: var(--space-xs);
          margin-top: 0;
        }

        .step-content p {
          font-size: 0.95rem;
        }

        @media (max-width: 600px) {
          .process-timeline::before {
            left: 22px;
          }

          .step-number {
            width: 46px;
            height: 46px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </section>
  );
}
