import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-10 text-center shadow-lg shadow-black/20">
      <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Missing page</p>
      <h2 className="mt-3 text-3xl font-semibold text-white">This route slipped off the wall.</h2>
      <p className="mt-3 text-sm text-slate-400">Head back to the dashboard and keep the training log moving.</p>
      <Link href="/" className="mt-6 inline-flex rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950">
        Back to dashboard
      </Link>
    </div>
  );
}
