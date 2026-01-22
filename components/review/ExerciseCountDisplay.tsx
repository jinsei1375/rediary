import React from 'react';
import { Text, XStack, YStack } from 'tamagui';

type ExerciseCountDisplayProps = {
  count: number;
};

export const ExerciseCountDisplay = React.memo(({ count }: ExerciseCountDisplayProps) => {
  return (
    <YStack
      alignItems="center"
      padding="$3"
      backgroundColor="$blue2"
      borderRadius="$3"
      marginTop="$2"
    >
      <Text fontSize="$3" color="$gray11" marginBottom="$1">
        該当する問題
      </Text>
      <XStack gap="$1" alignItems="baseline">
        <Text fontSize="$9" fontWeight="bold" color="$blue10">
          {count}
        </Text>
        <Text fontSize="$5" color="$gray11">
          問
        </Text>
      </XStack>
    </YStack>
  );
});

ExerciseCountDisplay.displayName = 'ExerciseCountDisplay';
