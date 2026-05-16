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

export const Route = createFileRoute('/admin/team')({
  component: AdminTeam,
});

function SortableTeamItem({ member, onDelete, isDeleting }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: member.id });

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
        
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 flex items-center justify-center">
          {member.photo_url ? (
            <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover pointer-events-none" />
          ) : (
            <div className="text-muted-foreground/50 text-[10px] leading-none text-center">No Photo</div>
          )}
        </div>
        
        <div>
          <div className="font-semibold text-navy pointer-events-none truncate">{member.name}</div>
          <div className="text-sm text-muted-foreground mt-0.5 pointer-events-none truncate">{member.role}</div>
        </div>
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button 
          onClick={() => onDelete(member.id)} 
          disabled={isDeleting}
          className="p-2 glass-hover rounded-xl text-destructive transition-colors"
          title="Delete Member"
        >
          {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
      </div>
    </div>
  );
}

function AdminTeam() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: '', role: '', photo_url: '' });

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

  const { data: team = [], isLoading } = useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      const { data, error } = await supabase.from('team').select('*').order('sort_order', { ascending: true, nullsFirst: false }).order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const addMutation = useMutation({
    mutationFn: async (newMember: typeof formData) => {
      const { error } = await supabase.from('team').insert([{ ...newMember, sort_order: team.length }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      setFormData({ name: '', role: '', photo_url: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('team').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: async (updates: { id: string; sort_order: number }[]) => {
      const promises = updates.map(u => 
        supabase.from('team').update({ sort_order: u.sort_order }).eq('id', u.id)
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
    }
  });

  const handleAdd = () => {
    if (!formData.name || !formData.role) return;
    addMutation.mutate(formData);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = team.findIndex((t: any) => t.id === active.id);
      const newIndex = team.findIndex((t: any) => t.id === over.id);
      
      const newItems = arrayMove(team, oldIndex, newIndex);
      
      queryClient.setQueryData(['team'], newItems);
      
      const updates = newItems.map((item: any, index) => ({ id: item.id, sort_order: index }));
      updateOrderMutation.mutate(updates);
    }
  };

  return (
    <div className="reveal in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy">Team Members</h1>
          <p className="text-muted-foreground font-light mt-1">Manage the people behind the work.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass glass-strong rounded-3xl p-6">
          <h2 className="font-semibold mb-4 text-lg">Current Roster (Drag to Reorder)</h2>
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
                  items={team.map((t: any) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {team.map((t: any) => (
                    <SortableTeamItem 
                      key={t.id} 
                      member={t} 
                      onDelete={(id: string) => deleteMutation.mutate(id)}
                      isDeleting={deleteMutation.isPending && deleteMutation.variables === t.id}
                    />
                  ))}
                </SortableContext>
                {team.length === 0 && <div className="col-span-2 text-center p-8 text-muted-foreground text-sm">No team members found.</div>}
              </div>
            </DndContext>
          )}
        </div>

        <div className="glass glass-strong rounded-3xl p-6 h-fit sticky top-8">
          <h2 className="font-semibold mb-4 text-lg">Add Member</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Full Name</label>
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="e.g. Jane Doe" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Role</label>
              <input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="e.g. Lead Designer" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Photo URL</label>
              <input value={formData.photo_url} onChange={e => setFormData({...formData, photo_url: e.target.value})} className="glass-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="https://example.com/photo.jpg" />
            </div>
            <button 
              onClick={handleAdd} 
              disabled={addMutation.isPending || !formData.name || !formData.role}
              className="glass glass-tint-blue glass-hover glass-glow w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold mt-2 disabled:opacity-50"
            >
              {addMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Add Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
