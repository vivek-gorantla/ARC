import { useState } from 'react';
import { Sparkles, Target, Users, Package, Wallet, Clock, ArrowRight } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { SectionHeading, Label } from '@/components/ui';
import { formatINR } from '@/utils/format';

export function Campaigns() {
  const [campaign, setCampaign] = useState({
    objective: 'Increase developer laptop sales',
    audience: 'High-intent visitors',
    product: 'Developer Pro 14',
    aiAction: 'Recommend + bundle USB-C Hub',
    budget: 50000,
    duration: '7 days',
  });

  return (
    <PageLayout mode="merchant">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <SectionHeading
          lines={["DON'T SEND", 'CAMPAIGNS.', 'SEND CONTEXT.']}
          subtitle="Define an objective and let the AI agent find the right audience, recommend the right products, and act within your budget."
        />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-px bg-line">
          {/* Form */}
          <div className="bg-ink-950 p-6 lg:p-10">
            <Label>CAMPAIGN DEFINITION</Label>
            <div className="mt-8 space-y-6">
              <Field icon={Target} label="OBJECTIVE" value={campaign.objective} onChange={(v) => setCampaign({ ...campaign, objective: v })} />
              <Field icon={Users} label="AUDIENCE" value={campaign.audience} onChange={(v) => setCampaign({ ...campaign, audience: v })} />
              <Field icon={Package} label="PRODUCT" value={campaign.product} onChange={(v) => setCampaign({ ...campaign, product: v })} />
              <Field icon={Sparkles} label="AI ACTION" value={campaign.aiAction} onChange={(v) => setCampaign({ ...campaign, aiAction: v })} />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Wallet className="w-3.5 h-3.5 text-ink-300" strokeWidth={1.5} />
                  <Label>BUDGET</Label>
                </div>
                <input
                  type="number"
                  value={campaign.budget}
                  onChange={(e) => setCampaign({ ...campaign, budget: Number(e.target.value) })}
                  className="w-full bg-ink-900 border border-line px-4 py-3 text-white font-mono focus:border-ink-100 outline-none"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-3.5 h-3.5 text-ink-300" strokeWidth={1.5} />
                  <Label>DURATION</Label>
                </div>
                <input
                  value={campaign.duration}
                  onChange={(e) => setCampaign({ ...campaign, duration: e.target.value })}
                  className="w-full bg-ink-900 border border-line px-4 py-3 text-white font-mono focus:border-ink-100 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-ink-950 p-6 lg:p-10">
            <Label>AI ACTION PREVIEW</Label>
            <div className="mt-8 space-y-px">
              <PreviewRow label="OBJECTIVE" value={campaign.objective} />
              <PreviewRow label="AUDIENCE" value={campaign.audience} />
              <PreviewRow label="PRODUCT" value={campaign.product} />
              <PreviewRow label="AI ACTION" value={campaign.aiAction} />
              <PreviewRow label="BUDGET" value={formatINR(campaign.budget)} />
              <PreviewRow label="DURATION" value={campaign.duration} />
            </div>

            <div className="mt-8 border border-line p-6">
              <Label>WHAT THE AI WILL DO</Label>
              <div className="mt-4 space-y-4">
                <PreviewStep text={`Identify ${campaign.audience.toLowerCase()} browsing the store`} />
                <ArrowRight className="w-4 h-4 text-ink-300 rotate-90 mx-auto" strokeWidth={1} />
                <PreviewStep text={`Recommend ${campaign.product} when intent matches`} />
                <ArrowRight className="w-4 h-4 text-ink-300 rotate-90 mx-auto" strokeWidth={1} />
                <PreviewStep text={`Apply AI action: ${campaign.aiAction.toLowerCase()}`} />
                <ArrowRight className="w-4 h-4 text-ink-300 rotate-90 mx-auto" strokeWidth={1} />
                <PreviewStep text={`Track revenue against ${formatINR(campaign.budget)} budget`} />
              </div>
            </div>

            <button className="mt-8 w-full py-3.5 bg-white text-ink-950 font-bold tracking-tight hover:bg-ink-100 transition-colors">
              LAUNCH CAMPAIGN
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-3.5 h-3.5 text-ink-300" strokeWidth={1.5} />
        <Label>{label}</Label>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-ink-900 border border-line px-4 py-3 text-white focus:border-ink-100 outline-none transition-colors"
      />
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3 border-b border-line">
      <span className="label-mono text-ink-300">{label}</span>
      <span className="text-sm text-white font-mono text-right">{value}</span>
    </div>
  );
}

function PreviewStep({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-ink-300 mt-0.5">→</span>
      <span className="text-sm text-ink-100">{text}</span>
    </div>
  );
}
