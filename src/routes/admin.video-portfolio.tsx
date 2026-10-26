import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Loader2,
  Check,
  Plus,
  Trash2,
  Edit2,
  Play,
  Video,
  Eye,
  ThumbsUp,
  X,
  MoveUp,
  MoveDown,
  Upload,
  Image as ImageIcon,
  Database,
  Copy,
  CheckCheck,
  ExternalLink,
  Sparkles,
  Heart,
} from 'lucide-react';
import {
  fetchVideoPortfolioCopy,
  saveVideoPortfolioCopy,
  fetchVideoReels,
  saveVideoReels,
  deleteVideoReel,
  uploadReelVideoToSupabase,
  uploadReelPosterToSupabase,
  VideoPortfolioCopy,
  DEFAULT_PORTFOLIO_COPY,
} from '../lib/videoPortfolioData';
import { ReelItem } from '../data/mockReelsData';
import { VideoUploader } from '../components/admin/VideoUploader';
import { ImageUploader } from '../components/admin/ImageUploader';

export const Route = createFileRoute('/admin/video-portfolio')({
  component: AdminVideoPortfolio,
});

const SQL_SETUP_SNIPPET = `-- Run this in Supabase Dashboard SQL Editor:
-- https://supabase.com/dashboard/project/folocnkupniuqrzbfqpr/sql/new

-- 1. Ensure 'video-portfolio' storage bucket exists & is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('video-portfolio', 'video-portfolio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Storage Policies for video-portfolio bucket
DROP POLICY IF EXISTS "Public Access Video Portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Video Portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Video Portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Video Portfolio" ON storage.objects;

CREATE POLICY "Public Access Video Portfolio" ON storage.objects
FOR SELECT USING (bucket_id = 'video-portfolio');

CREATE POLICY "Public Upload Video Portfolio" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'video-portfolio');

CREATE POLICY "Public Update Video Portfolio" ON storage.objects
FOR UPDATE USING (bucket_id = 'video-portfolio');

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

ALTER TABLE public.video_reels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read video_reels" ON public.video_reels;
DROP POLICY IF EXISTS "Admin All video_reels" ON public.video_reels;

CREATE POLICY "Public Read video_reels" ON public.video_reels FOR SELECT USING (true);
CREATE POLICY "Admin All video_reels" ON public.video_reels FOR ALL USING (true);

-- 4. Add portfolio copy columns to website_copy
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
ADD COLUMN IF NOT EXISTS social_designs JSONB DEFAULT '[]'::jsonb;`;

function AdminVideoPortfolio() {
  const queryClient = useQueryClient();

  // Copy state
  const [copyData, setCopyData] = useState<VideoPortfolioCopy>(DEFAULT_PORTFOLIO_COPY);

  // Reels state
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [editingReel, setEditingReel] = useState<ReelItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Modal Form State
  const [modalForm, setModalForm] = useState<Partial<ReelItem>>({
    titleEn: '',
    titleAr: '',
    categoryEn: 'Viral Campaign',
    categoryAr: 'حملة إبداعية',
    views: '1Million',
    viewCountNum: 1000000,
    likes: '50K',
    shares: '5K',
    posterUrl: '',
    videoUrl: '',
    duration: '0:15',
    clientNameEn: '',
    clientNameAr: '',
    growthDescEn: '',
    growthDescAr: '',
    metaBeforeUrl: '',
    metaAfterUrl: '',
    metaBeforeTagEn: 'Before Sawaqly',
    metaBeforeTagAr: 'قبل سـواقلي',
    metaAfterTagEn: 'After Sawaqly',
    metaAfterTagAr: 'بعد سـواقلي',
    socialDesigns: [],
  });

  // Queries
  const { data: copyRemote, isLoading: isCopyLoading } = useQuery({
    queryKey: ['admin_video_copy'],
    queryFn: fetchVideoPortfolioCopy,
  });

  const { data: reelsRemote, isLoading: isReelsLoading } = useQuery({
    queryKey: ['admin_video_reels'],
    queryFn: fetchVideoReels,
  });

  useEffect(() => {
    if (copyRemote) setCopyData(copyRemote);
  }, [copyRemote]);

  useEffect(() => {
    if (reelsRemote) setReels(reelsRemote);
  }, [reelsRemote]);

  // Save Copy Mutation
  const saveCopyMutation = useMutation({
    mutationFn: saveVideoPortfolioCopy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_video_copy'] });
      queryClient.invalidateQueries({ queryKey: ['video_portfolio_copy'] });
    },
    onError: (err: any) => alert('Failed to save copy: ' + err.message),
  });

  // Save Reels Mutation
  const saveReelsMutation = useMutation({
    mutationFn: saveVideoReels,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_video_reels'] });
      queryClient.invalidateQueries({ queryKey: ['video_portfolio_reels'] });
    },
    onError: (err: any) => alert('Failed to save reels: ' + err.message),
  });

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingReel(null);
    setUploadError(null);
    setModalForm({
      id: `reel-${Date.now()}`,
      titleEn: '',
      titleAr: '',
      categoryEn: 'Viral Campaign',
      categoryAr: 'حملة إبداعية واسعة',
      views: '1Million',
      viewCountNum: 1000000,
      likes: '45K',
      shares: '3.5K',
      posterUrl: '',
      videoUrl: '',
      duration: '0:20',
      clientNameEn: '',
      clientNameAr: '',
      growthDescEn: '',
      growthDescAr: '',
      metaBeforeUrl: '',
      metaAfterUrl: '',
      metaBeforeTagEn: 'Before Sawaqly',
      metaBeforeTagAr: 'قبل سـواقلي',
      metaAfterTagEn: 'After Sawaqly',
      metaAfterTagAr: 'بعد سـواقلي',
      socialDesigns: [],
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (reel: ReelItem) => {
    setEditingReel(reel);
    setUploadError(null);
    setModalForm({ ...reel });
    setIsModalOpen(true);
  };

  // Save Reel from Modal
  const handleSaveModalReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.titleEn || !modalForm.videoUrl) {
      alert('Please provide an English title and Video.');
      return;
    }

    const reelToSave: ReelItem = {
      id: modalForm.id || `reel-${Date.now()}`,
      titleEn: modalForm.titleEn || 'Untitled Reel',
      titleAr: modalForm.titleAr || modalForm.titleEn || 'فيديو جديد',
      categoryEn: modalForm.categoryEn || 'Video',
      categoryAr: modalForm.categoryAr || 'فيديو',
      views: modalForm.views || '1M',
      viewCountNum: Number(modalForm.viewCountNum) || 1000000,
      likes: modalForm.likes || '10K',
      shares: modalForm.shares || '1K',
      posterUrl: modalForm.posterUrl || '',
      videoUrl: modalForm.videoUrl || '',
      duration: modalForm.duration || '0:15',
      clientNameEn: modalForm.clientNameEn || '',
      clientNameAr: modalForm.clientNameAr || '',
      growthDescEn: modalForm.growthDescEn || '',
      growthDescAr: modalForm.growthDescAr || '',
      metaBeforeUrl: modalForm.metaBeforeUrl || '',
      metaAfterUrl: modalForm.metaAfterUrl || '',
      metaBeforeTagEn: modalForm.metaBeforeTagEn || 'Before Sawaqly',
      metaBeforeTagAr: modalForm.metaBeforeTagAr || 'قبل سـواقلي',
      metaAfterTagEn: modalForm.metaAfterTagEn || 'After Sawaqly',
      metaAfterTagAr: modalForm.metaAfterTagAr || 'بعد سـواقلي',
      socialDesigns: modalForm.socialDesigns || [],
    };

    let updatedList: ReelItem[];
    if (editingReel) {
      updatedList = reels.map((r) => (r.id === editingReel.id ? reelToSave : r));
    } else {
      updatedList = [reelToSave, ...reels];
    }

    setReels(updatedList);
    saveReelsMutation.mutate(updatedList);
    setIsModalOpen(false);
  };

  // Delete Reel
  const handleDeleteReel = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video reel?')) return;
    const updatedList = reels.filter((r) => r.id !== id);
    setReels(updatedList);
    await deleteVideoReel(id);
    saveReelsMutation.mutate(updatedList);
  };

  // Move Up / Down
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= reels.length) return;
    const updated = [...reels];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setReels(updated);
    saveReelsMutation.mutate(updated);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SETUP_SNIPPET);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const isLoading = isCopyLoading || isReelsLoading;

  return (
    <div className="reveal in space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy flex items-center gap-3">
            <Video className="text-brand-blue" size={32} /> Video Portfolio
          </h1>
          <p className="text-muted-foreground font-light mt-1">
            Manage showcase video reels hosted on Supabase Storage and configure portfolio copy.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setIsSqlModalOpen(true)}
            className="glass glass-hover inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold cursor-pointer border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
          >
            <Database size={16} /> Supabase SQL Setup
          </button>
          <button
            onClick={handleOpenAdd}
            className="glass glass-tint-blue glass-hover glass-glow inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold cursor-pointer w-fit"
          >
            <Plus size={18} /> Add New Video Reel
          </button>
        </div>
      </div>

      {/* Supabase Storage Status Banner */}
      <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-500/30 bg-emerald-500/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-navy flex items-center gap-2">
              Supabase Storage Bucket: <code className="text-xs bg-emerald-500/15 px-2 py-0.5 rounded text-emerald-700 font-mono">video-portfolio</code>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Reel videos and posters are streamed and hosted on your Supabase Storage CDN.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Supabase CDN Active
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 flex justify-center text-brand-blue">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section 1: Edit Section Copy */}
          <div className="glass glass-strong rounded-3xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-navy mb-6 flex items-center gap-2">
              Section Headlines & CTA Text
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Title EN */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Section Title (English)</label>
                <input
                  type="text"
                  value={copyData.portfolio_title_en}
                  onChange={(e) => setCopyData({ ...copyData, portfolio_title_en: e.target.value })}
                  className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
                  placeholder="The Product Behind Millions Of Views"
                />
              </div>

              {/* Title AR */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Section Title (Arabic)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={copyData.portfolio_title_ar}
                  onChange={(e) => setCopyData({ ...copyData, portfolio_title_ar: e.target.value })}
                  className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
                  placeholder="المنتج الخفي وراء ملايين المشاهدات"
                />
              </div>

              {/* Subtitle EN */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Subtitle (English)</label>
                <textarea
                  rows={2}
                  value={copyData.portfolio_sub_en}
                  onChange={(e) => setCopyData({ ...copyData, portfolio_sub_en: e.target.value })}
                  className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
                  placeholder="Over 12M User On Social Media. Everyone's Talking About It."
                />
              </div>

              {/* Subtitle AR */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Subtitle (Arabic)</label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={copyData.portfolio_sub_ar}
                  onChange={(e) => setCopyData({ ...copyData, portfolio_sub_ar: e.target.value })}
                  className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
                  placeholder="أكثر من 12 مليون شخص يتحدثون عن هذا المحتوى."
                />
              </div>

              {/* CTA EN */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Explore Button Text (English)</label>
                <input
                  type="text"
                  value={copyData.portfolio_cta_en}
                  onChange={(e) => setCopyData({ ...copyData, portfolio_cta_en: e.target.value })}
                  className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
                  placeholder="Explore Now"
                />
              </div>

              {/* CTA AR */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Explore Button Text (Arabic)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={copyData.portfolio_cta_ar}
                  onChange={(e) => setCopyData({ ...copyData, portfolio_cta_ar: e.target.value })}
                  className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
                  placeholder="استكشف الآن"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => saveCopyMutation.mutate(copyData)}
                disabled={saveCopyMutation.isPending}
                className="glass glass-tint-blue glass-hover glass-glow inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer disabled:opacity-50"
              >
                {saveCopyMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Save Section Copy
              </button>
            </div>
          </div>

          {/* Section 2: Manage Video Reels */}
          <div className="glass glass-strong rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                  <Play className="text-brand-yellow" size={20} /> Showcase Video Reels ({reels.length})
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Reels are displayed in the carousel. Drag or use arrows to reorder.
                </p>
              </div>
            </div>

            {/* List of Reels */}
            <div className="grid gap-4">
              {reels.map((reel, index) => {
                const isSupabaseHosted = reel.videoUrl?.includes('supabase.co');
                return (
                  <div
                    key={reel.id}
                    className="glass rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {/* Thumbnail */}
                      <div className="relative w-16 aspect-[9/16] rounded-xl overflow-hidden bg-black shrink-0 border border-white/20">
                        {reel.posterUrl ? (
                          <img src={reel.posterUrl} alt={reel.titleEn} className="w-full h-full object-cover" />
                        ) : reel.videoUrl ? (
                          <video src={reel.videoUrl} className="w-full h-full object-cover" muted preload="metadata" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Video size={20} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                          <Play size={14} className="text-white fill-white" />
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-base text-navy">{reel.titleEn}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue font-semibold">
                            {reel.categoryEn}
                          </span>
                          {isSupabaseHosted && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 font-semibold border border-emerald-500/30 flex items-center gap-1">
                              ⚡ Supabase
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-arabic">{reel.titleAr}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                          <span className="flex items-center gap-1">
                            <Eye size={12} /> {reel.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={12} /> {reel.likes}
                          </span>
                          <span>⏱️ {reel.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="glass p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <MoveUp size={16} />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === reels.length - 1}
                        className="glass p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <MoveDown size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(reel)}
                        className="glass glass-hover p-2.5 rounded-xl text-brand-blue hover:bg-brand-blue/10 cursor-pointer"
                        title="Edit Video Reel"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteReel(reel.id)}
                        className="glass p-2.5 rounded-xl text-destructive hover:bg-destructive/10 cursor-pointer transition-colors"
                        title="Delete Video Reel"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {reels.length === 0 && (
                <div className="p-12 text-center text-muted-foreground glass rounded-2xl">
                  No video reels added yet. Click "Add New Video Reel" to create one.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Add / Edit Reel */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass glass-strong rounded-3xl w-full max-w-2xl p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto my-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 glass p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
              {editingReel ? 'Edit Video Reel' : 'Add New Video Reel'}
            </h2>

            {uploadError && (
              <div className="p-3 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-sm">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleSaveModalReel} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={modalForm.titleEn || ''}
                    onChange={(e) => setModalForm({ ...modalForm, titleEn: e.target.value })}
                    className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
                    placeholder="e.g. Athletic Conditioning & Form"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Title (Arabic)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={modalForm.titleAr || ''}
                    onChange={(e) => setModalForm({ ...modalForm, titleAr: e.target.value })}
                    className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
                    placeholder="تدريب اللياقة البدنية"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Category (English)</label>
                  <input
                    type="text"
                    value={modalForm.categoryEn || ''}
                    onChange={(e) => setModalForm({ ...modalForm, categoryEn: e.target.value })}
                    className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
                    placeholder="e.g. Viral Campaign"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Category (Arabic)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={modalForm.categoryAr || ''}
                    onChange={(e) => setModalForm({ ...modalForm, categoryAr: e.target.value })}
                    className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
                    placeholder="حملة إبداعية واسعة"
                  />
                </div>
              </div>

              {/* POSTER UPLOAD / URL */}
              <div className="border border-white/10 rounded-2xl p-4 bg-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-brand-blue" />
                    Poster Thumbnail (Optional)
                  </span>
                  {modalForm.posterUrl?.includes('supabase.co') && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 font-medium">
                      ⚡ Supabase Hosted
                    </span>
                  )}
                </div>
                <ImageUploader
                  value={modalForm.posterUrl || ''}
                  onChange={(url) => setModalForm(prev => ({ ...prev, posterUrl: url }))}
                  placeholder="Optional: upload poster image or leave empty to use video frame..."
                />
              </div>

              {/* VIDEO UPLOAD / URL */}
              <div className="border border-white/10 rounded-2xl p-4 bg-white/5">
                <VideoUploader
                  value={modalForm.videoUrl || ''}
                  onChange={(url) => setModalForm(prev => ({ ...prev, videoUrl: url }))}
                  onPosterAutoGenerated={(autoPosterUrl) => {
                    setModalForm(prev => {
                      if (!prev.posterUrl) {
                        return { ...prev, posterUrl: autoPosterUrl };
                      }
                      return prev;
                    });
                  }}
                  aspect="9/16"
                  showAspectSelector={false}
                  label="Reel Video (Direct Upload or Link) *"
                />
              </div>

              {/* Stats & Meta */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Views Label</label>
                  <input
                    type="text"
                    value={modalForm.views || ''}
                    onChange={(e) => setModalForm({ ...modalForm, views: e.target.value })}
                    className="glass-input w-full rounded-xl px-3 py-2 text-sm"
                    placeholder="1Million"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Likes Label</label>
                  <input
                    type="text"
                    value={modalForm.likes || ''}
                    onChange={(e) => setModalForm({ ...modalForm, likes: e.target.value })}
                    className="glass-input w-full rounded-xl px-3 py-2 text-sm"
                    placeholder="8.4M"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Shares Label</label>
                  <input
                    type="text"
                    value={modalForm.shares || ''}
                    onChange={(e) => setModalForm({ ...modalForm, shares: e.target.value })}
                    className="glass-input w-full rounded-xl px-3 py-2 text-sm"
                    placeholder="940K"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Duration</label>
                  <input
                    type="text"
                    value={modalForm.duration || ''}
                    onChange={(e) => setModalForm({ ...modalForm, duration: e.target.value })}
                    className="glass-input w-full rounded-xl px-3 py-2 text-sm"
                    placeholder="0:15"
                  />
                </div>
              </div>

              {/* ─── CLIENT CASE STUDY: CLIENT NAME & GROWTH STORY ─── */}
              <div className="border border-white/10 rounded-2xl p-4 bg-white/5 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-brand-yellow" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">
                    Client Case Study Details
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Client Name (English)
                    </label>
                    <input
                      type="text"
                      value={modalForm.clientNameEn || ''}
                      onChange={(e) => setModalForm({ ...modalForm, clientNameEn: e.target.value })}
                      className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
                      placeholder="e.g. Souq El Gomla"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Client Name (Arabic)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={modalForm.clientNameAr || ''}
                      onChange={(e) => setModalForm({ ...modalForm, clientNameAr: e.target.value })}
                      className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
                      placeholder="سوق الجملة"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    How We Improved Client Numbers (English Description)
                  </label>
                  <textarea
                    rows={3}
                    value={modalForm.growthDescEn || ''}
                    onChange={(e) => setModalForm({ ...modalForm, growthDescEn: e.target.value })}
                    className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
                    placeholder="Describe the campaign strategy, creative hooks, and revenue/customer improvement..."
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    How We Improved Client Numbers (Arabic Description)
                  </label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={modalForm.growthDescAr || ''}
                    onChange={(e) => setModalForm({ ...modalForm, growthDescAr: e.target.value })}
                    className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
                    placeholder="اشرح استراتيجية الإعلانات ومضاعفة المبيعات وقاعدة العملاء..."
                  />
                </div>
              </div>

              {/* ─── META PERFORMANCE (BEFORE & AFTER PHOTOS) ─── */}
              <div className="border border-white/10 rounded-2xl p-4 bg-white/5 space-y-4">
                <div className="flex items-center gap-2">
                  <ImageIcon size={16} className="text-brand-blue" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">
                    Meta Performance (Before & After Photos)
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Before Photo */}
                  <div className="space-y-2 border border-white/10 rounded-xl p-3 bg-white/[0.02]">
                    <label className="text-xs font-bold text-rose-400 block uppercase tracking-wide">
                      Before Meta Screenshot
                    </label>
                    <ImageUploader
                      value={modalForm.metaBeforeUrl || ''}
                      onChange={(url) => setModalForm(prev => ({ ...prev, metaBeforeUrl: url }))}
                      placeholder="Upload or paste Before screenshot URL..."
                    />
                    <input
                      type="text"
                      value={modalForm.metaBeforeTagEn || ''}
                      onChange={(e) => setModalForm({ ...modalForm, metaBeforeTagEn: e.target.value })}
                      className="glass-input w-full rounded-lg px-3 py-1.5 text-xs mt-2"
                      placeholder="Tag EN: Before Sawaqly (0.9x ROAS)"
                    />
                    <input
                      type="text"
                      dir="rtl"
                      value={modalForm.metaBeforeTagAr || ''}
                      onChange={(e) => setModalForm({ ...modalForm, metaBeforeTagAr: e.target.value })}
                      className="glass-input w-full rounded-lg px-3 py-1.5 text-xs mt-1"
                      placeholder="Tag AR: قبل سـواقلي (0.9x عائد)"
                    />
                  </div>

                  {/* After Photo */}
                  <div className="space-y-2 border border-white/10 rounded-xl p-3 bg-white/[0.02]">
                    <label className="text-xs font-bold text-emerald-400 block uppercase tracking-wide">
                      After Meta Screenshot
                    </label>
                    <ImageUploader
                      value={modalForm.metaAfterUrl || ''}
                      onChange={(url) => setModalForm(prev => ({ ...prev, metaAfterUrl: url }))}
                      placeholder="Upload or paste After screenshot URL..."
                    />
                    <input
                      type="text"
                      value={modalForm.metaAfterTagEn || ''}
                      onChange={(e) => setModalForm({ ...modalForm, metaAfterTagEn: e.target.value })}
                      className="glass-input w-full rounded-lg px-3 py-1.5 text-xs mt-2"
                      placeholder="Tag EN: After Sawaqly (4.8x ROAS)"
                    />
                    <input
                      type="text"
                      dir="rtl"
                      value={modalForm.metaAfterTagAr || ''}
                      onChange={(e) => setModalForm({ ...modalForm, metaAfterTagAr: e.target.value })}
                      className="glass-input w-full rounded-lg px-3 py-1.5 text-xs mt-1"
                      placeholder="Tag AR: بعد سـواقلي (4.8x عائد)"
                    />
                  </div>
                </div>
              </div>

              {/* ─── SOCIAL MEDIA DESIGNS PLACE ─── */}
              <div className="border border-white/10 rounded-2xl p-4 bg-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={16} className="text-brand-yellow" />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">
                      Social Media Designs for this Client
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {(modalForm.socialDesigns || []).length} designs
                  </span>
                </div>

                {/* Quick Add Design Input */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground block">
                    Add a Social Media Design (1080x1350 Portrait recommended — Upload or Image URL)
                  </label>
                  <ImageUploader
                    value=""
                    onChange={(url) => {
                      if (!url) return;
                      const newDesign = {
                        id: `sd-${Date.now()}`,
                        url,
                        titleEn: 'Social Media Design',
                        titleAr: 'تصميم سوشيال ميديا',
                      };
                      setModalForm((prev) => ({
                        ...prev,
                        socialDesigns: [...(prev.socialDesigns || []), newDesign],
                      }));
                    }}
                    placeholder="Upload or paste image URL to add to client's social media designs (1080x1350)..."
                  />
                </div>

                {/* List of existing social designs with customizations */}
                {(modalForm.socialDesigns || []).length > 0 && (
                  <div className="space-y-4 pt-2">
                    {(modalForm.socialDesigns || []).map((design, idx) => (
                      <div
                        key={design.id || idx}
                        className="rounded-2xl p-4 glass border border-white/15 bg-black/30 space-y-3.5 transition-all"
                      >
                        {/* Header: Photo thumbnail & Remove button */}
                        <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-12 aspect-[1080/1350] rounded-lg overflow-hidden border border-white/20 shrink-0 bg-black/60 shadow-md">
                              <img src={design.url} alt="Design preview" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">
                                Post #{idx + 1}
                              </span>
                              <span className="text-[11px] text-brand-blue font-medium">
                                1080 × 1350 Creative
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setModalForm((prev) => ({
                                ...prev,
                                socialDesigns: (prev.socialDesigns || []).filter((_, i) => i !== idx),
                              }));
                            }}
                            aria-label="Remove design"
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors cursor-pointer border border-rose-500/20 flex items-center gap-1 text-xs"
                            title="Delete this design post"
                          >
                            <Trash2 size={13} />
                            <span>Remove</span>
                          </button>
                        </div>

                        {/* Page Logo & Like Count */}
                        <div className="grid sm:grid-cols-2 gap-3">
                          {/* Page Logo */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                              <span>Page Logo (Avatar)</span>
                              {design.pageLogoUrl && (
                                <img
                                  src={design.pageLogoUrl}
                                  alt="Logo"
                                  className="w-4 h-4 rounded-full object-cover border border-white/20 inline-block"
                                />
                              )}
                            </label>
                            <ImageUploader
                              value={design.pageLogoUrl || ''}
                              onChange={(url) => {
                                const updated = [...(modalForm.socialDesigns || [])];
                                updated[idx] = { ...updated[idx], pageLogoUrl: url };
                                setModalForm({ ...modalForm, socialDesigns: updated });
                              }}
                              placeholder="Upload or paste page logo URL..."
                            />
                          </div>

                          {/* Like Count */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                              <Heart size={12} className="text-rose-400" />
                              <span>Like Count (e.g. 2,450 or 15K)</span>
                            </label>
                            <input
                              type="text"
                              value={design.likesCount ?? ''}
                              onChange={(e) => {
                                const updated = [...(modalForm.socialDesigns || [])];
                                updated[idx] = { ...updated[idx], likesCount: e.target.value };
                                setModalForm({ ...modalForm, socialDesigns: updated });
                              }}
                              className="glass-input w-full rounded-xl px-3 py-2 text-xs"
                              placeholder="e.g. 2,840"
                            />
                          </div>
                        </div>

                        {/* Post Caption (English & Arabic) */}
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-muted-foreground block">
                              Post Caption (English)
                            </label>
                            <textarea
                              rows={2}
                              value={design.captionEn || ''}
                              onChange={(e) => {
                                const updated = [...(modalForm.socialDesigns || [])];
                                updated[idx] = { ...updated[idx], captionEn: e.target.value };
                                setModalForm({ ...modalForm, socialDesigns: updated });
                              }}
                              className="glass-input w-full rounded-xl px-3 py-2 text-xs resize-none"
                              placeholder="Write engaging caption for this creative post..."
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-muted-foreground block">
                              Post Caption (Arabic)
                            </label>
                            <textarea
                              rows={2}
                              dir="rtl"
                              value={design.captionAr || ''}
                              onChange={(e) => {
                                const updated = [...(modalForm.socialDesigns || [])];
                                updated[idx] = { ...updated[idx], captionAr: e.target.value };
                                setModalForm({ ...modalForm, socialDesigns: updated });
                              }}
                              className="glass-input w-full rounded-xl px-3 py-2 text-xs resize-none font-arabic"
                              placeholder="اكتب كابشن جذاب لهذا البوست باللغة العربية..."
                            />
                          </div>
                        </div>

                        {/* Optional Title (EN & AR) */}
                        <div className="grid sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={design.titleEn || ''}
                            onChange={(e) => {
                              const updated = [...(modalForm.socialDesigns || [])];
                              updated[idx] = { ...updated[idx], titleEn: e.target.value };
                              setModalForm({ ...modalForm, socialDesigns: updated });
                            }}
                            className="glass-input w-full rounded-lg px-3 py-1.5 text-xs"
                            placeholder="Design title EN (optional)"
                          />
                          <input
                            type="text"
                            dir="rtl"
                            value={design.titleAr || ''}
                            onChange={(e) => {
                              const updated = [...(modalForm.socialDesigns || [])];
                              updated[idx] = { ...updated[idx], titleAr: e.target.value };
                              setModalForm({ ...modalForm, socialDesigns: updated });
                            }}
                            className="glass-input w-full rounded-lg px-3 py-1.5 text-xs font-arabic"
                            placeholder="عنوان التصميم بالعربية (اختياري)"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="glass px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveReelsMutation.isPending}
                  className="glass glass-tint-blue glass-hover glass-glow px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saveReelsMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  {editingReel ? 'Update Reel' : 'Add Reel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SQL Setup Modal */}
      {isSqlModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass glass-strong rounded-3xl w-full max-w-2xl p-6 md:p-8 space-y-5 relative max-h-[90vh] overflow-y-auto my-auto">
            <button
              onClick={() => setIsSqlModalOpen(false)}
              className="absolute top-6 right-6 glass p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            <div>
              <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
                <Database className="text-emerald-600" size={24} /> Supabase Database & Storage Setup
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Run this SQL script in your Supabase project to enable RLS upload policies, create the <code>video_reels</code> table, and add copy columns.
              </p>
            </div>

            <div className="relative">
              <pre className="p-4 rounded-xl bg-black/70 text-emerald-400 font-mono text-xs overflow-x-auto max-h-72 border border-white/10">
                {SQL_SETUP_SNIPPET}
              </pre>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <a
                href="https://supabase.com/dashboard/project/folocnkupniuqrzbfqpr/sql/new"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-brand-blue hover:underline"
              >
                Open Supabase SQL Editor <ExternalLink size={12} />
              </a>
              <button
                onClick={handleCopySql}
                className="glass glass-tint-blue glass-hover glass-glow px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
              >
                {copiedSql ? <CheckCheck size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
