import { ActionButton } from '@/components/common/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, XStack } from 'tamagui';

type StartReviewButtonProps = {
  onPress: () => void;
  disabled: boolean;
};

export const StartReviewButton = React.memo(({ onPress, disabled }: StartReviewButtonProps) => {
  return (
    <ActionButton
      marginTop="$4"
      height="$5"
      borderRadius="$3"
      onPress={onPress}
      disabled={disabled}
      opacity={disabled ? 0.5 : 1}
    >
      <XStack gap="$2" alignItems="center">
        <Ionicons name="play-circle" size={24} color="white" />
        <Text color="white" fontSize="$6" fontWeight="bold">
          復習を始める
        </Text>
      </XStack>
    </ActionButton>
  );
});

StartReviewButton.displayName = 'StartReviewButton';
