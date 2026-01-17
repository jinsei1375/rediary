import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { PortalProvider } from '@tamagui/portal';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { TamaguiProvider } from 'tamagui';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import tamaguiConfig from '@/tamagui.config';
import { SafeAreaView } from 'react-native-safe-area-context';

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (!session && inAuthGroup) {
      // ログインしていない場合はログイン画面へ
      router.replace('/login');
    } else if (session && !inAuthGroup) {
      // ログインしている場合はタブ画面へ
      router.replace('/(tabs)');
    }
  }, [session, loading, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme || 'light'}>
        <PortalProvider shouldAddRootHost>
          <SafeAreaView style={{ flex: 1 }}>
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
            </Stack>
            <StatusBar />
          </SafeAreaView>
        </PortalProvider>
      </TamaguiProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
