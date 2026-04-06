import { describe, expect, it } from 'vitest';

import { createSessionPayload, normalizeApiBaseUrl } from './api';

describe('mobile api helpers', () => {
  it('normalizes the API base URL', () => {
    expect(normalizeApiBaseUrl('http://localhost:3000/')).toBe('http://localhost:3000');
  });

  it('builds a climbing-session payload from form strings', () => {
    expect(
      createSessionPayload({
        sessionDate: '2026-04-05',
        hardestGrade: ' V6 ',
        sessionRpe: '7',
        sleepHours: '8.2',
        proteinGrams: '140',
        painScore: '3',
      }),
    ).toEqual({
      sessionDate: '2026-04-05',
      hardestGrade: 'V6',
      gradeScale: 'BOULDER_V',
      discipline: 'Bouldering',
      sessionRpe: 7,
      notes: undefined,
      sleepHours: 8.2,
      proteinGrams: 140,
      painScore: 3,
    });
  });
});
