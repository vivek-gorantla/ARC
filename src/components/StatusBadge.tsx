import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

const readinessItems = [
  { label: 'CATALOG', status: 'Machine-readable' },
  { label: 'DISCOVERY', status: 'Enabled' },
  { label: 'CART', status: 'Enabled' },
  { label: 'CHECKOUT', status: 'Enabled' },
  { label: 'PAYMENT', status: 'Razorpay Test Mode' },
  { label: 'AUDIT', status: 'Enabled' },
];

export function StatusBadge() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 border border-line hover:border-ink-500 transition-colors group"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-pulse-dot bg-white" />
        </span>
        <span className="label-mono-light">AI COMMERCE READY</span>
        <ChevronDown
          className={`w-3 h-3 text-ink-200 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-ink-900 border border-line animate-fade-in z-50">
          <div className="p-4 border-b border-line">
            <span className="label-mono">SYSTEM STATUS</span>
          </div>
          <div className="py-1">
            {readinessItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span className="label-mono-light">{item.label}</span>
                </div>
                <span className="text-xs text-ink-200 font-mono">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
