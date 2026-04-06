import { createHash, randomBytes } from 'node:crypto';

import { addDays, isBefore } from 'date-fns';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';

import { AUTH_COOKIE_NAME, SESSION_TTL_DAYS } from './constants';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

export const SESSION_COOKIE_NAME = AUTH_COOKIE_NAME;

export function createSessionToken() {
  return randomBytes(32).toString('hex');
}

export function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function buildSessionExpiry() {
  return addDays(new Date(), SESSION_TTL_DAYS);
}

async function loadSessionByToken(token: string | null | undefined) {
  if (!token) {
    return null;
  }

  const session = await prisma.authSession.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  if (isBefore(session.expiresAt, new Date())) {
    await prisma.authSession.delete({ where: { id: session.id } });
    return null;
  }

  return session;
}

export async function createSession(userId: string) {
  const token = createSessionToken();
  const expiresAt = buildSessionExpiry();

  await prisma.authSession.create({
    data: {
      userId,
      tokenHash: hashSessionToken(token),
      expiresAt,
    },
  });

  return token;
}

export async function createUserSession(userId: string) {
  const token = createSessionToken();
  const expiresAt = buildSessionExpiry();

  await prisma.authSession.create({
    data: {
      userId,
      tokenHash: hashSessionToken(token),
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function writeSessionCookie(token: string, expiresAt = buildSessionExpiry()) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, { ...COOKIE_OPTIONS, expires: expiresAt });
}

export async function setSessionCookie(token: string, expiresAt = buildSessionExpiry()) {
  await writeSessionCookie(token, expiresAt);
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function getSessionUserFromCookie() {
  return (await loadSessionByToken(await getSessionTokenFromCookies()))?.user ?? null;
}

export async function getSessionUserFromRequest(request: NextRequest) {
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const token = bearer || request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return (await loadSessionByToken(token))?.user ?? null;
}

export async function destroySessionByToken(token: string | null | undefined) {
  if (!token) {
    return;
  }

  await prisma.authSession.deleteMany({ where: { tokenHash: hashSessionToken(token) } });
}
