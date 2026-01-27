import { PrimaryButton } from '@/components/common/PrimaryButton';
import { DailyQuestion } from '@/components/home/DailyQuestion';
import { StatCard } from '@/components/home/StatCard';
import { useAuth } from '@/contexts/AuthContext';
import { DiaryService } from '@/services';
import { ExerciseAttemptService } from '@/services/exerciseAttemptService';
import { TranslationExerciseService } from '@/services/translationExerciseService';
import type { TranslationExercise } from '@/types/database';
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

  const today = new Date().toISOString().split('T')[0];

  useFocusEffect(
    useCallback(() => {
      let isCancelled = false;

      const loadData = async () => {
        if (!user?.id) return;

        // 日記カウントを取得
        const { count, error: countError } = await DiaryService.getTotalCount(user.id);
        if (countError) {
          console.error('Error loading diary count:', countError);
        } else if (!isCancelled) {
          setDiaryCount(count ?? 0);
        }

        // 今日の1問を取得
        const { data: question, error: questionError } =
          await TranslationExerciseService.getDailyQuestion(user.id);
        if (questionError) {
          console.error('Error loading daily question:', questionError);
        } else if (!isCancelled) {
          setDailyQuestion(question);
        }

        // 登録済みネイティブ表現数を取得
        const { count: exerciseTotal, error: exerciseError } =
          await TranslationExerciseService.getTotalCount(user.id);
        if (exerciseError) {
          console.error('Error loading exercise count:', exerciseError);
        } else if (!isCancelled) {
          setExerciseCount(exerciseTotal ?? 0);
        }

        // 回答済み問題数を取得
        const { count: answeredTotal, error: answeredError } =
          await ExerciseAttemptService.getAnsweredExerciseCount(user.id);
        if (answeredError) {
          console.error('Error loading answered count:', answeredError);
        } else if (!isCancelled) {
          setAnsweredCount(answeredTotal ?? 0);
        }
      };

      loadData();

      return () => {
        isCancelled = true;
      };
    }, [user?.id]),
  );

  const handleWriteDiary = () => {
    router.push({
      pathname: '/(tabs)/diary/[date]',
      params: { date: today },
    } as any);
  };

  const handleReview = () => {
    router.push('/(tabs)/review');
  };

  const handleDailyQuestion = () => {
    if (dailyQuestion) {
      router.push({
        pathname: '/(tabs)/review',
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
          <StatCard label="日記を書いた日数" value={diaryCount} unit="日" color="$accentBlue" />
          <StatCard
            label="登録済みネイティブ表現"
            value={exerciseCount}
            unit="個"
            color="$accentGreen"
          />
          <StatCard label="回答済み問題数" value={answeredCount} unit="問" color="$accentYellow" />
        </YStack>

        {dailyQuestion && <DailyQuestion question={dailyQuestion} onPress={handleDailyQuestion} />}

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
            icon={<Ionicons name="book-outline" size={24} color={theme.btnPrimaryText.get()} />}
          >
            <Text fontSize="$5" fontWeight="bold" color="$btnPrimaryText">
              復習する
            </Text>
          </PrimaryButton>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
