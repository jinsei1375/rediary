import { Text, YStack } from 'tamagui';

export default function PrivacyPolicyScreen() {
  return (
    <YStack flex={1} backgroundColor="$background" padding="$4">
      <Text fontSize="$7" fontWeight="bold" marginBottom="$4">
        プライバシーポリシー
      </Text>
      {/* プライバシーポリシー本文は後で実装 */}
    </YStack>
  );
}
