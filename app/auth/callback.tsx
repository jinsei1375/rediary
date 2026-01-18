import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

/**
 * OAuth認証のコールバック画面
 * Google認証後にリダイレクトされる画面
 * WebBrowser.openAuthSessionAsyncがトークンを抽出し、
 * AuthContextのonAuthStateChangeが認証状態の変更を検知して
 * 自動的にホーム画面にリダイレクトする
 */
export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // 認証状態の変更により自動的にホーム画面にリダイレクトされるが、
    // 念のため短時間待機後に手動リダイレクトを試みる
    const REDIRECT_DELAY_MS = 1000;
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, REDIRECT_DELAY_MS);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
