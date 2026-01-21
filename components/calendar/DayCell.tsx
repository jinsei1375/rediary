import type { CalendarDiaryData } from '@/types/ui';
import React from 'react';
import { Pressable } from 'react-native';
import type { DateData } from 'react-native-calendars';
import { Text, useTheme, XStack, YStack } from 'tamagui';

type DayCellProps = {
  day: DateData;
  isToday: boolean;
  diaryData: CalendarDiaryData;
  weekStart: 'sun' | 'mon';
  onPress: (day: DateData) => void;
  isWeekView?: boolean;
};

const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const DayCell = React.memo(
  ({ day, isToday, diaryData, weekStart, onPress, isWeekView = false }: DayCellProps) => {
    const theme = useTheme();
    const dateStr = day.dateString;
    const hasDiary = diaryData[dateStr];

    // 週の最後の日を判定
    const dayOfWeek = new Date(day.year, day.month - 1, day.day).getDay();
    // weekStart が 'sun' の場合: 土曜日(6)が週の最後
    // weekStart が 'mon' の場合: 日曜日(0)が週の最後
    const isWeekEnd = weekStart === 'sun' ? dayOfWeek === 6 : dayOfWeek === 0;
    const dayName = DAY_NAMES_EN[dayOfWeek];

    // 週表示の場合
    if (isWeekView) {
      return (
        <Pressable onPress={() => onPress(day)} style={{ flex: 1, width: '100%', height: '100%' }}>
          <XStack
            flex={1}
            width="100%"
            height="100%"
            alignItems="center"
            justifyContent="flex-start"
            backgroundColor={isToday ? theme.blue1.get() : 'transparent'}
            borderRightWidth={isWeekEnd ? 0 : 1}
            borderBottomWidth={1}
            borderColor="$borderColor"
            padding="$2"
            gap="$3"
          >
            {/* 日付と曜日 */}
            <YStack alignItems="center" minWidth={60}>
              <Text fontSize="$7" fontWeight="bold" color={isToday ? '$primary' : '$color'}>
                {day.day}
              </Text>
              <Text fontSize="$3" color="$gray10">
                {dayName}
              </Text>
            </YStack>

            {/* タイトル（横並び） */}
            {hasDiary && (
              <XStack
                flex={1}
                backgroundColor="$primary"
                borderRadius="$2"
                paddingHorizontal="$3"
                paddingVertical="$2"
                alignItems="center"
              >
                <Text fontSize="$4" color="$background" numberOfLines={1}>
                  {diaryData[dateStr].title}
                </Text>
              </XStack>
            )}
          </XStack>
        </Pressable>
      );
    }

    // 月表示の場合（元のレイアウト）
    return (
      <Pressable onPress={() => onPress(day)} style={{ flex: 1, width: '100%', height: '100%' }}>
        <YStack
          flex={1}
          width="100%"
          height="100%"
          alignItems="flex-start"
          justifyContent="flex-start"
          backgroundColor={isToday ? theme.blue1.get() : 'transparent'}
          borderRightWidth={isWeekEnd ? 0 : 1}
          borderBottomWidth={1}
          borderColor="$borderColor"
          padding="$1"
        >
          <Text fontSize="$3" color={isToday ? '$primary' : '$color'}>
            {day.day}
          </Text>
          {hasDiary && (
            <YStack
              backgroundColor="$primary"
              borderRadius="$2"
              paddingHorizontal="$1"
              paddingVertical={2}
              marginTop="$1"
              maxWidth="100%"
            >
              <Text fontSize="$1" color="$background" numberOfLines={2}>
                {diaryData[dateStr].title}
              </Text>
            </YStack>
          )}
        </YStack>
      </Pressable>
    );
  },
);

DayCell.displayName = 'DayCell';
