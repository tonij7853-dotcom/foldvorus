'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  HeartHandshake, 
  HeartCrack, 
  Sparkles, 
  Flame, 
  Zap, 
  Smile, 
  Laugh, 
  Moon, 
  ShieldAlert, 
  Skull, 
  Swords, 
  Clock, 
  EyeOff, 
  Crown, 
  Crosshair, 
  Droplets, 
  Users, 
  FlameKindling 
} from 'lucide-react';
import { MOOD_CATEGORIES } from '@/lib/search/synonym-dictionary';

const iconMap: Record<string, React.ElementType> = {
  HeartHandshake,
  HeartCrack,
  Sparkles,
  Flame,
  Zap,
  Smile,
  Laugh,
  Moon,
  ShieldAlert,
  Skull,
  Swords,
  Clock,
  EyeOff,
  Crown,
  Crosshair,
  Droplets,
  Users,
  FlameKindling,
};

interface VibeChipsProps {
  onSelectVibe?: (query: string) => void;
}

export const VibeChips: React.FC<VibeChipsProps> = ({ onSelectVibe }) => {
  const router = useRouter();

  const handleChipClick = (item: typeof MOOD_CATEGORIES[0]) => {
    if (onSelectVibe) {
      onSelectVibe(item.query);
    } else {
      router.push(`/search?q=${encodeURIComponent(item.query)}&mode=vibe`);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">
          Quick Vibe Discovery
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl px-2">
        {MOOD_CATEGORIES.map((item) => {
          const Icon = iconMap[item.icon] || Sparkles;
          return (
            <button
              key={item.id}
              onClick={() => handleChipClick(item)}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141722]/80 hover:bg-[#1f2334] border border-white/5 hover:border-accent-500/40 text-xs font-medium text-gray-300 hover:text-white transition-all duration-150 active:scale-95 shadow-sm"
            >
              <Icon className="w-3.5 h-3.5 text-accent-400 group-hover:scale-110 transition-transform" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
