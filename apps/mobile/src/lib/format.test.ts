import { describe, expect, it } from 'vitest';

import { sessionSubtitle, weeklyGuidanceBadge } from './format';

describe('mobile formatting helpers', () => {
  it('labels guidance by readiness', () => {
    expect(weeklyGuidanceBadge({ status: 'ready', title: '', summary: '', evidence: [], nextStep: '' })).toBe('Evidence-backed');
    expect(weeklyGuidanceBadge({ status: 'needs-more-data', title: '', summary: '', evidence: [], nextStep: '' })).toBe('Still learning');
  });

  it('formats session metadata compactly', () => {
    expect(sessionSubtitle({ sessionDate: '2026-04-05T00:00:00.000Z', sessionRpe: 7, attemptCount: 12 })).toContain('RPE 7');
    expect(sessionSubtitle({ sessionDate: '2026-04-05T00:00:00.000Z', sessionRpe: null, attemptCount: null })).toBe('2026-04-05');
  });
});
