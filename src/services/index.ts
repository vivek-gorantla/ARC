import type {
  Product,
  Order,
  AgentRun,
  AuditEvent,
  PolicyConfig,
  Merchant,
  RevenueMetrics,
  ActivityEvent,
  Recommendation,
  FailureRecord,
} from '@/types';
import {
  products,
  orders,
  agentRuns,
  auditEvents,
  activityEvents,
  recommendations,
  revenueMetrics,
  defaultPolicy,
  merchants,
  failures,
} from '@/data/mockData';

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const catalogService = {
  async getProducts(): Promise<Product[]> {
    return delay([...products]);
  },
  async getProduct(id: string): Promise<Product | undefined> {
    return delay(products.find((p) => p.id === id));
  },
  async getByCategory(category: string): Promise<Product[]> {
    return delay(products.filter((p) => p.category === category));
  },
  async search(query: string): Promise<Product[]> {
    const q = query.toLowerCase();
    return delay(
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.useCases.some((u) => u.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q),
      ),
    );
  },
  async aiMatch(intent: {
    useCase?: string;
    budget?: number;
    priority?: string;
    preference?: string;
  }): Promise<Product[]> {
    let filtered = [...products];
    if (intent.budget) {
      filtered = filtered.filter((p) => p.price <= intent.budget!);
    }
    if (intent.useCase) {
      filtered = filtered.filter((p) =>
        p.useCases.some((u) => u.toLowerCase().includes(intent.useCase!.toLowerCase())),
      );
    }
    filtered.sort((a, b) => b.aiDiscoverability - a.aiDiscoverability);
    return delay(filtered);
  },
};

export const agentService = {
  async getRuns(): Promise<AgentRun[]> {
    return delay([...agentRuns]);
  },
  async getRun(id: string): Promise<AgentRun | undefined> {
    return delay(agentRuns.find((r) => r.id === id));
  },
  async getLiveActivity(): Promise<ActivityEvent[]> {
    return delay([...activityEvents]);
  },
};

export const cartService = {
  async assemble(productIds: string[]): Promise<{ items: { product: Product; quantity: number }[]; total: number }> {
    const items = productIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => !!p)
      .map((p) => ({ product: p, quantity: 1 }));
    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    return delay({ items, total });
  },
  async getRecommendations(productId: string): Promise<Product[]> {
    const product = products.find((p) => p.id === productId);
    if (!product) return delay([]);
    return delay(
      product.bundles
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => !!p),
    );
  },
};

export interface PaymentResult {
  success: boolean;
  orderId: string;
  paymentId: string;
  amount: number;
  mode: 'RAZORPAY TEST MODE';
}

export const paymentService = {
  async createPayment(amount: number, merchantId: string): Promise<{ orderId: string; amount: number; mode: string }> {
    return delay({ orderId: `order_${Date.now()}`, amount, mode: 'RAZORPAY TEST MODE' }, 500);
  },
  async verifyPayment(paymentId: string): Promise<PaymentResult> {
    return delay({
      success: true,
      orderId: `#82${Math.floor(Math.random() * 900 + 100)}`,
      paymentId: paymentId || `pay_${Date.now()}`,
      amount: 77498,
      mode: 'RAZORPAY TEST MODE',
    }, 800);
  },
  async getPaymentStatus(orderId: string): Promise<'created' | 'paid' | 'failed'> {
    return delay('paid', 300);
  },
};

export const auditService = {
  async getEvents(): Promise<AuditEvent[]> {
    return delay([...auditEvents]);
  },
  async getByCategory(category: string): Promise<AuditEvent[]> {
    if (category === 'ALL') return delay([...auditEvents]);
    return delay(auditEvents.filter((e) => e.category === category));
  },
  async getByRun(runId: string): Promise<AuditEvent[]> {
    return delay(auditEvents.filter((e) => e.runId === runId));
  },
};

export const revenueService = {
  async getMetrics(): Promise<RevenueMetrics> {
    return delay({ ...revenueMetrics });
  },
};

export const policyService = {
  async getPolicy(): Promise<PolicyConfig> {
    return delay({ ...defaultPolicy });
  },
  async evaluate(transaction: { amount: number; buyerLimit: number }): Promise<{
    passed: boolean;
    reason: string;
  }> {
    if (transaction.amount > transaction.buyerLimit) {
      return delay({
        passed: false,
        reason: `Transaction amount ₹${transaction.amount.toLocaleString('en-IN')} exceeds buyer spending limit of ₹${transaction.buyerLimit.toLocaleString('en-IN')}`,
      });
    }
    return delay({ passed: true, reason: 'Within all configured limits' });
  },
};

export const orderService = {
  async getOrders(): Promise<Order[]> {
    return delay([...orders]);
  },
  async getOrder(id: string): Promise<Order | undefined> {
    return delay(orders.find((o) => o.id === id));
  },
};

export const merchantService = {
  async getMerchants(): Promise<Merchant[]> {
    return delay([...merchants]);
  },
};

export const recommendationService = {
  async getRecommendations(): Promise<Recommendation[]> {
    return delay([...recommendations]);
  },
  async getFailures(): Promise<FailureRecord[]> {
    return delay([...failures]);
  },
};
