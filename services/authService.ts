import { supabase } from './supabase';

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

  // サインアウト
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
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
