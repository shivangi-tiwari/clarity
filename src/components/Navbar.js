'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND_NAME } from '@/lib/messages';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile menu when resizing above mobile breakpoint (635px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 635 && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileOpen]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#about', label: 'About' },
    { href: '/#services', label: 'Services' },
    { href: '/#testimonials', label: 'Testimonials' },
    { href: '/booking', label: 'Book a Session' },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return pathname === '/';
    return pathname === href;
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${mobileOpen ? 'menu-open' : ''}`}>
        <div className="nav-container">
          <Link href="/" className="nav-logo">
           <span>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    fill="currentColor" 
    className="bi bi-stars"
    viewBox="0 0 16 16"
  >
    <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
  </svg>
   {BRAND_NAME}
</span>

          </Link>

          <div className="nav-links-desktop">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive(link.href) ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/#contact" className="btn btn-primary nav-cta">
              Get in Touch
            </Link>
          </div>

          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`burger ${mobileOpen ? 'burger-open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mobile-links">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mobile-bottom">
              <Link
                href="/#contact"
                className="btn btn-primary mobile-cta"
                onClick={() => setMobileOpen(false)}
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          height: var(--nav-height);
          display: flex;
          align-items: center;
          transition: all 0.35s ease;
          background: transparent;
        }

        .navbar-scrolled {
          background: rgba(255, 252, 247, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(196, 168, 130, 0.15);
          box-shadow: 0 2px 20px rgba(61, 43, 31, 0.05);
        }

        .nav-container {
          width: 100%;
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 var(--space-xl);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          text-decoration: none;
          color: var(--text-primary);
        }

        .logo-full {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--brown-700);
          line-height: 1;
          opacity: 1;
          transform: none;
          transition: opacity 220ms ease, transform 220ms ease;
          pointer-events: auto;
        }

        /* Hide logo text while mobile menu is open, but allow scroll to reveal it */
        .menu-open:not(.navbar-scrolled) .logo-full {
          opacity: 0;
          transform: translateY(-6px);
          pointer-events: none;
        }

        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
        }

        .nav-link {
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          padding: 0.375rem 0.125rem;
          position: relative;
          transition: color var(--transition-fast);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 0.09375rem;
          background: var(--brown-500);
          transition: width 0.3s ease;
        }

        .nav-link:hover {
          color: var(--brown-700);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-link-active {
          color: var(--brown-700);
        }

        .nav-link-active::after {
          width: 100%;
        }

        .nav-cta {
          padding: 0.625rem 1.5rem;
          font-size: 0.82rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .nav-mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .burger {
          display: flex;
          flex-direction: column;
          gap: 0.3125rem; /* 0.3125rem */
          width: 1.375rem; /* 1.375rem */
        }

        .burger span {
          display: block;
          height: 0.125rem;
          background: var(--brown-700);
          border-radius: 0.125rem;
          transition: all 0.3s ease;
        }

        .burger-open span:first-child {
          transform: rotate(45deg) translate(0.3125rem, 0.3125rem);
        }

        .burger-open span:nth-child(2) {
          opacity: 0;
        }

        .burger-open span:last-child {
          transform: rotate(-45deg) translate(0.3125rem, -0.3125rem);
        }

        .mobile-menu {
          display: none;
        }

        @media (max-width: 635px) {
          .nav-links-desktop {
            display: none;
          }

          .nav-mobile-toggle {
              display: block;
              z-index: 101;
          }

          .mobile-menu {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: var(--nav-height);
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 252, 247, 0.98);
            backdrop-filter: blur(20px);
            padding: 1rem; /* 1rem */
            gap: 1rem; /* 1rem */
            z-index: 9999;
            border-bottom: 1px solid var(--border-light);
            box-shadow: var(--shadow-lg);
            max-height: calc(100vh - var(--nav-height));
            overflow-y: auto;
            pointer-events: auto;
          }

          /* container for links: stretch to available space and distribute evenly */
          .mobile-links {
            display: flex;
            flex-direction: column;
            gap: var(--space-md);
            justify-content: center;
            flex: 1 1 auto;
            align-items: center;
            width: 100%;
            text-align: center;
          }

          .mobile-link {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 0.6rem 0.875rem; /* rem-based padding */
            font-size: clamp(0.875rem, 2.4vw, 1rem); /* fluid sizing */
            color: var(--text-secondary);
            text-decoration: none;
            border-radius: 0.5rem;
            transition: all 0.2s ease;
            pointer-events: auto;
            margin-bottom: 0;
          }

          .mobile-bottom { display:flex; justify-content:center; align-items:center; margin-top: 0.75rem; }

          .mobile-link:hover {
            background: var(--accent-soft);
            color: var(--brown-700);
          }

          .mobile-cta {
            margin-top: 0.75rem;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}
