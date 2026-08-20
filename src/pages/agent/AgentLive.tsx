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
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-transparent">
          <StatBlock label="ACTIVE RUNS" value={String(activeRuns.length)} />
          <StatBlock label="COMPLETED" value={String(completedRuns.length)} />
          <StatBlock label="BLOCKED" value={String(blockedRuns.length)} />
          <StatBlock label="TOTAL VALUE" value={formatINR(runs.reduce((s, r) => s + r.value, 0))} />
        </div>

        {/* Live indicator */}
        <div className="mt-16 flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          </span>
          <Label className="tracking-widest">LIVE TRACE STREAM</Label>
        </div>

        {/* Runs */}
        {loading ? (
          <div className="mt-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 shimmer-bg border border-white/[0.08]" />
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {runs.map((run) => (
              <Link
                key={run.id}
                to={`/agent/runs/${run.id}`}
                className="group glass-card glow-accent p-6 flex flex-col md:flex-row md:items-center justify-between border border-white/[0.08] hover:border-white/20 transition-all duration-300 gap-4"
              >
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-white font-bold">{run.id}</span>
                      <StatusDot status={run.status === 'COMPLETED' ? 'success' : run.status === 'BLOCKED' ? 'blocked' : 'active'} label={run.status} />
                    </div>
                    <p className="mt-2 text-sm text-ink-200 font-light">{run.intent}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 label-mono text-[9px] text-ink-300">
                      <span>BUYER: {run.buyer.toUpperCase()}</span>
                      <span>·</span>
                      <span>MERCHANT: {run.merchant.toUpperCase()}</span>
                      <span>·</span>
                      <span>DURATION: {run.duration.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-5 border-t border-white/[0.06] md:border-0 pt-4 md:pt-0 self-stretch md:self-auto">
                  <span className="font-display text-2xl font-black text-white">{formatINR(run.value)}</span>
                  <ArrowRight className="w-5 h-5 text-ink-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" strokeWidth={1.5} />
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
    <div className="glass-card glow-accent p-6 lg:p-8 border border-white/[0.08] relative overflow-hidden group/stat">
      {/* Top accent glow effect */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover/stat:translate-x-full transition-transform duration-1000" />
      
      <span className="label-mono text-[9px] text-ink-300">{label}</span>
      <div className="mt-4 font-display text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-ink-200 tracking-tight leading-none">{value}</div>
    </div>
  );
}
