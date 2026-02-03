import { Dialog } from '@/components/common/Dialog';
import { Header } from '@/components/common/Header';
import { Loading } from '@/components/common/Loading';
import { LoadingOverlay } from '@/components/common/LoadingOverlay';
import { AiButton, ModalButton, PrimaryButton } from '@/components/common/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { AiAnalysisService } from '@/services/aiAnalysisService';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { AiAnalysisType, type AiAnalysis } from '@/types/database';
import { getLanguageName } from '@/utils/languageUtils';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { Card, H3, H4, ListItem, Paragraph, Text, XStack, YStack, useTheme } from 'tamagui';

export default function AiAnalysisScreen() {
  const { user } = useAuth();
  const { targetLanguage, nativeLanguage } = useSettings();
  const isPremium = useSubscriptionStore((state) => state.isPremium());
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyses, setAnalyses] = useState<AiAnalysis[]>([]);
  const [canAnalyzeWeekly, setCanAnalyzeWeekly] = useState(false);
  const [canAnalyzeMonthly, setCanAnalyzeMonthly] = useState(false);
  const [nextWeeklyDate, setNextWeeklyDate] = useState<Date | null>(null);
  const [nextMonthlyDate, setNextMonthlyDate] = useState<Date | null>(null);
  const [shouldReload, setShouldReload] = useState(false);

  // 確認ダイアログ用の状態
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<AiAnalysisType>(
    AiAnalysisType.MONTHLY,
  );
  const [analysisStats, setAnalysisStats] = useState({ diaryCount: 0, correctionCount: 0 });

  const loadAnalysisData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const [{ data: allAnalyses }, canCreateWeekly, canCreateMonthly, nextWeekly, nextMonthly] =
        await Promise.all([
          AiAnalysisService.getAllAnalyses(user.id),
          AiAnalysisService.canCreateNewAnalysis(user.id, AiAnalysisType.WEEKLY),
          AiAnalysisService.canCreateNewAnalysis(user.id, AiAnalysisType.MONTHLY),
          AiAnalysisService.getNextAnalysisDate(user.id, AiAnalysisType.WEEKLY),
          AiAnalysisService.getNextAnalysisDate(user.id, AiAnalysisType.MONTHLY),
        ]);

      setAnalyses(allAnalyses);
      setCanAnalyzeWeekly(canCreateWeekly);
      setCanAnalyzeMonthly(canCreateMonthly);
      setNextWeeklyDate(nextWeekly);
      setNextMonthlyDate(nextMonthly);
    } catch (error) {
      // エラーは画面に表示されるため、ログ不要
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // 初回または分析実行後の戻り時のみデータを再読み込み
  useFocusEffect(
    useCallback(() => {
      if (shouldReload || analyses.length === 0) {
        loadAnalysisData();
        setShouldReload(false);
      }
    }, [loadAnalysisData, shouldReload, analyses.length]),
  );

  const handleAnalyzePress = async (analysisType: AiAnalysisType) => {
    if (!user?.id) return;

    // 統計情報を取得して確認ダイアログを表示
    const stats = await AiAnalysisService.getAnalysisStats(user.id, analysisType);
    setAnalysisStats(stats);
    setSelectedAnalysisType(analysisType);

    const minDays = analysisType === AiAnalysisType.WEEKLY ? 3 : 5;
    if (stats.diaryCount < minDays) {
      Alert.alert('データ不足', `分析には最低${minDays}日分の日記が必要です。`);
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmAnalysis = async () => {
    if (!user?.id) return;

    setShowConfirmDialog(false);
    setAnalyzing(true);

    try {
      const { data, error } = await AiAnalysisService.analyzeProgress(
        user.id,
        getLanguageName(targetLanguage),
        getLanguageName(nativeLanguage),
        selectedAnalysisType,
      );

      if (error) {
        throw error;
      }

      showSuccessToast('分析が完了しました');

      // 分析詳細ページに遷移（戻ってきた時に再読み込みするフラグを立てる）
      if (data?.id) {
        setShouldReload(true);
        router.push(`/(tabs)/analysis/${data.id}`);
      } else {
        await loadAnalysisData();
      }
    } catch (error: any) {
      const errorMessage = error?.message || '分析に失敗しました';
      showErrorToast(`分析に失敗しました: ${errorMessage}`);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  // 無料プランの場合
  if (!isPremium) {
    return (
      <YStack f={1} bg="$background">
        <Header title="AI学習分析" />
        <ScrollView>
          <YStack f={1} p="$4" gap="$4">
            <Card p="$4" bg="$blue2" borderWidth={1} borderColor="$blue8">
              <YStack gap="$3">
                <H3 color="$blue11">有料プラン限定機能</H3>
                <Paragraph color="$blue11">AI学習分析はProプラン以上の機能です。</Paragraph>
                <Paragraph color="$blue11">
                  1ヶ月分の日記と添削結果を分析し、あなたの学習傾向や改善ポイントを提供します。
                </Paragraph>
                <PrimaryButton onPress={() => router.push('/profile/subscription')} mt="$2">
                  プランを見る
                </PrimaryButton>
              </YStack>
            </Card>
          </YStack>
        </ScrollView>
      </YStack>
    );
  }

  return (
    <YStack f={1} bg="$background">
      <Header title="AI学習分析" showBackButton={false} />
      <ScrollView>
        <YStack f={1} p="$4" gap="$4">
          {/* 説明カード */}
          <Card p="$4" bg="$blue2" borderWidth={1} borderColor="$blue8" elevation={2}>
            <YStack gap="$3">
              <H3 color="$blue11">AI学習分析とは？</H3>
              <Paragraph color="$blue11" fontSize="$3" lineHeight="$1">
                日記とAI添削結果を分析し、以下の情報を提供します：
              </Paragraph>
              <YStack gap="$2">
                <XStack ai="center" gap="$2">
                  <YStack w={4} h={4} bg="$blue9" borderRadius="$10" />
                  <Text color="$blue11" fontSize="$3">
                    よく使う表現・単語の傾向
                  </Text>
                </XStack>
                <XStack ai="center" gap="$2">
                  <YStack w={4} h={4} bg="$blue9" borderRadius="$10" />
                  <Text color="$blue11" fontSize="$3">
                    よく指摘される文法ミス
                  </Text>
                </XStack>
                <XStack ai="center" gap="$2">
                  <YStack w={4} h={4} bg="$blue9" borderRadius="$10" />
                  <Text color="$blue11" fontSize="$3">
                    期間内の成長サマリー
                  </Text>
                </XStack>
              </YStack>
              <Paragraph color="$blue11" fontSize="$2" mt="$2">
                ※ 週間分析は週1回、月間分析は月1回まで実行できます
              </Paragraph>
            </YStack>
          </Card>

          {/* 分析実行ボタン */}
          <YStack gap="$3">
            {/* 週間分析 */}
            <Card p="$4" bg="$background" borderWidth={1} borderColor="$borderColor" elevation={2}>
              <YStack gap="$3">
                <H4>週間分析を実行</H4>
                <Paragraph fontSize="$3" color="$gray11" lineHeight="$1">
                  直近7日分のデータを分析（週1回まで）
                </Paragraph>

                {!canAnalyzeWeekly && nextWeeklyDate && (
                  <YStack px="$3" py="$2" bg="$gray3" borderRadius="$2" alignSelf="flex-start">
                    <Text color="$gray11" fontSize="$2" fontWeight="500">
                      次回実行可能日: {nextWeeklyDate.toLocaleDateString('ja-JP')}
                    </Text>
                  </YStack>
                )}

                <AiButton
                  onPress={() => handleAnalyzePress(AiAnalysisType.WEEKLY)}
                  disabled={!canAnalyzeWeekly || analyzing}
                  opacity={!canAnalyzeWeekly || analyzing ? 0.5 : 1}
                  color="$background"
                >
                  {analyzing ? '分析中...' : '週間分析を開始する'}
                </AiButton>
              </YStack>
            </Card>

            {/* 月間分析 */}
            <Card p="$4" bg="$background" borderWidth={1} borderColor="$borderColor" elevation={2}>
              <YStack gap="$3">
                <H4>月間分析を実行</H4>
                <Paragraph fontSize="$3" color="$gray11" lineHeight="$1">
                  直近30日分のデータを分析（月1回まで）
                </Paragraph>

                {!canAnalyzeMonthly && nextMonthlyDate && (
                  <YStack px="$3" py="$2" bg="$gray3" borderRadius="$2" alignSelf="flex-start">
                    <Text color="$gray11" fontSize="$2" fontWeight="500">
                      次回実行可能日: {nextMonthlyDate.toLocaleDateString('ja-JP')}
                    </Text>
                  </YStack>
                )}

                <AiButton
                  onPress={() => handleAnalyzePress(AiAnalysisType.MONTHLY)}
                  disabled={!canAnalyzeMonthly || analyzing}
                  opacity={!canAnalyzeMonthly || analyzing ? 0.5 : 1}
                  color="$background"
                >
                  {analyzing ? '分析中...' : '月間分析を開始する'}
                </AiButton>
              </YStack>
            </Card>
          </YStack>

          {/* 分析履歴一覧 */}
          {analyses.length > 0 && (
            <YStack gap="$3">
              <H4>分析履歴</H4>
              <YStack gap="$2">
                {analyses.map((analysis) => {
                  const getPeriodText = (
                    createdAt: string,
                    analysisType: AiAnalysisType,
                  ): string => {
                    const endDate = new Date(createdAt);
                    const startDate = new Date(endDate);

                    if (analysisType === AiAnalysisType.WEEKLY) {
                      startDate.setDate(startDate.getDate() - 6);
                    } else {
                      startDate.setDate(startDate.getDate() - 29);
                    }

                    return `${startDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })} 〜 ${endDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}`;
                  };

                  const getAnalysisTypeLabel = (type: AiAnalysisType): string => {
                    return type === AiAnalysisType.WEEKLY ? '週間' : '月間';
                  };

                  const isWeekly = analysis.analysis_type === AiAnalysisType.WEEKLY;

                  return (
                    <ListItem
                      key={analysis.id}
                      title={new Date(analysis.created_at).toLocaleDateString('ja-JP')}
                      subTitle={`対象期間: ${getPeriodText(analysis.created_at, analysis.analysis_type)}`}
                      backgroundColor="$cardBg"
                      borderRadius="$4"
                      borderWidth={1}
                      borderColor="$borderColor"
                      onPress={() => router.push(`/(tabs)/analysis/${analysis.id}`)}
                      iconAfter={
                        <YStack
                          px="$2"
                          py="$1"
                          bg={isWeekly ? '$orange2' : '$blue2'}
                          borderRadius="$2"
                          borderWidth={1}
                          borderColor={isWeekly ? '$orange8' : '$blue8'}
                        >
                          <Text
                            color={isWeekly ? '$orange11' : '$blue11'}
                            fontSize="$2"
                            fontWeight="500"
                          >
                            {getAnalysisTypeLabel(analysis.analysis_type)}
                          </Text>
                        </YStack>
                      }
                    />
                  );
                })}
              </YStack>
            </YStack>
          )}
        </YStack>
      </ScrollView>

      {/* 確認ダイアログ */}
      <Dialog
        visible={showConfirmDialog}
        title={`${selectedAnalysisType === AiAnalysisType.WEEKLY ? '週間' : '月間'}分析を実行しますか？`}
        onClose={() => setShowConfirmDialog(false)}
        height="auto"
      >
        <YStack gap="$2">
          <Paragraph fontSize="$3">
            直近{selectedAnalysisType === AiAnalysisType.WEEKLY ? '7' : '30'}
            日間のデータを分析します
          </Paragraph>

          <YStack gap="$2" p="$3" bg="$gray2" borderRadius="$4">
            <XStack jc="space-between">
              <Text fontSize="$3">日記投稿数:</Text>
              <Text fontWeight="bold" fontSize="$3">
                {analysisStats.diaryCount}件
              </Text>
            </XStack>
            <XStack jc="space-between">
              <Text fontSize="$3">AI添削回数:</Text>
              <Text fontWeight="bold" fontSize="$3">
                {analysisStats.correctionCount}件
              </Text>
            </XStack>
          </YStack>

          <Paragraph fontSize="$2" color="$orange10">
            ※ {selectedAnalysisType === AiAnalysisType.WEEKLY ? '週間' : '月間'}
            分析は{selectedAnalysisType === AiAnalysisType.WEEKLY ? '週' : '月'}
            に1回のみ実行できます
          </Paragraph>

          <XStack gap="$3" jc="flex-end" mt="$2">
            <ModalButton
              variant="secondary"
              onPress={() => setShowConfirmDialog(false)}
              borderRadius="$3"
            >
              キャンセル
            </ModalButton>
            <ModalButton variant="primary" onPress={handleConfirmAnalysis} borderRadius="$3">
              実行
            </ModalButton>
          </XStack>
        </YStack>
      </Dialog>

      <LoadingOverlay visible={analyzing} title="AI分析中..." message="しばらくお待ちください" />
    </YStack>
  );
}
