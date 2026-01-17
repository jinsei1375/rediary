import type { CalendarDiaryData } from '@/types/ui';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import type { DateData } from 'react-native-calendars';
import { Calendar } from 'react-native-calendars';
import { useTheme } from 'tamagui';
import { CalendarHeader } from './CalendarHeader';
import { DayCell } from './DayCell';

type SwipeableCalendarProps = {
  currentMonth: Date;
  diaryData: CalendarDiaryData;
  today: string;
  onDayPress: (day: DateData) => void;
  onMonthChange: (date: Date) => void;
  onMonthYearPress: () => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const SwipeableCalendar = memo(
  ({
    currentMonth,
    diaryData,
    today,
    onDayPress,
    onMonthChange,
    onMonthYearPress,
  }: SwipeableCalendarProps) => {
    const theme = useTheme();
    const scrollViewRef = useRef<ScrollView>(null);
    const currentPageRef = useRef(1);

    const getMarkedDates = useCallback(() => {
      const marked: any = {};

      Object.keys(diaryData).forEach((date) => {
        marked[date] = {
          marked: true,
          dotColor: theme.primary.get(),
        };
      });

      if (!marked[today]) {
        marked[today] = {};
      }
      marked[today] = {
        ...marked[today],
        selected: true,
        selectedColor: theme.blue1.get(),
        selectedTextColor: theme.primary.get(),
      };

      return marked;
    }, [diaryData, today, theme]);

    const renderDay = useCallback(
      (day: DateData): React.JSX.Element => {
        const isToday = day.dateString === today;
        return <DayCell day={day} isToday={isToday} diaryData={diaryData} onPress={onDayPress} />;
      },
      [today, diaryData, onDayPress]
    );

    const getPreviousMonth = (date: Date) => {
      const prevMonth = new Date(date);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      return prevMonth;
    };

    const getNextMonth = (date: Date) => {
      const nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    };

    const formatMonthString = (date: Date) => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    };

    const handleScroll = (event: any) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const page = Math.round(offsetX / SCREEN_WIDTH);

      if (page !== currentPageRef.current) {
        currentPageRef.current = page;
        if (page === 0) {
          onMonthChange(getPreviousMonth(currentMonth));
          // 中央にリセットして無限スクロールを実現
          setTimeout(() => {
            scrollViewRef.current?.scrollTo({ x: SCREEN_WIDTH, animated: false });
            currentPageRef.current = 1;
          }, 50);
        } else if (page === 2) {
          onMonthChange(getNextMonth(currentMonth));
          // 中央にリセットして無限スクロールを実現
          setTimeout(() => {
            scrollViewRef.current?.scrollTo({ x: SCREEN_WIDTH, animated: false });
            currentPageRef.current = 1;
          }, 50);
        }
      }
    };

    // currentMonthが外部から変更された時（年月選択など）にスクロール位置をリセット
    useEffect(() => {
      scrollViewRef.current?.scrollTo({ x: SCREEN_WIDTH, animated: false });
      currentPageRef.current = 1;
    }, [currentMonth]);

    const calendarTheme = {
      'stylesheet.calendar.main': {
        monthView: {
          flex: 1,
          height: '100%',
          justifyContent: 'space-around',
        },
        week: {
          flex: 1,
          marginVertical: 0,
          flexDirection: 'row',
          justifyContent: 'flex-start',
        },
      },
      'stylesheet.day.basic': {
        base: {
          width: '100%',
          height: '100%',
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          padding: 0,
          margin: 0,
        },
        selected: {
          backgroundColor: theme.blue1.get(),
        },
        container: {
          flex: 1,
          padding: 0,
          margin: 0,
        },
        text: {
          marginTop: 0,
          marginLeft: 0,
        },
      },
      todayTextColor: theme.primary.get(),
      arrowColor: theme.color.get(),
      monthTextColor: theme.color.get(),
      textMonthFontWeight: 'bold',
      calendarBackground: theme.background.get(),
    } as any;

    const previousMonth = getPreviousMonth(currentMonth);
    const nextMonth = getNextMonth(currentMonth);

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
        <View style={{ width: SCREEN_WIDTH, height: '100%' }}>
          <Calendar
            key={previousMonth.toISOString()}
            current={formatMonthString(previousMonth)}
            style={{ height: '100%' }}
            enableSwipeMonths={false}
            dayComponent={({ date }) => date && renderDay(date)}
            renderHeader={(date) => <CalendarHeader date={date} onPress={onMonthYearPress} />}
            markedDates={getMarkedDates()}
            theme={calendarTheme}
          />
        </View>

        <View style={{ width: SCREEN_WIDTH, height: '100%' }}>
          <Calendar
            key={currentMonth.toISOString()}
            current={formatMonthString(currentMonth)}
            style={{ height: '100%' }}
            enableSwipeMonths={false}
            dayComponent={({ date }) => date && renderDay(date)}
            renderHeader={(date) => <CalendarHeader date={date} onPress={onMonthYearPress} />}
            markedDates={getMarkedDates()}
            theme={calendarTheme}
          />
        </View>

        <View style={{ width: SCREEN_WIDTH, height: '100%' }}>
          <Calendar
            key={nextMonth.toISOString()}
            current={formatMonthString(nextMonth)}
            style={{ height: '100%' }}
            enableSwipeMonths={false}
            dayComponent={({ date }) => date && renderDay(date)}
            renderHeader={(date) => <CalendarHeader date={date} onPress={onMonthYearPress} />}
            markedDates={getMarkedDates()}
            theme={calendarTheme}
          />
        </View>
      </ScrollView>
    );
  }
);

SwipeableCalendar.displayName = 'SwipeableCalendar';
