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
          <div className="mt-12 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 shimmer-bg border border-line" />
            ))}
          </div>
        ) : (
          <div className="mt-12 space-y-px bg-line">
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
    <div className="bg-ink-950 p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-8 items-center">
        {/* Primary */}
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 border border-white" />
          <div>
            <span className="label-mono text-ink-300">PRIMARY</span>
            <h3 className="mt-1 text-xl font-bold text-white">{rec.primary}</h3>
            <span className="text-ink-200 font-mono text-sm">{formatINR(rec.primaryPrice)}</span>
          </div>
        </div>

        {/* Plus */}
        <div className="flex items-center justify-center">
          <Plus className="w-6 h-6 text-ink-300" strokeWidth={1} />
        </div>

        {/* Secondary */}
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 border border-ink-300" />
          <div>
            <span className="label-mono text-ink-300">RECOMMENDED ADD-ON</span>
            <h3 className="mt-1 text-xl font-bold text-white">{rec.secondary}</h3>
            <span className="text-ink-200 font-mono text-sm">{formatINR(rec.secondaryPrice)}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-line grid grid-cols-3 gap-4">
        <div>
          <span className="label-mono">COMPATIBILITY</span>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 bg-ink-700">
              <div className="h-full bg-white" style={{ width: `${rec.compatibility}%` }} />
            </div>
            <span className="text-sm font-mono text-white">{rec.compatibility}%</span>
          </div>
        </div>
        <div>
          <span className="label-mono">HISTORICAL CONVERSION</span>
          <div className="mt-2 text-lg font-bold text-white font-mono">{rec.historicalConversion}%</div>
        </div>
        <div>
          <span className="label-mono">REVENUE OPPORTUNITY</span>
          <div className="mt-2 text-lg font-bold text-white font-mono">{formatINR(rec.secondaryPrice)}</div>
        </div>
      </div>

      {/* Toggle */}
      <div className="mt-6 flex items-center justify-between">
        <span className={`label-mono ${rec.enabled ? 'text-white' : 'text-ink-300'}`}>
          {rec.enabled ? '● ACTIVE' : '○ INACTIVE'}
        </span>
        <button
          onClick={() => onToggle(rec.id)}
          className={`px-5 py-2.5 border transition-colors flex items-center gap-2 ${
            rec.enabled
              ? 'border-white text-white bg-ink-800'
              : 'border-line text-ink-200 hover:border-ink-100'
          }`}
        >
          {rec.enabled ? (
            <>
              <Check className="w-3.5 h-3.5" /> ENABLED
            </>
          ) : (
            'ENABLE RECOMMENDATION'
          )}
        </button>
      </div>
    </div>
  );
}
