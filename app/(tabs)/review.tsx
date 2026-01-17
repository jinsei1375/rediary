import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/review/EmptyState';
import { ExerciseItem } from '@/components/review/ExerciseItem';
import { FilterButtons } from '@/components/review/FilterButtons';
import { useAuth } from '@/contexts/AuthContext';
import { DiaryService } from '@/services/diaryService';
import { TranslationExerciseService } from '@/services/translationExerciseService';
import type { TranslationExercise } from '@/types/database';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { Text, YStack } from 'tamagui';

export default function ReviewScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const [exercises, setExercises] = useState<TranslationExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'incomplete' | 'completed'>('incomplete');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const loadExercises = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    let result;
    switch (filter) {
      case 'incomplete':
        result = await TranslationExerciseService.getIncomplete(session.user.id);
        break;
      case 'completed':
        result = await TranslationExerciseService.getCompleted(session.user.id);
        break;
      default:
        result = await TranslationExerciseService.getByUser(session.user.id);
    }

    const { data, error } = result;

    if (error) {
      console.error('Error loading exercises:', error);
      Alert.alert('エラー', '復習問題の読み込みに失敗しました');
    } else if (data) {
      setExercises(data);
    }

    setLoading(false);
  }, [session?.user?.id, filter]);

  useFocusEffect(
    useCallback(() => {
      loadExercises();
    }, [loadExercises])
  );

  const handleRevealAnswer = (exerciseId: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [exerciseId]: true }));
  };

  const handleComplete = async (exercise: TranslationExercise) => {
    const userAnswer = userAnswers[exercise.id] || '';
    const { error } = await TranslationExerciseService.complete(exercise.id, userAnswer);

    if (error) {
      Alert.alert('エラー', '完了処理に失敗しました');
    } else {
      Alert.alert('完了', '復習問題を完了しました');
      loadExercises();
    }
  };

  const handleGoToDiary = async (diaryEntryId: string) => {
    const { data, error } = await DiaryService.getById(diaryEntryId);
    if (error || !data) {
      Alert.alert('エラー', '日記の取得に失敗しました');
      return;
    }
    router.push({
      pathname: '/(tabs)/diary/[date]',
      params: { date: data.entry_date },
    } as any);
  };

  const renderExerciseItem = ({ item }: { item: TranslationExercise }) => {
    const isRevealed = revealedAnswers[item.id] || !!item.is_completed;

    return (
      <ExerciseItem
        exercise={item}
        userAnswer={userAnswers[item.id] || ''}
        isRevealed={isRevealed}
        onAnswerChange={(text) => setUserAnswers((prev) => ({ ...prev, [item.id]: text }))}
        onRevealAnswer={() => handleRevealAnswer(item.id)}
        onComplete={() => handleComplete(item)}
        onGoToDiary={() => handleGoToDiary(item.diary_entry_id!)}
      />
    );
  };

  if (loading) {
    return <Loading message="復習問題を読み込み中..." />;
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        paddingVertical="$3"
        paddingHorizontal="$4"
      >
        <Text fontSize="$8" fontWeight="bold" marginBottom="$3" color="$color">
          復習
        </Text>

        <FilterButtons filter={filter} onFilterChange={setFilter} />
      </YStack>

      <FlatList
        data={exercises}
        renderItem={renderExerciseItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState filter={filter} />}
        contentContainerStyle={exercises.length === 0 ? { flex: 1 } : undefined}
      />
    </YStack>
  );
}
