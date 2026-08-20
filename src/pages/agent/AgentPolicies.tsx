import { PageLayout } from '@/components/PageLayout';
import { SectionHeading, Label } from '@/components/ui';
import { IndianRupee, Percent, UserCheck, Shield, ArrowDown } from 'lucide-react';

export function AgentPolicies() {
  return (
    <PageLayout mode="agent">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <SectionHeading
          lines={['POLICY', 'ENGINE.']}
          subtitle="The policy engine evaluates every agent action against budget limits, merchant rules, and authorization requirements before allowing or blocking."
        />

        {/* Technical diagram */}
        <div className="mt-16 border border-line p-6 lg:p-12 font-mono">
          {/* AI Agent */}
          <div className="flex flex-col items-center">
            <div className="px-8 py-4 border border-line">
              <span className="label-mono-light text-lg">AI AGENT</span>
            </div>
            <div className="w-px h-12 bg-line" />
            <ArrowDown className="w-4 h-4 text-ink-300 -mt-3" strokeWidth={1} />

            {/* Policy Engine */}
            <div className="px-8 py-4 border border-white bg-ink-900">
              <span className="label-mono-light text-lg">POLICY ENGINE</span>
            </div>
            <div className="w-px h-12 bg-line" />
            <ArrowDown className="w-4 h-4 text-ink-300 -mt-3" strokeWidth={1} />

            {/* Split */}
            <div className="grid grid-cols-2 gap-12 w-full max-w-md">
              <div className="flex flex-col items-center">
                <div className="w-px h-8 bg-line" />
                <div className="px-6 py-3 border border-line w-full text-center">
                  <span className="label-mono">BUDGET LIMIT</span>
                </div>
                <div className="mt-2 text-xs text-ink-300 text-center">
                  Buyer spending cap<br />Max transaction value
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-px h-8 bg-line" />
                <div className="px-6 py-3 border border-line w-full text-center">
                  <span className="label-mono">MERCHANT RULES</span>
                </div>
                <div className="mt-2 text-xs text-ink-300 text-center">
                  Max AI discount<br />Human approval threshold
                </div>
              </div>
            </div>

            {/* Converge */}
            <div className="grid grid-cols-2 gap-12 w-full max-w-md">
              <div className="flex justify-center">
                <div className="w-px h-8 bg-line" />
              </div>
              <div className="flex justify-center">
                <div className="w-px h-8 bg-line" />
              </div>
            </div>

            {/* Decision */}
            <div className="flex gap-4">
              <div className="px-8 py-4 border border-white">
                <span className="label-mono-light text-lg">ALLOW ✓</span>
              </div>
              <div className="px-8 py-4 border border-ink-300">
                <span className="label-mono text-ink-200 text-lg">BLOCK ✗</span>
              </div>
            </div>
          </div>
        </div>

        {/* Policy list */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-line">
          <PolicyRow icon={IndianRupee} label="MAX TRANSACTION" value="₹1,00,000" />
          <PolicyRow icon={Percent} label="MAX AI DISCOUNT" value="10%" />
          <PolicyRow icon={UserCheck} label="HUMAN APPROVAL" value="Above ₹5,000" />
          <PolicyRow icon={Shield} label="AUTONOMOUS PURCHASE" value="OFF" />
        </div>

        {/* Note */}
        <div className="mt-12 border border-line p-6">
          <Label>NOTE</Label>
          <p className="mt-2 text-sm text-ink-100">
            The agent never bypasses the policy engine. Every transaction — regardless of value — is evaluated before
            payment is initiated. Blocked transactions are logged with full context and a recovery suggestion is generated.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

function PolicyRow({ icon: Icon, label, value }: { icon: typeof Shield; label: string; value: string }) {
  return (
    <div className="bg-ink-950 p-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-ink-300" strokeWidth={1.5} />
        <Label>{label}</Label>
      </div>
      <span className="text-xl font-bold text-white font-mono">{value}</span>
    </div>
  );
}
