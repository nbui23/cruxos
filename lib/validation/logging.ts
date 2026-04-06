import { z } from 'zod';

export const toRecord = (formData: FormData) => Object.fromEntries(formData.entries());
export const optionalNumber = (value: number | '' | undefined) => (value === '' || value === undefined || Number.isNaN(value) ? null : value);

export const climbingSchema = z.object({
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

export const sleepSchema = z.object({
  entryDate: z.string().min(1),
  hours: z.coerce.number().min(0.1),
  qualityScore: z.coerce.number().min(1).max(10).optional().or(z.literal('')),
});

export const nutritionSchema = z.object({
  entryDate: z.string().min(1),
  proteinGrams: z.coerce.number().min(0),
  calories: z.coerce.number().min(0).optional().or(z.literal('')),
  hydration: z.coerce.number().min(0).optional().or(z.literal('')),
  notes: z.string().optional(),
});

export const bodyweightSchema = z.object({
  entryDate: z.string().min(1),
  weightLbs: z.coerce.number().min(0.1),
});

export const hangboardSchema = z.object({
  sessionDate: z.string().min(1),
  protocolName: z.string().min(1),
  durationMinutes: z.coerce.number().min(0).optional().or(z.literal('')),
  intensity: z.coerce.number().min(1).max(10).optional().or(z.literal('')),
  notes: z.string().optional(),
});

export const rehabSchema = z.object({
  entryDate: z.string().min(1),
  painScore: z.coerce.number().min(0).max(10),
  rehabCompleted: z.union([z.literal('on'), z.literal('true'), z.literal('false'), z.literal('')]).optional(),
  notes: z.string().optional(),
});

export const mobileClimbingCaptureSchema = z.object({
  sessionDate: z.string().min(1),
  hardestGrade: z.string().min(1),
  gradeScale: z.enum(['BOULDER_V', 'YDS', 'FRENCH']).default('BOULDER_V'),
  discipline: z.string().optional(),
  sessionRpe: z.coerce.number().min(1).max(10).optional(),
  attemptCount: z.coerce.number().min(0).optional(),
  notes: z.string().trim().max(240).optional(),
  sleepHours: z.coerce.number().min(0.1).max(16).optional(),
  proteinGrams: z.coerce.number().min(0).max(500).optional(),
  painScore: z.coerce.number().min(0).max(10).optional(),
});
