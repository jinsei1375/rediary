import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { DayCell } from '@/components/calendar/DayCell';
import { MonthYearPicker } from '@/components/calendar/MonthYearPicker';
import { useAuth } from '@/contexts/AuthContext';
import { DiaryService } from '@/services/diaryService';
import type { CalendarDiaryData } from '@/types/ui';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import type { DateData } from 'react-native-calendars';
import { Calendar } from 'react-native-calendars';
import { useTheme, YStack } from 'tamagui';

export default function HomeScreen() {
  const [diaryData, setDiaryData] = useState<CalendarDiaryData>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const router = useRouter();
  const { session } = useAuth();
  const theme = useTheme();

  const today = new Date().toISOString().split('T')[0];

  const loadDiaryDates = useCallback(async () => {
    if (!session?.user?.id) return;

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;

    const { data, error } = await DiaryService.getTitlesForMonth(session.user.id, year, month);
    if (error || !data) return;

    const diaryMap: CalendarDiaryData = {};
    data.forEach((entry) => {
      diaryMap[entry.entry_date] = {
        title: entry.title,
      };
    });
    setDiaryData(diaryMap);
  }, [session?.user?.id, currentMonth]);

  useFocusEffect(
    useCallback(() => {
      loadDiaryDates();
    }, [loadDiaryDates])
  );

  const handleDayPress = (day: DateData) => {
    router.push({
      pathname: '/(tabs)/diary/[date]',
      params: { date: day.dateString },
    } as any);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  const getMarkedDates = () => {
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
  };

  const renderDay = (day: DateData): React.JSX.Element => {
    const isToday = day.dateString === today;
    return <DayCell day={day} isToday={isToday} diaryData={diaryData} onPress={handleDayPress} />;
  };

  const handleMonthYearPress = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    setSelectedYear(year);
    setSelectedMonth(month);
    setShowMonthPicker(true);
  };

  const handleMonthYearConfirm = () => {
    setCurrentMonth(new Date(selectedYear, selectedMonth - 1, 1));
    setShowMonthPicker(false);
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <Calendar
        key={currentMonth.toISOString()}
        current={`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(
          2,
          '0'
        )}-01`}
        style={{
          height: '100%',
        }}
        enableSwipeMonths={true}
        dayComponent={({ date }) => date && renderDay(date)}
        renderHeader={(date) => <CalendarHeader date={date} onPress={handleMonthYearPress} />}
        onMonthChange={(date) => handleMonthChange(new Date(date.dateString))}
        markedDates={getMarkedDates()}
        theme={
          {
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
          } as any
        }
      />

      <MonthYearPicker
        visible={showMonthPicker}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
        onConfirm={handleMonthYearConfirm}
        onCancel={() => setShowMonthPicker(false)}
      />
    </YStack>
  );
}
