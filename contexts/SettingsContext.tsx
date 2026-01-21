import { getUserSettings, saveUserSettings } from '@/services/userSettingsService';
import type { UserSettings } from '@/types/database';
import { Language } from '@/types/database';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

type SettingsContextType = {
  settings: UserSettings | null;
  loading: boolean;
  weekStart: 'sun' | 'mon';
  viewMode: 'month' | 'week';
  theme: 'light' | 'dark' | 'system';
  nativeLanguage: Language;
  targetLanguage: Language;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    if (!user?.id) {
      setSettings(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userSettings = await getUserSettings(user.id);
      setSettings(userSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSettings = useCallback(
    async (updates: Partial<UserSettings>) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      try {
        const updatedSettings = await saveUserSettings(user.id, {
          week_start: updates.week_start ?? settings?.week_start ?? 'sun',
          view_mode: updates.view_mode ?? settings?.view_mode ?? 'month',
          theme: updates.theme ?? settings?.theme ?? 'system',
          native_language: updates.native_language ?? settings?.native_language ?? Language.JA,
          target_language: updates.target_language ?? settings?.target_language ?? Language.EN,
        });
        setSettings(updatedSettings);
      } catch (error) {
        console.error('Failed to update settings:', error);
        throw error;
      }
    },
    [user?.id, settings],
  );

  const refreshSettings = useCallback(async () => {
    await loadSettings();
  }, [loadSettings]);

  const value: SettingsContextType = {
    settings,
    loading,
    weekStart: settings?.week_start ?? 'sun',
    viewMode: settings?.view_mode ?? 'month',
    theme: settings?.theme ?? 'system',
    nativeLanguage: settings?.native_language ?? Language.JA,
    targetLanguage: settings?.target_language ?? Language.EN,
    updateSettings,
    refreshSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
