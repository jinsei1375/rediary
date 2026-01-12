import { getYearMonth } from '@/utils';
import React from 'react';
import { Pressable } from 'react-native';
import { Text, useTheme, XStack } from 'tamagui';

type CalendarHeaderProps = {
  date: Date;
  onPress: () => void;
};

export const CalendarHeader = ({ date, onPress }: CalendarHeaderProps) => {
  const theme = useTheme();
  const { year, month } = getYearMonth(date);

  return (
    <Pressable onPress={onPress}>
      <XStack paddingVertical="$3" justifyContent="center" alignItems="center">
        <Text fontSize="$6" fontWeight="bold" color={theme.color.get()}>
          {year}年{month}月
        </Text>
        <Text fontSize="$4" color={theme.color.get()} marginLeft="$2">
          ▼
        </Text>
      </XStack>
    </Pressable>
  );
};
