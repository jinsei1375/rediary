import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Switch, Text, XStack, useTheme } from 'tamagui';

type RandomToggleProps = {
  isRandom: boolean;
  onToggle: (value: boolean) => void;
};

export const RandomToggle = React.memo(({ isRandom, onToggle }: RandomToggleProps) => {
  const theme = useTheme();

  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      padding="$4"
      backgroundColor="$gray3"
      borderRadius="$4"
    >
      <XStack gap="$2" alignItems="center">
        <Ionicons name="shuffle" size={20} color={theme.blue10.get()} />
        <Text fontSize="$4" fontWeight="600" color="$color">
          ランダムで選択
        </Text>
      </XStack>
      <Switch
        checked={isRandom}
        onCheckedChange={onToggle}
        size="$3"
        backgroundColor={isRandom ? '$blue10' : '$gray6'}
        borderWidth={1}
      >
        <Switch.Thumb animation="quick" backgroundColor="white" />
      </Switch>
    </XStack>
  );
});

RandomToggle.displayName = 'RandomToggle';
