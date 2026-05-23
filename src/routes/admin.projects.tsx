import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Loader2, GripVertical, Edit2, Check, X as XIcon, Image } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const Route = createFileRoute('/admin/projects')({
  component: AdminProjects,
});

// ─── Sortable Project Item ─────────────────────────────────────────────────────
function SortableProjectItem({ project, onEdit, onDelete, isDeleting, isEditing }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass rounded-2xl p-4 flex items-center justify-between group transition-colors hover:bg-white/5 ${isDragging ? 'opacity-90 scale-[1.02] shadow-2xl glass-strong' : ''} ${isEditing ? 'border-brand-yellow/50' : ''}`}
    >
      <div className="flex items-center gap-4 overflow-hidden">
        <div {...attributes} {...listeners} className="text-muted-foreground/40 hover:text-brand-blue cursor-grab active:cursor-grabbing p-1 touch-none shrink-0">
          <GripVertical size={18} />
        </div>
        {project.image_url ? (
          <img src={project.image_url} alt={project.title_en} className="w-14 h-10 object-cover rounded-xl border border-white/10 shrink-0" />
        ) : (
          <div className="w-14 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
            <Image size={16} className="text-muted-foreground/40" />
          </div>
        )}
        <div className="overflow-hidden">
          <div className="font-semibold text-navy text-sm truncate">{project.title_en}</div>
          <div className="text-xs text-muted-foreground truncate">{project.description_en}</div>
        </div>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
        <button onClick={() => onEdit(project)} className="p-1.5 glass-hover rounded-lg text-brand-blue" aria-label="Edit"><Edit2 size={14} /></button>
        <button onClick={() => onDelete(project.id)} disabled={isDeleting} className="p-1.5 glass-hover rounded-lg text-destructive" aria-label="Delete">
          {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
function AdminProjects() {
  const queryClient = useQueryClient();

  // ── Project state ──
  const emptyProject = { title_en: '', title_ar: '', description_en: '', description_ar: '', image_url: '', link_url: '', service_id: '' };
  const [projForm, setProjForm] = useState(emptyProject);
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ── Queries ──
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('id, title, title_ar').order('sort_order', { ascending: true, nullsFirst: false }).order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  } as any);

  const { data: allProjects = [], isLoading: projsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true, nullsFirst: false }).order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const filteredProjects = selectedServiceId
    ? allProjects.filter((p: any) => p.service_id === selectedServiceId)
    : allProjects;

  // ── Project Mutations ──
  const addProjMutation = useMutation({
    mutationFn: async (d: typeof projForm) => {
      const { error } = await supabase.from('projects').insert([{ ...d, sort_order: filteredProjects.length }]);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); setProjForm({ ...emptyProject, service_id: projForm.service_id }); },
  });

  const updateProjMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof projForm }) => {
      const { error } = await supabase.from('projects').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); setProjForm({ ...emptyProject, service_id: projForm.service_id }); setEditingProjId(null); },
  });

  const deleteProjMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  const reorderProjMutation = useMutation({
    mutationFn: async (updates: { id: string; sort_order: number }[]) => {
      await Promise.all(updates.map(u => supabase.from('projects').update({ sort_order: u.sort_order }).eq('id', u.id)));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  // ── Handlers ──
  const handleSaveProj = () => {
    if (!projForm.title_en) return;
    if (editingProjId) updateProjMutation.mutate({ id: editingProjId, data: projForm });
    else addProjMutation.mutate(projForm);
  };

  const handleEditProj = (proj: any) => {
    setEditingProjId(proj.id);
    setProjForm({
      title_en: proj.title_en || '', title_ar: proj.title_ar || '',
      description_en: proj.description_en || '', description_ar: proj.description_ar || '',
      image_url: proj.image_url || '', link_url: proj.link_url || '',
      service_id: proj.service_id || '',
    });
  };

  const handleDragEndProj = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = filteredProjects.findIndex((p: any) => p.id === active.id);
      const newIdx = filteredProjects.findIndex((p: any) => p.id === over.id);
      const reordered = arrayMove(filteredProjects, oldIdx, newIdx);
      const merged = allProjects.map((p: any) => {
        const found = reordered.findIndex((r: any) => r.id === p.id);
        return found !== -1 ? { ...p, sort_order: found } : p;
      });
      queryClient.setQueryData(['projects'], merged);
      reorderProjMutation.mutate(reordered.map((item: any, index: number) => ({ id: item.id, sort_order: index })));
    }
  };

  const handleSelectService = (id: string | null) => {
    setSelectedServiceId(id);
    setEditingProjId(null);
    setProjForm({ ...emptyProject, service_id: id || '' });
  };

  return (
    <div className="reveal in space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Projects</h1>
        <p className="text-muted-foreground font-light mt-1">Manage projects, organized by service category.</p>
      </div>

      {/* ── PROJECTS SECTION ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass glass-strong rounded-3xl p-6">
          <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
            <h2 className="font-semibold text-lg shrink-0">
              {selectedServiceId
                ? <>Projects in: <span className="text-brand-blue">{services.find((s: any) => s.id === selectedServiceId)?.title || ''}</span></>
                : 'All Projects'
              }
            </h2>
            {/* Service filter tabs */}
            {!servicesLoading && services.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => handleSelectService(null)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${selectedServiceId === null ? 'bg-brand-blue text-white' : 'glass-hover text-muted-foreground hover:text-foreground glass'}`}
                >
                  All
                </button>
                {services.map((s: any) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectService(s.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${selectedServiceId === s.id ? 'bg-brand-blue text-white' : 'glass-hover text-muted-foreground hover:text-foreground glass'}`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            {projsLoading ? (
              <div className="p-8 flex justify-center text-brand-blue"><Loader2 className="animate-spin" size={24} /></div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndProj}>
                <SortableContext items={filteredProjects.map((p: any) => p.id)} strategy={verticalListSortingStrategy}>
                  {filteredProjects.map((p: any) => (
                    <SortableProjectItem
                      key={p.id} project={p}
                      onEdit={handleEditProj}
                      onDelete={(id: string) => deleteProjMutation.mutate(id)}
                      isDeleting={deleteProjMutation.isPending && deleteProjMutation.variables === p.id}
                      isEditing={editingProjId === p.id}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
            {!projsLoading && filteredProjects.length === 0 && (
              <div className="text-center py-6 text-muted-foreground text-sm">No projects yet. Add one on the right.</div>
            )}
          </div>
        </div>

        {/* ── Add / Edit Form ── */}
        <div className="glass glass-strong rounded-3xl p-6 h-fit sticky top-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">{editingProjId ? 'Edit Project' : 'Add Project'}</h2>
            {editingProjId && <button onClick={() => { setEditingProjId(null); setProjForm({ ...emptyProject, service_id: projForm.service_id }); }} className="text-muted-foreground hover:text-foreground p-1"><XIcon size={18} /></button>}
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Service Category</label>
              <select
                value={projForm.service_id}
                onChange={e => { setProjForm({ ...projForm, service_id: e.target.value }); setSelectedServiceId(e.target.value || null); }}
                className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
              >
                <option value="" className="bg-black text-white">No category</option>
                {services.map((s: any) => (
                  <option key={s.id} value={s.id} className="bg-black text-white">{s.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title (EN)</label>
              <input value={projForm.title_en} onChange={e => setProjForm({ ...projForm, title_en: e.target.value })} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="Project title" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title (AR)</label>
              <input value={projForm.title_ar} onChange={e => setProjForm({ ...projForm, title_ar: e.target.value })} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm text-right" dir="rtl" placeholder="عنوان المشروع" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description (EN)</label>
              <textarea value={projForm.description_en} onChange={e => setProjForm({ ...projForm, description_en: e.target.value })} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" rows={2} placeholder="Brief description..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description (AR)</label>
              <textarea value={projForm.description_ar} onChange={e => setProjForm({ ...projForm, description_ar: e.target.value })} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm text-right" dir="rtl" rows={2} placeholder="وصف موجز..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Image URL</label>
              <input value={projForm.image_url} onChange={e => setProjForm({ ...projForm, image_url: e.target.value })} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="https://..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Link URL (optional)</label>
              <input value={projForm.link_url} onChange={e => setProjForm({ ...projForm, link_url: e.target.value })} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="https://..." />
            </div>
            <button
              onClick={handleSaveProj}
              disabled={addProjMutation.isPending || updateProjMutation.isPending || !projForm.title_en}
              className={`glass glass-hover glass-glow w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold mt-1 disabled:opacity-50 ${editingProjId ? 'glass-tint-yellow text-navy' : 'glass-tint-blue'}`}
              style={editingProjId ? { background: 'color-mix(in oklab, var(--brand-yellow) 80%, transparent)' } : {}}
            >
              {(addProjMutation.isPending || updateProjMutation.isPending) ? <Loader2 size={16} className="animate-spin" /> : editingProjId ? <Check size={16} /> : <Plus size={16} />}
              {editingProjId ? 'Save Project' : 'Add Project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
