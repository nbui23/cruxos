import { differenceInCalendarDays, formatISO, startOfDay, subDays } from 'date-fns';
import type { ClimbingSession, FingerRehabEntry, HangboardSession, NutritionEntry, SleepEntry } from '@prisma/client';

import type { InsightCard, PerformanceReport, WeeklyGuidance } from './types';

type ReportInput = {
  reportEnd: Date;
  sessions: ClimbingSession[];
  sleepEntries: SleepEntry[];
  nutritionEntries: NutritionEntry[];
  hangboardSessions: HangboardSession[];
  rehabEntries: FingerRehabEntry[];
};

const average = (values: number[]) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0);
const averageGrade = (sessions: ClimbingSession[]) => average(sessions.map((session) => session.normalizedGrade));

function formatDelta(delta: number) {
  return `${delta > 0 ? '+' : ''}${delta.toFixed(1)} grade steps`;
}

function formatPercentLift(delta: number, baseline: number) {
  if (baseline === 0) return 'n/a';
  const lift = (delta / baseline) * 100;
  return `${lift > 0 ? '+' : ''}${lift.toFixed(0)}%`;
}

function comparisonEvidence({
  leftLabel,
  rightLabel,
  leftCount,
  rightCount,
  leftAverage,
  rightAverage,
  threshold,
}: {
  leftLabel: string;
  rightLabel: string;
  leftCount: number;
  rightCount: number;
  leftAverage: number;
  rightAverage: number;
  threshold: string;
}) {
  return [
    `Comparison: ${leftLabel} (${leftCount} sessions) vs ${rightLabel} (${rightCount} sessions).`,
    `Average normalized grade: ${leftAverage.toFixed(1)} vs ${rightAverage.toFixed(1)}.`,
    `Threshold: ${threshold}.`,
  ];
}

function findSleepBefore(sessionDate: Date, entries: SleepEntry[]) {
  return entries.find((entry) => differenceInCalendarDays(sessionDate, entry.entryDate) === 1);
}

function findNutritionBefore(sessionDate: Date, entries: NutritionEntry[]) {
  return entries.find((entry) => differenceInCalendarDays(sessionDate, entry.entryDate) === 1);
}

function painAverage(sessionDate: Date, entries: FingerRehabEntry[]) {
  const relevant = entries.filter((entry) => {
    const delta = differenceInCalendarDays(sessionDate, entry.entryDate);
    return delta >= 0 && delta <= 2;
  });

  return average(relevant.map((entry) => entry.painScore));
}

function hangboardLoad(sessionDate: Date, entries: HangboardSession[]) {
  return entries.filter((entry) => {
    const delta = differenceInCalendarDays(sessionDate, entry.sessionDate);
    return delta >= 0 && delta <= 2;
  }).length;
}

function buildSleepInsight(sessions: ClimbingSession[], sleepEntries: SleepEntry[]): InsightCard | null {
  const rested = sessions.filter((session) => (findSleepBefore(session.sessionDate, sleepEntries)?.hours ?? 0) >= 7);
  const tired = sessions.filter((session) => (findSleepBefore(session.sessionDate, sleepEntries)?.hours ?? 0) < 7);
  if (rested.length < 2 || tired.length < 2) return null;

  const restedAverage = averageGrade(rested);
  const tiredAverage = averageGrade(tired);
  const delta = restedAverage - tiredAverage;
  if (Math.abs(delta) < 0.6) return null;

  return {
    id: 'sleep-threshold',
    title: '7+ hours sleep vs under 7 hours',
    summary:
      delta > 0
        ? `Sessions after 7+ hours of sleep averaged ${delta.toFixed(1)} grade steps higher (${formatPercentLift(delta, tiredAverage)}) than sessions after shorter sleep.`
        : `Sessions after shorter sleep averaged ${Math.abs(delta).toFixed(1)} grade steps higher (${formatPercentLift(-delta, restedAverage)}) than 7+ hour nights in this sample.`,
    impact: delta > 0 ? 'positive' : 'negative',
    metricDelta: formatDelta(delta),
    evidence: comparisonEvidence({
      leftLabel: '7+ hours sleep',
      rightLabel: 'under 7 hours',
      leftCount: rested.length,
      rightCount: tired.length,
      leftAverage: restedAverage,
      rightAverage: tiredAverage,
      threshold: 'prior-night sleep ≥ 7.0h',
    }),
    sampleSize: {
      leftCount: rested.length,
      rightCount: tired.length,
    },
  };
}

function buildPainInsight(sessions: ClimbingSession[], rehabEntries: FingerRehabEntry[], hangboardSessions: HangboardSession[]): InsightCard | null {
  const highLoad = sessions.filter((session) => painAverage(session.sessionDate, rehabEntries) >= 5 || hangboardLoad(session.sessionDate, hangboardSessions) >= 2);
  const normalLoad = sessions.filter((session) => !highLoad.some((candidate) => candidate.id === session.id));
  if (highLoad.length < 2 || normalLoad.length < 2) return null;

  const highLoadAverage = averageGrade(highLoad);
  const normalAverage = averageGrade(normalLoad);
  const delta = highLoadAverage - normalAverage;
  if (Math.abs(delta) < 0.6) return null;

  return {
    id: 'pain-volume-load',
    title: 'High finger stress vs controlled load',
    summary:
      delta < 0
        ? `Sessions during high finger stress averaged ${Math.abs(delta).toFixed(1)} grade steps lower (${formatPercentLift(-delta, normalAverage)}) than lower-stress sessions.`
        : `High finger stress averaged ${delta.toFixed(1)} grade steps higher (${formatPercentLift(delta, normalAverage)}) than lower-stress sessions, so treat this as a weak counter-signal.`,
    impact: delta < 0 ? 'negative' : 'neutral',
    metricDelta: formatDelta(delta),
    evidence: comparisonEvidence({
      leftLabel: 'high stress/load',
      rightLabel: 'lower stress/load',
      leftCount: highLoad.length,
      rightCount: normalLoad.length,
      leftAverage: highLoadAverage,
      rightAverage: normalAverage,
      threshold: 'pain ≥ 5 or 2+ hangboard sessions in the prior 3 days',
    }),
    sampleSize: {
      leftCount: highLoad.length,
      rightCount: normalLoad.length,
    },
  };
}

function buildProteinInsight(sessions: ClimbingSession[], nutritionEntries: NutritionEntry[]): InsightCard | null {
  const highProtein = sessions.filter((session) => (findNutritionBefore(session.sessionDate, nutritionEntries)?.proteinGrams ?? 0) >= 110);
  const lowProtein = sessions.filter((session) => (findNutritionBefore(session.sessionDate, nutritionEntries)?.proteinGrams ?? 0) < 110);
  if (highProtein.length < 2 || lowProtein.length < 2) return null;

  const highProteinAverage = averageGrade(highProtein);
  const lowProteinAverage = averageGrade(lowProtein);
  const delta = highProteinAverage - lowProteinAverage;
  if (Math.abs(delta) < 0.4) return null;

  return {
    id: 'protein-consistency',
    title: '110g+ protein vs under 110g',
    summary:
      delta > 0
        ? `Sessions after 110g+ protein days averaged ${delta.toFixed(1)} grade steps higher (${formatPercentLift(delta, lowProteinAverage)}) than lower-protein days.`
        : `Lower-protein days averaged ${Math.abs(delta).toFixed(1)} grade steps higher (${formatPercentLift(-delta, highProteinAverage)}) than 110g+ days in this sample.`,
    impact: delta > 0 ? 'positive' : 'neutral',
    metricDelta: formatDelta(delta),
    evidence: comparisonEvidence({
      leftLabel: '110g+ protein',
      rightLabel: 'under 110g',
      leftCount: highProtein.length,
      rightCount: lowProtein.length,
      leftAverage: highProteinAverage,
      rightAverage: lowProteinAverage,
      threshold: 'prior-day protein ≥ 110g',
    }),
    sampleSize: {
      leftCount: highProtein.length,
      rightCount: lowProtein.length,
    },
  };
}

function buildWeeklyGuidance(sessions: ClimbingSession[], leadInsight: InsightCard | undefined): WeeklyGuidance {
  const spanDays = sessions.length > 1 ? differenceInCalendarDays(sessions.at(-1)!.sessionDate, sessions[0]!.sessionDate) : 0;

  if (sessions.length < 6) {
    return {
      status: 'needs-more-data',
      title: 'Not enough data yet',
      summary: 'CruxOS needs a little more recent history before it should tell you what to repeat or avoid this week.',
      evidence: ['A few more climbing sessions are needed before the report can compare stronger vs weaker conditions honestly.'],
      nextStep: 'Keep logging your next sessions plus sleep, protein, and finger-state context.',
    };
  }

  if (spanDays < 14) {
    return {
      status: 'needs-more-data',
      title: 'Stretch the sample across more weeks',
      summary: 'The recent sample is still too compressed. CruxOS waits for at least a 2-week spread before making a weekly recommendation.',
      evidence: ['Weekly guidance is withheld until the app can compare sessions across more than one short cluster.'],
      nextStep: 'Keep logging for another week so the recommendation is based on a real weekly pattern.',
    };
  }

  if (!leadInsight || leadInsight.id === 'needs-more-data') {
    return {
      status: 'needs-more-data',
      title: 'The pattern is not trustworthy yet',
      summary: 'Recent sessions do not yet show a strong, repeatable difference across recovery or load conditions.',
      evidence: ['CruxOS is withholding the recommendation rather than bluffing confidence.'],
      nextStep: 'Add sleep, protein, and finger-state context for the next few sessions to unlock a clearer comparison.',
    };
  }

  const nextStep =
    leadInsight.impact === 'positive'
      ? 'Repeat the stronger setup above before your next hard session and keep logging so the trend can be retested.'
      : 'Avoid stacking your next hard day under the weaker condition above unless the next few logs overturn the trend.';

  return {
    status: 'ready',
    title: 'What to repeat or avoid this week',
    summary: `${leadInsight.summary} Treat this as a tendency, not a guarantee.`,
    evidence: leadInsight.evidence,
    nextStep,
  };
}

export function buildPerformanceReport(input: ReportInput): PerformanceReport {
  const reportStart = startOfDay(subDays(input.reportEnd, 27));
  const sessions = input.sessions
    .filter((session) => session.sessionDate >= reportStart)
    .sort((left, right) => left.sessionDate.getTime() - right.sessionDate.getTime());
  const insights = [
    buildSleepInsight(sessions, input.sleepEntries),
    buildPainInsight(sessions, input.rehabEntries, input.hangboardSessions),
    buildProteinInsight(sessions, input.nutritionEntries),
  ].filter(Boolean) as InsightCard[];

  if (insights.length === 0) {
    insights.push({
      id: 'needs-more-data',
      title: 'More variance needed',
      summary: 'The report needs more sessions across different recovery states before it can surface a strong explanatory pattern.',
      impact: 'neutral',
      metricDelta: 'n/a',
      evidence: ['Keep logging climbing sessions plus sleep, protein, and finger-pain context to strengthen the report.'],
    });
  }

  insights.sort((left, right) => Math.abs(parseFloat(right.metricDelta)) - Math.abs(parseFloat(left.metricDelta)));

  return {
    reportDate: formatISO(input.reportEnd, { representation: 'date' }),
    windowLabel: `${formatISO(reportStart, { representation: 'date' })} → ${formatISO(input.reportEnd, { representation: 'date' })}`,
    primaryMetricLabel: 'Hardest grade sent per session',
    sessionCount: sessions.length,
    averageNormalizedGrade: sessions.length ? average(sessions.map((session) => session.normalizedGrade)) : null,
    insights,
    weeklyGuidance: buildWeeklyGuidance(sessions, insights[0]),
  };
}

export function buildPerformanceTrend(sessions: ClimbingSession[]) {
  return sessions.map((session) => ({
    id: session.id,
    date: formatISO(session.sessionDate, { representation: 'date' }),
    grade: session.hardestGrade,
    normalizedGrade: session.normalizedGrade,
    rpe: session.sessionRpe,
  }));
}

export function buildSleepTrend(entries: SleepEntry[]) {
  return entries.map((entry) => ({
    date: formatISO(entry.entryDate, { representation: 'date' }),
    hours: entry.hours,
    qualityScore: entry.qualityScore,
  }));
}
