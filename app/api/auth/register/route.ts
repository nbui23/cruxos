import { NextResponse } from 'next/server';

import { registerUser } from '@/lib/services/auth';
import { registerPayloadSchema } from '@/lib/validation/auth';

export async function POST(request: Request) {
  try {
    const payload = registerPayloadSchema.parse(await request.json());
    const session = await registerUser(payload);
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to register.' }, { status: 400 });
  }
}
