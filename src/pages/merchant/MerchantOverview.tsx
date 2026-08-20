import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Zap, ShoppingCart, IndianRupee } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { SectionHeading, MetricCard, Label } from '@/components/ui';
import { useCountUp } from '@/hooks/useCountUp';
import { useReveal } from '@/hooks/useReveal';
import { agentService } from '@/services';
import type { ActivityEvent } from '@/types';
import { formatINRCompact } from '@/utils/format';

export function MerchantOverview() {
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentService.getLiveActivity().then((events) => {
      setActivity(events);
      setLoading(false);
    });
  }, []);

  return (
    <PageLayout mode="merchant">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <SectionHeading
          lines={['YOUR STORE.', 'NOW AI-NATIVE.']}
          subtitle="Your products can be discovered, understood and purchased by AI buyers."
        />

        {/* Metrics */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-transparent">
          <MetricBlock label="AI-ASSISTED REVENUE" value={482000} format="compact" icon={IndianRupee} />
          <MetricBlock label="AI TRANSACTIONS" value={842} format="number" icon={Zap} />
          <MetricBlock label="CONVERSION UPLIFT" value={18.4} format="percent" icon={TrendingUp} />
          <MetricBlock label="UPSELL REVENUE" value={72400} format="compact" icon={ShoppingCart} />
        </div>

        {/* Story flow */}
        <div className="mt-16 lg:mt-22 glass-card glow-accent p-6 lg:p-10 border border-white/[0.08]">
          <Label className="tracking-widest">INFRASTRUCTURE STACK LIFECYCLE</Label>
          <div className="mt-6 flex flex-wrap items-center gap-3 lg:gap-4">
            {['MERCHANT', 'AI-READABLE', 'DISCOVERABLE', 'RECOMMENDABLE', 'TRANSACTABLE', 'REVENUE'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-3 lg:gap-4">
                <span className="label-mono-light text-sm font-semibold tracking-wider">{step}</span>
                {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-white/40" strokeWidth={1.5} />}
              </div>
            ))}
          </div>
        </div>

        {/* Live activity */}
        <div className="mt-16 lg:mt-22">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl md:text-3xl font-black uppercase text-white tracking-tight">LIVE AI ACTIVITY</h2>
            <Link to="/merchant/activity" className="label-mono text-ink-300 hover:text-white transition-colors flex items-center gap-2 group">
              VIEW ALL <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <ActivitySkeleton />
          ) : (
            <div className="glass-card border border-white/[0.08] divide-y divide-white/[0.06] bg-white/[0.01]">
              {activity.slice(0, 7).map((event, i) => (
                <ActivityRow key={event.id} event={event} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="mt-16 lg:mt-22 grid grid-cols-1 md:grid-cols-3 gap-6 bg-transparent">
          <QuickLink to="/merchant/catalog" label="VIEW CATALOG" description="20 AI-readable products and active inventory nodes." />
          <QuickLink to="/merchant/ai-commerce" label="AI COMMERCE CONTEXT" description="Inspect logs of how agents interact with your store API." />
          <QuickLink to="/merchant/revenue" label="REVENUE OPTIMIZATION" description="Fine-tune bundle algorithms and conversion configurations." />
        </div>
      </div>
    </PageLayout>
  );
}

function MetricBlock({
  label,
  value,
  format,
  icon: Icon,
}: {
  label: string;
  value: number;
  format: 'compact' | 'number' | 'percent';
  icon: typeof IndianRupee;
}) {
  const { ref, visible } = useReveal();
  const animated = useCountUp(value, 1400, visible);

  const display =
    format === 'compact'
      ? formatINRCompact(Math.round(animated))
      : format === 'percent'
        ? `+${animated.toFixed(1)}%`
        : Math.round(animated).toLocaleString('en-IN');

  return (
    <div ref={ref} className="glass-card glow-accent p-6 lg:p-8 border border-white/[0.08] relative overflow-hidden group/metric">
      {/* Top accent glow effect */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover/metric:translate-x-full transition-transform duration-1000" />
      
      <div className="flex items-center justify-between mb-6">
        <span className="label-mono text-[9px] text-ink-300">{label}</span>
        <Icon className="w-4 h-4 text-ink-300" strokeWidth={1.5} />
      </div>
      <div className="font-display text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-ink-200 tracking-tight leading-none">
        {display}
      </div>
    </div>
  );
}

const typeIcons: Record<string, string> = {
  discovery: '◇',
  recommendation: '◈',
  upsell: '◆',
  payment: '◉',
  policy: '◎',
};

function ActivityRow({ event, index }: { event: ActivityEvent; index: number }) {
  return (
    <div
      className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] last:border-b-0 animate-slide-in-right hover:bg-white/[0.01] transition-colors"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center gap-4">
        <span className="text-white text-lg font-bold">{typeIcons[event.type]}</span>
        <div>
          <div className="label-mono-light text-[10px] tracking-wider font-bold">{event.label}</div>
          <div className="text-xs text-ink-300 font-light mt-1">{event.detail}</div>
        </div>
      </div>
      <span className="font-mono text-[10px] text-ink-400 font-bold whitespace-nowrap ml-4">{event.timeAgo}</span>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="glass-card border border-white/[0.08] divide-y divide-white/[0.06]">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 shimmer-bg" />
            <div className="space-y-2">
              <div className="w-48 h-3 shimmer-bg" />
              <div className="w-32 h-2.5 shimmer-bg" />
            </div>
          </div>
          <div className="w-16 h-3 shimmer-bg" />
        </div>
      ))}
    </div>
  );
}

function QuickLink({ to, label, description }: { to: string; label: string; description: string }) {
  return (
    <Link to={to} className="group glass-card glow-accent p-6 lg:p-8 flex flex-col justify-between overflow-hidden border border-white/[0.08] min-h-[160px]">
      <div className="flex items-center justify-between mb-4">
        <span className="font-display text-lg font-bold text-white group-hover:translate-x-1 transition-transform duration-300">{label}</span>
        <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" strokeWidth={1.5} />
      </div>
      <p className="text-xs text-ink-300 leading-relaxed font-light">{description}</p>
    </Link>
  );
}
