import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Info, CreditCard, ShoppingCart, Shield, AlertTriangle, Search } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { SectionHeading, Label } from '@/components/ui';
import { auditService } from '@/services';
import type { AuditEvent, AuditCategory } from '@/types';

const filters: { label: string; value: AuditCategory | 'ALL' }[] = [
  { label: 'ALL', value: 'ALL' },
  { label: 'PAYMENTS', value: 'PAYMENT' },
  { label: 'RECOMMENDATIONS', value: 'RECOMMENDATION' },
  { label: 'CART', value: 'CART' },
  { label: 'POLICY', value: 'POLICY' },
  { label: 'FAILURES', value: 'FAILURE' },
];

const categoryIcons: Record<string, typeof Check> = {
  PAYMENT: CreditCard,
  RECOMMENDATION: ShoppingCart,
  CART: ShoppingCart,
  POLICY: Shield,
  FAILURE: AlertTriangle,
  DISCOVERY: Search,
};

export function AgentAudit() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [filtered, setFiltered] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  useEffect(() => {
    auditService.getEvents().then((e) => {
      setEvents(e);
      setFiltered(e);
      setLoading(false);
    });
  }, []);

  const handleFilter = (filter: string) => {
    setActiveFilter(filter);
    auditService.getByCategory(filter).then(setFiltered);
  };

  return (
    <PageLayout mode="agent">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <SectionHeading
          lines={['EVERY ACTION.', 'TRACEABLE.']}
          subtitle="A complete, filterable audit trail of every agent decision — payments, recommendations, cart actions, policy checks, and failures."
        />

        {/* Filters */}
        <div className="mt-12 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => handleFilter(f.value)}
              className={`px-4 py-2 label-mono border transition-colors ${
                activeFilter === f.value
                  ? 'border-white text-white bg-ink-800'
                  : 'border-line text-ink-300 hover:text-ink-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        {loading ? (
          <div className="mt-8 space-y-px bg-line">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-ink-950 h-16 shimmer-bg" />
            ))}
          </div>
        ) : (
          <div className="mt-8 border border-line">
            {filtered.map((event, i) => {
              const Icon = categoryIcons[event.category] || Info;
              return (
                <div
                  key={event.id}
                  className="flex items-center gap-4 px-5 py-4 border-b border-line last:border-b-0 hover:bg-ink-900/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className={`w-9 h-9 border flex items-center justify-center flex-shrink-0 ${
                    event.status === 'success' ? 'border-white' :
                    event.status === 'blocked' || event.status === 'failed' ? 'border-ink-300' :
                    'border-line'
                  }`}>
                    <Icon className="w-4 h-4 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3">
                      <span className="label-mono text-ink-300">{event.timestamp}</span>
                      <span className="label-mono-light">{event.action}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-ink-200 truncate">{event.detail}</p>
                  </div>
                  {event.runId && (
                    <Link
                      to={`/agent/runs/${event.runId}`}
                      className="label-mono text-ink-300 hover:text-white transition-colors whitespace-nowrap"
                    >
                      {event.runId}
                    </Link>
                  )}
                  <span>
                    {event.status === 'success' && <Check className="w-4 h-4 text-white" strokeWidth={2} />}
                    {(event.status === 'blocked' || event.status === 'failed') && <X className="w-4 h-4 text-ink-200" strokeWidth={2} />}
                    {event.status === 'info' && <span className="w-2 h-2 rounded-full bg-ink-300" />}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
