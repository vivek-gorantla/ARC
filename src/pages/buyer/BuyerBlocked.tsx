import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { Label } from '@/components/ui';

export function BuyerBlocked() {
  const requested = 82499;
  const allowed = 80000;
  const difference = requested - allowed;

  return (
    <PageLayout mode="buyer">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        {/* Shield icon */}
        <div className="flex justify-center mb-12">
          <div className="w-20 h-20 border-2 border-white flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase text-center tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-ink-50 to-ink-300">
          <span className="block">PURCHASE</span>
          <span className="block text-ink-300">BLOCKED.</span>
        </h1>

        <p className="mt-8 text-center text-ink-300 font-light max-w-lg mx-auto leading-relaxed">
          This is a transaction safety mechanism. The autonomous payment was evaluated against your configured buyer spending policies and was blocked.
        </p>

        {/* Breakdown */}
        <div className="mt-12 max-w-md mx-auto border border-line">
          <div className="p-6 border-b border-line">
            <Label>REQUESTED</Label>
            <div className="mt-2 text-3xl font-extrabold tracking-tighter text-white">
              ₹{requested.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="p-6 border-b border-line">
            <Label>ALLOWED</Label>
            <div className="mt-2 text-3xl font-extrabold tracking-tighter text-white">
              ₹{allowed.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="p-6 border-b border-line bg-ink-900">
            <Label>DIFFERENCE</Label>
            <div className="mt-2 text-3xl font-extrabold tracking-tighter text-white">
              ₹{difference.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="p-6">
            <Label>REASON</Label>
            <p className="mt-2 text-ink-100">
              The requested purchase exceeds your configured spending limit of ₹{allowed.toLocaleString('en-IN')}.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/buyer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-ink-950 font-bold tracking-tight hover:bg-ink-100 transition-colors"
          >
            FIND AN ALTERNATIVE <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/merchant/policies"
            className="inline-flex items-center gap-2 px-6 py-3 border border-line hover:border-white transition-colors label-mono-light"
          >
            CHANGE LIMIT <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-12 text-center">
          <span className="label-mono text-ink-300">NO PAYMENT WAS INITIATED · NO FUNDS WERE MOVED</span>
        </div>
      </div>
    </PageLayout>
  );
}
