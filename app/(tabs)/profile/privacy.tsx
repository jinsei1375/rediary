import { Header } from '@/components/common/Header';
import { PrivacyContent } from '@/components/common/PrivacyContent';
import { YStack } from 'tamagui';

export default function PrivacyPolicyScreen() {
  return (
    <YStack flex={1} backgroundColor="$background">
      <Header title="プライバシーポリシー" />
      <PrivacyContent />
    </YStack>
  );
}
