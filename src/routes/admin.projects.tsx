import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Loader2, GripVertical, Edit2, Check, X as XIcon, Image, ArrowUp, ArrowDown, Type, Video, LayoutList } from 'lucide-react';
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
  type Block = { id: string; type: 'text' | 'image' | 'video'; text_en?: string; text_ar?: string; url?: string; aspect?: 'auto' | '16/9' | '9/16' | '1/1' | '4/3'; };
  const emptyProject = { title_en: '', title_ar: '', description_en: '', description_ar: '', image_url: '', link_url: '', service_id: '', content_blocks: [] as Block[] };
  const [projForm, setProjForm] = useState(emptyProject);
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ── Queries ──
  const { data: services = [], isLoading: servicesLoading } = useQuery<any[]>({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('id, title, title_ar').order('sort_order', { ascending: true, nullsFirst: false }).order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
      setProjForm({ ...emptyProject, service_id: projForm.service_id });
      setEditingProjId(null);
    },
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
    const blocks = Array.isArray(projForm.content_blocks) ? projForm.content_blocks : [];
    const cleanedBlocks = blocks.filter(b => {
      if (b.type === 'image') return Boolean(b.url && b.url.trim());
      if (b.type === 'video') return Boolean(b.url && b.url.trim());
      if (b.type === 'text') return Boolean((b.text_en && b.text_en.trim()) || (b.text_ar && b.text_ar.trim()));
      return true;
    });
    const cleanedData = {
      ...projForm,
      image_url: (projForm.image_url || '').trim(),
      content_blocks: cleanedBlocks,
    };
    if (editingProjId) updateProjMutation.mutate({ id: editingProjId, data: cleanedData });
    else addProjMutation.mutate(cleanedData);
  };

  const handleEditProj = (proj: any) => {
    setEditingProjId(proj.id);
    const rawBlocks = proj.content_blocks;
    const parsedBlocks = Array.isArray(rawBlocks)
      ? rawBlocks
      : typeof rawBlocks === 'string'
      ? (() => { try { return JSON.parse(rawBlocks); } catch { return []; } })()
      : [];
    setProjForm({
      title_en: proj.title_en || '', title_ar: proj.title_ar || '',
      description_en: proj.description_en || '', description_ar: proj.description_ar || '',
      image_url: proj.image_url || '', link_url: proj.link_url || '',
      service_id: proj.service_id || '',
      content_blocks: parsedBlocks,
    });
  };

  // ── Block Handlers ──
  const addBlock = (type: Block['type']) => {
    setProjForm(prev => {
      const blocks = Array.isArray(prev.content_blocks) ? prev.content_blocks : [];
      return {
        ...prev,
        content_blocks: [...blocks, { id: Math.random().toString(36).substring(2, 9), type, text_en: '', text_ar: '', url: '', aspect: type === 'video' ? '16/9' : undefined }]
      };
    });
  };
  const updateBlock = (id: string, updates: Partial<Block>) => {
    setProjForm(prev => {
      const blocks = Array.isArray(prev.content_blocks) ? prev.content_blocks : [];
      return {
        ...prev,
        content_blocks: blocks.map(b => b.id === id ? { ...b, ...updates } : b)
      };
    });
  };
  const removeBlock = (id: string) => {
    setProjForm(prev => {
      const blocks = Array.isArray(prev.content_blocks) ? prev.content_blocks : [];
      return {
        ...prev,
        content_blocks: blocks.filter(b => b.id !== id)
      };
    });
  };
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    setProjForm(prev => {
      const blocks = [...(Array.isArray(prev.content_blocks) ? prev.content_blocks : [])];
      if (direction === 'up' && index > 0) {
        [blocks[index - 1], blocks[index]] = [blocks[index], blocks[index - 1]];
      } else if (direction === 'down' && index < blocks.length - 1) {
        [blocks[index + 1], blocks[index]] = [blocks[index], blocks[index + 1]];
      }
      return { ...prev, content_blocks: blocks };
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
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass glass-strong rounded-3xl p-6">
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
        <div className="glass glass-strong rounded-3xl p-6">
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

            {/* ── Top Image Carousel Gallery Section ── */}
            <div className="pt-4 border-t border-white/10 mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold flex items-center gap-2 text-navy">
                    <Image size={16} className="text-brand-blue" /> Top Image Carousel Gallery
                  </label>

                  <p className="text-xs text-muted-foreground mt-0.5 font-light">
                    Images rendered in the header carousel at the top of the project page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addBlock('image')}
                  className="glass glass-hover text-brand-blue rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 shrink-0"
                >
                  <Plus size={14} /> Add Slide
                </button>
              </div>

              {/* Slide 1: Main Cover Image */}
              <div className="glass rounded-xl p-3 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-blue flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-brand-blue/20 text-brand-blue flex items-center justify-center text-[10px]">1</span>
                    Main Cover Image (Slide 1)
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Service Card Thumbnail</span>
                </div>
                <input
                  value={projForm.image_url}
                  onChange={e => setProjForm({ ...projForm, image_url: e.target.value })}
                  className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                  placeholder="https://... (Cover Image URL)"
                />
              </div>

              {/* Extra Slides (Slides 2, 3, ...) */}
              {(Array.isArray(projForm.content_blocks) ? projForm.content_blocks : []).filter(b => b.type === 'image').map((block, imgIdx) => (
                <div key={block.id} className="glass rounded-xl p-3 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-blue flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-brand-blue/20 text-brand-blue flex items-center justify-center text-[10px]">{imgIdx + 2}</span>
                      Carousel Slide {imgIdx + 2}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeBlock(block.id)}
                      className="p-1 glass-hover rounded text-destructive hover:bg-destructive/10"
                      aria-label="Remove Slide"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    value={block.url || ''}
                    onChange={e => updateBlock(block.id, { url: e.target.value })}
                    className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                    placeholder="https://... (Additional Carousel Image URL)"
                  />
                </div>
              ))}

              {/* Visual Live Carousel Preview Strip */}
              {(() => {
                const blocks = Array.isArray(projForm.content_blocks) ? projForm.content_blocks : [];
                const allImgs = [projForm.image_url, ...blocks.filter(b => b.type === 'image' && b.url).map(b => b.url)].filter(Boolean);
                if (allImgs.length === 0) return null;
                return (
                  <div className="pt-2">
                    <div className="text-[11px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                      Live Carousel Preview ({allImgs.length} slide{allImgs.length > 1 ? 's' : ''})
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                      {allImgs.map((src, i) => (
                        <div key={i} className="relative group shrink-0 w-20 h-14 rounded-lg overflow-hidden border border-white/10 glass bg-black/40">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                            #{i + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Link URL (optional external link)</label>
              <input value={projForm.link_url} onChange={e => setProjForm({ ...projForm, link_url: e.target.value })} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="https://..." />
            </div>

            {/* ── Text & Video Content Blocks Builder ── */}
            <div className="pt-4 border-t border-white/10 mt-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold flex items-center gap-2 text-navy">
                  <LayoutList size={16} className="text-brand-blue" /> Article Content Blocks (Text & Video)
                </label>
              </div>
              <div className="space-y-3 mb-4">
                {(Array.isArray(projForm.content_blocks) ? projForm.content_blocks : []).filter(b => b.type !== 'image').map((block, idx) => (
                  <div key={block.id} className="glass rounded-xl p-3 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{block.type} Block</span>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => removeBlock(block.id)} className="p-1 glass-hover rounded text-destructive ml-1"><Trash2 size={14}/></button>
                      </div>
                    </div>
                    {block.type === 'text' && (
                      <div className="space-y-2">
                        <textarea value={block.text_en} onChange={e => updateBlock(block.id, { text_en: e.target.value })} className="glass-input w-full rounded-lg px-3 py-2 text-sm" rows={3} placeholder="Text (EN)..." />
                        <textarea value={block.text_ar} onChange={e => updateBlock(block.id, { text_ar: e.target.value })} className="glass-input w-full rounded-lg px-3 py-2 text-sm text-right" dir="rtl" rows={3} placeholder="النص (AR)..." />
                      </div>
                    )}
                    {block.type === 'video' && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <input value={block.url} onChange={e => updateBlock(block.id, { url: e.target.value })} className="glass-input w-full rounded-lg px-3 py-2 text-sm" placeholder="Video URL (YouTube, Vimeo, MP4)..." />
                          <select value={block.aspect || '16/9'} onChange={e => updateBlock(block.id, { aspect: e.target.value as any })} className="glass-input w-full rounded-lg px-3 py-2 text-sm">
                            <option value="16/9" className="bg-black text-white">Horizontal (16:9)</option>
                            <option value="9/16" className="bg-black text-white">Vertical (9:16)</option>
                            <option value="1/1" className="bg-black text-white">Square (1:1)</option>
                            <option value="4/3" className="bg-black text-white">Standard (4:3)</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => addBlock('text')} className="flex-1 glass glass-hover rounded-xl py-2 text-xs font-semibold flex items-center justify-center gap-1.5"><Type size={14}/> Add Text Block</button>
                <button type="button" onClick={() => addBlock('video')} className="flex-1 glass glass-hover rounded-xl py-2 text-xs font-semibold flex items-center justify-center gap-1.5"><Video size={14}/> Add Video Block</button>
              </div>
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
