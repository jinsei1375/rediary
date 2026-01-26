import { ActionButton } from '@/components/common/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, XStack, YStack, useTheme } from 'tamagui';

type EmptyReviewStateProps = {
  onBackToSettings: () => void;
};

export const EmptyReviewState = ({ onBackToSettings }: EmptyReviewStateProps) => {
  const theme = useTheme();

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal="$6">
      <Ionicons name="checkmark-done-circle" size={80} color={theme.green10.get()} />
      <Text fontSize="$7" fontWeight="bold" marginTop="$4" color="$color">
        復習問題がありません
      </Text>
      <Text fontSize="$4" color="$gray11" marginTop="$2" textAlign="center">
        条件に合う問題が見つかりませんでした
      </Text>
      <ActionButton
        marginTop="$6"
        paddingHorizontal="$6"
        height="$5"
        borderRadius="$3"
        onPress={onBackToSettings}
      >
        <XStack gap="$2" alignItems="center">
          <Ionicons name="settings" size={20} color="white" />
          <Text color="white" fontSize="$5" fontWeight="600">
            設定を変更
          </Text>
        </XStack>
      </ActionButton>
    </YStack>
  );
};
