import { ProfileSettingsForm } from './components/ProfileSettingsForm';
import type { UserProfile } from './components/ProfileSettingsForm';

const initialProfile: UserProfile = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
};

async function saveProfile(profile: UserProfile & { password?: string }) {
  await new Promise((resolve) => window.setTimeout(resolve, 500));
  console.info('Profile settings saved', {
    name: profile.name,
    email: profile.email,
    passwordUpdated: Boolean(profile.password),
  });
}

export default function App() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
            FlyRank
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Account settings
          </h1>
          <p className="mt-2 text-slate-600">
            Manage your profile information and sign-in details.
          </p>
        </header>

        <section
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          aria-labelledby="profile-heading"
        >
          <div className="mb-7 border-b border-slate-100 pb-5">
            <h2 className="text-lg font-semibold" id="profile-heading">
              Profile
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Your name and email are used across your account.
            </p>
          </div>
          <ProfileSettingsForm
            initialProfile={initialProfile}
            onSave={saveProfile}
          />
        </section>
      </div>
    </main>
  );
}
