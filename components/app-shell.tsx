import Link from 'next/link';
import type { ReactNode } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/log', label: 'Log' },
  { href: '/reports/performance', label: 'Report' },
  { href: '/history', label: 'History' },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_32%),linear-gradient(180deg,#020617_0%,#020617_38%,#0f172a_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-20 rounded-3xl border border-white/10 bg-slate-950/85 px-4 py-4 shadow-lg shadow-black/20 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
                  CruxOS
                </span>
                <span className="text-xs text-slate-400">Single-user climbing performance system</span>
              </div>
              <h1 className="mt-3 text-2xl font-semibold text-white">Train smarter, recover clearer.</h1>
            </div>
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400/60 hover:bg-cyan-500/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
