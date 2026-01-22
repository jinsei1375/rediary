import { getYearMonth } from '@/utils/dateUtils';
import React from 'react';
import { Button, Text, XStack } from 'tamagui';

type CalendarHeaderProps = {
  date: Date;
  onPress: () => void;
};

export const CalendarHeader = ({ date, onPress }: CalendarHeaderProps) => {
  const { year, month } = getYearMonth(date);

  return (
    <Button unstyled onPress={onPress} paddingVertical="$3" pressStyle={{ opacity: 0.7 }}>
      <XStack justifyContent="center" alignItems="center">
        <Text fontSize="$6" fontWeight="bold" color="$color">
          {year}年{month}月
        </Text>
        <Text fontSize="$4" color="$color" marginLeft="$2">
          ▼
        </Text>
      </XStack>
    </Button>
  );
};
