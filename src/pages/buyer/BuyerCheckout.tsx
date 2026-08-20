import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Shield, Loader2 } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { Label } from '@/components/ui';
import { ProductImage } from '@/components/ProductImage';
import { catalogService, policyService, paymentService } from '@/services';
import type { Product, PolicyConfig } from '@/types';
import { formatINR } from '@/utils/format';

export function BuyerCheckout() {
  const [items, setItems] = useState<Product[]>([]);
  const [policy, setPolicy] = useState<PolicyConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cartIds: string[] = JSON.parse(sessionStorage.getItem('arc_cart') || '[]');
    Promise.all([
      Promise.all(cartIds.map((id) => catalogService.getProduct(id))),
      policyService.getPolicy(),
    ]).then(([products, p]) => {
      const valid = products.filter((prod): prod is Product => !!prod);
      setItems(valid);
      setPolicy(p);
      setLoading(false);
    });
  }, []);

  const total = items.reduce((sum, p) => sum + p.price, 0);
  const withinBudget = policy ? total <= policy.buyerSpendingLimit : false;

  const handleAuthorize = async () => {
    setProcessing(true);
    setError(null);
    try {
      if (!withinBudget) {
        navigate('/buyer/blocked');
        return;
      }
      await paymentService.createPayment(total, 'ARC');
      await paymentService.verifyPayment(`pay_${Date.now()}`);
      sessionStorage.setItem('arc_last_order', JSON.stringify({ items: items.map((i) => i.name), total }));
      navigate('/buyer/success');
    } catch {
      setError('Payment processing failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <PageLayout mode="buyer">
        <div className="px-5 lg:px-8 py-16">
          <div className="w-1/2 h-16 shimmer-bg" />
          <div className="mt-8 h-96 shimmer-bg border border-line" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout mode="buyer">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-ink-300 mb-8">
          <span className="block">READY</span>
          <span className="block text-ink-300">TO BUY?</span>
        </h1>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Items */}
          <div>
            <Label className="tracking-widest block mb-4">ORDER ITEMS</Label>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="glass-card glow-accent p-4 flex items-center gap-4 border border-white/[0.08]">
                  <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                    <ProductImage imageId={item.id} category={item.category} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-sm leading-snug">{item.name}</h3>
                    <span className="label-mono text-[9px] text-ink-300/80 mt-1 block">{item.id}</span>
                  </div>
                  <span className="text-white font-mono font-bold">{formatINR(item.price)}</span>
                </div>
              ))}
            </div>

            {/* Policy checks */}
            <div className="mt-8 glass-card glow-accent p-6 border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-white" strokeWidth={1.5} />
                <Label className="tracking-widest">TRANSACTION SAFETY POLICIES</Label>
              </div>
              <div className="space-y-3">
                <PolicyCheck label="Within spending limit bounds" passed={withinBudget} />
                <PolicyCheck label="Merchant reputation trusted" passed={true} />
                <PolicyCheck label="Inventory allocations verified" passed={items.every((i) => i.inventory > 0)} />
                <PolicyCheck label="Payment authorization protocol passed" passed={true} />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="glass-card glow-accent p-6 h-fit sticky top-20 border border-white/[0.08]">
            <Label className="tracking-widest block mb-4">PURCHASE SUMMARY</Label>
            <div className="space-y-4">
              <div className="flex justify-between text-sm py-1">
                <span className="text-ink-300">Subtotal</span>
                <span className="text-white font-mono">{formatINR(total)}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-ink-300">Shipping</span>
                <span className="text-white font-mono">FREE</span>
              </div>
              {policy && (
                <div className="flex justify-between text-sm py-1 border-b border-white/[0.06] pb-4">
                  <span className="text-ink-300">Configured limit</span>
                  <span className="text-white font-mono">{formatINR(policy.buyerSpendingLimit)}</span>
                </div>
              )}
              <div className="pt-2">
                <span className="label-mono text-ink-200 block mb-2">TOTAL ORDER VALUE</span>
                <span className="font-display text-4xl font-black text-white">{formatINR(total)}</span>
              </div>
            </div>

            {error && (
              <div className="mt-4 border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-400 font-mono">{error}</div>
            )}

            <button
              onClick={handleAuthorize}
              disabled={processing}
              className="mt-6 w-full py-4 bg-white text-ink-950 font-black tracking-tight hover:bg-ink-100 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-ink-950" strokeWidth={3} /> PROCESSING TRANSACTION...
                </>
              ) : (
                'AUTHORIZE AUTONOMOUS PAYMENT'
              )}
            </button>

            <p className="mt-4 text-[10px] text-ink-300 text-center leading-relaxed">
              No real funds are transferred. Razorpay is operating in sandbox/test mode.
            </p>
            <div className="mt-3 text-center">
              <span className="label-mono text-ink-400 text-[9px]">TEST MODE · NO REAL FUNDS</span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function PolicyCheck({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {passed ? (
        <Check className="w-4 h-4 text-white shadow-[0_0_6px_rgba(255,255,255,0.4)]" strokeWidth={3.5} />
      ) : (
        <span className="w-4 h-4 border border-red-500 flex items-center justify-center text-red-500 font-bold text-[10px] bg-red-500/5">✗</span>
      )}
      <span className={`text-sm ${passed ? 'text-white' : 'text-red-400 font-medium'}`}>{label}</span>
    </div>
  );
}
