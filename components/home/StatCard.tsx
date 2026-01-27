import React from 'react';
import { Text, XStack, YStack } from 'tamagui';

type StatCardProps = {
  label: string;
  value: number;
  unit: string;
  color: string;
};

export const StatCard = React.memo(({ label, value, unit, color }: StatCardProps) => {
  return (
    <YStack backgroundColor="$cardBg" padding="$4" borderRadius="$6" alignItems="center" gap="$1">
      <Text fontSize="$3" color="$textSecondary">
        {label}
      </Text>
      <XStack alignItems="baseline" gap="$1">
        <Text fontSize="$9" fontWeight="bold" color={color}>
          {value}
        </Text>
        <Text fontSize="$4" color="$textSecondary">
          {unit}
        </Text>
      </XStack>
    </YStack>
  );
});

StatCard.displayName = 'StatCard';
