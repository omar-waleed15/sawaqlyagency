-- ==============================================================================
-- SUPABASE VIDEO PORTFOLIO SETUP SCRIPT
-- Run this in your Supabase Dashboard SQL Editor:
-- https://supabase.com/dashboard/project/omysootvprkkyhhdiicc/sql/new
-- ==============================================================================

-- 1. Ensure the 'video-portfolio' storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('video-portfolio', 'video-portfolio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Storage Policies for 'video-portfolio' bucket
DROP POLICY IF EXISTS "Public Access Video Portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Video Portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Video Portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Video Portfolio" ON storage.objects;

-- Allow public read of all assets in video-portfolio
CREATE POLICY "Public Access Video Portfolio" ON storage.objects
FOR SELECT USING (bucket_id = 'video-portfolio');

-- Allow public / anon upload of files to video-portfolio
CREATE POLICY "Public Upload Video Portfolio" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'video-portfolio');

-- Allow update
CREATE POLICY "Public Update Video Portfolio" ON storage.objects
FOR UPDATE USING (bucket_id = 'video-portfolio');

-- Allow delete
CREATE POLICY "Public Delete Video Portfolio" ON storage.objects
FOR DELETE USING (bucket_id = 'video-portfolio');

-- 3. Create 'video_reels' Table
CREATE TABLE IF NOT EXISTS public.video_reels (
  id TEXT PRIMARY KEY,
  title_en TEXT,
  title_ar TEXT,
  category_en TEXT,
  category_ar TEXT,
  views TEXT,
  view_count_num BIGINT DEFAULT 1000000,
  likes TEXT,
  shares TEXT,
  poster_url TEXT,
  video_url TEXT,
  duration TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on video_reels
ALTER TABLE public.video_reels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read video_reels" ON public.video_reels;
DROP POLICY IF EXISTS "Admin All video_reels" ON public.video_reels;

CREATE POLICY "Public Read video_reels" ON public.video_reels
FOR SELECT USING (true);

CREATE POLICY "Admin All video_reels" ON public.video_reels
FOR ALL USING (true);

-- 4. Add Video Portfolio headline/copy fields to website_copy
ALTER TABLE public.website_copy 
ADD COLUMN IF NOT EXISTS portfolio_title_en TEXT DEFAULT 'The Product Behind Millions Of Views',
ADD COLUMN IF NOT EXISTS portfolio_title_ar TEXT DEFAULT 'المنتج الخفي وراء ملايين المشاهدات',
ADD COLUMN IF NOT EXISTS portfolio_sub_en TEXT DEFAULT 'Over 12M User On Social Media. Everyone''s Talking About It.',
ADD COLUMN IF NOT EXISTS portfolio_sub_ar TEXT DEFAULT 'أكثر من 12 مليون شخص يتحدثون عن هذا المحتوى.',
ADD COLUMN IF NOT EXISTS portfolio_cta_en TEXT DEFAULT 'Explore Now',
ADD COLUMN IF NOT EXISTS portfolio_cta_ar TEXT DEFAULT 'استكشف الآن';

-- 5. Add Client Case Study, Before/After Meta, and Social Designs columns to video_reels
ALTER TABLE public.video_reels 
ADD COLUMN IF NOT EXISTS client_name_en TEXT,
ADD COLUMN IF NOT EXISTS client_name_ar TEXT,
ADD COLUMN IF NOT EXISTS growth_desc_en TEXT,
ADD COLUMN IF NOT EXISTS growth_desc_ar TEXT,
ADD COLUMN IF NOT EXISTS meta_before_url TEXT,
ADD COLUMN IF NOT EXISTS meta_after_url TEXT,
ADD COLUMN IF NOT EXISTS meta_before_tag_en TEXT DEFAULT 'Before Sawaqly',
ADD COLUMN IF NOT EXISTS meta_before_tag_ar TEXT DEFAULT 'قبل سـواقلي',
ADD COLUMN IF NOT EXISTS meta_after_tag_en TEXT DEFAULT 'After Sawaqly',
ADD COLUMN IF NOT EXISTS meta_after_tag_ar TEXT DEFAULT 'بعد سـواقلي',
ADD COLUMN IF NOT EXISTS social_designs JSONB DEFAULT '[]'::jsonb;
