import type { ExerciseAttempt } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text as RNText } from 'react-native';
import { Text, XStack, YStack, useTheme } from 'tamagui';

type PastAttemptItemProps = {
  attempt: ExerciseAttempt;
};

const getAttemptStatus = (remembered: boolean | null, theme: ReturnType<typeof useTheme>) => {
  if (remembered === true) {
    return {
      icon: 'checkmark-circle' as const,
      color: theme.green10?.get(),
      text: '覚えた',
      bgColor: '$green2',
      borderColor: '$green8',
    };
  } else if (remembered === false) {
    return {
      icon: 'close-circle' as const,
      color: theme.red10?.get(),
      text: '覚えてない',
      bgColor: '$red2',
      borderColor: '$red8',
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

export const PastAttemptItem = React.memo(({ attempt }: PastAttemptItemProps) => {
  const theme = useTheme();
  const status = getAttemptStatus(attempt.remembered, theme);

  return (
    <YStack
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
      <YStack gap="$1">
        <RNText
          style={{
            fontSize: 14,
            lineHeight: 20,
            color: theme.color.get(),
          }}
        >
          {attempt.user_answer || '(回答なし)'}
        </RNText>
      </YStack>
    </YStack>
  );
});

PastAttemptItem.displayName = 'PastAttemptItem';
