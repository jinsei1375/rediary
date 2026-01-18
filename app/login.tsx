import { GoogleLogo } from '@/components/common/GoogleLogo';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Input, Separator, Spinner, Text, XStack, YStack } from 'tamagui';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const getErrorMessage = (error: any): string => {
    const message = error?.message || '';

    if (message.includes('Invalid login credentials')) {
      return 'メールアドレスまたはパスワードが正しくありません';
    }
    if (message.includes('Email not confirmed')) {
      return 'メールアドレスが確認されていません。確認メールをご確認ください';
    }
    if (message.includes('User already registered')) {
      return 'このメールアドレスは既に登録されています';
    }
    if (message.includes('Password should be at least')) {
      return 'パスワードは6文字以上で設定してください';
    }
    if (message.includes('Invalid email')) {
      return 'メールアドレスの形式が正しくありません';
    }
    if (message.includes('Network request failed')) {
      return 'ネットワークエラーが発生しました。接続を確認してください';
    }

    return 'エラーが発生しました。もう一度お試しください';
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('エラー', 'メールアドレスとパスワードを入力してください');
      return;
    }

    setLoading(true);
    const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('エラー', getErrorMessage(error));
    } else if (isSignUp) {
      Alert.alert(
        '確認メールを送信しました',
        'メールに記載されたリンクをクリックして、アカウントを有効化してください',
        [{ text: 'OK', onPress: () => setIsSignUp(false) }],
      );
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    setLoading(false);

    if (error) {
      Alert.alert('エラー', 'Google認証に失敗しました');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <YStack flex={1} justifyContent="center" paddingHorizontal="$6" backgroundColor="$background">
        <Text
          fontSize="$10"
          fontWeight="bold"
          textAlign="center"
          marginBottom="$2"
          color="$primary"
        >
          Rediary
        </Text>
        <Text fontSize="$5" textAlign="center" color="$placeholderColor" marginBottom="$10">
          日記で学ぶ言語学習アプリ
        </Text>

        <YStack width="100%">
          <Input
            placeholder="メールアドレス"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            size="$4"
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$3"
            padding="$3"
            marginBottom="$4"
            backgroundColor="$background"
            focusStyle={{
              borderColor: '$borderColorFocus',
            }}
          />
          <Input
            placeholder="パスワード"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            size="$4"
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$3"
            padding="$3"
            marginBottom="$4"
            backgroundColor="$background"
            focusStyle={{
              borderColor: '$borderColorFocus',
            }}
          />

          <Button
            backgroundColor="$primary"
            borderRadius="$3"
            height="$5"
            marginBottom="$4"
            onPress={handleEmailAuth}
            disabled={loading}
            alignItems="center"
            justifyContent="center"
            pressStyle={{
              backgroundColor: '$primaryPress',
            }}
          >
            {loading ? (
              <Spinner color="$background" />
            ) : (
              <Text color="$background" fontSize="$5" fontWeight="bold">
                {isSignUp ? '新規登録' : 'ログイン'}
              </Text>
            )}
          </Button>

          <Button
            unstyled
            onPress={() => setIsSignUp(!isSignUp)}
            marginBottom="$4"
            pressStyle={{ opacity: 0.7 }}
          >
            <Text textAlign="center" color="$primary">
              {isSignUp
                ? 'アカウントをお持ちの方はログイン'
                : 'アカウントをお持ちでない方は新規登録'}
            </Text>
          </Button>

          <XStack alignItems="center" marginBottom="$4">
            <Separator flex={1} />
            <Text paddingHorizontal="$3" color="$gray10" fontSize="$2">
              または
            </Text>
            <Separator flex={1} />
          </XStack>

          <Button
            backgroundColor="$background"
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$3"
            height="$5"
            onPress={handleGoogleAuth}
            disabled={loading}
            alignItems="center"
            justifyContent="center"
            pressStyle={{
              backgroundColor: '$backgroundHover',
            }}
          >
            <XStack gap="$2" alignItems="center">
              <GoogleLogo size={20} />
              <Text color="$color" fontSize="$4" fontWeight="600">
                Googleで{isSignUp ? '登録' : 'ログイン'}
              </Text>
            </XStack>
          </Button>
        </YStack>
      </YStack>
    </KeyboardAvoidingView>
  );
}
