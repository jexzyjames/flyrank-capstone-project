import { useState, type FormEvent } from 'react';
import {
  validateProfile,
  type ProfileFormValues,
  type ProfileField,
} from '../profileSettingsValidation';

export interface UserProfile {
  name: string;
  email: string;
}

export interface ProfileSettingsFormProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile & { password?: string }) => Promise<void>;
  isLoading?: boolean;
}

export function ProfileSettingsForm({
  initialProfile,
  onSave,
  isLoading = false,
}: ProfileSettingsFormProps) {
  const [values, setValues] = useState<ProfileFormValues>({
    ...initialProfile,
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<ProfileField, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<
    { type: 'success' | 'error'; message: string } | undefined
  >();

  function handleChange(field: ProfileField, value: string) {
    const updatedValues = { ...values, [field]: value };
    setValues(updatedValues);
    setFeedback(undefined);

    if (Object.keys(errors).length > 0) {
      setErrors(validateProfile(updatedValues));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateProfile(values);
    setErrors(validationErrors);
    setFeedback(undefined);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSaving(true);
    try {
      const profile: UserProfile & { password?: string } = {
        name: values.name.trim(),
        email: values.email.trim(),
      };
      if (values.password) {
        profile.password = values.password;
      }

      await onSave(profile);
      setValues((current) => ({ ...current, password: '' }));
      setFeedback({
        type: 'success',
        message: 'Your profile settings have been saved.',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'We could not save your profile. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <p className="text-sm text-slate-600" role="status" aria-live="polite">
        Loading your profile…
      </p>
    );
  }

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit}
      noValidate
      aria-busy={isSaving}
      aria-label="Profile settings"
    >
      <div>
        <label
          className="mb-2 block text-sm font-medium text-slate-800"
          htmlFor="profile-name"
        >
          Full name
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          id="profile-name"
          aria-label="Full name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'profile-name-error' : undefined}
          autoComplete="name"
          name="name"
          onChange={(event) => handleChange('name', event.target.value)}
          required
          value={values.name}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-700" id="profile-name-error">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-medium text-slate-800"
          htmlFor="profile-email"
        >
          Email address
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          id="profile-email"
          aria-label="Email address"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'profile-email-error' : undefined}
          autoComplete="email"
          name="email"
          onChange={(event) => handleChange('email', event.target.value)}
          required
          type="email"
          value={values.email}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-700" id="profile-email-error">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-medium text-slate-800"
          htmlFor="profile-password"
        >
          New password <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          id="profile-password"
          aria-label="New password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={
            errors.password
              ? 'password-hint profile-password-error'
              : 'password-hint'
          }
          autoComplete="new-password"
          name="password"
          onChange={(event) => handleChange('password', event.target.value)}
          type="password"
          value={values.password}
        />
        <p className="mt-1 text-xs text-slate-500" id="password-hint">
          Leave blank to keep your current password. New passwords need 12 or
          more characters, including uppercase and lowercase letters, a number,
          and a symbol.
        </p>
        {errors.password && (
          <p className="mt-1 text-sm text-red-700" id="profile-password-error">
            {errors.password}
          </p>
        )}
      </div>

      {feedback?.type === 'success' && (
        <p className="text-sm text-green-700" role="status" aria-live="polite">
          {feedback.message}
        </p>
      )}
      {feedback?.type === 'error' && (
        <p className="text-sm text-red-700" role="alert">
          {feedback.message}
        </p>
      )}

      <button
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        disabled={isSaving}
        type="submit"
      >
        {isSaving ? 'Updating…' : 'Save changes'}
      </button>
    </form>
  );
}
