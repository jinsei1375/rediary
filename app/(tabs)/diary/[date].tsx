import { Header } from '@/components/common/Header';
import { Loading } from '@/components/common/Loading';
import { DiaryForm } from '@/components/diary/DiaryForm';
import { useAuth } from '@/contexts/AuthContext';
import { DiaryService } from '@/services/diaryService';
import type { DiaryEntryInsert, DiaryFormData } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

export default function DiaryDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const { session } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingEntryId, setExistingEntryId] = useState<string | null>(null);

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

  // 日付が変更されたら既存データをロード
  useEffect(() => {
    const loadDiaryEntry = async () => {
      if (!session?.user?.id || !date) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await DiaryService.getByDate(session.user.id, date);

      if (error) {
        console.error('Error loading diary:', error);
      }

      if (data) {
        // 既存データがある場合
        setExistingEntryId(data.id);
        setFormData({
          title: data.title,
          content: data.content,
          content_native: data.content_native,
          entry_date: data.entry_date,
        });
      } else {
        // 新規作成の場合
        setExistingEntryId(null);
        setFormData({
          title: formatDate(date),
          content: '',
          content_native: '',
          entry_date: date,
        });
      }

      setLoading(false);
    };

    loadDiaryEntry();
  }, [date, session?.user?.id]);

  const handleSave = useCallback(async () => {
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
      if (existingEntryId) {
        // 既存データの更新
        const { error } = await DiaryService.update(existingEntryId, {
          title: formData.title.trim(),
          content: formData.content.trim(),
          content_native: formData.content_native.trim(),
        });

        if (error) throw error;
      } else {
        // 新規作成
        const diaryEntry: DiaryEntryInsert = {
          user_id: session.user.id,
          title: formData.title.trim(),
          content: formData.content.trim(),
          content_native: formData.content_native.trim(),
          entry_date: formData.entry_date,
        };

        const { data, error } = await DiaryService.create(diaryEntry);

        if (error) throw error;
        if (data) setExistingEntryId(data.id);
      }

      Alert.alert('成功', '日記を保存しました');
    } catch (error) {
      console.error('Error saving diary:', error);
      Alert.alert('エラー', '日記の保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }, [session?.user?.id, formData, existingEntryId, router]);

  const handleFormChange = useCallback((field: keyof DiaryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  if (!date) {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Header title={formatDate(date)} />
      <DiaryForm
        formData={formData}
        onFormChange={handleFormChange}
        onSave={handleSave}
        saving={saving}
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
