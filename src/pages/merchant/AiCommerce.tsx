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
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-transparent">
          <MetricBlock label="AI DISCOVERABILITY" value={98} format="percent" />
          <MetricBlock label="AI BUYER REQUESTS" value={3842} format="number" />
          <MetricBlock label="AI CONVERSIONS" value={842} format="number" />
          <MetricBlock label="REVENUE FROM AI" value={482000} format="compact" />
        </div>

        {/* Flow visualization */}
        <div className="mt-16 lg:mt-22">
          <Label className="tracking-widest">AGENT TRANSACTION PROTOCOL</Label>
          <div className="mt-8 glass-card glow-accent p-6 lg:p-12 border border-white/[0.08]">
            <div className="flex flex-col items-center gap-0">
              <div className="label-mono text-ink-300 mb-6">AI BUYER INTENT</div>
              <ArrowDown className="w-4 h-4 text-ink-300 animate-pulse" />
              {stages.map((stage, i) => (
                <FlowStage key={stage} label={stage} index={i} />
              ))}
              <ArrowDown className="w-4 h-4 text-ink-300 animate-pulse mt-4" />
              <div className="mt-6 px-8 py-4 bg-white text-ink-950 font-black shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <span className="label-mono text-ink-950 font-bold text-base tracking-widest">REVENUE GENERATED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations link */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 bg-transparent">
          <Link to="/merchant/ai-commerce/recommendations" className="group glass-card glow-accent p-8 border border-white/[0.08] hover:border-white/30 transition-all flex flex-col justify-between min-h-[220px]">
            <div>
              <Label className="tracking-widest">RECOMMENDATION GRAPH</Label>
              <h3 className="mt-4 font-display text-2xl font-black text-white uppercase leading-snug">AI knows what goes together</h3>
              <p className="mt-2 text-xs text-ink-300 font-light leading-relaxed">Configure automatic upsell nodes and cross-sell compatibility metrics.</p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 label-mono text-white text-[10px] tracking-widest font-bold group-hover:translate-x-1 transition-transform">
              CONFIGURE ALGORITHM <ArrowRight className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </span>
          </Link>
          <Link to="/merchant/campaigns" className="group glass-card glow-accent p-8 border border-white/[0.08] hover:border-white/30 transition-all flex flex-col justify-between min-h-[220px]">
            <div>
              <Label className="tracking-widest">CAMPAIGN ORCHESTRATION</Label>
              <h3 className="mt-4 font-display text-2xl font-black text-white uppercase leading-snug">Don't send campaigns. Send context.</h3>
              <p className="mt-2 text-xs text-ink-300 font-light leading-relaxed">Define declarative context parameters and let autonomous agents execute campaigns.</p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 label-mono text-white text-[10px] tracking-widest font-bold group-hover:translate-x-1 transition-transform">
              ORCHESTRATE AGENTS <ArrowRight className="w-3.5 h-3.5 text-white" strokeWidth={3} />
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
    <div ref={ref} className="glass-card glow-accent p-6 lg:p-8 border border-white/[0.08] relative overflow-hidden group/metric">
      {/* Top accent glow effect */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover/metric:translate-x-full transition-transform duration-1000" />
      
      <span className="label-mono text-[9px] text-ink-300">{label}</span>
      <div className="mt-4 font-display text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-ink-200 tracking-tight leading-none">
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
          visible ? 'border-white bg-white text-ink-950 font-black shadow-[0_0_15px_rgba(255,255,255,0.15)] scale-105' : 'border-white/10 bg-white/[0.01] text-ink-300'
        }`}
        style={{ transitionDelay: `${index * 200}ms` }}
      >
        <span className="label-mono text-sm tracking-widest font-bold">
          {label}
        </span>
      </div>
      {index < 4 && <ArrowDown className="w-4 h-4 text-ink-300 mt-4 animate-pulse" />}
    </>
  );
}
