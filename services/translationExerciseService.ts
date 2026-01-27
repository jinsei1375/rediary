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

  /**
   * 今日の1問を取得
   * 条件：
   * 1. 「覚えた」にチェックが入っていないもの（remembered = false or null）
   * 2. exercise_attemptsで解いたのが一番古い、または解いたことがないもの
   * 3. 条件に合うものがなければランダム
   */
  static async getDailyQuestion(userId: string) {
    // すべての問題を取得（attemptsも含む）
    const { data: exercises, error } = await supabase
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
      .eq('user_id', userId);

    if (error || !exercises || exercises.length === 0) {
      return { data: null, error };
    }

    // 1. 「覚えた」にチェックが入っていないものを抽出
    const notRememberedExercises = exercises.filter((ex: any) => {
      const attempts = ex.exercise_attempts || [];
      // 覚えたものが1つでもあればfalse
      const hasRemembered = attempts.some((att: any) => att.remembered === true);
      return !hasRemembered;
    });

    if (notRememberedExercises.length === 0) {
      // すべて覚えている場合はランダムに1つ返す
      const randomIndex = Math.floor(Math.random() * exercises.length);
      const { exercise_attempts, ...exercise } = exercises[randomIndex];
      return { data: exercise, error: null };
    }

    // 2. 解いたことがないもの、または一番古い解答日時のものを探す
    let oldestExercise = notRememberedExercises[0];
    let oldestDate: Date | null = null;

    for (const ex of notRememberedExercises) {
      const attempts = ex.exercise_attempts || [];
      if (attempts.length === 0) {
        // 解いたことがない問題があればそれを優先
        oldestExercise = ex;
        break;
      }

      // 最古の解答日時を取得
      const dates = attempts.map((att: any) => new Date(att.attempted_at));
      const minDate = new Date(Math.min(...dates.map((d: Date) => d.getTime())));

      if (!oldestDate || minDate < oldestDate) {
        oldestDate = minDate;
        oldestExercise = ex;
      }
    }

    // exercise_attemptsを除外して返す
    const { exercise_attempts, ...exercise } = oldestExercise;
    return { data: exercise, error: null };
  }

  /**
   * ユーザーの登録済み問題数を取得
   */
  static async getTotalCount(userId: string) {
    const { count, error } = await supabase
      .from('translation_exercises')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    return { count, error };
  }
}
