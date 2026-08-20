import { useEffect, useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { SectionHeading, Label } from '@/components/ui';
import { recommendationService } from '@/services';
import type { Recommendation } from '@/types';
import { formatINR } from '@/utils/format';

export function Recommendations() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recommendationService.getRecommendations().then((r) => {
      setRecs(r);
      setLoading(false);
    });
  }, []);

  const toggle = (id: string) => {
    setRecs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    );
  };

  return (
    <PageLayout mode="merchant">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <SectionHeading
          lines={['AI KNOWS', 'WHAT GOES TOGETHER.']}
          subtitle="The recommendation engine analyzes compatibility, historical conversion, and use-case alignment to build bundles that increase cart value."
        />

        {loading ? (
          <div className="mt-12 space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 shimmer-bg border border-white/[0.08]" />
            ))}
          </div>
        ) : (
          <div className="mt-12 space-y-6">
            {recs.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} onToggle={toggle} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function RecommendationCard({
  rec,
  onToggle,
}: {
  rec: Recommendation;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="glass-card glow-accent p-6 lg:p-8 border border-white/[0.08]">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-8 items-center">
        {/* Primary */}
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-2.5 border border-white/40 rounded-full" />
          <div>
            <span className="label-mono text-ink-300 text-[9px] tracking-widest">PRIMARY BASE PRODUCT</span>
            <h3 className="mt-1 text-xl font-bold text-white font-display uppercase tracking-tight">{rec.primary}</h3>
            <span className="text-ink-200 font-mono text-xs">{formatINR(rec.primaryPrice)}</span>
          </div>
        </div>

        {/* Plus */}
        <div className="flex items-center justify-center">
          <Plus className="w-6 h-6 text-white/60" strokeWidth={2} />
        </div>

        {/* Secondary */}
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-2.5 bg-white border border-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)] animate-pulse" />
          <div>
            <span className="label-mono text-ink-300 text-[9px] tracking-widest">RECOMMENDED CROSS-SELL</span>
            <h3 className="mt-1 text-xl font-bold text-white font-display uppercase tracking-tight">{rec.secondary}</h3>
            <span className="text-ink-200 font-mono text-xs">{formatINR(rec.secondaryPrice)}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 pt-6 border-t border-white/[0.06] grid grid-cols-3 gap-4">
        <div>
          <span className="label-mono text-[9px]">COMPATIBILITY INDEX</span>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-[3px] bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" style={{ width: `${rec.compatibility}%` }} />
            </div>
            <span className="text-xs font-mono text-white font-bold">{rec.compatibility}%</span>
          </div>
        </div>
        <div>
          <span className="label-mono text-[9px]">HISTORICAL CONVERSION</span>
          <div className="mt-2 text-base font-bold text-white font-mono">{rec.historicalConversion}%</div>
        </div>
        <div>
          <span className="label-mono text-[9px]">REVENUE OPPORTUNITY</span>
          <div className="mt-2 text-base font-bold text-white font-mono">{formatINR(rec.secondaryPrice)}</div>
        </div>
      </div>

      {/* Toggle */}
      <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between">
        <span className={`label-mono text-[9px] tracking-widest flex items-center gap-2 ${rec.enabled ? 'text-white font-bold' : 'text-ink-300'}`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${rec.enabled ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse' : 'bg-ink-300'}`} />
          {rec.enabled ? 'ENGINE ACTIVE' : 'ENGINE INACTIVE'}
        </span>
        
        <button
          onClick={() => onToggle(rec.id)}
          className={`px-5 py-2.5 border transition-all duration-200 text-xs font-bold tracking-tight ${
            rec.enabled
              ? 'border-white text-ink-950 bg-white font-black shadow-[0_0_12px_rgba(255,255,255,0.15)] hover:bg-ink-100'
              : 'border-white/10 text-ink-200 hover:border-white hover:text-white hover:bg-white/5 bg-white/[0.01]'
          }`}
        >
          {rec.enabled ? (
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" strokeWidth={3} /> CONTEXT ENABLED
            </span>
          ) : (
            'ENABLE BUNDLE'
          )}
        </button>
      </div>
    </div>
  );
}
