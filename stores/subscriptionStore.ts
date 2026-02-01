import { SubscriptionService } from '@/services/subscriptionService';
import { SubscriptionPlan } from '@/types/database';
import { Alert, AppState, AppStateStatus } from 'react-native';
import { PurchasesOfferings, PurchasesPackage } from 'react-native-purchases';
import { create } from 'zustand';

interface SubscriptionState {
  // State
  plan: SubscriptionPlan;
  expiresAt: string | null;
  offerings: PurchasesOfferings | null;
  loading: boolean;
  initialized: boolean;

  // Computed values (getters)
  isPremium: () => boolean;
  isPro: () => boolean;

  // Actions
  initialize: (userId: string) => Promise<void>;
  syncSubscription: () => Promise<void>;
  subscribe: (pkg: PurchasesPackage) => Promise<void>;
  restore: () => Promise<void>;
  reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  // Initial state
  plan: SubscriptionPlan.FREE,
  expiresAt: null,
  offerings: null,
  loading: false,
  initialized: false,

  // Computed values
  isPremium: () => get().plan === SubscriptionPlan.PRO,
  isPro: () => get().plan === SubscriptionPlan.PRO,

  // Initialize RevenueCat and sync
  initialize: async (userId: string) => {
    if (get().initialized) return;

    try {
      set({ loading: true });

      // RevenueCat初期化
      await SubscriptionService.initialize(userId);

      // ステータス確認 & Supabase同期
      const status = await SubscriptionService.checkSubscriptionStatus();
      const availableOfferings = await SubscriptionService.getOfferings();

      set({
        plan: status.plan,
        expiresAt: status.expiresAt,
        offerings: availableOfferings,
        initialized: true,
      });

      // アプリ状態変化の監視を設定
      setupAppStateListener(userId);
    } catch (error) {
      console.error('Subscription initialization error:', error);
    } finally {
      set({ loading: false });
    }
  },

  // Sync subscription status
  syncSubscription: async () => {
    try {
      const status = await SubscriptionService.checkSubscriptionStatus();
      set({
        plan: status.plan,
        expiresAt: status.expiresAt,
      });
    } catch (error) {
      console.error('Subscription sync error:', error);
    }
  },

  // Purchase subscription
  subscribe: async (pkg: PurchasesPackage) => {
    try {
      set({ loading: true });
      await SubscriptionService.purchase(pkg);

      // ステータス再取得
      await get().syncSubscription();

      Alert.alert('登録完了', 'Proプランに登録しました！');
    } catch (error: any) {
      Alert.alert('エラー', error.message || '購入に失敗しました');
    } finally {
      set({ loading: false });
    }
  },

  // Restore purchases
  restore: async () => {
    try {
      set({ loading: true });
      await SubscriptionService.restorePurchases();

      await get().syncSubscription();

      Alert.alert('復元完了', 'Proプランの購入を復元しました');
    } catch (error: any) {
      Alert.alert('エラー', '復元に失敗しました');
    } finally {
      set({ loading: false });
    }
  },

  // Reset state (on logout)
  reset: () => {
    set({
      plan: SubscriptionPlan.FREE,
      expiresAt: null,
      offerings: null,
      loading: false,
      initialized: false,
    });
  },
}));

// アプリがフォアグラウンドに戻った時に同期
let appStateSubscription: any = null;

function setupAppStateListener(userId: string) {
  if (appStateSubscription) {
    appStateSubscription.remove();
  }

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active' && userId) {
      useSubscriptionStore.getState().syncSubscription();
    }
  };

  appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
}
