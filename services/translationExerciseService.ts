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
  static async getById(id: string) {
    const { data, error } = await supabase
      .from('translation_exercises')
      .select('*')
      .eq('id', id)
      .single();
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
      .order('created_at', { ascending: false });
    return { data, error };
  }

  /**
   * 未完了の翻訳問題を取得
   */
  static async getIncomplete(userId: string) {
    const { data, error } = await supabase
      .from('translation_exercises')
      .select('*')
      .eq('user_id', userId)
      .eq('is_completed', false)
      .order('created_at', { ascending: false });
    return { data, error };
  }

  /**
   * 完了済みの翻訳問題を取得
   */
  static async getCompleted(userId: string) {
    const { data, error } = await supabase
      .from('translation_exercises')
      .select('*')
      .eq('user_id', userId)
      .eq('is_completed', true)
      .order('completed_at', { ascending: false });
    return { data, error };
  }

  /**
   * 翻訳問題を更新
   */
  static async update(id: string, updates: TranslationExerciseUpdate) {
    const { data, error } = await supabase
      .from('translation_exercises')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }

  /**
   * 翻訳問題を完了にする
   */
  static async complete(id: string, userTranslation: string) {
    const { data, error } = await supabase
      .from('translation_exercises')
      .update({
        is_completed: true,
        user_translation: userTranslation,
        completed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }

  /**
   * 翻訳問題を削除
   */
  static async delete(id: string) {
    const { error } = await supabase.from('translation_exercises').delete().eq('id', id);
    return { error };
  }
}
