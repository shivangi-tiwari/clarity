'use client';
import ScrollReveal from '@/components/ScrollReveal';

export default function ServicesSection() {
  return (
    <section className="services section" id="services">
      <div className="container">
        <ScrollReveal>
          <span className="section-label">Services</span>
          <h2>What I offer</h2>
        </ScrollReveal>
        <div className="services-grid">
          <ScrollReveal delay={0.05}>
            <div className="service-card">
              <h3>1:1 Emotional Clarity Coaching</h3>
              <p>Private sessions focused on exploring emotions, building self-awareness, and creating practical steps toward greater clarity.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="service-card">
              <h3>Intake & Personalized Plan</h3>
              <p>Thoughtful intake to understand your needs and co-create a tailored coaching plan.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="service-card">
              <h3>Session Reflections & Follow-ups</h3>
              <p>Guided reflections and follow-up resources to help you integrate insights between sessions.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="service-card">
              <h3>Workshops & Group Programs</h3>
              <p>Curated group experiences for themes like emotional regulation, boundaries, and compassionate communication.</p>
            </div>
          </ScrollReveal>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <a className="btn btn-primary" href="/booking">Book a session</a>
        </div>
      </div>

      <style jsx>{`
        .services { padding: 4rem 0; text-align: center; }
        .services-grid { display:grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap:1rem; margin-top:1rem; }
        .service-card { background: var(--cream-100); padding:1rem; border-radius:10px; text-align: center; }
      `}</style>
    </section>
  );
}
