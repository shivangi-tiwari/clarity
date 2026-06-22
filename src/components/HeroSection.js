'use client';
import ScrollReveal from '@/components/ScrollReveal';
import { BRAND_NAME, PERSON_FULL_NAME } from '@/lib/messages';

export default function HeroSection() {
  return (
    <section className="hero section" id="home">
      <div className="container">
        <div className="hero-inner">
          <div className="hero-copy">
            <ScrollReveal>
              <h1>{BRAND_NAME}</h1>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="hero-features" role="list">
                <div className="feature-card" role="listitem">
                  <div className="feature-emoji">♡</div>
                  <div className="feature-text">Emotional clarity</div>
                </div>
                <div className="feature-card" role="listitem">
                  <div className="feature-emoji">✿</div>
                  <div className="feature-text">Gentle guidance</div>
                </div>
                <div className="feature-card" role="listitem">
                  <div className="feature-emoji">☆</div>
                  <div className="feature-text">Authentic growth</div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.18}>
              <div className="hero-cta">
                <a className="btn btn-primary" href="/booking">Book a session</a>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="right">
            <div className="hero-image">
              <img src="/api/author-image" alt={PERSON_FULL_NAME} />
            </div>
          </ScrollReveal>
        </div>
      </div>

      <style jsx>{`
        .hero {
          padding: 0;
          background: var(--bg-primary);
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding-top: calc(var(--nav-height) + 0.5rem);
        }

        .hero-inner {
          max-width: 68.75rem;
          margin: 0 auto;
          display: flex;
          gap: 2rem;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .hero-copy {
          flex: 1 1 60%;
          text-align: center;
        }

        .hero-image {
          flex: 0 0 33%;
          aspect-ratio: 3/4;
          max-width: 26.25rem;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 0.625rem 1.875rem rgba(0, 0, 0, 0.06);
        }

        .hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        h1 {
          font-family: var(--font-heading);
          color: var(--brown-900);
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0 0 1rem 0;
          font-size: clamp(2rem, 4.5vw, 3.6rem);
        }

        .hero-features {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.2rem;
          justify-content: center;
        }

        .feature-card {
          background: var(--brown-700);
          color: var(--cream-50);
          padding: 0.55rem 0.9rem;
          border-radius: 0.6rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          min-width: 10rem;
          justify-content: center;
        }

        .feature-emoji {
          font-size: 1.05rem;
          opacity: 0.95;
        }

        .feature-text {
          font-size: 0.95rem;
        }

        .hero-cta {
          margin-top: 2.25rem;
          display: flex;
          justify-content: center;
        }

        @media (max-width: 992px) {
          .hero-inner {
            flex-direction: column-reverse;
            text-align: center;
            gap: 1rem;
          }

          .hero-copy {
            width: 100%;
          }

          .hero-image {
            width: 100%;
            max-height: 17.5rem;
            aspect-ratio: auto;
          }

          .hero-features {
            flex-direction: column;
            gap: 0.6rem;
          }

          .feature-card {
            min-width: auto;
            width: 100%;
          }

          .hero-cta {
            max-width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .hero {
            padding-top: calc(var(--nav-height) + 0.5rem);
            padding-bottom: 3.5rem;
          }

          .hero-image {
            max-height: 13.75rem;
          }

          h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
}
