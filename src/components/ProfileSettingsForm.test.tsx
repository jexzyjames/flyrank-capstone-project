import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  ProfileSettingsForm,
  type UserProfile,
} from './ProfileSettingsForm';

const profile: UserProfile = {
  name: 'Alex Morgan',
  email: 'alex@example.com',
};

describe('ProfileSettingsForm', () => {
  it('renders labeled, controlled inputs and a password policy hint', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<ProfileSettingsForm initialProfile={profile} onSave={onSave} />);

    const name = screen.getByRole('textbox', { name: 'Full name' });
    const email = screen.getByRole('textbox', { name: 'Email address' });
    const password = screen.getByLabelText('New password');

    expect(name).toHaveValue(profile.name);
    expect(email).toHaveValue(profile.email);
    expect(password).toHaveValue('');
    expect(password).toHaveAccessibleDescription(
      /12 or more characters.*uppercase and lowercase letters.*number.*symbol/,
    );
    expect(name).toHaveAttribute('aria-label', 'Full name');
    expect(email).toHaveAttribute('aria-label', 'Email address');
    expect(password).toHaveAttribute('aria-label', 'New password');

    await user.clear(name);
    await user.type(name, 'Jamie Morgan');
    expect(name).toHaveValue('Jamie Morgan');
  });

  it('shows loading while the profile is being fetched', () => {
    render(
      <ProfileSettingsForm
        initialProfile={profile}
        isLoading
        onSave={vi.fn()}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      'Loading your profile',
    );
    expect(screen.queryByRole('textbox', { name: 'Full name' })).toBeNull();
  });

  it('reports validation errors without attempting to save', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<ProfileSettingsForm initialProfile={profile} onSave={onSave} />);

    await user.clear(screen.getByRole('textbox', { name: 'Email address' }));
    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'bad');
    await user.type(screen.getByLabelText('New password'), 'weak');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
    expect(
      screen.getByText(/Use at least 12 characters/),
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Email address' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(onSave).not.toHaveBeenCalled();
  });

  it('submits the profile, shows its loading state, and confirms success', async () => {
    const user = userEvent.setup();
    let finishSave!: () => void;
    const onSave = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishSave = resolve;
        }),
    );
    render(<ProfileSettingsForm initialProfile={profile} onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(onSave).toHaveBeenCalledWith(profile);
    expect(
      screen.getByRole('button', { name: 'Updating…' }),
    ).toBeDisabled();
    expect(screen.getByRole('form')).toHaveAttribute('aria-busy', 'true');

    finishSave();
    expect(
      await screen.findByRole('status'),
    ).toHaveTextContent('Your profile settings have been saved.');
    await waitFor(() =>
      expect(screen.getByRole('form')).toHaveAttribute('aria-busy', 'false'),
    );
  });

  it('shows a save error and allows the user to retry', async () => {
    const user = userEvent.setup();
    const onSave = vi
      .fn()
      .mockRejectedValueOnce(new Error('Please try again later.'))
      .mockResolvedValueOnce(undefined);
    render(<ProfileSettingsForm initialProfile={profile} onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Please try again later.',
    );

    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Your profile settings have been saved.',
    );
    expect(onSave).toHaveBeenCalledTimes(2);
  });
});
