'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, Target, Layers, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { SearchMode } from '@/lib/types';

interface SearchBarProps {
  initialQuery?: string;
  initialMode?: SearchMode;
  size?: 'large' | 'compact';
  autoFocus?: boolean;
  onSearch?: (query: string, mode: SearchMode) => void;
}

const EXAMPLE_QUERIES = [
  'someone finds out who killed their mother',
  'Cruella 2021',
  'sad breakup scenes',
  'girl crying after losing someone',
  'confident entrance scene',
  'villain smiling after winning',
  'screaming in the rain',
  'romantic eye contact',
  'Rue Bennett',
  'character sitting alone after losing everything',
];

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  initialMode = 'all',
  size = 'large',
  autoFocus = false,
  onSearch,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [mode, setMode] = useState<SearchMode>(initialMode);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync when initialQuery or initialMode changes externally
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Placeholder rotation
  useEffect(() => {
    if (initialQuery) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % EXAMPLE_QUERIES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [initialQuery]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalQuery = query.trim() || EXAMPLE_QUERIES[placeholderIndex];
    if (!finalQuery) return;

    if (onSearch) {
      onSearch(finalQuery, mode);
    } else {
      router.push(`/search?q=${encodeURIComponent(finalQuery)}&mode=${mode}`);
    }
  };

  const handleModeChange = (newMode: SearchMode) => {
    setMode(newMode);
    if (query.trim() && onSearch) {
      onSearch(query.trim(), newMode);
    }
  };

  const isLarge = size === 'large';

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-3">
      {/* Search Bar Container */}
      <form
        onSubmit={handleSubmit}
        className={`relative flex items-center w-full transition-all duration-300 rounded-2xl bg-[#12141c] border ${
          isFocused
            ? 'border-accent-500/60 ring-2 ring-accent-500/20 shadow-xl shadow-accent-900/10'
            : 'border-white/10 hover:border-white/20'
        } ${isLarge ? 'p-2 sm:p-2.5' : 'p-1.5'}`}
      >
        {/* Left Icon */}
        <div className="pl-2 sm:pl-3 pr-2 text-gray-400">
          {mode === 'vibe' ? (
            <Sparkles className={`${isLarge ? 'w-5 h-5' : 'w-4 h-4'} text-accent-400 animate-pulse-subtle`} />
          ) : mode === 'exact' ? (
            <Target className={`${isLarge ? 'w-5 h-5' : 'w-4 h-4'} text-blue-400`} />
          ) : (
            <Search className={`${isLarge ? 'w-5 h-5' : 'w-4 h-4'} text-gray-400`} />
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus={autoFocus}
          placeholder={`Describe any scene or title (e.g. "${EXAMPLE_QUERIES[placeholderIndex]}")`}
          className={`w-full bg-transparent text-white placeholder-gray-500 focus:outline-none font-normal ${
            isLarge ? 'text-base sm:text-lg py-1' : 'text-sm py-0.5'
          }`}
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Submit Action Button */}
        <button
          type="submit"
          className={`flex items-center gap-1.5 font-medium text-white rounded-xl bg-accent-600 hover:bg-accent-500 active:scale-95 transition-all shadow-md shadow-accent-600/30 ${
            isLarge ? 'px-4 py-2 text-sm sm:text-base' : 'px-3 py-1.5 text-xs'
          }`}
        >
          <span>Search</span>
          <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
        </button>
      </form>

      {/* Mode Selector Chips */}
      <div className="flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 text-[11px] uppercase tracking-wider font-semibold mr-1">Mode:</span>
          
          <button
            type="button"
            onClick={() => handleModeChange('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              mode === 'all'
                ? 'bg-white/15 text-white border border-white/25 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Layers className="w-3 h-3 text-accent-400" />
            <span>All (Smart)</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('vibe')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              mode === 'vibe'
                ? 'bg-accent-500/20 text-accent-300 border border-accent-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Sparkles className="w-3 h-3 text-accent-400" />
            <span>Vibe / Natural Scene</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('exact')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              mode === 'exact'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Target className="w-3 h-3 text-blue-400" />
            <span>Exact Title/Actor</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-1 text-gray-400 text-[11px]">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px]">Enter ↵</kbd>
          <span>to search</span>
        </div>
      </div>
    </div>
  );
};
