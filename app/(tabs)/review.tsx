import { Loading } from '@/components/common/Loading';
import { useAuth } from '@/contexts/AuthContext';
import { TranslationExerciseService } from '@/services/translationExerciseService';
import type { TranslationExercise } from '@/types/database';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable } from 'react-native';
import { Separator, Text, XStack, YStack } from 'tamagui';

export default function ReviewScreen() {
  const { session } = useAuth();
  const [exercises, setExercises] = useState<TranslationExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'incomplete' | 'completed'>('incomplete');

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

  const renderExerciseItem = ({ item }: { item: TranslationExercise }) => (
    <Pressable
      onPress={() => {
        // TODO: 詳細画面への遷移を実装
        Alert.alert('詳細', `問題: ${item.source_text}\n\n正解: ${item.correct_translation}`);
      }}
    >
      <YStack
        padding="$4"
        backgroundColor={item.is_completed ? '$gray2' : '$background'}
        borderLeftWidth={4}
        borderLeftColor={item.is_completed ? '$gray8' : '$primary'}
      >
        <Text fontSize="$5" fontWeight="600" color="$color" marginBottom="$2">
          {item.source_text}
        </Text>

        <Text fontSize="$3" color="$gray11" marginBottom="$2">
          正解: {item.correct_translation}
        </Text>

        {item.user_translation && (
          <Text fontSize="$3" color="$gray10" fontStyle="italic">
            あなたの回答: {item.user_translation}
          </Text>
        )}

        <XStack gap="$2" marginTop="$2" alignItems="center">
          <Text fontSize="$2" color="$gray10">
            {item.is_completed ? '完了' : '未完了'}
          </Text>
          <Text fontSize="$2" color="$gray9">
            •
          </Text>
          <Text fontSize="$2" color="$gray10">
            {new Date(item.created_at || '').toLocaleDateString('ja-JP')}
          </Text>
        </XStack>
      </YStack>
      <Separator />
    </Pressable>
  );

  const renderEmptyState = () => (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$6">
      <Text fontSize="$6" color="$gray10" textAlign="center" marginBottom="$2">
        {filter === 'incomplete' && '未完了の復習問題はありません'}
        {filter === 'completed' && '完了した復習問題はありません'}
        {filter === 'all' && '復習問題がまだありません'}
      </Text>
      <Text fontSize="$3" color="$gray9" textAlign="center">
        AI添削を実行すると、ネイティブ表現が{'\n'}自動的に復習問題として登録されます
      </Text>
    </YStack>
  );

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
        <Text fontSize="$8" fontWeight="bold" marginBottom="$3">
          復習
        </Text>

        <XStack gap="$2">
          <Pressable onPress={() => setFilter('incomplete')} style={{ flex: 1 }}>
            <YStack
              padding="$2"
              backgroundColor={filter === 'incomplete' ? '$primary' : '$gray3'}
              borderRadius="$3"
              alignItems="center"
            >
              <Text
                fontSize="$3"
                fontWeight="600"
                color={filter === 'incomplete' ? '$background' : '$color'}
              >
                未完了
              </Text>
            </YStack>
          </Pressable>

          <Pressable onPress={() => setFilter('completed')} style={{ flex: 1 }}>
            <YStack
              padding="$2"
              backgroundColor={filter === 'completed' ? '$primary' : '$gray3'}
              borderRadius="$3"
              alignItems="center"
            >
              <Text
                fontSize="$3"
                fontWeight="600"
                color={filter === 'completed' ? '$background' : '$color'}
              >
                完了
              </Text>
            </YStack>
          </Pressable>

          <Pressable onPress={() => setFilter('all')} style={{ flex: 1 }}>
            <YStack
              padding="$2"
              backgroundColor={filter === 'all' ? '$primary' : '$gray3'}
              borderRadius="$3"
              alignItems="center"
            >
              <Text
                fontSize="$3"
                fontWeight="600"
                color={filter === 'all' ? '$background' : '$color'}
              >
                すべて
              </Text>
            </YStack>
          </Pressable>
        </XStack>
      </YStack>

      <FlatList
        data={exercises}
        renderItem={renderExerciseItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={exercises.length === 0 ? { flex: 1 } : undefined}
      />
    </YStack>
  );
}
