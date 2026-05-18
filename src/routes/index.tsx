import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import {
  Megaphone,
  Search,
  PenTool,
  BarChart3,
  Share2,
  Mail,
  Video,
  Globe,
  Target,
  MapPin,
  Phone,
  Send,
  ArrowRight,
  Linkedin,
  Twitter,
  Menu,
  X,
} from "lucide-react";
import InteractiveLogo from "@/components/InteractiveLogo";
import { useI18n } from "../lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sawaqly — Marketing Agency that Moves Brands Forward" },
      {
        name: "description",
        content:
          "Sawaqly is a full-service marketing agency crafting brands, campaigns, and growth engines that convert.",
      },
      { property: "og:title", content: "Sawaqly Marketing Agency" },
      {
        property: "og:description",
        content: "Brand, campaign, and growth services that move the needle.",
      },
    ],
  }),
  component: Index,
});

// Data now fetched from Supabase via React Query within components

function useReveal() {
  useEffect(() => {
    // Add "in" to all reveal elements immediately on mount
    // and re-check whenever DOM changes
    const apply = () => {
      document.querySelectorAll<HTMLElement>(".reveal:not(.in)").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100) el.classList.add("in");
      });
    };
    apply();
    window.addEventListener("scroll", apply, { passive: true });
    return () => window.removeEventListener("scroll", apply);
  }, []);
}

function useCopy() {
  const { lang } = useI18n();
  const { data } = useQuery({
    queryKey: ['website_copy'],
    queryFn: async () => {
      const { data, error } = await supabase.from('website_copy').select('*').eq('id', 1).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });
  const c = (enField: string, arField: string, fallback: string) => {
    if (!data) return fallback;
    const val = lang === 'ar' ? (data as any)[arField] : (data as any)[enField];
    return val || fallback;
  };
  return c;
}

function Index() {
  useReveal();
  const { lang } = useI18n();
  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden" dir={lang === "ar" ? "rtl" : "ltr"}>      <div className="ambient-bg" aria-hidden>
        <div className="ambient-orb" style={{ width: 380, height: 380, top: "30%", left: "40%", background: "radial-gradient(circle, color-mix(in oklab, var(--brand-blue) 45%, transparent), transparent 70%)" }} />
        
        {/* Deep Space Elements: Moons, Planets, Universes, Stars */}
        

        
        {/* Small Ringed Planet */}
        <div className="absolute top-[35%] left-[8%] w-16 h-16 md:w-20 md:h-20 rotate-[-20deg] opacity-90" style={{ animation: "float 10s ease-in-out infinite" }}>
          <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-brand-yellow/80 to-transparent" style={{ boxShadow: 'inset -6px -6px 12px rgba(0,0,0,0.9)' }} />
          <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 rounded-[100%] border-[2px] border-brand-yellow/60" style={{ boxShadow: '0 0 8px rgba(255,200,100,0.5)' }} />
        </div>

        {/* Floating Gas Giant */}
        <div className="absolute top-[35%] left-[60%] w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue/80 to-transparent blur-[1px] opacity-90" style={{ boxShadow: 'inset -4px -4px 8px rgba(0,0,0,0.9)', animation: "float 12s ease-in-out infinite reverse" }} />

        {/* Spiral Universe / Galaxy Arms */}
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[10vw] rotate-[35deg] bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent blur-[20px] mix-blend-screen rounded-[100%]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30vw] h-[8vw] rotate-[-25deg] bg-gradient-to-r from-transparent via-brand-yellow/20 to-transparent blur-[20px] mix-blend-screen rounded-[100%]" />

        {/* Background Nebulas */}
        <div className="absolute top-[25%] right-[10%] w-48 h-48 rounded-full bg-brand-yellow/20 blur-[50px] mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[25%] w-64 h-64 rounded-full bg-brand-blue/20 blur-[60px] mix-blend-screen" />
        <div className="absolute top-[45%] left-[5%] w-80 h-80 rounded-full bg-[oklch(0.6_0.2_280)]/15 blur-[70px] mix-blend-screen" />
        
        {/* Twinkling Stars */}
        <div className="absolute top-[15%] left-[10%] w-2 h-2 rounded-full bg-white/90 blur-[0.5px] animate-pulse" />
        <div className="absolute top-[40%] right-[30%] w-3 h-3 rounded-full bg-brand-yellow/90 blur-[1px]" style={{ animation: "float 8s ease-in-out infinite" }} />
        <div className="absolute bottom-[20%] left-[25%] w-1.5 h-1.5 rounded-full bg-brand-blue/90 blur-[0.5px] animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-[60%] left-[40%] w-2 h-2 rounded-full bg-white/80 blur-[0.5px] animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-[70%] right-[50%] w-1.5 h-1.5 rounded-full bg-brand-yellow/80 blur-[0.5px] animate-pulse" style={{ animationDelay: "2.5s" }} />
      </div>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Team />
        <LocationMap />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

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
      if (y > 80 && delta > 4) {
        setHidden(true);
        setOpen(false);
      } else if (delta < -4) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed top-4 left-0 right-0 z-40 px-4 transition-transform duration-300 ease-out ${hidden ? "-translate-y-[150%]" : "translate-y-0"}`}
    >
      <div
        className={`nav-shell mx-auto max-w-[88rem] glass glass-hover rounded-full px-6 md:px-8 h-14 flex items-center justify-between ${scrolled ? "scrolled" : ""}`}
      >
        <a href="#top" className="flex items-center gap-2 font-display font-bold text-lg">
          <img src="/SAWAQLYLOGO1.png" alt="Sawaqly" className="h-7 w-auto object-contain" />
          <span>SAWAQLY</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#services" className="hover:text-brand-blue transition">{t("nav.services")}</a>
          <a href="#team" className="hover:text-brand-blue transition">{t("nav.team")}</a>
          <a href="#contact" className="hover:text-brand-blue transition">{t("nav.contact")}</a>
          <Link to="/careers" className="hover:text-brand-blue transition">{t("nav.careers")}</Link>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="glass glass-hover rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide uppercase"
          >
            {lang === "en" ? "عربي" : "EN"}
          </button>
          <a
            href="#contact"
            className="glass glass-tint-blue glass-hover glass-glow inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium"
          >
            {t("nav.cta")} <ArrowRight size={14} />
          </a>
        </div>
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="glass glass-hover rounded-full px-3 py-1.5 text-xs font-bold tracking-wide uppercase"
          >
            {lang === "en" ? "عربي" : "EN"}
          </button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="glass glass-hover rounded-full p-2 text-navy"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <div
        className={`md:hidden mx-auto max-w-[88rem] overflow-hidden transition-all duration-300 ease-out ${open ? "max-h-96 opacity-100 mt-2 pointer-events-auto" : "max-h-0 opacity-0 mt-0 pointer-events-none"}`}
      >
        <div className="glass glass-strong rounded-3xl p-4 flex flex-col gap-1">
          <a onClick={() => setOpen(false)} href="#services" className="rounded-2xl px-4 py-3 text-sm font-medium text-navy hover:bg-white/10 transition">{t("nav.services")}</a>
          <a onClick={() => setOpen(false)} href="#team" className="rounded-2xl px-4 py-3 text-sm font-medium text-navy hover:bg-white/10 transition">{t("nav.team")}</a>
          <a onClick={() => setOpen(false)} href="#contact" className="rounded-2xl px-4 py-3 text-sm font-medium text-navy hover:bg-white/10 transition">{t("nav.contact")}</a>
          <Link onClick={() => setOpen(false)} to="/careers" className="rounded-2xl px-4 py-3 text-sm font-medium text-navy hover:bg-white/10 transition">{t("nav.careers")}</Link>
          <a
            onClick={() => setOpen(false)}
            href="#contact"
            className="glass glass-tint-blue glass-hover glass-glow mt-2 inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold"
          >
            {t("nav.cta")} <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const { t } = useI18n();
  const c = useCopy();
  return (
    <section id="top" className="relative isolate">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 bottom-0 -z-10 overflow-hidden pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--brand-blue) 15%, transparent) 0%, color-mix(in oklab, var(--brand-yellow) 8%, transparent) 65%, transparent 100%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 pt-36 pb-20 md:pt-44 md:pb-24 flex flex-col items-center justify-center text-center min-h-[60vh]">
        {/* Large Planet (Top Right, Hero Only) */}
        <div className="hidden lg:block absolute top-[5%] right-[5%] w-64 h-64 z-10 pointer-events-none opacity-90 rotate-[-20deg]" style={{ animation: "float 15s ease-in-out infinite" }}>
          {/* Planet Body */}
          <div className="absolute inset-4 rounded-full bg-black border border-white/10 overflow-hidden shadow-[inset_-20px_-20px_40px_rgba(0,0,0,0.9),inset_15px_15px_30px_rgba(255,255,255,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 via-transparent to-white/20" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 blur-[20px] rounded-full" />
          </div>
          {/* Planetary Rings */}
          <div className="absolute top-1/2 left-[-15%] right-[-15%] h-8 -translate-y-1/2 rounded-[100%] border-[3px] border-t-white/40 border-b-white/10 border-x-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
          <div className="absolute top-1/2 left-[0%] right-[0%] h-4 -translate-y-1/2 rounded-[100%] border-[1px] border-brand-yellow/30" />
        </div>

        {/* Blue Planet (Bottom Left, Hero Only) */}
        <div className="hidden lg:block absolute bottom-[5%] left-[5%] w-56 h-56 z-10 pointer-events-none opacity-90 rotate-[-45deg]" style={{ animation: "float 16s ease-in-out infinite reverse" }}>
          {/* Planet Body */}
          <div className="absolute inset-4 rounded-full bg-[#08426b] border border-blue-400/30 overflow-hidden shadow-[inset_-20px_-20px_40px_rgba(0,0,0,0.9),inset_10px_10px_30px_rgba(100,180,255,0.3)]">
            {/* Smooth icy atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/20 to-blue-200/40" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-300/40 blur-[25px] rounded-full" />
          </div>
        </div>

        {/* Centered Content */}
        <div className="reveal relative z-20 flex flex-col items-center w-full">
          <h1 className="text-[clamp(1.75rem,8vw,5.5rem)] font-extrabold leading-[1.0] tracking-tight uppercase drop-shadow-xl">
            <span className="block whitespace-nowrap">{t("hero.line1a")}<span className="text-brand-blue">{t("hero.line1b")}</span>.</span>
            <span className="block whitespace-nowrap">{t("hero.line2a")}<span className="text-brand-yellow">{t("hero.line2b")}</span>.</span>
          </h1>
          <p className="mt-6 md:mt-8 text-sm md:text-xl text-muted-foreground max-w-2xl font-light">
            {c('hero_sub_en', 'hero_sub_ar', t("hero.sub"))}
          </p>
          <div className="mt-8 md:mt-10 flex flex-row flex-nowrap justify-center gap-3 md:gap-4">
            <a
              href="#contact"
              className="glass glass-tint-blue glass-hover glass-glow inline-flex items-center justify-center gap-1.5 md:gap-2 rounded-full px-4 py-2.5 md:px-6 md:py-3.5 text-xs md:text-sm font-bold whitespace-nowrap tracking-wide uppercase"
            >
              {t("hero.cta1")} <ArrowRight size={14} />
            </a>
            <a
              href="#services"
              className="glass glass-hover inline-flex items-center justify-center rounded-full px-4 py-2.5 md:px-6 md:py-3.5 text-xs md:text-sm font-bold text-navy whitespace-nowrap tracking-wide uppercase"
            >
              {t("hero.cta2")}
            </a>
          </div>
        </div>

        {/* Floating Astronaut (Absolute Right) */}
        <div className="hidden lg:block absolute right-[0%] top-[80%] -translate-y-1/2 translate-x-[10%] z-30 pointer-events-none reveal">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-blue/40 blur-[80px] rounded-full" />
          <div className="relative" style={{ animation: "float 6s ease-in-out infinite" }}>
            <img
              src="/astronaut.png"
              alt="Astronaut floating in space"
              className="w-full max-w-[14rem] xl:max-w-[18rem] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] rotate-[15deg]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const { t } = useI18n();
  const { data: dbBrands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase.from('brands').select('*').order('sort_order', { ascending: true, nullsFirst: false }).order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    }
  });
  const items = dbBrands;
  
  if (items.length === 0) return null;

  // Build one complete "half" by repeating items enough times to fill the screen
  const MIN_PER_HALF = Math.max(12, items.length);
  const halfItems: typeof items = [];
  while (halfItems.length < MIN_PER_HALF) {
    for (const item of items) {
      halfItems.push(item);
      if (halfItems.length >= MIN_PER_HALF) break;
    }
  }
  
  // Two identical halves → the -50% CSS animation loops seamlessly
  const row = [...halfItems, ...halfItems];

  return (
    <section className="relative py-20 reveal" dir="ltr">
      <p className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground mb-10">
        {t("marquee.label")}
      </p>
      <div className="relative overflow-x-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex gap-12 md:gap-24 animate-marquee whitespace-nowrap w-max py-4 items-center">
          {row.map((b, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex items-center justify-center grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 filter brightness-0 invert"
            >
              {b.logo_url ? (
                <img src={b.logo_url} alt={b.name} className="h-8 md:h-12 w-auto object-contain" />
              ) : (
                <span className="font-display font-bold tracking-widest text-white uppercase text-xl md:text-2xl">{b.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function Services() {
  const { t } = useI18n();
  const c = useCopy();
  const { data: dbServices = [] } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('*').order('sort_order', { ascending: true, nullsFirst: false }).order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  if (dbServices.length === 0) return null;

  return (
    <section id="services" className="relative">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-18">
        <div className="mb-14 text-center">
          <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">{c('services_title_en', 'services_title_ar', t("services.title"))}</h2>
          <p className="mt-4 text-lg text-muted-foreground font-light max-w-2xl mx-auto">
            {c('services_sub_en', 'services_sub_ar', t("services.sub"))}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dbServices.map(({ icon_name, title, description }, i) => {
            const Icon = (Icons as any)[icon_name] || Icons.HelpCircle;
            return (
              <div
                key={title}
                className="group glass glass-hover rounded-3xl p-7 reveal in"
                style={{ transitionDelay: `${(i % 3) * 60}ms` }}
              >
                <Icon size={28} className="mb-5 text-brand-blue" />
                <h3 className="text-xl font-bold text-navy">{title}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed font-light">{description}</p>
                <div className="mt-5 h-[2px] w-8 bg-brand-yellow group-hover:w-16 transition-all duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


function Team() {
  const { t } = useI18n();
  const { data: dbTeam = [] } = useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      const { data, error } = await supabase.from('team').select('*').order('sort_order', { ascending: true, nullsFirst: false }).order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  if (dbTeam.length === 0) return null;

  return (
    <section id="team" className="relative">
      <div className="mx-auto max-w-7xl px-6 py-28 md:py-36">
        <div className="mb-14 text-center">
          <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">{t("team.title")}</h2>
          <p className="mt-4 text-lg text-muted-foreground font-light max-w-2xl mx-auto">
            {t("team.sub")}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dbTeam.map((m: any, i: number) => (
            <div
              key={m.name}
              className="group glass glass-hover rounded-3xl p-6 reveal in"
              style={{ transitionDelay: `${(i % 4) * 60}ms` }}
            >
              <div className="glass aspect-[3/4] w-full rounded-2xl flex items-center justify-center mb-5 overflow-hidden">
                {m.photo_url ? (
                  <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <span className="text-muted-foreground/50 text-sm">No Photo</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-navy">{m.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 font-light">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { t } = useI18n();
  const c = useCopy();
  const [sent, setSent] = useState(false);
  
  const { data: settings } = useQuery({
    queryKey: ['social_media'],
    queryFn: async () => {
      const { data, error } = await supabase.from('social_media').select('*').eq('id', 1).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || {};
    }
  });
  
  const submitMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { error } = await supabase.from('inquiries').insert([formData]);
      if (error) throw error;
    },
    onSuccess: () => {
      setSent(true);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    submitMutation.mutate({
      name: data.get('name'),
      company: data.get('company') || null,
      email: data.get('email'),
      message: data.get('message')
    });
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-14 md:py-18">
      <div className="grid md:grid-cols-2 gap-14">
        <div className="reveal in">
          <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">{c('contact_title_en', 'contact_title_ar', t("contact.title"))}</h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-md font-light">
            {c('contact_sub_en', 'contact_sub_ar', t("contact.sub"))}
          </p>
          <div className="mt-8 space-y-3 text-sm">
            <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3"><Mail size={16} className="text-brand-blue" /> {settings?.contact_email || 'hello@sawaqly.com'}</div>
            <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3"><Phone size={16} className="text-brand-blue" /> {settings?.contact_phone || '+20 100 000 0000'}</div>
            <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3"><MapPin size={16} className="text-brand-blue" /> {settings?.office_location || 'Cairo, Egypt'}</div>
          </div>
          
          <div className="mt-8 flex items-center gap-4">
            <a href={settings?.social_instagram || "https://instagram.com"} target="_blank" rel="noreferrer" aria-label="Instagram" className="glass glass-hover rounded-full p-3 transition-colors hover:text-brand-blue">
              <Icons.Instagram size={20} />
            </a>
            <a href={settings?.social_facebook || "https://facebook.com"} target="_blank" rel="noreferrer" aria-label="Facebook" className="glass glass-hover rounded-full p-3 transition-colors hover:text-brand-blue">
              <Icons.Facebook size={20} />
            </a>
            <a href={settings?.social_tiktok || "https://tiktok.com"} target="_blank" rel="noreferrer" aria-label="TikTok" className="glass glass-hover rounded-full p-3 transition-colors hover:text-brand-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="glass glass-strong rounded-3xl p-8 space-y-4 reveal in"
        >
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("contact.name")} name="name" />
            <Field label={t("contact.company")} name="company" />
          </div>
          <Field label={t("contact.email")} name="email" type="email" />
          <div>
            <label className="text-sm font-medium">{t("contact.brief")}</label>
            <textarea
              name="message"
              required
              rows={4}
              className="glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={submitMutation.isPending || sent}
            className="glass glass-tint-blue glass-hover glass-glow inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitMutation.isPending ? t("contact.sending") : sent ? t("contact.sent") : <><Icons.Send size={16} /> {t("contact.send")}</>}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="text-sm font-medium" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required
        className="glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm"
      />
    </div>
  );
}

function LocationMap() {
  const { t } = useI18n();
  const { data: settings } = useQuery({
    queryKey: ['social_media'],
    queryFn: async () => {
      const { data, error } = await supabase.from('social_media').select('*').eq('id', 1).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || { office_name: 'Sawaqly HQ', office_location: 'Cairo, Egypt', office_hours: 'Mon–Fri 9–6', map_share_url: 'https://maps.google.com/?q=Cairo,Egypt', map_embed_url: 'https://www.google.com/maps?q=Cairo,Egypt&output=embed' };
    }
  });

  const mapLink = settings?.map_share_url || 'https://maps.google.com/?q=Cairo,Egypt';
  const mapEmbed = settings?.map_embed_url || 'https://www.google.com/maps?q=Cairo,Egypt&output=embed';

  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-6 py-12 reveal">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">{t("map.title")}</h2>
          </div>
          <a
            href={mapLink}
            target="_blank"
            rel="noreferrer"
            className="glass glass-hover rounded-full px-5 py-2.5 text-sm font-semibold text-brand-blue inline-flex items-center gap-1.5"
          >
            {t("map.open")} <ArrowRight size={14} />
          </a>
        </div>
        <div className="glass rounded-3xl p-2 overflow-hidden">
          <div className="rounded-2xl overflow-hidden">
            <iframe
              title="Sawaqly office location"
              src={mapEmbed}
              width="100%"
              height="460"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0, display: "block" }}
            />
          </div>
          <div className="px-4 py-5 md:py-6 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-brand-blue font-semibold mb-1">{t("map.studio")}</div>
              <div className="text-lg text-navy font-bold">{settings?.office_name || 'Sawaqly HQ'}</div>
            </div>
            <div className="text-sm text-muted-foreground font-light md:text-right">
              <div>{settings?.office_location || 'Cairo, Egypt'}</div>
              <div>{settings?.office_hours || 'Mon–Fri 9–6'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useI18n();
  const c = useCopy();
  const { data: settings } = useQuery({
    queryKey: ['social_media'],
    queryFn: async () => {
      const { data, error } = await supabase.from('social_media').select('*').eq('id', 1).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || {};
    }
  });

  return (
    <footer className="px-4 pb-6">
      <div className="mx-auto max-w-7xl glass rounded-3xl px-8 py-10 grid md:grid-cols-4 gap-8 items-start">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <img src="/SAWAQLYLOGO1.png" alt="Sawaqly" className="h-9 w-auto object-contain" />
            <span>SAWAQLY</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs font-light">
            {c('footer_tagline_en', 'footer_tagline_ar', t("footer.tagline"))}
          </p>
        </div>
        <div className="text-sm">
          <div className="font-semibold mb-3">{t("footer.studio")}</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href="#services" className="hover:text-brand-blue">{t("nav.services")}</a></li>
            <li><a href="#team" className="hover:text-brand-blue">{t("nav.team")}</a></li>
            <li><a href="#contact" className="hover:text-brand-blue">{t("nav.contact")}</a></li>
            <li><Link to="/careers" className="hover:text-brand-blue">{t("nav.careers")}</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-semibold mb-3">{t("footer.reach")}</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>{settings?.contact_email || 'hello@sawaqly.com'}</li>
            <li>{settings?.contact_phone || '+20 100 000 0000'}</li>
            <li>{settings?.office_location || 'Cairo, Egypt'}</li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-semibold mb-3">{t("footer.location")}</div>
          {settings?.footer_location_title && (
            <div className="text-navy font-medium mb-2">{settings.footer_location_title}</div>
          )}
          {settings?.footer_location_description && (
            <p className="text-muted-foreground font-light leading-relaxed whitespace-pre-line">{settings.footer_location_description}</p>
          )}
        </div>
      </div>
      <div className="mx-auto max-w-7xl pt-5 text-center text-xs text-muted-foreground">
        {t("footer.copy")}
      </div>
    </footer>
  );
}
