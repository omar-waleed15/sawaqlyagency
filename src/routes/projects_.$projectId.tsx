import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, ExternalLink, Menu, X, Loader2, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useI18n } from '../lib/i18n';
import { Footer } from './index';
import { DEFAULT_PROJECTS } from '../lib/defaultData';

export const Route = createFileRoute('/projects_/$projectId')({
  component: ProjectDetailsPage,
});


// ─── Top Image Carousel & Gallery ──────────────────────────────────────────────
function ImageCarousel({ images, title, lang }: { images: string[]; title: string; lang: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const prevSlide = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const nextSlide = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (lang === 'ar') nextSlide();
        else prevSlide();
      } else if (e.key === 'ArrowRight') {
        if (lang === 'ar') prevSlide();
        else nextSlide();
      } else if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lang, nextSlide, prevSlide, isLightboxOpen]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped Left
        if (lang === 'ar') prevSlide();
        else nextSlide();
      } else {
        // Swiped Right
        if (lang === 'ar') nextSlide();
        else prevSlide();
      }
    }
    touchStartX.current = null;
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="reveal relative w-full max-w-4xl mb-20 flex flex-col items-center">
      {/* Ambient glow behind carousel */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-brand-blue/30 to-brand-yellow/30 blur-2xl rounded-[3rem] opacity-60 mix-blend-screen pointer-events-none" />

      {/* Main Viewport Container */}
      <div 
        className="relative rounded-[2rem] overflow-hidden shadow-2xl glass-strong border border-white/10 w-full bg-black/50 aspect-video md:aspect-[21/9] select-none group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Track */}
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(${lang === 'ar' ? selectedIndex * 100 : -selectedIndex * 100}%)` }}
        >
          {images.map((src, idx) => (
            <div
              key={idx}
              className="relative min-w-0 flex-[0_0_100%] h-full w-full shrink-0 cursor-pointer overflow-hidden"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img
                src={src}
                alt={`${title} - slide ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* Expand / Lightbox Trigger Badge */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 left-4 z-10 glass px-3 py-1.5 rounded-full text-xs font-semibold text-white/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5"
          aria-label="Expand image"
        >
          <Maximize2 size={14} /> Fullscreen
        </button>

        {/* Slide Counter Badge (Airbnb Style) */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 z-10 glass px-3 py-1.5 rounded-full text-xs font-mono font-bold text-white/90 shadow-lg">
            {selectedIndex + 1} / {images.length}
          </div>
        )}

        {/* Floating Side Arrows (always visible) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass glass-hover flex items-center justify-center text-white transition-transform hover:scale-110 shadow-2xl z-10"
              aria-label="Previous image"
            >
              {lang === 'ar' ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass glass-hover flex items-center justify-center text-white transition-transform hover:scale-110 shadow-2xl z-10"
              aria-label="Next image"
            >
              {lang === 'ar' ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
            </button>
          </>
        )}
      </div>

      {/* Navigation Controls & Dots Bar UNDER the Carousel */}
      {images.length > 1 && (
        <div className="mt-6 w-full flex flex-col items-center gap-4">
          {/* Arrow Buttons & Dots Row */}
          <div className="flex items-center gap-4">
            {/* Left Arrow Button */}
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full glass glass-hover flex items-center justify-center text-white transition-transform hover:scale-110 shadow-lg border border-white/10"
              aria-label="Previous photo"
            >
              {lang === 'ar' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            {/* Dots Counter Bar */}
            <div className="flex items-center gap-2 glass px-4 py-2.5 rounded-full border border-white/10 bg-black/40 shadow-xl">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === selectedIndex
                      ? 'w-7 bg-brand-yellow shadow-md shadow-brand-yellow/40'
                      : 'w-2.5 bg-white/40 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Right Arrow Button */}
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full glass glass-hover flex items-center justify-center text-white transition-transform hover:scale-110 shadow-lg border border-white/10"
              aria-label="Next photo"
            >
              {lang === 'ar' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          {/* Top Bar */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-white z-20">
            <span className="font-mono text-sm font-bold glass px-4 py-2 rounded-full">
              {selectedIndex + 1} / {images.length} — {title}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="glass glass-hover w-11 h-11 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
              aria-label="Close fullscreen view"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Lightbox Image */}
          <div className="relative max-w-6xl max-h-[80vh] w-full h-full flex items-center justify-center">
            <img
              src={images[selectedIndex]}
              alt={title}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            />
          </div>

          {/* Lightbox Navigation Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass glass-hover flex items-center justify-center text-white transition-transform hover:scale-110 shadow-2xl z-20"
                aria-label="Previous image"
              >
                {lang === 'ar' ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass glass-hover flex items-center justify-center text-white transition-transform hover:scale-110 shadow-2xl z-20"
                aria-label="Next image"
              >
                {lang === 'ar' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
              </button>

              {/* Lightbox Thumbnail Strip */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 max-w-full overflow-x-auto px-4 py-2 glass rounded-full">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`w-12 h-9 rounded-lg overflow-hidden shrink-0 transition-all ${
                      idx === selectedIndex ? 'border-2 border-brand-yellow scale-110 opacity-100' : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

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
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*, services(title, title_ar)')
          .eq('id', projectId)
          .single();
        if (error || !data) {
          const found = DEFAULT_PROJECTS.find(p => p.id === projectId);
          if (found) return found;
          throw error || new Error('Project not found');
        }
        return data;
      } catch {
        const found = DEFAULT_PROJECTS.find(p => p.id === projectId);
        if (found) return found;
        return null;
      }
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

  // Gather all unique images (Service Card Image first, followed by content block images)
  const rawBlocks = project.content_blocks;
  const blocks: any[] = Array.isArray(rawBlocks)
    ? rawBlocks
    : typeof rawBlocks === 'string'
    ? (() => { try { return JSON.parse(rawBlocks); } catch { return []; } })()
    : [];

  const carouselImages: string[] = [];
  if (project.image_url && typeof project.image_url === 'string' && project.image_url.trim()) {
    carouselImages.push(project.image_url.trim());
  }
  blocks.forEach((block: any) => {
    if (block && block.type === 'image' && block.url && typeof block.url === 'string' && block.url.trim()) {
      const cleanUrl = block.url.trim();
      if (!carouselImages.includes(cleanUrl)) {
        carouselImages.push(cleanUrl);
      }
    }
  });

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

        {/* Top Image Carousel */}
        <ImageCarousel images={carouselImages} title={title} lang={lang} />

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
                // Images are featured in the top carousel
                return null;
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
