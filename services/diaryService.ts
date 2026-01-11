import type { DiaryEntryInsert, DiaryEntryUpdate } from '@/types';
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
      .single();
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
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('entry_date', startDate)
      .lte('entry_date', endDate)
      .order('entry_date', { ascending: true });

    return { data, error };
  }
}
