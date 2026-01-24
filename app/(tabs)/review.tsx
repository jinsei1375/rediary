import { Header } from '@/components/common/Header';
import { Loading } from '@/components/common/Loading';
import { EmptyReviewState } from '@/components/review/EmptyReviewState';
import { FilterSettings } from '@/components/review/FilterSettings';
import { ResultScreen } from '@/components/review/ResultScreen';
import { ReviewCard } from '@/components/review/ReviewCard';
import { ReviewProgress } from '@/components/review/ReviewProgress';
import { useAuth } from '@/contexts/AuthContext';
import { ExerciseAttemptService } from '@/services/exerciseAttemptService';
import { TranslationExerciseService } from '@/services/translationExerciseService';
import type { ExerciseAttempt, ExerciseResult, TranslationExercise } from '@/types/database';
import { countFilteredExercises, filterExercises } from '@/utils/exerciseFilter';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { ScrollView, YStack, useTheme } from 'tamagui';

export default function ReviewScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const [exercises, setExercises] = useState<TranslationExercise[]>([]);
  const [allExercises, setAllExercises] = useState<any[]>([]); // 全問題（attemptsを含む）
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [userAnswer, setUserAnswer] = useState('');
  const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);

  // 結果画面用の状態
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<ExerciseResult[]>([]);

  // フィルター設定
  const [showSettings, setShowSettings] = useState(true);
  const [isRandom, setIsRandom] = useState(false);
  const [notRememberedCount, setNotRememberedCount] = useState(0);
  const [daysSinceLastAttempt, setDaysSinceLastAttempt] = useState(0);

  // 現在の問題の統計情報と過去の回答
  const [currentStats, setCurrentStats] = useState<{
    rememberedCount: number;
    notRememberedCount: number;
  }>({ rememberedCount: 0, notRememberedCount: 0 });
  const [pastAttempts, setPastAttempts] = useState<ExerciseAttempt[]>([]);

  // フィルター条件に合う問題数（フロントエンドで計算）
  const exerciseCount = countFilteredExercises(
    allExercises,
    notRememberedCount,
    daysSinceLastAttempt,
    isRandom,
  );

  // Current exercise
  const currentExercise = exercises[currentIndex];

  // 全問題を取得（初回のみ）
  const loadAllExercises = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    setLoading(true);

    const { data, error } = await TranslationExerciseService.getByUserWithAttempts(user.id);

    if (error) {
      console.error('Error loading all exercises:', error);
      Alert.alert('エラー', '問題の読み込みに失敗しました');
      setAllExercises([]);
    } else if (data) {
      setAllExercises(data);
    }

    setLoading(false);
  }, [user?.id]);

  const loadExercises = useCallback(() => {
    // フロントエンドでフィルタリング
    const filtered = filterExercises(
      allExercises,
      notRememberedCount,
      daysSinceLastAttempt,
      isRandom,
      5, // 上限5問
    );

    // exercise_attemptsプロパティを削除
    const cleanedData = filtered.map((exercise: any) => {
      const { exercise_attempts, ...rest } = exercise;
      return rest;
    });

    setExercises(cleanedData);
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompletedIds(new Set());
    setUserAnswer('');
    setCurrentAttemptId(null);
  }, [allExercises, isRandom, notRememberedCount, daysSinceLastAttempt]);

  const handleStartReview = useCallback(() => {
    loadExercises();
    setShowSettings(false);
    setShowResults(false);
    setResults([]);
  }, [loadExercises]);

  useFocusEffect(
    useCallback(() => {
      // タブに戻ったら設定画面を表示し、全問題を取得
      setShowSettings(true);
      setExercises([]);
      loadAllExercises();
    }, [loadAllExercises]),
  );

  // Load exercise data when current exercise changes
  React.useEffect(() => {
    const loadCurrentExerciseData = async () => {
      // ユーザー未ログイン時や設定画面表示中は統計を取得しない
      if (!currentExercise || showSettings || !user?.id) return;

      try {
        // Load statistics (scoped to current user)
        const { data: statsData, error: statsError } =
          await ExerciseAttemptService.getExerciseStats(currentExercise.id, user.id);
        if (statsError) {
          console.error('Error loading exercise stats:', statsError);
        }
        if (statsData) {
          setCurrentStats({
            rememberedCount: statsData.remembered_count,
            notRememberedCount: statsData.not_remembered_count,
          });
        } else {
          setCurrentStats({ rememberedCount: 0, notRememberedCount: 0 });
        }

        // Load past attempts (scoped to current user)
        const { data: attemptsData, error: attemptsError } =
          await ExerciseAttemptService.getExerciseAttempts(currentExercise.id, user.id);
        if (attemptsError) {
          console.error('Error loading past attempts:', attemptsError);
        }
        if (attemptsData) {
          setPastAttempts(attemptsData);
        } else {
          setPastAttempts([]);
        }
      } catch (error) {
        console.error('Error loading exercise data:', error);
      }
    };

    loadCurrentExerciseData();
  }, [currentExercise, showSettings, user?.id]);

  const handleCheckAnswer = async () => {
    if (!user?.id || !currentExercise || isFlipped) return;

    // レコードを作成（rememberedはnull）
    const { data, error } = await ExerciseAttemptService.createExerciseAttempt(
      user.id,
      currentExercise.id,
      userAnswer,
      null, // まだ覚えたかどうかは未定
    );

    if (error || !data) {
      console.error('Error creating attempt:', error);
      Alert.alert('エラー', '回答の保存に失敗しました');
      return;
    }

    // 作成したIDを保存
    setCurrentAttemptId(data.id);
    // カードを裏返す
    setIsFlipped(true);
  };

  const handleResponse = async (remembered: boolean) => {
    if (!currentAttemptId || !user?.id) {
      Alert.alert('エラー', '先に答えを確認してください');
      return;
    }

    // 作成済みレコードのrememberedフラグを更新
    const { error } = await ExerciseAttemptService.updateExerciseAttempt(
      currentAttemptId,
      remembered,
      user.id,
    );

    if (error) {
      console.error('Error updating attempt:', error);
      Alert.alert('エラー', '回答の更新に失敗しました');
      return;
    }

    // Refresh statistics and past attempts after response
    try {
      const { data: statsData } = await ExerciseAttemptService.getExerciseStats(
        currentExercise.id,
        user.id,
      );
      if (statsData) {
        setCurrentStats({
          rememberedCount: statsData.remembered_count,
          notRememberedCount: statsData.not_remembered_count,
        });
      }

      const { data: attemptsData } = await ExerciseAttemptService.getExerciseAttempts(
        currentExercise.id,
        user.id,
      );
      if (attemptsData) {
        setPastAttempts(attemptsData);
      }
    } catch (error) {
      console.error('Error refreshing exercise data:', error);
    }

    // 完了済みとしてマーク
    setCompletedIds((prev) => new Set(prev).add(currentExercise.id));

    // 結果を保存
    setResults((prev) => [
      ...prev,
      {
        exercise: currentExercise,
        userAnswer: userAnswer,
        remembered: remembered,
      },
    ]);

    // 次のカードへ
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setUserAnswer('');
      setCurrentAttemptId(null);
    } else {
      // すべて完了 - 結果画面を表示
      setShowResults(true);
    }
  };

  // コンテンツを決定
  let content: React.ReactNode;

  if (loading) {
    content = <Loading message="復習問題を読み込み中..." />;
  } else if (showResults) {
    content = (
      <ResultScreen
        results={results}
        onBackToSettings={() => {
          setShowSettings(true);
          setShowResults(false);
          setExercises([]);
          setResults([]);
        }}
      />
    );
  } else if (showSettings) {
    content = (
      <FilterSettings
        isRandom={isRandom}
        notRememberedCount={notRememberedCount}
        daysSinceLastAttempt={daysSinceLastAttempt}
        exerciseCount={exerciseCount}
        onIsRandomChange={setIsRandom}
        onNotRememberedCountChange={setNotRememberedCount}
        onDaysSinceLastAttemptChange={setDaysSinceLastAttempt}
        onStartReview={handleStartReview}
      />
    );
  } else if (!currentExercise) {
    content = <EmptyReviewState onBackToSettings={() => setShowSettings(true)} />;
  } else {
    content = (
      <>
        <ReviewProgress currentIndex={currentIndex} totalQuestions={exercises.length} />
        <ScrollView flex={1} paddingVertical="$6" showsVerticalScrollIndicator={false}>
          <ReviewCard
            exercise={currentExercise}
            isFlipped={isFlipped}
            userAnswer={userAnswer}
            onUserAnswerChange={setUserAnswer}
            onCheckAnswer={handleCheckAnswer}
            onRemembered={() => handleResponse(true)}
            onNotRemembered={() => handleResponse(false)}
            showButtons={!completedIds.has(currentExercise.id)}
            rememberedCount={currentStats.rememberedCount}
            notRememberedCount={currentStats.notRememberedCount}
            pastAttempts={pastAttempts}
          />
        </ScrollView>
      </>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <Header title="復習" />
      {content}
    </YStack>
  );
}
