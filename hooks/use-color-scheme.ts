import { useColorScheme as useRNColorScheme } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';

/**
 * Custom hook that returns the app's color scheme based on user settings.
 * - If user selected 'light' or 'dark', returns that value
 * - If user selected 'system', returns the device's color scheme
 * - Falls back to device color scheme if settings are not available
 */
export function useColorScheme(): 'light' | 'dark' {
  const systemColorScheme = useRNColorScheme();
  const { theme } = useSettings();

  // If user explicitly selected light or dark, use that
  if (theme === 'light' || theme === 'dark') {
    return theme;
  }

  // If theme is 'system' or not set, use device's color scheme
  // Default to 'light' if system color scheme is null
  return systemColorScheme === 'dark' ? 'dark' : 'light';
}
