import type { PrismaClient } from '@prisma/client';

import { normalizeGrade } from './grades';

const isoDay = (offset: number) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
};

const climbingDays = [-27, -24, -21, -18, -15, -12, -10, -7, -4, -1];
const strongSessionDays = new Set([-27, -21, -15, -7, -1]);
const weakSessionDays = new Set([-24, -18, -12, -10, -4]);

export async function seedDemoData(prisma: PrismaClient) {
  await prisma.climbingSession.deleteMany();
  await prisma.sleepEntry.deleteMany();
  await prisma.nutritionEntry.deleteMany();
  await prisma.bodyweightEntry.deleteMany();
  await prisma.hangboardSession.deleteMany();
  await prisma.fingerRehabEntry.deleteMany();

  for (let offset = -27; offset <= 0; offset += 1) {
    const entryDate = isoDay(offset);
    const dayIndex = Math.abs(offset);
    const nextClimbingDay = climbingDays.find((day) => day === offset + 1);
    const leadsIntoStrongSession = nextClimbingDay !== undefined && strongSessionDays.has(nextClimbingDay);
    const leadsIntoWeakSession = nextClimbingDay !== undefined && weakSessionDays.has(nextClimbingDay);
    const proteinGrams = leadsIntoStrongSession ? 135 : leadsIntoWeakSession ? 92 : 112 + (dayIndex % 2) * 6;
    const sleepHours = leadsIntoStrongSession ? 7.8 : leadsIntoWeakSession ? 5.9 : 7.0;
    const painScore = leadsIntoStrongSession ? 2 : leadsIntoWeakSession ? 6 : 3 + (dayIndex % 2);
    const hydration = leadsIntoStrongSession ? 3.3 : leadsIntoWeakSession ? 1.9 : 2.6;

    await prisma.sleepEntry.create({
      data: {
        entryDate,
        hours: sleepHours,
        qualityScore: Math.min(10, Math.max(4, Math.round(sleepHours + 1))),
      },
    });

    await prisma.nutritionEntry.create({
      data: {
        entryDate,
        proteinGrams,
        calories: leadsIntoStrongSession ? 2460 : leadsIntoWeakSession ? 2210 : 2320 + (dayIndex % 3) * 60,
        hydration,
      },
    });

    await prisma.bodyweightEntry.create({
      data: {
        entryDate,
        weightLbs: 156 - (dayIndex % 6) * 0.3,
      },
    });

    await prisma.fingerRehabEntry.create({
      data: {
        entryDate,
        painScore,
        rehabCompleted: !leadsIntoWeakSession,
        notes: painScore >= 6 ? 'Finger felt tweaky after limit session.' : null,
      },
    });

    if (leadsIntoWeakSession || dayIndex % 6 === 0) {
      await prisma.hangboardSession.create({
        data: {
          sessionDate: entryDate,
          protocolName: leadsIntoWeakSession ? 'Max hangs' : 'Repeaters',
          durationMinutes: leadsIntoWeakSession ? 30 : 20 + (dayIndex % 2) * 5,
          intensity: leadsIntoWeakSession ? 8 : 6,
        },
      });
    }
  }

  const grades = ['V3', 'V6', 'V4', 'V6', 'V4', 'V7', 'V4', 'V6', 'V5', 'V7'];

  for (const [index, offset] of climbingDays.entries()) {
    const hardestGrade = grades[index] ?? 'V4';
    await prisma.climbingSession.create({
      data: {
        sessionDate: isoDay(offset),
        discipline: 'Bouldering',
        hardestGrade,
        gradeScale: 'BOULDER_V',
        normalizedGrade: normalizeGrade('BOULDER_V', hardestGrade) ?? 0,
        sessionRpe: strongSessionDays.has(offset) ? 6 : 8,
        sendCount: strongSessionDays.has(offset) ? 5 + index : 2 + index,
        attemptCount: strongSessionDays.has(offset) ? 7 + index : 11 + index * 2,
        durationMinutes: strongSessionDays.has(offset) ? 88 + index * 4 : 96 + index * 5,
        notes: strongSessionDays.has(offset)
          ? 'Well-recovered session with good power and skin.'
          : 'Performance felt limited by fatigue and finger load.',
      },
    });
  }
}
