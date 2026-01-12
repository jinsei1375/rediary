import type { DiaryEntryInsert, DiaryEntryUpdate } from '@/types/database';
import { supabase } from './supabase';

export class DiaryService {
  static async create(entry: DiaryEntryInsert) {
    const { data, error } = await supabase.from('diary_entries').insert(entry).select().single();
    return { data, error };
  }

  static async getById(id: string) {
    const { data, error } = await supabase.from('diary_entries').select('*').eq('id', id).single();
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

  static async update(id: string, updates: DiaryEntryUpdate) {
    const { data, error } = await supabase
      .from('diary_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }

  static async delete(id: string) {
    const { error } = await supabase.from('diary_entries').delete().eq('id', id);
    return { error };
  }

  static async getByMonth(userId: string, year: number, month: number) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    const startDate = firstDay.toISOString().split('T')[0];
    const endDate = lastDay.toISOString().split('T')[0];

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
   * カレンダー表示用：指定月の前後1ヶ月を含む3ヶ月分のタイトルと日付を取得
   */
  static async getTitlesForMonth(userId: string, year: number, month: number) {
    // 前月の1日
    const startDate = new Date(year, month - 2, 1);
    // 次月の最終日
    const endDate = new Date(year, month + 1, 0);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('diary_entries')
      .select('entry_date, title')
      .eq('user_id', userId)
      .gte('entry_date', startDateStr)
      .lte('entry_date', endDateStr);

    return { data, error };
  }
}
