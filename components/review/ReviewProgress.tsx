import React from 'react';
import { Text, YStack } from 'tamagui';

type ReviewProgressProps = {
  currentIndex: number;
  totalQuestions: number;
};

export const ReviewProgress = React.memo(
  ({ currentIndex, totalQuestions }: ReviewProgressProps) => {
    return (
      <YStack
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        paddingHorizontal="$4"
        paddingVertical="$3"
        alignItems="flex-end"
      >
        <Text fontSize="$4" color="$gray11" fontWeight="600">
          {currentIndex + 1} / {totalQuestions}
        </Text>
      </YStack>
    );
  },
);

ReviewProgress.displayName = 'ReviewProgress';
