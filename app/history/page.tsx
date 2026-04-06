import { requireCurrentUser } from '@/lib/auth/server';
import { formatDateLong } from '@/lib/format';
import { getHistoryData } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const user = await requireCurrentUser();
  const history = await getHistoryData(user.id);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">History</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Recent training and recovery entries</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">Review the latest entries across all tracked domains to make sure the report has enough honest signal before it offers guidance.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
          <h3 className="text-lg font-semibold text-white">Climbing sessions</h3>
          <div className="mt-4 space-y-3">{history.sessions.map((session) => <div key={session.id} className="rounded-2xl border border-white/10 px-4 py-3"><div className="flex items-center justify-between gap-3"><div><p className="font-medium text-white">{session.hardestGrade}</p><p className="text-sm text-slate-400">{formatDateLong(session.sessionDate)}</p></div><div className="text-sm text-slate-300">{session.sessionRpe ? `RPE ${session.sessionRpe}` : 'RPE optional'}</div></div></div>)}</div>
        </section>
        <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
          <h3 className="text-lg font-semibold text-white">Daily recovery stack</h3>
          <div className="mt-4 space-y-3">{history.sleepEntries.slice(0, 8).map((entry) => { const nutrition = history.nutritionEntries.find((candidate) => candidate.entryDate.toISOString() === entry.entryDate.toISOString()); const pain = history.rehabEntries.find((candidate) => candidate.entryDate.toISOString() === entry.entryDate.toISOString()); return <div key={entry.id} className="rounded-2xl border border-white/10 px-4 py-3"><p className="font-medium text-white">{formatDateLong(entry.entryDate)}</p><p className="text-sm text-slate-400">Sleep {entry.hours.toFixed(1)}h · Protein {nutrition?.proteinGrams ?? '—'}g · Pain {pain?.painScore ?? '—'}/10</p></div>; })}</div>
        </section>
      </div>
    </div>
  );
}
