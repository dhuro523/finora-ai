
import { useEffect, useState } from 'react';
import {
  UserRound,
  Palette,
  Coins,
  ShieldCheck,
  RotateCcw,
  Check,
  Info,
} from 'lucide-react';

type SettingsPreferences = {
  displayName: string;
  currency: 'USD' | 'EUR';
  appearance: 'light' | 'dark';
};

const DEFAULT_SETTINGS: SettingsPreferences = {
  displayName: '',
  currency: 'USD',
  appearance: 'light',
};

const STORAGE_KEY = 'finora-settings';

function loadSettings(): SettingsPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsed = JSON.parse(stored);

      return {
        displayName:
          typeof parsed.displayName === 'string'
            ? parsed.displayName
            : DEFAULT_SETTINGS.displayName,
        currency: parsed.currency === 'EUR' ? 'EUR' : 'USD',
        appearance: parsed.appearance === 'dark' ? 'dark' : 'light',
      };
    }
  } catch {
    // Fall back to defaults if stored preferences are invalid.
  }

  return { ...DEFAULT_SETTINGS };
}

export default function Settings() {
  const [settings, setSettings] =
    useState<SettingsPreferences>(loadSettings);
  const [saved, setSaved] = useState(false);

  
useEffect(() => {
  document.documentElement.dataset.theme = settings.appearance;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const current = stored ? JSON.parse(stored) : {};

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...current,
        appearance: settings.appearance,
      }),
    );

    window.dispatchEvent(new Event('finora-settings-updated'));
  } catch {
    // The current session still uses the selected theme.
  }
}, [settings.appearance]);


  const updateSetting = <K extends keyof SettingsPreferences>(
    key: K,
    value: SettingsPreferences[K],
  ) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const saveSettings = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSaved(true);
    } catch {
      setSaved(false);
      window.alert('Could not save settings in this browser.');
    }
  };

  const resetSettings = () => {
    setSettings({ ...DEFAULT_SETTINGS });
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSaved(true);
    } catch {
      setSaved(false);
      window.alert('Could not reset settings in this browser.');
    }
  };

  const inputClass =
    'mt-2 w-full rounded-xl border border-[#E8E8F0] bg-white px-4 py-3 text-sm text-[#16161D] outline-none transition focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/10';

  return (
    <div className="mx-auto max-w-5xl space-y-7 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#16161D]">
            Settings
          </h1>
          <p className="mt-2 text-sm text-[#6B6B80]">
            Customize your Finora AI experience.
          </p>
        </div>

        <button
          onClick={saveSettings}
          className="inline-flex items-center gap-2 rounded-xl bg-[#7C5CFC] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#6845F5]"
        >
          <Check size={16} />
          Save changes
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <Check size={16} />
          Settings saved.
        </div>
      )}

      <section className="rounded-2xl border border-[#E8E8F0] bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#F0EBFF] p-3">
            <UserRound className="text-[#7C5CFC]" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-[#16161D]">Profile</h2>
            <p className="mt-1 text-sm text-[#6B6B80]">
              Personalize how your dashboard greets you.
            </p>
          </div>
        </div>

        <div className="mt-6 max-w-xl">
          <label
            htmlFor="displayName"
            className="text-sm font-medium text-[#16161D]"
          >
            Display name
          </label>
          <input
            id="displayName"
            className={inputClass}
            value={settings.displayName}
            maxLength={60}
            placeholder="Enter your display name"
            onChange={(event) =>
              updateSetting('displayName', event.target.value)
            }
          />
          <p className="mt-2 text-xs text-[#6B6B80]">
            Saved in this browser. Account profile syncing is not available yet.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E8E8F0] bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#F0EBFF] p-3">
            <Palette className="text-[#7C5CFC]" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-[#16161D]">Appearance</h2>
            <p className="mt-1 text-sm text-[#6B6B80]">
              Choose the look you prefer.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {(['light', 'dark'] as const).map((appearance) => {
            const active = settings.appearance === appearance;

            return (
              <button
                key={appearance}
                type="button"
                onClick={() => updateSetting('appearance', appearance)}
                className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                  active
                    ? 'border-[#7C5CFC] bg-[#F0EBFF]'
                    : 'border-[#E8E8F0] hover:border-[#C9C2E8]'
                }`}
              >
                <div>
                  <p className="text-sm font-medium capitalize text-[#16161D]">
                    {appearance} mode
                  </p>
                  <p className="mt-1 text-xs text-[#6B6B80]">
                    {appearance === 'light'
                      ? 'Clean and bright'
                      : 'For low-light environments'}
                  </p>
                </div>
                <span
                  className={`h-4 w-4 rounded-full border-2 ${
                    active
                      ? 'border-[#7C5CFC] bg-[#7C5CFC]'
                      : 'border-gray-300'
                  }`}
                />
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-xs text-[#6B6B80]">
          Light mode matches the current Finora design. Dark mode selection is
          saved, but the full app-wide dark theme still needs implementation.
        </p>
      </section>

      <section className="rounded-2xl border border-[#E8E8F0] bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#F0EBFF] p-3">
            <Coins className="text-[#7C5CFC]" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-[#16161D]">Currency</h2>
            <p className="mt-1 text-sm text-[#6B6B80]">
              Choose your preferred display currency.
            </p>
          </div>
        </div>

        <div className="mt-6 max-w-xl">
          <label
            htmlFor="currency"
            className="text-sm font-medium text-[#16161D]"
          >
            Default currency
          </label>
          <select
            id="currency"
            className={inputClass}
            value={settings.currency}
            onChange={(event) =>
              updateSetting(
                'currency',
                event.target.value === 'EUR' ? 'EUR' : 'USD',
              )
            }
          >
            <option value="USD">USD — US Dollar ($)</option>
            <option value="EUR">EUR — Euro (€)</option>
          </select>
          <p className="mt-2 text-xs text-[#6B6B80]">
            This preference is saved locally. It does not convert demo values
            or change currency formatting elsewhere in the app yet.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E8E8F0] bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#F0EBFF] p-3">
            <ShieldCheck className="text-[#7C5CFC]" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-[#16161D]">
              Data &amp; privacy
            </h2>
            <p className="mt-1 text-sm text-[#6B6B80]">
              Understand how this version handles your data.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3 rounded-xl bg-[#F7F7FB] p-4">
          <Info size={19} className="mt-0.5 shrink-0 text-[#7C5CFC]" />
          <div>
            <p className="text-sm font-medium text-[#16161D]">
              Development version
            </p>
            <p className="mt-1 text-sm leading-6 text-[#6B6B80]">
              Finora currently uses demo financial figures and stores savings
              goals in a local SQLite database on the backend. Your preferences
              are stored in this browser. User accounts and account-specific
              data isolation have not been implemented yet.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E8E8F0] bg-white p-6">
        <div>
          <h2 className="font-semibold text-[#16161D]">Reset preferences</h2>
          <p className="mt-1 text-sm text-[#6B6B80]">
            Restore the default settings for this browser.
          </p>
        </div>
        <button
          type="button"
          onClick={resetSettings}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E8E8F0] px-4 py-2.5 text-sm font-medium text-[#16161D] transition hover:bg-[#F7F7FB]"
        >
          <RotateCcw size={16} />
          Reset settings
        </button>
      </section>
    </div>
  );
}
