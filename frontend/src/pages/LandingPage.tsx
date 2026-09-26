import React, { useEffect, useRef, useState } from 'react';
import {
  Shield,
  Lock,
  FileText,
  Users,
  ChevronRight,
  CheckCircle,
  Star,
  ArrowRight,
  Globe,
  Zap,
  Eye,
  Heart,
  BarChart2,
  Upload,
  Clock,
  AlertTriangle,
  Database,
  TrendingUp,
  Menu,
  X,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

/* ─────────────── tiny hook: animate a number counter ─────────────── */
function useCounter(target: number, duration = 1800, started = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return value;
}

/* ─────────────── Floating particle background ─────────────── */
const FloatingOrbs: React.FC = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
    {[
      { top: '8%', left: '12%', size: 180, delay: 0 },
      { top: '60%', left: '5%', size: 120, delay: 1.2 },
      { top: '20%', right: '8%', size: 150, delay: 0.6 },
      { top: '70%', right: '15%', size: 200, delay: 1.8 },
      { top: '45%', left: '50%', size: 90, delay: 0.9 },
    ].map((orb, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          top: orb.top,
          left: (orb as any).left,
          right: (orb as any).right,
          width: orb.size,
          height: orb.size,
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, rgba(0,102,102,0.12), rgba(0,102,102,0.03))`,
          filter: 'blur(40px)',
          animation: `floatOrb ${6 + orb.delay}s ease-in-out infinite alternate`,
          animationDelay: `${orb.delay}s`,
        }}
      />
    ))}
  </div>
);

/* ─────────────── Section wrapper that fades in on scroll ─────────────── */
const FadeInSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

/* ─────────────── Stat card with counter ─────────────── */
const StatCard: React.FC<{ icon: React.ReactNode; value: number; suffix: string; label: string; started: boolean; delay?: number }> = ({
  icon, value, suffix, label, started, delay = 0,
}) => {
  const count = useCounter(value, 1600, started);
  return (
    <div
      className="neu-card"
      style={{
        padding: '2rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
        animationDelay: `${delay}s`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = '';
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 'var(--radius-lg)',
        background: 'var(--primary-light)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', boxShadow: 'var(--neu-shadow-btn)',
      }}>
        {icon}
      </div>
      <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>
        {count.toLocaleString('en-IN')}{suffix}
      </div>
      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500, textAlign: 'center' }}>{label}</div>
    </div>
  );
};

/* ─────────────── Feature card ─────────────── */
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: string;
  badge?: string;
}> = ({ icon, title, description, accent = 'var(--primary)', badge }) => (
  <div
    className="neu-card"
    style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}
    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; }}
  >
    {/* accent strip */}
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: accent, borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div style={{
        width: 46, height: 46, borderRadius: 'var(--radius-md)', background: 'var(--surface-dark)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        boxShadow: 'var(--neu-shadow-btn)',
      }}>
        {icon}
      </div>
      {badge && (
        <span className="badge-tee" style={{ padding: '0.15rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.65rem', fontWeight: 700 }}>
          {badge}
        </span>
      )}
    </div>
    <div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>{title}</h3>
      <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{description}</p>
    </div>
  </div>
);

/* ─────────────── Step card ─────────────── */
const StepCard: React.FC<{ step: number; icon: React.ReactNode; title: string; description: string }> = ({ step, icon, title, description }) => (
  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0', flexShrink: 0 }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%', background: 'var(--primary)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem',
        boxShadow: 'var(--neu-shadow-primary)', flexShrink: 0,
      }}>
        {step}
      </div>
      {step < 4 && <div style={{ width: 2, height: 48, background: 'linear-gradient(to bottom, var(--primary), transparent)', marginTop: 4 }} />}
    </div>
    <div className="neu-card" style={{ padding: '1.25rem 1.5rem', flex: 1, display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }}>{icon}</div>
      <div>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>{title}</h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{description}</p>
      </div>
    </div>
  </div>
);

/* ─────────────── Testimonial card ─────────────── */
const TestimonialCard: React.FC<{ name: string; role: string; quote: string; initial: string }> = ({ name, role, quote, initial }) => (
  <div className="neu-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ display: 'flex', gap: '0.3rem' }}>
      {[0, 1, 2, 3, 4].map(i => <Star key={i} size={14} fill="#D97706" color="#D97706" />)}
    </div>
    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7, fontStyle: 'italic' }}>"{quote}"</p>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%', background: 'var(--primary)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem',
        boxShadow: 'var(--neu-shadow-primary)',
      }}>{initial}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>{name}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{role}</div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
══════════════════════════════════════════════════════════════════════ */
export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsStarted(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', fontFamily: 'var(--font-primary)', overflowX: 'hidden' }}>
      <style>{`
        @keyframes floatOrb {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(16px, -20px) scale(1.08); }
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-cta-primary {
          background: var(--primary);
          color: #fff;
          border: 1px solid #004d4d;
          border-radius: var(--radius-md);
          box-shadow: var(--neu-shadow-primary);
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: -0.01em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 1.75rem;
          transition: all 0.18s ease;
          font-family: var(--font-primary);
        }
        .hero-cta-primary:hover {
          background: var(--primary-hover);
          box-shadow: 6px 6px 18px rgba(0,102,102,0.45), -4px -4px 12px #fff;
          transform: translateY(-2px);
        }
        .hero-cta-secondary {
          background: var(--surface);
          color: var(--primary);
          border: 1px solid rgba(255,255,255,0.9);
          border-radius: var(--radius-md);
          box-shadow: var(--neu-shadow-btn);
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 1.75rem;
          transition: all 0.18s ease;
          font-family: var(--font-primary);
        }
        .hero-cta-secondary:hover {
          box-shadow: var(--neu-shadow-hover);
          transform: translateY(-2px);
        }
        .nav-link {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-md);
          transition: all 0.15s ease;
          background: none;
          border: none;
          font-family: var(--font-primary);
        }
        .nav-link:hover {
          color: var(--primary);
          background: var(--primary-light);
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.15rem;
        }
        .how-it-works-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 3rem;
        }
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        @media (max-width: 768px) {
          .how-it-works-grid { grid-template-columns: 1fr; }
          .hero-cta-row { flex-direction: column !important; }
          .hero-heading { font-size: 2.4rem !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(240,242,246,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.7)' : 'none',
        boxShadow: scrolled ? '0 2px 24px rgba(182,192,206,0.25)' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 2rem',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--neu-shadow-primary)',
            }}>
              <Shield size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.04em' }}>
              VIRASAT
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginLeft: -2, marginTop: 8 }}>विरासत</span>
          </div>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
            <button className="nav-link" onClick={() => scrollTo('features')}>Features</button>
            <button className="nav-link" onClick={() => scrollTo('how-it-works')}>How It Works</button>
            <button className="nav-link" onClick={() => scrollTo('security')}>Security</button>
            <button className="nav-link" onClick={() => scrollTo('testimonials')}>Testimonials</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="hero-cta-primary" onClick={onEnterApp} style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}>
              Enter App <ArrowRight size={15} />
            </button>
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', display: 'none' }}
              onClick={() => setMenuOpen(!menuOpen)}
              id="mobile-menu-btn"
            >
              {menuOpen ? <X size={22} color="var(--text-main)" /> : <Menu size={22} color="var(--text-main)" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            background: 'var(--surface)', borderTop: '1px solid rgba(255,255,255,0.7)',
            padding: '1rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
          }}>
            {['features', 'how-it-works', 'security', 'testimonials'].map(id => (
              <button key={id} className="nav-link" style={{ textAlign: 'left' }} onClick={() => scrollTo(id)}>
                {id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: 68 }}>
        <FloatingOrbs />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 2rem', position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

            {/* Left: text */}
            <div style={{ animation: 'fadeSlideUp 0.8s ease both' }}>
              {/* badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span className="badge-tee" style={{ padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700 }}>
                  <span className="animate-tee-pulse" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#006666', marginRight: 5 }} />
                  TEE-SECURED · CONFIDENTIAL COMPUTING
                </span>
              </div>

              <h1 className="hero-heading" style={{ fontSize: '3.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
                Your Family's{' '}
                <span style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, #009999 50%, #00cccc 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}>
                  Digital Legacy
                </span>{' '}
                — Secured & Settled
              </h1>

              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 500 }}>
                VIRASAT automates the estate closure journey for grieving families — from document extraction to financial settlement — protected by Trusted Execution Environments (TEE) and an explainable AI priority engine.
              </p>

              {/* CTA row */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }} className="hero-cta-row">
                <button className="hero-cta-primary" onClick={onEnterApp} id="hero-enter-app-btn">
                  <Shield size={18} />
                  Enter Secure App
                </button>
                <button className="hero-cta-secondary" onClick={() => scrollTo('how-it-works')}>
                  See How It Works
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Trust signals */}
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                {[
                  { icon: <Lock size={14} color="var(--primary)" />, text: 'TEE Protected' },
                  { icon: <CheckCircle size={14} color="var(--success)" />, text: 'DPDP Compliant' },
                  { icon: <Globe size={14} color="var(--text-muted)" />, text: 'India-First' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {item.icon} {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Dashboard preview card */}
            <div style={{ animation: 'fadeSlideUp 0.8s 0.2s ease both', position: 'relative' }}>
              {/* Glow ring */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                width: 340, height: 340, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,102,102,0.08) 0%, transparent 70%)',
                filter: 'blur(20px)',
                pointerEvents: 'none',
              }} />

              <div style={{ animation: 'heroFloat 5s ease-in-out infinite' }}>
                <div className="neu-card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
                  {/* Mini navbar of the card */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E11D48' }} />
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D97706' }} />
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00A63D' }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>estate-case-1 · ACTIVE</span>
                  </div>

                  {/* Estate summary */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '0.2rem' }}>NET ESTATE VALUE</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.04em' }}>₹1,40,95,200</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Suresh Sharma Estate Closure</div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
                      <span>CLOSURE PROGRESS</span><span style={{ color: 'var(--warning)' }}>25%</span>
                    </div>
                    <div className="neu-inset" style={{ height: 8, padding: '1px', borderRadius: 'var(--radius-full)' }}>
                      <div style={{ width: '25%', height: '100%', background: 'var(--warning)', borderRadius: 'var(--radius-full)' }} />
                    </div>
                  </div>

                  {/* Mini stat row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    {[
                      { label: 'Assets', val: '₹1.83Cr', color: 'var(--success)' },
                      { label: 'Liabilities', val: '₹42.5L', color: 'var(--danger)' },
                      { label: 'Actions', val: '3 Pending', color: 'var(--warning)' },
                    ].map((s, i) => (
                      <div key={i} className="neu-card-sm" style={{ padding: '0.65rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: s.color }}>{s.val}</div>
                        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Alert pill */}
                  <div style={{
                    marginTop: '1rem', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)',
                    background: '#fffbeb', border: '1px solid rgba(217,119,6,0.3)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    boxShadow: '2px 2px 6px rgba(217,119,6,0.08)',
                  }}>
                    <AlertTriangle size={14} color="#D97706" />
                    <span style={{ fontSize: '0.72rem', color: '#92400e', fontWeight: 600 }}>TEE Confirmation Required · LIC Policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
          animation: 'heroFloat 2s ease-in-out infinite',
        }}>
          <div style={{ width: 24, height: 36, borderRadius: 12, border: '2px solid rgba(0,102,102,0.3)', display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
            <div style={{ width: 4, height: 8, borderRadius: 2, background: 'var(--primary)', animation: 'heroFloat 1.5s ease-in-out infinite' }} />
          </div>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>SCROLL</span>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section ref={statsRef} style={{ background: 'var(--surface-dark)', borderTop: '1px solid rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(255,255,255,0.8)', padding: '3.5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeInSection>
            <div className="stats-grid">
              <StatCard icon={<Users size={22} color="var(--primary)" />} value={12000} suffix="+" label="Families Supported Across India" started={statsStarted} delay={0} />
              <StatCard icon={<FileText size={22} color="var(--primary)" />} value={85000} suffix="+" label="Documents Extracted via TEE OCR" started={statsStarted} delay={0.15} />
              <StatCard icon={<TrendingUp size={22} color="var(--primary)" />} value={99} suffix="%" label="Data Confidentiality Guarantee" started={statsStarted} delay={0.3} />
              <StatCard icon={<Clock size={22} color="var(--primary)" />} value={40} suffix="%" label="Faster Estate Closure vs Traditional" started={statsStarted} delay={0.45} />
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeInSection>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span className="badge-tee" style={{ padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700, marginBottom: '1rem', display: 'inline-block' }}>
                PLATFORM CAPABILITIES
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>
                Everything Your Family Needs
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
                From secure document vaulting to AI-powered estate analysis — VIRASAT handles the financial complexity so your family can focus on what matters.
              </p>
            </div>
          </FadeInSection>

          <div className="feature-grid">
            {[
              {
                icon: <Lock size={22} color="var(--primary)" />,
                title: 'TEE-Protected Document Vault',
                description: 'All sensitive documents (Aadhaar, PAN, wills, insurance) are encrypted inside Trusted Execution Environments. Zero-knowledge architecture — even VIRASAT cannot read your data.',
                badge: 'TEE',
                delay: 0,
              },
              {
                icon: <Zap size={22} color="#D97706" />,
                title: 'AI Document Extraction',
                description: 'Custom OCR + layout models extract fields from complex Indian financial documents: bank passbooks, LIC policies, property deeds. Confidence scores drive human-in-the-loop confirmation.',
                accent: '#D97706',
                delay: 0.1,
              },
              {
                icon: <BarChart2 size={22} color="var(--primary)" />,
                title: 'Explainable Priority Engine',
                description: 'Every action item has an urgency score backed by explainable logic: daily financial exposure, compounding penalties, regulatory deadlines. No black boxes.',
                delay: 0.2,
              },
              {
                icon: <Users size={22} color="#00A63D" />,
                title: 'Family Member Roles & Permissions',
                description: 'Grant section-level access to executors, lawyers, or family members. Full audit trail of who viewed, edited, or acted on each estate record.',
                accent: '#00A63D',
                delay: 0.3,
              },
              {
                icon: <Database size={22} color="var(--primary)" />,
                title: 'Complete Digital Estate Inventory',
                description: 'Automated discovery and mapping of all assets (bank accounts, FDs, mutual funds, property, insurance) and liabilities (home loans, EMIs, credit) into one unified view.',
                delay: 0.4,
              },
              {
                icon: <Eye size={22} color="#E11D48" />,
                title: 'Immutable Audit Ledger',
                description: 'Every action — document upload, confirmation, task assignment — is recorded in a tamper-proof audit log. Critical for legal proceedings and probate courts.',
                accent: '#E11D48',
                delay: 0.5,
              },
              {
                icon: <Upload size={22} color="var(--primary)" />,
                title: 'Batch Document Upload',
                description: 'Drag-and-drop multiple documents at once. Automatic file type detection (PDF, JPG, PNG) with background processing queue and real-time status updates.',
                delay: 0.6,
              },
              {
                icon: <Heart size={22} color="#E11D48" />,
                title: 'Designed for Grief',
                description: 'Simple, calm UI designed for distressed users. Progressive disclosure — complex legal information is hidden until needed. Available in English & Hindi.',
                accent: '#E11D48',
                delay: 0.7,
              },
            ].map((f, i) => (
              <FadeInSection key={i} delay={f.delay}>
                <FeatureCard
                  icon={f.icon}
                  title={f.title}
                  description={f.description}
                  accent={f.accent}
                  badge={f.badge}
                />
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ background: 'var(--surface-dark)', borderTop: '1px solid rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(255,255,255,0.8)', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeInSection>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span className="badge-medium" style={{ padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700, marginBottom: '1rem', display: 'inline-block' }}>
                WORKFLOW
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>
                From Loss to Closure in 4 Steps
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
                VIRASAT guides your family through each stage of estate closure — securely and systematically.
              </p>
            </div>
          </FadeInSection>

          <div className="how-it-works-grid">
            {[
              { step: 1, icon: <Upload size={20} />, title: 'Register & Upload Documents', description: 'Create a secure estate case. Upload all physical and digital financial documents. Our TEE-secured pipeline processes them immediately — encrypted in transit and at rest.' },
              { step: 2, icon: <Eye size={20} />, title: 'Review AI Extraction & Confirm', description: 'AI extracts account numbers, nominees, balances, and policy details automatically. Low-confidence fields are flagged for human confirmation before entering the official inventory.' },
              { step: 3, icon: <BarChart2 size={20} />, title: 'Receive Your Prioritized Action Plan', description: 'The explainable priority engine calculates urgency scores for each estate action. Understand exactly why each task is urgent — penalty rates, interest accrual, and deadlines explained clearly.' },
              { step: 4, icon: <CheckCircle size={20} />, title: 'Execute, Delegate & Track Closure', description: 'Assign tasks to family members or legal advisors. Track completion across bank claims, insurance nominations, property transfers, and more — until 100% closure is achieved.' },
            ].map((step, i) => (
              <FadeInSection key={i} delay={i * 0.15}>
                <StepCard {...step} />
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY SECTION ── */}
      <section id="security" style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <FadeInSection>
              <div>
                <span className="badge-tee" style={{ padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700, marginBottom: '1rem', display: 'inline-block' }}>
                  SECURITY ARCHITECTURE
                </span>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.04em', marginBottom: '1rem' }}>
                  Trusted Execution Environments — Zero Compromise
                </h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                  Your estate data is processed inside a hardware-sealed enclave. TEE guarantees that not even VIRASAT's administrators can access your raw documents. Cryptographic attestation is generated for every sensitive operation.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {[
                    { text: 'Hardware-enforced memory isolation (Intel SGX / ARM TrustZone)' },
                    { text: 'Encrypted extraction pipeline — plaintext never leaves the enclave' },
                    { text: 'Cryptographic attestation report for every document process' },
                    { text: 'DPDP Act 2023 compliant data handling and consent management' },
                    { text: 'Immutable audit trail — legally admissible for probate courts' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', background: 'var(--primary-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                        boxShadow: '2px 2px 6px rgba(182,192,206,0.3), -2px -2px 6px #fff',
                      }}>
                        <CheckCircle size={12} color="var(--primary)" />
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              {/* TEE diagram card */}
              <div className="neu-card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, var(--primary), #009999, #00cccc)' }} />
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <div style={{
                      position: 'absolute', inset: -12, borderRadius: '50%',
                      border: '2px solid rgba(0,102,102,0.2)',
                      animation: 'pulse-ring 2s ease-out infinite',
                    }} />
                    <div style={{
                      position: 'absolute', inset: -24, borderRadius: '50%',
                      border: '2px solid rgba(0,102,102,0.1)',
                      animation: 'pulse-ring 2s 0.5s ease-out infinite',
                    }} />
                    <div style={{
                      width: 72, height: 72, borderRadius: '50%', background: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: 'var(--neu-shadow-primary)',
                    }}>
                      <Shield size={32} color="#fff" />
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>TEE ENCLAVE STATUS</div>
                  <span className="badge-tee" style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700 }}>
                    ● ACTIVE &amp; ATTESTED
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {[
                    { label: 'Enclave Memory', value: 'Isolated · Encrypted', ok: true },
                    { label: 'Key Release Policy', value: 'TEE-gated', ok: true },
                    { label: 'Attestation Cert', value: 'Valid · PCCS Verified', ok: true },
                    { label: 'Data Residency', value: 'India (ap-south-1)', ok: true },
                  ].map((row, i) => (
                    <div key={i} className="neu-card-sm" style={{ padding: '0.65rem 0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{row.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <CheckCircle size={13} color={row.ok ? 'var(--success)' : 'var(--danger)'} />
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: row.ok ? 'var(--success)' : 'var(--danger)' }}>{row.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ background: 'var(--surface-dark)', borderTop: '1px solid rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(255,255,255,0.8)', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeInSection>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="badge-medium" style={{ padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700, marginBottom: '1rem', display: 'inline-block' }}>
                TESTIMONIALS
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>
                Trusted by Indian Families
              </h2>
            </div>
          </FadeInSection>

          <div className="testimonials-grid">
            {[
              {
                name: 'Priya Menon', role: 'Estate Executor, Kochi', initial: 'PM',
                quote: 'After my father passed, navigating 12 bank accounts and 3 insurance policies felt impossible. VIRASAT extracted everything automatically and told us exactly what to do first. We closed the estate in 3 months.',
              },
              {
                name: 'Arjun Kapoor', role: 'Chartered Accountant, Mumbai', initial: 'AK',
                quote: 'As a CA who handles estate matters professionally, VIRASAT\'s explainable priority scores and audit trail have become indispensable. The TEE architecture is genuinely impressive for financial data.',
              },
              {
                name: 'Sunita Rao', role: 'Family Member, Bengaluru', initial: 'SR',
                quote: 'The family member access controls were exactly what we needed. My mother could see the estate progress without accessing sensitive vault data. Very thoughtfully designed for Indian joint families.',
              },
            ].map((t, i) => (
              <FadeInSection key={i} delay={i * 0.15}>
                <TestimonialCard {...t} />
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section style={{ padding: '7rem 2rem' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <FadeInSection>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
              <div style={{
                position: 'absolute', inset: -16, borderRadius: 'var(--radius-xl)',
                background: 'radial-gradient(ellipse at center, rgba(0,102,102,0.08) 0%, transparent 70%)',
                filter: 'blur(12px)',
              }} />
              <div className="neu-card" style={{ padding: '1.5rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', borderRadius: 'var(--radius-xl)' }}>
                <Shield size={28} color="var(--primary)" />
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em' }}>VIRASAT</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>विरासत</span>
              </div>
            </div>

            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.04em', marginBottom: '1rem', lineHeight: 1.15 }}>
              Secure Your Family's<br />Financial Legacy Today
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 480, margin: '0 auto 2.5rem' }}>
              Estate closure should be a time for healing, not financial chaos. VIRASAT handles the complexity with military-grade security and compassionate design.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="hero-cta-primary" onClick={onEnterApp} id="final-cta-btn" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                <Shield size={20} />
                Enter VIRASAT Securely
              </button>
              <button className="hero-cta-secondary" onClick={() => scrollTo('features')} style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                Explore Features
                <ArrowRight size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.5rem', fontFamily: 'var(--font-mono)' }}>
              TEE-Protected · No Data Sold · DPDP Compliant · Made in India 🇮🇳
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: 'var(--surface-dark)',
        borderTop: '1px solid rgba(255,255,255,0.8)',
        padding: '2.5rem 2rem',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 'var(--radius-md)', background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--neu-shadow-primary)',
            }}>
              <Shield size={14} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em' }}>VIRASAT</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>विरासत</span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Terms of Service', 'Security', 'Contact'].map(link => (
              <button key={link} className="nav-link" style={{ fontSize: '0.78rem' }}>{link}</button>
            ))}
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            © 2026 VIRASAT · Built for India 🇮🇳
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
