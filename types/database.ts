// ============================================
// Supabase Database Types
// ============================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Supabase Enums
export enum Language {
  EN = 'en',
  JA = 'ja',
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
  native_language: Language | null;
  target_language: Language | null;
  created_at: string | null;
  updated_at: string | null;
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
  source_text: string;
  source_language: Language;
  target_language: Language;
  correct_translation: string | null;
  user_translation: string | null;
  is_completed: boolean | null;
  scheduled_date: string;
  completed_at: string | null;
  created_at: string | null;
};

export type UserSettings = {
  id: string;
  user_id: string;
  week_start: 'sun' | 'mon';
  view_mode: 'month' | 'week';
  theme: 'light' | 'dark' | 'system';
  native_language: Language;
  target_language: Language;
  created_at: string;
  updated_at: string;
};

// ============================================
// Insert Types
// ============================================

export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'> & {
  id: string;
  native_language?: string;
  target_language?: string;
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

export type TranslationExerciseInsert = Omit<
  TranslationExercise,
  'id' | 'created_at' | 'is_completed' | 'user_translation' | 'completed_at' | 'diary_entry_id'
> & {
  id?: string;
  diary_entry_id?: string | null;
  is_completed?: boolean;
  user_translation?: string | null;
  completed_at?: string | null;
  created_at?: string | null;
};

export type UserSettingsInsert = Omit<UserSettings, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

// ============================================
// Update Types
// ============================================

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>;

export type DiaryEntryUpdate = Partial<Omit<DiaryEntry, 'id' | 'user_id' | 'created_at'>>;

export type AiCorrectionUpdate = Partial<Omit<AiCorrection, 'id' | 'user_id' | 'created_at'>>;

export type TranslationExerciseUpdate = Partial<
  Omit<TranslationExercise, 'id' | 'user_id' | 'created_at'>
>;

export type UserSettingsUpdate = Partial<Omit<UserSettings, 'id' | 'user_id' | 'created_at'>>;

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
