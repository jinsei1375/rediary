import { memo } from 'react';
import { Button, XStack } from 'tamagui';

type FilterType = 'all' | 'incomplete' | 'completed';

type FilterButtonsProps = {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
};

export const FilterButtons = memo(({ filter, onFilterChange }: FilterButtonsProps) => {
  return (
    <XStack gap="$2">
      <Button
        flex={1}
        size="$3"
        onPress={() => onFilterChange('incomplete')}
        backgroundColor={filter === 'incomplete' ? '$primary' : '$gray3'}
        color={filter === 'incomplete' ? '$background' : '$color'}
        borderRadius="$3"
        fontWeight="600"
        pressStyle={{
          backgroundColor: filter === 'incomplete' ? '$primaryPress' : '$backgroundPress',
        }}
        hoverStyle={{
          backgroundColor: filter === 'incomplete' ? '$primaryHover' : '$backgroundHover',
        }}
      >
        未完了
      </Button>

      <Button
        flex={1}
        size="$3"
        onPress={() => onFilterChange('completed')}
        backgroundColor={filter === 'completed' ? '$primary' : '$gray3'}
        color={filter === 'completed' ? '$background' : '$color'}
        borderRadius="$3"
        fontWeight="600"
        pressStyle={{
          backgroundColor: filter === 'completed' ? '$primaryPress' : '$backgroundPress',
        }}
        hoverStyle={{
          backgroundColor: filter === 'completed' ? '$primaryHover' : '$backgroundHover',
        }}
      >
        完了
      </Button>

      <Button
        flex={1}
        size="$3"
        onPress={() => onFilterChange('all')}
        backgroundColor={filter === 'all' ? '$primary' : '$gray3'}
        color={filter === 'all' ? '$background' : '$color'}
        borderRadius="$3"
        fontWeight="600"
        pressStyle={{
          backgroundColor: filter === 'all' ? '$primaryPress' : '$backgroundPress',
        }}
        hoverStyle={{
          backgroundColor: filter === 'all' ? '$primaryHover' : '$backgroundHover',
        }}
      >
        すべて
      </Button>
    </XStack>
  );
});

FilterButtons.displayName = 'FilterButtons';
