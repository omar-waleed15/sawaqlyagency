import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, ExternalLink, Menu, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useI18n } from '../lib/i18n';
import { Footer } from './index';

export const Route = createFileRoute('/projects_/$projectId')({
  component: ProjectDetailsPage,
});

// ─── Header ───────────────────────────────────────────────────────────────────
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

// ─── Main Page ────────────────────────────────────────────────────────────────
function ProjectDetailsPage() {
  const { projectId } = Route.useParams();
  const { lang } = useI18n();
  const router = useRouter();

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

  const { data: project, isLoading: projLoading } = useQuery({
    queryKey: ['projects', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, services(title, title_ar)')
        .eq('id', projectId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (projLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-blue" size={48} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-foreground">
        <h1 className="text-2xl font-bold text-navy">Project not found</h1>
        <button onClick={() => router.history.back()} className="glass glass-hover px-4 py-2 rounded-full text-sm">
          Go back
        </button>
      </div>
    );
  }

  const title = lang === 'ar' && project.title_ar ? project.title_ar : project.title_en;
  const description = lang === 'ar' && project.description_ar ? project.description_ar : project.description_en;
  const categoryName = lang === 'ar' && project.services?.title_ar
    ? project.services.title_ar
    : project.services?.title;

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Ambient BG */}
      <div className="ambient-bg" aria-hidden>
        <div className="ambient-orb" style={{ width: 380, height: 380, top: '20%', left: '30%', background: 'radial-gradient(circle, color-mix(in oklab, var(--brand-blue) 45%, transparent), transparent 70%)' }} />
        <div className="absolute top-[15%] right-[10%] w-48 h-48 rounded-full bg-brand-yellow/20 blur-[50px] mix-blend-screen" />
        <div className="absolute bottom-[10%] left-[15%] w-64 h-64 rounded-full bg-brand-blue/20 blur-[60px] mix-blend-screen" />
      </div>

      <Header />

      <main className="relative mx-auto max-w-5xl px-6 pt-28 pb-20 md:pt-32 md:pb-32 flex flex-col items-center">
        {/* Header Container */}
        <div className="reveal w-full mb-16 flex flex-col md:flex-row md:items-center gap-6">
          {/* Back Link (Left Column) */}
          <div className="w-full md:w-48 flex-shrink-0 flex justify-start">
            <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-blue transition-colors font-medium">
              {lang === 'ar' ? (
                <><ArrowRight size={16} /> العودة إلى المشاريع</>
              ) : (
                <><ArrowLeft size={16} /> Back to Projects</>
              )}
            </Link>
          </div>

          {/* Title (Center Column) */}
          <div className="flex-1 text-center flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-navy" style={{ textWrap: 'balance' }}>{title}</h1>
          </div>

          {/* Spacer (Right Column) to keep title perfectly centered */}
          <div className="hidden md:block w-48 flex-shrink-0"></div>
        </div>

        {/* Glowing Inset Image */}
        {project.image_url && (
          <div className="reveal relative w-full max-w-4xl mb-24">
            {/* Ambient glow behind image */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-blue/30 to-brand-yellow/30 blur-2xl rounded-[3rem] opacity-60 mix-blend-screen pointer-events-none" />
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl glass-strong border border-white/10 w-full bg-black/50 aspect-video md:aspect-[21/9]">
              <img
                src={project.image_url}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Narrow Article Description */}
        <div className="reveal max-w-2xl w-full text-center space-y-12">
          {description && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light whitespace-pre-wrap">
              {description}
            </p>
          )}
        </div>

        {/* Dynamic Content Blocks */}
        {project.content_blocks && project.content_blocks.length > 0 && (
          <div className="w-full max-w-4xl space-y-16 py-12 flex flex-col items-center">
            {project.content_blocks.map((block: any) => {
              if (block.type === 'text') {
                const blockText = lang === 'ar' && block.text_ar ? block.text_ar : block.text_en;
                if (!blockText) return null;
                return (
                  <div key={block.id} className="reveal max-w-2xl w-full text-center text-lg md:text-xl text-muted-foreground leading-relaxed font-light whitespace-pre-wrap">
                    {blockText}
                  </div>
                );
              }
              if (block.type === 'image') {
                if (!block.url) return null;
                
                let containerClass = "reveal relative w-fit max-w-full rounded-[2rem] overflow-hidden shadow-xl glass-strong border border-white/10 bg-black/50 mx-auto";
                let imgClass = "max-w-full h-auto block";

                if (block.aspect === '16/9') {
                  containerClass = "reveal relative w-full rounded-[2rem] overflow-hidden shadow-xl glass-strong border border-white/10 bg-black/50 aspect-video";
                  imgClass = "w-full h-full absolute inset-0 object-cover";
                } else if (block.aspect === '9/16') {
                  containerClass = "reveal relative w-full rounded-[2rem] overflow-hidden shadow-xl glass-strong border border-white/10 bg-black/50 aspect-[9/16] max-w-[400px] mx-auto";
                  imgClass = "w-full h-full absolute inset-0 object-cover";
                } else if (block.aspect === '1/1') {
                  containerClass = "reveal relative w-full rounded-[2rem] overflow-hidden shadow-xl glass-strong border border-white/10 bg-black/50 aspect-square max-w-[600px] mx-auto";
                  imgClass = "w-full h-full absolute inset-0 object-cover";
                } else if (block.aspect === '4/3') {
                  containerClass = "reveal relative w-full rounded-[2rem] overflow-hidden shadow-xl glass-strong border border-white/10 bg-black/50 aspect-[4/3] max-w-[800px] mx-auto";
                  imgClass = "w-full h-full absolute inset-0 object-cover";
                }

                return (
                  <div key={block.id} className={containerClass}>
                    <img src={block.url} alt="" className={imgClass} />
                  </div>
                );
              }
              if (block.type === 'video') {
                if (!block.url) return null;
                let videoUrl = block.url;
                
                // YouTube Standard & Shorts
                const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
                if (isYouTube) {
                  if (videoUrl.includes('watch?v=')) {
                    videoUrl = videoUrl.replace('watch?v=', 'embed/').split('&')[0];
                  } else if (videoUrl.includes('youtu.be/')) {
                    videoUrl = videoUrl.replace('youtu.be/', 'youtube.com/embed/').split('?')[0];
                  } else if (videoUrl.includes('/shorts/')) {
                    videoUrl = videoUrl.replace('/shorts/', '/embed/').split('?')[0];
                  }
                }

                // Instagram Reels/Posts
                const isInstagram = videoUrl.includes('instagram.com/reel/') || videoUrl.includes('instagram.com/p/');
                if (isInstagram) {
                  // Ensure URL ends with /embed
                  videoUrl = videoUrl.split('?')[0];
                  if (!videoUrl.endsWith('/')) videoUrl += '/';
                  videoUrl += 'embed';
                }

                // TikTok
                const isTikTok = videoUrl.includes('tiktok.com');
                if (isTikTok) {
                  const match = videoUrl.match(/video\/(\d+)/);
                  if (match) {
                    videoUrl = `https://www.tiktok.com/embed/v2/${match[1]}`;
                  }
                }

                const isIframe = isYouTube || isInstagram || isTikTok;
                
                let aspectClass = '';
                if (block.aspect === '16/9') aspectClass = 'aspect-video';
                else if (block.aspect === '9/16') aspectClass = 'aspect-[9/16] max-w-[400px] mx-auto';
                else if (block.aspect === '1/1') aspectClass = 'aspect-square max-w-[600px] mx-auto';
                else if (block.aspect === '4/3') aspectClass = 'aspect-[4/3] max-w-[800px] mx-auto';
                else aspectClass = 'aspect-video'; // fallback for video
                
                return (
                  <div key={block.id} className={`reveal relative w-full rounded-[2rem] overflow-hidden shadow-2xl glass-strong border border-white/10 bg-black/50 ${aspectClass}`}>
                    {isIframe ? (
                      <iframe
                        className="w-full h-full absolute inset-0"
                        src={videoUrl}
                        title="Video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video 
                        controls 
                        playsInline
                        controlsList="nodownload"
                        onContextMenu={(e) => e.preventDefault()}
                        className="w-full h-full absolute inset-0 object-contain bg-black/50" 
                      >
                        <source src={videoUrl} type={videoUrl.toLowerCase().endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
                        <source src={videoUrl} />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* Action Link */}
        <div className="reveal mt-12">
          {project.link_url && (
            <div className="pt-4">
              <a
                href={project.link_url}
                target="_blank"
                rel="noreferrer"
                className="glass glass-tint-blue glass-hover glass-glow inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold transition-all shadow-lg shadow-brand-blue/20 hover:-translate-y-1"
              >
                {lang === 'ar' ? 'زيارة المشروع' : 'Visit Project'} <ExternalLink size={16} />
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
