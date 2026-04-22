'use client';

import { Navigation } from '@/components/Navigation';
import { ScoreModal } from '@/components/ScoreModal';
import { Plus, History, Trophy, TrendingUp, CreditCard, Heart } from 'lucide-react';
import { useState } from 'react';

/**
 * app/(dashboard)/dashboard/page.tsx
 * The core User Dashboard for score tracking and competition status.
 */

export default function DashboardPage() {
  const [scores, setScores] = useState([72, 75, 71, 78, 74]); // Mock scores
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  const handleScoreSubmit = (newScore: number) => {
    setScores([newScore, ...scores.slice(0, 4)]);
    alert(`Score of ${newScore} submitted successfully! Your index is being recalculated.`);
  };

  const handlePayment = () => {
    alert('Redirecting to Razorpay Secure Checkout...');
    // In a real app: initiateRazorpaySubscription();
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12">
      <Navigation />
      <ScoreModal 
        isOpen={isScoreModalOpen} 
        onClose={() => setIsScoreModalOpen(false)} 
        onSubmit={handleScoreSubmit} 
      />

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight text-white">GOLFER DASHBOARD</h1>
            <p className="text-foreground/60 font-medium">Welcome back, Hero. Your next draw is in <span className="text-primary">12 days</span>.</p>
          </div>
          <button 
            onClick={() => setIsScoreModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold btn-primary hover:scale-105 transition-transform"
          >
            <Plus className="w-5 h-5" /> Submit New Score
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<TrendingUp className="text-primary" />} label="Current Index" value="4.2" />
          <StatCard icon={<History className="text-accent" />} label="Rounds Tracked" value="128" />
          <StatCard icon={<Trophy className="text-yellow-500" />} label="Match History" value="3 Wins" />
          <StatCard icon={<CreditCard className="text-blue-400" />} label="Status" value="Pro Active" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Rolling 5 Scores */}
          <div className="lg:col-span-2 p-8 rounded-3xl glass border border-surface-border">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                <History className="w-6 h-6 text-primary" /> Rolling 5 Scores
              </h2>
              <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">Verified Rounds</span>
            </div>
            
            <div className="space-y-4">
              {scores.map((score, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-surface-border/50 hover:bg-white/8 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-white">Tournament Round {12 - i}</p>
                      <p className="text-sm text-foreground/40">April {20 - i}, 2026</p>
                    </div>
                  </div>
                  <div className="text-3xl font-black text-primary group-hover:scale-110 transition-transform">
                    {score}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Draw & Pool Info */}
          <div className="space-y-8">
            <div className="p-8 rounded-3xl glass border border-accent/20 bg-accent/5">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Trophy className="w-5 h-5 text-accent" /> Active Jackpot
              </h3>
              <div className="text-5xl font-black mb-2 tracking-tighter text-accent">
                ₹1,25,000
              </div>
              <p className="text-sm text-foreground/60 font-medium mb-6">
                Next Draw: May 1st, 2026
              </p>
              <button 
                onClick={handlePayment}
                className="w-full py-3 rounded-xl bg-accent text-black font-bold hover:brightness-110 transition-all shadow-lg shadow-accent/20"
              >
                Enter Prize Draw
              </button>
            </div>

            <div className="p-8 rounded-3xl glass border border-surface-border">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Heart className="w-5 h-5 text-red-400" /> Your Impact
              </h3>
              <div className="text-3xl font-black mb-1 tracking-tight text-white">
                ₹12,450
              </div>
              <p className="text-sm text-foreground/60 font-medium">
                Contributed to Water.org through your rounds.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="p-6 rounded-2xl glass border border-surface-border hover:border-white/20 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">{label}</span>
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
    </div>
  );
}
