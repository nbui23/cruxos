'use server';

import { redirect } from 'next/navigation';

import { DEMO_EMAIL, DEMO_PASSWORD } from '@/lib/auth/constants';
import { loginUser, logoutCurrentSession, registerUser } from '@/lib/services/auth';
import { loginPayloadSchema, registerPayloadSchema } from '@/lib/validation/auth';
import { toRecord } from '@/lib/validation/logging';

export async function loginAction(formData: FormData) {
  try {
    const payload = loginPayloadSchema.parse(toRecord(formData));
    await loginUser(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to sign in.';
    redirect(`/auth?error=${encodeURIComponent(message)}`);
  }

  redirect('/');
}

export async function registerAction(formData: FormData) {
  try {
    const payload = registerPayloadSchema.parse(toRecord(formData));
    await registerUser(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create account.';
    redirect(`/auth?error=${encodeURIComponent(message)}`);
  }

  redirect('/');
}

export async function loginDemoAction() {
  try {
    const payload = loginPayloadSchema.parse({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
    await loginUser(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load the demo account.';
    redirect(`/auth?error=${encodeURIComponent(message)}`);
  }

  redirect('/');
}

export async function logoutAction() {
  await logoutCurrentSession();
  redirect('/auth');
}
