import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getSessionUserFromRequest } from '@/lib/auth/session';
import { getDashboardData, getPerformanceReportData } from '@/lib/queries';

export async function GET(request: NextRequest) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [dashboard, report] = await Promise.all([getDashboardData(user.id), getPerformanceReportData(user.id)]);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isDemo: user.isDemo,
    },
    metrics: dashboard.metrics,
    recentSessions: dashboard.sessions.slice(-6).reverse(),
    weeklyGuidance: report.weeklyGuidance,
  });
}
