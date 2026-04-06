import type { WeeklyGuidance } from '../api';

export function weeklyGuidanceBadge(guidance: WeeklyGuidance) {
  return guidance.status === 'ready' ? 'Evidence-backed' : 'Still learning';
}

export function sessionSubtitle(session: { sessionDate: string; sessionRpe: number | null; attemptCount: number | null }) {
  const bits = [session.sessionDate.slice(0, 10)];
  if (session.sessionRpe) {
    bits.push(`RPE ${session.sessionRpe}`);
  }
  if (session.attemptCount) {
    bits.push(`${session.attemptCount} attempts`);
  }
  return bits.join(' · ');
}
