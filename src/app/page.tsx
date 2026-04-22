import { Navigation } from '@/components/Navigation';
import { ChevronRight, Target, Heart, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

/**
 * app/page.tsx
 * The premium Landing Page for Digital Heroes Golf.
 */

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 md:px-12 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-xs font-bold tracking-widest uppercase text-primary">The Future of Amateur Golf</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[0.95] tracking-tight">
            YOUR GAME, <br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-[#6fdba8]">THEIR FUTURE.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/60 mb-12 font-medium">
            Track your progress, compete for life-changing prize pools, and fund global charities—all through your passion for golf.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button className="w-full md:w-auto px-10 py-4 rounded-full bg-primary text-white font-bold text-lg btn-primary flex items-center justify-center gap-2">
              Start Your Journey <ChevronRight className="w-5 h-5" />
            </button>
            <button className="w-full md:w-auto px-10 py-4 rounded-full glass text-white font-bold text-lg hover:bg-white/5 transition-colors">
              How it works
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Target className="w-8 h-8 text-primary" />}
            title="Rolling-5 Tracker"
            description="Our custom engine tracks your last 5 scores to calculate your performance index fairly."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-accent" />}
            title="Secure Draws"
            description="Algorithmic and random draws conducted monthly with full transparency and verified winners."
          />
          <FeatureCard 
            icon={<Heart className="w-8 h-8 text-red-400" />}
            title="Charity Driven"
            description="Every subscription funds our global charity partners. Win big while giving back."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-surface-border text-center text-foreground/40 text-sm">
        <p>&copy; 2026 Digital Heroes Golf. All Rights Reserved.</p>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl glass border border-surface-border hover:border-primary/40 transition-all group">
      <div className="mb-6 p-4 rounded-2xl bg-white/5 inline-block group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-foreground/60 font-medium leading-relaxed">
        {description}
      </p>
    </div>
  );
}
