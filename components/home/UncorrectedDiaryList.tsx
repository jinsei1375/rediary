import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card, Text, useTheme, XStack, YStack } from 'tamagui';

type UncorrectedDiary = {
  id: string;
  title: string;
  entry_date: string;
  created_at: string;
};

type UncorrectedDiaryListProps = {
  diaries: UncorrectedDiary[];
};

export const UncorrectedDiaryList = ({ diaries }: UncorrectedDiaryListProps) => {
  const router = useRouter();
  const theme = useTheme();

  const handleDiaryPress = (date: string) => {
    router.push({
      pathname: '/(tabs)/diary/[date]',
      params: { date },
    } as any);
  };

  if (diaries.length === 0) {
    return null;
  }

  return (
    <YStack gap="$3">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$5" fontWeight="bold" color="$textPrimary">
          AI添削待ちの日記
        </Text>
        <XStack gap="$2" alignItems="center">
          <Ionicons name="alert-circle-outline" size={16} color={theme.warning.get()} />
          <Text fontSize="$3" color="$warning">
            {diaries.length}件
          </Text>
        </XStack>
      </XStack>

      <YStack gap="$2">
        {diaries.map((diary) => (
          <Card
            key={diary.id}
            backgroundColor="$cardBg"
            borderWidth={1}
            borderColor="$cardBorder"
            paddingVertical="$3"
            paddingHorizontal="$4"
            borderRadius="$3"
            pressStyle={{ opacity: 0.8, backgroundColor: '$bgTertiary' }}
            onPress={() => handleDiaryPress(diary.entry_date)}
          >
            <XStack justifyContent="space-between" alignItems="center" gap="$3">
              <YStack flex={1}>
                <Text fontSize="$4" fontWeight="500" color="$textPrimary" numberOfLines={1}>
                  {diary.title}
                </Text>
              </YStack>
              <Ionicons name="chevron-forward" size={20} color={theme.gray10.get()} />
            </XStack>
          </Card>
        ))}
      </YStack>
    </YStack>
  );
};
