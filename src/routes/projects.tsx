import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ArrowLeft, ExternalLink, Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useI18n } from '../lib/i18n';
import InteractiveLogo from '@/components/InteractiveLogo';
import { Footer } from './index';

export const Route = createFileRoute('/projects')({
  validateSearch: (search: Record<string, unknown>) => ({
    service: (search.service as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: 'Our Projects — Sawaqly Marketing Agency' },
      { name: 'description', content: 'Browse our portfolio of work across branding, digital, social media, and more.' },
      { property: 'og:title', content: 'Sawaqly Projects' },
      { property: 'og:description', content: 'Our work speaks for itself. Explore projects by category.' },
    ],
  }),
  component: ProjectsPage,
});

// ─── Header (reused from index, adapted for standalone page) ──────────────────
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
    return () => window.removeEventListener('scroll', onScroll);
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

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, lang, index }: { project: any; lang: string; index: number }) {
  const title = lang === 'ar' && project.title_ar ? project.title_ar : project.title_en;
  const description = lang === 'ar' && project.description_ar ? project.description_ar : project.description_en;

  return (
    <div
      className="group glass glass-hover rounded-3xl overflow-hidden reveal in flex flex-col"
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video bg-white/5 shrink-0">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-sm">No image</div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* External link icon on hover */}
        {project.link_url && (
          <a
            href={project.link_url}
            target="_blank"
            rel="noreferrer"
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label={`Open ${title}`}
          >
            <span className="glass glass-tint-blue rounded-full p-3 shadow-2xl">
              <ExternalLink size={20} />
            </span>
          </a>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-navy leading-snug">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed font-light line-clamp-2 flex-grow">{description}</p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <div className="h-[2px] w-8 bg-brand-yellow group-hover:w-16 transition-all duration-500" />
          <Link
            to="/projects/$projectId"
            params={{ projectId: project.id }}
            className="w-10 h-10 rounded-full glass glass-tint-blue flex items-center justify-center transition-transform hover:scale-110 shadow-lg shadow-brand-blue/20"
            aria-label="View Project Details"
          >
            <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
          </Link>
        </div>
      </div>
    </div>
  );
}


// ─── Main Page ────────────────────────────────────────────────────────────────
function ProjectsPage() {
  const { lang } = useI18n();
  const { service: serviceParam } = Route.useSearch();
  const [activeTab, setActiveTab] = useState<string | null>(serviceParam || 'all');

  // Scroll reveal
  useEffect(() => {
    const apply = () => {
      document.querySelectorAll<HTMLElement>('.reveal:not(.in)').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100) el.classList.add('in');
      });
    };
    apply();
    window.addEventListener('scroll', apply, { passive: true });
    return () => window.removeEventListener('scroll', apply);
  }, []);

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('id, title, title_ar').order('sort_order', { ascending: true, nullsFirst: false }).order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: allProjects = [], isLoading: projsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true, nullsFirst: false }).order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: copy } = useQuery({
    queryKey: ['website_copy'],
    queryFn: async () => {
      const { data, error } = await supabase.from('website_copy').select('*').eq('id', 1).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || {};
    },
  });

  const filteredProjects = activeTab === 'all' ? allProjects : activeTab ? allProjects.filter((p: any) => p.service_id === activeTab) : [];
  const isLoading = servicesLoading || projsLoading;

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

      <main className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 md:pt-40 md:pb-24">
        {/* Header Container */}
        <div className="reveal w-full mb-14 flex flex-col md:flex-row md:items-start gap-6">
          {/* Back Link (Left Column) */}
          <div className="w-full md:w-48 flex-shrink-0 flex justify-start md:pt-4">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-blue transition-colors font-medium">
              {lang === 'ar' ? (
                <><ArrowRight size={16} /> العودة للرئيسية</>
              ) : (
                <><ArrowLeft size={16} /> Back to Home</>
              )}
            </Link>
          </div>

          {/* Title (Center Column) */}
          <div className="flex-1 text-center flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight uppercase">
              {(() => {
                const fullTitle = lang === 'ar' ? (copy?.projects_title_ar || 'مشاريعنا.') : (copy?.projects_title_en || 'Our Projects.');
                const words = fullTitle.split(' ');
                const lastWord = words.pop();
                const firstPart = words.join(' ');
                return (
                  <>
                    {firstPart} <span className="text-brand-yellow">{lastWord}</span>
                  </>
                );
              })()}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              {lang === 'ar' ? (copy?.projects_sub_ar || 'تصفح أعمالنا عبر جميع المجالات التي نمارسها.') : (copy?.projects_sub_en || 'Browse our portfolio of work across every discipline we practice.')}
            </p>
          </div>

          {/* Spacer (Right Column) to keep title perfectly centered */}
          <div className="hidden md:block w-48 flex-shrink-0"></div>
        </div>

        {/* Tabs */}
        {!isLoading && services.length > 0 && (
          <div className="reveal flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'all'
                  ? 'glass glass-tint-blue glass-glow text-white shadow-lg scale-105'
                  : 'glass glass-hover text-muted-foreground hover:text-foreground'
              }`}
            >
              {lang === 'ar' ? 'الكل' : 'All'}
            </button>
            {services.map((svc: any) => {
              const name = lang === 'ar' && svc.title_ar ? svc.title_ar : svc.title;
              const isActive = activeTab === svc.id;
              return (
                <button
                  key={svc.id}
                  onClick={() => setActiveTab(svc.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'glass glass-tint-blue glass-glow text-white shadow-lg scale-105'
                      : 'glass glass-hover text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-3xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-white/5" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-white/10 rounded-lg w-3/4" />
                  <div className="h-3 bg-white/5 rounded-lg w-full" />
                  <div className="h-3 bg-white/5 rounded-lg w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && (
          <>
            {filteredProjects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project: any, i: number) => (
                  <ProjectCard key={project.id} project={project} lang={lang} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4">
                <div className="w-20 h-20 rounded-full glass flex items-center justify-center opacity-30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/><path d="M3 7l9 6 9-6"/></svg>
                </div>
                <p className="text-sm">No projects in this category yet.</p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
