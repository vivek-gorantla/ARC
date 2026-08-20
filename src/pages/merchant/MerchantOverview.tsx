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
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-px bg-line">
          <MetricBlock label="AI-ASSISTED REVENUE" value={482000} format="compact" icon={IndianRupee} />
          <MetricBlock label="AI TRANSACTIONS" value={842} format="number" icon={Zap} />
          <MetricBlock label="CONVERSION UPLIFT" value={18.4} format="percent" icon={TrendingUp} />
          <MetricBlock label="UPSELL REVENUE" value={72400} format="compact" icon={ShoppingCart} />
        </div>

        {/* Story flow */}
        <div className="mt-16 lg:mt-22 border border-line p-6 lg:p-10">
          <Label>THE FLOW</Label>
          <div className="mt-6 flex flex-wrap items-center gap-3 lg:gap-4">
            {['MERCHANT', 'AI-READABLE', 'DISCOVERABLE', 'RECOMMENDABLE', 'TRANSACTABLE', 'REVENUE'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-3 lg:gap-4">
                <span className="label-mono-light text-sm lg:text-base">{step}</span>
                {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-ink-300" strokeWidth={1} />}
              </div>
            ))}
          </div>
        </div>

        {/* Live activity */}
        <div className="mt-16 lg:mt-22">
          <div className="flex items-center justify-between mb-6">
            <h2 className="display-md text-white">LIVE AI ACTIVITY</h2>
            <Link to="/merchant/activity" className="label-mono text-ink-300 hover:text-white transition-colors flex items-center gap-2">
              VIEW ALL <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <ActivitySkeleton />
          ) : (
            <div className="border border-line">
              {activity.slice(0, 7).map((event, i) => (
                <ActivityRow key={event.id} event={event} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="mt-16 lg:mt-22 grid grid-cols-1 md:grid-cols-3 gap-px bg-line">
          <QuickLink to="/merchant/catalog" label="VIEW CATALOG" description="20 AI-readable products" />
          <QuickLink to="/merchant/ai-commerce" label="AI COMMERCE" description="See how agents talk to your store" />
          <QuickLink to="/merchant/revenue" label="REVENUE ENGINE" description="AI-driven cart optimization" />
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
    <div ref={ref} className="bg-ink-950 p-5 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <span className="label-mono">{label}</span>
        <Icon className="w-4 h-4 text-ink-300" strokeWidth={1.5} />
      </div>
      <div className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tighter text-white">
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
      className="flex items-center justify-between px-5 py-4 border-b border-line last:border-b-0 animate-slide-in-right"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center gap-4">
        <span className="text-ink-300 text-lg">{typeIcons[event.type]}</span>
        <div>
          <div className="label-mono-light">{event.label}</div>
          <div className="text-sm text-ink-200 mt-0.5">{event.detail}</div>
        </div>
      </div>
      <span className="label-mono text-ink-300 whitespace-nowrap ml-4">{event.timeAgo}</span>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="border border-line">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between px-5 py-4 border-b border-line last:border-b-0">
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
    <Link to={to} className="group bg-ink-950 p-6 lg:p-8 hover:bg-ink-900 transition-colors">
      <div className="flex items-center justify-between">
        <span className="label-mono-light text-lg">{label}</span>
        <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-white group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
      </div>
      <p className="mt-2 text-ink-300 text-sm">{description}</p>
    </Link>
  );
}
