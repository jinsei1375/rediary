import { ButtonLoadingOverlay } from '@/components/common/ButtonLoadingOverlay';
import { Dialog } from '@/components/common/Dialog';
import { GoogleLogo } from '@/components/common/GoogleLogo';
import { PrivacyContent } from '@/components/common/PrivacyContent';
import { TermsContent } from '@/components/common/TermsContent';
import { APP_NAME } from '@/constants/app';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { handleAuthError } from '@/utils/authErrorHandler';
import * as AppleAuthentication from 'expo-apple-authentication';
import React, { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { Button, Text, XStack, YStack } from 'tamagui';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const { signInWithGoogle, signInWithApple } = useAuth();
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Apple認証が利用可能かチェック（iOS 13以降のみ）
    if (Platform.OS === 'ios') {
      AppleAuthentication.isAvailableAsync().then(setAppleAuthAvailable);
    }
  }, []);

  const handleGoogleAuth = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    setLoading(false);

    if (error) {
      handleAuthError(error, (message) => Alert.alert('エラー', message));
    }
  };

  const handleAppleAuth = async () => {
    setLoading(true);
    const { error } = await signInWithApple();
    setLoading(false);

    if (error) {
      handleAuthError(error, (message) => Alert.alert('エラー', message));
    }
  };

  return (
    <YStack flex={1} justifyContent="center" paddingHorizontal="$6" backgroundColor="$background">
      <Text fontSize="$10" fontWeight="bold" textAlign="center" marginBottom="$2" color="$primary">
        {APP_NAME}
      </Text>
      <Text fontSize="$5" textAlign="center" color="$placeholderColor" marginBottom="$10">
        日記で学ぶ言語学習アプリ
      </Text>

      <YStack width="100%" gap="$4">
        {appleAuthAvailable && (
          <YStack position="relative">
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={
                colorScheme === 'dark'
                  ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                  : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={8}
              style={{
                width: '100%',
                height: 48,
              }}
              onPress={handleAppleAuth}
            />
            <ButtonLoadingOverlay visible={loading} />
          </YStack>
        )}

        <YStack position="relative">
          <Button
            backgroundColor="#FFFFFF"
            borderWidth={1}
            borderColor={colorScheme === 'dark' ? '$gray6' : '$borderColor'}
            borderRadius="$3"
            height="$5"
            onPress={handleGoogleAuth}
            alignItems="center"
            justifyContent="center"
            pressStyle={{
              opacity: 0.9,
            }}
          >
            <XStack gap="$2" alignItems="center">
              <GoogleLogo size={20} />
              <Text color="#1F1F1F" fontSize="$4" fontWeight="bold">
                Googleでログイン
              </Text>
            </XStack>
          </Button>
          <ButtonLoadingOverlay visible={loading} />
        </YStack>

        <XStack gap="$1" flexWrap="wrap" justifyContent="center" paddingHorizontal="$4">
          <Text fontSize="$2" textAlign="center" color="$placeholderColor">
            ログインすることで、
          </Text>
          <Text
            fontSize="$2"
            color="$blue10"
            textDecorationLine="underline"
            onPress={() => setShowTerms(true)}
          >
            利用規約
          </Text>
          <Text fontSize="$2" color="$placeholderColor">
            と
          </Text>
          <Text
            fontSize="$2"
            color="$blue10"
            textDecorationLine="underline"
            onPress={() => setShowPrivacy(true)}
          >
            プライバシーポリシー
          </Text>
          <Text fontSize="$2" color="$placeholderColor">
            に同意したことになります
          </Text>
        </XStack>
      </YStack>

      <Dialog visible={showTerms} onClose={() => setShowTerms(false)} title="利用規約">
        <TermsContent />
      </Dialog>

      <Dialog
        visible={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="プライバシーポリシー"
      >
        <PrivacyContent />
      </Dialog>
    </YStack>
  );
}
