import { useEffect, useState } from 'react';
import { Shield, IndianRupee, Percent, UserCheck, ToggleLeft, ToggleRight } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { SectionHeading, Label } from '@/components/ui';
import { policyService } from '@/services';
import type { PolicyConfig } from '@/types';
import { formatINR } from '@/utils/format';

export function MerchantPolicies() {
  const [policy, setPolicy] = useState<PolicyConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    policyService.getPolicy().then((p) => {
      setPolicy(p);
      setLoading(false);
    });
  }, []);

  if (loading || !policy) {
    return (
      <PageLayout mode="merchant">
        <div className="px-5 lg:px-8 py-16">
          <div className="w-3/4 h-16 shimmer-bg mb-8" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 shimmer-bg border border-line" />
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout mode="merchant">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <SectionHeading
          lines={['MONEY NEEDS', 'BOUNDARIES.']}
          subtitle="The AI agent operates within strict financial guardrails. It cannot exceed transaction limits, apply unauthorized discounts, or purchase without consent."
        />

        {/* Warning banner */}
        <div className="mt-12 border border-line p-6 flex items-start gap-4">
          <Shield className="w-5 h-5 text-white flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <span className="label-mono-light">AI DOES NOT HAVE UNRESTRICTED FINANCIAL AUTHORITY</span>
            <p className="mt-2 text-sm text-ink-200">
              Every transaction is evaluated against these policies before payment is initiated. Violations block the transaction automatically.
            </p>
          </div>
        </div>

        {/* Policy controls */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-px bg-line">
          <PolicyField
            icon={IndianRupee}
            label="MAX TRANSACTION"
            value={formatINR(policy.maxTransaction)}
          />
          <PolicyField
            icon={Percent}
            label="MAX AI DISCOUNT"
            value={`${policy.maxAiDiscount}%`}
          />
          <PolicyField
            icon={UserCheck}
            label="REQUIRE HUMAN APPROVAL"
            value={`Above ${formatINR(policy.humanApprovalThreshold)}`}
          />
          <PolicyField
            icon={IndianRupee}
            label="BUYER SPENDING LIMIT"
            value={formatINR(policy.buyerSpendingLimit)}
          />
          <ToggleField
            label="ALLOW AI UPSELL"
            enabled={policy.allowAiUpsell}
            onToggle={() => setPolicy({ ...policy, allowAiUpsell: !policy.allowAiUpsell })}
          />
          <ToggleField
            label="ALLOW AUTONOMOUS PURCHASE"
            enabled={policy.allowAutonomousPurchase}
            onToggle={() => setPolicy({ ...policy, allowAutonomousPurchase: !policy.allowAutonomousPurchase })}
          />
        </div>

        {/* Policy engine flow */}
        <div className="mt-16 border border-line p-6 lg:p-10">
          <Label>POLICY EVALUATION FLOW</Label>
          <div className="mt-8 flex flex-col items-center gap-0">
            <div className="px-6 py-3 border border-line">
              <span className="label-mono-light">TRANSACTION REQUEST</span>
            </div>
            <div className="w-px h-8 bg-line" />
            <div className="px-6 py-3 border border-white">
              <span className="label-mono-light">POLICY ENGINE</span>
            </div>
            <div className="w-px h-8 bg-line" />
            <div className="grid grid-cols-2 gap-px bg-line w-full max-w-md">
              <div className="bg-ink-950 p-4 text-center">
                <span className="label-mono">BUDGET LIMIT</span>
              </div>
              <div className="bg-ink-950 p-4 text-center">
                <span className="label-mono">MERCHANT RULES</span>
              </div>
            </div>
            <div className="w-px h-8 bg-line" />
            <div className="flex gap-4">
              <div className="px-6 py-3 border border-white">
                <span className="label-mono-light">ALLOW ✓</span>
              </div>
              <div className="px-6 py-3 border border-ink-300">
                <span className="label-mono text-ink-200">BLOCK ✗</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function PolicyField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Shield;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-ink-950 p-6 lg:p-8">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-ink-300" strokeWidth={1.5} />
        <Label>{label}</Label>
      </div>
      <div className="text-3xl lg:text-4xl font-extrabold tracking-tighter text-white">
        {value}
      </div>
    </div>
  );
}

function ToggleField({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-ink-950 p-6 lg:p-8 flex items-center justify-between">
      <Label>{label}</Label>
      <button onClick={onToggle} className="flex items-center gap-3 group">
        <span className={`label-mono ${enabled ? 'text-white' : 'text-ink-300'}`}>
          {enabled ? 'ON' : 'OFF'}
        </span>
        {enabled ? (
          <ToggleRight className="w-8 h-8 text-white" strokeWidth={1.5} />
        ) : (
          <ToggleLeft className="w-8 h-8 text-ink-300" strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
}
