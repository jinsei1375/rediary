import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { Button, ListItem, Text, YStack } from 'tamagui';

export default function SettingsScreen() {
  const { signOut, user } = useAuth();

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

      <YStack flex={1} gap="$2">
        <ListItem
          title="個人設定"
          backgroundColor="$cardBg"
          onPress={() => router.push('/(tabs)/profile/settings')}
        />
        <ListItem
          title="利用ガイド"
          backgroundColor="$cardBg"
          onPress={() => router.push('/(tabs)/profile/guide')}
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
