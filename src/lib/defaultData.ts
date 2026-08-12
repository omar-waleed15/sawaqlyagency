export interface ServiceItem {
  id: string;
  title: string;
  title_en: string;
  title_ar: string;
  description: string;
  description_en: string;
  description_ar: string;
  icon_name: string;
  sort_order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  name_en?: string;
  name_ar?: string;
  role: string;
  role_en?: string;
  role_ar?: string;
  photo_url?: string;
  image_url?: string;
  sort_order: number;
}

export interface BrandItem {
  id: string;
  name: string;
  logo_url: string;
  sort_order: number;
}

export interface ProjectItem {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  client_en: string;
  client_ar: string;
  year: string;
  image_url: string;
  service_id: string;
  tags: string[];
  content_blocks: any[];
  sort_order: number;
  services?: {
    title: string;
    title_ar: string;
  };
}

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "srv-1",
    title: "Digital Marketing & Growth",
    title_en: "Digital Marketing & Growth",
    title_ar: "التسويق الرقمي والنمو",
    description: "Data-driven marketing campaigns designed to scale customer acquisition, boost conversion rates, and maximize ROI.",
    description_en: "Data-driven marketing campaigns designed to scale customer acquisition, boost conversion rates, and maximize ROI.",
    description_ar: "حملات تسويقية مدعومة بالبيانات مصممة لزيادة جذب العملاء، رفع معدلات التحويل، وتعظيم العائد على الاستثمار.",
    icon_name: "Megaphone",
    sort_order: 1,
  },
  {
    id: "srv-2",
    title: "Brand Strategy & Visual Identity",
    title_en: "Brand Strategy & Visual Identity",
    title_ar: "استراتيجية العلامة التجارية والهوية البصرية",
    description: "Crafting memorable brand identities, distinctive voice, and visual assets that resonate with your audience.",
    description_en: "Crafting memorable brand identities, distinctive voice, and visual assets that resonate with your audience.",
    description_ar: "صناعة هويات تجارية متميزة، صوت علامة فريد، وأصول بصرية تعزز ارتباط الجمهور برؤيتك.",
    icon_name: "PenTool",
    sort_order: 2,
  },
  {
    id: "srv-3",
    title: "Social Media Management",
    title_en: "Social Media Management",
    title_ar: "إدارة وسائل التواصل الاجتماعي",
    description: "End-to-end content production, active community management, strategic scheduling, and channel growth.",
    description_en: "End-to-end content production, active community management, strategic scheduling, and channel growth.",
    description_ar: "إنتاج المحتوى التفاعلي الشامل، إدارة المجتمعات التفاعلية، والجدولة الاستراتيجية لنمو الحسابات.",
    icon_name: "Share2",
    sort_order: 3,
  },
  {
    id: "srv-4",
    title: "Video Production & Motion",
    title_en: "Video Production & Motion",
    title_ar: "إنتاج الفيديو والموشن جرافيك",
    description: "High-quality promotional videos, reels, 3D animations, and motion graphics for maximum engagement.",
    description_en: "High-quality promotional videos, reels, 3D animations, and motion graphics for maximum engagement.",
    description_ar: "إنتاج فيديوهات ترويجية عالية الجودة، ريلز، ورسوم متحركة ثلاثية الأبعاد تحقق أعلى نسب تفاعل.",
    icon_name: "Video",
    sort_order: 4,
  },
];

export const DEFAULT_BRANDS: BrandItem[] = [
  { id: "b-1", name: "APEX GLOBAL", logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80", sort_order: 1 },
  { id: "b-2", name: "LUMINA TECH", logo_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&auto=format&fit=crop&q=80", sort_order: 2 },
  { id: "b-3", name: "VELOCITY MEDIA", logo_url: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=200&auto=format&fit=crop&q=80", sort_order: 3 },
  { id: "b-4", name: "NEXUS CORP", logo_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&auto=format&fit=crop&q=80", sort_order: 4 },
  { id: "b-5", name: "SOLARIS STUDIO", logo_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=80", sort_order: 5 },
];

export const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "tm-1",
    name: "Ahmed Hassan",
    name_en: "Ahmed Hassan",
    name_ar: "أحمد حسن",
    role: "Creative Director",
    role_en: "Creative Director",
    role_ar: "المدير الإبداعي",
    photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    sort_order: 1,
  },
  {
    id: "tm-2",
    name: "Nour El-Din",
    name_en: "Nour El-Din",
    name_ar: "نور الدين",
    role: "Head of Growth & Performance",
    role_en: "Head of Growth & Performance",
    role_ar: "رئيس نمو واستراتيجيات التسويق",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    sort_order: 2,
  },
  {
    id: "tm-3",
    name: "Sarah Khaled",
    name_en: "Sarah Khaled",
    name_ar: "سارة خالد",
    role: "Lead Brand Strategist",
    role_en: "Lead Brand Strategist",
    role_ar: "أخصائية استراتيجيات العلامة التجارية",
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    sort_order: 3,
  },
  {
    id: "tm-4",
    name: "Omar Waleed",
    name_en: "Omar Waleed",
    name_ar: "عمر وليد",
    role: "Art Director & Motion Lead",
    role_en: "Art Director & Motion Lead",
    role_ar: "مدير فني ومخرج موشن جرافيك",
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    sort_order: 4,
  },
];

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    title_en: "Apex Luxury Brand Identity & Rebrand",
    title_ar: "إعادة رسم الهوية البصرية لعلامة أبكس الفاخرة",
    description_en: "A comprehensive brand transformation for a high-end luxury timepieces brand, incorporating modern aesthetics with timeless elegance.",
    description_ar: "تحول شامل للهوية البصرية لعلامة تجارية متخصصة في الساعات الفاخرة، يجمع بين الجمال العصري والفخامة الكلاسيكية.",
    client_en: "Apex Luxury Group",
    client_ar: "مجموعة أبكس الفاخرة",
    year: "2025",
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    service_id: "srv-2",
    tags: ["Branding", "Visual Identity", "UI/UX"],
    content_blocks: [
      { type: "text", text: "Apex requested a brand overhaul to connect with next-generation luxury buyers while maintaining their classic heritage." },
      { type: "image", url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80" },
      { type: "text", text: "We developed custom typography, a gold-embossed logo mark, and a digital visual language across social media and web platforms." }
    ],
    sort_order: 1,
    services: {
      title: "Brand Strategy & Visual Identity",
      title_ar: "استراتيجية العلامة التجارية والهوية البصرية"
    }
  },
  {
    id: "proj-2",
    title_en: "Horizon Financial 300% ROI Growth Campaign",
    title_ar: "حملة النمو والتسويق الرقمي لمؤسسة هورايزون المالية",
    description_en: "Performance marketing & customer acquisition strategy scaling user growth across digital platforms with high-converting funnels.",
    description_ar: "استراتيجية الأداء والتسويق الرقمي التي ضاعفت قاعدة مستخدمي هورايزون عبر القنوات الرقمية ومسارات التحويل الذكية.",
    client_en: "Horizon Financial Tech",
    client_ar: "هورايزون للتكنولوجيا المالية",
    year: "2024",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
    service_id: "srv-1",
    tags: ["Growth Marketing", "Paid Ads", "Conversion Rate"],
    content_blocks: [
      { type: "text", text: "Through multi-channel hyper-targeted ad campaigns, customer acquisition cost was slashed by 42% while generating a 300% surge in monthly active users." },
      { type: "image", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80" }
    ],
    sort_order: 2,
    services: {
      title: "Digital Marketing & Growth",
      title_ar: "التسويق الرقمي والنمو"
    }
  },
  {
    id: "proj-3",
    title_en: "Urban Vibe Viral Social Campaign",
    title_ar: "حملة وسائل التواصل الاجتماعي التفاعلية لـ أوربان فايب",
    description_en: "Creative video production and social media strategy driving over 5 Million organic impressions across TikTok and Instagram Reels.",
    description_ar: "إنتاج محتوى إبداعي واستراتيجية تفاعلية حققت أكثر من ٥ ملايين مشاهدة مجانية عبر تيك توك وانستغرام ريلز.",
    client_en: "Urban Vibe Apparel",
    client_ar: "أوربان فايب للأزياء",
    year: "2025",
    image_url: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&auto=format&fit=crop&q=80",
    service_id: "srv-3",
    tags: ["Social Media", "Reels & TikTok", "Influencer"],
    content_blocks: [
      { type: "text", text: "We captured the raw streetwear aesthetic with high-tempo video teasers and micro-influencer collaborations." }
    ],
    sort_order: 3,
    services: {
      title: "Social Media Management",
      title_ar: "إدارة وسائل التواصل الاجتماعي"
    }
  },
  {
    id: "proj-4",
    title_en: "Stellar 3D Motion Commercial & Showcase",
    title_ar: "الإعلان الإبداعي والموشن جرافيك لمنتج ستيلار",
    description_en: "A futuristic 3D animation commercial introducing a next-gen smart tech device to global markets.",
    description_ar: "فيديو إعلاني ثلاثي الأبعاد يعرض منتجاً تقنياً مستقبلياً بطريقة مبتكرة وجذابة.",
    client_en: "Stellar Electronics",
    client_ar: "ستيلار للإلكترونيات",
    year: "2024",
    image_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=80",
    service_id: "srv-4",
    tags: ["3D Motion", "Video Production", "Commercial"],
    content_blocks: [
      { type: "text", text: "Full end-to-end 3D product render, sound design, and color grading tailored for broadcast and digital video ads." }
    ],
    sort_order: 4,
    services: {
      title: "Video Production & Motion",
      title_ar: "إنتاج الفيديو والموشن جرافيك"
    }
  }
];
