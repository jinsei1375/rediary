import { AiAnalysisType } from '@/types/database';

export const SAMPLE_WEEKLY_ANALYSIS = {
  id: 'sample-weekly',
  user_id: 'sample',
  analysis_type: AiAnalysisType.WEEKLY,
  period_start: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  period_end: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  frequent_expressions: [
    {
      expression: 'get up early',
      count: 5,
      alternative_suggestions: ['wake up early', 'rise early'],
      usage_note: '朝早く起きることを表す一般的な表現です',
    },
    {
      expression: 'had a great time',
      count: 4,
      alternative_suggestions: ['enjoyed myself', 'had fun', 'had a wonderful time'],
      usage_note: '楽しい時間を過ごしたことを表すカジュアルな表現',
    },
    {
      expression: "I'm looking forward to",
      count: 3,
      alternative_suggestions: ["I can't wait for", "I'm excited about"],
      usage_note: '何かを楽しみにしていることを表す一般的な表現',
    },
  ],
  common_mistakes: [
    {
      category: '前置詞の誤用',
      count: 3,
      examples: [
        { wrong: 'at Monday', correct: 'on Monday' },
        { wrong: 'in the night', correct: 'at night' },
      ],
      how_to_improve: '日付には on、時刻には at、月・年・季節には in を使いましょう',
    },
    {
      category: '冠詞の脱落',
      count: 2,
      examples: [
        { wrong: 'I went to park', correct: 'I went to the park' },
        { wrong: 'He is teacher', correct: 'He is a teacher' },
      ],
      how_to_improve: '特定のものには the、不特定のものには a/an を忘れずに',
    },
  ],
  growth_summary: {
    improvements: [
      '日常会話でよく使う「get」の使い方が安定してきました',
      '時制の使い分けが自然になり、過去形と現在完了形を適切に使い分けられています',
      '感情を表現する形容詞のバリエーションが増えました（excited, nervous, relievedなど）',
    ],
    ongoing_challenges: [
      '前置詞（at, on, in）の使い分けに少し迷いが見られます',
      '複文を作る際の接続詞（although, because, while）をもっと活用しましょう',
      '冠詞（a, the）の使い方を意識すると、さらに自然な英語になります',
    ],
    overall_assessment:
      'この1週間で、あなたの英語表現力が確実に向上しています！特に時制の使い分けと感情表現が大きく成長しました。',
  },
};

export const SAMPLE_MONTHLY_ANALYSIS = {
  id: 'sample-monthly',
  user_id: 'sample',
  analysis_type: AiAnalysisType.MONTHLY,
  period_start: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
  period_end: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  frequent_expressions: [
    {
      expression: 'ended up doing',
      count: 8,
      alternative_suggestions: ['finally did', 'eventually did'],
      usage_note: '結局〜することになった、という意味の口語表現',
    },
    {
      expression: 'get along with',
      count: 7,
      alternative_suggestions: ['have a good relationship with', 'be on good terms with'],
      usage_note: '人と仲良くやっていることを表す表現',
    },
    {
      expression: 'come up with',
      count: 6,
      alternative_suggestions: ['think of', 'devise', 'develop'],
      usage_note: 'アイデアや解決策を思いつくことを表す表現',
    },
    {
      expression: 'turn out to be',
      count: 5,
      alternative_suggestions: ['prove to be', 'end up being'],
      usage_note: '結果として〜だと判明する、という意味の表現',
    },
  ],
  common_mistakes: [
    {
      category: '仮定法の誤用',
      count: 5,
      examples: [
        { wrong: 'If I was rich', correct: 'If I were rich' },
        { wrong: 'I wish I was there', correct: 'I wish I were there' },
      ],
      how_to_improve: '仮定法では be動詞は常に were を使います（主語に関わらず）',
    },
    {
      category: '関係代名詞の省略ミス',
      count: 4,
      examples: [
        { wrong: 'The book I bought it', correct: 'The book I bought' },
        { wrong: 'The person who I met him', correct: 'The person who I met' },
      ],
      how_to_improve: '関係代名詞の後の代名詞は不要です',
    },
    {
      category: '前置詞の誤用',
      count: 4,
      examples: [
        { wrong: 'depend of', correct: 'depend on' },
        { wrong: 'good in English', correct: 'good at English' },
      ],
      how_to_improve: '動詞・形容詞と前置詞の組み合わせは慣用的に決まっているので、セットで覚えましょう',
    },
  ],
  growth_summary: {
    improvements: [
      '語彙力が大幅に向上し、同じ意味でも様々な表現を使えるようになりました',
      '複雑な文構造（関係代名詞、接続詞）を自然に使えるようになっています',
      'ネイティブらしい口語表現（phrasal verbs）を積極的に使っています',
      '感情表現が豊かになり、細かいニュアンスを伝えられるようになりました',
    ],
    ongoing_challenges: [
      '仮定法（If I were..., I would...）の使い方を練習しましょう',
      '受動態と能動態の使い分けを意識すると、より自然な英語になります',
      'ビジネスシーンで使えるフォーマルな表現も取り入れてみましょう',
    ],
    overall_assessment:
      'この1ヶ月間、素晴らしい成長を遂げました！新しく使った単語は127語、AI添削で改善された文は58文。特に時制の使い分けが最も成長した分野です。',
  },
};
