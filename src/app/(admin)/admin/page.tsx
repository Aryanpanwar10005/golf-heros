'use client';

import { Navigation } from '@/components/Navigation';
import { Settings, Play, Users, BarChart3, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';

/**
 * app/(admin)/admin/page.tsx
 * Admin Panel for controlling the monthly draw and prize distributions.
 */

export default function AdminPage() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawResult, setDrawResult] = useState<string | null>(null);

  const handleDraw = (type: 'random' | 'algorithmic') => {
    setIsDrawing(true);
    setDrawResult(null);

    // Simulate draw calculation
    setTimeout(() => {
      setIsDrawing(false);
      setDrawResult(type === 'random' ? 'Random Selection Complete' : 'Frequency Weights Applied & Resolved');
      alert(`Draw Executed: ${type === 'random' ? 'Random' : 'Algorithmic'} mode successful. Winners notified via email.`);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12">
      <Navigation />
      
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">ADMIN CONTROL</h1>
            <p className="text-foreground/60 font-medium italic">High-Privilege Operations Area</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Controls */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Draw Execution */}
            <div className="p-8 rounded-3xl glass border border-primary/20 bg-primary/5">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                <Play className="w-6 h-6 text-primary" /> Execute Monthly Draw
              </h2>
              <p className="text-foreground/70 mb-8 max-w-xl">
                Warning: This action is irreversible. It will calculate the final frequencies, pick the winning numbers, and distribute the prize pool among eligible golfers.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  disabled={isDrawing}
                  onClick={() => handleDraw('random')}
                  className="flex items-center justify-center gap-3 p-4 rounded-xl bg-primary text-white font-bold hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {isDrawing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Run Random Draw'}
                </button>
                <button 
                  disabled={isDrawing}
                  onClick={() => handleDraw('algorithmic')}
                  className="flex items-center justify-center gap-3 p-4 rounded-xl border border-primary text-primary font-bold hover:bg-primary/10 transition-all disabled:opacity-50"
                >
                  {isDrawing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Run Algorithmic Draw'}
                </button>
              </div>

              {drawResult && (
                <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3 text-primary font-bold animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="w-5 h-5" /> {drawResult}
                </div>
              )}
            </div>

            {/* Prize Pool Settings */}
            <div className="p-8 rounded-3xl glass border border-surface-border">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                <Settings className="w-6 h-6 text-accent" /> Pool Distribution (%)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/40">5-Match (Jackpot)</label>
                  <input type="number" defaultValue="40" className="w-full bg-white/5 border border-surface-border p-3 rounded-xl focus:outline-none focus:border-primary font-bold text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/40">4-Match Tier</label>
                  <input type="number" defaultValue="35" className="w-full bg-white/5 border border-surface-border p-3 rounded-xl focus:outline-none focus:border-primary font-bold text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/40">3-Match Tier</label>
                  <input type="number" defaultValue="25" className="w-full bg-white/5 border border-surface-border p-3 rounded-xl focus:outline-none focus:border-primary font-bold text-white" />
                </div>
              </div>
            </div>

          </div>

          {/* System Overview */}
          <div className="space-y-8">
            <div className="p-8 rounded-3xl glass border border-surface-border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-blue-400" /> Active Pool
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-foreground/60 font-medium">Subscribed Users</span>
                  <span className="font-bold text-white">1,240</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60 font-medium">Eligible for Draw</span>
                  <span className="font-bold text-white">980</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60 font-medium">Total Revenue (Month)</span>
                  <span className="font-bold text-primary">₹3,10,000</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl glass border border-surface-border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <BarChart3 className="w-5 h-5 text-yellow-500" /> Platform Fees
              </h3>
              <div className="text-3xl font-black text-white">
                ₹62,000
              </div>
              <p className="text-sm text-foreground/60 font-medium mt-1">
                20% Platform sustainability fee.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
