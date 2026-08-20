import { useEffect, useState } from 'react';
import { Check, Clock, X } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { SectionHeading, Label } from '@/components/ui';
import { orderService } from '@/services';
import type { Order } from '@/types';
import { formatINR } from '@/utils/format';

export function MerchantOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrders().then((o) => {
      setOrders(o);
      setLoading(false);
    });
  }, []);

  return (
    <PageLayout mode="merchant">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <SectionHeading lines={['ORDERS.']} subtitle="Every transaction — human and AI-assisted — with full payment status." />

        {loading ? (
          <div className="mt-12 space-y-px bg-line">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-ink-950 h-20 shimmer-bg" />
            ))}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="mt-12 hidden md:block border border-line">
              {/* Header */}
              <div className="grid grid-cols-[100px_120px_1fr_120px_120px_140px] gap-4 px-5 py-3 border-b border-line bg-ink-900">
                <span className="label-mono">ORDER</span>
                <span className="label-mono">BUYER</span>
                <span className="label-mono">ITEMS</span>
                <span className="label-mono text-right">AMOUNT</span>
                <span className="label-mono text-center">STATUS</span>
                <span className="label-mono text-right">TIME</span>
              </div>
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>

            {/* Mobile cards */}
            <div className="mt-12 md:hidden space-y-px bg-line">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}

function OrderRow({ order }: { order: Order }) {
  return (
    <div className="grid grid-cols-[100px_120px_1fr_120px_120px_140px] gap-4 px-5 py-4 border-b border-line last:border-b-0 hover:bg-ink-900/50 transition-colors">
      <span className="font-mono text-white text-sm">{order.id}</span>
      <div className="flex items-center gap-2">
        <span className={`label-mono ${order.buyerType === 'AI BUYER' ? 'text-white' : 'text-ink-300'}`}>
          {order.buyerType === 'AI BUYER' ? 'AI' : 'HUMAN'}
        </span>
        {order.aiAssisted && (
          <span className="label-mono text-ink-300 border border-line px-1.5 py-0.5">AI+</span>
        )}
      </div>
      <div className="text-sm text-ink-200">
        {order.items.map((item) => item.name).join(' · ')}
      </div>
      <span className="text-right font-mono text-white">{formatINR(order.amount)}</span>
      <div className="flex justify-center">
        <StatusBadge status={order.paymentStatus} />
      </div>
      <span className="text-right label-mono text-ink-300">{order.timestamp.split(' ')[1]}</span>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <div className="bg-ink-950 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-white">{order.id}</span>
        <StatusBadge status={order.paymentStatus} />
      </div>
      <div className="flex items-center gap-2">
        <span className={`label-mono ${order.buyerType === 'AI BUYER' ? 'text-white' : 'text-ink-300'}`}>
          {order.buyerType}
        </span>
        {order.aiAssisted && <span className="label-mono text-ink-300 border border-line px-1.5 py-0.5">AI-ASSISTED</span>}
      </div>
      <div className="text-sm text-ink-200">{order.items.map((item) => item.name).join(' · ')}</div>
      <div className="flex items-center justify-between pt-2 border-t border-line">
        <span className="text-lg font-bold text-white">{formatINR(order.amount)}</span>
        <span className="label-mono text-ink-300">{order.timestamp}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'PAID') {
    return (
      <span className="inline-flex items-center gap-1.5 label-mono-light border border-white px-2 py-1">
        <Check className="w-3 h-3" /> PAID
      </span>
    );
  }
  if (status === 'PENDING') {
    return (
      <span className="inline-flex items-center gap-1.5 label-mono border border-line px-2 py-1 text-ink-200">
        <Clock className="w-3 h-3" /> PENDING
      </span>
    );
  }
  if (status === 'BLOCKED') {
    return (
      <span className="inline-flex items-center gap-1.5 label-mono border border-ink-300 px-2 py-1 text-ink-200">
        <X className="w-3 h-3" /> BLOCKED
      </span>
    );
  }
  return <span className="label-mono text-ink-300">{status}</span>;
}
