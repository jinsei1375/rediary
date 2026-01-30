import { Header } from '@/components/common/Header';
import { TermsContent } from '@/components/common/TermsContent';
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
      <TermsContent />
    </YStack>
  );
}
