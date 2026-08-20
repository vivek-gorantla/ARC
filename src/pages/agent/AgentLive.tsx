import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { SectionHeading, Label, StatusDot } from '@/components/ui';
import { agentService } from '@/services';
import type { AgentRun } from '@/types';
import { formatINR } from '@/utils/format';

export function AgentLive() {
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentService.getRuns().then((r) => {
      setRuns(r);
      setLoading(false);
    });
  }, []);

  const activeRuns = runs.filter((r) => r.status === 'IN_PROGRESS');
  const completedRuns = runs.filter((r) => r.status === 'COMPLETED');
  const blockedRuns = runs.filter((r) => r.status === 'BLOCKED');

  return (
    <PageLayout mode="agent">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <SectionHeading
          lines={['SEE THE', 'AGENT THINK.']}
          subtitle="Every agent run — from buyer intent to payment — with full decision trace and policy evaluation."
        />

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-px bg-line">
          <StatBlock label="ACTIVE RUNS" value={String(activeRuns.length)} />
          <StatBlock label="COMPLETED" value={String(completedRuns.length)} />
          <StatBlock label="BLOCKED" value={String(blockedRuns.length)} />
          <StatBlock label="TOTAL VALUE" value={formatINR(runs.reduce((s, r) => s + r.value, 0))} />
        </div>

        {/* Live indicator */}
        <div className="mt-12 flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot bg-white" />
          </span>
          <Label>LIVE FEED</Label>
        </div>

        {/* Runs */}
        {loading ? (
          <div className="mt-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 shimmer-bg border border-line" />
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-px bg-line">
            {runs.map((run) => (
              <Link
                key={run.id}
                to={`/agent/runs/${run.id}`}
                className="group bg-ink-950 hover:bg-ink-900 p-5 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 border border-line flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-white">{run.id}</span>
                      <StatusDot status={run.status === 'COMPLETED' ? 'success' : run.status === 'BLOCKED' ? 'blocked' : 'active'} label={run.status} />
                    </div>
                    <p className="mt-1 text-sm text-ink-200">{run.intent}</p>
                    <div className="mt-1 flex items-center gap-4 label-mono text-ink-300">
                      <span>{run.buyer}</span>
                      <span>·</span>
                      <span>{run.merchant}</span>
                      <span>·</span>
                      <span>{run.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-white">{formatINR(run.value)}</span>
                  <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-white group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink-950 p-5 lg:p-8">
      <span className="label-mono">{label}</span>
      <div className="mt-4 text-3xl lg:text-4xl font-extrabold tracking-tighter text-white">{value}</div>
    </div>
  );
}
