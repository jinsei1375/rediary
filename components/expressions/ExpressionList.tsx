import type { TranslationExercise } from '@/types/database';
import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, XStack, YStack } from 'tamagui';
import { EmptyExpressionState } from './EmptyExpressionState';
import { ExpressionCard } from './ExpressionCard';

type ExpressionListProps = {
  expressions: TranslationExercise[];
  onEdit?: (expression: TranslationExercise) => void;
  onDelete?: (expression: TranslationExercise) => void;
};

export const ExpressionList = React.memo(({ expressions, onDelete }: ExpressionListProps) => {
  const renderExpression = useCallback(
    ({ item }: { item: TranslationExercise }) => (
      <ExpressionCard expression={item} onDelete={onDelete} />
    ),
    [onDelete],
  );

  const keyExtractor = useCallback((item: TranslationExercise) => item.id, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <YStack flex={1} padding="$4" paddingBottom="$0">
        <XStack justifyContent="flex-end" alignItems="center" marginBottom="$3">
          <Text fontSize="$3" color="$gray10">
            {expressions.length}個
          </Text>
        </XStack>

        <FlatList
          data={expressions}
          renderItem={renderExpression}
          keyExtractor={keyExtractor}
          ListEmptyComponent={EmptyExpressionState}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </YStack>
    </GestureHandlerRootView>
  );
});

ExpressionList.displayName = 'ExpressionList';
