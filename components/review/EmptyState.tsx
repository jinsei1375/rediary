import { memo } from 'react';
import { Text, YStack } from 'tamagui';

type FilterType = 'all' | 'incomplete' | 'completed';

type EmptyStateProps = {
  filter: FilterType;
};

export const EmptyState = memo(({ filter }: EmptyStateProps) => {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$6">
      <Text fontSize="$6" color="$gray10" textAlign="center" marginBottom="$2">
        {filter === 'incomplete' && '未完了の復習問題はありません'}
        {filter === 'completed' && '完了した復習問題はありません'}
        {filter === 'all' && '復習問題がまだありません'}
      </Text>
      <Text fontSize="$3" color="$gray9" textAlign="center">
        AI添削を実行すると、ネイティブ表現が{'\n'}自動的に復習問題として登録されます
      </Text>
    </YStack>
  );
});

EmptyState.displayName = 'EmptyState';
