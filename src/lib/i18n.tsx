import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";

const translations = {
  // Nav
  "nav.services": { en: "Our Services", ar: "خدماتنا" },
  "nav.projects": { en: "Our Projects", ar: "مشاريعنا" },
  "nav.team": { en: "Our Team", ar: "فريقنا" },
  "nav.contact": { en: "Contact Us", ar: "تواصل معنا" },
  "nav.careers": { en: "Careers", ar: "الوظائف" },
  "nav.cta": { en: "Schedule a free meeting", ar: "احجز اجتماع مجاني" },

  // Hero
  "hero.line1a": { en: "Brands that ", ar: "علامات تجارية " },
  "hero.line1b": { en: "move", ar: "تتحرك" },
  "hero.line2a": { en: "Growth that ", ar: "نمو " },
  "hero.line2b": { en: "sticks", ar: "يدوم" },
  "hero.sub": {
    en: "Sawaqly is a full-service marketing agency turning bold ideas into measurable momentum — strategy, identity, campaigns, content, and conversion.",
    ar: "سواقلي هي وكالة تسويق متكاملة تحوّل الأفكار الجريئة إلى نتائج قابلة للقياس — استراتيجية، هوية، حملات، محتوى، وتحويل.",
  },
  "hero.cta1": { en: "Schedule a free meeting", ar: "احجز اجتماع مجاني" },
  "hero.cta2": { en: "See our services", ar: "شاهد خدماتنا" },

  // Marquee
  "marquee.label": {
    en: "Trusted by teams shipping bold work",
    ar: "موثوق من فرق تقدّم أعمالاً جريئة",
  },

  // Services
  "services.title": { en: "What We Are Doing?", ar: "ماذا نفعل؟" },
  "services.sub": {
    en: "We combine creative strategy with data-driven execution to build brands that stand out and scale faster.",
    ar: "ندمج الاستراتيجية الإبداعية مع التنفيذ المبني على البيانات لبناء علامات تجارية تبرز وتنمو بشكل أسرع.",
  },

  // Team
  "team.title": { en: "Meet the people behind the work.", ar: "تعرّف على الفريق وراء العمل." },
  "team.sub": {
    en: "Our team of strategists, designers, and engineers work seamlessly together to bring your boldest ideas to life.",
    ar: "فريقنا من الاستراتيجيين والمصممين والمهندسين يعملون معاً بسلاسة لتحويل أجرأ أفكارك إلى واقع.",
  },

  // Contact
  "contact.title": {
    en: "Let's build something worth talking about.",
    ar: "لنبني شيئاً يستحق الحديث عنه.",
  },
  "contact.sub": {
    en: "Tell us about your brand, your goals, and where you're stuck. We'll come back within one business day.",
    ar: "أخبرنا عن علامتك التجارية وأهدافك وأين تواجه صعوبة. سنعود إليك خلال يوم عمل واحد.",
  },
  "contact.name": { en: "Name", ar: "الاسم" },
  "contact.company": { en: "Company", ar: "الشركة" },
  "contact.email": { en: "Email", ar: "البريد الإلكتروني" },
  "contact.phone": { en: "Phone Number", ar: "رقم الهاتف" },
  "contact.brief": { en: "Project brief", ar: "ملخص المشروع" },
  "contact.sending": { en: "Sending...", ar: "جاري الإرسال..." },
  "contact.sent": { en: "Thanks — we'll be in touch", ar: "شكراً — سنتواصل معك قريباً" },
  "contact.send": { en: "Send message", ar: "إرسال الرسالة" },

  // Map
  "map.title": { en: "Come say hi.", ar: "تعال وقل مرحباً." },
  "map.open": { en: "Open in Google Maps", ar: "افتح في خرائط جوجل" },
  "map.studio": { en: "Studio", ar: "الاستوديو" },

  // Footer
  "footer.tagline": {
    en: "Marketing agency building brands that move and growth that sticks.",
    ar: "وكالة تسويق تبني علامات تجارية تتحرك ونمو يدوم.",
  },
  "footer.studio": { en: "Studio", ar: "الاستوديو" },
  "footer.reach": { en: "Reach us", ar: "تواصل معنا" },
  "footer.location": { en: "Location", ar: "الموقع" },
  "footer.copy": {
    en: `© ${new Date().getFullYear()} Sawaqly Marketing Agency. All rights reserved.`,
    ar: `© ${new Date().getFullYear()} وكالة سواقلي للتسويق. جميع الحقوق محفوظة.`,
  },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const t = (key: TranslationKey): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry.en;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
