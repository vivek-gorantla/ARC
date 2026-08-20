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
        <Link to="/merchant/catalog" className="inline-flex items-center gap-2 label-mono text-ink-300 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> BACK TO CATALOG
        </Link>

        {/* View toggle */}
        <div className="flex items-center gap-px bg-line border border-line w-fit mb-8">
          <button
            onClick={() => setView('human')}
            className={`px-4 py-2 label-mono transition-colors ${
              view === 'human' ? 'bg-ink-800 text-white' : 'bg-ink-950 text-ink-300 hover:text-ink-100'
            }`}
          >
            HUMAN VIEW
          </button>
          <button
            onClick={() => setView('ai')}
            className={`px-4 py-2 label-mono transition-colors ${
              view === 'ai' ? 'bg-ink-800 text-white' : 'bg-ink-950 text-ink-300 hover:text-ink-100'
            }`}
          >
            AI VIEW
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-line">
          {/* Image */}
          <div className="bg-ink-950">
            <ProductImage imageId={product.id} category={product.category} className="aspect-square lg:aspect-auto lg:h-full" />
          </div>

          {/* Content */}
          <div className="bg-ink-950 p-6 lg:p-10">
            {view === 'human' ? (
              <HumanView product={product} />
            ) : (
              <AiView product={product} />
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <Label>RELATED PRODUCTS</Label>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/merchant/catalog/${rp.id}`}
                  className="group bg-ink-950 hover:bg-ink-900 transition-colors flex items-center gap-4 p-4"
                >
                  <ProductImage imageId={rp.id} category={rp.category} className="w-20 h-20 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-bold group-hover:translate-x-0.5 transition-transform">{rp.name}</h4>
                    <span className="text-ink-300 text-sm">{formatINR(rp.price)}</span>
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
      <div className="flex items-center justify-between mb-2">
        <span className="label-mono text-ink-300">{product.id}</span>
        {product.aiReadable && (
          <span className="flex items-center gap-1.5 label-mono-light border border-line px-2 py-1">
            <Check className="w-3 h-3" /> AI-READABLE
          </span>
        )}
      </div>
      <h1 className="display-sm text-white">{product.name}</h1>
      <p className="mt-4 text-ink-200 leading-relaxed">{product.description}</p>

      <div className="mt-8 flex items-baseline gap-4">
        <span className="text-4xl font-extrabold tracking-tighter text-white">{formatINR(product.price)}</span>
        <span className="label-mono text-ink-300">INVENTORY: {product.inventory}</span>
      </div>

      {/* Specs */}
      <div className="mt-8">
        <Label>SPECIFICATIONS</Label>
        <div className="mt-4 space-y-px">
          {Object.entries(product.specs).map(([key, val]) => (
            <div key={key} className="flex justify-between py-2.5 border-b border-line">
              <span className="label-mono text-ink-300">{key}</span>
              <span className="text-sm text-white font-mono">{val}</span>
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
      <div className="flex items-center gap-2 mb-6">
        <span className="flex items-center gap-1.5 label-mono-light border border-white px-2 py-1">
          <Check className="w-3 h-3" /> AI-READABLE ✓
        </span>
      </div>

      <AiField icon={Box} label="PRODUCT ID" value={product.id} />
      <AiField icon={Tag} label="CATEGORY" value={product.category.toUpperCase()} />
      <AiField icon={IndianRupee} label="PRICE" value={formatINR(product.price)} />
      <AiField icon={Layers} label="INVENTORY" value={String(product.inventory)} />

      <div className="mt-6">
        <Label>USE CASES</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.useCases.map((uc) => (
            <span key={uc} className="px-3 py-1.5 border border-line text-sm text-white font-mono">
              {uc}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Label>SUITABLE FOR</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.suitableFor.map((sf) => (
            <span key={sf} className="px-3 py-1.5 border border-line text-sm text-white font-mono">
              {sf}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Label>COMPATIBLE WITH</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.compatibleWith.map((c) => (
            <span key={c} className="px-3 py-1.5 border border-line text-sm text-ink-200 font-mono">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Label>BUNDLES</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.bundles.map((b) => (
            <span key={b} className="px-3 py-1.5 border border-line text-sm text-ink-200 font-mono">
              {b}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-line pt-6">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-white" strokeWidth={1.5} />
          <span className="label-mono-light">AI DISCOVERABILITY</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-ink-700">
            <div className="h-full bg-white" style={{ width: `${product.aiDiscoverability}%` }} />
          </div>
          <span className="text-2xl font-extrabold text-white">{product.aiDiscoverability}%</span>
        </div>
      </div>
    </div>
  );
}

function AiField({ icon: Icon, label, value }: { icon: typeof Box; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-line">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-ink-300" strokeWidth={1.5} />
        <span className="label-mono">{label}</span>
      </div>
      <span className="text-sm text-white font-mono">{value}</span>
    </div>
  );
}

