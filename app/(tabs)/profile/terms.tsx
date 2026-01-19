import { Text, YStack } from 'tamagui';

export default function TermsScreen() {
  return (
    <YStack flex={1} backgroundColor="$background" padding="$4">
      <Text fontSize="$7" fontWeight="bold" marginBottom="$4">
        利用規約
      </Text>
      {/* 利用規約本文は後で実装 */}
    </YStack>
  );
}
