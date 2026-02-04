import { Header } from '@/components/common/Header';
import { Loading } from '@/components/common/Loading';
import { EmptyReviewState } from '@/components/review/EmptyReviewState';
import { FilterSettings } from '@/components/review/FilterSettings';
import { ResultScreen } from '@/components/review/ResultScreen';
import { ReviewCard } from '@/components/review/ReviewCard';
import { ReviewProgress } from '@/components/review/ReviewProgress';
import { useAuth } from '@/contexts/AuthContext';
import { ExerciseAttemptService } from '@/services/exerciseAttemptService';
import { FeatureLimitError, FeatureLimitService } from '@/services/featureLimitService';
import { TranslationExerciseService } from '@/services/translationExerciseService';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import type { ExerciseAttempt, ExerciseResult, TranslationExercise } from '@/types/database';
import { countFilteredExercises, filterExercises } from '@/utils/exerciseFilter';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { ScrollView, YStack, useTheme } from 'tamagui';

export default function ReviewScreen() {
  const { user } = useAuth();
  const isPremium = useSubscriptionStore((state) => state.isPremium());
  const plan = useSubscriptionStore((state) => state.plan);
  const theme = useTheme();
  const navigation = useNavigation();
  const [reviewLimitStatus, setReviewLimitStatus] = useState<{
    isAllowed: boolean;
    isPremium: boolean;
    todayCount: number;
    limit: number;
  } | null>(null);
  const params = useLocalSearchParams();
  const dailyQuestionId = params.dailyQuestionId as string | undefined;
  const [exercises, setExercises] = useState<TranslationExercise[]>([]);
  const [allExercises, setAllExercises] = useState<any[]>([]); // 全問題（attemptsを含む）
  const [loading, setLoading] = useState(true);
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
  const [questionCount, setQuestionCount] = useState(3);
  const [excludeRemembered, setExcludeRemembered] = useState(false);

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
    excludeRemembered,
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
      questionCount,
      excludeRemembered,
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
  }, [
    allExercises,
    isRandom,
    notRememberedCount,
    daysSinceLastAttempt,
    questionCount,
    excludeRemembered,
  ]);

  // タブバーの表示制御
  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: showSettings
        ? { paddingTop: 8, paddingBottom: 2, height: 62, backgroundColor: theme.background.val }
        : { display: 'none' },
    });
  }, [showSettings, navigation, theme.background]);

  const handleStartReview = useCallback(() => {
    loadExercises();
    setShowSettings(false);
    setShowResults(false);
    setResults([]);
  }, [loadExercises]);

  // タブがフォーカスされた時に制限チェック→問題をロード
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        if (dailyQuestionId || !user?.id) {
          return;
        }

        setLoading(true);

        // まず制限ステータスをチェック
        const status = await FeatureLimitService.checkReviewAttemptStatus(user.id, plan);
        setReviewLimitStatus(status);

        // 無料プランで制限に達している場合はデータ取得をスキップ
        if (!status.isAllowed && !status.isPremium) {
          setLoading(false);
          return;
        }

        // 制限OKなら全問題を取得
        await loadAllExercises();
      };

      loadData();
    }, [dailyQuestionId, user?.id, plan, loadAllExercises]),
  );

  // 設定画面表示時に復習制限ステータスをチェック（データ取得後）
  useEffect(() => {
    const checkReviewLimit = async () => {
      if (showSettings && user?.id && allExercises.length > 0) {
        const status = await FeatureLimitService.checkReviewAttemptStatus(user.id, plan);
        setReviewLimitStatus(status);
      }
    };
    checkReviewLimit();
  }, [showSettings, user?.id, allExercises.length, plan]);

  // dailyQuestionIdが変わった時の処理
  useEffect(() => {
    if (dailyQuestionId && user?.id) {
      const loadDailyQuestion = async () => {
        setLoading(true);

        // まず制限ステータスをチェック
        const status = await FeatureLimitService.checkReviewAttemptStatus(user.id, plan);
        setReviewLimitStatus(status);

        // 無料プランで制限に達している場合は問題を読み込まず警告表示
        if (!status.isAllowed && !status.isPremium) {
          Alert.alert(
            '復習制限',
            '無料プランでは復習問題は1日1回までです。\n有料プランで無制限に復習できます。',
            [
              {
                text: 'プランを見る',
                onPress: () =>
                  router.push({
                    pathname: '/(tabs)/profile/subscription',
                    params: { returnTo: '/(tabs)/review' },
                  }),
              },
              { text: 'OK', style: 'cancel' },
            ],
          );
          setShowSettings(true);
          setExercises([]);
          setLoading(false);
          return;
        }

        const { data, error } = await TranslationExerciseService.getById(dailyQuestionId, user.id);
        if (error || !data) {
          console.error('Error loading daily question:', error);
          Alert.alert('エラー', '問題の読み込みに失敗しました');
          setShowSettings(true);
          setExercises([]);
        } else {
          setExercises([data]);
          setShowSettings(false);
          setShowResults(false);
          setResults([]);
          setCurrentIndex(0);
          setIsFlipped(false);
          setCompletedIds(new Set());
          setUserAnswer('');
          setCurrentAttemptId(null);
        }
        setLoading(false);
      };
      loadDailyQuestion();
    } else if (!dailyQuestionId) {
      setShowSettings(true);
      setExercises([]);
    }
  }, [dailyQuestionId, user?.id]);

  // Load exercise data when current exercise changes
  useEffect(() => {
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

    try {
      // レコードを作成（rememberedはnull）
      const { data, error } = await ExerciseAttemptService.createExerciseAttempt(
        user.id,
        currentExercise.id,
        userAnswer,
        plan,
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
    } catch (error) {
      if (error instanceof FeatureLimitError) {
        Alert.alert('ご案内', error.message);
        return;
      }

      console.error('Error creating attempt:', error);
      Alert.alert('エラー', '回答の保存に失敗しました');
    }
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

  const handleBackPress = () => {
    router.setParams({ dailyQuestionId: undefined });
    setShowSettings(true);
    setShowResults(false);
    setExercises([]);
    setResults([]);
    loadAllExercises(); // 最新データを再取得
  };

  // コンテンツを決定
  let content: React.ReactNode;

  if (loading) {
    content = <Loading />;
  } else if (showResults) {
    content = (
      <ResultScreen
        results={results}
        onBackToSettings={() => {
          setShowSettings(true);
          setShowResults(false);
          setExercises([]);
          setResults([]);
          loadAllExercises(); // 最新データを再取得
        }}
      />
    );
  } else if (showSettings) {
    content = (
      <FilterSettings
        isRandom={isRandom}
        notRememberedCount={notRememberedCount}
        daysSinceLastAttempt={daysSinceLastAttempt}
        questionCount={questionCount}
        excludeRemembered={excludeRemembered}
        exerciseCount={exerciseCount}
        reviewLimitStatus={reviewLimitStatus}
        onIsRandomChange={setIsRandom}
        onNotRememberedCountChange={setNotRememberedCount}
        onDaysSinceLastAttemptChange={setDaysSinceLastAttempt}
        onQuestionCountChange={setQuestionCount}
        onExcludeRememberedChange={setExcludeRemembered}
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
    <YStack flex={1} backgroundColor="$bgPrimary">
      <Header
        title="復習"
        showBackButton={!showSettings}
        showProfileButton={showSettings}
        onBack={handleBackPress}
      />
      {content}
    </YStack>
  );
}
