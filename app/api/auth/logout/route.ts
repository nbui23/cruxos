import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { logoutCurrentSession } from '@/lib/services/auth';

export async function POST(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null;
  await logoutCurrentSession(token);
  return NextResponse.json({ ok: true });
}
