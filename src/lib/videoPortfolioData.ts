import { MOCK_REELS, ReelItem, DEFAULT_CLIENT_CASE_STUDIES } from '../data/mockReelsData';
import { supabase } from './supabase';

export interface VideoPortfolioCopy {
  portfolio_title_en: string;
  portfolio_title_ar: string;
  portfolio_sub_en: string;
  portfolio_sub_ar: string;
  portfolio_cta_en: string;
  portfolio_cta_ar: string;
}

export const DEFAULT_PORTFOLIO_COPY: VideoPortfolioCopy = {
  portfolio_title_en: "The Product Behind Millions Of Views",
  portfolio_title_ar: "المنتج الخفي وراء ملايين المشاهدات",
  portfolio_sub_en: "Over 12M User On Social Media. Everyone's Talking About It.",
  portfolio_sub_ar: "أكثر من 12 مليون شخص يتحدثون عن هذا المحتوى.",
  portfolio_cta_en: "Explore Now",
  portfolio_cta_ar: "استكشف الآن",
};

const COPY_STORAGE_KEY = 'sawaqly_video_portfolio_copy';
const REELS_STORAGE_KEY = 'sawaqly_video_portfolio_reels';

// Fetch Copy (Supabase -> LocalStorage -> Default)
export async function fetchVideoPortfolioCopy(): Promise<VideoPortfolioCopy> {
  try {
    const { data, error } = await supabase
      .from('website_copy')
      .select('portfolio_title_en, portfolio_title_ar, portfolio_sub_en, portfolio_sub_ar, portfolio_cta_en, portfolio_cta_ar')
      .eq('id', 1)
      .single();

    if (!error && data && (data.portfolio_title_en || data.portfolio_title_ar)) {
      return {
        portfolio_title_en: data.portfolio_title_en || DEFAULT_PORTFOLIO_COPY.portfolio_title_en,
        portfolio_title_ar: data.portfolio_title_ar || DEFAULT_PORTFOLIO_COPY.portfolio_title_ar,
        portfolio_sub_en: data.portfolio_sub_en || DEFAULT_PORTFOLIO_COPY.portfolio_sub_en,
        portfolio_sub_ar: data.portfolio_sub_ar || DEFAULT_PORTFOLIO_COPY.portfolio_sub_ar,
        portfolio_cta_en: data.portfolio_cta_en || DEFAULT_PORTFOLIO_COPY.portfolio_cta_en,
        portfolio_cta_ar: data.portfolio_cta_ar || DEFAULT_PORTFOLIO_COPY.portfolio_cta_ar,
      };
    }
  } catch (err) {
    console.warn("Supabase fetch failed for video copy, using fallback:", err);
  }

  // LocalStorage fallback
  try {
    const local = localStorage.getItem(COPY_STORAGE_KEY);
    if (local) {
      return { ...DEFAULT_PORTFOLIO_COPY, ...JSON.parse(local) };
    }
  } catch {}

  return DEFAULT_PORTFOLIO_COPY;
}

// Save Copy
export async function saveVideoPortfolioCopy(copy: VideoPortfolioCopy): Promise<void> {
  try {
    localStorage.setItem(COPY_STORAGE_KEY, JSON.stringify(copy));
    // Trigger custom event so page updates immediately across tabs/components
    window.dispatchEvent(new Event('video-portfolio-copy-updated'));
  } catch {}

  try {
    await supabase
      .from('website_copy')
      .update(copy)
      .eq('id', 1);
  } catch (err) {
    console.warn("Supabase update failed for video copy:", err);
  }
}

// Helper to check if an ID belongs to the legacy mock reels
const isLegacyMockId = (id: string) => /^reel-[1-8]$/.test(id);

// Fetch Reels
export async function fetchVideoReels(): Promise<ReelItem[]> {
  try {
    const { data, error } = await supabase
      .from('video_reels')
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: false });

    if (!error && data) {
      return data
        .filter((item: any) => !isLegacyMockId(item.id))
        .map((item: any) => {
          const defaultCs = DEFAULT_CLIENT_CASE_STUDIES[item.id] || {};
          return {
            id: item.id,
            titleEn: item.title_en || item.titleEn || '',
            titleAr: item.title_ar || item.titleAr || '',
            categoryEn: item.category_en || item.categoryEn || 'Video',
            categoryAr: item.category_ar || item.categoryAr || 'فيديو',
            views: item.views || '1M',
            viewCountNum: item.view_count_num || item.viewCountNum || 1000000,
            likes: item.likes || '10K',
            shares: item.shares || '1K',
            posterUrl: item.poster_url || item.posterUrl || '',
            videoUrl: item.video_url || item.videoUrl || '',
            duration: item.duration || '0:15',

            // Case Study Fields
            clientNameEn: item.client_name_en ?? item.clientNameEn ?? defaultCs.clientNameEn ?? '',
            clientNameAr: item.client_name_ar ?? item.clientNameAr ?? defaultCs.clientNameAr ?? '',
            growthDescEn: item.growth_desc_en ?? item.growthDescEn ?? defaultCs.growthDescEn ?? '',
            growthDescAr: item.growth_desc_ar ?? item.growthDescAr ?? defaultCs.growthDescAr ?? '',
            metaBeforeUrl: item.meta_before_url ?? item.metaBeforeUrl ?? defaultCs.metaBeforeUrl ?? '',
            metaAfterUrl: item.meta_after_url ?? item.metaAfterUrl ?? defaultCs.metaAfterUrl ?? '',
            metaBeforeTagEn: item.meta_before_tag_en ?? item.metaBeforeTagEn ?? defaultCs.metaBeforeTagEn ?? 'Before Sawaqly',
            metaBeforeTagAr: item.meta_before_tag_ar ?? item.metaBeforeTagAr ?? defaultCs.metaBeforeTagAr ?? 'قبل سـواقلي',
            metaAfterTagEn: item.meta_after_tag_en ?? item.metaAfterTagEn ?? defaultCs.metaAfterTagEn ?? 'After Sawaqly',
            metaAfterTagAr: item.meta_after_tag_ar ?? item.metaAfterTagAr ?? defaultCs.metaAfterTagAr ?? 'بعد سـواقلي',
            socialDesigns: item.social_designs ?? item.socialDesigns ?? defaultCs.socialDesigns ?? [],
          };
        });
    }
  } catch (err) {
    console.warn("Supabase fetch failed for video reels, using fallback:", err);
  }

  // LocalStorage fallback
  try {
    const local = localStorage.getItem(REELS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item: any) => !isLegacyMockId(item.id))
          .map((item: any) => {
            const defaultCs = DEFAULT_CLIENT_CASE_STUDIES[item.id] || {};
            return {
              ...item,
              clientNameEn: item.clientNameEn ?? defaultCs.clientNameEn ?? '',
              clientNameAr: item.clientNameAr ?? defaultCs.clientNameAr ?? '',
              growthDescEn: item.growthDescEn ?? defaultCs.growthDescEn ?? '',
              growthDescAr: item.growthDescAr ?? defaultCs.growthDescAr ?? '',
              metaBeforeUrl: item.metaBeforeUrl ?? defaultCs.metaBeforeUrl ?? '',
              metaAfterUrl: item.metaAfterUrl ?? defaultCs.metaAfterUrl ?? '',
              metaBeforeTagEn: item.metaBeforeTagEn ?? defaultCs.metaBeforeTagEn ?? 'Before Sawaqly',
              metaBeforeTagAr: item.metaBeforeTagAr ?? defaultCs.metaBeforeTagAr ?? 'قبل سـواقلي',
              metaAfterTagEn: item.metaAfterTagEn ?? defaultCs.metaAfterTagEn ?? 'After Sawaqly',
              metaAfterTagAr: item.metaAfterTagAr ?? defaultCs.metaAfterTagAr ?? 'بعد سـواقلي',
              socialDesigns: item.socialDesigns ?? defaultCs.socialDesigns ?? [],
            };
          });
      }
    }
  } catch {}

  return [];
}

// Delete a Reel from Supabase
export async function deleteVideoReel(id: string): Promise<void> {
  try {
    await supabase.from('video_reels').delete().eq('id', id);
  } catch (err) {
    console.warn("Supabase delete failed for video reel:", err);
  }
}

// Save Reels
export async function saveVideoReels(reels: ReelItem[]): Promise<void> {
  try {
    localStorage.setItem(REELS_STORAGE_KEY, JSON.stringify(reels));
    window.dispatchEvent(new Event('video-portfolio-reels-updated'));
  } catch {}

  try {
    const dbPayload = reels.map((r, index) => ({
      id: r.id,
      title_en: r.titleEn,
      title_ar: r.titleAr,
      category_en: r.categoryEn,
      category_ar: r.categoryAr,
      views: r.views,
      view_count_num: r.viewCountNum,
      likes: r.likes,
      shares: r.shares,
      poster_url: r.posterUrl,
      video_url: r.videoUrl,
      duration: r.duration,
      sort_order: index,
      client_name_en: r.clientNameEn || null,
      client_name_ar: r.clientNameAr || null,
      growth_desc_en: r.growthDescEn || null,
      growth_desc_ar: r.growthDescAr || null,
      meta_before_url: r.metaBeforeUrl || null,
      meta_after_url: r.metaAfterUrl || null,
      meta_before_tag_en: r.metaBeforeTagEn || 'Before Sawaqly',
      meta_before_tag_ar: r.metaBeforeTagAr || 'قبل سـواقلي',
      meta_after_tag_en: r.metaAfterTagEn || 'After Sawaqly',
      meta_after_tag_ar: r.metaAfterTagAr || 'بعد سـواقلي',
      social_designs: r.socialDesigns || [],
    }));

    const { error: upsertErr } = await supabase.from('video_reels').upsert(dbPayload);
    if (upsertErr && (upsertErr.message?.includes('column') || (upsertErr as any).code === '42703')) {
      console.warn("Case study columns not yet in Supabase SQL schema, saving base payload:", upsertErr.message);
      const basePayload = reels.map((r, index) => ({
        id: r.id,
        title_en: r.titleEn,
        title_ar: r.titleAr,
        category_en: r.categoryEn,
        category_ar: r.categoryAr,
        views: r.views,
        view_count_num: r.viewCountNum,
        likes: r.likes,
        shares: r.shares,
        poster_url: r.posterUrl,
        video_url: r.videoUrl,
        duration: r.duration,
        sort_order: index,
      }));
      await supabase.from('video_reels').upsert(basePayload);
    }
  } catch (err) {
    console.warn("Supabase upsert failed for video reels:", err);
  }
}

// Upload Video File to Supabase Storage
export async function uploadReelVideoToSupabase(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'mp4';
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `reels/${Date.now()}_${cleanName}`;

  const { data, error } = await supabase.storage
    .from('video-portfolio')
    .upload(filePath, file, {
      contentType: file.type || 'video/mp4',
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase video upload failed: ${error.message}`);
  }

  const { data: pubData } = supabase.storage
    .from('video-portfolio')
    .getPublicUrl(data.path);

  return pubData.publicUrl;
}

// Upload Poster Image to Supabase Storage
export async function uploadReelPosterToSupabase(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `posters/${Date.now()}_${cleanName}`;

  const { data, error } = await supabase.storage
    .from('video-portfolio')
    .upload(filePath, file, {
      contentType: file.type || 'image/jpeg',
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase poster upload failed: ${error.message}`);
  }

  const { data: pubData } = supabase.storage
    .from('video-portfolio')
    .getPublicUrl(data.path);

  return pubData.publicUrl;
}
