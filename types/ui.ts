// ============================================
// Form Data Types
// ============================================

export type DiaryFormData = {
  title: string;
  content: string;
  language: string;
  entry_date: string;
};

export type TranslationFormData = {
  user_translation: string;
};

export type ProfileFormData = {
  display_name: string;
  native_language: string;
  target_language: string;
};

// ============================================
// View/Screen Types
// ============================================

export type CalendarDiary = {
  date: string;
  hasEntry: boolean;
  entry?: {
    id: string;
    title: string | null;
    entry_date: string;
  };
};

// ============================================
// Statistics/Analytics Types
// ============================================

export type LearningStats = {
  totalDiaries: number;
  totalExercises: number;
  completedExercises: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
};

export type MonthlyStats = {
  month: string;
  diaryCount: number;
  exerciseCount: number;
  completionRate: number;
};

// ============================================
// Constants
// ============================================

export const LANGUAGES = {
  EN: 'en',
  JA: 'ja',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
  ZH: 'zh',
  KO: 'ko',
  ID: 'id',
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export const SUGGESTION_TYPES = {
  GRAMMAR: 'grammar',
  VOCABULARY: 'vocabulary',
  STYLE: 'style',
  OTHER: 'other',
} as const;

export type SuggestionType = (typeof SUGGESTION_TYPES)[keyof typeof SUGGESTION_TYPES];
