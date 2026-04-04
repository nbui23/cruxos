import { InsightCard } from '@/components/insight-card';
import { PerformanceChart } from '@/components/performance-chart';
import { SleepChart } from '@/components/sleep-chart';
import { formatDateLong } from '@/lib/format';
import { getDashboardData, getPerformanceReportData } from '@/lib/queries';
import { buildPerformanceTrend, buildSleepTrend } from '@/lib/reports';

export const dynamic = 'force-dynamic';

export default async function PerformanceReportPage() {
  const [report, dashboard] = await Promise.all([getPerformanceReportData(), getDashboardData()]);
  const leadInsight = report.insights[0];

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-lg shadow-black/20">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">28-day performance insight report</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">What conditions are most associated with stronger sessions?</h2>
        <p className="mt-3 max-w-3xl text-sm text-slate-400">
          This report uses hardest grade sent per session as the anchor metric, then evaluates recent sleep, protein, finger pain, and hangboard load to explain meaningful patterns without resorting to black-box models.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-sm text-slate-400">Report date</p>
            <p className="mt-1 text-lg font-semibold text-white">{formatDateLong(report.reportDate)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-sm text-slate-400">Window</p>
            <p className="mt-1 text-lg font-semibold text-white">{report.windowLabel}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-sm text-slate-400">Sessions analyzed</p>
            <p className="mt-1 text-lg font-semibold text-white">{report.sessionCount}</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-4">
            <p className="text-sm text-cyan-200">Top report signal</p>
            <p className="mt-1 text-lg font-semibold text-white">{leadInsight?.metricDelta ?? 'n/a'}</p>
            <p className="mt-2 text-xs text-slate-300">{leadInsight?.title ?? 'Waiting for a strong comparison.'}</p>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">How to read this</p>
          <p className="mt-2 text-sm text-slate-300">
            Every insight compares two conditions, quantifies the average grade difference, and states the threshold used. The goal is simple: show what conditions tend to line up with stronger or weaker climbing days.
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <PerformanceChart data={buildPerformanceTrend(dashboard.sessions)} />
        <SleepChart data={buildSleepTrend(dashboard.sleepEntries)} />
      </section>

      <section className="space-y-4">
        {report.insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </section>
    </div>
  );
}
