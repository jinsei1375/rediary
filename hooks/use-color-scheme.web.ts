import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web.
 * Also respects user's theme preference from settings.
 */
export function useColorScheme(): 'light' | 'dark' {
  const [hasHydrated, setHasHydrated] = useState(false);
  const systemColorScheme = useRNColorScheme();
  const { theme } = useSettings();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // If user explicitly selected light or dark, use that (even before hydration)
  if (theme === 'light' || theme === 'dark') {
    return theme;
  }

  // If theme is 'system' or not set, use device's color scheme
  // Before hydration, default to 'light' for static rendering
  if (hasHydrated) {
    return systemColorScheme === 'dark' ? 'dark' : 'light';
  }

  return 'light';
}
