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
    id: "ea2a420e-4824-4291-8483-2cb99d986107",
    title: "Web Development",
    title_en: "Web Development",
    title_ar: "تطوير المواقع الإلكترونية",
    description: "View our web development work, featuring responsive and user-friendly websites. Check out our successful projects to see how we help businesses expand their digital reach and impact.",
    description_en: "View our web development work, featuring responsive and user-friendly websites. Check out our successful projects to see how we help businesses expand their digital reach and impact.",
    description_ar: "تصفح أعمالنا في تطوير المواقع الإلكترونية التفاعلية والعصرية.",
    icon_name: "Globe",
    sort_order: 0,
  },
  {
    id: "7f7a4cd1-ade1-4961-bacc-57c5546f3a31",
    title: "Branding",
    title_en: "Branding",
    title_ar: "الهوية البصرية والعلامة التجارية",
    description: "Your brand identity is the visual representation of your business. We create cohesive and distinctive brand identities that leave a lasting impression.",
    description_en: "Your brand identity is the visual representation of your business. We create cohesive and distinctive brand identities that leave a lasting impression.",
    description_ar: "نبتكر هويات بصرية متميزة ومبتكرة تعزز حضور علامتك التجارية.",
    icon_name: "Megaphone",
    sort_order: 2,
  },
  {
    id: "4743e1f4-4d1e-4bf2-afbe-9bef1d872fec",
    title: "Social Media Marketing",
    title_en: "Social Media Marketing",
    title_ar: "التسويق عبر وسائل التواصل الاجتماعي",
    description: "At Sawaqly Agency, we adopt a holistic approach to successfully manage our clients’ social media accounts.",
    description_en: "At Sawaqly Agency, we adopt a holistic approach to successfully manage our clients’ social media accounts.",
    description_ar: "إدارة احترافية لحسابات التواصل الاجتماعي واستراتيجيات تسويقية متكاملة.",
    icon_name: "Target",
    sort_order: 3,
  },
  {
    id: "3756caa3-6078-4906-97a2-2b8290a6dc45",
    title: "Creation Reels",
    title_en: "Creation Reels",
    title_ar: "إنتاج الريلز والمحتوى المرئي",
    description: "Creative short-form reels designed to capture attention, boost engagement, and showcase your brand.",
    description_en: "Creative short-form reels designed to capture attention, boost engagement, and showcase your brand.",
    description_ar: "صناعة فيديوهات ريلز إبداعية وجذابة تحقق أعلى مستويات التفاعل.",
    icon_name: "Video",
    sort_order: 4,
  },
];

export const DEFAULT_BRANDS: BrandItem[] = [
  { id: "b-1", name: "sea star", logo_url: "https://res.cloudinary.com/dv1orpktb/image/upload/v1779067266/Untitled_design_22_m0nlcm.png", sort_order: 0 },
  { id: "b-2", name: "elgasser", logo_url: "https://res.cloudinary.com/dv1orpktb/image/upload/v1779067269/Untitled_design_25_quxwpp.png", sort_order: 1 },
  { id: "b-3", name: "abrag", logo_url: "https://res.cloudinary.com/dv1orpktb/image/upload/v1779067266/Untitled_design_17_koyipv.png", sort_order: 2 },
  { id: "b-4", name: "darder dental", logo_url: "https://res.cloudinary.com/dv1orpktb/image/upload/v1779067264/Untitled_design_19_yhdlgc.png", sort_order: 3 },
  { id: "b-5", name: "khedewy", logo_url: "https://res.cloudinary.com/dv1orpktb/image/upload/v1779067264/Untitled_design_20_dwo5qi.png", sort_order: 4 },
  { id: "b-6", name: "noor centre", logo_url: "https://res.cloudinary.com/dv1orpktb/image/upload/v1779067263/Untitled_design_23_reol14.png", sort_order: 5 },
  { id: "b-7", name: "gomla souq", logo_url: "https://res.cloudinary.com/dv1orpktb/image/upload/v1779067260/Untitled_design_21_jbbsna.png", sort_order: 7 },
  { id: "b-8", name: "lamsa furniture", logo_url: "https://res.cloudinary.com/dv1orpktb/image/upload/v1779067258/Untitled_design_24_mqh6sn.png", sort_order: 8 },
  { id: "b-9", name: "hezb el gabha", logo_url: "https://res.cloudinary.com/dv1orpktb/image/upload/v1779067258/Untitled_design_27_oca8ct.png", sort_order: 9 },
];

export const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "cb414ab4-3be6-46bc-8991-e8d06ba4345b",
    name: "Nessma Tarek",
    name_en: "Nessma Tarek",
    name_ar: "نسمة طارق",
    role: "Team Leader",
    role_en: "Team Leader",
    role_ar: "قائد الفريق",
    photo_url: "https://res.cloudinary.com/dv1orpktb/image/upload/v1779063615/WhatsApp_Image_2026-05-16_at_23.47.45_rgsb8k.jpg",
    image_url: "https://res.cloudinary.com/dv1orpktb/image/upload/v1779063615/WhatsApp_Image_2026-05-16_at_23.47.45_rgsb8k.jpg",
    sort_order: 0,
  },
  {
    id: "e8c1a8e4-97b1-41ba-bdbd-81f2da091e33",
    name: "Khaled",
    name_en: "Khaled",
    name_ar: "خالد",
    role: "Reel Maker",
    role_en: "Reel Maker",
    role_ar: "صانع ريلز",
    photo_url: "https://res.cloudinary.com/dv1orpktb/image/upload/v1779063693/WhatsApp_Image_2026-05-17_at_00.28.32_brnnup.jpg",
    image_url: "https://res.cloudinary.com/dv1orpktb/image/upload/v1779063693/WhatsApp_Image_2026-05-17_at_00.28.32_brnnup.jpg",
    sort_order: 7,
  },
  {
    id: "ac66c178-087a-4028-aaf8-3c2fba282514",
    name: "Manar Ramadan",
    name_en: "Manar Ramadan",
    name_ar: "منار رمضان",
    role: "Graphic Desginer",
    role_en: "Graphic Desginer",
    role_ar: "مصممة جرافيك",
    sort_order: 8,
  },
  {
    id: "e9134dd3-baac-4735-92da-1236e8e4a985",
    name: "Omar Waleed",
    name_en: "Omar Waleed",
    name_ar: "عمر وليد",
    role: "Founder",
    role_en: "Founder",
    role_ar: "المؤسس",
    sort_order: 9,
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
