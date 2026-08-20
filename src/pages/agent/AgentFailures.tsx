import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { SectionHeading, Label } from '@/components/ui';
import { recommendationService } from '@/services';
import type { FailureRecord } from '@/types';

export function AgentFailures() {
  const [failures, setFailures] = useState<FailureRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recommendationService.getFailures().then((f) => {
      setFailures(f);
      setLoading(false);
    });
  }, []);

  return (
    <PageLayout mode="agent">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <SectionHeading
          lines={['WHEN THINGS', 'GO WRONG.']}
          subtitle="The agent handles failures gracefully — blocking unsafe transactions, retaining state, and suggesting recovery paths."
        />

        {loading ? (
          <div className="mt-12 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 shimmer-bg border border-line" />
            ))}
          </div>
        ) : (
          <div className="mt-12 space-y-px bg-line">
            {failures.map((failure) => (
              <div key={failure.id} className="bg-ink-950 p-6 lg:p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="label-mono text-ink-300">{failure.type}</span>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="label-mono text-ink-300">{failure.runId}</span>
                      <span className="label-mono text-ink-300">·</span>
                      <span className="label-mono text-ink-300">{failure.timestamp}</span>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 label-mono-light border px-2 py-1 ${
                    failure.status === 'RESOLVED' ? 'border-white' : 'border-ink-300'
                  }`}>
                    {failure.status === 'RESOLVED' && <Check className="w-3 h-3" />}
                    {failure.status}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>REASON</Label>
                    <p className="mt-2 text-sm text-ink-100">{failure.reason}</p>
                  </div>
                  <div>
                    <Label>AGENT ACTION</Label>
                    <p className="mt-2 text-sm text-ink-100">{failure.agentAction}</p>
                  </div>
                </div>

                <div className="mt-6 border-l-2 border-white pl-4">
                  <Label>RECOVERY</Label>
                  <p className="mt-2 text-sm text-white">{failure.recovery}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-line">
                  <Link
                    to={`/agent/runs/${failure.runId}`}
                    className="inline-flex items-center gap-2 label-mono-light hover:underline"
                  >
                    VIEW RUN TRACE <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
