import { Dialog } from '@/components/common/Dialog';
import type { ExerciseAttempt } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, YStack, useTheme } from 'tamagui';
import { PastAttemptItem } from './PastAttemptItem';

type PastAnswersDialogProps = {
  visible: boolean;
  onClose: () => void;
  pastAttempts: ExerciseAttempt[];
};

export const PastAnswersDialog = React.memo(
  ({ visible, onClose, pastAttempts }: PastAnswersDialogProps) => {
    const theme = useTheme();

    return (
      <Dialog visible={visible} onClose={onClose} title="過去の解答" height="60%">
        <YStack flex={1} overflow="hidden">
          <ScrollView
            flex={1}
            paddingBottom="$5"
            paddingRight="$2.5"
            showsVerticalScrollIndicator={true}
          >
            {pastAttempts.length === 0 ? (
              <YStack alignItems="center" paddingVertical="$8">
                <Ionicons name="document-outline" size={48} color={theme.gray10?.get() ?? '#999'} />
                <Text fontSize="$4" color="$gray10" marginTop="$3" textAlign="center">
                  まだ解答データがありません
                </Text>
              </YStack>
            ) : (
              <YStack gap="$3">
                {pastAttempts.map((attempt) => (
                  <PastAttemptItem key={attempt.id} attempt={attempt} />
                ))}
              </YStack>
            )}
          </ScrollView>
        </YStack>
      </Dialog>
    );
  },
);

PastAnswersDialog.displayName = 'PastAnswersDialog';
