import { clsx } from 'clsx';

import type { InsightCard as InsightCardType } from '@/lib/types';

const impactStyles = {
  positive: 'border-emerald-500/30 bg-emerald-500/10',
  negative: 'border-rose-500/30 bg-rose-500/10',
  neutral: 'border-sky-500/30 bg-sky-500/10',
} as const;

export function InsightCard({ insight }: { insight: InsightCardType }) {
  return (
    <article className={clsx('rounded-3xl border p-5 shadow-lg shadow-black/20', impactStyles[insight.impact])}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300/90">{insight.title}</p>
          <h3 className="mt-2 text-xl font-semibold leading-8 text-white">{insight.summary}</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-slate-950/30 px-3 py-1 text-sm font-semibold text-white">{insight.metricDelta}</span>
      </div>
      <ul className="mt-5 space-y-2 text-sm text-slate-200">
        {insight.evidence.map((item) => (
          <li key={item} className="rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-2.5 leading-6">{item}</li>
        ))}
      </ul>
    </article>
  );
}
