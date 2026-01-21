import { Header } from '@/components/common/Header';
import { useAuth } from '@/contexts/AuthContext';
import { getUserSettings, saveUserSettings } from '@/services/userSettingsService';
import { Language } from '@/types/database';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Button, Text, XStack, YStack } from 'tamagui';

export default function ProfileSettingsScreen() {
  const { user } = useAuth();
  const [weekStart, setWeekStart] = useState<'sun' | 'mon'>('sun');
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [nativeLanguage, setNativeLanguage] = useState<Language>(Language.JA);
  const [targetLanguage, setTargetLanguage] = useState<Language>(Language.EN);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const settings = await getUserSettings(user.id);

      if (settings) {
        setWeekStart(settings.week_start);
        setViewMode(settings.view_mode);
        setTheme(settings.theme);
        setNativeLanguage(settings.native_language);
        setTargetLanguage(settings.target_language);
      }
    } catch (e) {
      console.error('Load settings error', e);
      Alert.alert('エラー', '設定の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert('エラー', 'ユーザー情報が取得できません');
      return;
    }

    try {
      setSaving(true);
      await saveUserSettings(user.id, {
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
          <Button
            size="$5"
            backgroundColor="$primary"
            color="$background"
            onPress={handleSave}
            disabled={saving}
            marginTop="$4"
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text color="$background" fontWeight="600">
                保存
              </Text>
            )}
          </Button>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
