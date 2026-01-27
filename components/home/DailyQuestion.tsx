import type { TranslationExercise } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, XStack, YStack, useTheme } from 'tamagui';

type DailyQuestionProps = {
  question: TranslationExercise;
  onPress: () => void;
};

export const DailyQuestion = React.memo(({ question, onPress }: DailyQuestionProps) => {
  const theme = useTheme();

  return (
    <YStack
      backgroundColor="$purple2"
      padding="$4"
      borderRadius="$6"
      gap="$2"
      pressStyle={{ opacity: 0.8, scale: 0.98 }}
      animation="quick"
      onPress={onPress}
    >
      <XStack alignItems="center" gap="$2">
        <Ionicons name="bulb-outline" size={20} color={theme.purple10.get()} />
        <Text fontSize="$4" fontWeight="600" color="$purple10">
          今日の1問
        </Text>
      </XStack>
      <Text fontSize="$5" color="$textPrimary" lineHeight="$6">
        {question.native_text}
      </Text>
      <XStack alignItems="center" gap="$2" marginTop="$2">
        <Text fontSize="$3" color="$textSecondary">
          タップして復習する
        </Text>
        <Ionicons name="arrow-forward" size={16} color={theme.textSecondary.get()} />
      </XStack>
    </YStack>
  );
});

DailyQuestion.displayName = 'DailyQuestion';
