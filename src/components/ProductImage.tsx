import type { Category } from '@/types';

interface ProductImageProps {
  imageId: string;
  category: Category;
  className?: string;
}

const categoryGradients: Record<Category, string> = {
  laptops: 'from-ink-700 to-ink-900',
  monitors: 'from-ink-600 to-ink-900',
  keyboards: 'from-ink-700 to-ink-800',
  mice: 'from-ink-600 to-ink-800',
  headphones: 'from-ink-700 to-ink-900',
  hubs: 'from-ink-600 to-ink-900',
  stands: 'from-ink-700 to-ink-800',
  storage: 'from-ink-600 to-ink-900',
  desk: 'from-ink-700 to-ink-800',
};

export function ProductImage({ imageId, category, className = '' }: ProductImageProps) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${categoryGradients[category]} ${className}`}
    >
      <div className="absolute inset-0 grid-faint opacity-40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <ProductGlyph category={category} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink-100/20 to-transparent" />
      <div className="absolute top-3 right-3 label-mono text-ink-300/60">
        {imageId}
      </div>
    </div>
  );
}

function ProductGlyph({ category }: { category: Category }) {
  const common = 'text-ink-100/40';
  switch (category) {
    case 'laptops':
      return (
        <svg viewBox="0 0 200 140" className={`w-3/5 ${common}`} fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="30" y="20" width="140" height="85" rx="6" />
          <rect x="38" y="28" width="124" height="69" rx="2" fill="currentColor" fillOpacity="0.08" />
          <path d="M20 112h160l-8 16H28z" fill="currentColor" fillOpacity="0.06" />
          <line x1="80" y1="120" x2="120" y2="120" />
        </svg>
      );
    case 'monitors':
      return (
        <svg viewBox="0 0 200 160" className={`w-3/5 ${common}`} fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="20" y="20" width="160" height="100" rx="6" />
          <rect x="28" y="28" width="144" height="84" rx="2" fill="currentColor" fillOpacity="0.08" />
          <path d="M100 120v20M70 140h60" />
        </svg>
      );
    case 'keyboards':
      return (
        <svg viewBox="0 0 200 100" className={`w-3/5 ${common}`} fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="20" y="30" width="160" height="50" rx="4" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <rect key={i} x={28 + i * 16} y="38" width="12" height="12" rx="1" fill="currentColor" fillOpacity="0.1" />
          ))}
          <rect x="28" y="56" width="144" height="6" rx="1" fill="currentColor" fillOpacity="0.1" />
        </svg>
      );
    case 'mice':
      return (
        <svg viewBox="0 0 120 160" className={`w-2/5 ${common}`} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M60 20c-22 0-38 16-38 40v40c0 22 16 40 38 40s38-18 38-40V60c0-24-16-40-38-40z" />
          <line x1="60" y1="20" x2="60" y2="50" />
          <circle cx="60" cy="38" r="3" fill="currentColor" />
        </svg>
      );
    case 'headphones':
      return (
        <svg viewBox="0 0 200 160" className={`w-3/5 ${common}`} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M30 90v-20a70 70 0 0 1 140 0v20" />
          <rect x="20" y="85" width="30" height="50" rx="8" fill="currentColor" fillOpacity="0.08" />
          <rect x="150" y="85" width="30" height="50" rx="8" fill="currentColor" fillOpacity="0.08" />
        </svg>
      );
    case 'hubs':
      return (
        <svg viewBox="0 0 200 100" className={`w-3/5 ${common}`} fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="30" y="35" width="140" height="30" rx="4" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={40 + i * 24} y="42" width="16" height="16" rx="2" fill="currentColor" fillOpacity="0.1" />
          ))}
        </svg>
      );
    case 'stands':
      return (
        <svg viewBox="0 0 160 160" className={`w-2/5 ${common}`} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M40 140V40a40 40 0 0 1 80 0v100" />
          <line x1="40" y1="140" x2="120" y2="140" />
          <line x1="80" y1="20" x2="80" y2="140" strokeDasharray="4 4" />
        </svg>
      );
    case 'storage':
      return (
        <svg viewBox="0 0 160 100" className={`w-2/5 ${common}`} fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="20" y="30" width="120" height="50" rx="6" />
          <circle cx="120" cy="55" r="4" fill="currentColor" />
          <line x1="30" y1="45" x2="90" y2="45" strokeDasharray="3 3" />
          <line x1="30" y1="65" x2="90" y2="65" strokeDasharray="3 3" />
        </svg>
      );
    case 'desk':
      return (
        <svg viewBox="0 0 200 120" className={`w-3/5 ${common}`} fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="10" y="30" width="180" height="60" rx="4" />
          <rect x="70" y="45" width="60" height="30" rx="2" fill="currentColor" fillOpacity="0.08" />
          <circle cx="100" cy="60" r="8" fill="currentColor" fillOpacity="0.1" />
        </svg>
      );
    default:
      return null;
  }
}
