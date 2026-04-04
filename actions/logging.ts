'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { normalizeGrade, type GradeScale } from '@/lib/grades';
import { prisma } from '@/lib/prisma';

const toRecord = (formData: FormData) => Object.fromEntries(formData.entries());
const optionalNumber = (value: number | '' | undefined) => (value === '' || value === undefined || Number.isNaN(value) ? null : value);

const climbingSchema = z.object({
  sessionDate: z.string().min(1),
  gradeScale: z.enum(['BOULDER_V', 'YDS', 'FRENCH']).default('BOULDER_V'),
  hardestGrade: z.string().min(1),
  discipline: z.string().optional(),
  sessionRpe: z.coerce.number().min(1).max(10).optional().or(z.literal('')),
  sendCount: z.coerce.number().min(0).optional().or(z.literal('')),
  attemptCount: z.coerce.number().min(0).optional().or(z.literal('')),
  durationMinutes: z.coerce.number().min(0).optional().or(z.literal('')),
  notes: z.string().optional(),
});

const sleepSchema = z.object({
  entryDate: z.string().min(1),
  hours: z.coerce.number().min(0.1),
  qualityScore: z.coerce.number().min(1).max(10).optional().or(z.literal('')),
});

const nutritionSchema = z.object({
  entryDate: z.string().min(1),
  proteinGrams: z.coerce.number().min(0),
  calories: z.coerce.number().min(0).optional().or(z.literal('')),
  hydration: z.coerce.number().min(0).optional().or(z.literal('')),
  notes: z.string().optional(),
});

const bodyweightSchema = z.object({
  entryDate: z.string().min(1),
  weightLbs: z.coerce.number().min(0.1),
});

const hangboardSchema = z.object({
  sessionDate: z.string().min(1),
  protocolName: z.string().min(1),
  durationMinutes: z.coerce.number().min(0).optional().or(z.literal('')),
  intensity: z.coerce.number().min(1).max(10).optional().or(z.literal('')),
  notes: z.string().optional(),
});

const rehabSchema = z.object({
  entryDate: z.string().min(1),
  painScore: z.coerce.number().min(0).max(10),
  rehabCompleted: z.union([z.literal('on'), z.literal('true'), z.literal('false'), z.literal('')]).optional(),
  notes: z.string().optional(),
});

function revalidateAll() {
  revalidatePath('/');
  revalidatePath('/history');
  revalidatePath('/log');
  revalidatePath('/reports/performance');
}

export async function createClimbingSession(formData: FormData) {
  const payload = climbingSchema.parse(toRecord(formData));
  await prisma.climbingSession.create({
    data: {
      sessionDate: new Date(payload.sessionDate),
      discipline: payload.discipline || null,
      gradeScale: payload.gradeScale,
      hardestGrade: payload.hardestGrade,
      normalizedGrade: normalizeGrade(payload.gradeScale as GradeScale, payload.hardestGrade),
      sessionRpe: optionalNumber(payload.sessionRpe),
      sendCount: optionalNumber(payload.sendCount),
      attemptCount: optionalNumber(payload.attemptCount),
      durationMinutes: optionalNumber(payload.durationMinutes),
      notes: payload.notes || null,
    },
  });
  revalidateAll();
}

export async function upsertSleepEntry(formData: FormData) {
  const payload = sleepSchema.parse(toRecord(formData));
  const entryDate = new Date(payload.entryDate);
  await prisma.sleepEntry.upsert({
    where: { entryDate },
    update: { hours: payload.hours, qualityScore: optionalNumber(payload.qualityScore) },
    create: { entryDate, hours: payload.hours, qualityScore: optionalNumber(payload.qualityScore) },
  });
  revalidateAll();
}

export async function upsertNutritionEntry(formData: FormData) {
  const payload = nutritionSchema.parse(toRecord(formData));
  const entryDate = new Date(payload.entryDate);
  await prisma.nutritionEntry.upsert({
    where: { entryDate },
    update: {
      proteinGrams: payload.proteinGrams,
      calories: optionalNumber(payload.calories),
      hydration: optionalNumber(payload.hydration),
      notes: payload.notes || null,
    },
    create: {
      entryDate,
      proteinGrams: payload.proteinGrams,
      calories: optionalNumber(payload.calories),
      hydration: optionalNumber(payload.hydration),
      notes: payload.notes || null,
    },
  });
  revalidateAll();
}

export async function upsertBodyweightEntry(formData: FormData) {
  const payload = bodyweightSchema.parse(toRecord(formData));
  const entryDate = new Date(payload.entryDate);
  await prisma.bodyweightEntry.upsert({
    where: { entryDate },
    update: { weightLbs: payload.weightLbs },
    create: { entryDate, weightLbs: payload.weightLbs },
  });
  revalidateAll();
}

export async function createHangboardSession(formData: FormData) {
  const payload = hangboardSchema.parse(toRecord(formData));
  await prisma.hangboardSession.create({
    data: {
      sessionDate: new Date(payload.sessionDate),
      protocolName: payload.protocolName,
      durationMinutes: optionalNumber(payload.durationMinutes),
      intensity: optionalNumber(payload.intensity),
      notes: payload.notes || null,
    },
  });
  revalidateAll();
}

export async function upsertFingerRehabEntry(formData: FormData) {
  const payload = rehabSchema.parse(toRecord(formData));
  const entryDate = new Date(payload.entryDate);
  await prisma.fingerRehabEntry.upsert({
    where: { entryDate },
    update: {
      painScore: payload.painScore,
      rehabCompleted: payload.rehabCompleted === 'on' || payload.rehabCompleted === 'true',
      notes: payload.notes || null,
    },
    create: {
      entryDate,
      painScore: payload.painScore,
      rehabCompleted: payload.rehabCompleted === 'on' || payload.rehabCompleted === 'true',
      notes: payload.notes || null,
    },
  });
  revalidateAll();
}
