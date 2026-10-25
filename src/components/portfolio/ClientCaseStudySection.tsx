import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon,
  Heart,
  Bookmark,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { ReelItem, SocialDesignItem } from "../../data/mockReelsData";

interface ClientCaseStudySectionProps {
  reel: ReelItem | null;
  lang: string;
}

export function ClientCaseStudySection({ reel, lang }: ClientCaseStudySectionProps) {
  const [metaMode, setMetaMode] = useState<"before" | "after">("after");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hide website navbar & lock background scroll whenever a social design or meta photo is opened
  useEffect(() => {
    if (activeLightboxIndex !== null || lightboxImage !== null) {
      if (typeof document !== "undefined") {
        document.body.classList.add("modal-open", "lightbox-open");
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.dispatchEvent(new CustomEvent("sawaqly:modal-open"));
        return () => {
          document.body.classList.remove("modal-open", "lightbox-open");
          document.body.style.overflow = prevOverflow;
          window.dispatchEvent(new CustomEvent("sawaqly:modal-close"));
        };
      }
    }
  }, [activeLightboxIndex, lightboxImage]);

  if (!reel) return null;

  const clientName = lang === "ar"
    ? (reel.clientNameAr || reel.clientNameEn || reel.titleAr || reel.titleEn)
    : (reel.clientNameEn || reel.clientNameAr || reel.titleEn || reel.titleAr);

  const growthDesc = lang === "ar"
    ? (reel.growthDescAr || reel.growthDescEn)
    : (reel.growthDescEn || reel.growthDescAr);

  const metaBefore = reel.metaBeforeUrl;
  const metaAfter = reel.metaAfterUrl;

  // Clean before & after tags (remove "(4.6x ROAS)" or similar metrics)
  const cleanTag = (tag: string | undefined, defaultTag: string) => {
    if (!tag) return defaultTag;
    const cleaned = tag
      .replace(/\s*\([^)]*roas[^)]*\)/gi, "")
      .replace(/\s*\([^)]*عائد[^)]*\)/gi, "")
      .trim();
    return cleaned || defaultTag;
  };

  const beforeTag = lang === "ar"
    ? cleanTag(reel.metaBeforeTagAr, "قبل سـواقلي")
    : cleanTag(reel.metaBeforeTagEn, "Before Sawaqly");

  const afterTag = lang === "ar"
    ? cleanTag(reel.metaAfterTagAr, "بعد سـواقلي")
    : cleanTag(reel.metaAfterTagEn, "After Sawaqly");

  const socialDesigns: SocialDesignItem[] = reel.socialDesigns || [];

  // Keyboard navigation for Instagram Post Lightbox
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev === 0 ? socialDesigns.length - 1 : prev - 1) : null
        );
      } else if (e.key === "ArrowRight") {
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev === socialDesigns.length - 1 ? 0 : prev + 1) : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxIndex, socialDesigns.length]);

  const hasMetaComparison = Boolean(metaBefore || metaAfter);
  const activeMetaPhoto = metaMode === "after" ? (metaAfter || metaBefore) : (metaBefore || metaAfter);

  const toggleMeta = () => {
    if (metaBefore && metaAfter) {
      setMetaMode((prev) => (prev === "after" ? "before" : "after"));
    }
  };

  return (
    <div className="mt-16 md:mt-24 pt-12 md:pt-16 border-t border-white/10 relative transition-all duration-500 ease-out">
      {/* Ambient Cosmic Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[420px] h-[420px] bg-brand-blue/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[380px] h-[380px] bg-brand-yellow/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* ─── PART 1: CLIENT IDENTITY & GROWTH STORY ──────────────────────── */}
      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Blue header line matching creative campaign visuals */}
        <span className="text-xs uppercase tracking-[0.2em] text-brand-blue font-bold block mb-2">
          {lang === "ar" ? "قصة نجاح العميل" : "Client Growth Story"}
        </span>

        {/* Client Name */}
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          {clientName}
        </h3>

        {/* Growth Story Narrative */}
        {growthDesc && (
          <p className="mt-5 text-base sm:text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto">
            {growthDesc}
          </p>
        )}

        {/* Elegant brand accent divider */}
        <div className="h-[2px] w-14 bg-gradient-brand rounded-full mx-auto my-10 sm:my-12 opacity-80" />
      </div>

      {/* ─── PART 2: BEFORE & AFTER META PERFORMANCE PHOTOS ─────────────── */}
      {hasMetaComparison && (
        <div className="max-w-4xl mx-auto px-4 mb-16 sm:mb-20">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-[0.2em] text-brand-yellow font-bold">
              {lang === "ar" ? "نتائج إعلانات ميتا" : "Meta Performance Proof"}
            </span>
            <h4 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {lang === "ar" ? "المقارنة قبل وبعد سـواقلي" : "Before & After Optimization"}
            </h4>
            <p className="text-xs text-muted-foreground mt-1.5 font-light">
              {lang === "ar"
                ? "اضغط على الصورة أو زر التبديل أدناه للتنقل بين النتائج"
                : "Click the photo or toggle below to switch between results"}
            </p>
          </div>

          {/* Dual-Photo Container: Holds both photos in the same space */}
          <div
            onClick={toggleMeta}
            className="group relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden glass border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-pointer select-none transition-all duration-300 hover:border-brand-blue/50 hover:shadow-[0_20px_60px_rgba(70,120,255,0.25)]"
          >
            {/* Active Photo */}
            {activeMetaPhoto ? (
              <img
                src={activeMetaPhoto}
                alt={metaMode === "after" ? afterTag : beforeTag}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-black/60 text-muted-foreground">
                <TrendingUp size={36} className="text-brand-blue/60 mb-2" />
                <span className="text-sm font-medium">
                  {lang === "ar" ? "لم يتم إرفاق لقطات الشاشة بعد" : "No Meta screenshots attached yet"}
                </span>
              </div>
            )}

            {/* Subtle dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Corner Status Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span
                className={`px-3.5 py-1.5 rounded-full backdrop-blur-md text-xs font-bold flex items-center gap-2 shadow-lg transition-all ${
                  metaMode === "after"
                    ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/50"
                    : "bg-rose-500/25 text-rose-300 border border-rose-500/50"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    metaMode === "after" ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                  }`}
                />
                {metaMode === "after" ? afterTag : beforeTag}
              </span>
            </div>

            {/* Lightbox Zoom Icon Button */}
            {activeMetaPhoto && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage(activeMetaPhoto);
                }}
                aria-label="Enlarge Screenshot"
                title={lang === "ar" ? "تكبير الصورة" : "Enlarge Image"}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full glass glass-hover text-white flex items-center justify-center border border-white/20 transition-all hover:scale-110 shadow-md"
              >
                <Maximize2 size={15} />
              </button>
            )}

            {/* Bottom floating hint inside the photo */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-white/90 shadow-md opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {lang === "ar"
                ? `اضغط للتبديل إلى ${metaMode === "after" ? "نتائج ما قبل سـواقلي" : "نتائج سـواقلي"}`
                : `Tap photo to view ${metaMode === "after" ? "Before results" : "After results"}`}
            </div>
          </div>

          {/* Toggle Button Under The Photo */}
          {metaBefore && metaAfter && (
            <div className="flex items-center justify-center mt-6">
              <div className="inline-flex p-1.5 rounded-full glass border border-white/15 shadow-xl">
                <button
                  type="button"
                  onClick={() => setMetaMode("before")}
                  className={`px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                    metaMode === "before"
                      ? "bg-white/20 text-white shadow-md border border-white/20"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  {beforeTag}
                </button>
                <button
                  type="button"
                  onClick={() => setMetaMode("after")}
                  className={`px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                    metaMode === "after"
                      ? "glass-tint-blue bg-brand-blue text-white shadow-[0_0_20px_rgba(70,120,255,0.5)] border border-blue-400/40"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  {afterTag}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── PART 3: SOCIAL MEDIA DESIGNS (1080x1350) ─────────────────────── */}
      {socialDesigns.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mt-14 sm:mt-20">
          {/* Section Heading */}
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-xs uppercase tracking-[0.2em] text-brand-blue font-bold">
              {lang === "ar" ? "تصاميم وهوية الحملة" : "Creative Campaign Visuals"}
            </span>
            <h4 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {lang === "ar" ? "تصاميم السوشيال ميديا للعميل" : "Social Media Designs for this Client"}
            </h4>
            <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground/80 flex items-center justify-center gap-1.5 font-medium">
              <Maximize2 size={13} className="text-brand-blue shrink-0" />
              <span>
                {lang === "ar"
                  ? "اضغط على أي تصميم لتكبيره واستعراضه بالحجم الكامل"
                  : "Click on any design to enlarge and view in full size"}
              </span>
            </p>
          </div>

          {/* ─── Centered Grid: Web and Mobile (Max 4 per row) ──────────── */}
          {/*
              Centering Rules:
              - Mobile (<640px): 2 cards per row side-by-side, centered.
              - Desktop (>=1024px): Max 4 cards per row.
              - When 2 cards: centered side-by-side on both mobile and web!
              - Aspect ratio: Exactly 1080x1350 (4:5 portrait ratio).
          */}
          <div className="w-full flex justify-center">
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-5 w-full max-w-6xl">
              {socialDesigns.map((design, idx) => {
                const designTitle = lang === "ar"
                  ? (design.titleAr || design.titleEn || `تصميم ${idx + 1}`)
                  : (design.titleEn || design.titleAr || `Design ${idx + 1}`);

                // Responsive width:
                // - 1 item: centered, max-w-[320px]
                // - 2 items: centered on mobile (calc 50%) and centered on web (max-w-[320px])
                // - 3 items: centered on mobile, 3 across on sm/md/lg
                // - 4+ items: max 4 per row on desktop (lg:w-[calc(25%-1rem)])
                let widthClass = "w-[calc(50%-0.45rem)] sm:w-[calc(33.333%-0.75rem)] lg:w-[calc(25%-1rem)] max-w-[280px]";
                if (socialDesigns.length === 1) {
                  widthClass = "w-full max-w-[320px]";
                } else if (socialDesigns.length === 2) {
                  widthClass = "w-[calc(50%-0.45rem)] sm:w-[280px] md:w-[320px] max-w-[320px]";
                }

                const postKey = design.id || String(idx);

                return (
                  <div
                    key={postKey}
                    onClick={() => setActiveLightboxIndex(idx)}
                    className={`flex-grow-0 flex-shrink-0 ${widthClass} group relative aspect-[1080/1350] rounded-2xl sm:rounded-3xl overflow-hidden glass border border-white/10 hover:border-brand-blue/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_45px_rgba(0,0,0,0.85)] cursor-pointer select-none`}
                  >
                    {/* 1080x1350 Photo (Unobstructed full visual) */}
                    <img
                      src={design.url}
                      alt={designTitle}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Clean Hover Overlay with title & expand hint */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
                      <p className="text-xs sm:text-sm font-bold text-white line-clamp-2 drop-shadow-md">
                        {designTitle}
                      </p>
                      <span className="text-[10px] text-brand-blue font-medium flex items-center gap-1 mt-1">
                        <Maximize2 size={11} /> {lang === "ar" ? "عرض بالحجم الكامل" : "Click to view full size"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── FULLSCREEN DESIGN VIEWER MODAL (1080x1350) ────────────────────── */}
      {activeLightboxIndex !== null && socialDesigns[activeLightboxIndex] && (() => {
        const activeDesign = socialDesigns[activeLightboxIndex];
        const postKey = activeDesign.id || String(activeLightboxIndex);
        const isLiked = Boolean(likedPosts[postKey]);

        // Calculate custom like count
        const rawLikes = activeDesign.likesCount;
        let displayedLikes: string;
        if (typeof rawLikes === "number") {
          displayedLikes = (rawLikes + (isLiked ? 1 : 0)).toLocaleString();
        } else if (rawLikes) {
          displayedLikes = String(rawLikes);
        } else {
          displayedLikes = ((activeLightboxIndex * 640 + 1280) + (isLiked ? 1 : 0)).toLocaleString();
        }

        // Custom caption & title
        const activeCaption = lang === "ar"
          ? (activeDesign.captionAr || activeDesign.captionEn)
          : (activeDesign.captionEn || activeDesign.captionAr);

        const activeTitle = lang === "ar"
          ? (activeDesign.titleAr || activeDesign.titleEn)
          : (activeDesign.titleEn || activeDesign.titleAr);

        const modalContent = (
          <div
            onClick={() => setActiveLightboxIndex(null)}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200 select-none"
          >
            {/* Modal Card + Flanking Left & Right Arrow Navigation Buttons */}
            <div
              dir="ltr"
              onClick={(e) => e.stopPropagation()}
              className="relative flex items-center justify-center gap-2 sm:gap-4 md:gap-5 w-full max-w-3xl"
            >
              {/* Left Arrow Button (Right next to the post card on its left side) */}
              {socialDesigns.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveLightboxIndex((prev) =>
                      prev !== null ? (prev === 0 ? socialDesigns.length - 1 : prev - 1) : 0
                    );
                  }}
                  aria-label="Previous Design"
                  title={lang === "ar" ? "التصميم السابق" : "Previous Design"}
                  className="shrink-0 w-9 h-9 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-full bg-black/75 hover:bg-black/95 backdrop-blur-md text-white flex items-center justify-center border border-white/25 transition-all hover:scale-110 shadow-2xl cursor-pointer"
                >
                  <ChevronLeft size={22} className="sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Modal Card */}
              <div
                className="relative flex-1 min-w-0 max-w-md sm:max-w-lg w-full max-h-[92vh] flex flex-col rounded-3xl overflow-hidden glass border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
              >
                {/* Top Bar: Brand Logo & Name on Left, X Close Button on Right */}
                <div
                  dir="ltr"
                  className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10 bg-black/40 backdrop-blur-md"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Page Logo or Initials */}
                    {activeDesign.pageLogoUrl ? (
                      <img
                        src={activeDesign.pageLogoUrl}
                        alt={clientName}
                        className="w-9 h-9 rounded-full object-cover border border-white/20 shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">
                        {clientName.slice(0, 2)}
                      </div>
                    )}

                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-white truncate">
                          {clientName}
                        </span>
                        <CheckCircle2 size={13} className="text-brand-blue fill-brand-blue/20 shrink-0" />
                      </div>
                      <span className="text-[10px] text-muted-foreground block -mt-0.5 truncate">
                        {lang === "ar" ? "الهوية البصرية والحملات الإعلانية" : "Visual Identity & Campaign Creative"}
                      </span>
                    </div>
                  </div>

                  {/* X Close Button on the right side of the top bar */}
                  <button
                    type="button"
                    onClick={() => setActiveLightboxIndex(null)}
                    aria-label="Close"
                    className="w-8 h-8 rounded-full glass glass-hover text-white/80 hover:text-white flex items-center justify-center border border-white/15 transition-all hover:scale-110 cursor-pointer shadow-sm shrink-0 ml-3"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Middle: Clean 1080x1350 Portrait Image without obstructing buttons */}
                <div className="relative aspect-[1080/1350] w-full bg-black/60 flex items-center justify-center overflow-hidden">
                  <img
                    src={activeDesign.url}
                    alt={activeTitle || clientName}
                    className="w-full h-full object-contain"
                  />
                </div>

              {/* Bottom Bar: Action Buttons & Caption */}
              <div className="px-4 sm:px-5 py-3.5 border-t border-white/10 bg-black/40 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    {/* Like Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setLikedPosts((prev) => ({ ...prev, [postKey]: !prev[postKey] }));
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold transition-transform active:scale-125 cursor-pointer"
                    >
                      <Heart
                        size={20}
                        className={
                          isLiked
                            ? "fill-rose-500 text-rose-500"
                            : "text-white/80 hover:text-white"
                        }
                      />
                      <span className="text-white text-xs font-mono font-medium">
                        {displayedLikes}
                      </span>
                    </button>

                    {/* Share Icon */}
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: clientName,
                            url: activeDesign.url,
                          }).catch(() => {});
                        }
                      }}
                      className="text-white/80 hover:text-white transition-colors cursor-pointer"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSavedPosts((prev) => ({ ...prev, [postKey]: !prev[postKey] }));
                    }}
                    className="text-white/80 hover:text-white transition-transform active:scale-125 cursor-pointer"
                  >
                    <Bookmark
                      size={19}
                      className={
                        savedPosts[postKey]
                          ? "fill-brand-yellow text-brand-yellow"
                          : "text-white/80 hover:text-white"
                      }
                    />
                  </button>
                </div>

                {/* Post Caption (Customized from Admin) */}
                <div className={`${lang === "ar" ? "text-right" : "text-left"} space-y-1`}>
                  {activeCaption ? (
                    <p className="text-xs sm:text-sm text-white/95 leading-relaxed">
                      <span className="font-bold text-white mr-1.5">{clientName}</span>
                      <span className="font-normal text-white/90">{activeCaption}</span>
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      <span className="font-bold mr-1.5 text-brand-blue">{clientName}</span>
                      {activeTitle || ""}
                    </p>
                  )}
                  {activeTitle && activeCaption && (
                    <span className="text-[10px] text-brand-blue font-medium block">
                      {activeTitle}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Arrow Button (Right next to the post card on its right side) */}
            {socialDesigns.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setActiveLightboxIndex((prev) =>
                    prev !== null ? (prev === socialDesigns.length - 1 ? 0 : prev + 1) : 0
                  );
                }}
                aria-label="Next Design"
                title={lang === "ar" ? "التصميم التالي" : "Next Design"}
                className="shrink-0 w-9 h-9 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-full bg-black/75 hover:bg-black/95 backdrop-blur-md text-white flex items-center justify-center border border-white/25 transition-all hover:scale-110 shadow-2xl cursor-pointer"
              >
                <ChevronRight size={22} className="sm:w-6 sm:h-6" />
              </button>
            )}
          </div>
        </div>
      );

      return isMounted && typeof document !== "undefined"
        ? createPortal(modalContent, document.body)
        : modalContent;
    })()}

      {/* ─── FULLSCREEN LIGHTBOX MODAL FOR META BEFORE/AFTER ──────────────── */}
      {lightboxImage && (() => {
        const metaModalElement = (
          <div
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              aria-label="Close Lightbox"
              className="absolute top-6 right-6 z-50 w-11 h-11 rounded-full glass glass-hover text-white flex items-center justify-center border border-white/20 transition-all hover:scale-110"
            >
              <X size={20} />
            </button>
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl glass"
            >
              <img
                src={lightboxImage}
                alt="Enlarged Showcase View"
                className="w-full h-full max-h-[85vh] object-contain"
              />
            </div>
          </div>
        );

        return isMounted && typeof document !== "undefined"
          ? createPortal(metaModalElement, document.body)
          : metaModalElement;
      })()}
    </div>
  );
}
