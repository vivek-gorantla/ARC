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
          <span className="label-mono block mb-8">AI BUYER — NATURAL LANGUAGE SEARCH</span>
          <h1 className="display-2xl text-white">
            <span className="block">WHAT DO</span>
            <span className="block text-ink-300">YOU NEED?</span>
          </h1>

          {/* Search input */}
          <div className="mt-12">
            <div className="relative">
              {searching ? (
                <div className="border border-line p-6 lg:p-8">
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-white animate-pulse" strokeWidth={1.5} />
                    <span className="label-mono-light">SEARCHING AI-READY MERCHANTS...</span>
                  </div>
                  <div className="mt-4 h-1 bg-ink-700 overflow-hidden">
                    <div className="h-full bg-white animate-pulse" style={{ width: '60%' }} />
                  </div>
                  <p className="mt-3 text-sm text-ink-300 font-mono">Analyzing intent · matching catalog · evaluating policies</p>
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
                    placeholder="Describe what you're looking for..."
                    className="w-full bg-ink-900 border border-line px-5 py-5 lg:py-6 text-lg lg:text-xl text-white placeholder:text-ink-300 focus:border-white outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="mt-3 inline-flex items-center gap-2 px-6 py-3 bg-white text-ink-950 font-bold tracking-tight hover:bg-ink-100 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" /> SEARCH WITH AI
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Examples */}
          {!searching && (
            <div className="mt-10">
              <span className="label-mono">TRY ONE OF THESE</span>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-px bg-line">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => {
                      setQuery(ex);
                      handleSearch(ex);
                    }}
                    className="group bg-ink-950 hover:bg-ink-900 p-5 text-left transition-colors flex items-center justify-between"
                  >
                    <span className="text-ink-100">{ex}</span>
                    <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-white group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
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
