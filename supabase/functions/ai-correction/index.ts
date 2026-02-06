import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface CorrectionRequest {
  nativeContent: string;
  userContent: string;
  nativeLanguage: string;
  targetLanguage: string;
}

interface CorrectionPoint {
  type: 'grammar' | 'vocabulary' | 'style' | 'other';
  original: string;
  corrected: string;
  explanation: string;
  position?: { start: number; end: number };
}

interface NativeExpression {
  expression: string;
  meaning: string;
  usage_example: string;
  usage_example_translation: string;
  context: string;
}

interface OpenAIResponse {
  corrected_content: string;
  correction_points: CorrectionPoint[];
  native_expressions: NativeExpression[];
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
    // 認証チェック
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Supabase クライアントを作成
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
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

    const { nativeContent, userContent, nativeLanguage, targetLanguage }: CorrectionRequest =
      await req.json();

    // バリデーション
    if (!userContent?.trim()) {
      return new Response(JSON.stringify({ error: 'userContent is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = buildPrompt(nativeContent, userContent, nativeLanguage, targetLanguage);

    // OpenAI API呼び出し
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              "あなたは言語学習アシスタントです。ユーザーのネイティブ言語での意図と、ターゲット言語での執筆内容を分析し、添削と学習ポイントを提供してください。",
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
      return new Response(
        JSON.stringify({
          error: `OpenAI API Error: ${errorData.error?.message || response.statusText}`,
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ error: 'Empty response from OpenAI' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const parsed: OpenAIResponse = JSON.parse(content);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-correction function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});

function buildPrompt(
  nativeContent: string,
  userContent: string,
  nativeLanguage: string,
  targetLanguage: string,
): string {
  const languageNames: Record<string, string> = {
    en: 'English',
    ja: 'Japanese',
  };

  const nativeLangName = languageNames[nativeLanguage] || nativeLanguage;
  const targetLangName = languageNames[targetLanguage] || targetLanguage;

  // ネイティブ言語が空の場合は別のプロンプトを使用
  if (!nativeContent?.trim()) {
    return `
ユーザーが${targetLangName}で書いた文章を分析し、より自然な表現に添削してください。

**ユーザーが実際に書いた文章（${targetLangName}）:**
${userContent}

以下のJSON形式で回答してください：
{
  "corrected_content": "${targetLangName}でネイティブが書くような自然な文章",
  "correction_points": [
    {
      "type": "grammar" | "vocabulary" | "style" | "other",
      "original": "元の文章から抽出した表現",
      "corrected": "添削後の表現",
      "explanation": "${nativeLangName}でなぜこの表現の方が良いか、どう改善されるかの説明",
      "position": { "start": 0, "end": 10 } // オプション：元の文章内の位置
    }
  ],
  "native_expressions": [
    {
      "expression": "corrected_contentで実際に使用されているネイティブな${targetLangName}の表現パターン（例：try ~ing、look forward to ~ingなど汎用的な形で）",
      "meaning": "この表現が表す意味を${nativeLangName}で簡潔に。OK例：「〜してみる」「〜を楽しみにする」。NG例：「〜という意味」「〜という意味です」「〜を意味する」",
      "usage_example": "${targetLangName}での使用例文",
      "usage_example_translation": "${nativeLangName}での使用例文の翻訳",
      "context": "${nativeLangName}でいつ、どのようにこの表現を使うかの説明"
    }
  ]
}

**重要事項：**
- すべての説明（explanation、meaning、context、usage_example_translation）は${nativeLangName}で記述
- usage_exampleは${targetLangName}で記述
- expressionは汎用的なパターン形式で（例："try ~ing"、"look forward to ~ing"など）
- meaningの書き方：OK例「〜してみる」「〜を楽しみにする」。NG例「〜という意味」「〜という意味です」「〜を意味する」
- native_expressionsはcorrected_contentで実際に使用されている表現を、できるだけ多く（最大10個）含める
- correction_pointsは最大10個まで提供
- ネイティブ表現は学習に役立つものを積極的に選び、豊富に提供してください
`.trim();
  }

  return `
ユーザーが${nativeLangName}で伝えたかった内容と、${targetLangName}で実際に書いた文章を分析し、添削を提供してください。

**大切なこと**
- ${nativeLangName}で書かれた内容から、ユーザーが本当に伝えたかったニュアンスや感情、文脈を丁寧に読み取ってください
- 文法の正しさだけでなく、伝えたいことが${targetLangName}で自然に表現できているかを見てください
- ${nativeLangName}から読み取れる感情や強調したいポイントが、${targetLangName}でも伝わるようにしてください

**ユーザーが伝えたかった内容（${nativeLangName}）:**
${nativeContent}

**ユーザーが実際に書いた文章（${targetLangName}）:**
${userContent}

以下のJSON形式で回答してください：
{
  "corrected_content": "${targetLangName}でネイティブが書くような自然な文章",
  "correction_points": [
    {
      "type": "grammar" | "vocabulary" | "style" | "other",
      "original": "元の文章から抽出した表現",
      "corrected": "添削後の表現",
      "explanation": "${nativeLangName}でなぜこの表現の方が良いか、どう改善されるかの説明",
      "position": { "start": 0, "end": 10 } // オプション：元の文章内の位置
    }
  ],
  "native_expressions": [
    {
      "expression": "corrected_contentで実際に使用されているネイティブな${targetLangName}の表現パターン（例：try ~ing、look forward to ~ingなど汎用的な形で）",
      "meaning": "この表現が表す意味を${nativeLangName}で簡潔に。OK例：「〜してみる」「〜を楽しみにする」。NG例：「〜という意味」「〜という意味です」「〜を意味する」",
      "usage_example": "${targetLangName}での使用例文",
      "usage_example_translation": "${nativeLangName}での使用例文の翻訳",
      "context": "${nativeLangName}でいつ、どのようにこの表現を使うかの説明"
    }
  ]
}

**重要事項：**
- すべての説明（explanation、meaning、context、usage_example_translation）は${nativeLangName}で記述
- usage_exampleは${targetLangName}で記述
- expressionは汎用的なパターン形式で（例："try ~ing"、"look forward to ~ing"など）
- meaningの書き方：OK例「〜してみる」「〜を楽しみにする」。NG例「〜という意味」「〜という意味です」「〜を意味する」
- native_expressionsはcorrected_contentで実際に使用されている表現を、できるだけ多く（最大10個）含める
- correction_pointsは最大10個まで提供
- ネイティブ表現は学習に役立つものを積極的に選び、豊富に提供してください
`.trim();
}
