import { Dialog } from '@/components/common/Dialog';
import { EmptyExpressionState } from '@/components/expressions/EmptyExpressionState';
import { ExpressionCard } from '@/components/expressions/ExpressionCard';
import type { TranslationExercise } from '@/types/database';
import React from 'react';
import { ScrollView } from 'react-native';
import { YStack } from 'tamagui';

type ExpressionsDialogProps = {
  visible: boolean;
  onClose: () => void;
  expressions: TranslationExercise[];
};

export const ExpressionsDialog: React.FC<ExpressionsDialogProps> = ({
  visible,
  onClose,
  expressions,
}) => {
  return (
    <Dialog visible={visible} title="表現集" onClose={onClose} height="60%">
      <YStack flex={1}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {expressions.length > 0 ? (
            <YStack gap="$2">
              {expressions.map((expr) => (
                <ExpressionCard key={expr.id} expression={expr} displayDate={false} />
              ))}
            </YStack>
          ) : (
            <EmptyExpressionState />
          )}
        </ScrollView>
      </YStack>
    </Dialog>
  );
};
