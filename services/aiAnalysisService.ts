import { AiAnalysisType, type AiAnalysis } from '@/types/database';
import { supabase } from './supabase';

export class AiAnalysisService {
  /**
   * 学習分析を実行（Edge Function経由）
   * @param analysisType - 'weekly' or 'monthly'
   */
  static async analyzeProgress(
    userId: string,
    targetLanguage: string,
    nativeLanguage: string,
    analysisType: AiAnalysisType = AiAnalysisType.MONTHLY,
  ): Promise<{
    data: AiAnalysis | null;
    error: Error | null;
  }> {
    try {
      const response = await supabase.functions.invoke('ai-analysis', {
        body: {
          targetLanguage,
          nativeLanguage,
          analysisType,
        },
      });

      if (response.error) {
        throw response.error;
      }

      if (!response.data) {
        throw new Error('Edge Functionからのレスポンスが空です');
      }

      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 分析実行可能かチェック
   */
  static async canCreateNewAnalysis(
    userId: string,
    analysisType: AiAnalysisType = AiAnalysisType.MONTHLY,
  ): Promise<boolean> {
    const limitDays = analysisType === AiAnalysisType.WEEKLY ? 7 : 30;
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - limitDays);

    const { data, error } = await supabase
      .from('ai_analyses')
      .select('id')
      .eq('user_id', userId)
      .eq('analysis_type', analysisType)
      .gte('created_at', limitDate.toISOString())
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return !data;
  }

  /**
   * 次回分析可能日を取得
   */
  static async getNextAnalysisDate(
    userId: string,
    analysisType: AiAnalysisType = AiAnalysisType.MONTHLY,
  ): Promise<Date | null> {
    const { data, error } = await supabase
      .from('ai_analyses')
      .select('created_at')
      .eq('user_id', userId)
      .eq('analysis_type', analysisType)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    const lastAnalysisDate = new Date(data.created_at);
    const nextDate = new Date(lastAnalysisDate);
    const daysToAdd = analysisType === AiAnalysisType.WEEKLY ? 7 : 30;
    nextDate.setDate(nextDate.getDate() + daysToAdd);

    return nextDate;
  }

  /**
   * 最新の分析を取得
   */
  static async getLatestAnalysis(userId: string): Promise<{
    data: AiAnalysis | null;
    error: Error | null;
  }> {
    try {
      const { data, error } = await supabase
        .from('ai_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 全ての分析履歴を取得
   */
  static async getAllAnalyses(userId: string): Promise<{
    data: AiAnalysis[];
    error: Error | null;
  }> {
    try {
      const { data, error } = await supabase
        .from('ai_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  /**
   * IDで分析を取得
   */
  static async getAnalysisById(analysisId: string): Promise<{
    data: AiAnalysis | null;
    error: Error | null;
  }> {
    try {
      const { data, error } = await supabase
        .from('ai_analyses')
        .select('*')
        .eq('id', analysisId)
        .maybeSingle();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 分析対象のデータ統計を取得
   */
  static async getAnalysisStats(
    userId: string,
    analysisType: AiAnalysisType = AiAnalysisType.MONTHLY,
  ): Promise<{
    diaryCount: number;
    correctionCount: number;
  }> {
    const periodStart = new Date();
    if (analysisType === AiAnalysisType.WEEKLY) {
      // 当日含め7日間（6日前～今日）
      periodStart.setDate(periodStart.getDate() - 6);
    } else {
      // 当日含め30日間（29日前～今日）
      periodStart.setDate(periodStart.getDate() - 29);
    }

    const { data: diaries, error: diariesError } = await supabase
      .from('diary_entries')
      .select('id, entry_date')
      .eq('user_id', userId)
      .gte('entry_date', periodStart.toISOString().split('T')[0])
      .lte('entry_date', new Date().toISOString().split('T')[0]);

    if (diariesError || !diaries) {
      return { diaryCount: 0, correctionCount: 0 };
    }

    const { count } = await supabase
      .from('ai_corrections')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in(
        'diary_entry_id',
        diaries.map((d) => d.id),
      );

    return {
      diaryCount: diaries.length,
      correctionCount: count || 0,
    };
  }
}
