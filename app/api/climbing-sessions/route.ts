import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getSessionUserFromRequest } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { createMobileCaptureForUser } from '@/lib/services/logging';
import { mobileClimbingCaptureSchema } from '@/lib/validation/logging';

export async function GET(request: NextRequest) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sessions = await prisma.climbingSession.findMany({
    where: { userId: user.id },
    orderBy: { sessionDate: 'desc' },
    take: 12,
  });

  return NextResponse.json({ sessions });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = mobileClimbingCaptureSchema.parse(await request.json());
    const session = await createMobileCaptureForUser(user.id, payload);
    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save session.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
