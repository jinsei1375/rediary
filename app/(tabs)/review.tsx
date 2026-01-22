import { Loading } from '@/components/common/Loading';
import { ReviewCard } from '@/components/review/ReviewCard';
import { useAuth } from '@/contexts/AuthContext';
import { ExerciseAttemptService } from '@/services/exerciseAttemptService';
import { TranslationExerciseService } from '@/services/translationExerciseService';
import type { TranslationExercise } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { Button, ScrollView, Text, XStack, YStack, useTheme } from 'tamagui';

export default function ReviewScreen() {
  const { session } = useAuth();
  const theme = useTheme();
  const [exercises, setExercises] = useState<TranslationExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [userAnswer, setUserAnswer] = useState('');
  const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);

  const loadExercises = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await TranslationExerciseService.getScheduled(session.user.id);

    if (error) {
      console.error('Error loading exercises:', error);
      Alert.alert('エラー', '復習問題の読み込みに失敗しました');
      setExercises([]);
    } else if (data) {
      setExercises(data);
      setCurrentIndex(0);
      setIsFlipped(false);
      setCompletedIds(new Set());
      setUserAnswer('');
      setCurrentAttemptId(null);
    }

    setLoading(false);
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadExercises();
    }, [loadExercises]),
  );

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
      Alert.alert(
        '完了！',
        `${exercises.length}問すべて復習しました！\n覚えた問題は次回の復習から除外されます。`,
        [
          {
            text: 'OK',
            onPress: () => {
              loadExercises();
            },
          },
        ],
      );
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setUserAnswer('');
      setCurrentAttemptId(null);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setUserAnswer('');
      setCurrentAttemptId(null);
    }
  };

  const currentExercise = exercises[currentIndex];

  if (loading) {
    return <Loading message="復習問題を読み込み中..." />;
  }

  if (!currentExercise) {
    return (
      <YStack flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <Ionicons name="checkmark-done-circle" size={80} color={theme.green10.get()} />
        <Text fontSize="$7" fontWeight="bold" marginTop="$4" color="$color">
          復習問題がありません
        </Text>
        <Text
          fontSize="$4"
          color="$gray11"
          marginTop="$2"
          textAlign="center"
          paddingHorizontal="$6"
        >
          今日の復習はすべて完了しました！
        </Text>
      </YStack>
    );
  }

  const progress = ((currentIndex + 1) / exercises.length) * 100;

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Header with progress */}
      <YStack
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        paddingTop="$4"
        paddingHorizontal="$4"
        paddingBottom="$3"
      >
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
          <Text fontSize="$8" fontWeight="bold" color="$color">
            復習
          </Text>
          <Text fontSize="$5" color="$gray11" fontWeight="600">
            {currentIndex + 1} / {exercises.length}
          </Text>
        </XStack>

        {/* Progress bar */}
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
        />
      </ScrollView>

      {/* Navigation buttons */}
      <XStack
        gap="$3"
        paddingHorizontal="$4"
        paddingVertical="$3"
        backgroundColor="$background"
        borderTopWidth={1}
        borderTopColor="$borderColor"
      >
        <Button
          flex={1}
          size="$4"
          backgroundColor="$gray3"
          disabled={currentIndex === 0}
          onPress={handlePrevious}
          opacity={currentIndex === 0 ? 0.5 : 1}
        >
          <XStack gap="$2" alignItems="center">
            <Ionicons name="chevron-back" size={20} color={theme.color.get()} />
            <Text color="$color" fontWeight="600">
              前へ
            </Text>
          </XStack>
        </Button>

        <Button
          flex={1}
          size="$4"
          backgroundColor="$gray3"
          disabled={currentIndex === exercises.length - 1}
          onPress={handleNext}
          opacity={currentIndex === exercises.length - 1 ? 0.5 : 1}
        >
          <XStack gap="$2" alignItems="center">
            <Text color="$color" fontWeight="600">
              次へ
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.color.get()} />
          </XStack>
        </Button>
      </XStack>
    </YStack>
  );
}
