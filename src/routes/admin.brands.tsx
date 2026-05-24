import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Loader2, GripHorizontal } from 'lucide-react';
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

export const Route = createFileRoute('/admin/brands')({
  component: AdminBrands,
});

function SortableBrandItem({ brand, onDelete, isDeleting }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: brand.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`glass rounded-2xl p-4 flex items-center justify-between group transition-colors hover:bg-white/5 ${isDragging ? 'opacity-90 scale-[1.02] shadow-2xl border-brand-blue/50 glass-strong' : ''}`}
    >
      <div className="flex items-center gap-4 overflow-hidden">
        <div 
          {...attributes} 
          {...listeners}
          className="text-muted-foreground/40 hover:text-brand-blue cursor-grab active:cursor-grabbing p-1 -ml-1 touch-none shrink-0"
        >
          <GripHorizontal size={20} className="rotate-90" />
        </div>
        
        <div className="w-16 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 flex items-center justify-center p-2">
          {brand.logo_url ? (
            <img src={brand.logo_url} alt={brand.name} className="max-w-full max-h-full object-contain filter brightness-0 invert opacity-70 pointer-events-none" />
          ) : (
            <span className="text-[10px] text-muted-foreground leading-none">No Logo</span>
          )}
        </div>
        
        <div className="font-semibold text-navy pointer-events-none truncate uppercase tracking-widest text-sm">{brand.name}</div>
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button 
          onClick={() => onDelete(brand.id)} 
          disabled={isDeleting}
          className="p-2 glass-hover rounded-xl text-destructive transition-colors"
          title="Delete Brand"
        >
          {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
      </div>
    </div>
  );
}

function AdminBrands() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: '', logo_url: '' });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase.from('brands').select('*').order('sort_order', { ascending: true, nullsFirst: false }).order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const addMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('brands').insert([{ ...data, sort_order: brands.length }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setFormData({ name: '', logo_url: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('brands').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: async (updates: { id: string; sort_order: number }[]) => {
      const promises = updates.map(u => 
        supabase.from('brands').update({ sort_order: u.sort_order }).eq('id', u.id)
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    }
  });

  const handleAdd = () => {
    if (!formData.name) return;
    addMutation.mutate(formData);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = brands.findIndex((b: any) => b.id === active.id);
      const newIndex = brands.findIndex((b: any) => b.id === over.id);
      
      const newItems = arrayMove(brands, oldIndex, newIndex);
      
      queryClient.setQueryData(['brands'], newItems);
      
      const updates = newItems.map((item: any, index) => ({ id: item.id, sort_order: index }));
      updateOrderMutation.mutate(updates);
    }
  };

  return (
    <div className="reveal in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy">Trusted Brands</h1>
          <p className="text-muted-foreground font-light mt-1">Manage the brands displayed in the scrolling marquee.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass glass-strong rounded-3xl p-6">
          <h2 className="font-semibold mb-4 text-lg">Active Brands (Drag to Reorder)</h2>
          {isLoading ? (
            <div className="p-8 flex justify-center text-brand-blue"><Loader2 className="animate-spin" size={24} /></div>
          ) : (
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="flex flex-col gap-3 relative">
                <SortableContext 
                  items={brands.map((b: any) => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {brands.map((b: any) => (
                    <SortableBrandItem 
                      key={b.id} 
                      brand={b} 
                      onDelete={(id: string) => deleteMutation.mutate(id)}
                      isDeleting={deleteMutation.isPending && deleteMutation.variables === b.id}
                    />
                  ))}
                </SortableContext>
                {brands.length === 0 && <div className="text-sm text-muted-foreground w-full py-4 text-center">No brands listed.</div>}
              </div>
            </DndContext>
          )}
        </div>

        <div className="glass glass-strong rounded-3xl p-6">
          <h2 className="font-semibold mb-4 text-lg">Add Brand</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Brand Name</label>
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm uppercase" placeholder="e.g. Google" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Logo URL</label>
              <input value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="https://.../logo.png" />
            </div>
            <button 
              onClick={handleAdd} 
              disabled={addMutation.isPending || !formData.name}
              className="glass glass-tint-blue glass-hover glass-glow w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold mt-2 disabled:opacity-50"
            >
              {addMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Add Brand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
