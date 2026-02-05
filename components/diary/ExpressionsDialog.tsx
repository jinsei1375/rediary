import { Dialog } from '@/components/common/Dialog';
import { EmptyExpressionState } from '@/components/expressions/EmptyExpressionState';
import { ExpressionCard } from '@/components/expressions/ExpressionCard';
import type { TranslationExercise } from '@/types/database';
import React from 'react';
import { ScrollView } from 'react-native';
import { Paragraph, YStack } from 'tamagui';

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
        <Paragraph fontSize="$2" color="$gray11" marginBottom="$3">
          今までに学んだネイティブ表現の一覧
        </Paragraph>
        <ScrollView showsVerticalScrollIndicator={false}>
          {expressions.length > 0 ? (
            <YStack gap="$2">
              {expressions.map((expr) => (
                <ExpressionCard key={expr.id} expression={expr} />
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
