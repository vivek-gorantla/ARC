import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Search } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { Label } from '@/components/ui';
import { merchantService } from '@/services';
import type { Merchant } from '@/types';

export function BuyerDiscover() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    merchantService.getMerchants().then((m) => {
      setMerchants(m);
      setLoading(false);
    });
  }, []);

  const handleSearch = () => {
    setSearching(true);
    setTimeout(() => setSearching(false), 2000);
  };

  return (
    <PageLayout mode="buyer">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-ink-300 mb-8">
          <span className="block">SEARCHING</span>
          <span className="block text-ink-300">AI-READY MERCHANTS...</span>
        </h1>

        {searching && (
          <div className="mt-8 flex items-center gap-3 animate-pulse">
            <Search className="w-5 h-5 text-white" strokeWidth={1.5} />
            <span className="label-mono-light tracking-widest">SCANNING AGENTIC MERCHANT PROTOCOLS...</span>
          </div>
        )}

        {loading ? (
          <div className="mt-12 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 shimmer-bg border border-white/[0.08]" />
            ))}
          </div>
        ) : (
          <div className="mt-12 space-y-6">
            {merchants.map((m) => (
              <div key={m.id} className="glass-card glow-accent p-6 lg:p-8 border border-white/[0.08]">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-black tracking-tight text-white uppercase">{m.name}</h3>
                    <span className="label-mono text-ink-300 text-[10px] tracking-wider mt-2 block">
                      {m.productCount} MACHINE-READABLE PRODUCTS · RATING {m.rating}/5.0
                    </span>
                  </div>
                  {m.aiTransactionSupported && (
                    <span className="flex items-center gap-1.5 label-mono-light bg-white/5 border border-white/10 px-2.5 py-1 text-[9px] font-bold">
                      <Check className="w-3 h-3 text-white" /> AI TRANSACTION STACK
                    </span>
                  )}
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Capability label="CATALOG METADATA" available={m.catalogAvailable} />
                  <Capability label="API CHECKOUT PROTOCOL" available={m.checkoutSupported} />
                  <Capability label="AI TRUST CERTIFICATION" available={m.aiTransactionSupported} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comparison */}
        <div className="mt-20">
          <Label className="tracking-widest">ECOSYSTEM MATRIX</Label>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-transparent">
            {merchants.map((m) => (
              <div key={m.id} className="glass-card glow-accent p-6 border border-white/[0.08] flex flex-col justify-between min-h-[260px]">
                <div>
                  <h4 className="font-display text-lg font-bold text-white uppercase">{m.name}</h4>
                  <div className="mt-4 space-y-3.5 text-xs">
                    <CompareRow label="Total items" value={String(m.productCount)} />
                    <CompareRow label="System rating" value={String(m.rating)} />
                    <CompareRow label="API Checkout" value={m.checkoutSupported ? 'STABLE' : 'UNSUPPORTED'} />
                    <CompareRow label="AI Agent ready" value={m.aiTransactionSupported ? 'CERTIFIED' : 'UNSUPPORTED'} />
                  </div>
                </div>
                {m.aiTransactionSupported && (
                  <Link
                    to="/buyer"
                    className="mt-6 inline-flex items-center gap-2 py-3 bg-white text-ink-950 font-black tracking-tight justify-center hover:bg-ink-100 transition-colors label-mono text-center shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  >
                    SHOP {m.name} <ArrowRight className="w-3.5 h-3.5 text-ink-950" strokeWidth={3} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="mt-12 inline-flex items-center gap-2 px-6 py-3.5 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white transition-all label-mono-light font-bold"
        >
          <Search className="w-4 h-4 text-white" /> RESCAN NETWORK
        </button>
      </div>
    </PageLayout>
  );
}

function Capability({ label, available }: { label: string; available: boolean }) {
  return (
    <div className={`flex items-center gap-2 border px-3 py-2 ${available ? 'border-line' : 'border-line opacity-40'}`}>
      {available ? (
        <Check className="w-3.5 h-3.5 text-white" strokeWidth={2} />
      ) : (
        <span className="w-3.5 h-3.5 border border-ink-300" />
      )}
      <span className="label-mono">{label}</span>
    </div>
  );
}

function CompareRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-line pb-2">
      <span className="text-ink-300">{label}</span>
      <span className="text-white font-mono">{value}</span>
    </div>
  );
}
