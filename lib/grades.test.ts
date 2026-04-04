import { describe, expect, it } from 'vitest';

import { normalizeGrade } from './grades';

describe('normalizeGrade', () => {
  it('orders V-scale grades consistently', () => {
    expect((normalizeGrade('BOULDER_V', 'V3') ?? 0)).toBeLessThan(normalizeGrade('BOULDER_V', 'V6') ?? 0);
  });

  it('supports YDS grades', () => {
    expect((normalizeGrade('YDS', '5.10a') ?? 0)).toBeLessThan(normalizeGrade('YDS', '5.11c') ?? 0);
  });
});
