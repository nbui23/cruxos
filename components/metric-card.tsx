export function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/80 p-5 shadow-lg shadow-black/20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{helper}</p>
    </article>
  );
}
