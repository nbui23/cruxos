import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import { seedDemoData } from '@/lib/demo-seed';

export async function POST() {
  if (process.env.E2E_TEST !== '1') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const prisma = new PrismaClient();

  try {
    await seedDemoData(prisma);
    return NextResponse.json({ ok: true });
  } finally {
    await prisma.$disconnect();
  }
}
