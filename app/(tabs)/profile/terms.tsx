import { Header } from '@/components/common/Header';
import { router } from 'expo-router';
import { YStack } from 'tamagui';

export default function TermsScreen() {
  return (
    <YStack flex={1} backgroundColor="$background">
      <Header
        title="利用規約"
        onBack={() => {
          router.push('/(tabs)/profile');
        }}
      />
      {/* 利用規約本文は後で実装 */}
    </YStack>
  );
}
