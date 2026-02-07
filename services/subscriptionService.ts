import { APP_NAME_PRO } from '@/constants/app';
import { SubscriptionPlan } from '@/types/database';
import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOfferings,
  PurchasesPackage,
} from 'react-native-purchases';
import { supabase } from './supabase';

const REVENUECAT_API_KEY = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS,
  android: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID,
};

export class SubscriptionService {
  /**
   * RevenueCat初期化
   */
  static async initialize(userId: string): Promise<void> {
    // デバッグログを有効化
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    const apiKey = Platform.select(REVENUECAT_API_KEY);
    if (!apiKey) {
      throw new Error('RevenueCat API key not found');
    }

    await Purchases.configure({
      apiKey,
      appUserID: userId,
    });
  }

  /**
   * 課金プラン取得
   */
  static async getOfferings(): Promise<PurchasesOfferings | null> {
    try {
      const offerings = await Purchases.getOfferings();

      if (!offerings.current) {
        console.warn('[RevenueCat] No current offering found');
      }

      return offerings;
    } catch (error) {
      console.error('[RevenueCat] Error fetching offerings:', error);
      return null;
    }
  }

  /**
   * 購入処理
   */
  static async purchase(pkg: PurchasesPackage): Promise<CustomerInfo> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      await this.syncWithSupabase(customerInfo);
      return customerInfo;
    } catch (error: any) {
      if (error.userCancelled) {
        throw new Error('購入がキャンセルされました');
      }
      throw error;
    }
  }

  /**
   * 購入復元
   */
  static async restorePurchases(): Promise<CustomerInfo> {
    const customerInfo = await Purchases.restorePurchases();
    await this.syncWithSupabase(customerInfo);
    return customerInfo;
  }

  /**
   * RevenueCatのentitlementからプラン種別を判定 (MVP: proのみ)
   */
  private static getPlanFromEntitlements(customerInfo: CustomerInfo): SubscriptionPlan {
    // RevenueCatで設定したEntitlement識別子を確認
    if (
      customerInfo.entitlements.active[APP_NAME_PRO] ||
      customerInfo.entitlements.active['pro']
    ) {
      return SubscriptionPlan.PRO;
    }
    return SubscriptionPlan.FREE;
  }

  /**
   * サブスクリプション状態確認
   */
  static async checkSubscriptionStatus(): Promise<{
    plan: SubscriptionPlan;
    expiresAt: string | null;
  }> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const plan = this.getPlanFromEntitlements(customerInfo);
      const expiresAt =
        customerInfo.entitlements.active['ReDiary Pro']?.expirationDate ||
        customerInfo.entitlements.active['pro']?.expirationDate ||
        null;

      // Supabaseと同期
      await this.syncWithSupabase(customerInfo);

      return { plan, expiresAt };
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return { plan: SubscriptionPlan.FREE, expiresAt: null };
    }
  }

  /**
   * Supabaseと同期
   */
  private static async syncWithSupabase(customerInfo: CustomerInfo): Promise<void> {
    const plan = this.getPlanFromEntitlements(customerInfo);
    const expiresAt =
      customerInfo.entitlements.active['ReDiary Pro']?.expirationDate ||
      customerInfo.entitlements.active['pro']?.expirationDate ||
      null;

    const { error } = await supabase
      .from('user_settings')
      .update({
        subscription_plan: plan,
        premium_expires_at: expiresAt,
      })
      .eq('user_id', customerInfo.originalAppUserId);

    if (error) {
      console.error('Error syncing with Supabase:', error);
    }
  }
}
