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
import { useState, type FormEvent } from "react";

type Settings = {
  fullName: string;
  email: string;
  theme: "system" | "light" | "dark";
  emailNotifications: boolean;
  weeklySummary: boolean;
};

const storageKey = "flyrank-settings";

const defaultSettings: Settings = {
  fullName: "",
  email: "",
  theme: "system",
  emailNotifications: true,
  weeklySummary: false,
};

function isSettings(value: unknown): value is Settings {
  if (typeof value !== "object" || value === null) return false;

  const settings = value as Record<string, unknown>;
  return (
    typeof settings.fullName === "string" &&
    typeof settings.email === "string" &&
    (settings.theme === "system" ||
      settings.theme === "light" ||
      settings.theme === "dark") &&
    typeof settings.emailNotifications === "boolean" &&
    typeof settings.weeklySummary === "boolean"
  );
}

function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return defaultSettings;

    const parsed: unknown = JSON.parse(stored);
    if (isSettings(parsed)) return parsed;

    console.error("Saved FlyRank settings have an unexpected format.");
  } catch (error) {
    console.error("Unable to load saved FlyRank settings.", error);
  }

  return defaultSettings;
}

function App() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [message, setMessage] = useState("");
  const [saveError, setSaveError] = useState(false);

  function updateSetting<Key extends keyof Settings>(
    key: Key,
    value: Settings[Key],
  ) {
    setSettings((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
      setSaveError(false);
      setMessage("Your settings have been saved.");
    } catch (error) {
      console.error("Unable to save FlyRank settings.", error);
      setSaveError(true);
      setMessage("We couldn't save your settings. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center gap-3">
          <div
            aria-hidden="true"
            className="grid size-11 place-items-center rounded-2xl bg-indigo-600 text-lg font-bold text-white shadow-lg shadow-indigo-200"
          >
            F
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">FlyRank</p>
            <p className="text-sm text-slate-500">Workspace settings</p>
          </div>
        </header>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-7 sm:px-9">
            <p className="mb-2 text-sm font-semibold text-indigo-600">
              YOUR ACCOUNT
            </p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Settings
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage your profile and choose how FlyRank keeps you in the loop.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-9 px-6 py-8 sm:px-9">
              <section aria-labelledby="profile-heading">
                <div className="mb-5">
                  <h2
                    className="text-base font-semibold"
                    id="profile-heading"
                  >
                    Profile
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Update the details associated with your account.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      className="mb-2 block text-sm font-medium"
                      htmlFor="full-name"
                    >
                      Full name
                    </label>
                    <input
                      autoComplete="name"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      id="full-name"
                      maxLength={80}
                      minLength={2}
                      onChange={(event) =>
                        updateSetting("fullName", event.target.value)
                      }
                      pattern=".*\S.*"
                      placeholder="Your name"
                      required
                      title="Enter at least one non-space character."
                      value={settings.fullName}
                    />
                  </div>

                  <div>
                    <label
                      className="mb-2 block text-sm font-medium"
                      htmlFor="email"
                    >
                      Email address
                    </label>
                    <input
                      autoComplete="email"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      id="email"
                      maxLength={254}
                      onChange={(event) =>
                        updateSetting("email", event.target.value)
                      }
                      placeholder="you@example.com"
                      required
                      type="email"
                      value={settings.email}
                    />
                  </div>
                </div>
              </section>

              <section aria-labelledby="preferences-heading">
                <div className="mb-5">
                  <h2
                    className="text-base font-semibold"
                    id="preferences-heading"
                  >
                    Preferences
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Make FlyRank feel right for you.
                  </p>
                </div>
                <div className="max-w-sm">
                  <label
                    className="mb-2 block text-sm font-medium"
                    htmlFor="theme"
                  >
                    Appearance
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    id="theme"
                    onChange={(event) =>
                      updateSetting(
                        "theme",
                        event.target.value as Settings["theme"],
                      )
                    }
                    value={settings.theme}
                  >
                    <option value="system">Use system setting</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </section>

              <section aria-labelledby="notifications-heading">
                <div className="mb-5">
                  <h2
                    className="text-base font-semibold"
                    id="notifications-heading"
                  >
                    Notifications
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Choose which updates you receive by email.
                  </p>
                </div>
                <div className="divide-y divide-slate-100">
                  <label className="flex cursor-pointer items-start justify-between gap-5 py-4 first:pt-0 last:pb-0">
                    <span>
                      <span className="block text-sm font-medium">
                        Product updates
                      </span>
                      <span className="mt-1 block text-sm text-slate-500">
                        Important news and feature announcements.
                      </span>
                    </span>
                    <input
                      checked={settings.emailNotifications}
                      className="mt-1 size-4 shrink-0 accent-indigo-600"
                      onChange={(event) =>
                        updateSetting(
                          "emailNotifications",
                          event.target.checked,
                        )
                      }
                      type="checkbox"
                    />
                  </label>
                  <label className="flex cursor-pointer items-start justify-between gap-5 py-4">
                    <span>
                      <span className="block text-sm font-medium">
                        Weekly summary
                      </span>
                      <span className="mt-1 block text-sm text-slate-500">
                        A weekly email with a summary of your activity.
                      </span>
                    </span>
                    <input
                      checked={settings.weeklySummary}
                      className="mt-1 size-4 shrink-0 accent-indigo-600"
                      onChange={(event) =>
                        updateSetting("weeklySummary", event.target.checked)
                      }
                      type="checkbox"
                    />
                  </label>
                </div>
              </section>
            </div>

            <footer className="flex flex-col-reverse gap-4 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-9">
              <p
                aria-live="polite"
                className={`min-h-5 text-sm ${
                  saveError ? "text-rose-700" : "text-emerald-700"
                }`}
                role="status"
              >
                {message}
              </p>
              <button
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                type="submit"
              >
                Save changes
              </button>
            </footer>
          </form>
        </section>
        <p className="mt-6 text-center text-xs text-slate-400">
          Settings are saved in this browser.
        </p>
      </div>
    </main>
  );
}

export default App;
