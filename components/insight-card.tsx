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
          <p className="text-sm text-slate-300">{insight.title}</p>
          <h3 className="mt-1 text-xl font-semibold text-white">{insight.summary}</h3>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-white">{insight.metricDelta}</span>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-slate-200">
        {insight.evidence.map((item) => (
          <li key={item} className="rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-2">{item}</li>
        ))}
      </ul>
    </article>
  );
}
