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
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-ink-300 mb-8">YOUR BAG.</h1>

        {items.length === 0 ? (
          <div className="mt-12 glass-card py-20 text-center border border-white/[0.08]">
            <p className="label-mono text-ink-300">YOUR BAG IS EMPTY</p>
            <Link to="/buyer" className="mt-4 inline-block label-mono bg-white text-ink-950 px-5 py-2 font-black shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              START SEARCHING
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="glass-card glow-accent p-5 flex items-center gap-5 border border-white/[0.08]">
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
                      <ProductImage imageId={item.id} category={item.category} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-base leading-snug">{item.name}</h3>
                      <span className="label-mono text-[9px] text-ink-300/80 mt-1 block">{item.id}</span>
                    </div>
                    <span className="text-xl font-bold font-mono text-white">{formatINR(item.price)}</span>
                    <button onClick={() => removeItem(item.id)} className="text-ink-300 hover:text-white transition-colors p-2 hover:bg-white/5">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="glass-card glow-accent p-6 h-fit sticky top-20 border border-white/[0.08]">
                <Label className="tracking-widest block mb-4">ORDER SUMMARY</Label>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm py-1">
                    <span className="text-ink-300">Subtotal</span>
                    <span className="text-white font-mono">{formatINR(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-white/[0.06] pb-4">
                    <span className="text-ink-300">Shipping</span>
                    <span className="text-white font-mono">FREE</span>
                  </div>
                  <div className="pt-2 flex justify-between items-baseline">
                    <span className="label-mono text-ink-200">TOTAL DUE</span>
                    <span className="font-display text-3xl font-black text-white">{formatINR(total)}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate('/buyer/checkout')}
                  className="mt-6 w-full py-4 bg-white text-ink-950 font-black tracking-tight hover:bg-ink-100 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
                >
                  PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4 text-ink-950" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* AI Recommendations */}
            {recommendations.length > 0 && (
              <div className="mt-20">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-4 h-4 text-white" strokeWidth={1.5} />
                  <Label className="tracking-widest">COMPLETE YOUR ECOSYSTEM</Label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-transparent">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="glass-card glow-accent p-6 flex flex-col justify-between border border-white/[0.06] min-h-[220px]">
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                            <ProductImage imageId={rec.id} category={rec.category} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-bold text-sm leading-snug">{rec.name}</h4>
                            <span className="text-sm text-ink-200 block mt-1 font-mono">{formatINR(rec.price)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-ink-300 font-light leading-relaxed">
                          Recommended complement because it fits perfectly with your current hardware setup.
                        </p>
                      </div>
                      
                      <button
                        onClick={() => addRec(rec.id)}
                        className="mt-5 w-full py-2.5 bg-white text-ink-950 font-black hover:bg-ink-100 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 label-mono flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={3} /> ADD TO BAG
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
