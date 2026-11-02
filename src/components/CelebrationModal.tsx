import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, X } from 'lucide-react';

export const CelebrationModal: React.FC = () => {
  const { celebration, dismissCelebration } = useApp();

  if (!celebration || !celebration.active) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-amber-200 text-center overflow-hidden">
        {/* Animated Confetti Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(16)].map((_, i) => (
            <span
              key={i}
              className="absolute text-sm animate-bounce"
              style={{
                left: `${(i * 6.5) % 95}%`,
                top: `${40 + (i % 5) * 10}%`,
                animationDelay: `${(i % 4) * 0.2}s`,
                animationDuration: `${1.2 + (i % 3) * 0.3}s`,
              }}
            >
              {['🎉', '✨', '🍛', '⭐', '🔥', '🛵', '💰', '🌟'][i % 8]}
            </span>
          ))}
        </div>

        <button
          onClick={dismissCelebration}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25 animate-bounce">
          <Sparkles className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-extrabold text-[#3A2E25] tracking-tight">
          {celebration.title}
        </h3>

        {celebration.amount && (
          <div className="my-2 inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-lg border border-emerald-200">
            {celebration.amount}
          </div>
        )}

        <p className="text-sm text-[#7A6A5C] mt-2 mb-6 leading-relaxed">
          {celebration.subtitle}
        </p>

        <div className="flex justify-center">
          <button
            onClick={dismissCelebration}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Awesome, Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
