/**
 * 言語コードから言語名を取得
 */
export const getLanguageName = (languageCode: string): string => {
  switch (languageCode) {
    case 'ja':
      return '日本語';
    case 'en':
      return '英語';
    case 'id':
      return 'インドネシア語';
    case 'fr':
      return 'フランス語';
    case 'zh':
      return '中国語';
    case 'ko':
      return '韓国語';
    default:
      return languageCode;
  }
};

/**
 * 言語コードから指示テキストを取得
 */
export const getLanguageInstructionText = (languageCode: string): string => {
  const languageName = getLanguageName(languageCode);
  return `${languageName}で表現してください`;
};

/**
 * 言語コードから表現ラベルを取得
 */
export const getLanguageExpressionLabel = (languageCode: string): string => {
  const languageName = getLanguageName(languageCode);
  return `${languageName}表現`;
};

/**
 * 言語コードから「元の文章」ラベルを取得
 */
export const getOriginalTextLabel = (languageCode: string): string => {
  const languageName = getLanguageName(languageCode);
  return `${languageName}（元の文章）`;
};
