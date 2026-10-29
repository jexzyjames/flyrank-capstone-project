export interface ProfileFormValues {
  name: string;
  email: string;
  password: string;
}

export type ProfileField = keyof ProfileFormValues;

export type ProfileValidationErrors = Partial<
  Record<ProfileField, string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RULES = [
  {
    test: (password: string) => password.length >= 12,
    message: 'Use at least 12 characters.',
  },
  {
    test: (password: string) => /[a-z]/.test(password),
    message: 'Include a lowercase letter.',
  },
  {
    test: (password: string) => /[A-Z]/.test(password),
    message: 'Include an uppercase letter.',
  },
  {
    test: (password: string) => /\d/.test(password),
    message: 'Include a number.',
  },
  {
    test: (password: string) => /[^A-Za-z0-9]/.test(password),
    message: 'Include a symbol.',
  },
];

export function validateProfile(
  values: ProfileFormValues,
): ProfileValidationErrors {
  const errors: ProfileValidationErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Enter your name.';
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (values.password && !PASSWORD_RULES.every(({ test }) => test(values.password))) {
    errors.password = PASSWORD_RULES
      .filter(({ test }) => !test(values.password))
      .map(({ message }) => message)
      .join(' ');
  }

  return errors;
}
