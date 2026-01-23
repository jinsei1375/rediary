import type { AiCorrectionInsert, NativeExpression, OpenAIResponse } from '@/types/database';
import { Language } from '@/types/database';
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
   * OpenAI APIを使用してAI添削をリクエスト
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
      const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI APIキーが設定されていません');
      }

      const prompt = this.buildPrompt(nativeContent, userContent, nativeLanguage, targetLanguage);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                "You are a language learning assistant. Analyze the user's intent in their native language and their writing in the target language, then provide corrections and learning points.",
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
      }

      const result = await response.json();
      const content = result.choices[0]?.message?.content;

      if (!content) {
        throw new Error('OpenAI APIからのレスポンスが空です');
      }

      const parsed: OpenAIResponse = JSON.parse(content);

      return { data: parsed, error: null };
    } catch (error) {
      console.error('AI correction request failed:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * OpenAI APIへ送信するプロンプトを構築
   */
  private static buildPrompt(
    nativeContent: string,
    userContent: string,
    nativeLanguage: Language,
    targetLanguage: Language,
  ): string {
    const languageNames = {
      [Language.EN]: 'English',
      [Language.JA]: 'Japanese',
    };

    const nativeLangName = languageNames[nativeLanguage] || nativeLanguage;
    const targetLangName = languageNames[targetLanguage] || targetLanguage;

    return `
Analyze the user's intent in their native language and their writing in the target language, then provide corrections in JSON format.

**User's intended content (in ${nativeLangName}):**
${nativeContent}

**User's actual writing (in ${targetLangName}):**
${userContent}

Please respond in the following JSON format:
{
  "corrected_content": "Natural corrected content in ${targetLangName} (as a native speaker would write)",
  "correction_points": [
    {
      "type": "grammar" | "vocabulary" | "style" | "other",
      "original": "Original expression from user_content",
      "corrected": "Corrected expression",
      "explanation": "Explanation in ${nativeLangName} of why this correction is needed and how it improves the text",
      "position": { "start": 0, "end": 10 } // Optional: position in original text
    }
  ],
  "native_expressions": [
    {
      "expression": "Natural ${targetLangName} expression actually used in corrected_content",
      "meaning": "Meaning of this expression in ${nativeLangName}",
      "usage_example": "Example sentence in ${targetLangName}",
      "usage_example_translation": "Translation of the usage_example in ${nativeLangName}",
      "context": "Explanation in ${nativeLangName} of when and how to use this expression"
    }
  ]
}

**Important:**
- All explanations (explanation, meaning, context, usage_example_translation) must be in ${nativeLangName}
- usage_example must be in ${targetLangName}
- native_expressions must only include expressions that are actually used in corrected_content
- Limit to maximum 5 correction_points and 5 native_expressions
`.trim();
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
      native_text: expr.usage_example, // 英語の使用例
      native_language: nativeLanguage,
      target_language: targetLanguage,
      target_text: expr.usage_example_translation, // 日本語の翻訳
      scheduled_date: new Date().toISOString().split('T')[0], // 今日の日付
    }));

    const { error } = await TranslationExerciseService.createMany(exercises);

    if (error) {
      console.error('Failed to register native expressions as exercises:', error);
    }
  }
}
