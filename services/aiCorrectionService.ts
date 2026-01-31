import type { AiCorrectionInsert, NativeExpression, OpenAIResponse } from '@/types/database';
import { Language } from '@/types/database';
import { getTodayString } from '@/utils/dateUtils';
import { supabase } from './supabase';
import { TranslationExerciseService } from './translationExerciseService';

export class AiCorrectionService {
  /**
   * 日記エントリーのAI添削を作成
   */
  static async create(correction: AiCorrectionInsert) {
    const { data, error } = await supabase
      .from('ai_corrections')
      .insert(correction)
      .select()
      .single();
    return { data, error };
  }

  /**
   * 日記エントリーIDからAI添削を取得
   */
  static async getByDiaryEntryId(diaryEntryId: string, userId: string) {
    const { data, error } = await supabase
      .from('ai_corrections')
      .select('*')
      .eq('diary_entry_id', diaryEntryId)
      .eq('user_id', userId)
      .maybeSingle();
    return { data, error };
  }

  /**
   * AI添削を削除
   */
  static async delete(id: string, userId: string) {
    const { error } = await supabase
      .from('ai_corrections')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    return { error };
  }

  /**
   * Supabase Edge Function経由でAI添削をリクエスト
   * @param nativeContent ユーザーが書きたかった内容（ネイティブ言語）
   * @param userContent ユーザーが実際に書いた内容（ターゲット言語）
   * @param nativeLanguage ネイティブ言語
   * @param targetLanguage ターゲット言語
   */
  static async requestCorrection(
    nativeContent: string,
    userContent: string,
    nativeLanguage: Language,
    targetLanguage: Language,
  ): Promise<{ data: OpenAIResponse | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-correction', {
        body: {
          nativeContent,
          userContent,
          nativeLanguage,
          targetLanguage,
        },
      });

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Edge Functionからのレスポンスが空です');
      }

      return { data: data as OpenAIResponse, error: null };
    } catch (error) {
      console.error('AI correction request failed:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * 日記エントリーに対してAI添削を実行し、結果を保存
   * ネイティブ表現は自動的に翻訳問題として登録される
   */
  static async correctAndSave(
    userId: string,
    diaryEntryId: string,
    nativeContent: string,
    userContent: string,
    nativeLanguage: Language,
    targetLanguage: Language,
  ) {
    // AI添削をリクエスト
    const { data: aiResponse, error: aiError } = await this.requestCorrection(
      nativeContent,
      userContent,
      nativeLanguage,
      targetLanguage,
    );

    if (aiError || !aiResponse) {
      return { data: null, error: aiError || new Error('AI添削に失敗しました') };
    }

    // データベースに保存
    const correction: AiCorrectionInsert = {
      user_id: userId,
      diary_entry_id: diaryEntryId,
      native_content: nativeContent,
      user_content: userContent,
      corrected_content: aiResponse.corrected_content,
      correction_points: aiResponse.correction_points as any,
      native_expressions: aiResponse.native_expressions as any,
    };

    const result = await this.create(correction);

    // ネイティブ表現を翻訳問題として自動登録
    if (result.data && aiResponse.native_expressions.length > 0) {
      await this.registerNativeExpressionsAsExercises(
        userId,
        diaryEntryId,
        aiResponse.native_expressions,
        targetLanguage,
        nativeLanguage,
      );
    }

    return result;
  }

  /**
   * ネイティブ表現を翻訳問題として登録
   */
  private static async registerNativeExpressionsAsExercises(
    userId: string,
    diaryEntryId: string,
    nativeExpressions: NativeExpression[],
    targetLanguage: Language,
    nativeLanguage: Language,
  ) {
    const exercises = nativeExpressions.map((expr) => ({
      user_id: userId,
      diary_entry_id: diaryEntryId,
      native_text: expr.usage_example_translation, // native_languageの文章（日本語の翻訳）
      native_language: nativeLanguage,
      target_language: targetLanguage,
      target_text: expr.usage_example, // target_languageの文章（英語の使用例）
      scheduled_date: getTodayString(), // 今日の日付
    }));

    const { error } = await TranslationExerciseService.createMany(exercises);

    if (error) {
      console.error('Failed to register native expressions as exercises:', error);
    }
  }
}
