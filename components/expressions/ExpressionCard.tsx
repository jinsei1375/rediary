import type { TranslationExercise } from '@/types/database';
import { formatDate } from '@/utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Card, Text, useTheme, XStack, YStack } from 'tamagui';

type ExpressionCardProps = {
  expression: TranslationExercise;
};

export const ExpressionCard = React.memo(({ expression }: ExpressionCardProps) => {
  const theme = useTheme();

  return (
    <Card
      backgroundColor="$cardBg"
      borderWidth={1}
      borderColor="$cardBorder"
      padding="$3"
      borderRadius="$3"
      marginBottom="$2"
    >
      <YStack gap="$2">
        <Text fontSize="$4" fontWeight="500" color="$textPrimary">
          {expression.native_text}
        </Text>
        {expression.target_text && (
          <Text fontSize="$3" color="$textSecondary">
            {expression.target_text}
          </Text>
        )}
        <XStack gap="$2" alignItems="center" marginTop="$1">
          <Ionicons name="calendar-outline" size={14} color={theme.gray9.get()} />
          <Text fontSize="$2" color="$gray9">
            {formatDate(expression.created_at)}
          </Text>
        </XStack>
      </YStack>
    </Card>
  );
});

ExpressionCard.displayName = 'ExpressionCard';
