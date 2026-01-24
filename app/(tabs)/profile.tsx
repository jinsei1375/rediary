import { useAuth } from '@/contexts/AuthContext';
import { DiaryService } from '@/services';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Button, ListItem, Text, XStack, YStack } from 'tamagui';

export default function SettingsScreen() {
  const { signOut, user } = useAuth();
  const [diaryCount, setDiaryCount] = useState<number>(0);

  const handleSignOut = async () => {
    Alert.alert('ログアウト', '本当にログアウトしますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: 'ログアウト',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/login');
        },
      },
    ]);
  };

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

  return (
    <YStack flex={1} padding="$4" backgroundColor="$bgPrimary">
      <Text fontSize="$8" fontWeight="bold" marginBottom="$2">
        プロフィール
      </Text>
      {user && (
        <Text fontSize="$3" color="$placeholderColor" marginBottom="$4">
          {user.email}
        </Text>
      )}

      <XStack
        backgroundColor="$cardBg"
        padding="$4"
        borderRadius="$4"
        marginBottom="$4"
        justifyContent="space-around"
      >
        <YStack alignItems="center" space="$2">
          <Text fontSize="$8" fontWeight="bold" color="$primary">
            {diaryCount}
          </Text>
          <Text fontSize="$3" color="$color">
            日記を書いた日数
          </Text>
        </YStack>
      </XStack>

      <YStack flex={1} space="$2">
        <ListItem
          title="個人設定"
          backgroundColor="$cardBg"
          onPress={() => router.push('/(tabs)/profile/settings')}
        />
        <ListItem
          title="プライバシーポリシー"
          backgroundColor="$cardBg"
          onPress={() => router.push('/(tabs)/profile/privacy')}
        />
        <ListItem
          title="利用規約"
          backgroundColor="$cardBg"
          onPress={() => router.push('/(tabs)/profile/terms')}
        />
        <ListItem
          title="よくある質問"
          backgroundColor="$cardBg"
          onPress={() => router.push('/(tabs)/profile/faq')}
        />
      </YStack>

      <Button
        size="$3"
        chromeless
        onPress={handleSignOut}
        alignSelf="center"
        marginTop="$4"
        pressStyle={{
          opacity: 0.6,
        }}
      >
        <Text color="$red10" fontSize="$3">
          ログアウト
        </Text>
      </Button>
    </YStack>
  );
}
