import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Box, Cpu, Layers, Tag, IndianRupee } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { Label } from '@/components/ui';
import { ProductImage } from '@/components/ProductImage';
import { catalogService } from '@/services';
import type { Product } from '@/types';
import { formatINR } from '@/utils/format';

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | undefined>();
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'human' | 'ai'>('human');

  useEffect(() => {
    if (!id) return;
    catalogService.getProduct(id).then(async (p) => {
      setProduct(p);
      if (p) {
        const relatedProducts = await Promise.all(
          p.relatedProducts.map((rid) => catalogService.getProduct(rid)),
        );
        setRelated(relatedProducts.filter((rp): rp is Product => !!rp));
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <PageLayout mode="merchant">
        <div className="px-5 lg:px-8 py-16">
          <div className="w-32 h-4 shimmer-bg mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-[4/3] shimmer-bg" />
            <div className="space-y-4">
              <div className="w-3/4 h-8 shimmer-bg" />
              <div className="w-full h-4 shimmer-bg" />
              <div className="w-full h-4 shimmer-bg" />
              <div className="w-1/2 h-6 shimmer-bg" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout mode="merchant">
        <div className="px-5 lg:px-8 py-22 text-center">
          <p className="label-mono text-ink-300">PRODUCT NOT FOUND</p>
          <Link to="/merchant/catalog" className="mt-4 inline-block label-mono-light underline">
            BACK TO CATALOG
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout mode="merchant">
      <div className="px-5 lg:px-8 py-8 lg:py-12">
        <Link to="/merchant/catalog" className="inline-flex items-center gap-2 label-mono text-ink-300 hover:text-white transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK TO CATALOG
        </Link>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/[0.08] w-fit mb-8">
          <button
            onClick={() => setView('human')}
            className={`px-4 py-2 label-mono transition-all duration-200 ${view === 'human' ? 'bg-white text-ink-950 font-black shadow-[0_0_12px_rgba(255,255,255,0.15)]' : 'bg-transparent text-ink-300 hover:text-ink-100'
              }`}
          >
            HUMAN VIEW
          </button>
          <button
            onClick={() => setView('ai')}
            className={`px-4 py-2 label-mono transition-all duration-200 ${view === 'ai' ? 'bg-white text-ink-950 font-black shadow-[0_0_12px_rgba(255,255,255,0.15)]' : 'bg-transparent text-ink-300 hover:text-ink-100'
              }`}
          >
            AI VIEW
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="border border-white/[0.08] relative overflow-hidden aspect-square lg:aspect-auto min-h-[400px]">
            <ProductImage imageId={product.id} category={product.category} className="w-full h-full object-cover" />
          </div>

          {/* Content */}
          <div className="glass-card glow-accent p-8 lg:p-12 border border-white/[0.08]">
            {view === 'human' ? (
              <HumanView product={product} />
            ) : (
              <AiView product={product} />
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <Label className="tracking-widest">RELATED PRODUCTS</Label>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/merchant/catalog/${rp.id}`}
                  className="group glass-card glow-accent flex items-center gap-4 p-5 border border-white/[0.06] hover:border-white/20 transition-all duration-300"
                >
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
                    <ProductImage imageId={rp.id} category={rp.category} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold group-hover:translate-x-1 transition-transform duration-300">{rp.name}</h4>
                    <span className="text-ink-300 text-sm mt-1 block font-mono">{formatINR(rp.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function HumanView({ product }: { product: Product }) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <span className="label-mono text-ink-300">{product.id}</span>
        {product.aiReadable && (
          <span className="flex items-center gap-1.5 label-mono-light bg-white/5 border border-white/10 px-2.5 py-1 text-[9px] font-bold">
            <Check className="w-3 h-3 text-white" /> AI-READABLE
          </span>
        )}
      </div>
      <h1 className="font-display text-4xl lg:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-ink-300 leading-none">{product.name}</h1>
      <p className="mt-6 text-sm text-ink-200 leading-relaxed font-light">{product.description}</p>

      <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-baseline justify-between">
        <div>
          <div className="label-mono text-ink-400 mb-1">PRICE</div>
          <span className="font-display text-4xl font-black tracking-tight text-white">{formatINR(product.price)}</span>
        </div>
        <div className="text-right">
          <div className="label-mono text-ink-400 mb-1">AVAILABILITY</div>
          <span className="font-mono text-sm text-white font-bold">{product.inventory} UNITS LEFT</span>
        </div>
      </div>

      {/* Specs */}
      <div className="mt-10">
        <Label className="tracking-widest block mb-4">SPECIFICATIONS</Label>
        <div className="space-y-px">
          {Object.entries(product.specs).map(([key, val]) => (
            <div key={key} className="flex justify-between py-3 border-b border-white/[0.06]">
              <span className="label-mono text-ink-300 text-[9px]">{key}</span>
              <span className="text-xs text-white font-mono">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AiView({ product }: { product: Product }) {
  return (
    <div className="font-mono">
      <div className="flex items-center gap-2 mb-8">
        <span className="flex items-center gap-1.5 label-mono-light bg-white/5 border border-white/10 px-2.5 py-1 text-[9px] font-bold">
          <Check className="w-3 h-3 text-white" /> AI-READABLE ✓
        </span>
      </div>

      <AiField icon={Box} label="PRODUCT ID" value={product.id} />
      <AiField icon={Tag} label="CATEGORY" value={product.category.toUpperCase()} />
      <AiField icon={IndianRupee} label="PRICE" value={formatINR(product.price)} />
      <AiField icon={Layers} label="INVENTORY" value={String(product.inventory)} />

      <div className="mt-8">
        <Label className="tracking-widest block mb-3">USE CASES</Label>
        <div className="flex flex-wrap gap-2">
          {product.useCases.map((uc) => (
            <span key={uc} className="px-3 py-1.5 border border-white/[0.08] text-xs text-white font-mono bg-white/[0.01]">
              {uc}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Label className="tracking-widest block mb-3">SUITABLE FOR</Label>
        <div className="flex flex-wrap gap-2">
          {product.suitableFor.map((sf) => (
            <span key={sf} className="px-3 py-1.5 border border-white/[0.08] text-xs text-white font-mono bg-white/[0.01]">
              {sf}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Label className="tracking-widest block mb-3">COMPATIBLE WITH</Label>
        <div className="flex flex-wrap gap-2">
          {product.compatibleWith.map((c) => (
            <span key={c} className="px-3 py-1.5 border border-white/[0.08] text-xs text-ink-200 font-mono bg-white/[0.01]">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Label className="tracking-widest block mb-3">BUNDLES</Label>
        <div className="flex flex-wrap gap-2">
          {product.bundles.map((b) => (
            <span key={b} className="px-3 py-1.5 border border-white/[0.08] text-xs text-ink-200 font-mono bg-white/[0.01]">
              {b}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-white/[0.06] pt-6">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-white" strokeWidth={1.5} />
          <span className="label-mono-light text-[9px]">AI DISCOVERABILITY INDEX</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-[3px] bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ width: `${product.aiDiscoverability}%` }} />
          </div>
          <span className="text-xl font-bold font-mono text-white">{product.aiDiscoverability}%</span>
        </div>
      </div>
    </div>
  );
}

function AiField({ icon: Icon, label, value }: { icon: typeof Box; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-white/[0.06]">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-ink-300" strokeWidth={1.5} />
        <span className="label-mono text-[9px]">{label}</span>
      </div>
      <span className="text-xs text-white font-mono font-bold">{value}</span>
    </div>
  );
}

