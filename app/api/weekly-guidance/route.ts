import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getSessionUserFromRequest } from '@/lib/auth/session';
import { getPerformanceReportData } from '@/lib/queries';

export async function GET(request: NextRequest) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const report = await getPerformanceReportData(user.id);
  return NextResponse.json({ guidance: report.weeklyGuidance });
}
