import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { SectionHeading, Label } from '@/components/ui';
import { useCountUp } from '@/hooks/useCountUp';
import { useReveal } from '@/hooks/useReveal';
import { revenueService } from '@/services';
import type { RevenueMetrics } from '@/types';
import { formatINRCompact } from '@/utils/format';

export function AiCommerce() {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    revenueService.getMetrics().then((m) => {
      setMetrics(m);
      setLoading(false);
    });
  }, []);

  const stages = ['DISCOVER', 'QUERY', 'RECOMMEND', 'CART', 'PURCHASE'];

  return (
    <PageLayout mode="merchant">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <SectionHeading
          lines={['YOUR STORE', 'CAN TALK TO AGENTS.']}
          subtitle="AI buyers discover your catalog, query your products, receive recommendations, and transact — all within your policy boundaries."
        />

        {/* Metrics */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-px bg-line">
          <MetricBlock label="AI DISCOVERABILITY" value={98} format="percent" />
          <MetricBlock label="AI BUYER REQUESTS" value={3842} format="number" />
          <MetricBlock label="AI CONVERSIONS" value={842} format="number" />
          <MetricBlock label="REVENUE FROM AI" value={482000} format="compact" />
        </div>

        {/* Flow visualization */}
        <div className="mt-16 lg:mt-22">
          <Label>AGENT TRANSACTION FLOW</Label>
          <div className="mt-8 border border-line p-6 lg:p-12">
            <div className="flex flex-col items-center gap-0">
              <div className="label-mono text-ink-300 mb-6">AI BUYER</div>
              <ArrowDown className="w-4 h-4 text-ink-300 animate-pulse" />
              {stages.map((stage, i) => (
                <FlowStage key={stage} label={stage} index={i} />
              ))}
              <ArrowDown className="w-4 h-4 text-ink-300 animate-pulse" />
              <div className="mt-6 px-6 py-3 border border-white">
                <span className="label-mono-light">REVENUE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations link */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-line">
          <Link to="/merchant/ai-commerce/recommendations" className="group bg-ink-950 p-8 hover:bg-ink-900 transition-colors">
            <Label>RECOMMENDATIONS</Label>
            <h3 className="mt-4 text-2xl font-bold text-white">AI knows what goes together</h3>
            <p className="mt-2 text-ink-300">Configure upsell and cross-sell bundles.</p>
            <span className="mt-4 inline-flex items-center gap-2 label-mono-light">
              CONFIGURE <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link to="/merchant/campaigns" className="group bg-ink-950 p-8 hover:bg-ink-900 transition-colors">
            <Label>CAMPAIGNS</Label>
            <h3 className="mt-4 text-2xl font-bold text-white">Don't send campaigns. Send context.</h3>
            <p className="mt-2 text-ink-300">Define objectives and let AI act.</p>
            <span className="mt-4 inline-flex items-center gap-2 label-mono-light">
              ORCHESTRATE <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}

function MetricBlock({
  label,
  value,
  format,
}: {
  label: string;
  value: number;
  format: 'compact' | 'number' | 'percent';
}) {
  const { ref, visible } = useReveal();
  const animated = useCountUp(value, 1400, visible);
  const display =
    format === 'compact'
      ? formatINRCompact(Math.round(animated))
      : format === 'percent'
        ? `${Math.round(animated)}%`
        : Math.round(animated).toLocaleString('en-IN');

  return (
    <div ref={ref} className="bg-ink-950 p-5 lg:p-8">
      <span className="label-mono">{label}</span>
      <div className="mt-4 text-4xl lg:text-5xl font-extrabold tracking-tighter text-white">
        {display}
      </div>
    </div>
  );
}

function FlowStage({ label, index }: { label: string; index: number }) {
  const { ref, visible } = useReveal({ threshold: 0.3 });
  return (
    <>
      <div
        ref={ref}
        className={`mt-6 px-8 py-4 border transition-all duration-500 ${
          visible ? 'border-white bg-ink-900' : 'border-line bg-ink-950'
        }`}
        style={{ transitionDelay: `${index * 200}ms` }}
      >
        <span className={`label-mono-light text-lg ${visible ? 'opacity-100' : 'opacity-40'}`}>
          {label}
        </span>
      </div>
      {index < 4 && <ArrowDown className="w-4 h-4 text-ink-300 mt-3" />}
    </>
  );
}
