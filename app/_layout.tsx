import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { PortalProvider } from '@tamagui/portal';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { TamaguiProvider, useTheme } from 'tamagui';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import tamaguiConfig from '@/tamagui.config';
import { SafeAreaView } from 'react-native-safe-area-context';

function NavigationContent() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (loading) return;

    // 公開ルート（認証不要）
    const firstSegment = segments[0];
    const inPublicRoute = !firstSegment || firstSegment === 'login' || firstSegment === 'auth';

    // 未ログインで保護されたルートに入ろうとした時
    if (!session && !inPublicRoute) {
      router.replace('/login');
    }

    // ログイン済みで login に来た時だけ
    if (session && firstSegment === 'login') {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen
          name="(tabs)"
          options={{
            gestureEnabled: true,
          }}
        />
        <Stack.Screen name="diary" />
        <Stack.Screen name="profile" />
      </Stack>
      <StatusBar />
      <Toast />
    </SafeAreaView>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme || 'light'}>
        <PortalProvider shouldAddRootHost>
          <NavigationContent />
        </PortalProvider>
      </TamaguiProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <RootLayoutNav />
      </SettingsProvider>
    </AuthProvider>
  );
}
