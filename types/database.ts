// ============================================
// Supabase Database Types
// ============================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Supabase Enums
export enum Language {
  EN = 'en',
  JA = 'ja',
}

export enum SubscriptionPlan {
  FREE = 'free',
  PRO = 'pro',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

export enum AiAnalysisType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      diary_entries: {
        Row: DiaryEntry;
        Insert: DiaryEntryInsert;
        Update: DiaryEntryUpdate;
      };
      ai_corrections: {
        Row: AiCorrection;
        Insert: AiCorrectionInsert;
        Update: AiCorrectionUpdate;
      };
      translation_exercises: {
        Row: TranslationExercise;
        Insert: TranslationExerciseInsert;
        Update: TranslationExerciseUpdate;
      };
      user_settings: {
        Row: UserSettings;
        Insert: UserSettingsInsert;
        Update: UserSettingsUpdate;
      };
      exercise_attempts: {
        Row: ExerciseAttempt;
        Insert: ExerciseAttemptInsert;
        Update: ExerciseAttemptUpdate;
      };
      ai_analyses: {
        Row: AiAnalysis;
        Insert: AiAnalysisInsert;
        Update: AiAnalysisUpdate;
      };
    };
  };
};

// ============================================
// Table Row Types
// ============================================

export type Profile = {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
};

export type DiaryEntry = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  content_native: string;
  language: Language;
  entry_date: string;
  created_at: string;
  updated_at: string;
};

export type AiCorrection = {
  id: string;
  user_id: string;
  diary_entry_id: string;
  native_content: string;
  user_content: string;
  corrected_content: string;
  correction_points: Json;
  native_expressions: Json;
  created_at: string;
};

export type TranslationExercise = {
  id: string;
  user_id: string;
  diary_entry_id: string | null;
  native_text: string;
  native_language: Language;
  target_language: Language;
  target_text: string | null;
  scheduled_date: string;
  created_at: string;
};

export type UserSettings = {
  id: string;
  user_id: string;
  week_start: 'sun' | 'mon';
  view_mode: 'month' | 'week';
  theme: 'light' | 'dark' | 'system';
  native_language: Language;
  target_language: Language;
  subscription_plan: 'free' | 'pro' | 'premium' | 'enterprise';
  premium_expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type UserSubscription = {
  plan: SubscriptionPlan;
  expiresAt: string | null;
};

export type ExerciseAttempt = {
  id: string;
  user_id: string;
  exercise_id: string;
  user_answer: string;
  remembered: boolean | null;
  attempted_at: string;
  created_at: string;
};

export type AiAnalysis = {
  id: string;
  user_id: string;
  analysis_type: AiAnalysisType;
  period_start: string;
  period_end: string;
  frequent_expressions: FrequentExpression[];
  common_mistakes: CommonMistake[];
  growth_summary: GrowthSummary;
  created_at: string;
  updated_at: string;
};

// ============================================
// Insert Types
// ============================================

export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'> & {
  id: string;
  created_at?: string;
  updated_at?: string;
};

export type DiaryEntryInsert = Omit<DiaryEntry, 'id' | 'created_at' | 'updated_at' | 'language'> & {
  id?: string;
  language?: Language;
  created_at?: string;
  updated_at?: string;
};

export type AiCorrectionInsert = Omit<AiCorrection, 'id' | 'created_at'> & {
  id?: string;
  correction_points?: Json;
  native_expressions?: Json;
  created_at?: string;
};

export type TranslationExerciseInsert = Omit<TranslationExercise, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type UserSettingsInsert = Omit<UserSettings, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ExerciseAttemptInsert = Omit<ExerciseAttempt, 'id' | 'created_at' | 'attempted_at'> & {
  id?: string;
  attempted_at?: string;
  created_at?: string;
};

export type AiAnalysisInsert = Omit<AiAnalysis, 'id' | 'created_at' | 'updated_at'>;

// ============================================
// Update Types
// ============================================

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>;

export type DiaryEntryUpdate = Partial<Omit<DiaryEntry, 'id' | 'user_id' | 'created_at'>>;

export type AiAnalysisUpdate = Partial<
  Omit<AiAnalysis, 'id' | 'user_id' | 'created_at'>
>;

export type AiCorrectionUpdate = Partial<Omit<AiCorrection, 'id' | 'user_id' | 'created_at'>>;

export type TranslationExerciseUpdate = Partial<
  Omit<TranslationExercise, 'id' | 'user_id' | 'created_at'>
>;

export type UserSettingsUpdate = Partial<Omit<UserSettings, 'id' | 'user_id' | 'created_at'>>;

export type ExerciseAttemptUpdate = Partial<Omit<ExerciseAttempt, 'id' | 'user_id' | 'created_at'>>;

// ============================================
// JSON Types
// ============================================

export type CorrectionPoint = {
  type: 'grammar' | 'vocabulary' | 'style' | 'other';
  original: string;
  corrected: string;
  explanation: string;
  position?: {
    start: number;
    end: number;
  };
};

export type NativeExpression = {
  expression: string;
  meaning: string;
  usage_example: string;
  usage_example_translation: string;
  context?: string;
};

// Monthly Analysis Types
export type FrequentExpression = {
  expression: string;
  count: number;
  alternative_suggestions: string[];
  usage_note: string;
};

export type CommonMistake = {
  category: string;
  count: number;
  examples: { wrong: string; correct: string }[];
  how_to_improve: string;
};

export type GrowthSummary = {
  improvements: string[];
  ongoing_challenges: string[];
  overall_assessment: string;
};

// OpenAI API Response型
export type OpenAIResponse = {
  corrected_content: string;
  correction_points: CorrectionPoint[];
  native_expressions: NativeExpression[];
};

// ============================================
// Extended Types
// ============================================

export type DiaryWithCorrections = DiaryEntry & {
  ai_corrections: AiCorrection[];
};

export type ExerciseWithStatus = TranslationExercise & {
  score?: number;
  feedback?: string;
};

// Exercise with attempt statistics
export type ExerciseWithStats = TranslationExercise & {
  total_attempts: number;
  remembered_count: number;
  not_remembered_count: number;
  last_attempt?: ExerciseAttempt;
};

// Exercise result for review session
export type ExerciseResult = {
  exercise: TranslationExercise;
  userAnswer: string;
  remembered: boolean;
};
