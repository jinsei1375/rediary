import { SubscriptionPlan } from '@/types/database';
import { getTodayString } from '@/utils/dateUtils';
import { supabase } from './supabase';

const FREE_PLAN_REVIEW_LIMIT_PER_DAY = 1;

export enum FeatureLimitCode {
  DIARY_SAVE = 'FREE_PLAN_DIARY_LIMIT',
  REVIEW_DAILY = 'FREE_PLAN_REVIEW_LIMIT',
}

export class FeatureLimitError extends Error {
  code: FeatureLimitCode;

  constructor(code: FeatureLimitCode, message: string) {
    super(message);
    this.name = 'FeatureLimitError';
    this.code = code;
  }
}

const getTodayRangeIso = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

export class FeatureLimitService {
  static async ensureDiarySaveAllowed(plan: SubscriptionPlan, entryDate: string): Promise<void> {
    if (plan !== SubscriptionPlan.FREE) {
      return;
    }

    const today = getTodayString();
    if (entryDate === today) {
      return;
    }

    throw new FeatureLimitError(
      FeatureLimitCode.DIARY_SAVE,
      '無料プランでは当日分の日記しか保存できません。',
    );
  }

  static async checkReviewAttemptStatus(
    userId: string,
    plan: SubscriptionPlan,
  ): Promise<{
    isAllowed: boolean;
    isPremium: boolean;
    todayCount: number;
    limit: number;
  }> {
    if (plan !== SubscriptionPlan.FREE) {
      return { isAllowed: true, isPremium: true, todayCount: 0, limit: 0 };
    }

    const { start, end } = getTodayRangeIso();
    const { count, error } = await supabase
      .from('exercise_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('attempted_at', start)
      .lte('attempted_at', end);

    if (error) {
      console.error('Error checking review attempt status:', error);
      return {
        isAllowed: true,
        isPremium: false,
        todayCount: 0,
        limit: FREE_PLAN_REVIEW_LIMIT_PER_DAY,
      };
    }

    const todayCount = count ?? 0;
    return {
      isAllowed: todayCount < FREE_PLAN_REVIEW_LIMIT_PER_DAY,
      isPremium: false,
      todayCount,
      limit: FREE_PLAN_REVIEW_LIMIT_PER_DAY,
    };
  }

  static async ensureReviewAttemptAllowed(userId: string, plan: SubscriptionPlan): Promise<void> {
    const status = await this.checkReviewAttemptStatus(userId, plan);

    if (!status.isAllowed) {
      throw new FeatureLimitError(
        FeatureLimitCode.REVIEW_DAILY,
        '無料プランでは復習問題は1日1回までです。',
      );
    }
  }
}
