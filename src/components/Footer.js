'use client';

import { useState } from 'react';
import Link from 'next/link';
import EmailModal from '@/components/EmailModal';
import { BRAND_NAME_WITH_TM, FOOTER_TAGLINE, FOOTER_DESC, FOOTER_MADE_BY, SOCIAL_LINKS, OWNER_EMAIL } from '@/lib/messages';

export default function Footer() {
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <>
      <EmailModal isOpen={emailModalOpen} onClose={() => setEmailModalOpen(false)} recipientEmail={OWNER_EMAIL} />
      <footer className="footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              
              <div>
                <h3>{BRAND_NAME_WITH_TM}</h3>
                <p className="footer-tagline">{FOOTER_TAGLINE}</p>
              </div>
            </div>
            <p className="footer-desc">
              {FOOTER_DESC}
            </p>
          </div>

          <div className="footer-links-group">
            <h4>Navigate</h4>
            <Link href="/">Home</Link>
            <Link href="/#about">About</Link>
            <Link href="/#services">Services</Link>
            <Link href="/#testimonials">Testimonials</Link>
          </div>

          <div className="footer-links-group">
            <h4>For Clients</h4>
            <Link href="/intake">Intake Form</Link>
            <Link href="/sessions">Session Reflection</Link>
            <Link href="/booking">Book a Session</Link>
            <Link href="/#contact">Contact</Link>
          </div>

          <div className="footer-links-group">
            <h4>Connect</h4>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <button
              onClick={() => setEmailModalOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--cream-200)',
                cursor: 'pointer',
                padding: '2px 0',
                fontSize: '0.9rem',
                textDecoration: 'none',
                fontFamily: 'inherit',
                textAlign: 'left',
                width: '100%',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--cream-50)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--cream-200)'}
            >
              Email
            </button>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>© {currentYear} {BRAND_NAME_WITH_TM}. All rights reserved.</p>
          <p className="footer-made">{FOOTER_MADE_BY}</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--brown-800);
          color: var(--cream-200);
          padding: var(--space-4xl) 0 var(--space-xl);
          margin-top: 5%;
        }

        .footer-content {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 var(--space-xl);
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: var(--space-3xl);
          margin-bottom: var(--space-3xl);
        }

        .footer-brand {
          max-width: 320px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: var(--space-lg);
        }

        .footer-icon {
          font-size: 1.5rem;
          color: var(--brown-300);
        }

        .footer-logo h3 {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--cream-100);
          margin: 0;
        }

        .footer-tagline {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--brown-300);
          margin: 0;
        }

        .footer-desc {
          font-size: 0.9rem;
          line-height: 1.7;
          color: var(--brown-200);
        }

        .footer-links-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          text-align: left;
        }

        .footer-links-group h4 {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--brown-300);
          margin-bottom: var(--space-sm);
        }

        .footer-links-group a,
        .footer-links-group button {
          font-size: 0.9rem;
          color: var(--cream-200);
          text-decoration: none;
          transition: color 0.2s ease;
          padding: 2px 0;
        }

        .footer-links-group a:hover,
        .footer-links-group button:hover {
          color: var(--cream-50);
        }

        .footer-divider {
          height: 1px;
          background: rgba(196, 168, 130, 0.2);
          margin-bottom: var(--space-xl);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-bottom p {
          font-size: 0.82rem;
          color: var(--brown-300);
          margin: 0;
        }

        .footer-made {
          font-size: 0.82rem;
          color: var(--brown-400);
        }

        @media (max-width: 768px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: var(--space-2xl);
          }

          .footer-bottom {
            flex-direction: column;
            gap: var(--space-sm);
            text-align: center;
          }
        }
      `}</style>
      </footer>
    </>
  );
}
