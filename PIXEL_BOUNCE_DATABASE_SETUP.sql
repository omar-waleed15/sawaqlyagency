-- ========================================================================
-- PIXEL BOUNCE SHOWCASE - FULL DATABASE SETUP & MIGRATION SCRIPT
-- Copy and paste this script into your Supabase SQL Editor and click RUN.
-- ========================================================================

-- 1. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', true) ON CONFLICT (id) DO NOTHING;

-- 2. TABLE: website_copy
CREATE TABLE IF NOT EXISTS public.website_copy (
  id INT PRIMARY KEY DEFAULT 1,
  hero_sub_en TEXT,
  hero_sub_ar TEXT,
  services_title_en TEXT,
  services_title_ar TEXT,
  services_sub_en TEXT,
  services_sub_ar TEXT,
  contact_title_en TEXT,
  contact_title_ar TEXT,
  contact_sub_en TEXT,
  contact_sub_ar TEXT,
  footer_tagline_en TEXT,
  footer_tagline_ar TEXT,
  projects_title_en TEXT,
  projects_title_ar TEXT,
  projects_sub_en TEXT,
  projects_sub_ar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed website_copy initial content
INSERT INTO public.website_copy (
  id, hero_sub_en, hero_sub_ar, services_title_en, services_title_ar,
  services_sub_en, services_sub_ar, contact_title_en, contact_title_ar,
  contact_sub_en, contact_sub_ar, footer_tagline_en, footer_tagline_ar,
  projects_title_en, projects_title_ar, projects_sub_en, projects_sub_ar
) VALUES (
  1,
  'We craft digital experiences, high-converting marketing campaigns, and standout brand identities.',
  'نبتكر تجارب رقمية وحملات تسويقية عالية التحويل وهويات تجارية متميزة.',
  'Our Expertise', 'خبراتنا',
  'Transforming vision into high-impact digital solutions.', 'تحويل الرؤية إلى حلول رقمية عالية الأثر.',
  'Let''s Build Something Great Together', 'لنبنِ شيئاً عظيماً معاً',
  'Reach out to start your project or discuss how we can scale your brand.', 'تواصل معنا للبدء في مشروعك أو مناقشة كيف يمكننا تطوير علامتك التجارية.',
  'Propelling brands into the digital future.', 'ندفع العلامات التجارية نحو المستقبل الرقمي.',
  'Featured Work', 'أبرز أعمالنا',
  'Explore our latest client success stories and creative showcases.', 'استكشف أحدث قصص نجاح عملائنا واستعراضاتنا الإبداعية.'
) ON CONFLICT (id) DO NOTHING;

-- 3. TABLE: social_media
CREATE TABLE IF NOT EXISTS public.social_media (
  id INT PRIMARY KEY DEFAULT 1,
  office_name TEXT,
  office_location TEXT,
  office_hours TEXT,
  map_share_url TEXT,
  map_embed_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  social_instagram TEXT,
  social_facebook TEXT,
  social_tiktok TEXT,
  footer_location_title TEXT,
  footer_location_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed social_media initial content
INSERT INTO public.social_media (
  id, office_name, office_location, office_hours, map_share_url, map_embed_url,
  contact_email, contact_phone, social_instagram, social_facebook, social_tiktok,
  footer_location_title, footer_location_description
) VALUES (
  1,
  'Sawaqly HQ',
  'Cairo, Egypt',
  'Mon–Fri 9–6',
  'https://maps.google.com/?q=Cairo,Egypt',
  'https://www.google.com/maps?q=Cairo,Egypt&output=embed',
  'hello@sawaqly.com',
  '+20 100 000 0000',
  'https://instagram.com',
  'https://facebook.com',
  'https://tiktok.com',
  'Our Headquarters',
  'Located in the heart of Cairo, serving clients worldwide.'
) ON CONFLICT (id) DO NOTHING;

-- 4. TABLE: brands
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLE: services
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  title_en TEXT,
  title_ar TEXT,
  description TEXT,
  description_en TEXT,
  description_ar TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed services default content
INSERT INTO public.services (title_en, title_ar, description_en, description_ar, icon, sort_order) VALUES
('Digital Marketing & Growth', 'التسويق الرقمي والنمو', 'Data-driven marketing campaigns designed to scale customer acquisition and ROI.', 'حملات تسويقية مدعومة بالبيانات مصممة لزيادة جذب العملاء والعائد على الاستثمار.', 'Megaphone', 0),
('Brand Strategy & Visual Identity', 'استراتيجية العلامة التجارية والهوية البصرية', 'Crafting memorable brand identities, voice, and visual assets that stand out.', 'صناعة هويات تجارية متميزة ولغة بصرية تترك انطباعاً فريداً.', 'PenTool', 1),
('Social Media Management', 'إدارة وسائل التواصل الاجتماعي', 'End-to-end content production, scheduling, community management, and growth.', 'إنتاج المحتوى الكامل، الجدولة، إدارة المجتمعات والتفاعل.', 'Share2', 2),
('Video Production & Motion', 'إنتاج الفيديو والموشن جرافيك', 'High-quality promotional videos, reels, and motion graphics for maximum engagement.', 'فيديوهات ترويجية عالية الجودة، ريلز، وموشن جرافيك لأعلى درجات التفاعل.', 'Video', 3)
ON CONFLICT DO NOTHING;

-- 6. TABLE: team
CREATE TABLE IF NOT EXISTS public.team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  name_en TEXT,
  name_ar TEXT,
  role TEXT,
  role_en TEXT,
  role_ar TEXT,
  bio TEXT,
  bio_en TEXT,
  bio_ar TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLE: projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_ar TEXT,
  description_en TEXT,
  description_ar TEXT,
  client_en TEXT,
  client_ar TEXT,
  year TEXT,
  image_url TEXT,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  content_blocks JSONB DEFAULT '[]'::jsonb,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLE: inquiries
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT,
  position TEXT,
  cv_url TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.website_copy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public Read website_copy" ON public.website_copy;
DROP POLICY IF EXISTS "Public Read social_media" ON public.social_media;
DROP POLICY IF EXISTS "Public Read brands" ON public.brands;
DROP POLICY IF EXISTS "Public Read services" ON public.services;
DROP POLICY IF EXISTS "Public Read team" ON public.team;
DROP POLICY IF EXISTS "Public Read projects" ON public.projects;
DROP POLICY IF EXISTS "Public Insert inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admin All website_copy" ON public.website_copy;
DROP POLICY IF EXISTS "Admin All social_media" ON public.social_media;
DROP POLICY IF EXISTS "Admin All brands" ON public.brands;
DROP POLICY IF EXISTS "Admin All services" ON public.services;
DROP POLICY IF EXISTS "Admin All team" ON public.team;
DROP POLICY IF EXISTS "Admin All projects" ON public.projects;
DROP POLICY IF EXISTS "Admin All inquiries" ON public.inquiries;

-- Create Public Read Policies
CREATE POLICY "Public Read website_copy" ON public.website_copy FOR SELECT USING (true);
CREATE POLICY "Public Read social_media" ON public.social_media FOR SELECT USING (true);
CREATE POLICY "Public Read brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Public Read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public Read team" ON public.team FOR SELECT USING (true);
CREATE POLICY "Public Read projects" ON public.projects FOR SELECT USING (true);

-- Create Public Insert for Contact & Career Forms
CREATE POLICY "Public Insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

-- Create Admin / All Access Policies
CREATE POLICY "Admin All website_copy" ON public.website_copy FOR ALL USING (true);
CREATE POLICY "Admin All social_media" ON public.social_media FOR ALL USING (true);
CREATE POLICY "Admin All brands" ON public.brands FOR ALL USING (true);
CREATE POLICY "Admin All services" ON public.services FOR ALL USING (true);
CREATE POLICY "Admin All team" ON public.team FOR ALL USING (true);
CREATE POLICY "Admin All projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Admin All inquiries" ON public.inquiries FOR ALL USING (true);

-- Storage bucket access policies
DROP POLICY IF EXISTS "Public Access CVS" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload CVS" ON storage.objects;
CREATE POLICY "Public Access CVS" ON storage.objects FOR SELECT USING (bucket_id = 'cvs');
CREATE POLICY "Public Upload CVS" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cvs');
