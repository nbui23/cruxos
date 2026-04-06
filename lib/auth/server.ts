import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/prisma';

import { AUTH_COOKIE_NAME } from './constants';
import { hashSessionToken } from './session';

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string | null;
};

async function getTokenFromRequest() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const bearer = headerStore.get('authorization');

  if (bearer?.startsWith('Bearer ')) {
    return bearer.slice('Bearer '.length).trim();
  }

  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export async function getCurrentUser() {
  const token = await getTokenFromRequest();
  if (!token) return null;

  const session = await prisma.authSession.findUnique({ where: { tokenHash: hashSessionToken(token) }, include: { user: true } });
  if (!session || session.expiresAt <= new Date()) {
    return null;
  }

  return { id: session.user.id, email: session.user.email, name: session.user.name } satisfies AuthenticatedUser;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth');
  }
  return user;
}
