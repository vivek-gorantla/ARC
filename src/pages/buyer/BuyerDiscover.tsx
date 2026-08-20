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
        <h1 className="display-xl text-white">
          <span className="block">SEARCHING</span>
          <span className="block text-ink-300">AI-READY MERCHANTS...</span>
        </h1>

        {searching && (
          <div className="mt-8 flex items-center gap-3">
            <Search className="w-5 h-5 text-white animate-pulse" strokeWidth={1.5} />
            <span className="label-mono-light">SCANNING NETWORK...</span>
          </div>
        )}

        {loading ? (
          <div className="mt-12 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 shimmer-bg border border-line" />
            ))}
          </div>
        ) : (
          <div className="mt-12 space-y-px bg-line">
            {merchants.map((m) => (
              <div key={m.id} className="bg-ink-950 p-6 lg:p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-extrabold tracking-tight text-white">{m.name}</h3>
                    <span className="label-mono text-ink-300 mt-1 block">
                      {m.productCount} PRODUCTS · RATING {m.rating}
                    </span>
                  </div>
                  {m.aiTransactionSupported && (
                    <span className="flex items-center gap-1.5 label-mono-light border border-white px-2 py-1">
                      <Check className="w-3 h-3" /> AI TRANSACTION
                    </span>
                  )}
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Capability label="CATALOG" available={m.catalogAvailable} />
                  <Capability label="CHECKOUT" available={m.checkoutSupported} />
                  <Capability label="AI TRANSACTION" available={m.aiTransactionSupported} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comparison */}
        <div className="mt-16">
          <Label>OFFER COMPARISON</Label>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-px bg-line">
            {merchants.map((m) => (
              <div key={m.id} className="bg-ink-950 p-6">
                <h4 className="text-lg font-bold text-white">{m.name}</h4>
                <div className="mt-4 space-y-2 text-sm">
                  <CompareRow label="Products" value={String(m.productCount)} />
                  <CompareRow label="Rating" value={String(m.rating)} />
                  <CompareRow label="Checkout" value={m.checkoutSupported ? 'Supported' : 'Not supported'} />
                  <CompareRow label="AI Transaction" value={m.aiTransactionSupported ? 'Supported' : 'Not supported'} />
                </div>
                {m.aiTransactionSupported && (
                  <Link
                    to="/buyer"
                    className="mt-6 inline-flex items-center gap-2 label-mono-light border border-line px-4 py-2 hover:border-white transition-colors"
                  >
                    SHOP {m.name} <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="mt-12 inline-flex items-center gap-2 px-6 py-3 border border-line hover:border-white transition-colors label-mono-light"
        >
          <Search className="w-4 h-4" /> RESCAN NETWORK
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
