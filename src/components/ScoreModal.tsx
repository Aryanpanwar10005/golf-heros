'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

/**
 * components/ScoreModal.tsx
 * Modal for submitting new golf scores.
 */

export function ScoreModal({ isOpen, onClose, onSubmit }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (score: number) => void; 
}) {
  const [score, setScore] = useState<number>(72);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-900 border border-emerald-500/20 rounded-3xl p-8 relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-foreground/40 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-black mb-2 tracking-tight text-white">SUBMIT SCORE</h2>
        <p className="text-foreground/60 mb-8 font-medium">Enter your gross score for today's round.</p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-emerald-500/60">Gross Score (1-145)</label>
            <input 
              type="number" 
              min="1" 
              max="145" 
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full bg-white/5 border border-emerald-500/20 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-2xl font-black text-white" 
            />
          </div>

          <button 
            onClick={() => {
              onSubmit(score);
              onClose();
            }}
            className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20"
          >
            Confirm Submission
          </button>
        </div>
      </div>
    </div>
  );
}
