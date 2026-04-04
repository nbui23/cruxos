import { describe, expect, it } from 'vitest';

import { buildPerformanceReport } from './reports';

const atDayOffset = (offset: number) => {
  const date = new Date('2026-04-04T00:00:00.000Z');
  date.setDate(date.getDate() + offset);
  return date;
};

describe('buildPerformanceReport', () => {
  it('creates deterministic insights from 28-day fixture data', () => {
    const report = buildPerformanceReport({
      reportEnd: new Date('2026-04-04T00:00:00.000Z'),
      sessions: [
        { id: '1', sessionDate: atDayOffset(-7), discipline: 'Bouldering', gradeScale: 'BOULDER_V', hardestGrade: 'V6', normalizedGrade: 7, sessionRpe: 7, sendCount: 6, attemptCount: 12, durationMinutes: 100, notes: null, createdAt: atDayOffset(-7), updatedAt: atDayOffset(-7) },
        { id: '2', sessionDate: atDayOffset(-5), discipline: 'Bouldering', gradeScale: 'BOULDER_V', hardestGrade: 'V6', normalizedGrade: 7, sessionRpe: 7, sendCount: 4, attemptCount: 9, durationMinutes: 90, notes: null, createdAt: atDayOffset(-5), updatedAt: atDayOffset(-5) },
        { id: '3', sessionDate: atDayOffset(-3), discipline: 'Bouldering', gradeScale: 'BOULDER_V', hardestGrade: 'V4', normalizedGrade: 5, sessionRpe: 8, sendCount: 2, attemptCount: 15, durationMinutes: 95, notes: null, createdAt: atDayOffset(-3), updatedAt: atDayOffset(-3) },
        { id: '4', sessionDate: atDayOffset(-1), discipline: 'Bouldering', gradeScale: 'BOULDER_V', hardestGrade: 'V4', normalizedGrade: 5, sessionRpe: 8, sendCount: 2, attemptCount: 14, durationMinutes: 92, notes: null, createdAt: atDayOffset(-1), updatedAt: atDayOffset(-1) },
      ],
      sleepEntries: [
        { id: 's1', entryDate: atDayOffset(-8), hours: 7.8, qualityScore: 8, createdAt: atDayOffset(-8), updatedAt: atDayOffset(-8) },
        { id: 's2', entryDate: atDayOffset(-6), hours: 7.2, qualityScore: 8, createdAt: atDayOffset(-6), updatedAt: atDayOffset(-6) },
        { id: 's3', entryDate: atDayOffset(-4), hours: 6.0, qualityScore: 5, createdAt: atDayOffset(-4), updatedAt: atDayOffset(-4) },
        { id: 's4', entryDate: atDayOffset(-2), hours: 5.7, qualityScore: 5, createdAt: atDayOffset(-2), updatedAt: atDayOffset(-2) },
      ],
      nutritionEntries: [
        { id: 'n1', entryDate: atDayOffset(-8), proteinGrams: 130, calories: 2400, hydration: 3, notes: null, createdAt: atDayOffset(-8), updatedAt: atDayOffset(-8) },
        { id: 'n2', entryDate: atDayOffset(-6), proteinGrams: 120, calories: 2380, hydration: 3, notes: null, createdAt: atDayOffset(-6), updatedAt: atDayOffset(-6) },
        { id: 'n3', entryDate: atDayOffset(-4), proteinGrams: 90, calories: 2200, hydration: 2, notes: null, createdAt: atDayOffset(-4), updatedAt: atDayOffset(-4) },
        { id: 'n4', entryDate: atDayOffset(-2), proteinGrams: 85, calories: 2200, hydration: 2, notes: null, createdAt: atDayOffset(-2), updatedAt: atDayOffset(-2) },
      ],
      hangboardSessions: [
        { id: 'h1', sessionDate: atDayOffset(-4), protocolName: 'Repeaters', durationMinutes: 20, intensity: 8, notes: null, createdAt: atDayOffset(-4), updatedAt: atDayOffset(-4) },
        { id: 'h2', sessionDate: atDayOffset(-3), protocolName: 'Max hangs', durationMinutes: 20, intensity: 8, notes: null, createdAt: atDayOffset(-3), updatedAt: atDayOffset(-3) },
      ],
      rehabEntries: [
        { id: 'r1', entryDate: atDayOffset(-8), painScore: 2, rehabCompleted: true, notes: null, createdAt: atDayOffset(-8), updatedAt: atDayOffset(-8) },
        { id: 'r2', entryDate: atDayOffset(-6), painScore: 3, rehabCompleted: true, notes: null, createdAt: atDayOffset(-6), updatedAt: atDayOffset(-6) },
        { id: 'r3', entryDate: atDayOffset(-4), painScore: 6, rehabCompleted: false, notes: null, createdAt: atDayOffset(-4), updatedAt: atDayOffset(-4) },
        { id: 'r4', entryDate: atDayOffset(-2), painScore: 7, rehabCompleted: false, notes: null, createdAt: atDayOffset(-2), updatedAt: atDayOffset(-2) },
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
  });
});
