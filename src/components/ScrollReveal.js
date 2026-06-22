'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function ScrollReveal({ children, delay = 0, direction = 'up', className = '' }) {
  const [ref, isVisible] = useScrollReveal();

  const transforms = {
    up: 'translateY(2.5rem)',
    down: 'translateY(-2.5rem)',
    left: 'translateX(-2.5rem)',
    right: 'translateX(2.5rem)',
    none: 'none',
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : transforms[direction],
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
