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
          <Label>UNDERSTOOD</Label>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-px bg-line max-w-3xl">
            <IntentField label="Use case" value={intent.useCase} />
            <IntentField label="Budget" value={intent.budget} />
            <IntentField label="Priority" value={intent.priority} />
            <IntentField label="Preference" value={intent.preference} />
          </div>
        </div>

        {/* Best match */}
        {selected && (
          <div className="mt-16">
            <h2 className="display-lg text-white">YOUR BEST MATCH</h2>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-px bg-line">
              <div className="bg-ink-950">
                <ProductImage imageId={selected.id} category={selected.category} className="aspect-square lg:aspect-auto lg:h-full" />
              </div>
              <div className="bg-ink-950 p-6 lg:p-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="label-mono text-ink-300">{selected.id}</span>
                  <span className="flex items-center gap-1.5 label-mono-light border border-white px-2 py-1">
                    <Check className="w-3 h-3" /> 4/4 REQUIREMENTS MATCHED
                  </span>
                </div>
                <h3 className="display-sm text-white mt-2">{selected.name}</h3>
                <p className="mt-4 text-ink-200">{selected.description}</p>

                <div className="mt-6">
                  <Label>WHY THIS MATCHES</Label>
                  <div className="mt-3 space-y-2">
                    <MatchReason text={`Use case: ${selected.useCases[0]}`} />
                    <MatchReason text={`Price ${formatINR(selected.price)} within budget`} />
                    <MatchReason text={`${selected.specs['Weight'] || 'Portable'} — meets portability preference`} />
                    <MatchReason text={`AI discoverability: ${selected.aiDiscoverability}%`} />
                  </div>
                </div>

                <div className="mt-8 flex items-baseline gap-4">
                  <span className="text-4xl font-extrabold tracking-tighter text-white">{formatINR(selected.price)}</span>
                  <span className="label-mono text-ink-300">IN STOCK: {selected.inventory}</span>
                </div>

                <button
                  onClick={() => addToBag(selected.id)}
                  className="mt-6 w-full py-3.5 bg-white text-ink-950 font-bold tracking-tight hover:bg-ink-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> ADD TO BAG
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-16">
            <Label>AI RECOMMENDS ADDING</Label>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-px bg-line">
              {recommendations.map((rec) => (
                <div key={rec.id} className="bg-ink-950 p-5 flex items-center gap-4">
                  <ProductImage imageId={rec.id} category={rec.category} className="w-16 h-16 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-white font-bold">{rec.name}</h4>
                    <span className="text-sm text-ink-300">{formatINR(rec.price)}</span>
                  </div>
                  <button
                    onClick={() => addToBag(rec.id)}
                    className="label-mono border border-line px-3 py-2 hover:border-white transition-colors"
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
          <div className="mt-16">
            <Label>OTHER MATCHES</Label>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line">
              {matches.slice(1, 4).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className={`bg-ink-950 p-5 text-left transition-colors ${
                    selected?.id === m.id ? 'bg-ink-900' : 'hover:bg-ink-900'
                  }`}
                >
                  <span className="label-mono text-ink-300">{m.id}</span>
                  <h4 className="mt-1 text-white font-bold">{m.name}</h4>
                  <span className="text-sm text-ink-300">{formatINR(m.price)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Continue */}
        <div className="mt-16 flex justify-end">
          <button
            onClick={() => navigate('/buyer/bag')}
            className="inline-flex items-center gap-2 label-mono-light border border-line px-5 py-3 hover:border-white transition-colors"
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
