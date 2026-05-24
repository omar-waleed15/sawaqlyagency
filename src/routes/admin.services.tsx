import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Icons from 'lucide-react';
import { Plus, Edit2, Trash2, Loader2, GripVertical, Check, X as XIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const AVAILABLE_ICONS = [
  "Megaphone", "Search", "Share2", "Target", "PenTool", "Video", "Mail", 
  "Globe", "BarChart3", "Monitor", "Smartphone", "Camera", "MessageSquare", 
  "Heart", "Star", "Zap", "Award", "Briefcase", "Code", "Cpu", 
  "Database", "Layout", "Layers", "Settings", "Tool", "Users", "Rocket", 
  "Sparkles", "Lightbulb", "Compass", "Map", "Send", "Activity", "Box"
];

export const Route = createFileRoute('/admin/services')({
  component: AdminServices,
});

function SortableServiceItem({ service, onEdit, onDelete, isEditing, isDeleting }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`glass rounded-2xl p-4 flex items-center justify-between group transition-colors hover:bg-white/5 ${isDragging ? 'opacity-90 scale-[1.02] shadow-2xl border-brand-blue/50 glass-strong' : ''} ${isEditing && !isDragging ? 'border-brand-yellow/50 shadow-[0_0_15px_rgba(255,215,0,0.1)]' : ''}`}
    >
      <div className="flex items-center gap-4 overflow-hidden">
        <div 
          {...attributes} 
          {...listeners}
          className="text-muted-foreground/40 hover:text-brand-blue cursor-grab active:cursor-grabbing p-1 -ml-1 touch-none"
        >
          <GripVertical size={20} />
        </div>
        <div>
          <div className="font-semibold text-navy flex items-center gap-2">
            {service.title}
            <span className="text-xs px-2 py-0.5 rounded-md bg-brand-blue/10 text-brand-blue border border-brand-blue/20">Icon: {service.icon_name}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1 line-clamp-1">{service.description}</div>
        </div>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button onClick={() => onEdit(service)} className="p-2 glass-hover rounded-xl text-brand-blue" aria-label="Edit">
          <Edit2 size={16} />
        </button>
        <button onClick={() => onDelete(service.id)} disabled={isDeleting} className="p-2 glass-hover rounded-xl text-destructive" aria-label="Delete">
          {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
      </div>
    </div>
  );
}

function AdminServices() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ title: '', title_ar: '', description: '', description_ar: '', icon_name: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px drag threshold to differentiate click from drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('*').order('sort_order', { ascending: true, nullsFirst: false }).order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const addMutation = useMutation({
    mutationFn: async (newService: typeof formData) => {
      const { error } = await supabase.from('services').insert([{ ...newService, sort_order: services.length }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from('services').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      if (editingId) resetForm();
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: async (updates: { id: string; sort_order: number }[]) => {
      const promises = updates.map(u => 
        supabase.from('services').update({ sort_order: u.sort_order }).eq('id', u.id)
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    }
  });

  const resetForm = () => {
    setFormData({ title: '', title_ar: '', description: '', description_ar: '', icon_name: '' });
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.icon_name) return;
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  const handleEditClick = (service: any) => {
    setEditingId(service.id);
    setFormData({ title: service.title, title_ar: service.title_ar || '', description: service.description, description_ar: service.description_ar || '', icon_name: service.icon_name });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = services.findIndex(s => s.id === active.id);
      const newIndex = services.findIndex(s => s.id === over.id);
      
      const newItems = arrayMove(services, oldIndex, newIndex);
      
      // Optimistically update cache so the UI animation is perfectly smooth
      queryClient.setQueryData(['services'], newItems);
      
      // Save new order to db
      const updates = newItems.map((item, index) => ({ id: item.id, sort_order: index }));
      updateOrderMutation.mutate(updates);
    }
  };

  return (
    <div className="reveal in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy">Services</h1>
          <p className="text-muted-foreground font-light mt-1">Manage the services displayed on the website.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass glass-strong rounded-3xl p-6">
          <h2 className="font-semibold mb-4 text-lg">Current Services (Drag to Reorder)</h2>
          <div className="space-y-3 relative">
            {isLoading ? (
              <div className="p-8 flex justify-center text-brand-blue"><Loader2 className="animate-spin" size={24} /></div>
            ) : (
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={services.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {services.map(s => (
                    <SortableServiceItem 
                      key={s.id} 
                      service={s} 
                      onEdit={handleEditClick}
                      onDelete={(id: string) => deleteMutation.mutate(id)}
                      isEditing={editingId === s.id}
                      isDeleting={deleteMutation.isPending && deleteMutation.variables === s.id}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
            {!isLoading && services.length === 0 && <div className="text-center p-8 text-muted-foreground text-sm">No services found. Add one on the right.</div>}
          </div>
        </div>

        <div className="glass glass-strong rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">{editingId ? 'Edit Service' : 'Add New Service'}</h2>
            {editingId && (
              <button onClick={resetForm} className="text-muted-foreground hover:text-foreground p-1" title="Cancel Edit">
                <XIcon size={18} />
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title (EN)</label>
              <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="e.g. Web Design" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title (AR)</label>
              <input value={formData.title_ar} onChange={e => setFormData({...formData, title_ar: e.target.value})} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm text-right" dir="rtl" placeholder="مثال: تصميم مواقع" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description (EN)</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" rows={3} placeholder="Brief description..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description (AR)</label>
              <textarea value={formData.description_ar} onChange={e => setFormData({...formData, description_ar: e.target.value})} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm text-right" dir="rtl" rows={3} placeholder="وصف موجز..." />
            </div>
            <div className="relative">
              <label className="text-sm font-medium mb-1.5 block">Icon Library</label>
              <button 
                type="button"
                onClick={() => setIsIconPickerOpen(!isIconPickerOpen)}
                className="glass-input w-full rounded-xl px-4 py-2.5 text-sm flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {formData.icon_name ? (() => {
                    const SelectedIconComp = (Icons as any)[formData.icon_name];
                    return SelectedIconComp ? <SelectedIconComp size={16} className="text-brand-blue" /> : null;
                  })() : <div className="w-4 h-4 rounded-full border border-dashed border-muted-foreground/50" />}
                  <span className={formData.icon_name ? "text-foreground" : "text-muted-foreground"}>
                    {formData.icon_name || "Select an icon..."}
                  </span>
                </div>
                <Icons.ChevronDown size={16} className={`text-muted-foreground transition-transform duration-200 ${isIconPickerOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isIconPickerOpen && (
                <div className="absolute top-[100%] left-0 w-full mt-2 z-50 glass glass-strong shadow-2xl rounded-xl border border-white/10 p-3 grid grid-cols-6 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {AVAILABLE_ICONS.map(iconName => {
                    const IconComp = (Icons as any)[iconName];
                    if (!IconComp) return null;
                    const isSelected = formData.icon_name === iconName;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, icon_name: iconName });
                          setIsIconPickerOpen(false);
                        }}
                        className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-brand-blue text-white shadow-lg scale-110 z-10' 
                            : 'hover:bg-white/10 text-muted-foreground hover:text-foreground'
                        }`}
                        title={iconName}
                      >
                        <IconComp size={18} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            <button  
              onClick={handleSave} 
              disabled={addMutation.isPending || updateMutation.isPending || !formData.title}
              className={`glass glass-hover glass-glow w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold mt-2 disabled:opacity-50 ${editingId ? 'glass-tint-yellow text-navy' : 'glass-tint-blue'}`}
              style={editingId ? { background: 'color-mix(in oklab, var(--brand-yellow) 80%, transparent)' } : {}}
            >
              {(addMutation.isPending || updateMutation.isPending) ? (
                <Loader2 size={16} className="animate-spin" />
              ) : editingId ? (
                <Check size={16} />
              ) : (
                <Plus size={16} />
              )}
              {editingId ? 'Save Changes' : 'Add Service'}
            </button>
            
            {editingId && (
              <button onClick={resetForm} className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
