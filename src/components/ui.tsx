import { type ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';

interface SectionHeadingProps {
  lines: string[];
  subtitle?: string;
  align?: 'left' | 'center';
  mode?: 'dark' | 'light';
}

export function SectionHeading({ lines, subtitle, align = 'left', mode = 'dark' }: SectionHeadingProps) {
  const { ref, visible } = useReveal();
  const alignClass = align === 'center' ? 'text-center mx-auto' : '';
  const textColor = mode === 'light' 
    ? 'text-ink-950 font-black' 
    : 'text-transparent bg-clip-text bg-gradient-to-r from-white via-ink-50 to-ink-300 font-black';

  return (
    <div ref={ref} className={`${alignClass} max-w-4xl`}>
      <h1 className={`font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tighter uppercase ${textColor}`}>
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden">
            <span
              className={`block transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {line}
            </span>
          </span>
        ))}
      </h1>
      {subtitle && (
        <p
          className={`mt-6 text-lg md:text-xl ${mode === 'light' ? 'text-ink-500' : 'text-ink-200'} font-light max-w-2xl ${
            visible ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-700`}
          style={{ transitionDelay: `${lines.length * 100 + 100}ms` }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

interface LabelProps {
  children: ReactNode;
  variant?: 'default' | 'light' | 'dark';
  className?: string;
}

export function Label({ children, variant = 'default', className = '' }: LabelProps) {
  const cls =
    variant === 'light' ? 'label-mono-light' : variant === 'dark' ? 'label-mono-dark' : 'label-mono';
  return <span className={`${cls} ${className}`}>{children}</span>;
}

interface StatusDotProps {
  status: 'success' | 'pending' | 'blocked' | 'active';
  label?: string;
}

export function StatusDot({ status, label }: StatusDotProps) {
  const colors = {
    success: 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]',
    pending: 'bg-ink-300',
    blocked: 'bg-ink-100 border border-ink-300',
    active: 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] animate-pulse-dot',
  };
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${colors[status]}`} />
      {label && <span className="label-mono-light">{label}</span>}
    </span>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  mode?: 'dark' | 'light';
}

export function MetricCard({ label, value, subValue, mode = 'dark' }: MetricCardProps) {
  const cardStyle = mode === 'light' 
    ? 'glass-card-light p-6 relative overflow-hidden group/metric border-black/[0.08]' 
    : 'glass-card p-6 relative overflow-hidden group/metric border-white/[0.08] glow-accent';
  
  const labelColor = mode === 'light' ? 'text-ink-500' : 'text-ink-300';
  const valueColor = mode === 'light' ? 'text-ink-950 font-black' : 'text-transparent bg-clip-text bg-gradient-to-r from-white to-ink-200 font-black';

  return (
    <div className={cardStyle}>
      {/* Top accent glow effect */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover/metric:translate-x-full transition-transform duration-1000" />
      
      <div className={labelColor}>
        <span className="label-mono">{label}</span>
      </div>
      <div className={`mt-3 font-display text-4xl lg:text-5xl tracking-tighter ${valueColor}`}>
        {value}
      </div>
      {subValue && (
        <div className="mt-2 text-xs text-ink-300 font-mono tracking-wide">{subValue}</div>
      )}
    </div>
  );
}
