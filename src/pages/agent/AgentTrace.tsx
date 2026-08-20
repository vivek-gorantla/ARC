import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowDown, Search, Package, ShoppingCart, Shield, CreditCard, CheckCircle, Check, X } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { Label, StatusDot } from '@/components/ui';
import { agentService } from '@/services';
import type { AgentRun, AgentStep } from '@/types';
import { formatINR } from '@/utils/format';

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
  'RECOVERY SUGGESTED': ArrowLeft,
};

export function AgentTrace() {
  const { id } = useParams();
  const [run, setRun] = useState<AgentRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStep, setSelectedStep] = useState<AgentStep | null>(null);

  useEffect(() => {
    agentService.getRun(id || '').then((r) => {
      setRun(r || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <PageLayout mode="agent">
        <div className="px-5 lg:px-8 py-16">
          <div className="w-32 h-4 shimmer-bg mb-8" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 shimmer-bg border border-line" />
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!run) {
    return (
      <PageLayout mode="agent">
        <div className="px-5 lg:px-8 py-22 text-center">
          <p className="label-mono text-ink-300">RUN NOT FOUND</p>
          <Link to="/agent/runs" className="mt-4 inline-block label-mono-light underline">
            BACK TO RUNS
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout mode="agent">
      <div className="px-5 lg:px-8 py-8 lg:py-12">
        <Link to="/agent/runs" className="inline-flex items-center gap-2 label-mono text-ink-300 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> BACK TO RUNS
        </Link>

        {/* Run header */}
        <div className="border border-line p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-white text-lg">{run.id}</span>
                <StatusDot
                  status={run.status === 'COMPLETED' ? 'success' : run.status === 'BLOCKED' ? 'blocked' : 'active'}
                  label={run.status}
                />
              </div>
              <p className="mt-2 text-ink-200">{run.intent}</p>
              <div className="mt-2 flex items-center gap-4 label-mono text-ink-300">
                <span>BUYER: {run.buyer}</span>
                <span>·</span>
                <span>MERCHANT: {run.merchant}</span>
                <span>·</span>
                <span>STARTED: {run.startedAt}</span>
              </div>
            </div>
            <div className="flex gap-8">
              <div>
                <Label>VALUE</Label>
                <div className="mt-1 text-2xl font-extrabold tracking-tighter text-white">{formatINR(run.value)}</div>
              </div>
              <div>
                <Label>DURATION</Label>
                <div className="mt-1 text-2xl font-extrabold tracking-tighter text-white">{run.duration}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Execution graph */}
          <div>
            <Label>EXECUTION GRAPH</Label>
            <div className="mt-6 relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-line" />
              {run.steps.map((step, i) => {
                const Icon = stepIcons[step.label] || Search;
                const isActive = selectedStep?.id === step.id;
                return (
                  <div key={step.id}>
                    <button
                      onClick={() => setSelectedStep(step)}
                      className={`relative flex items-center gap-4 w-full text-left pl-0 pr-4 py-3 transition-colors ${
                        isActive ? 'bg-ink-900' : 'hover:bg-ink-900/50'
                      }`}
                    >
                      <div
                        className={`relative z-10 w-10 h-10 border flex items-center justify-center flex-shrink-0 ${
                          step.status === 'success' ? 'border-white bg-ink-950' :
                          step.status === 'blocked' ? 'border-ink-300 bg-ink-950' :
                          'border-line bg-ink-950'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-white" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3">
                          <span className="label-mono text-ink-300">{step.timestamp}</span>
                          <span className={`label-mono-light ${isActive ? 'text-white' : ''}`}>{step.label}</span>
                        </div>
                        {step.output && (
                          <p className="mt-1 text-sm text-ink-200 font-mono truncate">{step.output}</p>
                        )}
                      </div>
                      {step.policyResult && step.policyResult !== 'N/A' && (
                        step.policyResult === 'PASSED' ? (
                          <Check className="w-4 h-4 text-white" strokeWidth={2} />
                        ) : (
                          <X className="w-4 h-4 text-ink-200" strokeWidth={2} />
                        )
                      )}
                    </button>
                    {i < run.steps.length - 1 && (
                      <div className="ml-5 flex items-center">
                        <ArrowDown className="w-3 h-3 text-ink-300" strokeWidth={1} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step detail */}
          <div className="border border-line p-6 h-fit sticky top-20">
            {selectedStep ? (
              <div>
                <Label>STEP DETAIL</Label>
                <h3 className="mt-4 text-xl font-bold text-white">{selectedStep.label}</h3>
                <span className="label-mono text-ink-300 mt-1 block">{selectedStep.timestamp}</span>

                {selectedStep.tool && (
                  <div className="mt-4">
                    <Label>TOOL CALLED</Label>
                    <div className="mt-1 font-mono text-sm text-white bg-ink-900 border border-line p-3">
                      {selectedStep.tool}
                    </div>
                  </div>
                )}

                {selectedStep.input && (
                  <div className="mt-4">
                    <Label>INPUT</Label>
                    <div className="mt-1 font-mono text-sm text-ink-200 bg-ink-900 border border-line p-3">
                      {selectedStep.input}
                    </div>
                  </div>
                )}

                {selectedStep.output && (
                  <div className="mt-4">
                    <Label>OUTPUT</Label>
                    <div className="mt-1 font-mono text-sm text-white bg-ink-900 border border-line p-3">
                      {selectedStep.output}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <Label>REASONING SUMMARY</Label>
                  <p className="mt-2 text-sm text-ink-100 leading-relaxed">{selectedStep.reasoning}</p>
                </div>

                {selectedStep.policyResult && selectedStep.policyResult !== 'N/A' && (
                  <div className="mt-4">
                    <Label>POLICY RESULT</Label>
                    <div className={`mt-2 inline-flex items-center gap-2 px-3 py-2 border ${
                      selectedStep.policyResult === 'PASSED' ? 'border-white' : 'border-ink-300'
                    }`}>
                      {selectedStep.policyResult === 'PASSED' ? (
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                      ) : (
                        <X className="w-3.5 h-3.5 text-ink-200" strokeWidth={2} />
                      )}
                      <span className="label-mono-light">{selectedStep.policyResult}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="label-mono text-ink-300">SELECT A STEP</p>
                <p className="mt-2 text-sm text-ink-200">Click any node in the execution graph to see its details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
