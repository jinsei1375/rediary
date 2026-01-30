/**
 * 認証エラーのハンドリングユーティリティ
 */
export const handleAuthError = (error: any, onError: (message: string) => void) => {
  const message = error?.message || '';

  // キャンセルは無視（ユーザーの意図的な操作）
  if (message.includes('認証がキャンセルされました') || message.includes('認証が中断されました')) {
    return;
  }

  // エラーメッセージを取得して表示
  onError(getAuthErrorMessage(error));
};

const getAuthErrorMessage = (error: any): string => {
  const message = error?.message || '';

  if (message.includes('Apple認証はiOSでのみ利用可能です')) {
    return 'Apple認証はiOSでのみ利用可能です';
  }
  if (message.includes('このデバイスではApple認証が利用できません')) {
    return 'このデバイスではApple認証が利用できません（iOS 13以降が必要です）';
  }
  if (message.includes('OAuth URLが取得できませんでした')) {
    return 'Google認証の準備に失敗しました。もう一度お試しください';
  }
  if (message.includes('認証トークンが取得できませんでした')) {
    return 'Google認証に失敗しました。もう一度お試しください';
  }
  if (message.includes('認証が完了しませんでした')) {
    return 'Google認証が完了しませんでした。もう一度お試しください';
  }
  if (message.includes('端末がロックされているため認証できませんでした')) {
    return '端末がロックされているため認証できませんでした';
  }
  if (message.includes('Network request failed')) {
    return 'ネットワークエラーが発生しました。接続を確認してください';
  }

  return 'エラーが発生しました。もう一度お試しください';
};
