import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Loader2, CheckCircle2, Circle, Mail, MailOpen, Clock, Building2, User, Reply, Inbox, Phone, FileText, Globe, Instagram, Facebook, Target } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow, format } from 'date-fns';

export const Route = createFileRoute('/admin/inquiries')({
  component: AdminInquiries,
});

function AdminInquiries() {
  const queryClient = useQueryClient();
  const [inquiryType, setInquiryType] = useState<'contact' | 'career'>('contact');
  const [activeTab, setActiveTab] = useState<'new' | 'read'>('new');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Automatically select first item if none selected when tab changes
  useEffect(() => {
    const filtered = inquiries.filter((i: any) => (i.type || 'contact') === inquiryType && i.status === activeTab);
    if (filtered.length > 0 && !filtered.find((i: any) => i.id === selectedId)) {
      setSelectedId(filtered[0].id);
    } else if (filtered.length === 0) {
      setSelectedId(null);
    }
  }, [activeTab, inquiryType, inquiries, selectedId]);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      if (selectedId === deletedId) setSelectedId(null);
    }
  });

  const filteredInquiries = inquiries.filter((i: any) => (i.type || 'contact') === inquiryType && i.status === activeTab);
  const selectedInquiry = inquiries.find((i: any) => i.id === selectedId);

  return (
    <div className="reveal in h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 shrink-0 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy">Inbox</h1>
          <p className="text-muted-foreground font-light mt-1">Manage project briefs and client messages.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="glass px-4 py-2 rounded-xl flex flex-col items-center">
            <span className="text-xl font-bold text-navy">{inquiries.filter((i:any) => (i.type || 'contact') === inquiryType).length}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Total</span>
          </div>
          <div className="glass px-4 py-2 rounded-xl flex flex-col items-center">
            <span className="text-xl font-bold text-brand-blue">{inquiries.filter((i:any) => (i.type || 'contact') === inquiryType && i.status === 'new').length}</span>
            <span className="text-[10px] uppercase tracking-wider text-brand-blue font-semibold">Unread</span>
          </div>
          <div className="glass px-4 py-2 rounded-xl flex flex-col items-center">
            <span className="text-xl font-bold text-muted-foreground">{inquiries.filter((i:any) => (i.type || 'contact') === inquiryType && i.status === 'read').length}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Read</span>
          </div>
        </div>
      </div>

      <div className="flex-1 glass glass-strong rounded-3xl overflow-hidden flex border border-white/5 relative">
        
        {/* LEFT PANEL - INBOX LIST */}
        <div className="w-full md:w-2/5 lg:w-1/3 border-r border-white/5 flex flex-col bg-black/10">
          <div className="p-4 border-b border-white/5 shrink-0 flex flex-col gap-4">
            <div className="flex gap-6 px-1">
              <button onClick={() => setInquiryType('contact')} className={`text-sm font-bold pb-1 border-b-2 transition-colors ${inquiryType === 'contact' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>Messages</button>
              <button onClick={() => setInquiryType('career')} className={`text-sm font-bold pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${inquiryType === 'career' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                Careers
                {inquiries.filter((i:any) => i.type === 'career' && i.status === 'new').length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-brand-blue" />
                )}
              </button>
            </div>
            <div className="flex bg-black/20 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('new')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'new' ? 'bg-brand-blue text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Inbox size={16} /> Unread 
                {inquiries.filter((i:any) => (i.type || 'contact') === inquiryType && i.status === 'new').length > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {inquiries.filter((i:any) => (i.type || 'contact') === inquiryType && i.status === 'new').length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('read')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'read' ? 'glass text-navy shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <MailOpen size={16} /> Read
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 flex justify-center text-brand-blue"><Loader2 className="animate-spin" size={24} /></div>
            ) : filteredInquiries.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center gap-3">
                <MailOpen size={32} className="opacity-20" />
                No {activeTab} messages.
              </div>
            ) : (
              <div className="flex flex-col">
                {filteredInquiries.map((iq: any) => (
                  <button
                    key={iq.id}
                    onClick={() => setSelectedId(iq.id)}
                    className={`p-4 text-left border-b border-white/5 transition-all relative ${selectedId === iq.id ? 'bg-brand-blue/10 border-l-4 border-l-brand-blue' : 'hover:bg-white/5 border-l-4 border-l-transparent'}`}
                  >
                    {iq.status === 'new' && selectedId !== iq.id && (
                      <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-blue" />
                    )}
                    <div className="flex justify-between items-start mb-1 pr-4">
                      <div className="font-semibold text-navy line-clamp-1 flex items-center gap-2">
                        {iq.type === 'career' && <span className="text-brand-blue text-[10px] uppercase font-bold border border-brand-blue/30 px-1.5 py-0.5 rounded">Career</span>}
                        {iq.name}
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{formatDistanceToNow(new Date(iq.created_at), { addSuffix: true })}</div>
                    </div>
                    <div className="text-sm font-medium text-foreground/80 mb-1 line-clamp-1">{iq.type === 'career' ? iq.position : (iq.company || 'No Company specified')}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{iq.message}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - READING PANE */}
        <div className="hidden md:flex flex-1 flex-col bg-card/30 backdrop-blur-sm overflow-hidden">
          {selectedInquiry ? (
            <>
              <div className="p-6 border-b border-white/5 flex justify-between items-start shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">{selectedInquiry.name}</h2>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    {selectedInquiry.email && <div className="flex items-center gap-2"><Mail size={14} className="text-brand-blue"/> <a href={`mailto:${selectedInquiry.email}`} className="hover:text-brand-blue transition-colors">{selectedInquiry.email}</a></div>}
                    {selectedInquiry.phone_number && <div className="flex items-center gap-2"><Phone size={14} className="text-brand-yellow"/> <a href={`tel:${selectedInquiry.phone_number}`} className="hover:text-brand-yellow transition-colors">{selectedInquiry.phone_number}</a></div>}
                    {selectedInquiry.company && <div className="flex items-center gap-2"><Building2 size={14} className="text-brand-yellow"/> {selectedInquiry.company}</div>}
                    {selectedInquiry.instagram_url && <div className="flex items-center gap-2"><Instagram size={14} className="text-brand-yellow"/> <a href={selectedInquiry.instagram_url} target="_blank" rel="noreferrer" className="hover:text-brand-yellow transition-colors">Instagram</a></div>}
                    {selectedInquiry.facebook_url && <div className="flex items-center gap-2"><Facebook size={14} className="text-brand-blue"/> <a href={selectedInquiry.facebook_url} target="_blank" rel="noreferrer" className="hover:text-brand-blue transition-colors">Facebook</a></div>}
                    {selectedInquiry.website_url && <div className="flex items-center gap-2"><Globe size={14} className="text-brand-yellow"/> <a href={selectedInquiry.website_url} target="_blank" rel="noreferrer" className="hover:text-brand-yellow transition-colors">Website</a></div>}
                    {selectedInquiry.campaign_goal && <div className="flex items-center gap-2 capitalize"><Target size={14} className="text-brand-yellow"/> Goal: {selectedInquiry.campaign_goal}</div>}
                    {selectedInquiry.type === 'career' && <div className="flex items-center gap-2"><User size={14} className="text-brand-yellow"/> {selectedInquiry.position}</div>}
                    <div className="flex items-center gap-2"><Clock size={14} /> {format(new Date(selectedInquiry.created_at), 'PPP at p')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  {selectedInquiry.status === 'new' ? (
                    <button 
                      onClick={() => updateStatusMutation.mutate({ id: selectedInquiry.id, status: 'read' })}
                      className="p-2 glass-hover rounded-xl text-brand-blue transition-colors"
                      title="Mark as Read"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateStatusMutation.mutate({ id: selectedInquiry.id, status: 'new' })}
                      className="p-2 glass-hover rounded-xl text-muted-foreground transition-colors"
                      title="Mark as Unread"
                    >
                      <Circle size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteMutation.mutate(selectedInquiry.id)}
                    disabled={deleteMutation.isPending}
                    className="p-2 glass-hover rounded-xl text-destructive transition-colors"
                    title="Delete Message"
                  >
                    {deleteMutation.isPending && deleteMutation.variables === selectedInquiry.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  </button>
                </div>
              </div>
              <div className="p-8 flex-1 overflow-y-auto">
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed text-[15px]">
                    {selectedInquiry.message}
                  </p>
                  {selectedInquiry.cv_url && (
                    <div className="mt-8">
                      <a href={selectedInquiry.cv_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 glass glass-hover px-4 py-2 rounded-xl text-sm font-medium text-brand-blue">
                        <FileText size={16} /> Download CV
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <Mail size={48} className="opacity-10 mb-4" />
              <p>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
