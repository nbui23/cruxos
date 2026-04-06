'use server';

import { revalidatePath } from 'next/cache';

import { requireCurrentUser } from '@/lib/auth/server';
import {
  createClimbingSessionForUser,
  createHangboardSessionForUser,
  upsertBodyweightEntryForUser,
  upsertFingerRehabEntryForUser,
  upsertNutritionEntryForUser,
  upsertSleepEntryForUser,
} from '@/lib/services/logging';
import { toRecord } from '@/lib/validation/logging';

function revalidateAll() {
  revalidatePath('/');
  revalidatePath('/history');
  revalidatePath('/log');
  revalidatePath('/reports/performance');
}

async function requireUserId() {
  return (await requireCurrentUser()).id;
}

export async function createClimbingSession(formData: FormData) {
  await createClimbingSessionForUser(await requireUserId(), toRecord(formData));
  revalidateAll();
}

export async function upsertSleepEntry(formData: FormData) {
  await upsertSleepEntryForUser(await requireUserId(), toRecord(formData));
  revalidateAll();
}

export async function upsertNutritionEntry(formData: FormData) {
  await upsertNutritionEntryForUser(await requireUserId(), toRecord(formData));
  revalidateAll();
}

export async function upsertBodyweightEntry(formData: FormData) {
  await upsertBodyweightEntryForUser(await requireUserId(), toRecord(formData));
  revalidateAll();
}

export async function createHangboardSession(formData: FormData) {
  await createHangboardSessionForUser(await requireUserId(), toRecord(formData));
  revalidateAll();
}

export async function upsertFingerRehabEntry(formData: FormData) {
  await upsertFingerRehabEntryForUser(await requireUserId(), toRecord(formData));
  revalidateAll();
}
