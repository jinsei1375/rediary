import { MonthYearPicker } from '@/components/calendar/MonthYearPicker';
import { SwipeableCalendar } from '@/components/calendar/SwipeableCalendar';
import { WeekCalendar } from '@/components/calendar/WeekCalendar';
import { Header } from '@/components/common/Header';
import { Loading } from '@/components/common/Loading';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { DiaryService } from '@/services/diaryService';
import type { CalendarDiaryData } from '@/types/ui';
import { getTodayString } from '@/utils/dateUtils';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import type { DateData } from 'react-native-calendars';
import { YStack } from 'tamagui';

export default function CalendarScreen() {
  const [diaryData, setDiaryData] = useState<CalendarDiaryData>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const router = useRouter();
  const { user } = useAuth();
  const { weekStart, viewMode, loading: settingsLoading } = useSettings();

  const today = getTodayString();

  const loadDiaryDates = useCallback(async () => {
    if (!user?.id) return;

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;

    const { data, error } = await DiaryService.getTitlesForMonth(user.id, year, month);
    if (error || !data) return;

    const diaryMap: CalendarDiaryData = {};
    data.forEach((entry: any) => {
      diaryMap[entry.entry_date] = {
        title: entry.title,
        hasAiCorrection: entry.ai_corrections && entry.ai_corrections.length > 0,
      };
    });
    setDiaryData(diaryMap);
  }, [user?.id, currentMonth]);

  useFocusEffect(
    useCallback(() => {
      loadDiaryDates();
    }, [loadDiaryDates]),
  );

  const handleDayPress = (day: DateData) => {
    router.push({
      pathname: '/diary/[date]',
      params: { date: day.dateString },
    } as any);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
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

  // 設定の読み込み中はローディング画面を表示
  if (settingsLoading) {
    return <Loading />;
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <Header title="カレンダー" showBackButton={false} />
      {viewMode === 'week' ? (
        <WeekCalendar
          currentMonth={currentMonth}
          diaryData={diaryData}
          today={today}
          weekStart={weekStart}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          onMonthYearPress={handleMonthYearPress}
        />
      ) : (
        <SwipeableCalendar
          currentMonth={currentMonth}
          diaryData={diaryData}
          today={today}
          weekStart={weekStart}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          onMonthYearPress={handleMonthYearPress}
        />
      )}

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
