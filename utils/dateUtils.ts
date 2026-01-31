// 日付関連のユーティリティ関数

/**
 * ローカルタイムゾーンで今日の日付を YYYY-MM-DD 形式で取得
 * @returns YYYY-MM-DD形式の日付文字列
 */
export const getTodayString = (): string => {
  const today = new Date();
  return formatDateToString(today);
};

/**
 * Date オブジェクトを YYYY-MM-DD 形式の文字列に変換（ローカルタイムゾーン）
 * @param date Date オブジェクト
 * @returns YYYY-MM-DD形式の日付文字列
 */
export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
