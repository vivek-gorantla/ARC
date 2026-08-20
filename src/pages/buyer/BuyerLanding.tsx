import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Search } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

const examples = [
  'Build me a coding setup under ₹1L',
  'Find a laptop for ML',
  'Build a minimalist desk',
  'I need a gaming setup',
];

export function BuyerLanding() {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (q: string) => {
    setSearching(true);
    setTimeout(() => {
      navigate(`/buyer/result?q=${encodeURIComponent(q)}`);
    }, 1200);
  };

  return (
    <PageLayout mode="buyer">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <div className="max-w-4xl">
          <span className="label-mono block mb-6 text-ink-300 tracking-[0.2em]">AI BUYER — NATURAL LANGUAGE SEARCH</span>
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl leading-[0.9] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-ink-50 to-ink-400">
            <span className="block">WHAT DO</span>
            <span className="block text-ink-300">YOU NEED?</span>
          </h1>

          {/* Search input */}
          <div className="mt-12">
            <div className="relative">
              {searching ? (
                <div className="glass-card p-6 lg:p-8 border border-white/[0.08] glow-accent">
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-white animate-pulse" strokeWidth={1.5} />
                    <span className="label-mono-light tracking-widest animate-pulse">SCANNING AGENTIC MERCHANT NETWORK...</span>
                  </div>
                  <div className="mt-4 h-[2px] bg-white/5 overflow-hidden">
                    <div className="h-full bg-white animate-[shimmer_2s_linear_infinite]" style={{ width: '80%' }} />
                  </div>
                  <p className="mt-3 text-xs text-ink-300 font-mono">Analyzing semantic query intent · routing catalog requests · evaluating autonomous policies</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (query.trim()) handleSearch(query);
                  }}
                >
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe what you need (e.g., 'A professional developer desk setup with dual 4K monitors')..."
                    className="w-full bg-white/[0.02] border border-white/[0.08] px-5 py-5 lg:py-6 text-lg lg:text-xl text-white placeholder:text-ink-400 focus:border-white/40 focus:bg-white/[0.04] outline-none transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="mt-4 inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-ink-950 font-black tracking-tight hover:bg-ink-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                  >
                    <Sparkles className="w-4 h-4 text-ink-950" fill="currentColor" /> SEARCH WITH AI
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Examples */}
          {!searching && (
            <div className="mt-14">
              <span className="label-mono text-ink-300">TRY DEMO QUERY SCENARIOS</span>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-transparent">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => {
                      setQuery(ex);
                      handleSearch(ex);
                    }}
                    className="group glass-card p-5 text-left border border-white/[0.06] hover:border-white/20 transition-all duration-300 flex items-center justify-between"
                  >
                    <span className="text-ink-100 group-hover:text-white transition-colors text-sm font-medium">{ex}</span>
                    <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
