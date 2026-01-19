import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { Button, ListItem, Separator, Text, YStack } from 'tamagui';

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
    <YStack flex={1} padding="$6" backgroundColor="$background">
      <Text fontSize="$8" fontWeight="bold" marginBottom="$2">
        プロフィール
      </Text>
      {user && (
        <Text fontSize="$3" color="$placeholderColor" marginBottom="$4">
          {user.email}
        </Text>
      )}

      <YStack flex={1}>
        <ListItem title="個人設定" onPress={() => router.push('/(tabs)/profile/settings')} />
        <Separator />
        <ListItem
          title="プライバシーポリシー"
          onPress={() => router.push('/(tabs)/profile/privacy')}
        />
        <Separator />
        <ListItem title="利用規約" onPress={() => router.push('/(tabs)/profile/terms')} />
      </YStack>

      <Button
        backgroundColor="$error"
        borderRadius="$3"
        height="$5"
        onPress={handleSignOut}
        alignItems="center"
        justifyContent="center"
        pressStyle={{
          opacity: 0.8,
        }}
      >
        <Text color="$background" fontSize="$5" fontWeight="bold">
          ログアウト
        </Text>
      </Button>
    </YStack>
  );
}
