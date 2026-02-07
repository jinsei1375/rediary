import type { TranslationExercise } from '@/types/database';
import { formatDate } from '@/utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Card, Text, useTheme, XStack, YStack } from 'tamagui';

type ExpressionCardProps = {
  expression: TranslationExercise;
  displayDate?: boolean;
  onDelete?: (expression: TranslationExercise) => void;
};

export const ExpressionCard = React.memo(
  ({ expression, displayDate = true, onDelete }: ExpressionCardProps) => {
    const theme = useTheme();

    const renderRightActions = (
      progress: Animated.AnimatedInterpolation<number>,
      dragX: Animated.AnimatedInterpolation<number>,
    ) => {
      if (!onDelete) return null;

      const translateX = dragX.interpolate({
        inputRange: [-80, 0],
        outputRange: [0, 80],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View
          style={[
            styles.deleteAction,
            {
              transform: [{ translateX }],
              backgroundColor: theme.error.get(),
            },
          ]}
        >
          <Animated.View style={styles.deleteButton}>
            <XStack
              onPress={() => onDelete(expression)}
              paddingHorizontal="$4"
              height="100%"
              alignItems="center"
              justifyContent="center"
            >
              <Ionicons name="trash-outline" size={24} color="white" />
            </XStack>
          </Animated.View>
        </Animated.View>
      );
    };

    const cardContent = (
      <Card
        backgroundColor="$cardBg"
        borderWidth={1}
        borderColor="$cardBorder"
        padding="$3"
        borderRadius="$3"
        marginBottom="$2"
      >
        <YStack gap="$2">
          <YStack gap="$2" flex={1}>
            <Text fontSize="$4" fontWeight="500" color="$textPrimary">
              {expression.target_text}
            </Text>
            {expression.native_text && (
              <Text fontSize="$3" color="$textSecondary">
                {expression.native_text}
              </Text>
            )}
          </YStack>

          {displayDate && (
            <XStack gap="$2" alignItems="center" marginTop="$1">
              <Ionicons name="calendar-outline" size={14} color={theme.gray9.get()} />
              <Text fontSize="$2" color="$gray9">
                {formatDate(expression.created_at)}
              </Text>
            </XStack>
          )}
        </YStack>
      </Card>
    );

    if (!onDelete) {
      return cardContent;
    }

    return (
      <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
        {cardContent}
      </Swipeable>
    );
  },
);

ExpressionCard.displayName = 'ExpressionCard';

const styles = StyleSheet.create({
  deleteAction: {
    justifyContent: 'center',
    width: 80,
    marginBottom: 8,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
