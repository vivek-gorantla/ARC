export type Category =
  | 'laptops'
  | 'monitors'
  | 'keyboards'
  | 'mice'
  | 'headphones'
  | 'hubs'
  | 'stands'
  | 'storage'
  | 'desk';

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  inventory: number;
  image: string;
  specs: Record<string, string>;
  useCases: string[];
  suitableFor: string[];
  compatibleWith: string[];
  relatedProducts: string[];
  bundles: string[];
  aiReadable: boolean;
  aiDiscoverability: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export type BuyerType = 'AI BUYER' | 'HUMAN';
export type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED' | 'BLOCKED';

export interface Order {
  id: string;
  buyerType: BuyerType;
  items: OrderItem[];
  amount: number;
  paymentStatus: PaymentStatus;
  aiAssisted: boolean;
  timestamp: string;
}

export type AgentRunStatus = 'COMPLETED' | 'IN_PROGRESS' | 'BLOCKED' | 'FAILED';

export interface AgentStep {
  id: string;
  label: string;
  timestamp: string;
  tool?: string;
  input?: string;
  output?: string;
  reasoning: string;
  policyResult?: 'PASSED' | 'BLOCKED' | 'N/A';
  status: 'success' | 'active' | 'blocked' | 'pending';
}

export interface AgentRun {
  id: string;
  status: AgentRunStatus;
  buyer: string;
  merchant: string;
  value: number;
  duration: string;
  startedAt: string;
  intent: string;
  steps: AgentStep[];
}

export type AuditCategory =
  | 'PAYMENT'
  | 'RECOMMENDATION'
  | 'CART'
  | 'POLICY'
  | 'FAILURE'
  | 'DISCOVERY';

export interface AuditEvent {
  id: string;
  timestamp: string;
  category: AuditCategory;
  action: string;
  detail: string;
  runId?: string;
  status: 'success' | 'blocked' | 'failed' | 'info';
}

export interface PolicyConfig {
  maxTransaction: number;
  maxAiDiscount: number;
  humanApprovalThreshold: number;
  allowAiUpsell: boolean;
  allowAutonomousPurchase: boolean;
  buyerSpendingLimit: number;
}

export interface Merchant {
  id: string;
  name: string;
  catalogAvailable: boolean;
  checkoutSupported: boolean;
  aiTransactionSupported: boolean;
  rating: number;
  productCount: number;
}

export interface RevenueMetrics {
  aiAssistedRevenue: number;
  aiTransactions: number;
  conversionUplift: number;
  upsellRevenue: number;
  withoutAi: {
    conversion: number;
    aov: number;
    revenue: number;
  };
  withAi: {
    conversion: number;
    aov: number;
    revenue: number;
  };
  drivers: {
    label: string;
    value: number;
  }[];
}

export interface ActivityEvent {
  id: string;
  label: string;
  detail: string;
  timeAgo: string;
  type: 'discovery' | 'recommendation' | 'upsell' | 'payment' | 'policy';
}

export interface Recommendation {
  id: string;
  primary: string;
  secondary: string;
  primaryPrice: number;
  secondaryPrice: number;
  compatibility: number;
  historicalConversion: number;
  enabled: boolean;
}

export interface FailureRecord {
  id: string;
  type: string;
  reason: string;
  agentAction: string;
  recovery: string;
  status: 'RESOLVED' | 'REVIEWING';
  timestamp: string;
  runId: string;
}
