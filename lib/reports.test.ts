import { describe, expect, it } from 'vitest';

import { buildPerformanceReport } from './reports';

const atDayOffset = (offset: number) => {
  const date = new Date('2026-04-04T00:00:00.000Z');
  date.setDate(date.getDate() + offset);
  return date;
};

const userId = 'user-1';

describe('buildPerformanceReport', () => {
  it('creates deterministic insights from 28-day fixture data', () => {
    const report = buildPerformanceReport({
      reportEnd: new Date('2026-04-04T00:00:00.000Z'),
      sessions: [
        { id: '1', userId, sessionDate: atDayOffset(-21), discipline: 'Bouldering', gradeScale: 'BOULDER_V', hardestGrade: 'V6', normalizedGrade: 7, sessionRpe: 7, sendCount: 6, attemptCount: 12, durationMinutes: 100, notes: null, createdAt: atDayOffset(-21), updatedAt: atDayOffset(-21) },
        { id: '2', userId, sessionDate: atDayOffset(-17), discipline: 'Bouldering', gradeScale: 'BOULDER_V', hardestGrade: 'V6', normalizedGrade: 7, sessionRpe: 7, sendCount: 4, attemptCount: 9, durationMinutes: 90, notes: null, createdAt: atDayOffset(-17), updatedAt: atDayOffset(-17) },
        { id: '3', userId, sessionDate: atDayOffset(-10), discipline: 'Bouldering', gradeScale: 'BOULDER_V', hardestGrade: 'V4', normalizedGrade: 5, sessionRpe: 8, sendCount: 2, attemptCount: 15, durationMinutes: 95, notes: null, createdAt: atDayOffset(-10), updatedAt: atDayOffset(-10) },
        { id: '4', userId, sessionDate: atDayOffset(-1), discipline: 'Bouldering', gradeScale: 'BOULDER_V', hardestGrade: 'V4', normalizedGrade: 5, sessionRpe: 8, sendCount: 2, attemptCount: 14, durationMinutes: 92, notes: null, createdAt: atDayOffset(-1), updatedAt: atDayOffset(-1) },
        { id: '5', userId, sessionDate: atDayOffset(-24), discipline: 'Bouldering', gradeScale: 'BOULDER_V', hardestGrade: 'V7', normalizedGrade: 8, sessionRpe: 6, sendCount: 7, attemptCount: 11, durationMinutes: 95, notes: null, createdAt: atDayOffset(-24), updatedAt: atDayOffset(-24) },
        { id: '6', userId, sessionDate: atDayOffset(-4), discipline: 'Bouldering', gradeScale: 'BOULDER_V', hardestGrade: 'V4', normalizedGrade: 5, sessionRpe: 8, sendCount: 2, attemptCount: 16, durationMinutes: 97, notes: null, createdAt: atDayOffset(-4), updatedAt: atDayOffset(-4) },
      ],
      sleepEntries: [
        { id: 's1', userId, entryDate: atDayOffset(-25), hours: 7.8, qualityScore: 8, createdAt: atDayOffset(-25), updatedAt: atDayOffset(-25) },
        { id: 's2', userId, entryDate: atDayOffset(-22), hours: 7.2, qualityScore: 8, createdAt: atDayOffset(-22), updatedAt: atDayOffset(-22) },
        { id: 's3', userId, entryDate: atDayOffset(-18), hours: 7.1, qualityScore: 7, createdAt: atDayOffset(-18), updatedAt: atDayOffset(-18) },
        { id: 's4', userId, entryDate: atDayOffset(-11), hours: 6.0, qualityScore: 5, createdAt: atDayOffset(-11), updatedAt: atDayOffset(-11) },
        { id: 's5', userId, entryDate: atDayOffset(-5), hours: 5.7, qualityScore: 5, createdAt: atDayOffset(-5), updatedAt: atDayOffset(-5) },
        { id: 's6', userId, entryDate: atDayOffset(-2), hours: 5.8, qualityScore: 4, createdAt: atDayOffset(-2), updatedAt: atDayOffset(-2) },
      ],
      nutritionEntries: [
        { id: 'n1', userId, entryDate: atDayOffset(-25), proteinGrams: 130, calories: 2400, hydration: 3, notes: null, createdAt: atDayOffset(-25), updatedAt: atDayOffset(-25) },
        { id: 'n2', userId, entryDate: atDayOffset(-22), proteinGrams: 120, calories: 2380, hydration: 3, notes: null, createdAt: atDayOffset(-22), updatedAt: atDayOffset(-22) },
        { id: 'n3', userId, entryDate: atDayOffset(-18), proteinGrams: 115, calories: 2300, hydration: 3, notes: null, createdAt: atDayOffset(-18), updatedAt: atDayOffset(-18) },
        { id: 'n4', userId, entryDate: atDayOffset(-11), proteinGrams: 90, calories: 2200, hydration: 2, notes: null, createdAt: atDayOffset(-11), updatedAt: atDayOffset(-11) },
        { id: 'n5', userId, entryDate: atDayOffset(-5), proteinGrams: 85, calories: 2200, hydration: 2, notes: null, createdAt: atDayOffset(-5), updatedAt: atDayOffset(-5) },
        { id: 'n6', userId, entryDate: atDayOffset(-2), proteinGrams: 80, calories: 2150, hydration: 2, notes: null, createdAt: atDayOffset(-2), updatedAt: atDayOffset(-2) },
      ],
      hangboardSessions: [
        { id: 'h1', userId, sessionDate: atDayOffset(-12), protocolName: 'Repeaters', durationMinutes: 20, intensity: 8, notes: null, createdAt: atDayOffset(-12), updatedAt: atDayOffset(-12) },
        { id: 'h2', userId, sessionDate: atDayOffset(-11), protocolName: 'Max hangs', durationMinutes: 20, intensity: 8, notes: null, createdAt: atDayOffset(-11), updatedAt: atDayOffset(-11) },
      ],
      rehabEntries: [
        { id: 'r1', userId, entryDate: atDayOffset(-25), painScore: 2, rehabCompleted: true, notes: null, createdAt: atDayOffset(-25), updatedAt: atDayOffset(-25) },
        { id: 'r2', userId, entryDate: atDayOffset(-22), painScore: 3, rehabCompleted: true, notes: null, createdAt: atDayOffset(-22), updatedAt: atDayOffset(-22) },
        { id: 'r3', userId, entryDate: atDayOffset(-18), painScore: 2, rehabCompleted: true, notes: null, createdAt: atDayOffset(-18), updatedAt: atDayOffset(-18) },
        { id: 'r4', userId, entryDate: atDayOffset(-11), painScore: 6, rehabCompleted: false, notes: null, createdAt: atDayOffset(-11), updatedAt: atDayOffset(-11) },
        { id: 'r5', userId, entryDate: atDayOffset(-5), painScore: 7, rehabCompleted: false, notes: null, createdAt: atDayOffset(-5), updatedAt: atDayOffset(-5) },
        { id: 'r6', userId, entryDate: atDayOffset(-2), painScore: 6, rehabCompleted: false, notes: null, createdAt: atDayOffset(-2), updatedAt: atDayOffset(-2) },
      ],
    });

    expect(report.primaryMetricLabel).toBe('Hardest grade sent per session');
    const sleepInsight = report.insights.find((insight) => insight.id === 'sleep-threshold');
    const painInsight = report.insights.find((insight) => insight.id === 'pain-volume-load');
    const proteinInsight = report.insights.find((insight) => insight.id === 'protein-consistency');

    expect(sleepInsight).toBeDefined();
    expect(sleepInsight?.title).toContain('7+ hours');
    expect(sleepInsight?.summary).toContain('averaged');
    expect(sleepInsight?.metricDelta).toContain('grade steps');
    expect(sleepInsight?.evidence[0]).toContain('Comparison:');
    expect(sleepInsight?.evidence[2]).toContain('Threshold:');

    expect(painInsight).toBeDefined();
    expect(painInsight?.title).toContain('stress');
    expect(painInsight?.summary).toContain('averaged');
    expect(painInsight?.evidence[1]).toContain('Average normalized grade');

    expect(proteinInsight).toBeDefined();
    expect(proteinInsight?.title).toContain('110g+');
    expect(proteinInsight?.summary).toContain('averaged');

    expect(report.weeklyGuidance.status).toBe('ready');
    expect(report.weeklyGuidance.title).toContain('repeat or avoid');
    expect(report.weeklyGuidance.evidence[0]).toContain('Comparison:');
  });

  it('withholds weekly guidance when recent data is too sparse', () => {
    const report = buildPerformanceReport({
      reportEnd: new Date('2026-04-04T00:00:00.000Z'),
      sessions: [
        { id: '1', userId, sessionDate: atDayOffset(-3), discipline: 'Bouldering', gradeScale: 'BOULDER_V', hardestGrade: 'V4', normalizedGrade: 5, sessionRpe: 7, sendCount: 4, attemptCount: 10, durationMinutes: 90, notes: null, createdAt: atDayOffset(-3), updatedAt: atDayOffset(-3) },
        { id: '2', userId, sessionDate: atDayOffset(-1), discipline: 'Bouldering', gradeScale: 'BOULDER_V', hardestGrade: 'V5', normalizedGrade: 6, sessionRpe: 7, sendCount: 3, attemptCount: 11, durationMinutes: 92, notes: null, createdAt: atDayOffset(-1), updatedAt: atDayOffset(-1) },
      ],
      sleepEntries: [],
      nutritionEntries: [],
      hangboardSessions: [],
      rehabEntries: [],
    });

    expect(report.weeklyGuidance.status).toBe('needs-more-data');
    expect(report.weeklyGuidance.summary).toContain('needs a little more recent');
    expect(report.weeklyGuidance.nextStep).toContain('Keep logging');
  });
});
