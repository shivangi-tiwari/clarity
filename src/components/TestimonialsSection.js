'use client';

import { useState, useEffect, useRef } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { TESTIMONIALS_SECTION } from '@/lib/messages';

const PER_PAGE = 3;
const INTERVAL_MS = 3000;

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [page, setPage] = useState(0);
  const [fading, setFading] = useState(false);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) setTestimonials(data);
        }
      } catch (err) {
        console.error('Failed loading testimonials', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const pages = Math.ceil(testimonials.length / PER_PAGE);

  useEffect(() => {
    if (pages <= 1) return;
    timerRef.current = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setPage(p => (p + 1) % pages);
        setFading(false);
      }, 400);
    }, INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [pages]);

  const visible = testimonials.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  if (loading || testimonials.length === 0) return null;

  return (
    <section className="testimonials section" id="testimonials">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-label">{TESTIMONIALS_SECTION.label}</span>
            <h2>{TESTIMONIALS_SECTION.title}</h2>
            <p>{TESTIMONIALS_SECTION.description}</p>
          </div>
        </ScrollReveal>

        <div className={`testimonials-grid ${fading ? 'fading' : ''}`}>
          {visible.map((t, i) => (
            <div className="testimonial-card card" key={`${page}-${i}`}>
              <div className="quote-mark">"</div>
              <p className="quote-text">{t.quote}</p>
              <div className="quote-author">
                <div className="author-avatar">{(t.name || 'A').charAt(0)}</div>
                <div>
                  <strong>{t.name || 'Anonymous'}</strong>
                  <span>{t.context || 'Client'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pages > 1 && (
          <div className="dots">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                className={`dot ${i === page ? 'active' : ''}`}
                onClick={() => { clearInterval(timerRef.current); setPage(i); }}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .testimonials {
          background: linear-gradient(180deg, var(--cream-200), var(--cream-50));
          text-align: center;
        }
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-xl);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .testimonials-grid.fading {
          opacity: 0;
          transform: translateY(8px);
        }
        .dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: var(--space-xl);
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: var(--brown-200);
          cursor: pointer;
          padding: 0;
          transition: background 0.3s;
        }
        .dot.active { background: var(--brown-500); }
        /* keep your existing card styles below */
        .testimonial-card { padding: var(--space-2xl); position: relative; display: flex; flex-direction: column; justify-content: space-between; height: 100%; }
        .quote-mark { font-family: var(--font-heading); font-size: 4rem; color: var(--brown-200); line-height: 1; position: absolute; top: 20px; left: 24px; }
        .quote-text { font-size: 0.95rem; font-style: italic; color: var(--text-secondary); line-height: 1.8; margin: var(--space-xl) 0; flex-grow: 1; }
        .quote-author { display: flex; align-items: center; gap: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--cream-300); margin-top: auto; }
        .author-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--brown-400), var(--brown-500)); color: var(--cream-50); display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-size: 1.2rem; font-weight: 600; flex-shrink: 0; }
        .quote-author strong { display: block; font-family: var(--font-heading); font-size: 1.05rem; color: var(--text-primary); }
        .quote-author span { font-size: 0.8rem; color: var(--text-muted); }
        @media (max-width: 768px) {
          .testimonials-grid { grid-template-columns: 1fr; max-width: 500px; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}
