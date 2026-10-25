export interface SocialDesignItem {
  id: string;
  url: string;
  titleEn?: string;
  titleAr?: string;
  pageLogoUrl?: string;
  captionEn?: string;
  captionAr?: string;
  likesCount?: number | string;
}

export interface ReelItem {
  id: string;
  titleEn: string;
  titleAr: string;
  categoryEn: string;
  categoryAr: string;
  views: string;
  viewCountNum: number;
  likes: string;
  shares: string;
  posterUrl: string;
  videoUrl: string;
  duration: string;

  // Client Case Study Fields
  clientNameEn?: string;
  clientNameAr?: string;
  clientLogoUrl?: string;
  growthDescEn?: string;
  growthDescAr?: string;
  metaBeforeUrl?: string;
  metaAfterUrl?: string;
  metaBeforeTagEn?: string;
  metaBeforeTagAr?: string;
  metaAfterTagEn?: string;
  metaAfterTagAr?: string;
  socialDesigns?: SocialDesignItem[];
}

export const MOCK_REELS: ReelItem[] = [];

// Curated default case studies for known client reels when DB has no custom data yet
export const DEFAULT_CLIENT_CASE_STUDIES: Record<string, Partial<ReelItem>> = {
  // Souq El Gomla
  'reel-1789649138096': {
    clientNameEn: 'Souq El Gomla',
    clientNameAr: 'سوق الجملة',
    growthDescEn: 'Revamped Souq El Gomla\'s ad creative architecture by engineering high-hook vertical video offers and targeted retargeting sequences, scaling daily wholesale orders and driving direct-to-consumer bulk sales across Egypt.',
    growthDescAr: 'قمنا بإعادة هيكلة الحملات الإعلانية وصناعة محتوى فيديو سريع الانتشار يركز على عروض الجملة، مما ضاعف طلبات الشراء اليومية وحقق نمواً استثنائياً في قاعدة العملاء بجميع المحافظات.',
    metaBeforeUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    metaAfterUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    metaBeforeTagEn: 'Before Sawaqly',
    metaBeforeTagAr: 'قبل سـواقلي',
    metaAfterTagEn: 'After Sawaqly',
    metaAfterTagAr: 'بعد سـواقلي',
    socialDesigns: [
      {
        id: 'sd-1',
        url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=1000&auto=format&fit=crop&q=80',
        titleEn: 'Crunch Into Perfection Sandwich Ad',
        titleAr: 'بوستر ساندوتش مقرمش وإعلان موسمي',
        pageLogoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=160&auto=format&fit=crop&q=80',
        captionEn: 'Crispy, packed, and baked fresh every morning! Taste the crunch in every bite. #SouqElGomla #FreshBakery',
        captionAr: 'مقرمشة ومخبوزة طازجة كل صباح بأعلى معايير الجودة! اطلب عروض اليوم الحصرية من سوق الجملة.',
        likesCount: 3420,
      },
      {
        id: 'sd-2',
        url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80',
        titleEn: 'The Art of The Perfect Crust',
        titleAr: 'فن صناعة المخبوزات والخبز الحرفي',
        pageLogoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=160&auto=format&fit=crop&q=80',
        captionEn: 'Slow fermented dough baked at stone-hearth perfection. Fresh batches every 2 hours.',
        captionAr: 'تخمير بطيء وخبز على الحجر البركاني الساخن لنمنحك القرمشة المثالية في كل رغيف.',
        likesCount: 2890,
      },
      {
        id: 'sd-3',
        url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1000&auto=format&fit=crop&q=80',
        titleEn: 'Chiffon Cake & Lemon Slice Special',
        titleAr: 'بوستر كيك الشيفون وعروض الحلويات',
        pageLogoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=160&auto=format&fit=crop&q=80',
        captionEn: 'Cloud-soft chiffon cake topped with organic lemon zest cream. Available in all branches now.',
        captionAr: 'كيك الشيفون الإسفنجي بكريمة الليمون الطبيعية المنعشة متوفر الآن بجميع فروعنا.',
        likesCount: 4150,
      },
      {
        id: 'sd-4',
        url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1000&auto=format&fit=crop&q=80',
        titleEn: 'Freshly Baked Cinnamon Rolls Promo',
        titleAr: 'عرض المخبوزات الطازجة ورولات القرفة',
        pageLogoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=160&auto=format&fit=crop&q=80',
        captionEn: 'Warm cinnamon rolls glazed with rich cream cheese frosting. Start your morning right!',
        captionAr: 'رولات القرفة الساخنة مع صوص الجبن الغني والمكسرات المحمصة لصباح مليء بالطاقة.',
        likesCount: 5210,
      },
    ],
  },

  // Uni Bus (Configured with exactly 2 items to demonstrate centered dual layout)
  'reel-1789649103751': {
    clientNameEn: 'Uni Bus Transport',
    clientNameAr: 'يوني باص للنقل الذكي',
    growthDescEn: 'Engineered a hyper-targeted student & commuter acquisition funnel on Meta and TikTok, transforming seasonal seat bookings into recurring monthly subscriptions with industry-leading retention rates.',
    growthDescAr: 'صممنا مسار استقطاب عالي الدقة لطلاب الجامعات والموظفين عبر إعلانات ميتا وتيك توك، مما حوّل الحجوزات الموسمية إلى اشتراكات شهرية متجددة بنسبة ولاء مرتفعة.',
    metaBeforeUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
    metaAfterUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&auto=format&fit=crop&q=80',
    metaBeforeTagEn: 'Before Sawaqly',
    metaBeforeTagAr: 'قبل سـواقلي',
    metaAfterTagEn: 'After Sawaqly',
    metaAfterTagAr: 'بعد سـواقلي',
    socialDesigns: [
      {
        id: 'ub-1',
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
        titleEn: 'Campus Express Direct Routes Ad',
        titleAr: 'إعلان مسارات الجامعات المباشرة',
      },
      {
        id: 'ub-2',
        url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80',
        titleEn: 'Monthly Student Pass Discount',
        titleAr: 'عرض الاشتراك الشهري للطلاب',
      },
    ],
  },

  // Seava (Fashion)
  'reel-1789649065438': {
    clientNameEn: 'Seava Fashion',
    clientNameAr: 'أزياء سيفا الراقية',
    growthDescEn: 'Transformed Seava\'s e-commerce customer acquisition by launching dynamic lookbook reels and seasonal catalog ads, drastically lowering cost-per-purchase while elevating luxury brand perception.',
    growthDescAr: 'طورنا استراتيجية إعلانات الفيديو التفاعلية للأزياء مع إبراز تفاصيل المنتجات بجودة سينمائية، مما خفض تكلفة الشراء بنسبة كبيرة ورفع متوسط قيمة السلة الشرائية.',
    metaBeforeUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    metaAfterUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
    metaBeforeTagEn: 'Before Sawaqly',
    metaBeforeTagAr: 'قبل سـواقلي',
    metaAfterTagEn: 'After Sawaqly',
    metaAfterTagAr: 'بعد سـواقلي',
    socialDesigns: [
      {
        id: 'sv-1',
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
        titleEn: 'Summer Collection Lookbook',
        titleAr: 'كتالوج المجموعة الصيفية',
      },
      {
        id: 'sv-2',
        url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop&q=80',
        titleEn: 'Haute Couture Story Ad',
        titleAr: 'إعلان ستوري أزياء راقية',
      },
      {
        id: 'sv-3',
        url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80',
        titleEn: 'Limited Edition Release',
        titleAr: 'تصميم إصدار محدود وحصري',
      },
    ],
  },

  // Lamsaa
  'reel-1789648136024': {
    clientNameEn: 'Lamsaa Beauty',
    clientNameAr: 'لمسة للعناية والجمال',
    growthDescEn: 'Scaled Lamsaa\'s brand presence through creator-led demonstration reels and problem-solution ad angles, driving rapid sell-outs of newly launched product lines within hours of campaign release.',
    growthDescAr: 'أطلقنا حملات إعلانية معتمدة على استعراض تجارب المنتجات الحقيقية وحلول العناية، مما أدى إلى نفاد الكميات بالكامل للمجموعات الجديدة خلال الساعات الأولى من الإطلاق.',
    metaBeforeUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    metaAfterUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    metaBeforeTagEn: 'Before Sawaqly',
    metaBeforeTagAr: 'قبل سـواقلي',
    metaAfterTagEn: 'After Sawaqly',
    metaAfterTagAr: 'بعد سـواقلي',
    socialDesigns: [
      {
        id: 'lm-1',
        url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
        titleEn: 'Product Routine Carousel',
        titleAr: 'خطوات روتين العناية اليومي',
      },
      {
        id: 'lm-2',
        url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
        titleEn: 'Ingredients Spotlight Post',
        titleAr: 'بوست المكونات الطبيعية الفعالة',
      },
      {
        id: 'lm-3',
        url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
        titleEn: 'Customer Review Highlight',
        titleAr: 'تجارب وآراء العميلات الموثقة',
      },
    ],
  },
};
