import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Check } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { SectionHeading, Label } from '@/components/ui';
import { ProductImage } from '@/components/ProductImage';
import { catalogService } from '@/services';
import type { Product, Category } from '@/types';
import { formatINR } from '@/utils/format';

const categoryLabels: Record<string, string> = {
  laptops: 'Laptops',
  monitors: 'Monitors',
  keyboards: 'Keyboards',
  mice: 'Mice',
  headphones: 'Headphones',
  hubs: 'Hubs',
  stands: 'Stands',
  storage: 'Storage',
  desk: 'Desk Accessories',
};

export function MerchantCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    catalogService.getProducts().then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter((p) => {
    const matchesQuery = query === '' || p.name.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'all' || p.category === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <PageLayout mode="merchant">
      <div className="px-5 lg:px-8 py-16 lg:py-22">
        <SectionHeading
          lines={['YOUR CATALOG.', 'UNDERSTOOD BY MACHINES.']}
          subtitle="Every product is machine-readable — AI buyers can discover, understand, and purchase autonomously within your policy boundaries."
        />

        {/* Search & filter */}
        <div className="mt-12 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" strokeWidth={1.5} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-ink-900 border border-line pl-11 pr-4 py-3 text-white placeholder:text-ink-300 focus:border-ink-100 outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {['all', ...Object.keys(categoryLabels)].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-2 label-mono whitespace-nowrap border transition-colors ${
                  filter === cat
                    ? 'border-white text-white bg-ink-800'
                    : 'border-line text-ink-300 hover:text-ink-100'
                }`}
              >
                {cat === 'all' ? 'ALL' : categoryLabels[cat].toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8">
          {loading ? (
            <CatalogSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-line">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/merchant/catalog/${product.id}`}
      className="group bg-ink-950 hover:bg-ink-900 transition-colors flex flex-col"
    >
      <ProductImage imageId={product.id} category={product.category} className="aspect-[4/3]" />
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="label-mono text-ink-300">{categoryLabels[product.category]}</span>
          {product.aiReadable && (
            <span className="flex items-center gap-1 label-mono-light">
              <Check className="w-3 h-3" /> AI READY
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-white group-hover:translate-x-0.5 transition-transform">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-ink-300 line-clamp-2 flex-1">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-extrabold tracking-tight text-white">{formatINR(product.price)}</span>
          <span className="label-mono text-ink-300">INV: {product.inventory}</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1 bg-ink-700">
            <div className="h-full bg-white" style={{ width: `${product.aiDiscoverability}%` }} />
          </div>
          <span className="label-mono text-ink-200">{product.aiDiscoverability}%</span>
        </div>
      </div>
    </Link>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-line">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-ink-950">
          <div className="aspect-[4/3] shimmer-bg" />
          <div className="p-4 space-y-3">
            <div className="w-20 h-3 shimmer-bg" />
            <div className="w-3/4 h-4 shimmer-bg" />
            <div className="w-full h-3 shimmer-bg" />
            <div className="w-1/2 h-5 shimmer-bg" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-line py-20 text-center">
      <p className="label-mono text-ink-300">NO PRODUCTS FOUND</p>
      <p className="mt-2 text-ink-200">Try adjusting your search or filter.</p>
    </div>
  );
}
