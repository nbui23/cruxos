import Link from 'next/link';

import { InsightCard } from '@/components/insight-card';
import { MetricCard } from '@/components/metric-card';
import { PerformanceChart } from '@/components/performance-chart';
import { SleepChart } from '@/components/sleep-chart';
import { WeeklyGuidanceCard } from '@/components/weekly-guidance-card';
import { requireCurrentUser } from '@/lib/auth/server';
import { formatDateLong, formatHours } from '@/lib/format';
import { getDashboardData, getPerformanceReportData } from '@/lib/queries';
import { buildPerformanceTrend, buildSleepTrend } from '@/lib/reports';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const [dashboard, report] = await Promise.all([getDashboardData(user.id), getPerformanceReportData(user.id)]);
  const leadInsight = report.insights[0];
  const weeklyGuidance = report.weeklyGuidance;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-cyan-950/35 p-8 shadow-2xl shadow-black/30">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">CruxOS</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            This week’s question: what should you repeat or avoid before your next hard session?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
            CruxOS keeps capture fast on mobile, then uses your recent climbing, recovery, and finger-state data to surface
            evidence-backed guidance only when the sample is strong enough.
          </p>
          <div className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Weekly guidance</p>
            <p className="mt-2 text-lg font-semibold text-white">{weeklyGuidance.title}</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">{weeklyGuidance.summary}</p>
            <p className="mt-4 text-sm leading-7 text-slate-200">{weeklyGuidance.nextStep}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/reports/performance"
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300"
            >
              Open the evidence report
            </Link>
            <Link
              href="/log"
              className="rounded-full border border-white/10 bg-white/[0.02] px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/60 hover:bg-cyan-500/10"
            >
              Log a new session
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-slate-900/95 to-slate-950/80 p-8 shadow-lg shadow-black/20">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">What the report currently sees</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{leadInsight?.title ?? report.windowLabel}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {leadInsight?.summary ?? 'Open the report to see the strongest comparison-based insight from the last 28 days.'}
          </p>
          <dl className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-4">
              <dt className="text-sm text-slate-400">Sessions analyzed</dt>
              <dd className="text-xl font-semibold text-white">{report.sessionCount}</dd>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-4">
              <dt className="text-sm text-slate-400">Current strongest difference</dt>
              <dd className="text-xl font-semibold text-white">{leadInsight?.metricDelta ?? 'n/a'}</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-4">
              <dt className="text-sm text-slate-400">Latest session</dt>
              <dd className="text-xl font-semibold text-white">
                {dashboard.metrics.latestGrade && dashboard.metrics.latestSessionDate
                  ? `${dashboard.metrics.latestGrade} · ${formatDateLong(dashboard.metrics.latestSessionDate)}`
                  : 'No sessions yet'}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Recent sessions"
          value={String(dashboard.metrics.totalSessions)}
          helper="Enough sessions to compare stronger vs weaker conditions."
        />
        <MetricCard
          label="Average sleep"
          value={formatHours(dashboard.metrics.avgSleepHours)}
          helper="Used to compare higher-sleep vs lower-sleep sessions."
        />
        <MetricCard
          label="Average protein"
          value={`${Math.round(dashboard.metrics.avgProteinGrams)}g`}
          helper="Used to compare higher-protein vs lower-protein days."
        />
        <MetricCard
          label="Average finger pain"
          value={dashboard.metrics.avgPainScore.toFixed(1)}
          helper="Used to compare high stress vs controlled load."
        />
      </section>

      <WeeklyGuidanceCard guidance={weeklyGuidance} />

      <section className="grid gap-6 xl:grid-cols-2">
        <PerformanceChart data={buildPerformanceTrend(dashboard.sessions)} />
        <SleepChart data={buildSleepTrend(dashboard.sleepEntries)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Top insights</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Evidence from your recent sessions</h3>
            </div>
            <Link href="/reports/performance" className="text-sm font-medium text-cyan-300">
              See full report →
            </Link>
          </div>
          {report.insights.slice(0, 2).map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/80 p-6 shadow-lg shadow-black/20">
          <h3 className="text-lg font-semibold text-white">What’s different in beta</h3>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
            <li>• The product is now account-scoped, so your logging follows you across devices.</li>
            <li>• Mobile is for capture and weekly review; web stays focused on evidence and analysis.</li>
            <li>• Recommendations are withheld when recent data is too sparse or one-sided.</li>
            <li>• The report still uses deterministic, comparison-based logic — no black-box scoring.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
