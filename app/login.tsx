import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const getErrorMessage = (error: any): string => {
    const message = error?.message || '';

    if (message.includes('Invalid login credentials')) {
      return 'メールアドレスまたはパスワードが正しくありません';
    }
    if (message.includes('Email not confirmed')) {
      return 'メールアドレスが確認されていません。確認メールをご確認ください';
    }
    if (message.includes('User already registered')) {
      return 'このメールアドレスは既に登録されています';
    }
    if (message.includes('Password should be at least')) {
      return 'パスワードは6文字以上で設定してください';
    }
    if (message.includes('Invalid email')) {
      return 'メールアドレスの形式が正しくありません';
    }
    if (message.includes('Network request failed')) {
      return 'ネットワークエラーが発生しました。接続を確認してください';
    }

    return 'エラーが発生しました。もう一度お試しください';
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('エラー', 'メールアドレスとパスワードを入力してください');
      return;
    }

    setLoading(true);
    const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('エラー', getErrorMessage(error));
    } else if (isSignUp) {
      Alert.alert(
        '確認メールを送信しました',
        'メールに記載されたリンクをクリックして、アカウントを有効化してください',
        [{ text: 'OK', onPress: () => setIsSignUp(false) }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Rediary</Text>
        <Text style={styles.subtitle}>日記で学ぶ言語学習アプリ</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="メールアドレス"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="パスワード"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleEmailAuth} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{isSignUp ? '新規登録' : 'ログイン'}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.switchText}>
              {isSignUp
                ? 'アカウントをお持ちの方はログイン'
                : 'アカウントをお持ちでない方は新規登録'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 48,
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText: {
    textAlign: 'center',
    color: '#007AFF',
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
