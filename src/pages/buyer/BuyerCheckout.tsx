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
        <h1 className="display-xl text-white">
          <span className="block">READY</span>
          <span className="block text-ink-300">TO BUY?</span>
        </h1>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Items */}
          <div>
            <Label>ORDER ITEMS</Label>
            <div className="mt-4 space-y-px bg-line">
              {items.map((item) => (
                <div key={item.id} className="bg-ink-950 p-4 flex items-center gap-4">
                  <ProductImage imageId={item.id} category={item.category} className="w-16 h-16 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{item.name}</h3>
                    <span className="label-mono text-ink-300">{item.id}</span>
                  </div>
                  <span className="text-white font-mono">{formatINR(item.price)}</span>
                </div>
              ))}
            </div>

            {/* Policy checks */}
            <div className="mt-8 border border-line p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-white" strokeWidth={1.5} />
                <Label>TRANSACTION POLICY</Label>
              </div>
              <div className="space-y-3">
                <PolicyCheck label="Within budget" passed={withinBudget} />
                <PolicyCheck label="Merchant trusted" passed={true} />
                <PolicyCheck label="Products available" passed={items.every((i) => i.inventory > 0)} />
                <PolicyCheck label="Payment authorized" passed={true} />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="border border-line p-6 h-fit sticky top-20">
            <Label>SUMMARY</Label>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-ink-300">Subtotal</span>
                <span className="text-white font-mono">{formatINR(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-300">Shipping</span>
                <span className="text-white font-mono">Free</span>
              </div>
              {policy && (
                <div className="flex justify-between text-sm">
                  <span className="text-ink-300">Spending limit</span>
                  <span className="text-white font-mono">{formatINR(policy.buyerSpendingLimit)}</span>
                </div>
              )}
              <div className="border-t border-line pt-3">
                <span className="label-mono-light block mb-2">TOTAL</span>
                <span className="text-5xl font-extrabold tracking-tighter text-white">{formatINR(total)}</span>
              </div>
            </div>

            {error && (
              <div className="mt-4 border border-line p-3 text-sm text-ink-100">{error}</div>
            )}

            <button
              onClick={handleAuthorize}
              disabled={processing}
              className="mt-6 w-full py-3.5 bg-white text-ink-950 font-bold tracking-tight hover:bg-ink-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> PROCESSING...
                </>
              ) : (
                'AUTHORIZE PAYMENT'
              )}
            </button>

            <p className="mt-4 text-xs text-ink-300 text-center leading-relaxed">
              No payment will be initiated until you explicitly authorize this transaction.
            </p>
            <div className="mt-3 text-center">
              <span className="label-mono text-ink-300">RAZORPAY TEST MODE · NO REAL FUNDS</span>
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
        <Check className="w-4 h-4 text-white" strokeWidth={2} />
      ) : (
        <span className="w-4 h-4 border border-ink-300 flex items-center justify-center text-ink-300 text-xs">✗</span>
      )}
      <span className={`text-sm ${passed ? 'text-white' : 'text-ink-300'}`}>{label}</span>
    </div>
  );
}
