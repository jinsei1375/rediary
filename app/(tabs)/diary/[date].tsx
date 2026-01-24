import { Header } from '@/components/common/Header';
import { Loading } from '@/components/common/Loading';
import { CorrectionConfirmModal } from '@/components/diary/CorrectionConfirmModal';
import { CorrectionResultDisplay } from '@/components/diary/CorrectionResultDisplay';
import { DiaryForm } from '@/components/diary/DiaryForm';
import { useAuth } from '@/contexts/AuthContext';
import { AiCorrectionService } from '@/services/aiCorrectionService';
import { DiaryService } from '@/services/diaryService';
import type { AiCorrection, DiaryEntryInsert } from '@/types/database';
import { Language } from '@/types/database';
import type { DiaryFormData } from '@/types/ui';
import { formatDate } from '@/utils/dateUtils';
import { Portal } from '@tamagui/portal';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Button, ScrollView, Separator, Spinner, Text, XStack, YStack } from 'tamagui';

export default function DiaryDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { user } = useAuth();
  const navigation = useNavigation();
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
        tabBarStyle: { paddingTop: 10, height: 40 },
      });
    };
  }, [navigation]);

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

    if (!formData.content.trim() || !formData.content_native.trim()) {
      Alert.alert('エラー', '英語と日本語の内容を両方入力してください');
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
    if (!formData.content.trim() || !formData.content_native.trim()) {
      Alert.alert('エラー', '英語と日本語の内容を両方入力してください');
      return;
    }
    setShowConfirmModal(true);
  }, [formData.content, formData.content_native]);

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
        Language.JA, // ネイティブ言語（日本語）
        Language.EN, // ターゲット言語（英語）
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
  }, [user?.id, existingEntryId, formData]);

  if (!date) {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <Header title={formatDate(date)} onBack={() => router.push('/(tabs)')} />

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {/* 日記フォーム */}
        <DiaryForm
          formData={formData}
          onFormChange={onFormChange}
          onSave={handleSave}
          saving={saving}
        />

        {/* AI添削ボタン */}
        {!loading && existingEntryId && !aiCorrection && (
          <Button
            onPress={handleAiCorrectionClick}
            disabled={!formData.content.trim() || !formData.content_native.trim() || aiCorrecting}
            height="$5"
            width="90%"
            maxWidth={400}
            marginTop="$4"
            marginBottom="$4"
            marginHorizontal="$4"
            alignSelf="center"
            backgroundColor="$purple10"
            borderRadius="$4"
            pressStyle={{
              opacity: 0.85,
            }}
            hoverStyle={{
              opacity: 0.9,
            }}
            opacity={
              !formData.content.trim() || !formData.content_native.trim() || aiCorrecting ? 0.5 : 1
            }
          >
            <XStack gap="$3" alignItems="center" justifyContent="center">
              {aiCorrecting && <Spinner color="$background" size="small" />}
              <Text color="$background" fontSize="$5" fontWeight="bold" letterSpacing={1}>
                {aiCorrecting ? 'AI添削中...' : 'AI添削'}
              </Text>
            </XStack>
          </Button>
        )}

        {/* AI添削結果表示 */}
        {aiCorrection && (
          <YStack paddingHorizontal="$4" paddingBottom="$4">
            <Separator marginBottom="$4" />
            <CorrectionResultDisplay correction={aiCorrection} />
          </YStack>
        )}
      </ScrollView>

      {/* 確認モーダル */}
      <CorrectionConfirmModal
        open={showConfirmModal}
        onConfirm={handleConfirmCorrection}
        onCancel={() => setShowConfirmModal(false)}
        nativeContent={formData.content_native}
        userContent={formData.content}
      />

      {/* AI添削中のオーバーレイ */}
      {aiCorrecting && (
        <Portal>
          <YStack
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            backgroundColor="rgba(0, 0, 0, 0.7)"
            justifyContent="center"
            alignItems="center"
            zIndex={9999}
          >
            <YStack
              backgroundColor="$background"
              padding="$6"
              marginHorizontal="$4"
              borderRadius="$4"
              alignItems="center"
              gap="$3"
            >
              <Spinner size="large" color="$primary" />
              <Text fontSize="$6" fontWeight="bold" color="$color">
                AI添削中...
              </Text>
              <Text fontSize="$3" color="$gray10">
                しばらくお待ちください
              </Text>
            </YStack>
          </YStack>
        </Portal>
      )}
    </YStack>
  );
}
