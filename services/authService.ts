import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabase';

// OAuth認証完了時に必要（iOSで必要）
WebBrowser.maybeCompleteAuthSession();

// Redirect URL for OAuth callback
const redirectUrl = 'rediary://auth/callback';

export class AuthService {
  // メールアドレスでサインアップ
  static async signUpWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  }

  // メールアドレスでサインイン
  static async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  // Googleでサインイン
  static async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (!data?.url) {
        throw new Error('OAuth URLが取得できませんでした');
      }

      // WebBrowserでOAuthフローを処理
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (result.type === 'success' && result.url) {
        // URLのハッシュフラグメントからトークンを抽出（Supabaseの標準形式）
        const url = new URL(result.url);
        const hashParams = new URLSearchParams(url.hash.slice(1));

        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          // セッションを設定
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) throw sessionError;
          return { data, error: null };
        } else {
          throw new Error('認証トークンが取得できませんでした');
        }
      } else if (result.type === 'cancel') {
        return { data: null, error: new Error('認証がキャンセルされました') };
      } else if (result.type === 'dismiss' || result.type === 'locked') {
        return { data: null, error: new Error('認証が中断されました') };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { data: null, error };
    }
  }

  // サインアウト
  static async signOut() {
    try {
      // 現在のセッションを確認
      const { data: sessionData } = await supabase.auth.getSession();

      // セッションが存在する場合のみログアウトAPIを呼び出す
      if (sessionData?.session) {
        const { error } = await supabase.auth.signOut();
        // session_not_foundエラーは無視（既にログアウト済み）
        if (error && !error.message?.includes('session_not_found')) {
          console.error('Sign out error:', error);
          return { error };
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Sign out failed:', error);
      // エラーがあってもローカル状態はクリアされるべきなのでnullを返す
      return { error: null };
    }
  }

  // 現在のセッションを取得
  static async getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  }

  // 認証状態の変更を監視
  static onAuthStateChange(callback: (session: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  }
}
