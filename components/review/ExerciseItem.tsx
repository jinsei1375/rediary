import type { TranslationExercise } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable } from 'react-native';
import { Button, Input, Separator, Text, XStack, YStack } from 'tamagui';

type ExerciseItemProps = {
  exercise: TranslationExercise;
  userAnswer: string;
  isRevealed: boolean;
  onAnswerChange: (text: string) => void;
  onRevealAnswer: () => void;
  onComplete: () => void;
  onGoToDiary: () => void;
};

export const ExerciseItem = memo(
  ({
    exercise,
    userAnswer,
    isRevealed,
    onAnswerChange,
    onRevealAnswer,
    onComplete,
    onGoToDiary,
  }: ExerciseItemProps) => {
    return (
      <YStack padding="$4" backgroundColor="$background" gap="$3">
        <YStack gap="$2">
          <Text fontSize="$3" color="$gray10" fontWeight="600">
            この日本語を英語に翻訳してください
          </Text>
          <YStack
            padding="$3"
            backgroundColor="$blue1"
            borderRadius="$3"
            borderLeftWidth={4}
            borderLeftColor="$primary"
          >
            <Text fontSize="$5" fontWeight="600" color="$color">
              {exercise.correct_translation}
            </Text>
          </YStack>
        </YStack>

        {!exercise.is_completed && (
          <YStack gap="$2">
            <Text fontSize="$3" color="$gray10" fontWeight="600">
              あなたの回答
            </Text>
            <Input
              value={userAnswer}
              onChangeText={onAnswerChange}
              placeholder="英語で入力してください"
              size="$4"
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$3"
              padding="$3"
              backgroundColor="$background"
              multiline
              numberOfLines={3}
              disabled={isRevealed}
            />
          </YStack>
        )}

        {isRevealed && (
          <YStack gap="$2">
            <XStack gap="$2" alignItems="center">
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text fontSize="$3" color="$gray10" fontWeight="600">
                正解
              </Text>
            </XStack>
            <YStack
              padding="$3"
              backgroundColor="$green2"
              borderRadius="$3"
              borderLeftWidth={4}
              borderLeftColor="#10B981"
            >
              <Text fontSize="$5" color="$color">
                {exercise.source_text}
              </Text>
            </YStack>
          </YStack>
        )}

        {exercise.user_translation && exercise.is_completed && (
          <YStack gap="$2">
            <Text fontSize="$3" color="$gray10" fontWeight="600">
              あなたの回答
            </Text>
            <Text fontSize="$4" color="$gray11" fontStyle="italic">
              {exercise.user_translation}
            </Text>
          </YStack>
        )}

        <XStack gap="$2" justifyContent="space-between" alignItems="center" marginTop="$2">
          <XStack gap="$2" alignItems="center" flex={1}>
            {exercise.diary_entry_id && (
              <Pressable onPress={onGoToDiary}>
                <XStack gap="$1" alignItems="center">
                  <Ionicons name="book-outline" size={16} color="#5B8CFF" />
                  <Text fontSize="$2" color="$primary">
                    日記を見る
                  </Text>
                </XStack>
              </Pressable>
            )}
          </XStack>

          {!exercise.is_completed && (
            <XStack gap="$2">
              {!isRevealed ? (
                <Button
                  size="$3"
                  backgroundColor="$primary"
                  color="$background"
                  onPress={onRevealAnswer}
                >
                  正解を確認する
                </Button>
              ) : (
                <Button
                  size="$3"
                  backgroundColor="$success"
                  color="$background"
                  onPress={onComplete}
                >
                  完了にする
                </Button>
              )}
            </XStack>
          )}
        </XStack>

        <Separator marginTop="$2" />
      </YStack>
    );
  }
);

ExerciseItem.displayName = 'ExerciseItem';
