import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

type AiAnalysisType = 'weekly' | 'monthly';

interface AnalysisRequest {
  targetLanguage: string;
  nativeLanguage: string;
  analysisType?: AiAnalysisType; // デフォルトはmonthly
}

interface FrequentExpression {
  expression: string;
  count: number;
  alternative_suggestions: string[];
  usage_note: string;
}

interface CommonMistake {
  category: string;
  count: number;
  examples: { wrong: string; correct: string }[];
  how_to_improve: string;
}

interface GrowthSummary {
  improvements: string[];
  ongoing_challenges: string[];
  overall_assessment: string;
}

interface AnalysisResponse {
  frequent_expressions: FrequentExpression[];
  common_mistakes: CommonMistake[];
  growth_summary: GrowthSummary;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  // CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Supabase クライアントを作成（認証ヘッダーはEdge Runtimeが自動で処理）
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // ユーザー認証を検証
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { targetLanguage, nativeLanguage, analysisType = 'monthly' }: AnalysisRequest =
      await req.json();

    // 1. 分析タイプに応じた期間制限チェック
    const limitDays = analysisType === 'weekly' ? 7 : 30;
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - limitDays);

    const { data: recentAnalysis } = await supabaseClient
      .from('ai_analyses')
      .select('id')
      .eq('user_id', user.id)
      .eq('analysis_type', analysisType)
      .gte('created_at', limitDate.toISOString())
      .maybeSingle();

    if (recentAnalysis) {
      const message =
        analysisType === 'weekly'
          ? '週間分析は7日に1回のみ実行できます。'
          : '月間分析は30日に1回のみ実行できます。';
      return new Response(JSON.stringify({ error: message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. 分析対象期間のデータ取得
    const periodDays = analysisType === 'weekly' ? 7 : 30;
    const periodStart = new Date();
    if (analysisType === 'weekly') {
      // 当日含め7日間（6日前～今日）
      periodStart.setDate(periodStart.getDate() - 6);
    } else {
      // 当日含め30日間（29日前～今日）
      periodStart.setDate(periodStart.getDate() - 29);
    }
    const periodEnd = new Date();

    const { data: diaries, error: diariesError } = await supabaseClient
      .from('diary_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('entry_date', periodStart.toISOString().split('T')[0])
      .lte('entry_date', periodEnd.toISOString().split('T')[0])
      .order('entry_date', { ascending: true });

    if (diariesError) {
      throw diariesError;
    }

    const minDiaries = analysisType === 'weekly' ? 3 : 5;
    if (!diaries || diaries.length < minDiaries) {
      const message = `分析には最低${minDiaries}日分の日記が必要です`;
      return new Response(JSON.stringify({ error: message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. AI添削データも取得
    const corrections = await Promise.all(
      diaries.map(async (diary) => {
        const { data } = await supabaseClient
          .from('ai_corrections')
          .select('*')
          .eq('diary_entry_id', diary.id)
          .eq('user_id', user.id)
          .maybeSingle();
        return data;
      }),
    );

    const validCorrections = corrections.filter((c) => c);

    // 4. OpenAI API呼び出し
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = buildSystemPrompt(targetLanguage, nativeLanguage, analysisType);
    const userPrompt = buildAnalysisPrompt(diaries, validCorrections, targetLanguage, nativeLanguage);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}` }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const result = await response.json();
    const analysis: AnalysisResponse = JSON.parse(result.choices[0]?.message?.content || '{}');

    // 5. Supabaseに保存
    const { data: savedData, error: saveError } = await supabaseClient
      .from('ai_analyses')
      .insert({
        user_id: user.id,
        analysis_type: analysisType,
        period_start: periodStart.toISOString().split('T')[0],
        period_end: periodEnd.toISOString().split('T')[0],
        frequent_expressions: analysis.frequent_expressions,
        common_mistakes: analysis.common_mistakes,
        growth_summary: analysis.growth_summary,
      })
      .select()
      .single();

    if (saveError) {
      throw saveError;
    }

    return new Response(JSON.stringify(savedData), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-analysis function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: error instanceof Error ? error.stack : String(error)
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});

function buildSystemPrompt(
  targetLanguage: string,
  nativeLanguage: string,
  analysisType: AiAnalysisType,
): string {
  const period = analysisType === 'weekly' ? '1週間' : '1ヶ月';
  return `あなたは${targetLanguage}学習の専門分析家です。

ユーザーの${period}分の日記データとAI添削結果を分析し、以下を提供してください：

1. **よく使う表現・単語の傾向**
   - 頻出表現TOP5
   - 各表現の使用頻度と代替表現の提案
   
2. **よく指摘される文法・語彙ミス**
   - 頻出ミスTOP5
   - 具体例と改善方法
   
3. **この期間の成長サマリー**
   - この期間内での学習傾向と強み
   - 改善が見られる領域と継続的な課題

全ての説明は${nativeLanguage}で提供してください。`;
}

function buildAnalysisPrompt(
  diaries: any[],
  corrections: any[],
  targetLanguage: string,
  nativeLanguage: string,
): string {
  return `
【分析対象データ】
期間: ${diaries[0]?.entry_date} ～ ${diaries[diaries.length - 1]?.entry_date}
日記投稿数: ${diaries.length}回
AI添削受けた回数: ${corrections.length}回

【全日記データ】
${diaries
  .map(
    (d, idx) => `
${idx + 1}. 日付: ${d.entry_date}
${targetLanguage}: ${d.content}
${nativeLanguage}: ${d.content_native || '（なし）'}
`,
  )
  .join('\n')}

【全AI添削データ】
${corrections
  .map(
    (c, idx) => `
${idx + 1}. 元の文: ${c.user_content}
修正後: ${c.corrected_content}
指摘された問題:
${Array.isArray(c.correction_points) ? c.correction_points.map((p: any) => `  - [${p.type}] ${p.original} → ${p.corrected}`).join('\n') : '（なし）'}
`,
  )
  .join('\n')}

以下のJSON形式で分析結果を返してください：
{
  "frequent_expressions": [
    {
      "expression": "頻出表現",
      "count": 使用回数,
      "alternative_suggestions": ["代替表現1", "代替表現2"],
      "usage_note": "使い方のアドバイス（${nativeLanguage}）"
    }
  ],
  "common_mistakes": [
    {
      "category": "文法項目名（${nativeLanguage}）",
      "count": 指摘回数,
      "examples": [
        {"wrong": "誤った例", "correct": "正しい例"}
      ],
      "how_to_improve": "改善方法（${nativeLanguage}）"
    }
  ],
  "growth_summary": {
    "improvements": ["改善点1", "改善点2"],
    "ongoing_challenges": ["継続課題1", "課題2"],
    "overall_assessment": "この期間内の総合評価（${nativeLanguage}）"
  }
}

**重要:**
- frequent_expressionsは最大5件（全データから正確な使用頻度を分析）
- common_mistakesは最大5件（全添削データから頻出ミスを分析）
- growth_summaryは期間全体の傾向を分析
- 全ての説明文は${nativeLanguage}で記述
`;
}
