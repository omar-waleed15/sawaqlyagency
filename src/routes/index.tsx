import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import InteractiveLogo from "@/components/InteractiveLogo";

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

const services = [
  { icon: Megaphone, title: "Brand Strategy", desc: "Positioning, narrative, and identity systems that command attention." },
  { icon: Search, title: "SEO & Content", desc: "Rank, retain, and convert with content engineered for intent." },
  { icon: Share2, title: "Social Media", desc: "Always-on social that turns scrollers into community." },
  { icon: Target, title: "Performance Ads", desc: "Paid media on Meta, Google, and TikTok tuned for ROAS." },
  { icon: PenTool, title: "Creative & Design", desc: "Art direction, motion, and design that earns the click." },
  { icon: Video, title: "Video Production", desc: "Story-first video built for the feed and the funnel." },
  { icon: Mail, title: "Email & CRM", desc: "Lifecycle flows that nurture, retain, and resurrect revenue." },
  { icon: Globe, title: "Web & UX", desc: "Sites and landers engineered for speed and conversion." },
  { icon: BarChart3, title: "Analytics & CRO", desc: "Measure what matters. Test relentlessly. Compound the wins." },
];

const brands = [
  "ACME", "NORTHWIND", "GLOBEX", "INITECH", "UMBRELLA",
  "STARK", "WAYNE", "HOOLI", "PIED PIPER", "SOYLENT",
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Index() {
  useReveal();
  return (
    <div className="relative min-h-screen text-foreground">
      <div className="ambient-bg" aria-hidden>
        <div className="ambient-orb" style={{ width: 380, height: 380, top: "30%", left: "40%", background: "radial-gradient(circle, color-mix(in oklab, var(--brand-blue) 45%, transparent), transparent 70%)" }} />
      </div>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Contact />
        <LocationMap />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className="sticky top-4 z-40 px-4">
      <div
        className={`nav-shell mx-auto max-w-7xl glass glass-hover rounded-full px-6 h-14 flex items-center justify-between ${scrolled ? "scrolled" : ""}`}
      >
        <a href="#top" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="inline-block w-7 h-7 rounded-md" style={{ background: "var(--gradient-brand)" }} />
          <span>Sawaqly</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#about" className="hover:text-brand-blue transition">About</a>
          <a href="#services" className="hover:text-brand-blue transition">Services</a>
          <a href="#contact" className="hover:text-brand-blue transition">Contact</a>
        </nav>
        <a
          href="#contact"
          className="hidden md:inline-flex glass glass-tint-blue glass-hover glass-glow items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium"
        >
          Start a project <ArrowRight size={14} />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-16 md:pt-24 pb-24 md:pb-32 grid md:grid-cols-2 gap-12 items-center min-h-[88vh]">
        <div className="reveal">
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.02] tracking-tight">
            Brands that <span className="text-brand-blue">move</span>.
            <br />
            Growth that <span className="text-brand-yellow">sticks</span>.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl font-light">
            Sawaqly is a full-service marketing agency turning bold ideas into measurable
            momentum — strategy, identity, campaigns, content, and conversion.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="glass glass-tint-blue glass-hover glass-glow inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold"
            >
              Book a strategy call <ArrowRight size={16} />
            </a>
            <a
              href="#services"
              className="glass glass-hover inline-flex items-center rounded-full px-7 py-3.5 text-sm font-semibold text-navy"
            >
              See our services
            </a>
          </div>
        </div>
        <div className="flex justify-center md:justify-end reveal">
          <InteractiveLogo />
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const row = [...brands, ...brands];
  return (
    <section className="py-20 reveal">
      <p className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground mb-10">
        Trusted by teams shipping bold work
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
        <div className="flex gap-8 animate-marquee whitespace-nowrap w-max py-2">
          {row.map((b, i) => (
            <span
              key={i}
              className="glass glass-hover rounded-full px-7 py-3 font-display text-xl md:text-2xl font-bold tracking-widest text-navy/80"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-28 md:py-36">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Narrative */}
        <div className="lg:col-span-5 space-y-7 reveal">
          <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-brand-blue">Our studio</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
            Bridging <span className="text-brand-blue">vision</span> and measurable <span className="text-brand-yellow">growth</span>.
          </h2>
          <div className="space-y-4 text-lg text-muted-foreground font-light leading-relaxed max-w-md">
            <p>
              We pair sharp strategy with relentless craft — helping challenger startups and
              category leaders sound clearer, look sharper, and grow faster.
            </p>
            <p>
              No silos. No hand-offs. One team shipping work that earns attention and revenue.
            </p>
          </div>
        </div>

        {/* Bento stats */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-5 reveal">
          {/* Hero stat */}
          <div className="col-span-2 md:col-span-1 glass glass-hover rounded-3xl p-7 flex flex-col justify-between aspect-square md:aspect-auto md:min-h-[260px] relative overflow-hidden">
            <div className="glass glass-tint-blue w-12 h-12 rounded-2xl flex items-center justify-center">
              <Megaphone size={20} className="text-brand-blue" />
            </div>
            <div>
              <div className="font-display text-5xl md:text-6xl font-bold text-navy leading-none">120+</div>
              <div className="mt-2 text-sm text-muted-foreground">Brands launched across 14 industries</div>
            </div>
            <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full" style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--brand-blue) 30%, transparent), transparent 70%)" }} />
          </div>

          <div className="col-span-2 md:col-span-1 grid gap-5">
            {/* ROAS */}
            <div className="glass glass-hover rounded-3xl p-6">
              <div className="flex items-baseline justify-between">
                <div className="font-display text-4xl font-bold text-navy">8×</div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-blue">ROAS</span>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">Average return on ad spend across paid media accounts.</div>
              <div className="mt-4 h-1 w-full bg-foreground/5 rounded-full overflow-hidden">
                <div className="h-full w-[88%] rounded-full" style={{ background: "var(--brand-yellow)" }} />
              </div>
            </div>

            {/* Awards — accent */}
            <div className="glass glass-tint-blue glass-hover glass-glow rounded-3xl p-6 relative overflow-hidden">
              <div className="flex items-baseline justify-between">
                <div className="font-display text-4xl font-bold text-navy">14</div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-blue">Awards</span>
              </div>
              <div className="mt-3 text-sm text-navy/70">Industry recognitions for craft, strategy, and results.</div>
            </div>
          </div>

          {/* Wide footer card */}
          <div className="col-span-2 glass glass-hover rounded-3xl p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-brand-blue font-semibold">One team</div>
              <div className="mt-2 text-xl md:text-2xl font-bold text-navy leading-snug max-w-md">
                Strategy, creative, and media — sitting shoulder to shoulder.
              </div>
            </div>
            <a
              href="#contact"
              className="glass glass-tint-blue glass-hover glass-glow inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold whitespace-nowrap self-start md:self-auto"
            >
              Meet the team <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="relative">
      <div className="mx-auto max-w-7xl px-6 py-28 md:py-36">
        <div className="max-w-2xl mb-14 reveal">
          <span className="text-xs uppercase tracking-[0.25em] text-brand-blue font-semibold">Services</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">Everything you need to build a brand that ships.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="group glass glass-hover rounded-3xl p-7 reveal"
              style={{ transitionDelay: `${(i % 3) * 60}ms` }}
            >
              <div className="glass glass-tint-blue w-12 h-12 rounded-2xl flex items-center justify-center mb-5">
                <Icon size={22} />
              </div>
              <h3 className="text-xl font-bold text-navy">{title}</h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed font-light">{desc}</p>
              <div className="mt-5 h-[2px] w-8 bg-brand-yellow group-hover:w-16 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-28 md:py-36">
      <div className="grid md:grid-cols-2 gap-14">
        <div className="reveal">
          <span className="text-xs uppercase tracking-[0.25em] text-brand-blue font-semibold">Contact</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">Let's build something worth talking about.</h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-md font-light">
            Tell us about your brand, your goals, and where you're stuck. We'll come back
            within one business day.
          </p>
          <div className="mt-8 space-y-3 text-sm">
            <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3"><Mail size={16} className="text-brand-blue" /> hello@sawaqly.com</div>
            <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3"><Phone size={16} className="text-brand-blue" /> +20 100 000 0000</div>
            <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3"><MapPin size={16} className="text-brand-blue" /> Cairo, Egypt</div>
          </div>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="glass glass-strong rounded-3xl p-8 space-y-4 reveal"
        >
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name" name="name" />
            <Field label="Company" name="company" />
          </div>
          <Field label="Email" name="email" type="email" />
          <div>
            <label className="text-sm font-medium">Project brief</label>
            <textarea
              required
              rows={4}
              className="glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>
          <button
            type="submit"
            className="glass glass-tint-blue glass-hover glass-glow inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold"
          >
            <Send size={16} /> {sent ? "Thanks — we'll be in touch" : "Send message"}
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
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-6 py-24 reveal">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-brand-blue font-semibold">Find us</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Come say hi.</h2>
          </div>
          <a
            href="https://maps.google.com/?q=Cairo,Egypt"
            target="_blank"
            rel="noreferrer"
            className="glass glass-hover rounded-full px-5 py-2.5 text-sm font-semibold text-brand-blue inline-flex items-center gap-1.5"
          >
            Open in Google Maps <ArrowRight size={14} />
          </a>
        </div>
        <div className="relative glass rounded-3xl p-2 overflow-hidden">
          <div className="rounded-2xl overflow-hidden">
            <iframe
              title="Sawaqly office location"
              src="https://www.google.com/maps?q=Cairo,Egypt&output=embed"
              width="100%"
              height="460"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0, display: "block" }}
            />
          </div>
          <div className="absolute left-6 bottom-6 glass glass-strong rounded-2xl px-5 py-4 max-w-xs hidden md:block">
            <div className="text-xs uppercase tracking-[0.2em] text-brand-blue font-semibold">Studio</div>
            <div className="mt-1 text-sm text-navy font-semibold">Sawaqly HQ</div>
            <div className="mt-1 text-xs text-muted-foreground">Cairo, Egypt · Mon–Fri 9–6</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-4 pb-6">
      <div className="mx-auto max-w-7xl glass rounded-3xl px-8 py-10 grid md:grid-cols-3 gap-8 items-start">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="inline-block w-7 h-7 rounded-md" style={{ background: "var(--gradient-brand)" }} />
            <span>Sawaqly</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs font-light">
            Marketing agency building brands that move and growth that sticks.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-semibold mb-3">Studio</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href="#about" className="hover:text-brand-blue">About</a></li>
            <li><a href="#services" className="hover:text-brand-blue">Services</a></li>
            <li><a href="#contact" className="hover:text-brand-blue">Contact</a></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-semibold mb-3">Reach us</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>hello@sawaqly.com</li>
            <li>+20 100 000 0000</li>
            <li>Cairo, Egypt</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl pt-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Sawaqly Marketing Agency. All rights reserved.
      </div>
    </footer>
  );
}
