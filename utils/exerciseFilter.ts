/**
 * フロントエンドでの翻訳問題フィルタリング用ユーティリティ
 */

type ExerciseWithAttempts = {
  id: string;
  exercise_attempts?: Array<{
    id: string;
    remembered: boolean | null;
    attempted_at: string;
  }>;
  [key: string]: any;
};

/**
 * フィルター条件に基づいて問題をフィルタリング
 */
export function filterExercises(
  exercises: ExerciseWithAttempts[],
  notRememberedCount: number,
  daysSinceLastAttempt: number,
  isRandom: boolean,
  limit: number = 5,
): ExerciseWithAttempts[] {
  // ランダムの場合
  if (isRandom) {
    const shuffled = [...exercises].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }

  // 条件フィルターの場合
  const now = new Date();
  const filtered = exercises.filter((exercise) => {
    const attempts = exercise.exercise_attempts || [];

    // 「覚えてない」回数フィルター
    if (notRememberedCount > 0) {
      const notRememberedAttempts = attempts.filter((a) => a.remembered === false);
      // 指定回数未満の場合は除外
      if (notRememberedAttempts.length < notRememberedCount) {
        return false;
      }
    }

    // 最終解答日フィルター
    if (daysSinceLastAttempt > 0) {
      // 一度も解いていない問題は常に含める
      if (attempts.length === 0) {
        // ただし「覚えてない」回数フィルターが設定されている場合は除外
        return notRememberedCount === 0;
      }

      const sortedAttempts = [...attempts].sort(
        (a, b) => new Date(b.attempted_at).getTime() - new Date(a.attempted_at).getTime(),
      );
      const lastAttempt = sortedAttempts[0];
      const lastAttemptDate = new Date(lastAttempt.attempted_at);
      const daysSince = Math.floor(
        (now.getTime() - lastAttemptDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysSince < daysSinceLastAttempt) {
        return false;
      }
    }

    return true;
  });

  // フィルター後もシャッフルして上限まで取得
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

/**
 * フィルター条件に合う問題数を取得
 */
export function countFilteredExercises(
  exercises: ExerciseWithAttempts[],
  notRememberedCount: number,
  daysSinceLastAttempt: number,
  isRandom: boolean,
): number {
  if (isRandom) {
    return exercises.length;
  }

  const now = new Date();
  const filtered = exercises.filter((exercise) => {
    const attempts = exercise.exercise_attempts || [];

    // 「覚えてない」回数フィルター
    if (notRememberedCount > 0) {
      const notRememberedAttempts = attempts.filter((a) => a.remembered === false);
      if (notRememberedAttempts.length < notRememberedCount) {
        return false;
      }
    }

    // 最終解答日フィルター
    if (daysSinceLastAttempt > 0) {
      if (attempts.length === 0) {
        return notRememberedCount === 0;
      }

      const sortedAttempts = [...attempts].sort(
        (a, b) => new Date(b.attempted_at).getTime() - new Date(a.attempted_at).getTime(),
      );
      const lastAttempt = sortedAttempts[0];
      const lastAttemptDate = new Date(lastAttempt.attempted_at);
      const daysSince = Math.floor(
        (now.getTime() - lastAttemptDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysSince < daysSinceLastAttempt) {
        return false;
      }
    }

    return true;
  });

  return filtered.length;
}
