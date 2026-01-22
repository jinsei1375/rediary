import { Header } from '@/components/common/Header';
import { Loading } from '@/components/common/Loading';
import { FilterSettings } from '@/components/review/FilterSettings';
import { ReviewCard } from '@/components/review/ReviewCard';
import { useAuth } from '@/contexts/AuthContext';
import { ExerciseAttemptService } from '@/services/exerciseAttemptService';
import { TranslationExerciseService } from '@/services/translationExerciseService';
import type { ExerciseAttempt, TranslationExercise } from '@/types/database';
import { countFilteredExercises, filterExercises } from '@/utils/exerciseFilter';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { Button, ScrollView, Text, XStack, YStack, useTheme } from 'tamagui';

export default function ReviewScreen() {
  const { session } = useAuth();
  const theme = useTheme();
  const [exercises, setExercises] = useState<TranslationExercise[]>([]);
  const [allExercises, setAllExercises] = useState<any[]>([]); // 全問題（attemptsを含む）
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [userAnswer, setUserAnswer] = useState('');
  const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);

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
    if (!session?.user?.id) {
      return;
    }

    setLoading(true);

    const { data, error } = await TranslationExerciseService.getByUserWithAttempts(session.user.id);

    if (error) {
      console.error('Error loading all exercises:', error);
      Alert.alert('エラー', '問題の読み込みに失敗しました');
      setAllExercises([]);
    } else if (data) {
      setAllExercises(data);
    }

    setLoading(false);
  }, [session?.user?.id]);

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
      if (!currentExercise || showSettings) return;

      // Load statistics
      const { data: statsData } = await ExerciseAttemptService.getExerciseStats(
        currentExercise.id,
      );
      if (statsData) {
        setCurrentStats({
          rememberedCount: statsData.remembered_count,
          notRememberedCount: statsData.not_remembered_count,
        });
      } else {
        setCurrentStats({ rememberedCount: 0, notRememberedCount: 0 });
      }

      // Load past attempts
      const { data: attemptsData } = await ExerciseAttemptService.getExerciseAttempts(
        currentExercise.id,
      );
      if (attemptsData) {
        setPastAttempts(attemptsData);
      } else {
        setPastAttempts([]);
      }
    };

    loadCurrentExerciseData();
  }, [currentExercise, showSettings]);

  const handleCheckAnswer = async () => {
    if (!session?.user?.id || !currentExercise || isFlipped) return;

    // レコードを作成（rememberedはnull）
    const { data, error } = await ExerciseAttemptService.createExerciseAttempt(
      session.user.id,
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
    if (!currentAttemptId) {
      Alert.alert('エラー', '先に答えを確認してください');
      return;
    }

    // 作成済みレコードのrememberedフラグを更新
    const { error } = await ExerciseAttemptService.updateExerciseAttempt(
      currentAttemptId,
      remembered,
    );

    if (error) {
      console.error('Error updating attempt:', error);
      Alert.alert('エラー', '回答の更新に失敗しました');
      return;
    }

    // 完了済みとしてマーク
    setCompletedIds((prev) => new Set(prev).add(currentExercise.id));

    // 次のカードへ
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setUserAnswer('');
      setCurrentAttemptId(null);
    } else {
      // すべて完了
      Alert.alert('完了！', `${exercises.length}問すべて復習しました！`, [
        {
          text: 'OK',
          onPress: () => {
            setShowSettings(true);
            setExercises([]);
          },
        },
      ]);
    }
  };

  // 設定画面を表示
  if (showSettings) {
    return (
      <YStack flex={1} backgroundColor="$background">
        <Header title="復習" />
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
      </YStack>
    );
  }

  if (loading) {
    return <Loading message="復習問題を読み込み中..." />;
  }

  if (!currentExercise) {
    return (
      <YStack flex={1} backgroundColor="$background">
        <Header title="復習" />
        <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal="$6">
          <Ionicons name="checkmark-done-circle" size={80} color={theme.green10.get()} />
          <Text fontSize="$7" fontWeight="bold" marginTop="$4" color="$color">
            復習問題がありません
          </Text>
          <Text fontSize="$4" color="$gray11" marginTop="$2" textAlign="center">
            条件に合う問題が見つかりませんでした
          </Text>
          <Button
            backgroundColor="$blue10"
            marginTop="$6"
            paddingHorizontal="$6"
            height="$5"
            borderRadius="$3"
            onPress={() => setShowSettings(true)}
            pressStyle={{
              backgroundColor: '$blue11',
              scale: 0.98,
            }}
          >
            <XStack gap="$2" alignItems="center">
              <Ionicons name="settings" size={20} color="white" />
              <Text color="white" fontSize="$5" fontWeight="600">
                設定を変更
              </Text>
            </XStack>
          </Button>
        </YStack>
      </YStack>
    );
  }

  const progress = ((currentIndex + 1) / exercises.length) * 100;

  return (
    <YStack flex={1} backgroundColor="$background">
      <Header title="復習" />

      {/* Progress bar */}
      <YStack
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        paddingHorizontal="$4"
        paddingVertical="$3"
      >
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
          <XStack gap="$2" alignItems="center">
            <Text fontSize="$3" color="$gray11" fontWeight="600">
              進捗状況
            </Text>
          </XStack>
          <Text fontSize="$4" color="$gray11" fontWeight="600">
            {currentIndex + 1} / {exercises.length}
          </Text>
        </XStack>
        <YStack height={6} backgroundColor="$gray5" borderRadius="$2" overflow="hidden">
          <YStack
            height="100%"
            width={`${progress}%`}
            backgroundColor="$blue10"
            animation="quick"
          />
        </YStack>
      </YStack>

      {/* Card content */}
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
    </YStack>
  );
}
