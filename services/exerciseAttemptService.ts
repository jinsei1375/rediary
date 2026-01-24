import type { ExerciseAttemptInsert } from '@/types/database';
import { supabase } from './supabase';

/**
 * 練習問題の回答履歴を保存
 */
export const createExerciseAttempt = async (
  userId: string,
  exerciseId: string,
  userAnswer: string,
  remembered: boolean | null = null,
) => {
  const attempt: ExerciseAttemptInsert = {
    user_id: userId,
    exercise_id: exerciseId,
    user_answer: userAnswer,
    remembered: remembered,
  };

  return await supabase.from('exercise_attempts').insert(attempt).select().single();
};

/**
 * 練習問題の回答履歴を更新（rememberedフラグをセット）
 */
export const updateExerciseAttempt = async (
  attemptId: string,
  remembered: boolean,
  userId: string,
) => {
  return await supabase
    .from('exercise_attempts')
    .update({ remembered })
    .eq('id', attemptId)
    .eq('user_id', userId)
    .select()
    .single();
};

/**
 * 特定の練習問題の回答履歴を取得
 */
export const getExerciseAttempts = async (exerciseId: string, userId: string) => {
  return await supabase
    .from('exercise_attempts')
    .select('*')
    .eq('exercise_id', exerciseId)
    .eq('user_id', userId)
    .order('attempted_at', { ascending: true });
};

/**
 * ユーザーのすべての回答履歴を取得
 */
export const getUserAttempts = async (userId: string, limit?: number) => {
  let query = supabase
    .from('exercise_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('attempted_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  return await query;
};

/**
 * 特定の練習問題の統計情報を取得
 */
export const getExerciseStats = async (exerciseId: string, userId: string) => {
  const { data, error } = await supabase
    .from('exercise_attempts')
    .select('remembered')
    .eq('exercise_id', exerciseId)
    .eq('user_id', userId);

  if (error || !data) {
    return {
      data: null,
      error,
    };
  }

  const totalAttempts = data.length;
  const rememberedCount = data.filter((a) => a.remembered).length;
  const notRememberedCount = totalAttempts - rememberedCount;

  return {
    data: {
      total_attempts: totalAttempts,
      remembered_count: rememberedCount,
      not_remembered_count: notRememberedCount,
    },
    error: null,
  };
};

/**
 * 「覚えてない」回数でフィルタリングした練習問題を取得
 */
export const getExercisesByNotRememberedCount = async (
  userId: string,
  minNotRememberedCount: number,
) => {
  // まず、ユーザーの全ての回答履歴を取得
  const { data: attempts, error: attemptsError } = await supabase
    .from('exercise_attempts')
    .select('exercise_id, remembered')
    .eq('user_id', userId);

  if (attemptsError || !attempts) {
    return { data: null, error: attemptsError };
  }

  // exercise_id ごとに「覚えてない」回数を集計
  const exerciseStats = new Map<string, number>();
  attempts.forEach((attempt) => {
    if (!attempt.remembered) {
      const count = exerciseStats.get(attempt.exercise_id) || 0;
      exerciseStats.set(attempt.exercise_id, count + 1);
    }
  });

  // minNotRememberedCount 以上の exercise_id を抽出
  const filteredExerciseIds = Array.from(exerciseStats.entries())
    .filter(([, count]) => count >= minNotRememberedCount)
    .map(([exerciseId]) => exerciseId);

  if (filteredExerciseIds.length === 0) {
    return { data: [], error: null };
  }

  // 該当する練習問題を取得
  return await supabase
    .from('translation_exercises')
    .select('*')
    .in('id', filteredExerciseIds)
    .eq('user_id', userId)
    .order('scheduled_date', { ascending: true });
};

/**
 * 「覚えてない」でフィルタリングした練習問題を取得
 */
export const getNotRememberedExercises = async (userId: string) => {
  return getExercisesByNotRememberedCount(userId, 1);
};

export const ExerciseAttemptService = {
  createExerciseAttempt,
  updateExerciseAttempt,
  getExerciseAttempts,
  getUserAttempts,
  getExerciseStats,
  getExercisesByNotRememberedCount,
  getNotRememberedExercises,
};
