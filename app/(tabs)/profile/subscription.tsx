import { Header } from '@/components/common/Header';
import { SecondaryButton } from '@/components/common/PrimaryButton';
import { PricingCard } from '@/components/subscription/PricingCard';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { SubscriptionPlan } from '@/types/database';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Spinner, Text, YStack } from 'tamagui';

export default function SubscriptionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const plan = useSubscriptionStore((state) => state.plan);
  const isPremium = useSubscriptionStore((state) => state.isPremium());
  const offerings = useSubscriptionStore((state) => state.offerings);
  const expiresAt = useSubscriptionStore((state) => state.expiresAt);
  const loading = useSubscriptionStore((state) => state.loading);
  const subscribe = useSubscriptionStore((state) => state.subscribe);
  const restore = useSubscriptionStore((state) => state.restore);

  const handleBack = () => {
    if (params.returnTo) {
      router.push(params.returnTo as any);
    } else {
      router.back();
    }
  };

  // プラン名の表示用ヘルパー (MVP: ProとFreeのみ)
  const getPlanDisplayName = () => {
    return plan === SubscriptionPlan.PRO ? 'Proプラン' : '無料プラン';
  };

  if (loading && !offerings) {
    return (
      <YStack flex={1} backgroundColor="$bgPrimary">
        <Header title="利用プラン" onBack={handleBack} />
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="$primary" />
        </YStack>
      </YStack>
    );
  }

  const monthlyPackage =
    offerings?.current?.availablePackages.find((pkg) => pkg.identifier === 'monthly') ||
    offerings?.current?.availablePackages[0]; // 見つからない場合は最初のパッケージを使用

  return (
    <YStack flex={1} backgroundColor="$bgPrimary">
      <Header title="利用プラン" onBack={handleBack} />
      <ScrollView flex={1}>
        <YStack padding="$6" gap="$6">
          {/* 利用中のプラン */}
          <YStack gap="$3">
            <Text fontSize="$4" color="$textSecondary" textAlign="center">
              利用中のプラン
            </Text>
            <YStack backgroundColor="$cardBg" borderRadius="$4" padding="$4" gap="$2">
              {isPremium ? (
                <YStack gap="$2">
                  <Text fontSize="$4" color="$textPrimary" fontWeight="500">
                    {getPlanDisplayName()}
                  </Text>
                  {expiresAt && (
                    <Text fontSize="$3" color="$textSecondary">
                      次回更新日: {new Date(expiresAt).toLocaleDateString('ja-JP')}
                    </Text>
                  )}
                  {monthlyPackage && (
                    <Text fontSize="$3" color="$textSecondary">
                      請求額: {monthlyPackage.product.priceString}/月
                    </Text>
                  )}
                </YStack>
              ) : (
                <Text fontSize="$4" color="$textSecondary">
                  {getPlanDisplayName()}
                </Text>
              )}
            </YStack>
          </YStack>

          {/* プラン一覧 */}
          <YStack gap="$3">
            <Text fontSize="$4" color="$textSecondary" textAlign="center">
              プラン一覧
            </Text>

            {/* 月額プラン */}
            {monthlyPackage ? (
              <PricingCard
                title="Proプラン(月額)"
                price={monthlyPackage.product.priceString}
                features={[
                  '過去の日記も自由に編集可能',
                  '復習問題が回数無制限で実施可能',
                  'AI分析機能が利用可能',
                ]}
                onPress={() => subscribe(monthlyPackage)}
                loading={loading}
                isCurrentPlan={isPremium}
              />
            ) : (
              <YStack backgroundColor="$cardBg" borderRadius="$4" padding="$6" alignItems="center">
                <Text fontSize="$4" color="$textSecondary">
                  プランの読み込みに失敗しました
                </Text>
              </YStack>
            )}
            {/* 無料プラン */}
            <PricingCard
              title="無料プラン"
              price="¥0"
              features={['ReDiaryの基本的な機能を利用できます']}
              onPress={() => {}}
              loading={false}
              disabled={true}
              isCurrentPlan={!isPremium}
              hideButton={isPremium}
            />
          </YStack>

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
