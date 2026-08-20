import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { MerchantOverview } from '@/pages/merchant/MerchantOverview';
import { MerchantCatalog } from '@/pages/merchant/MerchantCatalog';
import { ProductDetail } from '@/pages/merchant/ProductDetail';
import { AiCommerce } from '@/pages/merchant/AiCommerce';
import { Recommendations } from '@/pages/merchant/Recommendations';
import { Campaigns } from '@/pages/merchant/Campaigns';
import { MerchantOrders } from '@/pages/merchant/MerchantOrders';
import { RevenueEngine } from '@/pages/merchant/RevenueEngine';
import { MerchantActivity } from '@/pages/merchant/MerchantActivity';
import { MerchantPolicies } from '@/pages/merchant/MerchantPolicies';
import { BuyerLanding } from '@/pages/buyer/BuyerLanding';
import { BuyerResult } from '@/pages/buyer/BuyerResult';
import { BuyerDiscover } from '@/pages/buyer/BuyerDiscover';
import { BuyerBag } from '@/pages/buyer/BuyerBag';
import { BuyerCheckout } from '@/pages/buyer/BuyerCheckout';
import { PaymentSuccess } from '@/pages/buyer/PaymentSuccess';
import { BuyerBlocked } from '@/pages/buyer/BuyerBlocked';
import { BuyerPurchases } from '@/pages/buyer/BuyerPurchases';
import { AgentLive } from '@/pages/agent/AgentLive';
import { AgentRuns } from '@/pages/agent/AgentRuns';
import { AgentTrace } from '@/pages/agent/AgentTrace';
import { AgentAudit } from '@/pages/agent/AgentAudit';
import { AgentFailures } from '@/pages/agent/AgentFailures';
import { AgentPolicies } from '@/pages/agent/AgentPolicies';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Merchant */}
        <Route path="/merchant" element={<MerchantOverview />} />
        <Route path="/merchant/catalog" element={<MerchantCatalog />} />
        <Route path="/merchant/catalog/:id" element={<ProductDetail />} />
        <Route path="/merchant/ai-commerce" element={<AiCommerce />} />
        <Route path="/merchant/ai-commerce/recommendations" element={<Recommendations />} />
        <Route path="/merchant/campaigns" element={<Campaigns />} />
        <Route path="/merchant/orders" element={<MerchantOrders />} />
        <Route path="/merchant/revenue" element={<RevenueEngine />} />
        <Route path="/merchant/activity" element={<MerchantActivity />} />
        <Route path="/merchant/policies" element={<MerchantPolicies />} />

        {/* Buyer */}
        <Route path="/buyer" element={<BuyerLanding />} />
        <Route path="/buyer/result" element={<BuyerResult />} />
        <Route path="/buyer/discover" element={<BuyerDiscover />} />
        <Route path="/buyer/bag" element={<BuyerBag />} />
        <Route path="/buyer/checkout" element={<BuyerCheckout />} />
        <Route path="/buyer/success" element={<PaymentSuccess />} />
        <Route path="/buyer/blocked" element={<BuyerBlocked />} />
        <Route path="/buyer/purchases" element={<BuyerPurchases />} />

        {/* Agent */}
        <Route path="/agent" element={<AgentLive />} />
        <Route path="/agent/runs" element={<AgentRuns />} />
        <Route path="/agent/runs/:id" element={<AgentTrace />} />
        <Route path="/agent/audit" element={<AgentAudit />} />
        <Route path="/agent/failures" element={<AgentFailures />} />
        <Route path="/agent/policies" element={<AgentPolicies />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
