import {
  ActionButton,
  ErrorButton,
  SecondaryButton,
  SuccessButton,
} from '@/components/common/PrimaryButton';
import type { ExerciseAttempt, TranslationExercise } from '@/types/database';
import {
  getLanguageExpressionLabel,
  getLanguageInstructionText,
  getLanguageName,
  getOriginalTextLabel,
} from '@/utils/languageUtils';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text as RNText } from 'react-native';
import { Input, Text, XStack, YStack, useTheme } from 'tamagui';
import { FlashCard } from './FlashCard';
import { PastAnswersDialog } from './PastAnswersDialog';

type ReviewCardProps = {
  exercise: TranslationExercise;
  isFlipped: boolean;
  userAnswer: string;
  onUserAnswerChange: (text: string) => void;
  onCheckAnswer: () => void;
  onRemembered: () => void;
  onNotRemembered: () => void;
  showButtons: boolean;
  rememberedCount?: number;
  notRememberedCount?: number;
  pastAttempts?: ExerciseAttempt[];
};

export const ReviewCard = React.memo(
  ({
    exercise,
    isFlipped,
    userAnswer,
    onUserAnswerChange,
    onCheckAnswer,
    onRemembered,
    onNotRemembered,
    showButtons,
    rememberedCount = 0,
    notRememberedCount = 0,
    pastAttempts = [],
  }: ReviewCardProps) => {
    const theme = useTheme();
    const [showPastAnswersDialog, setShowPastAnswersDialog] = useState(false);

    const frontContent = (
      <YStack gap="$4" alignItems="center" flex={1} justifyContent="center">
        <YStack
          backgroundColor="$blue2"
          paddingHorizontal="$3"
          paddingVertical="$2"
          borderRadius="$4"
        >
          <Text fontSize="$3" color="$blue10" fontWeight="600">
            {getLanguageName(exercise.native_language)} →{' '}
            {getLanguageName(exercise.target_language)}
          </Text>
        </YStack>

        <YStack
          gap="$3"
          alignItems="center"
          flex={1}
          justifyContent="center"
          paddingHorizontal="$2"
        >
          <Text fontSize="$2" color="$gray11" fontWeight="600">
            {getLanguageInstructionText(exercise.native_language)}
          </Text>
          <RNText
            style={{
              fontSize: 20,
              lineHeight: 32,
              textAlign: 'center',
              color: theme.color.get(),
              fontWeight: '500',
            }}
            selectable
          >
            {exercise.native_text}
          </RNText>
        </YStack>

        <YStack gap="$3" width="100%" paddingHorizontal="$2">
          <Text fontSize="$2" color="$gray11" fontWeight="600">
            あなたの回答
          </Text>
          <Input
            placeholder={`${getLanguageName(exercise.target_language)}で入力してください...`}
            value={userAnswer}
            onChangeText={onUserAnswerChange}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            fontSize="$4"
            padding="$3"
            backgroundColor="$background"
            borderColor="$blue7"
            borderWidth={1}
            focusStyle={{
              borderColor: '$blue9',
              borderWidth: 2,
            }}
          />
          <ActionButton
            size="$4"
            onPress={onCheckAnswer}
            disabled={isFlipped}
            opacity={isFlipped ? 0.5 : 1}
          >
            <XStack gap="$2" alignItems="center">
              <Ionicons name="eye" size={20} color="white" />
              <Text fontSize="$4" fontWeight="700" color="white">
                答えを確認
              </Text>
            </XStack>
          </ActionButton>
        </YStack>
      </YStack>
    );

    const backContent = (
      <YStack gap="$4" alignItems="center" flex={1} justifyContent="center">
        {/* Header with title and stats */}
        <XStack
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="$2"
        >
          <YStack
            backgroundColor="$green2"
            paddingHorizontal="$2"
            paddingVertical="$2"
            borderRadius="$4"
          >
            <Text fontSize="$3" color="$green10" fontWeight="600">
              模範解答
            </Text>
          </YStack>

          {/* Statistics display */}
          <XStack gap="$2" alignItems="center">
            <XStack
              gap="$1"
              alignItems="center"
              accessibilityLabel={`覚えた回数: ${rememberedCount}`}
            >
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={theme.green10?.get() ?? '#10b981'}
              />
              <Text fontSize="$3" color="$green10" fontWeight="700">
                {rememberedCount}
              </Text>
            </XStack>
            <Text fontSize="$3" color="$gray10">
              /
            </Text>
            <XStack
              gap="$1"
              alignItems="center"
              accessibilityLabel={`覚えてない回数: ${notRememberedCount}`}
            >
              <Ionicons name="close-circle" size={18} color={theme.red10?.get() ?? '#ef4444'} />
              <Text fontSize="$3" color="$red10" fontWeight="700">
                {notRememberedCount}
              </Text>
            </XStack>
          </XStack>
        </XStack>

        <YStack
          gap="$3"
          alignItems="center"
          flex={1}
          justifyContent="center"
          paddingHorizontal="$2"
        >
          <Text fontSize="$2" color="$gray11" fontWeight="600">
            {getLanguageExpressionLabel(exercise.target_language)}
          </Text>
          <RNText
            style={{
              fontSize: 20,
              lineHeight: 32,
              textAlign: 'center',
              color: theme.green10.get(),
              fontWeight: '600',
            }}
            selectable
          >
            {exercise.target_text}
          </RNText>
        </YStack>

        {userAnswer.trim() && (
          <YStack gap="$2" alignItems="center" paddingHorizontal="$2" width="100%">
            <Text fontSize="$2" color="$gray10" textAlign="center">
              あなたの回答
            </Text>
            <YStack backgroundColor="$blue2" padding="$3" borderRadius="$3" width="100%">
              <RNText
                style={{
                  fontSize: 16,
                  lineHeight: 24,
                  color: theme.color.get(),
                }}
                selectable
              >
                {userAnswer}
              </RNText>
            </YStack>
          </YStack>
        )}

        <YStack gap="$2" alignItems="center">
          <Text fontSize="$2" color="$gray10" textAlign="center" paddingHorizontal="$2">
            {getOriginalTextLabel(exercise.native_language)}
          </Text>
          <RNText
            style={{
              fontSize: 14,
              textAlign: 'center',
              color: theme.gray11.get(),
            }}
            selectable
          >
            {exercise.native_text}
          </RNText>
        </YStack>

        {/* View Past Answers Button */}
        <SecondaryButton size="$3" onPress={() => setShowPastAnswersDialog(true)} marginTop="$2">
          <XStack gap="$2" alignItems="center">
            <Ionicons name="time-outline" size={18} color={theme.color.get()} />
            <Text fontSize="$3" fontWeight="600" color="$color">
              過去の解答を見る
            </Text>
          </XStack>
        </SecondaryButton>
      </YStack>
    );

    return (
      <YStack gap="$4" paddingHorizontal="$2">
        <FlashCard
          frontContent={frontContent}
          backContent={backContent}
          isFlipped={isFlipped}
          onFlip={() => {}} // ボタンでのみ制御
        />

        {showButtons && isFlipped && (
          <XStack gap="$3" paddingBottom="$4">
            <ErrorButton flex={1} size="$5" onPress={onNotRemembered}>
              <XStack gap="$2" alignItems="center">
                <Ionicons name="close-circle" size={24} color={theme.red10.get()} />
                <Text fontSize="$5" fontWeight="700" color="$red10">
                  覚えてない
                </Text>
              </XStack>
            </ErrorButton>

            <SuccessButton flex={1} size="$5" onPress={onRemembered}>
              <XStack gap="$2" alignItems="center">
                <Ionicons name="checkmark-circle" size={24} color={theme.green10.get()} />
                <Text fontSize="$5" fontWeight="700" color="$green10">
                  覚えた
                </Text>
              </XStack>
            </SuccessButton>
          </XStack>
        )}

        {/* Past Answers Dialog */}
        <PastAnswersDialog
          visible={showPastAnswersDialog}
          onClose={() => setShowPastAnswersDialog(false)}
          pastAttempts={pastAttempts}
        />
      </YStack>
    );
  },
);

ReviewCard.displayName = 'ReviewCard';
