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
      <div className="flex-1 flex flex-col justify-center px-5 lg:px-8 py-16 lg:py-22 relative overflow-hidden">
        {/* Abstract background ambient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.01] rounded-full blur-[120px] pointer-events-none" />
        
        <div ref={ref} className="max-w-6xl z-10">
          <span
            className={`label-mono block mb-6 transition-all duration-700 tracking-[0.25em] text-white/60 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            ARC — INFRASTRUCTURE FOR THE FUTURE OF COMMERCE
          </span>

          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.9] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-ink-50 to-ink-400">
            <span className="block overflow-hidden">
              <span
                className={`block transition-all duration-700 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                COMMERCE
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                className={`block text-ink-300 transition-all duration-700 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
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
            className={`mt-14 lg:mt-18 grid grid-cols-1 md:grid-cols-3 gap-6 bg-transparent transition-opacity duration-700 ${
              visible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '450ms' }}
          >
            <NavChoice
              to="/merchant"
              label="MERCHANT"
              description="Manage catalog, inspect logs, configure policies, and scale with automated AI recommendations."
              icon={Store}
              index={0}
            />
            <NavChoice
              to="/buyer"
              label="AI BUYER"
              description="Experience autonomous shopping. Query agent-ready catalogs using natural language."
              icon={Bot}
              index={1}
            />
            <NavChoice
              to="/agent"
              label="AGENT RUNS"
              description="Audit step-by-step decision trees, transaction safety logs, and policy executions in real-time."
              icon={ShieldCheck}
              index={2}
            />
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-line/60 px-5 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <span className="label-mono text-ink-200">SELL TO HUMANS. SELL TO AGENTS.</span>
          <span className="label-mono text-ink-400">RAZORPAY TEST MODE · NO REAL FUNDS</span>
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
      className="group relative glass-card glow-accent p-8 lg:p-10 flex flex-col justify-between overflow-hidden min-h-[260px] border border-white/[0.08]"
    >
      {/* Accent hover background ray */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex items-start justify-between mb-8">
        <span className="font-mono text-xs font-bold text-white/40 tracking-wider">0{index + 1}</span>
        <Icon className="w-5 h-5 text-ink-300 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
      </div>
      
      <div className="mt-auto">
        <div className="font-display text-2xl font-bold tracking-tight text-white group-hover:translate-x-1 transition-transform duration-300">
          {label}
        </div>
        <div className="mt-3 text-sm text-ink-300 leading-relaxed font-light group-hover:text-ink-100 transition-colors duration-300">
          {description}
        </div>
      </div>
      
      <ArrowUpRight
        className="absolute bottom-6 right-6 w-5 h-5 text-ink-300 opacity-0 group-hover:opacity-100 group-hover:text-white transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        strokeWidth={1.5}
      />
    </Link>
  );
}
