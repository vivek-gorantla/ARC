import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ArrowDown } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { Label } from '@/components/ui';

export function PaymentSuccess() {
  const [order, setOrder] = useState<{ items: string[]; total: number } | null>(null);
  const [animatePath, setAnimatePath] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem('arc_last_order');
    if (stored) {
      setOrder(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatePath((prev) => (prev < 3 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const total = order?.total ?? 77498;

  return (
    <PageLayout mode="buyer">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        {/* Success checkmark */}
        <div className="flex justify-center mb-12">
          <div className="w-20 h-20 border-2 border-white flex items-center justify-center animate-fade-in">
            <Check className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
        </div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase text-center tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-ink-50 to-ink-300">
          <span className="block">PURCHASE</span>
          <span className="block">COMPLETE.</span>
        </h1>

        <div className="mt-10 text-center">
          <span className="font-display text-5xl lg:text-6xl font-black tracking-tighter text-white">
            ₹{total.toLocaleString('en-IN')}
          </span>
          <p className="mt-4 text-ink-300 font-light">Payment successful. Agent transaction logged.</p>
        </div>

        {/* Transaction path animation */}
        <div className="mt-16 max-w-2xl mx-auto border border-line p-8 lg:p-12">
          <Label>TRANSACTION PATH</Label>
          <div className="mt-8 flex flex-col items-center gap-0">
            {[
              { label: 'AI BUYER', active: animatePath >= 0 },
              { label: 'ARC', active: animatePath >= 1 },
              { label: 'RAZORPAY', active: animatePath >= 2 },
              { label: 'CONFIRMED', active: animatePath >= 3 },
            ].map((node, i, arr) => (
              <div key={node.label}>
                <div
                  className={`px-8 py-4 border transition-all duration-500 ${
                    node.active ? 'border-white bg-ink-900' : 'border-line bg-ink-950 opacity-40'
                  }`}
                >
                  <span className={`label-mono-light text-lg ${node.active ? 'opacity-100' : 'opacity-40'}`}>
                    {node.label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <ArrowDown
                    className={`w-5 h-5 my-2 transition-opacity duration-300 ${
                      animatePath > i ? 'text-white opacity-100' : 'text-ink-300 opacity-30'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <span className="label-mono text-ink-300">RAZORPAY TEST MODE · NO REAL FUNDS MOVED</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/buyer/purchases"
            className="inline-flex items-center gap-2 px-6 py-3 border border-line hover:border-white transition-colors label-mono-light"
          >
            VIEW ORDER <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/agent/audit"
            className="inline-flex items-center gap-2 px-6 py-3 border border-line hover:border-white transition-colors label-mono-light"
          >
            VIEW AUDIT TRAIL <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/buyer')}
            className="label-mono text-ink-300 hover:text-white transition-colors"
          >
            ← BACK TO SEARCH
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
