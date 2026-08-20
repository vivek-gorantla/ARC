import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { Label } from '@/components/ui';
import { orderService } from '@/services';
import type { Order } from '@/types';
import { formatINR } from '@/utils/format';

export function BuyerPurchases() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrders().then((o) => {
      setOrders(o);
      setLoading(false);
    });
  }, []);

  const paidOrders = orders.filter((o) => o.paymentStatus === 'PAID');

  return (
    <PageLayout mode="buyer">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-ink-300 mb-8">PURCHASES.</h1>

        {loading ? (
          <div className="mt-12 space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 shimmer-bg border border-white/[0.08]" />
            ))}
          </div>
        ) : paidOrders.length === 0 ? (
          <div className="mt-12 glass-card py-20 text-center border border-white/[0.08]">
            <p className="label-mono text-ink-300">NO PURCHASES YET</p>
            <Link to="/buyer" className="mt-4 inline-block label-mono bg-white text-ink-950 px-5 py-2 font-black shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              START SHOPPING
            </Link>
          </div>
        ) : (
          <div className="mt-12 space-y-6">
            {paidOrders.map((order) => (
              <div key={order.id} className="glass-card glow-accent p-6 border border-white/[0.08]">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-white text-lg font-bold">{order.id}</span>
                      <span className="flex items-center gap-1.5 label-mono-light bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-bold">
                        <Check className="w-3 h-3 text-white" /> PAID
                      </span>
                      {order.aiAssisted && (
                        <span className="label-mono text-ink-300 bg-white/[0.02] border border-white/10 px-2.5 py-0.5 text-[9px] font-bold">AI-ASSISTED</span>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      {order.items.map((item) => (
                        <div key={item.productId} className="text-sm text-ink-200 font-light">
                          <span className="font-semibold text-white">{item.name}</span> · <span className="font-mono text-xs">{formatINR(item.price)}</span>
                        </div>
                      ))}
                    </div>
                    <span className="label-mono text-ink-400 text-[9px] mt-4 block">{order.timestamp}</span>
                  </div>
                  
                  <div className="flex flex-col items-start md:items-end justify-between self-stretch">
                    <span className="font-display text-2xl font-black text-white">{formatINR(order.amount)}</span>
                    <Link to="/agent/audit" className="mt-4 label-mono text-white hover:text-ink-200 transition-colors text-[9px] border-b border-white pb-0.5">
                      VIEW AUDIT TRAIL →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
