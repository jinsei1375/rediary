import { Text, YStack } from 'tamagui';

export default function ProfileSettingsScreen() {
  return (
    <YStack flex={1} backgroundColor="$background" padding="$4">
      <Text fontSize="$7" fontWeight="bold" marginBottom="$4">
        個人設定
      </Text>
      {/* 設定項目は後で実装 */}
    </YStack>
  );
}
