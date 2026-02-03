import { getContactMailtoLink } from '@/constants/contact';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Linking } from 'react-native';
import { Button, ListItem, Text, YStack, useTheme } from 'tamagui';

export default function SettingsScreen() {
  const { signOut, user } = useAuth();
  const theme = useTheme();

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
        <Text fontSize="$3" color="$placeholderColor" marginBottom="$8">
          {user.email}
        </Text>
      )}

      <YStack flex={1} gap="$2">
        {/* <ListItem
          title="AI学習分析"
          backgroundColor="$cardBg"
          borderRadius="$4"
          onPress={() => router.push('/profile/analysis')}
          icon={<Ionicons name="analytics-outline" size={24} color={theme.textPrimary.get()} />}
        /> */}
        <ListItem
          title="個人設定"
          backgroundColor="$cardBg"
          borderRadius="$4"
          onPress={() => router.push('/profile/settings')}
          icon={<Ionicons name="settings-outline" size={24} color={theme.textPrimary.get()} />}
        />
        <ListItem
          title="利用プラン"
          backgroundColor="$cardBg"
          borderRadius="$4"
          onPress={() => router.push('/profile/subscription')}
          icon={<Ionicons name="star" size={24} color={theme.textPrimary.get()} />}
        />
        <ListItem
          title="利用ガイド"
          backgroundColor="$cardBg"
          borderRadius="$4"
          onPress={() => router.push('/profile/guide')}
          icon={<Ionicons name="help-circle-outline" size={24} color={theme.textPrimary.get()} />}
        />
        <ListItem
          title="プライバシーポリシー"
          backgroundColor="$cardBg"
          borderRadius="$4"
          onPress={() => router.push('/profile/privacy')}
          icon={
            <Ionicons name="shield-checkmark-outline" size={24} color={theme.textPrimary.get()} />
          }
        />
        <ListItem
          title="利用規約"
          backgroundColor="$cardBg"
          borderRadius="$4"
          onPress={() => router.push('/profile/terms')}
          icon={<Ionicons name="document-text-outline" size={24} color={theme.textPrimary.get()} />}
        />
        <ListItem
          title="よくある質問"
          backgroundColor="$cardBg"
          borderRadius="$4"
          onPress={() => router.push('/profile/faq')}
          icon={
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={theme.textPrimary.get()}
            />
          }
        />
        <ListItem
          title="お問い合わせ"
          backgroundColor="$cardBg"
          borderRadius="$4"
          onPress={() => Linking.openURL(getContactMailtoLink())}
          icon={<Ionicons name="mail-outline" size={24} color={theme.textPrimary.get()} />}
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
          scale: 0.98,
        }}
      >
        <Text color="$red10" fontSize="$3">
          ログアウト
        </Text>
      </Button>
    </YStack>
  );
}
