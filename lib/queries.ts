import { endOfDay, startOfDay, subDays } from 'date-fns';

import { prisma } from './prisma';
import { buildPerformanceReport } from './reports';

export async function getDashboardData() {
  const [sessions, sleepEntries, nutritionEntries, rehabEntries] = await Promise.all([
    prisma.climbingSession.findMany({ orderBy: { sessionDate: 'desc' }, take: 12 }),
    prisma.sleepEntry.findMany({ orderBy: { entryDate: 'desc' }, take: 14 }),
    prisma.nutritionEntry.findMany({ orderBy: { entryDate: 'desc' }, take: 14 }),
    prisma.fingerRehabEntry.findMany({ orderBy: { entryDate: 'desc' }, take: 14 }),
  ]);

  const latestSession = sessions[0];

  return {
    metrics: {
      totalSessions: sessions.length,
      avgSleepHours: sleepEntries.length ? sleepEntries.reduce((sum: number, entry) => sum + entry.hours, 0) / sleepEntries.length : 0,
      avgProteinGrams: nutritionEntries.length ? nutritionEntries.reduce((sum: number, entry) => sum + entry.proteinGrams, 0) / nutritionEntries.length : 0,
      avgPainScore: rehabEntries.length ? rehabEntries.reduce((sum: number, entry) => sum + entry.painScore, 0) / rehabEntries.length : 0,
      latestGrade: latestSession?.hardestGrade ?? null,
      latestSessionDate: latestSession?.sessionDate.toISOString() ?? null,
    },
    sessions: sessions.reverse(),
    sleepEntries: sleepEntries.reverse(),
  };
}

export async function getHistoryData() {
  const [sessions, sleepEntries, nutritionEntries, bodyweights, hangboard, rehabEntries] = await Promise.all([
    prisma.climbingSession.findMany({ orderBy: { sessionDate: 'desc' } }),
    prisma.sleepEntry.findMany({ orderBy: { entryDate: 'desc' }, take: 20 }),
    prisma.nutritionEntry.findMany({ orderBy: { entryDate: 'desc' }, take: 20 }),
    prisma.bodyweightEntry.findMany({ orderBy: { entryDate: 'desc' }, take: 20 }),
    prisma.hangboardSession.findMany({ orderBy: { sessionDate: 'desc' }, take: 20 }),
    prisma.fingerRehabEntry.findMany({ orderBy: { entryDate: 'desc' }, take: 20 }),
  ]);

  return {
    sessions,
    sleepEntries,
    nutritionEntries,
    bodyweights,
    hangboard,
    rehabEntries,
  };
}

export async function getPerformanceReportData() {
  const now = new Date();
  const reportStart = startOfDay(subDays(now, 27));
  const reportEnd = endOfDay(now);

  const [sessions, sleepEntries, nutritionEntries, hangboardSessions, rehabEntries] = await Promise.all([
    prisma.climbingSession.findMany({ where: { sessionDate: { gte: reportStart, lte: reportEnd } }, orderBy: { sessionDate: 'asc' } }),
    prisma.sleepEntry.findMany({ where: { entryDate: { gte: reportStart, lte: reportEnd } }, orderBy: { entryDate: 'asc' } }),
    prisma.nutritionEntry.findMany({ where: { entryDate: { gte: reportStart, lte: reportEnd } }, orderBy: { entryDate: 'asc' } }),
    prisma.hangboardSession.findMany({ where: { sessionDate: { gte: reportStart, lte: reportEnd } }, orderBy: { sessionDate: 'asc' } }),
    prisma.fingerRehabEntry.findMany({ where: { entryDate: { gte: reportStart, lte: reportEnd } }, orderBy: { entryDate: 'asc' } }),
  ]);

  return buildPerformanceReport({
    reportEnd,
    sessions,
    sleepEntries,
    nutritionEntries,
    hangboardSessions,
    rehabEntries,
  });
}
