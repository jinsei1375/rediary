import { PrimaryButton } from '@/components/common/PrimaryButton';
import { DailyQuestion } from '@/components/home/DailyQuestion';
import { StatCard } from '@/components/home/StatCard';
import { UncorrectedDiaryList } from '@/components/home/UncorrectedDiaryList';
import { useAuth } from '@/contexts/AuthContext';
import { DiaryService } from '@/services';
import { ExerciseAttemptService } from '@/services/exerciseAttemptService';
import { TranslationExerciseService } from '@/services/translationExerciseService';
import type { TranslationExercise } from '@/types/database';
import { getTodayString } from '@/utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, YStack, useTheme } from 'tamagui';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useTheme();
  const [diaryCount, setDiaryCount] = useState<number>(0);
  const [dailyQuestion, setDailyQuestion] = useState<TranslationExercise | null>(null);
  const [exerciseCount, setExerciseCount] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [animationReady, setAnimationReady] = useState(false);
  const [uncorrectedDiaries, setUncorrectedDiaries] = useState<any[]>([]);

  const today = getTodayString();

  useFocusEffect(
    useCallback(() => {
      let isCancelled = false;

      const loadData = async () => {
        if (!user?.id) return;

        // 全データを並列で取得
        const [diaryResult, questionResult, exerciseResult, answeredResult, uncorrectedResult] =
          await Promise.all([
            DiaryService.getTotalCount(user.id),
            TranslationExerciseService.getDailyQuestion(user.id),
            TranslationExerciseService.getTotalCount(user.id),
            ExerciseAttemptService.getAnsweredExerciseCount(user.id),
            DiaryService.getUncorrectedDiaries(user.id, 5),
          ]);

        if (isCancelled) return;

        // 日記カウント
        if (diaryResult.error) {
          console.error('Error loading diary count:', diaryResult.error);
        } else {
          setDiaryCount(diaryResult.count ?? 0);
        }

        // 今日の1問
        if (questionResult.error) {
          console.error('Error loading daily question:', questionResult.error);
        } else {
          setDailyQuestion(questionResult.data);
        }

        // 登録済みネイティブ表現数
        if (exerciseResult.error) {
          console.error('Error loading exercise count:', exerciseResult.error);
        } else {
          setExerciseCount(exerciseResult.count ?? 0);
        }

        // 回答済み問題数
        if (answeredResult.error) {
          console.error('Error loading answered count:', answeredResult.error);
        } else {
          setAnsweredCount(answeredResult.count ?? 0);
        }

        // AI添削未実施日記
        if (uncorrectedResult.error) {
          console.error('Error loading uncorrected diaries:', uncorrectedResult.error);
        } else {
          setUncorrectedDiaries(uncorrectedResult.data ?? []);
        }

        // 全データロード完了後、アニメーション開始
        setAnimationReady(true);
      };

      setAnimationReady(false);
      loadData();

      return () => {
        isCancelled = true;
      };
    }, [user?.id]),
  );

  const handleWriteDiary = () => {
    router.push({
      pathname: '/diary/[date]',
      params: { date: today },
    } as any);
  };

  const handleReview = () => {
    router.push('/review');
  };

  const handleDailyQuestion = () => {
    if (dailyQuestion) {
      router.push({
        pathname: '/review',
        params: { dailyQuestionId: dailyQuestion.id },
      } as any);
    }
  };

  return (
    <YStack flex={1} backgroundColor="$bgPrimary">
      <ScrollView
        flex={1}
        contentContainerStyle={{
          padding: 24,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <YStack gap="$3">
          <StatCard
            label="日記を書いた日数"
            value={diaryCount}
            unit="日"
            color="$accentBlue"
            animationReady={animationReady}
          />
          <StatCard
            label="登録済みネイティブ表現"
            value={exerciseCount}
            unit="個"
            color="$accentGreen"
            animationReady={animationReady}
          />
          <StatCard
            label="回答済み問題数"
            value={answeredCount}
            unit="問"
            color="$accentYellow"
            animationReady={animationReady}
          />
        </YStack>

        <YStack gap="$4">
          <PrimaryButton
            size="$6"
            onPress={handleWriteDiary}
            borderRadius="$4"
            icon={<Ionicons name="create-outline" size={24} color={theme.btnPrimaryText.get()} />}
          >
            <Text fontSize="$5" fontWeight="bold" color="$btnPrimaryText">
              今日の日記を書く
            </Text>
          </PrimaryButton>

          <PrimaryButton
            size="$6"
            onPress={handleReview}
            borderRadius="$4"
            icon={<Ionicons name="school-outline" size={24} color={theme.btnPrimaryText.get()} />}
          >
            <Text fontSize="$5" fontWeight="bold" color="$btnPrimaryText">
              復習する
            </Text>
          </PrimaryButton>
        </YStack>

        {dailyQuestion && <DailyQuestion question={dailyQuestion} onPress={handleDailyQuestion} />}
        {uncorrectedDiaries.length > 0 && <UncorrectedDiaryList diaries={uncorrectedDiaries} />}
      </ScrollView>
    </YStack>
  );
}
