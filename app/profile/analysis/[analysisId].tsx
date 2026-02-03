import { CommonMistakesCard } from '@/components/ai-analysis/CommonMistakesCard';
import { FrequentExpressionsCard } from '@/components/ai-analysis/FrequentExpressionsCard';
import { GrowthSummaryCard } from '@/components/ai-analysis/GrowthSummaryCard';
import { Header } from '@/components/common/Header';
import { Loading } from '@/components/common/Loading';
import { AiAnalysisService } from '@/services/aiAnalysisService';
import { AiAnalysis, AiAnalysisType } from '@/types/database';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Card, H3, Paragraph, Text, XStack, YStack } from 'tamagui';

export default function AiAnalysisDetailScreen() {
  const params = useLocalSearchParams<{ analysisId: string }>();
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysisDetail();
  }, [params.analysisId]);

  const loadAnalysisDetail = async () => {
    if (!params.analysisId) return;

    setLoading(true);
    try {
      const { data } = await AiAnalysisService.getAnalysisById(params.analysisId);
      setAnalysis(data);
    } catch (error) {
      console.error('Failed to load analysis detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodText = (createdAt: string, analysisType: AiAnalysisType): string => {
    const endDate = new Date(createdAt);
    const startDate = new Date(endDate);

    if (analysisType === AiAnalysisType.WEEKLY) {
      startDate.setDate(startDate.getDate() - 6);
    } else {
      startDate.setDate(startDate.getDate() - 29);
    }

    return `${startDate.toLocaleDateString('ja-JP')} 〜 ${endDate.toLocaleDateString('ja-JP')}`;
  };

  const getAnalysisTypeLabel = (type: AiAnalysisType): string => {
    return type === AiAnalysisType.WEEKLY ? '週間' : '月間';
  };

  if (loading) {
    return <Loading />;
  }

  if (!analysis) {
    return (
      <YStack f={1} bg="$background">
        <Header title="分析結果" />
        <YStack f={1} ai="center" jc="center" p="$4">
          <Paragraph>分析データが見つかりませんでした</Paragraph>
        </YStack>
      </YStack>
    );
  }

  return (
    <YStack f={1} bg="$background">
      <Header title="分析結果" />
      <ScrollView>
        <YStack f={1} p="$4" gap="$4">
          {/* 分析情報カード */}
          <Card p="$4" bg="$background" borderWidth={1} borderColor="$borderColor" elevation={2}>
            <YStack gap="$2">
              <H3>分析情報</H3>
              <YStack gap="$1">
                <XStack jc="space-between" ai="center">
                  <Text color="$gray11" fontSize="$3">
                    実行日:
                  </Text>
                  <Text fontWeight="500" fontSize="$3">
                    {new Date(analysis.created_at).toLocaleDateString('ja-JP')}
                  </Text>
                </XStack>
                <XStack jc="space-between" ai="center">
                  <Text color="$gray11" fontSize="$3">
                    対象期間:
                  </Text>
                  <Text fontWeight="500" fontSize="$3">
                    {getPeriodText(analysis.created_at, analysis.analysis_type)}
                  </Text>
                </XStack>
                <XStack jc="space-between" ai="center">
                  <Text color="$gray11" fontSize="$3">
                    分析タイプ:
                  </Text>
                  <Text fontWeight="500" fontSize="$3">
                    {getAnalysisTypeLabel(analysis.analysis_type)}
                  </Text>
                </XStack>
              </YStack>
            </YStack>
          </Card>

          {/* 分析結果 */}
          <FrequentExpressionsCard expressions={analysis.frequent_expressions} />
          <CommonMistakesCard mistakes={analysis.common_mistakes} />
          <GrowthSummaryCard summary={analysis.growth_summary} />
        </YStack>
      </ScrollView>
    </YStack>
  );
}
