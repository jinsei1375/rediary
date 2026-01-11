import { useAuth } from '@/contexts/AuthContext';
import { DiaryService } from '@/services/diaryService';
import type { DiaryEntryInsert, DiaryFormData } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DiaryDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const { session } = useAuth();
  const [saving, setSaving] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dateString.replace(/-/g, '/');
  };

  const [formData, setFormData] = useState<DiaryFormData>({
    title: formatDate(date || ''),
    content: '',
    content_native: '',
    entry_date: date || '',
  });

  const handleSave = async () => {
    if (!session?.user?.id) {
      Alert.alert('エラー', 'ログインが必要です');
      return;
    }

    if (!formData.content.trim() || !formData.content_native.trim()) {
      Alert.alert('エラー', '英語と日本語の内容を両方入力してください');
      return;
    }

    setSaving(true);

    try {
      const diaryEntry: DiaryEntryInsert = {
        user_id: session.user.id,
        title: formData.title.trim(),
        content: formData.content.trim(),
        content_native: formData.content_native.trim(),
        entry_date: formData.entry_date,
      };

      const { error } = await DiaryService.create(diaryEntry);

      if (error) throw error;

      Alert.alert('成功', '日記を保存しました', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error saving diary:', error);
      Alert.alert('エラー', '日記の保存に失敗しました');
    } finally {
      setSaving(false);
    }
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

      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>タイトル</Text>
            <TextInput
              style={styles.titleInput}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="YYYY/MM/DD"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>内容（英語）</Text>
            <Text style={styles.subLabel}>実際に書く英語の日記</Text>
            <TextInput
              style={styles.textArea}
              value={formData.content}
              onChangeText={(text) => setFormData({ ...formData, content: text })}
              placeholder="Today..."
              multiline
              scrollEnabled
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>内容（日本語）</Text>
            <Text style={styles.subLabel}>本来英語として書きたかった内容</Text>
            <TextInput
              style={styles.textArea}
              value={formData.content_native}
              onChangeText={(text) => setFormData({ ...formData, content_native: text })}
              placeholder="今日は..."
              multiline
              scrollEnabled
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>{saving ? '保存中...' : '保存'}</Text>
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
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  subLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 150,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
