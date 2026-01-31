import { PrimaryButton } from '@/components/common/PrimaryButton';
import { getTodayString } from '@/utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, useTheme, YStack } from 'tamagui';

export const EmptyExpressionState = React.memo(() => {
  const theme = useTheme();
  const router = useRouter();

  const handleWriteDiary = () => {
    const today = getTodayString();
    router.push({
      pathname: '/(tabs)/diary/[date]',
      params: { date: today },
    } as any);
  };

  return (
    <YStack alignItems="center" justifyContent="center" paddingVertical="$8" gap="$4">
      <Ionicons name="book-outline" size={64} color={theme.gray6.get()} />
      <Text fontSize="$5" color="$textSecondary" textAlign="center">
        まだネイティブ表現が登録されていません
      </Text>
      <Text fontSize="$3" color="$gray9" textAlign="center" paddingHorizontal="$6">
        日記にAI添削を実行すると、{'\n'}
        ネイティブ表現が自動で登録されます
      </Text>
      <PrimaryButton
        size="$6"
        onPress={handleWriteDiary}
        borderRadius="$4"
        marginTop="$3"
        alignSelf="stretch"
        marginHorizontal="$6"
        icon={<Ionicons name="create-outline" size={24} color={theme.btnPrimaryText.get()} />}
      >
        <Text fontSize="$5" fontWeight="bold" color="$btnPrimaryText">
          今日の日記を書く
        </Text>
      </PrimaryButton>
    </YStack>
  );
});

EmptyExpressionState.displayName = 'EmptyExpressionState';
