import { Header } from '@/components/common/Header';
import { Loading } from '@/components/common/Loading';
import { ExpressionList } from '@/components/expressions/ExpressionList';
import { useAuth } from '@/contexts/AuthContext';
import { TranslationExerciseService } from '@/services/translationExerciseService';
import type { TranslationExercise } from '@/types/database';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { YStack } from 'tamagui';

export default function ExpressionsScreen() {
  const { user } = useAuth();
  const [expressions, setExpressions] = useState<TranslationExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isCancelled = false;
      const loadExpressions = async () => {
        if (!user?.id) return;
        setIsLoading(true);

        const { data, error } = await TranslationExerciseService.getByUser(user.id);
        if (isCancelled) return;
        if (error) {
          console.error('Error loading expressions:', error);
        } else {
          setExpressions(data ?? []);
        }
        setIsLoading(false);
      };
      loadExpressions();

      return () => {
        isCancelled = true;
      };
    }, [user?.id]),
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <YStack flex={1} backgroundColor="$bgPrimary">
      <Header title="ネイティブ表現" showBackButton={false} />
      <ExpressionList expressions={expressions} />
    </YStack>
  );
}
