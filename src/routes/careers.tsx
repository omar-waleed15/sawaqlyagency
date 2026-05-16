import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { ArrowLeft, UploadCloud, CheckCircle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/careers")({
  component: Careers,
});

function Careers() {
  const [file, setFile] = useState<File | null>(null);
  const [sent, setSent] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  
  const submitMutation = useMutation({
    mutationFn: async (formData: any) => {
      let cv_url = null;
      if (file) {
        setUploadProgress(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('cvs')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('cvs').getPublicUrl(filePath);
        cv_url = data.publicUrl;
      }
      
      const { error } = await supabase.from('inquiries').insert([{
        type: 'career',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        message: `Application for ${formData.position}`,
        cv_url: cv_url,
      }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      setSent(true);
      setUploadProgress(false);
    },
    onError: (err) => {
      console.error(err);
      setUploadProgress(false);
      alert("Failed to submit application. Please try again.");
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    submitMutation.mutate({
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone'),
      position: data.get('position'),
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col">
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-blue/20 blur-[150px] rounded-full" />
      </div>

      <header className="px-6 py-8 relative z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <img src="/SAWAQLYLOGO1.png" alt="Sawaqly" className="h-7 w-auto object-contain" />
            <span>SAWAQLY</span>
          </Link>
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-2xl glass glass-strong rounded-3xl p-8 md:p-12">
          {sent ? (
            <div className="text-center py-12 reveal in">
              <CheckCircle size={64} className="mx-auto text-brand-blue mb-6" />
              <h1 className="text-3xl font-bold mb-4">Application Received</h1>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                Thanks for applying to join our team! We'll review your application and get back to you soon.
              </p>
              <Link to="/" className="glass glass-tint-blue glass-hover rounded-full px-6 py-3 font-semibold text-sm inline-flex items-center">
                Return Home
              </Link>
            </div>
          ) : (
            <div className="reveal in">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Join the team</h1>
              <p className="text-muted-foreground mb-10">We're always looking for bold thinkers. Apply below.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
                    <input name="name" required className="glass-input w-full rounded-xl px-4 py-3 text-sm" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Phone Number *</label>
                    <input name="phone" required type="tel" className="glass-input w-full rounded-xl px-4 py-3 text-sm" placeholder="+20 100 000 0000" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Email Address *</label>
                    <input name="email" required type="email" className="glass-input w-full rounded-xl px-4 py-3 text-sm" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Position Applied For *</label>
                    <input name="position" required className="glass-input w-full rounded-xl px-4 py-3 text-sm" placeholder="e.g. Senior Designer" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Upload CV (PDF or DOCX) *</label>
                  <label className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group">
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx"
                      required
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <UploadCloud size={32} className="text-brand-blue mb-3 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-sm">{file ? file.name : "Click to browse files"}</span>
                    <span className="text-xs text-muted-foreground mt-1">Max file size 5MB</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitMutation.isPending || uploadProgress}
                  className="glass glass-tint-blue glass-hover glass-glow w-full flex items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-bold mt-4 disabled:opacity-50"
                >
                  {(submitMutation.isPending || uploadProgress) ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : "Submit Application"}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
