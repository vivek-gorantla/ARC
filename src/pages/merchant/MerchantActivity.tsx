import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Package, Check, ShoppingCart, Shield, CreditCard, CheckCircle } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { SectionHeading, Label } from '@/components/ui';
import { agentService } from '@/services';
import type { AgentRun } from '@/types';

export function MerchantActivity() {
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentService.getRuns().then((r) => {
      setRuns(r);
      setLoading(false);
    });
  }, []);

  const featuredRun = runs[0];

  return (
    <PageLayout mode="merchant">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <SectionHeading
          lines={['EVERYTHING', 'THE AGENT DOES.']}
          subtitle="A complete timeline of every AI decision — from buyer intent to payment success. Every action is traceable."
        />

        {loading || !featuredRun ? (
          <div className="mt-12 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 shimmer-bg border border-line" />
            ))}
          </div>
        ) : (
          <div className="mt-12 max-w-3xl">
            {/* Run header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="label-mono text-ink-300">RUN {featuredRun.id}</span>
                <h3 className="mt-1 text-2xl font-bold text-white">{featuredRun.intent}</h3>
              </div>
              <Link
                to={`/agent/runs/${featuredRun.id}`}
                className="label-mono-light flex items-center gap-2 border border-line px-3 py-2 hover:border-white transition-colors"
              >
                VIEW TRACE <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-px bg-line" />

              {featuredRun.steps.map((step, i) => (
                <TimelineStep
                  key={step.id}
                  step={step}
                  index={i}
                  isLast={i === featuredRun.steps.length - 1}
                />
              ))}
            </div>

            {/* More runs */}
            <div className="mt-16">
              <Label>OTHER RECENT RUNS</Label>
              <div className="mt-4 space-y-px">
                {runs.slice(1).map((run) => (
                  <Link
                    key={run.id}
                    to={`/agent/runs/${run.id}`}
                    className="group flex items-center justify-between bg-ink-950 hover:bg-ink-900 p-4 border border-line transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="label-mono text-ink-300">{run.id}</span>
                      <span className="text-ink-100 text-sm">{run.intent}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`label-mono ${run.status === 'COMPLETED' ? 'text-white' : 'text-ink-300'}`}>
                        {run.status}
                      </span>
                      <ArrowRight className="w-3 h-3 text-ink-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

const stepIcons: Record<string, typeof Search> = {
  'BUYER INTENT RECEIVED': Search,
  'CATALOG SEARCHED': Search,
  'PRODUCT SELECTED': Package,
  'UPSELL GENERATED': ShoppingCart,
  'CUSTOMER ACCEPTED': Check,
  'POLICY CHECK': Shield,
  'PAYMENT INITIATED': CreditCard,
  'PAYMENT SUCCESSFUL': CheckCircle,
  'CART ASSEMBLED': ShoppingCart,
  'RECOVERY SUGGESTED': ArrowRight,
};

function TimelineStep({
  step,
  index,
  isLast,
}: {
  step: AgentRun['steps'][number];
  index: number;
  isLast: boolean;
}) {
  const Icon = stepIcons[step.label] || Search;
  const statusColor =
    step.status === 'success' ? 'border-white bg-ink-950' :
    step.status === 'blocked' ? 'border-ink-300 bg-ink-950' :
    'border-line bg-ink-950';

  return (
    <div
      className="relative pl-14 pb-8 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Node */}
      <div className={`absolute left-2 top-1 w-7 h-7 border ${statusColor} flex items-center justify-center`}>
        <Icon className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div>
        <div className="flex items-baseline gap-3">
          <span className="label-mono text-ink-300">{step.timestamp}</span>
          <span className="label-mono-light">{step.label}</span>
        </div>

        {step.input && (
          <div className="mt-2 text-sm text-ink-200 font-mono">
            <span className="text-ink-300">INPUT: </span>
            {step.input}
          </div>
        )}
        {step.output && (
          <div className="mt-1 text-sm text-white font-mono">
            <span className="text-ink-300">OUTPUT: </span>
            {step.output}
          </div>
        )}

        {step.reasoning && (
          <div className="mt-3 border-l-2 border-line pl-4">
            <span className="label-mono text-ink-300">WHY?</span>
            <p className="mt-1 text-sm text-ink-100">{step.reasoning}</p>
          </div>
        )}

        {step.policyResult && step.policyResult !== 'N/A' && (
          <div className="mt-2">
            <span className={`label-mono ${step.policyResult === 'PASSED' ? 'text-white' : 'text-ink-200'}`}>
              {step.policyResult === 'PASSED' ? '✓ PASSED' : '✗ BLOCKED'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
