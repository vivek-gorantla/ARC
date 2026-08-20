import { Link } from 'react-router-dom';
import { ArrowUpRight, Store, Bot, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useReveal } from '@/hooks/useReveal';

export function LandingPage() {
  const { ref, visible } = useReveal();

  return (
    <div className="min-h-screen bg-ink-950 noise flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 lg:px-8 h-14 border-b border-line">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-extrabold tracking-tight text-white">ARC</span>
          <span className="text-ink-300 text-lg font-light">/</span>
          <span className="label-mono">AGENTIC COMMERCE INFRASTRUCTURE</span>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge />
          <ThemeToggle />
        </div>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col justify-center px-5 lg:px-8 py-16 lg:py-22">
        <div ref={ref} className="max-w-6xl">
          <span
            className={`label-mono block mb-8 transition-opacity duration-700 ${
              visible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            ARC — COMMERCE THAT THINKS
          </span>

          <h1 className="display-2xl text-white">
            <span className="block overflow-hidden">
              <span
                className={`block transition-all duration-700 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                COMMERCE
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                className={`block text-ink-300 transition-all duration-700 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '150ms' }}
              >
                THAT THINKS.
              </span>
            </span>
          </h1>

          <p
            className={`mt-8 text-lg md:text-xl text-ink-200 font-light max-w-xl transition-opacity duration-700 ${
              visible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            Agentic commerce infrastructure for humans and AI buyers. A merchant storefront designed for discovery, recommendation, and transaction-safe autonomous purchasing.
          </p>

          {/* Three navigation choices */}
          <div
            className={`mt-14 lg:mt-18 grid grid-cols-1 md:grid-cols-3 gap-px bg-line transition-opacity duration-700 ${
              visible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '450ms' }}
          >
            <NavChoice
              to="/merchant"
              label="MERCHANT"
              description="Grow revenue."
              icon={Store}
              index={0}
            />
            <NavChoice
              to="/buyer"
              label="AI BUYER"
              description="Discover and transact."
              icon={Bot}
              index={1}
            />
            <NavChoice
              to="/agent"
              label="AGENT"
              description="Inspect every decision."
              icon={ShieldCheck}
              index={2}
            />
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-line px-5 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <span className="label-mono">SELL TO HUMANS. SELL TO AGENTS.</span>
          <span className="label-mono text-ink-300">RAZORPAY TEST MODE · NO REAL FUNDS</span>
        </div>
      </div>
    </div>
  );
}

function NavChoice({
  to,
  label,
  description,
  icon: Icon,
  index,
}: {
  to: string;
  label: string;
  description: string;
  icon: typeof Store;
  index: number;
}) {
  return (
    <Link
      to={to}
      className="group relative bg-ink-950 p-8 lg:p-10 hover:bg-ink-900 transition-colors duration-300 overflow-hidden"
    >
      <div className="flex items-start justify-between mb-12 lg:mb-16">
        <span className="label-mono text-ink-300">0{index + 1}</span>
        <Icon className="w-5 h-5 text-ink-300 group-hover:text-white transition-colors" strokeWidth={1.5} />
      </div>
      <div className="display-sm text-white group-hover:translate-x-1 transition-transform duration-300">
        {label}
      </div>
      <div className="mt-2 text-ink-300 group-hover:text-ink-100 transition-colors">
        {description}
      </div>
      <ArrowUpRight
        className="absolute bottom-6 right-6 w-5 h-5 text-ink-300 opacity-0 group-hover:opacity-100 group-hover:text-white transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        strokeWidth={1.5}
      />
    </Link>
  );
}
