import { useAuth } from '@/contexts/AuthContext';
import { DiaryService } from '@/services';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, H2, Text, XStack, YStack, useTheme } from 'tamagui';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useTheme();
  const [diaryCount, setDiaryCount] = useState<number>(0);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const loadDiaryCount = async () => {
      if (!user?.id) return;

      const { count, error } = await DiaryService.getTotalCount(user.id);
      if (error) {
        console.error('Error loading diary count:', error);
        return;
      }
      if (count) {
        setDiaryCount(count);
      }
    };
    loadDiaryCount();
  }, [user?.id]);

  const handleWriteDiary = () => {
    router.push({
      pathname: '/(tabs)/diary/[date]',
      params: { date: today },
    } as any);
  };

  const handleReview = () => {
    router.push('/(tabs)/review');
  };

  return (
    <YStack flex={1} backgroundColor="$bgPrimary" padding="$6" gap="$6">
      <YStack gap="$3" marginTop="$8">
        <H2 fontSize="$9" fontWeight="bold" color="$textPrimary">
          ようこそ
        </H2>
      </YStack>

      <YStack backgroundColor="$cardBg" padding="$6" borderRadius="$6" alignItems="center" gap="$3">
        <Text fontSize="$3" color="$textSecondary">
          日記を書いた日数
        </Text>
        <XStack alignItems="baseline" gap="$2">
          <Text fontSize="$10" fontWeight="bold" color="$accentBlue">
            {diaryCount}
          </Text>
          <Text fontSize="$6" color="$textSecondary">
            日
          </Text>
        </XStack>
      </YStack>

      <YStack gap="$4" flex={1}>
        <Button
          size="$6"
          backgroundColor="$btnPrimaryBg"
          onPress={handleWriteDiary}
          borderRadius="$4"
          color="$btnPrimaryText"
          pressStyle={{
            backgroundColor: '$btnPrimaryBg',
            scale: 0.98,
          }}
          icon={<Ionicons name="create-outline" size={24} color={theme.btnPrimaryText.get()} />}
        >
          <Text fontSize="$5" fontWeight="600" color="$btnPrimaryText">
            今日の日記を書く
          </Text>
        </Button>

        <Button
          size="$6"
          backgroundColor="$btnPrimaryBg"
          color="$btnPrimaryText"
          onPress={handleReview}
          borderRadius="$4"
          pressStyle={{
            backgroundColor: '$btnPrimaryBg',
            scale: 0.98,
          }}
          icon={<Ionicons name="book-outline" size={24} color={theme.btnPrimaryText.get()} />}
        >
          <Text fontSize="$5" fontWeight="600" color="$btnPrimaryText">
            復習する
          </Text>
        </Button>
      </YStack>
    </YStack>
  );
}
