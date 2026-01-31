import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { supabase } from './supabase';

// WebBrowserを認証セッションに使用する準備（iOSで必要）
WebBrowser.maybeCompleteAuthSession();

// OAuthコールバック用のリダイレクトURL
const redirectUrl = 'rediary://auth/callback';

export class AuthService {
  // メールアドレスでサインアップ
  // リリース時にはメール確認が必要になる
  static async signUpWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
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

  // Appleでサインイン（iOS 13以降のみ）
  static async signInWithApple() {
    try {
      // iOS以外では使用不可
      if (Platform.OS !== 'ios') {
        throw new Error('Apple認証はiOSでのみ利用可能です');
      }

      // Apple認証が利用可能かチェック
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('このデバイスではApple認証が利用できません');
      }

      // ノンス（一度だけ使用されるランダムな文字列）を生成
      const nonce = Math.random().toString(36).substring(2, 10);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce
      );

      // Apple認証フローを開始
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      // Supabaseに認証情報を送信
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken!,
        nonce,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        return { data: null, error: new Error('認証がキャンセルされました') };
      }
      console.error('Apple sign-in error:', error);
      return { data: null, error };
    }
  }

  // Googleでサインイン
  static async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
          queryParams: {
            prompt: 'select_account',
          },
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
      } else if (result.type === 'dismiss') {
        return { data: null, error: new Error('認証が中断されました') };
      } else if (result.type === 'locked') {
        return { data: null, error: new Error('端末がロックされているため認証できませんでした') };
      }

      // OPENED タイプなど、その他のケース
      return { data: null, error: new Error('認証が完了しませんでした') };
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

  // アカウント削除
  // 注意: Supabase の RLS（Row Level Security）とカスケード削除により、
  // 関連する全てのデータ（diary_entries, ai_corrections, translation_exercises等）が自動削除されます
  static async deleteAccount() {
    try {
      // 現在のユーザーを取得
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error('ユーザー情報の取得に失敗しました');
      }

      // Supabase Admin APIを使用してユーザーを削除
      // 注意: この操作は取り消せません
      const { error } = await supabase.rpc('delete_user');

      if (error) {
        console.error('Delete account error:', error);
        throw error;
      }

      // ローカルセッションをクリア
      await supabase.auth.signOut();

      return { error: null };
    } catch (error) {
      console.error('Account deletion failed:', error);
      return { error };
    }
  }
}
