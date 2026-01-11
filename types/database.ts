// ============================================
// Supabase Database Types
// ============================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

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
  native_language: string | null;
  target_language: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type DiaryEntry = {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  language: string;
  entry_date: string;
  created_at: string | null;
  updated_at: string | null;
};

export type AiCorrection = {
  id: string;
  user_id: string;
  diary_entry_id: string | null;
  original_text: string;
  corrected_text: string;
  suggestions: Json | null;
  created_at: string | null;
};

export type TranslationExercise = {
  id: string;
  user_id: string;
  source_text: string;
  source_language: string;
  target_language: string;
  correct_translation: string | null;
  user_translation: string | null;
  is_completed: boolean | null;
  scheduled_date: string;
  completed_at: string | null;
  created_at: string | null;
};

// ============================================
// Insert Types
// ============================================

export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'> & {
  id: string; // auth.users.idと一致する必要がある
  native_language?: string; // デフォルト: 'ja'
  target_language?: string; // デフォルト: 'en'
  created_at?: string;
  updated_at?: string;
};

export type DiaryEntryInsert = Omit<DiaryEntry, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type AiCorrectionInsert = Omit<AiCorrection, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type TranslationExerciseInsert = Omit<
  TranslationExercise,
  'id' | 'created_at' | 'is_completed'
> & {
  id?: string;
  is_completed?: boolean; // デフォルト: false
  created_at?: string;
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

// ============================================
// JSON Types
// ============================================

export type AiSuggestion = {
  type: 'grammar' | 'vocabulary' | 'style' | 'other';
  original: string;
  suggestion: string;
  explanation: string;
  position?: {
    start: number;
    end: number;
  };
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
