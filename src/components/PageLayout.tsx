import { type ReactNode } from 'react';
import { Navigation, type Mode } from './Navigation';

interface PageLayoutProps {
  mode: Mode;
  children: ReactNode;
}

export function PageLayout({ mode, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-ink-950 noise">
      <Navigation mode={mode} />
      <main className="animate-fade-in">{children}</main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line mt-22">
      <div className="px-5 lg:px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-extrabold tracking-tight text-white">ARC</span>
          <span className="text-ink-300 text-sm font-light">/</span>
          <span className="label-mono">AGENTIC COMMERCE INFRASTRUCTURE</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="label-mono">HUMAN-FRIENDLY · AGENT-READY · TRANSACTION-SAFE</span>
        </div>
      </div>
    </footer>
  );
}
