import type { DiaryEntryInsert, DiaryEntryUpdate } from '@/types/database';
import { SubscriptionPlan } from '@/types/database';
import { formatDateToString } from '@/utils/dateUtils';
import { FeatureLimitService } from './featureLimitService';
import { supabase } from './supabase';

export class DiaryService {
  static async create(entry: DiaryEntryInsert, plan: SubscriptionPlan) {
    await FeatureLimitService.ensureDiarySaveAllowed(plan, entry.entry_date);

    const { data, error } = await supabase.from('diary_entries').insert(entry).select().single();
    return { data, error };
  }

  static async getById(id: string, userId: string) {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    return { data, error };
  }

  static async getByDate(userId: string, date: string) {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('entry_date', date)
      .maybeSingle();
    return { data, error };
  }

  static async getByUser(userId: string, limit?: number) {
    let query = supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    return { data, error };
  }

  static async update(
    id: string,
    updates: DiaryEntryUpdate,
    userId: string,
    plan: SubscriptionPlan,
    entryDate?: string,
  ) {
    let targetEntryDate: string;

    if (entryDate) {
      targetEntryDate = entryDate;
    } else {
      const { data: existingEntry, error: fetchError } = await this.getById(id, userId);
      if (fetchError || !existingEntry) {
        return { data: null, error: fetchError };
      }
      targetEntryDate = existingEntry.entry_date;
    }

    await FeatureLimitService.ensureDiarySaveAllowed(plan, targetEntryDate);

    const { data, error } = await supabase
      .from('diary_entries')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    return { data, error };
  }

  static async delete(id: string, userId: string) {
    const { error } = await supabase
      .from('diary_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    return { error };
  }

  static async getByMonth(userId: string, year: number, month: number) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    const startDate = formatDateToString(firstDay);
    const endDate = formatDateToString(lastDay);

    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('entry_date', startDate)
      .lte('entry_date', endDate)
      .order('entry_date', { ascending: true });

    return { data, error };
  }

  /**
   * カレンダー表示用：指定月の前後1ヶ月を含む3ヶ月分のタイトルと日付、AI添削の有無を取得
   */
  static async getTitlesForMonth(userId: string, year: number, month: number) {
    // 前月の1日
    const startDate = new Date(year, month - 2, 1);
    // 次月の最終日
    const endDate = new Date(year, month + 1, 0);

    const startDateStr = formatDateToString(startDate);
    const endDateStr = formatDateToString(endDate);

    const { data, error } = await supabase
      .from('diary_entries')
      .select(
        `
        entry_date, 
        title,
        ai_corrections(id)
      `,
      )
      .eq('user_id', userId)
      .gte('entry_date', startDateStr)
      .lte('entry_date', endDateStr);

    return { data, error };
  }

  /**
   * ユーザーの日記総数を取得
   */
  static async getTotalCount(userId: string) {
    const { count, error } = await supabase
      .from('diary_entries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    return { count: count ?? 0, error };
  }

  /**
   * AI添削未実施の日記一覧を取得（最新順、デフォルト5件）
   */
  static async getUncorrectedDiaries(userId: string, limit: number = 5) {
    const { data, error } = await supabase
      .from('diary_entries')
      .select(
        `
        id,
        title,
        entry_date,
        created_at,
        ai_corrections(id)
      `,
      )
      .eq('user_id', userId)
      .order('entry_date', { ascending: false })
      .limit(limit);

    // ai_correctionsが存在しないエントリのみフィルタリング
    const uncorrectedData = data?.filter((entry: any) => {
      return !entry.ai_corrections || entry.ai_corrections.length === 0;
    });

    return { data: uncorrectedData ?? [], error };
  }
}
