import { Header } from '@/components/common/Header';
import { SecondaryButton } from '@/components/common/PrimaryButton';
import { PricingCard } from '@/components/subscription/PricingCard';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionPlan } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Spinner, Text, XStack, YStack } from 'tamagui';

export default function SubscriptionScreen() {
  const { plan, isPremium, offerings, subscribe, restore, loading, expiresAt } = useSubscription();

  // プラン名の表示用ヘルパー (MVP: ProとFreeのみ)
  const getPlanDisplayName = () => {
    return plan === SubscriptionPlan.PRO ? 'プロ会員' : '無料会員';
  };

  if (loading && !offerings) {
    return (
      <YStack flex={1} backgroundColor="$bgPrimary">
        <Header title="プレミアムプラン" onBack={() => router.back()} />
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="$primary" />
        </YStack>
      </YStack>
    );
  }

  if (isPremium) {
    return (
      <YStack flex={1} backgroundColor="$bgPrimary">
        <Header title="プレミアムプラン" onBack={() => router.push('/(tabs)/profile')} />
        <ScrollView flex={1}>
          <YStack padding="$6" gap="$4" alignItems="center" paddingTop="$8">
            <Ionicons name="checkmark-circle" size={80} color="#10B981" />
            <Text fontSize="$8" fontWeight="bold" color="$textPrimary">
              {getPlanDisplayName()}
            </Text>
            <Text fontSize="$4" color="$textSecondary" textAlign="center">
              すべての機能をご利用いただけます
            </Text>
            {expiresAt && (
              <Text fontSize="$3" color="$textTertiary" textAlign="center">
                次回更新日: {new Date(expiresAt).toLocaleDateString('ja-JP')}
              </Text>
            )}

            <YStack
              marginTop="$6"
              backgroundColor="$cardBg"
              borderRadius="$4"
              padding="$4"
              gap="$3"
              width="100%"
            >
              <Text fontSize="$5" fontWeight="600" color="$textPrimary">
                プレミアム特典
              </Text>
              <XStack alignItems="center" gap="$2">
                <Ionicons name="sparkles" size={20} color="#10B981" />
                <Text fontSize="$4" color="$textPrimary">
                  AI添削無制限
                </Text>
              </XStack>
              <XStack alignItems="center" gap="$2">
                <Ionicons name="book" size={20} color="#10B981" />
                <Text fontSize="$4" color="$textPrimary">
                  復習問題無制限
                </Text>
              </XStack>
              <XStack alignItems="center" gap="$2">
                <Ionicons name="stats-chart" size={20} color="#10B981" />
                <Text fontSize="$4" color="$textPrimary">
                  高度な統計機能
                </Text>
              </XStack>
              <XStack alignItems="center" gap="$2">
                <Ionicons name="cloud-download" size={20} color="#10B981" />
                <Text fontSize="$4" color="$textPrimary">
                  PDF出力機能
                </Text>
              </XStack>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    );
  }

  const monthlyPackage =
    offerings?.current?.availablePackages.find((pkg) => pkg.identifier === 'monthly') ||
    offerings?.current?.availablePackages[0]; // 見つからない場合は最初のパッケージを使用

  return (
    <YStack flex={1} backgroundColor="$bgPrimary">
      <Header title="プレミアムプラン" onBack={() => router.back()} />
      <ScrollView flex={1}>
        <YStack padding="$6" gap="$6">
          <YStack gap="$3" alignItems="center">
            <Text fontSize="$4" color="$textSecondary" textAlign="center">
              より充実した学習体験を
            </Text>
          </YStack>

          {monthlyPackage ? (
            <PricingCard
              title="月額プラン"
              price={monthlyPackage.product.priceString}
              features={['AI添削無制限', '復習問題無制限', '高度な統計機能', 'PDF出力機能']}
              onPress={() => subscribe(monthlyPackage)}
              loading={loading}
            />
          ) : (
            <YStack backgroundColor="$cardBg" borderRadius="$4" padding="$6" alignItems="center">
              <Text fontSize="$4" color="$textSecondary">
                プランの読み込みに失敗しました
              </Text>
            </YStack>
          )}

          <SecondaryButton onPress={restore} marginTop="$4" disabled={loading}>
            <Text color="$textPrimary">{loading ? '処理中...' : '購入を復元'}</Text>
          </SecondaryButton>

          <Text fontSize="$2" color="$textTertiary" textAlign="center" marginTop="$4">
            自動更新されます。いつでもキャンセル可能です。
          </Text>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
