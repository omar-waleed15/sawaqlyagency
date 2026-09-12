import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Video,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MOCK_REELS, ReelItem } from "../../data/mockReelsData";
import { useI18n } from "../../lib/i18n";
import {
  fetchVideoPortfolioCopy,
  fetchVideoReels,
  DEFAULT_PORTFOLIO_COPY,
} from "../../lib/videoPortfolioData";

export default function VideoPortfolioSection({ className = "" }: { className?: string }) {
  const { lang, t } = useI18n();
  const queryClient = useQueryClient();

  // Fetch Section Copy
  const { data: copy = DEFAULT_PORTFOLIO_COPY } = useQuery({
    queryKey: ['video_portfolio_copy'],
    queryFn: fetchVideoPortfolioCopy,
  });

  // Fetch Video Reels List
  const { data: reelsList = [] } = useQuery({
    queryKey: ['video_portfolio_reels'],
    queryFn: fetchVideoReels,
  });

  const activeReelsList = reelsList;

  const [activeReel, setActiveReel] = useState<ReelItem | null>(activeReelsList[0] || null);
  const [exitingReel, setExitingReel] = useState<ReelItem | null>(null);
  const [handDirection, setHandDirection] = useState<"next" | "prev" | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev" | null>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up any pending transition timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  // Update active reel if list changes or activeReel is invalid
  useEffect(() => {
    if (activeReelsList.length > 0) {
      if (!activeReel || !activeReelsList.some((r) => r.id === activeReel.id)) {
        setActiveReel(activeReelsList[0]);
      }
    } else {
      setActiveReel(null);
    }
  }, [activeReelsList]);

  // Listen for admin real-time updates
  useEffect(() => {
    const handleCopyUpdate = () => queryClient.invalidateQueries({ queryKey: ['video_portfolio_copy'] });
    const handleReelsUpdate = () => queryClient.invalidateQueries({ queryKey: ['video_portfolio_reels'] });

    window.addEventListener('video-portfolio-copy-updated', handleCopyUpdate);
    window.addEventListener('video-portfolio-reels-updated', handleReelsUpdate);
    return () => {
      window.removeEventListener('video-portfolio-copy-updated', handleCopyUpdate);
      window.removeEventListener('video-portfolio-reels-updated', handleReelsUpdate);
    };
  }, [queryClient]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const currentIndex = activeReel ? Math.max(0, activeReelsList.findIndex((r) => r.id === activeReel.id)) : 0;

  const switchReel = (nextReel: ReelItem, direction: "next" | "prev") => {
    if (!nextReel || (activeReel && activeReel.id === nextReel.id)) return;
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    setSlideDirection(direction);
    setHandDirection(direction);
    setExitingReel(activeReel);
    setActiveReel(nextReel);
    setIsPlaying(true);

    transitionTimerRef.current = setTimeout(() => {
      setExitingReel(null);
      setHandDirection(null);
    }, 440);
  };

  const handlePrev = () => {
    if (activeReelsList.length <= 1) return;
    const prevIndex = (currentIndex - 1 + activeReelsList.length) % activeReelsList.length;
    switchReel(activeReelsList[prevIndex], "prev");
    if (carouselRef.current) {
      const scrollAmount = lang === "ar" ? 140 : -140;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (activeReelsList.length <= 1) return;
    const nextIndex = (currentIndex + 1) % activeReelsList.length;
    switchReel(activeReelsList[nextIndex], "next");
    if (carouselRef.current) {
      const scrollAmount = lang === "ar" ? -140 : 140;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleSelectReel = (reel: ReelItem) => {
    if (!activeReel || reel.id === activeReel.id) return;
    const targetIdx = activeReelsList.findIndex((r) => r.id === reel.id);
    const dir = targetIdx > currentIndex ? "next" : "prev";
    switchReel(reel, dir);
  };

  // Play/pause video when active reel changes or toggle state changes
  useEffect(() => {
    if (videoRef.current && activeReel) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => { });
          }
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [activeReel, isPlaying]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Get dynamic circular reels for left and right flanking cards
  const getCircularReels = (offset: number, count: number) => {
    if (activeReelsList.length <= 1) return [];
    const list: ReelItem[] = [];
    const actualCount = Math.min(count, Math.max(0, activeReelsList.length - 1));
    for (let i = 0; i < actualCount; i++) {
      const targetIndex = (currentIndex + offset + i + activeReelsList.length * 10) % activeReelsList.length;
      list.push(activeReelsList[targetIndex]);
    }
    return list;
  };

  const leftReels = getCircularReels(-3, 3);
  const rightReels = getCircularReels(1, 3);

  // Rainbow arc curve styles for left flanking cards
  // leftReels: index 0 (outermost -3), index 1 (middle -2), index 2 (closest -1)
  const getLeftArcStyle = (index: number) => {
    switch (index) {
      case 2: // Closest to center phone
        return {
          transform: "translateY(20px) rotate(-4deg) scale(0.96)",
          opacity: 0.95,
          zIndex: 14,
        };
      case 1: // Middle card
        return {
          transform: "translateY(52px) rotate(-9deg) scale(0.88)",
          opacity: 0.80,
          zIndex: 13,
        };
      case 0: // Outermost card
      default:
        return {
          transform: "translateY(96px) rotate(-15deg) scale(0.80)",
          opacity: 0.65,
          zIndex: 12,
        };
    }
  };

  // Rainbow arc curve styles for right flanking cards
  // rightReels: index 0 (closest +1), index 1 (middle +2), index 2 (outermost +3)
  const getRightArcStyle = (index: number) => {
    switch (index) {
      case 0: // Closest to center phone
        return {
          transform: "translateY(20px) rotate(4deg) scale(0.96)",
          opacity: 0.95,
          zIndex: 14,
        };
      case 1: // Middle card
        return {
          transform: "translateY(52px) rotate(9deg) scale(0.88)",
          opacity: 0.80,
          zIndex: 13,
        };
      case 2: // Outermost card
      default:
        return {
          transform: "translateY(96px) rotate(15deg) scale(0.80)",
          opacity: 0.65,
          zIndex: 12,
        };
    }
  };

  const displayTitle = lang === 'ar' ? copy.portfolio_title_ar : copy.portfolio_title_en;
  const displaySub = lang === 'ar' ? copy.portfolio_sub_ar : copy.portfolio_sub_en;
  const displayCta = lang === 'ar' ? copy.portfolio_cta_ar : copy.portfolio_cta_en;

  return (
    <section id="portfolio-reels" className={`relative py-14 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto reveal in select-none overflow-x-clip ${className}`}>
      <style>{`
        @keyframes slideRowNext {
          0% { transform: translateX(65px); opacity: 0.55; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideRowPrev {
          0% { transform: translateX(-65px); opacity: 0.55; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-next {
          animation: slideRowNext 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-prev {
          animation: slideRowPrev 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Synchronized Hand Arc Animations: emerging from & sliding to adjacent card positions */
        @keyframes handArcNextIn {
          0% {
            transform: translate3d(210px, 6px, 0) rotate(5deg) scale(0.68);
            opacity: 0.85;
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
            opacity: 1;
          }
        }
        @keyframes handArcNextOut {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate3d(-210px, 6px, 0) rotate(-5deg) scale(0.68);
            opacity: 0;
          }
        }
        @keyframes handArcPrevIn {
          0% {
            transform: translate3d(-210px, 6px, 0) rotate(-5deg) scale(0.68);
            opacity: 0.85;
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
            opacity: 1;
          }
        }
        @keyframes handArcPrevOut {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate3d(210px, 6px, 0) rotate(5deg) scale(0.68);
            opacity: 0;
          }
        }
        .animate-hand-next-in {
          animation: handArcNextIn 0.44s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .animate-hand-next-out {
          animation: handArcNextOut 0.44s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .animate-hand-prev-in {
          animation: handArcPrevIn 0.44s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .animate-hand-prev-out {
          animation: handArcPrevOut 0.44s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
          will-change: transform, opacity;
        }

        @media (max-width: 767px) {
          @keyframes handArcNextIn {
            0% {
              transform: translate3d(120px, 20px, 0) rotate(5deg) scale(0.78);
              opacity: 0.75;
            }
            100% {
              transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
              opacity: 1;
            }
          }
          @keyframes handArcNextOut {
            0% {
              transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate3d(-120px, 20px, 0) rotate(-5deg) scale(0.78);
              opacity: 0;
            }
          }
          @keyframes handArcPrevIn {
            0% {
              transform: translate3d(-120px, 20px, 0) rotate(-5deg) scale(0.78);
              opacity: 0.75;
            }
            100% {
              transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
              opacity: 1;
            }
          }
          @keyframes handArcPrevOut {
            0% {
              transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate3d(120px, 20px, 0) rotate(5deg) scale(0.78);
              opacity: 0;
            }
          }
        }
      `}</style>

      {/* Cosmic Nebulas and Orbs directly integrated into website background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-brand-blue/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-brand-yellow/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main Headline & Subtitle */}
      <div className="relative z-20 text-center px-4 mb-6">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.12] max-w-4xl mx-auto">
          {displayTitle || t("portfolio.title") || "The Product Behind Millions Of Views"}
        </h2>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
          {displaySub || t("portfolio.sub") || "Over 12M User On Social Media. Everyone's Talking About It."}
        </p>
      </div>

      {/* Showcase Stage: Flanking Reel Cards + Centerpiece Astronaut Hand holding iPhone 17 Pro */}
      <div 
        className="relative z-10 pt-4 pb-4 px-2 sm:px-4 cursor-grab active:cursor-grabbing"
        onTouchStart={(e) => setDragStartX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (dragStartX === null) return;
          const diff = e.changedTouches[0].clientX - dragStartX;
          if (diff < -45) handleNext();
          else if (diff > 45) handlePrev();
          setDragStartX(null);
        }}
        onMouseDown={(e) => setDragStartX(e.clientX)}
        onMouseUp={(e) => {
          if (dragStartX === null) return;
          const diff = e.clientX - dragStartX;
          if (diff < -50) handleNext();
          else if (diff > 50) handlePrev();
          setDragStartX(null);
        }}
      >
        <div className="flex items-end justify-center gap-2 sm:gap-4 lg:gap-6 relative">

          {/* Left Flanking Video Cards - Arched in Rainbow Curve */}
          <div 
            key={`left-${currentIndex}`}
            className={`hidden md:flex items-end gap-2.5 lg:gap-4 pb-16 lg:pb-24 shrink-0 transition-all ${
              slideDirection === "next" ? "animate-slide-next" : slideDirection === "prev" ? "animate-slide-prev" : ""
            }`}
          >
            {leftReels.map((reel, idx) => {
              const arc = getLeftArcStyle(idx);
              return (
                <div
                  key={reel.id}
                  onClick={() => handleSelectReel(reel)}
                  style={{
                    transform: arc.transform,
                    opacity: arc.opacity,
                    zIndex: arc.zIndex,
                    transformOrigin: "bottom center",
                  }}
                  className="group relative w-24 sm:w-28 md:w-32 lg:w-40 aspect-[9/16] rounded-[1.75rem] lg:rounded-[2.2rem] overflow-hidden border cursor-pointer transition-all duration-300 hover:!scale-105 hover:!-translate-y-3 hover:!rotate-0 hover:!opacity-100 hover:!z-30 select-none border-white/15 glass hover:border-white/40 shadow-xl"
                >
                  {reel.posterUrl ? (
                    <img
                      src={reel.posterUrl}
                      alt={reel.titleEn}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                    />
                  ) : (
                    <video
                      src={reel.videoUrl}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                      muted
                      preload="metadata"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity pointer-events-none" />
                </div>
              );
            })}
          </div>

          {/* Centerpiece: Astronaut Hand holding iPhone 17 Pro */}
          <div className="relative w-[280px] sm:w-[340px] md:w-[380px] lg:w-[430px] shrink-0 z-20">
            {/* Outgoing dropping/sliding hand */}
            {exitingReel && (
              <div
                key={`exit-${exitingReel.id}`}
                className={`absolute inset-0 pointer-events-none z-10 ${
                  handDirection === "next" ? "animate-hand-next-out" : "animate-hand-prev-out"
                }`}
              >
                <AstronautHandPhone
                  reel={exitingReel}
                  isExiting={true}
                  lang={lang}
                />
              </div>
            )}

            {/* Incoming rising hand */}
            <div
              key={`active-${activeReel?.id}`}
              className={`relative w-full z-20 ${
                handDirection === "next"
                  ? "animate-hand-next-in"
                  : handDirection === "prev"
                  ? "animate-hand-prev-in"
                  : ""
              }`}
            >
              <AstronautHandPhone
                reel={activeReel}
                isPlaying={isPlaying}
                isMuted={isMuted}
                videoRef={videoRef}
                onTogglePlay={togglePlay}
                onToggleMute={toggleMute}
                lang={lang}
              />
            </div>
          </div>

          {/* Right Flanking Video Cards - Arched in Rainbow Curve */}
          <div 
            key={`right-${currentIndex}`}
            className={`hidden md:flex items-end gap-2.5 lg:gap-4 pb-16 lg:pb-24 shrink-0 transition-all ${
              slideDirection === "next" ? "animate-slide-next" : slideDirection === "prev" ? "animate-slide-prev" : ""
            }`}
          >
            {rightReels.map((reel, idx) => {
              const arc = getRightArcStyle(idx);
              return (
                <div
                  key={reel.id}
                  onClick={() => handleSelectReel(reel)}
                  style={{
                    transform: arc.transform,
                    opacity: arc.opacity,
                    zIndex: arc.zIndex,
                    transformOrigin: "bottom center",
                  }}
                  className="group relative w-24 sm:w-28 md:w-32 lg:w-40 aspect-[9/16] rounded-[1.75rem] lg:rounded-[2.2rem] overflow-hidden border cursor-pointer transition-all duration-300 hover:!scale-105 hover:!-translate-y-3 hover:!rotate-0 hover:!opacity-100 hover:!z-30 select-none border-white/15 glass hover:border-white/40 shadow-xl"
                >
                  {reel.posterUrl ? (
                    <img
                      src={reel.posterUrl}
                      alt={reel.titleEn}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                    />
                  ) : (
                    <video
                      src={reel.videoUrl}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                      muted
                      preload="metadata"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity pointer-events-none" />
                </div>
              );
            })}
          </div>

        </div>

        {/* Mobile/Tablet Horizontal Reel Carousel (if > 1 reel) */}
        {activeReelsList.length > 1 && (
          <div className="md:hidden mt-4 mb-6 px-4">
            <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              {lang === "ar" ? "اضغط على أي فيديو للمشاهدة في الهاتف" : "Tap any reel to preview on device"}
            </p>
            <div ref={carouselRef} className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none">
              {activeReelsList.map((reel) => {
                const isActive = activeReel?.id === reel.id;
                return (
                  <div
                    key={reel.id}
                    onClick={() => handleSelectReel(reel)}
                    className={`relative shrink-0 w-24 aspect-[9/16] rounded-2xl overflow-hidden border snap-center cursor-pointer transition-all ${
                      isActive ? "border-brand-yellow ring-2 ring-brand-yellow scale-105" : "border-white/20 glass"
                    }`}
                  >
                    {reel.posterUrl ? (
                      <img src={reel.posterUrl} alt={reel.titleEn} className="w-full h-full object-cover" />
                    ) : (
                      <video src={reel.videoUrl} className="w-full h-full object-cover" muted preload="metadata" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Swipe / Scroll Buttons under the section (if > 1 reel) */}
        {activeReelsList.length > 1 && (
          <div className="mt-8 md:mt-10 flex items-center justify-center gap-4 relative z-30">
            <button
              onClick={handlePrev}
              aria-label="Previous Video"
              title={lang === "ar" ? "الفيديو السابق" : "Previous Video"}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full glass glass-tint-blue glass-hover glass-glow flex items-center justify-center text-white border border-white/20 transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-lg"
            >
              <ChevronLeft size={22} className={lang === "ar" ? "rotate-180" : ""} />
            </button>

            {/* Dots Indicator */}
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full glass border border-white/15 shadow-md">
              {activeReelsList.map((reel, idx) => (
                <button
                  key={reel.id}
                  onClick={() => handleSelectReel(reel)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    activeReel?.id === reel.id
                      ? "w-6 h-2 bg-brand-yellow shadow-[0_0_10px_rgba(255,200,50,0.6)]"
                      : "w-2 h-2 bg-white/30 hover:bg-white/70"
                  }`}
                  aria-label={`Select reel ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next Video"
              title={lang === "ar" ? "الفيديو التالي" : "Next Video"}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full glass glass-tint-blue glass-hover glass-glow flex items-center justify-center text-white border border-white/20 transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-lg"
            >
              <ChevronRight size={22} className={lang === "ar" ? "rotate-180" : ""} />
            </button>
          </div>
        )}

        {/* CTA Pill Button: Explore Now */}
        <div className="mt-8 flex justify-center relative z-30">
          <Link
            to="/"
            hash="contact"
            className="glass glass-tint-blue glass-hover glass-glow inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap tracking-wide uppercase transition-all cursor-pointer"
          >
            <span>{displayCta || t("portfolio.cta") || "Explore Now"}</span>
            <ArrowRight size={14} className={lang === "ar" ? "rotate-180" : ""} />
          </Link>
        </div>

      </div>
    </section>
  );
}

// ─── Centerpiece Astronaut Hand Phone ─────────────────────────────────────────
function AstronautHandPhone({
  reel,
  isExiting = false,
  isPlaying = true,
  isMuted = true,
  videoRef,
  onTogglePlay,
  onToggleMute,
  lang = "en",
}: {
  reel: ReelItem | null;
  isExiting?: boolean;
  isPlaying?: boolean;
  isMuted?: boolean;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  onTogglePlay?: () => void;
  onToggleMute?: () => void;
  lang?: string;
}) {
  return (
    <div className="relative w-full aspect-[896/1200]">
      <img
        src="/astronaut-phone-blurred.png"
        alt="Astronaut Hand holding iPhone 17 Pro"
        className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)] filter"
      />

      {/* Overlaid Screen Area strictly inside the iPhone 17 Pro Bezel */}
      <div
        className={`absolute overflow-hidden bg-black ${
          isExiting ? "pointer-events-none" : "cursor-pointer group"
        }`}
        style={{
          left: "31.92%",
          top: "13.17%",
          width: "36.16%",
          height: "56.83%",
          borderRadius: "clamp(18px, 3.6vw, 24px)",
        }}
        onClick={isExiting ? undefined : onTogglePlay}
      >
        {reel ? (
          <>
            {/* HTML5 Video Player */}
            <video
              ref={isExiting ? undefined : videoRef}
              key={reel.videoUrl}
              src={reel.videoUrl}
              poster={reel.posterUrl || undefined}
              autoPlay
              loop
              playsInline
              muted={isExiting ? true : isMuted}
              className="w-full h-full object-cover pointer-events-none"
            />

            {/* iPhone 17 Pro Dynamic Island */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-3.5 sm:h-4 bg-black rounded-full z-30 pointer-events-none flex items-center justify-end px-1.5 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a2e] border border-blue-500/40" />
            </div>

            {/* Screen Glare reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-20" />

            {/* Center Play/Pause tap feedback overlay */}
            {!isExiting && !isPlaying && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-25 transition-all">
                <div className="w-12 h-12 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg transform scale-110">
                  <Play size={20} fill="black" className="translate-x-0.5" />
                </div>
              </div>
            )}

            {/* Sound Toggle Icon in Corner of Screen */}
            {!isExiting && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleMute) onToggleMute();
                }}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
                className="absolute top-3.5 right-3 z-30 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-all cursor-pointer backdrop-blur-sm border border-white/20"
              >
                {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-950 text-white/50">
            <Video size={28} className="text-white/30 mb-2" />
            <p className="text-xs font-semibold">
              {lang === "ar" ? "لا توجد مقاطع بعد" : "No reels added yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
