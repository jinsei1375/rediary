import React from 'react';
import { Text, XStack, YStack } from 'tamagui';

type ReviewProgressProps = {
  currentIndex: number;
  totalQuestions: number;
};

export const ReviewProgress = React.memo(
  ({ currentIndex, totalQuestions }: ReviewProgressProps) => {
    const progress = ((currentIndex + 1) / totalQuestions) * 100;

    return (
      <YStack
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        paddingHorizontal="$4"
        paddingVertical="$3"
      >
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
          <XStack gap="$2" alignItems="center">
            <Text fontSize="$3" color="$gray11" fontWeight="600">
              進捗状況
            </Text>
          </XStack>
          <Text fontSize="$4" color="$gray11" fontWeight="600">
            {currentIndex + 1} / {totalQuestions}
          </Text>
        </XStack>
        <YStack height={6} backgroundColor="$gray5" borderRadius="$2" overflow="hidden">
          <YStack
            height="100%"
            width={`${progress}%`}
            backgroundColor="$blue10"
            animation="quick"
          />
        </YStack>
      </YStack>
    );
  },
);

ReviewProgress.displayName = 'ReviewProgress';
