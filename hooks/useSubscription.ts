import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionService } from '@/services/subscriptionService';
import { SubscriptionPlan } from '@/types/database';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { PurchasesOfferings, PurchasesPackage } from 'react-native-purchases';

export function useSubscription() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<SubscriptionPlan>(SubscriptionPlan.FREE);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [loading, setLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  // プラン判定用のヘルパー (MVP: Proのみ)
  const isPremium = plan === SubscriptionPlan.PRO;
  const isPro = plan === SubscriptionPlan.PRO;
  const isEnterprise = false; // MVP未対応

  useEffect(() => {
    if (user?.id) {
      initializeSubscription();
    }
  }, [user?.id]);

  const initializeSubscription = async () => {
    try {
      setLoading(true);

      // RevenueCat初期化
      await SubscriptionService.initialize(user!.id);

      // ステータス確認
      const status = await SubscriptionService.checkSubscriptionStatus();
      setPlan(status.plan);
      setExpiresAt(status.expiresAt);

      // プラン取得
      const availableOfferings = await SubscriptionService.getOfferings();
      setOfferings(availableOfferings);
    } catch (error) {
      console.error('Subscription initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async (pkg: PurchasesPackage) => {
    try {
      setLoading(true);
      await SubscriptionService.purchase(pkg);

      // ステータス再取得
      const status = await SubscriptionService.checkSubscriptionStatus();
      setPlan(status.plan);
      setExpiresAt(status.expiresAt);

      Alert.alert('登録完了', 'プレミアムプランに登録しました！');
    } catch (error: any) {
      Alert.alert('エラー', error.message || '購入に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const restore = async () => {
    try {
      setLoading(true);
      await SubscriptionService.restorePurchases();

      const status = await SubscriptionService.checkSubscriptionStatus();
      setPlan(status.plan);
      setExpiresAt(status.expiresAt);

      Alert.alert('復元完了', '購入を復元しました');
    } catch (error: any) {
      Alert.alert('エラー', '復元に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return {
    plan,
    isPremium,
    isPro,
    isEnterprise,
    offerings,
    subscribe,
    restore,
    loading,
    expiresAt,
  };
}
