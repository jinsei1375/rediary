import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

/**
 * OAuth認証のコールバック画面
 * Google認証後にリダイレクトされる画面
 * AuthSession.startAsyncが自動的にトークンを処理するため、
 * この画面は表示されることなくホーム画面にリダイレクトされる
 */
export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // AuthSession.startAsyncがトークン処理を完了した後、
    // 認証状態の変更により自動的にホーム画面にリダイレクトされる
    // ここでは念のため手動でリダイレクトを試みる
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
