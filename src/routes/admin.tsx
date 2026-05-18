import { createFileRoute, redirect, Outlet, Link, useRouter } from '@tanstack/react-router';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, Users, Briefcase, Tag, LogOut, Mail, Settings, FileText } from 'lucide-react';

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: '/login' });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: '/login' });
  };
  
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col p-6 glass-strong">
        <div className="font-display font-bold text-xl mb-10 flex items-center gap-3">
          <img src="/SAWAQLYLOGO1.png" alt="Sawaqly" className="h-8 w-auto object-contain" />
          <span>SAWAQLY</span>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          <Link 
            to="/admin/inquiries"
            activeProps={{ className: 'bg-brand-blue/10 text-brand-blue font-medium' }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm text-muted-foreground hover:text-foreground"
          >
            <Mail size={18} /> Inquiries
          </Link>
          <Link 
            to="/admin/services"
            activeProps={{ className: 'bg-brand-blue/10 text-brand-blue font-medium' }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm text-muted-foreground hover:text-foreground"
          >
            <Briefcase size={18} /> Services
          </Link>
          <Link 
            to="/admin/team"
            activeProps={{ className: 'bg-brand-blue/10 text-brand-blue font-medium' }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm text-muted-foreground hover:text-foreground"
          >
            <Users size={18} /> Team
          </Link>
          <Link 
            to="/admin/brands"
            activeProps={{ className: 'bg-brand-blue/10 text-brand-blue font-medium' }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm text-muted-foreground hover:text-foreground"
          >
            <Tag size={18} /> Brands
          </Link>
          <Link 
            to="/admin/copy"
            activeProps={{ className: 'bg-brand-blue/10 text-brand-blue font-medium' }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm text-muted-foreground hover:text-foreground"
          >
            <FileText size={18} /> Website Copy
          </Link>
          <Link 
            to="/admin/settings"
            activeProps={{ className: 'bg-brand-blue/10 text-brand-blue font-medium' }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm text-muted-foreground hover:text-foreground"
          >
            <Settings size={18} /> Settings
          </Link>
        </nav>

        <button 
          onClick={handleLogout} 
          className="mt-auto flex items-center gap-3 px-4 py-3 text-left text-destructive hover:bg-destructive/10 rounded-xl transition-colors text-sm font-medium"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto relative">
        {/* Ambient glow in main area */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none" />
        <Outlet />
      </main>
    </div>
  );
}
