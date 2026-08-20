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
        <h1 className="display-xl text-white">PURCHASES.</h1>

        {loading ? (
          <div className="mt-12 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 shimmer-bg border border-line" />
            ))}
          </div>
        ) : paidOrders.length === 0 ? (
          <div className="mt-12 border border-line py-20 text-center">
            <p className="label-mono text-ink-300">NO PURCHASES YET</p>
            <Link to="/buyer" className="mt-4 inline-block label-mono-light underline">
              START SHOPPING
            </Link>
          </div>
        ) : (
          <div className="mt-12 space-y-px bg-line">
            {paidOrders.map((order) => (
              <div key={order.id} className="bg-ink-950 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-white text-lg">{order.id}</span>
                      <span className="flex items-center gap-1.5 label-mono-light border border-white px-2 py-1">
                        <Check className="w-3 h-3" /> PAID
                      </span>
                      {order.aiAssisted && (
                        <span className="label-mono text-ink-300 border border-line px-2 py-1">AI-ASSISTED</span>
                      )}
                    </div>
                    <div className="mt-3 text-ink-200">
                      {order.items.map((item) => (
                        <div key={item.productId} className="text-sm">{item.name} · {formatINR(item.price)}</div>
                      ))}
                    </div>
                    <span className="label-mono text-ink-300 mt-3 block">{order.timestamp}</span>
                  </div>
                  <span className="text-2xl font-extrabold tracking-tighter text-white">{formatINR(order.amount)}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-line flex gap-4">
                  <Link to="/agent/audit" className="label-mono text-ink-300 hover:text-white transition-colors">
                    VIEW AUDIT TRAIL →
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
