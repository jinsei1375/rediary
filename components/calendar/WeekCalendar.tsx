import type { CalendarDiaryData } from '@/types/ui';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import type { DateData } from 'react-native-calendars';
import { Text, useTheme, YStack } from 'tamagui';
import { DayCell } from './DayCell';

type WeekCalendarProps = {
  currentMonth: Date;
  diaryData: CalendarDiaryData;
  today: string;
  weekStart: 'sun' | 'mon';
  onDayPress: (day: DateData) => void;
  onMonthChange: (date: Date) => void;
  onMonthYearPress: () => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 週の開始日を取得
const getWeekStart = (date: Date, weekStart: 'sun' | 'mon'): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = weekStart === 'sun' ? day : day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

// 週の7日間を取得
const getWeekDays = (weekStartDate: Date): DateData[] => {
  const days: DateData[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + i);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    days.push({
      year,
      month,
      day,
      dateString,
      timestamp: date.getTime(),
    });
  }
  return days;
};

export const WeekCalendar = memo(
  ({
    currentMonth,
    diaryData,
    today,
    weekStart,
    onDayPress,
    onMonthChange,
    onMonthYearPress,
  }: WeekCalendarProps) => {
    const theme = useTheme();
    const scrollViewRef = useRef<ScrollView>(null);
    const currentPageRef = useRef(1);

    const [currentWeekStart, setCurrentWeekStart] = useState(() =>
      getWeekStart(currentMonth, weekStart),
    );

    useEffect(() => {
      setCurrentWeekStart(getWeekStart(currentMonth, weekStart));
    }, [currentMonth, weekStart]);

    const getPreviousWeek = (date: Date): Date => {
      const d = new Date(date);
      d.setDate(d.getDate() - 7);
      return d;
    };

    const getNextWeek = (date: Date): Date => {
      const d = new Date(date);
      d.setDate(d.getDate() + 7);
      return d;
    };

    const handleScroll = (event: any) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const page = Math.round(offsetX / SCREEN_WIDTH);

      if (page !== currentPageRef.current) {
        currentPageRef.current = page;
        if (page === 0) {
          const newWeekStart = getPreviousWeek(currentWeekStart);
          setCurrentWeekStart(newWeekStart);
          onMonthChange(newWeekStart);
          setTimeout(() => {
            scrollViewRef.current?.scrollTo({ x: SCREEN_WIDTH, animated: false });
            currentPageRef.current = 1;
          }, 50);
        } else if (page === 2) {
          const newWeekStart = getNextWeek(currentWeekStart);
          setCurrentWeekStart(newWeekStart);
          onMonthChange(newWeekStart);
          setTimeout(() => {
            scrollViewRef.current?.scrollTo({ x: SCREEN_WIDTH, animated: false });
            currentPageRef.current = 1;
          }, 50);
        }
      }
    };

    useEffect(() => {
      scrollViewRef.current?.scrollTo({ x: SCREEN_WIDTH, animated: false });
      currentPageRef.current = 1;
    }, [currentWeekStart]);

    const renderWeek = useCallback(
      (weekStartDate: Date) => {
        const days = getWeekDays(weekStartDate);
        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekEndDate.getDate() + 6);

        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}/${month}/${day}`;
        };

        return (
          <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
            {/* ヘッダー */}
            <YStack padding="$3" borderBottomWidth={1} borderColor="$borderColor">
              <Text fontSize="$6" fontWeight="bold" textAlign="center" onPress={onMonthYearPress}>
                {formatDate(weekStartDate)} - {formatDate(weekEndDate)}
              </Text>
            </YStack>

            {/* 日付セル */}
            <YStack flex={1}>
              {days.map((day) => {
                const isToday = day.dateString === today;
                return (
                  <View key={day.dateString} style={{ flex: 1 }}>
                    <DayCell
                      day={day}
                      isToday={isToday}
                      diaryData={diaryData}
                      weekStart={weekStart}
                      onPress={onDayPress}
                      isWeekView={true}
                    />
                  </View>
                );
              })}
            </YStack>
          </View>
        );
      },
      [today, diaryData, weekStart, onDayPress, onMonthYearPress],
    );

    const previousWeek = getPreviousWeek(currentWeekStart);
    const nextWeek = getNextWeek(currentWeekStart);

    return (
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScroll}
        contentOffset={{ x: SCREEN_WIDTH, y: 0 }}
        style={{ flex: 1 }}
      >
        {renderWeek(previousWeek)}
        {renderWeek(currentWeekStart)}
        {renderWeek(nextWeek)}
      </ScrollView>
    );
  },
);

WeekCalendar.displayName = 'WeekCalendar';
