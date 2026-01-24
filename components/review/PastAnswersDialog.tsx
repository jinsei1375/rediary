import type { ExerciseAttempt } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView as RNScrollView } from 'react-native';
import { Button, Text, XStack, YStack, useTheme } from 'tamagui';
import { PastAttemptItem } from './PastAttemptItem';

type PastAnswersDialogProps = {
  visible: boolean;
  onClose: () => void;
  pastAttempts: ExerciseAttempt[];
};

const getDialogHeight = (itemCount: number) => {
  if (itemCount === 0) return '30%';
  if (itemCount === 1) return '35%';
  if (itemCount === 2) return '45%';
  if (itemCount === 3) return '50%';
  return '60%';
};

export const PastAnswersDialog = React.memo(
  ({ visible, onClose, pastAttempts }: PastAnswersDialogProps) => {
    const theme = useTheme();

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        accessibilityViewIsModal
        onRequestClose={onClose}
      >
        <YStack
          flex={1}
          backgroundColor="rgba(0,0,0,0.5)"
          justifyContent="center"
          alignItems="center"
          paddingHorizontal="$4"
        >
          <YStack
            backgroundColor="$background"
            borderRadius="$4"
            padding="$4"
            width="90%"
            height={getDialogHeight(pastAttempts.length)}
            alignSelf="center"
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.3}
            shadowRadius={8}
            elevation={5}
          >
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
              <Text fontSize="$6" fontWeight="700" color="$color">
                過去の解答
              </Text>
              <Button
                size="$3"
                circular
                backgroundColor="$gray3"
                onPress={onClose}
                pressStyle={{
                  backgroundColor: '$gray4',
                }}
              >
                <Ionicons name="close" size={20} color={theme.color.get()} />
              </Button>
            </XStack>

            <YStack flex={1} overflow="hidden">
              <RNScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 20, paddingRight: 10 }}
                showsVerticalScrollIndicator={true}
              >
                {pastAttempts.length === 0 ? (
                  <YStack alignItems="center" paddingVertical="$8">
                    <Ionicons
                      name="document-outline"
                      size={48}
                      color={theme.gray10?.get() ?? '#999'}
                    />
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
              </RNScrollView>
            </YStack>
          </YStack>
        </YStack>
      </Modal>
    );
  },
);

PastAnswersDialog.displayName = 'PastAnswersDialog';
