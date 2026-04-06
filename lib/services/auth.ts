import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/lib/auth/constants';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { createUserSession as createPersistedUserSession, hashSessionToken } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function authenticateUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: normalizeEmail(input.email) } });
  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    throw new Error('Invalid email or password.');
  }

  return user;
}

export async function registerUser(input: { email: string; password: string; name?: string | null }) {
  const email = normalizeEmail(input.email);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: input.name?.trim() || null,
      passwordHash: hashPassword(input.password),
    },
  });

  return createUserSession(user.id);
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await authenticateUser(input);
  return createUserSession(user.id);
}

export async function createUserSession(userId: string) {
  const { token, expiresAt } = await createPersistedUserSession(userId);
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}

export async function logoutCurrentSession(token?: string | null) {
  const cookieStore = await cookies();
  const sessionToken = token ?? cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (sessionToken) {
    await prisma.authSession.deleteMany({ where: { tokenHash: hashSessionToken(sessionToken) } });
  }

  cookieStore.delete(AUTH_COOKIE_NAME);
}
