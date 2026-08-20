import type { Category } from '@/types';

interface ProductImageProps {
  imageId: string;
  category: Category;
  className?: string;
}

const productImages: Record<string, string> = {
  'LAP-001': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
  'LAP-002': 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop',
  'LAP-003': 'https://images.unsplash.com/photo-1496181130204-755241544e35?q=80&w=800&auto=format&fit=crop',
  'LAP-004': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop',
  'MON-001': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop',
  'MON-002': 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800&auto=format&fit=crop',
  'KBD-001': 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=800&auto=format&fit=crop',
  'KBD-002': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop',
  'MOU-001': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800&auto=format&fit=crop',
  'MOU-002': 'https://images.unsplash.com/photo-1625806782771-0810972f6f0f?q=80&w=800&auto=format&fit=crop',
  'HDP-001': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
  'HDP-002': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop',
  'HUB-001': 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=800&auto=format&fit=crop',
  'HUB-002': 'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=800&auto=format&fit=crop',
  'STND-001': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop', // wood stand / setup scene
  'STND-002': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
  'STOR-001': 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=800&auto=format&fit=crop',
  'STOR-002': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
  'DSK-001': 'https://images.unsplash.com/photo-1632292224971-0d45778bd364?q=80&w=800&auto=format&fit=crop',
  'DSK-002': 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=800&auto=format&fit=crop',
};

const categoryFallbackImages: Record<Category, string> = {
  laptops: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
  monitors: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop',
  keyboards: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=800&auto=format&fit=crop',
  mice: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800&auto=format&fit=crop',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
  hubs: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=800&auto=format&fit=crop',
  stands: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop',
  storage: 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=800&auto=format&fit=crop',
  desk: 'https://images.unsplash.com/photo-1632292224971-0d45778bd364?q=80&w=800&auto=format&fit=crop',
};

export function ProductImage({ imageId, category, className = '' }: ProductImageProps) {
  const imageUrl = productImages[imageId] || categoryFallbackImages[category];

  return (
    <div className={`relative overflow-hidden bg-ink-900 group-hover/img:scale-105 transition-transform duration-700 ${className}`}>
      <img
        src={imageUrl}
        alt={imageId}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-3 right-3 label-mono bg-ink-950/80 border border-white/10 px-2 py-0.5 text-white/80 text-[9px] backdrop-blur-sm tracking-wider font-mono">
        {imageId}
      </div>
    </div>
  );
}
