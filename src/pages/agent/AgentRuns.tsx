import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { SectionHeading, Label, StatusDot } from '@/components/ui';
import { agentService } from '@/services';
import type { AgentRun } from '@/types';
import { formatINR } from '@/utils/format';

export function AgentRuns() {
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentService.getRuns().then((r) => {
      setRuns(r);
      setLoading(false);
    });
  }, []);

  return (
    <PageLayout mode="agent">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <SectionHeading lines={['ALL RUNS.']} subtitle="Complete history of agent execution runs with status, value, and duration." />

        {loading ? (
          <div className="mt-12 space-y-px bg-line">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-ink-950 h-20 shimmer-bg" />
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-line">
            <div className="hidden md:grid grid-cols-[100px_1fr_100px_100px_100px_40px] gap-4 px-5 py-3 border-b border-line bg-ink-900">
              <span className="label-mono">RUN</span>
              <span className="label-mono">INTENT</span>
              <span className="label-mono">STATUS</span>
              <span className="label-mono text-right">VALUE</span>
              <span className="label-mono text-right">DURATION</span>
              <span></span>
            </div>
            {runs.map((run) => (
              <Link
                key={run.id}
                to={`/agent/runs/${run.id}`}
                className="group grid grid-cols-1 md:grid-cols-[100px_1fr_100px_100px_100px_40px] gap-4 px-5 py-4 border-b border-line last:border-b-0 hover:bg-ink-900/50 transition-colors items-center"
              >
                <span className="font-mono text-white text-sm">{run.id}</span>
                <span className="text-sm text-ink-200 truncate">{run.intent}</span>
                <StatusDot
                  status={run.status === 'COMPLETED' ? 'success' : run.status === 'BLOCKED' ? 'blocked' : 'active'}
                  label={run.status}
                />
                <span className="text-right font-mono text-white">{formatINR(run.value)}</span>
                <span className="text-right label-mono text-ink-300">{run.duration}</span>
                <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-white group-hover:translate-x-1 transition-all hidden md:block" strokeWidth={1.5} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
