import { useEffect, useState } from 'react';

type Currency = 'USD' | 'EUR';

const STORAGE_KEY = 'finora-settings';

function getSavedCurrency(): Currency {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const settings = saved ? JSON.parse(saved) : {};

    return settings.currency === 'EUR' ? 'EUR' : 'USD';
  } catch {
    return 'USD';
  }
}

export default function useCurrency() {
  const [currency, setCurrency] = useState<Currency>(getSavedCurrency);

  useEffect(() => {
    const refreshCurrency = () => setCurrency(getSavedCurrency());

    window.addEventListener('finora-settings-updated', refreshCurrency);
    window.addEventListener('storage', refreshCurrency);

    return () => {
      window.removeEventListener('finora-settings-updated', refreshCurrency);
      window.removeEventListener('storage', refreshCurrency);
    };
  }, []);

  return (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
}