// 日付関連のユーティリティ関数

/**
 * 日付文字列をフォーマットする（先頭の0を削除）
 * @param dateString YYYY-MM-DD形式の日付文字列
 * @param separator 区切り文字（デフォルト: '/'）
 * @returns YYYY/M/D形式の日付文字列
 */
export const formatDate = (dateString: string, separator: string = '/'): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${year}${separator}${parseInt(month, 10)}${separator}${parseInt(day, 10)}`;
};

/**
 * 年月を取得する（先頭の0を削除）
 * @param date Date オブジェクト
 * @returns { year: number, month: number }
 */
export const getYearMonth = (date: Date): { year: number; month: number } => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
};
