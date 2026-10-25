import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Menu, X } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { Footer } from './index';
import VideoPortfolioSection from '@/components/portfolio/VideoPortfolioSection';

export const Route = createFileRoute('/projects')({
  head: () => ({
    meta: [
      { title: 'Our Portfolio — Sawaqly Marketing Agency' },
      { name: 'description', content: 'Explore our video portfolio and client showcases.' },
      { property: 'og:title', content: 'Sawaqly Portfolio' },
      { property: 'og:description', content: 'The Product Behind Millions Of Views. Over 12M users on social media.' },
    ],
  }),
  component: ProjectsPage,
});

// ─── Header ──────────────────────────────────────────────────────────────────
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const { lang, setLang, t } = useI18n();

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const delta = y - lastY.current;
      if (y > 80 && delta > 4) { setHidden(true); setOpen(false); }
      else if (delta < -4) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const handleModalOpen = () => { setHidden(true); setOpen(false); };
    const handleModalClose = () => { setHidden(false); };
    window.addEventListener('sawaqly:modal-open', handleModalOpen);
    window.addEventListener('sawaqly:modal-close', handleModalClose);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('sawaqly:modal-open', handleModalOpen);
      window.removeEventListener('sawaqly:modal-close', handleModalClose);
    };
  }, []);

  return (
    <header className={`fixed top-4 left-0 right-0 z-40 px-4 transition-transform duration-300 ease-out ${hidden ? '-translate-y-[150%]' : 'translate-y-0'}`}>
      <div className={`nav-shell mx-auto max-w-[88rem] glass glass-hover rounded-full px-6 md:px-8 h-14 flex items-center justify-between ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <img src="/SAWAQLYLOGO1.png" alt="Sawaqly" className="h-7 w-auto object-contain" />
          <span>SAWAQLY</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-8 text-sm">
          <Link to="/" className="hover:text-brand-blue transition">{t('nav.services')}</Link>
          <Link to="/projects" className="text-brand-blue font-semibold">{t('nav.projects')}</Link>
          <Link to="/" className="hover:text-brand-blue transition">{t('nav.team')}</Link>
          <Link to="/" className="hover:text-brand-blue transition">{t('nav.contact')}</Link>
          <Link to="/careers" className="hover:text-brand-blue transition">{t('nav.careers')}</Link>
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="glass glass-hover rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide uppercase">
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
          <Link to="/" hash="contact" className="glass glass-tint-blue glass-hover glass-glow inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium">
            {t('nav.cta')} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="flex lg:hidden items-center gap-2">
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="glass glass-hover rounded-full px-3 py-1.5 text-xs font-bold tracking-wide uppercase">
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
          <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(v => !v)} className="glass glass-hover rounded-full p-2 text-navy">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <div className={`lg:hidden mx-auto max-w-[88rem] overflow-hidden transition-all duration-300 ease-out ${open ? 'max-h-96 opacity-100 mt-2 pointer-events-auto' : 'max-h-0 opacity-0 mt-0 pointer-events-none'}`}>
        <div className="glass glass-strong rounded-3xl p-4 flex flex-col gap-1">
          <Link onClick={() => setOpen(false)} to="/" className="rounded-2xl px-4 py-3 text-sm font-medium text-navy hover:bg-white/10 transition">{t('nav.services')}</Link>
          <Link onClick={() => setOpen(false)} to="/projects" className="rounded-2xl px-4 py-3 text-sm font-medium text-brand-blue hover:bg-white/10 transition">{t('nav.projects')}</Link>
          <Link onClick={() => setOpen(false)} to="/" className="rounded-2xl px-4 py-3 text-sm font-medium text-navy hover:bg-white/10 transition">{t('nav.team')}</Link>
          <Link onClick={() => setOpen(false)} to="/" className="rounded-2xl px-4 py-3 text-sm font-medium text-navy hover:bg-white/10 transition">{t('nav.contact')}</Link>
          <Link onClick={() => setOpen(false)} to="/careers" className="rounded-2xl px-4 py-3 text-sm font-medium text-navy hover:bg-white/10 transition">{t('nav.careers')}</Link>
          <Link onClick={() => setOpen(false)} to="/" hash="contact" className="glass glass-tint-blue glass-hover glass-glow mt-2 inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold">
            {t('nav.cta')} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function ProjectsPage() {
  const { lang } = useI18n();

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Ambient BG */}
      <div className="ambient-bg" aria-hidden>
        <div className="ambient-orb" style={{ width: 380, height: 380, top: '20%', left: '30%', background: 'radial-gradient(circle, color-mix(in oklab, var(--brand-blue) 45%, transparent), transparent 70%)' }} />
        <div className="absolute top-[15%] right-[10%] w-48 h-48 rounded-full bg-brand-yellow/20 blur-[50px] mix-blend-screen" />
        <div className="absolute bottom-[10%] left-[15%] w-64 h-64 rounded-full bg-brand-blue/20 blur-[60px] mix-blend-screen" />
        {/* Stars */}
        <div className="absolute top-[15%] left-[10%] w-2 h-2 rounded-full bg-white/90 blur-[0.5px] animate-pulse" />
        <div className="absolute top-[40%] right-[30%] w-3 h-3 rounded-full bg-brand-yellow/90 blur-[1px]" style={{ animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute bottom-[20%] left-[25%] w-1.5 h-1.5 rounded-full bg-brand-blue/90 blur-[0.5px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <Header />

      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-16 md:pt-28 md:pb-24">
        {/* Back Link */}
        <div className="reveal in w-full mb-2 flex justify-start">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-blue transition-colors font-medium">
            {lang === 'ar' ? (
              <><ArrowRight size={16} /> العودة للرئيسية</>
            ) : (
              <><ArrowLeft size={16} /> Back to Home</>
            )}
          </Link>
        </div>

        {/* Video Portfolio Showcase */}
        <VideoPortfolioSection className="!py-4 sm:!py-8" />
      </main>
      <Footer />
    </div>
  );
}
