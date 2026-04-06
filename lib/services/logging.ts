import { subDays } from 'date-fns';

import { normalizeGrade, type GradeScale } from '@/lib/grades';
import { prisma } from '@/lib/prisma';
import {
  bodyweightSchema,
  climbingSchema,
  hangboardSchema,
  mobileClimbingCaptureSchema,
  nutritionSchema,
  rehabSchema,
  sleepSchema,
} from '@/lib/validation/logging';

const optionalNumber = (value: number | '' | undefined) => (value === '' || value === undefined || Number.isNaN(value) ? null : value);

export async function createClimbingSessionForUser(userId: string, input: unknown) {
  const payload = climbingSchema.parse(input);

  return prisma.climbingSession.create({
    data: {
      userId,
      sessionDate: new Date(payload.sessionDate),
      discipline: payload.discipline || null,
      gradeScale: payload.gradeScale,
      hardestGrade: payload.hardestGrade,
      normalizedGrade: normalizeGrade(payload.gradeScale as GradeScale, payload.hardestGrade) ?? 0,
      sessionRpe: optionalNumber(payload.sessionRpe),
      sendCount: optionalNumber(payload.sendCount),
      attemptCount: optionalNumber(payload.attemptCount),
      durationMinutes: optionalNumber(payload.durationMinutes),
      notes: payload.notes || null,
    },
  });
}

export async function upsertSleepEntryForUser(userId: string, input: unknown) {
  const payload = sleepSchema.parse(input);
  const entryDate = new Date(payload.entryDate);

  await prisma.sleepEntry.upsert({
    where: { userId_entryDate: { userId, entryDate } },
    update: { hours: payload.hours, qualityScore: optionalNumber(payload.qualityScore) },
    create: { userId, entryDate, hours: payload.hours, qualityScore: optionalNumber(payload.qualityScore) },
  });
}

export async function upsertNutritionEntryForUser(userId: string, input: unknown) {
  const payload = nutritionSchema.parse(input);
  const entryDate = new Date(payload.entryDate);

  await prisma.nutritionEntry.upsert({
    where: { userId_entryDate: { userId, entryDate } },
    update: {
      proteinGrams: payload.proteinGrams,
      calories: optionalNumber(payload.calories),
      hydration: optionalNumber(payload.hydration),
      notes: payload.notes || null,
    },
    create: {
      userId,
      entryDate,
      proteinGrams: payload.proteinGrams,
      calories: optionalNumber(payload.calories),
      hydration: optionalNumber(payload.hydration),
      notes: payload.notes || null,
    },
  });
}

export async function upsertBodyweightEntryForUser(userId: string, input: unknown) {
  const payload = bodyweightSchema.parse(input);
  const entryDate = new Date(payload.entryDate);

  await prisma.bodyweightEntry.upsert({
    where: { userId_entryDate: { userId, entryDate } },
    update: { weightLbs: payload.weightLbs },
    create: { userId, entryDate, weightLbs: payload.weightLbs },
  });
}

export async function createHangboardSessionForUser(userId: string, input: unknown) {
  const payload = hangboardSchema.parse(input);

  await prisma.hangboardSession.create({
    data: {
      userId,
      sessionDate: new Date(payload.sessionDate),
      protocolName: payload.protocolName,
      durationMinutes: optionalNumber(payload.durationMinutes),
      intensity: optionalNumber(payload.intensity),
      notes: payload.notes || null,
    },
  });
}

export async function upsertFingerRehabEntryForUser(userId: string, input: unknown) {
  const payload = rehabSchema.parse(input);
  const entryDate = new Date(payload.entryDate);

  await prisma.fingerRehabEntry.upsert({
    where: { userId_entryDate: { userId, entryDate } },
    update: {
      painScore: payload.painScore,
      rehabCompleted: payload.rehabCompleted === 'on' || payload.rehabCompleted === 'true',
      notes: payload.notes || null,
    },
    create: {
      userId,
      entryDate,
      painScore: payload.painScore,
      rehabCompleted: payload.rehabCompleted === 'on' || payload.rehabCompleted === 'true',
      notes: payload.notes || null,
    },
  });
}

export async function createMobileCaptureForUser(userId: string, input: unknown) {
  const payload = mobileClimbingCaptureSchema.parse(input);
  const sessionDate = new Date(payload.sessionDate);
  const priorDay = subDays(sessionDate, 1);

  return prisma.$transaction(async (tx) => {
    const session = await tx.climbingSession.create({
      data: {
        userId,
        sessionDate,
        discipline: payload.discipline || 'Bouldering',
        gradeScale: payload.gradeScale,
        hardestGrade: payload.hardestGrade,
        normalizedGrade: normalizeGrade(payload.gradeScale as GradeScale, payload.hardestGrade) ?? 0,
        sessionRpe: payload.sessionRpe ?? null,
        attemptCount: payload.attemptCount ?? null,
        notes: payload.notes || null,
      },
    });

    if (payload.sleepHours !== undefined) {
      await tx.sleepEntry.upsert({
        where: { userId_entryDate: { userId, entryDate: priorDay } },
        update: { hours: payload.sleepHours },
        create: { userId, entryDate: priorDay, hours: payload.sleepHours },
      });
    }

    if (payload.proteinGrams !== undefined) {
      await tx.nutritionEntry.upsert({
        where: { userId_entryDate: { userId, entryDate: priorDay } },
        update: { proteinGrams: payload.proteinGrams },
        create: { userId, entryDate: priorDay, proteinGrams: payload.proteinGrams },
      });
    }

    if (payload.painScore !== undefined) {
      await tx.fingerRehabEntry.upsert({
        where: { userId_entryDate: { userId, entryDate: sessionDate } },
        update: { painScore: payload.painScore },
        create: { userId, entryDate: sessionDate, painScore: payload.painScore },
      });
    }

    return session;
  });
}
