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
  "ACME",
  "NORTHWIND",
  "GLOBEX",
  "INITECH",
  "UMBRELLA",
  "STARK",
  "WAYNE",
  "HOOLI",
  "PIED PIPER",
  "SOYLENT",
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
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
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-border">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
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
          className="hidden md:inline-flex items-center rounded-full px-5 py-2 text-sm font-medium text-primary-foreground"
          style={{ background: "var(--gradient-brand)" }}
        >
          Start a project
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-brand-yellow" />
            Marketing that compounds
          </span>
          <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
            Brands that <span className="text-brand-blue">move</span>.
            <br />
            Growth that <span className="text-brand-yellow">sticks</span>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Sawaqly is a full-service marketing agency turning bold ideas into measurable
            momentum — from strategy and identity to campaigns, content, and conversion.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book a strategy call
            </a>
            <a
              href="#services"
              className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold border border-border hover:border-brand-blue transition"
            >
              See our services
            </a>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <InteractiveLogo />
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const row = [...brands, ...brands];
  return (
    <section className="py-16 border-y border-border bg-secondary/40">
      <p className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">
        Trusted by teams shipping bold work
      </p>
      <div className="overflow-hidden">
        <div className="flex gap-16 animate-marquee whitespace-nowrap w-max">
          {row.map((b, i) => (
            <span
              key={i}
              className="font-display text-2xl md:text-3xl font-bold tracking-widest text-navy/70 hover:text-brand-blue transition"
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
    <section id="about" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="grid md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-4">
          <span className="text-xs uppercase tracking-[0.25em] text-brand-blue font-semibold">About us</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold">A studio of strategists, makers, and growth nerds.</h2>
        </div>
        <div className="md:col-span-7 md:col-start-6 space-y-5 text-lg text-muted-foreground">
          <p>
            We pair sharp strategy with relentless craft. From challenger startups to
            category leaders, we help brands sound clearer, look sharper, and grow faster.
          </p>
          <p>
            No silos. No hand-offs. One team — strategy, creative, and media — sitting
            shoulder to shoulder, shipping work that earns attention and revenue.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-6">
            {[
              ["120+", "Brands launched"],
              ["8x", "Avg. ROAS"],
              ["14", "Industry awards"],
            ].map(([n, l]) => (
              <div key={l}>
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
    <section id="services" className="bg-secondary/40 border-y border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-2xl mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-brand-blue font-semibold">Services</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold">Everything you need to build a brand that ships.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group bg-card rounded-2xl p-7 border border-border hover:border-brand-blue/40 hover:shadow-[var(--shadow-soft)] transition-all"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-primary-foreground"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Icon size={22} />
              </div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{desc}</p>
              <div className="mt-5 h-[2px] w-8 bg-brand-yellow group-hover:w-16 transition-all" />
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
    <section id="contact" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="grid md:grid-cols-2 gap-14">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-brand-blue font-semibold">Contact</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold">Let's build something worth talking about.</h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-md">
            Tell us about your brand, your goals, and where you're stuck. We'll come back
            within one business day.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <div className="flex items-center gap-3"><Mail size={16} className="text-brand-blue" /> hello@sawaqly.com</div>
            <div className="flex items-center gap-3"><Phone size={16} className="text-brand-blue" /> +20 100 000 0000</div>
            <div className="flex items-center gap-3"><MapPin size={16} className="text-brand-blue" /> Cairo, Egypt</div>
          </div>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="bg-card border border-border rounded-2xl p-8 shadow-[var(--shadow-soft)] space-y-4"
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
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground"
            style={{ background: "var(--gradient-brand)" }}
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
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
      />
    </div>
  );
}

function LocationMap() {
  return (
    <section className="bg-secondary/40 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-brand-blue font-semibold">Find us</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Come say hi.</h2>
          </div>
          <a
            href="https://maps.google.com/?q=Cairo,Egypt"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-brand-blue hover:underline"
          >
            Open in Google Maps →
          </a>
        </div>
        <div className="rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-soft)]">
          <iframe
            title="Sawaqly office location"
            src="https://www.google.com/maps?q=Cairo,Egypt&output=embed"
            width="100%"
            height="450"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0, display: "block" }}
          />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-3 gap-8 items-start">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="inline-block w-7 h-7 rounded-md" style={{ background: "var(--gradient-brand)" }} />
            <span>Sawaqly</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
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
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Sawaqly Marketing Agency. All rights reserved.
      </div>
    </footer>
  );
}
