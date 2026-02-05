/**
 * 運営者・お問い合わせ情報
 */
export const CONTACT = {
  /** お問い合わせメールアドレス */
  EMAIL: 'jinsei.edit@gmail.com',
  /** お問い合わせ件名（デフォルト） */
  EMAIL_SUBJECT: 'ReDiaryお問い合わせ',
} as const;

/**
 * メールアドレスのmailtoリンクを生成
 */
export function getContactMailtoLink(subject?: string): string {
  const emailSubject = subject || CONTACT.EMAIL_SUBJECT;
  return `mailto:${CONTACT.EMAIL}?subject=${encodeURIComponent(emailSubject)}`;
}
