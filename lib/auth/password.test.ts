import { describe, expect, it } from 'vitest';

import { hashPassword, verifyPassword } from './password';

describe('password helpers', () => {
  it('hashes and verifies a password', () => {
    const hash = hashPassword('demo-pass-123');
    expect(hash).not.toBe('demo-pass-123');
    expect(verifyPassword('demo-pass-123', hash)).toBe(true);
    expect(verifyPassword('wrong-pass', hash)).toBe(false);
  });
});
