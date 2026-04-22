'use client';

import { Navigation } from '@/components/Navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * app/(auth)/login/page.tsx
 * Premium Login Page for Digital Heroes.
 */

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Navigation />
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <h1 className="text-5xl font-black tracking-tighter text-white mb-2">WELCOME BACK</h1>
          <p className="text-foreground/60 font-medium italic">Ready for your next round, Hero?</p>
        </div>

        <div className="p-8 rounded-3xl glass border border-surface-border space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-surface-border p-4 pl-12 rounded-2xl focus:outline-none focus:border-primary text-white font-medium" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40">Password</label>
                <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-surface-border p-4 pl-12 rounded-2xl focus:outline-none focus:border-primary text-white font-medium" 
                />
              </div>
            </div>
          </div>

          <button className="w-full py-4 rounded-2xl bg-primary text-white font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 group">
            Login to Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <p className="text-center text-sm font-medium text-foreground/60">
          New to the platform? <Link href="/signup" className="text-primary font-bold hover:underline">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
