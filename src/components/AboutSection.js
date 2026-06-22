'use client';
import ScrollReveal from '@/components/ScrollReveal';
import { PERSON_FIRST_NAME, PERSON_FULL_NAME } from '@/lib/messages';

export default function AboutSection() {
  return (
    <section className="about section" id="about">
      <div className="container">
        <div className="about-grid">
          {/* image moved to hero; centered text below */}

          <div className="about-text-col">
            <ScrollReveal>
              <span className="section-label">About {PERSON_FIRST_NAME}</span>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2>Guiding you home to yourself</h2>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="divider" style={{ margin: '1.5rem 0' }}></div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p>
                I'm {PERSON_FULL_NAME}, an Emotional Clarity Coach dedicated to helping individuals
                navigate life's emotional complexities with compassion and self-awareness.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.25}>
              <p>
                My approach blends deep empathetic listening with practical tools for emotional 
                regulation and self-discovery. I believe that true clarity comes not from fixing
                what's broken, but from understanding what's already whole within you.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <p>
                Whether you're navigating a life transition, processing difficult emotions, or 
                simply seeking deeper self-understanding — I'm here to walk beside you, not 
                ahead of you.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.35}>
              <div className="about-values">
                <div className="value-item">
                  <span className="value-icon">🌿</span>
                  <div>
                    <strong>Gentle Guidance</strong>
                    <p>Meeting you where you are, not where you "should" be</p>
                  </div>
                </div>
                <div className="value-item">
                  <span className="value-icon">🤎</span>
                  <div>
                    <strong>Deep Compassion</strong>
                    <p>Every emotion is valid, every story matters</p>
                  </div>
                </div>
                <div className="value-item">
                  <span className="value-icon">✨</span>
                  <div>
                    <strong>Authentic Growth</strong>
                    <p>Transformation that honors who you truly are</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <style jsx>{`
        .about { background: var(--bg-primary); display:flex; align-items:center; justify-content:center; }

        /* Mobile-first: stack with image on top */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4xl);
          align-items: center;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .about-image-wrapper { position: relative; aspect-ratio: 3/4; max-width: 100%; width: 100%; }
        .about-image-placeholder { width: 100%; height: 100%; background: linear-gradient(145deg, var(--brown-100), var(--cream-300)); border-radius: var(--radius-lg); display:flex; align-items:center; justify-content:center; overflow:hidden; }
        .about-image-placeholder img { width:100%; height:100%; object-fit:cover; display:block; }
        .about-accent-box { position:absolute; right:-1.5rem; bottom:-1.5rem; width:7.5rem; height:7.5rem; background:linear-gradient(180deg, rgba(44,24,16,0.08), rgba(196,170,158,0.04)); border-radius:0.75rem; }

        .about-text-col { padding-left: 0; text-align: center; }
        .section-label { color: var(--brown-600); font-weight:600; }
        .about-values { margin-top: 1.2rem; display:grid; gap:0.8rem; }
        .value-item { display:flex; gap:0.8rem; align-items:center; justify-content:center; }
        .value-item > div { text-align: center; }
        .value-icon { font-size:1.6rem; }

        /* Larger screens: place image to the left and make it occupy ~1/3 */
        @media (min-width: 1024px) {
          /* center text block on large screens when image is moved to hero */
          .about-grid { grid-template-columns: 1fr; align-items: center; }
          .about-image-wrapper { display:none; }
          .about-text-col { padding-left: 0; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; }
          .about-text-col p { max-width: 64ch; }
          .about-accent-box { display:none; }
        }

        /* Mobile constraints: limit image height so it doesn't dominate */
        @media (max-width: 768px) {
          .about-image-wrapper { max-height: 18rem; height: auto; aspect-ratio: auto; }
          .about-image-placeholder img { object-position: center top; }
          .about-accent-box { display: none; }
        }
      `}</style>
    </section>
  );
}
