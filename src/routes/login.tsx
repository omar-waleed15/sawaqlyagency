import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      throw redirect({ to: '/admin' });
    }
  },
  component: Login,
});

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Wait a tick for Supabase to persist the session before navigating
      await new Promise((r) => setTimeout(r, 100));
      await router.invalidate();
      router.navigate({ to: '/admin/inquiries' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Ambient background matching the site theme */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue/30 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <form
        onSubmit={handleLogin}
        className="glass glass-strong rounded-3xl p-8 md:p-10 w-full max-w-md relative z-10"
      >
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 font-display font-bold text-2xl mb-2">
            <img src="/SAWAQLYLOGO1.png" alt="Sawaqly" className="h-10 w-auto object-contain" />
            <span>SAWAQLY Admin</span>
          </div>
          <p className="text-sm text-muted-foreground font-light">Secure login portal</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                placeholder="admin@sawaqly.com"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="glass glass-tint-blue glass-hover glass-glow w-full mt-8 flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? 'Authenticating...' : (
            <>Access Dashboard <ArrowRight size={16} /></>
          )}
        </button>
      </form>
    </div>
  );
}
