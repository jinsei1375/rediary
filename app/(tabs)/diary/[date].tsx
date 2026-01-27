import { Header } from '@/components/common/Header';
import { Loading } from '@/components/common/Loading';
import { LoadingOverlay } from '@/components/common/LoadingOverlay';
import { AiCorrectionButton } from '@/components/diary/AiCorrectionButton';
import { CorrectionConfirmModal } from '@/components/diary/CorrectionConfirmModal';
import { CorrectionResultDisplay } from '@/components/diary/CorrectionResultDisplay';
import { DiaryForm } from '@/components/diary/DiaryForm';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { AiCorrectionService } from '@/services/aiCorrectionService';
import { DiaryService } from '@/services/diaryService';
import type { AiCorrection, DiaryEntryInsert } from '@/types/database';
import type { DiaryFormData } from '@/types/ui';
import { formatDate } from '@/utils/dateUtils';
import { getLanguageName } from '@/utils/languageUtils';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { ScrollView, Separator, YStack, useTheme } from 'tamagui';

export default function DiaryDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { user } = useAuth();
  const { targetLanguage, nativeLanguage } = useSettings();
  const navigation = useNavigation();
  const theme = useTheme();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingEntryId, setExistingEntryId] = useState<string | null>(null);

  // AI添削関連の状態
  const [aiCorrecting, setAiCorrecting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [aiCorrection, setAiCorrection] = useState<AiCorrection | null>(null);

  const [formData, setFormData] = useState<DiaryFormData>({
    title: formatDate(date || ''),
    content: '',
    content_native: '',
    entry_date: date || '',
  });

  // タブバーを非表示にする
  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });

    // 画面から離れる時にタブバーを再表示
    return () => {
      navigation.setOptions({
        tabBarStyle: { paddingTop: 10, height: 40, backgroundColor: theme.background.val },
      });
    };
  }, [navigation, theme.background]);

  // 日付が変更されたら既存データをロード
  useEffect(() => {
    const loadDiaryEntry = async () => {
      if (!user?.id || !date) {
        setLoading(false);
        return;
      }

      setLoading(true);
      // 日付変更時に添削結果をクリア
      setAiCorrection(null);
      setExistingEntryId(null);

      const { data, error } = await DiaryService.getByDate(user.id, date);

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

        // AI添削も読み込む
        const { data: correctionData } = await AiCorrectionService.getByDiaryEntryId(
          data.id,
          user.id,
        );
        if (correctionData) {
          setAiCorrection(correctionData);
        }
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
  }, [date, user?.id]);

  const handleSave = useCallback(async () => {
    if (!user?.id) {
      Alert.alert('エラー', 'ログインが必要です');
      return;
    }

    if (!formData.content.trim()) {
      Alert.alert('エラー', `${getLanguageName(targetLanguage)}の内容を入力してください`);
      return;
    }

    setSaving(true);

    try {
      if (existingEntryId) {
        // 既存データの更新
        const { error } = await DiaryService.update(
          existingEntryId,
          {
            title: formData.title.trim(),
            content: formData.content.trim(),
            content_native: formData.content_native.trim(),
          },
          user.id,
        );

        if (error) throw error;
      } else {
        // 新規作成
        const diaryEntry: DiaryEntryInsert = {
          user_id: user.id,
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
  }, [user?.id, formData, existingEntryId]);

  const onFormChange = useCallback((field: keyof DiaryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // AI添削ボタンクリック
  const handleAiCorrectionClick = useCallback(() => {
    if (!formData.content.trim()) {
      Alert.alert('エラー', `${getLanguageName(targetLanguage)}の内容を入力してください`);
      return;
    }
    setShowConfirmModal(true);
  }, [formData.content, targetLanguage]);

  // AI添削実行
  const handleConfirmCorrection = useCallback(async () => {
    if (!user?.id) {
      Alert.alert('エラー', 'ログインが必要です');
      return;
    }

    setShowConfirmModal(false);
    setAiCorrecting(true);

    try {
      let diaryId = existingEntryId;

      // 未保存の場合は先に保存する
      if (!diaryId) {
        const diaryEntry: DiaryEntryInsert = {
          user_id: user.id,
          title: formData.title.trim(),
          content: formData.content.trim(),
          content_native: formData.content_native.trim(),
          entry_date: formData.entry_date,
        };

        const { data: savedDiary, error: saveError } = await DiaryService.create(diaryEntry);
        if (saveError || !savedDiary) {
          throw new Error('日記の保存に失敗しました');
        }

        diaryId = savedDiary.id;
        setExistingEntryId(diaryId);
      }

      // AI添削を実行
      const { data, error } = await AiCorrectionService.correctAndSave(
        user.id,
        diaryId as string,
        formData.content_native.trim(),
        formData.content.trim(),
        nativeLanguage, // ネイティブ言語（設定から）
        targetLanguage, // ターゲット言語（設定から）
      );

      if (error) throw error;
      if (data) {
        setAiCorrection(data);
        Alert.alert('成功', 'AI添削が完了しました');
      }
    } catch (error) {
      console.error('AI correction error:', error);
      Alert.alert('エラー', 'AI添削に失敗しました。もう一度お試しください。');
    } finally {
      setAiCorrecting(false);
    }
  }, [user?.id, existingEntryId, formData, nativeLanguage, targetLanguage]);

  if (!date) {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <YStack flex={1} backgroundColor="$bgPrimary">
      <Header title={formatDate(date)} onBack={() => router.push('/(tabs)/calendar')} />

      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        {/* 日記フォーム */}
        <DiaryForm
          formData={formData}
          onFormChange={onFormChange}
          onSave={handleSave}
          saving={saving}
        />

        {/* AI添削結果表示 */}
        {aiCorrection && (
          <YStack paddingHorizontal="$4" paddingBottom="$4">
            <Separator marginBottom="$4" />
            <CorrectionResultDisplay correction={aiCorrection} />
          </YStack>
        )}
      </ScrollView>

      {/* AI添削ボタン（下部固定） */}
      {!loading && existingEntryId && !aiCorrection && (
        <YStack
          backgroundColor="$background"
          paddingHorizontal="$4"
          paddingVertical="$3"
          borderTopWidth={1}
          borderTopColor="$borderColor"
        >
          <AiCorrectionButton
            onPress={handleAiCorrectionClick}
            disabled={!formData.content.trim()}
            loading={aiCorrecting}
          />
        </YStack>
      )}

      {/* 確認モーダル */}
      <CorrectionConfirmModal
        open={showConfirmModal}
        onConfirm={handleConfirmCorrection}
        onCancel={() => setShowConfirmModal(false)}
        nativeContent={formData.content_native}
        userContent={formData.content}
        hasNativeContent={!!formData.content_native.trim()}
      />

      <LoadingOverlay
        visible={aiCorrecting || saving}
        title={aiCorrecting ? 'AI添削中...' : '保存中...'}
        message={aiCorrecting ? 'しばらくお待ちください' : undefined}
      />
    </YStack>
  );
}
