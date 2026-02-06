import { Language } from '@/types/database';

/**
 * 各言語の文字範囲定義
 */
const LANGUAGE_PATTERNS: Record<Language, RegExp> = {
  [Language.JA]: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/, // ひらがな、カタカナ、漢字
  [Language.EN]: /[a-zA-Z]/, // 英語アルファベット
  // [Language.ID]: /[a-zA-Z]/, // インドネシア語（アルファベット使用）
  // [Language.FR]: /[a-zA-ZÀ-ÿ]/, // フランス語（アクセント付き文字含む）
  // [Language.ZH]: /[\u4E00-\u9FFF]/, // 中国語（簡体字・繁体字）
  // [Language.KO]: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/, // 韓国語（ハングル）
};

/**
 * 言語の優先順位（特徴的な文字セットを持つ言語を優先）
 */
const DETECTION_PRIORITY: Language[] = [
  Language.JA, // 日本語（ひらがな、カタカナ、漢字）
  // Language.ZH,  // 中国語（漢字）
  // Language.KO,  // 韓国語（ハングル）
  // Language.FR,  // フランス語（アクセント記号）
  Language.EN, // 英語
  // Language.ID,  // インドネシア語
];

/**
 * テキストに含まれる主要な言語を検出
 * 優先順位に従って、最初にマッチした言語を返す
 */
export function detectLanguage(text: string): Language | null {
  if (!text.trim()) return null;

  // 優先順位に従って言語を検出
  for (const lang of DETECTION_PRIORITY) {
    const pattern = LANGUAGE_PATTERNS[lang];
    if (pattern && pattern.test(text)) {
      return lang;
    }
  }

  return null;
}

/**
 * ターゲット言語と実際の入力言語が異なるかチェック
 */
export function isLanguageMismatch(targetLanguage: Language, inputText: string): boolean {
  const detectedLanguage = detectLanguage(inputText);

  if (!detectedLanguage) return false;

  return detectedLanguage !== targetLanguage;
}
