import type { CalendarDiaryData } from '@/types/ui';
import React from 'react';
import { Pressable } from 'react-native';
import type { DateData } from 'react-native-calendars';
import { Text, useTheme, YStack } from 'tamagui';

type DayCellProps = {
  day: DateData;
  isToday: boolean;
  diaryData: CalendarDiaryData;
  onPress: (day: DateData) => void;
};

export const DayCell = React.memo(({ day, isToday, diaryData, onPress }: DayCellProps) => {
  const theme = useTheme();
  const dateStr = day.dateString;
  const hasDiary = diaryData[dateStr];

  return (
    <Pressable onPress={() => onPress(day)} style={{ flex: 1, width: '100%', height: '100%' }}>
      <YStack
        flex={1}
        width="100%"
        height="100%"
        alignItems="flex-start"
        justifyContent="flex-start"
        backgroundColor={isToday ? theme.blue1.get() : 'transparent'}
        borderRightWidth={1}
        borderBottomWidth={1}
        borderColor="#e0e0e0"
        padding="$1"
      >
        <Text fontSize="$3" color={isToday ? theme.primary.get() : theme.color.get()}>
          {day.day}
        </Text>
        {hasDiary && (
          <YStack
            backgroundColor={theme.primary.get()}
            borderRadius="$2"
            paddingHorizontal="$1"
            paddingVertical={2}
            marginTop="$1"
            maxWidth="100%"
          >
            <Text fontSize="$1" color="$background" numberOfLines={1}>
              {diaryData[dateStr].title}
            </Text>
          </YStack>
        )}
      </YStack>
    </Pressable>
  );
});
