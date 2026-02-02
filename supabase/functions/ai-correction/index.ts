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
Analyze the user's writing in the target language and provide corrections to make it sound more natural, in JSON format.

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
- Limit to maximum 5 correction_points
- Focus on making the text sound more natural and fluent
`.trim();
  }

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
- Limit to maximum 5 correction_points
`.trim();
}
