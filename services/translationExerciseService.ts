import type { TranslationExerciseInsert, TranslationExerciseUpdate } from '@/types/database';
import { supabase } from './supabase';

export class TranslationExerciseService {
  /**
   * 翻訳問題を作成
   */
  static async create(exercise: TranslationExerciseInsert) {
    const { data, error } = await supabase
      .from('translation_exercises')
      .insert(exercise)
      .select()
      .single();
    return { data, error };
  }

  /**
   * 複数の翻訳問題を一括作成
   */
  static async createMany(exercises: TranslationExerciseInsert[]) {
    const { data, error } = await supabase.from('translation_exercises').insert(exercises).select();
    return { data, error };
  }

  /**
   * IDで翻訳問題を取得
   */
  static async getById(id: string, userId: string) {
    const { data, error } = await supabase
      .from('translation_exercises')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    return { data, error };
  }

  /**
   * ユーザーの全ての翻訳問題を取得（exercise_attemptsも含む）
   */
  static async getByUserWithAttempts(userId: string) {
    const { data, error } = await supabase
      .from('translation_exercises')
      .select(
        `
        *,
        exercise_attempts!exercise_attempts_exercise_id_fkey (
          id,
          remembered,
          attempted_at
        )
      `,
      )
      .eq('user_id', userId)
      .order('scheduled_date', { ascending: true });
    return { data, error };
  }

  /**
   * ユーザーの全ての翻訳問題を取得
   */
  static async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('translation_exercises')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_date', { ascending: true });
    return { data, error };
  }

  /**
   * スケジュール日付で翻訳問題を取得（復習対象）
   */
  static async getScheduled(userId: string, upToDate?: string) {
    const targetDate = upToDate || new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('translation_exercises')
      .select('*')
      .eq('user_id', userId)
      .lte('scheduled_date', targetDate)
      .order('scheduled_date', { ascending: true });
    return { data, error };
  }

  /**
   * 翻訳問題を更新
   */
  static async update(id: string, updates: TranslationExerciseUpdate, userId: string) {
    const { data, error } = await supabase
      .from('translation_exercises')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    return { data, error };
  }

  /**
   * 翻訳問題を削除
   */
  static async delete(id: string, userId: string) {
    const { error } = await supabase
      .from('translation_exercises')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    return { error };
  }
}
