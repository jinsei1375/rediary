import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function DiaryDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dateString.replace(/-/g, '/');
  };

  if (!date) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="今日の日記を書く..."
        multiline
        textAlignVertical="top"
      />

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>保存</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
