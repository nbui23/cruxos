import { NextResponse } from 'next/server';

import { loginUser } from '@/lib/services/auth';
import { loginPayloadSchema } from '@/lib/validation/auth';

export async function POST(request: Request) {
  try {
    const payload = loginPayloadSchema.parse(await request.json());
    const session = await loginUser(payload);
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to sign in.' }, { status: 400 });
  }
}
