import { useAuth } from '@/contexts/AuthContext';
import { DiaryService } from '@/services/diaryService';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Calendar, DateData } from 'react-native-calendars';
import { useTheme, YStack } from 'tamagui';

export default function HomeScreen() {
  const [diaryDates, setDiaryDates] = useState<Set<string>>(new Set());
  const router = useRouter();
  const { session } = useAuth();
  const theme = useTheme();

  const today = new Date().toISOString().split('T')[0];

  const loadDiaryDates = useCallback(async () => {
    if (!session?.user?.id) return;

    const { data, error } = await DiaryService.getByUser(session.user.id);
    if (error || !data) return;

    const dates = new Set(data.map((entry) => entry.entry_date));
    setDiaryDates(dates);
  }, [session?.user?.id]);

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

  const getMarkedDates = () => {
    const marked: any = {};

    // 日記がある日付
    diaryDates.forEach((date) => {
      marked[date] = {
        marked: true,
        dotColor: theme.primary.get(),
      };
    });

    // 今日の日付
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

  return (
    <YStack flex={1} backgroundColor="$background">
      <Calendar
        onDayPress={handleDayPress}
        markedDates={getMarkedDates()}
        theme={{
          todayTextColor: theme.primary.get(),
          arrowColor: theme.color.get(),
          monthTextColor: theme.color.get(),
          textMonthFontWeight: 'bold',
          calendarBackground: theme.background.get(),
        }}
      />
    </YStack>
  );
}
