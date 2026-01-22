import type { ExerciseAttempt, TranslationExercise } from '@/types/database';
import {
  getLanguageExpressionLabel,
  getLanguageInstructionText,
  getLanguageName,
  getOriginalTextLabel,
} from '@/utils/languageUtils';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView as RNScrollView, Text as RNText } from 'react-native';
import { Button, Input, Text, XStack, YStack, useTheme } from 'tamagui';
import { FlashCard } from './FlashCard';

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

    // Helper function to get attempt status properties
    const getAttemptStatus = (remembered: boolean | null) => {
      if (remembered === true) {
        return {
          icon: 'checkmark-circle' as const,
          color: theme.green10.get(),
          text: '覚えた',
          bgColor: '$green2',
          borderColor: '$green7',
        };
      } else if (remembered === false) {
        return {
          icon: 'close-circle' as const,
          color: theme.red10.get(),
          text: '覚えてない',
          bgColor: '$red2',
          borderColor: '$red7',
        };
      } else {
        return {
          icon: 'help-circle-outline' as const,
          color: theme.gray10?.get() ?? '#999',
          text: '未評価',
          bgColor: '$gray2',
          borderColor: '$gray7',
        };
      }
    };

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
          <Button
            size="$4"
            backgroundColor="$blue10"
            onPress={onCheckAnswer}
            disabled={isFlipped}
            opacity={isFlipped ? 0.5 : 1}
            pressStyle={{
              backgroundColor: '$blue11',
              scale: 0.98,
            }}
            animation="quick"
          >
            <XStack gap="$2" alignItems="center">
              <Ionicons name="eye" size={20} color="white" />
              <Text fontSize="$4" fontWeight="700" color="white">
                答えを確認
              </Text>
            </XStack>
          </Button>
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
              <Ionicons name="checkmark-circle" size={18} color={theme.green10.get()} />
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
              <Ionicons name="close-circle" size={18} color={theme.red10.get()} />
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
        <Button
          size="$3"
          backgroundColor="$gray3"
          borderColor="$gray7"
          borderWidth={1}
          onPress={() => setShowPastAnswersDialog(true)}
          pressStyle={{
            backgroundColor: '$gray4',
            scale: 0.98,
          }}
          animation="quick"
          marginTop="$2"
        >
          <XStack gap="$2" alignItems="center">
            <Ionicons name="time-outline" size={18} color={theme.color.get()} />
            <Text fontSize="$3" fontWeight="600" color="$color">
              過去の解答データを見る
            </Text>
          </XStack>
        </Button>
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
            <Button
              flex={1}
              size="$5"
              backgroundColor="$red5"
              borderColor="$red7"
              borderWidth={2}
              onPress={onNotRemembered}
              pressStyle={{
                backgroundColor: '$red6',
                scale: 0.98,
              }}
              animation="quick"
            >
              <XStack gap="$2" alignItems="center">
                <Ionicons name="close-circle" size={24} color={theme.red10.get()} />
                <Text fontSize="$5" fontWeight="700" color="$red10">
                  覚えてない
                </Text>
              </XStack>
            </Button>

            <Button
              flex={1}
              size="$5"
              backgroundColor="$green5"
              borderColor="$green7"
              borderWidth={2}
              onPress={onRemembered}
              pressStyle={{
                backgroundColor: '$green6',
                scale: 0.98,
              }}
              animation="quick"
            >
              <XStack gap="$2" alignItems="center">
                <Ionicons name="checkmark-circle" size={24} color={theme.green10.get()} />
                <Text fontSize="$5" fontWeight="700" color="$green10">
                  覚えた
                </Text>
              </XStack>
            </Button>
          </XStack>
        )}

        {/* Past Answers Dialog */}
        <Modal
          visible={showPastAnswersDialog}
          transparent
          animationType="fade"
          accessibilityViewIsModal
          onRequestClose={() => setShowPastAnswersDialog(false)}
        >
          <YStack
            flex={1}
            backgroundColor="rgba(0,0,0,0.5)"
            justifyContent="center"
            alignItems="center"
            paddingHorizontal="$4"
          >
            <YStack
              backgroundColor="$background"
              borderRadius="$4"
              padding="$4"
              width="90%"
              maxHeight="80%"
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.3}
              shadowRadius={8}
              elevation={5}
            >
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                <Text fontSize="$6" fontWeight="700" color="$color">
                  過去の解答データ
                </Text>
                <Button
                  size="$3"
                  circular
                  backgroundColor="$gray3"
                  onPress={() => setShowPastAnswersDialog(false)}
                  pressStyle={{
                    backgroundColor: '$gray4',
                  }}
                >
                  <Ionicons name="close" size={20} color={theme.color.get()} />
                </Button>
              </XStack>

              <RNScrollView style={{ maxHeight: 400 }}>
                {pastAttempts.length === 0 ? (
                  <YStack alignItems="center" paddingVertical="$8">
                    <Ionicons name="document-outline" size={48} color={theme.gray10?.get() ?? '#999'} />
                    <Text fontSize="$4" color="$gray10" marginTop="$3" textAlign="center">
                      まだ解答データがありません
                    </Text>
                  </YStack>
                ) : (
                  <YStack gap="$3">
                    {pastAttempts.map((attempt) => {
                      const status = getAttemptStatus(attempt.remembered);
                      return (
                        <YStack
                          key={attempt.id}
                          padding="$3"
                          backgroundColor={status.bgColor}
                          borderRadius="$3"
                          borderWidth={1}
                          borderColor={status.borderColor}
                        >
                          <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                            <XStack gap="$2" alignItems="center">
                              <Ionicons name={status.icon} size={20} color={status.color} />
                              <Text fontSize="$3" fontWeight="600" color="$color">
                                {status.text}
                              </Text>
                            </XStack>
                            <Text fontSize="$2" color="$gray11">
                              {new Date(attempt.attempted_at).toLocaleString('ja-JP', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Text>
                          </XStack>
                          {attempt.user_answer && (
                            <YStack gap="$1">
                              <Text fontSize="$2" color="$gray11" fontWeight="600">
                                あなたの回答:
                              </Text>
                              <RNText
                                style={{
                                  fontSize: 14,
                                  lineHeight: 20,
                                  color: theme.color.get(),
                                }}
                              >
                                {attempt.user_answer}
                              </RNText>
                            </YStack>
                          )}
                        </YStack>
                      );
                    })}
                  </YStack>
                )}
              </RNScrollView>
            </YStack>
          </YStack>
        </Modal>
      </YStack>
    );
  },
);

ReviewCard.displayName = 'ReviewCard';
