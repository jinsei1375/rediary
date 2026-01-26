import { ActionButton } from '@/components/common/PrimaryButton';
import type { ExerciseResult } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { H4, ScrollView, Text, XStack, YStack } from 'tamagui';
import { CircularProgress } from './CircularProgress';
import { ResultItem } from './ResultItem';

type ResultScreenProps = {
  results: ExerciseResult[];
  onBackToSettings: () => void;
};

export const ResultScreen = ({ results, onBackToSettings }: ResultScreenProps) => {
  const totalQuestions = results.length;
  const rememberedCount = results.filter((r) => r.remembered).length;
  const percentage = (rememberedCount / totalQuestions) * 100;

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack padding="$4" gap="$4" alignItems="center">
          <H4 color="$color" fontWeight="700">
            結果
          </H4>
          <CircularProgress
            percentage={percentage}
            rememberedCount={rememberedCount}
            totalQuestions={totalQuestions}
          />
        </YStack>

        <YStack padding="$4" gap="$3">
          <Text fontSize="$5" fontWeight="bold" color="$color" marginBottom="$2">
            解答詳細
          </Text>
          {results.map((result, index) => (
            <ResultItem key={result.exercise.id} result={result} index={index} />
          ))}
        </YStack>
      </ScrollView>

      <YStack padding="$4" gap="$3">
        <ActionButton size="$5" onPress={onBackToSettings}>
          <XStack gap="$2" alignItems="center">
            <Ionicons name="refresh" size={24} color="white" />
            <Text fontSize="$5" fontWeight="700" color="white">
              もう一度復習する
            </Text>
          </XStack>
        </ActionButton>
      </YStack>
    </YStack>
  );
};
