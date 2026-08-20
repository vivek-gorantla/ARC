import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Trash2, Sparkles } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { Label } from '@/components/ui';
import { ProductImage } from '@/components/ProductImage';
import { catalogService, cartService } from '@/services';
import type { Product } from '@/types';
import { formatINR } from '@/utils/format';

export function BuyerBag() {
  const [items, setItems] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cartIds: string[] = JSON.parse(sessionStorage.getItem('arc_cart') || '[]');
    if (cartIds.length === 0) {
      // Default demo cart
      const defaultCart = ['LAP-001', 'HUB-001'];
      sessionStorage.setItem('arc_cart', JSON.stringify(defaultCart));
      loadCart(defaultCart);
    } else {
      loadCart(cartIds);
    }
  }, []);

  const loadCart = async (ids: string[]) => {
    const products = await Promise.all(ids.map((id) => catalogService.getProduct(id)));
    const valid = products.filter((p): p is Product => !!p);
    setItems(valid);
    if (valid[0]) {
      const recs = await cartService.getRecommendations(valid[0].id);
      const filtered = recs.filter((r) => !ids.includes(r.id));
      setRecommendations(filtered);
    }
    setLoading(false);
  };

  const removeItem = (id: string) => {
    const cartIds: string[] = JSON.parse(sessionStorage.getItem('arc_cart') || '[]');
    const updated = cartIds.filter((cid) => cid !== id);
    sessionStorage.setItem('arc_cart', JSON.stringify(updated));
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const addRec = (id: string) => {
    const cartIds: string[] = JSON.parse(sessionStorage.getItem('arc_cart') || '[]');
    cartIds.push(id);
    sessionStorage.setItem('arc_cart', JSON.stringify(cartIds));
    loadCart(cartIds);
  };

  const total = items.reduce((sum, p) => sum + p.price, 0);

  if (loading) {
    return (
      <PageLayout mode="buyer">
        <div className="px-5 lg:px-8 py-16">
          <div className="w-1/2 h-16 shimmer-bg mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 shimmer-bg border border-line" />
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout mode="buyer">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <h1 className="display-xl text-white">YOUR BAG.</h1>

        {items.length === 0 ? (
          <div className="mt-12 border border-line py-20 text-center">
            <p className="label-mono text-ink-300">YOUR BAG IS EMPTY</p>
            <Link to="/buyer" className="mt-4 inline-block label-mono-light underline">
              START SEARCHING
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
              <div className="space-y-px bg-line">
                {items.map((item) => (
                  <div key={item.id} className="bg-ink-950 p-5 flex items-center gap-4">
                    <ProductImage imageId={item.id} category={item.category} className="w-20 h-20 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-white font-bold">{item.name}</h3>
                      <span className="label-mono text-ink-300">{item.id}</span>
                    </div>
                    <span className="text-xl font-bold text-white">{formatINR(item.price)}</span>
                    <button onClick={() => removeItem(item.id)} className="text-ink-300 hover:text-white transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
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
                  <div className="border-t border-line pt-3 flex justify-between items-baseline">
                    <span className="label-mono-light">TOTAL</span>
                    <span className="text-3xl font-extrabold tracking-tighter text-white">{formatINR(total)}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/buyer/checkout')}
                  className="mt-6 w-full py-3.5 bg-white text-ink-950 font-bold tracking-tight hover:bg-ink-100 transition-colors flex items-center justify-center gap-2"
                >
                  CONTINUE <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* AI Recommendations */}
            {recommendations.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-white" strokeWidth={1.5} />
                  <Label>COMPLETE YOUR SETUP</Label>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="bg-ink-950 p-5">
                      <div className="flex items-center gap-4">
                        <ProductImage imageId={rec.id} category={rec.category} className="w-16 h-16 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="text-white font-bold">{rec.name}</h4>
                          <span className="text-sm text-ink-300">{formatINR(rec.price)}</span>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-ink-200">
                        Recommended because it pairs well with {items[0]?.name || 'your selection'}.
                      </p>
                      <button
                        onClick={() => addRec(rec.id)}
                        className="mt-4 w-full py-2 border border-line label-mono hover:border-white transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-3 h-3" /> ADD TO BAG
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
