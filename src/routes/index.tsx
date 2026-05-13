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
  Linkedin,
  Twitter,
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
        <Team />
        <Contact />
        <LocationMap />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const delta = y - lastY.current;
      if (y > 80 && delta > 4) setHidden(true);
      else if (delta < -4) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`sticky top-4 z-40 px-4 transition-transform duration-300 ease-out ${hidden ? "-translate-y-[150%]" : "translate-y-0"}`}
    >
      <div
        className={`nav-shell mx-auto max-w-[88rem] glass glass-hover rounded-full px-8 h-14 flex items-center justify-between ${scrolled ? "scrolled" : ""}`}
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
    <section id="top" className="relative">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 bottom-0 -z-10 rounded-b-[80px] md:rounded-b-[140px]"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--brand-blue) 28%, white) 0%, color-mix(in oklab, var(--brand-blue) 14%, white) 55%, color-mix(in oklab, var(--brand-yellow) 18%, white) 100%)",
          boxShadow: "0 40px 70px -40px color-mix(in oklab, var(--brand-blue) 45%, transparent)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 pt-16 md:pt-24 pb-24 md:pb-32 grid lg:grid-cols-2 gap-12 items-center min-h-[88vh]">
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
          <div className="mt-8 flex flex-row flex-nowrap gap-3">
            <a
              href="#contact"
              className="glass glass-tint-blue glass-hover glass-glow inline-flex items-center justify-center gap-2 rounded-full px-5 sm:px-7 py-3 sm:py-3.5 text-sm font-semibold whitespace-nowrap"
            >
              Book a strategy call <ArrowRight size={16} />
            </a>
            <a
              href="#services"
              className="glass glass-hover inline-flex items-center justify-center rounded-full px-5 sm:px-7 py-3 sm:py-3.5 text-sm font-semibold text-navy whitespace-nowrap"
            >
              See our services
            </a>
          </div>
        </div>
        <div className="hidden lg:flex justify-center lg:justify-end reveal">
          <InteractiveLogo />
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const row = [...brands, ...brands];
  return (
    <section className="relative bg-white py-20 reveal">
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
    <section id="about" className="mx-auto max-w-7xl px-6 py-28 md:py-36 reveal">
      <div className="grid md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-4">
          <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">A studio of strategists, makers, and growth nerds.</h2>
        </div>
        <div className="md:col-span-7 md:col-start-6 space-y-5 text-lg text-muted-foreground font-light">
          <p>
            We pair sharp strategy with relentless craft. From challenger startups to
            category leaders, we help brands sound clearer, look sharper, and grow faster.
          </p>
          <p>
            No silos. No hand-offs. One team — strategy, creative, and media — sitting
            shoulder to shoulder, shipping work that earns attention and revenue.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-6">
            {[
              ["120+", "Brands launched"],
              ["8x", "Avg. ROAS"],
              ["14", "Industry awards"],
            ].map(([n, l]) => (
              <div key={l} className="glass rounded-2xl p-5">
                <div className="font-display text-3xl md:text-4xl font-bold text-navy">{n}</div>
                <div className="text-sm text-muted-foreground mt-1">{l}</div>
              </div>
            ))}
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


const team = [
  { name: "Layla Hassan", role: "Founder & Creative Director", initials: "LH", tint: "blue" },
  { name: "Omar El-Sayed", role: "Head of Strategy", initials: "OS", tint: "yellow" },
  { name: "Mariam Adel", role: "Design Lead", initials: "MA", tint: "blue" },
  { name: "Youssef Nabil", role: "Performance Marketing Lead", initials: "YN", tint: "yellow" },
];

function Team() {
  return (
    <section id="team" className="relative">
      <div className="mx-auto max-w-7xl px-6 py-28 md:py-36">
        <div className="flex items-end justify-between mb-14 flex-wrap gap-6 reveal">
          <div className="max-w-2xl">
            <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">Meet the people behind the work.</h2>
          </div>
          <p className="max-w-sm text-muted-foreground font-light">
            A tight-knit crew of strategists, designers, and growth operators — building brands shoulder to shoulder with you.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m, i) => (
            <div
              key={m.name}
              className="group glass glass-hover rounded-3xl p-6 reveal"
              style={{ transitionDelay: `${(i % 4) * 60}ms` }}
            >
              <div
                className={`glass ${m.tint === "blue" ? "glass-tint-blue" : ""} aspect-square w-full rounded-2xl flex items-center justify-center mb-5`}
                style={
                  m.tint === "yellow"
                    ? { background: "color-mix(in oklab, var(--brand-yellow) 22%, white)" }
                    : undefined
                }
              >
                <span className="font-display text-5xl font-bold text-navy/80">{m.initials}</span>
              </div>
              <h3 className="text-lg font-bold text-navy">{m.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 font-light">{m.role}</p>
              <div className="mt-5 flex items-center justify-between">
                <div className="h-[2px] w-8 bg-brand-yellow group-hover:w-16 transition-all duration-500" />
                <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition">
                  <a href="#" aria-label={`${m.name} on LinkedIn`} className="glass rounded-full p-2"><Linkedin size={14} /></a>
                  <a href="#" aria-label={`${m.name} on Twitter`} className="glass rounded-full p-2"><Twitter size={14} /></a>
                </div>
              </div>
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
