import { describe, expect, it } from 'vitest';
import {
  validateProfile,
  type ProfileFormValues,
} from './profileSettingsValidation';

const validProfile: ProfileFormValues = {
  name: 'Alex Morgan',
  email: 'alex@example.com',
  password: '',
};

describe('validateProfile', () => {
  it('accepts a valid profile without changing the optional password', () => {
    expect(validateProfile(validProfile)).toEqual({});
  });

  it('requires a name and a valid email address', () => {
    expect(
      validateProfile({ ...validProfile, name: '  ', email: 'not-an-email' }),
    ).toEqual({
      name: 'Enter your name.',
      email: 'Enter a valid email address.',
    });
  });

  it('enforces password length and character requirements when provided', () => {
    expect(
      validateProfile({ ...validProfile, password: 'short' }).password,
    ).toBe(
      'Use at least 12 characters. Include an uppercase letter. Include a number. Include a symbol.',
    );
  });

  it('accepts a password meeting every requirement', () => {
    expect(
      validateProfile({ ...validProfile, password: 'StrongPass123!' }),
    ).toEqual({});
  });
});
