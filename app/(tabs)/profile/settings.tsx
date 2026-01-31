import { Header } from '@/components/common/Header';
import { SaveButton } from '@/components/common/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { AuthService } from '@/services/authService';
import { Language } from '@/types/database';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Button, Text, XStack, YStack } from 'tamagui';

export default function ProfileSettingsScreen() {
  const { settings, loading, updateSettings } = useSettings();
  const { signOut } = useAuth();
  const [weekStart, setWeekStart] = useState<'sun' | 'mon'>('sun');
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [nativeLanguage, setNativeLanguage] = useState<Language>(Language.JA);
  const [targetLanguage, setTargetLanguage] = useState<Language>(Language.EN);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (settings) {
      setWeekStart(settings.week_start);
      setViewMode(settings.view_mode);
      setTheme(settings.theme);
      setNativeLanguage(settings.native_language);
      setTargetLanguage(settings.target_language);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSettings({
        week_start: weekStart,
        view_mode: viewMode,
        theme: theme,
        native_language: nativeLanguage,
        target_language: targetLanguage,
      });
      Alert.alert('成功', '設定を保存しました');
    } catch (e) {
      console.error('Save settings error', e);
      Alert.alert('エラー', '設定の保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'アカウント削除',
      'アカウントを削除すると、全ての日記、AI添削、翻訳問題などのデータが完全に削除されます。この操作は取り消せません。\n\n本当に削除しますか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '削除する',
          style: 'destructive',
          onPress: () => {
            // 2段階確認
            Alert.alert('最終確認', '本当にアカウントを削除してもよろしいですか？', [
              {
                text: 'キャンセル',
                style: 'cancel',
              },
              {
                text: '削除',
                style: 'destructive',
                onPress: async () => {
                  try {
                    setDeleting(true);
                    const { error } = await AuthService.deleteAccount();
                    if (error) {
                      throw error;
                    }
                    // サインアウトして初期画面へ
                    await signOut();
                    router.replace('/login');
                  } catch (e) {
                    console.error('Delete account error:', e);
                    Alert.alert('エラー', 'アカウントの削除に失敗しました');
                  } finally {
                    setDeleting(false);
                  }
                },
              },
            ]);
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <YStack flex={1} backgroundColor="$background" alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" />
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <Header title="個人設定" onBack={() => router.push('/(tabs)/profile')} />

      <ScrollView>
        <YStack padding="$4" gap="$4">
          {/* 週の開始曜日 */}
          <YStack backgroundColor="$backgroundStrong" padding="$4" borderRadius="$4" gap="$3">
            <Text fontSize="$5" fontWeight="600">
              週の開始曜日
            </Text>
            <XStack gap="$2">
              <Button
                flex={1}
                onPress={() => setWeekStart('sun')}
                backgroundColor={weekStart === 'sun' ? '$primary' : '$background'}
                borderWidth={1}
                borderColor={weekStart === 'sun' ? '$primary' : '$borderColor'}
              >
                <Text color={weekStart === 'sun' ? '$background' : '$color'}>日曜日</Text>
              </Button>

              <Button
                flex={1}
                onPress={() => setWeekStart('mon')}
                backgroundColor={weekStart === 'mon' ? '$primary' : '$background'}
                borderWidth={1}
                borderColor={weekStart === 'mon' ? '$primary' : '$borderColor'}
              >
                <Text color={weekStart === 'mon' ? '$background' : '$color'}>月曜日</Text>
              </Button>
            </XStack>
          </YStack>

          {/* 表示モード */}
          <YStack backgroundColor="$backgroundStrong" padding="$4" borderRadius="$4" gap="$3">
            <Text fontSize="$5" fontWeight="600">
              表示モード
            </Text>
            <XStack gap="$2">
              <Button
                flex={1}
                onPress={() => setViewMode('month')}
                backgroundColor={viewMode === 'month' ? '$primary' : '$background'}
                borderWidth={1}
                borderColor={viewMode === 'month' ? '$primary' : '$borderColor'}
              >
                <Text color={viewMode === 'month' ? '$background' : '$color'}>月表示</Text>
              </Button>

              <Button
                flex={1}
                onPress={() => setViewMode('week')}
                backgroundColor={viewMode === 'week' ? '$primary' : '$background'}
                borderWidth={1}
                borderColor={viewMode === 'week' ? '$primary' : '$borderColor'}
              >
                <Text color={viewMode === 'week' ? '$background' : '$color'}>週表示</Text>
              </Button>
            </XStack>
          </YStack>

          {/* テーマ */}
          <YStack backgroundColor="$backgroundStrong" padding="$4" borderRadius="$4" gap="$3">
            <Text fontSize="$5" fontWeight="600">
              テーマ
            </Text>
            <XStack gap="$2">
              <Button
                flex={1}
                onPress={() => setTheme('light')}
                backgroundColor={theme === 'light' ? '$primary' : '$background'}
                borderWidth={1}
                borderColor={theme === 'light' ? '$primary' : '$borderColor'}
              >
                <Text color={theme === 'light' ? '$background' : '$color'}>ライト</Text>
              </Button>

              <Button
                flex={1}
                onPress={() => setTheme('dark')}
                backgroundColor={theme === 'dark' ? '$primary' : '$background'}
                borderWidth={1}
                borderColor={theme === 'dark' ? '$primary' : '$borderColor'}
              >
                <Text color={theme === 'dark' ? '$background' : '$color'}>ダーク</Text>
              </Button>

              <Button
                flex={1}
                onPress={() => setTheme('system')}
                backgroundColor={theme === 'system' ? '$primary' : '$background'}
                borderWidth={1}
                borderColor={theme === 'system' ? '$primary' : '$borderColor'}
              >
                <Text color={theme === 'system' ? '$background' : '$color'}>システム</Text>
              </Button>
            </XStack>
          </YStack>

          {/* 保存ボタン */}
          <SaveButton loading={saving} onPress={handleSave} marginTop="$4" />

          {/* アカウント削除 */}
          <YStack alignItems="center" marginTop="$12" marginBottom="$6" paddingTop="$8">
            <Button
              chromeless
              disabled={deleting}
              onPress={handleDeleteAccount}
              paddingVertical="$2"
            >
              {deleting ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text fontSize="$2" color="$gray9" textDecorationLine="underline">
                  アカウントを削除
                </Text>
              )}
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
