import { Header } from '@/components/common/Header';
import { router } from 'expo-router';
import { YStack } from 'tamagui';

export default function PrivacyPolicyScreen() {
  return (
    <YStack flex={1} backgroundColor="$background">
      <Header
        title="プライバシーポリシー"
        onBack={() => {
          router.push('/(tabs)/profile');
        }}
      />
      {/* プライバシーポリシー本文は後で実装 */}
    </YStack>
  );
}
