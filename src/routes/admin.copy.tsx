import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Route = createFileRoute('/admin/copy')({
  component: AdminCopy,
});

function AdminCopy() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    hero_sub_en: '',
    hero_sub_ar: '',
    services_title_en: '',
    services_title_ar: '',
    services_sub_en: '',
    services_sub_ar: '',
    contact_title_en: '',
    contact_title_ar: '',
    contact_sub_en: '',
    contact_sub_ar: '',
    footer_tagline_en: '',
    footer_tagline_ar: '',
    projects_title_en: '',
    projects_title_ar: '',
    projects_sub_en: '',
    projects_sub_ar: '',
  });

  const { data: copy, isLoading } = useQuery({
    queryKey: ['website_copy'],
    queryFn: async () => {
      const { data, error } = await supabase.from('website_copy').select('*').eq('id', 1).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  useEffect(() => {
    if (copy) {
      setFormData({
        hero_sub_en: copy.hero_sub_en || '',
        hero_sub_ar: copy.hero_sub_ar || '',
        services_title_en: copy.services_title_en || '',
        services_title_ar: copy.services_title_ar || '',
        services_sub_en: copy.services_sub_en || '',
        services_sub_ar: copy.services_sub_ar || '',
        contact_title_en: copy.contact_title_en || '',
        contact_title_ar: copy.contact_title_ar || '',
        contact_sub_en: copy.contact_sub_en || '',
        contact_sub_ar: copy.contact_sub_ar || '',
        footer_tagline_en: copy.footer_tagline_en || '',
        footer_tagline_ar: copy.footer_tagline_ar || '',
        projects_title_en: copy.projects_title_en || '',
        projects_title_ar: copy.projects_title_ar || '',
        projects_sub_en: copy.projects_sub_en || '',
        projects_sub_ar: copy.projects_sub_ar || '',
      });
    }
  }, [copy]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('website_copy').update(data).eq('id', 1);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website_copy'] });
    },
    onError: (err: any) => {
      alert("Failed to save: " + err.message);
    }
  });

  const handleSave = () => saveMutation.mutate(formData);

  const Field = ({ label, field, textarea }: { label: string; field: keyof typeof formData; textarea?: boolean }) => (
    <div>
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      {textarea ? (
        <textarea
          value={formData[field]}
          onChange={e => setFormData({ ...formData, [field]: e.target.value })}
          rows={3}
          className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
        />
      ) : (
        <input
          value={formData[field]}
          onChange={e => setFormData({ ...formData, [field]: e.target.value })}
          className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
        />
      )}
    </div>
  );

  const SaveBtn = () => (
    <button
      onClick={handleSave}
      disabled={saveMutation.isPending}
      className="glass glass-tint-blue glass-hover glass-glow w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold mt-4 disabled:opacity-50"
    >
      {saveMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
      Save Copy
    </button>
  );

  return (
    <div className="reveal in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-navy">Website Copy</h1>
        <p className="text-muted-foreground font-light mt-1">Edit all bilingual text displayed on the website.</p>
      </div>

      {isLoading ? (
        <div className="p-12 flex justify-center text-brand-blue"><Loader2 className="animate-spin" size={28} /></div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Hero Section */}
          <div className="glass glass-strong rounded-3xl p-6 h-fit">
            <h2 className="font-semibold mb-4 text-lg">Hero Section</h2>
            <div className="space-y-4">
              <Field label="Sub-headline (English)" field="hero_sub_en" textarea />
              <Field label="Sub-headline (Arabic)" field="hero_sub_ar" textarea />
              <SaveBtn />
            </div>
          </div>

          {/* Services Section */}
          <div className="glass glass-strong rounded-3xl p-6 h-fit">
            <h2 className="font-semibold mb-4 text-lg">Services Section</h2>
            <div className="space-y-4">
              <Field label="Headline (English)" field="services_title_en" />
              <Field label="Headline (Arabic)" field="services_title_ar" />
              <Field label="Sub-headline (English)" field="services_sub_en" textarea />
              <Field label="Sub-headline (Arabic)" field="services_sub_ar" textarea />
              <SaveBtn />
            </div>
          </div>

          {/* Contact Section */}
          <div className="glass glass-strong rounded-3xl p-6 h-fit">
            <h2 className="font-semibold mb-4 text-lg">Contact Section</h2>
            <div className="space-y-4">
              <Field label="Headline (English)" field="contact_title_en" />
              <Field label="Headline (Arabic)" field="contact_title_ar" />
              <Field label="Sub-headline (English)" field="contact_sub_en" textarea />
              <Field label="Sub-headline (Arabic)" field="contact_sub_ar" textarea />
              <SaveBtn />
            </div>
          </div>

          {/* Projects Section */}
          <div className="glass glass-strong rounded-3xl p-6 h-fit">
            <h2 className="font-semibold mb-4 text-lg">Projects Section</h2>
            <div className="space-y-4">
              <Field label="Headline (English)" field="projects_title_en" />
              <Field label="Headline (Arabic)" field="projects_title_ar" />
              <Field label="Sub-headline (English)" field="projects_sub_en" textarea />
              <Field label="Sub-headline (Arabic)" field="projects_sub_ar" textarea />
              <SaveBtn />
            </div>
          </div>

          {/* Footer */}
          <div className="glass glass-strong rounded-3xl p-6 h-fit">
            <h2 className="font-semibold mb-4 text-lg">Footer</h2>
            <div className="space-y-4">
              <Field label="Tagline (English)" field="footer_tagline_en" textarea />
              <Field label="Tagline (Arabic)" field="footer_tagline_ar" textarea />
              <SaveBtn />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
