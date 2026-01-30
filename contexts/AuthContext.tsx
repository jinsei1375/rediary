import { AuthService } from '@/services/authService';
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithApple: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 初期セッションを取得
    AuthService.getSession().then(({ data, error }) => {
      if (error) {
        // セッション検証エラー（ユーザーが削除された等）
        console.error('Session validation error:', error);
        setSession(null);
        setUser(null);
      } else {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
      setLoading(false);
    });

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = AuthService.onAuthStateChange((session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    return AuthService.signInWithEmail(email, password);
  };

  const signUp = async (email: string, password: string) => {
    return AuthService.signUpWithEmail(email, password);
  };

  const signInWithGoogle = async () => {
    return AuthService.signInWithGoogle();
  };

  const signInWithApple = async () => {
    return AuthService.signInWithApple();
  };

  const signOut = async () => {
    // ローカル状態を先にクリア（UIがすぐに反応する）
    setSession(null);
    setUser(null);

    // バックグラウンドでSupabaseのセッションをクリア
    await AuthService.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ session, user, loading, signIn, signUp, signInWithGoogle, signInWithApple, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
