import type { WeeklyGuidance } from '@/lib/types';

export function WeeklyGuidanceCard({ guidance }: { guidance: WeeklyGuidance }) {
  const accent =
    guidance.status === 'ready'
      ? 'border-emerald-400/30 bg-emerald-500/10'
      : 'border-amber-400/30 bg-amber-500/10';

  return (
    <section className={`rounded-3xl border p-6 shadow-lg shadow-black/20 ${accent}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">Weekly guidance</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{guidance.title}</h3>
        </div>
        <span className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
          {guidance.status === 'ready' ? 'Evidence-backed' : 'Still learning'}
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-200">{guidance.summary}</p>

      <ul className="mt-4 space-y-2 text-sm text-slate-200">
        {guidance.evidence.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">What to do next</p>
        <p className="mt-3 text-sm text-slate-200">• {guidance.nextStep}</p>
      </div>
    </section>
  );
}
