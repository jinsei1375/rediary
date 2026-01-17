import { memo } from 'react';
import { Pressable } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

type FilterType = 'all' | 'incomplete' | 'completed';

type FilterButtonsProps = {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
};

export const FilterButtons = memo(({ filter, onFilterChange }: FilterButtonsProps) => {
  return (
    <XStack gap="$2">
      <Pressable onPress={() => onFilterChange('incomplete')} style={{ flex: 1 }}>
        <YStack
          padding="$2"
          backgroundColor={filter === 'incomplete' ? '$primary' : '$gray3'}
          borderRadius="$3"
          alignItems="center"
        >
          <Text
            fontSize="$3"
            fontWeight="600"
            color={filter === 'incomplete' ? '$background' : '$color'}
          >
            未完了
          </Text>
        </YStack>
      </Pressable>

      <Pressable onPress={() => onFilterChange('completed')} style={{ flex: 1 }}>
        <YStack
          padding="$2"
          backgroundColor={filter === 'completed' ? '$primary' : '$gray3'}
          borderRadius="$3"
          alignItems="center"
        >
          <Text
            fontSize="$3"
            fontWeight="600"
            color={filter === 'completed' ? '$background' : '$color'}
          >
            完了
          </Text>
        </YStack>
      </Pressable>

      <Pressable onPress={() => onFilterChange('all')} style={{ flex: 1 }}>
        <YStack
          padding="$2"
          backgroundColor={filter === 'all' ? '$primary' : '$gray3'}
          borderRadius="$3"
          alignItems="center"
        >
          <Text fontSize="$3" fontWeight="600" color={filter === 'all' ? '$background' : '$color'}>
            すべて
          </Text>
        </YStack>
      </Pressable>
    </XStack>
  );
});

FilterButtons.displayName = 'FilterButtons';
