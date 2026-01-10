import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function DiaryScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const router = useRouter();

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    console.log('Date pressed:', day.dateString);
    router.push({
      pathname: '/(tabs)/diary/[date]',
      params: { date: day.dateString },
    } as any);
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#007AFF',
          },
        }}
        theme={{
          todayTextColor: '#007AFF',
          arrowColor: '#000',
          monthTextColor: '#000',
          textMonthFontWeight: 'bold',
          calendarBackground: '#fff',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
