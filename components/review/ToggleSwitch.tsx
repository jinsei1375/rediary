import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Switch, Text, XStack, useTheme } from 'tamagui';

type ToggleSwitchProps = {
  checked: boolean;
  onToggle: (value: boolean) => void;
  label?: string;
  icon?: string;
};

export const ToggleSwitch = React.memo(
  ({ checked, onToggle, label = 'ランダムで選択', icon = 'shuffle' }: ToggleSwitchProps) => {
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
          <Ionicons name={icon as any} size={20} color={theme.blue10.get()} />
          <Text fontSize="$4" fontWeight="600" color="$color">
            {label}
          </Text>
        </XStack>
        <Switch
          checked={checked}
          onCheckedChange={onToggle}
          size="$2"
          backgroundColor={checked ? '$blue10' : '$gray6'}
          borderWidth={1}
        >
          <Switch.Thumb animation="quick" backgroundColor="white" />
        </Switch>
      </XStack>
    );
  },
);

ToggleSwitch.displayName = 'ToggleSwitch';
