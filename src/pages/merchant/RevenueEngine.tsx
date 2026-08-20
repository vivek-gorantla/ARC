import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { SectionHeading, Label } from '@/components/ui';
import { useCountUp } from '@/hooks/useCountUp';
import { useReveal } from '@/hooks/useReveal';
import { revenueService } from '@/services';
import type { RevenueMetrics } from '@/types';
import { formatINR, formatINRCompact } from '@/utils/format';

export function RevenueEngine() {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    revenueService.getMetrics().then((m) => {
      setMetrics(m);
      setLoading(false);
    });
  }, []);

  if (loading || !metrics) {
    return (
      <PageLayout mode="merchant">
        <div className="px-5 lg:px-8 py-16">
          <div className="w-3/4 h-16 shimmer-bg mb-8" />
          <div className="grid grid-cols-2 gap-px bg-line">
            <div className="bg-ink-950 h-64 shimmer-bg" />
            <div className="bg-ink-950 h-64 shimmer-bg" />
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout mode="merchant">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <SectionHeading
          lines={['LET AI', 'GROW THE CART.']}
          subtitle="The AI agent optimizes every cart — upselling, cross-selling, and matching products to increase order value and reduce abandonment."
        />

        {/* Uplift callout */}
        <div className="mt-14 border border-white p-8 lg:p-12 text-center">
          <Label>REVENUE UPLIFT</Label>
          <div className="mt-4 text-7xl lg:text-8xl font-extrabold tracking-tighter text-white">
            +34%
          </div>
          <p className="mt-4 text-ink-300 text-sm">Illustrative demo data — compared to baseline non-AI checkout</p>
        </div>

        {/* Comparison */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-px bg-line">
          <ComparisonPanel
            title="WITHOUT AI"
            data={metrics.withoutAi}
            highlight={false}
          />
          <ComparisonPanel
            title="WITH AI"
            data={metrics.withAi}
            highlight
          />
        </div>

        {/* Drivers */}
        <div className="mt-16">
          <Label>REVENUE DRIVERS</Label>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-px bg-line">
            {metrics.drivers.map((driver) => (
              <DriverCard key={driver.label} label={driver.label} value={driver.value} />
            ))}
          </div>
        </div>

        {/* Flow */}
        <div className="mt-16 border border-line p-6 lg:p-10">
          <Label>HOW AI GROWS THE CART</Label>
          <div className="mt-6 flex flex-wrap items-center gap-3 lg:gap-4">
            {['PRODUCT VIEW', 'AI MATCH', 'UPSELL', 'CROSS-SELL', 'BUNDLE', 'HIGHER AOV', 'REVENUE'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-3 lg:gap-4">
                <span className="label-mono-light text-sm lg:text-base">{step}</span>
                {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-ink-300" strokeWidth={1} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function ComparisonPanel({
  title,
  data,
  highlight,
}: {
  title: string;
  data: { conversion: number; aov: number; revenue: number };
  highlight: boolean;
}) {
  const { ref, visible } = useReveal();
  const conversion = useCountUp(data.conversion, 1400, visible);
  const aov = useCountUp(data.aov, 1400, visible);
  const revenue = useCountUp(data.revenue, 1400, visible);

  return (
    <div
      ref={ref}
      className={`p-8 lg:p-12 ${highlight ? 'bg-ink-900' : 'bg-ink-950'}`}
    >
      <span className={`label-mono ${highlight ? 'text-white' : 'text-ink-300'}`}>{title}</span>
      <div className="mt-8 space-y-6">
        <ComparisonMetric label="Conversion" value={`${conversion.toFixed(1)}%`} highlight={highlight} />
        <ComparisonMetric label="Average order value" value={formatINR(Math.round(aov))} highlight={highlight} />
        <ComparisonMetric label="Revenue" value={formatINRCompact(Math.round(revenue))} highlight={highlight} big />
      </div>
    </div>
  );
}

function ComparisonMetric({
  label,
  value,
  highlight,
  big = false,
}: {
  label: string;
  value: string;
  highlight: boolean;
  big?: boolean;
}) {
  return (
    <div className="border-b border-line pb-4 last:border-b-0">
      <span className="label-mono text-ink-300">{label}</span>
      <div className={`mt-2 font-extrabold tracking-tighter ${highlight ? 'text-white' : 'text-ink-100'} ${
        big ? 'text-4xl lg:text-5xl' : 'text-2xl lg:text-3xl'
      }`}>
        {value}
      </div>
    </div>
  );
}

function DriverCard({ label, value }: { label: string; value: number }) {
  const { ref, visible } = useReveal();
  const animated = useCountUp(value, 1400, visible);
  return (
    <div ref={ref} className="bg-ink-950 p-6">
      <span className="label-mono">{label}</span>
      <div className="mt-4 text-3xl lg:text-4xl font-extrabold tracking-tighter text-white">
        +{Math.round(animated)}%
      </div>
    </div>
  );
}
