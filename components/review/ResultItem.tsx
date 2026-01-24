import type { ExerciseResult } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, XStack, YStack, useTheme } from 'tamagui';

type ResultItemProps = {
  result: ExerciseResult;
  index: number;
};

export const ResultItem = React.memo(({ result, index }: ResultItemProps) => {
  const theme = useTheme();

  return (
    <YStack
      padding="$4"
      backgroundColor={result.remembered ? '$green2' : '$red2'}
      borderRadius="$4"
      borderWidth={1}
      borderColor={result.remembered ? '$green7' : '$red7'}
      gap="$3"
    >
      <XStack justifyContent="space-between" alignItems="center">
        <XStack gap="$2" alignItems="center">
          <Text fontSize="$4" fontWeight="bold" color="$color">
            問題 {index + 1}
          </Text>
          <Ionicons
            name={result.remembered ? 'checkmark-circle' : 'close-circle'}
            size={24}
            color={result.remembered ? theme.green10.get() : theme.red10.get()}
          />
        </XStack>
      </XStack>

      <YStack gap="$2">
        <Text fontSize="$2" color="$gray11" fontWeight="600">
          問題文（日本語）
        </Text>
        <Text fontSize="$4" color="$color">
          {result.exercise.native_text}
        </Text>
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$2" color="$gray11" fontWeight="600">
          模範解答
        </Text>
        <Text fontSize="$4" color="$green10" fontWeight="500">
          {result.exercise.target_text}
        </Text>
      </YStack>

      {result.userAnswer && (
        <YStack gap="$2">
          <Text fontSize="$2" color="$gray11" fontWeight="600">
            あなたの回答
          </Text>
          <Text fontSize="$4" color="$color">
            {result.userAnswer}
          </Text>
        </YStack>
      )}
    </YStack>
  );
});

ResultItem.displayName = 'ResultItem';
