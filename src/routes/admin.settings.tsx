import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettings,
});

function AdminSettings() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    office_name: '',
    office_location: '',
    office_hours: '',
    map_share_url: '',
    map_embed_url: ''
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site_settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || { office_name: 'Sawaqly HQ', office_location: 'Cairo, Egypt', office_hours: 'Mon–Fri 9–6', map_share_url: 'https://maps.google.com/?q=Cairo,Egypt', map_embed_url: 'https://www.google.com/maps?q=Cairo,Egypt&output=embed' };
    }
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        office_name: settings.office_name || 'Sawaqly HQ',
        office_location: settings.office_location || 'Cairo, Egypt',
        office_hours: settings.office_hours || 'Mon–Fri 9–6',
        map_share_url: settings.map_share_url || 'https://maps.google.com/?q=Cairo,Egypt',
        map_embed_url: settings.map_embed_url || 'https://www.google.com/maps?q=Cairo,Egypt&output=embed'
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('site_settings').update(data).eq('id', 1);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
    },
    onError: (err: any) => {
      console.error("Save error:", err);
      alert("Failed to save: " + err.message);
    }
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  return (
    <div className="reveal in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy">Site Settings</h1>
          <p className="text-muted-foreground font-light mt-1">Manage global website configurations.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass glass-strong rounded-3xl p-6 h-fit">
          <h2 className="font-semibold mb-4 text-lg">Office & Map Information</h2>
          {isLoading ? (
            <div className="p-8 flex justify-center text-brand-blue"><Loader2 className="animate-spin" size={24} /></div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Office Name</label>
                <input value={formData.office_name} onChange={e => setFormData({...formData, office_name: e.target.value})} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="e.g. Sawaqly HQ" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Location Text</label>
                <input value={formData.office_location} onChange={e => setFormData({...formData, office_location: e.target.value})} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="e.g. Cairo, Egypt" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Operating Hours</label>
                <input value={formData.office_hours} onChange={e => setFormData({...formData, office_hours: e.target.value})} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="e.g. Mon–Fri 9–6" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Google Maps Embed URL</label>
                <input value={formData.map_embed_url} onChange={e => setFormData({...formData, map_embed_url: e.target.value})} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="https://www.google.com/maps/embed?pb=..." />
                <p className="text-xs text-muted-foreground mt-1">Paste the "src" link from Google Maps "Embed a map" feature.</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Google Maps Share Link</label>
                <input value={formData.map_share_url} onChange={e => setFormData({...formData, map_share_url: e.target.value})} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="https://maps.app.goo.gl/..." />
                <p className="text-xs text-muted-foreground mt-1">Paste the standard "Share" link for the "Open in Google Maps" button.</p>
              </div>
              
              <button 
                onClick={handleSave} 
                disabled={saveMutation.isPending}
                className="glass glass-tint-blue glass-hover glass-glow w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold mt-4 disabled:opacity-50"
              >
                {saveMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Save Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
