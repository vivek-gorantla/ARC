import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ThemeToggle } from './ThemeToggle';

export type Mode = 'merchant' | 'buyer' | 'agent';

const modeLinks: Record<Mode, { label: string; path: string }[]> = {
  merchant: [
    { label: 'OVERVIEW', path: '/merchant' },
    { label: 'CATALOG', path: '/merchant/catalog' },
    { label: 'AI COMMERCE', path: '/merchant/ai-commerce' },
    { label: 'RECOMMENDATIONS', path: '/merchant/ai-commerce/recommendations' },
    { label: 'CAMPAIGNS', path: '/merchant/campaigns' },
    { label: 'ORDERS', path: '/merchant/orders' },
    { label: 'REVENUE', path: '/merchant/revenue' },
    { label: 'ACTIVITY', path: '/merchant/activity' },
    { label: 'POLICIES', path: '/merchant/policies' },
  ],
  buyer: [
    { label: 'DISCOVER', path: '/buyer/discover' },
    { label: 'SHOP', path: '/buyer' },
    { label: 'BAG', path: '/buyer/bag' },
    { label: 'CHECKOUT', path: '/buyer/checkout' },
    { label: 'PURCHASES', path: '/buyer/purchases' },
  ],
  agent: [
    { label: 'LIVE', path: '/agent' },
    { label: 'RUNS', path: '/agent/runs' },
    { label: 'AUDIT', path: '/agent/audit' },
    { label: 'FAILURES', path: '/agent/failures' },
    { label: 'POLICIES', path: '/agent/policies' },
  ],
};

const modeLabels: Record<Mode, string> = {
  merchant: 'MERCHANT',
  buyer: 'BUYER',
  agent: 'AGENT',
};

export function Navigation({ mode }: { mode: Mode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = modeLinks[mode];
  const isActive = (path: string) =>
    location.pathname === path || (path !== `/${mode}` && location.pathname.startsWith(path));

  return (
    <>
      <header className="sticky top-0 z-40 bg-ink-950/90 backdrop-blur-xl border-b border-line">
        {/* Top row */}
        <div className="flex items-center justify-between h-14 px-5 lg:px-8">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-baseline gap-1 group">
              <span className="text-lg font-extrabold tracking-tight text-white">ARC</span>
              <span className="text-ink-300 text-lg font-light">/</span>
              <span className="label-mono text-ink-200 group-hover:text-white transition-colors">
                {modeLabels[mode]}
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ModeSwitcher current={mode} />
            <StatusBadge />
            <ThemeToggle />
          </div>

          <button
            className="md:hidden text-ink-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sub-nav row */}
        <nav className="hidden md:flex items-center gap-1 px-5 lg:px-8 h-10 border-t border-line/50 overflow-x-auto">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 label-mono transition-colors whitespace-nowrap ${
                isActive(link.path)
                  ? 'text-white border-b border-white -mb-px'
                  : 'text-ink-300 hover:text-ink-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-30 bg-ink-950 animate-fade-in overflow-y-auto">
          <div className="p-5 space-y-6">
            <div>
              <span className="label-mono block mb-3">MODE</span>
              <div className="grid grid-cols-3 gap-2">
                {(['merchant', 'buyer', 'agent'] as Mode[]).map((m) => (
                  <Link
                    key={m}
                    to={m === 'merchant' ? '/merchant' : m === 'buyer' ? '/buyer' : '/agent'}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2 text-center label-mono border ${
                      mode === m
                        ? 'border-white text-white'
                        : 'border-line text-ink-300'
                    }`}
                  >
                    {modeLabels[m]}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <span className="label-mono block mb-3">NAVIGATION</span>
              <div className="space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 label-mono border-l-2 ${
                      isActive(link.path)
                        ? 'border-white text-white bg-ink-900'
                        : 'border-transparent text-ink-300'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-line flex items-center gap-4">
              <StatusBadge />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ModeSwitcher({ current }: { current: Mode }) {
  return (
    <div className="flex items-center border border-line">
      {(['merchant', 'buyer', 'agent'] as Mode[]).map((m, i) => (
        <Link
          key={m}
          to={m === 'merchant' ? '/merchant' : m === 'buyer' ? '/buyer' : '/agent'}
          className={`px-3 py-1.5 label-mono transition-colors ${
            i > 0 ? 'border-l border-line' : ''
          } ${
            current === m
              ? 'text-white bg-ink-800'
              : 'text-ink-300 hover:text-ink-100'
          }`}
        >
          {modeLabels[m]}
        </Link>
      ))}
    </div>
  );
}
