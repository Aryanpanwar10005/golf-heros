import Link from 'next/link';
import { Trophy } from 'lucide-react';

/**
 * components/Navigation.tsx
 * Shared navigation for public and dashboard areas.
 */

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass h-20 px-6 md:px-12 flex items-center justify-between border-b border-surface-border">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="p-2 bg-primary rounded-xl group-hover:rotate-12 transition-transform">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tighter">DIGITAL HEROES</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <Link href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
        <Link href="/#prizes" className="hover:text-primary transition-colors">Prizes</Link>
        <Link href="/#charity" className="hover:text-primary transition-colors">Charity</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          href="/login" 
          className="px-6 py-2 text-sm font-semibold hover:text-primary transition-colors"
        >
          Login
        </Link>
        <Link 
          href="/signup" 
          className="px-6 py-2 rounded-full bg-primary text-sm font-bold text-white btn-primary"
        >
          Join Now
        </Link>
      </div>
    </nav>
  );
}
