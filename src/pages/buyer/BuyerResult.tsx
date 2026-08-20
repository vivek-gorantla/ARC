import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, ArrowRight, Plus } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { Label } from '@/components/ui';
import { ProductImage } from '@/components/ProductImage';
import { catalogService, cartService } from '@/services';
import type { Product } from '@/types';
import { formatINR } from '@/utils/format';

interface ParsedIntent {
  useCase: string;
  budget: string;
  budgetNum?: number;
  priority: string;
  preference: string;
}

export function BuyerResult() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);

  const intent = parseIntent(query);

  useEffect(() => {
    catalogService.aiMatch({
      useCase: intent.useCase,
      budget: intent.budgetNum,
    }).then(async (results) => {
      setMatches(results);
      if (results[0]) {
        setSelected(results[0]);
        const recs = await cartService.getRecommendations(results[0].id);
        setRecommendations(recs);
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const addToBag = (productId: string) => {
    const existing = JSON.parse(sessionStorage.getItem('arc_cart') || '[]');
    if (!existing.includes(productId)) {
      existing.push(productId);
    }
    sessionStorage.setItem('arc_cart', JSON.stringify(existing));
    navigate('/buyer/bag');
  };

  if (loading) {
    return (
      <PageLayout mode="buyer">
        <div className="px-5 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin" />
            <span className="label-mono-light">UNDERSTANDING YOUR REQUEST...</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="w-3/4 h-32 shimmer-bg border border-line" />
              <div className="w-full h-64 shimmer-bg border border-line" />
            </div>
            <div className="h-96 shimmer-bg border border-line" />
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout mode="buyer">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        {/* Understood */}
        <div>
          <Label className="tracking-widest block mb-4">UNDERSTOOD INTENT</Label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-transparent max-w-4xl">
            <IntentField label="Use case" value={intent.useCase} />
            <IntentField label="Budget limit" value={intent.budget} />
            <IntentField label="Optimization priority" value={intent.priority} />
            <IntentField label="Form factor preference" value={intent.preference} />
          </div>
        </div>

        {/* Best match */}
        {selected && (
          <div className="mt-16">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase block mb-6">YOUR BEST MATCH</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="border border-white/[0.08] relative overflow-hidden aspect-square lg:aspect-auto min-h-[400px]">
                <ProductImage imageId={selected.id} category={selected.category} className="w-full h-full object-cover" />
              </div>
              
              <div className="glass-card glow-accent p-8 lg:p-12 border border-white/[0.08] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="label-mono text-ink-300">{selected.id}</span>
                    <span className="flex items-center gap-1.5 label-mono-light bg-white/5 border border-white/10 px-2.5 py-1 text-[9px] font-bold">
                      <Check className="w-3 h-3 text-white" /> 4/4 REQUIREMENTS MATCHED
                    </span>
                  </div>
                  
                  <h3 className="font-display text-3xl lg:text-4xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-br from-white to-ink-300 mt-2 leading-none">
                    {selected.name}
                  </h3>
                  <p className="mt-4 text-sm text-ink-200 leading-relaxed font-light">{selected.description}</p>

                  <div className="mt-8 pt-6 border-t border-white/[0.06]">
                    <Label className="tracking-widest block mb-4">MATCH RATIONALE</Label>
                    <div className="space-y-3">
                      <MatchReason text={`Use case context: "${selected.useCases[0]}" matches constraints`} />
                      <MatchReason text={`Price of ${formatINR(selected.price)} fits within parsed budget limit`} />
                      <MatchReason text={`Specs identify lightweight ${selected.specs['Weight'] || 'portable'} body build`} />
                      <MatchReason text={`Verified discoverability index: ${selected.aiDiscoverability}%`} />
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/[0.06]">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-display text-3xl font-black text-white">{formatINR(selected.price)}</span>
                    <span className="font-mono text-xs text-ink-300 font-bold">UNITS IN STOCK: {selected.inventory}</span>
                  </div>
                  
                  <button
                    onClick={() => addToBag(selected.id)}
                    className="w-full py-4 bg-white text-ink-950 font-black tracking-tight hover:bg-ink-100 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-ink-950" strokeWidth={3} /> ADD TO BAG
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-20">
            <Label className="tracking-widest block mb-6">AI RECOMMENDED COMPATIBLE ADDITIONS</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-transparent">
              {recommendations.map((rec) => (
                <div key={rec.id} className="glass-card glow-accent p-5 flex items-center gap-5 border border-white/[0.06] hover:border-white/20 transition-all duration-300">
                  <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                    <ProductImage imageId={rec.id} category={rec.category} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-base">{rec.name}</h4>
                    <span className="text-sm text-ink-300 block mt-1 font-mono">{formatINR(rec.price)}</span>
                  </div>
                  <button
                    onClick={() => addToBag(rec.id)}
                    className="label-mono bg-white text-ink-950 hover:bg-ink-100 px-4 py-2 hover:scale-105 active:scale-95 transition-all duration-200 font-black shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                  >
                    ADD
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other matches */}
        {matches.length > 1 && (
          <div className="mt-20">
            <Label className="tracking-widest block mb-6">ALTERNATIVE CANDIDATES</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-transparent">
              {matches.slice(1, 4).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className={`group text-left transition-all duration-300 flex flex-col justify-between p-5 border min-h-[120px] ${
                    selected?.id === m.id
                      ? 'bg-white text-ink-950 border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                      : 'glass-card border-white/[0.08] hover:border-white/30'
                  }`}
                >
                  <div>
                    <span className={`label-mono text-[9px] ${selected?.id === m.id ? 'text-ink-700' : 'text-ink-300'}`}>{m.id}</span>
                    <h4 className={`mt-1 font-bold text-sm leading-tight ${selected?.id === m.id ? 'text-ink-950' : 'text-white'}`}>{m.name}</h4>
                  </div>
                  <span className={`text-sm mt-4 font-mono ${selected?.id === m.id ? 'text-ink-950 font-bold' : 'text-ink-200'}`}>{formatINR(m.price)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Continue */}
        <div className="mt-16 flex justify-end">
          <button
            onClick={() => navigate('/buyer/bag')}
            className="inline-flex items-center gap-2 label-mono bg-white text-ink-950 px-6 py-3.5 hover:bg-ink-100 hover:scale-105 active:scale-95 transition-all duration-200 font-black shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            VIEW BAG <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </PageLayout>
  );
}

function parseIntent(query: string): ParsedIntent {
  const q = query.toLowerCase();
  let useCase = 'General';
  if (q.includes('coding') || q.includes('developer') || q.includes('programming')) useCase = 'Software Development';
  else if (q.includes('ml') || q.includes('machine learning') || q.includes('ai')) useCase = 'Machine Learning';
  else if (q.includes('gaming') || q.includes('game')) useCase = 'Gaming';
  else if (q.includes('minimal') || q.includes('desk')) useCase = 'Productivity';

  let budget = 'Open';
  const budgetMatch = q.match(/₹?\s*(\d+)\s*([lk]|lakh|k)/);
  if (budgetMatch) {
    const num = parseInt(budgetMatch[1]);
    const unit = budgetMatch[2];
    const total = unit.startsWith('l') ? num * 100000 : num * 1000;
    budget = `₹${total.toLocaleString('en-IN')}`;
  }

  let priority = 'Performance';
  if (q.includes('battery') || q.includes('portable') || q.includes('light')) priority = 'Portability';
  else if (q.includes('minimal')) priority = 'Design';

  let preference = 'Balanced';
  if (q.includes('portable') || q.includes('light')) preference = 'Portable';
  else if (q.includes('minimal')) preference = 'Minimal';

  const budgetNum = budgetMatch
    ? (budgetMatch[2].startsWith('l') ? parseInt(budgetMatch[1]) * 100000 : parseInt(budgetMatch[1]) * 1000)
    : undefined;

  return { useCase, budget, budgetNum, priority, preference };
}

function IntentField({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink-950 p-4">
      <span className="label-mono text-ink-300">{label.toUpperCase()}</span>
      <div className="mt-2 text-white font-mono">{value}</div>
    </div>
  );
}

function MatchReason({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <Check className="w-3.5 h-3.5 text-white mt-0.5 flex-shrink-0" strokeWidth={2} />
      <span className="text-sm text-ink-100">{text}</span>
    </div>
  );
}
